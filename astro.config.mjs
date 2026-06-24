import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: process.env.CF_PAGES ? 'https://portfolio-5ey.pages.dev' : 'https://yui-mar-git.github.io',
  // Cloudflare Pages 環境またはローカル開発環境ではルート(/)、GitHub Pagesでは /portfolio にする
  base: process.env.CF_PAGES || process.env.NODE_ENV === 'development' ? '/' : '/portfolio',
});
