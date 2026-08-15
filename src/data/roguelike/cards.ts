export interface Card {
  id: string;
  name: string;
  type: 'attack' | 'skill';
  cost: number;
  value: number;
  desc: string;
  color: 'white' | 'black' | 'red' | 'blue' | 'green' | 'orange' | 'yellow' | 'purple' | 'none';
  element: 'fire' | 'ice' | 'thunder' | 'wind' | 'stone' | 'none';
  healSelf?: number;
  healPercent?: number;
  draw?: number;
  poison?: number;
  paralyze?: boolean; // 麻痺
  buffUp?: number; // 能昇ターン
  buffDown?: number; // 能降ターン
  hits?: number;
  oncePerBattle?: boolean; // 1戦闘で1回のみ
  upgraded?: boolean; // (後方互換性のため残す)
  upgradeCount?: number; // 強化回数(0〜3)
  category?: 'physical' | 'spell' | 'special';
  flavor?: string;
}

export const CARD_DB: Record<string, Card> = {
  // ===================================================
  // 1. 物理カード (Physical)
  // ===================================================
  strike: {
    id: 'strike',
    name: '攻撃',
    type: 'attack',
    category: 'physical',
    cost: 0,
    value: 1,
    desc: '敵に 1 ダメージ',
    color: 'none',
    element: 'none',
    flavor: '手ごろな武器による基本の一撃。',
  },
  smite: {
    id: 'smite',
    name: '強撃',
    type: 'attack',
    category: 'physical',
    cost: 1,
    value: 3,
    desc: '敵に 3 ダメージ',
    color: 'none',
    element: 'none',
    flavor: '渾身の力を込めて打ち下ろす強烈な斬撃。',
  },
  rush: {
    id: 'rush',
    name: '連撃',
    type: 'attack',
    category: 'physical',
    cost: 1,
    value: 1,
    desc: '敵に 1×2 ダメージ',
    color: 'none',
    element: 'none',
    hits: 2,
    flavor: '流れるような動作から放たれる連続の斬撃。',
  },

  // ===================================================
  // 2. 呪文カード (Spell)
  // ===================================================
  // --- 属性攻撃 ---
  fire: {
    id: 'fire',
    name: '火炎',
    type: 'attack',
    category: 'spell',
    cost: 2,
    value: 3,
    desc: '敵に 3 ダメージ',
    color: 'red',
    element: 'fire',
    flavor: '灼熱の炎を生み出し、敵を焼き尽くす。',
  },
  ice: {
    id: 'ice',
    name: '冷気',
    type: 'attack',
    category: 'spell',
    cost: 2,
    value: 3,
    desc: '敵に 3 ダメージ',
    color: 'blue',
    element: 'ice',
    flavor: '極寒の冷気で敵を氷漬けにする。',
  },
  wind: {
    id: 'wind',
    name: '迅風',
    type: 'attack',
    category: 'spell',
    cost: 2,
    value: 3,
    desc: '敵に 3 ダメージ',
    color: 'green',
    element: 'wind',
    flavor: '鋭利な風の刃で敵を切り裂く。',
  },
  stone: {
    id: 'stone',
    name: '礫石',
    type: 'attack',
    category: 'spell',
    cost: 2,
    value: 3,
    desc: '敵に 3 ダメージ',
    color: 'orange',
    element: 'stone',
    flavor: '大地の岩石を隆起させて圧砕する。',
  },
  thunder: {
    id: 'thunder',
    name: '雷撃',
    type: 'attack',
    category: 'spell',
    cost: 3,
    value: 2,
    desc: '敵に 2 ダメージ <br> 30%で麻痺付与',
    color: 'yellow',
    element: 'thunder',
    paralyze: true,
    flavor: '電気を放出して攻撃し、感電させる。',
  },
  // --- 回復 ---
  heal: {
    id: 'heal',
    name: '快癒',
    type: 'skill',
    category: 'spell',
    cost: 2,
    value: 0,
    desc: 'HP+30%回復',
    color: 'white',
    element: 'none',
    healPercent: 0.3,
    flavor: '聖なる光で創傷を瞬時に癒やす。',
  },
  fortify: {
    id: 'fortify',
    name: '回復',
    type: 'skill',
    category: 'spell',
    cost: 3,
    value: 0,
    desc: 'HP+30%回復',
    color: 'white',
    element: 'none',
    healPercent: 0.3,
    flavor: '生命の脈動を高めて体力を取り戻す。',
  },
  // --- バフ ---
  buff_up: {
    id: 'buff_up',
    name: '能昇',
    type: 'skill',
    category: 'spell',
    cost: 2,
    value: 0,
    desc: '自分は 3 ターンの間、<br>与ダメージ +1、被ダメージ -1',
    color: 'white',
    element: 'none',
    buffUp: 3,
    flavor: '魔力を体内に巡らせ、全能力を高める。',
  },
  // --- デバフ ---
  buff_down: {
    id: 'buff_down',
    name: '能降',
    type: 'skill',
    category: 'spell',
    cost: 2,
    value: 0,
    desc: '敵は 3 ターンの間、<br>与ダメージ -1、被ダメージ +1',
    color: 'black',
    element: 'none',
    buffDown: 3,
    flavor: '呪詛を浴びせ、相手の戦意と防御を殺ぐ。',
  },
  // --- 状態異常 ---
  venom: {
    id: 'venom',
    name: '毒計',
    type: 'attack',
    category: 'spell',
    cost: 2,
    value: 1,
    desc: '敵に 1 ダメージ <br> 毒1 を付与',
    color: 'black',
    element: 'none',
    poison: 1,
    flavor: '忍び寄る劇薬で敵の命を蝕む。',
  },
  dazzle: {
    id: 'dazzle',
    name: '幻惑',
    type: 'skill',
    category: 'spell',
    cost: 2,
    value: 0,
    desc: '相手を 2 ターンの間、<br>幻惑状態にする',
    color: 'purple',
    element: 'none',
    flavor: '妖しい光で敵の正気を奪い錯乱させる。',
  },
  silence: {
    id: 'silence',
    name: '沈黙',
    type: 'skill',
    category: 'spell',
    cost: 2,
    value: 0,
    desc: '相手を 2 ターンの間、<br>沈黙状態にする',
    color: 'black',
    element: 'none',
    flavor: '静寂の結界を張り、詠唱を完全遮断する。',
  },

  // ===================================================
  // 3. 特殊カード (Special)
  // ===================================================
  draw_card: {
    id: 'draw_card',
    name: 'ドロー',
    type: 'skill',
    category: 'special',
    cost: 1,
    value: 0,
    desc: '行動回数を消費せず、<br>カードを 2 枚引く',
    color: 'none',
    element: 'none',
    draw: 2,
    flavor: '素早い思考で次の戦術を手繰り寄せる。',
  },
  meteor: {
    id: 'meteor',
    name: '流星群',
    type: 'attack',
    category: 'special',
    cost: 3,
    value: 5,
    hits: 4,
    desc: '敵に火・水・風・土属性で各4×5ダメージ (戦闘中1回のみ使用可能)',
    color: 'purple',
    element: 'none',
    oncePerBattle: true,
    flavor: '天より降り注ぐ四属性の大流星。',
  },
  kakusei: {
    id: 'kakusei',
    name: '覚醒',
    type: 'skill',
    category: 'special',
    cost: 3,
    value: 0,
    desc: '自分に能昇を5ターン、敵に能降を5ターン付与する (戦闘中1回のみ使用可能)',
    color: 'white',
    element: 'none',
    buffUp: 5,
    buffDown: 5,
    oncePerBattle: true,
    flavor: '潜在能力を限界突破させ神域の領域に達する。',
  },
  drain: {
    id: 'drain',
    name: 'ドレイン',
    type: 'attack',
    category: 'special',
    cost: 2,
    value: 4,
    desc: '敵の生気を吸い取り、与えたダメージ分自身のHPを回復する',
    color: 'red',
    element: 'none',
    flavor: 'ヴァンパイアの秘術。血肉を喰らい生命を奪う。',
  },
  daikaisho: {
    id: 'daikaisho',
    name: '大海嘯',
    type: 'attack',
    category: 'special',
    cost: 3,
    value: 6,
    desc: '相手のバフを全解除し、1ターン行動不能＋水属性大ダメージ',
    color: 'blue',
    element: 'ice',
    paralyze: true,
    flavor: 'リヴァイアサンが起こす深海の怒涛。',
  },
  ankoku_ken: {
    id: 'ankoku_ken',
    name: '暗黒剣',
    type: 'attack',
    category: 'special',
    cost: 3,
    value: 0,
    desc: '相手の現在HPを半分(50%)にする魔王の絶望の一撃',
    color: 'black',
    element: 'none',
    flavor: '魔王の暗黒闘気が対象の命運を問答無用で半減させる。',
  },
};

