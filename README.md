# portfolio

# Portfolio

Webメディア業界からの転職活動用ポートフォリオサイトです。
段階的に技術スタックを進化させながら制作しています。

## 🌐 公開URL

| バージョン | URL | 技術スタック |
|---|---|---|
| v1 静的版 | https://yui-mar-git.github.io/portfolio/ | HTML / CSS / JavaScript |
| v1.5 CMS連携版 | https://portfolio-5ey.pages.dev/ | + Cloudflare Pages / microCMS |
| v2 SSG版（制作中） | 準備中 | + Astro / TypeScript |

## 🛠 技術スタック

### フロントエンド
- HTML / CSS / JavaScript
- Astro（移行中）
- TypeScript（移行中）

### インフラ・ホスティング
- GitHub Pages（v1）
- Cloudflare Pages（v1.5以降）

### CMS
- microCMS（ヘッドレスCMS）

### 開発環境
- Google Antigravity（AIエージェント）
- GitHub Copilot

## 📁 ブランチ構成

| ブランチ | 内容 |
|---|---|
| `main` | 最新の開発版 |
| `v1-static` | 静的HTMLのみの初期版 |
| `v1.5-microcms` | microCMS連携版 |

## 📄 ページ構成

- `/` トップページ
- `/profile` プロフィール・資格・スキル
- `/portfolio` 制作実績
- `/credits` 使用素材
- `/contact` お問い合わせ

## 🔒 セキュリティ

microCMSのAPIキーはCloudflare Pagesの環境変数で管理し、
ブラウザへの露出を防いでいます。
