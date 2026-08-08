import seJump from '../../assets/games/run-action/audio/se/パパッ.mp3';
import seCollision from '../../assets/games/run-action/audio/se/ニュッ2.mp3';
import seCursor from '../../assets/games/run-action/audio/se/カーソル移動7.mp3';
import seConfirm from '../../assets/games/run-action/audio/se/決定ボタンを押す2.mp3';
import seCancel from '../../assets/games/run-action/audio/se/キャンセル1.mp3';

(function () {
  let configBgmVolume = 0.5;
  let configSeVolume = 0.5;

  const SE_DB = {
    jump: seJump,
    collision: seCollision,
    cursor: seCursor,
    confirm: seConfirm,
    cancel: seCancel,
  };

  function playSE(seId) {
    if (!SE_DB[seId]) return;
    const se = new Audio(SE_DB[seId]);
    se.volume = configSeVolume;
    se.play().catch((e) => console.log('SE play failed:', e));
  }

  window.playSE = playSE;
  window.setSEVolume = function (vol) {
    configSeVolume = vol;
  };
  window.setBGMVolume = function (vol) {
    configBgmVolume = vol;
  };

  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const wrapper = document.getElementById('game-container');

  // UI Elements
  const startScreen = document.getElementById('start-screen');
  const resultScreen = document.getElementById('result-screen');
  const timeElement = document.getElementById('survival-time');
  const highscoreElement = document.getElementById('highscore');
  const finalTimeElement = document.getElementById('final-time');
  const gameHud = document.getElementById('game-hud');
  const startBtn = document.getElementById('start-btn');
  const retryBtn = document.getElementById('retry-btn');
  const titleBtn = document.getElementById('title-btn');
  const shareBtn = document.getElementById('share-btn');
  const howtoBtn = document.getElementById('howto-btn');
  const closeHowtoBtn = document.getElementById('close-howto-btn-x');
  const howtoModal = document.getElementById('howto-modal');
  const closeConfigBtn = document.getElementById('close-config-btn-x');
  const configModal = document.getElementById('config-modal');
  const modalOverlay = document.getElementById('modal-overlay');

  // State
  let gameState = 'start'; // start, playing, gameover
  let startTime = 0;
  let survivalTime = 0;
  let isPaused = false;
  let pauseStartTime = 0;
  let animFrameCounter = 0;
  let highScore = parseFloat(localStorage.getItem('runaction_highscore')) || 0;
  if (highscoreElement) highscoreElement.textContent = highScore.toFixed(1);
  const startHighscoreElement = document.getElementById('start-highscore-val');
  if (startHighscoreElement) startHighscoreElement.textContent = highScore.toFixed(1);

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

  // Canvas Resize (レスポンシブ対応)
  function resizeCanvas() {
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Physics & Game Settings
  const gravity = 0.55;
  const jumpPower = -10.5;
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
    state: 'RUNNING', // RUNNING, JUMPING, FALLING, GAMEOVER
  };

  let blocks = [];
  let obstacles = [];
  let enemies = [];
  let clouds = [];
  let nextBlockX = 0;
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

  // 判定緩和付き当たり判定 (AABB with Inset Margin)
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

  // Main Game Loop
  function update() {
    if (gameState !== 'playing' || isPaused) return;

    animFrameCounter++;

    // Update survival time
    const now = Date.now();
    survivalTime = (now - startTime) / 1000;
    if (timeElement) timeElement.textContent = survivalTime.toFixed(1);

    // スピードアップ
    scrollSpeed = 5 + survivalTime / 10;

    // --- プレイヤーの物理演算 ---
    player.vy += gravity;
    player.y += player.vy;

    // アニメーション状態の判定
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

    // エネミーの更新
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.x -= scrollSpeed;

      if (e.state === 'alive') {
        if (e.type === 'flying') {
          e.y = e.baseY + Math.sin((animFrameCounter + e.phase) * 0.08) * 20;
        } else if (e.type === 'ground') {
          e.x += e.patrolDir * 0.8;
          e.patrolTimer++;
          if (e.patrolTimer > 45) {
            e.patrolDir *= -1;
            e.patrolTimer = 0;
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

    // --- 当たり判定（地面） ---
    player.onGround = false;
    for (const block of blocks) {
      if (
        player.x < block.x + block.width &&
        player.x + player.width > block.x &&
        player.y < block.y + block.height &&
        player.y + player.height > block.y
      ) {
        if (player.vy > 0 && player.y + player.height - player.vy <= block.y + 10) {
          player.y = block.y - player.height;
          player.vy = 0;
          player.jumpCount = 0;
          player.onGround = true;
        } else if (player.x + player.width - scrollSpeed <= block.x + 5) {
          playSE('collision');
          gameOver();
          return;
        }
      }
    }

    // --- 当たり判定（エネミー ＆ 踏みつけ判定） ---
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (enemy.state === 'alive') {
        const isColliding = checkCollision(player, enemy, 3, 2);
        if (isColliding) {
          const playerBottom = player.y + player.height;
          const enemyTop = enemy.y + 14;

          if (player.vy > 0 && playerBottom - player.vy <= enemyTop + 8) {
            // 👉 踏みつけ成功！ (Stomp Success)
            playSE('jump');
            enemy.state = 'defeated';
            enemy.defeatTimer = 0;

            player.vy = jumpPower * 0.85;
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

    // --- 当たり判定（固定障害物） ---
    for (const obs of obstacles) {
      if (checkCollision(player, obs, 4, 3)) {
        playSE('collision');
        gameOver();
        return;
      }
    }

    // --- 落下判定 ---
    if (player.y > canvas.height + 50) {
      playSE('collision');
      gameOver();
      return;
    }

    // --- オブジェクトの画面外削除 ＆ 敵・障害物の生成 ---
    blocks = blocks.filter((b) => b.x + b.width > 0);
    obstacles = obstacles.filter((o) => o.x + o.width > 0);

    nextBlockX -= scrollSpeed;

    while (nextBlockX < canvas.width + blockWidth) {
      blockSpawnCount++;
      const isHole = blockSpawnCount > 5 && Math.random() < 0.12;
      const groundY = canvas.height - blockHeight;

      if (!isHole) {
        blocks.push({
          x: nextBlockX,
          y: groundY,
          width: blockWidth,
          height: blockHeight,
        });

        if (blockSpawnCount > 3 && nextBlockX > canvas.width * 0.6) {
          const rand = Math.random();
          if (rand < 0.28) {
            // 1. 陸上パトロールエネミー
            enemies.push({
              type: 'ground',
              state: 'alive',
              x: nextBlockX + 10,
              y: groundY - 26,
              width: 28,
              height: 26,
              patrolDir: 1,
              patrolTimer: 0,
              defeatTimer: 0,
            });
          } else if (rand < 0.50) {
            // 2. 飛行エネミー
            const flyY = groundY - 55 - Math.random() * 50;
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
          } else if (rand < 0.65) {
            // 3. 固定障害物 (高さ18px)
            obstacles.push({
              x: nextBlockX + blockWidth / 2 - 11,
              y: groundY - 18,
              width: 22,
              height: 18,
            });
          }
        }
        nextBlockX += blockWidth;
      } else {
        const holeBlocks = Math.floor(Math.random() * 2) + 2;
        nextBlockX += blockWidth * holeBlocks;
      }
    }
  }

  // --- 描画処理 ---

  // 1. 操作キャラ (全身青 #2563eb / バイザー白 #ffffff / 白い丸い拳 #ffffff)
  function drawPlayer(ctx, p) {
    ctx.save();
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);

    // 姿勢の角度計算
    if (p.state === 'GAMEOVER') {
      ctx.rotate(-0.38); // 衝突時: 左へ仰け反りノックバック
    } else {
      ctx.rotate(0.18);  // 走る/ジャンプ時: 常に右へ前のめり
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

    // 二足脚 (青)
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

    // 胴体 (青)
    ctx.beginPath();
    ctx.roundRect(-7, -6, 14, 12, 4);
    ctx.fill();

    // サイバーヘルメット (青)
    ctx.beginPath();
    ctx.arc(0, -11, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // 奥側の腕 ＆ 白い丸い拳 (腕: 青 / 拳: 白 #ffffff)
    if (p.state === 'RUNNING') {
      const armX1 = -2 - Math.cos(armAngle) * 8;
      const armY1 = 4;
      ctx.beginPath();
      ctx.moveTo(-2, -3); ctx.lineTo(armX1, armY1);
      ctx.stroke();
      // 白い丸い拳
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(armX1 - 1, armY1 + 1, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ③ 白いバイザー (白 #ffffff) / GAMEOVER時: 「✕ ✕」
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

    // 手前側の腕 ＆ 白い丸い拳 (腕: 青 / 拳: 白 #ffffff)
    ctx.strokeStyle = '#2563eb';
    if (p.state === 'RUNNING') {
      const armX2 = 2 + Math.cos(armAngle) * 8;
      const armY2 = 4;
      ctx.beginPath();
      ctx.moveTo(2, -3); ctx.lineTo(armX2, armY2);
      ctx.stroke();
      // 白い丸い拳
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

  // 2. エネミー描画 (指定された精密なレイヤー構造)
  function drawEnemies(ctx, enemiesList) {
    for (const e of enemiesList) {
      ctx.save();
      ctx.translate(e.x + e.width / 2, e.y + e.height / 2);

      // 進行方向の決定（陸上はパトロール方向、飛行はプレイヤーに向かうため常に左向き dir = -1）
      const dir = e.type === 'flying' ? -1 : (e.patrolDir || -1);

      if (e.type === 'ground') {
        // --- 陸上キャラ (全身紫 #8b5cf6 ＋ 白目 ＋ 赤い楕円尻尾(下レイヤー) ＋ 直線口 ＋ 牙1px) ---
        const isDefeated = e.state === 'defeated';

        if (isDefeated) {
          ctx.scale(1.2, 0.45);
        }

        // Layer 1 [下レイヤー]: 赤い楕円の尻尾 (進行方向と逆側に配置)
        ctx.fillStyle = '#ef4444'; // 赤い楕円
        ctx.beginPath();
        const tailX = -dir * 12;
        ctx.ellipse(tailX, 2, 6, 3.5, tailDirAngle(dir), 0, Math.PI * 2);
        ctx.fill();

        // Layer 2 [メインボディ]: 全身紫 (紫 #8b5cf6)
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.ellipse(0, -2, e.width / 2 - 2, e.height / 2 - 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // 三角耳 (紫 #8b5cf6)
        ctx.beginPath();
        ctx.moveTo(-6, -8); ctx.lineTo(-10, -14); ctx.lineTo(-2, -9);
        ctx.moveTo(2, -8);  ctx.lineTo(10, -14);  ctx.lineTo(6, -9);
        ctx.fill();

        // 二足歩行の脚 (紫 #8b5cf6)
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

        // Layer 3 [顔パーツ]: 進行方向に少しずらした両眼 ＋ 白い一直線の口 ＋ 逆側1px牙
        const faceOffsetX = dir * 3; // 進行方向に少しシフト

        if (isDefeated) {
          // 撃退時: 「✕ ✕」目 ＋ 白い口
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-7 + faceOffsetX, -4); ctx.lineTo(-3 + faceOffsetX, 0);
          ctx.moveTo(-3 + faceOffsetX, -4); ctx.lineTo(-7 + faceOffsetX, 0);
          ctx.moveTo(3 + faceOffsetX, -4);  ctx.lineTo(7 + faceOffsetX, 0);
          ctx.moveTo(7 + faceOffsetX, -4);  ctx.lineTo(3 + faceOffsetX, 0);
          ctx.stroke();
          // 一直線の口
          ctx.beginPath();
          ctx.moveTo(-4 + faceOffsetX, 4); ctx.lineTo(4 + faceOffsetX, 4);
          ctx.stroke();
        } else {
          // 通常時: 白い目 (進行方向にずらす)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-6 + faceOffsetX, -5, 3.5, 4);
          ctx.fillRect(3 + faceOffsetX, -5, 3.5, 4);

          // 白い一直線の口 (両目の下)
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-4 + faceOffsetX, 2);
          ctx.lineTo(4 + faceOffsetX, 2);
          ctx.stroke();

          // 進行方向と逆側に牙を表す1ピクセル (白い下向き突起)
          ctx.fillStyle = '#ffffff';
          const fangX = faceOffsetX - dir * 3;
          ctx.fillRect(fangX, 3, 1.5, 2);
        }

      } else if (e.type === 'flying') {
        // --- 飛行キャラ (下レイヤー:紫のコウモリ三角羽＆赤尻尾 / 前レイヤー:白角 / 顔パーツ共通) ---
        const isDefeated = e.state === 'defeated';

        if (isDefeated) {
          ctx.rotate(-0.45); // 向いている方向と逆向きに仰け反る
          if (Math.floor(e.defeatTimer / 3) % 2 === 0) {
            ctx.globalAlpha = 0.35; // パチパチ点滅
          }
        }

        // Layer 1 [下レイヤー]: 紫のコウモリ型三角形の羽 (ボディより下)
        const wingFlap = isDefeated ? 0 : Math.sin(animFrameCounter * 0.4) * 6;
        ctx.fillStyle = '#8b5cf6'; // 紫の羽
        ctx.beginPath();
        // 左コウモリ翼
        ctx.moveTo(-4, -2);
        ctx.lineTo(-15, -9 + wingFlap);
        ctx.lineTo(-10, 2);
        ctx.lineTo(-4, 4);
        // 右コウモリ翼
        ctx.moveTo(4, -2);
        ctx.lineTo(15, -9 + wingFlap);
        ctx.lineTo(10, 2);
        ctx.lineTo(4, 4);
        ctx.fill();

        // Layer 1 [下レイヤー]: 赤い尻尾 (ボディより下・進行方向の後ろ側に伸びる)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const tailX = -dir * 6; // 左向き(dir=-1)なら右側(+X)へ伸ばす
        ctx.moveTo(0, 5);
        ctx.lineTo(tailX, 12);
        ctx.lineTo(tailX + (-dir * 4), 10);
        ctx.stroke();

        // Layer 2 [メインボディ]: 全身紫 (紫 #8b5cf6)
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(0, 0, e.width / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // Layer 3 [前レイヤー]: 白い角 (ボディより前)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-5, -7); ctx.lineTo(-8, -14); ctx.lineTo(-2, -9);
        ctx.moveTo(5, -7);  ctx.lineTo(8, -14);  ctx.lineTo(2, -9);
        ctx.fill();

        // Layer 4 [顔パーツ]: 陸上キャラと共通パーツ (進行方向にずらした白目 ＋ 直線口 ＋ 逆側1px牙)
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
          // 通常時: 白目
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-6 + faceOffsetX, -4, 3.5, 4);
          ctx.fillRect(3 + faceOffsetX, -4, 3.5, 4);

          // 白い一直線の口
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-4 + faceOffsetX, 2);
          ctx.lineTo(4 + faceOffsetX, 2);
          ctx.stroke();

          // 逆側に1pxの牙
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

  // 3. 固定障害物 (高さ18px・ジャンプ1回で余裕跳び越え)
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

    if (gameState === 'start') return;

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

    // 3. Draw Obstacles
    drawObstacles(ctx, obstacles);

    // 4. Draw Enemies
    drawEnemies(ctx, enemies);

    // 5. Draw Player
    drawPlayer(ctx, player);
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // Input Handling
  function handleTap(e) {
    if (e) {
      if (e.target.tagName.toLowerCase() === 'button' || e.target.classList.contains('icon-config'))
        return;
      e.preventDefault();
    }

    if (gameState === 'playing' && !isPaused) {
      if (player.jumpCount < player.maxJumps) {
        playSE('jump');
        player.vy = jumpPower;
        player.jumpCount++;
      }
    }
  }

  wrapper.addEventListener('mousedown', handleTap);
  wrapper.addEventListener('touchstart', handleTap, { passive: false });

  function startGame() {
    if (gameHud) gameHud.style.display = 'flex';
    const bottomHud = document.getElementById('bottom-hud');
    if (bottomHud) bottomHud.style.display = 'block';

    gameState = 'playing';
    isPaused = false;
    startScreen.style.display = 'none';
    resultScreen.style.display = 'none';

    startTime = Date.now();
    survivalTime = 0;
    if (timeElement) timeElement.textContent = '0.0';
    scrollSpeed = 5;
    animFrameCounter = 0;
    blockSpawnCount = 0;

    // Reset Player
    player.y = canvas.height - blockHeight - player.height;
    player.vy = 0;
    player.jumpCount = 0;
    player.state = 'RUNNING';

    // Reset World
    blocks = [];
    obstacles = [];
    enemies = [];

    clouds = [];
    for (let i = 0; i < 4; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 3),
        width: 80 + Math.random() * 60,
        height: 25 + Math.random() * 10,
      });
    }

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

  function gameOver() {
    if (gameHud) gameHud.style.display = 'none';
    gameState = 'gameover';
    player.state = 'GAMEOVER';
    if (resultScreen) resultScreen.style.display = 'flex';
    const bottomHud = document.getElementById('bottom-hud');
    if (bottomHud) bottomHud.style.display = 'none';
    if (finalTimeElement) finalTimeElement.textContent = survivalTime.toFixed(1);

    if (survivalTime > highScore) {
      highScore = survivalTime;
      localStorage.setItem('runaction_highscore', highScore.toString());
      if (highscoreElement) highscoreElement.textContent = highScore.toFixed(1);
    }

    // Share Button Link Update
    if (shareBtn) {
      const shareText = `記録 ${survivalTime.toFixed(1)} 秒！(ベスト: ${highScore.toFixed(1)}秒) #MyPortfolioAction`;
      const shareUrl = window.location.href;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      shareBtn.onclick = (e) => {
        e.stopPropagation();
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
      };
    }
  }

  // --- 既存UI・各種ボタンイベントハンドラの完全保持 ---
  if (startBtn)
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('confirm');
      startGame();
    });
  if (retryBtn)
    retryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('confirm');
      startGame();
    });
  if (titleBtn) {
    titleBtn.addEventListener('click', () => {
      playSE('cancel');
      if (resultScreen) resultScreen.style.display = 'none';
      if (startScreen) startScreen.style.display = 'flex';
      if (gameHud) gameHud.style.display = 'none';
      const bottomHud = document.getElementById('bottom-hud');
      if (bottomHud) bottomHud.style.display = 'none';
    });
  }
  if (shareBtn)
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      shareScore();
    });
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
    });

  const _cfgBtn1 = document.getElementById('config-btn');
  const _cfgBtn2 = document.getElementById('hud-config-btn');
  const openConfig = (e) => {
    e.stopPropagation();
    playSE('cursor');
    if (gameState === 'playing' && !isPaused) pauseGame();
    if (configModal) configModal.classList.add('active');
    if (modalOverlay) modalOverlay.classList.add('active');
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
      gameState = 'start';
      isPaused = false;
      if (resultScreen) resultScreen.style.display = 'none';
      if (startScreen) startScreen.style.display = 'flex';
      if (gameHud) gameHud.style.display = 'none';
      const bottomHud = document.getElementById('bottom-hud');
      if (bottomHud) bottomHud.style.display = 'none';
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
    });
  }

  // Start Loop
  loop();
})();
