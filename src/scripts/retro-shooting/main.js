/**
 * ==========================================
 * レトロシューティング（インベーダー系）ロジック
 * ==========================================
 */

import seCursor from '../../assets/games/retro-shooting/audio/se/カーソル移動7.mp3';
import seConfirm from '../../assets/games/retro-shooting/audio/se/決定ボタンを押す2.mp3';
import seWaveStart from '../../assets/games/retro-shooting/audio/se/決定ボタンを押す33.mp3';
import seCancel from '../../assets/games/retro-shooting/audio/se/キャンセル1.mp3';
import seShot from '../../assets/games/retro-shooting/audio/se/ショット.mp3';
import seHit from '../../assets/games/retro-shooting/audio/se/ショット命中.mp3';
import seExplosion from '../../assets/games/retro-shooting/audio/se/クイズ不正解2.mp3';
import sePowerUp from '../../assets/games/retro-shooting/audio/se/パワーアップ.mp3';
import seDamage from '../../assets/games/retro-shooting/audio/se/ニュッ2.mp3';
import seJump from '../../assets/games/retro-shooting/audio/se/パパッ.mp3';

import bgmMain from '../../assets/games/retro-shooting/audio/bgm/maou_game_town26.mp3';

const STORAGE_KEY = 'stg_high_score';
let highScore = 0;

function loadHighScore() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    highScore = parseInt(saved, 10) || 0;
  }
}

function saveHighScore(score) {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem(STORAGE_KEY, highScore.toString());
    return true;
  }
  return false;
}

// Audio setup
let configSeVolume = 0.5;
let configBgmVolume = 0.15;
let currentBgmAudio = null;

const SE_DB = {
  cursor: seCursor,
  confirm: seConfirm,
  waveStart: seWaveStart,
  cancel: seCancel,
  shot: seShot,
  hit: seHit,
  explosion: seExplosion,
  powerup: sePowerUp,
  damage: seDamage,
  jump: seJump,
};

function playSE(key) {
  if (!SE_DB[key]) return;
  const audio = new Audio(SE_DB[key]);
  audio.volume = configSeVolume;
  audio.play().catch(() => {});
}

function playBGM(bgmPath) {
  if (currentBgmAudio) currentBgmAudio.pause();
  currentBgmAudio = new Audio(bgmPath);
  currentBgmAudio.volume = configBgmVolume;
  currentBgmAudio.loop = true;
  currentBgmAudio.play().catch(() => {});
}

function stopBGM() {
  if (currentBgmAudio) currentBgmAudio.pause();
}

window.setSEVolume = function (vol) {
  configSeVolume = vol;
};
window.setBGMVolume = function (vol) {
  configBgmVolume = vol;
  if (currentBgmAudio) currentBgmAudio.volume = vol;
};

let currentWaveModalConfirmCallback = null;

function showWaveStartModal(wave, onConfirmCallback) {
  playSE('waveStart');

  const modal = document.getElementById('wave-start-modal');
  const title = document.getElementById('wave-announce-title');
  const desc = document.getElementById('wave-announce-desc');
  const btn = document.getElementById('btn-wave-start');

  if (title) title.textContent = `WAVE ${wave}`;
  if (desc) {
    desc.textContent = 'エネミー接近中！殲滅せよ！';
  }

  if (modal) modal.style.display = 'flex';

  currentWaveModalConfirmCallback = () => {
    playSE('confirm');
    if (modal) modal.style.display = 'none';
    if (onConfirmCallback) onConfirmCallback();
  };
}

