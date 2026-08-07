// ===================================================
// 図鑑（コレクション）モジュール
// ===================================================

import { CARD_DB, INITIAL_DECKS } from '../../data/roguelike/cards';
import { ITEM_DB } from '../../data/roguelike/items';
import { RELIC_DB } from '../../data/roguelike/relics';
import { MONSTER_DB } from '../../data/roguelike/enemies';

const STORAGE_KEY_CARDS = 'roguelike_unlocked_cards';
const STORAGE_KEY_ITEMS = 'roguelike_unlocked_items';
const STORAGE_KEY_RELICS = 'roguelike_unlocked_relics';
const STORAGE_KEY_MONSTERS = 'roguelike_unlocked_monsters';

let unlockedCards = [];
let unlockedItems = [];
let unlockedRelics = [];
let unlockedMonsters = [];

let makeCardElFn = null;
let showCardDetailModalFn = null;
let showItemDetailModalFn = null;

let activeCompMainTab = 'cards';
let activeCompSubFilter = 'all';

export function loadUnlockedData() {
  try {
    unlockedCards = JSON.parse(localStorage.getItem(STORAGE_KEY_CARDS)) || [];
  } catch {
    unlockedCards = [];
  }
  try {
    unlockedItems = JSON.parse(localStorage.getItem(STORAGE_KEY_ITEMS)) || [];
  } catch {
    unlockedItems = [];
  }
  try {
    unlockedRelics = JSON.parse(localStorage.getItem(STORAGE_KEY_RELICS)) || [];
  } catch {
    unlockedRelics = [];
  }
  try {
    unlockedMonsters = JSON.parse(localStorage.getItem(STORAGE_KEY_MONSTERS)) || [];
  } catch {
    unlockedMonsters = [];
  }

  // 全職業の初期基本デッキカードを自動アンロック
  if (INITIAL_DECKS) {
    Object.values(INITIAL_DECKS).forEach((deckList) => {
      deckList.forEach((id) => {
        if (!unlockedCards.includes(id)) unlockedCards.push(id);
      });
    });
  }

  // 初期基本アイテム ＆ 基本レリックの自動アンロック
  ['sandwich', 'hp_drink', 'mp_drink'].forEach((id) => {
    if (!unlockedItems.includes(id)) unlockedItems.push(id);
  });
  ['ruby_ring', 'sapphire_ring'].forEach((id) => {
    if (!unlockedRelics.includes(id)) unlockedRelics.push(id);
  });

  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(unlockedCards));
  localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(unlockedItems));
  localStorage.setItem(STORAGE_KEY_RELICS, JSON.stringify(unlockedRelics));
  localStorage.setItem(STORAGE_KEY_MONSTERS, JSON.stringify(unlockedMonsters));
}

export function unlockCard(cardId) {
  if (!cardId || !CARD_DB[cardId]) return;
  const baseId = cardId.replace(/\+.*$/, '');
  if (!unlockedCards.includes(baseId)) {
    unlockedCards.push(baseId);
    saveState();
  }
}

export function unlockItem(itemId) {
  if (!itemId || !ITEM_DB[itemId]) return;
  if (!unlockedItems.includes(itemId)) {
    unlockedItems.push(itemId);
    saveState();
  }
}

export function unlockRelic(relicId) {
  if (!relicId || !RELIC_DB[relicId]) return;
  if (!unlockedRelics.includes(relicId)) {
    unlockedRelics.push(relicId);
    saveState();
  }
}

export function unlockMonster(monsterName) {
  if (!monsterName) return;
  const cleanName = monsterName.replace(/^強欲な/, '');
  const foundKey = Object.keys(MONSTER_DB).find((k) => MONSTER_DB[k].name === cleanName);
  if (foundKey && !unlockedMonsters.includes(foundKey)) {
    unlockedMonsters.push(foundKey);
    saveState();
  }
}

