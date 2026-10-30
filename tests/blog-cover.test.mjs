import test from 'node:test';
import assert from 'node:assert/strict';
import { unified } from '@astrojs/markdown-remark';
import remarkBlogCover from '../src/lib/remark-blog-cover.mjs';

const renderer = await unified({ remarkPlugins: [remarkBlogCover] }).createRenderer({ syntaxHighlight: false });
const postURL = new URL('../src/content/blog/2026-07-18-speedrunning-cyber/index.md', import.meta.url);
const render = (body, frontmatter = { featuredImage: './image.png' }, fileURL = postURL) =>
  renderer.render(body, { frontmatter, fileURL });

test('omits a repeated cover before Astro collects body images, keeping other photos and text', async () => {
  const result = await render('![Cover](image.png)\n\nIntro text.\n\n![Different photo](image-1.png)');
  assert.equal((result.code.match(/<img\b/g) ?? []).length, 1);
  assert.doesNotMatch(result.code, /Cover/);
  assert.match(result.code, /Intro text\./);
  assert.match(result.code, /Different photo/);
  assert.deepEqual(result.metadata.localImagePaths, ['image-1.png']);
});

test('keeps a different first image and any later use of the cover', async () => {
  const result = await render('![Different photo](image-1.png)\n\n![Cover later](image.png)');
  assert.equal((result.code.match(/<img\b/g) ?? []).length, 2);
  assert.deepEqual(result.metadata.localImagePaths, ['image-1.png', 'image.png']);
});

test('matches normalized local paths after introductory text and preserves a caption', async () => {
  const result = await render('Intro text.\n\n![Cover](photos/../image.png) Caption text.');
  assert.doesNotMatch(result.code, /<img\b/);
  assert.match(result.code, /Intro text\./);
  assert.match(result.code, /Caption text\./);
});

test('resolves reference images and removes empty linked-image wrappers', async () => {
  const result = await render('[![Cover][photo]](https://example.com/)\n\n[photo]: ./image.png\n\nArticle text.');
  assert.doesNotMatch(result.code, /<img\b|<a\b|<p>\s*<\/p>/);
  assert.match(result.code, /Article text\./);
});

test('preserves images when there is no rendered local cover or the document is not a blog post', async () => {
  const body = '![Cover](image.png)';
  for (const frontmatter of [{}, { featuredImage: 'missing.png' }, { featuredImage: './%69mage.png' }, { featuredImage: '/cover.png' }, { featuredImage: 'https://example.com/cover.png' }]) {
    assert.match((await render(body, frontmatter)).code, /<img\b/);
  }
  const eventURL = new URL('../src/content/events/example.md', import.meta.url);
  assert.match((await render(body, { featuredImage: './image.png' }, eventURL)).code, /<img\b/);
});

test('keeps a later Markdown image when raw HTML supplies the first body image', async () => {
  const result = await render('<img src="another.png" alt="HTML photo">\n\n![Cover later](image.png)');
  assert.equal((result.code.match(/<img\b/g) ?? []).length, 2);
});
