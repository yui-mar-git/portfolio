/**
 * MicroCMSからプロフィール情報を取得して反映する
 */
document.addEventListener('DOMContentLoaded', async () => {
  const nameEl = document.getElementById('profile-name-display');
  const titleEl = document.getElementById('profile-title');
  const bioEl = document.getElementById('profile-bio');
  const skillsContainer = document.getElementById('skills-container');
  const certTreeRoot = document.getElementById('cert-tree-root');

  if (typeof CONFIG === 'undefined') {
    console.error('Configuration (env.js) is missing.');
    return;
  }

  // headers の定義を削除

  /**
   * 日付フォーマット (YYYY/MM/DD取得)
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}取得`;
  };

  /**
   * 基本情報の取得 (Settings)
   */
  async function fetchSettings() {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.SETTINGS}&limit=100`);
      if (!response.ok) throw new Error('Settings API failed');
      const data = await response.json();

      if (data.name && nameEl) nameEl.textContent = data.name;
      if (data.title && titleEl) titleEl.textContent = data.title;
      if (data.bio && bioEl) {
        bioEl.innerHTML = data.bio.replace(/\n/g, '<br>');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      if (nameEl) nameEl.textContent = '取得失敗';
    }
  }

  /**
   * スキル・資格情報の取得とツリー生成
   */
  async function fetchProfileData() {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.PROFILE}&limit=100`);
      if (!response.ok) throw new Error('Profile List API failed');
      const data = await response.json();

      if (!data.contents) return;

      renderSkills(data.contents);
      renderCertTree(data.contents);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }

  /**
   * スキル・ツールの描画 (カテゴリ別)
   */
  function renderSkills(contents) {
    if (!skillsContainer) return;
    skillsContainer.innerHTML = '';

    const categories = ['スキル', 'ツール'];
    
    categories.forEach(cat => {
      const items = contents.filter(item => {
        const itemCat = Array.isArray(item.category) ? item.category[0] : item.category;
        return itemCat && itemCat.includes(cat);
      });
      
      if (items.length === 0) return;

      const card = document.createElement('div');
      card.className = 'profile-card';
      card.style.marginBottom = '20px';
      
      const h3 = document.createElement('h3');
      h3.textContent = cat;
      h3.style.fontSize = '1.1rem';
      h3.style.marginBottom = '10px';
      h3.style.color = 'var(--accent-color)';
      
      const ul = document.createElement('ul');
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        ul.appendChild(li);
      });

      card.appendChild(h3);
      card.appendChild(ul);
      skillsContainer.appendChild(card);
    });
  }

  /**
   * 資格ツリーの描画
   */
  function renderCertTree(contents) {
    if (!certTreeRoot) return;
    certTreeRoot.innerHTML = '';

    const certs = contents.filter(item => {
      const itemCat = Array.isArray(item.category) ? item.category[0] : item.category;
      return itemCat && (itemCat.includes('資格') || itemCat.includes('検定'));
    });
    
    if (certs.length === 0) return;

    // 資格の優先順位（親子関係）の定義
    const rankDefinitions = [
      { keywords: ['ITパスポート'], rank: 3, system: '情報処理技術者' },
      { keywords: ['基本情報技術者'], rank: 2, system: '情報処理技術者' },
      { keywords: ['応用情報技術者'], rank: 1, system: '情報処理技術者' },
      { keywords: ['FP技能士'], gradeBased: true, system: 'FP技能士' },
      { keywords: ['ウェブデザイン技能士'], gradeBased: true, system: 'ウェブデザイン技能士' }
    ];

    const systems = {};
    certs.forEach(cert => {
      let systemName = '';
      let rank = 99;

      // 定義済みランキングに一致するか確認
      const def = rankDefinitions.find(d => d.keywords.some(k => cert.name.includes(k)));
      
      if (def) {
        systemName = def.system;
        if (def.gradeBased) {
          const gradeMatch = cert.name.match(/([123])級/);
          rank = gradeMatch ? parseInt(gradeMatch[1]) : 99;
        } else {
          rank = def.rank;
        }
      } else {
        // デフォルト: 級(1,2,3)での判定
        const gradeMatch = cert.name.match(/([123])級/);
        rank = gradeMatch ? parseInt(gradeMatch[1]) : 99;
        systemName = cert.name.replace(/[123]級/, '').trim();
      }

      if (!systems[systemName]) {
        systems[systemName] = [];
      }
      systems[systemName].push({ ...cert, rank });
    });

    const rootUl = document.createElement('ul');
    const rootLi = document.createElement('li');
    
    const rootNode = document.createElement('div');
    rootNode.className = 'cert-node root';
    rootNode.textContent = '資格';
    rootLi.appendChild(rootNode);

    const subUl = document.createElement('ul');

    Object.keys(systems).forEach(sysName => {
      const sysItems = systems[sysName];
      // ランクの降順（3 -> 2 -> 1）でソート（親から子の順）
      sysItems.sort((a, b) => b.rank - a.rank);

      const sysLi = buildNestedLi(sysItems);
      subUl.appendChild(sysLi);
    });

    rootLi.appendChild(subUl);
    rootUl.appendChild(rootLi);
    certTreeRoot.appendChild(rootUl);
  }

  /**
   * 階層的な li 要素を生成する再帰関数
   */
  function buildNestedLi(items) {
    if (items.length === 0) return null;
    
    const item = items[0];
    const li = document.createElement('li');
    
    const isAcquired = Array.isArray(item.status) 
      ? (item.status[0] === '取得済' || item.status[0] === '取得済み')
      : (item.status === '取得済' || item.status === '取得済み');

    const node = document.createElement('div');
    node.className = `cert-node ${isAcquired ? 'acquired' : ''}`;
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'cert-name';
    nameSpan.textContent = item.name;
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'cert-date';
    dateSpan.textContent = isAcquired ? formatDate(item.acquired_date) : '';
    
    node.appendChild(nameSpan);
    node.appendChild(dateSpan);
    li.appendChild(node);

    if (items.length > 1) {
      const ul = document.createElement('ul');
      const childLi = buildNestedLi(items.slice(1));
      if (childLi) {
        ul.appendChild(childLi);
        li.appendChild(ul);
      }
    }

    return li;
  }

  // 実行
  await Promise.all([fetchSettings(), fetchProfileData()]);
});
