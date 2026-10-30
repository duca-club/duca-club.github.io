import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
after(() => server.close());
const { buildStructuredData, serializeStructuredData } = await server.ssrLoadModule('/src/lib/structured-data.ts');
const { siteConfig } = await server.ssrLoadModule('/src/data/site.ts');

const pageInput = {
  canonical: 'https://duca.au/about/?utm_source=example#details',
  title: 'About Us — DUCA',
  description: 'Our student-led cybersecurity community.',
  image: { src: '/social-preview-image.png', alt: 'DUCA logo', width: 944, height: 944, type: 'image/png' },
  breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about/' }],
};

function node(data, type) {
  return data['@graph'].find(item => item['@type'] === type);
}

test('site identity and page references use stable canonical IDs without tracking or fragments', () => {
  const data = buildStructuredData(pageInput);
  const organization = node(data, 'Organization');
  const website = node(data, 'WebSite');
  const page = node(data, 'WebPage');
  const image = node(data, 'ImageObject');
  assert.equal(organization.name, siteConfig.fullName);
  assert.equal(organization.alternateName, siteConfig.name);
  assert.equal(organization['@id'], 'https://duca.au/#organization');
  assert.equal(organization.logo.url, 'https://duca.au/duca.png');
  assert.equal(website.publisher['@id'], organization['@id']);
  assert.equal(page.url, 'https://duca.au/about/');
  assert.equal(page['@id'], 'https://duca.au/about/#webpage');
  assert.equal(page.isPartOf['@id'], website['@id']);
  assert.equal(page.primaryImageOfPage['@id'], image['@id']);
  assert.equal(image.url, 'https://duca.au/social-preview-image.png');
  assert.equal(image.width, 944);
  assert.equal(image.height, 944);
  assert.equal(image.encodingFormat, 'image/png');
  const breadcrumbs = node(data, 'BreadcrumbList');
  assert.equal(page.breadcrumb['@id'], breadcrumbs['@id']);
  assert.deepEqual(breadcrumbs.itemListElement.map(({ position, name, item }) => ({ position, name, item })), [
    { position: 1, name: 'Home', item: 'https://duca.au/' },
    { position: 2, name: 'About Us', item: 'https://duca.au/about/' },
  ]);
  assert.equal(node(data, 'BlogPosting'), undefined);
  assert.equal(organization.aggregateRating, undefined);
  assert.equal(organization.foundingDate, undefined);
});

test('articles describe the real byline, publication date, cover and reading path', () => {
  const data = buildStructuredData({
    ...pageInput,
    canonical: new URL('https://duca.au/blog/example/'),
    article: true,
    headline: 'A hands-on workshop',
    author: 'A Real Writer',
    authorUrl: 'https://www.linkedin.com/in/real-writer/',
    publishedTime: '2026-10-01T10:00:00+10:00',
    tags: ['Workshop', 'Cybersecurity', 'Workshop', ' '],
    breadcrumbs: undefined,
  });
  const article = node(data, 'BlogPosting');
  const page = node(data, 'WebPage');
  assert.equal(article.headline, 'A hands-on workshop');
  assert.equal(article.datePublished, '2026-10-01T10:00:00+10:00');
  assert.equal(article.dateModified, undefined);
  assert.deepEqual(article.author, { '@type': 'Person', name: 'A Real Writer', url: 'https://www.linkedin.com/in/real-writer/' });
  assert.deepEqual(article.keywords, ['Workshop', 'Cybersecurity']);
  assert.equal(article.publisher['@id'], node(data, 'Organization')['@id']);
  assert.equal(article.mainEntityOfPage['@id'], page['@id']);
  assert.equal(page.mainEntity['@id'], article['@id']);
  assert.equal(article.image['@id'], node(data, 'ImageObject')['@id']);
  assert.deepEqual(node(data, 'BreadcrumbList').itemListElement.map(item => item.name), ['Home', 'Blog', 'A hands-on workshop']);
});

test('unknown optional article details stay absent and private profiles are not invented', () => {
  const data = buildStructuredData({
    canonical: '/blog/example/', title: 'Example', description: 'Example post.', article: true,
    author: 'Guest Writer', authorUrl: 'javascript:alert(1)',
  });
  const article = node(data, 'BlogPosting');
  assert.deepEqual(article.author, { '@type': 'Person', name: 'Guest Writer' });
  for (const key of ['datePublished', 'dateModified', 'image', 'keywords']) assert.equal(article[key], undefined);
  assert.equal(node(data, 'ImageObject'), undefined);
  const collective = buildStructuredData({ ...pageInput, article: true, author: 'DUCA Team' });
  assert.deepEqual(node(collective, 'BlogPosting').author, { '@id': node(collective, 'Organization')['@id'] });
});

test('homepages do not get a one-item breadcrumb and noindex pages omit the graph', () => {
  const home = buildStructuredData({ ...pageInput, canonical: '/', breadcrumbs: [] });
  assert.equal(node(home, 'BreadcrumbList'), undefined);
  assert.equal(buildStructuredData({ ...pageInput, noIndex: true }), null);
});

test('JSON-LD serialization cannot end its script element and round-trips page text', () => {
  const title = 'A </script><script>alert("x")</script> title\u2028with\u2029separators';
  const data = buildStructuredData({ ...pageInput, title });
  const serialized = serializeStructuredData(data);
  assert.equal(serialized.includes('<'), false);
  assert.equal(serialized.includes('\u2028'), false);
  assert.equal(serialized.includes('\u2029'), false);
  assert.deepEqual(JSON.parse(serialized), data);
  assert.equal(node(JSON.parse(serialized), 'WebPage').name, title);
});
