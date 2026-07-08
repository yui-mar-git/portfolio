/**
 * ==========================================
 * タワーディフェンス・横スクロール・基礎ロジック
 * ==========================================
 */

const STORAGE_KEY = 'td_save_data';
let saveData = {
  gold: 0,
  clearedStage: 0,
  levels: { sword: 1, shield: 1, mage: 1, butouka: 1, base: 1 }
};

function loadSaveData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { saveData = { ...saveData, ...JSON.parse(saved) }; } catch (e) { }
  }
  if (!saveData.levels) saveData.levels = { sword: 1, shield: 1, mage: 1, butouka: 1, base: 1 };
  const legacyBase = saveData.levels.base || 1;
  ['sword', 'shield', 'mage', 'butouka'].forEach(type => {
    if (!saveData.levels[type]) saveData.levels[type] = 1;
  });
  ['baseHp', 'baseStats', 'baseCost', 'baseGold'].forEach(type => {
    if (!saveData.levels[type]) saveData.levels[type] = legacyBase;
  });
  updateMapUI();
  updateUpgradeUI();
  updateDeckUI();
}

function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  updateMapUI();
  updateUpgradeUI();
  updateDeckUI();
}

const BASE_UNIT_DB = {
  'sword': { cost: 130, hp: 100, attack: 20, cooldown: 666, speed: 50, range: 80, texture: 'unit_sword', height: 80, attackSE: 'strike' },
  'shield': { cost: 50, hp: 200, attack: 20, cooldown: 1000, speed: 30, range: 60, texture: 'unit_shield', height: 90, attackSE: 'smite' },
  'mage': { cost: 90, hp: 30, attack: 15, cooldown: 3000, speed: 25, range: 200, texture: 'unit_mage', height: 80, attackSE: 'energyball' },
  'butouka': { cost: 20, hp: 50, attack: 15, cooldown: 333, speed: 80, range: 60, texture: 'unit_butouka', height: 70, attackSE: 'strike' }
};

function getUnitData(type) {
  const base = BASE_UNIT_DB[type];
  const lv = saveData.levels[type] || 1;
  const baseStatsLv = saveData.levels['baseStats'] || 1;
  const globalBuff = 1 + (baseStatsLv - 1) * 0.05;
  return {
    ...base,
    originalType: type,
    hp: Math.floor(base.hp * (1 + (lv - 1) * 0.2) * globalBuff),
    attack: Math.floor(base.attack * (1 + (lv - 1) * 0.2) * globalBuff)
  };
}

let コスト = 0;
const コストDisplay = document.getElementById('コスト-display');
const waveDisplay = document.getElementById('wave-display');
const goldDisplay = document.getElementById('gold-display');
const btnSpawnSword = document.getElementById('btn-spawn-sword');
const btnSpawnShield = document.getElementById('btn-spawn-shield');
const btnSpawnMage = document.getElementById('btn-spawn-mage');
const btnSpawnButouka = document.getElementById('btn-spawn-butouka');

function updateDeckUI() {
  ['sword', 'shield', 'mage', 'butouka'].forEach(type => {
    const data = getUnitData(type);
    const hpEl = document.getElementById(`stat-${type}-hp`);
    const atkEl = document.getElementById(`stat-${type}-atk`);
    if (hpEl) hpEl.textContent = data.hp;
    if (atkEl) atkEl.textContent = data.attack;
  });
  if (goldDisplay) goldDisplay.textContent = saveData.gold;

  const btnSword = document.getElementById('btn-spawn-sword');
  const btnButouka = document.getElementById('btn-spawn-butouka');
  if (btnButouka) btnButouka.style.display = saveData.clearedStage >= 1 ? '' : 'none';
  if (btnSword) btnSword.style.display = saveData.clearedStage >= 2 ? '' : 'none';
}

function updateMapUI() {
  const btnRetire = document.getElementById('btn-retire');
  if (btnRetire) btnRetire.style.display = 'none';
  const mapGold = document.getElementById('map-gold');
  if (mapGold) mapGold.textContent = saveData.gold;

  const btnStage1 = document.getElementById('btn-stage1');
  const btnStage2 = document.getElementById('btn-stage2');
  const btnStage3 = document.getElementById('btn-stage3');

  if (btnStage1) {
    btnStage1.className = saveData.clearedStage >= 1 ? 'btn btn-primary' : 'btn btn-stage';
  }

  if (btnStage2) {
    const isUnlocked = saveData.clearedStage >= 1;
    const isCleared = saveData.clearedStage >= 2;
    if (isCleared) btnStage2.className = 'btn btn-primary';
    else if (isUnlocked) btnStage2.className = 'btn btn-stage';
    else btnStage2.className = 'btn btn-stage locked';
    btnStage2.disabled = !isUnlocked;
  }

  if (btnStage3) {
    const isUnlocked = saveData.clearedStage >= 2;
    const isCleared = saveData.clearedStage >= 3;
    if (isCleared) btnStage3.className = 'btn btn-primary';
    else if (isUnlocked) btnStage3.className = 'btn btn-stage';
    else btnStage3.className = 'btn btn-stage locked';
    btnStage3.disabled = !isUnlocked;
  }
}

