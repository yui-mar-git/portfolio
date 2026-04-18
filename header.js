/**
 * 共通ヘッダーコンポーネント
 * 全ページで同じヘッダーを生成し、現在のページのナビリンクをハイライトする。
 * SP版ではハンバーガーメニュー（アコーディオン）として動作する。
 */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (!header) return;

  // ページの階層を判定してパスのプレフィックスを決定
  const depth = header.getAttribute('data-depth') || '0';
  const prefix = depth === '0' ? '' : '../'.repeat(Number(depth));

  // ナビゲーションのリンク定義
  const navLinks = [
    { href: `${prefix}profile/index.html`, label: '私について', id: 'profile' },
    { href: `${prefix}portfolio/index.html`, label: '制作実績', id: 'portfolio' },
    { href: `${prefix}contact/index.html`, label: 'お問い合わせ', id: 'contact' },
  ];

  // 現在のページのbody idを取得
  const currentPageId = document.body.id;
  // thanksページはcontactの子ページなのでcontactをアクティブに
  const activeId = currentPageId === 'thanks' ? 'contact' : currentPageId;

  // ナビリンクのHTMLを生成
  const navHTML = navLinks
    .map(link => {
      const activeClass = link.id === activeId ? ' class="active"' : '';
      return `<li><a href="${link.href}"${activeClass}>${link.label}</a></li>`;
    })
    .join('\n            ');

  // ヘッダー全体のHTMLを生成
  header.innerHTML = `
    <div class="container header-container">
      <div class="logo"><a href="${prefix}index.html">Portfolio.</a></div>
      <button class="hamburger" id="hamburger" aria-label="メニューを開く" aria-expanded="false">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
      <nav id="global-nav">
        <ul>
            ${navHTML}
        </ul>
      </nav>
    </div>
  `;

  // ハンバーガーメニューの開閉
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('global-nav');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // ナビリンクをクリックしたらメニューを閉じる（SP版）
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
});
