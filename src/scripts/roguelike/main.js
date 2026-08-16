// ===================================================
// ローグライク カードバトル JS
// ===================================================

import { CARD_DB, REWARD_POOL, INITIAL_DECKS, upgradeCard } from '../../data/roguelike/cards';
import { RELIC_DB } from '../../data/roguelike/relics';
import { ITEM_DB } from '../../data/roguelike/items';
import { enemyTemplates, getEnemyTemplate, MONSTER_DB } from '../../data/roguelike/enemies';
import {
  initCompendium,
  unlockCard,
  unlockItem,
  unlockRelic,
  unlockMonster,
  renderCompendium,
} from './compendium';
import { TOOLTIP_DB } from '../../data/roguelike/tooltips';
import { RL_ACHIEVEMENTS } from '../../data/roguelike/achievements';
import { MAP_EVENTS } from '../../data/roguelike/events';

// ===================================================
// Audio マネージャー
// ===================================================
const BGM_PATH = new URL('../../assets/games/roguelike/audio/bgm/', import.meta.url).href;
const SE_PATH = new URL('../../assets/games/roguelike/audio/se/', import.meta.url).href;

const BGM_DB = {
  start: new URL('../../assets/games/roguelike/audio/bgm/maou_game_theme14.mp3', import.meta.url)
    .href,
  reward: new URL('../../assets/games/roguelike/audio/bgm/maou_game_event04.mp3', import.meta.url)
    .href,
  castle: new URL('../../assets/games/roguelike/audio/bgm/maou_game_castle01.mp3', import.meta.url)
    .href,
  inn: new URL('../../assets/games/roguelike/audio/bgm/maou_game_village01.mp3', import.meta.url)
    .href,
  town: new URL('../../assets/games/roguelike/audio/bgm/maou_game_town01.mp3', import.meta.url)
    .href,
  forest: new URL('../../assets/games/roguelike/audio/bgm/maou_game_dangeon13.mp3', import.meta.url)
    .href,
  area1: new URL('../../assets/games/roguelike/audio/bgm/maou_game_field05.mp3', import.meta.url)
    .href,
  area2: new URL('../../assets/games/roguelike/audio/bgm/maou_game_field11.mp3', import.meta.url)
    .href,
  area3: new URL('../../assets/games/roguelike/audio/bgm/maou_game_field07.mp3', import.meta.url)
    .href,
  battle: new URL('../../assets/games/roguelike/audio/bgm/maou_game_battle07.mp3', import.meta.url)
    .href,
  boss: new URL('../../assets/games/roguelike/audio/bgm/maou_game_boss02.mp3', import.meta.url)
    .href,
  lastboss: new URL('../../assets/games/roguelike/audio/bgm/maou_game_boss06.mp3', import.meta.url)
    .href,
  bandit_pre: new URL(
    '../../assets/games/roguelike/audio/bgm/maou_game_dangeon07.mp3',
    import.meta.url,
  ).href,
  darkelf_pre: new URL(
    '../../assets/games/roguelike/audio/bgm/maou_game_dangeon22.mp3',
    import.meta.url,
  ).href,
  golem_pre: new URL(
    '../../assets/games/roguelike/audio/bgm/maou_game_dangeon01.mp3',
    import.meta.url,
  ).href,
  vampire_pre: new URL(
    '../../assets/games/roguelike/audio/bgm/maou_game_dangeon17.mp3',
    import.meta.url,
  ).href,
  leviathan_pre: new URL(
    '../../assets/games/roguelike/audio/bgm/maou_game_dangeon15.mp3',
    import.meta.url,
  ).href,
  maou_pre: new URL(
    '../../assets/games/roguelike/audio/bgm/maou_game_dangeon04b.mp3',
    import.meta.url,
  ).href,
  achieve: new URL(
    '../../assets/games/roguelike/audio/bgm/maou_game_town16.mp3',
    import.meta.url,
  ).href,
};

const SE_DB = {
  relic: new URL('../../assets/games/roguelike/audio/se/maou_game_jingle09.mp3', import.meta.url)
    .href,
  inn: new URL('../../assets/games/roguelike/audio/se/maou_game_jingle07.mp3', import.meta.url)
    .href,
  victory: new URL('../../assets/games/roguelike/audio/se/maou_game_jingle01.mp3', import.meta.url)
    .href,
  defeat: new URL('../../assets/games/roguelike/audio/se/maou_game_jingle08.mp3', import.meta.url)
    .href,
  strike: new URL('../../assets/games/roguelike/audio/se/剣で斬る2.mp3', import.meta.url).href,
  smite: new URL('../../assets/games/roguelike/audio/se/剣で斬る3.mp3', import.meta.url).href,
  rush: new URL('../../assets/games/roguelike/audio/se/剣で斬る4.mp3', import.meta.url).href,
  stone: new URL('../../assets/games/roguelike/audio/se/岩が真っ二つに割れる.mp3', import.meta.url)
    .href,
  buff_up: new URL('../../assets/games/roguelike/audio/se/ステータス上昇魔法2.mp3', import.meta.url)
    .href,
  buff_down: new URL('../../assets/games/roguelike/audio/se/HP吸収魔法2.mp3', import.meta.url).href,
  enemy_attack: new URL('../../assets/games/roguelike/audio/se/小パンチ.mp3', import.meta.url).href,
  boss_attack: new URL('../../assets/games/roguelike/audio/se/打撃6.mp3', import.meta.url).href,
  reward_select: new URL(
    '../../assets/games/roguelike/audio/se/決定ボタンを押す4.mp3',
    import.meta.url,
  ).href,
  invalid: new URL('../../assets/games/roguelike/audio/se/ビープ音4.mp3', import.meta.url).href,
  harpy: new URL('../../assets/games/roguelike/audio/se/ヒヨドリの鳴き声1.mp3', import.meta.url)
    .href,
  fire: new URL('../../assets/games/roguelike/audio/se/火炎魔法1.mp3', import.meta.url).href,
  ice: new URL('../../assets/games/roguelike/audio/se/氷魔法1.mp3', import.meta.url).href,
  thunder: new URL('../../assets/games/roguelike/audio/se/雷魔法1.mp3', import.meta.url).href,
  wind: new URL('../../assets/games/roguelike/audio/se/風魔法1.mp3', import.meta.url).href,
  poison: new URL('../../assets/games/roguelike/audio/se/毒魔法1.mp3', import.meta.url).href,
  heal: new URL('../../assets/games/roguelike/audio/se/回復魔法1.mp3', import.meta.url).href,
  meteor: new URL('../../assets/games/roguelike/audio/se/ドラゴンが火を吐く.mp3', import.meta.url)
    .href,
  confirm: new URL(
    '../../assets/games/roguelike/audio/se//portfolio/common/assets/audio/se/決定ボタンを押す2.mp3',
    import.meta.url,
  ).href,
  cancel: new URL(
    '../../assets/games/roguelike/audio/se//portfolio/common/assets/audio/se/キャンセル1.mp3',
    import.meta.url,
  ).href,
  cursor: new URL(
    '../../assets/games/roguelike/audio/se//portfolio/common/assets/audio/se/カーソル移動7.mp3',
    import.meta.url,
  ).href,
  draw: new URL('../../assets/games/roguelike/audio/se/カードをめくる.mp3', import.meta.url).href,
  play: new URL('../../assets/games/roguelike/audio/se/カードを台の上に出す.mp3', import.meta.url)
    .href,
};

let currentBgmAudio = null;
let configBgmVolume = 0.2;
let configSeVolume = 0.5;

let currentBgmFadeInterval = null;

function playBGM(bgmId, fadeOutMs = 1000) {
  if (!BGM_DB[bgmId]) return;
  const url = BGM_DB[bgmId];
  if (currentBgmAudio && currentBgmAudio.src.endsWith(url)) return;

  if (currentBgmFadeInterval) {
    clearInterval(currentBgmFadeInterval);
    currentBgmFadeInterval = null;
  }

  const playNext = () => {
    currentBgmAudio = new Audio(url);
    currentBgmAudio.loop = true;
    currentBgmAudio.volume = configBgmVolume;
    currentBgmAudio.play().catch((e) => console.log('BGM Play blocked:', e));
  };

  if (currentBgmAudio && fadeOutMs > 0) {
    const steps = 10;
    const stepTime = fadeOutMs / steps;
    const volStep = currentBgmAudio.volume / steps;
    let stepCount = 0;
    const oldAudio = currentBgmAudio;
    currentBgmAudio = null;
    currentBgmFadeInterval = setInterval(() => {
      stepCount++;
      if (oldAudio.volume > volStep) oldAudio.volume -= volStep;
      if (stepCount >= steps) {
        clearInterval(currentBgmFadeInterval);
        currentBgmFadeInterval = null;
        oldAudio.pause();
        playNext();
      }
    }, stepTime);
  } else {
    if (currentBgmAudio) {
      currentBgmAudio.pause();
    }
    playNext();
  }
}

function stopBGM() {
  if (currentBgmAudio) {
    currentBgmAudio.pause();
    currentBgmAudio = null;
  }
}

let currentLongSEs = [];

function playSE(seId) {
  if (!SE_DB[seId]) return;
  const path = SE_DB[seId];
  const se = new Audio(path);
  se.volume = configSeVolume;
  se.play().catch((e) => console.log('SE Play blocked:', e));
  if (seId === 'relic' || seId === 'level_up') {
    currentLongSEs.push(se);
    se.addEventListener('ended', () => {
      currentLongSEs = currentLongSEs.filter((s) => s !== se);
    });
  }
}

function stopLongSE() {
  currentLongSEs.forEach((se) => {
    se.pause();
    se.currentTime = 0;
  });
  currentLongSEs = [];
}

function setBgmVolume(vol) {
  configBgmVolume = vol;
  if (currentBgmAudio) currentBgmAudio.volume = vol;
}

function setSeVolume(vol) {
  configSeVolume = vol;
}

window.playSE = playSE;
window.setSEVolume = setSeVolume;
window.setBGMVolume = setBgmVolume;

// --- 1. DOM要素の取得 ---
const gameHeader = document.getElementById('game-header');
const gameFooter = document.getElementById('game-footer');
const headerFloor = document.getElementById('header-floor');
const headerGold = document.getElementById('header-gold');
const headerHp = document.getElementById('header-hp');
const headerMp = document.getElementById('header-mp');
const headerRelicsList = document.getElementById('header-relics-list');

const enemyNameEl = document.getElementById('enemy-name');
const enemyImageEl = document.getElementById('enemy-image');
const enemyHpBar = document.getElementById('enemy-hp-bar');
const enemyHpText = document.getElementById('enemy-hp-text');
const enemyIntentEl = document.getElementById('enemy-intent');
const enemyPoisonEl = document.getElementById('enemy-poison-badge');

const playerHpBar = document.getElementById('player-hp-bar');
const playerHpText = document.getElementById('player-hp-text');
const playerMpText = document.getElementById('player-mp-text');
const playerMpOrbs = document.getElementById('player-mp-orbs');
const playerActionsText = document.getElementById('player-actions');
const playerRelicsEl = document.getElementById('player-relics');
const playerItemsEl = document.getElementById('player-items');
const playerPoisonEl = document.getElementById('player-poison-badge');
const playerBattleImage = document.getElementById('player-battle-image');

const battleLog = document.getElementById('battle-log');
const handArea = document.getElementById('hand-area');
const deckCountEl = document.getElementById('deck-count');
const btnEndTurn = document.getElementById('btn-end-turn');

const overlay = document.getElementById('result-overlay');
const resultTitle = document.getElementById('result-title');
const resultDetails = document.getElementById('result-details');
const btnNext = document.getElementById('btn-next');
const btnTitle = document.getElementById('btn-title');
const btnShare = document.getElementById('btn-share');

const rewardOverlay = document.getElementById('reward-overlay');
const rewardSubtitleText = document.getElementById('reward-subtitle-text');
const rewardCards = document.getElementById('reward-cards');
const btnSkipReward = document.getElementById('btn-skip-reward');

const deckViewerOverlay = document.getElementById('deck-viewer-overlay');
const btnViewDeck = document.getElementById('btn-view-deck');
const closeDeckViewer = document.getElementById('close-deck-viewer');

const startScreen = document.getElementById('start-screen');
const classSelectScreen = document.getElementById('class-select-screen');
const mapScreen = document.getElementById('map-screen');
const btnRetireMap = document.getElementById('btn-retire-map');
const innScreen = document.getElementById('inn-screen');
const shopServiceScreen = document.getElementById('shop-service-screen');
const townScreen = document.getElementById('town-screen');
const eventScreen = document.getElementById('event-screen');
const itemConfirmModal = document.getElementById('item-confirm-modal');
const itemConfirmText = document.getElementById('item-confirm-text');
const itemConfirmImage = document.getElementById('item-confirm-image');

// すごろくマップ関連DOM
const mapScrollWrapper = document.getElementById('map-scroll-wrapper');
const mapBoard = document.getElementById('map-board');
const btnMapViewDeck = document.getElementById('btn-map-view-deck');
const btnBattleViewMap = document.getElementById('btn-battle-view-map');
const battleMapOverlay = document.getElementById('battle-map-overlay');
const btnCloseBattleMap = document.getElementById('btn-close-battle-map');
const battleMapBoard = document.getElementById('battle-map-board');

// 王様・インゲームメッセージモーダルDOM
const kingEventModal = document.getElementById('king-event-modal');
const kingRelicChoices = document.getElementById('king-relic-choices');
const gameDialogModal = document.getElementById('game-dialog-modal');
const dialogTitle = document.getElementById('dialog-title');
const dialogMessage = document.getElementById('dialog-message');
const dialogExtra = document.getElementById('dialog-extra');
const btnDialogOk = document.getElementById('btn-dialog-ok');
const btnDialogYes = document.getElementById('btn-dialog-yes');
const btnDialogNo = document.getElementById('btn-dialog-no');

const cardDetailModal = document.getElementById('card-detail-modal');
const cardDetailContent = document.getElementById('card-detail-content');
const cardDetailDesc = document.getElementById('card-detail-desc');
const btnCloseCardDetail = document.getElementById('btn-close-card-detail');
// カットシーン
const cutsceneModal = document.getElementById('cutscene-modal');
const cutsceneBg = document.getElementById('cutscene-bg');
const cutscenePortraits = document.getElementById('cutscene-portraits');
const cutsceneSpeaker = document.getElementById('cutscene-speaker');
const cutsceneText = document.getElementById('cutscene-text');
let btnCutsceneNext = document.getElementById('btn-cutscene-next');

/**
 * カットシーンを順番に表示するユーティリティ。
 * @param {Array<{bg?, portraits:[{src,flip?}], speaker:string, lines:string[]}>} scenes
 * @param {Function} onComplete 全シーン完了後のコールバック
 */
function showCutscene(scenes, onComplete) {
  if (!cutsceneModal || scenes.length === 0) {
    onComplete?.();
    return;
  }
  let si = 0; // scene index
  let li = 0; // line index

  function render() {
    const s = scenes[si];
    // 背景
    if (cutsceneBg) cutsceneBg.style.backgroundImage = s.bg ? `url('${s.bg}')` : 'none';
    // ポートレート
    if (cutscenePortraits) {
      cutscenePortraits.innerHTML = '';
      (s.portraits || []).forEach((p) => {
        const img = document.createElement('img');
        img.src = p.src;
        img.style.cssText = `height:${p.size || '120px'}; object-fit:contain; ${p.flip ? 'transform:scaleX(-1);' : ''} image-rendering:auto;`;
        cutscenePortraits.appendChild(img);
      });
    }
    // スピーカー名
    if (cutsceneSpeaker) cutsceneSpeaker.textContent = s.speaker || '';
    // テキスト（改行対応）
    if (cutsceneText) cutsceneText.innerHTML = s.lines[li].replace(/\n/g, '<br>');
  }

  function onNext() {
    li++;
    if (li >= scenes[si].lines.length) {
      si++;
      li = 0;
    }
    if (si >= scenes.length) {
      // 全完了
      if (cutsceneModal) cutsceneModal.style.display = 'none';
      if (btnCutsceneNext) btnCutsceneNext.removeEventListener('click', onNext);
      onComplete?.();
      return;
    }
    render();
  }

  render();
  if (cutsceneModal) cutsceneModal.style.display = 'flex';
  if (btnCutsceneNext) {
    // 重複リスナー防止のためcloneで置換
    const newBtn = btnCutsceneNext.cloneNode(true);
    btnCutsceneNext.parentNode.replaceChild(newBtn, btnCutsceneNext);
    btnCutsceneNext = newBtn;
    btnCutsceneNext.addEventListener('click', onNext);
  }
}

// --- 2. ゲーム状態管理 ---
const player = {
  class: 'yuusya',
  maxHp: 12,
  hp: 12,
  maxMp: 8,
  mp: 8,
  gold: 50,
  deck: [],
  hand: [],
  discard: [],
  exhausted: [],
  relics: [],
  items: [{ id: 'sandwich', used: false }],
  actions: 1,
  poison: 0,
  paralyze: 0,
  buffUp: 0,
  buffDown: 0,
};

let enemy = null;
let isGameOver = false;
let isPlayerTurn = true;

// 進行ステート
let currentArea = 1;
let currentFloor = 0;
let currentRow = 0;
let currentPathType = '';
let generatedMap = [];

// キャラクターアバターアセットパス定義
const AVATAR_IMAGES = {
  yuusya: new URL(
    '../../assets/games/roguelike/images/characters/figure_rpg_character_yuusya.png',
    import.meta.url,
  ).href,
  kenshi: new URL(
    '../../assets/games/roguelike/images/characters/figure_rpg_character_kenshi.png',
    import.meta.url,
  ).href,
  mahoutsukai: new URL(
    '../../assets/games/roguelike/images/characters/figure_rpg_character_mahoutsukai.png',
    import.meta.url,
  ).href,
  butouka: new URL(
    '../../assets/games/roguelike/images/characters/figure_rpg_character_butouka.png',
    import.meta.url,
  ).href,
};

// --- 3. インゲーム汎用ダイアログ ---
let currentDialogCallback = null;
let currentDialogCancelCallback = null;

function showGameAlert(title, message, onOk = null) {
  if (dialogTitle) dialogTitle.innerHTML = title;
  if (dialogMessage) dialogMessage.innerHTML = message;
  if (btnDialogOk) {
    btnDialogOk.style.display = 'inline-block';
    btnDialogOk.setAttribute('style', 'display: inline-block !important; padding: 0.3rem 1.5rem;');
  }
  if (btnDialogYes) {
    btnDialogYes.style.display = 'none';
    btnDialogYes.setAttribute('style', 'display: none !important');
  }
  if (btnDialogNo) {
    btnDialogNo.style.display = 'none';
    btnDialogNo.setAttribute('style', 'display: none !important');
  }
  currentDialogCallback = onOk;
  if (gameDialogModal) gameDialogModal.style.display = 'flex';
}

function showGameConfirm(title, message, onYes, onNo = null, extraElement = null) {
  if (dialogExtra) {
    dialogExtra.innerHTML = '';
    if (extraElement) {
      if (typeof extraElement === 'string') {
        dialogExtra.innerHTML = extraElement;
      } else {
        dialogExtra.appendChild(extraElement);
      }
      dialogExtra.style.display = 'flex';
    } else {
      dialogExtra.style.display = 'none';
    }
  }
  if (dialogTitle) dialogTitle.innerHTML = title;
  if (dialogMessage) dialogMessage.innerHTML = message;
  if (btnDialogOk) {
    btnDialogOk.style.display = 'none';
    btnDialogOk.setAttribute('style', 'display: none !important');
  }
  if (btnDialogYes) {
    btnDialogYes.style.display = 'inline-block';
    btnDialogYes.setAttribute(
      'style',
      'display: inline-block !important; flex: 1; padding: 0.4rem 0;',
    );
  }
  if (btnDialogNo) {
    btnDialogNo.style.display = 'inline-block';
    btnDialogNo.setAttribute(
      'style',
      'display: inline-block !important; flex: 1; padding: 0.4rem 0;',
    );
  }
  currentDialogCallback = onYes;
  currentDialogCancelCallback = onNo;
  if (gameDialogModal) gameDialogModal.style.display = 'flex';
}

if (btnDialogOk) {
  btnDialogOk.addEventListener('click', () => {
    stopLongSE();
    if (gameDialogModal) gameDialogModal.style.display = 'none';
    if (currentDialogCallback) currentDialogCallback();
  });
}
if (btnDialogYes) {
  btnDialogYes.addEventListener('click', () => {
    stopLongSE();
    if (gameDialogModal) gameDialogModal.style.display = 'none';
    if (currentDialogCallback) currentDialogCallback();
  });
}
if (btnDialogNo) {
  btnDialogNo.addEventListener('click', () => {
    if (gameDialogModal) gameDialogModal.style.display = 'none';
    if (currentDialogCancelCallback) currentDialogCancelCallback();
  });
}