function updateUpgradeUI() {
  const upgGold = document.getElementById('upgrade-gold-display');
  if (upgGold) upgGold.textContent = saveData.gold;

  ['sword', 'shield', 'mage', 'butouka'].forEach(type => {
    const lv = saveData.levels[type];
    const cost = lv * 100;
    const data = getUnitData(type);

    const lvEl = document.getElementById(`lv-${type}`);
    const costEl = document.getElementById(`cost-${type}`);
    const hpEl = document.getElementById(`upg-hp-${type}`);
    const atkEl = document.getElementById(`upg-atk-${type}`);
    const spdEl = document.getElementById(`upg-spd-${type}`);
    const btnUpg = document.getElementById(`btn-upg-${type}`);

    if (lvEl) lvEl.textContent = lv;
    if (costEl) costEl.textContent = cost;
    if (hpEl) hpEl.textContent = data.hp;
    if (atkEl) atkEl.textContent = data.attack;
    if (spdEl) spdEl.textContent = data.speed;
    if (btnUpg) {
      btnUpg.disabled = saveData.gold < cost;
      btnUpg.onclick = () => {
        if (saveData.gold >= cost) {
          saveData.gold -= cost;
          saveData.levels[type]++;
          playSE('confirm');
          saveGame();
        }
      };
    }
  });

  // Base Upgrade
  ['baseHp', 'baseStats', 'baseCost', 'baseGold'].forEach(type => {
    const baseLv = saveData.levels[type] || 1;
    const baseCost = Math.floor(500 * Math.pow(1.05, baseLv - 1));
    const kebab = type.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
    const upgLv = document.getElementById(`upg-lv-${kebab}`);
    const upgCost = document.getElementById(`cost-${kebab}`);
    const btnUpg = document.getElementById(`btn-upg-${kebab}`);

    if (upgLv) upgLv.textContent = baseLv;
    if (upgCost) upgCost.textContent = baseCost;
    if (btnUpg) {
      btnUpg.disabled = saveData.gold < baseCost;
      btnUpg.onclick = () => {
        if (saveData.gold >= baseCost) {
          saveData.gold -= baseCost;
          saveData.levels[type]++;
          playSE('confirm');
          saveGame();
          updateUpgradeUI();
        }
      };
    }
  });

  const upgButouka = document.getElementById('upg-container-butouka');
  const upgSword = document.getElementById('upg-container-sword');
  if (upgButouka) upgButouka.style.display = saveData.clearedStage >= 1 ? '' : 'none';
  if (upgSword) upgSword.style.display = saveData.clearedStage >= 2 ? '' : 'none';
}

// Audio setup
let configBgmVolume = 0.1;
let configSeVolume = 0.5;
let currentBgmAudio = null;
let currentJingleAudio = null;

import seCursor from '../../assets/games/tower-defense/audio/se/カーソル移動7.mp3';
import seConfirm from '../../assets/games/tower-defense/audio/se/決定ボタンを押す2.mp3';
import seCancel from '../../assets/games/tower-defense/audio/se/キャンセル1.mp3';
import seInvalid from '../../assets/games/tower-defense/audio/se/ビープ音4.mp3';
import seStrike from '../../assets/games/tower-defense/audio/se/剣で斬る2.mp3';
import seSmite from '../../assets/games/tower-defense/audio/se/打撃6.mp3';
import sePunch from '../../assets/games/tower-defense/audio/se/小パンチ.mp3';
import seMagic from '../../assets/games/tower-defense/audio/se/風魔法1.mp3';
import seEnergyBall from '../../assets/games/tower-defense/audio/se/気弾1.mp3';
import seVictory from '../../assets/games/tower-defense/audio/se/maou_game_jingle01.mp3';
import seDefeat from '../../assets/games/tower-defense/audio/se/maou_game_jingle08.mp3';
import seWaveNext from '../../assets/games/tower-defense/audio/se/決定ボタンを押す33.mp3';

import bgmWave1 from '../../assets/games/tower-defense/audio/bgm/maou_game_field05.mp3';
import bgmWave2 from '../../assets/games/tower-defense/audio/bgm/maou_game_field11.mp3';
import bgmWave3 from '../../assets/games/tower-defense/audio/bgm/maou_game_boss02.mp3';

const SE_DB = {
  'cursor': seCursor,
  'confirm': seConfirm,
  'cancel': seCancel,
  'invalid': seInvalid,
  'strike': seStrike,
  'smite': seSmite,
  'punch': sePunch,
  'magic': seMagic,
  'energyball': seEnergyBall,
  'victory': seVictory,
  'defeat': seDefeat,
  'wave_next': seWaveNext
};

const BGM_DB = {
  'wave1': bgmWave1,
  'wave2': bgmWave2,
  'wave3': bgmWave3
};

