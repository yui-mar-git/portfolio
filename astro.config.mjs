import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Cloudflare Pages はビルド時にのみ CF_PAGES_BRANCH を注入する（SSR ランタイムの env には含まれない）。
// そのため本番判定はビルド時に確定させ、定数としてバンドルへ埋め込む。
const isProductionDeploy = process.env.CF_PAGES_BRANCH === 'main';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare(),
  site: process.env.CF_PAGES ? 'https://portfolio-5ey.pages.dev' : 'https://yui-mar-git.github.io',
  // Cloudflare Pages 環境またはローカル開発環境ではルート(/)、GitHub Pagesでは /portfolio にする
  base: process.env.CF_PAGES || process.env.NODE_ENV === 'development' ? '/' : '/portfolio',
  vite: {
    define: {
      __IS_PRODUCTION_DEPLOY__: JSON.stringify(isProductionDeploy),
    },
  },
});
