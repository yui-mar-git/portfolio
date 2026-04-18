/**
 * MicroCMSから使用素材一覧を取得して反映する
 */
document.addEventListener('DOMContentLoaded', async () => {
  const categoryConfigs = [
    { id: 'image-credits-body', label: '画像', fullLabel: '画像・イラスト', emptyMsg: '現在、画像・イラストは使用していません。' },
    { id: 'font-credits-body', label: 'フォント', fullLabel: 'フォント', emptyMsg: '現在、フォントは使用していません。' },
    { id: 'se-credits-body', label: 'SE', fullLabel: 'SE・BGM', emptyMsg: '現在、SE・BGMは使用していません。' },
    { id: 'icon-credits-body', label: 'アイコン', fullLabel: 'アイコン', emptyMsg: '現在、アイコンは使用していません。' }
  ];

  if (typeof CONFIG === 'undefined') {
    console.error('Configuration (env.js) is missing.');
    return;
  }

  const headers = {
    'X-MICROCMS-API-KEY': CONFIG.MICROCMS_API_KEY
  };

  try {
    const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.CREDITS}`, { headers });
    if (!response.ok) throw new Error('Credits API failed');
    const data = await response.json();

    const contents = data.contents || [];

    categoryConfigs.forEach(config => {
      const tbody = document.getElementById(config.id);
      if (!tbody) return;

      // カテゴリ一致するものを抽出 (配列・文字列両対応、部分一致も考慮)
      const items = contents.filter(item => {
        const cat = Array.isArray(item.category) ? item.category[0] : item.category;
        if (!cat) return false;
        return cat.includes(config.label) || config.fullLabel.includes(cat);
      });

      if (items.length === 0) {
        tbody.innerHTML = `
          <tr class="credits-empty">
            <td colspan="4" style="text-align: center; padding: 20px; color: var(--text-color-light);">${config.emptyMsg}</td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = ''; // クリア

      items.forEach(item => {
        const tr = document.createElement('tr');

        // 提供元のリンク処理
        let authorHTML = item.author || '-';
        if (item.author && item.url) {
          authorHTML = `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.author}</a>`;
        } else if (!item.author && item.url) {
          authorHTML = `<a href="${item.url}" target="_blank" rel="noopener noreferrer">リンク</a>`;
        }

        tr.innerHTML = `
          <td>${item.name || '-'}</td>
          <td>${authorHTML}</td>
          <td>${item.usage || '-'}</td>
          <td>${item.license || '-'}</td>
        `;
        tbody.appendChild(tr);
      });
    });

  } catch (error) {
    console.error('Error fetching credits:', error);
  }
});
