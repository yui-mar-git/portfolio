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

import bgmStart from '../../assets/games/roguelike/audio/bgm/maou_game_theme14.mp3';
import bgmReward from '../../assets/games/roguelike/audio/bgm/maou_game_event04.mp3';
import bgmCastle from '../../assets/games/roguelike/audio/bgm/maou_game_castle01.mp3';
import bgmInn from '../../assets/games/roguelike/audio/bgm/maou_game_village01.mp3';
import bgmTown from '../../assets/games/roguelike/audio/bgm/maou_game_town01.mp3';
import bgmForest from '../../assets/games/roguelike/audio/bgm/maou_game_dangeon13.mp3';
import bgmArea1 from '../../assets/games/roguelike/audio/bgm/maou_game_field05.mp3';
import bgmArea2 from '../../assets/games/roguelike/audio/bgm/maou_game_field11.mp3';
import bgmArea3 from '../../assets/games/roguelike/audio/bgm/maou_game_field07.mp3';
import bgmBattle from '../../assets/games/roguelike/audio/bgm/maou_game_battle07.mp3';
import bgmBoss from '../../assets/games/roguelike/audio/bgm/maou_game_boss02.mp3';
import bgmLastBoss from '../../assets/games/roguelike/audio/bgm/maou_game_boss06.mp3';
import bgmBanditPre from '../../assets/games/roguelike/audio/bgm/maou_game_dangeon07.mp3';
import bgmDarkElfPre from '../../assets/games/roguelike/audio/bgm/maou_game_dangeon22.mp3';
import bgmGolemPre from '../../assets/games/roguelike/audio/bgm/maou_game_dangeon01.mp3';
import bgmVampirePre from '../../assets/games/roguelike/audio/bgm/maou_game_dangeon17.mp3';
import bgmLeviathanPre from '../../assets/games/roguelike/audio/bgm/maou_game_dangeon15.mp3';
import bgmMaouPre from '../../assets/games/roguelike/audio/bgm/maou_game_dangeon04b.mp3';

const BGM_DB = {
  'start': bgmStart,
  'reward': bgmReward,
  'castle': bgmCastle,
  'inn': bgmInn,
  'town': bgmTown,
  'forest': bgmForest,
  'area1': bgmArea1,
  'area2': bgmArea2,
  'area3': bgmArea3,
  'battle': bgmBattle,
  'boss': bgmBoss,
  'lastboss': bgmLastBoss,
  'bandit_pre': bgmBanditPre,
  'darkelf_pre': bgmDarkElfPre,
  'golem_pre': bgmGolemPre,
  'vampire_pre': bgmVampirePre,
  'leviathan_pre': bgmLeviathanPre,
  'maou_pre': bgmMaouPre
};

import seRelic from '../../assets/games/roguelike/audio/se/maou_game_jingle09.mp3';
import seInn from '../../assets/games/roguelike/audio/se/maou_game_jingle07.mp3';
import seVictory from '../../assets/games/roguelike/audio/se/maou_game_jingle01.mp3';
import seDefeat from '../../assets/games/roguelike/audio/se/maou_game_jingle08.mp3';
import seStrike from '../../assets/games/roguelike/audio/se/剣で斬る2.mp3';
import seSmite from '../../assets/games/roguelike/audio/se/剣で斬る3.mp3';
import seRush from '../../assets/games/roguelike/audio/se/剣で斬る4.mp3';
import seStone from '../../assets/games/roguelike/audio/se/岩が真っ二つに割れる.mp3';
import seBuffUp from '../../assets/games/roguelike/audio/se/ステータス上昇魔法2.mp3';
import seBuffDown from '../../assets/games/roguelike/audio/se/HP吸収魔法2.mp3';
import seEnemyAttack from '../../assets/games/roguelike/audio/se/小パンチ.mp3';
import seBossAttack from '../../assets/games/roguelike/audio/se/打撃6.mp3';
import seRewardSelect from '../../assets/games/roguelike/audio/se/決定ボタンを押す2.mp3';
import seInvalid from '../../assets/games/roguelike/audio/se/ビープ音4.mp3';
import seHarpy from '../../assets/games/roguelike/audio/se/ヒヨドリの鳴き声1.mp3';
import seFire from '../../assets/games/roguelike/audio/se/火炎魔法1.mp3';
import seIce from '../../assets/games/roguelike/audio/se/氷魔法1.mp3';
import seThunder from '../../assets/games/roguelike/audio/se/雷魔法1.mp3';
import seWind from '../../assets/games/roguelike/audio/se/風魔法1.mp3';
import sePoison from '../../assets/games/roguelike/audio/se/毒魔法1.mp3';
import seHeal from '../../assets/games/roguelike/audio/se/回復魔法1.mp3';
import seMeteor from '../../assets/games/roguelike/audio/se/ドラゴンが火を吐く.mp3';
import seConfirm from '../../assets/games/roguelike/audio/se/決定ボタンを押す2.mp3';
import seCancel from '../../assets/games/roguelike/audio/se/キャンセル1.mp3';
import seCursor from '../../assets/games/roguelike/audio/se/カーソル移動7.mp3';
import seDraw from '../../assets/games/roguelike/audio/se/カードをめくる.mp3';
import sePlay from '../../assets/games/roguelike/audio/se/カードを台の上に出す.mp3';

