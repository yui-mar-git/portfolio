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
  draw?: number;
  poison?: number;
  paralyze?: boolean; // 麻痺
  buffUp?: number;    // 能昇ターン
  buffDown?: number;  // 能降ターン
  hits?: number;
  oncePerBattle?: boolean; // 1戦闘で1回のみ
  upgraded?: boolean; // (後方互換性のため残す)
  upgradeCount?: number; // 強化回数(0〜3)
  flavor?: string;
}

export const CARD_DB: Record<string, Card> = {
  // ===== 基本カード =====
  'strike': {
    id: 'strike',
    name: '攻撃',
    type: 'attack',
    cost: 1,
    value: 2,
    desc: '敵に 2 ダメージ',
    color: 'none',
    element: 'none',
    flavor: 'フレーバーテキスト準備中'
  },
  'heal': {
    id: 'heal',
    name: '快癒',
    type: 'skill',
    cost: 1,
    value: 0,
    desc: 'HP +3 回復',
    color: 'white',
    element: 'none',
    healSelf: 3,
    flavor: 'フレーバーテキスト準備中'
  },
  'smite': {
    id: 'smite',
    name: '強撃',
    type: 'attack',
    cost: 2,
    value: 4,
    desc: '敵に 4 ダメージ',
    color: 'none',
    element: 'none',
    flavor: 'フレーバーテキスト準備中'
  },
  'rush': {
    id: 'rush',
    name: '連撃',
    type: 'attack',
    cost: 2,
    value: 1,
    desc: '敵に 1×2 ダメージ',
    color: 'none',
    element: 'none',
    hits: 2,
    flavor: 'フレーバーテキスト準備中'
  },

  // ===== 属性カード =====
  'fire': {
    id: 'fire',
    name: '火炎',
    type: 'attack',
    cost: 1,
    value: 3,
    desc: '敵に 3 ダメージ (炎)',
    color: 'red',
    element: 'fire',
    flavor: 'フレーバーテキスト準備中'
  },
  'ice': {
    id: 'ice',
    name: '冷気',
    type: 'attack',
    cost: 1,
    value: 3,
    desc: '敵に 氷属性の 3 ダメージ',
    color: 'blue',
    element: 'ice',
    flavor: 'フレーバーテキスト準備中'
  },
  'wind': {
    id: 'wind',
    name: '迅風',
    type: 'attack',
    cost: 1,
    value: 3,
    desc: '敵に 3 ダメージ (風)',
    color: 'green',
    element: 'wind',
    flavor: 'フレーバーテキスト準備中'
  },
  'stone': {
    id: 'stone',
    name: '礫石',
    type: 'attack',
    cost: 1,
    value: 3,
    desc: '敵に 3 ダメージ (土)',
    color: 'orange',
    element: 'stone',
    flavor: 'フレーバーテキスト準備中'
  },
  'thunder': {
    id: 'thunder',
    name: '雷撃',
    type: 'attack',
    cost: 1,
    value: 2,
    desc: '敵に 2 ダメージ (雷) ＋ 30%で麻痺付与',
    color: 'yellow',
    element: 'thunder',
    paralyze: true , // 
    flavor: 'フレーバーテキスト準備中'
  },

  // ===== バフ・デバフ・状態異常 =====
  'venom': {
    id: 'venom',
    name: '毒計',
    type: 'attack',
    cost: 1,
    value: 1,
    desc: '敵に 1 ダメージ ＋ 毒1 を付与',
    color: 'black',
    element: 'none',
    poison: 1,
    flavor: 'フレーバーテキスト準備中'
  },
  'fortify': {
    id: 'fortify',
    name: '治療',
    type: 'skill',
    cost: 2,
    value: 0,
    desc: 'HP +6 回復',
    color: 'white',
    element: 'none',
    healSelf: 6,
    flavor: 'フレーバーテキスト準備中'
  },
  'draw_card': {
    id: 'draw_card',
    name: 'ドロー',
    type: 'skill',
    cost: 1,
    value: 0,
    desc: 'カードを 2 枚引き、行動回数+1',
    color: 'none',
    element: 'none',
    draw: 2,
    flavor: 'フレーバーテキスト準備中'
  },
  'buff_up': {
    id: 'buff_up',
    name: '能昇',
    type: 'skill',
    cost: 1,
    value: 0,
    desc: '自身に「能昇」を 3 ターン付与',
    color: 'white',
    element: 'none',
    buffUp: 3,
    flavor: 'フレーバーテキスト準備中'
  },
  'buff_down': {
    id: 'buff_down',
    name: '能降',
    type: 'skill',
    cost: 1,
    value: 0,
    desc: '敵に「能降」を 3 ターン付与',
    color: 'black',
    element: 'none',
    buffDown: 3,
    flavor: 'フレーバーテキスト準備中'
  },

  // ===== スペシャルカード =====
  'meteor': {
    id: 'meteor',
    name: 'メテオ',
    type: 'attack',
    cost: 3,
    value: 8,
    desc: '敵に 8 ダメージ (炎・氷・雷の全属性効果) (戦闘中1回のみ使用可能)',
    color: 'purple',
    element: 'fire', // 炎として扱うが、全属性に強い(弱点)を突く特別計算をJSで行う
    oncePerBattle: true,
    flavor: 'フレーバーテキスト準備中'
  }
};