function playSE(key) {
  if (!SE_DB[key]) return;
  const audio = new Audio(SE_DB[key]);
  audio.volume = configSeVolume;
  if (key === 'victory' || key === 'defeat') {
    if (currentJingleAudio) {
      currentJingleAudio.pause();
      currentJingleAudio.currentTime = 0;
    }
    currentJingleAudio = audio;
  }
  audio.play().catch(e => console.log('SE play failed:', e));
  return audio;
}

function playBGM(bgmId) {
  if (currentBgmAudio) currentBgmAudio.pause();
  if (!bgmId || !BGM_DB[bgmId]) return;
  currentBgmAudio = new Audio(BGM_DB[bgmId]);
  currentBgmAudio.volume = configBgmVolume;
  currentBgmAudio.loop = true;
  currentBgmAudio.play().catch(e => console.log('BGM Play blocked:', e));
}

function stopBGM() {
  if (currentBgmAudio) currentBgmAudio.pause();
}

let activeStage = 1;

import imgUnitSword from '../../assets/games/tower-defense/images/unit/figure_rpg_character_yuusya.png';
import imgUnitShield from '../../assets/games/tower-defense/images/unit/figure_rpg_character_kenshi.png';
import imgUnitMage from '../../assets/games/tower-defense/images/unit/figure_rpg_character_mahoutsukai.png';
import imgUnitButouka from '../../assets/games/tower-defense/images/unit/figure_rpg_character_butouka.png';
import imgEnemySlime from '../../assets/games/tower-defense/images/enemy/fantasy_game_character_slime.png';
import imgEnemyGoblin from '../../assets/games/tower-defense/images/enemy/fantasy_goblin.png';
import imgEnemyOgre from '../../assets/games/tower-defense/images/enemy/fantasy_ogre.png';
import imgEnemyOrc from '../../assets/games/tower-defense/images/enemy/fantasy_orc.png';

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }
  create() {
    // マップ画面など、ゲーム外の時はこの空のシーンを回しておく
    this.cameras.main.setBackgroundColor('#1a1a2e');
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image('unit_sword', imgUnitSword.src);
    this.load.image('unit_shield', imgUnitShield.src);
    this.load.image('unit_mage', imgUnitMage.src);
    this.load.image('unit_butouka', imgUnitButouka.src);

    this.load.image('enemy_slime', imgEnemySlime.src);
    this.load.image('enemy_goblin', imgEnemyGoblin.src);
    this.load.image('enemy_ogre', imgEnemyOgre.src);
    this.load.image('enemy_orc', imgEnemyOrc.src);
  }

  create() {
    let skyColor = '#87CEEB';
    let groundColor = 0x228B22;

    if (activeStage === 2) {
      skyColor = '#FF7F50'; // 夕方（コーラル）
      groundColor = 0x6B5E2F; // 夕日に照らされた地面
    } else if (activeStage === 3) {
      skyColor = '#191970'; // 夜（ミッドナイトブルー）
      groundColor = 0x1A2A1A; // 暗い地面
    }

    this.cameras.main.setBackgroundColor(skyColor);
    const ground = this.add.rectangle(400, 515, 800, 170, groundColor);

    // 簡易的な拠点のグラフィック（塔と入り口）
    const towerColor = 0x8B4513; // 茶色
    const towerLineColor = 0x4A2511;

    // 塔本体
    const baseTower = this.add.rectangle(0, 430, 90, 240, towerColor);
    baseTower.setOrigin(0, 1);
    baseTower.setStrokeStyle(2, towerLineColor);

    // せり出し部分（バルコニー状）
    const baseOverhang = this.add.rectangle(0, 190, 110, 20, towerColor);
    baseOverhang.setOrigin(0, 1);
    baseOverhang.setStrokeStyle(2, towerLineColor);

    // 塔頭（塔本体と同じ幅）
    const baseTop = this.add.rectangle(0, 170, 90, 40, towerColor);
    baseTop.setOrigin(0, 1);
    baseTop.setStrokeStyle(2, towerLineColor);

    // 入り口
    const baseEntrance = this.add.rectangle(50, 430, 50, 70, 0x111111);
    baseEntrance.setOrigin(0.5, 1);

    // Generate projectile texture if not exists
    if (!this.textures.exists('magic_orb')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x88ccff, 1); g.fillCircle(10, 10, 10);
      g.fillStyle(0xffffff, 0.8); g.fillCircle(10, 10, 5);
      g.generateTexture('magic_orb', 20, 20);
      
      const gSlashD = this.make.graphics({ x: 0, y: 0, add: false });
      gSlashD.lineStyle(4, 0xffffff, 1);
      gSlashD.beginPath(); gSlashD.moveTo(0,0); gSlashD.lineTo(30,30); gSlashD.strokePath();
      gSlashD.generateTexture('fx_slash', 30, 30);
      
      const gBurst = this.make.graphics({ x: 0, y: 0, add: false });
      gBurst.fillStyle(0xffaa00, 1); gBurst.fillCircle(10, 10, 10);
      gBurst.fillStyle(0xffffff, 0.9); gBurst.fillCircle(10, 10, 5);
      gBurst.generateTexture('fx_burst', 20, 20);
      
      const gSlashL = this.make.graphics({ x: 0, y: 0, add: false });
      gSlashL.lineStyle(8, 0x00ffff, 1);
      gSlashL.beginPath(); gSlashL.moveTo(0, 10); gSlashL.lineTo(100, 10); gSlashL.strokePath();
      gSlashL.generateTexture('fx_slash_long', 100, 20);
    }

    this.allies = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();

    this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHit, null, this);

    const baseCostLv = saveData.levels?.baseCost || 1;
    const costBuff = 1 + (baseCostLv - 1) * 0.05;
    const baseHpLv = saveData.levels?.baseHp || 1;

    this.currentWave = 1;
    this.maxWaves = activeStage === 3 ? 3 : (activeStage === 2 ? 2 : 1);
    this.enemiesSpawned = 0;
    this.enemiesToSpawn = 10;
    コスト = Math.floor(100 * costBuff);
    this.isGameOver = false;

    this.maxBaseHp = 3 + (baseHpLv - 1);
    this.currentBaseHp = this.maxBaseHp;

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.isGameOver) return;
        コスト += Math.floor(10 * costBuff);
        this.updateUI();
      },
      loop: true
    });

    this.spawnTimer = this.time.addEvent({
      delay: 3000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    const spawnAlly = (type) => {
      if (this.isGameOver) return;
      const unit = getUnitData(type);
      const currentCost = this.getCurrentUnitCost(type);
      if (コスト >= currentCost) {
        コスト -= currentCost;
        this.createAlly(unit);
        playSE('confirm');
        this.updateUI();
      } else {
        playSE('invalid');
      }
    };

    if (btnSpawnSword) btnSpawnSword.onclick = () => spawnAlly('sword');
    if (btnSpawnShield) btnSpawnShield.onclick = () => spawnAlly('shield');
    if (btnSpawnMage) btnSpawnMage.onclick = () => spawnAlly('mage');
    if (btnSpawnButouka) btnSpawnButouka.onclick = () => spawnAlly('butouka');

    this.updateUI();
    this.startWave(1, false);
    this.scene.pause();
  }

  startWave(wave, showCutin = true) {
    this.currentWave = wave;
    this.enemiesSpawned = 0;
    this.isWaveTransitioning = false;

    let bgm = 'wave1';
    if (activeStage === 2) {
      bgm = wave === 1 ? 'wave1' : 'wave2';
    } else if (activeStage === 3) {
      bgm = wave === 1 ? 'wave1' : (wave === 2 ? 'wave2' : 'wave3');
    }

    if (activeStage === 1) {
      this.enemiesToSpawn = 15;
      this.spawnTimer.delay = 2000;
    } else if (activeStage === 2) {
      this.enemiesToSpawn = wave === 1 ? 15 : 25;
      this.spawnTimer.delay = wave === 1 ? 2000 : 1500;
    } else if (activeStage === 3) {
      if (wave === 1) { this.enemiesToSpawn = 15; this.spawnTimer.delay = 2000; }
      else if (wave === 2) { this.enemiesToSpawn = 25; this.spawnTimer.delay = 1500; }
      else { this.enemiesToSpawn = 1; this.spawnTimer.delay = 5000; } // Boss
    }

    if (waveDisplay) waveDisplay.textContent = `${this.currentWave} / ${this.maxWaves}`;

    if (showCutin) {
      playSE('wave_next');
      this.scene.pause();
      const cutinContainer = document.getElementById('wave-cutin');
      const cutinText = document.getElementById('wave-cutin-text');
      if (cutinContainer && cutinText) {
        cutinContainer.classList.remove('slide-out');
        cutinContainer.style.display = 'flex';
        void cutinContainer.offsetWidth; // Force reflow
        cutinContainer.classList.add('active');
        cutinText.textContent = `WAVE ${wave}`;
        this.nextBgm = bgm;
      } else {
        playBGM(bgm);
        this.scene.resume();
      }
    }
  }

  update(time, delta) {
    if (this.isGameOver) return;

    this.allies.getChildren().forEach(ally => {
      let targets = [];
      let minDistance = Infinity;
      let targetEnemy = null;
      
      this.enemies.getChildren().forEach(enemy => {
        if (!enemy.active) return;
        const dist = enemy.x - ally.x;
        if (dist > 0 && dist <= ally.unitData.range) {
          targets.push(enemy);
          if (dist < minDistance) {
            minDistance = dist;
            targetEnemy = enemy;
          }
        }
      });

      if (targetEnemy) {
        ally.state = 'attack';
        ally.body.setVelocityX(0);
        if (ally.unitData.texture === 'unit_sword') {
          this.performAttack(ally, targets, time, 'ally');
        } else {
          this.performAttack(ally, targetEnemy, time, 'ally');
        }
      } else {
        const stopX = (ally.unitData.texture === 'unit_mage') ? 450 : 600;
        if (ally.x >= stopX) {
          ally.state = 'idle';
          ally.body.setVelocityX(0);
        } else {
          ally.state = 'walk';
          ally.body.setVelocityX(ally.unitData.speed);
        }
      }
    });

    this.enemies.getChildren().forEach(enemy => {
      let targetAlly = null;
      let minDistance = Infinity;
      let targets = [];
      this.allies.getChildren().forEach(ally => {
        if (!ally.active) return;
        const dist = enemy.x - ally.x;
        if (dist > 0 && dist <= 60) {
          targets.push(ally);
          if (dist < minDistance) {
            minDistance = dist;
            targetAlly = ally;
          }
        }
      });

      if (targetAlly) {
        enemy.state = 'attack';
        enemy.body.setVelocityX(0);
        if (enemy.texture.key === 'enemy_ogre' || enemy.texture.key === 'enemy_orc') {
          this.performAttack(enemy, targets, time, 'enemy');
        } else {
          this.performAttack(enemy, targetAlly, time, 'enemy');
        }
      } else {
        enemy.state = 'walk';
        enemy.body.setVelocityX(-enemy.speed);
      }
    });

    this.allies.getChildren().forEach(ally => {
      if (ally.x > 850) ally.destroy();
    });

    this.projectiles.getChildren().forEach(proj => {
      if (proj.x > 850) proj.destroy();
    });

    this.enemies.getChildren().forEach(enemy => {
      if (enemy.x < 0) {
        enemy.destroy();
        this.currentBaseHp -= 1;
        playSE('smite');
        this.updateUI();
        if (this.currentBaseHp <= 0) {
          this.triggerGameOver(false);
        } else {
          this.checkWaveProgress();
        }
      }
    });
  }

  updateUI() {
    if (コストDisplay) コストDisplay.textContent = Math.floor(コスト);
    const baseHpDisplay = document.getElementById('base-hp-display');
    if (baseHpDisplay) baseHpDisplay.textContent = `${this.currentBaseHp} / ${this.maxBaseHp}`;
    if (goldDisplay) goldDisplay.textContent = saveData.gold;
    
    ['sword', 'shield', 'mage', 'butouka'].forEach(type => {
      const btnEl = document.getElementById(`btn-spawn-${type}`);
      const costEl = document.getElementById(`deck-cost-${type}`);
      const currentCost = this.getCurrentUnitCost(type);
      if (costEl) costEl.textContent = currentCost;
      if (btnEl) btnEl.disabled = (コスト < currentCost);
    });
  }

  getCurrentUnitCost(type) {
    const baseUnit = getUnitData(type);
    let activeCount = 0;
    if (this.allies) {
      this.allies.getChildren().forEach(ally => {
        if (ally.active && ally.unitData && ally.unitData.originalType === type) {
          activeCount++;
        }
      });
    }
    const multiplier = 1 + (activeCount * 0.2); // +20% cost per active unit
    return Math.floor(baseUnit.cost * multiplier);
  }

  createAlly(unitData) {
    const ally = this.add.image(50, 430, unitData.texture);
    ally.setOrigin(0.5, 1);
    ally.displayHeight = unitData.height || 80;
    ally.scaleX = ally.scaleY;
    this.physics.add.existing(ally);
    ally.unitData = unitData;
    ally.hp = unitData.hp;
    ally.lastAttackTime = 0;
    ally.state = 'walk';
    this.allies.add(ally);
  }

  spawnEnemy() {
    if (this.isGameOver) return;
    if (this.enemiesSpawned >= this.enemiesToSpawn) return;

    let hp = 30;
    let attack = 10;
    let speed = 20;
    let height = 80;
    let cooldown = 1500;
    let textureKey = 'enemy_slime';
    let attackSE = 'punch';
    let isBoss = false;

    const isFinalWave = (this.currentWave === this.maxWaves);
    const spawnBossNow = (isFinalWave && this.enemiesSpawned === this.enemiesToSpawn - 1);

    if (activeStage === 2) {
      if (spawnBossNow) {
        hp = 1000; attack = 40; speed = 20; height = 160; textureKey = 'enemy_ogre'; attackSE = 'smite'; cooldown = 2000;
        isBoss = true;
      } else {
        if (Math.random() < 0.5) {
          hp = 40; attack = 15; textureKey = 'enemy_goblin'; speed = 40; cooldown = 1000; height = 80;
        }
      }
    } else if (activeStage === 3) {
      if (spawnBossNow) {
        hp = 3500; attack = 60; speed = 20; height = 160; textureKey = 'enemy_orc'; attackSE = 'smite'; cooldown = 2000;
        isBoss = true;
      } else {
        hp = 40; attack = 15; textureKey = 'enemy_goblin'; speed = 40; cooldown = 1000; height = 80;
      }
    }

    if (!isBoss) {
      const stageBuff = 1 + (activeStage - 1) * 0.5;
      hp = Math.floor(hp * stageBuff);
      attack = Math.floor(attack * stageBuff);
    }

    const enemy = this.add.image(850, 430, textureKey);
    enemy.setOrigin(0.5, 1);
    if (textureKey === 'enemy_slime') enemy.y += 10;
    enemy.displayHeight = height;
    enemy.scaleX = enemy.scaleY;
    this.physics.add.existing(enemy);
    enemy.hp = hp;
    enemy.attackPower = attack;
    enemy.speed = speed;
    enemy.cooldown = cooldown;
    enemy.lastAttackTime = 0;
    enemy.state = 'walk';
    enemy.attackSE = attackSE;

    this.enemies.add(enemy);
    this.enemiesSpawned++;
  }

  performAttack(attacker, defenderOrDefenders, time, type) {
    const cooldown = type === 'ally' ? attacker.unitData.cooldown : (attacker.cooldown || 1500);
    const attackPower = type === 'ally' ? attacker.unitData.attack : attacker.attackPower;
    
    if (time - attacker.lastAttackTime > cooldown) {
      attacker.lastAttackTime = time;
      playSE(attacker.attackSE || (attacker.unitData && attacker.unitData.attackSE) || 'punch');

      let targets = Array.isArray(defenderOrDefenders) ? defenderOrDefenders : [defenderOrDefenders];

      if (type === 'ally') {
        const tex = attacker.unitData.texture;
        if (tex === 'unit_mage') {
          const proj = this.projectiles.create(attacker.x, attacker.y - 40, 'magic_orb');
          proj.body.setVelocityX(600);
          proj.body.setAllowGravity(false);
          proj.attackPower = attackPower;
          proj.hitEnemies = new Set();
          return;
        } else if (tex === 'unit_sword') {
          const fx = this.add.image(attacker.x + 50, attacker.y - 40, 'fx_slash_long');
          this.tweens.add({ targets: fx, alpha: 0, scaleX: 1.5, duration: 200, onComplete: () => fx.destroy() });
        } else if (tex === 'unit_shield') {
          const fx = this.add.image(attacker.x + 30, attacker.y - 40, 'fx_slash');
          this.tweens.add({ targets: fx, alpha: 0, scale: 1.2, duration: 150, onComplete: () => fx.destroy() });
        } else if (tex === 'unit_butouka') {
          for(let i=0; i<3; i++) {
            this.time.delayedCall(i * 50, () => {
              if (!attacker.active) return;
              const fx = this.add.image(attacker.x + 20 + Math.random()*20, attacker.y - 20 - Math.random()*30, 'fx_burst');
              this.tweens.add({ targets: fx, alpha: 0, scale: 1.5, duration: 100, onComplete: () => fx.destroy() });
            });
          }
        }
      }

      targets.forEach(defender => {
        if (!defender || !defender.active) return;
        defender.hp -= attackPower;

        if (type === 'ally') {
          defender.setTintFill(0xFFFFFF); // Enemy flashes white
        } else {
          defender.setTintFill(0xFF0000); // Ally flashes red
        }
        
        this.time.delayedCall(100, () => { 
          if (defender.active) defender.clearTint();
        });

        if (defender.hp <= 0) {
          defender.destroy();
          if (type === 'ally') {
            const costBuff = 1 + ((saveData.levels?.baseCost || 1) - 1) * 0.05;
            コスト += Math.floor(20 * costBuff);
            const goldBuff = (saveData.levels?.baseGold || 1) - 1;
            saveData.gold += 10 + goldBuff * 2;
            saveGame();
            this.updateUI();
            this.checkWaveProgress();
          } else {
            // 味方が倒されたのでコストUIなどを更新する
            this.updateUI();
          }
        }
      });
    }
  }

  handleProjectileHit(projectile, enemy) {
    if (!enemy.active) return;
    if (projectile.hitEnemies.has(enemy)) return;

    projectile.hitEnemies.add(enemy);
    enemy.hp -= projectile.attackPower;
    
    enemy.setTintFill(0xFFFFFF);
    this.time.delayedCall(100, () => { 
       if (enemy.active) enemy.clearTint();
    });

    if (enemy.hp <= 0) {
      enemy.destroy();
      const costBuff = 1 + ((saveData.levels?.baseCost || 1) - 1) * 0.05;
      コスト += Math.floor(20 * costBuff);
      const goldBuff = (saveData.levels?.baseGold || 1) - 1;
      saveData.gold += 10 + goldBuff * 2;
      saveGame();
      this.updateUI();
      this.checkWaveProgress();
    }
  }

  checkWaveProgress() {
    if (this.isWaveTransitioning) return;
    if (this.enemiesSpawned >= this.enemiesToSpawn && this.enemies.countActive() === 0) {
      this.isWaveTransitioning = true;
      this.time.delayedCall(3000, () => {
        if (this.isGameOver) return;
        this.isWaveTransitioning = false;
        if (this.currentWave < this.maxWaves) {
          this.startWave(this.currentWave + 1, true);
        } else {
          this.triggerGameOver(true);
        }
      });
    }
  }

  triggerGameOver(isWin) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.scene.pause();
    stopBGM();

    const resultScreen = document.getElementById('result-screen');
    const title = resultScreen.querySelector('h2');
    const msg = document.getElementById('result-message');

    if (isWin) {
      title.textContent = 'STAGE CLEAR!!';
      title.className = 'result-win';
      playSE('victory');

      let reward = activeStage * 200;
      saveData.gold += reward;
      saveData.clearedStage = Math.max(saveData.clearedStage, activeStage);
      saveGame();
      msg.textContent = `${reward} G 獲得！`;
    } else {
      title.textContent = 'ゲームオーバー';
      title.className = 'result-lose';
      playSE('defeat');
      msg.textContent = `防衛に失敗しました...`;
    }
    resultScreen.style.display = 'flex';
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [BootScene, MainScene]
};