// --- 4. ユーティリティ・共通ロジック ---
function logMessage(msg, cls = '') {
  if (!battleLog) return;
  const p = document.createElement('p');
  p.innerHTML = msg;
  if (cls) p.classList.add(cls);
  battleLog.appendChild(p);
  while (battleLog.children.length > 12) battleLog.removeChild(battleLog.firstChild);
  battleLog.scrollTop = battleLog.scrollHeight;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- 5. 画面切り替え ---
function showScreen(target) {
  const screens = [
    startScreen,
    classSelectScreen,
    mapScreen,
    innScreen,
    shopServiceScreen,
    townScreen,
    eventScreen,
    document.querySelector('.battle-layout'),
  ];
  screens.forEach((s) => {
    if (s) s.style.display = 'none';
  });
  if (target) {
    target.style.display = target === document.querySelector('.battle-layout') ? 'grid' : 'flex';
    if (
      target === mapScreen ||
      target === document.querySelector('.battle-layout') ||
      target === townScreen ||
      target === shopServiceScreen ||
      target === eventScreen ||
      target === innScreen
    ) {
      if (gameHeader) gameHeader.style.display = 'flex';
      if (gameFooter) gameFooter.style.display = 'flex';
      updateHeaderBar();
    } else {
      if (gameHeader) gameHeader.style.display = 'none';
      if (gameFooter) gameFooter.style.display = 'none';
    }
  }
}

function hideGameAlert() {
  if (gameAlertModal) gameAlertModal.style.display = 'none';
  if (currentAlertCallback) {
    currentAlertCallback();
    currentAlertCallback = null;
  }
}

let activeTooltipPopup = null;
let activeTooltipTarget = null;

function hideTooltipPopup() {
  if (activeTooltipPopup) {
    activeTooltipPopup.classList.remove('show');
    const oldPopup = activeTooltipPopup;
    setTimeout(() => {
      if (oldPopup && oldPopup.parentNode) {
        oldPopup.parentNode.removeChild(oldPopup);
      }
    }, 200);
    activeTooltipPopup = null;
  }
  if (activeTooltipTarget) {
    activeTooltipTarget.classList.remove('active');
    activeTooltipTarget = null;
  }
}

document.addEventListener('click', () => {
  hideTooltipPopup();
});

function attachTooltipToElement(element, tooltipKey) {
  if (!element || !TOOLTIP_DB[tooltipKey]) return;
  element.classList.add('has-tooltip');

  const info = TOOLTIP_DB[tooltipKey];

  const showTooltip = (e) => {
    e.stopPropagation();
    if (activeTooltipTarget === element) {
      hideTooltipPopup();
      return;
    }
    hideTooltipPopup();

    activeTooltipTarget = element;
    element.classList.add('active');

    const popup = document.createElement('div');
    popup.className = 'rl-tooltip-popup';
    popup.innerHTML = info.desc;
    document.body.appendChild(popup);

    const rect = element.getBoundingClientRect();
    const popupWidth = popup.offsetWidth || 220;
    const popupHeight = popup.offsetHeight || 60;

    let left = rect.left + rect.width / 2 - popupWidth / 2;
    let top = rect.top - popupHeight - 8;

    if (top < 10) {
      top = rect.bottom + 8;
    }
    if (left < 10) left = 10;
    if (left + popupWidth > window.innerWidth - 10) {
      left = window.innerWidth - popupWidth - 10;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    requestAnimationFrame(() => {
      popup.classList.add('show');
    });

    activeTooltipPopup = popup;
  };

  element.addEventListener('mouseenter', (e) => {
    showTooltip(e);
  });

  element.addEventListener('mouseleave', () => {
    hideTooltipPopup();
  });

  element.addEventListener('click', (e) => {
    e.stopPropagation();
    showTooltip(e);
  });
}

if (btnCloseCardDetail) {
  btnCloseCardDetail.addEventListener('click', () => {
    hideTooltipPopup();
    if (cardDetailModal) cardDetailModal.style.display = 'none';
  });
}

function showCardDetailModal(card, isCompendium = false) {
  if (!cardDetailModal) return;
  hideTooltipPopup();
  cardDetailContent.innerHTML = '';

  const catLabelMap = {
    physical: '<span class="badge-physical">【物理】</span>',
    spell: '<span class="badge-spell">【呪文】</span>',
    special: '<span class="badge-special">【特殊】</span>',
  };
  const catPrefix =
    card.category && catLabelMap[card.category] ? `${catLabelMap[card.category]} ` : '';
  const flavorHtml = `<div class="card-flavor-text">${card.flavor || 'フレーバーテキスト準備中'}</div>`;

  const tagKeyMap = {
    物理: 'physical',
    呪文: 'spell',
    特殊: 'special',
    炎: 'fire',
    氷: 'ice',
    雷: 'thunder',
    風: 'wind',
    土: 'stone',
    毒: 'poison',
    麻痺: 'paralyze',
    能昇: 'buff_up',
    能降: 'buff_down',
    回復: 'heal',
    無: 'none',
  };

  const bindTooltips = (containerEl) => {
    const catBadge = containerEl.querySelector('.card-category-badge');
    if (catBadge && card.category) {
      attachTooltipToElement(catBadge, card.category);
    }
    const tagElements = containerEl.querySelectorAll('.card-tag');
    tagElements.forEach((tagEl) => {
      const text = tagEl.textContent.trim();
      const key = tagKeyMap[text];
      if (key) attachTooltipToElement(tagEl, key);
    });
  };

  if (isCompendium) {
    // 図鑑閲覧時のみ：強化前と強化後(+)を横並び比較表示
    const wrap = document.createElement('div');
    wrap.className = 'comp-compare-wrap';

    // 強化前
    const colBefore = document.createElement('div');
    colBefore.className = 'comp-compare-col';
    const labelBefore = document.createElement('span');
    labelBefore.className = 'comp-compare-label-before';
    labelBefore.textContent = '【強化前】';
    const cardBeforeEl = makeCardEl(card, false);
    cardBeforeEl.classList.add('comp-card-preview');
    colBefore.appendChild(labelBefore);
    colBefore.appendChild(cardBeforeEl);

    // 矢印
    const arrowEl = document.createElement('div');
    arrowEl.className = 'comp-compare-arrow';
    arrowEl.textContent = '➔';

    // 強化後(+)
    const baseCard = CARD_DB[card.id] || card;
    const upgradedObj = upgradeCard({ ...baseCard });
    const colAfter = document.createElement('div');
    colAfter.className = 'comp-compare-col';
    const labelAfter = document.createElement('span');
    labelAfter.className = 'comp-compare-label-after';
    labelAfter.textContent = '【強化後+】';
    const cardAfterEl = makeCardEl(upgradedObj, false);
    cardAfterEl.classList.add('comp-card-preview');
    colAfter.appendChild(labelAfter);
    colAfter.appendChild(cardAfterEl);

    wrap.appendChild(colBefore);
    wrap.appendChild(arrowEl);
    wrap.appendChild(colAfter);

    cardDetailContent.appendChild(wrap);

    const descHtmlBefore = (card.desc || '').replace(/\n/g, '<br>');
    const descHtmlAfter = (upgradedObj.desc || '').replace(/\n/g, '<br>');

    cardDetailDesc.innerHTML = `
      <div class="card-desc-container comp-compare-desc">
        ${catPrefix}<br>
        <strong>強化前：</strong> ${descHtmlBefore}<br>
        <strong class="comp-label-after">強化後：</strong> ${descHtmlAfter}
      </div>
      ${flavorHtml}
    `;

    bindTooltips(cardBeforeEl);
    bindTooltips(cardAfterEl);
  } else {
    // 通常の単体カード詳細表示（バトル・ショップ・報酬画面）
    const cardEl = makeCardEl(card, false);
    cardEl.style.transform = 'scale(1.3)';
    cardEl.style.transformOrigin = 'center top';
    cardEl.style.cursor = 'default';
    cardDetailContent.appendChild(cardEl);

    const descHtml = (card.desc || '').replace(/\n/g, '<br>');
    cardDetailDesc.innerHTML = `<div class="card-desc-container">${catPrefix}${descHtml}</div>${flavorHtml}`;

    bindTooltips(cardEl);
  }

  const catBadgeDesc = cardDetailDesc.querySelector(
    '.badge-physical, .badge-spell, .badge-special',
  );
  if (catBadgeDesc && card.category) {
    attachTooltipToElement(catBadgeDesc, card.category);
  }

  cardDetailModal.style.display = 'flex';
}

if (btnRetireMap) {
  btnRetireMap.addEventListener('click', () => {
    showGameConfirm('リタイア', '現在のプレイを終了してタイトルに戻りますか？', () => {
      showScreen(startScreen);
      stopBGM();
    });
  });
}

function showItemDetailModal(item, type) {
  if (!cardDetailModal) return;
  cardDetailContent.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('item-detail-container');
  container.style.border = '2px solid ' + (type === 'relic' ? '#f1c40f' : '#3498db');

  const img = document.createElement('img');
  img.src = item.image;
  img.classList.add('item-detail-image');
  container.appendChild(img);

  const title = document.createElement('div');
  title.textContent = item.name;
  title.classList.add('item-detail-title');
  container.appendChild(title);

  cardDetailContent.appendChild(container);

  const badgeHtml =
    type === 'relic'
      ? '<span class="badge-special">【レリック】<br></span>'
      : '<span class="badge-spell">【アイテム】<br></span>';
  const descHtml = (item.desc || '').replace(/\n/g, '<br>');
  const flavorHtml = `<div class="card-flavor-text">${item.flavor || 'フレーバーテキスト準備中'}</div>`;
  cardDetailDesc.innerHTML = `<div class="card-desc-container">${badgeHtml} ${descHtml}</div>${flavorHtml}`;
  cardDetailModal.style.display = 'flex';
}

function updateHeaderBar() {
  if (headerFloor) headerFloor.textContent = `エリア ${currentArea} - ${currentFloor}層`;
  if (headerGold) headerGold.textContent = player.gold;
  if (headerHp) headerHp.textContent = `${player.hp}/${player.maxHp}`;
  if (headerMp) headerMp.textContent = `${player.mp}/${player.maxMp}`;

  if (headerRelicsList) {
    headerRelicsList.innerHTML = '';
    player.relics.forEach((relicId) => {
      const relic = RELIC_DB[relicId];
      if (relic) {
        const img = document.createElement('img');
        img.src = relic.image;
        img.className = 'relic-icon';
        img.title = `${relic.name}\n${relic.desc}`;
        img.addEventListener('click', () => showItemDetailModal(relic, 'relic'));
        img.classList.add('rl-js-style-1');
        headerRelicsList.appendChild(img);
      }
    });
  }
}

// --- 7. 王様遇遇レリックイベント (Floor 0) ---
function showKingEvent() {
  playBGM('castle');
  if (kingRelicChoices) kingRelicChoices.innerHTML = '';

  const allRelicKeys = Object.keys(RELIC_DB).filter((k) => !RELIC_DB[k].isFixed);
  shuffle(allRelicKeys);
  const picks = allRelicKeys.slice(0, 3);

  picks.forEach((relicId) => {
    const relic = RELIC_DB[relicId];
    const el = document.createElement('div');
    el.classList.add('rl-js-style-2');

    const imgEl = document.createElement('img');
    imgEl.src = relic.image || '';
    imgEl.alt = relic.name;
    imgEl.classList.add('rl-js-style-3');

    const nameEl = document.createElement('div');
    nameEl.classList.add('rl-js-style-4');
    nameEl.textContent = relic.name;

    const descEl = document.createElement('div');
    descEl.classList.add('rl-js-style-5');
    descEl.innerHTML = relic.desc;

    el.appendChild(imgEl);
    el.appendChild(nameEl);
    el.appendChild(descEl);

    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.07)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'none';
    });

    el.addEventListener('click', () => {
      showGameConfirm(
        'レリック選択',
        `レリック「${relic.name}」を選択しますか？<br><br><span class="relic-desc-text">${relic.desc}</span>`,
        () => {
          addRelic(relicId);
          if (player.class === 'yuusya') {
            const remaining = allRelicKeys.filter((r) => r !== relicId);
            const extra = remaining[0];
            addRelic(extra);
            showGameAlert(
              '王からの餞別 ',
              `さらに勇者の幸運により「${RELIC_DB[extra].name}」も追加で手に入りました！`,
              () => {
                if (kingEventModal) kingEventModal.style.display = 'none';
                enterFloorNode();
              },
            );
          } else {
            if (kingEventModal) kingEventModal.style.display = 'none';
            enterFloorNode();
          }
        },
        null, // いいえ → 何もしない（再び選べる）
      );
    });
    if (kingRelicChoices) kingRelicChoices.appendChild(el);
  });

  if (kingEventModal) kingEventModal.style.display = 'flex';
}

// --- 6. 職業選択画面制御 ---
let selectedClass = 'yuusya';
const CLASS_NAMES = {
  yuusya: '勇者',
  kenshi: '戦士',
  mahoutsukai: '魔法使い',
  butouka: '格闘家',
};

function setupClassSelection() {
  // 初期化：全カードからselectedをすべて削除
  const classCards = document.querySelectorAll('.class-card');
  classCards.forEach((card) => {
    card.classList.remove('selected');
    // inline styleの先顔をリセットした上で初期状態を適用
    card.style.border = '';
    card.style.background = '';
    card.style.boxShadow = '';
  });

  selectedClass = 'yuusya';
  const defaultCard = document.querySelector('.class-card[data-class="yuusya"]');
  if (defaultCard) defaultCard.classList.add('selected');

  const preview = document.getElementById('class-select-preview');
  if (preview) preview.textContent = '職業をクリックして冒険を始めてください';

  classCards.forEach((card) => {
    card.addEventListener('click', () => {
      // 全カードからselectedを削除
      classCards.forEach((c) => c.classList.remove('selected'));
      // クリックしたカードにselectedを履用
      card.classList.add('selected');
      selectedClass = card.dataset.class;
      let initialCards = INITIAL_DECKS[selectedClass].map((id) => CARD_DB[id]);

      const classInfo = {
        yuusya: { hp: 12, mp: 8, effect: '開始時に王様からレリックを2つ貰える' },
        kenshi: { hp: 14, mp: 6, effect: '毎ターン開始時にHPが1回復する' },
        mahoutsukai: { hp: 10, mp: 10, effect: '毎ターン開始時にMPが1回復する' },
        butouka: { hp: 10, mp: 6, effect: '毎ターンの行動回数が+1' },
      };
      const info = classInfo[selectedClass];
      const confirmMessage = `初期HP: ${info.hp} / 初期MP: ${info.mp}<br><span class="hero-effect-text">【特殊効果】 ${info.effect}</span>`;

      showGameConfirm(
        `${CLASS_NAMES[selectedClass] || selectedClass}として冒険にでますか？`,
        confirmMessage,
        () => {
          initGame();
        },
      );

      if (dialogExtra) {
        dialogExtra.innerHTML = '';
        const deckWrap = document.createElement('div');
        deckWrap.classList.add('rl-js-style-6');
        const deckLabel = document.createElement('div');
        deckLabel.classList.add('rl-js-style-7');
        deckLabel.textContent = '【初期デッキ】';
        deckWrap.appendChild(deckLabel);
        const deckGrid = document.createElement('div');
        deckGrid.classList.add('dv-card-list', 'active');
        initialCards.forEach((c) => {
          const cardEl = makeCardEl(c, null);
          cardEl.style.cursor = 'default';
          deckGrid.appendChild(cardEl);
        });
        deckWrap.appendChild(deckGrid);
        dialogExtra.appendChild(deckWrap);
        dialogExtra.style.display = 'block';
      }
    });
  });
}

function initGame() {
  isGameOver = false;
  player.class = selectedClass;
  player.relics = [];
  player.gold = 50;
  currentArea = 1;
  currentFloor = 0;
  currentRow = 0;

  if (player.class === 'yuusya') {
    player.maxHp = 12;
    player.maxMp = 8;
  } else if (player.class === 'kenshi') {
    player.maxHp = 14;
    player.maxMp = 6;
  } else if (player.class === 'mahoutsukai') {
    player.maxHp = 10;
    player.maxMp = 10;
  } else if (player.class === 'butouka') {
    player.maxHp = 10;
    player.maxMp = 6;
  }
  player.hp = player.maxHp;
  player.mp = player.maxMp;

  player.deck = INITIAL_DECKS[player.class].map((id) => ({ ...CARD_DB[id] }));
  INITIAL_DECKS[player.class].forEach((id) => unlockCard(id));
  player.discard = [];
  player.hand = [];
  player.items = [{ id: 'sandwich', used: false }];
  player.items.forEach((item) => unlockItem(item.id));

  renderRelicsAndItems();
  updateHeaderBar();

  if (playerBattleImage) playerBattleImage.src = AVATAR_IMAGES[player.class];

  currentPathType = 'start';
  generateAreaMap();
  showKingEvent();
}

// --- 8. 双六マップ生成・描画ロジック ---
const NODE_TYPES = {
  start: { label: 'お城', class: 'start' },
  normal: { label: '敵の気配', class: 'normal' },
  elite: { label: '強敵の気配', class: 'elite' },
  mimic: { label: '強敵の気配', class: 'mimic' },
  inn: { label: '宿屋 ⛺', class: 'inn' },
  fairy: { label: '神秘的な森', class: 'fairy' },
  event: { label: '？？？', class: 'event' },
  town: { label: '町', class: 'town' },
  midboss: { label: '威圧的な気配', class: 'midboss' },
  boss: { label: '威圧的な気配', class: 'boss' },
  lastboss: { label: '魔王の気配', class: 'lastboss' },
};

function generateAreaMap() {
  generatedMap = [];

  function getRandomNonNormal() {
    let types = ['event', 'inn', 'fairy'];
    if (currentArea === 1 && currentFloor <= 3) {
      types = ['event', 'fairy'];
    }
    return types[Math.floor(Math.random() * types.length)];
  }

  function generateRoute3() {
    const patterns = [
      ['normal', 'X', 'normal'],
      ['X', 'normal', 'X'],
    ];
    const p = patterns[Math.floor(Math.random() * patterns.length)];
    return p.map((x) => (x === 'X' ? getRandomNonNormal() : 'normal'));
  }

  const routes1 = [generateRoute3(), generateRoute3(), generateRoute3()];
  const routes2 = [generateRoute3(), generateRoute3(), generateRoute3()];

  for (let f = 0; f <= 9; f++) {
    const floorNodes = [];
    if (f === 0) {
      floorNodes.push({ type: 'start', col: 0, row: 0 });
    } else if (f === 4) {
      floorNodes.push({ type: 'town', col: 4, row: 0 });
    } else if (f === 5) {
      floorNodes.push({ type: 'midboss', col: 5, row: 0 });
    } else if (f === 9) {
      const type = currentArea === 3 ? 'lastboss' : 'boss';
      floorNodes.push({ type: type, col: 9, row: 0 });
    } else if (f >= 1 && f <= 3) {
      const step = f - 1;
      for (let r = -1; r <= 1; r++) {
        floorNodes.push({ type: routes1[r + 1][step], col: f, row: r });
      }
    } else if (f >= 6 && f <= 8) {
      const step = f - 6;
      for (let r = -1; r <= 1; r++) {
        floorNodes.push({ type: routes2[r + 1][step], col: f, row: r });
      }
    }
    generatedMap.push(floorNodes);
  }
}

