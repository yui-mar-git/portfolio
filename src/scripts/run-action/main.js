import seJump from '../../assets/games/run-action/audio/se/パパッ.mp3';
import seCollision from '../../assets/games/run-action/audio/se/ニュッ2.mp3';
import seCursor from '../../assets/games/run-action/audio/se/カーソル移動7.mp3';
import seConfirm from '../../assets/games/run-action/audio/se/決定ボタンを押す2.mp3';
import seCancel from '../../assets/games/run-action/audio/se/キャンセル1.mp3';

(function () {
  let configBgmVolume = 0.5;
  let configSeVolume = 0.5;

  const SE_DB = {
    'jump': seJump,
    'collision': seCollision,
    'cursor': seCursor,
    'confirm': seConfirm,
    'cancel': seCancel
  };

  function playSE(seId) {
    if (!SE_DB[seId]) return;
    const se = new Audio(SE_DB[seId]);
    se.volume = configSeVolume;
    se.play().catch(e => console.log('SE play failed:', e));
  }

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
  const closeHowtoBtn = document.getElementById('close-howto-btn-x'); // ✕ボタンのID
  const howtoModal = document.getElementById('howto-modal');
  const configBtn = document.getElementById('config-btn');
  const closeConfigBtn = document.getElementById('close-config-btn-x'); // ✕ボタンのID
  const configModal = document.getElementById('config-modal');

  const creditsBtn = document.getElementById('credits-btn');
  const closeCreditsBtn = document.getElementById('close-credits-btn');
  const creditsModal = document.getElementById('credits-modal');
  const modalOverlay = document.getElementById('modal-overlay');

  // State
  let gameState = 'start'; // start, playing, gameover
  let startTime = 0;
  let survivalTime = 0;
  let isPaused = false;
  let pauseStartTime = 0;
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
    startTime += (Date.now() - pauseStartTime);
  }

  // Canvas Resize (レスポンシブ対応)
  function resizeCanvas() {
    // 内部解像度をコンテナのサイズに合わせる
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Physics & Game Settings
  const gravity = 0.5;
  const jumpPower = -10;
  let scrollSpeed = 5;

  // Game Objects
  const player = {
    x: 50,
    y: 0,
    width: 30,
    height: 30,
    vy: 0,
    jumpCount: 0,
    maxJumps: 2
  };

  let blocks = [];
  let obstacles = [];
  let clouds = []; // 背景の雲
  let nextBlockX = 0;
  const blockWidth = 60;
  const blockHeight = 40;

  // 雲（角丸の長方形）を描画するヘルパー関数
  // 半円を左右に描き、その間を塗りつぶすことで横長の楕円を表現します
  function drawRoundedRect(ctx, x, y, width, height) {
    const r = height / 2;
    ctx.beginPath();
    // 左側の半円
    ctx.arc(x + r, y + r, r, Math.PI * 0.5, Math.PI * 1.5);
    // 右側の半円
    ctx.arc(x + width - r, y + r, r, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  // 当たり判定 (AABB: 四角形同士の交差判定)
  function checkCollision(r1, r2) {
    return r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y;
  }

  // Main Game Loop
  function update() {
    if (gameState !== 'playing' || isPaused) return;

    // Update survival time
    const now = Date.now();
    survivalTime = (now - startTime) / 1000;
    timeElement.textContent = survivalTime.toFixed(1);

    // スピードアップ（徐々に難易度を上げる）
    scrollSpeed = 5 + (survivalTime / 10);

    // --- プレイヤーの物理演算 ---
    player.vy += gravity;
    player.y += player.vy;

    // --- 地形・障害物・背景のスクロール ---
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].x -= scrollSpeed;
    }
    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].x -= scrollSpeed;
    }
    // --- 背景の雲のスクロール（地面よりも少し早い速度で躍動感を出す） ---
    for (let i = 0; i < clouds.length; i++) {
      // 地面のスクロール速度(scrollSpeed)より20%早く動かす
      clouds[i].x -= scrollSpeed * 1.2;

      // 雲が画面の左端から完全に見えなくなったら、右端に再配置してループさせる
      if (clouds[i].x + clouds[i].width < 0) {
        clouds[i].x = canvas.width + Math.random() * 100;
        clouds[i].y = Math.random() * (canvas.height / 3);
      }
    }

    // --- 当たり判定（地面） ---
    let onGround = false;
    for (const block of blocks) {
      if (checkCollision(player, block)) {
        // 上から乗った場合
        if (player.vy > 0 && player.y + player.height - player.vy <= block.y + 5) {
          player.y = block.y - player.height;
          player.vy = 0;
          player.jumpCount = 0; // 着地したらジャンプ回数をリセット
          onGround = true;
        } else {
          // 横からぶつかった場合（壁としてゲームオーバー）
          playSE('collision');
          gameOver();
          return;
        }
      }
    }

    // --- 当たり判定（障害物） ---
    for (const obs of obstacles) {
      if (checkCollision(player, obs)) {
        playSE('collision');
        gameOver();
        return;
      }
    }

    // --- 落下判定 ---
    if (player.y > canvas.height) {
      playSE('collision');
      gameOver();
      return;
    }

    // --- メモリ最適化＆新しいブロックの生成 ---
    // 画面外に出たブロックを削除
    blocks = blocks.filter(b => b.x + b.width > 0);
    obstacles = obstacles.filter(o => o.x + o.width > 0);

    // 穴を正しく管理するため、nextBlockXをスクロール量に合わせて減算
    nextBlockX -= scrollSpeed;

    // nextBlockX が画面右端に近づいたら新しいブロックを生成
    while (nextBlockX < canvas.width + blockWidth) {
      // 穴を作る確率（15%）
      const isHole = Math.random() < 0.15;

      if (!isHole) {
        const groundY = canvas.height - blockHeight;
        blocks.push({
          x: nextBlockX,
          y: groundY,
          width: blockWidth,
          height: blockHeight
        });

        // 障害物を作る確率（10%）
        if (Math.random() < 0.10 && nextBlockX > canvas.width) {
          obstacles.push({
            x: nextBlockX + blockWidth / 2 - 15,
            y: groundY - 30, // 地面の上に乗るように配置
            width: 30,
            height: 30
          });
        }
        nextBlockX += blockWidth;
      } else {
        // 穴の場合は 2〜3ブロック分の幅を開ける
        const holeBlocks = Math.floor(Math.random() * 2) + 2;
        nextBlockX += blockWidth * holeBlocks;
      }
    }
  }

  function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'start') return;

    // Draw Clouds (空を流れる雲)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // 半透明の白
    for (const c of clouds) {
      // メインとなる横長の雲
      drawRoundedRect(ctx, c.x, c.y, c.width, c.height);
      // 上に少し短めの雲をずらして重ねることで、モコモコ感（立体感）を出す
      drawRoundedRect(ctx, c.x + c.width * 0.1, c.y - c.height * 0.4, c.width * 0.8, c.height * 0.8);
    }

    // Draw Blocks (Ground)
    ctx.fillStyle = '#28a745'; // 緑色
    for (const block of blocks) {
      ctx.fillRect(block.x, block.y, block.width, block.height);
    }

    // Draw Obstacles
    ctx.fillStyle = '#dc3545'; // 赤色
    for (const obs of obstacles) {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    // Draw Player (Blue Square)
    ctx.fillStyle = '#007bff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // Input Handling
  function handleTap(e) {
    if (e) {
      if (e.target.tagName.toLowerCase() === 'button' || e.target.classList.contains('icon-config')) return;
      e.preventDefault();
    }

    if (gameState === 'playing' && !isPaused) {
      // Jump Logic (2段ジャンプ)
      if (player.jumpCount < player.maxJumps) {
        playSE('jump');
        player.vy = jumpPower;
        player.jumpCount++;
      }
    }
  }

  // wrapperに対してイベントを貼ることでCanvas領域内のタップを取得
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
    timeElement.textContent = '0.0';
    scrollSpeed = 5;

    // Reset Player
    player.y = canvas.height - blockHeight - player.height;
    player.vy = 0;
    player.jumpCount = 0;

    // Reset World (初期状態は穴なしで地面を敷き詰める)
    blocks = [];
    obstacles = [];

    // 雲の初期配置
    clouds = [];
    for (let i = 0; i < 4; i++) {
      clouds.push({
        x: Math.random() * canvas.width,        // X座標はランダム
        y: Math.random() * (canvas.height / 3), // Y座標は空の上1/3の範囲
        width: 80 + Math.random() * 60,         // 雲の横幅（80px 〜 140px）
        height: 25 + Math.random() * 10         // 雲の縦幅（25px 〜 35px）
      });
    }

    nextBlockX = 0;
    for (let x = 0; x < canvas.width + blockWidth; x += blockWidth) {
      blocks.push({
        x: nextBlockX,
        y: canvas.height - blockHeight,
        width: blockWidth,
        height: blockHeight
      });
      nextBlockX += blockWidth;
    }
  }

  function gameOver() {
    if (gameHud) gameHud.style.display = 'none';
    gameState = 'gameover';
    if (resultScreen) resultScreen.style.display = 'flex';
    const bottomHud = document.getElementById('bottom-hud');
    if (bottomHud) bottomHud.style.display = 'none';
    finalTimeElement.textContent = survivalTime.toFixed(1);

    if (survivalTime > highScore) {
      highScore = survivalTime;
      localStorage.setItem('runaction_highscore', highScore.toString());
      if (highscoreElement) highscoreElement.textContent = highScore.toFixed(1);
    }

    // Update Share Button
    const shareText = `記録 ${survivalTime.toFixed(1)} 秒！(ベスト: ${highScore.toFixed(1)}秒) #MyPortfolioAction`;
    const shareUrl = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

    // ボタンイベントの再登録（重複防止）
    const newShareBtn = shareBtn.cloneNode(true);
    shareBtn.parentNode.replaceChild(newShareBtn, shareBtn);
    newShareBtn.addEventListener('click', () => {
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (startBtn) startBtn.addEventListener('click', (e) => { e.stopPropagation(); playSE('confirm'); startGame(); });
  if (retryBtn) retryBtn.addEventListener('click', (e) => { e.stopPropagation(); playSE('confirm'); startGame(); });
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
  if (shareBtn) shareBtn.addEventListener('click', (e) => { e.stopPropagation(); shareScore(); });
  if (howtoBtn) howtoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    howtoModal.classList.add('active');
    modalOverlay.classList.add('active');
  });
  if (closeHowtoBtn) closeHowtoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    howtoModal.classList.remove('active');
    modalOverlay.classList.remove('active');
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
      if (gameState === 'playing' && isPaused && !document.getElementById('credits-modal')?.classList.contains('active') && !document.getElementById('retire-modal')?.classList.contains('active')) {
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

  // Start loop
  requestAnimationFrame(loop);


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
      if (gameState === 'playing' && isPaused && !document.getElementById('config-modal')?.classList.contains('active') && !document.getElementById('retire-modal')?.classList.contains('active')) {
        resumeGame();
      }
    });
    _closeCredBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    _closeCredBtn.addEventListener('touchstart', (e) => e.stopPropagation());
  }

  // コンフィグモーダル内「遊び方を見る」ボタン
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

  // グローバルなボタンクリック音
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
})();
