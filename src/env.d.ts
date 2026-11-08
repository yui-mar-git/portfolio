/// <reference path="../.astro/types.d.ts" />

/** ビルド時に astro.config.mjs で注入（Cloudflare Pages の本番ブランチ main のビルドのみ true） */
declare const __IS_PRODUCTION_DEPLOY__: boolean;
