export interface EnemyTemplate {
  name: string;
  hp: number;
  maxHp: number;
  attackBase: number;
  image: string;
  weaknesses: string[]; // 弱点属性 (ダメージ1.5倍)
  resistances: string[]; // 耐性属性 (ダメージ0.5倍)
  immunities: string[]; // 無効属性 (ダメージ0)
  skills: string[]; // 行動スキル ('attack' | 'rush' | 'heal' | 'poison' | 'paralyze' | 'buff_up' | 'buff_down' | 'ice_attack' | 'fire_attack')
  isGolem?: boolean; // ゴーレム特殊能力 (被ダメージ半減、デバフ無効)
  isVampire?: boolean; // ヴァンパイア特殊能力 (毒無効)
  isMaou?: boolean; // 魔王特殊能力 (デバフ50%で無効化)
}

export interface MonsterMeta {
  id: string;
  name: string;
  hp: number;
  exp: number;
  image: string;
  weaknesses: string[];
  resistances: string[];
  immunities: string[];
  skills: string[];
  flavor: string;
}

export const MONSTER_DB: Record<string, MonsterMeta> = {
  slime: {
    id: 'slime',
    name: 'スライム',
    hp: 6,
    exp: 5,
    image: new URL(
      '../../assets/games/tower-defense/images/enemy/fantasy_game_character_slime.png',
      import.meta.url,
    ).href,
    weaknesses: [],
    resistances: ['fire'],
    immunities: [],
    skills: ['攻撃'],
    flavor: 'ダンジョン最上層に蠢く粘液質の生命体。熱への強い耐性を持つ。',
  },
  goblin: {
    id: 'goblin',
    name: 'ゴブリン',
    hp: 10,
    exp: 8,
    image: new URL(
      '../../assets/games/tower-defense/images/enemy/fantasy_goblin.png',
      import.meta.url,
    ).href,
    weaknesses: [],
    resistances: [],
    immunities: [],
    skills: ['攻撃'],
    flavor: '小柄で凶暴な魔物。集団で冒険者を急襲する。',
  },
  karasu: {
    id: 'karasu',
    name: 'カラス',
    hp: 6,
    exp: 6,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/bird_karasu_kowai.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire', 'ice'],
    resistances: [],
    immunities: [],
    skills: ['攻撃'],
    flavor: '不吉な漆黒の巨鳥。急降下攻撃を得意とするが、属性魔法に弱い。',
  },
  ookami: {
    id: 'ookami',
    name: 'オオカミ',
    hp: 8,
    exp: 10,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/animal_ookami.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire', 'ice'],
    resistances: [],
    immunities: [],
    skills: ['攻撃', '突進'],
    flavor: '飢えた野性の狼。鋭い爪で疾走攻撃を繰り出す。',
  },
  hornet: {
    id: 'hornet',
    name: 'ホーネット',
    hp: 8,
    exp: 12,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/bug_hachi_doku.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire', 'wind'],
    resistances: [],
    immunities: [],
    skills: ['攻撃', '毒針'],
    flavor: '猛毒の針を持つ巨大な蜂。刺されると猛毒状態に陥る。',
  },
  bear: {
    id: 'bear',
    name: 'ベアー',
    hp: 18,
    exp: 20,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/animal_bear_higuma.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire', 'ice'],
    resistances: [],
    immunities: [],
    skills: ['重攻撃'],
    flavor: '森林を支配する巨熊。圧倒的な腕力で一撃重攻を放つ。',
  },
  harpy: {
    id: 'harpy',
    name: 'ハーピー',
    hp: 15,
    exp: 22,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_harpy.png',
      import.meta.url,
    ).href,
    weaknesses: ['stone'],
    resistances: ['wind'],
    immunities: [],
    skills: ['攻撃', '麻痺歌'],
    flavor: '妖艶な怪鳥。怪しい歌声で冒険者を麻痺状態に落とし入れる。',
  },
  orc: {
    id: 'orc',
    name: 'オーク',
    hp: 20,
    exp: 25,
    image: new URL('../../assets/games/roguelike/images/monsters/fantasy_orc.png', import.meta.url)
      .href,
    weaknesses: ['wind'],
    resistances: [],
    immunities: [],
    skills: ['剛腕撃'],
    flavor: '強靭な肉体を持つ猪頭の戦士。風属性の刃に脆い。',
  },
  dragon: {
    id: 'dragon',
    name: 'ドラゴン',
    hp: 35,
    exp: 40,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_dragon.png',
      import.meta.url,
    ).href,
    weaknesses: ['ice'],
    resistances: ['fire'],
    immunities: [],
    skills: ['噛みつき', '火炎ブレス'],
    flavor: '古の龍。灼熱のブレスを吐き出し、氷属性攻撃を苦手とする。',
  },
  bandit: {
    id: 'bandit',
    name: 'バンディット',
    hp: 30,
    exp: 50,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/character_sanzoku.png',
      import.meta.url,
    ).href,
    weaknesses: [],
    resistances: [],
    immunities: [],
    skills: ['斬撃', '強襲', '能昇', '毒塗'],
    flavor: 'エリア1を縄張りとする山賊頭。多彩な戦術と自らへの強化を得意とする。',
  },
  dark_elf: {
    id: 'dark_elf',
    name: 'ダークエルフ',
    hp: 50,
    exp: 80,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_dark_elf.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire'],
    resistances: [],
    immunities: ['wind'],
    skills: ['魔法攻撃', '回復', '竜巻', '幻惑', '沈黙'],
    flavor: 'エリア1のボス。高度な暗黒魔法と回復呪文を自在に操る。',
  },
  golem: {
    id: 'golem',
    name: 'ゴーレム',
    hp: 60,
    exp: 70,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_golem.png',
      import.meta.url,
    ).href,
    weaknesses: ['wind'],
    resistances: [],
    immunities: ['stone'],
    skills: ['岩石撃'],
    flavor: '魔法陣により動く古代石像。被ダメージを半減し全てのデバフを無効化する。',
  },
  vampire: {
    id: 'vampire',
    name: 'ヴァンパイア',
    hp: 75,
    exp: 100,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_dracula2.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire', 'thunder'],
    resistances: [],
    immunities: [],
    skills: ['吸血', '猛毒', '幻惑', '能降'],
    flavor: 'エリア2のボス。夜を統べる吸血鬼。毒を一切受けつけない体質を持つ。',
  },
  leviathan: {
    id: 'leviathan',
    name: 'リヴァイアサン',
    hp: 85,
    exp: 120,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_leviathan.png',
      import.meta.url,
    ).href,
    weaknesses: ['thunder', 'stone'],
    resistances: ['fire'],
    immunities: ['ice'],
    skills: ['津波', '絶対零度ブレス'],
    flavor: '深海に潜む伝説の海龍。雷と石の突撃を弱点とする。',
  },
  maou: {
    id: 'maou',
    name: '魔王',
    hp: 120,
    exp: 300,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_maou_devil.png',
      import.meta.url,
    ).href,
    weaknesses: ['thunder'],
    resistances: [],
    immunities: [],
    skills: ['終焉の剣', '覚醒+', '流星群+', '全属性波', '全状態異常付与'],
    flavor: 'ダンジョン最深部に君臨する絶望の支配者。圧倒的な猛攻と二段階覚醒を行う。',
  },
  mimic: {
    id: 'mimic',
    name: 'ミミック',
    hp: 25,
    exp: 40,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/character_game_mimic.png',
      import.meta.url,
    ).href,
    weaknesses: [],
    resistances: [],
    immunities: [],
    skills: ['奇襲', '氷爪'],
    flavor: '宝箱に化けた狂暴な魔物。油断した冒険者を丸呑みにする。',
  },
};

