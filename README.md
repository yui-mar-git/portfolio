# My Portfolio

Astro と Cloudflare Pages を用いて構築されたモダンなポートフォリオサイトです。
自己紹介やスキルセットの紹介に加えて、Vanilla JavaScript で実装された複数の本格的なWebミニゲーム（ローグライク、タワーディフェンスなど）をブラウザ上でプレイすることができます。

## 🌐 公開URL

- **本番環境:** https://portfolio-5ey.pages.dev/

## 🛠 技術スタック

### フロントエンド
- **フレームワーク:** Astro
- **言語:** TypeScript / HTML / CSS / Vanilla JavaScript
- **セキュリティ・フォーム:** Cloudflare Turnstile (SSR連携によるボット対策)

### バックエンド / インフラ
- **ホスティング・サーバーレス:** Cloudflare Pages (SSR対応・アダプター利用)
- **CMS:** microCMS (ヘッドレスCMSとして実績やゲームデータの管理に利用)

### 開発環境・ツール
- **AIエージェント・支援:** Google Antigravity / GitHub Copilot

## 🎮 収録ゲーム

ポートフォリオ内で以下のブラウザゲームが遊べます。
1. **ローグライクカードゲーム** - デッキを構築しながらダンジョンを進む本格派カードバトル
2. **タワーディフェンス** - ユニットを配置して拠点を防衛するストラテジーゲーム
3. **ランアクション** - ジャンプと魔法で敵を倒しながら進む横スクロールアクション
4. **スコアアタックミニゲーム** - 動く的をタップするカジュアルゲーム

## 📁 ブランチ構成

| ブランチ | 内容 |
|---|---|
| `main` | 最新の開発版（Astro + Cloudflare Pages SSR） |
| `v1.5-microcms` | 旧版: 静的HTML + microCMS連携 |
| `v1-static` | 旧版: 静的HTMLのみの初期版 |

## 📄 ページ構成

- `/` - トップページ
- `/profile` - 自己紹介・資格・スキル
- `/portfolio` - 制作実績・ゲーム一覧
  - `/portfolio/roguelike`
  - `/portfolio/tower-defense`
  - `/portfolio/run-action`
  - `/portfolio/minigame`
- `/contact` - お問い合わせ
- `/credits` - 使用素材・クレジット表記

## 🔒 セキュリティ

- Cloudflare Turnstileによるボット保護（お問い合わせフォーム）
- APIキーなどの環境変数はCloudflare Pagesの環境変数管理機能を使用し、セキュアに運用
