export interface EnemyTemplate {
  name: string;
  hp: number;
  maxHp: number;
  attackBase: number;
  image: string;
  weaknesses: string[];   // 弱点属性 (ダメージ1.5倍)
  resistances: string[];  // 耐性属性 (ダメージ0.5倍)
  immunities: string[];   // 無効属性 (ダメージ0)
  skills: string[];       // 行動スキル ('attack' | 'rush' | 'heal' | 'poison' | 'paralyze' | 'buff_up' | 'buff_down' | 'ice_attack' | 'fire_attack')
  isGolem?: boolean;      // ゴーレム特殊能力 (被ダメージ半減、デバフ無効)
  isVampire?: boolean;    // ヴァンパイア特殊能力 (毒無効)
  isMaou?: boolean;       // 魔王特殊能力 (デバフ50%で無効化)
}

export const enemyTemplates: Record<string, EnemyTemplate[]> = {
  // ===== エリア1 通常モンスター =====
  early: [
    {
      name: 'スライム',
      hp: 6, maxHp: 6, attackBase: 1,
      image: new URL('../../assets/games/tower-defense/images/enemy/fantasy_game_character_slime.png', import.meta.url).href,
      weaknesses: [],
      resistances: ['fire'],
      immunities: [],
      skills: ['attack']
    },
    {
      name: 'ゴブリン',
      hp: 10, maxHp: 10, attackBase: 1,
      image: new URL('../../assets/games/tower-defense/images/enemy/fantasy_goblin.png', import.meta.url).href,
      weaknesses: [],
      resistances: [],
      immunities: [],
      skills: ['attack']
    },
    {
      name: 'カラス',
      hp: 6, maxHp: 6, attackBase: 1,
      image: new URL('../../assets/games/roguelike/images/monsters/bird_karasu_kowai.png', import.meta.url).href,
      weaknesses: ['fire', 'ice'],
      resistances: [],
      immunities: [],
      skills: ['attack']
    },
    {
      name: 'オオカミ',
      hp: 8, maxHp: 8, attackBase: 1,
      image: new URL('../../assets/games/roguelike/images/monsters/animal_ookami.png', import.meta.url).href,
      weaknesses: ['fire', 'ice'],
      resistances: [],
      immunities: [],
      skills: ['attack', 'rush']
    }
  ],

  // ===== エリア2 通常モンスター =====
  mid: [
    {
      name: 'ゴブリン',
      hp: 12, maxHp: 12, attackBase: 1,
      image: new URL('../../assets/games/tower-defense/images/enemy/fantasy_goblin.png', import.meta.url).href,
      weaknesses: [],
      resistances: [],
      immunities: [],
      skills: ['attack']
    },
    {
      name: 'オオカミ',
      hp: 10, maxHp: 10, attackBase: 1,
      image: new URL('../../assets/games/roguelike/images/monsters/animal_ookami.png', import.meta.url).href,
      weaknesses: ['fire', 'ice'],
      resistances: [],
      immunities: [],
      skills: ['attack', 'rush']
    },
    {
      name: 'ベアー',
      hp: 18, maxHp: 18, attackBase: 2,
      image: new URL('../../assets/games/roguelike/images/monsters/animal_bear_higuma.png', import.meta.url).href,
      weaknesses: ['fire', 'ice'],
      resistances: [],
      immunities: [],
      skills: ['attack']
    },
    {
      name: 'ハーピー',
      hp: 15, maxHp: 15, attackBase: 1,
      image: new URL('../../assets/games/roguelike/images/monsters/fantasy_harpy.png', import.meta.url).href,
      weaknesses: ['stone'],
      resistances: ['wind'],
      immunities: [],
      skills: ['attack', 'paralyze'] // 麻痺を付与
    },
    {
      name: 'オーク',
      hp: 20, maxHp: 20, attackBase: 2,
      image: new URL('../../assets/games/roguelike/images/monsters/fantasy_orc.png', import.meta.url).href,
      weaknesses: ['wind'],
      resistances: [],
      immunities: [],
      skills: ['attack'] // 強撃は基本攻撃力の倍率ダメージとしてJSで処理
    }
  ],

  // ===== エリア3 通常モンスター =====
  late: [
    {
      name: 'ハーピー',
      hp: 18, maxHp: 18, attackBase: 2,
      image: new URL('../../assets/games/roguelike/images/monsters/fantasy_harpy.png', import.meta.url).href,
      weaknesses: ['stone'],
      resistances: ['wind'],
      immunities: [],
      skills: ['attack', 'paralyze']
    },
    {
      name: 'オーク',
      hp: 24, maxHp: 24, attackBase: 2,
      image: new URL('../../assets/games/roguelike/images/monsters/fantasy_orc.png', import.meta.url).href,
      weaknesses: ['wind'],
      resistances: [],
      immunities: [],
      skills: ['attack']
    },
    {
      name: 'ドラゴン',
      hp: 35, maxHp: 35, attackBase: 3,
      image: new URL('../../assets/games/roguelike/images/monsters/fantasy_dragon.png', import.meta.url).href,
      weaknesses: ['ice'],
      resistances: ['fire'],
      immunities: [],
      skills: ['attack', 'fire_attack'] // 炎属性ブレス
    }
  ],

  // ===== 固定中ボス・大ボス =====
  bosses: [
    // エリア1 中ボス (5層)
    {
      name: 'バンディット',
      hp: 30, maxHp: 30, attackBase: 1,
      image: new URL('../../assets/games/roguelike/images/monsters/character_sanzoku.png', import.meta.url).href,
      weaknesses: [],
      resistances: [],
      immunities: [],
      skills: ['attack', 'rush', 'buff_up'] // 能昇を使用
    },
    // エリア1 ボス (9層)
    {
      name: 'ダークエルフ',
      hp: 50, maxHp: 50, attackBase: 2,
      image: new URL('../../assets/games/roguelike/images/monsters/fantasy_dark_elf.png', import.meta.url).href,
      weaknesses: [],
      resistances: [],
      immunities: [],
      skills: ['attack', 'heal', 'buff_down', 'paralyze'] // 快癒、能降、麻痺を使用
    },
    // エリア2 中ボス (4層)
    {
      name: 'ゴーレム',
      hp: 60, maxHp: 60, attackBase: 2,
      image: new URL('../../assets/games/roguelike/images/monsters/fantasy_golem.png', import.meta.url).href,
      weaknesses: ['wind'],
      resistances: [],
      immunities: ['stone'], // 土無効
      skills: ['attack'],
      isGolem: true // ダメージ半減、デバフ無効
    },
    // エリア2 ボス (9層)
    {
      name: 'ヴァンパイア',
      hp: 75, maxHp: 75, attackBase: 2,
      image: new URL('../../assets/games/roguelike/images/monsters/fantasy_dracula2.png', import.meta.url).href,
      weaknesses: ['fire'],
      resistances: [],
      immunities: [], // 毒無効(JSロジック側で処理)
      skills: ['attack', 'poison'],
      isVampire: true
    },
    // エリア3 中ボス (5層)
    {
      name: 'リヴァイアサン',
      hp: 85, maxHp: 85, attackBase: 3,
      image: new URL('../../assets/games/roguelike/images/monsters/fantasy_leviathan.png', import.meta.url).href,
      weaknesses: ['thunder'],
      resistances: ['fire'],
      immunities: ['ice'], // 氷無効
      skills: ['attack', 'ice_attack'], // 氷攻撃
    },
    // エリア3 ラスボス (9層)
    {
      name: '魔王',
      hp: 120, maxHp: 120, attackBase: 3,
      image: new URL('../../assets/games/roguelike/images/monsters/fantasy_maou_devil.png', import.meta.url).href,
      weaknesses: ['thunder'],
      resistances: ['stone'], // 土耐性
      immunities: [],
      skills: ['attack', 'rush', 'buff_up', 'buff_down', 'poison', 'paralyze'],
      isMaou: true // デバフ50%防ぐ
    }
  ],

  // ===== ミミック =====
  mimic: [
    {
      name: 'ミミック',
      hp: 25, maxHp: 25, attackBase: 2,
      image: new URL('../../assets/games/roguelike/images/monsters/character_game_mimic.png', import.meta.url).href,
      weaknesses: [],
      resistances: [],
      immunities: [],
      skills: ['attack', 'rush']
    }
  ]
};