export const enemyTemplates: Record<string, EnemyTemplate[]> = {
  // ===== エリア1 通常モンスター =====
  early: [
    {
      name: 'スライム',
      hp: 6,
      maxHp: 6,
      attackBase: 1,
      image: new URL(
        '../../assets/games/tower-defense/images/enemy/fantasy_game_character_slime.png',
        import.meta.url,
      ).href,
      weaknesses: [],
      resistances: ['fire'],
      immunities: [],
      skills: ['attack'],
    },
    {
      name: 'ゴブリン',
      hp: 10,
      maxHp: 10,
      attackBase: 1,
      image: new URL(
        '../../assets/games/tower-defense/images/enemy/fantasy_goblin.png',
        import.meta.url,
      ).href,
      weaknesses: [],
      resistances: [],
      immunities: [],
      skills: ['attack'],
    },
    {
      name: 'カラス',
      hp: 6,
      maxHp: 6,
      attackBase: 1,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/bird_karasu_kowai.png',
        import.meta.url,
      ).href,
      weaknesses: ['fire', 'ice'],
      resistances: [],
      immunities: [],
      skills: ['attack'],
    },
    {
      name: 'オオカミ',
      hp: 8,
      maxHp: 8,
      attackBase: 1,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/animal_ookami.png',
        import.meta.url,
      ).href,
      weaknesses: ['fire', 'ice'],
      resistances: [],
      immunities: [],
      skills: ['attack', 'rush'],
    },
    {
      name: 'ホーネット',
      hp: 8,
      maxHp: 8,
      attackBase: 1,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/bug_hachi_doku.png',
        import.meta.url,
      ).href,
      weaknesses: ['fire', 'wind'],
      resistances: [],
      immunities: [],
      skills: ['attack', 'poison'],
    },
  ],

  // ===== エリア2 通常モンスター =====
  mid: [
    {
      name: 'ゴブリン',
      hp: 12,
      maxHp: 12,
      attackBase: 1,
      image: new URL(
        '../../assets/games/tower-defense/images/enemy/fantasy_goblin.png',
        import.meta.url,
      ).href,
      weaknesses: [],
      resistances: [],
      immunities: [],
      skills: ['attack'],
    },
    {
      name: 'オオカミ',
      hp: 10,
      maxHp: 10,
      attackBase: 1,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/animal_ookami.png',
        import.meta.url,
      ).href,
      weaknesses: ['fire', 'ice'],
      resistances: [],
      immunities: [],
      skills: ['attack', 'rush'],
    },
    {
      name: 'ベアー',
      hp: 18,
      maxHp: 18,
      attackBase: 2,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/animal_bear_higuma.png',
        import.meta.url,
      ).href,
      weaknesses: ['fire', 'ice'],
      resistances: [],
      immunities: [],
      skills: ['attack'],
    },
    {
      name: 'ハーピー',
      hp: 15,
      maxHp: 15,
      attackBase: 1,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/fantasy_harpy.png',
        import.meta.url,
      ).href,
      weaknesses: ['stone'],
      resistances: ['wind'],
      immunities: [],
      skills: ['attack', 'paralyze'], // 麻痺を付与
    },
    {
      name: 'オーク',
      hp: 20,
      maxHp: 20,
      attackBase: 2,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/fantasy_orc.png',
        import.meta.url,
      ).href,
      weaknesses: ['wind'],
      resistances: [],
      immunities: [],
      skills: ['attack'], // 強撃は基本攻撃力の倍率ダメージとしてJSで処理
    },
  ],

  // ===== エリア3 通常モンスター =====
  late: [
    {
      name: 'ハーピー',
      hp: 18,
      maxHp: 18,
      attackBase: 2,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/fantasy_harpy.png',
        import.meta.url,
      ).href,
      weaknesses: ['stone'],
      resistances: ['wind'],
      immunities: [],
      skills: ['attack', 'paralyze'],
    },
    {
      name: 'オーク',
      hp: 24,
      maxHp: 24,
      attackBase: 2,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/fantasy_orc.png',
        import.meta.url,
      ).href,
      weaknesses: ['wind'],
      resistances: [],
      immunities: [],
      skills: ['attack'],
    },
    {
      name: 'ドラゴン',
      hp: 35,
      maxHp: 35,
      attackBase: 3,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/fantasy_dragon.png',
        import.meta.url,
      ).href,
      weaknesses: ['ice'],
      resistances: ['fire'],
      immunities: [],
      skills: ['attack', 'fire_attack'], // 炎属性ブレス
    },
  ],

  // ===== 固定中ボス・大ボス =====
  bosses: [
    // エリア1 中ボス (5層)
    {
      name: 'バンディット',
      hp: 30,
      maxHp: 30,
      attackBase: 1,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/character_sanzoku.png',
        import.meta.url,
      ).href,
      weaknesses: [],
      resistances: [],
      immunities: [],
      skills: ['attack', 'rush', 'buff_up', 'poison'],
    },
    // エリア1 ボス (9層)
    {
      name: 'ダークエルフ',
      hp: 50,
      maxHp: 50,
      attackBase: 2,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/fantasy_dark_elf.png',
        import.meta.url,
      ).href,
      weaknesses: ['fire'],
      resistances: [],
      immunities: ['wind'],
      skills: ['attack', 'heal', 'wind_attack', 'dazzle', 'silence'],
    },
    // エリア2 中ボス (4層)
    {
      name: 'ゴーレム',
      hp: 60,
      maxHp: 60,
      attackBase: 2,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/fantasy_golem.png',
        import.meta.url,
      ).href,
      weaknesses: ['wind'],
      resistances: [],
      immunities: ['stone'], // 土無効
      skills: ['attack'],
      isGolem: true, // ダメージ半減、デバフ無効
    },
    // エリア2 ボス (9層)
    {
      name: 'ヴァンパイア',
      hp: 75,
      maxHp: 75,
      attackBase: 2,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/fantasy_dracula2.png',
        import.meta.url,
      ).href,
      weaknesses: ['fire', 'thunder'],
      resistances: [],
      immunities: [],
      skills: ['attack', 'poison', 'dazzle', 'buff_down'],
      isVampire: true, // 毒無効(JSロジック側で処理)
    },
    // エリア3 中ボス (5層)
    {
      name: 'リヴァイアサン',
      hp: 85,
      maxHp: 85,
      attackBase: 3,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/fantasy_leviathan.png',
        import.meta.url,
      ).href,
      weaknesses: ['thunder', 'stone'],
      resistances: ['fire'],
      immunities: ['ice'], // 氷無効
      skills: ['attack', 'ice_attack'], // 氷攻撃
    },
    // エリア3 ラスボス (9層)
    {
      name: '魔王',
      hp: 120,
      maxHp: 120,
      attackBase: 3,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/fantasy_maou_devil.png',
        import.meta.url,
      ).href,
      weaknesses: ['thunder'],
      resistances: [],
      immunities: [],
      skills: [
        'attack',
        'rush',
        'fire_attack',
        'ice_attack',
        'wind_attack',
        'stone_attack',
        'poison',
        'paralyze',
      ],
      isMaou: true, // デバフ50%防ぐ
    },
  ],

  // ===== ミミック =====
  mimic: [
    {
      name: 'ミミック',
      hp: 25,
      maxHp: 25,
      attackBase: 2,
      image: new URL(
        '../../assets/games/roguelike/images/monsters/character_game_mimic.png',
        import.meta.url,
      ).href,
      weaknesses: [],
      resistances: [],
      immunities: [],
      skills: ['attack', 'rush', 'ice_attack'],
    },
  ],
};

