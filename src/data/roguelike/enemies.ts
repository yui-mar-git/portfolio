export interface EnemyTemplate {
  name: string;
  hp: number;
  maxHp: number;
  rewardGold: number;
  attackBase: number;
  image: string;
  weaknesses: string[]; // 弱点属性 (ダメージ1.5倍)
  resistances: string[]; // 軽減属性 (ダメージ0.5倍)
  immunities: string[]; // 無効属性 (ダメージ0倍)
  absorptions?: string[]; // 吸収属性 (ダメージ分敵HP回復)
  statusSureHit?: string[]; // 必中状態異常 (効果/ターン+1)
  statusWeaknesses?: string[]; // 弱点状態異常 (効果/ターン+1)
  statusResistances?: string[]; // 耐性状態異常 (50%無効化)
  statusImmunities?: string[]; // 無効状態異常 (100%無効化)
  skills: string[];
  isGolem?: boolean;
  isVampire?: boolean;
  isMaou?: boolean;
}

export interface MonsterMeta {
  id: string;
  name: string;
  hp: number;
  rewardGold: number;
  attackBase: number;
  image: string;
  weaknesses: string[];
  resistances: string[];
  immunities: string[];
  absorptions?: string[];
  statusSureHit?: string[];
  statusWeaknesses?: string[];
  statusResistances?: string[];
  statusImmunities?: string[];
  skills: string[];
  flavor: string;
  pools: Array<'early' | 'mid' | 'late' | 'boss' | 'mimic'>;
  isGolem?: boolean;
  isVampire?: boolean;
  isMaou?: boolean;
}