export function renderCompendium() {
  const grid = document.getElementById('compendium-card-grid');
  const countEl = document.getElementById('compendium-count');
  const percentEl = document.getElementById('compendium-percent');
  const barFill = document.getElementById('compendium-progress-bar');
  const subTabsContainer = document.getElementById('comp-sub-tabs');
  if (!grid) return;

  grid.innerHTML = '';

  if (activeCompMainTab === 'cards') {
    if (subTabsContainer) subTabsContainer.style.display = 'flex';
    const allCardIds = Object.keys(CARD_DB);
    const totalCards = allCardIds.length;
    const unlockedCount = unlockedCards.filter((id) => CARD_DB[id]).length;
    const percent = Math.floor((unlockedCount / totalCards) * 100);

    if (countEl) countEl.textContent = `${unlockedCount} / ${totalCards}`;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (barFill) barFill.style.width = `${percent}%`;

    allCardIds.forEach((id) => {
      const card = CARD_DB[id];
      if (activeCompSubFilter !== 'all' && card.category !== activeCompSubFilter) return;

      const isUnlocked = unlockedCards.includes(id);
      if (isUnlocked && makeCardElFn) {
        const cardEl = makeCardElFn(card, () => {
          if (window.playSE) window.playSE('cursor');
          if (showCardDetailModalFn) showCardDetailModalFn(card);
        });
        grid.appendChild(cardEl);
      } else {
        const lockedEl = document.createElement('div');
        lockedEl.className = 'battle-card comp-card-locked';
        lockedEl.innerHTML = `
          <div class="card-cost card-cost-custom">🔒</div>
          <div class="card-name card-name-custom">???</div>
          <div class="card-desc card-desc-custom">未開放カード</div>
        `;
        grid.appendChild(lockedEl);
      }
    });
  } else if (activeCompMainTab === 'items') {
    if (subTabsContainer) subTabsContainer.style.display = 'none';
    const allItemIds = Object.keys(ITEM_DB).filter(
      (id) => !ITEM_DB[id].notForSale || id === 'sandwich',
    );
    const totalItems = allItemIds.length;
    const unlockedCount = unlockedItems.filter((id) => ITEM_DB[id]).length;
    const percent = Math.floor((unlockedCount / totalItems) * 100);

    if (countEl) countEl.textContent = `${unlockedCount} / ${totalItems}`;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (barFill) barFill.style.width = `${percent}%`;

    allItemIds.forEach((id) => {
      const item = ITEM_DB[id];
      const isUnlocked = unlockedItems.includes(id);
      const cardEl = document.createElement('div');

      if (isUnlocked) {
        cardEl.className = 'battle-card reward-card';
        cardEl.style.borderColor = '#60a5fa';
        cardEl.innerHTML = `
          <div class="card-cost card-cost-custom" style="background:#2563eb;">具</div>
          <div style="text-align:center; margin: 4px 0;">
            <img src="${item.image}" alt="${item.name}" style="width:28px; height:28px; object-fit:contain;" />
          </div>
          <div class="card-name card-name-custom" style="font-size:0.75rem;">${item.name}</div>
          <div class="card-desc card-desc-custom" style="font-size:0.65rem;">${item.desc}</div>
        `;
        cardEl.addEventListener('click', () => {
          if (window.playSE) window.playSE('cursor');
          if (showItemDetailModalFn) showItemDetailModalFn(item, 'item');
        });
      } else {
        cardEl.className = 'battle-card comp-card-locked';
        cardEl.innerHTML = `
          <div class="card-cost card-cost-custom">🔒</div>
          <div class="card-name card-name-custom">???</div>
          <div class="card-desc card-desc-custom">未開放アイテム</div>
        `;
      }
      grid.appendChild(cardEl);
    });
  } else if (activeCompMainTab === 'relics') {
    if (subTabsContainer) subTabsContainer.style.display = 'none';
    const allRelicIds = Object.keys(RELIC_DB);
    const totalRelics = allRelicIds.length;
    const unlockedCount = unlockedRelics.filter((id) => RELIC_DB[id]).length;
    const percent = Math.floor((unlockedCount / totalRelics) * 100);

    if (countEl) countEl.textContent = `${unlockedCount} / ${totalRelics}`;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (barFill) barFill.style.width = `${percent}%`;

    allRelicIds.forEach((id) => {
      const relic = RELIC_DB[id];
      const isUnlocked = unlockedRelics.includes(id);
      const cardEl = document.createElement('div');

      if (isUnlocked) {
        cardEl.className = 'battle-card reward-card';
        cardEl.style.borderColor = '#f59e0b';
        cardEl.innerHTML = `
          <div class="card-cost card-cost-custom" style="background:#d97706;">宝</div>
          <div style="text-align:center; margin: 4px 0;">
            <img src="${relic.image}" alt="${relic.name}" style="width:28px; height:28px; object-fit:contain;" />
          </div>
          <div class="card-name card-name-custom" style="font-size:0.75rem;">${relic.name}</div>
          <div class="card-desc card-desc-custom" style="font-size:0.65rem;">${relic.desc}</div>
        `;
        cardEl.addEventListener('click', () => {
          if (window.playSE) window.playSE('cursor');
          if (showItemDetailModalFn) showItemDetailModalFn(relic, 'relic');
        });
      } else {
        cardEl.className = 'battle-card comp-card-locked';
        cardEl.innerHTML = `
          <div class="card-cost card-cost-custom">🔒</div>
          <div class="card-name card-name-custom">???</div>
          <div class="card-desc card-desc-custom">未開放レリック</div>
        `;
      }
      grid.appendChild(cardEl);
    });
  } else if (activeCompMainTab === 'monsters') {
    if (subTabsContainer) subTabsContainer.style.display = 'none';
    const allMonsterIds = Object.keys(MONSTER_DB);
    const totalMonsters = allMonsterIds.length;
    const unlockedCount = unlockedMonsters.filter((id) => MONSTER_DB[id]).length;
    const percent = Math.floor((unlockedCount / totalMonsters) * 100);

    if (countEl) countEl.textContent = `${unlockedCount} / ${totalMonsters}`;
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (barFill) barFill.style.width = `${percent}%`;

    allMonsterIds.forEach((id) => {
      const monster = MONSTER_DB[id];
      const isUnlocked = unlockedMonsters.includes(id);
      const cardEl = document.createElement('div');

      if (isUnlocked) {
        cardEl.className = 'battle-card reward-card';
        cardEl.style.borderColor = '#ef4444';
        cardEl.innerHTML = `
          <div class="card-cost card-cost-custom" style="background:#dc2626;">獣</div>
          <div style="text-align:center; margin: 4px 0;">
            <img src="${monster.image}" alt="${monster.name}" style="width:32px; height:32px; object-fit:contain;" />
          </div>
          <div class="card-name card-name-custom" style="font-size:0.75rem;">${monster.name}</div>
          <div class="card-desc card-desc-custom" style="font-size:0.65rem;">HP: ${monster.hp} / EXP: ${monster.exp}</div>
        `;
        cardEl.addEventListener('click', () => {
          if (window.playSE) window.playSE('cursor');
          showMonsterDetailModal(monster);
        });
      } else {
        cardEl.className = 'battle-card comp-card-locked';
        cardEl.innerHTML = `
          <div class="card-cost card-cost-custom">🔒</div>
          <div class="card-name card-name-custom">???</div>
          <div class="card-desc card-desc-custom">未討伐モンスター</div>
        `;
      }
      grid.appendChild(cardEl);
    });
  }
}

