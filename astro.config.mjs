import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import rehypeContentIcons from './src/lib/rehype-content-icons.mjs';
import { siteConfig } from './src/data/site.ts';

export default defineConfig({
  site: siteConfig.url,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  markdown: {
    processor: unified({ rehypePlugins: [rehypeContentIcons] }),
  },
});
