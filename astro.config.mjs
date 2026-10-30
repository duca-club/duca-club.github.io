import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import rehypeContentIcons from './src/lib/rehype-content-icons.mjs';

export default defineConfig({
  site: 'https://duca.au',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  markdown: {
    processor: unified({ rehypePlugins: [rehypeContentIcons] }),
  },
});
