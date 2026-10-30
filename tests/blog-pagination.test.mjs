import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
after(() => server.close());
const { getBlogPageCount, getBlogPageUrl, getLegacyBlogPages } = await server.ssrLoadModule('/src/lib/blog-pagination.ts');

test('archive counts account for the separately featured post and exact page boundaries', () => {
  for (const [posts, pages] of [[0, 1], [1, 1], [13, 1], [14, 2], [15, 2], [25, 2], [26, 3]]) {
    assert.equal(getBlogPageCount(posts), pages);
  }
});

test('archive URLs are canonical and never duplicate page one', () => {
  assert.equal(getBlogPageUrl(0), '/blog/');
  assert.equal(getBlogPageUrl(1), '/blog/page/2/');
  assert.throws(() => getBlogPageUrl(-1));
  assert.throws(() => getBlogPageUrl(1.5));
});

test('legacy six-post archive URLs map to available twelve-post archives', () => {
  assert.deepEqual(getLegacyBlogPages(15), [
    { slug: '1', redirect: '/blog/' },
    { slug: '2', redirect: '/blog/' },
    { slug: '3', redirect: '/blog/page/2/' },
  ]);
  for (const total of [0, 1, 6, 12, 13, 14, 30, 100]) {
    const valid = new Set(Array.from({ length: getBlogPageCount(total) }, (_, index) => getBlogPageUrl(index)));
    assert.ok(getLegacyBlogPages(total).every(page => valid.has(page.redirect)));
  }
});