function renderBoardMap(container, isBattleModal = false) {
  if (!container) return;
  container.innerHTML = '';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('rl-js-style-10');
  container.appendChild(svg);

  const nodeElements = [];

  generatedMap.forEach((floorNodes, fIndex) => {
    const columnDiv = document.createElement('div');
    columnDiv.classList.add('rl-js-style-11');

    floorNodes.forEach((node, nIndex) => {
      const btn = document.createElement('div');
      btn.className = 'map-node';
      if (node.type === 'elite' || node.type === 'mimic') {
        btn.classList.add(node.type);
      }
      const imgPath = getMapImageForType(node.type);
      btn.innerHTML = `<img src="${imgPath}" class="node-icon" alt="${NODE_TYPES[node.type].label}">`;
      btn.title = NODE_TYPES[node.type].label;

      if (fIndex < currentFloor) {
        btn.classList.add('completed');
      } else if (fIndex === currentFloor) {
        if (node.row === currentRow) {
          btn.classList.add('completed');
          const token = document.createElement('img');
          token.className = 'player-token';
          token.src = AVATAR_IMAGES[player.class];
          btn.appendChild(token);
        }
      }

      const isNextTarget = fIndex === currentFloor + 1 && !isGameOver && !isBattleModal;
      if (isNextTarget) {
        let canMove = false;
        if (currentFloor === 0 || currentFloor === 4 || currentFloor === 5) {
          canMove = true;
        } else if (fIndex === 4 || fIndex === 5 || fIndex === 9) {
          canMove = true;
        } else {
          canMove = String(node.row) === String(currentRow);
        }

        if (canMove) {
          btn.classList.add('active');
        }
        btn.style.cursor = canMove ? 'pointer' : 'not-allowed';

        btn.addEventListener('click', () => {
          if (!canMove) {
            playSE('invalid');
            showGameAlert(
              '移動不可',
              '現在のルートから外れることはできません。<br>直進するマス（現在地と同じ行のマス）を選んでください。',
            );
            return;
          }
          showGameConfirm(
            '移動の確認',
            `「${NODE_TYPES[node.type].label}」へ移動しますか？`,
            () => {
              currentFloor = fIndex;
              currentRow = node.row;
              currentPathType = node.type;
              enterFloorNode();
            },
            null,
          );
        });
      } else {
        btn.addEventListener('click', () => {
          playSE('invalid');
        });
      }

      columnDiv.appendChild(btn);
      nodeElements.push({ f: fIndex, r: node.row, element: btn });
    });

    container.appendChild(columnDiv);
  });

  setTimeout(() => {
    const containerRect = container.getBoundingClientRect();
    const scale = containerRect.width / container.offsetWidth; // 追加: スケール補正

    for (let f = 0; f < generatedMap.length - 1; f++) {
      const currentNodes = nodeElements.filter((n) => n.f === f);
      const nextNodes = nodeElements.filter((n) => n.f === f + 1);

      currentNodes.forEach((curr) => {
        const currRect = curr.element.getBoundingClientRect();
        // スケール補正を適用
        const currX =
          (currRect.left + currRect.width / 2 - containerRect.left + container.scrollLeft) / scale;
        const currY = (currRect.top + currRect.height / 2 - containerRect.top) / scale;

        nextNodes.forEach((nxt) => {
          if (currentNodes.length > 1 && nextNodes.length > 1) {
            if (curr.r !== nxt.r) return;
          }

          const nxtRect = nxt.element.getBoundingClientRect();
          // スケール補正を適用
          const nxtX =
            (nxtRect.left + nxtRect.width / 2 - containerRect.left + container.scrollLeft) / scale;
          const nxtY = (nxtRect.top + nxtRect.height / 2 - containerRect.top) / scale;

          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', currX);
          line.setAttribute('y1', currY);
          line.setAttribute('x2', nxtX);
          line.setAttribute('y2', nxtY);
          line.setAttribute('stroke', '#444');
          line.setAttribute('stroke-width', '2');

          if (curr.f === currentFloor && nxt.f === currentFloor + 1 && !isBattleModal) {
            line.setAttribute('stroke', '#ffd700');
            line.setAttribute('stroke-width', '3');
            line.style.animation = 'map-pulse 1.5s infinite';
          } else if (curr.f < currentFloor) {
            line.setAttribute('stroke', '#4dabf7');
          }
          svg.appendChild(line);
        });
      });
    }
  }, 50);
}

function getMapImageForType(type) {
  switch (type) {
    case 'start':
      return new URL('../../assets/games/roguelike/images/map/castle.png', import.meta.url).href;
    case 'normal':
      return new URL('../../assets/games/roguelike/images/map/mark_chuui.png', import.meta.url)
        .href;
    case 'elite':
      return new URL('../../assets/games/roguelike/images/map/mark_chuui.png', import.meta.url)
        .href;
    case 'mimic':
      return new URL('../../assets/games/roguelike/images/map/mark_chuui.png', import.meta.url)
        .href;
    case 'inn':
      return new URL(
        '../../assets/games/roguelike/images/map/building_hotel_pet.png',
        import.meta.url,
      ).href;
    case 'fairy':
      return new URL('../../assets/games/roguelike/images/map/mori.png', import.meta.url).href;
    case 'event':
      return new URL('../../assets/games/roguelike/images/map/mark_question.png', import.meta.url)
        .href;
    case 'town':
      return new URL(
        '../../assets/games/roguelike/images/map/omise_shop_tatemono.png',
        import.meta.url,
      ).href;
    case 'midboss':
      if (currentArea === 1)
        return new URL('../../assets/games/roguelike/images/map/doukutsu.png', import.meta.url)
          .href; // エリア1中ボス：バンディット
      if (currentArea === 2)
        return new URL(
          '../../assets/games/roguelike/images/map/mon_gate_western_close.png',
          import.meta.url,
        ).href;
      if (currentArea === 3)
        return new URL('../../assets/games/roguelike/images/map/arashi.png', import.meta.url).href;
      return new URL('../../assets/games/roguelike/images/map/yama_kiri.png', import.meta.url).href;
    case 'boss':
      if (currentArea === 1)
        return new URL('../../assets/games/roguelike/images/map/yama_kiri.png', import.meta.url)
          .href; // エリア1ボス：ダークエルフの森
      return new URL(
        '../../assets/games/roguelike/images/map/building_europe_kojou.png',
        import.meta.url,
      ).href;
    case 'lastboss':
      return new URL(
        '../../assets/games/roguelike/images/map/building_europe_kojou.png',
        import.meta.url,
      ).href;
    default:
      return new URL(
        '../../assets/games/roguelike/images/icons/no_image_square.jpg',
        import.meta.url,
      ).href;
  }
}

function applyMapBackground(wrapper) {
  if (!wrapper) return;
  if (currentArea === 1) {
    // 深いネイビーブルー（澄んだ空気・昼の森の暗がり）
    wrapper.style.background = 'linear-gradient(to bottom, #111d2b, #1b3045)';
  } else if (currentArea === 2) {
    // ダークバーガンディ（夕暮れ・黄昏時）
    wrapper.style.background = 'linear-gradient(to bottom, #2b1311, #451b18)';
  } else {
    // ミッドナイトパープル（真夜中・魔王城）
    wrapper.style.background = 'linear-gradient(to bottom, #100b1a, #1f1533)';
  }
}

function showMapScreen() {
  showScreen(mapScreen);
  renderBoardMap(mapBoard, false);
  if (currentArea === 1) playBGM('area1');
  else if (currentArea === 2) playBGM('area2');
  else playBGM('area3');
  if (mapScrollWrapper) {
    applyMapBackground(mapScrollWrapper);
    setTimeout(() => {
      mapScrollWrapper.scrollLeft = currentFloor * 70;
    }, 100);
  }
}

// --- 9. 各種マス（Node）進入処理 ---
// --- カットシーンデータ定義 ---

const CUTSCENE_PRE = {
  bandit: [
    {
      bg: new URL('../../assets/games/roguelike/images/map/doukutsu.png', import.meta.url).href,
      portraits: [
        {
          src: new URL(
            '../../assets/games/roguelike/images/monsters/character_sanzoku.png',
            import.meta.url,
          ).href,
          size: '130px',
        },
      ],
      speaker: '山賊',
      lines: [
        'この一帯を荒らし回っているのはこのオレだ…！',
        'お前みたいな旅人は格好の獲物だ。生きて帰しちゃいけねぇ！',
      ],
    },
  ],
  boss_area1: [
    {
      bg: new URL('../../assets/games/roguelike/images/map/yama_kiri.png', import.meta.url).href,
      portraits: [
        {
          src: new URL(
            '../../assets/games/roguelike/images/monsters/fantasy_dark_elf.png',
            import.meta.url,
          ).href,
          size: '130px',
        },
      ],
      speaker: 'ダークエルフ',
      lines: [
        'オマエ…\nコノ森ヲ\u30fb\u30fb\u30fb荒ラス者\u30fb\u30fb\u30fb？',
        'タチサレ\u30fb\u30fb\u30fb\nタチサレ\u30fb\u30fb\u30fb！\n（正気を失った目でこちらを睨みつけてくる）',
      ],
    },
  ],
  midboss_area2: [
    {
      bg: new URL(
        '../../assets/games/roguelike/images/map/mon_gate_western_close.png',
        import.meta.url,
      ).href,
      portraits: [
        {
          src: new URL(
            '../../assets/games/roguelike/images/monsters/fantasy_golem.png',
            import.meta.url,
          ).href,
          size: '130px',
        },
      ],
      speaker: '─── 状況 ───',
      lines: [
        '町の入口前に、石造りの巨体が立ち塞がっている。',
        'なんと、ゴーレムが突然こちらに向かって動き出した！\n…戦うしかないようだ。',
      ],
    },
  ],
  boss_area2: [
    {
      bg: new URL(
        '../../assets/games/roguelike/images/map/building_europe_kojou.png',
        import.meta.url,
      ).href,
      portraits: [
        {
          src: new URL(
            '../../assets/games/roguelike/images/monsters/fantasy_dracula2.png',
            import.meta.url,
          ).href,
          size: '130px',
        },
      ],
      speaker: 'ヴァンパイア',
      lines: [
        'おやおや…\nこんな辺鄙な城までご足労いただけるとは。',
        'まさか単身で姫を取り返しにきたのかな？\n感心はするが、そうはいかない。',
        '招かざる客人には\u2015\u2015\nお引き取り願おうか。',
      ],
    },
  ],
  midboss_area3: [
    {
      bg: new URL('../../assets/games/roguelike/images/map/arashi.png', import.meta.url).href,
      portraits: [],
      speaker: '─── 状況 ───',
      lines: [
        '荒れ狂う波の間から、巨大な影が近づいてくる\u30fb\u30fb\u30fb。',
        '海底から湧き上がるような咆哮が、空気を震わせた！',
      ],
    },
  ],
};

// エリア1中ボス（バンディット）の戦闘前カットシーン
const CUTSCENE_PRE_MIDBOSS_AREA1 = [
  {
    bg: new URL('../../assets/games/roguelike/images/map/doukutsu.png', import.meta.url).href,
    portraits: [
      {
        src: new URL(
          '../../assets/games/roguelike/images/monsters/character_sanzoku.png',
          import.meta.url,
        ).href,
        size: '140px',
      },
    ],
    speaker: 'バンディット',
    lines: [
      'ほぉ…よくここまで来たな。',
      'いいだろう、オレが直々に相手してやる。\nただで、生きて帰れると思うなよ！',
    ],
  },
];

function getPreBattleCutscene() {
  if (currentPathType === 'midboss' && currentArea === 1) return CUTSCENE_PRE_MIDBOSS_AREA1;
  if (currentPathType === 'boss' && currentArea === 1) return CUTSCENE_PRE.boss_area1;
  if (currentPathType === 'midboss' && currentArea === 2) return CUTSCENE_PRE.midboss_area2;
  if (currentPathType === 'boss' && currentArea === 2) return CUTSCENE_PRE.boss_area2;
  if (currentPathType === 'midboss' && currentArea === 3) return CUTSCENE_PRE.midboss_area3;
  return null;
}

function enterFloorNode() {
  updateHeaderBar();
  if (currentPathType === 'start') {
    showMapScreen();
  } else if (currentPathType === 'inn') {
    showInnScreen();
  } else if (currentPathType === 'fairy') {
    showFairyScreen();
  } else if (currentPathType === 'town') {
    showTownScreen();
  } else if (currentPathType === 'event') {
    triggerEventNode();
  } else {
    const scenes = getPreBattleCutscene();
    if (scenes) {
      if (currentPathType === 'midboss' && currentArea === 1) playBGM('bandit_pre');
      else if (currentPathType === 'boss' && currentArea === 1) playBGM('darkelf_pre');
      else if (currentPathType === 'midboss' && currentArea === 2) playBGM('golem_pre');
      else if (currentPathType === 'boss' && currentArea === 2) playBGM('vampire_pre');
      else if (currentPathType === 'midboss' && currentArea === 3) playBGM('leviathan_pre');
      else if (currentPathType === 'lastboss') playBGM('maou_pre');

      showCutscene(scenes, () => startBattle());
    } else {
      startBattle();
    }
  }
}

// --- 10. 宿（回復） ---
const btnInnRestHalf = document.getElementById('btn-inn-rest-half');
const btnInnRestFull = document.getElementById('btn-inn-rest-full');
const btnInnLeave = document.getElementById('btn-inn-leave');

function showInnScreen() {
  playBGM('inn');
  showScreen(innScreen);
}

if (btnInnRestHalf) {
  btnInnRestHalf.addEventListener('click', () => {
    const cost = player.relics.includes('creditcard_black') ? 7 : 15;
    if (player.gold >= cost) {
      showGameConfirm(
        '小休憩',
        `${cost}ゴールドを支払い小休憩しますか？<br>(HPとMPが最大値の50%回復します)`,
        () => {
          player.gold -= cost;
          playSE('inn');
          const healHp = Math.floor(player.maxHp * 0.5) || 1;
          const healMp = Math.floor(player.maxMp * 0.5) || 1;
          player.hp = Math.min(player.maxHp, player.hp + healHp);
          player.mp = Math.min(player.maxMp, player.mp + healMp);
          showGameAlert('小休憩完了', `HPが ${healHp} 、MPが ${healMp} 回復しました！`, () => {
            proceedNextFloor();
          });
        },
      );
    } else {
      showGameAlert('宿屋', 'ゴールドが足りません！');
    }
  });
}

if (btnInnRestFull) {
  btnInnRestFull.addEventListener('click', () => {
    const cost = player.relics.includes('creditcard_black') ? 15 : 30;
    if (player.gold >= cost) {
      showGameConfirm(
        '宿泊',
        `${cost}ゴールドを支払い宿泊しますか？<br>(HP・MPが全回復し、状態異常が全解除されます)`,
        () => {
          player.gold -= cost;
          playSE('inn');
          player.hp = player.maxHp;
          player.mp = player.maxMp;
          player.poison = 0;
          player.paralyze = 0;
          showGameAlert('宿泊完了', '完全に回復しました！', () => {
            proceedNextFloor();
          });
        },
      );
    } else {
      showGameAlert('宿屋', 'ゴールドが足りません！');
    }
  });
}

if (btnInnLeave) {
  btnInnLeave.addEventListener('click', () => {
    proceedNextFloor();
  });
}

// --- 11. ショップ特別サービス ---
const btnShopServiceLeave = document.getElementById('btn-shop-service-leave');
const shopServiceCardList = document.getElementById('shop-service-card-list');

function showShopServiceScreen(type) {
  showScreen(shopServiceScreen);
  const isBlackCard = player.relics.includes('creditcard_black');
  const cost = isBlackCard ? 10 : 20;
  const title = document.getElementById('shop-service-title');
  const desc = document.getElementById('shop-service-desc');
  if (title) title.textContent = type === 'upgrade' ? 'カード強化' : 'カード削除';
  if (desc)
    desc.textContent =
      type === 'upgrade'
        ? `${cost}ゴールドを支払い、手札のカードを1枚「強化（+）」します。`
        : `${cost}ゴールドを支払い、手札のカードを1枚「削除」します。`;

  if (shopServiceCardList) {
    shopServiceCardList.innerHTML = '';
    const targets = [...player.deck, ...player.discard, ...player.hand];

    if (targets.length === 0) {
      shopServiceCardList.innerHTML = '<div class="shop-empty-msg">カードがありません</div>';
    } else {
      targets.forEach((cardInstance) => {
        const isFullyUpgraded = (cardInstance.upgradeCount || 0) >= 1;
        const btn = makeCardEl(cardInstance, () => {
          if (type === 'upgrade' && isFullyUpgraded) return;
          if (player.gold >= cost) {
            let compareWrap = null;
            if (type === 'upgrade') {
              compareWrap = document.createElement('div');
              compareWrap.className = 'upgrade-compare-wrap';

              const colBefore = document.createElement('div');
              colBefore.className = 'upgrade-compare-col';
              const labelBefore = document.createElement('span');
              labelBefore.className = 'upgrade-compare-label';
              labelBefore.textContent = '現在';
              const cardBeforeEl = makeCardEl(cardInstance, null);
              cardBeforeEl.style.cursor = 'default';
              colBefore.appendChild(labelBefore);
              colBefore.appendChild(cardBeforeEl);

              const arrowEl = document.createElement('div');
              arrowEl.className = 'upgrade-compare-arrow';
              arrowEl.textContent = '➔';

              const upgradedObj = upgradeCard({ ...cardInstance });
              const colAfter = document.createElement('div');
              colAfter.className = 'upgrade-compare-col';
              const labelAfter = document.createElement('span');
              labelAfter.className = 'upgrade-compare-label is-upgraded';
              labelAfter.textContent = '強化後';
              const cardAfterEl = makeCardEl(upgradedObj, null);
              cardAfterEl.style.cursor = 'default';
              colAfter.appendChild(labelAfter);
              colAfter.appendChild(cardAfterEl);

              compareWrap.appendChild(colBefore);
              compareWrap.appendChild(arrowEl);
              compareWrap.appendChild(colAfter);
            }

            showGameConfirm(
              type === 'upgrade' ? 'カードの強化' : 'カードの削除',
              `「${cardInstance.name}」を ${cost}ゴールドで${type === 'upgrade' ? '強化' : '削除'}しますか？`,
              () => {
                player.gold -= cost;
                let index = player.deck.indexOf(cardInstance);
                if (index !== -1) {
                  if (type === 'upgrade') player.deck[index] = upgradeCard(player.deck[index]);
                  else player.deck.splice(index, 1);
                } else {
                  index = player.discard.indexOf(cardInstance);
                  if (index !== -1) {
                    if (type === 'upgrade')
                      player.discard[index] = upgradeCard(player.discard[index]);
                    else player.discard.splice(index, 1);
                  } else {
                    index = player.hand.indexOf(cardInstance);
                    if (index !== -1) {
                      if (type === 'upgrade') player.hand[index] = upgradeCard(player.hand[index]);
                      else player.hand.splice(index, 1);
                    }
                  }
                }
                if (type === 'upgrade') {
                  shopUpgradeUsed = true;
                  if (btnTownUpgrade) {
                    btnTownUpgrade.style.opacity = '0.5';
                    btnTownUpgrade.style.cursor = 'not-allowed';
                  }
                } else {
                  shopRemoveUsed = true;
                  if (btnTownRemove) {
                    btnTownRemove.style.opacity = '0.5';
                    btnTownRemove.style.cursor = 'not-allowed';
                  }
                }
                showGameAlert(
                  type === 'upgrade' ? '強化成功' : '削除成功',
                  `「${cardInstance.name}」を${type === 'upgrade' ? '強化' : '削除'}しました！`,
                  () => {
                    renderShop();
                    updateHeaderBar();
                    showScreen(townScreen);
                  },
                );
              },
              null,
              compareWrap,
            );
          } else {
            showGameAlert('ショップ', 'ゴールドが足りません！');
          }
        });
        if (type === 'upgrade') {
          btn.style.cursor = isFullyUpgraded ? 'not-allowed' : 'pointer';
          if (isFullyUpgraded) {
            const mask = document.createElement('div');
            mask.classList.add('rl-js-style-12');
            btn.appendChild(mask);
          } else if (player.gold < 20) {
            btn.style.opacity = '0.5';
          }
        } else {
          btn.style.cursor = 'pointer';
          if (player.gold < 20) btn.style.opacity = '0.5';
        }
        shopServiceCardList.appendChild(btn);
      });
    }
  }
}

if (btnShopServiceLeave) {
  btnShopServiceLeave.addEventListener('click', () => {
    showScreen(townScreen);
  });
}