/**
 * 階層(フロア)とエリアに応じて出現するモンスターを決定する関数
 */
export function getEnemyTemplate(
  area: number,
  floor: number,
  type: 'battle' | 'elite' | 'mimic' | 'midboss' | 'boss' | 'lastboss',
): EnemyTemplate {
  if (type === 'mimic') {
    return enemyTemplates.mimic[0];
  }

  if (type === 'midboss') {
    // 各エリアの中ボス
    if (area === 1) return enemyTemplates.bosses.find((b) => b.name === 'バンディット')!;
    if (area === 2) return enemyTemplates.bosses.find((b) => b.name === 'ゴーレム')!;
    return enemyTemplates.bosses.find((b) => b.name === 'リヴァイアサン')!;
  }

  if (type === 'boss' || type === 'lastboss') {
    // 各エリアのボス
    if (area === 1) return enemyTemplates.bosses.find((b) => b.name === 'ダークエルフ')!;
    if (area === 2) return enemyTemplates.bosses.find((b) => b.name === 'ヴァンパイア')!;
    return enemyTemplates.bosses.find((b) => b.name === '魔王')!;
  }

  // 通常戦闘・強敵戦闘
  const pool =
    area === 1 ? enemyTemplates.early : area === 2 ? enemyTemplates.mid : enemyTemplates.late;
  const randomIndex = Math.floor(Math.random() * pool.length);
  const tpl = pool[randomIndex];

  if (type === 'elite') {
    // 強敵はHPと攻撃力を少し盛る
    return {
      ...tpl,
      name: '強欲な' + tpl.name,
      hp: Math.floor(tpl.hp * 1.5),
      maxHp: Math.floor(tpl.maxHp * 1.5),
      attackBase: tpl.attackBase + 1,
    };
  }

  return tpl;
}
