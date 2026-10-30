import type { APIRoute } from 'astro';
import { siteConfig } from '../data/site';
import { createRobots } from '../lib/sitemap';

export const GET: APIRoute = () => new Response(createRobots(siteConfig.url), {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