function showFairyScreen() {
  playBGM('darkelf_pre');
  showScreen(eventScreen);
  if (document.getElementById('event-image')) {
    document.getElementById('event-image').src = new URL(
      '../../assets/games/roguelike/images/characters/fantasy_pixy2.png',
      import.meta.url,
    ).href;
  }
  if (document.getElementById('event-title'))
    document.getElementById('event-title').textContent = '妖精の泉';
  if (document.getElementById('event-text'))
    document.getElementById('event-text').textContent =
      '澄み切った泉の周りに、妖精たちが集まって遊んでいます。\n「遊んでくれるの？お礼にいいことしてあげる！」';

  const container = document.getElementById('event-options');
  if (container) {
    container.innerHTML = '';

    const possibleEffects = [
      {
        text: '最大HP +1',
        action: () => {
          player.maxHp += 1;
          player.hp = Math.min(player.maxHp, player.hp + 1);
          playSE('heal');
          updateHeaderBar();
          showGameAlert('妖精の祝福', '最大HPが 1 上昇した！', () => proceedNextFloor());
        },
      },
      {
        text: '最大MP +1',
        action: () => {
          player.maxMp += 1;
          player.mp = Math.min(player.maxMp, player.mp + 1);
          playSE('heal');
          updateHeaderBar();
          showGameAlert('妖精の祝福', '最大MPが 1 上昇した！', () => proceedNextFloor());
        },
      },
      {
        text: 'HPを全回復',
        action: () => {
          player.hp = player.maxHp;
          playSE('heal');
          updateHeaderBar();
          showGameAlert('妖精の祝福', 'HPが全回復した！', () => proceedNextFloor());
        },
      },
      {
        text: 'MPを全回復',
        action: () => {
          player.mp = player.maxMp;
          playSE('heal');
          updateHeaderBar();
          showGameAlert('妖精の祝福', 'MPが全回復した！', () => proceedNextFloor());
        },
      },
      {
        text: 'ランダムなカード1枚強化',
        action: () => {
          const unupgraded = player.deck.filter((c) => (c.upgradeCount || 0) < 3);
          if (unupgraded.length > 0) {
            shuffle(unupgraded);
            const target = unupgraded[0];
            const index = player.deck.findIndex((c) => c === target);
            if (index !== -1) {
              player.deck[index] = upgradeCard(player.deck[index]);
              playSE('reward_select');
              showGameAlert(
                '妖精の祝福',
                `カード「${target.name}」が「${target.name}+」に強化された！`,
                () => proceedNextFloor(),
              );
            }
          } else {
            showGameAlert('妖精の祝福', '強化できるカードがなかった…', () => proceedNextFloor());
          }
        },
      },
      {
        text: '痛いけど我慢する (最大HPの30%ダメージを受け、レリック獲得)',
        action: () => {
          const dmg = Math.floor(player.maxHp * 0.3) || 1;
          player.hp -= dmg;
          playSE('damage');
          updateHeaderBar();
          if (player.hp <= 0) {
            showGameAlert('妖精の悪戯', `激しい痛みに耐えきれず、あなたは倒れてしまった…`);
            isGameOver = true;
            showResultOverlay(false);
            return;
          }
          const unowned = Object.keys(RELIC_DB).filter(
            (r) => !player.relics.includes(r) && !RELIC_DB[r].isFixed,
          );
          if (unowned.length > 0) {
            shuffle(unowned);
            const picked = unowned[0];
            addRelic(picked);
            showGameAlert(
              '妖精の悪戯',
              `${dmg} ダメージを受けたが、レリック「${RELIC_DB[picked].name}」を手に入れた！`,
              () => proceedNextFloor(),
            );
          } else {
            showGameAlert(
              '妖精の悪戯',
              `${dmg} ダメージを受けたが、見つかるレリックがなかった…`,
              () => proceedNextFloor(),
            );
          }
        },
      },
    ];

    shuffle(possibleEffects);
    const choices = possibleEffects.slice(0, 3);

    choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.style.width = '100%';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => {
        choice.action();
        // action内部でproceedNextFloorを呼ぶためここでは不要
      });
      container.appendChild(btn);
    });
  }
}

// --- 12. 街（カード/アイテム購入ショップ） ---
const townCards = document.getElementById('town-cards');
const townItems = document.getElementById('town-items');
const btnTownLeave = document.getElementById('btn-town-leave');
const btnTownUpgrade = document.getElementById('btn-town-upgrade');
const btnTownRemove = document.getElementById('btn-town-remove');
let shopCardsPool = [];
let shopItemsPool = [];
let shopUpgradeUsed = false;
let shopRemoveUsed = false;

function showTownScreen() {
  playBGM('town');
  showScreen(townScreen);
  shopUpgradeUsed = false;
  shopRemoveUsed = false;
  if (btnTownUpgrade) {
    btnTownUpgrade.style.opacity = '1';
    btnTownUpgrade.style.cursor = 'pointer';
  }
  if (btnTownRemove) {
    btnTownRemove.style.opacity = '1';
    btnTownRemove.style.cursor = 'pointer';
  }

  // ショップには特殊カード(special)は出現しないようにする
  const pool = [...REWARD_POOL].filter((id) => CARD_DB[id] && CARD_DB[id].category !== 'special');
  shuffle(pool);
  const area1UpgradedIdx = Math.floor(Math.random() * 6);
  shopCardsPool = pool.slice(0, 6).map((id, idx) => {
    let isBargain = idx === 0;
    let isUpgraded = false;
    if (currentArea === 1) {
      if (idx === area1UpgradedIdx) isUpgraded = true;
    } else if (currentArea === 2) {
      isUpgraded = Math.random() < 0.5;
    } else if (currentArea >= 3) {
      isUpgraded = true;
    }
    return { id, bought: false, upgraded: isUpgraded, bargain: isBargain };
  });
  const allItemKeys = Object.keys(ITEM_DB).filter((id) => !ITEM_DB[id].notForSale);
  shuffle(allItemKeys);
  shopItemsPool = allItemKeys.slice(0, 3).map((id) => ({ id, bought: false }));
  renderShop();
}

function renderShop() {
  const hasBlackCard = player.relics.includes('creditcard_black');

  if (townCards) {
    townCards.innerHTML = '';
    shopCardsPool.forEach((item) => {
      let card = { ...CARD_DB[item.id] };
      if (item.upgraded) card = upgradeCard(card);
      const div = document.createElement('div');
      div.classList.add('rl-js-style-13');
      const el = makeCardEl(card, false);
      el.classList.add('rl-js-style-14');
      if (item.bought) {
        el.style.opacity = '0.2';
        el.style.cursor = 'not-allowed';
        const boughtText = document.createElement('span');
        boughtText.classList.add('rl-js-style-15');
        boughtText.textContent = '売約済';
        div.appendChild(el);
        div.appendChild(boughtText);
      } else {
        el.addEventListener('click', () => {
          showCardDetailModal(card);
        });
        const standardPrice = item.upgraded ? 30 : 20;
        const basePrice = item.bargain ? Math.floor(standardPrice * 0.5) : standardPrice;
        const price = hasBlackCard ? Math.floor(basePrice * 0.5) : basePrice;
        const bgColor = '#1976d2';
        const borderColor = '#1565c0';
        const priceColor = item.bargain ? '#4ade80' : '#fff';

        const buyBtn = document.createElement('button');
        buyBtn.className = 'btn btn-secondary btn-sm';
        buyBtn.style.cssText = `font-size: 0.75rem; padding: 4px 10px; margin-top: 4px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; width: auto; min-width: 60px; height: auto; min-height: 28px; border-radius: 8px; background-color: ${bgColor}; border: 1px solid ${borderColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.3);`;
        buyBtn.innerHTML = `<span class="shop-price-value" style="color: ${priceColor}; font-weight: bold;">${price}</span> <span class="shop-price-label">Gで購入</span>`;
        buyBtn.addEventListener('click', () => {
          if (player.gold >= price) {
            showGameConfirm(
              '商品の購入',
              `「${card.name}」を${price}ゴールドで購入しますか？`,
              () => {
                player.gold -= price;
                playSE('reward_select');
                unlockCard(card.id);
                player.discard.push(card);
                item.bought = true;
                showGameAlert(
                  '購入完了',
                  `「${card.name}」を購入し、デッキに追加しました！`,
                  () => {
                    renderShop();
                    updateHeaderBar();
                  },
                );
              },
            );
          } else {
            showGameAlert('ショップ', 'ゴールドが足りません！');
          }
        });
        div.appendChild(el);
        div.appendChild(buyBtn);
      }
      townCards.appendChild(div);
    });
  }

  if (townItems) {
    townItems.innerHTML = '';

    // 1~3. アイテム3つ
    shopItemsPool.forEach((shopItem) => {
      const item = ITEM_DB[shopItem.id];
      const div = document.createElement('div');
      div.classList.add('rl-js-style-16');
      const btn = document.createElement('button');
      btn.classList.add('rl-js-style-17');
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.classList.add('rl-js-style-18');
      btn.appendChild(img);
      if (shopItem.bought) {
        btn.style.opacity = '0.2';
        btn.style.cursor = 'not-allowed';
        const boughtText = document.createElement('span');
        boughtText.classList.add('rl-js-style-19');
        boughtText.textContent = '売約済';
        div.appendChild(btn);
        div.appendChild(boughtText);
      } else {
        btn.addEventListener('click', () => {
          showItemDetailModal(item, 'item');
        });
        const basePrice = item.price || 20;
        const price = hasBlackCard ? Math.floor(basePrice * 0.5) : basePrice;
        const buyBtn = document.createElement('button');
        buyBtn.className = 'btn btn-secondary btn-sm';
        buyBtn.classList.add('rl-js-style-20');
        buyBtn.textContent = `${price} Gで購入`;
        buyBtn.addEventListener('click', () => {
          if (player.gold >= price) {
            let target = player.items.find((i) => i.id === shopItem.id);
            if (target && !target.used) {
              showGameAlert('ショップ', '同じアイテムをすでに所持しています！');
              return;
            }
            showGameConfirm(
              '商品の購入',
              `「${item.name}」を${price}ゴールドで購入しますか？`,
              () => {
                player.gold -= price;
                if (target) {
                  target.used = false;
                } else {
                  player.items.push({ id: shopItem.id, used: false });
                }
                unlockItem(shopItem.id);
                shopItem.bought = true;
                showGameAlert('購入完了', `「${item.name}」を購入しました！`, () => {
                  renderShop();
                  updateHeaderBar();
                  renderRelicsAndItems();
                });
              },
            );
          } else {
            showGameAlert('ショップ', 'ゴールドが足りません！');
          }
        });
        div.appendChild(btn);
        div.appendChild(buyBtn);
      }
      townItems.appendChild(div);
    });

    // 4. ランダム未所持レリック枠（存在する場合）
    const unownedRelics = Object.keys(RELIC_DB).filter(
      (r) => !player.relics.includes(r) && !RELIC_DB[r].isFixed,
    );
    if (unownedRelics.length > 0) {
      const randomRelicId = unownedRelics[0];
      const relic = RELIC_DB[randomRelicId];
      const div = document.createElement('div');
      div.classList.add('rl-js-style-16');
      const btn = document.createElement('button');
      btn.classList.add('rl-js-style-17');
      const img = document.createElement('img');
      img.src = relic.image;
      img.alt = relic.name;
      img.classList.add('rl-js-style-18');
      btn.appendChild(img);
      btn.addEventListener('click', () => {
        showItemDetailModal(relic, 'relic');
      });
      const basePrice = 40;
      const price = hasBlackCard ? Math.floor(basePrice * 0.5) : basePrice;
      const buyBtn = document.createElement('button');
      buyBtn.className = 'btn btn-secondary btn-sm';
      buyBtn.classList.add('rl-js-style-20');
      buyBtn.textContent = `${price} Gで購入`;
      buyBtn.addEventListener('click', () => {
        if (player.gold >= price) {
          showGameConfirm(
            '秘宝の購入',
            `レリック「${relic.name}」を${price}ゴールドで購入しますか？`,
            () => {
              player.gold -= price;
              addRelic(randomRelicId);
              showGameAlert('購入完了', `レリック「${relic.name}」を購入しました！`, () => {
                renderShop();
                updateHeaderBar();
              });
            },
          );
        } else {
          showGameAlert('ショップ', 'ゴールドが足りません！');
        }
      });
      div.appendChild(btn);
      div.appendChild(buyBtn);
      townItems.appendChild(div);
    }

    // 5. ブラックカード (定価200G・固定配置最右)
    const blackCard = RELIC_DB['creditcard_black'];
    const divB = document.createElement('div');
    divB.classList.add('rl-js-style-16');
    const btnB = document.createElement('button');
    btnB.classList.add('rl-js-style-17');
    const imgB = document.createElement('img');
    imgB.src = blackCard.image;
    imgB.alt = blackCard.name;
    imgB.classList.add('rl-js-style-18');
    btnB.appendChild(imgB);

    if (hasBlackCard) {
      btnB.style.opacity = '0.2';
      btnB.style.cursor = 'not-allowed';
      const boughtText = document.createElement('span');
      boughtText.classList.add('rl-js-style-19');
      boughtText.textContent = 'SOLDOUT';
      divB.appendChild(btnB);
      divB.appendChild(boughtText);
    } else {
      btnB.addEventListener('click', () => {
        showItemDetailModal(blackCard, 'relic');
      });
      const priceB = 200;
      const buyBtnB = document.createElement('button');
      buyBtnB.className = 'btn btn-secondary btn-sm';
      buyBtnB.classList.add('rl-js-style-20');
      buyBtnB.textContent = `${priceB} Gで購入`;
      buyBtnB.addEventListener('click', () => {
        if (player.gold >= priceB) {
          showGameConfirm(
            'VIP特権の購入',
            `「${blackCard.name}」を${priceB}ゴールドで購入しますか？<br><br>※買い出し半額＆獲得ゴールド+50%が永続適用されます！`,
            () => {
              player.gold -= priceB;
              addRelic('creditcard_black');
              showGameAlert('購入完了', `「${blackCard.name}」を入手しました！全施設が半額になります！`, () => {
                renderShop();
                updateHeaderBar();
              });
            },
          );
        } else {
          showGameAlert('ショップ', 'ゴールドが足りません！');
        }
      });
      divB.appendChild(btnB);
      divB.appendChild(buyBtnB);
    }
    townItems.appendChild(divB);
  }
}

if (btnTownLeave) {
  btnTownLeave.addEventListener('click', () => {
    showGameConfirm('街を出る', '本当に街を出ますか？<br>やり残したことはありませんか？', () => {
      proceedNextFloor();
    });
  });
}
if (btnTownUpgrade) {
  btnTownUpgrade.addEventListener('click', () => {
    if (shopUpgradeUsed) return;
    showShopServiceScreen('upgrade');
  });
}
if (btnTownRemove) {
  btnTownRemove.addEventListener('click', () => {
    if (shopRemoveUsed) return;
    showShopServiceScreen('remove');
  });
}

// --- 13. 未知のイベント ---
// --- 13. 未知のイベント ---
function drinkMadScientistPotion() {
  const roll = Math.random();
  if (roll < 0.25) {
    // 大成功 (25%)
    player.maxHp += 5;
    player.maxMp += 3;
    player.hp += 5;
    player.mp += 3;
    playSE('heal');
    updateHeaderBar();
    showGameAlert(
      '大成功！',
      '「ヒャーッハッハ！完璧な配合だ！」\n身体の底から力が湧いてくる！最大HPが5、最大MPが3上昇した！',
      () => proceedNextFloor(),
    );
  } else if (roll < 0.5) {
    // 成功 (25%)
    const subRoll = Math.random();
    if (subRoll < 0.5) {
      player.gold += 50;
      playSE('coin');
      updateHeaderBar();
      showGameAlert(
        '成功',
        '「おっと、これは錬金術の副産物だ。持っていけ！」\n50ゴールドを手に入れた！',
        () => proceedNextFloor(),
      );
    } else {
      player.hp = player.maxHp;
      player.mp = player.maxMp;
      playSE('heal');
      updateHeaderBar();
      showGameAlert('成功', '「どうだ？疲れが吹っ飛んだだろう！」\nHPとMPが全回復した！', () =>
        proceedNextFloor(),
      );
    }
  } else if (roll < 0.75) {
    // 失敗 (25%)
    const dmg = Math.floor(player.maxHp * 0.3) || 1;
    player.hp -= dmg;
    playSE('damage');
    updateHeaderBar();
    if (player.hp <= 0) {
      showGameAlert(
        '実験失敗…',
        `「あちゃー、少し刺激が強すぎたか…」\n${dmg} のダメージを受け、あなたは倒れ伏した…`,
      );
      isGameOver = true;
      showResultOverlay(false);
    } else {
      showGameAlert(
        '失敗',
        `「あちゃー、少し刺激が強すぎたか…」\n身体が焼け焦げるように熱い！ ${dmg} のダメージを受けた！`,
        () => proceedNextFloor(),
      );
    }
  } else {
    // 大失敗 (25%)
    const lostHp = 2;
    const lostGold = Math.floor(player.gold * 0.5);
    player.maxHp = Math.max(1, player.maxHp - lostHp);
    player.hp = Math.min(player.hp, player.maxHp);
    player.gold -= lostGold;
    playSE('damage');
    updateHeaderBar();
    showGameAlert(
      '大失敗！',
      `「ドッカーン！！」\n大爆発が起きた！\n最大HPが ${lostHp} 減少し、所持金が ${lostGold}G 吹き飛んだ！`,
      () => proceedNextFloor(),
    );
  }
}

const eventsList = MAP_EVENTS.map((evt) => ({
  ...evt,
  options: evt.options.map((opt) => ({
    text: opt.text,
    isCustomNav: opt.isCustomNav,
    action: () => {
      if (opt.type === 'drink_potion') {
        drinkMadScientistPotion();
      } else if (opt.type === 'leave') {
        showGameAlert(
          '拒絶',
          '「ちぇっ、つまらないヤツだ」\nあなたは急いでその場を立ち去りました。',
          () => {
            proceedNextFloor();
          },
        );
      }
    },
  })),
}));

function triggerEventNode() {
  showScreen(eventScreen);
  const evt = eventsList[Math.floor(Math.random() * eventsList.length)];
  if (document.getElementById('event-image')) {
    document.getElementById('event-image').src =
      evt.image ||
      new URL('../../assets/games/roguelike/images/icons/no_image_square.jpg', import.meta.url)
        .href;
  }
  if (document.getElementById('event-title'))
    document.getElementById('event-title').textContent = evt.title;
  if (document.getElementById('event-text'))
    document.getElementById('event-text').textContent = evt.text;
  const container = document.getElementById('event-options');
  if (container) {
    container.innerHTML = '';
    evt.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.style.width = '100%';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        opt.action();
        if (!opt.isCustomNav) proceedNextFloor();
      });
      container.appendChild(btn);
    });
  }
}

function proceedNextFloor() {
  // マップへ戻るときは必ず isGameOver をリセット（これがないと次マスが選択不能になる）
  isGameOver = false;
  if (currentFloor >= 9) {
    if (currentPathType === 'boss') {
      currentArea++;
      currentFloor = 0;
      player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp / 2));
      generateAreaMap();

      // ===== エリア開始カットシーン =====
      if (currentArea === 2) {
        const scenes = [
          {
            portraits: [
              {
                src: new URL(
                  '../../assets/games/roguelike/images/characters/royal_daijin.png',
                  import.meta.url,
                ).href,
                size: '130px',
              },
            ],
            speaker: '大臣',
            lines: [
              '聖剣に選ばれし者よ、お耳を拝借いたします。',
              'ヴァンパイアにさらわれたこの国の姫を、どうかお救いいただけませぬでしょうか。',
              'ヴァンパイアの城へ向かった我が国の兵どころか、\n途中の街に駐在しております兵からの連絡すら途絶えております。',
              '気丈に振る舞っておられる王の心境を思うと、\n臣下として居ても立ってもいられぬのです。\nどうか、よろしくお願い申し上げます。',
            ],
          },
        ];
        showMapScreen();
        showCutscene(scenes, () => {
          showGameAlert('エリア2へ', `エリア 2 に到達しました！<br>HPが最大値の半分回復しました。`);
        });
      } else if (currentArea === 3) {
        const scenes = [
          {
            portraits: [
              {
                src: new URL(
                  '../../assets/games/roguelike/images/characters/royal_king.png',
                  import.meta.url,
                ).href,
                size: '130px',
              },
              {
                src: new URL(
                  '../../assets/games/roguelike/images/characters/royal_princess.png',
                  import.meta.url,
                ).href,
                size: '130px',
              },
              {
                src: new URL(
                  '../../assets/games/roguelike/images/characters/royal_daijin.png',
                  import.meta.url,
                ).href,
                size: '130px',
              },
            ],
            speaker: '王',
            lines: [
              '姫を救い出してくれたこと、誠に感謝するぞ。',
              '残るは魔王のみ。余はお前の力を信じておる。\nどうか、ご無事で。',
            ],
          },
          {
            portraits: [
              {
                src: new URL(
                  '../../assets/games/roguelike/images/characters/royal_princess.png',
                  import.meta.url,
                ).href,
                size: '130px',
              },
            ],
            speaker: '姫',
            lines: [
              'どうかご無事に帰ってきてくださいまし。\nわたくしたちはいつもあなたのことを祈っております。',
            ],
          },
        ];
        showMapScreen();
        showCutscene(scenes, () => {
          showGameAlert('エリア3へ', `エリア 3 に到達しました！<br>HPが最大値の半分回復しました。`);
        });
      } else {
        showMapScreen();
        showGameAlert(
          'エリアクリア！',
          `次のエリア ${currentArea} に到達しました！<br>HPが最大値の半分回復しました。`,
        );
      }
    }
  } else {
    showMapScreen();
  }
}

// --- 14. アイテム確認ダイアログ & 使用 ---
let pendingUseItemId = '';

