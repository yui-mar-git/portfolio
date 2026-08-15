import seJump from '../../assets/games/run-action/audio/se/パパッ.mp3';
import seCollision from '../../assets/games/run-action/audio/se/ニュッ2.mp3';
import seCursor from '../../assets/games/run-action/audio/se/カーソル移動7.mp3';
import seConfirm from '../../assets/games/run-action/audio/se/決定ボタンを押す2.mp3';
import seCancel from '../../assets/games/run-action/audio/se/キャンセル1.mp3';
import seStageClear from '../../assets/games/run-action/audio/se/maou_game_jingle01.mp3';

import bgmField from '../../assets/games/run-action/audio/bgm/maou_game_field01.mp3';
import bgmRun from '../../assets/games/run-action/audio/bgm/maou_bgm_cyber37.mp3';

import { RUN_ACHIEVEMENTS } from '../../data/run-action/achievements';
import { ITEM_DB } from '../../data/run-action/items';
import { STAGE_CONFIG, FIXED_STAGES } from '../../data/run-action/stages';

(function () {
  let configBgmVolume = 0.5;
  let configSeVolume = 0.5;

  const SE_DB = {
    jump: seJump,
    collision: seCollision,
    cursor: seCursor,
    confirm: seConfirm,
    cancel: seCancel,
    stage_clear: seStageClear,
  };

  const BGM_DB = {
    field: bgmField,
    run: bgmRun,
  };

  let currentBgmAudio = null;
  let currentBgmId = null;

  function playSE(seId) {
    if (!SE_DB[seId]) return;
    const se = new Audio(SE_DB[seId]);
    se.volume = configSeVolume;
    se.play().catch((e) => console.log('SE play failed:', e));
  }

  function playBGM(bgmId) {
    if (currentBgmId === bgmId && currentBgmAudio && !currentBgmAudio.paused) {
      return;
    }
    stopBGM();
    if (!BGM_DB[bgmId]) return;
    currentBgmId = bgmId;
    currentBgmAudio = new Audio(BGM_DB[bgmId]);
    currentBgmAudio.volume = configBgmVolume;
    currentBgmAudio.loop = true;
    currentBgmAudio.play().catch((e) => console.log('BGM Play blocked:', e));
  }

  function stopBGM() {
    if (currentBgmAudio) {
      currentBgmAudio.pause();
      currentBgmAudio.currentTime = 0;
      currentBgmAudio = null;
    }
    currentBgmId = null;
  }

  window.playSE = playSE;
  window.playBGM = playBGM;
  window.stopBGM = stopBGM;
  window.setSEVolume = function (vol) {
    configSeVolume = vol;
  };
  window.setBGMVolume = function (vol) {
    configBgmVolume = vol;
    if (currentBgmAudio) {
      currentBgmAudio.volume = vol;
    }
  };

  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const wrapper = document.getElementById('game-container');

  // UI Elements
  const startScreen = document.getElementById('start-screen');
  const resultScreen = document.getElementById('result-screen');
  const stageModeScreen = document.getElementById('stage-mode-screen');
  const shopScreen = document.getElementById('shop-screen');

  function showScreen(el) {
    if (!el) return;
    el.classList.remove('screen-hidden');
    el.style.display = 'flex';
  }

  function hideScreen(el) {
    if (!el) return;
    el.classList.add('screen-hidden');
    el.style.display = 'none';
  }
  const timeElement = document.getElementById('survival-time');
  const highscoreElement = document.getElementById('highscore');
  const finalTimeElement = document.getElementById('final-time');
  const gameHud = document.getElementById('game-hud');
  const startBtn = document.getElementById('start-btn'); // エンドレス
  const stageBtn = document.getElementById('stage-btn'); // ステージ選択
  const shopBtn = document.getElementById('shop-btn'); // ショップ
  const retryBtn = document.getElementById('retry-btn');
  const titleBtn = document.getElementById('title-btn');
  const shareBtn = document.getElementById('share-btn');
  const howtoBtn = document.getElementById('howto-btn');
  const closeHowtoBtn = document.getElementById('close-howto-btn-x');
  const howtoModal = document.getElementById('howto-modal');
  const closeConfigBtn = document.getElementById('close-config-btn-x');
  const configModal = document.getElementById('config-modal');
  const modalOverlay = document.getElementById('modal-overlay');

  const stageBackBtn = document.getElementById('stage-back-btn');
  const stageListEl = document.getElementById('stage-list');
  const stageCoinsVal = document.getElementById('stage-coins-val');
  const stageActiveItemsEl = document.getElementById('stage-active-items');

  const shopBackBtn = document.getElementById('shop-back-btn');
  const shopCoinsVal = document.getElementById('shop-coins-val');
  const shopActiveItemsEl = document.getElementById('shop-active-items');
  const shopItemsGridEl = document.getElementById('shop-items-grid');

  const itemSettingModal = document.getElementById('item-setting-modal');
  const closeItemSettingBtn = document.getElementById('close-item-setting-btn-x');
  const itemSettingListEl = document.getElementById('item-setting-list');

  const startCoinsVal = document.getElementById('start-coins-val');
  const hudCoinsEl = document.getElementById('hud-coins');
  const hudActiveItemsEl = document.getElementById('hud-active-items');

  // Save Data Management
  let saveData = {
    coins: 0,
    unlockedStages: 1,
    ownedItems: [],
  };

  function loadSaveData() {
    try {
      const raw = localStorage.getItem('runaction_save_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        saveData = { ...saveData, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load saveData:', e);
    }
    updateCoinsDisplay();
  }

  function saveSaveData() {
    try {
      localStorage.setItem('runaction_save_v2', JSON.stringify(saveData));
    } catch (e) {
      console.warn('Failed to save saveData:', e);
    }
    updateCoinsDisplay();
  }

  function updateCoinsDisplay() {
    if (startCoinsVal) startCoinsVal.textContent = saveData.coins;
    if (stageCoinsVal) stageCoinsVal.textContent = saveData.coins;
    if (shopCoinsVal) shopCoinsVal.textContent = saveData.coins;
    if (hudCoinsEl) hudCoinsEl.textContent = sessionCoins;
  }



  // State
  let gameState = 'start'; // start, playing, gameover, stageclear
  let currentMode = 'endless'; // endless, stage
  let currentStageId = 1;
  let startTime = 0;
  let survivalTime = 0;
  let distanceTravelled = 0;
  let sessionCoins = 0;
  let isPaused = false;
  let pauseStartTime = 0;
  let animFrameCounter = 0;

  // ゴール演出用ステート & 入力保持ステート
  let isGoalSequence = false;
  let fadeAlpha = 0;
  let isInputHolding = false;
  let consecutiveHoles = 0;
  let minGroundBlocks = 0;

  let highScore = parseFloat(localStorage.getItem('runaction_highscore')) || 0;
  if (highscoreElement) highscoreElement.textContent = highScore.toFixed(1);
  const startHighscoreElement = document.getElementById('start-highscore-val');
  if (startHighscoreElement) startHighscoreElement.textContent = highScore.toFixed(1);

  loadSaveData();

  function pauseGame() {
    if (gameState !== 'playing' || isPaused) return;
    isPaused = true;
    pauseStartTime = Date.now();
  }

  function resumeGame() {
    if (gameState !== 'playing' || !isPaused) return;
    isPaused = false;
    startTime += Date.now() - pauseStartTime;
  }

  // Canvas Resize
  function resizeCanvas() {
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Physics & Game Settings
  const baseGravity = 0.55;
  const baseJumpPower = -10.5;
  let scrollSpeed = 5;

  // Game Objects
  const player = {
    x: 60,
    y: 0,
    width: 28,
    height: 34,
    vy: 0,
    jumpCount: 0,
    maxJumps: 2,
    onGround: false,
    state: 'RUNNING',
  };

  let blocks = [];
  let obstacles = [];
  let enemies = [];
  let coins = [];
  let clouds = [];
  let goalFlag = null;
  let nextBlockX = 0;
  let lastSpawnX = 0;
  let blockSpawnCount = 0;
  const blockWidth = 60;
  const blockHeight = 40;

  function drawRoundedRect(ctx, x, y, width, height) {
    const r = height / 2;
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + width - r, y + r, r, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  function checkCollision(r1, r2, insetX = 4, insetY = 3) {
    const box1 = {
      x: r1.x + insetX,
      y: r1.y + insetY,
      width: r1.width - insetX * 2,
      height: r1.height - insetY * 2,
    };
    const box2 = {
      x: r2.x + insetX,
      y: r2.y + insetY,
      width: r2.width - insetX * 2,
      height: r2.height - insetY * 2,
    };
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    );
  }

  function hasGroundAt(checkX, groundY) {
    return blocks.some(
      (b) => checkX >= b.x && checkX <= b.x + b.width && Math.abs(b.y - groundY) < 5
    );
  }

  // --- Main Game Loop ---
  function update() {
    if (gameState !== 'playing' || isPaused) return;

    animFrameCounter++;

    // アイテム効果の適用
    const isInfiniteJumpOwned = saveData.ownedItems.includes('infinite_jump');
    const isDoubleJumpOwned = saveData.ownedItems.includes('double_jump');
    const isDoubleCoinsActive = saveData.ownedItems.includes('double_coins');
    const isMagnetActive = saveData.ownedItems.includes('magnet_coin');
    const isHighJumpOwned = saveData.ownedItems.includes('high_jump');

    if (isInfiniteJumpOwned) {
      player.maxJumps = Infinity;
    } else if (isDoubleJumpOwned) {
      player.maxJumps = 2;
    } else {
      player.maxJumps = 1;
    }

    // 生存時間・走破距離の更新
    const now = Date.now();
    survivalTime = (now - startTime) / 1000;
    if (currentMode === 'endless') {
      if (timeElement) timeElement.textContent = survivalTime.toFixed(1);
    } else {
      // ステージモード: ゴールまでの残り距離を表示 (goalFlag がある場合)
      if (timeElement) {
        if (goalFlag) {
          const remaining = Math.max(0, Math.round(goalFlag.x - player.x));
          timeElement.textContent = remaining;
        } else {
          // まだゴールフラグが出ていない場合はゴールX - 現在スクロール量で推定
          const stageData = FIXED_STAGES[currentStageId];
          if (stageData) {
            const remaining = Math.max(0, Math.round(stageData.goalX - distanceTravelled / 0.12));
            timeElement.textContent = remaining;
          }
        }
      }
    }
    distanceTravelled += scrollSpeed * 0.12;

  scrollSpeed = isGoalSequence ? 0 : 5 + survivalTime / 10;

  if (isGoalSequence) {
    player.x += 4.5;
    player.state = 'RUNNING';
    if (player.x > canvas.width) {
      fadeAlpha += 0.04;
      if (fadeAlpha >= 1) {
        isGoalSequence = false;
        stageClear();
        return;
      }
    }
  }

  // --- プレイヤー物理演算 ---
  // ハイジャンプ（長押し）：上昇中 (vy < 0) かつ入力保持中に重力を軽減してより高く上昇
  if (isHighJumpOwned && isInputHolding && player.vy < 0) {
    player.vy += baseGravity * 0.55;
  } else {
    player.vy += baseGravity;
  }
  player.y += player.vy;

    if (player.onGround) {
      player.state = 'RUNNING';
    } else if (player.vy < 0) {
      player.state = 'JUMPING';
    } else {
      player.state = 'FALLING';
    }

    // --- スクロール処理 ---
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].x -= scrollSpeed;
    }
    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].x -= scrollSpeed;
    }
    lastSpawnX -= scrollSpeed;

    // ゴールフラッグのスクロール・判定 (画面の左端手前 100px に到着したらスクロール停止・走り抜け演出へ)
    if (goalFlag) {
      if (!isGoalSequence) {
        goalFlag.x -= scrollSpeed;
        if (goalFlag.x <= 100) {
          isGoalSequence = true;
          scrollSpeed = 0;
        }
      }
    }

    // --- コインの更新・マグネット・収集判定 ---
    for (let i = coins.length - 1; i >= 0; i--) {
      const c = coins[i];
      c.x -= scrollSpeed;

      // マグネット効果 (プレイヤーの近くにあるコインを引き寄せる)
      if (isMagnetActive) {
        const dx = player.x + player.width / 2 - c.x;
        const dy = player.y + player.height / 2 - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          c.x += (dx / dist) * 7;
          c.y += (dy / dist) * 7;
        }
      }

      // コイン収集判定
      if (checkCollision(player, { x: c.x - 10, y: c.y - 10, width: 20, height: 20 }, 0, 0)) {
        playSE('confirm');
        const coinVal = isDoubleCoinsActive ? 2 : 1;
        sessionCoins += coinVal;
        saveData.coins += coinVal;
        updateCoinsDisplay();
        saveSaveData();
        coins.splice(i, 1);
      }
    }

    // エネミーの更新
    const groundY = canvas.height - blockHeight;

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.x -= scrollSpeed;

      if (e.state === 'alive') {
        if (e.type === 'flying') {
          e.y = e.baseY + Math.sin((animFrameCounter + e.phase) * 0.08) * 20;
        } else if (e.type === 'ground') {
          e.x += e.patrolDir * 0.8;
          const checkAheadX = e.x + (e.patrolDir === -1 ? -5 : e.width + 5);

          const groundAhead = hasGroundAt(checkAheadX, groundY);
          if (!groundAhead) {
            e.patrolDir *= -1;
          } else {
            const obstacleAhead = obstacles.some(
              (obs) => Math.abs(obs.x - checkAheadX) < 15 && Math.abs(obs.y - e.y) < 20
            );
            if (obstacleAhead) {
              e.patrolDir *= -1;
            }
          }
        }
      } else if (e.state === 'defeated') {
        e.defeatTimer++;
        if (e.defeatTimer > 25) {
          enemies.splice(i, 1);
        }
      }
    }

    for (let i = 0; i < clouds.length; i++) {
      clouds[i].x -= scrollSpeed * 1.2;
      if (clouds[i].x + clouds[i].width < 0) {
        clouds[i].x = canvas.width + Math.random() * 100;
        clouds[i].y = Math.random() * (canvas.height / 3);
      }
    }

    // 地面当たり判定
    player.onGround = false;
    for (const block of blocks) {
      if (
        player.x < block.x + block.width &&
        player.x + player.width > block.x &&
        player.y < block.y + block.height &&
        player.y + player.height > block.y
      ) {
        // 着地判定
        if (player.vy >= 0 && player.y + player.height - player.vy <= block.y + 12) {
          player.y = block.y - player.height;
          player.vy = 0;
          player.jumpCount = 0;
          player.onGround = true;
        } else if (block.y < player.y + player.height - 8) {
          // 高低差のある壁障害物への衝突
          playSE('collision');
          gameOver();
          return;
        }
      }
    }

    // エネミー当たり判定 ＆ 踏みつけ
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (enemy.state === 'alive') {
        const isColliding = checkCollision(player, enemy, 3, 2);
        if (isColliding) {
          const playerBottom = player.y + player.height;
          const enemyTop = enemy.y + 14;

          if (player.vy > 0 && playerBottom - player.vy <= enemyTop + 8) {
            playSE('jump');
            enemy.state = 'defeated';
            enemy.defeatTimer = 0;

            player.vy = baseJumpPower * 0.85;
            player.jumpCount = 1;
            player.y = enemy.y - player.height;
          } else {
            playSE('collision');
            gameOver();
            return;
          }
        }
      }
    }

    // 障害物判定
    for (const obs of obstacles) {
      if (checkCollision(player, obs, 4, 3)) {
        playSE('collision');
        gameOver();
        return;
      }
    }

    // 落下判定
    if (player.y > canvas.height + 50) {
      playSE('collision');
      gameOver();
      return;
    }

    // オブジェクトの画面外削除 ＆ スポーン生成
    blocks = blocks.filter((b) => b.x + b.width > 0);
    obstacles = obstacles.filter((o) => o.x + o.width > 0);
    coins = coins.filter((c) => c.x > -20);

    nextBlockX -= scrollSpeed;

    // ステージモードでのゴール出現判定
    const targetDist = STAGE_CONFIG.find((s) => s.id === currentStageId)?.targetDistance || 450;
    if (currentMode === 'stage' && distanceTravelled >= targetDist && !goalFlag) {
      goalFlag = {
        x: canvas.width + 100,
        y: groundY - 70,
        width: 30,
        height: 70,
      };
    }

    // ステージモードは固定生成のため動的生成スキップ
    if (currentMode === 'stage') return;

    while (nextBlockX < canvas.width + blockWidth) {
      blockSpawnCount++;
      let isHole = false;

      if (minGroundBlocks > 0) {
        minGroundBlocks--;
        isHole = false;
      } else if (consecutiveHoles > 0) {
        if (consecutiveHoles >= 2) {
          isHole = false;
          consecutiveHoles = 0;
          minGroundBlocks = 3;
        } else {
          isHole = Math.random() < 0.35;
          if (isHole) consecutiveHoles++;
          else minGroundBlocks = 3;
        }
      } else if (blockSpawnCount > 10 && Math.random() < 0.12) {
        isHole = true;
        consecutiveHoles = 1;
      }

      if (!isHole) {
        blocks.push({
          x: nextBlockX,
          y: groundY,
          width: blockWidth,
          height: blockHeight,
        });

        // コインのランダム生成 (地面の上や空中)
        if (Math.random() < 0.38) {
          const coinY = groundY - 20 - (Math.random() < 0.4 ? 40 : 0);
          coins.push({
            x: nextBlockX + blockWidth / 2,
            y: coinY,
          });
        }

        const spawnDistance = nextBlockX - lastSpawnX;
        if (
          blockSpawnCount > 4 &&
          nextBlockX > canvas.width * 0.7 &&
          spawnDistance >= 220
        ) {
          const rand = Math.random();
          if (rand < 0.35) {
            enemies.push({
              type: 'ground',
              state: 'alive',
              x: nextBlockX + 10,
              y: groundY - 26,
              width: 28,
              height: 26,
              patrolDir: -1,
              patrolTimer: 0,
              defeatTimer: 0,
            });
            lastSpawnX = nextBlockX;
          } else if (rand < 0.65) {
            const flyY = groundY - 55 - Math.random() * 45;
            enemies.push({
              type: 'flying',
              state: 'alive',
              x: nextBlockX + 10,
              y: flyY,
              baseY: flyY,
              phase: Math.random() * 100,
              width: 28,
              height: 26,
              defeatTimer: 0,
            });
            lastSpawnX = nextBlockX;
          } else if (rand < 0.85) {
            obstacles.push({
              x: nextBlockX + blockWidth / 2 - 11,
              y: groundY - 18,
              width: 22,
              height: 18,
            });
            lastSpawnX = nextBlockX;
          }
        }
        nextBlockX += blockWidth;
      } else {
        const holeBlocks = Math.floor(Math.random() * 2) + 2;
        nextBlockX += blockWidth * holeBlocks;
        lastSpawnX = nextBlockX;
      }
    }
  }

  // --- 描画処理 ---

  // 1. 図形描画による回転コイン (黄金の円 + スライド回転アニメ)
  function drawCoins(ctx, coinsList) {
    for (const c of coinsList) {
      ctx.save();
      ctx.translate(c.x, c.y);

      // 横幅を Math.cos で伸縮させて立体回転を演出 (速度を落として滑らか化)
      const scaleX = Math.abs(Math.cos(animFrameCounter * 0.035 + c.x));
      ctx.scale(Math.max(0.15, scaleX), 1);

      // 外枠黄金リング
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 内側輝きリング
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // 中央のワンポイント模様
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-1.5, -3.5, 3, 7);

      ctx.restore();
    }
  }

  // 2. 図形描画によるゴールフラッグ (白黒チェック旗 ＋ 赤いポール)
  function drawGoalFlag(ctx, flag) {
    if (!flag) return;
    ctx.save();
    ctx.translate(flag.x, flag.y);

    // ポール (赤い棒)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, 0, 4, flag.height);

    // 旗 (白黒チェック模様)
    const flagW = 24;
    const flagH = 18;
    const cols = 4;
    const rows = 3;
    const cellW = flagW / cols;
    const cellH = flagH / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#ffffff' : '#000000';
        ctx.fillRect(4 + c * cellW, r * cellH, cellW, cellH);
      }
    }

    ctx.restore();
  }

  function drawPlayer(ctx, p) {
    ctx.save();
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);

    if (p.state === 'GAMEOVER') {
      ctx.rotate(-0.38);
    } else {
      ctx.rotate(0.18);
    }

    const armAngle = Math.sin(animFrameCounter * 0.35) * 0.5;
    const legAngle = Math.sin(animFrameCounter * 0.35) * 0.55;

    // ① 足元の影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, p.height / 2 + 1, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // ② 全身青スーツ (青 #2563eb)
    ctx.fillStyle = '#2563eb';
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    if (p.state === 'RUNNING') {
      ctx.beginPath();
      ctx.moveTo(-3, 4);
      ctx.lineTo(-3 - Math.sin(legAngle) * 8, p.height / 2 - 2);
      ctx.moveTo(3, 4);
      ctx.lineTo(3 + Math.sin(legAngle) * 8, p.height / 2 - 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-3, 4); ctx.lineTo(-6, p.height / 2 - 4);
      ctx.moveTo(3, 4);  ctx.lineTo(6, p.height / 2 - 4);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.roundRect(-7, -6, 14, 12, 4);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, -11, 7.5, 0, Math.PI * 2);
    ctx.fill();

    if (p.state === 'RUNNING') {
      const armX1 = -2 - Math.cos(armAngle) * 8;
      const armY1 = 4;
      ctx.beginPath();
      ctx.moveTo(-2, -3); ctx.lineTo(armX1, armY1);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(armX1 - 1, armY1 + 1, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (p.state === 'GAMEOVER') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(1, -13); ctx.lineTo(5, -9);
      ctx.moveTo(5, -13); ctx.lineTo(1, -9);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(1, -13, 7, 4, 1.5);
      ctx.fill();
    }

    ctx.strokeStyle = '#2563eb';
    if (p.state === 'RUNNING') {
      const armX2 = 2 + Math.cos(armAngle) * 8;
      const armY2 = 4;
      ctx.beginPath();
      ctx.moveTo(2, -3); ctx.lineTo(armX2, armY2);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(armX2 + 1, armY2 + 1, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(2, -3); ctx.lineTo(7, -7);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -8, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawEnemies(ctx, enemiesList) {
    for (const e of enemiesList) {
      ctx.save();
      ctx.translate(e.x + e.width / 2, e.y + e.height / 2);

      const dir = e.type === 'flying' ? -1 : (e.patrolDir || -1);

      if (e.type === 'ground') {
        const isDefeated = e.state === 'defeated';

        if (isDefeated) {
          ctx.scale(1.2, 0.45);
        }

        // Layer 1 [下レイヤー]: 赤い楕円の尻尾
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        const tailX = -dir * 12;
        ctx.ellipse(tailX, 2, 6, 3.5, tailDirAngle(dir), 0, Math.PI * 2);
        ctx.fill();

        // Layer 2 [メインボディ]
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.ellipse(0, -2, e.width / 2 - 2, e.height / 2 - 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // 三角耳
        ctx.beginPath();
        ctx.moveTo(-6, -8); ctx.lineTo(-10, -14); ctx.lineTo(-2, -9);
        ctx.moveTo(2, -8);  ctx.lineTo(10, -14);  ctx.lineTo(6, -9);
        ctx.fill();

        if (!isDefeated) {
          ctx.strokeStyle = '#8b5cf6';
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          const legStep = Math.sin(animFrameCounter * 0.35) * 5;
          ctx.beginPath();
          ctx.moveTo(-5, 6); ctx.lineTo(-5 - legStep, 13);
          ctx.moveTo(5, 6);  ctx.lineTo(5 + legStep, 13);
          ctx.stroke();
        }

        // Layer 3 [顔パーツ]
        const faceOffsetX = dir * 3;

        if (isDefeated) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-7 + faceOffsetX, -4); ctx.lineTo(-3 + faceOffsetX, 0);
          ctx.moveTo(-3 + faceOffsetX, -4); ctx.lineTo(-7 + faceOffsetX, 0);
          ctx.moveTo(3 + faceOffsetX, -4);  ctx.lineTo(7 + faceOffsetX, 0);
          ctx.moveTo(7 + faceOffsetX, -4);  ctx.lineTo(3 + faceOffsetX, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-4 + faceOffsetX, 4); ctx.lineTo(4 + faceOffsetX, 4);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-6 + faceOffsetX, -5, 3.5, 4);
          ctx.fillRect(3 + faceOffsetX, -5, 3.5, 4);

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-4 + faceOffsetX, 2);
          ctx.lineTo(4 + faceOffsetX, 2);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          const fangX = faceOffsetX - dir * 3;
          ctx.fillRect(fangX, 3, 1.5, 2);
        }

      } else if (e.type === 'flying') {
        const isDefeated = e.state === 'defeated';

        if (isDefeated) {
          ctx.rotate(-0.45);
          if (Math.floor(e.defeatTimer / 3) % 2 === 0) {
            ctx.globalAlpha = 0.35;
          }
        }

        // Layer 1 [下レイヤー]: 紫のコウモリ型三角形の羽
        const wingFlap = isDefeated ? 0 : Math.sin(animFrameCounter * 0.4) * 6;
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.moveTo(-4, -2);
        ctx.lineTo(-15, -9 + wingFlap);
        ctx.lineTo(-10, 2);
        ctx.lineTo(-4, 4);
        ctx.moveTo(4, -2);
        ctx.lineTo(15, -9 + wingFlap);
        ctx.lineTo(10, 2);
        ctx.lineTo(4, 4);
        ctx.fill();

        // Layer 1 [下レイヤー]: 赤い尻尾
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const tailX = -dir * 6;
        ctx.moveTo(0, 5);
        ctx.lineTo(tailX, 12);
        ctx.lineTo(tailX + (-dir * 4), 10);
        ctx.stroke();

        // Layer 2 [メインボディ]
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(0, 0, e.width / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // Layer 3 [前レイヤー]: 白い角
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-5, -7); ctx.lineTo(-8, -14); ctx.lineTo(-2, -9);
        ctx.moveTo(5, -7);  ctx.lineTo(8, -14);  ctx.lineTo(2, -9);
        ctx.fill();

        // Layer 4 [顔パーツ]
        const faceOffsetX = dir * 3;

        if (isDefeated) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-6 + faceOffsetX, -3); ctx.lineTo(-2 + faceOffsetX, 1);
          ctx.moveTo(-2 + faceOffsetX, -3); ctx.lineTo(-6 + faceOffsetX, 1);
          ctx.moveTo(2 + faceOffsetX, -3);  ctx.lineTo(6 + faceOffsetX, 1);
          ctx.moveTo(6 + faceOffsetX, -3);  ctx.lineTo(2 + faceOffsetX, 1);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-4 + faceOffsetX, 4); ctx.lineTo(4 + faceOffsetX, 4);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-6 + faceOffsetX, -4, 3.5, 4);
          ctx.fillRect(3 + faceOffsetX, -4, 3.5, 4);

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-4 + faceOffsetX, 2);
          ctx.lineTo(4 + faceOffsetX, 2);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          const fangX = faceOffsetX - dir * 3;
          ctx.fillRect(fangX, 3, 1.5, 2);
        }
      }

      ctx.restore();
    }
  }

  function tailDirAngle(dir) {
    return dir > 0 ? -0.2 : 0.2;
  }

  function drawObstacles(ctx, obsList) {
    for (const obs of obsList) {
      ctx.save();
      ctx.translate(obs.x, obs.y);

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(obs.width / 2, 0);
      ctx.lineTo(obs.width, obs.height);
      ctx.lineTo(0, obs.height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(3, obs.height - 4, obs.width - 6, 2.5);

      ctx.restore();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (const c of clouds) {
      drawRoundedRect(ctx, c.x, c.y, c.width, c.height);
      drawRoundedRect(ctx, c.x + c.width * 0.1, c.y - c.height * 0.4, c.width * 0.8, c.height * 0.8);
    }

    // 2. Draw Blocks (Ground)
    for (const block of blocks) {
      const gGrad = ctx.createLinearGradient(0, block.y, 0, block.y + block.height);
      gGrad.addColorStop(0, '#10b981');
      gGrad.addColorStop(1, '#047857');
      ctx.fillStyle = gGrad;
      ctx.fillRect(block.x, block.y, block.width, block.height);
      ctx.fillStyle = '#6ee7b7';
      ctx.fillRect(block.x, block.y, block.width, 3);
    }

    // 3. Draw Coins
    drawCoins(ctx, coins);

    // 4. Draw Goal Flag (Stage mode)
    drawGoalFlag(ctx, goalFlag);

    // 5. Draw Obstacles
    drawObstacles(ctx, obstacles);

    // 6. Draw Enemies
    drawEnemies(ctx, enemies);

    // 7. Draw Player
    drawPlayer(ctx, player);

    // 8. Draw Fade Out overlay
    if (fadeAlpha > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, fadeAlpha)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  function handleInputStart(e) {
    if (isGoalSequence) return; // ゴール演出中は操作不可

    if (e && e.target) {
      const target = e.target;
      const tagName = target.tagName ? target.tagName.toLowerCase() : '';
      if (
        tagName === 'button' ||
        tagName === 'input' ||
        tagName === 'select' ||
        tagName === 'label' ||
        target.closest('.config-modal') ||
        target.closest('.modal-overlay') ||
        target.closest('#config-modal') ||
        target.closest('#retire-modal') ||
        target.closest('#howto-modal') ||
        target.classList.contains('icon-config')
      ) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    }

    isInputHolding = true;

    if (gameState === 'playing' && !isPaused) {
      const isInfiniteJumpOwned = saveData.ownedItems.includes('infinite_jump');
      const isDoubleJumpOwned = saveData.ownedItems.includes('double_jump');
      const maxJumps = isInfiniteJumpOwned ? Infinity : (isDoubleJumpOwned ? 2 : 1);

      if (player.jumpCount < maxJumps) {
        playSE('jump');
        player.vy = baseJumpPower;
        player.jumpCount++;
      }
    }
  }

  function handleInputEnd() {
    isInputHolding = false;
  }

  wrapper.addEventListener('mousedown', handleInputStart);
  wrapper.addEventListener('touchstart', handleInputStart, { passive: false });
  window.addEventListener('mouseup', handleInputEnd);
  window.addEventListener('touchend', handleInputEnd);
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      if (!isInputHolding) {
        handleInputStart(e);
      }
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      handleInputEnd();
    }
  });

  // 固定ステージのマップ初期化
  function initStageMap(stageId) {
    const data = FIXED_STAGES[stageId] || FIXED_STAGES[1];
    const groundY = canvas.height - blockHeight;

    blocks = [];
    obstacles = [];
    enemies = [];
    coins = [];

    // 地面ブロックの配置 (ゴール到達後の走り抜け用に画面外右側まで多めに配置 + ゴール手前150px以降は穴無し)
    const maxWorldX = data.goalX + 2500;
    for (let x = 0; x < maxWorldX; x += blockWidth) {
      const isHole = x < (data.goalX - 150) && data.holes.some((hX) => Math.abs(x - hX) < blockWidth * 0.8);
      if (!isHole) {
        blocks.push({ x: x, y: groundY, width: blockWidth, height: blockHeight });
      }
    }

    // 障害物
    data.obstacles.forEach((oX) => {
      obstacles.push({ x: oX, y: groundY - 18, width: 22, height: 18 });
    });

    // エネミー
    data.enemies.forEach((e) => {
      if (e.type === 'ground') {
        enemies.push({
          type: 'ground',
          state: 'alive',
          x: e.x,
          y: groundY - 26,
          width: 28,
          height: 26,
          patrolDir: -1,
          patrolTimer: 0,
          defeatTimer: 0,
        });
      } else if (e.type === 'flying') {
        enemies.push({
          type: 'flying',
          state: 'alive',
          x: e.x,
          y: groundY + (e.y || -65),
          baseY: groundY + (e.y || -65),
          phase: Math.random() * 100,
          width: 28,
          height: 26,
          defeatTimer: 0,
        });
      }
    });

    // コイン
    data.coins.forEach((cX) => {
      coins.push({ x: cX, y: groundY - 25 });
    });

    // ゴールフラッグ
    goalFlag = {
      x: data.goalX,
      y: groundY - 70,
      width: 30,
      height: 70,
    };
  }

  function startGame(mode = 'endless', stageId = 1) {
    currentMode = mode;
    currentStageId = stageId;
    isGoalSequence = false;
    fadeAlpha = 0;
    playBGM('run');

    if (gameHud) gameHud.style.display = 'flex';
    const bottomHud = document.getElementById('bottom-hud');
    if (bottomHud) bottomHud.style.display = 'block';

    const modeLabel = document.getElementById('hud-mode-label');
    const unitLabel = document.getElementById('hud-unit-label');
    if (mode === 'endless') {
      if (modeLabel) modeLabel.textContent = '記録';
      if (unitLabel) unitLabel.textContent = '秒';
      const subLabel = document.getElementById('hud-sub-label');
      if (subLabel) subLabel.textContent = '';
    } else {
      // ステージモード: 「ステージ N」の横にゴールまでの距離を表示
      if (modeLabel) modeLabel.textContent = `ステージ ${stageId}`;
      if (unitLabel) unitLabel.textContent = '';
      const subLabel = document.getElementById('hud-sub-label');
      if (subLabel) subLabel.textContent = '\u30b4\u30fc\u30eb\u307e\u3067: ';
      // ゴール距離はゲームループで毎フレーム更新する
    };

    // HUDの要素表示制御 (エンドレス: ベスト表示, ステージ: 所持コイン表示)
    const hudHighscoreWrap = document.getElementById('hud-highscore-wrap');
    const hudCoinsWrap = document.getElementById('hud-coins-wrap');
    if (mode === 'endless') {
      if (hudHighscoreWrap) hudHighscoreWrap.style.display = 'flex';
      if (hudCoinsWrap) hudCoinsWrap.style.display = 'none';
    } else {
      if (hudHighscoreWrap) hudHighscoreWrap.style.display = 'none';
      if (hudCoinsWrap) hudCoinsWrap.style.display = 'block';
    }

    gameState = 'playing';
    isPaused = false;
    hideScreen(startScreen);
    hideScreen(stageModeScreen);
    hideScreen(shopScreen);
    hideScreen(resultScreen);

    startTime = Date.now();
    survivalTime = 0;
    distanceTravelled = 0;
    sessionCoins = 0;
    goalFlag = null;

    if (timeElement) timeElement.textContent = '0.0';
    updateCoinsDisplay();

    scrollSpeed = 5;
    animFrameCounter = 0;
    blockSpawnCount = 0;
    lastSpawnX = 0;
    consecutiveHoles = 0;
    minGroundBlocks = 0;

    // Reset Player
    player.x = 60;
    player.y = canvas.height - blockHeight - player.height;
    player.vy = 0;
    player.jumpCount = 0;
    player.state = 'RUNNING';

    // Reset World
    blocks = [];
    obstacles = [];
    enemies = [];
    coins = [];

    clouds = [];
    for (let i = 0; i < 4; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 3),
        width: 80 + Math.random() * 60,
        height: 25 + Math.random() * 10,
      });
    }

    if (mode === 'stage') {
      initStageMap(stageId);
    } else {
      nextBlockX = 0;
      for (let x = 0; x < canvas.width + blockWidth; x += blockWidth) {
        blocks.push({
          x: nextBlockX,
          y: canvas.height - blockHeight,
          width: blockWidth,
          height: blockHeight,
        });
        nextBlockX += blockWidth;
      }
    }
  }

  function stageClear() {
    gameState = 'stageclear';
    stopBGM();
    playSE('stage_clear');

    if (gameHud) gameHud.style.display = 'none';
    const bottomHud = document.getElementById('bottom-hud');
    if (bottomHud) bottomHud.style.display = 'none';

    // 次のステージ解放
    if (currentStageId < 3 && saveData.unlockedStages <= currentStageId) {
      saveData.unlockedStages = currentStageId + 1;
      saveSaveData();
    }

    const resTitle = document.getElementById('result-title');
    const resCoins = document.getElementById('result-coins-earned');
    const resultScoreRow = document.getElementById('result-score-row');
    const stageSelectBtn = document.getElementById('stage-select-btn');

    if (resTitle) { resTitle.style.display = ''; resTitle.textContent = `ステージ${currentStageId} クリア！`; }
    if (resultScoreRow) resultScoreRow.style.display = 'none'; // ステージモードでは記録行を非表示
    if (resCoins) resCoins.textContent = sessionCoins;

    if (stageSelectBtn) stageSelectBtn.style.display = 'block';
    if (shareBtn) shareBtn.style.display = 'none';

    showScreen(resultScreen);
  }

  function gameOver() {
    if (isGoalSequence) return; // ゴール演出中はゲームオーバーにならない
    stopBGM();
    if (gameHud) gameHud.style.display = 'none';
    gameState = 'gameover';
    player.state = 'GAMEOVER';
    const bottomHud = document.getElementById('bottom-hud');
    if (bottomHud) bottomHud.style.display = 'none';

    const resTitle = document.getElementById('result-title');
    const resLabel = document.getElementById('result-label');
    const resUnit = document.getElementById('result-unit');
    const resCoins = document.getElementById('result-coins-earned');
    const resultScoreRow = document.getElementById('result-score-row');
    const stageSelectBtn = document.getElementById('stage-select-btn');

    if (currentMode === 'endless') {
      // エンドレスモード: タイトル行は非表示、記録行を先頭に表示
      if (resTitle) resTitle.style.display = 'none';
      if (resultScoreRow) resultScoreRow.style.display = 'block';
      if (resLabel) resLabel.textContent = '到達記録';
      if (resUnit) resUnit.textContent = '秒';
      if (finalTimeElement) finalTimeElement.textContent = survivalTime.toFixed(1);
    } else {
      // ステージモード: タイトル行に「ゲームオーバー」、記録行を非表示
      if (resTitle) { resTitle.style.display = ''; resTitle.textContent = 'ゲームオーバー'; }
      if (resultScoreRow) resultScoreRow.style.display = 'none';
    }
    if (resCoins) resCoins.textContent = sessionCoins;

    if (stageSelectBtn) stageSelectBtn.style.display = currentMode === 'stage' ? 'block' : 'none';
    if (shareBtn) shareBtn.style.display = currentMode === 'endless' ? 'block' : 'none';

    showScreen(resultScreen);

    if (currentMode === 'endless' && survivalTime > highScore) {
      highScore = survivalTime;
      localStorage.setItem('runaction_highscore', highScore.toString());
      if (highscoreElement) highscoreElement.textContent = highScore.toFixed(1);
    }

    if (shareBtn) {
      const shareText = `記録 ${survivalTime.toFixed(1)} 秒！(獲得コイン: ${sessionCoins}) #MyPortfolioAction`;
      const shareUrl = window.location.href;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      shareBtn.onclick = (e) => {
        e.stopPropagation();
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      };
    }
  }

  let currentRunAchieveTab = 'all';

  function openRunAchieveDetail(item) {
    const modal = document.getElementById('achieve-detail-modal');
    const badge = document.getElementById('achieve-detail-badge');
    const title = document.getElementById('achieve-detail-title');
    const cond = document.getElementById('achieve-detail-cond');
    const desc = document.getElementById('achieve-detail-desc');
    if (!modal) return;

    const unlocked = item.isUnlocked(saveData, highScore);

    if (badge) {
      badge.textContent = unlocked ? '達成済み' : '未達成';
      badge.className = `achieve-detail-badge ${unlocked ? 'unlocked' : 'locked'}`;
    }
    if (title) title.textContent = unlocked ? item.title : '？？？';
    if (cond) cond.textContent = item.cond;
    if (desc) desc.textContent = unlocked ? item.desc : '？？？（実績を達成すると解放されます）';

    playSE('confirm');
    modal.style.display = 'flex';
  }

  function renderRunAchievements() {
    const cardGrid = document.getElementById('achievements-card-grid');
    const summaryBox = document.getElementById('achievements-summary-box');
    if (!cardGrid) return;

    const totalCount = RUN_ACHIEVEMENTS.length;
    const unlockedCount = RUN_ACHIEVEMENTS.filter(a => a.isUnlocked(saveData, highScore)).length;

    if (summaryBox) {
      summaryBox.innerHTML = `達成度: <strong>${unlockedCount} / ${totalCount}</strong> (${Math.round((unlockedCount / totalCount) * 100)}%) | 最高記録: <strong>${highScore > 0 ? highScore.toFixed(1) + '秒' : '未記録'}</strong>`;
    }

    const filtered = RUN_ACHIEVEMENTS.filter(a => currentRunAchieveTab === 'all' || a.cat === currentRunAchieveTab);

    cardGrid.innerHTML = filtered.map(a => {
      const unlocked = a.isUnlocked(saveData, highScore);
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
        const targetItem = RUN_ACHIEVEMENTS.find(item => item.id === id);
        if (targetItem) openRunAchieveDetail(targetItem);
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
      playSE('confirm');
      renderRunAchievements();
      if (achievementsScreen) achievementsScreen.style.display = 'flex';
    });
  }

  document.querySelectorAll('#run-achieve-tab-bar .achieve-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', (e) => {
      playSE('confirm');
      document.querySelectorAll('#run-achieve-tab-bar .achieve-tab').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentRunAchieveTab = e.currentTarget.dataset.tab;
      renderRunAchievements();
    });
  });

  if (btnAchieveDetailClose) {
    btnAchieveDetailClose.addEventListener('click', () => {
      playSE('cancel');
      const modal = document.getElementById('achieve-detail-modal');
      if (modal) modal.style.display = 'none';
    });
  }

  function closeAchievementsScreen() {
    playSE('cancel');
    if (achievementsScreen) achievementsScreen.style.display = 'none';
  }

  if (btnCloseAchievements) btnCloseAchievements.addEventListener('click', closeAchievementsScreen);
  if (btnBackAchievements) btnBackAchievements.addEventListener('click', closeAchievementsScreen);

  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      playSE('confirm');
      if (dataResetModal) dataResetModal.style.display = 'flex';
    });
  }

  if (btnCancelReset) {
    btnCancelReset.addEventListener('click', () => {
      playSE('cancel');
      if (dataResetModal) dataResetModal.style.display = 'none';
    });
  }

  if (btnConfirmReset) {
    btnConfirmReset.addEventListener('click', () => {
      playSE('confirm');
      localStorage.removeItem('runaction_save_v2');
      localStorage.removeItem('runaction_highscore');
      location.reload();
    });
  }

  const STAGE_NAMES = {
    1: 'ステージ1 (初級)',
    2: 'ステージ2 (中級)',
    3: 'ステージ3 (上級)',
  };

  // --- ステージモード画面のレンダリング ---
  function renderStageModeScreen() {
    if (!stageListEl) return;
    stageListEl.innerHTML = '';
    updateCoinsDisplay();
    playBGM('field');
    hideScreen(startScreen);
    hideScreen(shopScreen);
    showScreen(stageModeScreen);

    STAGE_CONFIG.forEach((stage) => {
      const isUnlocked = stage.id <= saveData.unlockedStages;
      const isCleared = stage.id < saveData.unlockedStages;
      const btn = document.createElement('button');
      btn.className = `btn-stage-td ${isCleared ? 'stage-cleared' : ''}`;
      if (!isUnlocked) btn.disabled = true;

      // 文字バッジは付けず、名称のみ表示
      btn.textContent = STAGE_NAMES[stage.id] || stage.name;

      if (isUnlocked) {
        btn.onclick = (e) => {
          e.stopPropagation();
          playSE('confirm');
          if (stageModeScreen) stageModeScreen.style.display = 'none';
          startGame('stage', stage.id);
        };
      }
      stageListEl.appendChild(btn);
    });
  }

  // --- ショップ画面のレンダリング ---
  function renderShopScreen() {
    if (!shopItemsGridEl) return;
    shopItemsGridEl.innerHTML = '';
    updateCoinsDisplay();
    hideScreen(stageModeScreen);
    showScreen(shopScreen);

    ITEM_DB.forEach((item) => {
      const isOwned = saveData.ownedItems.includes(item.id);
      const isUnlocked = saveData.unlockedStages >= item.unlockStage;

      const row = document.createElement('div');
      row.className = 'shop-item-row';
      const imgSrc = item.img.src || item.img;

      let actionHtml = '';
      if (isOwned) {
        actionHtml = `<button class="btn btn-secondary btn-buy" disabled>購入済み</button>`;
      } else if (!isUnlocked) {
        actionHtml = `<button class="btn btn-secondary btn-buy item-unreleased" disabled>未入荷</button>`;
      } else {
        const canBuy = saveData.coins >= item.price;
        actionHtml = `<button class="btn btn-primary btn-buy" ${canBuy ? '' : 'disabled'}>購入 (${item.price} G)</button>`;
      }

      row.innerHTML = `
        <div class="shop-item-icon-box">
          <img src="${imgSrc}" alt="${item.name}" class="shop-item-img" />
        </div>
        <div class="shop-item-info">
          <div class="shop-item-name">${item.name}</div>
          <div class="shop-item-desc">${item.desc}</div>
        </div>
        <div class="shop-item-actions">
          ${actionHtml}
        </div>
      `;

      const buyBtn = row.querySelector('.btn-buy');
      if (buyBtn && !isOwned && isUnlocked) {
        buyBtn.onclick = (e) => {
          e.stopPropagation();
          if (saveData.coins >= item.price) {
            playSE('confirm');
            saveData.coins -= item.price;
            saveData.ownedItems.push(item.id);
            saveSaveData();
            renderShopScreen();
          }
        };
      }

      shopItemsGridEl.appendChild(row);
    });
  }

  const stageSelectBtn = document.getElementById('stage-select-btn');
  if (stageSelectBtn) {
    stageSelectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cancel');
      hideScreen(resultScreen);
      renderStageModeScreen();
    });
  }

  // --- UI イベントリスナーの接続 ---
  if (startBtn)
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('confirm');
      startGame('endless', 1);
    });

  if (stageBtn)
    stageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      renderStageModeScreen();
    });

  if (stageBackBtn) {
    stageBackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cancel');
      stopBGM();
      hideScreen(stageModeScreen);
      showScreen(startScreen);
    });
    stageBackBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    stageBackBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }

  if (shopBtn)
    shopBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      renderShopScreen();
    });

  if (shopBackBtn) {
    shopBackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cancel');
      hideScreen(shopScreen);
      renderStageModeScreen();
    });
    shopBackBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    shopBackBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }
    
  if (closeItemSettingBtn)
    closeItemSettingBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cancel');
      if (itemSettingModal) itemSettingModal.classList.remove('active');
      if (modalOverlay) modalOverlay.classList.remove('active');
      if (
        gameState === 'playing' &&
        isPaused &&
        !document.getElementById('config-modal')?.classList.contains('active') &&
        !document.getElementById('credits-modal')?.classList.contains('active') &&
        !document.getElementById('retire-modal')?.classList.contains('active')
      ) {
        resumeGame();
      }
    });

  if (retryBtn)
    retryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('confirm');
      startGame(currentMode, currentStageId);
    });

  if (titleBtn) {
    titleBtn.addEventListener('click', () => {
      playSE('cancel');
      stopBGM();
      hideScreen(resultScreen);
      hideScreen(stageModeScreen);
      hideScreen(shopScreen);
      showScreen(startScreen);
      if (gameHud) gameHud.style.display = 'none';
      const bottomHud = document.getElementById('bottom-hud');
      if (bottomHud) bottomHud.style.display = 'none';
      updateCoinsDisplay();
    });
  }

  if (howtoBtn)
    howtoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      if (howtoModal) howtoModal.classList.add('active');
      if (modalOverlay) modalOverlay.classList.add('active');
    });

  if (closeHowtoBtn)
    closeHowtoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      if (howtoModal) howtoModal.classList.remove('active');
      if (modalOverlay) modalOverlay.classList.remove('active');
      if (
        gameState === 'playing' &&
        isPaused &&
        !document.getElementById('config-modal')?.classList.contains('active') &&
        !document.getElementById('credits-modal')?.classList.contains('active') &&
        !document.getElementById('retire-modal')?.classList.contains('active')
      ) {
        resumeGame();
      }
    });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => {
      if (howtoModal) howtoModal.classList.remove('active');
      if (configModal) configModal.classList.remove('active');
      if (itemSettingModal) itemSettingModal.classList.remove('active');
      const credM = document.getElementById('credits-modal');
      if (credM) credM.classList.remove('active');
      const retM = document.getElementById('retire-modal');
      if (retM) retM.classList.remove('active');
      modalOverlay.classList.remove('active');

      if (gameState === 'playing' && isPaused) {
        resumeGame();
      }
    });
  }

  const _cfgBtn1 = document.getElementById('config-btn');
  const _cfgBtn2 = document.getElementById('hud-config-btn');
  const _cfgBtn3 = document.getElementById('stage-config-btn');
  const _cfgBtn4 = document.getElementById('shop-config-btn');
  const openConfig = (e) => {
    e.stopPropagation();
    playSE('cursor');
    if (gameState === 'playing' && !isPaused) pauseGame();
    if (configModal) configModal.classList.add('active');
    if (modalOverlay) modalOverlay.classList.add('active');
  };

  [_cfgBtn1, _cfgBtn2, _cfgBtn3, _cfgBtn4].forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', openConfig);
      btn.addEventListener('mousedown', (e) => e.stopPropagation());
      btn.addEventListener('touchstart', (e) => e.stopPropagation());
    }
  });

  if (closeConfigBtn) {
    closeConfigBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      if (configModal) configModal.classList.remove('active');
      if (modalOverlay) modalOverlay.classList.remove('active');
      if (
        gameState === 'playing' &&
        isPaused &&
        !document.getElementById('credits-modal')?.classList.contains('active') &&
        !document.getElementById('retire-modal')?.classList.contains('active')
      ) {
        resumeGame();
      }
    });
    closeConfigBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    closeConfigBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }

  // Retire logic
  const _retireBtn = document.getElementById('retire-btn');
  if (_retireBtn) {
    _retireBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      if (gameState === 'playing' && !isPaused) pauseGame();
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
      if (gameState === 'playing' && isPaused) {
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
      startGame(currentMode, currentStageId);
    });
  }

  const _retireTitleBtn = document.getElementById('retire-title-btn');
  if (_retireTitleBtn) {
    _retireTitleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cancel');
      stopBGM();
      document.getElementById('retire-modal')?.classList.remove('active');
      document.getElementById('modal-overlay')?.classList.remove('active');
      gameState = 'start';
      isPaused = false;
      hideScreen(resultScreen);
      hideScreen(stageModeScreen);
      hideScreen(shopScreen);
      showScreen(startScreen);
      if (gameHud) gameHud.style.display = 'none';
      const bottomHud = document.getElementById('bottom-hud');
      if (bottomHud) bottomHud.style.display = 'none';
      updateCoinsDisplay();
    });
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

  const _closeCredBtn = document.getElementById('close-credits-btn-x');
  if (_closeCredBtn) {
    _closeCredBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      document.getElementById('credits-modal')?.classList.remove('active');
      document.getElementById('modal-overlay')?.classList.remove('active');
      if (
        gameState === 'playing' &&
        isPaused &&
        !document.getElementById('config-modal')?.classList.contains('active') &&
        !document.getElementById('retire-modal')?.classList.contains('active')
      ) {
        resumeGame();
      }
    });
    _closeCredBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    _closeCredBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }

  const _howtoInConfigBtn = document.getElementById('howto-btn-in-config');
  if (_howtoInConfigBtn) {
    _howtoInConfigBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      document.getElementById('config-modal')?.classList.remove('active');
      document.getElementById('howto-modal')?.classList.add('active');
      document.getElementById('modal-overlay')?.classList.add('active');
    });
    _howtoInConfigBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    _howtoInConfigBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn, .icon-config');
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
      if (currentBgmAudio) {
        currentBgmAudio.volume = configBgmVolume;
      }
    });
  }

  function initWorld() {
    resizeCanvas();
    const groundY = canvas.height - blockHeight;
    player.y = groundY - player.height;
    player.state = 'RUNNING';

    blocks = [];
    for (let x = 0; x < canvas.width + blockWidth * 2; x += blockWidth) {
      blocks.push({
        x: x,
        y: groundY,
        width: blockWidth,
        height: blockHeight,
      });
    }

    clouds = [];
    for (let i = 0; i < 4; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 3),
        width: 80 + Math.random() * 60,
        height: 25 + Math.random() * 10,
      });
    }
  }

  initWorld();
  // Start Loop
  loop();
})();
