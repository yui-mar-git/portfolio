
// ===================================================
// ローグライク カードバトル JS
// ===================================================

import { CARD_DB, REWARD_POOL, INITIAL_DECKS, upgradeCard } from '../../../data/roguelike/cards';
import { RELIC_DB } from '../../../data/roguelike/relics';
import { ITEM_DB } from '../../../data/roguelike/items';
import { enemyTemplates, getEnemyTemplate } from '../../../data/roguelike/enemies';

// ===================================================
// Audio コストger
// ===================================================
const BGM_PATH = new URL('../../../assets/games/roguelike/audio/bgm/', import.meta.url).href;
const SE_PATH = new URL('../../../assets/games/roguelike/audio/se/', import.meta.url).href;

const BGM_DB = {
  'start': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_theme14.mp3', import.meta.url).href,
  'reward': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_event04.mp3', import.meta.url).href,
  'castle': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_castle01.mp3', import.meta.url).href,
  'inn': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_village01.mp3', import.meta.url).href,
  'town': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_town01.mp3', import.meta.url).href,
  'forest': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_dangeon13.mp3', import.meta.url).href,
  'area1': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_field05.mp3', import.meta.url).href,
  'area2': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_field11.mp3', import.meta.url).href,
  'area3': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_field07.mp3', import.meta.url).href,
  'battle': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_battle07.mp3', import.meta.url).href,
  'boss': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_boss02.mp3', import.meta.url).href,
  'lastboss': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_boss06.mp3', import.meta.url).href,
  'bandit_pre': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_dangeon07.mp3', import.meta.url).href,
  'darkelf_pre': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_dangeon22.mp3', import.meta.url).href,
  'golem_pre': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_dangeon01.mp3', import.meta.url).href,
  'vampire_pre': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_dangeon17.mp3', import.meta.url).href,
  'leviathan_pre': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_dangeon15.mp3', import.meta.url).href,
  'maou_pre': new URL('../../../assets/games/roguelike/audio/bgm/maou_game_dangeon04b.mp3', import.meta.url).href
};

const SE_DB = {
  'relic': new URL('../../../assets/games/roguelike/audio/se/maou_game_jingle09.mp3', import.meta.url).href,
  'inn': new URL('../../../assets/games/roguelike/audio/se/maou_game_jingle07.mp3', import.meta.url).href,
  'victory': new URL('../../../assets/games/roguelike/audio/se/maou_game_jingle01.mp3', import.meta.url).href,
  'defeat': new URL('../../../assets/games/roguelike/audio/se/maou_game_jingle08.mp3', import.meta.url).href,
  'strike': new URL('../../../assets/games/roguelike/audio/se/剣で斬る2.mp3', import.meta.url).href,
  'smite': new URL('../../../assets/games/roguelike/audio/se/剣で斬る3.mp3', import.meta.url).href,
  'rush': new URL('../../../assets/games/roguelike/audio/se/剣で斬る4.mp3', import.meta.url).href,
  'stone': new URL('../../../assets/games/roguelike/audio/se/岩が真っ二つに割れる.mp3', import.meta.url).href,
  'buff_up': new URL('../../../assets/games/roguelike/audio/se/ステータス上昇魔法2.mp3', import.meta.url).href,
  'buff_down': new URL('../../../assets/games/roguelike/audio/se/HP吸収魔法2.mp3', import.meta.url).href,
  'enemy_attack': new URL('../../../assets/games/roguelike/audio/se/小パンチ.mp3', import.meta.url).href,
  'boss_attack': new URL('../../../assets/games/roguelike/audio/se/打撃6.mp3', import.meta.url).href,
  'reward_select': new URL('../../../assets/games/roguelike/audio/se/決定ボタンを押す4.mp3', import.meta.url).href,
  'invalid': new URL('../../../assets/games/roguelike/audio/se/ビープ音4.mp3', import.meta.url).href,
  'harpy': new URL('../../../assets/games/roguelike/audio/se/ヒヨドリの鳴き声1.mp3', import.meta.url).href,
  'fire': new URL('../../../assets/games/roguelike/audio/se/火炎魔法1.mp3', import.meta.url).href,
  'ice': new URL('../../../assets/games/roguelike/audio/se/氷魔法1.mp3', import.meta.url).href,
  'thunder': new URL('../../../assets/games/roguelike/audio/se/雷魔法1.mp3', import.meta.url).href,
  'wind': new URL('../../../assets/games/roguelike/audio/se/風魔法1.mp3', import.meta.url).href,
  'poison': new URL('../../../assets/games/roguelike/audio/se/毒魔法1.mp3', import.meta.url).href,
  'heal': new URL('../../../assets/games/roguelike/audio/se/回復魔法1.mp3', import.meta.url).href,
  'meteor': new URL('../../../assets/games/roguelike/audio/se/ドラゴンが火を吐く.mp3', import.meta.url).href,
  'confirm': new URL('../../../assets/games/roguelike/audio/se//portfolio/common/assets/audio/se/決定ボタンを押す2.mp3', import.meta.url).href,
  'cancel': new URL('../../../assets/games/roguelike/audio/se//portfolio/common/assets/audio/se/キャンセル1.mp3', import.meta.url).href,
  'cursor': new URL('../../../assets/games/roguelike/audio/se//portfolio/common/assets/audio/se/カーソル移動7.mp3', import.meta.url).href,
  'draw': new URL('../../../assets/games/roguelike/audio/se/カードをめくる.mp3', import.meta.url).href,
  'play': new URL('../../../assets/games/roguelike/audio/se/カードを台の上に出す.mp3', import.meta.url).href
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
    currentBgmAudio.play().catch(e => console.log('BGM Play blocked:', e));
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
  se.play().catch(e => console.log('SE Play blocked:', e));
  if (seId === 'relic' || seId === 'level_up') {
    currentLongSEs.push(se);
    se.addEventListener('ended', () => {
      currentLongSEs = currentLongSEs.filter(s => s !== se);
    });
  }
}

