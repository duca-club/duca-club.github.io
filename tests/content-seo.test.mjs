import test from 'node:test';
import assert from 'node:assert/strict';
import { unified } from '@astrojs/markdown-remark';
import rehypeContentSeo from '../src/lib/rehype-content-seo.mjs';
import remarkBlogCover from '../src/lib/remark-blog-cover.mjs';

const postURL = new URL('../src/content/blog/2026-07-18-speedrunning-cyber/index.md', import.meta.url);
const smallImagePostURL = new URL('../src/content/blog/2025-03-02-thank-you-for-supporting-duca-at-oweek/index.md', import.meta.url);
const renderer = await unified({ rehypePlugins: [rehypeContentSeo] }).createRenderer({ syntaxHighlight: false });
const render = (body, frontmatter = { title: 'Existing article title' }, fileURL = postURL) =>
  renderer.render(body, { frontmatter, fileURL });

function imageOptions(code) {
  return [...code.matchAll(/__ASTRO_IMAGE_="([^"]+)"/g)]
    .map(([, value]) => JSON.parse(value.replace(/&#x22;/g, '"')));
}

test('passes downsized responsive WebP options through the native Astro Markdown image pipeline', async () => {
  const [image] = imageOptions((await render('![Photograph description](image.png)')).code);
  assert.equal(image.src, 'image.png');
  assert.equal(image.width, 1600);
  assert.equal(image.height, 760);
  assert.equal(image.format, 'webp');
  assert.equal(image.quality, 85);
  assert.equal(image.loading, 'lazy');
  assert.equal(image.decoding, 'async');
  assert.deepEqual(image.widths, [400, 800, 1200, 1600]);
  assert.equal(image.sizes, '(min-width: 820px) 772px, calc(100vw - 48px)');
});

test('keeps smaller images at their original dimensions instead of enlarging them', async () => {
  const [image] = imageOptions((await render('![Photograph](image-1.png)', {}, smallImagePostURL)).code);
  assert.equal(image.width, 910);
  assert.equal(image.height, 608);
  assert.deepEqual(image.widths, [400, 800, 910]);
});

test('replaces only placeholder alts with existing title or nearest section context', async () => {
  const result = await render('![alt text](image.png)\n\n#### Careers in **cyber**\n\n![ ALT TEXT ](image.png)\n\n![An authored description](image.png)\n\n![](image.png)');
  const images = imageOptions(result.code);
  assert.deepEqual(images.map(image => image.alt), [
    'Image accompanying: Existing article title',
    'Image accompanying: Careers in cyber',
    'An authored description',
    '',
  ]);
});

test('normalizes sparse heading hierarchies while preserving text, IDs and original styling levels', async () => {
  const result = await render('#### First section\n\n###### Child\n\n#### Next section\n\n## Parent\n\n### Nested');
  assert.deepEqual(result.metadata.headings.map(({ depth, slug }) => [depth, slug]), [
    [2, 'first-section'], [3, 'child'], [2, 'next-section'], [2, 'parent'], [3, 'nested'],
  ]);
  assert.match(result.code, /<h2 data-content-heading-level="4" id="first-section">First section<\/h2>/);
  assert.match(result.code, /<h3 data-content-heading-level="6" id="child">Child<\/h3>/);
  assert.match(result.code, /<h2 data-content-heading-level="2" id="parent">Parent<\/h2>/);
});

test('does not change non-blog documents or attempt to import remote and public image URLs', async () => {
  const eventURL = new URL('../src/content/events/example.md', import.meta.url);
  const untouched = await render('#### Existing heading\n\n![alt text](image.png)', {}, eventURL);
  assert.match(untouched.code, /<h4 id="existing-heading">/);
  assert.equal(imageOptions(untouched.code)[0].alt, 'alt text');
  assert.equal(imageOptions(untouched.code)[0].format, undefined);

  const result = await render('![Written description](https://example.com/photo.jpg)\n\n![alt text](/events/photo.png)');
  assert.deepEqual(imageOptions(result.code), []);
  assert.match(result.code, /src="https:\/\/example.com\/photo.jpg" alt="Written description" loading="lazy" decoding="async"/);
  assert.match(result.code, /src="\/events\/photo.png" alt="Image accompanying: Existing article title"/);
});

test('works after duplicate-cover removal without restoring the removed image', async () => {
  const combined = await unified({ remarkPlugins: [remarkBlogCover], rehypePlugins: [rehypeContentSeo] })
    .createRenderer({ syntaxHighlight: false });
  const result = await combined.render('![alt text](image.png)\n\nArticle text.\n\n![Body photo](../2025-03-02-thank-you-for-supporting-duca-at-oweek/image-1.png)', {
    frontmatter: { title: 'Article title', featuredImage: './image.png' }, fileURL: postURL,
  });
  assert.equal(imageOptions(result.code).length, 1);
  assert.equal(imageOptions(result.code)[0].alt, 'Body photo');
  assert.equal(imageOptions(result.code)[0].format, 'webp');
  assert.match(result.code, /Article text\./);
});