function renderRelicsAndItems() {
  const footerPlayerItemsEl = document.getElementById('footer-player-items');

  if (footerPlayerItemsEl) footerPlayerItemsEl.innerHTML = '';

  player.items.forEach((itemState) => {
    const item = ITEM_DB[itemState.id];
    if (item) {
      if (footerPlayerItemsEl) {
        const btnF = document.createElement('button');
        btnF.className = 'btn-item';
        btnF.title = `${item.name}: ${item.desc}`;
        const battleLayout = document.querySelector('.battle-layout');
        const inBattle = battleLayout && battleLayout.style.display !== 'none';
        const canClick = inBattle && !itemState.used && isPlayerTurn && !isGameOver;

        btnF.style.cssText = `width:28px; height:28px; padding:2px; border:1px solid #444; border-radius:4px; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; opacity:${itemState.used ? '0.25' : '1'}; flex-shrink:0; cursor:pointer;`;
        const imgF = document.createElement('img');
        imgF.src = item.image;
        imgF.alt = item.name;
        imgF.classList.add('rl-js-style-21');
        btnF.appendChild(imgF);

        btnF.addEventListener('click', () => {
          pendingUseItemId = itemState.id;
          const titleEl = document.getElementById('item-confirm-title');
          const textEl = document.getElementById('item-confirm-text');
          const btnYes = document.getElementById('btn-item-confirm-yes');
          const btnNo = document.getElementById('btn-item-confirm-no');
          const modal = document.getElementById('item-confirm-modal');
          const imgEl = document.getElementById('item-confirm-image');

          if (textEl && modal && btnYes && btnNo && titleEl) {
            if (imgEl) {
              imgEl.src = item.image || '';
              imgEl.style.display = item.image ? 'block' : 'none';
            }
            if (canClick) {
              titleEl.textContent = 'アイテムの使用確認';
              textEl.innerHTML = `<strong>${item.name}</strong>を使用しますか？<br><br><span class="item-desc-text">${item.desc}</span>`;
              btnYes.style.display = 'block';
              btnNo.textContent = 'いいえ';
            } else {
              titleEl.textContent = 'アイテムの詳細';
              let reason = '※アイテムは戦闘中（かつ自分のターン）にのみ使用可能です。';
              if (itemState.used) reason = '※このアイテムは既に使用済みです。';
              textEl.innerHTML = `<strong>${item.name}</strong><br><br><span class="item-detail-text">${item.desc}</span><br><br><span class="item-reason-text">${reason}</span>`;
              btnYes.style.display = 'none';
              btnNo.textContent = '閉じる';
            }
            modal.style.display = 'flex';
          }
        });
        footerPlayerItemsEl.appendChild(btnF);
      }
    }
  });
}

const btnFooterViewDeck = document.getElementById('btn-footer-view-deck');
if (btnFooterViewDeck) {
  btnFooterViewDeck.addEventListener('click', () => {
    openDeckViewer();
  });
}

if (document.getElementById('btn-item-confirm-yes')) {
  document.getElementById('btn-item-confirm-yes').addEventListener('click', () => {
    if (itemConfirmModal) itemConfirmModal.style.display = 'none';
    executeUseItem(pendingUseItemId);
  });
}
if (document.getElementById('btn-item-confirm-no')) {
  document.getElementById('btn-item-confirm-no').addEventListener('click', () => {
    if (itemConfirmModal) itemConfirmModal.style.display = 'none';
  });
}

function executeUseItem(itemId) {
  if (!isPlayerTurn || isGameOver) return;
  const itemIndex = player.items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) return;
  const itemState = player.items[itemIndex];
  if (itemState.used) return;

  // 使用したアイテムは所持品から完全に削除する（デバッグ用アイテム以外）
  if (itemId !== 'debug_kill') {
    player.items.splice(itemIndex, 1);
  }

  if (itemId === 'debug_kill') {
    if (enemy) {
      enemy.hp = Math.max(0, enemy.hp - 100);
      logMessage(`デバッグアイテム「死神の鎌」を使用し、敵に 100 ダメージ！`, 'log-attack');
    }
  } else if (itemId === 'sandwich') {
    player.hp = Math.min(player.maxHp, player.hp + 2);
    player.mp = Math.min(player.maxMp, player.mp + 1);
    logMessage('アイテム「サンドウィッチ」を使用し、HPが2、MPが1回復した！', 'log-heal');
  } else if (itemId === 'hp_drink') {
    player.hp = Math.min(player.maxHp, player.hp + 3);
    logMessage('アイテム「HPドリンク」を使用し、HPが3回復した！', 'log-heal');
  } else if (itemId === 'mp_drink') {
    player.mp = Math.min(player.maxMp, player.mp + 3);
    logMessage('アイテム「MPドリンク」を使用し、MPが3回復した！', 'log-heal');
  } else if (itemId === 'action_drink') {
    player.actions += 1;
    logMessage('アイテム「行動ドリンク」を使用し、行動回数が1増えた！', 'log-heal');
  } else if (itemId === 'poison_drug') {
    if (enemy) {
      if (enemy.isGolem || enemy.isVampire) {
        logMessage(`${enemy.name} は毒を無効化した！`, 'log-system');
      } else if (enemy.isMaou && Math.random() < 0.5) {
        logMessage('魔王は状態異常を防いだ！', 'log-system');
      } else {
        enemy.poison = (enemy.poison || 0) + 1;
        logMessage('アイテム「毒薬」を使用し、敵に毒1を付与した！', 'log-poison');
      }
    }
  } else if (itemId === 'perfume') {
    if (enemy) {
      enemy.paralyze = (enemy.paralyze || 0) + 1;
      logMessage('アイテム「香水」を使用し、敵を1ターン行動不能にした！', 'log-poison');
    }
  } else if (itemId === 'elixir') {
    player.poison = 0;
    player.paralyze = 0;
    player.dazzle = 0;
    player.silence = 0;
    logMessage('アイテム「万能薬」を使用し、すべての状態異常を解除した！', 'log-heal');
  } else if (itemId === 'dynamite') {
    if (enemy) {
      const dmg = Math.floor(Math.random() * 11) + 5; // 5~15
      enemy.hp = Math.max(0, enemy.hp - dmg);
      logMessage(`アイテム「ダイナマイト」を使用し、敵に ${dmg} ダメージ！`, 'log-attack');
    }
  }
  updateUI();
  if (enemy && enemy.hp <= 0) {
    handleVictory();
  }
}

// ===== カード画像マッピング =====
const CARD_IMAGES = {
  strike: '',
  heal: new URL('../../assets/games/roguelike/images/icons/math_mark01_plus.png', import.meta.url)
    .href,
  smite: '',
  rush: '',
  fire: new URL('../../assets/games/roguelike/images/icons/honoo_hi_fire.png', import.meta.url)
    .href,
  ice: new URL('../../assets/games/roguelike/images/icons/water_shizuku.png', import.meta.url).href,
  wind: new URL('../../assets/games/roguelike/images/icons/tenki_typhoon.png', import.meta.url)
    .href,
  earth: new URL('../../assets/games/roguelike/images/icons/ishi_stone.png', import.meta.url).href,
  stone: new URL('../../assets/games/roguelike/images/icons/ishi_stone.png', import.meta.url).href,
  thunder: new URL(
    '../../assets/games/roguelike/images/icons/mark_tenkiu_kaminari.png',
    import.meta.url,
  ).href,
  venom: new URL('../../assets/games/roguelike/images/icons/medical_doku.png', import.meta.url)
    .href,
  cure: new URL(
    '../../assets/games/roguelike/images/icons/water_shizuku.png',
    import.meta.url,
  ).href,
  regen_hp: new URL(
    '../../assets/games/roguelike/images/icons/math_mark01_plus.png',
    import.meta.url,
  ).href,
  regen_mp: new URL(
    '../../assets/games/roguelike/images/icons/cardgame_deck_hiku.png',
    import.meta.url,
  ).href,
  meditation: new URL(
    '../../assets/games/roguelike/images/icons/yaruki_moeru_man.png',
    import.meta.url,
  ).href,
  draw_card: new URL(
    '../../assets/games/roguelike/images/icons/cardgame_deck_hiku.png',
    import.meta.url,
  ).href,
  buff_up: new URL(
    '../../assets/games/roguelike/images/icons/math_mark01_plus.png',
    import.meta.url,
  ).href,
  buff_down: new URL(
    '../../assets/games/roguelike/images/icons/math_mark02_minus.png',
    import.meta.url,
  ).href,
  meteor: new URL('../../assets/games/roguelike/images/icons/kanden_gaikotsu.png', import.meta.url)
    .href,
  dazzle: new URL('../../assets/games/roguelike/images/icons/no_image_square.jpg', import.meta.url)
    .href,
  silence: new URL('../../assets/games/roguelike/images/icons/no_image_square.jpg', import.meta.url)
    .href,
  kakusei: new URL('../../assets/games/roguelike/images/icons/yaruki_moeru_man.png', import.meta.url)
    .href,
  ankoku_ken: new URL('../../assets/games/roguelike/images/icons/game_ken_maken.png', import.meta.url)
    .href,
  daikaisho: new URL('../../assets/games/roguelike/images/icons/wave_nami2.png', import.meta.url)
    .href,
  drain: new URL('../../assets/games/roguelike/images/icons/medical_ketsueki.png', import.meta.url)
    .href,
};

// 属性→ドットクラスのマッピング
const COLOR_DOT_MAP = {
  white: 'dot-white',
  black: 'dot-black',
  red: 'dot-red',
  blue: 'dot-blue',
  green: 'dot-green',
  orange: 'dot-orange',
  yellow: 'dot-yellow',
  purple: 'dot-purple',
};

// カード要素を生成する関数（新デザイン）
function makeCardEl(card, onClick) {
  const div = document.createElement('div');
  div.className = `battle-card reward-card color-${card.color} card-type-${card.type}`;

  // MPコスト（左上丸）
  const cost = document.createElement('div');
  cost.className = 'card-cost';
  const actualCost = getCardCost(card);
  const baseId = card.id.endsWith('+') ? card.id.slice(0, -1) : card.id;
  const baseCard = CARD_DB[baseId] || card;
  if (card.upgraded && card.cost < baseCard.cost) {
    cost.innerHTML = `<span class="card-cost-val">${actualCost}</span>`;
  } else {
    cost.textContent = actualCost;
  }
  div.appendChild(cost);

  // カード画像エリア
  const imgWrap = document.createElement('div');
  imgWrap.className = 'card-image-wrap';
  let imgSrc =
    CARD_IMAGES[card.id] || (card.id.endsWith('+') ? CARD_IMAGES[card.id.slice(0, -1)] : '');
  if (!imgSrc) {
    if (card.type === 'attack' && card.element === 'none') {
      imgSrc = new URL('../../assets/games/roguelike/images/relics/game_ken.png', import.meta.url)
        .href;
    } else {
      imgSrc = new URL(
        '../../assets/games/roguelike/images/icons/no_image_square.jpg',
        import.meta.url,
      ).href;
    }
  }
  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = card.name;
    imgWrap.appendChild(img);
  }

  // カテゴリバッジ（右上オーバーレイ）
  if (card.category) {
    const catMap = { physical: '物理', spell: '呪文', special: '特殊' };
    const catColorMap = { physical: 'physical', spell: 'spell', special: 'special-cat' };
    const catBadge = document.createElement('span');
    catBadge.className = `card-category-badge cat-${catColorMap[card.category] || 'none'}`;
    catBadge.textContent = catMap[card.category] || card.category;
    imgWrap.appendChild(catBadge);
  }

  div.appendChild(imgWrap);

  // カード名帯
  const name = document.createElement('div');
  name.className = 'card-name';
  if (card.upgraded) {
    const baseName = card.name.replace(/\++$/, '');
    const plusCount = (card.name.match(/\+/g) || []).length || 1;
    name.innerHTML = `${baseName}<span class="card-plus-mark">${'+'.repeat(plusCount)}</span>`;
  } else {
    name.textContent = card.name;
  }
  div.appendChild(name);

  // 効果テキスト（主効果 + 追加効果）
  const desc = document.createElement('div');
  desc.className = 'card-desc';

  // 主テキスト（威力・属性）を1行で
  const mainLine = buildCardMainText(card);
  const mainEl = document.createElement('span');
  mainEl.className = 'desc-main';
  mainEl.innerHTML = mainLine;
  desc.appendChild(mainEl);

  // 追加効果テキスト（状態異常/バフ等）
  const subLines = buildCardSubTexts(card);
  subLines.forEach((line) => {
    const subEl = document.createElement('span');
    subEl.className = 'desc-sub';
    subEl.innerHTML = line;
    desc.appendChild(subEl);
  });
  div.appendChild(desc);

  // タグ（特殊、回復、バフデバフ、属性）
  const tags = document.createElement('div');
  tags.className = 'card-tags';

  function addTag(text, colorClass) {
    const span = document.createElement('span');
    span.className = `card-tag tag-${colorClass}`;
    span.textContent = text;
    tags.appendChild(span);
  }

  // カテゴリバッジは画像右上に移動済み

  // 属性
  if (card.element && card.element !== 'none') {
    const elemMap = { fire: '炎', ice: '氷', thunder: '雷', wind: '風', stone: '土' };
    if (elemMap[card.element]) addTag(elemMap[card.element], card.element);
  }
  // 状態異常（毒、麻痺）
  if (card.poison) addTag('毒', 'poison');
  if (card.paralyze) addTag('麻痺', 'paralyze');
  // バフ/デバフ
  if (card.buffUp) addTag('能昇', 'buff-up');
  if (card.buffDown) addTag('能降', 'buff-down');
  // 回復
  if (card.healSelf) addTag('回復', 'white');
  // 特殊
  if (card.color === 'purple') addTag('特殊', 'purple');

  if (tags.children.length > 0) div.appendChild(tags);

  div.addEventListener('click', () => {
    if (typeof onClick === 'function') {
      onClick();
    } else {
      showCardDetailModal(card);
    }
  });
  return div;
}

function buildCardMainText(card) {
  const baseId = card.id.endsWith('+') ? card.id.slice(0, -1) : card.id;
  const base = CARD_DB[baseId] || card;
  const fmt = (val, bVal) =>
    card.upgraded && val > (bVal || 0) ? `<span class="card-dmg-val">${val}</span>` : val;

  if (card.type === 'attack') {
    const hits = card.hits ? `×${fmt(card.hits, base.hits || 1)}` : '';
    return `${fmt(card.value, base.value)}${hits}ダメージ`;
  } else if (card.healSelf) {
    return `HP +${fmt(card.healSelf, base.healSelf)} 回復`;
  } else if (card.draw) {
    return `カードを${fmt(card.draw, base.draw)}枚引く`;
  } else if (card.id === 'kakusei' || card.id === 'kakusei+') {
    return `能昇＆能降 ${fmt(card.buffUp, base.buffUp)}ターン`;
  } else if (card.buffUp) {
    return `${fmt(card.buffUp, base.buffUp)}ターン 能昇`;
  } else if (card.buffDown) {
    return `${fmt(card.buffDown, base.buffDown)}ターン 能降`;
  }
  return card.desc || '';
}

function buildCardSubTexts(card) {
  const baseId = card.id.endsWith('+') ? card.id.slice(0, -1) : card.id;
  const base = CARD_DB[baseId] || card;
  const fmt = (val, bVal) =>
    card.upgraded && val > (bVal || 0) ? `<span class="card-heal-val">${val}</span>` : val;
  const lines = [];
  if (card.poison) lines.push(`毒${fmt(card.poison, base.poison)}付与`);
  if (card.paralyze) lines.push('30%で麻痺');
  if (card.oncePerBattle) lines.push('1戦闘1回のみ');
  return lines;
}

function getElemLabel(elem) {
  const map = { fire: '炎', ice: '氷', thunder: '雷', wind: '風', earth: '土', stone: '土' };
  return map[elem] || elem;
}

function getColorLabel(color) {
  const map = {
    white: '白(回復)',
    black: '黒(状異)',
    red: '赤(炎)',
    blue: '青(水)',
    green: '緑(風)',
    orange: '橙(土)',
    yellow: '黄(雷)',
    purple: '紫(特殊)',
  };
  return map[color] || color;
}

// 旧COLOR_TO_DOT（後方互換で残す）
const COLOR_TO_DOT = {};

let turnInCurrentBattle = 0;

// --- 15. バトルシステム & ダメージ計算 ---
function setEnemyIntent() {
  if (!enemy || enemy.hp <= 0) return;

  let dmg = enemy.attackBase + Math.floor((battleCount - 1) / 3);

  // 魔王 (Maou) の確定行動ルール
  if (enemy.isMaou) {
    if (turnInCurrentBattle === 1) {
      enemy.intent = { type: 'kakusei_plus', damage: 0, desc: '覚醒+' };
      return;
    }
    if (enemy.hp <= Math.floor(enemy.maxHp * 0.75) && !enemy.usedAnkoku75) {
      enemy.usedAnkoku75 = true;
      enemy.intent = { type: 'ankoku_ken', damage: 0, desc: '暗黒剣' };
      return;
    }
    if (enemy.hp <= Math.floor(enemy.maxHp * 0.5) && !enemy.usedMeteor) {
      enemy.usedMeteor = true;
      enemy.intent = { type: 'meteor_plus', damage: 8, hits: 4, desc: '流星群+' };
      return;
    }
    if (enemy.hp <= Math.floor(enemy.maxHp * 0.25) && !enemy.usedAnkoku25) {
      enemy.usedAnkoku25 = true;
      enemy.intent = { type: 'ankoku_ken', damage: 0, desc: '暗黒剣' };
      return;
    }
  }

  // リヴァイアサン (Leviathan) の確定行動ルール
  if (enemy.name === 'リヴァイアサン') {
    if (turnInCurrentBattle === 1) {
      enemy.intent = { type: 'daikaisho', damage: dmg + 3, desc: '大海嘯' };
      return;
    }
    if (enemy.hp <= Math.floor(enemy.maxHp * 0.5) && !enemy.usedDaikaisho50) {
      enemy.usedDaikaisho50 = true;
      enemy.intent = { type: 'daikaisho', damage: dmg + 3, desc: '大海嘯' };
      return;
    }
  }

  // ヴァンパイア (Vampire) のドレインはHP50%以下まで解禁しない
  let availableSkills = enemy.skills.length > 0 ? [...enemy.skills] : ['攻撃'];
  if (enemy.isVampire && enemy.hp > Math.floor(enemy.maxHp * 0.5)) {
    availableSkills = availableSkills.filter((s) => s !== 'drain' && s !== 'ドレイン');
    if (availableSkills.length === 0) availableSkills = ['攻撃'];
  }

  const chosen = availableSkills[Math.floor(Math.random() * availableSkills.length)];

  if (chosen === 'ankoku_ken' || chosen === '暗黒剣') {
    enemy.intent = { type: 'ankoku_ken', damage: 0, desc: '暗黒剣' };
  } else if (chosen === 'daikaisho' || chosen === '大海嘯') {
    enemy.intent = { type: 'daikaisho', damage: dmg + 3, desc: '大海嘯' };
  } else if (chosen === 'drain' || chosen === 'ドレイン') {
    enemy.intent = { type: 'drain', damage: dmg + 2, desc: 'ドレイン' };
  } else if (chosen === 'fire' || chosen === 'fire_attack' || chosen === '火炎') {
    enemy.intent = { type: 'fire_attack', damage: dmg + 2, desc: '火炎' };
  } else if (chosen === 'ice' || chosen === 'ice_attack' || chosen === '冷気') {
    enemy.intent = { type: 'ice_attack', damage: dmg + 1, desc: '冷気' };
  } else if (chosen === 'wind' || chosen === 'wind_attack' || chosen === '迅風') {
    enemy.intent = { type: 'wind_attack', damage: dmg + 1, desc: '迅風' };
  } else if (chosen === 'stone' || chosen === 'stone_attack' || chosen === '礫石') {
    enemy.intent = { type: 'stone_attack', damage: dmg + 2, desc: '礫石' };
  } else if (chosen === 'dazzle' || chosen === '幻惑') {
    enemy.intent = { type: 'dazzle', damage: 0, desc: '幻惑' };
  } else if (chosen === 'silence' || chosen === '沈黙') {
    enemy.intent = { type: 'silence', damage: 0, desc: '沈黙' };
  } else if (chosen === 'rush' || chosen === '連撃') {
    enemy.intent = {
      type: 'rush',
      damage: Math.max(1, Math.floor(dmg / 2)),
      hits: 2,
      desc: '連撃',
    };
  } else if (chosen === 'smite' || chosen === '強撃') {
    enemy.intent = { type: 'attack', damage: dmg + 2, desc: '強撃' };
  } else if (chosen === 'paralyze' || chosen === '麻痺') {
    enemy.intent = { type: 'paralyze', damage: 0, desc: '麻痺' };
  } else if (chosen === 'poison' || chosen === '毒計') {
    enemy.intent = { type: 'poison', damage: 0, desc: '毒計' };
  } else if (chosen === 'heal' || chosen === '快癒') {
    enemy.intent = { type: 'heal', damage: 0, desc: '快癒' };
  } else if (chosen === 'buff_up' || chosen === '能昇') {
    enemy.intent = { type: 'buff_up', damage: 0, desc: '能昇' };
  } else if (chosen === 'buff_down' || chosen === '能降') {
    enemy.intent = { type: 'buff_down', damage: 0, desc: '能降' };
  } else {
    enemy.intent = { type: 'attack', damage: dmg, desc: '攻撃' };
  }
}

function addRelic(relicId) {
  if (!relicId || !RELIC_DB[relicId]) return;
  if (!player.relics.includes(relicId)) {
    player.relics.push(relicId);
  }
  unlockRelic(relicId);
  playSE('relic');
  if (relicId === 'yubiwa_gold') {
    player.maxHp += 1;
    player.hp += 1;
  } else if (relicId === 'yubiwa_silver') {
    player.maxMp += 1;
    player.mp += 1;
  }
  updateUI();
}