const btnWaveStart = document.getElementById('btn-wave-start');
if (btnWaveStart) {
  btnWaveStart.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentWaveModalConfirmCallback) {
      const cb = currentWaveModalConfirmCallback;
      currentWaveModalConfirmCallback = null;
      cb();
    }
  });
}

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }
  create() {
    this.cameras.main.setBackgroundColor('#0b0f19');
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#0b0f19');

    // Generate dynamic vector textures
    this.createGameTextures();

    // Game Variables
    this.score = 0;
    this.lives = 3;
    this.currentWave = 1;
    this.isGameOver = false;
    this.isWavePaused = false;
    this.isInvulnerable = false;
    this.has3WayShot = false;
    this.lastFireTime = 0;
    this.lastEnemyFireTime = 0;
    this.lastUfoTime = 0;
    this.invaderDir = 1; // 1: right, -1: left
    this.invaderSpeedX = 40;

    // Starfield Background
    this.stars = [];
    for (let i = 0; i < 70; i++) {
      const star = this.add.rectangle(
        Math.random() * 800,
        Math.random() * 600,
        Math.random() < 0.3 ? 3 : 2,
        Math.random() < 0.3 ? 3 : 2,
        0xffffff,
        Math.random() * 0.7 + 0.3,
      );
      star.speed = Math.random() * 60 + 20;
      this.stars.push(star);
    }

    // Physics Groups
    this.playerBullets = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.ufos = this.physics.add.group();
    this.items = this.physics.add.group();

    // Create Player Ship
    this.player = this.physics.add.image(400, 500, 'player_ship');
    this.player.setCollideWorldBounds(true);
    this.player.body.setAllowGravity(false);
    this.player.setDepth(100);

    // Keyboard Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Mouse / Pointer Input
    this.input.on('pointermove', (pointer) => {
      if (this.isGameOver) return;
      if (pointer.x >= 0 && pointer.x <= 800) {
        this.player.x = Phaser.Math.Clamp(pointer.x, 40, 760);
      }
    });

    this.input.on('pointerdown', (pointer) => {
      if (this.isGameOver) return;
      if (pointer.x >= 0 && pointer.x <= 800) {
        this.player.x = Phaser.Math.Clamp(pointer.x, 40, 760);
      }
    });

    // Overlaps & Collisions
    this.physics.add.overlap(
      this.playerBullets,
      this.enemies,
      this.handleBulletHitEnemy,
      null,
      this,
    );
    this.physics.add.overlap(this.playerBullets, this.ufos, this.handleBulletHitUfo, null, this);
    this.physics.add.overlap(
      this.player,
      this.enemyBullets,
      this.handlePlayerHitByBullet,
      null,
      this,
    );
    this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHitByEnemy, null, this);
    this.physics.add.overlap(this.player, this.items, this.handlePlayerCollectItem, null, this);

    // Spawn First Wave
    this.spawnWave(this.currentWave);
    this.updateHUD();
  }

  createGameTextures() {
    // Player Ship (Vibrant Neon Cyan Space Fighter)
    if (!this.textures.exists('player_ship')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });

      // Engine Thruster Flame
      g.fillStyle(0xff8c00, 1);
      g.fillTriangle(17, 36, 27, 36, 22, 48);
      g.fillStyle(0xffeb3b, 1);
      g.fillTriangle(19, 36, 25, 36, 22, 44);

      // Ship Wings
      g.fillStyle(0x00d2ff, 1);
      g.beginPath();
      g.moveTo(22, 2);
      g.lineTo(42, 32);
      g.lineTo(32, 34);
      g.lineTo(22, 38);
      g.lineTo(12, 34);
      g.lineTo(2, 32);
      g.closePath();
      g.fillPath();

      // Wing White Outlines & Core Body
      g.fillStyle(0xffffff, 1);
      g.fillTriangle(22, 6, 30, 28, 14, 28);
      g.fillStyle(0x00f2fe, 1);
      g.fillCircle(22, 18, 5);

      g.generateTexture('player_ship', 44, 50);
      g.destroy();
    }

    // Player Laser Bullet
    if (!this.textures.exists('laser_bullet')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x00f2fe, 1);
      g.fillRect(2, 0, 6, 18);
      g.fillStyle(0xffffff, 0.9);
      g.fillRect(3, 2, 4, 14);
      g.generateTexture('laser_bullet', 10, 18);
    }

    // Enemy Type A (Classic Purple/Neon Octo Invader)
    if (!this.textures.exists('enemy_type_a')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xa855f7, 1);
      g.fillRect(8, 0, 20, 24);
      g.fillRect(0, 6, 36, 12);
      g.fillRect(4, 18, 28, 8);
      // Tentacles
      g.fillRect(2, 26, 8, 6);
      g.fillRect(14, 26, 8, 6);
      g.fillRect(26, 26, 8, 6);
      // Eyes
      g.fillStyle(0xffffff, 1);
      g.fillRect(8, 8, 6, 6);
      g.fillRect(22, 8, 6, 6);
      g.fillStyle(0x000000, 1);
      g.fillRect(10, 10, 3, 3);
      g.fillRect(24, 10, 3, 3);

      g.generateTexture('enemy_type_a', 36, 32);
    }

    // Enemy Type B (Green Crab Invader)
    if (!this.textures.exists('enemy_type_b')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x22c55e, 1);
      g.fillRect(6, 0, 24, 24);
      g.fillRect(0, 8, 36, 10);
      g.fillRect(4, 18, 28, 8);
      // Claws
      g.fillRect(0, 0, 6, 8);
      g.fillRect(30, 0, 6, 8);
      // Eyes
      g.fillStyle(0xffffff, 1);
      g.fillRect(8, 6, 6, 6);
      g.fillRect(22, 6, 6, 6);
      g.fillStyle(0x000000, 1);
      g.fillRect(10, 8, 3, 3);
      g.fillRect(24, 8, 3, 3);

      g.generateTexture('enemy_type_b', 36, 32);
    }

    // Enemy Bullet (Red Orb)
    if (!this.textures.exists('enemy_bullet')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xef4444, 1);
      g.fillCircle(6, 6, 6);
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(6, 6, 3);
      g.generateTexture('enemy_bullet', 12, 12);
    }

    // Spark Effect
    if (!this.textures.exists('fx_spark')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffd700, 1);
      g.fillCircle(4, 4, 4);
      g.generateTexture('fx_spark', 8, 8);
      g.destroy();
    }

    // Saucer UFO (Rare Flying Enemy - Red/Gold)
    if (!this.textures.exists('saucer_ufo')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      // Dome
      g.fillStyle(0x00f2fe, 0.9);
      g.fillCircle(24, 10, 8);
      // Body
      g.fillStyle(0xef4444, 1);
      g.fillEllipse(24, 16, 46, 14);
      // Glow lights
      g.fillStyle(0xffeb3b, 1);
      g.fillCircle(12, 16, 3);
      g.fillCircle(24, 18, 3.5);
      g.fillCircle(36, 16, 3);

      g.generateTexture('saucer_ufo', 48, 26);
      g.destroy();
    }

    // Item Drops: Heal (Green Orb with Cross)
    if (!this.textures.exists('item_heal')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x22c55e, 1);
      g.fillCircle(14, 14, 13);
      g.fillStyle(0xffffff, 1);
      g.fillRect(11, 6, 6, 16);
      g.fillRect(6, 11, 16, 6);
      g.generateTexture('item_heal', 28, 28);
      g.destroy();
    }

    // Item Drops: Power Up (Gold Orb with Lightning)
    if (!this.textures.exists('item_power')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xeab308, 1);
      g.fillCircle(14, 14, 13);
      g.fillStyle(0xffffff, 1);
      g.beginPath();
      g.moveTo(16, 4);
      g.lineTo(8, 15);
      g.lineTo(14, 15);
      g.lineTo(12, 24);
      g.lineTo(20, 13);
      g.lineTo(14, 13);
      g.closePath();
      g.fillPath();
      g.generateTexture('item_power', 28, 28);
      g.destroy();
    }
  }

  spawnWave(wave) {
    this.enemies.clear(true, true);
    this.playerBullets.clear(true, true);
    this.enemyBullets.clear(true, true);
    this.ufos.clear(true, true);
    this.items.clear(true, true);

    this.invaderDir = 1;

    // WAVEごとの敵バランス調整
    let rows = 4;
    let cols = 8;
    if (wave === 1) {
      rows = 3;
      cols = 6;
      this.invaderSpeedX = 35;
    } else if (wave === 2) {
      rows = 4;
      cols = 7;
      this.invaderSpeedX = 50;
    } else if (wave === 3) {
      rows = 4;
      cols = 8;
      this.invaderSpeedX = 65;
    } else {
      rows = 4;
      cols = 8;
      this.invaderSpeedX = 65 + (wave - 3) * 10;
    }

    const spacingX = 65;
    const spacingY = 45;
    const startX = (800 - cols * spacingX) / 2 + 25;
    const startY = 80;

    for (let r = 0; r < rows; r++) {
      const textureKey = r % 2 === 0 ? 'enemy_type_a' : 'enemy_type_b';
      const points = r % 2 === 0 ? 100 : 50;

      for (let c = 0; c < cols; c++) {
        const invader = this.enemies.create(
          startX + c * spacingX,
          startY + r * spacingY,
          textureKey,
        );
        invader.body.setAllowGravity(false);
        invader.points = points;
      }
    }

    // WAVE開始時のポーズ＆アナウンス演出
    this.isWavePaused = true;
    this.physics.pause();
    showWaveStartModal(wave, () => {
      this.physics.resume();
      this.isWavePaused = false;
      if (this.time) {
        this.lastFireTime = this.time.now;
        this.lastEnemyFireTime = this.time.now;
        this.lastUfoTime = this.time.now;
      }
    });
  }

  update(time, delta) {
    if (this.isGameOver || this.isWavePaused) return;

    // Scroll Starfield
    const deltaSec = delta / 1000;
    this.stars.forEach((star) => {
      star.y += star.speed * deltaSec;
      if (star.y > 600) {
        star.y = 0;
        star.x = Math.random() * 800;
      }
    });

    // Player Keyboard Controls
    if (this.cursors.left.isDown || this.keyA.isDown) {
      this.player.x -= 300 * deltaSec;
    } else if (this.cursors.right.isDown || this.keyD.isDown) {
      this.player.x += 300 * deltaSec;
    }
    this.player.x = Phaser.Math.Clamp(this.player.x, 40, 760);

    // Auto Fire Player Laser (Single or 3WAY)
    if (time - this.lastFireTime > 180) {
      this.lastFireTime = time;
      if (this.has3WayShot) {
        // Center bullet
        const b1 = this.playerBullets.create(this.player.x, this.player.y - 20, 'laser_bullet');
        b1.body.setAllowGravity(false);
        b1.body.setVelocityY(-650);

        // Left diagonal bullet
        const b2 = this.playerBullets.create(
          this.player.x - 12,
          this.player.y - 15,
          'laser_bullet',
        );
        b2.body.setAllowGravity(false);
        b2.body.setVelocity(-180, -620);

        // Right diagonal bullet
        const b3 = this.playerBullets.create(
          this.player.x + 12,
          this.player.y - 15,
          'laser_bullet',
        );
        b3.body.setAllowGravity(false);
        b3.body.setVelocity(180, -620);
      } else {
        const bullet = this.playerBullets.create(this.player.x, this.player.y - 20, 'laser_bullet');
        bullet.body.setAllowGravity(false);
        bullet.body.setVelocityY(-650);
      }
      playSE('shot');
    }

    // Clean Out-of-Bounds Player Bullets
    this.playerBullets.getChildren().forEach((b) => {
      if (b.y < -20 || b.x < -20 || b.x > 820) b.destroy();
    });

    // Clean Out-of-Bounds Enemy Bullets & Items
    this.enemyBullets.getChildren().forEach((eb) => {
      if (eb.y > 620) eb.destroy();
    });

    this.items.getChildren().forEach((item) => {
      if (item.y > 630) item.destroy();
    });

    // UFO Spawn & Movement Logic (Every 15s)
    if (time - this.lastUfoTime > 15000) {
      this.lastUfoTime = time;
      if (this.ufos.countActive() === 0) {
        const spawnFromRight = Math.random() < 0.5;
        const startX = spawnFromRight ? 840 : -40;
        const velX = spawnFromRight ? -220 : 220;
        const ufo = this.ufos.create(startX, 50, 'saucer_ufo');
        ufo.body.setAllowGravity(false);
        ufo.body.setVelocityX(velX);
        playSE('energyball');
      }
    }

    // Clean Out-of-Bounds UFO
    this.ufos.getChildren().forEach((ufo) => {
      if (ufo.x < -60 || ufo.x > 860) ufo.destroy();
    });

    // Invader Formation Movement
    const activeEnemies = this.enemies.getChildren().filter((e) => e.active);
    if (activeEnemies.length > 0) {
      let moveDown = false;
      const moveDistance = this.invaderSpeedX * deltaSec * this.invaderDir;

      // Check edge hit
      activeEnemies.forEach((e) => {
        e.x += moveDistance;
        if (e.x > 760 && this.invaderDir > 0) {
          moveDown = true;
        } else if (e.x < 40 && this.invaderDir < 0) {
          moveDown = true;
        }
      });

      if (moveDown) {
        this.invaderDir *= -1;
        activeEnemies.forEach((e) => {
          e.y += 18;
          // Game Over if invaders breach bottom line
          if (e.y >= 500) {
            this.triggerGameOver();
          }
        });
      }

      // Enemy Firing Logic
      const fireInterval = Math.max(400, 1500 - this.currentWave * 200);
      if (time - this.lastEnemyFireTime > fireInterval) {
        this.lastEnemyFireTime = time;
        const shooter = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
        if (shooter) {
          const eb = this.enemyBullets.create(shooter.x, shooter.y + 15, 'enemy_bullet');
          eb.body.setAllowGravity(false);
          eb.body.setVelocityY(280 + this.currentWave * 30);
        }
      }
    } else {
      // Wave Cleared!
      this.currentWave += 1;
      this.spawnWave(this.currentWave);
      this.updateHUD();
    }
  }

  handleBulletHitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;
    bullet.destroy();

    // Create Explosion Particles
    for (let i = 0; i < 8; i++) {
      const spark = this.add.image(
        enemy.x + (Math.random() * 20 - 10),
        enemy.y + (Math.random() * 20 - 10),
        'fx_spark',
      );
      spark.setAlpha(0.9);
      this.tweens.add({
        targets: spark,
        x: spark.x + (Math.random() * 40 - 20),
        y: spark.y + (Math.random() * 40 - 20),
        alpha: 0,
        scale: 0.2,
        duration: 300,
        onComplete: () => spark.destroy(),
      });
    }

    this.score += enemy.points || 50;
    enemy.destroy();
    playSE('hit');

    // 5% Chance to drop item from regular invader
    if (Math.random() < 0.05) {
      this.spawnItemDrop(enemy.x, enemy.y);
    }

    this.updateHUD();
  }

  handleBulletHitUfo(bullet, ufo) {
    if (!bullet.active || !ufo.active) return;
    bullet.destroy();

    // Sparks
    for (let i = 0; i < 12; i++) {
      const spark = this.add.image(
        ufo.x + (Math.random() * 30 - 15),
        ufo.y + (Math.random() * 20 - 10),
        'fx_spark',
      );
      spark.setAlpha(1);
      this.tweens.add({
        targets: spark,
        x: spark.x + (Math.random() * 60 - 30),
        y: spark.y + (Math.random() * 60 - 30),
        alpha: 0,
        scale: 0.1,
        duration: 400,
        onComplete: () => spark.destroy(),
      });
    }

    this.score += 500; // Bonus points for rare UFO!
    ufo.destroy();
    playSE('explosion');

    // 100% Chance to drop item from rare UFO!
    this.spawnItemDrop(ufo.x, ufo.y);
    this.updateHUD();
  }

  spawnItemDrop(x, y) {
    const isHeal = Math.random() < 0.4;
    const itemKey = isHeal ? 'item_heal' : 'item_power';
    const item = this.items.create(x, y, itemKey);
    item.body.setAllowGravity(false);
    item.body.setVelocityY(110);
    item.itemType = isHeal ? 'heal' : 'power';

    // Item floating animation
    this.tweens.add({
      targets: item,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 350,
      yoyo: true,
      repeat: -1,
    });
  }

  handlePlayerCollectItem(player, item) {
    if (!item.active || this.isGameOver) return;

    // Item collect sparkle effect
    for (let i = 0; i < 10; i++) {
      const spark = this.add.image(item.x, item.y, 'fx_spark');
      this.tweens.add({
        targets: spark,
        x: item.x + (Math.random() * 50 - 25),
        y: item.y + (Math.random() * 50 - 25),
        alpha: 0,
        scale: 0.1,
        duration: 350,
        onComplete: () => spark.destroy(),
      });
    }

    if (item.itemType === 'heal') {
      this.lives = Math.min(3, this.lives + 1);
      playSE('powerup');
    } else if (item.itemType === 'power') {
      this.has3WayShot = true;
      playSE('powerup');
    }

    item.destroy();
    this.updateHUD();
  }

  handlePlayerHitByBullet(player, bullet) {
    if (this.isInvulnerable || this.isGameOver) return;
    bullet.destroy();
    this.takeDamage();
  }

  handlePlayerHitByEnemy(player, enemy) {
    if (this.isInvulnerable || this.isGameOver) return;
    this.takeDamage();
  }

  takeDamage() {
    this.lives -= 1;
    this.updateHUD();
    playSE('damage');
    this.cameras.main.flash(200, 255, 0, 0);

    if (this.lives <= 0) {
      this.triggerGameOver();
    } else {
      // Temporary Invulnerability Flash
      this.isInvulnerable = true;
      this.tweens.add({
        targets: this.player,
        alpha: 0.3,
        duration: 100,
        yoyo: true,
        repeat: 8,
        onComplete: () => {
          this.player.setAlpha(1);
          this.isInvulnerable = false;
        },
      });
    }
  }

  triggerGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.physics.pause();
    stopBGM();

    const isNewHigh = saveHighScore(this.score);
    playSE('explosion');

    const resultScreen = document.getElementById('result-screen');
    const finalScore = document.getElementById('final-score');
    const finalHighScore = document.getElementById('final-high-score');
    const newRecordTag = document.getElementById('new-record-tag');

    if (finalScore) finalScore.textContent = this.score;
    if (finalHighScore) finalHighScore.textContent = highScore;
    if (newRecordTag) newRecordTag.style.display = isNewHigh ? 'block' : 'none';
    if (resultScreen) resultScreen.style.display = 'flex';
  }

  updateHUD() {
    const scoreDisplay = document.getElementById('score-display');
    const highScoreDisplay = document.getElementById('high-score-display');
    const waveDisplay = document.getElementById('wave-display');
    const livesDisplay = document.getElementById('lives-display');

    if (scoreDisplay) scoreDisplay.textContent = this.score;
    if (highScoreDisplay) highScoreDisplay.textContent = highScore;
    if (waveDisplay) waveDisplay.textContent = this.currentWave;
    if (livesDisplay) {
      livesDisplay.textContent = '❤️'.repeat(Math.max(0, this.lives));
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [BootScene, MainScene],
};

if (window.stgGameInstance) {
  window.stgGameInstance.destroy(true);
}
window.stgGameInstance = new Phaser.Game(config);
const game = window.stgGameInstance;

// Load High Score
loadHighScore();

// Global Navigation
let currentScreen = 'start';
function updateGlobalBackButton() {
  const backBtn = document.getElementById('global-back-btn');
  if (backBtn) {
    backBtn.style.display = currentScreen === 'start' ? 'none' : 'flex';
  }
}
updateGlobalBackButton();

const startScreen = document.getElementById('start-screen');
const resultScreen = document.getElementById('result-screen');

// Global Back Button Click
const globalBackBtn = document.getElementById('global-back-btn');
if (globalBackBtn) {
  globalBackBtn.addEventListener('click', () => {
    playSE('cancel');
    if (currentScreen === 'game') {
      stopBGM();
      if (resultScreen) resultScreen.style.display = 'none';
      if (startScreen) startScreen.style.display = 'flex';
      currentScreen = 'start';
      updateGlobalBackButton();
      if (game) {
        game.scene.stop('MainScene');
        game.scene.start('BootScene');
      }
    }
  });
}

// Start Game
const startBtn = document.getElementById('start-btn');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    playSE('confirm');
    if (startScreen) startScreen.style.display = 'none';
    if (resultScreen) resultScreen.style.display = 'none';
    currentScreen = 'game';
    updateGlobalBackButton();
    playBGM(bgmMain);

    game.scene.stop('BootScene');
    game.scene.start('MainScene');
  });
}