const ELEMENT_NAMES = {
  fire: '🔥火',
  ice: '❄️氷',
  thunder: '⚡雷',
  wind: '🌪️風',
  stone: '🪨土',
};

export function showMonsterDetailModal(monster) {
  const monsterDetailModal = document.getElementById('monster-detail-modal');
  if (!monsterDetailModal) return;

  const mdImage = document.getElementById('md-image');
  const mdName = document.getElementById('md-name');
  const mdHp = document.getElementById('md-hp');
  const mdExp = document.getElementById('md-exp');
  const mdWeakness = document.getElementById('md-weakness');
  const mdResistance = document.getElementById('md-resistance');
  const mdImmunity = document.getElementById('md-immunity');
  const mdSkills = document.getElementById('md-skills');
  const mdFlavor = document.getElementById('md-flavor');

  if (mdImage) mdImage.src = monster.image;
  if (mdName) mdName.textContent = monster.name;
  if (mdHp) mdHp.textContent = monster.hp;
  if (mdExp) mdExp.textContent = monster.exp;

  const weakText = monster.weaknesses.length
    ? monster.weaknesses.map((w) => ELEMENT_NAMES[w] || w).join(', ')
    : 'なし';
  const resText = monster.resistances.length
    ? monster.resistances.map((r) => ELEMENT_NAMES[r] || r).join(', ')
    : 'なし';
  const immText = monster.immunities.length
    ? monster.immunities.map((i) => ELEMENT_NAMES[i] || i).join(', ')
    : 'なし';

  if (mdWeakness) mdWeakness.textContent = weakText;
  if (mdResistance) mdResistance.textContent = resText;
  if (mdImmunity) mdImmunity.textContent = immText;

  if (mdSkills) {
    mdSkills.innerHTML = monster.skills
      .map((s) => `<span class="md-skill-tag">${s}</span>`)
      .join('');
  }
  if (mdFlavor) mdFlavor.textContent = monster.flavor;

  monsterDetailModal.style.display = 'flex';
}

export function initCompendium(makeCardEl, showCardDetailModal, showItemDetailModal) {
  makeCardElFn = makeCardEl;
  showCardDetailModalFn = showCardDetailModal;
  showItemDetailModalFn = showItemDetailModal;

  loadUnlockedData();

  const compendiumModal = document.getElementById('compendium-modal');
  const btnOpenCompendium = document.getElementById('btn-open-compendium');
  const btnCloseCompendium = document.getElementById('btn-close-compendium');
  const btnCloseMonsterDetail = document.getElementById('btn-close-monster-detail');
  const monsterDetailModal = document.getElementById('monster-detail-modal');

  if (btnOpenCompendium) {
    btnOpenCompendium.addEventListener('click', () => {
      if (window.playSE) window.playSE('confirm');
      renderCompendium();
      if (compendiumModal) compendiumModal.style.display = 'flex';
    });
  }

  if (btnCloseCompendium) {
    btnCloseCompendium.addEventListener('click', () => {
      if (window.playSE) window.playSE('cancel');
      if (compendiumModal) compendiumModal.style.display = 'none';
    });
  }

  if (btnCloseMonsterDetail) {
    btnCloseMonsterDetail.addEventListener('click', () => {
      if (window.playSE) window.playSE('cancel');
      if (monsterDetailModal) monsterDetailModal.style.display = 'none';
    });
  }

  // メインタブ（カード / アイテム / レリック / モンスター）
  const compMainTabs = document.querySelectorAll('.comp-main-tab');
  compMainTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (window.playSE) window.playSE('cursor');
      compMainTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeCompMainTab = tab.getAttribute('data-type') || 'cards';
      renderCompendium();
    });
  });

  // サブタブ（カード属性フィルター）
  const compSubTabs = document.querySelectorAll('.comp-tab');
  compSubTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (window.playSE) window.playSE('cursor');
      compSubTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeCompSubFilter = tab.getAttribute('data-cat') || 'all';
      renderCompendium();
    });
  });
}