function getCardCost(card) {
  let cost = card.cost;
  if (
    (card.category === 'spell' || card.id === 'meteor' || card.id === 'meteor+') &&
    player.relics.includes('book_madousyo')
  ) {
    cost = Math.max(0, cost - 1);
  }
  return cost;
}

function applyEnemyStatus(statusType, baseValue) {
  if (!enemy || enemy.hp <= 0) return;

  const STATUS_NAMES = {
    poison: '毒',
    paralyze: '麻痺',
    dazzle: '幻惑',
    silence: '沈黙',
    buff_down: '能降',
  };

  const statusName = STATUS_NAMES[statusType] || statusType;

  // 無効チェック (100%遮断)
  if (enemy.statusImmunities && enemy.statusImmunities.includes(statusType)) {
    logMessage(`${enemy.name} は【${statusName}】を無効化した。`, 'log-system');
    return;
  }

  // 耐性チェック (50%ブロック)
  if (enemy.statusResistances && enemy.statusResistances.includes(statusType)) {
    if (Math.random() < 0.5) {
      logMessage(`${enemy.name} は【${statusName}】を防いだ！`, 'log-system');
      return;
    }
  }

  // 計算（シルクハット持参または弱点・必中でボーナス+1）
  let finalVal = baseValue;
  if (player.relics.includes('silkhat')) {
    finalVal += 1;
  }
  if (
    (enemy.statusWeaknesses && enemy.statusWeaknesses.includes(statusType)) ||
    (enemy.statusSureHit && enemy.statusSureHit.includes(statusType))
  ) {
    finalVal += 1;
  }

  if (statusType === 'poison') {
    enemy.poison = (enemy.poison || 0) + finalVal;
    logMessage(`${enemy.name} に毒 ${finalVal} を付与！`, 'log-poison');
  } else if (statusType === 'paralyze') {
    enemy.paralyze = (enemy.paralyze || 0) + finalVal;
    logMessage(`${enemy.name} に麻痺（${finalVal}ターン）を付与！`, 'log-poison');
  } else if (statusType === 'buff_down') {
    enemy.buffDown = finalVal;
    logMessage(`能降！敵に能降（与ダメ-1/被ダメ+1）を${finalVal}ターン付与！`, 'log-poison');
  }
}

function calculateDamage(baseVal, element, isPlayerAttacking, cardId = null) {
  let bonus = 0;

  if (isPlayerAttacking) {
    if (player.relics.includes('game_ken') && element === 'none') bonus += 1;
    if (player.relics.includes('game_ken_seiken') && element === 'none') bonus += 1;
    if (player.relics.includes('fashion_beret_bere-bou') && element !== 'none') bonus += 1;
    if (
      player.relics.includes('tsue_sennin') &&
      (cardId?.includes('fire') ||
        cardId?.includes('ice') ||
        cardId?.includes('wind') ||
        cardId?.includes('stone') ||
        cardId?.includes('thunder') ||
        cardId?.includes('venom') ||
        cardId?.includes('fortify') ||
        cardId?.includes('heal') ||
        cardId?.includes('buff'))
    ) {
      bonus += 1;
    }
    // プレイヤーのバフ・デバフ
    if (player.buffUp > 0) bonus += 1;
    if (player.buffDown > 0) bonus -= 1;
    // 敵のバフ・デバフ（能降で与ダメ増加、能昇で与ダメ減少）
    if (enemy.buffDown > 0) bonus += 1;
    if (enemy.buffUp > 0) bonus -= 1;

    let dmg = baseVal + bonus;

    // 吸収判定 (ダメージが敵のHP回復に変化)
    if (enemy.absorptions && enemy.absorptions.includes(element)) {
      const healAmt = Math.max(1, dmg);
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + healAmt);
      logMessage(`【属性吸収】${enemy.name} は ${element} 属性攻撃を吸収し、HPが ${healAmt} 回復した！`, 'log-heal');
      return 0;
    }

    if (cardId === 'meteor' || cardId === 'meteor+') {
      // 流星群: 炎・氷・雷のどれかが弱点なら弱点を突く
      const hasWeakness =
        enemy.weaknesses.includes('fire') ||
        enemy.weaknesses.includes('ice') ||
        enemy.weaknesses.includes('thunder');
      if (hasWeakness) {
        dmg = Math.floor(dmg * 1.5);
        logMessage('弱点属性！ダメージ1.5倍！', 'log-heal');
      }
    } else {
      if (enemy.weaknesses.includes(element)) {
        dmg = Math.floor(dmg * 1.5);
        logMessage('弱点属性！ダメージ1.5倍！', 'log-heal');
      } else if (enemy.resistances.includes(element)) {
        dmg = Math.floor(dmg * 0.5);
        logMessage('耐性あり。ダメージ半減', 'log-poison');
      } else if (enemy.immunities.includes(element)) {
        logMessage('無効化されました！', 'log-poison');
        return 0;
      }
    }

    return Math.max(1, dmg);
  } else {
    // プレイヤーのバフ・デバフ
    if (player.buffUp > 0) bonus -= 1;
    if (player.buffDown > 0) bonus += 1;
    // 敵のバフ・デバフ（能昇で被ダメ増加、能降で被ダメ減少）
    if (enemy.buffUp > 0) bonus += 1;
    if (enemy.buffDown > 0) bonus -= 1;
    if (player.relics.includes('game_tate')) bonus -= 1;
    if (player.relics.includes('yubiwa_diamond')) bonus -= 1;

    let dmg = baseVal + bonus;
    return Math.max(1, dmg);
  }
}

function drawCards(count) {
  for (let i = 0; i < count; i++) {
    if (player.deck.length === 0) {
      if (player.discard.length === 0) break;
      player.deck = shuffle([...player.discard]);
      player.discard = [];
      logMessage('山札を再構築しました', 'log-system');
    }
    player.hand.push(player.deck.pop());
    playSE('draw');
  }
}

function startTurn() {
  isPlayerTurn = true;
  turnInCurrentBattle += 1;
  player.actions = player.class === 'butouka' ? 2 : 1;
  if (player.relics.includes('shoes_sneaker')) player.actions += 1;

  if (player.dazzle > 0) player.dazzle -= 1;
  if (player.silence > 0) player.silence -= 1;

  if (player.paralyze > 0) {
    player.paralyze -= 1;
    logMessage('あなたは麻痺で動けない！ターンが強制終了します。', 'log-poison');
    setTimeout(() => {
      if (!isGameOver) endTurn();
    }, 1000);
    return;
  }

  if (player.class === 'kenshi') {
    player.hp = Math.min(player.maxHp, player.hp + 1);
    logMessage('戦士のパッシブ効果でHPが 1 回復した。', 'log-heal');
  }
  if (player.class === 'mahoutsukai') {
    player.mp = Math.min(player.maxMp, player.mp + 1);
    logMessage('魔法使いのパッシブ効果でMPが 1 回復した。', 'log-heal');
  }
  if (player.relics.includes('mermaid_necklace')) {
    player.mp = Math.min(player.maxMp, player.mp + 1);
    logMessage('人魚のネックレス：毎ターンMPが 1 回復した。', 'log-heal');
  }

  if (player.regenHp && player.regenHp > 0) {
    player.hp = Math.min(player.maxHp, player.hp + player.regenHp);
    logMessage(`再生効果：毎ターンHPが ${player.regenHp} 回復した。`, 'log-heal');
  }
  if (player.regenMp && player.regenMp > 0) {
    player.mp = Math.min(player.maxMp, player.mp + player.regenMp);
    logMessage(`活性効果：毎ターンMPが ${player.regenMp} 回復した。`, 'log-heal');
  }

  if (player.poison > 0) {
    player.hp = Math.max(0, player.hp - player.poison);
    logMessage('プレイヤーが毒で ' + player.poison + ' ダメージ！', 'log-poison');
    player.poison = Math.max(0, player.poison - 1);
    if (player.hp <= 0) {
      handleGameOver();
      return;
    }
  }

  if (player.buffUp > 0) player.buffUp -= 1;
  if (player.buffDown > 0) player.buffDown -= 1;

  let drawCount = player.relics.includes('book_madousyo') ? 5 : 4;
  if (turnInCurrentBattle === 1 && player.relics.includes('fashion_boot_short')) {
    drawCount += 1;
    logMessage('ブーツ：1ターン目のドロー枚数が +1 された。', 'log-heal');
  }
  drawCards(drawCount);
  updateUI();
  logMessage('【あなたのターン】', 'log-system');
  if (btnEndTurn) btnEndTurn.disabled = false;
}

function endTurn() {
  if (!isPlayerTurn || isGameOver) return;
  isPlayerTurn = false;
  if (btnEndTurn) btnEndTurn.disabled = true;

  if (player.actions > 0) {
    player.mp = Math.min(player.maxMp, player.mp + player.actions);
    logMessage('様子見を行い、MPが ' + player.actions + ' 回復した！', 'log-heal');
  }

  player.discard.push(...player.hand);
  player.hand = [];
  updateUI();
  setTimeout(() => enemyTurn(), 400);
}

function enemyTurn() {
  if (isGameOver || !enemy || enemy.hp <= 0) return;
  logMessage('【敵のターン】');

  if (enemy.paralyze > 0) {
    enemy.paralyze -= 1;
    logMessage(`${enemy.name} は麻痺して動けない！`, 'log-system');
    setTimeout(() => {
      if (!isGameOver) {
        setEnemyIntent();
        startTurn();
      }
    }, 800);
    return;
  }

  if (enemy.poison && enemy.poison > 0) {
    enemy.hp = Math.max(0, enemy.hp - enemy.poison);
    logMessage(enemy.name + 'が毒で ' + enemy.poison + ' ダメージ！', 'log-poison');
    enemy.poison = Math.max(0, enemy.poison - 1);
    if (enemy.hp <= 0) {
      enemy.hp = 0;
      updateUI();
      handleVictory();
      return;
    }
  }

  if (enemy.buffUp > 0) enemy.buffUp -= 1;
  if (enemy.buffDown > 0) enemy.buffDown -= 1;

  if (enemy.intent) {
    let dmg = enemy.intent.damage;
    logMessage(`${enemy.name} の「${enemy.intent.desc}」！`);

    // 敵が使用した技のカードを図鑑で自動解放
    const intentToCardMap = {
      fire_attack: 'fire',
      ice_attack: 'ice',
      wind_attack: 'wind',
      stone_attack: 'stone',
      dazzle: 'dazzle',
      silence: 'silence',
      paralyze: 'thunder',
      poison: 'venom',
      heal: 'heal',
      buff_up: 'buff_up',
      buff_down: 'buff_down',
      rush: 'rush',
      ankoku_ken: 'ankoku_ken',
      daikaisho: 'daikaisho',
      drain: 'drain',
      kakusei_plus: 'kakusei',
      meteor_plus: 'meteor',
    };
    const cardIdToUnlock = intentToCardMap[enemy.intent.type];
    if (cardIdToUnlock && CARD_DB[cardIdToUnlock]) {
      unlockCard(cardIdToUnlock);
    }
    if (enemyImageEl) enemyImageEl.classList.add('shake');

    setTimeout(() => {
      if (enemyImageEl) enemyImageEl.classList.remove('shake');

      if (enemy.intent.type === 'ankoku_ken') {
        playSE('boss_attack');
        const currentHp = player.hp;
        const lostHp = Math.floor(currentHp / 2);
        player.hp = Math.max(1, currentHp - lostHp);
        logMessage(`${enemy.name} の「暗黒剣」！プレイヤーの現在HPが ${lostHp} 削り取られた！`, 'log-damage');
      } else if (enemy.intent.type === 'daikaisho') {
        playSE('ice');
        player.buffUp = 0;
        player.paralyze = 1;
        const calculatedDmg = calculateDamage(dmg + 3, 'ice', false);
        if (calculatedDmg > 0) {
          player.hp = Math.max(0, player.hp - calculatedDmg);
          logMessage(`${enemy.name} の「大海嘯」！バフが解除され、1ターン行動不能！${calculatedDmg} ダメージ！`, 'log-damage');
        }
      } else if (enemy.intent.type === 'drain') {
        playSE('enemy_attack');
        const calculatedDmg = calculateDamage(dmg + 2, 'none', false);
        if (calculatedDmg > 0) {
          player.hp = Math.max(0, player.hp - calculatedDmg);
          enemy.hp = Math.min(enemy.maxHp, enemy.hp + calculatedDmg);
          logMessage(`${enemy.name} の「ドレイン」！${calculatedDmg} ダメージを与え、HPを ${calculatedDmg} 回復した！`, 'log-heal');
        }
      } else if (enemy.intent.type === 'heal') {
        playSE('heal');
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + 5);
        logMessage(`${enemy.name} はHPを 5 回復した！`, 'log-heal');
      } else if (enemy.intent.type === 'kakusei_plus') {
        playSE('buff_up');
        enemy.buffUp = 5;
        logMessage(`${enemy.name} は【覚醒+】した！すさまじい魔力が高まる！`, 'log-heal');
      } else if (enemy.intent.type === 'dazzle') {
        playSE('poison');
        player.dazzle = 2;
        logMessage('プレイヤーは【幻惑】状態になった！', 'log-poison');
      } else if (enemy.intent.type === 'silence') {
        playSE('poison');
        player.silence = 2;
        logMessage('プレイヤーは【沈黙】状態になった！', 'log-poison');
      } else if (enemy.intent.type === 'paralyze') {
        playSE('thunder');
        player.paralyze = 1;
        logMessage('プレイヤーは麻痺状態になった！', 'log-poison');
      } else if (enemy.intent.type === 'poison') {
        playSE('poison');
        player.poison = (player.poison || 0) + 2;
        logMessage('プレイヤーは毒2を付与された！', 'log-poison');
      } else if (enemy.intent.type === 'buff_up') {
        playSE('buff_up');
        enemy.buffUp = 3;
        logMessage(`${enemy.name} は能昇状態になった！`, 'log-heal');
      } else if (enemy.intent.type === 'buff_down') {
        playSE('buff_down');
        player.buffDown = 3;
        logMessage('プレイヤーは能降状態になった！', 'log-poison');
      } else if (enemy.intent.type === 'meteor_plus') {
        logMessage(`${enemy.name} の「流星群+」が発動！`, 'log-damage');
        const meteorElements = ['fire', 'ice', 'wind', 'stone'];
        const elemNames = { fire: '火', ice: '水', wind: '風', stone: '土' };
        meteorElements.forEach((elem) => {
          if (elem === 'fire') playSE('fire');
          else if (elem === 'ice') playSE('ice');
          else if (elem === 'wind') playSE('wind');
          else if (elem === 'stone') playSE('stone');

          const d = calculateDamage(8, elem, false);
          if (d > 0) {
            player.hp = Math.max(0, player.hp - d);
            logMessage(`【${elemNames[elem]}属性】プレイヤーに ${d} ダメージ！`, 'log-damage');
          } else {
            logMessage(`【${elemNames[elem]}属性】無効化された！`, 'log-system');
          }
        });
      } else {
        const isBoss =
          currentPathType === 'boss' ||
          currentPathType === 'midboss' ||
          currentPathType === 'lastboss';
        if (enemy.intent.type === 'fire_attack') playSE('fire');
        else if (enemy.intent.type === 'ice_attack') playSE('ice');
        else if (enemy.intent.type === 'wind_attack') playSE('wind');
        else if (enemy.intent.type === 'stone_attack') playSE('stone');
        else if (enemy.name === 'ハーピー') playSE('harpy');
        else if (isBoss) playSE('boss_attack');
        else playSE('enemy_attack');

        const element =
          enemy.intent.type === 'fire_attack'
            ? 'fire'
            : enemy.intent.type === 'ice_attack'
              ? 'ice'
              : enemy.intent.type === 'wind_attack'
                ? 'wind'
                : enemy.intent.type === 'stone_attack'
                  ? 'stone'
                  : 'none';
        const calculatedDmg = calculateDamage(dmg, element, false);
        if (calculatedDmg > 0) {
          player.hp = Math.max(0, player.hp - calculatedDmg);
          logMessage('プレイヤーに ' + calculatedDmg + ' のダメージ！', 'log-damage');
        }
      }
      if (player.hp <= 0) {
        handleGameOver();
      } else {
        setEnemyIntent();
        setTimeout(startTurn, 600);
      }
      updateUI();
    }, 500);
  }
}

function playCard(index) {
  if (!isPlayerTurn || isGameOver) return;
  const card = player.hand[index];
  const cardCost = getCardCost(card);
  const isSpellCard = card.category === 'spell';

  if (player.mp < cardCost) {
    logMessage('MPが足りません！', 'log-system');
    return;
  }
  if (!isSpellCard && player.actions <= 0) {
    logMessage('行動回数が残っていません！', 'log-system');
    return;
  }

  player.mp -= cardCost;
  if (!isSpellCard) {
    player.actions -= 1;
  }
  player.hand.splice(index, 1);
  playSE('play');
  if (!card.oncePerBattle) {
    player.discard.push(card);
  } else {
    player.exhausted.push(card);
  }

  if (card.id === 'strike' || card.id === 'strike_plus') playSE('strike');
  else if (card.id === 'smite' || card.id === 'smite_plus') playSE('smite');
  else if (card.id === 'rush' || card.id === 'rush_plus') playSE('rush');
  else if (card.id === 'stone' || card.id === 'stone_plus') playSE('stone');
  else if (card.id === 'meteor' || card.id === 'meteor_plus') playSE('meteor');
  else if (card.element === 'fire') playSE('fire');
  else if (card.element === 'ice') playSE('ice');
  else if (card.element === 'thunder') playSE('thunder');
  else if (card.element === 'wind') playSE('wind');
  else if (card.buffUp) playSE('buff_up');
  else if (card.buffDown) playSE('buff_down');
  else if (card.poison) playSE('poison');
  else if (card.healSelf) playSE('heal');
  else if (card.type === 'attack') playSE('strike');

  if (card.type === 'attack') {
    const hits = card.hits || 1;
    let total = 0;
    for (let i = 0; i < hits; i++) {
      const d = calculateDamage(card.value, card.element, true, card.id);
      enemy.hp = Math.max(0, enemy.hp - d);
      total += d;
    }
    logMessage(
      card.name +
        '！ ' +
        enemy.name +
        ' に ' +
        (hits > 1 ? total + '(' + total / hits + '×' + hits + '）' : '' + total) +
        ' ダメージ！',
      'log-damage',
    );
    if (card.poison && card.poison > 0) {
      applyEnemyStatus('poison', card.poison);
    }
    if (card.cleanse) {
      player.poison = 0;
      player.paralyze = 0;
      player.dazzle = 0;
      player.silence = 0;
      player.buffDown = 0;
      logMessage(`${card.name}！ 状態異常とデバフをすべて解除した！`, 'log-heal');
    }
    if (card.fullHeal) {
      player.hp = player.maxHp;
      logMessage(`${card.name}！ HPが全回復した！`, 'log-heal');
    }
    if (card.regenHp) {
      player.regenHp = (player.regenHp || 0) + card.regenHp;
      logMessage(`${card.name}！ 毎ターンHPが ${card.regenHp} 回復するようになった！`, 'log-heal');
    }
    if (card.regenMp) {
      player.regenMp = (player.regenMp || 0) + card.regenMp;
      logMessage(`${card.name}！ 毎ターンMPが ${card.regenMp} 回復するようになった！`, 'log-heal');
    }
    if (card.draw) {
      drawCards(card.draw);
      player.actions++;
      logMessage(card.name + '！ カードを' + card.draw + '枚引く！');
    }
    if (card.healPercent) {
      const healAmount = Math.max(1, Math.floor(player.maxHp * card.healPercent));
      player.hp = Math.min(player.maxHp, player.hp + healAmount);
      logMessage(`${card.name}！ HPが ${healAmount} 回復した！`, 'log-heal');
    } else if (card.healSelf) {
      player.hp = Math.min(player.maxHp, player.hp + card.healSelf);
      logMessage(card.name + '！ HP +' + card.healSelf, 'log-heal');
    }
    if (card.buffUp) {
      const buffUpVal = card.buffUp + (player.relics.includes('silkhat') ? 1 : 0);
      player.buffUp = buffUpVal;
      logMessage(`能昇！能昇（与ダメ+1/被ダメ-1）を${buffUpVal}ターン得た！`, 'log-heal');
    }
    if (card.buffDown) {
      applyEnemyStatus('buff_down', card.buffDown);
    }
  }
  updateUI();
  if (enemy.hp <= 0) {
    enemy.hp = 0;
    updateUI();
    handleVictory();
  } else {
    if (player.actions <= 0) {
      logMessage('行動回数がなくなったため、自動的にターンを終了します。', 'log-system');
      setTimeout(() => {
        if (!isGameOver) endTurn();
      }, 800);
    }
  }
}