const SE_DB = {
  'relic': new Audio(seRelic),
  'inn': new Audio(seInn),
  'victory': new Audio(seVictory),
  'defeat': new Audio(seDefeat),
  'strike': new Audio(seStrike),
  'smite': new Audio(seSmite),
  'rush': new Audio(seRush),
  'stone': new Audio(seStone),
  'buff_up': new Audio(seBuffUp),
  'buff_down': new Audio(seBuffDown),
  'enemy_attack': new Audio(seEnemyAttack),
  'boss_attack': new Audio(seBossAttack),
  'reward_select': new Audio(seRewardSelect),
  'invalid': new Audio(seInvalid),
  'harpy': new Audio(seHarpy),
  'fire': new Audio(seFire),
  'ice': new Audio(seIce),
  'thunder': new Audio(seThunder),
  'wind': new Audio(seWind),
  'poison': new Audio(sePoison),
  'heal': new Audio(seHeal),
  'meteor': new Audio(seMeteor),
  'confirm': new Audio(seConfirm),
  'cancel': new Audio(seCancel),
  'cursor': new Audio(seCursor),
  'draw': new Audio(seDraw),
  'play': new Audio(sePlay)
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

function playSE(seId) {
  if (!SE_DB[seId]) return;
  const se = SE_DB[seId];
  se.currentTime = 0;
  se.volume = configSeVolume;
  se.play().catch(e => console.log('SE Play blocked:', e));
}

function setBgmVolume(vol) {
  configBgmVolume = vol;
  if (currentBgmAudio) currentBgmAudio.volume = vol;
}

function setSeVolume(vol) {
  configSeVolume = vol;
}


// --- 1. DOM要素の取征E---

const gameHeader = document.getElementById('game-header');
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
const innScreen = document.getElementById('inn-screen');
const fairyScreen = document.getElementById('fairy-screen');
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

// 王様�EインゲームメチE��ージモーダルDOM

const kingEventModal = document.getElementById('king-event-modal');
const kingRelicChoices = document.getElementById('king-relic-choices');
const gameDialogModal = document.getElementById('game-dialog-modal');
const dialogTitle = document.getElementById('dialog-title');
const dialogMessage = document.getElementById('dialog-message');
const btnDialogOk = document.getElementById('btn-dialog-ok');
const btnDialogYes = document.getElementById('btn-dialog-yes');
const btnDialogNo = document.getElementById('btn-dialog-no');
// カチE��シーン

const cutsceneModal = document.getElementById('cutscene-modal');
const cutsceneBg = document.getElementById('cutscene-bg');
const cutscenePortraits = document.getElementById('cutscene-portraits');
const cutsceneSpeaker = document.getElementById('cutscene-speaker');
const cutsceneText = document.getElementById('cutscene-text');
let btnCutsceneNext = document.getElementById('btn-cutscene-next');

/**
 * カチE��シーンを頁E��に表示するユーチE��リチE��、E     * @param {Array<{bg?, portraits:[{src,flip?}], speaker:string, lines:string[]}>} scenes
 * @param {Function} onComplete 全シーン完亁E���Eコールバック
 */
function showCutscene(scenes, onComplete) {
  if (!cutsceneModal || scenes.length === 0) { onComplete?.(); return; }
  let si = 0; // scene index

  let li = 0; // line index

  function render() {
    const s = scenes[si];
    // 背景

    if (cutsceneBg) cutsceneBg.style.backgroundImage = s.bg ? `url('${s.bg}')` : 'none';
    // ポ�EトレーチE
    if (cutscenePortraits) {
      cutscenePortraits.innerHTML = '';
      (s.portraits || []).forEach(p => {
        const img = document.createElement('img');
        img.src = p.src;
        img.style.cssText = `height:${p.size || '120px'}; object-fit:contain; ${p.flip ? 'transform:scaleX(-1);' : ''} image-rendering:auto;`;
        cutscenePortraits.appendChild(img);
      });
    }
    // スピ�Eカー吁E
    if (cutsceneSpeaker) cutsceneSpeaker.textContent = s.speaker || '';
    // チE��スト（改行対応！E
    if (cutsceneText) cutsceneText.innerHTML = s.lines[li].replace(/\n/g, '<br>');
  }

  function onNext() {
    li++;
    if (li >= scenes[si].lines.length) {
      si++;
      li = 0;
    }
    if (si >= scenes.length) {
      // 全完亁E
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
    // 重褁E��スナ�E防止のためcloneで置揁E
    const newBtn = btnCutsceneNext.cloneNode(true);
    btnCutsceneNext.parentNode.replaceChild(newBtn, btnCutsceneNext);
    btnCutsceneNext = newBtn;
    btnCutsceneNext.addEventListener('click', onNext);
  }
}

// --- 2. ゲーム状態管琁E---

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
  relics: [],
  items: [
    { id: 'sandwich', used: false },
    { id: 'elixir', used: false },
    { id: 'perfume', used: false }
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

// 進行スチE�EチE    let currentArea = 1;

let currentFloor = 0;
let currentRow = 0;
let currentPathType = '';
let generatedMap = [];

// キャラクターアバターアセチE��パス定義

import imgAvatarYuusya from '../../assets/games/roguelike/images/characters/figure_rpg_character_yuusya.png';
import imgAvatarKenshi from '../../assets/games/roguelike/images/characters/figure_rpg_character_kenshi.png';
import imgAvatarMahoutsukai from '../../assets/games/roguelike/images/characters/figure_rpg_character_mahoutsukai.png';
import imgAvatarButouka from '../../assets/games/roguelike/images/characters/figure_rpg_character_butouka.png';

const AVATAR_IMAGES = {
  yuusya: imgAvatarYuusya.src,
  kenshi: imgAvatarKenshi.src,
  mahoutsukai: imgAvatarMahoutsukai.src,
  butouka: imgAvatarButouka.src
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
    if (gameDialogModal) gameDialogModal.style.display = 'none';
    if (currentDialogCallback) currentDialogCallback();
  });
}
if (btnDialogYes) {
  btnDialogYes.addEventListener('click', () => {
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

// --- 4. ユーチE��リチE��・共通ロジチE�� ---

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

// --- 5. 画面刁E��替ぁE---

function showScreen(target) {
  const screens = [
    startScreen, classSelectScreen, mapScreen, innScreen,
    fairyScreen, townScreen, eventScreen, document.querySelector('.battle-layout')
  ];
  screens.forEach(s => {
    if (s) s.style.display = 'none';
  });
  if (target) {
    target.style.display = (target === mapScreen) ? 'flex' : 'block';
    if (target === mapScreen || target === document.querySelector('.battle-layout')) {
      if (gameHeader) gameHeader.style.display = 'flex';
      updateHeaderBar();
    } else {
      if (gameHeader) gameHeader.style.display = 'none';
    }
  }
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
        img.alt = relic.name;
        img.title = `${relic.name}: ${relic.desc.replace(/<br>/g, ' ')}`;
        img.style.cssText = 'width: 20px; height: 20px; object-fit: contain; border: 1px solid #444; border-radius: 3px; background: rgba(255,255,255,0.05);';
        headerRelicsList.appendChild(img);
      }
    });
  }
}

// --- 7. 王様遇遁E��リチE��イベンチE(Floor 0) ---

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
        'レリチE��選抁E,
          `レリチE��、E{relic.name}」を選択しますか�E�Ebr><br><span style="font-size:0.75rem; color:var(--text-muted);">${relic.desc}</span>`,
        () => {
          playSE('relic');
          player.relics.push(relicId);
          if (player.class === 'yuusya') {
            const remaining = allRelicKeys.filter(r => r !== relicId);
            const extra = remaining[0];
            playSE('relic');
            player.relics.push(extra);
            showGameAlert('王から�E餞別 ', `さらに勁E��E�E幸運により、E{RELIC_DB[extra].name}」も追加で手に入りました�E�`, () => {
              if (kingEventModal) kingEventModal.style.display = 'none';
              enterFloorNode();
            });
          } else {
            if (kingEventModal) kingEventModal.style.display = 'none';
            enterFloorNode();
          }
        },
        null  // ぁE��ぁEↁE何もしなぁE���Eび選べる！E
      );
    });
    if (kingRelicChoices) kingRelicChoices.appendChild(el);
  });

  if (kingEventModal) kingEventModal.style.display = 'flex';
}

// --- 6. 職業選択画面制御 ---

let selectedClass = 'yuusya';
const CLASS_NAMES = {
  yuusya: '勁E��E,
      kenshi: '戦士',
  mahoutsukai: '魔法使ぁE,
      butouka: '格闘家'
};

