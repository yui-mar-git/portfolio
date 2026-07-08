import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare(),
  site: process.env.CF_PAGES ? 'https://portfolio-5ey.pages.dev' : 'https://yui-mar-git.github.io',
  // Cloudflare Pages 環境またはローカル開発環境ではルート(/)、GitHub Pagesでは /portfolio にする
  base: process.env.CF_PAGES || process.env.NODE_ENV === 'development' ? '/' : '/portfolio',
});