// 報酬候補プール
export const REWARD_POOL = ['smite', 'rush', 'fire', 'ice', 'wind', 'stone', 'thunder', 'venom', 'fortify', 'draw_card', 'buff_up', 'buff_down', 'meteor'];

// 初期デッキの定義 (12枚)
export const INITIAL_DECKS: Record<string, string[]> = {
  // 勇者: 攻撃3, 強撃1, 連撃1, 火炎1, 雷撃1, 快癒2, 能昇1, 能降1, ドロー1
  yuusya: ['strike', 'strike', 'strike', 'smite', 'rush', 'fire', 'thunder', 'heal', 'heal', 'buff_up', 'buff_down', 'draw_card'],
  // 戦士: 攻撃3, 強撃3, 連撃1, 快癒2, 能降1, ドロー2 
  kenshi: ['strike', 'strike', 'strike', 'smite', 'smite', 'smite', 'rush', 'heal', 'heal', 'buff_down', 'draw_card', 'draw_card'],
  // 魔法使い: 火炎2, 冷気2, 迅風2, 礫石2, 能降1, 毒計1, ドロー2 
  mahoutsukai: ['fire', 'fire', 'ice', 'ice', 'wind', 'wind', 'stone', 'stone', 'buff_down', 'venom', 'draw_card', 'draw_card'],
  // 武闘家: 攻撃3, 強撃1, 連撃3, 快癒1, 能昇3, ドロー1 
  butouka: ['strike', 'strike', 'strike', 'smite', 'rush', 'rush', 'rush', 'heal', 'buff_up', 'buff_up', 'buff_up', 'draw_card'],
    flavor: 'フレーバーテキスト準備中'
  };

/**
 * カードを強化(アップグレード)した時の性能変化を適用する関数
 */