if (window.tdGameInstance) {
  window.tdGameInstance.destroy(true);
}
window.tdGameInstance = new Phaser.Game(config);
const game = window.tdGameInstance;


// Initial Load
loadSaveData();

// Screen State
let currentScreen = 'start'; // 'start', 'map', 'upgrade', 'game'
function updateGlobalBackButton() {
  const backBtn = document.getElementById('global-back-btn');
  if (!backBtn) return;
  if (currentScreen === 'start') {
    backBtn.style.display = 'none';
  } else {
    backBtn.style.display = 'flex';
  }
}

// DOM Elements
const startScreen = document.getElementById('start-screen');
const mapScreen = document.getElementById('map-screen');
const upgradeScreen = document.getElementById('upgrade-screen');
const resultScreen = document.getElementById('result-screen');

// Global Back Button
document.getElementById('global-back-btn').addEventListener('click', () => {
  playSE('cancel');
  if (currentScreen === 'map') {
    mapScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    currentScreen = 'start';
    updateGlobalBackButton();
  } else if (currentScreen === 'upgrade') {
    upgradeScreen.style.display = 'none';
    mapScreen.style.display = 'flex';
    currentScreen = 'map';
    updateMapUI();
    updateGlobalBackButton();
  } else if (currentScreen === 'game') {
    const scene = game.scene.getScene('MainScene');
    if (scene) scene.scene.pause();
    document.getElementById('retire-modal').style.display = 'flex';
  }
});