// Retry Game
const btnRetry = document.getElementById('btn-retry');
if (btnRetry) {
  btnRetry.addEventListener('click', () => {
    playSE('confirm');
    if (resultScreen) resultScreen.style.display = 'none';
    currentScreen = 'game';
    updateGlobalBackButton();
    playBGM(bgmMain);

    game.scene.stop('BootScene');
    game.scene.start('MainScene');
  });
}

// Title Button
const btnToStart = document.getElementById('btn-to-start');
if (btnToStart) {
  btnToStart.addEventListener('click', () => {
    playSE('confirm');
    if (resultScreen) resultScreen.style.display = 'none';
    if (startScreen) startScreen.style.display = 'flex';
    currentScreen = 'start';
    updateGlobalBackButton();
    stopBGM();

    game.scene.stop('MainScene');
    game.scene.start('BootScene');
  });
}

// Config Modal Handlers (Pause & Resume Game Scene)
const configBtns = [
  document.getElementById('config-btn'),
  document.getElementById('start-config-btn'),
];
configBtns.forEach((btn) => {
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSE('cursor');
      document.getElementById('config-modal')?.classList.add('active');
      document.getElementById('modal-overlay')?.classList.add('active');
      if (typeof game !== 'undefined') {
        const scene = game.scene.getScene('MainScene');
        if (scene && scene.scene.isActive()) scene.scene.pause();
      }
    });
  }
});

const closeCfgBtn = document.getElementById('close-config-btn-x');
if (closeCfgBtn) {
  closeCfgBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    document.getElementById('config-modal')?.classList.remove('active');
    document.getElementById('modal-overlay')?.classList.remove('active');
    if (typeof game !== 'undefined') {
      const scene = game.scene.getScene('MainScene');
      if (scene && scene.scene.isPaused()) scene.scene.resume();
    }
  });
}

const modalOverlay = document.getElementById('modal-overlay');
if (modalOverlay) {
  modalOverlay.addEventListener('click', () => {
    if (typeof game !== 'undefined') {
      const scene = game.scene.getScene('MainScene');
      if (scene && scene.scene.isPaused()) scene.scene.resume();
    }
  });
}