// --- 16. 勝敗・報酬 ---
/** 固定レリックをカットシーン後に付与するユーティリティ */
function giveFixedRelic(relicId, cutsceneScenes, onDone) {
  const relic = RELIC_DB[relicId];
  if (!relic) {
    onDone?.();
    return;
  }
  showCutscene(cutsceneScenes, () => {
    addRelic(relicId);
    logMessage(`「${relic.name}」を手に入れた！`, 'log-system');
    showGameAlert(
      'レリック入手',
      `「${relic.name}」を入手しました！<br><span class="relic-get-desc">${relic.desc}</span>`,
      () => {
        onDone?.();
      },
    );
  });
}

function handleVictory() {
  isGameOver = true;

  // デッキ・手札・捨て札・除外カードをすべて山札に戻す
  player.deck = [...player.deck, ...player.discard, ...player.hand, ...(player.exhausted || [])];
  player.discard = [];
  player.hand = [];
  player.exhausted = [];

  if (btnEndTurn) btnEndTurn.disabled = true;
  playSE('victory');
  logMessage(enemy.name + ' を倒した！', 'log-system');
  if (enemy && enemy.name) {
    unlockMonster(enemy.name);
  }

  // レリックによる戦闘勝利時回復効果の適用
  let victoryHpHeal = 0;
  let victoryMpHeal = 0;
  if (player.relics.includes('ruby_ring')) victoryHpHeal += 2;
  if (player.relics.includes('game_ken_seiken')) victoryHpHeal += 2;
  if (player.relics.includes('sapphire_ring')) victoryMpHeal += 2;
  if (player.relics.includes('yubiwa_diamond')) victoryMpHeal += 2;

  if (victoryHpHeal > 0 && player.hp < player.maxHp) {
    const oldHp = player.hp;
    player.hp = Math.min(player.maxHp, player.hp + victoryHpHeal);
    const healed = player.hp - oldHp;
    if (healed > 0) {
      logMessage(`レリック効果によりHPが ${healed} 回復した！`, 'log-heal');
    }
  }
  if (victoryMpHeal > 0 && player.mp < player.maxMp) {
    const oldMp = player.mp;
    player.mp = Math.min(player.maxMp, player.mp + victoryMpHeal);
    const recovered = player.mp - oldMp;
    if (recovered > 0) {
      logMessage(`レリック効果によりMPが ${recovered} 回復した！`, 'log-heal');
    }
  }

  let baseReward = enemy && enemy.rewardGold ? enemy.rewardGold : 10;
  let variance = Math.max(1, Math.floor(baseReward * 0.1));
  let goldReward = baseReward + Math.floor(Math.random() * (variance * 2 + 1)) - variance;
  if (currentPathType === 'elite' || currentPathType === 'mimic') {
    goldReward = Math.floor(goldReward * 1.5);
  }
  let goldMultiplier = 1.0;
  if (player.relics.includes('creditcard_black')) goldMultiplier += 0.5;
  if (player.relics.includes('creditcard_gold')) goldMultiplier += 0.5;
  goldReward = Math.max(1, Math.floor(goldReward * goldMultiplier));
  player.gold += goldReward;
  logMessage(`報酬として 💰${goldReward} ゴールドを獲得！`, 'log-system');

  if (currentPathType === 'mimic') {
    const unownedRelics = Object.keys(RELIC_DB).filter(
      (r) => !player.relics.includes(r) && !RELIC_DB[r].isFixed,
    );
    if (unownedRelics.length > 0) {
      shuffle(unownedRelics);
      addRelic(unownedRelics[0]);
      logMessage(
        `ミミックからレリック「${RELIC_DB[unownedRelics[0]].name}」を手に入れた！`,
        'log-system',
      );
    }
    const unupgraded = player.deck.filter((c) => (c.upgradeCount || 0) < 1);
    if (unupgraded.length > 0) {
      shuffle(unupgraded);
      const target = unupgraded[0];
      const index = player.deck.findIndex((c) => c === target);
      if (index !== -1) {
        player.deck[index] = upgradeCard(player.deck[index]);
        logMessage(
          `ミミックの宝の力で、カード「${target.name}」が「${target.name}+」に強化された！`,
          'log-heal',
        );
      }
    }
  }

  // ===== 中ボス撃破後 =====
  if (currentPathType === 'midboss') {
    setTimeout(() => {
      showMapScreen();
      // エリア2中ボス（ゴーレム）
      if (currentArea === 2) {
        const postScenes = [
          {
            bg: new URL(
              '../../assets/games/roguelike/images/map/mon_gate_western_close.png',
              import.meta.url,
            ).href,
            portraits: [
              {
                src: new URL(
                  '../../assets/games/roguelike/images/characters/knight.png',
                  import.meta.url,
                ).href,
                size: '120px',
              },
            ],
            speaker: '見回りの兵士',
            lines: [
              'ありがとう！町を守るゴーレムが故障で暴走してしまい、誰も近づけなくなっていたんだ。',
              'おかげで出入りができるようになった。……あとでゴーレムは修理してやらないとな。これはお礼だ。',
            ],
          },
        ];
        const unownedNonFixed = Object.keys(RELIC_DB).filter(
          (r) => !player.relics.includes(r) && !RELIC_DB[r].isFixed,
        );
        const pick =
          unownedNonFixed.length > 0
            ? unownedNonFixed[Math.floor(Math.random() * unownedNonFixed.length)]
            : null;
        if (pick) {
          giveFixedRelic(pick, postScenes, () => proceedNextFloor());
        } else {
          showCutscene(postScenes, () => proceedNextFloor());
        }
      }
      // エリア3中ボス（リヴァイアサン）
      else if (currentArea === 3) {
        const postScenes = [
          {
            bg: new URL('../../assets/games/roguelike/images/map/arashi.png', import.meta.url).href,
            portraits: [],
            speaker: '─── 状況 ───',
            lines: ['ふと、嵐が止んだ。\nリヴァイアサンはあなたの実力を認めてくれたようだ。'],
          },
          {
            bg: new URL('../../assets/games/roguelike/images/map/arashi.png', import.meta.url).href,
            portraits: [
              {
                src: new URL(
                  '../../assets/games/roguelike/images/characters/ningyohime.png',
                  import.meta.url,
                ).href,
                size: '130px',
              },
            ],
            speaker: '人魚',
            lines: [
              '海神様に認められるなんて、本当に勇敢な人間ね！',
              '魔王と戦うなら、これを持っていって。\nこの海に伝わる力が、きっとあなたを守ってくれるはずよ。',
            ],
          },
        ];
        giveFixedRelic('mermaid_necklace', postScenes, () => proceedNextFloor());
      }
      // エリア1中ボス（バンディット）
      else {
        const postScenes = [
          {
            bg: new URL('../../assets/games/roguelike/images/map/doukutsu.png', import.meta.url)
              .href,
            portraits: [
              {
                src: new URL(
                  '../../assets/games/roguelike/images/characters/knight.png',
                  import.meta.url,
                ).href,
                size: '120px',
              },
            ],
            speaker: '城の兵士',
            lines: [
              'ご助力感謝します。この山賊は我々が連行します。',
              '山賊が持っていたものです。あなたにお役立ていただければ幸いです。',
            ],
          },
        ];
        const unownedNonFixed = Object.keys(RELIC_DB).filter(
          (r) => !player.relics.includes(r) && !RELIC_DB[r].isFixed,
        );
        const pick =
          unownedNonFixed.length > 0
            ? unownedNonFixed[Math.floor(Math.random() * unownedNonFixed.length)]
            : null;
        if (pick) {
          giveFixedRelic(pick, postScenes, () => proceedNextFloor());
        } else {
          showCutscene(postScenes, () => proceedNextFloor());
        }
      }
    }, 800);
    return;
  }

  // ===== ボス撃破後 =====
  if (currentPathType === 'boss') {
    setTimeout(() => {
      // エリア1ボス（ダークエルフ）
      if (currentArea === 1) {
        const postScenes = [
          {
            bg: new URL('../../assets/games/roguelike/images/map/mori.png', import.meta.url).href,
            portraits: [
              {
                src: new URL(
                  '../../assets/games/roguelike/images/monsters/fantasy_dark_elf.png',
                  import.meta.url,
                ).href,
                size: '120px',
              },
            ],
            speaker: 'ダークエルフ',
            lines: ['きゅ～……'],
          },
          {
            bg: new URL('../../assets/games/roguelike/images/map/mori.png', import.meta.url).href,
            portraits: [
              {
                src: new URL(
                  '../../assets/games/roguelike/images/characters/fantasy_elf2.png',
                  import.meta.url,
                ).href,
                size: '130px',
              },
            ],
            speaker: 'エルフ',
            lines: [
              '闇に囚われた仲間を正気に戻してくれて、ありがとうございます。',
              'あなたの勇気に感謝を込めて、我らエルフの里で古くから伝わる特産品の剣を授けましょう。\n大切にしてください。',
            ],
          },
        ];
        showMapScreen();
        giveFixedRelic('game_ken_seiken', postScenes, () => proceedNextFloor());
      }
      // エリア2ボス（ヴァンパイア）
      else if (currentArea === 2) {
        const postScenes = [
          {
            bg: new URL(
              '../../assets/games/roguelike/images/map/building_europe_kojou.png',
              import.meta.url,
            ).href,
            portraits: [
              {
                src: new URL(
                  '../../assets/games/roguelike/images/characters/royal_princess.png',
                  import.meta.url,
                ).href,
                size: '130px',
              },
            ],
            speaker: '姫',
            lines: [
              '助けてくださいまして、誠にありがとうございます。\nあなたのような勇敢な方が救い出してくれることをずっとお待ちしておりました。',
              'これはお礼です。私だと思って、この指輪をお持ちください。\nどうか、お力になれますように。',
            ],
          },
        ];
        showMapScreen();
        giveFixedRelic('yubiwa_diamond', postScenes, () => proceedNextFloor());
      } else {
        showBossRelicReward();
      }
    }, 800);
    return;
  }

  if (currentPathType === 'lastboss') {
    setTimeout(() => showGameClearScreen(), 800);
    return;
  }
  setTimeout(() => showReward(), 800);
}

function showReward() {
  playBGM('reward');
  if (rewardCards) rewardCards.innerHTML = '';
  if (rewardSubtitleText) rewardSubtitleText.textContent = '1枚カードを選んでデッキに追加';
  const basePool = [...REWARD_POOL].filter(
    (id) => CARD_DB[id] && CARD_DB[id].category !== 'special',
  );
  const specialIds = REWARD_POOL.filter((id) => CARD_DB[id] && CARD_DB[id].category === 'special');
  let pool = [...basePool];

  // エリアに応じた特殊カードの混入率調整
  if (currentArea === 1) {
    // エリア1: 手に入りづらい (20%の確率で混入)
    if (Math.random() < 0.2) pool.push(...specialIds);
  } else if (currentArea === 2) {
    // エリア2: 通常通り
    pool.push(...specialIds);
  } else if (currentArea >= 3) {
    // エリア3: 手に入りやすい (3セット混入)
    pool.push(...specialIds, ...specialIds, ...specialIds);
  }

  shuffle(pool);
  const picks = pool.slice(0, 3);
  picks.forEach((id) => {
    const card = CARD_DB[id];
    const el = makeCardEl(card, () => {
      playSE('reward_select');
      unlockCard(id);
      player.discard.push({ ...CARD_DB[id] });
      logMessage(CARD_DB[id].name + ' をデッキに追加！', 'log-system');
      if (rewardOverlay) rewardOverlay.style.display = 'none';
      proceedNextFloor();
    });
    if (rewardCards) rewardCards.appendChild(el);
  });
  if (rewardOverlay) rewardOverlay.style.display = 'flex';
}

function showBossRelicReward() {
  if (rewardCards) rewardCards.innerHTML = '';
  if (rewardSubtitleText)
    rewardSubtitleText.textContent = 'エリアボス撃破！レリックを1つ選択してください';
  const unownedRelics = Object.keys(RELIC_DB).filter(
    (r) => !player.relics.includes(r) && !RELIC_DB[r].isFixed,
  );
  shuffle(unownedRelics);
  const picks = unownedRelics.slice(0, 3);
  picks.forEach((relicId) => {
    const relic = RELIC_DB[relicId];
    const el = document.createElement('div');
    el.className = 'battle-card reward-card';
    el.style.borderColor = '#ffd700';
    el.style.borderWidth = '2px';
    el.innerHTML = `
          <div class="card-cost card-cost-custom" >宝</div>
          <div class="card-name card-name-custom" >${relic.name}</div>
          <div class="card-desc card-desc-custom" >${relic.desc}</div>
        `;
    el.addEventListener('click', () => {
      addRelic(relicId);
      logMessage(`ボス報酬：レリック「${relic.name}」を獲得！`, 'log-system');
      if (rewardOverlay) rewardOverlay.style.display = 'none';
      proceedNextFloor();
    });
    if (rewardCards) rewardCards.appendChild(el);
  });
  if (rewardOverlay) rewardOverlay.style.display = 'flex';
}

function showResultOverlay(isWin) {
  if (isWin) {
    playSE('victory');
    if (enemy && enemy.name) {
      unlockMonster(enemy.name);
    }
  } else {
    stopBGM();
    playSE('defeat');
  }

  if (resultTitle) {
    resultTitle.textContent = isWin ? '戦闘勝利！' : 'ゲームオーバー';
    resultTitle.style.color = isWin ? '#28a745' : '#dc3545';
  }
  if (resultDetails) {
    resultDetails.textContent = isWin
      ? `第${battleCount}戦を見事に勝ち抜きました！引き続き次の階層を選択してください。`
      : `魔王の軍勢に倒れました（到達階層: エリア ${currentArea} - ${currentFloor}層）。もう一度挑戦しますか？`;
  }
  if (btnNext) btnNext.textContent = isWin ? 'マップへ戻る' : 'リトライ';
  if (overlay) overlay.style.display = 'flex';
}

function updateRoguelikeStats(area, floor, isClear = false) {
  const stats = JSON.parse(localStorage.getItem('roguelike_stats') || '{"clears":0,"maxArea":1,"maxFloor":1}');
  if (isClear) stats.clears = (stats.clears || 0) + 1;
  if (area > (stats.maxArea || 1) || (area === stats.maxArea && floor > (stats.maxFloor || 1))) {
    stats.maxArea = area;
    stats.maxFloor = floor;
  }
  localStorage.setItem('roguelike_stats', JSON.stringify(stats));
}

function showGameClearScreen() {
  isGameOver = true;
  stopBGM();
  playSE('victory');
  updateRoguelikeStats(currentArea, currentFloor, true);
  if (resultTitle) {
    resultTitle.textContent = '全面クリア！';
    resultTitle.style.color = '#ffd700';
  }
  if (resultDetails) {
    const clsName =
      player.class === 'yuusya'
        ? '勇者'
        : player.class === 'kenshi'
          ? '戦士'
          : player.class === 'mahoutsukai'
            ? '魔法使い'
            : '格闘家';
    resultDetails.innerHTML = `
          <strong>おめでとうございます！</strong><br>
          あなたは魔王を撃破し、世界に平和を取り戻しました！<br><br>
          【冒険の記録】<br>
          選択した職業: ${clsName}<br>
          最終所持金: 💰${player.gold} / 獲得レリック: ${player.relics.length}個
        `;
  }
  if (btnNext) btnNext.style.display = 'none';
  if (overlay) overlay.style.display = 'flex';
}

function handleGameOver() {
  isGameOver = true;
  if (btnEndTurn) btnEndTurn.disabled = true;
  logMessage('プレイヤーは倒れた...', 'log-system');
  setTimeout(() => showResultOverlay(false), 800);
}

// --- 17. 戦闘開始・ループ ---
let battleCount = 1;

function startBattle() {
  isGameOver = false;
  isPlayerTurn = true;
  if (overlay) overlay.style.display = 'none';
  if (rewardOverlay) rewardOverlay.style.display = 'none';
  if (deckViewerOverlay) deckViewerOverlay.style.display = 'none';
  if (battleMapOverlay) battleMapOverlay.style.display = 'none';

  const tpl = getEnemyTemplate(currentArea, currentFloor, currentPathType);

  if (tpl.name === '魔王') playBGM('lastboss');
  else if (currentPathType === 'boss' || currentPathType === 'midboss') playBGM('boss');
  else playBGM('battle');

  turnInCurrentBattle = 0;
  enemy = { ...tpl, hp: tpl.hp, maxHp: tpl.maxHp, poison: 0, paralyze: 0, buffUp: 0, buffDown: 0 };
  if (enemyNameEl) enemyNameEl.textContent = enemy.name;
  if (enemyImageEl) enemyImageEl.src = enemy.image;
  player.items.forEach((i) => (i.used = false));

  // 戦闘開始前に山札をシャッフル（初回以外はhandleVictoryで山札に全て戻っているため、シャッフルのみ行う）
  if (!(currentFloor === 1 && currentArea === 1)) {
    player.deck = shuffle([...player.deck]);
  }

  if (currentFloor === 1 && currentArea === 1) {
    // ゲーム最初期化
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    player.deck = shuffle(INITIAL_DECKS[player.class].map((id) => ({ ...CARD_DB[id] })));
    player.discard = [];
    player.poison = 0;
    player.paralyze = 0;
    player.dazzle = 0;
    player.silence = 0;
    player.buffUp = 0;
    player.buffDown = 0;
    player.regenHp = 0;
    player.regenMp = 0;
  } else {
    // 通常の戦闘開始：シャッフルのみ
    player.deck = shuffle([...player.deck]);
    player.discard = [];
    player.exhausted = [];
    player.poison = 0;
    player.paralyze = 0;
    player.dazzle = 0;
    player.silence = 0;
    player.buffUp = 0;
    player.buffDown = 0;
    player.regenHp = 0;
    player.regenMp = 0;
    player.mp = Math.min(player.maxMp, player.mp);
  }
  player.hand = [];

  showScreen(document.querySelector('.battle-layout'));

  if (battleLog) battleLog.innerHTML = '';
  logMessage(`第${currentFloor}層：${enemy.name}が現れた！`, 'log-system');

  setEnemyIntent();
  startTurn();
}

function updateUI() {
  // プレイヤーHP
  if (playerHpText) playerHpText.textContent = player.hp + '/' + player.maxHp;
  if (playerHpBar) playerHpBar.style.width = (player.hp / player.maxHp) * 100 + '%';

  // MP バー
  if (playerMpText) playerMpText.textContent = player.mp + '/' + player.maxMp;
  const playerMpBar = document.getElementById('player-mp-bar');
  if (playerMpBar)
    playerMpBar.style.width = Math.max(0, Math.min(100, (player.mp / player.maxMp) * 100)) + '%';

  // 行動回数 Orbs
  const actionOrbsEl = document.getElementById('player-action-orbs');
  if (actionOrbsEl) {
    actionOrbsEl.innerHTML = '';
    const maxActions =
      player.class === 'butouka' ? 2 : player.relics.includes('shoes_sneaker') ? 2 : 1;
    for (let i = 0; i < maxActions; i++) {
      const orb = document.createElement('div');
      orb.className = 'action-orb' + (i < player.actions ? ' active' : '');
      actionOrbsEl.appendChild(orb);
    }
  }

  // 毒・麻痺・幻惑・沈黙・能昇・能降バッジ (プレイヤー)
  if (playerPoisonEl) {
    let text = '';
    if (player.poison > 0) text += ` 🟢×${player.poison}`;
    if (player.paralyze > 0) text += ` ⚡×${player.paralyze}`;
    if (player.dazzle > 0) text += ` 👁️×${player.dazzle}`;
    if (player.silence > 0) text += ` 🔇×${player.silence}`;
    if (player.buffUp > 0) text += ` 📈×${player.buffUp}`;
    if (player.buffDown > 0) text += ` 📉×${player.buffDown}`;

    if (text) {
      playerPoisonEl.classList.add('active');
      playerPoisonEl.textContent = text;
    } else {
      playerPoisonEl.classList.remove('active');
      playerPoisonEl.textContent = '';
    }
  }

  // 山札
  if (deckCountEl) deckCountEl.textContent = player.deck.length;
  const footerDeckCountEl = document.getElementById('footer-deck-count');
  if (footerDeckCountEl) footerDeckCountEl.textContent = player.deck.length;

  // 手札
  renderHand();

  // レリックとアイテム
  renderRelicsAndItems();

  // 敵ステータス
  if (enemy) {
    if (enemyHpText) enemyHpText.textContent = enemy.hp + '/' + enemy.maxHp;
    if (enemyHpBar) enemyHpBar.style.width = Math.max(0, (enemy.hp / enemy.maxHp) * 100) + '%';
    if (enemyIntentEl) {
      if (enemy.intent) {
        enemyIntentEl.classList.add('active');
        enemyIntentEl.title = 'クリックで技の詳細を表示';
        enemyIntentEl.innerHTML = `次は「<span class="enemy-intent-tag">${enemy.intent.desc}</span>」をしようとしている！`;

        if (!enemyIntentEl.dataset.hasClick) {
          enemyIntentEl.dataset.hasClick = 'true';
          enemyIntentEl.addEventListener('click', () => {
            if (enemy && enemy.intent) {
              showEnemySkillCardModal(enemy.intent);
            }
          });
        }
      } else {
        enemyIntentEl.classList.remove('active');
      }
    }

    // 毒・麻痺・能昇・能降バッジ (敵)
    if (enemyPoisonEl) {
      let text = '';
      if (enemy.poison > 0) text += ` 🟢×${enemy.poison}`;
      if (enemy.paralyze > 0) text += ` ⚡×${enemy.paralyze}`;
      if (enemy.buffUp > 0) text += ` 📈×${enemy.buffUp}`;
      if (enemy.buffDown > 0) text += ` 📉×${enemy.buffDown}`;

      if (text) {
        enemyPoisonEl.classList.add('active');
        enemyPoisonEl.textContent = text;
      } else {
        enemyPoisonEl.classList.remove('active');
        enemyPoisonEl.textContent = '';
      }
    }
  }

  updateHeaderBar();
}