function stopLongSE() {
  currentLongSEs.forEach(se => {
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
  if (!cutsceneModal || scenes.length === 0) { onComplete?.(); return; }
  let si = 0; // scene index
  let li = 0; // line index

  function render() {
    const s = scenes[si];
    // 背景
    if (cutsceneBg) cutsceneBg.style.backgroundImage = s.bg ? `url('${s.bg}')` : 'none';
    // ポートレート
    if (cutscenePortraits) {
      cutscenePortraits.innerHTML = '';
      (s.portraits || []).forEach(p => {
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
  maxHp: 10,
  hp: 10,
  maxMp: 5,
  mp: 5,
  gold: 50,
  deck: [],
  hand: [],
  discard: [],
  exhausted: [],
  relics: [],
  items: [
    { id: 'sandwich', used: false }
  ],
  actions: 1,
  poison: 0,
  paralyze: 0,
  buffUp: 0,
  buffDown: 0
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
  yuusya: new URL('../../../assets/games/roguelike/images/characters/figure_rpg_character_yuusya.png', import.meta.url).href,
  kenshi: new URL('../../../assets/games/roguelike/images/characters/figure_rpg_character_kenshi.png', import.meta.url).href,
  mahoutsukai: new URL('../../../assets/games/roguelike/images/characters/figure_rpg_character_mahoutsukai.png', import.meta.url).href,
  butouka: new URL('../../../assets/games/roguelike/images/characters/figure_rpg_character_butouka.png', import.meta.url).href
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

function showGameConfirm(title, message, onYes, onNo = null) {
  if (dialogExtra) {
    dialogExtra.innerHTML = '';
    dialogExtra.style.display = 'none';
  }
  if (dialogTitle) dialogTitle.innerHTML = title;
  if (dialogMessage) dialogMessage.innerHTML = message;
  if (btnDialogOk) {
    btnDialogOk.style.display = 'none';
    btnDialogOk.setAttribute('style', 'display: none !important');
  }
  if (btnDialogYes) {
    btnDialogYes.style.display = 'inline-block';
    btnDialogYes.setAttribute('style', 'display: inline-block !important; flex: 1; padding: 0.4rem 0;');
  }
  if (btnDialogNo) {
    btnDialogNo.style.display = 'inline-block';
    btnDialogNo.setAttribute('style', 'display: inline-block !important; flex: 1; padding: 0.4rem 0;');
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
    startScreen, classSelectScreen, mapScreen, innScreen,
    shopServiceScreen, townScreen, eventScreen, document.querySelector('.battle-layout')
  ];
  screens.forEach(s => {
    if (s) s.style.display = 'none';
  });
  if (target) {
    target.style.display = (target === document.querySelector('.battle-layout')) ? 'grid' : 'flex';
    if (target === mapScreen || target === document.querySelector('.battle-layout')) {
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

if (btnCloseCardDetail) {
  btnCloseCardDetail.addEventListener('click', () => {
    if (cardDetailModal) cardDetailModal.style.display = 'none';
  });
}

function showCardDetailModal(card) {
  if (!cardDetailModal) return;
  cardDetailContent.innerHTML = '';
  const cardEl = makeCardEl(card, false);
  cardEl.style.transform = 'scale(1.3)';
  cardEl.style.transformOrigin = 'center top';
  cardEl.style.cursor = 'default';
  cardDetailContent.appendChild(cardEl);
  const descHtml = (card.desc || '').replace(/\n/g, '<br>');
  const flavorHtml = `<div style="margin-top: auto; padding-top: 1rem; color: #888; font-size: 0.8rem; font-style: italic;">${card.flavor || 'フレーバーテキスト準備中'}</div>`;
  cardDetailDesc.innerHTML = `<div style="margin-bottom: 0.5rem;">${descHtml}</div>${flavorHtml}`;
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
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.background = 'linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)';
  container.style.border = '2px solid ' + (type === 'relic' ? '#f1c40f' : '#3498db');
  container.style.borderRadius = '10px';
  container.style.padding = '1.5rem';
  container.style.width = '240px';
  container.style.color = '#fff';

  const img = document.createElement('img');
  img.src = item.image;
  img.style.width = '64px';
  img.style.height = '64px';
  img.style.objectFit = 'contain';
  img.style.marginBottom = '1rem';
  container.appendChild(img);

  const title = document.createElement('div');
  title.textContent = item.name;
  title.style.fontSize = '1.1rem';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '0.5rem';
  container.appendChild(title);

  const desc = document.createElement('div');
  desc.innerHTML = (item.desc || '').replace(/\n/g, '<br>');
  desc.style.fontSize = '0.85rem';
  desc.style.color = 'var(--text-main)';
  desc.style.textAlign = 'center';
  container.appendChild(desc);

  cardDetailContent.appendChild(container);

  const typeName = type === 'relic' ? 'レリック' : 'アイテム';
  const flavorHtml = `<div style="margin-top: auto; padding-top: 1rem; color: #888; font-size: 0.8rem; font-style: italic;">${item.flavor || 'フレーバーテキスト準備中'}</div>`;
  cardDetailDesc.innerHTML = `<div style="text-align: center; color: #888;">【${typeName}】</div>${flavorHtml}`;
  cardDetailModal.style.display = 'flex';
}

function updateHeaderBar() {
  if (headerFloor) headerFloor.textContent = `エリア ${currentArea} - ${currentFloor}層`;
  if (headerGold) headerGold.textContent = player.gold;
  if (headerHp) headerHp.textContent = `${player.hp}/${player.maxHp}`;
  if (headerMp) headerMp.textContent = `${player.mp}/${player.maxMp}`;

  if (headerRelicsList) {
    headerRelicsList.innerHTML = '';
    player.relics.forEach(relicId => {
      const relic = RELIC_DB[relicId];
      if (relic) {
        const img = document.createElement('img');
        img.src = relic.image;
        img.className = 'relic-icon';
        img.title = `${relic.name}\n${relic.desc}`;
        img.addEventListener('click', () => showItemDetailModal(relic, 'relic'));
        img.style.cssText = 'width: 20px; height: 20px; object-fit: contain; border: 1px solid #444; border-radius: 3px; background: rgba(255,255,255,0.05); cursor: pointer;';
        headerRelicsList.appendChild(img);
      }
    });
  }
}

// --- 7. 王様遇遇レリックイベント (Floor 0) ---
function showKingEvent() {
  playBGM('castle');
  if (kingRelicChoices) kingRelicChoices.innerHTML = '';

  const allRelicKeys = Object.keys(RELIC_DB).filter(k => !RELIC_DB[k].isFixed);
  shuffle(allRelicKeys);
  const picks = allRelicKeys.slice(0, 3);

  picks.forEach(relicId => {
    const relic = RELIC_DB[relicId];
    const el = document.createElement('div');
    el.style.cssText = 'border: 2px solid #ffd700; width: 96px; min-width: 96px; height: 128px; cursor: pointer; display: flex; flex-direction: column; align-items: center; padding: 0.4rem; position: relative; background: rgba(15,12,5,0.9); border-radius: 8px; box-shadow: 0 0 12px rgba(255,215,0,0.3); transition: transform 0.15s; flex-shrink: 0;';

    const imgEl = document.createElement('img');
    imgEl.src = relic.image || '';
    imgEl.alt = relic.name;
    imgEl.style.cssText = 'width: 36px; height: 36px; object-fit: contain; margin-top: 0.3rem; margin-bottom: 0.2rem;';

    const nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-size: 0.55rem; font-weight: bold; color: #ffd700; text-align: center; line-height: 1.2; margin-bottom: 0.15rem;';
    nameEl.textContent = relic.name;

    const descEl = document.createElement('div');
    descEl.style.cssText = 'font-size: 0.52rem; color: var(--text-muted); text-align: center; line-height: 1.2; padding: 0 2px;';
    descEl.innerHTML = relic.desc;

    el.appendChild(imgEl);
    el.appendChild(nameEl);
    el.appendChild(descEl);

    el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.07)'; });
    el.addEventListener('mouseleave', () => { el.style.transform = 'none'; });

    el.addEventListener('click', () => {
      showGameConfirm(
        'レリック選択',
        `レリック「${relic.name}」を選択しますか？<br><br><span style="font-size:0.75rem; color:var(--text-muted);">${relic.desc}</span>`,
        () => {
          playSE('relic');
          player.relics.push(relicId);
          if (player.class === 'yuusya') {
            const remaining = allRelicKeys.filter(r => r !== relicId);
            const extra = remaining[0];
            playSE('relic');
            player.relics.push(extra);
            showGameAlert('王からの餞別 ', `さらに勇者の幸運により「${RELIC_DB[extra].name}」も追加で手に入りました！`, () => {
              if (kingEventModal) kingEventModal.style.display = 'none';
              enterFloorNode();
            });
          } else {
            if (kingEventModal) kingEventModal.style.display = 'none';
            enterFloorNode();
          }
        },
        null  // いいえ → 何もしない（再び選べる）
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
  butouka: '格闘家'
};

function setupClassSelection() {

  // 初期化：全カードからselectedをすべて削除
  const classCards = document.querySelectorAll('.class-card');
  classCards.forEach(card => {
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

  classCards.forEach(card => {
    card.addEventListener('click', () => {
      // 全カードからselectedを削除
      classCards.forEach(c => c.classList.remove('selected'));
      // クリックしたカードにselectedを履用
      card.classList.add('selected');
      selectedClass = card.dataset.class;
      let initialCards = INITIAL_DECKS[selectedClass].map(id => CARD_DB[id]);

      const classInfo = {
        yuusya: { hp: 10, mp: 5, effect: '開始時に王様からレリックを2つ貰える' },
        kenshi: { hp: 15, mp: 4, effect: '毎ターン開始時にHPが1回復する' },
        mahoutsukai: { hp: 7, mp: 7, effect: '毎ターン開始時にMPが1回復する' },
        butouka: { hp: 8, mp: 4, effect: '毎ターンの行動回数が+1' }
      };
      const info = classInfo[selectedClass];
      const confirmMessage = `初期HP: ${info.hp} / 初期MP: ${info.mp}<br><span style="color: #ffb84d;">【特殊効果】 ${info.effect}</span>`;

      showGameConfirm(`${CLASS_NAMES[selectedClass] || selectedClass}として冒険にでますか？`, confirmMessage, () => {
        initGame();
      });

      if (dialogExtra) {
        dialogExtra.innerHTML = '';
        const deckWrap = document.createElement('div');
        deckWrap.style.cssText = 'margin-top: 1rem; text-align: left; background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 6px;';
        const deckLabel = document.createElement('div');
        deckLabel.style.cssText = 'font-size: 0.75rem; color: #aaa; margin-bottom: 0.4rem;';
        deckLabel.textContent = '【初期デッキ】';
        deckWrap.appendChild(deckLabel);
        const deckGrid = document.createElement('div');
        deckGrid.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; max-height: 245px; overflow-y: auto; padding: 4px 0;';
        initialCards.forEach(c => {
          const cardEl = makeCardEl(c, null);
          cardEl.style.transform = 'scale(0.65)';
          cardEl.style.transformOrigin = 'top left';
          cardEl.style.margin = '0';
          const wrapper = document.createElement('div');
          wrapper.style.cssText = 'width: 58px; height: 94px;';
          wrapper.appendChild(cardEl);
          deckGrid.appendChild(wrapper);
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
    player.maxHp = 10;
    player.maxMp = 5;
  } else if (player.class === 'kenshi') {
    player.maxHp = 15;
    player.maxMp = 4;
  } else if (player.class === 'mahoutsukai') {
    player.maxHp = 7;
    player.maxMp = 7;
  } else if (player.class === 'butouka') {
    player.maxHp = 8;
    player.maxMp = 4;
  }
  player.hp = player.maxHp;
  player.mp = player.maxMp;

  player.deck = INITIAL_DECKS[player.class].map(id => ({ ...CARD_DB[id] }));
  player.discard = [];
  player.hand = [];
  player.items.forEach(i => i.used = false);

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
  lastboss: { label: '魔王の気配', class: 'lastboss' }
};


function generateAreaMap() {
  generatedMap = [];

  function getRandomNonNormal() {
    let types = ['event', 'town', 'inn', 'fairy'];
    if (currentArea === 1 && currentFloor <= 3) {
      types = ['event', 'town', 'fairy'];
    }
    return types[Math.floor(Math.random() * types.length)];
  }

  function generateRoute3() {
    const patterns = [
      ['normal', 'X', 'normal'],
      ['X', 'normal', 'X']
    ];
    const p = patterns[Math.floor(Math.random() * patterns.length)];
    return p.map(x => x === 'X' ? getRandomNonNormal() : 'normal');
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
      const type = (currentArea === 3) ? 'lastboss' : 'boss';
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
  svg.style.cssText = 'position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1;';
  container.appendChild(svg);

  const nodeElements = [];

  generatedMap.forEach((floorNodes, fIndex) => {
    const columnDiv = document.createElement('div');
    columnDiv.style.cssText = 'display: flex; flex-direction: column; justify-content: center; gap: 30px; height: 100%; position: relative;';

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

      const isNextTarget = (fIndex === currentFloor + 1 && !isGameOver);
      if (isNextTarget) {
        let canMove = false;
        if (currentFloor === 0 || currentFloor === 4 || currentFloor === 5) {
          canMove = true;
        } else if (fIndex === 4 || fIndex === 5 || fIndex === 9) {
          canMove = true;
        } else {
          canMove = (String(node.row) === String(currentRow));
        }

        if (canMove) {
          btn.classList.add('active');
        }
        btn.style.cursor = canMove ? 'pointer' : 'not-allowed';

        btn.addEventListener('click', () => {
          if (!canMove) {
            playSE('invalid');
            showGameAlert('移動不可', '現在のルートから外れることはできません。<br>直進するマス（現在地と同じ行のマス）を選んでください。');
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
            null
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
    for (let f = 0; f < generatedMap.length - 1; f++) {
      const currentNodes = nodeElements.filter(n => n.f === f);
      const nextNodes = nodeElements.filter(n => n.f === f + 1);

      currentNodes.forEach(curr => {
        const currRect = curr.element.getBoundingClientRect();
        const currX = (currRect.left + currRect.width / 2) - containerRect.left + container.scrollLeft;
        const currY = (currRect.top + currRect.height / 2) - containerRect.top;

        nextNodes.forEach(nxt => {
          if (currentNodes.length > 1 && nextNodes.length > 1) {
            if (curr.r !== nxt.r) return;
          }

          const nxtRect = nxt.element.getBoundingClientRect();
          const nxtX = (nxtRect.left + nxtRect.width / 2) - containerRect.left + container.scrollLeft;
          const nxtY = (nxtRect.top + nxtRect.height / 2) - containerRect.top;

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
    case 'start': return new URL('../../../assets/games/roguelike/images/map/castle.png', import.meta.url).href;
    case 'normal': return new URL('../../../assets/games/roguelike/images/map/mark_chuui.png', import.meta.url).href;
    case 'elite': return new URL('../../../assets/games/roguelike/images/map/mark_chuui.png', import.meta.url).href;
    case 'mimic': return new URL('../../../assets/games/roguelike/images/map/mark_chuui.png', import.meta.url).href;
    case 'inn': return new URL('../../../assets/games/roguelike/images/map/building_hotel_pet.png', import.meta.url).href;
    case 'fairy': return new URL('../../../assets/games/roguelike/images/map/mori.png', import.meta.url).href;
    case 'event': return new URL('../../../assets/games/roguelike/images/map/mark_question.png', import.meta.url).href;
    case 'town': return new URL('../../../assets/games/roguelike/images/map/omise_shop_tatemono.png', import.meta.url).href;
    case 'midboss':
      if (currentArea === 1) return new URL('../../../assets/games/roguelike/images/map/doukutsu.png', import.meta.url).href; // エリア1中ボス：バンディット
      if (currentArea === 2) return new URL('../../../assets/games/roguelike/images/map/mon_gate_western_close.png', import.meta.url).href;
      if (currentArea === 3) return new URL('../../../assets/games/roguelike/images/map/arashi.png', import.meta.url).href;
      return new URL('../../../assets/games/roguelike/images/map/yama_kiri.png', import.meta.url).href;
    case 'boss':
      if (currentArea === 1) return new URL('../../../assets/games/roguelike/images/map/yama_kiri.png', import.meta.url).href; // エリア1ボス：ダークエルフの森
      return new URL('../../../assets/games/roguelike/images/map/building_europe_kojou.png', import.meta.url).href;
    case 'lastboss': return new URL('../../../assets/games/roguelike/images/map/building_europe_kojou.png', import.meta.url).href;
    default: return new URL('../../../assets/games/roguelike/images/icons/no_image_square.jpg', import.meta.url).href;
  }
}

function showMapScreen() {
  showScreen(mapScreen);
  renderBoardMap(mapBoard, false);
  if (currentArea === 1) playBGM('area1');
  else if (currentArea === 2) playBGM('area2');
  else playBGM('area3');
  if (mapScrollWrapper) {
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
      bg: new URL('../../../assets/games/roguelike/images/map/doukutsu.png', import.meta.url).href,
      portraits: [{ src: new URL('../../../assets/games/roguelike/images/monsters/character_sanzoku.png', import.meta.url).href, size: '130px' }],
      speaker: '山賊',
      lines: [
        'この一帯を荒らし回っているのはこのオレだ…！',
        'お前みたいな旅人は格好の獲物だ。生きて帰しちゃいけねぇ！'
      ]
    }
  ],
  boss_area1: [
    {
      bg: new URL('../../../assets/games/roguelike/images/map/yama_kiri.png', import.meta.url).href,
      portraits: [{ src: new URL('../../../assets/games/roguelike/images/monsters/fantasy_dark_elf.png', import.meta.url).href, size: '130px' }],
      speaker: 'ダークエルフ',
      lines: [
        'オマエ…\nコノ森ヲ\u30fb\u30fb\u30fb荒ラス者\u30fb\u30fb\u30fb？',
        'タチサレ\u30fb\u30fb\u30fb\nタチサレ\u30fb\u30fb\u30fb！\n（正気を失った目でこちらを睨みつけてくる）'
      ]
    }
  ],
  midboss_area2: [
    {
      bg: new URL('../../../assets/games/roguelike/images/map/mon_gate_western_close.png', import.meta.url).href,
      portraits: [{ src: new URL('../../../assets/games/roguelike/images/monsters/fantasy_golem.png', import.meta.url).href, size: '130px' }],
      speaker: '─── 状況 ───',
      lines: [
        '町の入口前に、石造りの巨体が立ち塞がっている。',
        'なんと、ゴーレムが突然こちらに向かって動き出した！\n…戦うしかないようだ。'
      ]
    }
  ],
  boss_area2: [
    {
      bg: new URL('../../../assets/games/roguelike/images/map/building_europe_kojou.png', import.meta.url).href,
      portraits: [{ src: new URL('../../../assets/games/roguelike/images/monsters/fantasy_dracula2.png', import.meta.url).href, size: '130px' }],
      speaker: 'ヴァンパイア',
      lines: [
        'おやおや…\nこんな辺鄙な城までご足労いただけるとは。',
        'まさか単身で姫を取り返しにきたのかな？\n感心はするが、そうはいかない。',
        '招かざる客人には\u2015\u2015\nお引き取り願おうか。'
      ]
    }
  ],
  midboss_area3: [
    {
      bg: new URL('../../../assets/games/roguelike/images/map/arashi.png', import.meta.url).href,
      portraits: [],
      speaker: '─── 状況 ───',
      lines: [
        '荒れ狂う波の間から、巨大な影が近づいてくる\u30fb\u30fb\u30fb。',
        '海底から湧き上がるような咆哮が、空気を震わせた！'
      ]
    }
  ]
};

// エリア1中ボス（バンディット）の戦闘前カットシーン
const CUTSCENE_PRE_MIDBOSS_AREA1 = [
  {
    bg: new URL('../../../assets/games/roguelike/images/map/doukutsu.png', import.meta.url).href,
    portraits: [{ src: new URL('../../../assets/games/roguelike/images/monsters/character_sanzoku.png', import.meta.url).href, size: '140px' }],
    speaker: 'バンディット',
    lines: [
      'ほぉ…よくここまで来たな。部下を散々やっつけてくれて。',
      'だが、ここからはオレが直々に相手してやる。\nこの洞窟の奥まで来て、生きて帰れると思うなよ！'
    ]
  }
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
const btnInnRest = document.getElementById('btn-inn-rest');
const btnInnLeave = document.getElementById('btn-inn-leave');

function showInnScreen() {
  playBGM('inn');
  showScreen(innScreen);
}

if (btnInnRest) {
  btnInnRest.addEventListener('click', () => {
    if (player.gold >= 15) {
      showGameConfirm('宿での休息', '15ゴールドを支払い休息しますか？<br>(HPが全回復し、状態異常が全解除されます)', () => {
        player.gold -= 15;
        playSE('inn');
        player.hp = player.maxHp;
        player.poison = 0;
        player.paralyze = 0;
        showGameAlert('休息完了', '体力が完全に回復しました！', () => {
          proceedNextFloor();
        });
      });
    } else {
      showGameAlert('宿での休息', 'ゴールドが足りません！');
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
  const title = document.getElementById('shop-service-title');
  const desc = document.getElementById('shop-service-desc');
  if (title) title.textContent = type === 'upgrade' ? 'カード強化' : 'カード削除';
  if (desc) desc.textContent = type === 'upgrade'
    ? '20ゴールドを支払い、手札のカードを1枚「強化（+）」します。'
    : '20ゴールドを支払い、手札のカードを1枚「削除」します。';

  if (shopServiceCardList) {
    shopServiceCardList.innerHTML = '';
    const targets = [...player.deck, ...player.discard, ...player.hand];

    if (targets.length === 0) {
      shopServiceCardList.innerHTML = '<div style="grid-column: span 3; font-size:0.75rem; color:var(--text-muted); text-align:center; padding:1rem;">カードがありません</div>';
    } else {
      // unique id
      const uniqueIds = Array.from(new Set(targets.map(c => c.id)));
      uniqueIds.forEach(id => {
        const cardInstance = targets.find(c => c.id === id);
        const isUpgraded = id.endsWith('+');
        const btn = makeCardEl(cardInstance, () => {
          if (type === 'upgrade' && isUpgraded) return;
          if (player.gold >= 20) {
            showGameConfirm(type === 'upgrade' ? 'カードの強化' : 'カードの削除', `「${cardInstance.name}」を 20ゴールドで${type === 'upgrade' ? '強化' : '削除'}しますか？`, () => {
              player.gold -= 20;
              let index = player.deck.findIndex(c => c.id === id && (type === 'remove' || !c.upgraded));
              if (index !== -1) {
                if (type === 'upgrade') player.deck[index] = upgradeCard(player.deck[index]);
                else player.deck.splice(index, 1);
              } else {
                index = player.discard.findIndex(c => c.id === id && (type === 'remove' || !c.upgraded));
                if (index !== -1) {
                  if (type === 'upgrade') player.discard[index] = upgradeCard(player.discard[index]);
                  else player.discard.splice(index, 1);
                } else {
                  index = player.hand.findIndex(c => c.id === id && (type === 'remove' || !c.upgraded));
                  if (index !== -1) {
                    if (type === 'upgrade') player.hand[index] = upgradeCard(player.hand[index]);
                    else player.hand.splice(index, 1);
                  }
                }
              }
              if (type === 'upgrade') {
                shopUpgradeUsed = true;
                if (btnTownUpgrade) { btnTownUpgrade.style.opacity = '0.5'; btnTownUpgrade.style.cursor = 'not-allowed'; }
              } else {
                shopRemoveUsed = true;
                if (btnTownRemove) { btnTownRemove.style.opacity = '0.5'; btnTownRemove.style.cursor = 'not-allowed'; }
              }
              showGameAlert(type === 'upgrade' ? '強化成功' : '削除成功', `「${cardInstance.name}」を${type === 'upgrade' ? '強化' : '削除'}しました！`, () => {
                renderShop();
                updateHeaderBar();
                showScreen(townScreen);
              });
            });
          } else {
            showGameAlert('ショップ', 'ゴールドが足りません！');
          }
        });
        if (type === 'upgrade') {
          btn.style.cursor = isUpgraded ? 'not-allowed' : 'pointer';
          if (isUpgraded) {
            const mask = document.createElement('div');
            mask.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:10; border-radius:4px;';
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
    document.getElementById('event-image').src = new URL('../../../assets/games/roguelike/images/characters/fantasy_pixy2.png', import.meta.url).href;
  }
  if (document.getElementById('event-title')) document.getElementById('event-title').textContent = '祝福の妖精';
  if (document.getElementById('event-text')) document.getElementById('event-text').textContent = '「傷ついているようね。癒やしてあげるわ」\n妖精の光があなたを包み込む……。\n(最大HPの30%を回復)';

  const container = document.getElementById('event-options');
  if (container) {
    container.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.style.width = '100%';
    btn.textContent = '回復してもらう';
    btn.addEventListener('click', () => {
      const healAmount = Math.floor(player.maxHp * 0.3) || 1;
      player.hp = Math.min(player.maxHp, player.hp + healAmount);
      playSE('heal');
      updateHeaderBar();
      showGameAlert('回復', `HPが ${healAmount} 回復した！`, () => {
        proceedNextFloor();
      });
    });
    container.appendChild(btn);
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

  const pool = [...REWARD_POOL].filter(id => id !== 'meteor');
  shuffle(pool);
  const area1UpgradedIdx = Math.floor(Math.random() * 6);
  shopCardsPool = pool.slice(0, 6).map((id, idx) => {
    let isBargain = (idx === 0);
    let isUpgraded = false;
    if (currentArea === 1) {
      if (idx === area1UpgradedIdx) isUpgraded = true;
    } else if (currentArea === 2) {
      isUpgraded = (Math.random() < 0.5);
    } else if (currentArea >= 3) {
      isUpgraded = true;
    }
    return { id, bought: false, upgraded: isUpgraded, bargain: isBargain };
  });
  const allItemKeys = Object.keys(ITEM_DB).filter(id => !ITEM_DB[id].notForSale);
  shuffle(allItemKeys);
  shopItemsPool = allItemKeys.slice(0, 3).map(id => ({ id, bought: false }));
  renderShop();
}

function renderShop() {
  if (townCards) {
    townCards.innerHTML = '';
    shopCardsPool.forEach(item => {
      let card = { ...CARD_DB[item.id] };
      if (item.upgraded) card = upgradeCard(card);
      const div = document.createElement('div');
      div.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
      const el = makeCardEl(card, false);
      el.style.cssText = 'width: 80px; height: 110px; cursor: pointer; margin: 0; border-width:2px; transform: scale(0.85); transform-origin: top center;';
      if (item.bought) {
        el.style.opacity = '0.2';
        el.style.cursor = 'not-allowed';
        const boughtText = document.createElement('span');
        boughtText.style.cssText = 'font-size: 0.65rem; color: #ffb84d; margin-top: 2px;';
        boughtText.textContent = '売約済';
        div.appendChild(el);
        div.appendChild(boughtText);
      } else {
        el.addEventListener('click', () => {
          showCardDetailModal(card);
        });
        const price = item.bargain ? 7 : 15;
        const bgColor = '#1976d2';
        const borderColor = '#1565c0';
        const priceColor = item.bargain ? '#4ade80' : '#fff';

        const buyBtn = document.createElement('button');
        buyBtn.className = 'btn btn-secondary';
        buyBtn.style.cssText = `font-size: 0.75rem; padding: 4px 10px; margin-top: 4px; display: flex; align-items: center; justify-content: center; width: auto; min-width: 60px; height: auto; border-radius: 8px; background-color: ${bgColor}; border: 1px solid ${borderColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.3);`;
        buyBtn.innerHTML = `<span style="color: ${priceColor}; font-weight: bold; margin-right: 2px;">${price}</span> <span style="color: #fff;">Gで購入</span>`;
        buyBtn.addEventListener('click', () => {
          if (player.gold >= price) {
            showGameConfirm('商品の購入', `「${card.name}」を${price}ゴールドで購入しますか？`, () => {
              player.gold -= price;
              playSE('reward_select');
              player.discard.push(card);
              item.bought = true;
              showGameAlert('購入完了', `「${card.name}」を購入し、デッキに追加しました！`, () => {
                renderShop();
                updateHeaderBar();
              });
            });
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
    shopItemsPool.forEach(shopItem => {
      const item = ITEM_DB[shopItem.id];
      const div = document.createElement('div');
      div.style.cssText = 'display: flex; flex-direction: column; align-items: center; cursor: pointer;';
      const btn = document.createElement('button');
      btn.style.cssText = 'width: 44px; height: 44px; border: 1px solid #444; border-radius: 6px; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; padding: 4px;';
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';
      btn.appendChild(img);
      if (shopItem.bought) {
        btn.style.opacity = '0.2';
        btn.style.cursor = 'not-allowed';
        const boughtText = document.createElement('span');
        boughtText.style.cssText = 'font-size: 0.65rem; color: #ffb84d; margin-top: 2px;';
        boughtText.textContent = '売約済';
        div.appendChild(btn);
        div.appendChild(boughtText);
      } else {
        btn.addEventListener('click', () => {
          showItemDetailModal(item, 'item');
        });
        const price = item.price || 20;
        const buyBtn = document.createElement('button');
        buyBtn.className = 'btn btn-secondary';
        buyBtn.style.cssText = 'font-size: 0.75rem; padding: 4px 10px; margin-top: 4px; display: flex; align-items: center; justify-content: center; width: auto; min-width: 60px; height: auto; border-radius: 8px; background-color: #1976d2; color: #fff; border: 1px solid #1565c0; box-shadow: 0 2px 4px rgba(0,0,0,0.3);';
        buyBtn.textContent = `${price} Gで購入`;
        buyBtn.addEventListener('click', () => {
          if (player.gold >= price) {
            let target = player.items.find(i => i.id === shopItem.id);
            if (target && !target.used) {
              showGameAlert('ショップ', '同じアイテムをすでに所持しています！');
              return;
            }
            showGameConfirm('商品の購入', `「${item.name}」を${price}ゴールドで購入しますか？`, () => {
              player.gold -= price;
              if (target) {
                target.used = false;
              } else {
                player.items.push({ id: shopItem.id, used: false });
              }
              shopItem.bought = true;
              showGameAlert('購入完了', `「${item.name}」を購入しました！`, () => {
                renderShop();
                updateHeaderBar();
              });
            });
          } else {
            showGameAlert('ショップ', 'ゴールドが足りません！');
          }
        });
        div.appendChild(btn);
        div.appendChild(buyBtn);
      }
      townItems.appendChild(div);
    });
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
const eventsList = [
  {
    title: '怪しい泉',
    image: new URL('../../../assets/games/roguelike/images/icons/water_shizuku.png', import.meta.url).href,
    text: '暗く澱んだ泉を見つけました。泉の底でなにかがきらりと光っています。手を伸ばしますか？',
    options: [
      {
        text: '手を突っ込んでみる (HPを 3 失い、💰30 獲得)',
        action: () => {
          player.hp = Math.max(1, player.hp - 3);
          player.gold += 30;
          showGameAlert('泉の怪我', '冷たい泉に手を突っ込み、30ゴールドを掴み出しました！が、鋭い岩で腕を怪我しました。');
        }
      },
      {
        text: 'なにもせず離れる',
        action: () => {
          showGameAlert('平和な選択', 'あなたは慎重に泉を通り過ぎました。');
        }
      }
    ]
  },
  {
    title: '金細工師のチェスト',
    image: new URL('../../../assets/games/roguelike/images/characters/job_nihontou_katanakaji.png', import.meta.url).href,
    text: '打ち捨てられた台座の上に、豪華な金のチェストが置かれています。罠でしょうか？',
    options: [
      {
        text: 'こじ開けてみる (50%の確率で 💰40 獲得 / 50%の確率でミミックに襲われる！)',
        action: () => {
          if (Math.random() < 0.5) {
            player.gold += 40;
            showGameAlert('チェスト発見', 'チェストはただの古びた箱でした！中から40ゴールドを発見しました。', () => {
              proceedNextFloor();
            });
          } else {
            showGameAlert('トラップ発動！', '箱がいきなり牙を剥きました！ミミックとの戦闘が開始されます！', () => {
              currentPathType = 'mimic';
              enterFloorNode();
            });
          }
        },
        isCustomNav: true
      },
      {
        text: '無視して進む',
        action: () => {
          showGameAlert('用心深さ', 'あなたは用心深くその場を離れました。', () => {
            proceedNextFloor();
          });
        },
        isCustomNav: true
      }
    ]
  },
  {
    title: '妖精の悪戯',
    image: new URL('../../../assets/games/roguelike/images/characters/fantasy_pixy2.png', import.meta.url).href,
    text: '空中を浮遊する小さな悪戯妖精が現れました。「力と引き換えに、何かを貰うよ？」',
    options: [
      {
        text: '妖精に呪文を唱えてもらう (手札のランダムなカード1枚強化 ➔ 最大HP -1)',
        action: () => {
          player.maxHp = Math.max(5, player.maxHp - 1);
          player.hp = Math.min(player.hp, player.maxHp);
          const unupgraded = player.deck.filter(c => !c.upgraded);
          if (unupgraded.length > 0) {
            shuffle(unupgraded);
            const target = unupgraded[0];
            const index = player.deck.findIndex(c => c === target);
            if (index !== -1) {
              player.deck[index] = upgradeCard(player.deck[index]);
              showGameAlert('妖精の祝福と代償', `最大HPが1減少しましたが、カード「${target.name}」が「${target.name}+」に強化されました！`);
            }
          } else {
            showGameAlert('代償のみ', '最大HPが1減少しましたが、強化できるカードがありませんでした！');
          }
        }
      },
      {
        text: '断って追い払う',
        action: () => {
          showGameAlert('拒絶', '妖精はつまらなそうに去っていきました。');
        }
      }
    ]
  }
];

function triggerEventNode() {
  showScreen(eventScreen);
  const evt = eventsList[Math.floor(Math.random() * eventsList.length)];
  if (document.getElementById('event-image')) {
    document.getElementById('event-image').src = evt.image || new URL('../../../assets/games/roguelike/images/icons/no_image_square.jpg', import.meta.url).href;
  }
  if (document.getElementById('event-title')) document.getElementById('event-title').textContent = evt.title;
  if (document.getElementById('event-text')) document.getElementById('event-text').textContent = evt.text;
  const container = document.getElementById('event-options');
  if (container) {
    container.innerHTML = '';
    evt.options.forEach(opt => {
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
        const scenes = [{
          portraits: [{ src: new URL('../../../assets/games/roguelike/images/characters/royal_daijin.png', import.meta.url).href, size: '130px' }],
          speaker: '大臣',
          lines: [
            '聖剣に選ばれし者よ、お耳を拝借いたします。',
            'ヴァンパイアにさらわれたこの国の姫を、どうかお救いいただけませぬでしょうか。',
            'ヴァンパイアの城へ向かった我が国の兵どころか、\n途中の街に駐在しております兵からの連絡すら途絶えております。',
            '気丈に振る舞っておられる王の心境を思うと、\n臣下として居ても立ってもいられぬのです。\nどうか、よろしくお願い申し上げます。'
          ]
        }];
        showMapScreen();
        showCutscene(scenes, () => {
          showGameAlert('エリア2へ', `エリア 2 に到達しました！<br>HPが最大値の半分回復しました。`);
        });
      } else if (currentArea === 3) {
        const scenes = [
          {
            portraits: [
              { src: new URL('../../../assets/games/roguelike/images/characters/royal_king.png', import.meta.url).href, size: '130px' },
              { src: new URL('../../../assets/games/roguelike/images/characters/royal_princess.png', import.meta.url).href, size: '130px' },
              { src: new URL('../../../assets/games/roguelike/images/characters/royal_daijin.png', import.meta.url).href, size: '130px' }
            ],
            speaker: '王',
            lines: [
              '姫を救い出してくれたこと、誠に感謝するぞ。',
              '残るは魔王のみ。余はお前の力を信じておる。\nどうか、ご無事で。'
            ]
          },
          {
            portraits: [{ src: new URL('../../../assets/games/roguelike/images/characters/royal_princess.png', import.meta.url).href, size: '130px' }],
            speaker: '姫',
            lines: [
              'どうかご無事に帰ってきてくださいまし。\nわたくしたちはいつもあなたのことを祈っております。'
            ]
          }
        ];
        showMapScreen();
        showCutscene(scenes, () => {
          showGameAlert('エリア3へ', `エリア 3 に到達しました！<br>HPが最大値の半分回復しました。`);
        });
      } else {
        showMapScreen();
        showGameAlert('エリアクリア！', `次のエリア ${currentArea} に到達しました！<br>HPが最大値の半分回復しました。`);
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

  player.items.forEach(itemState => {
    const item = ITEM_DB[itemState.id];
    if (item) {
      if (footerPlayerItemsEl) {
        const btnF = document.createElement('button');
        btnF.className = 'btn-item';
        btnF.title = `${item.name}: ${item.desc}`;
        const battleLayout = document.querySelector('.battle-layout');
        const inBattle = battleLayout && battleLayout.style.display !== 'none';
        const canClick = inBattle && !itemState.used && isPlayerTurn && !isGameOver;
        btnF.style.cssText = `width:28px; height:28px; padding:2px; border:1px solid #444; border-radius:4px; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; opacity:${itemState.used ? '0.25' : '1'}; flex-shrink:0; cursor:${canClick ? 'pointer' : (itemState.used ? 'not-allowed' : 'default')};`;
        const imgF = document.createElement('img');
        imgF.src = item.image;
        imgF.alt = item.name;
        imgF.style.cssText = 'width:100%; height:100%; object-fit:contain;';
        btnF.appendChild(imgF);

        if (canClick) {
          btnF.addEventListener('click', () => {
            pendingUseItemId = itemState.id;
            const itemConfirmText = document.getElementById('item-confirm-text');
            const itemConfirmModal = document.getElementById('item-confirm-modal');
            if (itemConfirmText && itemConfirmModal) {
              itemConfirmText.innerHTML = `<strong>${item.name}</strong>を使用しますか？<br><br><span style="font-size:0.7rem; color:var(--text-muted);">${item.desc}</span>`;
              itemConfirmModal.style.display = 'flex';
            }
          });
        }
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
  const itemState = player.items.find(i => i.id === itemId);
  if (!itemState || itemState.used) return;
  itemState.used = true;

  if (itemId === 'sandwich') {
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
    logMessage('アイテム「万能薬」を使用し、すべての状態異常を解除した！', 'log-heal');
  } else if (itemId === 'dynamite') {
    if (enemy) {
      const dmg = Math.floor(Math.random() * 11) + 5; // 5~15
      enemy.hp = Math.max(0, enemy.hp - dmg);
      logMessage(`アイテム「ダイナマイト」を使用し、敵に ${dmg} ダメージ！`, 'log-attack');
    }
  }
  updateUI();
}

// ===== カード画像マッピング =====
const CARD_IMAGES = {
  strike: '',
  heal: new URL('../../../assets/games/roguelike/images/icons/math_mark01_plus.png', import.meta.url).href,
  smite: '',
  rush: '',
  fire: new URL('../../../assets/games/roguelike/images/icons/honoo_hi_fire.png', import.meta.url).href,
  ice: new URL('../../../assets/games/roguelike/images/icons/water_shizuku.png', import.meta.url).href,
  wind: new URL('../../../assets/games/roguelike/images/icons/tenki_typhoon.png', import.meta.url).href,
  earth: new URL('../../../assets/games/roguelike/images/icons/ishi_stone.png', import.meta.url).href,
  stone: new URL('../../../assets/games/roguelike/images/icons/ishi_stone.png', import.meta.url).href,
  thunder: new URL('../../../assets/games/roguelike/images/icons/mark_tenkiu_kaminari.png', import.meta.url).href,
  venom: new URL('../../../assets/games/roguelike/images/icons/medical_doku.png', import.meta.url).href,
  fortify: new URL('../../../assets/games/roguelike/images/icons/math_mark01_plus.png', import.meta.url).href,
  draw_card: new URL('../../../assets/games/roguelike/images/icons/cardgame_deck_hiku.png', import.meta.url).href,
  buff_up: new URL('../../../assets/games/roguelike/images/icons/math_mark01_plus.png', import.meta.url).href,
  buff_down: new URL('../../../assets/games/roguelike/images/icons/math_mark02_minus.png', import.meta.url).href,
  meteor: new URL('../../../assets/games/roguelike/images/icons/kanden_gaikotsu.png', import.meta.url).href,
};

// 属性→ドットクラスのマッピング
const COLOR_DOT_MAP = {
  white: 'dot-white', black: 'dot-black',
  red: 'dot-red', blue: 'dot-blue',
  green: 'dot-green', orange: 'dot-orange',
  yellow: 'dot-yellow', purple: 'dot-purple'
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
    cost.innerHTML = `<span style="color: #4ade80;">${actualCost}</span>`;
  } else {
    cost.textContent = actualCost;
  }
  div.appendChild(cost);

  // カード画像エリア
  const imgWrap = document.createElement('div');
  imgWrap.className = 'card-image-wrap';
  let imgSrc = CARD_IMAGES[card.id] || (card.id.endsWith('+') ? CARD_IMAGES[card.id.slice(0, -1)] : '');
  if (!imgSrc) {
    if (card.type === 'attack' && card.element === 'none') {
      imgSrc = new URL('../../../assets/games/roguelike/images/relics/game_ken.png', import.meta.url).href;
    } else {
      imgSrc = new URL('../../../assets/games/roguelike/images/icons/no_image_square.jpg', import.meta.url).href;
    }
  }
  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = card.name;
    imgWrap.appendChild(img);
  }
  div.appendChild(imgWrap);

  // カード名帯
  const name = document.createElement('div');
  name.className = 'card-name';
  name.textContent = card.name;
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
  subLines.forEach(line => {
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
  const fmt = (val, bVal) => (card.upgraded && val > (bVal || 0)) ? `<span style="color: #4ade80; font-weight: bold;">${val}</span>` : val;

  if (card.type === 'attack') {
    const hits = card.hits ? `×${fmt(card.hits, base.hits || 1)}` : '';
    const elem = card.element && card.element !== 'none' ? ` [${getElemLabel(card.element)}]` : '';
    return `⚔️ ${fmt(card.value, base.value)}${hits}ダメージ${elem}`;
  } else if (card.healSelf) {
    return `HP +${fmt(card.healSelf, base.healSelf)} 回復`;
  } else if (card.draw) {
    return `カードを${fmt(card.draw, base.draw)}枚引き、行動回数+1`;
  } else if (card.buffUp) {
    return `能昇 ${fmt(card.buffUp, base.buffUp)}ターン付与`;
  } else if (card.buffDown) {
    return `敵に能降 ${fmt(card.buffDown, base.buffDown)}ターン`;
  }
  return card.desc || '';
}

function buildCardSubTexts(card) {
  const baseId = card.id.endsWith('+') ? card.id.slice(0, -1) : card.id;
  const base = CARD_DB[baseId] || card;
  const fmt = (val, bVal) => (card.upgraded && val > (bVal || 0)) ? `<span style="color: #4ade80; font-weight: bold;">${val}</span>` : val;
  const lines = [];
  if (card.poison) lines.push(`毒${fmt(card.poison, base.poison)}付与`);
  if (card.paralyze) lines.push('30%で麻痺付与');
  if (card.oncePerBattle) lines.push('1戦闘1回のみ');
  return lines;
}

function getElemLabel(elem) {
  const map = { fire: '炎', ice: '氷', thunder: '雷', wind: '風', earth: '土', stone: '土' };
  return map[elem] || elem;
}

function getColorLabel(color) {
  const map = { white: '白(回復)', black: '黒(状異)', red: '赤(炎)', blue: '青(水)', green: '緑(風)', orange: '橙(土)', yellow: '黄(雷)', purple: '紫(特殊)' };
  return map[color] || color;
}

// 旧COLOR_TO_DOT（後方互換で残す）
const COLOR_TO_DOT = {};



// --- 15. バトルシステム & ダメージ計算 ---
function setEnemyIntent() {
  if (!enemy || enemy.hp <= 0) return;

  const availableSkills = enemy.skills.length > 0 ? enemy.skills : ['attack'];
  const chosen = availableSkills[Math.floor(Math.random() * availableSkills.length)];

  let dmg = enemy.attackBase + Math.floor((battleCount - 1) / 3);
  if (chosen === 'fire_attack') {
    enemy.intent = { type: 'fire_attack', damage: dmg + 2, desc: '火炎ブレス' };
  } else if (chosen === 'ice_attack') {
    enemy.intent = { type: 'ice_attack', damage: dmg + 1, desc: '絶対零度' };
  } else if (chosen === 'rush') {
    enemy.intent = { type: 'rush', damage: Math.max(1, Math.floor(dmg / 2)), hits: 2, desc: '突進連撃' };
  } else if (chosen === 'paralyze') {
    enemy.intent = { type: 'paralyze', damage: 0, desc: '痺れ粉 (麻痺付与)' };
  } else if (chosen === 'poison') {
    enemy.intent = { type: 'poison', damage: 0, desc: '毒液' };
  } else if (chosen === 'heal') {
    enemy.intent = { type: 'heal', damage: 0, desc: '自己再生' };
  } else if (chosen === 'buff_up') {
    enemy.intent = { type: 'buff_up', damage: 0, desc: '魔力昇華 (能昇)' };
  } else if (chosen === 'buff_down') {
    enemy.intent = { type: 'buff_down', damage: 0, desc: '重力波 (能降)' };
  } else {
    enemy.intent = { type: 'attack', damage: dmg, desc: '通常攻撃' };
  }
}

function addRelic(relicId) {
  playSE('relic');
  player.relics.push(relicId);
  if (relicId === 'yubiwa_gold') {
    player.maxHp += 1;
    player.hp += 1;
    updateUI();
  } else if (relicId === 'yubiwa_silver') {
    player.maxMp += 1;
    player.mp += 1;
    updateUI();
  }
}

function getCardCost(card) {
  let cost = card.cost;
  if (card.type === 'attack' && card.element && card.element !== 'none' && player.relics.includes('book_madousyo')) {
    cost = Math.max(0, cost - 1);
  }
  return cost;
}

function calculateDamage(baseVal, element, isPlayerAttacking) {
  let bonus = 0;

  if (isPlayerAttacking) {
    if (player.relics.includes('game_ken') && element === 'none') bonus += 1;
    if (player.relics.includes('game_ken_seiken') && element === 'none') bonus += 1;
    if (player.buffUp > 0) bonus += 1;
    if (player.buffDown > 0) bonus -= 1;

    let dmg = baseVal + bonus;

    if (element === 'fire' && CARD_DB['meteor'] && CARD_DB['meteor'].id === 'meteor') {
      const hasWeakness = enemy.weaknesses.includes('fire') || enemy.weaknesses.includes('ice') || enemy.weaknesses.includes('thunder');
      if (hasWeakness) dmg = Math.floor(dmg * 1.5);
    } else {
      if (enemy.weaknesses.includes(element)) {
        dmg = Math.floor(dmg * 1.5);
        logMessage('弱点属性！ダメージ1.5倍！', 'log-heal');
      } else if (enemy.resistances.includes(element)) {
        dmg = Math.floor(dmg * 0.5);
        logMessage('耐性あり。ダメージ半減', 'log-poison');
      } else if (enemy.immunities.includes(element)) {
        dmg = 0;
        logMessage('無効化されました！', 'log-poison');
      }
    }

    if (enemy.isGolem) {
      dmg = Math.floor(dmg / 2);
      logMessage('ゴーレムの鉄壁！被ダメージ半減。', 'log-poison');
    }

    return Math.max(0, dmg);
  } else {
    if (player.buffUp > 0) bonus -= 1;
    if (player.buffDown > 0) bonus += 1;
    if (player.relics.includes('game_tate')) bonus -= 1;
    if (player.relics.includes('yubiwa_diamond')) bonus -= 1;

    let dmg = baseVal + bonus;
    return Math.max(0, dmg);
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
  player.actions = (player.class === 'butouka' ? 2 : 1);
  if (player.relics.includes('shoes_sneaker')) player.actions += 1;

  if (player.paralyze > 0) {
    player.paralyze -= 1;
    logMessage('あなたは麻痺で動けない！ターンが強制終了します。', 'log-poison');
    setTimeout(() => { if (!isGameOver) endTurn(); }, 1000);
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
    logMessage('人魚のネックレス：ターン開始時にMPが 1 回復した。', 'log-heal');
  }

  if (player.poison > 0) {
    player.hp = Math.max(0, player.hp - player.poison);
    logMessage('プレイヤーが毒で ' + player.poison + ' ダメージ！', 'log-poison');
    player.poison = Math.max(0, player.poison - 1);
    if (player.hp <= 0) { handleGameOver(); return; }
  }

  if (player.buffUp > 0) player.buffUp -= 1;
  if (player.buffDown > 0) player.buffDown -= 1;

  const drawCount = player.relics.includes('book_madousyo') ? 5 : 4;
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
    setTimeout(() => { if (!isGameOver) { setEnemyIntent(); startTurn(); } }, 800);
    return;
  }

  if (enemy.poison && enemy.poison > 0) {
    enemy.hp = Math.max(0, enemy.hp - enemy.poison);
    logMessage(enemy.name + 'が毒で ' + enemy.poison + ' ダメージ！', 'log-poison');
    enemy.poison = Math.max(0, enemy.poison - 1);
    if (enemy.hp <= 0) { enemy.hp = 0; updateUI(); handleVictory(); return; }
  }

  if (enemy.buffUp > 0) enemy.buffUp -= 1;
  if (enemy.buffDown > 0) enemy.buffDown -= 1;

  if (enemy.intent) {
    let dmg = enemy.intent.damage;
    logMessage(`${enemy.name} の「${enemy.intent.desc}」！`);
    if (enemyImageEl) enemyImageEl.classList.add('shake');

    setTimeout(() => {
      if (enemyImageEl) enemyImageEl.classList.remove('shake');

      if (enemy.intent.type === 'heal') {
        playSE('heal');
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + 5);
        logMessage(`${enemy.name} はHPを 5 回復した！`, 'log-heal');
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
      } else {
        const isBoss = (currentPathType === 'boss' || currentPathType === 'midboss' || currentPathType === 'lastboss');
        if (enemy.intent.type === 'fire_attack') playSE('fire');
        else if (enemy.intent.type === 'ice_attack') playSE('ice');
        else if (enemy.name === 'ハーピー') playSE('harpy');
        else if (isBoss) playSE('boss_attack');
        else playSE('enemy_attack');

        const element = (enemy.intent.type === 'fire_attack') ? 'fire' : ((enemy.intent.type === 'ice_attack') ? 'ice' : 'none');
        const calculatedDmg = calculateDamage(dmg, element, false);
        if (calculatedDmg > 0) {
          player.hp = Math.max(0, player.hp - calculatedDmg);
          logMessage('プレイヤーに ' + calculatedDmg + ' のダメージ！', 'log-damage');
        }
      }
      if (player.hp <= 0) { handleGameOver(); }
      else { setEnemyIntent(); setTimeout(startTurn, 600); }
      updateUI();
    }, 500);
  }
}

function playCard(index) {
  if (!isPlayerTurn || isGameOver) return;
  const card = player.hand[index];
  const cardCost = getCardCost(card);
  if (player.mp < cardCost) { logMessage('MPが足りません！', 'log-system'); return; }
  if (player.actions <= 0) { logMessage('行動回数が残っていません！', 'log-system'); return; }

  player.mp -= cardCost;
  player.actions -= 1;
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
      const d = calculateDamage(card.value, card.element, true);
      enemy.hp = Math.max(0, enemy.hp - d);
      total += d;
    }
    logMessage(card.name + '！ ' + enemy.name + ' に ' + (hits > 1 ? total + '(' + (total / hits) + '×' + hits + '）' : '' + total) + ' ダメージ！', 'log-damage');
    if (card.poison && card.poison > 0) {
      if (enemy.isGolem || enemy.isVampire) {
        logMessage(`${enemy.name} は毒を無効化した。`, 'log-system');
      } else if (enemy.isMaou && Math.random() < 0.5) {
        logMessage('魔王は状態異常を防いだ。', 'log-system');
      } else {
        enemy.poison = (enemy.poison || 0) + card.poison;
        logMessage(enemy.name + 'に毒' + card.poison + 'を付与！', 'log-poison');
      }
    }
  } else if (card.type === 'skill') {
    if (card.draw) { drawCards(card.draw); player.actions++; logMessage(card.name + '！ カードを' + card.draw + '枚引き、行動回数+1！'); }
    if (card.healSelf) { player.hp = Math.min(player.maxHp, player.hp + card.healSelf); logMessage(card.name + '！ HP +' + card.healSelf, 'log-heal'); }
    if (card.buffUp) { player.buffUp = card.buffUp; logMessage('能昇！能昇（与ダメ+1/被ダメ-1）を3ターン得た！', 'log-heal'); }
    if (card.buffDown) { enemy.buffDown = card.buffDown; logMessage('能降！敵に能降（与ダメ-1/被ダメ+1）を3ターン付与！', 'log-poison'); }
  }
  updateUI();
  if (enemy.hp <= 0) {
    enemy.hp = 0;
    updateUI();
    handleVictory();
  } else {
    if (player.actions <= 0) {
      logMessage('行動回数がなくなったため、自動的にターンを終了します。', 'log-system');
      setTimeout(() => { if (!isGameOver) endTurn(); }, 800);
    }
  }
}

// --- 16. 勝敗・報酬 ---
/** 固定レリックをカットシーン後に付与するユーティリティ */
function giveFixedRelic(relicId, cutsceneScenes, onDone) {
  const relic = RELIC_DB[relicId];
  if (!relic) { onDone?.(); return; }
  showCutscene(cutsceneScenes, () => {
    if (!player.relics.includes(relicId)) {
      playSE('relic');
      player.relics.push(relicId);
    }
    logMessage(`「${relic.name}」を手に入れた！`, 'log-system');
    // レリック即時効果の適用
    if (relicId === 'yubiwa_gold') { player.maxHp += 1; player.hp = Math.min(player.hp, player.maxHp); }
    if (relicId === 'yubiwa_silver') { player.maxMp += 1; }
    showGameAlert('レリック入手', `「${relic.name}」を入手しました！<br><span style="font-size:0.7rem; color:var(--text-muted);">${relic.desc}</span>`, () => {
      onDone?.();
    });
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

  let goldReward = 10 + Math.floor(Math.random() * 6);
  if (currentPathType === 'elite' || currentPathType === 'mimic') {
    goldReward = 20 + Math.floor(Math.random() * 11);
  }
  player.gold += goldReward;
  logMessage(`報酬として 💰${goldReward} ゴールドを獲得！`, 'log-system');


  if (currentPathType === 'mimic') {
    const unownedRelics = Object.keys(RELIC_DB).filter(r => !player.relics.includes(r) && !RELIC_DB[r].isFixed);
    if (unownedRelics.length > 0) {
      shuffle(unownedRelics);
      playSE('relic');
      player.relics.push(unownedRelics[0]);
      logMessage(`ミミックからレリック「${RELIC_DB[unownedRelics[0]].name}」を手に入れた！`, 'log-system');
    }
    const unupgraded = player.deck.filter(c => !c.upgraded);
    if (unupgraded.length > 0) {
      shuffle(unupgraded);
      const target = unupgraded[0];
      const index = player.deck.findIndex(c => c === target);
      if (index !== -1) {
        player.deck[index] = upgradeCard(player.deck[index]);
        logMessage(`ミミックの宝の力で、カード「${target.name}」が「${target.name}+」に強化された！`, 'log-heal');
      }
    }
  }

  // ===== 中ボス撃破後 =====
  if (currentPathType === 'midboss') {
    setTimeout(() => {
      showMapScreen();
      // エリア2中ボス（ゴーレム）
      if (currentArea === 2) {
        const postScenes = [{
          bg: new URL('../../../assets/games/roguelike/images/map/mon_gate_western_close.png', import.meta.url).href,
          portraits: [{ src: new URL('../../../assets/games/roguelike/images/characters/knight.png', import.meta.url).href, size: '120px' }],
          speaker: '見回りの兵士',
          lines: [
            'ありがとう！町を守るゴーレムが故障で暴走してしまい、誰も近づけなくなっていたんだ。',
            'おかげで出入りができるようになった。あとで修理してやらないとな。これはお礼だ。'
          ]
        }];
        const unownedNonFixed = Object.keys(RELIC_DB).filter(r => !player.relics.includes(r) && !RELIC_DB[r].isFixed);
        const pick = unownedNonFixed.length > 0 ? unownedNonFixed[Math.floor(Math.random() * unownedNonFixed.length)] : null;
        if (pick) {
          giveFixedRelic(pick, postScenes, () => triggerMidbossFairyUpgrade());
        } else {
          showCutscene(postScenes, () => triggerMidbossFairyUpgrade());
        }
      }
      // エリア3中ボス（リヴァイアサン）
      else if (currentArea === 3) {
        const postScenes = [
          {
            bg: new URL('../../../assets/games/roguelike/images/map/arashi.png', import.meta.url).href,
            portraits: [],
            speaker: '─── 状況 ───',
            lines: ['ふと、嵐が止んだ。\nリヴァイアサンはあなたの実力を認めてくれたようだ。']
          },
          {
            bg: new URL('../../../assets/games/roguelike/images/map/arashi.png', import.meta.url).href,
            portraits: [{ src: new URL('../../../assets/games/roguelike/images/characters/ningyohime.png', import.meta.url).href, size: '130px' }],
            speaker: '人魚',
            lines: [
              '海神様に認められるなんて、本当に勇敢な人間ね！',
              '魔王と戦うなら、これを持っていって。\nこの海に伝わる力が、きっとあなたを守ってくれるはずよ。'
            ]
          }
        ];
        giveFixedRelic('mermaid_necklace', postScenes, () => triggerMidbossFairyUpgrade());
      }
      // エリア1中ボス（バンディット）
      else {
        const postScenes = [{
          bg: new URL('../../../assets/games/roguelike/images/map/doukutsu.png', import.meta.url).href,
          portraits: [{ src: new URL('../../../assets/games/roguelike/images/characters/knight.png', import.meta.url).href, size: '120px' }],
          speaker: '城の兵士',
          lines: [
            'ご助力感謝します。この山賊は我々が連行します。',
            '山賊が持っていたものです。あなたにお役立ていただければ幸いです。'
          ]
        }];
        const unownedNonFixed = Object.keys(RELIC_DB).filter(r => !player.relics.includes(r) && !RELIC_DB[r].isFixed);
        const pick = unownedNonFixed.length > 0 ? unownedNonFixed[Math.floor(Math.random() * unownedNonFixed.length)] : null;
        if (pick) {
          giveFixedRelic(pick, postScenes, () => triggerMidbossFairyUpgrade());
        } else {
          showCutscene(postScenes, () => triggerMidbossFairyUpgrade());
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
            bg: new URL('../../../assets/games/roguelike/images/map/mori.png', import.meta.url).href,
            portraits: [{ src: new URL('../../../assets/games/roguelike/images/monsters/fantasy_dark_elf.png', import.meta.url).href, size: '120px' }],
            speaker: 'ダークエルフ',
            lines: ['きゅ～……']
          },
          {
            bg: new URL('../../../assets/games/roguelike/images/map/mori.png', import.meta.url).href,
            portraits: [{ src: new URL('../../../assets/games/roguelike/images/characters/fantasy_elf2.png', import.meta.url).href, size: '130px' }],
            speaker: 'エルフ',
            lines: [
              '闇に囚われた仲間を正気に戻してくれて、ありがとうございます。',
              'あなたの勇気に感謝を込めて、この森に古くから伝わる妖精の剣を授けましょう。\n大切にしてください。'
            ]
          }
        ];
        showMapScreen();
        giveFixedRelic('game_ken_seiken', postScenes, () => progressArea());
      }
      // エリア2ボス（ヴァンパイア）
      else if (currentArea === 2) {
        const postScenes = [{
          bg: new URL('../../../assets/games/roguelike/images/map/building_europe_kojou.png', import.meta.url).href,
          portraits: [{ src: new URL('../../../assets/games/roguelike/images/characters/royal_princess.png', import.meta.url).href, size: '130px' }],
          speaker: '姫',
          lines: [
            '助けてくださいまして、誠にありがとうございます。\nあなたのような勇敢な方が来てくださるとは夢にも思いませんでした。',
            'これはわたくしの形見の品でございます。\nどうかお力になれますように。'
          ]
        }];
        showMapScreen();
        giveFixedRelic('yubiwa_diamond', postScenes, () => progressArea());
      }
      else {
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
  const pool = [...REWARD_POOL];
  shuffle(pool);
  const picks = pool.slice(0, 3);
  picks.forEach(id => {
    const card = CARD_DB[id];
    const el = makeCardEl(card, () => {
      playSE('reward_select');
      player.discard.push({ ...CARD_DB[id] });
      logMessage(CARD_DB[id].name + ' をデッキに追加！', 'log-system');
      if (rewardOverlay) rewardOverlay.style.display = 'none';
      proceedNextFloor();
    });
    if (rewardCards) rewardCards.appendChild(el);
  });
  if (rewardOverlay) rewardOverlay.style.display = 'flex';
}

function triggerMidbossFairyUpgrade() {
  showScreen(fairyScreen);
  const desc = document.getElementById('fairy-desc');
  if (desc) desc.textContent = '中ボス撃破ボーナス！カードを1枚選んで「強化（+）」します。(無料)';

  if (fairyCardList) {
    fairyCardList.innerHTML = '';
    const targets = [...player.deck, ...player.discard, ...player.hand];
    const upgradableCards = targets.filter(c => !c.upgraded);
    if (upgradableCards.length === 0) {
      fairyCardList.innerHTML = '<div style="grid-column: span 3; font-size:0.75rem; color:var(--text-muted); text-align:center; padding:1rem;">強化可能なカードがありません</div>';
    } else {
      const uniqueIds = Array.from(new Set(upgradableCards.map(c => c.id)));
      uniqueIds.forEach(id => {
        const card = CARD_DB[id];
        const btn = document.createElement('div');
        btn.className = `battle-card color-${card.color}`;
        btn.style.cssText = 'width: 100%; height: 110px; cursor: pointer; position: relative; margin: 0; border-width:2px;';
        btn.innerHTML = `
              <div class="card-cost">${card.cost}</div>
              <div class="card-name" style="font-size:0.7rem; margin-top:0.6rem;">${card.name}</div>
              <div class="card-desc" style="font-size:0.55rem; line-height:1.2;">${card.desc}</div>
            `;
        btn.addEventListener('click', () => {
          playSE('reward_select');
          let index = player.deck.findIndex(c => c.id === id && !c.upgraded);
          if (index !== -1) {
            player.deck[index] = upgradeCard(player.deck[index]);
          } else {
            index = player.discard.findIndex(c => c.id === id && !c.upgraded);
            if (index !== -1) {
              player.discard[index] = upgradeCard(player.discard[index]);
            }
          }
          showGameAlert('強化成功', `「${card.name}」が強化され「${card.name}+」になりました！`, () => {
            proceedNextFloor();
          });
        });
        fairyCardList.appendChild(btn);
      });
    }
  }
}

function showBossRelicReward() {
  if (rewardCards) rewardCards.innerHTML = '';
  if (rewardSubtitleText) rewardSubtitleText.textContent = 'エリアボス撃破！レリックを1つ選択してください';
  const unownedRelics = Object.keys(RELIC_DB).filter(r => !player.relics.includes(r) && !RELIC_DB[r].isFixed);
  shuffle(unownedRelics);
  const picks = unownedRelics.slice(0, 3);
  picks.forEach(relicId => {
    const relic = RELIC_DB[relicId];
    const el = document.createElement('div');
    el.className = 'battle-card reward-card';
    el.style.borderColor = '#ffd700';
    el.style.borderWidth = '2px';
    el.innerHTML = `
          <div class="card-cost" style="background:#ffd700; color:#1a1a2e; font-size:0.65rem;">宝</div>
          <div class="card-name" style="color:#ffd700; font-size:0.55rem; line-height:1.2; margin-top:0.6rem; padding:0 2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; box-sizing:border-box; width:100%; text-align:center;">${relic.name}</div>
          <div class="card-desc" style="font-size:0.55rem; line-height:1.2; padding:2px;">${relic.desc}</div>
        `;
    el.addEventListener('click', () => {
      playSE('relic');
      player.relics.push(relicId);
      logMessage(`ボス報酬：レリック「${relic.name}」を獲得！`, 'log-system');
      if (rewardOverlay) rewardOverlay.style.display = 'none';
      proceedNextFloor();
    });
    if (rewardCards) rewardCards.appendChild(el);
  });
  if (rewardOverlay) rewardOverlay.style.display = 'flex';
}

function showResultOverlay(isWin) {
  if (isWin) playSE('victory');
  else playSE('defeat');

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

function showGameClearScreen() {
  isGameOver = true;
  stopBGM();
  playSE('victory');
  if (resultTitle) {
    resultTitle.textContent = '🎉 全面クリア！';
    resultTitle.style.color = '#ffd700';
  }
  if (resultDetails) {
    const clsName = player.class === 'yuusya' ? '勇者' : (player.class === 'kenshi' ? '戦士' : (player.class === 'mahoutsukai' ? '魔法使い' : '格闘家'));
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

  enemy = { ...tpl, hp: tpl.hp, maxHp: tpl.maxHp, poison: 0, paralyze: 0, buffUp: 0, buffDown: 0 };
  if (enemyNameEl) enemyNameEl.textContent = enemy.name;
  if (enemyImageEl) enemyImageEl.src = enemy.image;
  player.maxMp = player.relics.includes('ruby_ring') ? 6 : 5;
  player.items.forEach(i => i.used = false);

  // 戦闘開始前に山札をシャッフル（初回以外はhandleVictoryで山札に全て戻っているため、シャッフルのみ行う）
  if (!(currentFloor === 1 && currentArea === 1)) {
    player.deck = shuffle([...player.deck]);
  }

  if (currentFloor === 1 && currentArea === 1) {
    // ゲーム最初期化
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    player.deck = shuffle(INITIAL_DECKS[player.class].map(id => ({ ...CARD_DB[id] })));
    player.discard = [];
    player.poison = 0;
    player.paralyze = 0;
    player.buffUp = 0;
    player.buffDown = 0;
  } else {
    // 通常の戦闘開始：シャッフルのみ
    player.deck = shuffle([...player.deck]);
    player.discard = [];
    player.exhausted = [];
    player.poison = 0;
    player.paralyze = 0;
    player.buffUp = 0;
    player.buffDown = 0;
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
  if (playerHpBar) playerHpBar.style.width = (player.hp / player.maxHp * 100) + '%';

  // MP
  if (playerMpText) playerMpText.textContent = player.mp + '/' + player.maxMp;
  if (playerMpOrbs) {
    playerMpOrbs.innerHTML = '';
    for (let i = 0; i < player.maxMp; i++) {
      const o = document.createElement('div');
      o.className = 'ap-orb' + (i < player.mp ? ' active' : '');
      playerMpOrbs.appendChild(o);
    }
  }

  // 行動回数
  if (playerActionsText) playerActionsText.textContent = player.actions;

  // 毒・麻痺・能昇・能降バッジ (プレイヤー)
  if (playerPoisonEl) {
    let text = '';
    if (player.poison > 0) text += ` 🟢×${player.poison}`;
    if (player.paralyze > 0) text += ` ⚡×${player.paralyze}`;
    if (player.buffUp > 0) text += ` 📈×${player.buffUp}`;
    if (player.buffDown > 0) text += ` 📉×${player.buffDown}`;

    playerPoisonEl.style.display = text ? 'inline' : 'none';
    playerPoisonEl.textContent = text;
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
    if (enemyHpBar) enemyHpBar.style.width = Math.max(0, enemy.hp / enemy.maxHp * 100) + '%';
    if (enemyIntentEl) {
      if (enemy.intent) {
        enemyIntentEl.style.display = 'block';
        enemyIntentEl.textContent = `${enemy.intent.desc} ` + (enemy.intent.damage > 0 ? `⚔️${enemy.intent.damage}` : '');
      } else {
        enemyIntentEl.style.display = 'none';
      }
    }

    // 毒・麻痺・能昇・能降バッジ (敵)
    if (enemyPoisonEl) {
      let text = '';
      if (enemy.poison > 0) text += ` 🟢×${enemy.poison}`;
      if (enemy.paralyze > 0) text += ` ⚡×${enemy.paralyze}`;
      if (enemy.buffUp > 0) text += ` 📈×${enemy.buffUp}`;
      if (enemy.buffDown > 0) text += ` 📉×${enemy.buffDown}`;

      enemyPoisonEl.style.display = text ? 'inline' : 'none';
      enemyPoisonEl.textContent = text;
    }
  }

  updateHeaderBar();
}

function renderHand() {
  if (!handArea) return;
  handArea.innerHTML = '';
  let canPlayAny = false;
  player.hand.forEach((card, index) => {
    const playable = player.actions > 0 && player.mp >= getCardCost(card);
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
      el.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">カードなし</p>';
      return;
    }
    cards.forEach(c => {
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
          if (wrapper) wrapper.scrollLeft = currentFloor * 70;
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
document.querySelectorAll('.deck-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.deck-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.dv-card-list').forEach(l => l.classList.remove('active'));
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
const configModal = document.getElementById('config-modal');
const creditsBtn = document.getElementById('credits-btn');
const closeCreditsBtn = document.getElementById('close-credits-btn');
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
