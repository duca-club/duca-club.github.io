import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
after(() => server.close());
const { createSitemap, createRobots } = await server.ssrLoadModule('/src/lib/sitemap.ts');

test('sitemap includes only unique canonical URLs on the configured production origin', () => {
  const xml = createSitemap('https://duca.au', [
    '/', '/blog/', '/blog/?tag=Workshop', '/blog/#archive', '/blog/page/2/',
  ]);
  assert.equal((xml.match(/<loc>/g) ?? []).length, 3);
  assert.ok(xml.includes('<loc>https://duca.au/</loc>'));
  assert.ok(xml.includes('<loc>https://duca.au/blog/</loc>'));
  assert.ok(xml.includes('<loc>https://duca.au/blog/page/2/</loc>'));
  assert.ok(!xml.includes('<lastmod>'), 'Do not invent dates for pages without modification dates.');
  assert.throws(() => createSitemap('https://duca.au', ['https://example.com/']), /must belong to https:\/\/duca\.au/);
});

test('sitemap escapes XML characters while preserving valid URL paths', () => {
  const xml = createSitemap('https://duca.au', ["/blog/security-&-privacy's-future/"]);
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  assert.ok(xml.includes('<loc>https://duca.au/blog/security-&amp;-privacy&apos;s-future/</loc>'));
});

test('robots permits crawling and discovers the sitemap on the configured origin', () => {
  assert.equal(createRobots('https://duca.au'), 'User-agent: *\nAllow: /\n\nSitemap: https://duca.au/sitemap.xml\n');
  assert.ok(createRobots('https://example.org/base/').endsWith('Sitemap: https://example.org/sitemap.xml\n'));
});
