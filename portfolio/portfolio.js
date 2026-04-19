/**
 * MicroCMSから制作物一覧を取得して反映する
 */
document.addEventListener('DOMContentLoaded', async () => {
  const projectGrid = document.getElementById('project-grid');

  if (typeof CONFIG === 'undefined') {
    console.error('Configuration (env.js) is missing.');
    return;
  }

  // headers の定義を削除

  try {
    const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.PORTFOLIO}&limit=100`);
    if (!response.ok) throw new Error('Portfolio API failed');
    const data = await response.json();

    if (!data.contents || data.contents.length === 0) {
      projectGrid.innerHTML = `
        <p class="empty-message" style="grid-column: 1 / -1; text-align: center; padding: 40px 0; color: var(--text-color-light); font-size: 1.1rem;">
          鋭意制作中です。
        </p>
      `;
      return;
    }

    projectGrid.innerHTML = ''; // クリア

    data.contents.forEach(item => {
      const card = document.createElement('div');
      card.className = 'project-card';

      // サムネイル
      let thumbHTML = '';
      if (item.thumbnail && item.thumbnail.url) {
        thumbHTML = `<img src="${item.thumbnail.url}" alt="${item.title}" class="project-thumbnail">`;
      }

      // タグ
      let tagsHTML = '';
      if (item.tags) {
        tagsHTML = `<div class="project-tags"><span>${item.tags}</span></div>`;
      }

      // リンク
      let linkHTML = '';
      if (item.url) {
        linkHTML = `<a href="${item.url}" target="_blank" rel="noopener noreferrer">詳細を見る →</a>`;
      }

      card.innerHTML = `
        ${thumbHTML}
        <h3>${item.title}</h3>
        ${tagsHTML}
        <p>${item.description}</p>
        ${linkHTML}
      `;
      projectGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Error fetching portfolio:', error);
    projectGrid.innerHTML = '<p class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 20px;">制作物の取得に失敗しました。</p>';
  }
});