// Start -> Map
document.getElementById('start-btn').addEventListener('click', () => {
  playSE('confirm');
  startScreen.style.display = 'none';
  mapScreen.style.display = 'flex';
  currentScreen = 'map';
  updateGlobalBackButton();
  updateMapUI();
});

// Reset Save Data
const resetConfirmModal = document.getElementById('reset-confirm-modal');
document.getElementById('reset-save-btn').addEventListener('click', () => {
  playSE('cursor');
  if (resetConfirmModal) resetConfirmModal.classList.add('active');
});

document.getElementById('btn-reset-cancel').addEventListener('click', () => {
  playSE('cancel');
  if (resetConfirmModal) resetConfirmModal.classList.remove('active');
});

document.getElementById('btn-reset-execute').addEventListener('click', () => {
  playSE('confirm');
  localStorage.removeItem(STORAGE_KEY);
  saveData = {
    gold: 0,
    clearedStage: 0,
    levels: { sword: 1, shield: 1, mage: 1, butouka: 1, base: 1 }
  };
  location.reload();
});

// Map -> Upgrade
document.getElementById('btn-to-upgrade').addEventListener('click', () => {
  playSE('confirm');
  mapScreen.style.display = 'none';
  upgradeScreen.style.display = 'flex';
  currentScreen = 'upgrade';
  updateGlobalBackButton();
  updateUpgradeUI();
});