// 報酬候補プール
export const REWARD_POOL = [
  'smite',
  'rush',
  'fire',
  'ice',
  'wind',
  'stone',
  'thunder',
  'venom',
  'fortify',
  'draw_card',
  'buff_up',
  'buff_down',
  'meteor',
  'kakusei',
];

// 初期デッキの定義 (12枚)
export const INITIAL_DECKS: Record<string, string[]> = {
  // 勇者: 攻撃3, 強撃1, 連撃1, 火炎1, 雷撃1, 快癒2, 能昇1, 能降1, ドロー1
  yuusya: [
    'strike',
    'strike',
    'strike',
    'smite',
    'rush',
    'fire',
    'thunder',
    'heal',
    'heal',
    'buff_up',
    'buff_down',
    'draw_card',
  ],
  // 戦士: 攻撃3, 強撃3, 連撃1, 快癒2, 能降1, ドロー2
  kenshi: [
    'strike',
    'strike',
    'strike',
    'smite',
    'smite',
    'smite',
    'rush',
    'heal',
    'heal',
    'buff_down',
    'draw_card',
    'draw_card',
  ],
  // 魔法使い: 火炎2, 冷気2, 迅風2, 礫石2, 能降1, 毒計1, ドロー2
  mahoutsukai: [
    'fire',
    'fire',
    'ice',
    'ice',
    'wind',
    'wind',
    'stone',
    'stone',
    'buff_down',
    'venom',
    'draw_card',
    'draw_card',
  ],
  // 武闘家: 攻撃3, 強撃1, 連撃3, 快癒1, 能昇3, ドロー1
  butouka: [
    'strike',
    'strike',
    'strike',
    'smite',
    'rush',
    'rush',
    'rush',
    'heal',
    'buff_up',
    'buff_up',
    'buff_up',
    'draw_card',
  ],
};