export const MONSTER_DB: Record<string, MonsterMeta> = {
  // ===================================================
  // 1. エリア1限定モンスター (Area 1 Only)
  // ===================================================
  slime: {
    id: 'slime',
    name: 'スライム',
    hp: 6,
    rewardGold: 5,
    attackBase: 1,
    image: new URL(
      '../../assets/games/tower-defense/images/enemy/fantasy_game_character_slime.png',
      import.meta.url,
    ).href,
    weaknesses: [],
    resistances: ['fire'],
    immunities: [],
    absorptions: ['ice'],
    statusWeaknesses: ['poison'],
    statusResistances: ['dazzle'],
    skills: ['攻撃'],
    flavor: 'ぷるぷる、僕は悪いスライムだよ。',
    pools: ['early'],
  },
  karasu: {
    id: 'karasu',
    name: 'カラス',
    hp: 7,
    rewardGold: 6,
    attackBase: 1,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/bird_karasu_kowai.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire', 'ice'],
    resistances: [],
    immunities: [],
    statusSureHit: ['dazzle'],
    skills: ['攻撃'],
    flavor: 'カラスが泣いたぞ。帰りな。',
    pools: ['early'],
  },
  hornet: {
    id: 'hornet',
    name: 'ホーネット',
    hp: 8,
    rewardGold: 10,
    attackBase: 1,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/bug_hachi_doku.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire', 'wind'],
    resistances: [],
    immunities: [],
    statusWeaknesses: ['dazzle'],
    statusImmunities: ['poison'],
    skills: ['攻撃', '毒計'],
    flavor: 'ハチには気を付けよう！',
    pools: ['early'],
  },

  // ===================================================
  // 2. エリア1〜2出現モンスター (Area 1~2 Shared)
  // ===================================================
  goblin: {
    id: 'goblin',
    name: 'ゴブリン',
    hp: 10,
    rewardGold: 8,
    attackBase: 1,
    image: new URL(
      '../../assets/games/tower-defense/images/enemy/fantasy_goblin.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire'],
    resistances: [],
    immunities: [],
    statusWeaknesses: ['silence'],
    statusResistances: ['poison'],
    skills: ['攻撃'],
    flavor: '小柄でイタズラ好きな悪鬼。打製石器ぐらいの文明レベルがある。',
    pools: ['early', 'mid'],
  },
  ookami: {
    id: 'ookami',
    name: 'オオカミ',
    hp: 9,
    rewardGold: 10,
    attackBase: 1,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/animal_ookami.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire', 'ice'],
    resistances: [],
    immunities: [],
    statusWeaknesses: ['paralyze'],
    skills: ['攻撃', '連撃'],
    flavor: '本来は群れで行動する獣だが、ゲーム性の都合で全員一匹狼。',
    pools: ['early', 'mid'],
  },
  mandrake: {
    id: 'mandrake',
    name: 'マンドラゴラ',
    hp: 12,
    rewardGold: 12,
    attackBase: 1,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_mandrake_mandragora.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire'],
    resistances: ['ice', 'stone'],
    immunities: [],
    statusResistances: ['poison'],
    statusImmunities: ['silence'],
    skills: ['礫石', '幻惑'],
    flavor: '悲鳴を上げて精神を掻き乱す植物。別名の「恋なすび」を気に入っている',
    pools: ['early', 'mid'],
  },

  // ===================================================
  // 3. エリア2限定モンスター (Area 2 Only)
  // ===================================================
  bear: {
    id: 'bear',
    name: 'ベアー',
    hp: 18,
    rewardGold: 18,
    attackBase: 1,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/animal_bear_higuma.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire', 'ice'],
    resistances: [],
    immunities: [],
    statusResistances: ['paralyze'],
    skills: ['強撃'],
    flavor: 'そなたは山で暮らせ',
    pools: ['mid'],
  },

  // ===================================================
  // 4. エリア2〜3出現モンスター (Area 2~3 Shared)
  // ===================================================
  harpy: {
    id: 'harpy',
    name: 'ハーピー',
    hp: 16,
    rewardGold: 20,
    attackBase: 1,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_harpy.png',
      import.meta.url,
    ).href,
    weaknesses: ['stone'],
    resistances: ['wind'],
    immunities: [],
    statusWeaknesses: ['silence'],
    statusImmunities: ['dazzle'],
    skills: ['攻撃', '幻惑', '沈黙'],
    flavor: 'ボエ～',
    pools: ['mid', 'late'],
  },
  wyvern: {
    id: 'wyvern',
    name: 'ワイバーン',
    hp: 26,
    rewardGold: 30,
    attackBase: 2,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_dragon_wyvern.png',
      import.meta.url,
    ).href,
    weaknesses: ['ice', 'thunder'],
    resistances: ['wind'],
    immunities: ['stone'],
    absorptions: [],
    statusWeaknesses: ['silence'],
    statusResistances: ['paralyze'],
    skills: ['迅風', '連撃'],
    flavor: '大空を舞う双翼の竜。火熱を熱源として吸収する。',
    pools: ['mid', 'late'],
  },
  orc: {
    id: 'orc',
    name: 'オーク',
    hp: 22,
    rewardGold: 24,
    attackBase: 2,
    image: new URL('../../assets/games/roguelike/images/monsters/fantasy_orc.png', import.meta.url)
      .href,
    weaknesses: ['wind'],
    resistances: [],
    immunities: [],
    statusWeaknesses: ['dazzle'],
    statusResistances: ['buff_down'],
    skills: ['強撃'],
    flavor: '強靭な肉体を持つ猪頭の戦士。能力低下に強いが幻惑に騙されやすい。',
    pools: ['mid', 'late'],
  },

  // ===================================================
  // 5. エリア3限定モンスター (Area 3 Only)
  // ===================================================
  dragon: {
    id: 'dragon',
    name: 'ドラゴン',
    hp: 36,
    rewardGold: 40,
    attackBase: 2,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_dragon.png',
      import.meta.url,
    ).href,
    weaknesses: ['ice'],
    resistances: ['thunder'],
    immunities: ['wind'],
    absorptions: ['fire'],
    statusResistances: ['poison', 'paralyze'],
    skills: ['攻撃', '火炎'],
    flavor: '灼熱の火炎を力に変換するドラゴン、毒や麻痺にも頑強。',
    pools: ['late'],
  },

  // ===================================================
  // 6. ボス・イベントモンスター (Bosses & Event)
  // ===================================================
  bandit: {
    id: 'bandit',
    name: 'バンディット',
    hp: 20,
    rewardGold: 50,
    attackBase: 2,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/character_sanzoku.png',
      import.meta.url,
    ).href,
    weaknesses: ['thunder'],
    resistances: [],
    immunities: [],
    statusResistances: ['poison'],
    skills: ['強撃', '連撃', '能昇', '毒計'],
    flavor: 'エリア1のボス。毒への心得があり耐性を持つ山賊。',
    pools: ['boss'],
  },
  dark_elf: {
    id: 'dark_elf',
    name: 'ダークエルフ',
    hp: 30,
    rewardGold: 80,
    attackBase: 2,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_dark_elf.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire'],
    resistances: [],
    immunities: ['wind'],
    statusImmunities: ['silence', 'dazzle'],
    skills: ['快癒', '迅風', '幻惑', '沈黙'],
    flavor: 'エリア1のボス。精神鍛錬により沈黙および幻惑を完全無効化する。',
    pools: ['boss'],
  },
  golem: {
    id: 'golem',
    name: 'ゴーレム',
    hp: 60,
    rewardGold: 70,
    attackBase: 2,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_golem.png',
      import.meta.url,
    ).href,
    weaknesses: ['wind'],
    resistances: ['fire', 'ice', 'thunder'],
    immunities: ['stone'],
    statusImmunities: ['poison', 'paralyze', 'dazzle', 'silence', 'buff_down'],
    skills: ['礫石'],
    flavor: 'エリア2のボス。街を守る石でできたゴーレム。無生物のため全状態異常が効かず、多くの呪文も効きづらい。',
    pools: ['boss'],
    isGolem: true,
  },
  vampire: {
    id: 'vampire',
    name: 'ヴァンパイア',
    hp: 75,
    rewardGold: 100,
    attackBase: 2,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_dracula2.png',
      import.meta.url,
    ).href,
    weaknesses: ['fire', 'thunder'],
    resistances: [],
    immunities: [],
    absorptions: ['ice'],
    statusImmunities: ['poison', 'paralyze', 'dazzle', 'silence', 'buff_down'],
    skills: ['ドレイン', '毒計', '幻惑', '能降'],
    flavor: 'エリア2のボス。姫を攫った魔王軍のヴァンパイア。独身。',
    pools: ['boss'],
    isVampire: true,
  },
  leviathan: {
    id: 'leviathan',
    name: 'リヴァイアサン',
    hp: 85,
    rewardGold: 120,
    attackBase: 2,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_leviathan.png',
      import.meta.url,
    ).href,
    weaknesses: ['thunder', 'stone'],
    resistances: ['fire'],
    immunities: [],
    absorptions: ['ice'],
    statusResistances: ['poison'],
    statusImmunities: ['paralyze'],
    skills: ['大海嘯', '冷気'],
    flavor: '伝説の海龍。氷の冷気を吸収し、巨大な身体構造で麻痺を寄せ付けない。',
    pools: ['boss'],
  },
  maou: {
    id: 'maou',
    name: '魔王',
    hp: 120,
    rewardGold: 300,
    attackBase: 3,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/fantasy_maou_devil.png',
      import.meta.url,
    ).href,
    weaknesses: ['thunder'],
    resistances: ['fire', 'ice', 'wind', 'stone'],
    immunities: [],
    statusResistances: ['poison', 'paralyze', 'dazzle', 'silence', 'buff_down'],
    skills: ['暗黒剣', '覚醒', '流星群'],
    flavor: '絶望の支配者。あらゆる属性を和らげ、全状態異常に対し強靭な抵抗力を持つ。',
    pools: ['boss'],
    isMaou: true,
  },
  mimic: {
    id: 'mimic',
    name: 'ミミック',
    hp: 25,
    rewardGold: 40,
    attackBase: 2,
    image: new URL(
      '../../assets/games/roguelike/images/monsters/character_game_mimic.png',
      import.meta.url,
    ).href,
    weaknesses: [],
    resistances: ['stone'],
    immunities: [],
    statusImmunities: ['dazzle', 'silence'],
    skills: ['強撃', '冷気'],
    flavor: '宝箱の魔物。堅固な外装と視覚を持たない構造で幻惑・沈黙を無効化。',
    pools: ['mimic'],
  },
};

