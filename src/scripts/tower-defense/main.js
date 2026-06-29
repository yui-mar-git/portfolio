    const STORAGE_KEY = 'td_save_data';
    let saveData = {
      gold: 0,
      clearedStage: 0,
      levels: { hero: 1, sword: 1, fighter: 1, mage: 1 },
      unlocked: { hero: false, sword: true, fighter: false, mage: true }
    };

    function loadSaveData() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try { saveData = { ...saveData, ...JSON.parse(saved) }; } catch (e) { }
      }
      if (!saveData.levels) saveData.levels = { hero: 1, sword: 1, fighter: 1, mage: 1 };
      if (!saveData.unlocked) saveData.unlocked = { hero: false, sword: true, fighter: false, mage: true };
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
      'sword': { cost: 40, hp: 150, attack: 15, cooldown: 1000, speed: 50, range: 60, width: 60, height: 60, attackSE: 'strike', image: 'img_sword', type: 'aoe' },
      'mage': { cost: 120, hp: 40, attack: 25, cooldown: 2000, speed: 40, range: 400, width: 60, height: 60, attackSE: 'magic', image: 'img_mage', type: 'projectile' },
      'fighter': { cost: 20, hp: 60, attack: 10, cooldown: 400, speed: 80, range: 40, width: 60, height: 60, attackSE: 'punch', image: 'img_fighter', type: 'single' },
      'hero': { cost: 150, hp: 200, attack: 30, cooldown: 800, speed: 45, range: 80, width: 60, height: 60, attackSE: 'strike', image: 'img_hero', type: 'single' }
    };

    function getUnitData(type) {
      const base = BASE_UNIT_DB[type];
      const lv = saveData.levels[type] || 1;
      return {
        ...base,
        hp: Math.floor(base.hp * (1 + (lv - 1) * 0.2)),
        attack: Math.floor(base.attack * (1 + (lv - 1) * 0.2))
      };
    }

    let mana = 0;
    const manaDisplay = document.getElementById('mana-display');
    const waveDisplay = document.getElementById('wave-display');
    const goldDisplay = document.getElementById('gold-display');
    const btnSpawnHero = document.getElementById('btn-spawn-hero');
    const btnSpawnSword = document.getElementById('btn-spawn-sword');
    const btnSpawnFighter = document.getElementById('btn-spawn-fighter');
    const btnSpawnMage = document.getElementById('btn-spawn-mage');

    function updateDeckUI() {
      ['hero', 'sword', 'fighter', 'mage'].forEach(type => {
        const data = getUnitData(type);
        const hpEl = document.getElementById(`stat-${type}-hp`);
        const atkEl = document.getElementById(`stat-${type}-atk`);
        const costEl = document.getElementById(`stat-${type}-cost`);
        if (hpEl) hpEl.textContent = data.hp;
        if (atkEl) atkEl.textContent = data.attack;
        if (costEl) costEl.textContent = data.cost;

        const btn = document.getElementById(`btn-spawn-${type}`);
        if (btn) {
          btn.style.display = saveData.unlocked[type] ? 'block' : 'none';
        }
      });
      if (goldDisplay) goldDisplay.textContent = saveData.gold;
    }

    function updateMapUI() {
      document.getElementById('btn-retire').style.display = 'none';

      const mapGold = document.getElementById('map-gold');
      if (mapGold) mapGold.textContent = saveData.gold;

      const btnStage1 = document.getElementById('btn-stage1');
      const btnStage2 = document.getElementById('btn-stage2');
      const btnStage3 = document.getElementById('btn-stage3');

      if (btnStage1) {
        if (saveData.clearedStage >= 1) {
          btnStage1.className = 'btn btn-primary';
          btnStage1.innerHTML = '繧ｹ繝・・繧ｸ1 (蟷ｳ蜴・ <span style="color:#ffd700">笘・/span>';
          btnStage1.style.backgroundColor = '#28a745';
          btnStage1.style.borderColor = '#28a745';
        } else {
          btnStage1.className = 'btn btn-primary';
          btnStage1.innerHTML = '繧ｹ繝・・繧ｸ1 (蟷ｳ蜴・';
          btnStage1.style.backgroundColor = '';
          btnStage1.style.borderColor = '';
        }
      }

      if (btnStage2) {
        if (saveData.clearedStage >= 2) {
          btnStage2.disabled = false;
          btnStage2.className = 'btn btn-primary';
          btnStage2.innerHTML = '繧ｹ繝・・繧ｸ2 (譽ｮ) <span style="color:#ffd700">笘・/span>';
          btnStage2.style.backgroundColor = '#28a745';
          btnStage2.style.borderColor = '#28a745';
        } else if (saveData.clearedStage >= 1) {
          btnStage2.disabled = false;
          btnStage2.className = 'btn btn-primary';
          btnStage2.innerHTML = '繧ｹ繝・・繧ｸ2 (譽ｮ)';
          btnStage2.style.backgroundColor = '';
          btnStage2.style.borderColor = '';
        } else {
          btnStage2.disabled = true;
          btnStage2.className = 'btn btn-secondary';
          btnStage2.innerHTML = '繧ｹ繝・・繧ｸ2 (譽ｮ)';
          btnStage2.style.backgroundColor = '';
          btnStage2.style.borderColor = '';
        }
      }

      if (btnStage3) {
        if (saveData.clearedStage >= 3) {
          btnStage3.disabled = false;
          btnStage3.className = 'btn btn-primary';
          btnStage3.innerHTML = '繧ｹ繝・・繧ｸ3 (螻ｱ) <span style="color:#ffd700">笘・/span>';
          btnStage3.style.backgroundColor = '#28a745';
          btnStage3.style.borderColor = '#28a745';
        } else if (saveData.clearedStage >= 2) {
          btnStage3.disabled = false;
          btnStage3.className = 'btn btn-primary';
          btnStage3.innerHTML = '繧ｹ繝・・繧ｸ3 (螻ｱ)';
          btnStage3.style.backgroundColor = '';
          btnStage3.style.borderColor = '';
        } else {
          btnStage3.disabled = true;
          btnStage3.className = 'btn btn-secondary';
          btnStage3.innerHTML = '繧ｹ繝・・繧ｸ3 (螻ｱ)';
          btnStage3.style.backgroundColor = '';
          btnStage3.style.borderColor = '';
        }
      }
    }

    function updateUpgradeUI() {
      const upgGold = document.getElementById('upg-gold');
      if (upgGold) upgGold.textContent = saveData.gold;

      ['hero', 'sword', 'fighter', 'mage'].forEach(type => {
        const lv = saveData.levels[type] || 1;
        const isUnlocked = saveData.unlocked[type];

        const lvEl = document.getElementById(`lv-${type}`);
        const costEl = document.getElementById(`cost-${type}`);
        const btnUpg = document.getElementById(`btn-upg-${type}`);
        const itemContainer = document.getElementById(`upg-item-${type}`);
        const lvLabel = document.getElementById(`upg-lv-label-${type}`);

        // Update stats on card
        const data = getUnitData(type);
        const hpEl = document.getElementById(`upg-stat-${type}-hp`);
        const atkEl = document.getElementById(`upg-stat-${type}-atk`);
        const uCostEl = document.getElementById(`upg-stat-${type}-cost`);
        if (hpEl) hpEl.textContent = data.hp;
        if (atkEl) atkEl.textContent = data.attack;
        if (uCostEl) uCostEl.textContent = data.cost;

        if (lvEl) lvEl.textContent = lv;

        if (btnUpg && itemContainer) {
          if (!isUnlocked) {
            // 未解禁ゞI
            if (saveData.clearedStage >= 1) {
              itemContainer.style.display = 'flex';
              itemContainer.style.filter = 'grayscale(100%)';
              itemContainer.style.opacity = '0.7';
              if (lvLabel) lvLabel.textContent = '未解禁・;
              if (lvEl) lvEl.textContent = '';

              const unlockCost = type === 'hero' ? 500 : 200;
              if (costEl) costEl.textContent = unlockCost;
              btnUpg.innerHTML = `解禁・(<span id="cost-${type}">${unlockCost}</span>G)`;
              btnUpg.disabled = saveData.gold < unlockCost;
              btnUpg.onclick = () => {
                if (saveData.gold >= unlockCost) {
                  saveData.gold -= unlockCost;
                  saveData.unlocked[type] = true;
                  playSE('confirm');
                  saveGame(); // this will call updateUpgradeUI again
                }
              };
            } else {
              itemContainer.style.display = 'none'; // ステージ1クリア前は見せない
            }
          } else {
            // 強化剖I
            itemContainer.style.display = 'flex';
            const cost = lv * 100;
            if (costEl) costEl.textContent = cost;
            btnUpg.innerHTML = `強化・(<span id="cost-${type}">${cost}</span>G)`;
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
        }
      });
    }

    // Audio setup
    let configBgmVolume = 0.1;
    let configSeVolume = 0.5;
    let currentBgmAudio = null;

    const BGM_PATH = '/portfolio/common/assets/audio/bgm/';
    const SE_PATH = '/portfolio/common/assets/audio/se/';

    const SE_DB = {
      'cursor': '繧ｫ繝ｼ繧ｽ繝ｫ遘ｻ蜍・.mp3',
      'confirm': '豎ｺ螳壹・繧ｿ繝ｳ繧呈款縺・.mp3',
      'cancel': '繧ｭ繝｣繝ｳ繧ｻ繝ｫ1.mp3',
      'invalid': '繝薙・繝鈴浹4.mp3',
      'strike': '蜑｣縺ｧ譁ｬ繧・.mp3',
      'smite': '謇捺茶6.mp3',
      'punch': '蟆上ヱ繝ｳ繝・mp3',
      'magic': '鬚ｨ鬲疲ｳ・.mp3',
      'victory': 'maou_game_jingle01.mp3',
      'defeat': 'maou_game_jingle08.mp3'
    };

    const BGM_DB = {
      'wave1': 'maou_game_field05.mp3',
      'wave2': 'maou_game_field11.mp3',
      'wave3': 'maou_game_boss02.mp3'
    };

    function playSE(seId) {
      if (!SE_DB[seId]) return;
      const se = new Audio(SE_PATH + SE_DB[seId]);
      se.volume = configSeVolume;
      se.play().catch(e => console.log('SE play failed:', e));
    }

    function playBGM(bgmId) {
      if (currentBgmAudio) currentBgmAudio.pause();
      if (!bgmId || !BGM_DB[bgmId]) return;
      currentBgmAudio = new Audio(BGM_PATH + BGM_DB[bgmId]);
      currentBgmAudio.volume = configBgmVolume;
      currentBgmAudio.loop = true;
      currentBgmAudio.play().catch(e => console.log('BGM Play blocked:', e));
    }

    function stopBGM() {
      if (currentBgmAudio) currentBgmAudio.pause();
    }

    let activeStage = 1;

    class MainScene extends Phaser.Scene {
      constructor() {
        super({ key: 'MainScene' });
      }

      preload() {
        // 繧ｭ繝｣繝ｩ繧ｯ繧ｿ繝ｼ逕ｻ蜒剰ｪｭ縺ｿ霎ｼ縺ｿ
        this.load.image('img_hero', '/portfolio/roguelike/assets/characters/figure_rpg_character_yuusya.png');
        this.load.image('img_sword', '/portfolio/roguelike/assets/characters/figure_rpg_character_kenshi.png');
        this.load.image('img_fighter', '/portfolio/roguelike/assets/characters/figure_rpg_character_butouka.png');
        this.load.image('img_mage', '/portfolio/roguelike/assets/characters/figure_rpg_character_mahoutsukai.png');

        // 繝｢繝ｳ繧ｹ繧ｿ繝ｼ逕ｻ蜒剰ｪｭ縺ｿ霎ｼ縺ｿ
        this.load.image('img_slime', '/portfolio/roguelike/assets/monsters/fantasy_game_character_slime.png');
        this.load.image('img_goblin', '/portfolio/roguelike/assets/monsters/fantasy_goblin.png');
        this.load.image('img_ogre', '/portfolio/roguelike/assets/monsters/fantasy_ogre.png');
      }

      create() {
        // 繝舌ャ繧ｯ繧ｰ繝ｩ繧ｦ繝ｳ繝峨〒荳譎ょ●豁｢縺励↑縺・ｈ縺・↓險ｭ螳・
        this.game.events.off('hidden');
        this.game.events.off('blur');

        this.cameras.main.setBackgroundColor('#87CEEB');
        // Clouds
        this.clouds = [];
        for (let i = 0; i < 5; i++) {
          const cloud = this.add.ellipse(Phaser.Math.Between(0, 800), Phaser.Math.Between(50, 200), Phaser.Math.Between(80, 150), Phaser.Math.Between(40, 60), 0xffffff);
          cloud.setAlpha(0.8);
          cloud.speed = Phaser.Math.FloatBetween(0.2, 0.8);
          this.clouds.push(cloud);
        }

        // Ground
        const ground = this.add.rectangle(400, 500, 800, 200, 0x228B22);

        // Base / Castle
        this.add.rectangle(40, 320, 80, 160, 0x888888); // Tower body
        this.add.triangle(40, 220, 0, 40, 40, 0, 80, 40, 0xaa0000); // Tower roof

        this.allies = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.projectiles = this.physics.add.group();

        this.physics.add.overlap(this.projectiles, this.enemies, (proj, enemy) => {
          if (!proj.hitEnemies.has(enemy)) {
            proj.hitEnemies.add(enemy);
            this.damageEnemy(enemy, proj.attack);
          }
        });

        this.currentWave = 1;
        this.maxWaves = activeStage === 3 ? 3 : (activeStage === 2 ? 2 : 1);
        this.enemiesSpawned = 0;
        this.enemiesToSpawn = 10;
        mana = 50;
        this.isGameOver = false;

        this.time.addEvent({
          delay: 1000,
          callback: () => {
            if (this.isGameOver) return;
            mana += 10;
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
          if (mana >= unit.cost) {
            mana -= unit.cost;
            this.updateUI();
            this.createAlly(unit);
            playSE('confirm');
          } else {
            playSE('invalid');
          }
        };

        if (btnSpawnHero) btnSpawnHero.onclick = () => spawnAlly('hero');
        if (btnSpawnSword) btnSpawnSword.onclick = () => spawnAlly('sword');
        if (btnSpawnFighter) btnSpawnFighter.onclick = () => spawnAlly('fighter');
        if (btnSpawnMage) btnSpawnMage.onclick = () => spawnAlly('mage');

        this.updateUI();
        this.startWave(1, false);
        this.scene.pause();
      }

      startWave(wave, playMusic = true) {
        this.currentWave = wave;
        this.enemiesSpawned = 0;

        let bgm = 'wave1';
        if (activeStage === 2) {
          bgm = wave === 1 ? 'wave1' : 'wave2';
        } else if (activeStage === 3) {
          bgm = wave === 1 ? 'wave1' : (wave === 2 ? 'wave2' : 'wave3');
        }

        if (activeStage === 1) {
          this.enemiesToSpawn = 8;
          this.spawnTimer.delay = 3000;
        } else if (activeStage === 2) {
          this.enemiesToSpawn = wave === 1 ? 10 : 15;
          this.spawnTimer.delay = wave === 1 ? 3000 : 2000;
        } else if (activeStage === 3) {
          if (wave === 1) { this.enemiesToSpawn = 10; this.spawnTimer.delay = 3000; }
          else if (wave === 2) { this.enemiesToSpawn = 15; this.spawnTimer.delay = 2000; }
          else { this.enemiesToSpawn = 1; this.spawnTimer.delay = 5000; } // Boss
        }

        if (playMusic) playBGM(bgm);
        if (waveDisplay) waveDisplay.textContent = `${this.currentWave} / ${this.maxWaves}`;
      }

      update(time, delta) {
        if (this.isGameOver) return;

        // Clouds movement
        this.clouds.forEach(cloud => {
          cloud.x -= cloud.speed;
          if (cloud.x < -100) cloud.x = 900;
        });

        this.allies.getChildren().forEach(ally => {
          let target = null;
          let minDistance = Infinity;

          this.enemies.getChildren().forEach(enemy => {
            const dist = enemy.x - ally.x;
            if (dist > 0 && dist <= ally.unitData.range + (enemy.displayWidth / 2)) {
              if (dist < minDistance) {
                minDistance = dist;
                target = enemy;
              }
            }
          });

          if (target) {
            ally.state = 'attack';
            ally.body.setVelocityX(0);
            this.handleAllyAttack(ally, target);
          } else {
            ally.state = 'walk';
            ally.body.setVelocityX(ally.unitData.speed);
          }
        });

        this.enemies.getChildren().forEach(enemy => {
          let target = null;
          let minDistance = Infinity;

          this.allies.getChildren().forEach(ally => {
            const dist = enemy.x - ally.x;
            if (dist > 0 && dist <= 40 + (ally.displayWidth / 2)) {
              if (dist < minDistance) {
                minDistance = dist;
                target = ally;
              }
            }
          });

          if (enemy.x <= 80) { // Attacking the base/castle
            enemy.state = 'attack';
            enemy.body.setVelocityX(0);
            const currentTime = this.time.now;
            if (currentTime - enemy.lastAttackTime > 1500) {
              enemy.lastAttackTime = currentTime;
              playSE(enemy.attackSE);
              // Base taking damage triggers game over in our simple mechanics
              this.triggerGameOver(false);
            }
          } else if (target) {
            enemy.state = 'attack';
            enemy.body.setVelocityX(0);
            this.handleEnemyAttack(enemy, target);
          } else {
            enemy.state = 'walk';
            enemy.body.setVelocityX(-enemy.speed);
          }
        });

        this.allies.getChildren().forEach(ally => {
          if (ally.x > 850) ally.destroy();
        });

        this.projectiles.getChildren().forEach(p => {
          if (p.x > 850) p.destroy();
        });
      }

      updateUI() {
        if (manaDisplay) manaDisplay.textContent = mana;
        if (btnSpawnHero) btnSpawnHero.disabled = (mana < BASE_UNIT_DB['hero'].cost);
        if (btnSpawnSword) btnSpawnSword.disabled = (mana < BASE_UNIT_DB['sword'].cost);
        if (btnSpawnFighter) btnSpawnFighter.disabled = (mana < BASE_UNIT_DB['fighter'].cost);
        if (btnSpawnMage) btnSpawnMage.disabled = (mana < BASE_UNIT_DB['mage'].cost);
      }

      createAlly(unitData) {
        const ally = this.physics.add.image(50, 400 - (unitData.height / 2), unitData.image);
        ally.setDisplaySize(unitData.width, unitData.height);
        ally.unitData = unitData;
        ally.hp = unitData.hp;
        ally.lastAttackTime = 0;
        ally.state = 'walk';
        this.allies.add(ally);
      }

      spawnEnemy() {
        if (this.isGameOver) return;
        if (this.enemiesSpawned >= this.enemiesToSpawn) return;

        let hp = 80;
        let attack = 10;
        let speed = 40;
        let size = 60;
        let attackSE = 'punch';
        let imgKey = 'img_slime';

        if (activeStage === 2) {
          hp = this.currentWave === 2 ? 120 : 90;
          attack = this.currentWave === 2 ? 15 : 12;
          imgKey = this.currentWave === 2 ? 'img_goblin' : 'img_slime';
          size = this.currentWave === 2 ? 75 : 60;
        } else if (activeStage === 3) {
          if (this.currentWave === 2) {
            hp = 150; attack = 20; imgKey = 'img_goblin'; speed = 45; size = 75;
          } else if (this.currentWave === 3) {
            hp = 1200; attack = 40; speed = 25; size = 120; imgKey = 'img_ogre'; attackSE = 'smite';
          }
        }

        const enemy = this.physics.add.image(850, 400 - (size / 2), imgKey);
        enemy.setDisplaySize(size, size);
        enemy.hp = hp;
        enemy.attackPower = attack;
        enemy.speed = speed;
        enemy.lastAttackTime = 0;
        enemy.state = 'walk';
        enemy.attackSE = attackSE;

        this.enemies.add(enemy);
        this.enemiesSpawned++;
      }

      handleAllyAttack(ally, primaryTarget) {
        const currentTime = this.time.now;
        if (currentTime - ally.lastAttackTime > ally.unitData.cooldown) {
          ally.lastAttackTime = currentTime;
          playSE(ally.unitData.attackSE);

          if (ally.unitData.type === 'aoe') {
            this.enemies.getChildren().forEach(enemy => {
              const dist = enemy.x - ally.x;
              if (dist > 0 && dist <= ally.unitData.range + (enemy.displayWidth / 2)) {
                this.damageEnemy(enemy, ally.unitData.attack);
              }
            });
          } else if (ally.unitData.type === 'projectile') {
            const proj = this.add.circle(ally.x + 20, ally.y, 15, 0x00ffff);
            this.physics.add.existing(proj);
            this.projectiles.add(proj);
            proj.body.setVelocityX(300);
            proj.body.allowGravity = false;
            proj.attack = ally.unitData.attack;
            proj.hitEnemies = new Set();
          } else {
            this.damageEnemy(primaryTarget, ally.unitData.attack);
          }
        }
      }

      handleEnemyAttack(enemy, targetAlly) {
        const currentTime = this.time.now;
        if (currentTime - enemy.lastAttackTime > 1500) {
          enemy.lastAttackTime = currentTime;
          playSE(enemy.attackSE);

          targetAlly.hp -= enemy.attackPower;
          targetAlly.setTint(0xff0000);
          this.time.delayedCall(100, () => { if (targetAlly.active) targetAlly.clearTint(); });

          if (targetAlly.hp <= 0 && targetAlly.active) {
            targetAlly.destroy();
          }
        }
      }

      damageEnemy(enemy, amount) {
        enemy.hp -= amount;
        enemy.setTint(0xff0000);
        this.time.delayedCall(100, () => { if (enemy.active) enemy.clearTint(); });

        if (enemy.hp <= 0 && enemy.active) {
          enemy.destroy();
          mana += 20;
          this.updateUI();
          this.checkWaveProgress();
        }
      }

      checkWaveProgress() {
        if (this.enemiesSpawned >= this.enemiesToSpawn && this.enemies.countActive() === 0) {
          if (this.currentWave < this.maxWaves) {
            playSE('victory');
            this.startWave(this.currentWave + 1);
          } else {
            this.triggerGameOver(true);
          }
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
          title.textContent = 'STAGE CLEAR・・;
          title.style.color = '#ffd700';
          playSE('victory');

          let reward = activeStage * 200;
          saveData.gold += reward;
          saveData.clearedStage = Math.max(saveData.clearedStage, activeStage);
          saveGame();
          msg.textContent = `${reward} G 迯ｲ蠕暦ｼ～;
        } else {
          title.textContent = '繧ｲ繝ｼ繝繧ｪ繝ｼ繝舌・';
          title.style.color = '#dc3545';
          playSE('defeat');
          msg.textContent = `髦ｲ陦帙↓螟ｱ謨励＠縺ｾ縺励◆...`;
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
      scene: [MainScene]
    };

    const game = new Phaser.Game(config);

    function setGamePause(paused) {
      const scene = game.scene.getScene('MainScene');
      if (!scene) return;
      if (paused) {
        if (scene.scene.isActive()) scene.scene.pause();
      } else {
        const isStart = document.getElementById('start-screen').style.display !== 'none';
        const isMap = document.getElementById('map-screen').style.display === 'flex';
        const isUpg = document.getElementById('upgrade-screen').style.display === 'flex';
        const isRes = document.getElementById('result-screen').style.display === 'flex';
        if (!isStart && !isMap && !isUpg && !isRes) {
          scene.scene.resume();
        }
      }
    }

    // Initial Load
    loadSaveData();

    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const mapScreen = document.getElementById('map-screen');
    const upgradeScreen = document.getElementById('upgrade-screen');
    const resultScreen = document.getElementById('result-screen');

    // Start -> Map
    document.getElementById('start-btn').addEventListener('click', () => {
      playSE('confirm');
      startScreen.style.display = 'none';
      mapScreen.style.display = 'flex';
      updateMapUI();
    });

    // Map -> Upgrade
    document.getElementById('btn-to-upgrade').addEventListener('click', () => {
      playSE('confirm');
      mapScreen.style.display = 'none';
      upgradeScreen.style.display = 'flex';
      updateUpgradeUI();
    });

    // Upgrade -> Map
    document.getElementById('btn-back-map').addEventListener('click', () => {
      playSE('cancel');
      upgradeScreen.style.display = 'none';
      mapScreen.style.display = 'flex';
      updateMapUI();
    });

    // Start Stage
    function startGame(stageNumber) {
      playSE('confirm');
      activeStage = stageNumber;
      mapScreen.style.display = 'none';
      document.getElementById('btn-retire').style.display = 'block';
      const scene = game.scene.getScene('MainScene');
      if (scene) {
        scene.scene.restart();
        setTimeout(() => {
          scene.scene.resume();
          scene.startWave(1, true);
        }, 100);
      }
    }
    document.getElementById('btn-stage1').addEventListener('click', () => startGame(1));
    document.getElementById('btn-stage2').addEventListener('click', () => startGame(2));
    document.getElementById('btn-stage3').addEventListener('click', () => startGame(3));

    // Result screen buttons
    document.getElementById('btn-retry').addEventListener('click', () => {
      playSE('confirm');
      resultScreen.style.display = 'none';
      startGame(activeStage);
    });

    document.getElementById('btn-title').addEventListener('click', () => {
      playSE('cancel');
      resultScreen.style.display = 'none';
      mapScreen.style.display = 'flex';
      stopBGM();
      game.scene.stop('MainScene');
      game.scene.start('MainScene');
      updateMapUI();
    });

    window.handleRetire = function () {
      const scene = game.scene.getScene('MainScene');
      if (scene) {
        playSE('cursor');
        setGamePause(true);
        document.getElementById('retire-confirm-modal').style.display = 'flex';
      }
    };

    window.cancelRetire = function () {
      playSE('cancel');
      document.getElementById('retire-confirm-modal').style.display = 'none';
      setGamePause(false);
    };

    window.executeRetire = function () {
      playSE('cancel');
      document.getElementById('retire-confirm-modal').style.display = 'none';
      stopBGM();
      game.scene.stop('MainScene');
      document.getElementById('btn-retire').style.display = 'none';
      mapScreen.style.display = 'flex';
      updateMapUI();
    };

    document.getElementById('btn-share').addEventListener('click', () => {
      const text = encodeURIComponent('繧ｿ繝ｯ繝ｼ繝・ぅ繝輔ぉ繝ｳ繧ｹ縺ｧ驕翫・縺ｾ縺励◆・―n#繝溘ル繧ｲ繝ｼ繝 #繝昴・繝医ヵ繧ｩ繝ｪ繧ｪ');
      const url = encodeURIComponent(window.location.href);
      window.open('https://twitter.com/intent/tweet?text=' + text + '&url=' + url, '_blank');
    });

    // Modals config
    const _cfgBtn = document.getElementById('config-btn');
    if (_cfgBtn) {
      _cfgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSE('cursor');
        setGamePause(true);
        document.getElementById('config-modal')?.classList.add('active');
        document.getElementById('modal-overlay')?.classList.add('active');
      });
      _cfgBtn.addEventListener('mousedown', (e) => e.stopPropagation());
      _cfgBtn.addEventListener('touchstart', (e) => e.stopPropagation());
    }
    const _closeCfgBtn = document.getElementById('close-config-btn');
    if (_closeCfgBtn) {
      _closeCfgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSE('cursor');
        setGamePause(false);
        document.getElementById('config-modal')?.classList.remove('active');
        document.getElementById('modal-overlay')?.classList.remove('active');
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
        setGamePause(false); // credits can be opened directly or from config, so resume when closed
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
        setGamePause(true);
        document.getElementById('howto-modal')?.classList.add('active');
        document.getElementById('modal-overlay')?.classList.add('active');
      });
    }

    if (closeHowtoBtn) {
      closeHowtoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playSE('cursor');
        setGamePause(false);
        document.getElementById('howto-modal')?.classList.remove('active');
        document.getElementById('modal-overlay')?.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
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
  