// Start Stage
function startGame(stageNumber) {
  playSE('confirm');
  activeStage = stageNumber;
  currentScreen = 'game';
  updateGlobalBackButton();
  mapScreen.style.display = 'none';
  
  game.scene.start('MainScene');
  setTimeout(() => {
    const scene = game.scene.getScene('MainScene');
    if (scene) {
      scene.startWave(1, true);
    }
  }, 100);
}
document.getElementById('btn-stage1').addEventListener('click', () => startGame(1));
document.getElementById('btn-stage2').addEventListener('click', () => startGame(2));
document.getElementById('btn-stage3').addEventListener('click', () => startGame(3));

const bry = document.getElementById('btn-retire-yes');
if (bry) bry.addEventListener('click', () => {
  playSE('confirm');
  document.getElementById('retire-modal').style.display = 'none';
  document.getElementById('modal-overlay')?.classList.remove('active');
  returnToMapFromGame();
});

const brn = document.getElementById('btn-retire-no');
if (brn) brn.addEventListener('click', () => {
  playSE('cursor');
  document.getElementById('retire-modal').style.display = 'none';
  document.getElementById('modal-overlay')?.classList.remove('active');
  const scene = game.scene.getScene('MainScene');
  if (scene) scene.scene.resume();
});

    const btnWaveOk = document.getElementById('btn-wave-ok');
    if (btnWaveOk) {
      btnWaveOk.addEventListener('click', () => {
        playSE('confirm');
        const cutinContainer = document.getElementById('wave-cutin');
        if (cutinContainer) {
          cutinContainer.classList.add('slide-out');
          setTimeout(() => {
            cutinContainer.classList.remove('active');
            cutinContainer.classList.remove('slide-out');
            cutinContainer.style.display = 'none';

            const scene = game.scene.getScene('MainScene');
            if (scene) {
              if (scene.nextBgm) playBGM(scene.nextBgm);
              scene.scene.resume();
            }
          }, 400); // Wait for transition
        }
      });
    }

