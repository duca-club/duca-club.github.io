import test from 'node:test';
import assert from 'node:assert/strict';
import { unified } from '@astrojs/markdown-remark';
import rehypeContentIcons from '../src/lib/rehype-content-icons.mjs';

const text = value => ({ type: 'text', value });
const element = (tagName, children, properties = {}) => ({
  type: 'element', tagName, properties, children,
});

test('replaces content glyphs with Lucide SVGs while preserving surrounding words and spaces', () => {
  const tree = { type: 'root', children: [element('p', [text('Hello 🎉\uFE0F DUCA 🐈!')])] };
  rehypeContentIcons()(tree);

  const children = tree.children[0].children;
  assert.deepEqual(children.filter(node => node.type === 'text').map(node => node.value), [
    'Hello ', ' DUCA ', '!',
  ]);
  assert.equal(children.filter(node => node.type === 'raw').length, 2);
  assert.match(children[1].value, /<svg\b[^>]*class="[^"]*lucide-party-popper/);
  assert.match(children[1].value, /class="[^"]*ui-icon content-icon"/);
  assert.match(children[1].value, /role="img" aria-label="Celebration"/);
  assert.match(children[3].value, /lucide-cat/);
});

test('leaves code, literal HTML elements, attributes, and URL text untouched', () => {
  const literal = '🔒 https://example.com/🎉';
  const protectedNodes = ['pre', 'code', 'script', 'style', 'textarea'].map(tagName =>
    element(tagName, [element('span', [text(literal)])]),
  );
  const link = element('a', [text('Join 🎉')], { href: 'https://example.com/🎉', title: '🎉' });
  const image = element('img', [], { src: '/🎉.png', alt: '🎉' });
  const url = text('https://example.com/🎉 mailto:🎉@example.com www.example.com/🎉');
  const tree = { type: 'root', children: [...protectedNodes, link, image, url] };
  const originals = structuredClone(protectedNodes);

  rehypeContentIcons()(tree);

  assert.deepEqual(tree.children.slice(0, protectedNodes.length), originals);
  assert.deepEqual(link.properties, { href: 'https://example.com/🎉', title: '🎉' });
  assert.deepEqual(image.properties, { src: '/🎉.png', alt: '🎉' });
  assert.equal(tree.children.at(-1), url);
  assert.equal(link.children[1].type, 'raw');
});

test('keeps prose punctuation, co-brand names, accented text, and numeric count suffixes', () => {
  const node = text('750+ members · HTB × DUCA — café, résumé… “Welcome!” 100% free.');
  const tree = { type: 'root', children: [node] };
  rehypeContentIcons()(tree);
  assert.equal(tree.children[0], node);
});

test('Astro renders trusted SVG markup and preserves literal code in Markdown', async () => {
  const processor = await unified({
    rehypePlugins: [rehypeContentIcons],
  }).createRenderer({
    syntaxHighlight: false,
  });
  const result = await processor.render('🔒 Security first. 🎉\n\n`🔒 literal`\n\n```text\n🐈 code\n```');

  assert.match(result.code, /<svg\b[^>]*class="[^"]*lucide-lock-keyhole/);
  assert.match(result.code, /aria-hidden="true"/);
  assert.match(result.code, /lucide-party-popper/);
  assert.doesNotMatch(result.code, /&lt;svg/);
  assert.match(result.code, /<code>🔒 literal<\/code>/);
  assert.match(result.code, /<pre><code class="language-text">🐈 code\n<\/code><\/pre>/);
});
