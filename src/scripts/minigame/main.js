import seCursor from '../../assets/games/minigame/audio/se/カーソル移動7.mp3';
import seConfirm from '../../assets/games/minigame/audio/se/決定ボタンを押す2.mp3';
import seCancel from '../../assets/games/minigame/audio/se/キャンセル1.mp3';
import seTapNormal from '../../assets/games/minigame/audio/se/小パンチ.mp3';
import seTapMinusScore from '../../assets/games/minigame/audio/se/ビープ音4.mp3';
import seTapHeal from '../../assets/games/minigame/audio/se/statushenkapowerup.wav';
import seTapMinusTime from '../../assets/games/minigame/audio/se/statushenkapowerdown.wav';

// is:inline により Astroのバンドル・最適化をスキップ
// DOMContentLoaded は不要（is:inlineはDOMより後に実行される）
(function () {
  let configBgmVolume = 0.5;
  let configSeVolume = 0.5;
  
  const SE_DB = {
    'cursor': seCursor,
    'confirm': seConfirm,
    'cancel': seCancel,
    'tap_normal': seTapNormal,
    'tap_minusScore': seTapMinusScore,
    'tap_heal': seTapHeal,
    'tap_minusTime': seTapMinusTime
  };

  function playSE(seId) {
    if (!SE_DB[seId]) return;
    const se = new Audio(SE_DB[seId]);
    se.volume = configSeVolume;
    se.play().catch(e => console.log('SE play failed:', e));
  }

  const startBtn = document.getElementById('start-btn');
  const retryBtn = document.getElementById('retry-btn');
  const titleBtn = document.getElementById('title-btn');
  const shareBtn = document.getElementById('share-btn');
  const howtoBtn = document.getElementById('howto-btn');
  const closeHowtoBtn = document.getElementById('close-howto-btn-x'); // ✕ボタンのID
  const howtoModal = document.getElementById('howto-modal');
  const configBtn = document.getElementById('config-btn');
  const closeConfigBtn = document.getElementById('close-config-btn-x'); // ✕ボタンのID
  const configModal = document.getElementById('config-modal');
  
  const creditsBtn = document.getElementById('credits-btn');
  const closeCreditsBtn = document.getElementById('close-credits-btn-x'); // ✕ボタンのID
  const creditsModal = document.getElementById('credits-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const scoreElement = document.getElementById('score');
  const timeElement = document.getElementById('time');
  const highscoreElement = document.getElementById('highscore');
  const startScreen = document.getElementById('start-screen');
  const resultScreen = document.getElementById('result-screen');
  const finalScoreElement = document.getElementById('final-score');
  const gameArea = document.getElementById('game-container');

  if (!gameArea) return;

  let score = 0;
  let timeLeft = 30;
  let isPlaying = false;
  let mainTimer;
  let spawnTimer;
  let activeTargets = [];
  const MAX_TARGETS = 5;
  let isPaused = false;

  function pauseGame() {
    if (!isPlaying || isPaused) return;
    isPaused = true;
    clearInterval(mainTimer);
    clearInterval(spawnTimer);
    if (slowBonusActive && slowBonusTimer) clearTimeout(slowBonusTimer);
    
    const now = Date.now();
    activeTargets.forEach(t => {
      if (t.timeout) clearTimeout(t.timeout);
      t.remainingTime = Math.max(0, t.remainingTime - (now - t.spawnTime));
    });
  }

  function resumeGame() {
    if (!isPlaying || !isPaused) return;
    isPaused = false;
    
    if (slowBonusActive) {
      slowBonusTimer = setTimeout(() => { slowBonusActive = false; }, 5000);
    }
    
    mainTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft < 0) timeLeft = 0;
      updateTimeDisplay();
      if (timeLeft <= 0) endGame();
    }, 1000);

    spawnTimer = setInterval(() => { spawnTarget(); }, 500);

    const now = Date.now();
    activeTargets.forEach(t => {
      t.spawnTime = now;
      t.timeout = setTimeout(() => {
        if (t.element && t.element.style) t.element.style.opacity = '0';
        setTimeout(() => removeTarget(t), 200);
      }, t.remainingTime);
    });
  }

  // 緑の的をタップした時のスロー効果フラグ（5秒間true）
  let slowBonusActive = false;
  let slowBonusTimer = null;

  let highScore = localStorage.getItem('minigame_highscore') || '0';
  if (highscoreElement) highscoreElement.textContent = highScore;
  const startHighscoreElement = document.getElementById('start-highscore-val');
  if (startHighscoreElement) startHighscoreElement.textContent = highScore;

  // --- 的のバリエーション定義（6色） ---
  // special: 'slow'  → タップで5秒間スロー効果（緑）
  // special: null    → 通常の得点・時間効果
  const TARGET_TYPES = [
    // 青: 通常
    { id: 'normal', cssClass: 'target-normal', score: 10, time: 0, size: 60, baseDuration: 1200, prob: 0.50, special: null },
    // 赤: -30点
    { id: 'minusScore', cssClass: 'target-minus-time', score: -30, time: 0, size: 60, baseDuration: 1800, prob: 0.07, special: null },
    // 橙: +5秒
    { id: 'heal', cssClass: 'target-heal', score: 0, time: 5, size: 55, baseDuration: 1200, prob: 0.08, special: null },
    // 紫: -5秒
    { id: 'minusTime', cssClass: 'target-minus-score', score: 0, time: -5, size: 60, baseDuration: 1500, prob: 0.10, special: null },
    // 黄: 高得点・速い
    { id: 'high', cssClass: 'target-high', score: 50, time: 0, size: 45, baseDuration: 600, prob: 0.12, special: null },
    // 緑: スロー効果
    { id: 'slow', cssClass: 'target-long', score: 0, time: 0, size: 65, baseDuration: 1500, prob: 0.13, special: 'slow' }
  ];

  function getRandomTargetType() {
    // 現在画面に出ている的のidを集める
    const activeIds = activeTargets.map(t => t.typeId);

    // 出現制限ルール:
    // ・紫（minusTime）は残り時間が10秒以下のとき出現しない
    // ・橙（heal）・緑（slow）・紫（minusTime）はすでに画面に同じ種類がいれば出現しない
    //   → 同時複数出現によるゲームバランス崩壊を防ぐ
    const uniqueTypes = ['heal', 'slow', 'minusTime'];
    const available = TARGET_TYPES.filter(t => {
      if (t.id === 'minusTime' && timeLeft <= 10) return false;
      if (uniqueTypes.includes(t.id) && activeIds.includes(t.id)) return false;
      return true;
    });

    // availableの確率を合計して正規化し直す
    const totalProb = available.reduce((sum, t) => sum + t.prob, 0);
    const rand = Math.random() * totalProb;
    let cumulative = 0;
    for (const type of available) {
      cumulative += type.prob;
      if (rand <= cumulative) return type;
    }
    return available[0];
  }

  function checkOverlap(newX, newY, newSize) {
    const newRadius = newSize / 2;
    const newCenterX = newX + newRadius;
    const newCenterY = newY + newRadius;

    for (const t of activeTargets) {
      const tRadius = t.size / 2;
      const tCenterX = t.x + tRadius;
      const tCenterY = t.y + tRadius;

      const dx = newCenterX - tCenterX;
      const dy = newCenterY - tCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < (newRadius + tRadius + 10)) {
        return true;
      }
    }
    return false;
  }

  function spawnTarget() {
    if (!isPlaying || activeTargets.length >= MAX_TARGETS) return;

    const type = getRandomTargetType();

    // gameAreaのサイズ取得（万が一0だった場合のフォールバックを設定）
    const areaWidth = gameArea.clientWidth || 300;
    const areaHeight = gameArea.clientHeight || 400;
    const maxX = Math.max(0, areaWidth - type.size);
    const maxY = Math.max(0, areaHeight - type.size);

    let randomX = 0, randomY = 0;
    let overlap = true;
    let attempts = 0;
    while (overlap && attempts < 50) {
      randomX = Math.floor(Math.random() * maxX);
      randomY = Math.floor(Math.random() * maxY);
      overlap = checkOverlap(randomX, randomY, type.size);
      attempts++;
    }

    if (overlap) return;

    const targetEl = document.createElement('div');
    targetEl.className = `target ${type.cssClass}`;
    targetEl.style.width = `${type.size}px`;
    targetEl.style.height = `${type.size}px`;
    targetEl.style.left = `${randomX}px`;
    targetEl.style.top = `${randomY}px`;

    // 残り時間によるスピードアップ（終盤ほど的が早く消える）
    // スロー効果中（slowBonusActive）は baseDuration に5000msをプラス
    const speedMultiplier = Math.max(0.4, timeLeft / 30);
    const slowBonus = slowBonusActive ? 5000 : 0;
    const duration = type.baseDuration * speedMultiplier + slowBonus;

    const targetObj = {
      x: randomX,
      y: randomY,
      size: type.size,
      element: targetEl,
      timeout: null,
      typeId: type.id,          // 同時複数出現チェック用に種類のIDを保持
      spawnTime: Date.now(),    // スロー効果でタイマー延長するために出現時刻を保持
      baseDuration: type.baseDuration,
      speedMultiplier: speedMultiplier,
      remainingTime: duration
    };

    const handleClick = (e) => {
      if (e) e.preventDefault();
      if (!isPlaying) return;

      if (type.id === 'normal' || type.id === 'high') {
        playSE('tap_normal');
      } else if (type.id === 'minusScore') {
        playSE('tap_minusScore');
      } else if (type.id === 'heal' || type.id === 'slow') {
        playSE('tap_heal');
      } else if (type.id === 'minusTime') {
        playSE('tap_minusTime');
      }

      // --- スコア処理 ---
      score += type.score;
      if (score < 0) score = 0;
      if(scoreElement) scoreElement.textContent = score.toString();

      // --- 時間処理 ---
      if (type.time !== 0) {
        timeLeft += type.time;
        if (timeLeft < 0) timeLeft = 0;
        if(timeElement) {
            timeElement.classList.remove('time-heal', 'time-damage');
            void timeElement.offsetWidth;
            timeElement.classList.add(type.time > 0 ? 'time-heal' : 'time-damage');
        }
        updateTimeDisplay();
      }

      // --- 緑のスロー効果（5秒間 的の消滅時間を+5秒） ---
      if (type.special === 'slow') {
        slowBonusActive = true;
        if (slowBonusTimer) clearTimeout(slowBonusTimer);
        // 5秒後にスロー効果を解除
        slowBonusTimer = setTimeout(() => { slowBonusActive = false; }, 5000);
        // 現在画面にある的のタイマーを5秒延長する
        activeTargets.forEach(t => {
          if (t.timeout && t !== targetObj) {
            clearTimeout(t.timeout);
            const elapsed = Date.now() - t.spawnTime;
            const remaining = Math.max(0, t.remainingTime - elapsed);
            t.remainingTime = remaining + 5000;
            t.spawnTime = Date.now();
            t.timeout = setTimeout(() => {
              if (t.element && t.element.style) t.element.style.opacity = '0';
              setTimeout(() => removeTarget(t), 200);
            }, t.remainingTime);
          }
        });
      }

      // --- ポップアップ表示 ---
      const popupX = randomX + type.size / 2 - 20;
      const popupY = randomY;
      let popupText = '';
      let popupClass = 'popup-good';

      if (type.special === 'slow') {
        popupText = 'SLOW! +5秒';
        popupClass = 'popup-good';
      } else if (type.score > 10) {
        popupText = `+${type.score}`;
        popupClass = 'popup-great';
      } else if (type.score < 0) {
        popupText = `${type.score}`;
        popupClass = 'popup-bad';
      } else if (type.time > 0) {
        popupText = `+${type.time}秒`;
        popupClass = 'popup-time';
      } else if (type.time < 0) {
        popupText = `-${Math.abs(type.time)}秒`;
        popupClass = 'popup-bad';
      } else {
        popupText = `+${type.score}`;
      }

      showPopupText(popupX, popupY, popupText, popupClass);
      removeTarget(targetObj);
    };

    targetEl.addEventListener('mousedown', handleClick);
    targetEl.addEventListener('touchstart', handleClick);

    targetObj.timeout = setTimeout(() => {
      if (targetEl && targetEl.style) {
        targetEl.style.opacity = '0';
      }
      setTimeout(() => removeTarget(targetObj), 200);
    }, duration);

    activeTargets.push(targetObj);
    gameArea.appendChild(targetEl);
  }

  function removeTarget(targetObj) {
    if (targetObj.timeout) clearTimeout(targetObj.timeout);
    if (targetObj.element && targetObj.element.parentNode) {
      targetObj.element.parentNode.removeChild(targetObj.element);
    }
    activeTargets = activeTargets.filter(t => t !== targetObj);
  }

  function clearAllTargets() {
    activeTargets.forEach(t => {
      if (t.timeout) clearTimeout(t.timeout);
      if (t.element && t.element.parentNode) t.element.parentNode.removeChild(t.element);
    });
    activeTargets = [];
  }

  function showPopupText(x, y, text, cssClass) {
    const popup = document.createElement('div');
    popup.textContent = text;
    popup.className = `popup-text ${cssClass}`;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    gameArea.appendChild(popup);
    setTimeout(() => {
      if (popup && popup.parentNode) popup.parentNode.removeChild(popup);
    }, 600);
  }

  function updateTimeDisplay() {
    if (!timeElement) return;
    timeElement.textContent = timeLeft.toString();
    if (timeLeft <= 10) {
      timeElement.classList.add('time-alert');
    } else {
      timeElement.classList.remove('time-alert');
    }
  }

  function startGame() {
    playSE('confirm');
    score = 0;
    timeLeft = 30;
    isPlaying = true;
    isPaused = false;
    if(scoreElement) scoreElement.textContent = score.toString();
    if(timeElement) {
        timeElement.className = '';
        updateTimeDisplay();
    }

    if(startScreen) startScreen.style.display = 'none';
    if(resultScreen) resultScreen.style.display = 'none';
    
    const hud = document.querySelector('.game-hud');
    if(hud) hud.style.display = 'flex';
    const bottomHud = document.getElementById('bottom-hud');
    if(bottomHud) bottomHud.style.display = 'block';

    clearInterval(mainTimer);
    clearInterval(spawnTimer);
    clearAllTargets();

    // クリック直後にまず3つ一気に湧かせる（すぐに遊べるように）
    for (let i = 0; i < 3; i++) {
      spawnTarget();
    }

    spawnTimer = setInterval(() => {
      spawnTarget();
    }, 500);

    mainTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft < 0) timeLeft = 0;
      updateTimeDisplay();

      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    isPlaying = false;
    clearInterval(mainTimer);
    clearInterval(spawnTimer);
    clearAllTargets();

    if (score > parseInt(highScore)) {
      highScore = score.toString();
      localStorage.setItem('minigame_highscore', highScore);
      if(highscoreElement) highscoreElement.textContent = highScore;
      if(startHighscoreElement) startHighscoreElement.textContent = highScore;
    }

    if(finalScoreElement) finalScoreElement.textContent = score.toString();
    const shareText = `私のスコアは ${score} 点でした！(ハイスコア: ${highScore}点) #MyPortfolioMinigame`;
    const shareUrl = window.location.href;
    // ゲーム終了ごとに最新のスコアを含むシェアURLを生成してボタンに登録する
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

    if (shareBtn) {
      shareBtn.onclick = () => {
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      };
    }

    const bottomHud = document.getElementById('bottom-hud');
    if(bottomHud) bottomHud.style.display = 'none';

    if(resultScreen) resultScreen.style.display = 'block';
  }

  if(startBtn) startBtn.addEventListener('click', startGame);
  if(retryBtn) retryBtn.addEventListener('click', () => {
    if(resultScreen) resultScreen.style.display = 'none';
    startGame();
  });
  if(titleBtn) titleBtn.addEventListener('click', () => {
    playSE('cancel');
    if(resultScreen) resultScreen.style.display = 'none';
    if(startScreen) startScreen.style.display = 'flex';
    const hud = document.querySelector('.game-hud');
    if(hud) hud.style.display = 'none';
    const bottomHud = document.getElementById('bottom-hud');
    if(bottomHud) bottomHud.style.display = 'none';
  });
  if (howtoBtn) {
    howtoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      if(howtoModal) howtoModal.classList.add('active');
      if(modalOverlay) modalOverlay.classList.add('active');
    });
  }
  if (closeHowtoBtn) {
    closeHowtoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      if(howtoModal) howtoModal.classList.remove('active');
      if(modalOverlay) modalOverlay.classList.remove('active');
    });
  }
  
  const _cfgBtn1 = document.getElementById('start-config-btn');
  const _cfgBtn2 = document.getElementById('hud-config-btn');
  const openConfig = (e) => {
    e.stopPropagation();
    playSE('cursor');
    if (isPlaying && !isPaused) pauseGame();
    document.getElementById('config-modal')?.classList.add('active');
    document.getElementById('modal-overlay')?.classList.add('active');
  };
  if (_cfgBtn1) {
    _cfgBtn1.addEventListener('click', openConfig);
    _cfgBtn1.addEventListener('mousedown', (e) => e.stopPropagation());
    _cfgBtn1.addEventListener('touchstart', (e) => e.stopPropagation());
  }
  if (_cfgBtn2) {
    _cfgBtn2.addEventListener('click', openConfig);
    _cfgBtn2.addEventListener('mousedown', (e) => e.stopPropagation());
    _cfgBtn2.addEventListener('touchstart', (e) => e.stopPropagation());
  }
  const _closeCfgBtn = document.getElementById('close-config-btn-x'); // ✕ボタンのID
  if (_closeCfgBtn) {
    _closeCfgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      document.getElementById('config-modal')?.classList.remove('active');
      document.getElementById('modal-overlay')?.classList.remove('active');
      if (isPlaying && isPaused && !document.getElementById('credits-modal')?.classList.contains('active')) {
        resumeGame();
      }
    });
    _closeCfgBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    _closeCfgBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }

  const _credBtn = document.getElementById('credits-btn');
  if (_credBtn) {
    _credBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      document.getElementById('config-modal')?.classList.remove('active');
      document.getElementById('credits-modal')?.classList.add('active');
      document.getElementById('modal-overlay')?.classList.add('active');
    });
    _credBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    _credBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }
  const _closeCredBtn = document.getElementById('close-credits-btn-x'); // ✕ボタンのID
  if (_closeCredBtn) {
    _closeCredBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      document.getElementById('credits-modal')?.classList.remove('active');
      document.getElementById('modal-overlay')?.classList.remove('active');
      if (isPlaying && isPaused && !document.getElementById('config-modal')?.classList.contains('active') && !document.getElementById('retire-modal')?.classList.contains('active')) {
        resumeGame();
      }
    });
    _closeCredBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    _closeCredBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }

  // コンフィグ内「遊び方を見る」ボタン
  const _howtoInConfigBtn = document.getElementById('howto-btn-in-config');
  if (_howtoInConfigBtn) {
    _howtoInConfigBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      // コンフィグを閉じて遊び方モーダルを開く
      document.getElementById('config-modal')?.classList.remove('active');
      document.getElementById('howto-modal')?.classList.add('active');
      document.getElementById('modal-overlay')?.classList.add('active');
    });
    _howtoInConfigBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    _howtoInConfigBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }

  // Retire logic
  const _retireBtn = document.getElementById('retire-btn');
  if (_retireBtn) {
    _retireBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      if (isPlaying && !isPaused) pauseGame();
      document.getElementById('retire-modal')?.classList.add('active');
      document.getElementById('modal-overlay')?.classList.add('active');
    });
    _retireBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    _retireBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }

  const _closeRetireBtn = document.getElementById('close-retire-btn');
  if (_closeRetireBtn) {
    _closeRetireBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      document.getElementById('retire-modal')?.classList.remove('active');
      document.getElementById('modal-overlay')?.classList.remove('active');
      if (isPlaying && isPaused) {
        resumeGame();
      }
    });
    _closeRetireBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    _closeRetireBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }

  const _retireRetryBtn = document.getElementById('retire-retry-btn');
  if (_retireRetryBtn) {
    _retireRetryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('confirm');
      document.getElementById('retire-modal')?.classList.remove('active');
      document.getElementById('modal-overlay')?.classList.remove('active');
      startGame();
    });
  }

  const _retireTitleBtn = document.getElementById('retire-title-btn');
  if (_retireTitleBtn) {
    _retireTitleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cancel');
      document.getElementById('retire-modal')?.classList.remove('active');
      document.getElementById('modal-overlay')?.classList.remove('active');
      isPlaying = false;
      isPaused = false;
      clearInterval(mainTimer);
      clearInterval(spawnTimer);
      clearAllTargets();
      if(resultScreen) resultScreen.style.display = 'none';
      if(startScreen) startScreen.style.display = 'flex';
      const hud = document.querySelector('.game-hud');
      if(hud) hud.style.display = 'none';
      const bottomHud = document.getElementById('bottom-hud');
      if(bottomHud) bottomHud.style.display = 'none';
    });
  }

  // グローバルなボタンクリック音
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn, .icon-config, .mole');
    if (btn) {
      const id = btn.id;
      if (id !== 'start-btn' && id !== 'retry-btn' && id !== 'title-btn') {
        playSE('cursor');
      }
    }
  });

  const seVolumeInput = document.getElementById('se-volume');
  if (seVolumeInput) {
    seVolumeInput.addEventListener('input', (e) => {
      configSeVolume = parseFloat(e.target.value) / 100;
    });
  }
  const bgmVolumeInput = document.getElementById('bgm-volume');
  if (bgmVolumeInput) {
    bgmVolumeInput.addEventListener('input', (e) => {
      configBgmVolume = parseFloat(e.target.value) / 100;
    });
  }
})();