function returnToMapFromGame() {
  document.getElementById('result-screen').style.display = 'none';
  mapScreen.style.display = 'flex';
  currentScreen = 'map';
  updateGlobalBackButton();
  stopBGM();
  if (typeof game !== 'undefined') {
    game.scene.stop('MainScene');
    game.scene.start('BootScene');
  }
  updateMapUI();
}

// Result screen buttons
document.getElementById('btn-retry').addEventListener('click', () => {
  playSE('confirm');
  if (currentJingleAudio) {
    currentJingleAudio.pause();
    currentJingleAudio.currentTime = 0;
  }
  resultScreen.style.display = 'none';
  startGame(activeStage);
});

document.getElementById('btn-title').addEventListener('click', () => {
  playSE('cancel');
  if (currentJingleAudio) {
    currentJingleAudio.pause();
    currentJingleAudio.currentTime = 0;
  }
  returnToMapFromGame();
});

document.getElementById('btn-share').addEventListener('click', () => {
  const text = encodeURIComponent('タワーディフェンスで遊びました！\n#ミニゲーム #ポートフォリオ');
  const url = encodeURIComponent(window.location.href);
  window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + url, '_blank');
});

// Modals config
const _cfgBtns = document.querySelectorAll('.icon-config');
_cfgBtns.forEach(btn => {
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
  btn.addEventListener('mousedown', (e) => e.stopPropagation());
  btn.addEventListener('touchstart', (e) => e.stopPropagation());
});
const _closeCfgBtn = document.getElementById('close-config-btn');
if (_closeCfgBtn) {
  _closeCfgBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    document.getElementById('config-modal')?.classList.remove('active');
    document.getElementById('modal-overlay')?.classList.remove('active');
    if (typeof game !== 'undefined') {
      const scene = game.scene.getScene('MainScene');
      if (scene && scene.scene.isPaused()) scene.scene.resume();
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
const _closeCredBtn = document.getElementById('close-credits-btn');
if (_closeCredBtn) {
  _closeCredBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    document.getElementById('credits-modal')?.classList.remove('active');
    document.getElementById('modal-overlay')?.classList.remove('active');
  });
  _closeCredBtn.addEventListener('mousedown', (e) => e.stopPropagation());
  _closeCredBtn.addEventListener('touchstart', (e) => e.stopPropagation());
}

