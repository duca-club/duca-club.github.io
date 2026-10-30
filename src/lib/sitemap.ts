function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character]!);
}

export function createSitemap(siteUrl: string, paths: readonly string[]): string {
  const site = new URL(siteUrl);
  const urls = new Set(paths.map(path => {
    const url = new URL(path, site);
    if (url.origin !== site.origin) {
      throw new Error(`Sitemap URLs must belong to ${site.origin}: ${path}`);
    }
    url.search = '';
    url.hash = '';
    return url.href;
  }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls].map(url => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>
`;
}

export function createRobots(siteUrl: string): string {
  return `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', siteUrl).href}
`;
}
