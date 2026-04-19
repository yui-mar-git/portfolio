/**
 * MicroCMS Configuration
 * Cloudflare Pages Functions を経由する構成。
 * APIキーは Cloudflare の環境変数で管理するためここには記述しません。
 */
const CONFIG = {
  BASE_URL: '/api/microcms?endpoint=',
  ENDPOINTS: {
    SETTINGS: 'settings',
    PROFILE: 'profile',
    PORTFOLIO: 'portfolio',
    CREDITS: 'credits'
  }
};
