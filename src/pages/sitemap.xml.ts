import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { navigationPages } from '../data/site-content';
import { siteConfig } from '../data/site';
import { getBlogPageCount, getBlogPageUrl } from '../lib/blog-pagination';
import { createSitemap } from '../lib/sitemap';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const archivePages = Array.from(
    { length: getBlogPageCount(posts.length) - 1 },
    (_, index) => getBlogPageUrl(index + 1),
  );
  const paths = [
    ...navigationPages.map(page => page.id === 'home' ? '/' : `/${page.id}/`),
    ...archivePages,
    ...posts.map(post => `/blog/${post.data.slug}/`),
  ];

  return new Response(createSitemap(siteConfig.url, paths), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