/**
 * 階層(フロア)とエリアに応じて出現するモンスターを決定する関数
 */
export function getEnemyTemplate(area: number, floor: number, type: 'battle' | 'elite' | 'mimic' | 'midboss' | 'boss' | 'lastboss'): EnemyTemplate {
  if (type === 'mimic') {
    return enemyTemplates.mimic[0];
  }

  if (type === 'midboss') {
    // 各エリアの中ボス
    if (area === 1) return enemyTemplates.bosses.find(b => b.name === 'バンディット')!;
    if (area === 2) return enemyTemplates.bosses.find(b => b.name === 'ゴーレム')!;
    return enemyTemplates.bosses.find(b => b.name === 'リヴァイアサン')!;
  }

  if (type === 'boss' || type === 'lastboss') {
    // 各エリアのボス
    if (area === 1) return enemyTemplates.bosses.find(b => b.name === 'ダークエルフ')!;
    if (area === 2) return enemyTemplates.bosses.find(b => b.name === 'ヴァンパイア')!;
    return enemyTemplates.bosses.find(b => b.name === '魔王')!;
  }

  // 通常戦闘・強敵戦闘
  const pool = area === 1 ? enemyTemplates.early : (area === 2 ? enemyTemplates.mid : enemyTemplates.late);
  const randomIndex = Math.floor(Math.random() * pool.length);
  const tpl = pool[randomIndex];

  if (type === 'elite') {
    // 強敵はHPと攻撃力を少し盛る
    return {
      ...tpl,
      name: '強欲な' + tpl.name,
      hp: Math.floor(tpl.hp * 1.5),
      maxHp: Math.floor(tpl.maxHp * 1.5),
      attackBase: tpl.attackBase + 1
    };
  }

  return tpl;
}
