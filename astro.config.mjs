import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://duca.au',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
});
