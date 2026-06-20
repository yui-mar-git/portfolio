import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://yui-mar-git.github.io', // GitHub Pages用 (必要に応じて変更)
  base: '/portfolio', // リポジトリ名がportfolioの場合
});