function renderHand() {
  if (!handArea) return;
  handArea.innerHTML = '';
  let canPlayAny = false;
  player.hand.forEach((card, index) => {
    const isSpellCard = card.category === 'spell';
    const playable = (isSpellCard || player.actions > 0) && player.mp >= getCardCost(card);
    if (playable) canPlayAny = true;
    const cardEl = makeCardEl(card, playable ? () => playCard(index) : null);
    if (!playable) cardEl.classList.add('disabled');
    handArea.appendChild(cardEl);
  });

  const btnEndTurn = document.getElementById('btn-end-turn');
  if (btnEndTurn) {
    if (!isPlayerTurn) {
      btnEndTurn.classList.remove('btn-pulse');
    } else if (!canPlayAny) {
      btnEndTurn.classList.add('btn-pulse');
    } else {
      btnEndTurn.classList.remove('btn-pulse');
    }
  }
}

// --- 18. デッキ閲覧 ---
function openDeckViewer() {
  if (!deckViewerOverlay) return;

  document.getElementById('dv-deck-count').textContent = player.deck.length;
  document.getElementById('dv-discard-count').textContent = player.discard.length;
  document.getElementById('dv-hand-count').textContent = player.hand.length;

  function fillList(elId, cards) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = '';
    if (cards.length === 0) {
      el.innerHTML = '<p class="deck-empty-msg">カードなし</p>';
      return;
    }
    cards.forEach((c) => {
      const cardEl = makeCardEl(c, null);
      cardEl.style.cursor = 'default';
      el.appendChild(cardEl);
    });
  }

  fillList('deck-list', [...player.deck]);
  fillList('discard-list', [...player.discard]);
  fillList('hand-list', [...player.hand]);

  deckViewerOverlay.style.display = 'flex';
}

// --- 19. イベントリスナー ---
if (btnEndTurn) btnEndTurn.addEventListener('click', endTurn);

if (btnNext) {
  btnNext.addEventListener('click', () => {
    if (player.hp <= 0) {
      if (overlay) overlay.style.display = 'none';
      if (startScreen) startScreen.style.display = 'flex';
      playBGM('start');
      return;
    }
    proceedNextFloor();
  });
}

if (btnTitle) {
  btnTitle.addEventListener('click', () => {
    if (overlay) overlay.style.display = 'none';
    showScreen(startScreen);
    stopBGM();
  });
}

if (btnShare) {
  btnShare.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.playSE) window.playSE('cursor');
    const clsName =
      player.class === 'yuusya'
        ? '勇者'
        : player.class === 'kenshi'
          ? '戦士'
          : player.class === 'mahoutsukai'
            ? '魔法使い'
            : '格闘家';
    const isClear = resultTitle && resultTitle.textContent.includes('全面クリア');
    const shareText = isClear
      ? `【ローグライクカードRPG】職業「${clsName}」で魔王を撃破し全面クリア達成！(所持金: ${player.gold}G, レリック: ${player.relics.length}個)`
      : `【ローグライクカードRPG】職業「${clsName}」でエリア${currentArea}-${currentFloor}層まで到達！`;
    const shareUrl = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  });
}

let currentRlAchieveTab = 'all';

function openRlAchieveDetail(item) {
  const modal = document.getElementById('achieve-detail-modal');
  const badge = document.getElementById('achieve-detail-badge');
  const title = document.getElementById('achieve-detail-title');
  const cond = document.getElementById('achieve-detail-cond');
  const desc = document.getElementById('achieve-detail-desc');
  if (!modal) return;

  const unlockedCards = JSON.parse(localStorage.getItem('roguelike_unlocked_cards') || '[]');
  const unlockedMonsters = JSON.parse(localStorage.getItem('roguelike_unlocked_monsters') || '[]');
  const unlockedRelics = JSON.parse(localStorage.getItem('roguelike_unlocked_relics') || '[]');
  const stats = JSON.parse(localStorage.getItem('roguelike_stats') || '{"clears":0,"maxArea":1,"maxFloor":1}');

  const unlocked = item.isUnlocked(stats, unlockedCards, unlockedMonsters, unlockedRelics);

  if (badge) {
    badge.textContent = unlocked ? '達成済み' : '未達成';
    badge.className = `achieve-detail-badge ${unlocked ? 'unlocked' : 'locked'}`;
  }
  if (title) title.textContent = unlocked ? item.title : '？？？';
  if (cond) cond.textContent = item.cond;
  if (desc) desc.textContent = unlocked ? item.desc : '？？？';

  if (window.playSE) window.playSE('cursor');
  modal.style.display = 'flex';
}

function renderRlAchievements() {
  const cardGrid = document.getElementById('achievements-card-grid');
  const summaryBox = document.getElementById('achievements-summary-box');
  if (!cardGrid) return;

  const unlockedCards = JSON.parse(localStorage.getItem('roguelike_unlocked_cards') || '[]');
  const unlockedMonsters = JSON.parse(localStorage.getItem('roguelike_unlocked_monsters') || '[]');
  const unlockedRelics = JSON.parse(localStorage.getItem('roguelike_unlocked_relics') || '[]');
  const stats = JSON.parse(localStorage.getItem('roguelike_stats') || '{"clears":0,"maxArea":1,"maxFloor":1}');

  const totalCount = RL_ACHIEVEMENTS.length;
  const unlockedCount = RL_ACHIEVEMENTS.filter(a => a.isUnlocked(stats, unlockedCards, unlockedMonsters, unlockedRelics)).length;

  if (summaryBox) {
    summaryBox.innerHTML = `<span class="compendium-progress-text">達成度: <strong>${unlockedCount} / ${totalCount}</strong> (${Math.round((unlockedCount / totalCount) * 100)}%) | 全勝クリア: <strong>${stats.clears || 0} 回</strong></span>`;
  }

  const filtered = RL_ACHIEVEMENTS.filter(a => currentRlAchieveTab === 'all' || a.cat === currentRlAchieveTab);

  cardGrid.innerHTML = filtered.map(a => {
    const unlocked = a.isUnlocked(stats, unlockedCards, unlockedMonsters, unlockedRelics);
    return `
      <div class="achieve-card ${unlocked ? 'unlocked' : 'locked'}" data-id="${a.id}">
        <div class="achieve-card-badge">${unlocked ? '達成済み' : '未達成'}</div>
        <div class="achieve-card-title">${unlocked ? a.title : '？？？'}</div>
      </div>
    `;
  }).join('');

  cardGrid.querySelectorAll('.achieve-card').forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      const id = cardEl.dataset.id;
      const targetItem = RL_ACHIEVEMENTS.find(item => item.id === id);
      if (targetItem) openRlAchieveDetail(targetItem);
    });
  });
}

const btnOpenAchievements = document.getElementById('btn-open-achievements');
const achievementsScreen = document.getElementById('achievements-screen');
const btnCloseAchievements = document.getElementById('btn-close-achievements');
const btnBackAchievements = document.getElementById('btn-back-achievements');
const btnAchieveDetailClose = document.getElementById('btn-achieve-detail-close');

const btnResetData = document.getElementById('btn-reset-data');
const dataResetModal = document.getElementById('data-reset-modal');
const btnCancelReset = document.getElementById('btn-cancel-reset');
const btnConfirmReset = document.getElementById('btn-confirm-reset');

if (btnOpenAchievements) {
  btnOpenAchievements.addEventListener('click', () => {
    if (window.playSE) window.playSE('cursor');
    playBGM('achieve');
    renderRlAchievements();
    if (achievementsScreen) achievementsScreen.style.display = 'flex';
  });
}

document.querySelectorAll('#rl-achieve-tab-bar .achieve-tab').forEach(tabBtn => {
  tabBtn.addEventListener('click', (e) => {
    if (window.playSE) window.playSE('cursor');
    document.querySelectorAll('#rl-achieve-tab-bar .achieve-tab').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    currentRlAchieveTab = e.currentTarget.dataset.tab;
    renderRlAchievements();
  });
});

if (btnAchieveDetailClose) {
  btnAchieveDetailClose.addEventListener('click', () => {
    if (window.playSE) window.playSE('cancel');
    const modal = document.getElementById('achieve-detail-modal');
    if (modal) modal.style.display = 'none';
  });
}

function closeAchievementsScreen() {
  if (window.playSE) window.playSE('cancel');
  stopBGM();
  if (achievementsScreen) achievementsScreen.style.display = 'none';
}

if (btnCloseAchievements) btnCloseAchievements.addEventListener('click', closeAchievementsScreen);
if (btnBackAchievements) btnBackAchievements.addEventListener('click', closeAchievementsScreen);

if (btnResetData) {
  btnResetData.addEventListener('click', () => {
    if (window.playSE) window.playSE('cursor');
    if (dataResetModal) dataResetModal.style.display = 'flex';
  });
}

if (btnCancelReset) {
  btnCancelReset.addEventListener('click', () => {
    if (window.playSE) window.playSE('cancel');
    if (dataResetModal) dataResetModal.style.display = 'none';
  });
}

if (btnConfirmReset) {
  btnConfirmReset.addEventListener('click', () => {
    if (window.playSE) window.playSE('cursor');
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('roguelike_') || key.startsWith('rl_')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('roguelike_unlocked_cards');
    localStorage.removeItem('roguelike_unlocked_items');
    localStorage.removeItem('roguelike_unlocked_relics');
    localStorage.removeItem('roguelike_unlocked_monsters');
    localStorage.removeItem('roguelike_stats');
    location.reload();
  });
}

if (btnSkipReward) {
  btnSkipReward.addEventListener('click', () => {
    if (rewardOverlay) rewardOverlay.style.display = 'none';
    proceedNextFloor();
  });
}

if (btnViewDeck) {
  btnViewDeck.addEventListener('click', () => {
    if (!isGameOver) openDeckViewer();
  });
}
if (btnMapViewDeck) {
  btnMapViewDeck.addEventListener('click', () => {
    openDeckViewer();
  });
}
const btnTownViewDeck = document.getElementById('btn-town-view-deck');
if (btnTownViewDeck) {
  btnTownViewDeck.addEventListener('click', () => {
    openDeckViewer();
  });
}
if (closeDeckViewer) {
  closeDeckViewer.addEventListener('click', () => {
    if (deckViewerOverlay) deckViewerOverlay.style.display = 'none';
  });
}

// 戦闘中マップ確認
if (btnBattleViewMap) {
  btnBattleViewMap.addEventListener('click', () => {
    if (battleMapOverlay) {
      battleMapOverlay.style.display = 'flex';
      renderBoardMap(battleMapBoard, true);

      if (battleMapBoard) {
        setTimeout(() => {
          const wrapper = document.getElementById('battle-map-scroll-wrapper');
          if (wrapper) {
            applyMapBackground(wrapper);
            wrapper.scrollLeft = currentFloor * 70;
          }
        }, 100);
      }
    }
  });
}
if (btnCloseBattleMap) {
  btnCloseBattleMap.addEventListener('click', () => {
    if (battleMapOverlay) battleMapOverlay.style.display = 'none';
  });
}

const btnBattleRetire = document.getElementById('btn-battle-retire');
if (btnBattleRetire) {
  btnBattleRetire.addEventListener('click', () => {
    showGameConfirm('リタイア', '現在のプレイを終了してタイトルに戻りますか？', () => {
      showScreen(startScreen);
      stopBGM();
    });
  });
}

// デッキビュアーのタブ
document.querySelectorAll('.deck-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.deck-tab').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.dv-card-list').forEach((l) => l.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.target);
    if (target) target.classList.add('active');
  });
});

// スタート画面遷移
const startBtn = document.getElementById('start-btn');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (startScreen) startScreen.style.display = 'none';
    playBGM('reward');
    showScreen(classSelectScreen);
    setupClassSelection();
  });
}

const btnBackToTitle = document.getElementById('btn-back-to-title');
if (btnBackToTitle) {
  btnBackToTitle.addEventListener('click', () => {
    playSE('cancel');
    stopBGM();
    if (classSelectScreen) classSelectScreen.style.display = 'none';
    if (startScreen) startScreen.style.display = 'flex';
  });
}

// 各種ポップアップモーダル
const howtoBtn = document.getElementById('howto-btn');
const closeHowtoBtn = document.getElementById('close-howto-btn');
const howtoModal = document.getElementById('howto-modal');
const configBtn = document.getElementById('config-btn');
const closeConfigBtn = document.getElementById('close-config-btn');
const closeConfigBtnX = document.getElementById('close-config-btn-x');
const howtoBtnInConfig = document.getElementById('howto-btn-in-config');
const configModal = document.getElementById('config-modal');
const creditsBtn = document.getElementById('credits-btn');
const closeCreditsBtn = document.getElementById('close-credits-btn');
const closeCreditsBtnX = document.getElementById('close-credits-btn-x');
const creditsModal = document.getElementById('credits-modal');
const modalOverlay = document.getElementById('modal-overlay');

if (howtoBtn) {
  howtoBtn.addEventListener('click', () => {
    playSE('cursor');
    if (howtoModal) howtoModal.classList.add('active');
    if (modalOverlay) modalOverlay.classList.add('active');
  });
}
if (closeHowtoBtn) {
  closeHowtoBtn.addEventListener('click', () => {
    playSE('cursor');
    if (howtoModal) howtoModal.classList.remove('active');
    if (modalOverlay) modalOverlay.classList.remove('active');
  });
}

if (configBtn) {
  configBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    if (configModal) configModal.classList.add('active');
    if (modalOverlay) modalOverlay.classList.add('active');
  });
  configBtn.addEventListener('mousedown', (e) => e.stopPropagation());
}
if (closeConfigBtn) {
  closeConfigBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    if (configModal) configModal.classList.remove('active');
    if (modalOverlay) modalOverlay.classList.remove('active');
  });
}
if (closeConfigBtnX) {
  closeConfigBtnX.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    if (configModal) configModal.classList.remove('active');
    if (modalOverlay) modalOverlay.classList.remove('active');
  });
  closeConfigBtnX.addEventListener('mousedown', (e) => e.stopPropagation());
}
if (howtoBtnInConfig) {
  howtoBtnInConfig.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    if (configModal) configModal.classList.remove('active');
    if (howtoModal) howtoModal.classList.add('active');
  });
  howtoBtnInConfig.addEventListener('mousedown', (e) => e.stopPropagation());
}
if (creditsBtn) {
  creditsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    if (configModal) configModal.classList.remove('active');
    if (creditsModal) creditsModal.classList.add('active');
    if (modalOverlay) modalOverlay.classList.add('active');
  });
}
if (closeCreditsBtn) {
  closeCreditsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    if (creditsModal) creditsModal.classList.remove('active');
    if (modalOverlay) modalOverlay.classList.remove('active');
  });
}
if (closeCreditsBtnX) {
  closeCreditsBtnX.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    if (creditsModal) creditsModal.classList.remove('active');
    if (modalOverlay) modalOverlay.classList.remove('active');
  });
  closeCreditsBtnX.addEventListener('mousedown', (e) => e.stopPropagation());
}

// グローバルなボタンクリック音
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn, .icon-config, .deck-tab, .class-card');
  if (btn) {
    const id = btn.id;
    if (id !== 'btn-dialog-yes' && id !== 'btn-dialog-no' && id !== 'btn-dialog-ok') {
      playSE('cursor');
    }
  }
});

const bgmVolumeInput = document.getElementById('bgm-volume');
if (bgmVolumeInput) {
  bgmVolumeInput.addEventListener('input', (e) => {
    setBgmVolume(e.target.value / 100);
  });
}

const seVolumeInput = document.getElementById('se-volume');
if (seVolumeInput) {
  seVolumeInput.addEventListener('input', (e) => {
    setSeVolume(e.target.value / 100);
  });
}

function showEnemySkillCardModal(intent) {
  const cardSkillMap = {
    ankoku_ken: {
      name: '暗黒剣',
      category: 'special',
      type: 'attack',
      element: 'none',
      desc: 'プレイヤーの現在HPを半減(50%)させる',
      color: 'black',
    },
    daikaisho: {
      name: '大海嘯',
      category: 'special',
      type: 'attack',
      element: 'ice',
      desc: 'プレイヤーのバフを全解除し、1ターン行動不能＋水属性大ダメージ',
      color: 'blue',
    },
    drain: {
      name: 'ドレイン',
      category: 'special',
      type: 'attack',
      element: 'none',
      desc: 'プレイヤーにダメージを与え、与えたダメージ分自身のHPを回復する',
      color: 'red',
    },
    fire_attack: {
      name: '火炎',
      category: 'spell',
      type: 'attack',
      element: 'fire',
      desc: `プレイヤーに火属性ダメージを ${intent.damage || 3} 与える`,
      color: 'red',
    },
    ice_attack: {
      name: '冷気',
      category: 'spell',
      type: 'attack',
      element: 'ice',
      desc: `プレイヤーに水属性ダメージを ${intent.damage || 2} 与える`,
      color: 'blue',
    },
    wind_attack: {
      name: '迅風',
      category: 'spell',
      type: 'attack',
      element: 'wind',
      desc: `プレイヤーに風属性ダメージを ${intent.damage || 2} 与える`,
      color: 'green',
    },
    stone_attack: {
      name: '礫石',
      category: 'physical',
      type: 'attack',
      element: 'stone',
      desc: `プレイヤーに土属性ダメージを ${intent.damage || 3} 与える`,
      color: 'brown',
    },
    dazzle: {
      name: '幻惑',
      category: 'special',
      type: 'skill',
      element: 'dazzle',
      desc: 'プレイヤーを 2 ターンの間【幻惑】状態にする',
      color: 'purple',
    },
    silence: {
      name: '沈黙',
      category: 'special',
      type: 'skill',
      element: 'silence',
      desc: 'プレイヤーを 2 ターンの間【沈黙】状態にする',
      color: 'black',
    },
    kakusei_plus: {
      name: '覚醒+',
      category: 'special',
      type: 'skill',
      element: 'buff_up',
      desc: 'すさまじい魔力を高め、能昇状態(5ターン)になる',
      color: 'white',
    },
    meteor_plus: {
      name: '流星群+',
      category: 'special',
      type: 'attack',
      element: 'none',
      desc: '火・水・風・土の4属性で各 8 ダメージ (計 4 Hit)',
      color: 'purple',
    },
    rush: {
      name: '連撃',
      category: 'physical',
      type: 'attack',
      element: 'none',
      desc: 'プレイヤーに 2 回連続で攻撃を行う',
      color: 'red',
    },
    paralyze: {
      name: '麻痺',
      category: 'special',
      type: 'skill',
      element: 'paralyze',
      desc: 'プレイヤーを麻痺状態にする',
      color: 'yellow',
    },
    poison: {
      name: '毒計',
      category: 'special',
      type: 'skill',
      element: 'poison',
      desc: 'プレイヤーに毒 2 を付与する',
      color: 'purple',
    },
    heal: {
      name: '快癒',
      category: 'special',
      type: 'skill',
      element: 'none',
      desc: '自身の HP を 5 回復する',
      color: 'green',
    },
    buff_up: {
      name: '能昇',
      category: 'special',
      type: 'skill',
      element: 'buff_up',
      desc: '自身を能昇状態にする',
      color: 'white',
    },
    buff_down: {
      name: '能降',
      category: 'special',
      type: 'skill',
      element: 'buff_down',
      desc: 'プレイヤーを能降状態にする',
      color: 'black',
    },
  };

  const skillInfo = cardSkillMap[intent.type] || {
    name: intent.desc || '攻撃',
    category: 'physical',
    type: 'attack',
    element: 'none',
    desc: `プレイヤーに ${intent.damage || 1} ダメージを与える`,
    color: 'red',
  };

  showCardDetailModal({
    id: intent.type,
    name: skillInfo.name,
    cost: 0,
    type: skillInfo.type,
    category: skillInfo.category,
    element: skillInfo.element,
    value: intent.damage || 0,
    desc: skillInfo.desc,
    color: skillInfo.color,
  });
}

// ===================================================
// 図鑑（カード・アイテム・レリック・モンスター）初期化
// ===================================================
initCompendium(makeCardEl, showCardDetailModal, showItemDetailModal);