function setupClassSelection() {

  // 初期化：�Eカードからselectedをすべて削除

  const classCards = document.querySelectorAll('.class-card');
  classCards.forEach(card => {
    card.classList.remove('selected');
    // inline styleの先顔をリセチE��した上で初期状態を適用

    card.style.border = '';
    card.style.background = '';
    card.style.boxShadow = '';
  });

  selectedClass = 'yuusya';
  const defaultCard = document.querySelector('.class-card[data-class="yuusya"]');
  if (defaultCard) defaultCard.classList.add('selected');

  const preview = document.getElementById('class-select-preview');
  if (preview) preview.textContent = '勁E��E��選択されてぁE��ぁE;

  classCards.forEach(card => {
    card.addEventListener('click', () => {
      // 全カードからselectedを削除

      classCards.forEach(c => c.classList.remove('selected'));
      // クリチE��したカードにselectedを履用

      card.classList.add('selected');
      selectedClass = card.dataset.class;
      if (preview) preview.textContent = `${CLASS_NAMES[selectedClass] || selectedClass}が選択されてぁE��す`;
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

// --- 8. 双�Eマップ生成�E描画ロジチE�� ---

const NODE_TYPES = {
  start: { label: 'お城', class: 'start' },
  normal: { label: '敵の気�E', class: 'normal' },
  elite: { label: '強敵の気�E', class: 'elite' },
  mimic: { label: '強敵の気�E', class: 'mimic' },
  inn: { label: '宿屁E⛺', class: 'inn' },
  fairy: { label: '神秘的な森', class: 'fairy' },
  event: {
    label: '�E�？！E, class: 'event' },
      town: { label: '町', class: 'town' },
  midboss: { label: '威圧皁E��気�E', class: 'midboss' },
  boss: { label: '威圧皁E��気�E', class: 'boss' },
  lastboss: { label: '魔王の気�E', class: 'lastboss' }
    };


function generateAreaMap() {
  generatedMap = [];
  const nonNormals = ['elite', 'mimic', 'inn', 'fairy', 'event'];

  function getRandomNonNormal() {
    return nonNormals[Math.floor(Math.random() * nonNormals.length)];
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
            showGameAlert('移動不可', '現在のルートから外れることはできません、Ebr>直進するマス�E�現在地と同じ行�Eマス�E�を選んでください、E);
                return;
          }
          showGameConfirm(
            '移動�E確誁E,
              `、E{NODE_TYPES[node.type].label}」へ移動しますか�E�`,
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
  const base = '/portfolio/roguelike/assets/map/';
  switch (type) {
    case 'start': return base + 'castle.png';
    case 'normal': return base + 'mark_chuui.png';
    case 'elite': return base + 'mark_chuui.png';
    case 'mimic': return base + 'mark_chuui.png';
    case 'inn': return base + 'building_hotel_pet.png';
    case 'fairy': return base + 'mori.png';
    case 'event': return base + 'mark_question.png';
    case 'town': return base + 'omise_shop_tatemono.png';
    case 'midboss':
      if (currentArea === 1) return base + 'doukutsu.png'; // エリア1中ボス�E�バンチE��チE��リーダー

      if (currentArea === 2) return base + 'mon_gate_western_close.png';
      if (currentArea === 3) return base + 'arashi.png';
      return base + 'yama_kiri.png';
    case 'boss':
      if (currentArea === 1) return base + 'yama_kiri.png'; // エリア1ボス�E�ダークエルフ�E森

      return base + 'building_europe_kojou.png';
    case 'lastboss': return base + 'building_europe_kojou.png';
    default: return '/portfolio/roguelike/assets/icons/no_image_square.jpg';
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

// --- 9. 吁E��マス�E�Eode�E�進入処琁E---

// --- カチE��シーンチE�Eタ定義 ---
const BASE_CH = '/portfolio/roguelike/assets/characters/';
const BASE_MAP = '/portfolio/roguelike/assets/map/';

const CUTSCENE_PRE = {
  midboss_area1: [
    {
      bg: BASE_MAP + 'doukutsu.png',
      portraits: [{ src: '/portfolio/roguelike/assets/monsters/character_sanzoku.png', size: '140px' }],
      speaker: 'バンチE��チE��',
      lines: [
        'ほぉ……よくここまで来たな、E,
            'オレが誰なのか、知らずにめE��てきた不運な奴か、知ってめE��てきた馬鹿な奴ぁE,
            'へっへっへ、どちらにしても同じことさ、Enオレ様�Eアジトまで来て、生きて帰れると思うなよ！E
      ]
    }
  ],
  boss_area1: [
    {
      bg: BASE_MAP + 'yama_kiri.png',
      portraits: [{ src: '/portfolio/roguelike/assets/monsters/fantasy_dark_elf.png', size: '130px' }],
      speaker: 'ダークエルチE,
          lines: [
        'オマエ…\nコノ森ヲ\u30fb\u30fb\u30fb荒ラス老Eu30fb\u30fb\u30fb�E�E,
            'タチサレ\u30fb\u30fb\u30fb\nタチサレ\u30fb\u30fb\u30fb�E�\n�E�正気を失った目でこちらを睨みつけてくる�E�E
      ]
    }
  ],
  midboss_area2: [
    {
      bg: BASE_MAP + 'mon_gate_western_close.png',
      portraits: [{ src: '/portfolio/roguelike/assets/monsters/fantasy_golem.png', size: '130px' }],
      speaker: '─── 状況E───',
      lines: [
        '町の入口前に、石造り�E巨体が立ち塞がってぁE��、E,
            'なんと、ゴーレムが突然こちらに向かって動き出した�E�\n…戦ぁE��かなぁE��ぁE��、E
      ]
    }
  ],
  boss_area2: [
    {
      bg: BASE_MAP + 'building_europe_kojou.png',
      portraits: [{ src: '/portfolio/roguelike/assets/monsters/fantasy_dracula2.png', size: '130px' }],
      speaker: 'ヴァンパイア',
      lines: [
        'おやおや…\nこんな辺鄙な城までご足労ぁE��だけるとは、E,
            'まさか単身で姫を取り返しにきたのかな�E�\n感忁E�Eするが、そぁE�EぁE��なぁE��E,
            '招かざる客人には\u2015\u2015\nお引き取り願おぁE��、E
      ]
    }
  ],
  midboss_area3: [
    {
      bg: BASE_MAP + 'arashi.png',
      portraits: [],
      speaker: '─── 状況E───',
      lines: [
        '荒れ狂う波の間から、巨大な影が近づぁE��くる\u30fb\u30fb\u30fb、E,
            '海底から湧き上がるよぁE��咁E��が、空気を霁E��せた�E�E
      ]
    }
  ]
};



function getPreBattleCutscene() {
  if (currentPathType === 'midboss' && currentArea === 1) return CUTSCENE_PRE.midboss_area1;
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

// --- 10. 宿�E�回復�E�E---

const btnInnRest = document.getElementById('btn-inn-rest');
const btnInnLeave = document.getElementById('btn-inn-leave');

function showInnScreen() {
  playBGM('inn');
  showScreen(innScreen);
}

if (btnInnRest) {
  btnInnRest.addEventListener('click', () => {
    if (player.gold >= 15) {
      showGameConfirm('宿での休�E', '15ゴールドを支払い休�Eしますか�E�Ebr>(HPが�E回復し、状態異常が�E解除されまぁE', () => {
        player.gold -= 15;
        playSE('inn');
        player.hp = player.maxHp;
        player.poison = 0;
        player.paralyze = 0;
        showGameAlert('休�E完亁E, '体力が完�Eに回復しました�E�E, () => {
              proceedNextFloor();
            });
          });
        } else {
          showGameAlert('宿での休�E', 'ゴールドが足りません�E�E);
        }
      });
    }

    if (btnInnLeave) {
      btnInnLeave.addEventListener('click', () => {
        proceedNextFloor();
      });
    }

    // --- 11. 妖精�E�カード強化！E---

    const btnFairyLeave = document.getElementById('btn-fairy-leave');
    const fairyCardList = document.getElementById('fairy-card-list');

    function showFairyScreen() {
      playBGM('darkelf_pre');
      showScreen(fairyScreen);
      const desc = document.getElementById('fairy-desc');
      if (desc) desc.textContent = '20ゴールドを支払い、妖精の魔力で手札のカードを1枚「強化！E�E�」します、E;

      if (fairyCardList) {
        fairyCardList.innerHTML = '';
        const targets = [...player.deck, ...player.discard, ...player.hand];

        if (targets.length === 0) {
          fairyCardList.innerHTML = '<div style="grid-column: span 3; font-size:0.75rem; color:var(--text-muted); text-align:center; padding:1rem;">カードがありません</div>';
        } else {
          // unique id

          const uniqueIds = Array.from(new Set(targets.map(c => c.id)));
          uniqueIds.forEach(id => {
            const cardInstance = targets.find(c => c.id === id);
            const isUpgraded = id.endsWith('+');
            const btn = makeCardEl(cardInstance, () => {
              if (isUpgraded) return;
              if (player.gold >= 20) {
                showGameConfirm('カード�E強匁E, `、E{cardInstance.name}」を 20ゴールドで強化しますか�E�`, () => {
                  player.gold -= 20;
                  let index = player.deck.findIndex(c => c.id === id && !c.upgraded);
                  if (index !== -1) {
                    player.deck[index] = upgradeCard(player.deck[index]);
                  } else {
                    index = player.discard.findIndex(c => c.id === id && !c.upgraded);
                    if (index !== -1) {
                      player.discard[index] = upgradeCard(player.discard[index]);
                    } else {
                      index = player.hand.findIndex(c => c.id === id && !c.upgraded);
                      if (index !== -1) player.hand[index] = upgradeCard(player.hand[index]);
                    }
                  }
                  showGameAlert('強化�E劁E, `、E{cardInstance.name}」が強化され、E{cardInstance.name}+」になりました�E�`, () => {
                    proceedNextFloor();
                  });
                });
              }
            });
            btn.style.cursor = isUpgraded ? 'not-allowed' : 'pointer';
            if (isUpgraded) {
              const mask = document.createElement('div');
              mask.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:10; border-radius:4px;';
              btn.appendChild(mask);
            } else if (player.gold < 20) {
              btn.style.opacity = '0.5';
            }
            fairyCardList.appendChild(btn);
          });
        }
      }
    }

    if (btnFairyLeave) {
      btnFairyLeave.addEventListener('click', () => {
        proceedNextFloor();
      });
    }

    // --- 12. 街（カーチEアイチE��購入ショチE�E�E�E---

    const townCards = document.getElementById('town-cards');
    const townItems = document.getElementById('town-items');
    const btnTownLeave = document.getElementById('btn-town-leave');
    let shopCardsPool = [];
    let shopItemsPool = [];

    function showTownScreen() {
      playBGM('town');
      showScreen(townScreen);
      const pool = [...REWARD_POOL];
      shuffle(pool);
      shopCardsPool = pool.slice(0, 3).map(id => ({ id, bought: false }));
      const allItemKeys = Object.keys(ITEM_DB);
      shuffle(allItemKeys);
      shopItemsPool = allItemKeys.slice(0, 3).map(id => ({ id, bought: false }));
      renderShop();
    }

    function renderShop() {
      if (townCards) {
        townCards.innerHTML = '';
        shopCardsPool.forEach(item => {
          const card = CARD_DB[item.id];
          const div = document.createElement('div');
          div.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
          const el = document.createElement('div');
          el.className = `battle-card color-${card.color}`;
          el.style.cssText = 'width: 80px; height: 110px; cursor: pointer; margin: 0; border-width:2px;';
          el.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-name" style="font-size:0.65rem; margin-top:0.6rem;">${card.name}</div>
            <div class="card-desc" style="font-size:0.52rem; line-height:1.2;">${card.desc}</div>
          `;
          if (item.bought) {
            el.style.opacity = '0.2';
            el.style.cursor = 'not-allowed';
            const boughtText = document.createElement('span');
            boughtText.style.cssText = 'font-size: 0.65rem; color: #ffb84d; margin-top: 2px;';
            boughtText.textContent = '売紁E��E;
            div.appendChild(el);
            div.appendChild(boughtText);
          } else {
            el.addEventListener('click', () => {
              if (player.gold >= 15) {
                showGameConfirm('啁E��の購入', `、E{card.name}」を15ゴールドで購入しますか�E�`, () => {
                  player.gold -= 15;
                  playSE('reward_select');
                  player.discard.push({ ...CARD_DB[item.id] });
                  item.bought = true;
                  showGameAlert('購入完亁E, `、E{card.name}」を購入し、デチE��に追加しました�E�`, () => {
                    renderShop();
                    updateHeaderBar();
                  });
                });
              } else {
                showGameAlert('ショチE�E', 'ゴールドが足りません�E�E);
              }
            });
            const priceText = document.createElement('span');
            priceText.style.cssText = 'font-size: 0.65rem; color: #ffd700; margin-top: 2px;';
            priceText.textContent = '💰15';
            div.appendChild(el);
            div.appendChild(priceText);
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
            boughtText.textContent = '売紁E��E;
            div.appendChild(btn);
            div.appendChild(boughtText);
          } else {
            btn.addEventListener('click', () => {
              if (player.gold >= 20) {
                const target = player.items.find(i => i.id === shopItem.id);
                if (target) {
                  if (!target.used) {
                    showGameAlert('ショチE�E', '同じアイチE��をすでに所持してぁE��す！E);
                    return;
                  }
                  showGameConfirm('啁E��の購入', `、E{item.name}」を20ゴールドで購入・補�Eしますか�E�`, () => {
                    player.gold -= 20;
                    target.used = false;
                    shopItem.bought = true;
                    showGameAlert('購入完亁E, `、E{item.name}」を補�Eしました�E�`, () => {
                      renderShop();
                      updateHeaderBar();
                    });
                  });
                }
              } else {
                showGameAlert('ショチE�E', 'ゴールドが足りません�E�E);
              }
            });
            const priceText = document.createElement('span');
            priceText.style.cssText = 'font-size: 0.65rem; color: #ffd700; margin-top: 2px;';
            priceText.textContent = '💰20';
            div.appendChild(btn);
            div.appendChild(priceText);
          }
          townItems.appendChild(div);
        });
      }
    }

    if (btnTownLeave) {
      btnTownLeave.addEventListener('click', () => {
        proceedNextFloor();
      });
    }

    // --- 13. 未知のイベンチE---

    const eventsList = [
      {
        title: '怪しい況E,
        image: '/portfolio/roguelike/assets/icons/water_shizuku.png',
        text: '暗く澱んだ泉を見つけました。泉�E底でなにかがきらりと光ってぁE��す。手を伸ばしますか�E�E,
        options: [
          {
            text: '手を突っ込んでみめE(HPめE3 失ぁE��💰30 獲征E',
            action: () => {
              player.hp = Math.max(1, player.hp - 3);
              player.gold += 30;
              showGameAlert('泉�E怪戁E, '冷たい泉に手を突っ込み、E0ゴールドを掴み出しました�E�が、E��ぁE��で腕を怪我しました、E);
            }
          },
          {
            text: 'なにもせず離れる',
            action: () => {
              showGameAlert('平和な選抁E, 'あなた�E慎重に泉を通り過ぎました、E);
            }
          }
        ]
      },
      {
        title: '金細工師のチェスチE,
        image: '/portfolio/roguelike/assets/characters/job_nihontou_katanakaji.png',
        text: '打ち捨てられた台座の上に、豪華な金�Eチェストが置かれてぁE��す。罠でしょぁE���E�E,
        options: [
          {
            text: 'こじ開けてみめE(50%の確玁E�� 💰40 獲征E/ 50%の確玁E��ミミチE��に襲われる！E',
            action: () => {
              if (Math.random() < 0.5) {
                player.gold += 40;
                showGameAlert('チェスト発要E, 'チェスト�Eただの古びた箱でした�E�中から40ゴールドを発見しました、E, () => {
                  proceedNextFloor();
                });
              } else {
                showGameAlert('トラチE�E発動！E, '箱がいきなり牙を剥きました�E�ミミックとの戦闘が開始されます！E, () => {
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
              showGameAlert('用忁E��ぁE, 'あなた�E用忁E��くその場を離れました、E, () => {
                proceedNextFloor();
              });
            },
            isCustomNav: true
          }
        ]
      },
      {
        title: '妖精の悪戯',
        image: '/portfolio/roguelike/assets/characters/fantasy_pixy2.png',
        text: '空中を浮遊する小さな悪戯妖精が現れました。「力と引き換えに、何かを貰ぁE���E�、E,
        options: [
          {
            text: '妖精に呪斁E��唱えてもらぁE(手札のランダムなカーチE枚強匁E➁E最大HP -1)',
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
                  showGameAlert('妖精の祝福と代儁E, `最大HPぁE減少しましたが、カード、E{target.name}」が、E{target.name}+」に強化されました�E�`);
                }
              } else {
                showGameAlert('代償�Eみ', '最大HPぁE減少しましたが、強化できるカードがありませんでした�E�E);
              }
            }
          },
          {
            text: '断って追ぁE��ぁE,
            action: () => {
              showGameAlert('拒絶', '妖精はつまらなそうに去ってぁE��ました、E);
            }
          }
        ]
      }
    ];

    function triggerEventNode() {
      showScreen(eventScreen);
      const evt = eventsList[Math.floor(Math.random() * eventsList.length)];
      if (document.getElementById('event-image')) {
        document.getElementById('event-image').src = evt.image || '/portfolio/roguelike/assets/icons/no_image_square.jpg';
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
      // マップへ戻るとき�E忁E�� isGameOver をリセチE���E�これがなぁE��次マスが選択不�Eになる！E
      isGameOver = false;
      if (currentFloor >= 9) {
        if (currentPathType === 'boss') {
          currentArea++;
          currentFloor = 0;
          player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp / 2));
          generateAreaMap();

          // ===== エリア開始カチE��シーン =====

          if (currentArea === 2) {
            const scenes = [{
              portraits: [{ src: BASE_CH + 'royal_daijin.png', size: '130px' }],
              speaker: '大臣',
              lines: [
                '聖剣に選ばれし老E��、お耳を拝借いたします、E,
                'ヴァンパイアにさらわれたこの国の姫を、どぁE��お救ぁE��ただけませぬでしょぁE��、E,
                'ヴァンパイアの城へ向かった�Eが国の兵どころか、\n途中の街に駐在しております�Eからの連絡すら途絶えております、E,
                '気丈に振る�Eっておられる王�E忁E��E��思うと、\n臣下として屁E��も立ってもいられぬのです、EnどぁE��、よろしくお願い申し上げます、E
              ]
            }];
            showMapScreen();
            showCutscene(scenes, () => {
              showGameAlert('エリア2へ', `エリア 2 に到達しました�E�Ebr>HPが最大値の半�E回復しました。`);
            });
          } else if (currentArea === 3) {
            const scenes = [
              {
                portraits: [
                  { src: BASE_CH + 'royal_king.png', size: '130px' },
                  { src: BASE_CH + 'royal_princess.png', size: '130px' },
                  { src: BASE_CH + 'royal_daijin.png', size: '130px' }
                ],
                speaker: '玁E,
                lines: [
                  '姫を救ぁE�Eしてくれたこと、誠に感謝するぞ、E,
                  '残るは魔王のみ。余�Eお前の力を信じておる、EnどぁE��、ご無事で、E
                ]
              },
              {
                portraits: [{ src: BASE_CH + 'royal_princess.png', size: '130px' }],
                speaker: '姫',
                lines: [
                  'どぁE��ご無事に帰ってきてくださいまし、EnわたくしたちはぁE��もあなた�Eことを祈っております、E
                ]
              }
            ];
            showMapScreen();
            showCutscene(scenes, () => {
              showGameAlert('エリア3へ', `エリア 3 に到達しました�E�Ebr>HPが最大値の半�E回復しました。`);
            });
          } else {
            showMapScreen();
            showGameAlert('エリアクリア�E�E, `次のエリア ${currentArea} に到達しました�E�Ebr>HPが最大値の半�E回復しました。`);
          }
        }
      } else {
        showMapScreen();
      }
    }


    // --- 14. アイチE��確認ダイアログ & 使用 ---

    let pendingUseItemId = '';

    function renderRelicsAndItems() {
      if (playerRelicsEl) {
        playerRelicsEl.innerHTML = '';
        if (player.relics.length === 0) {
          playerRelicsEl.innerHTML = '<span style="font-size:0.7rem; color:var(--text-muted);">なぁE/span>';
        } else {
          player.relics.forEach(relicId => {
            const relic = RELIC_DB[relicId];
            if (relic) {
              const img = document.createElement('img');
              img.src = relic.image;
              img.alt = relic.name;
              img.title = `${relic.name}: ${relic.desc.replace(/<br>/g, ' ')}`;
              img.style.cssText = 'width:24px; height:24px; object-fit:contain; border:1px solid #555; border-radius:4px; background:rgba(255,255,255,0.05);';
              playerRelicsEl.appendChild(img);
            }
          });
        }
      }

      if (playerItemsEl) {
        playerItemsEl.innerHTML = '';
        player.items.forEach(itemState => {
          const item = ITEM_DB[itemState.id];
          if (item) {
            const btn = document.createElement('button');
            btn.className = 'btn-item';
            btn.title = `${item.name}: ${item.desc}`;
            btn.style.cssText = `width:28px; height:28px; padding:2px; border:1px solid #444; border-radius:4px; background:rgba(0,0,0,0.5); cursor:${itemState.used ? 'not-allowed' : 'pointer'}; display:flex; align-items:center; justify-content:center; opacity:${itemState.used ? '0.25' : '1'};`;
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.style.cssText = 'width:100%; height:100%; object-fit:contain;';
            btn.appendChild(img);
            if (!itemState.used && isPlayerTurn && !isGameOver) {
              btn.addEventListener('click', () => {
                pendingUseItemId = itemState.id;
                if (itemConfirmText && itemConfirmModal) {
                  itemConfirmText.innerHTML = `<strong>${item.name}</strong>を使用しますか�E�Ebr><br><span style="font-size:0.7rem; color:var(--text-muted);">${item.desc}</span>`;
                  itemConfirmModal.style.display = 'flex';
                }
              });
            }
            playerItemsEl.appendChild(btn);
          }
        });
      }
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
        player.hp = Math.min(player.maxHp, player.hp + 3);
        logMessage('アイチE��「サンドイチE��」を使用し、HPぁE3 回復した�E�E, 'log-heal');
      } else if (itemId === 'elixir') {
        player.poison = 0;
        player.paralyze = 0;
        player.hp = Math.min(player.maxHp, player.hp + 1);
        logMessage('アイチE��「丁E�E薬」を使用し、状態異常を解除してHPぁE1 回復した�E�E, 'log-heal');
      } else if (itemId === 'perfume') {
        if (enemy) {
          if (enemy.isGolem || enemy.isVampire) {
            logMessage(`${enemy.name} は毒を無効化した！`, 'log-system');
          } else if (enemy.isMaou && Math.random() < 0.5) {
            logMessage('魔王は状態異常を防ぁE���E�E, 'log-system');
          } else {
            enemy.poison = (enemy.poison || 0) + 1;
            logMessage('アイチE��「香水」を使用し、敵に毁Eを付与した！E, 'log-poison');
          }
        }
      }
      updateUI();
    }

    // ===== カード画像�EチE��ング =====

    const CARD_IMAGES = {
      strike: '',
      heal: '/portfolio/roguelike/assets/icons/math_mark01_plus.png',
      smite: '',
      rush: '',
      fire: '/portfolio/roguelike/assets/icons/honoo_hi_fire.png',
      ice: '/portfolio/roguelike/assets/icons/water_shizuku.png',
      wind: '/portfolio/roguelike/assets/icons/tenki_typhoon.png',
      earth: '/portfolio/roguelike/assets/icons/ishi_stone.png',
      stone: '/portfolio/roguelike/assets/icons/ishi_stone.png',
      thunder: '/portfolio/roguelike/assets/icons/mark_tenkiu_kaminari.png',
      venom: '/portfolio/roguelike/assets/icons/medical_doku.png',
      fortify: '/portfolio/roguelike/assets/icons/math_mark01_plus.png',
      draw_card: '/portfolio/roguelike/assets/icons/cardgame_deck_hiku.png',
      buff_up: '/portfolio/roguelike/assets/icons/math_mark01_plus.png',
      buff_down: '/portfolio/roguelike/assets/icons/math_mark02_minus.png',
      meteor: '/portfolio/roguelike/assets/icons/kanden_gaikotsu.png',
    };

    // 属性→ドチE��クラスのマッピング

    const COLOR_DOT_MAP = {
      white: 'dot-white', black: 'dot-black',
      red: 'dot-red', blue: 'dot-blue',
      green: 'dot-green', orange: 'dot-orange',
      yellow: 'dot-yellow', purple: 'dot-purple'
    };

    // カード要素を生成する関数�E�新チE��イン�E�E    function makeCardEl(card, onClick) {

      const div = document.createElement('div');
      div.className = `battle-card reward-card color-${card.color} card-type-${card.type}`;

      // MPコスト（左上丸�E�E
      const cost = document.createElement('div');
      cost.className = 'card-cost';
      cost.textContent = getCardCost(card);
      div.appendChild(cost);

      // カード画像エリア

      const imgWrap = document.createElement('div');
      imgWrap.className = 'card-image-wrap';
      let imgSrc = CARD_IMAGES[card.id] || (card.id.endsWith('+') ? CARD_IMAGES[card.id.slice(0, -1)] : '');
      if (!imgSrc) {
        if (card.type === 'attack' && card.element === 'none') {
          imgSrc = '/portfolio/roguelike/assets/relics/game_ken.png';
        } else {
          imgSrc = '/portfolio/roguelike/assets/icons/no_image_square.jpg';
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

      // 効果テキスト（主効极E+ 追加効果！E
      const desc = document.createElement('div');
      desc.className = 'card-desc';

      // 主チE��スト（威力・属性�E�を1行で

      const mainLine = buildCardMainText(card);
      const mainEl = document.createElement('span');
      mainEl.className = 'desc-main';
      mainEl.textContent = mainLine;
      desc.appendChild(mainEl);

      // 追加効果テキスト（状態異常/バフ等！E
      const subLines = buildCardSubTexts(card);
      subLines.forEach(line => {
        const subEl = document.createElement('span');
        subEl.className = 'desc-sub';
        subEl.textContent = line;
        desc.appendChild(subEl);
      });
      div.appendChild(desc);

      // タグ�E�特殊、回復、バフデバフ、属性�E�E
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
        const elemMap = { fire: '炁E, ice: '氷', thunder: '雷', wind: '風', stone: '圁E };
        if (elemMap[card.element]) addTag(elemMap[card.element], card.element);
      }
      // 状態異常�E�毒、E��痺�E�E
      if (card.poison) addTag('毁E, 'poison');
      if (card.paralyze) addTag('麻痺', 'paralyze');
      // バフ/チE��チE
      if (card.buffUp) addTag('能昁E, 'buff-up');
      if (card.buffDown) addTag('能陁E, 'buff-down');
      // 回復

      if (card.healSelf) addTag('回復', 'white');
      // 特殁E
      if (card.color === 'purple') addTag('特殁E, 'purple');

      if (tags.children.length > 0) div.appendChild(tags);

      if (onClick) div.addEventListener('click', onClick);
      return div;
    }

    function buildCardMainText(card) {
      if (card.type === 'attack') {
        const hits = card.hits ? `×${card.hits}` : '';
        const elem = card.element && card.element !== 'none' ? ` [${getElemLabel(card.element)}]` : '';
        return `⚔ ${card.value}${hits}ダメージ${elem}`;
      } else if (card.healSelf) {
        return `HP +${card.healSelf} 回復`;
      } else if (card.draw) {
        return `カードを${card.draw}枚引く`;
      } else if (card.id === 'kakusei' || card.id === 'kakusei+') {
        return `能昇＆能降 ${card.buffUp}ターン`;
      } else if (card.buffUp) {
        return `${card.buffUp}ターン 能昇`;
      } else if (card.buffDown) {
        return `${card.buffDown}ターン 能降`;
      }
      return card.desc || '';
    }

    function buildCardSubTexts(card) {
      const lines = [];
      if (card.poison) lines.push(`毁E{card.poison}付与`);
      if (card.paralyze) lines.push('30%で麻痺付丁E);
      if (card.oncePerBattle) lines.push('1戦闁E回�Eみ');
      return lines;
    }

    function getElemLabel(elem) {
      const map = { fire: '炁E, ice: '氷', thunder: '雷', wind: '風', earth: '圁E, stone: '圁E };
      return map[elem] || elem;
    }





    // --- 15. バトルシスチE�� & ダメージ計箁E---

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
        enemy.intent = { type: 'rush', damage: Math.max(1, Math.floor(dmg / 2)), hits: 2, desc: '突E��連撁E };
      } else if (chosen === 'paralyze') {
        enemy.intent = { type: 'paralyze', damage: 0, desc: '痺れ粁E(麻痺付丁E' };
      } else if (chosen === 'poison') {
        enemy.intent = { type: 'poison', damage: 0, desc: '毒液' };
      } else if (chosen === 'heal') {
        enemy.intent = { type: 'heal', damage: 0, desc: '自己再生' };
      } else if (chosen === 'buff_up') {
        enemy.intent = { type: 'buff_up', damage: 0, desc: '魔力昁E�� (能昁E' };
      } else if (chosen === 'buff_down') {
        enemy.intent = { type: 'buff_down', damage: 0, desc: '重力波 (能陁E' };
      } else {
        enemy.intent = { type: 'attack', damage: dmg, desc: '通常攻撁E };
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
            logMessage('弱点属性�E�ダメージ1.5倍！E, 'log-heal');
          } else if (enemy.resistances.includes(element)) {
            dmg = Math.floor(dmg * 0.5);
            logMessage('耐性あり。ダメージ半渁E, 'log-poison');
          } else if (enemy.immunities.includes(element)) {
            dmg = 0;
            logMessage('無効化されました�E�E, 'log-poison');
          }
        }

        if (enemy.isGolem) {
          dmg = Math.floor(dmg / 2);
          logMessage('ゴーレムの鉁E��E��被ダメージ半減、E, 'log-poison');
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
          logMessage('山札を�E構築しました', 'log-system');
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
        logMessage('あなた�E麻痺で動けなぁE��ターンが強制終亁E��ます、E, 'log-poison');
        setTimeout(() => { if (!isGameOver) endTurn(); }, 1000);
        return;
      }

      if (player.class === 'kenshi') {
        player.hp = Math.min(player.maxHp, player.hp + 1);
        logMessage('戦士のパッシブ効果でHPぁE1 回復した、E, 'log-heal');
      }
      if (player.class === 'mahoutsukai') {
        player.mp = Math.min(player.maxMp, player.mp + 1);
        logMessage('魔法使ぁE�Eパッシブ効果でMPぁE1 回復した、E, 'log-heal');
      }
      if (player.relics.includes('mermaid_necklace')) {
        player.mp = Math.min(player.maxMp, player.mp + 1);
        logMessage('人魚�Eネックレス�E�ターン開始時にMPぁE1 回復した、E, 'log-heal');
      }

      if (player.poison > 0) {
        player.hp = Math.max(0, player.hp - player.poison);
        logMessage('プレイヤーが毒で ' + player.poison + ' ダメージ�E�E, 'log-poison');
        player.poison = Math.max(0, player.poison - 1);
        if (player.hp <= 0) { handleGameOver(); return; }
      }

      if (player.buffUp > 0) player.buffUp -= 1;
      if (player.buffDown > 0) player.buffDown -= 1;

      const drawCount = player.relics.includes('book_madousyo') ? 5 : 4;
      drawCards(drawCount);
      updateUI();
      logMessage('【あなた�Eターン、E, 'log-system');
      if (btnEndTurn) btnEndTurn.disabled = false;
    }

    function endTurn() {
      if (!isPlayerTurn || isGameOver) return;
      isPlayerTurn = false;
      if (btnEndTurn) btnEndTurn.disabled = true;

      if (player.actions > 0) {
        player.mp = Math.min(player.maxMp, player.mp + player.actions);
        logMessage('様子見を行い、MPぁE' + player.actions + ' 回復した�E�E, 'log-heal');
      }

      player.discard.push(...player.hand);
      player.hand = [];
      updateUI();
      setTimeout(() => enemyTurn(), 400);
    }

    function enemyTurn() {
      if (isGameOver || !enemy || enemy.hp <= 0) return;
      logMessage('【敵のターン、E);

      if (enemy.paralyze > 0) {
        enemy.paralyze -= 1;
        logMessage(`${enemy.name} は麻痺して動けなぁE��`, 'log-system');
        setTimeout(() => { if (!isGameOver) { setEnemyIntent(); startTurn(); } }, 800);
        return;
      }

      if (enemy.poison && enemy.poison > 0) {
        enemy.hp = Math.max(0, enemy.hp - enemy.poison);
        logMessage(enemy.name + 'が毒で ' + enemy.poison + ' ダメージ�E�E, 'log-poison');
        enemy.poison = Math.max(0, enemy.poison - 1);
        if (enemy.hp <= 0) { enemy.hp = 0; updateUI(); handleVictory(); return; }
      }

      if (enemy.buffUp > 0) enemy.buffUp -= 1;
      if (enemy.buffDown > 0) enemy.buffDown -= 1;

      if (enemy.intent) {
        let dmg = enemy.intent.damage;
        logMessage(`${enemy.name} の、E{enemy.intent.desc}」！`);
        if (enemyImageEl) enemyImageEl.classList.add('shake');

        setTimeout(() => {
          if (enemyImageEl) enemyImageEl.classList.remove('shake');

          if (enemy.intent.type === 'heal') {
            playSE('heal');
            enemy.hp = Math.min(enemy.maxHp, enemy.hp + 5);
            logMessage(`${enemy.name} はHPめE5 回復した�E�`, 'log-heal');
          } else if (enemy.intent.type === 'paralyze') {
            playSE('thunder');
            player.paralyze = 1;
            logMessage('プレイヤーは麻痺状態になった！E, 'log-poison');
          } else if (enemy.intent.type === 'poison') {
            playSE('poison');
            player.poison = (player.poison || 0) + 2;
            logMessage('プレイヤーは毁Eを付与された�E�E, 'log-poison');
          } else if (enemy.intent.type === 'buff_up') {
            playSE('buff_up');
            enemy.buffUp = 3;
            logMessage(`${enemy.name} は能昁E��態になった！`, 'log-heal');
          } else if (enemy.intent.type === 'buff_down') {
            playSE('buff_down');
            player.buffDown = 3;
            logMessage('プレイヤーは能降状態になった！E, 'log-poison');
          } else {
            const isBoss = (currentPathType === 'boss' || currentPathType === 'midboss' || currentPathType === 'lastboss');
            if (enemy.intent.type === 'fire_attack') playSE('fire');
            else if (enemy.intent.type === 'ice_attack') playSE('ice');
            else if (enemy.name === 'ハ�Eピ�E') playSE('harpy');
            else if (isBoss) playSE('boss_attack');
            else playSE('enemy_attack');

            const element = (enemy.intent.type === 'fire_attack') ? 'fire' : ((enemy.intent.type === 'ice_attack') ? 'ice' : 'none');
            const calculatedDmg = calculateDamage(dmg, element, false);
            if (calculatedDmg > 0) {
              player.hp = Math.max(0, player.hp - calculatedDmg);
              logMessage('プレイヤーに ' + calculatedDmg + ' のダメージ�E�E, 'log-damage');
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
      if (player.mp < cardCost) { logMessage('MPが足りません�E�E, 'log-system'); return; }
      if (player.actions <= 0) { logMessage('行動回数が残ってぁE��せん�E�E, 'log-system'); return; }

      player.mp -= cardCost;
      player.actions -= 1;
      player.hand.splice(index, 1);
      playSE('play');
      if (!card.oncePerBattle) {
        player.discard.push(card);
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
        logMessage(card.name + '�E�E' + enemy.name + ' に ' + (hits > 1 ? total + '(' + (total / hits) + 'ÁE + hits + '�E�E : '' + total) + ' ダメージ�E�E, 'log-damage');
        if (card.poison && card.poison > 0) {
          if (enemy.isGolem || enemy.isVampire) {
            logMessage(`${enemy.name} は毒を無効化した。`, 'log-system');
          } else if (enemy.isMaou && Math.random() < 0.5) {
            logMessage('魔王は状態異常を防ぁE��、E, 'log-system');
          } else {
            enemy.poison = (enemy.poison || 0) + card.poison;
            logMessage(enemy.name + 'に毁E + card.poison + 'を付与！E, 'log-poison');
          }
        }
      } else if (card.type === 'skill') {
        if (card.draw) { drawCards(card.draw); player.actions++; logMessage(card.name + '�E�Eカードを' + card.draw + '枚引き、行動回数+1�E�E); }
        if (card.healSelf) { player.hp = Math.min(player.maxHp, player.hp + card.healSelf); logMessage(card.name + '�E�EHP +' + card.healSelf, 'log-heal'); }
        if (card.buffUp) { player.buffUp = card.buffUp; logMessage('能昁E���E昁E��与ダメ+1/被ダメ-1�E�を3ターン得た�E�E, 'log-heal'); }
        if (card.buffDown) { enemy.buffDown = card.buffDown; logMessage('能降！敵に能降（与ダメ-1/被ダメ+1�E�を3ターン付与！E, 'log-poison'); }
      }
      updateUI();
      if (enemy.hp <= 0) {
        enemy.hp = 0;
        updateUI();
        handleVictory();
      } else {
        if (player.actions <= 0) {
          logMessage('行動回数がなくなったため、�E動的にターンを終亁E��ます、E, 'log-system');
          setTimeout(() => { if (!isGameOver) endTurn(); }, 800);
        }
      }
    }

    // --- 16. 勝敗・報酬 ---

    /** 固定レリチE��をカチE��シーン後に付与するユーチE��リチE�� */
    function giveFixedRelic(relicId, cutsceneScenes, onDone) {
      const relic = RELIC_DB[relicId];
      if (!relic) { onDone?.(); return; }
      showCutscene(cutsceneScenes, () => {
        if (!player.relics.includes(relicId)) {
          playSE('relic');
          player.relics.push(relicId);
        }
        logMessage(`、E{relic.name}」を手に入れた�E�`, 'log-system');
        // レリチE��即時効果�E適用

        if (relicId === 'yubiwa_gold') { player.maxHp += 1; player.hp = Math.min(player.hp, player.maxHp); }
        if (relicId === 'yubiwa_silver') { player.maxMp += 1; }
        showGameAlert('レリチE��入扁E, `、E{relic.name}」を入手しました�E�Ebr><span style="font-size:0.7rem; color:var(--text-muted);">${relic.desc}</span>`, () => {
          onDone?.();
        });
      });
    }

    function handleVictory() {
      isGameOver = true;
      if (btnEndTurn) btnEndTurn.disabled = true;
      playSE('victory');
      logMessage(enemy.name + ' を倒した！E, 'log-system');

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
          logMessage(`ミミチE��からレリチE��、E{RELIC_DB[unownedRelics[0]].name}」を手に入れた�E�`, 'log-system');
        }
        const unupgraded = player.deck.filter(c => !c.upgraded);
        if (unupgraded.length > 0) {
          shuffle(unupgraded);
          const target = unupgraded[0];
          const index = player.deck.findIndex(c => c === target);
          if (index !== -1) {
            player.deck[index] = upgradeCard(player.deck[index]);
            logMessage(`ミミチE��の宝�E力で、カード、E{target.name}」が、E{target.name}+」に強化された�E�`, 'log-heal');
          }
        }
      }

      // ===== 中ボス撁E��征E=====

      if (currentPathType === 'midboss') {
        setTimeout(() => {
          showMapScreen();
          // エリア2中ボス�E�ゴーレム�E�E
          if (currentArea === 2) {
            const postScenes = [{
              bg: BASE_MAP + 'mon_gate_western_close.png',
              portraits: [{ src: BASE_CH + 'knight.png', size: '120px' }],
              speaker: '見回り�E兵士',
              lines: [
                'ありがとぁE��町を守るゴーレムが故障で暴走してしまぁE��誰も近づけなくなってぁE��んだ、E,
                'おかげで出入りができるようになった。あとで修琁E��てめE��なぁE��な。これ�Eお礼だ、E
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
          // エリア3中ボス�E�リヴァイアサン�E�E
          else if (currentArea === 3) {
            const postScenes = [
              {
                bg: BASE_MAP + 'arashi.png',
                portraits: [],
                speaker: '─── 状況E───',
                lines: ['ふと、嵐が止んだ、Enリヴァイアサンはあなた�E実力を認めてくれたよぁE��、E]
              },
              {
                bg: BASE_MAP + 'arashi.png',
                portraits: [{ src: BASE_CH + 'ningyohime.png', size: '130px' }],
                speaker: '人魁E,
                lines: [
                  '海神様に認められるなんて、本当に勁E��な人間�E�E�E,
                  '魔王と戦ぁE��ら、これを持ってぁE��て、Enこ�E海に伝わる力が、きっとあなたを守ってくれる�Eずよ、E
                ]
              }
            ];
            giveFixedRelic('mermaid_necklace', postScenes, () => triggerMidbossFairyUpgrade());
          }
          // エリア1中ボス�E�バンチE��チE���E�E
          else {
            const postScenes = [{
              bg: BASE_MAP + 'doukutsu.png',
              portraits: [{ src: BASE_CH + 'knight.png', size: '120px' }],
              speaker: '城�E兵士',
              lines: [
                'ご助力感謝します。この山賊�E我、E��連行します、E,
                '山賊が持ってぁE��も�Eです。あなたにお役立てぁE��だければ幸ぁE��す、E
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

      // ===== ボス撁E��征E=====

      if (currentPathType === 'boss') {
        setTimeout(() => {
          // エリア1ボス�E�ダークエルフ！E
          if (currentArea === 1) {
            const postScenes = [
              {
                bg: BASE_MAP + 'mori.png',
                portraits: [{ src: '/portfolio/roguelike/assets/monsters/fantasy_dark_elf.png', size: '120px' }],
                speaker: 'ダークエルチE,
                lines: ['きゅ�E�……']
              },
              {
                bg: BASE_MAP + 'mori.png',
                portraits: [{ src: BASE_CH + 'fantasy_elf2.png', size: '130px' }],
                speaker: 'エルチE,
                lines: [
                  '闁E��囚われた仲間を正気に戻してくれて、ありがとぁE��ざいます、E,
                  'あなた�E勁E��に感謝を込めて、この森に古くから伝わる妖精の剣を授けましょぁE��En大刁E��してください、E
                ]
              }
            ];
            showMapScreen();
            giveFixedRelic('game_ken_seiken', postScenes, () => progressArea());
          }
          // エリア2ボス�E�ヴァンパイア�E�E
          else if (currentArea === 2) {
            const postScenes = [{
              bg: BASE_MAP + 'building_europe_kojou.png',
              portraits: [{ src: BASE_CH + 'royal_princess.png', size: '130px' }],
              speaker: '姫',
              lines: [
                '助けてくださいまして、誠にありがとぁE��ざいます、Enあなた�Eような勁E��な方が来てくださるとは夢にも思いませんでした、E,
                'これはわたくしの形見�E品でござぁE��す、EnどぁE��お力になれますよぁE��、E
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
      if (rewardSubtitleText) rewardSubtitleText.textContent = '1枚カードを選んでチE��キに追加';
      const pool = [...REWARD_POOL];
      shuffle(pool);
      const picks = pool.slice(0, 3);
      picks.forEach(id => {
        const card = CARD_DB[id];
        const el = makeCardEl(card, () => {
          playSE('reward_select');
          player.discard.push({ ...CARD_DB[id] });
          logMessage(CARD_DB[id].name + ' をデチE��に追加�E�E, 'log-system');
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
      if (desc) desc.textContent = '中ボス撁E��ボ�Eナス�E�カードを1枚選んで「強化！E�E�」します、E無斁E';

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
              showGameAlert('強化�E劁E, `、E{card.name}」が強化され、E{card.name}+」になりました�E�`, () => {
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
      if (rewardSubtitleText) rewardSubtitleText.textContent = 'エリアボス撁E���E�レリチE��めEつ選択してください';
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
          <div class="card-cost" style="background:#ffd700; color:#1a1a2e; font-size:0.65rem;">宁E/div>
          <div class="card-name" style="color:#ffd700; font-size:0.55rem; line-height:1.2; margin-top:0.6rem; padding:0 2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; box-sizing:border-box; width:100%; text-align:center;">${relic.name}</div>
          <div class="card-desc" style="font-size:0.55rem; line-height:1.2; padding:2px;">${relic.desc}</div>
        `;
        el.addEventListener('click', () => {
          playSE('relic');
          player.relics.push(relicId);
          logMessage(`ボス報酬�E�レリチE��、E{relic.name}」を獲得！`, 'log-system');
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
        resultTitle.textContent = isWin ? '戦闘勝利�E�E : 'ゲームオーバ�E';
        resultTitle.style.color = isWin ? '#28a745' : '#dc3545';
      }
      if (resultDetails) {
        resultDetails.textContent = isWin
          ? `第${battleCount}戦を見事に勝ち抜きました�E�引き続き次の階層を選択してください。`
          : `魔王の軍勢に倒れました�E�到達階層: エリア ${currentArea} - ${currentFloor}層�E�。もぁE��度挑戦しますか�E�`;
      }
      if (btnNext) btnNext.textContent = isWin ? 'マップへ戻めE : 'リトライ';
      if (overlay) overlay.style.display = 'flex';
    }

    function showGameClearScreen() {
      isGameOver = true;
      stopBGM();
      playSE('victory');
      if (resultTitle) {
        resultTitle.textContent = '🎉 全面クリア�E�E;
        resultTitle.style.color = '#ffd700';
      }
      if (resultDetails) {
        const clsName = player.class === 'yuusya' ? '勁E��E : (player.class === 'kenshi' ? '戦士' : (player.class === 'mahoutsukai' ? '魔法使ぁE : '格闘家'));
        resultDetails.innerHTML = `
          <strong>おめでとぁE��ざいます！E/strong><br>
          あなた�E魔王を撃破し、世界に平和を取り戻しました�E�Ebr><br>
          【�E険の記録、Ebr>
          選択した�E業: ${clsName}<br>
          最終所持E��: 💰${player.gold} / 獲得レリチE��: ${player.relics.length}倁E        `;
      }
      if (btnNext) btnNext.style.display = 'none';
      if (overlay) overlay.style.display = 'flex';
    }

    function handleGameOver() {
      isGameOver = true;
      if (btnEndTurn) btnEndTurn.disabled = true;
      logMessage('プレイヤーは倒れぁE..', 'log-system');
      setTimeout(() => showResultOverlay(false), 800);
    }

    // --- 17. 戦闘開始�EルーチE---

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

      // 戦闘開始前に手札・捨て札を山札にまとめてシャチE��ル�E��E回以外！E
      if (!(currentFloor === 1 && currentArea === 1)) {
        player.deck = shuffle([...player.deck, ...player.discard, ...player.hand]);
        player.discard = [];
        player.hand = [];
      }

      if (currentFloor === 1 && currentArea === 1) {
        // ゲーム最初期匁E
        player.hp = player.maxHp;
        player.mp = player.maxMp;
        player.deck = shuffle(INITIAL_DECKS[player.class].map(id => ({ ...CARD_DB[id] })));
        player.discard = [];
        player.poison = 0;
        player.paralyze = 0;
        player.buffUp = 0;
        player.buffDown = 0;
      } else {
        // 通常の戦闘開始：前の戦闘�EチE��キを引き継ぎ、シャチE��ル

        player.deck = shuffle([...player.deck, ...player.discard, ...player.hand]);
        player.discard = [];
        player.poison = 0;
        player.paralyze = 0;
        player.buffUp = 0;
        player.buffDown = 0;
        player.mp = Math.min(player.maxMp, player.mp);
      }
      player.hand = [];

      showScreen(document.querySelector('.battle-layout'));

      if (battleLog) battleLog.innerHTML = '';
      logMessage(`第${currentFloor}層�E�E{enemy.name}が現れた�E�`, 'log-system');

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

      // 毒�E麻痺・能昁E�E能降バチE�� (プレイヤー)

      if (playerPoisonEl) {
        let text = '';
        if (player.poison > 0) text += ` 🟢ÁE{player.poison}`;
        if (player.paralyze > 0) text += ` ⚡ÁE{player.paralyze}`;
        if (player.buffUp > 0) text += ` 📈ÁE{player.buffUp}`;
        if (player.buffDown > 0) text += ` 📉ÁE{player.buffDown}`;

        playerPoisonEl.style.display = text ? 'inline' : 'none';
        playerPoisonEl.textContent = text;
      }

      // 山札

      if (deckCountEl) deckCountEl.textContent = player.deck.length;

      // 手札

      renderHand();

      // レリチE��とアイチE��

      renderRelicsAndItems();

      // 敵スチE�Eタス

      if (enemy) {
        if (enemyHpText) enemyHpText.textContent = enemy.hp + '/' + enemy.maxHp;
        if (enemyHpBar) enemyHpBar.style.width = Math.max(0, enemy.hp / enemy.maxHp * 100) + '%';
        if (enemyIntentEl) {
          if (enemy.intent) {
            enemyIntentEl.style.display = 'block';
            enemyIntentEl.textContent = `${enemy.intent.desc} ` + (enemy.intent.damage > 0 ? `⚔︁E{enemy.intent.damage}` : '');
          } else {
            enemyIntentEl.style.display = 'none';
          }
        }

        // 毒�E麻痺・能昁E�E能降バチE�� (敵)

        if (enemyPoisonEl) {
          let text = '';
          if (enemy.poison > 0) text += ` 🟢ÁE{enemy.poison}`;
          if (enemy.paralyze > 0) text += ` ⚡ÁE{enemy.paralyze}`;
          if (enemy.buffUp > 0) text += ` 📈ÁE{enemy.buffUp}`;
          if (enemy.buffDown > 0) text += ` 📉ÁE{enemy.buffDown}`;

          enemyPoisonEl.style.display = text ? 'inline' : 'none';
          enemyPoisonEl.textContent = text;
        }
      }

      updateHeaderBar();
    }

    function renderHand() {
      if (!handArea) return;
      handArea.innerHTML = '';
      player.hand.forEach((card, index) => {
        const playable = player.actions > 0 && player.mp >= getCardCost(card);
        const cardEl = makeCardEl(card, playable ? () => playCard(index) : null);
        if (!playable) cardEl.classList.add('disabled');
        handArea.appendChild(cardEl);
      });
    }

    // --- 18. チE��キ閲覧 ---

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
          el.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">カードなぁE/p>';
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

    // --- 19. イベントリスナ�E ---

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
        if (startScreen) startScreen.style.display = 'flex';
        playBGM('start');
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
    if (closeDeckViewer) {
      closeDeckViewer.addEventListener('click', () => {
        if (deckViewerOverlay) deckViewerOverlay.style.display = 'none';
      });
    }

    // 戦闘中マップ確誁E    if (btnBattleViewMap) {

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

    // チE��キビュアーのタチE    document.querySelectorAll('.deck-tab').forEach(btn => {

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

    const btnGameStart = document.getElementById('btn-game-start');
    if (btnGameStart) {
      btnGameStart.addEventListener('click', () => {
        initGame();
      });
    }

    // 吁E��ポップアチE�Eモーダル

    const howtoBtn = document.getElementById('howto-btn');
    const closeHowtoBtn = document.getElementById('close-howto-btn');
    const howtoModal = document.getElementById('howto-modal');
    const configBtn = document.getElementById('config-btn');
    const closeConfigBtn = document.getElementById('close-config-btn-x');
    const configModal = document.getElementById('config-modal');
    const creditsBtn = document.getElementById('credits-btn');
    const closeCreditsBtn = document.getElementById('close-credits-btn-x');
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

    // グローバルなボタンクリチE��音

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

document.addEventListener('DOMContentLoaded', () => {
  const cardTooltip = document.getElementById('card-tooltip');
  if (!cardTooltip) return;
  const tName = document.getElementById('tooltip-name');
  const tCost = document.getElementById('tooltip-cost');
  const tCat = document.getElementById('tooltip-category');
  const tDesc = document.getElementById('tooltip-desc');
  
  document.addEventListener('mouseover', (e) => {
    const cardEl = e.target.closest('.battle-card');
    if (cardEl && cardEl.dataset.cardId) {
      const cardData = Object.values(window._gameContext?.cards || {}).find(c => c.id === cardEl.dataset.cardId);
      if (cardData) {
        tName.textContent = cardData.name + (cardData.upgraded ? '+' : '');
        tCost.textContent = 'MP: ' + cardData.cost;
        tCat.textContent = cardData.category || '攻撃';
        tDesc.innerHTML = (cardData.description || '').replace(/\n/g, '<br>');
        
        const rect = cardEl.getBoundingClientRect();
        cardTooltip.style.display = 'block';
        cardTooltip.style.left = Math.min(rect.right + 10, window.innerWidth - 230) + 'px';
        cardTooltip.style.top = Math.min(rect.top, window.innerHeight - cardTooltip.offsetHeight - 10) + 'px';
      }
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.battle-card')) {
      cardTooltip.style.display = 'none';
    }
  });
});

function showUpgradeConfirm(card, cardEl, cost, callback) {
  const modal = document.getElementById('upgrade-confirm-modal');
  const overlay = document.getElementById('modal-overlay');
  if (!modal || !overlay) {
    callback(confirm(`「${card.name}」を強化しますか？\n\n(必要ゴールド: ${cost})`));
    return;
  }
  
  const container = document.getElementById('upgrade-confirm-card');
  container.innerHTML = '';
  const clone = cardEl.cloneNode(true);
  clone.style.pointerEvents = 'none';
  container.appendChild(clone);
  
  document.getElementById('upgrade-cost-text').textContent = `必要ゴールド: ${cost}G`;
  
  modal.classList.add('active');
  overlay.classList.add('active');
  
  const btnYes = document.getElementById('btn-upgrade-yes');
  const btnNo = document.getElementById('btn-upgrade-no');
  const btnClose = document.getElementById('close-upgrade-confirm-btn-x');
  
  const cleanup = () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    btnYes.removeEventListener('click', onYes);
    btnNo.removeEventListener('click', onNo);
    btnClose.removeEventListener('click', onNo);
  };
  
  const onYes = () => { cleanup(); callback(true); };
  const onNo = () => { cleanup(); callback(false); };
  
  btnYes.addEventListener('click', onYes);
  btnNo.addEventListener('click', onNo);
  btnClose.addEventListener('click', onNo);
}