/**
 * MonsterMeta から EnemyTemplate オブジェクトを自動生成する変換関数
 */
export function createEnemyTemplateFromMonster(m: MonsterMeta): EnemyTemplate {
  return {
    name: m.name,
    hp: m.hp,
    maxHp: m.hp,
    rewardGold: m.rewardGold || 10,
    attackBase: m.attackBase || 1,
    image: m.image,
    weaknesses: [...(m.weaknesses || [])],
    resistances: [...(m.resistances || [])],
    immunities: [...(m.immunities || [])],
    absorptions: m.absorptions ? [...m.absorptions] : [],
    statusSureHit: m.statusSureHit ? [...m.statusSureHit] : [],
    statusWeaknesses: m.statusWeaknesses ? [...m.statusWeaknesses] : [],
    statusResistances: m.statusResistances ? [...m.statusResistances] : [],
    statusImmunities: m.statusImmunities ? [...m.statusImmunities] : [],
    skills: [...(m.skills || [])],
    isGolem: m.isGolem,
    isVampire: m.isVampire,
    isMaou: m.isMaou,
  };
}

/**
 * MONSTER_DB の単一マスタから動的生成する敵テンプレート集
 */
export const enemyTemplates = {
  get early(): EnemyTemplate[] {
    return Object.values(MONSTER_DB)
      .filter((m) => m.pools?.includes('early'))
      .map(createEnemyTemplateFromMonster);
  },
  get mid(): EnemyTemplate[] {
    return Object.values(MONSTER_DB)
      .filter((m) => m.pools?.includes('mid'))
      .map(createEnemyTemplateFromMonster);
  },
  get late(): EnemyTemplate[] {
    return Object.values(MONSTER_DB)
      .filter((m) => m.pools?.includes('late'))
      .map(createEnemyTemplateFromMonster);
  },
  get bosses(): EnemyTemplate[] {
    return Object.values(MONSTER_DB)
      .filter((m) => m.pools?.includes('boss'))
      .map(createEnemyTemplateFromMonster);
  },
  get mimic(): EnemyTemplate[] {
    return Object.values(MONSTER_DB)
      .filter((m) => m.pools?.includes('mimic'))
      .map(createEnemyTemplateFromMonster);
  },
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
    return createEnemyTemplateFromMonster(MONSTER_DB.mimic);
  }

  if (type === 'midboss') {
    if (area === 1) return createEnemyTemplateFromMonster(MONSTER_DB.bandit);
    if (area === 2) return createEnemyTemplateFromMonster(MONSTER_DB.golem);
    return createEnemyTemplateFromMonster(MONSTER_DB.leviathan);
  }

  if (type === 'boss' || type === 'lastboss') {
    if (area === 1) return createEnemyTemplateFromMonster(MONSTER_DB.dark_elf);
    if (area === 2) return createEnemyTemplateFromMonster(MONSTER_DB.vampire);
    return createEnemyTemplateFromMonster(MONSTER_DB.maou);
  }

  const pool =
    area === 1 ? enemyTemplates.early : area === 2 ? enemyTemplates.mid : enemyTemplates.late;
  const randomIndex = Math.floor(Math.random() * pool.length);
  const tpl = pool[randomIndex] || createEnemyTemplateFromMonster(MONSTER_DB.slime);

  if (type === 'elite') {
    return {
      ...tpl,
      name: '強欲な' + tpl.name,
      hp: Math.floor(tpl.hp * 1.5),
      maxHp: Math.floor(tpl.maxHp * 1.5),
      rewardGold: Math.floor(tpl.rewardGold * 1.5),
      attackBase: tpl.attackBase + 1,
    };
  }

  return tpl;
}
