import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import rehypeContentIcons from './src/lib/rehype-content-icons.mjs';
import rehypeContentSeo from './src/lib/rehype-content-seo.mjs';
import remarkBlogCover from './src/lib/remark-blog-cover.mjs';
import { siteConfig } from './src/data/site.ts';

export default defineConfig({
  site: siteConfig.url,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  markdown: {
    processor: unified({ remarkPlugins: [remarkBlogCover], rehypePlugins: [rehypeContentSeo, rehypeContentIcons] }),
  },
});