/**
 * カードを強化(アップグレード)した時の性能変化を適用する関数
 */
export function upgradeCard(card: Card): Card {
  const currentCount = card.upgradeCount || 0;
  if (currentCount >= 3) return card; // 最大強化済み

  const upgradedCard = { ...card, upgraded: true, upgradeCount: currentCount + 1 };
  upgradedCard.name = card.name + '+';

  const level = upgradedCard.upgradeCount!;

  switch (card.id) {
    case 'strike':
      upgradedCard.value = 2;
      upgradedCard.desc = `敵に <span class="card-val-up">${upgradedCard.value}</span> ダメージ`;
      break;
    case 'heal':
      upgradedCard.healPercent = 0.5;
      upgradedCard.desc = `HP +<span class="card-val-up">50%</span> 回復`;
      break;
    case 'smite':
      upgradedCard.cost = 1;
      upgradedCard.value = 4 + 1 * level;
      upgradedCard.desc = `敵に <span class="card-val-up">${upgradedCard.value}</span> ダメージ`;
      break;
    case 'rush':
      upgradedCard.cost = 1;
      upgradedCard.hits = 2 + level;
      upgradedCard.desc = `敵に 1×<span class="card-val-up">${upgradedCard.hits}</span> ダメージ`;
      break;
    case 'fire':
      upgradedCard.value = 3 + 2 * level;
      upgradedCard.desc = `敵に <span class="card-val-up">${upgradedCard.value}</span> ダメージ`;
      break;
    case 'ice':
      upgradedCard.value = 3 + 2 * level;
      upgradedCard.desc = `敵に <span class="card-val-up">${upgradedCard.value}</span> ダメージ`;
      break;
    case 'wind':
      upgradedCard.value = 3 + 2 * level;
      upgradedCard.desc = `敵に <span class="card-val-up">${upgradedCard.value}</span> ダメージ`;
      break;
    case 'stone':
      upgradedCard.value = 3 + 2 * level;
      upgradedCard.desc = `敵に <span class="card-val-up">${upgradedCard.value}</span> ダメージ`;
      break;
    case 'thunder':
      upgradedCard.value = 2 + 1 * level;
      upgradedCard.desc = `敵に <span class="card-val-up">${upgradedCard.value}</span> ダメージ <br> 30%で麻痺付与`;
      break;
    case 'venom':
      upgradedCard.value = 1 + 1 * level;
      upgradedCard.poison = 1 + 1 * level;
      upgradedCard.desc = `敵に <span class="card-val-up">${upgradedCard.value}</span> ダメージ <br> 毒<span class="card-val-up">${upgradedCard.poison}</span> を付与`;
      break;
    case 'dazzle':
      upgradedCard.desc = `相手を <span class="card-val-up">${2 + level}</span> ターンの間、<br>幻惑状態にする`;
      break;
    case 'silence':
      upgradedCard.desc = `相手を <span class="card-val-up">${2 + level}</span> ターンの間、<br>沈黙状態にする`;
      break;
    case 'fortify':
      upgradedCard.healPercent = 0.5;
      upgradedCard.desc = `HP+<span class="card-val-up">50%</span>回復`;
      break;
    case 'draw_card':
      upgradedCard.cost = Math.max(0, upgradedCard.cost - 1);
      upgradedCard.draw = 2 + 1 * level;
      upgradedCard.desc = `行動回数を消費せず、<br>カードを <span class="card-val-up">${upgradedCard.draw}</span> 枚引く`;
      break;
    case 'buff_up':
      upgradedCard.cost = 0;
      upgradedCard.buffUp = 3 + 1 * (level - 1);
      upgradedCard.desc = `自分は <span class="card-val-up">${upgradedCard.buffUp}</span> ターンの間、<br>与ダメージ +1、被ダメージ -1`;
      break;
    case 'buff_down':
      upgradedCard.cost = 0;
      upgradedCard.buffDown = 3 + 1 * (level - 1);
      upgradedCard.desc = `敵は <span class="card-val-up">${upgradedCard.buffDown}</span> ターンの間、<br>与ダメージ -1、被ダメージ +1`;
      break;
    case 'meteor':
      upgradedCard.value = 5 + 3 * level;
      upgradedCard.desc = `敵に火・水・風・土属性で各4×<span class="card-val-up">${upgradedCard.value}</span>ダメージ (戦闘中1回のみ使用可能)`;
      break;
    case 'kakusei':
      upgradedCard.buffUp = 5 + level;
      upgradedCard.buffDown = 5 + level;
      upgradedCard.desc = `自分に能昇を <span class="card-val-up">${upgradedCard.buffUp}</span> ターン、敵に能降を <span class="card-val-up">${upgradedCard.buffDown}</span> ターン付与する (戦闘中1回のみ使用可能)`;
      break;
    case 'drain':
      upgradedCard.value = 4 + 2 * level;
      upgradedCard.desc = `敵の生気を吸い取り、与えた <span class="card-val-up">${upgradedCard.value}</span> ダメージ分自身のHPを回復する`;
      break;
    case 'daikaisho':
      upgradedCard.value = 6 + 3 * level;
      upgradedCard.desc = `相手のバフを全解除し、1ターン行動不能＋水属性大ダメージ(<span class="card-val-up">${upgradedCard.value}</span>)`;
      break;
    case 'ankoku_ken':
      upgradedCard.desc = `相手の現在HPを半分(50%)にする魔王の絶望の一撃`;
      break;
  }
  return upgradedCard;
}