const howtoBtn = document.getElementById('howto-btn');
const closeHowtoBtn = document.getElementById('close-howto-btn');
if (howtoBtn) {
  howtoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    document.getElementById('howto-modal')?.classList.add('active');
    document.getElementById('modal-overlay')?.classList.add('active');
    if (typeof game !== 'undefined') {
      const scene = game.scene.getScene('MainScene');
      if (scene && scene.scene.isActive()) scene.scene.pause();
    }
  });
}

if (closeHowtoBtn) {
  closeHowtoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSE('cursor');
    document.getElementById('howto-modal')?.classList.remove('active');
    document.getElementById('modal-overlay')?.classList.remove('active');
    if (typeof game !== 'undefined') {
      const scene = game.scene.getScene('MainScene');
      if (scene && scene.scene.isPaused()) scene.scene.resume();
    }
  });
}

document.addEventListener('click', (e) => {
  const tabBtnUnit = e.target.closest('#tab-btn-unit');
  const tabBtnBase = e.target.closest('#tab-btn-base');
  
  if (tabBtnUnit) {
    playSE('cursor');
    tabBtnUnit.className = 'btn btn-primary';
    document.getElementById('tab-btn-base').className = 'btn btn-secondary';
    document.getElementById('tab-content-unit').style.display = '';
    document.getElementById('tab-content-base').style.display = 'none';
    return;
  } else if (tabBtnBase) {
    playSE('cursor');
    tabBtnBase.className = 'btn btn-primary';
    document.getElementById('tab-btn-unit').className = 'btn btn-secondary';
    document.getElementById('tab-content-base').style.display = '';
    document.getElementById('tab-content-unit').style.display = 'none';
    return;
  }

  const btn = e.target.closest('.btn, .icon-config, .unit-card');
  if (btn) {
    const id = btn.id;
    if (id && id !== 'start-btn' && id !== 'btn-retry' && id !== 'btn-title' && id !== 'btn-back-map' && !id.startsWith('btn-stage') && !id.startsWith('btn-to-upgrade')) {
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
    if (currentBgmAudio) currentBgmAudio.volume = configBgmVolume;
  });
}