export function upgradeCard(card: Card): Card {
  const currentCount = card.upgradeCount || 0;
  if (currentCount >= 3) return card; // 最大強化済み

  const upgradedCard = { ...card, upgraded: true, upgradeCount: currentCount + 1 };
  upgradedCard.name = card.name + '+';

  // 強化回数に応じたスケール計算関数（初期強化幅 = n）
  // 1回目(currentCount=0)は n、2回目は n*2、3回目は n*3 だけ基礎値に加算される
  const level = upgradedCard.upgradeCount!;

  switch (card.id) {
    case 'strike':
      upgradedCard.value = 2 + (2 * level);
      upgradedCard.desc = `敵に <span style="color:#4ade80;font-weight:bold;">${upgradedCard.value}</span> ダメージ`;
      break;
    case 'heal':
      upgradedCard.healSelf = 3 + (2 * level);
      upgradedCard.desc = `HP +<span style="color:#4ade80;font-weight:bold;">${upgradedCard.healSelf}</span> 回復`;
      break;
    case 'smite':
      upgradedCard.cost = 1;
      upgradedCard.value = 4 + (1 * level);
      upgradedCard.desc = `敵に ${upgradedCard.value} ダメージ (<span style="color:#4ade80;font-weight:bold;">コスト1</span>)`;
      break;
    case 'rush':
      upgradedCard.cost = 1;
      upgradedCard.value = 1 + (1 * level);
      upgradedCard.desc = `敵に ${upgradedCard.value}×2 ダメージ (<span style="color:#4ade80;font-weight:bold;">コスト1</span>)`;
      break;
    case 'fire':
      upgradedCard.value = 3 + (2 * level);
      upgradedCard.desc = `敵に <span style="color:#4ade80;font-weight:bold;">${upgradedCard.value}</span> ダメージ (炎)`;
      break;
    case 'ice':
      upgradedCard.value = 3 + (2 * level);
      upgradedCard.desc = `敵に <span style="color:#4ade80;font-weight:bold;">${upgradedCard.value}</span> ダメージ (氷)`;
      break;
    case 'wind':
      upgradedCard.value = 3 + (2 * level);
      upgradedCard.desc = `敵に <span style="color:#4ade80;font-weight:bold;">${upgradedCard.value}</span> ダメージ (風)`;
      break;
    case 'stone':
      upgradedCard.value = 3 + (2 * level);
      upgradedCard.desc = `敵に <span style="color:#4ade80;font-weight:bold;">${upgradedCard.value}</span> ダメージ (土)`;
      break;
    case 'thunder':
      upgradedCard.value = 2 + (1 * level);
      upgradedCard.desc = `敵に <span style="color:#4ade80;font-weight:bold;">${upgradedCard.value}</span> ダメージ (雷) ＋ 30%で麻痺付与`;
      break;
    case 'venom':
      upgradedCard.value = 1 + (1 * level);
      upgradedCard.poison = 1 + (1 * level);
      upgradedCard.desc = `敵に <span style="color:#4ade80;font-weight:bold;">${upgradedCard.value}</span> ダメージ ＋ 毒<span style="color:#4ade80;font-weight:bold;">${upgradedCard.poison}</span> を付与`;
      break;
    case 'fortify':
      upgradedCard.cost = 1;
      upgradedCard.healSelf = 6 + (2 * level);
      upgradedCard.desc = `HP +${upgradedCard.healSelf} 回復 (<span style="color:#4ade80;font-weight:bold;">コスト1</span>)`;
      break;
    case 'draw_card':
      upgradedCard.draw = 2 + (1 * level);
      upgradedCard.desc = `カードを <span style="color:#4ade80;font-weight:bold;">${upgradedCard.draw}</span> 枚引き、行動回数+1`;
      break;
    case 'buff_up':
      upgradedCard.cost = 0; // コストが0に減少
      upgradedCard.buffUp = 3 + (1 * (level - 1)); // 2回目以降で効果ターン増
      upgradedCard.desc = `自身に「能昇」を ${upgradedCard.buffUp} ターン付与 (<span style="color:#4ade80;font-weight:bold;">コスト0</span>)`;
      break;
    case 'buff_down':
      upgradedCard.cost = 0; // コストが0に減少
      upgradedCard.buffDown = 3 + (1 * (level - 1));
      upgradedCard.desc = `敵に「能降」を ${upgradedCard.buffDown} ターン付与 (<span style="color:#4ade80;font-weight:bold;">コスト0</span>)`;
      break;
    case 'meteor':
      upgradedCard.cost = Math.max(0, 3 - level); // コスト減
      upgradedCard.value = 8 + (2 * level);
      upgradedCard.desc = `敵に <span style="color:#4ade80;font-weight:bold;">${upgradedCard.value}</span> ダメージ (炎・氷・雷の全属性効果) (戦闘中1回のみ使用可能) (<span style="color:#4ade80;font-weight:bold;">コスト${upgradedCard.cost}</span>)`;
      break;
  }
  return upgradedCard;
}
