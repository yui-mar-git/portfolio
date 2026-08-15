export interface RunActionAchievement {
  id: string;
  cat: 'endless' | 'stage' | 'coins' | 'shop';
  title: string;
  cond: string;
  desc: string;
  isUnlocked: (
    saveData: { coins?: number; unlockedStages?: number; ownedItems?: string[] },
    highScore: number,
  ) => boolean;
}

export const RUN_ACHIEVEMENTS: RunActionAchievement[] = [
  // エンドレス (3件)
  {
    id: 's30',
    cat: 'endless',
    title: '30秒走破',
    cond: 'エンドレスモードで30秒以上生存',
    desc: '障害物を回避し続け、最初の生存限界を打破した走り手。',
    isUnlocked: (_s, hs) => hs >= 30,
  },
  {
    id: 's60',
    cat: 'endless',
    title: '60秒走破',
    cond: 'エンドレスモードで60秒以上生存',
    desc: '加速する世界の追撃を逃れ、1分間の生存を果たした名手。',
    isUnlocked: (_s, hs) => hs >= 60,
  },
  {
    id: 's120',
    cat: 'endless',
    title: '120秒走破',
    cond: 'エンドレスモードで120秒以上生存',
    desc: '超高速の世界を生き延びた、驚異的な反射神経の持ち主。',
    isUnlocked: (_s, hs) => hs >= 120,
  },

  // ステージ (3件)
  {
    id: 'st1',
    cat: 'stage',
    title: 'ステージ1クリア',
    cond: 'ステージ1 (初級) を完走クリア',
    desc: 'コースの仕掛けを見抜き、ゴールまで駆け抜けた達成感。',
    isUnlocked: (s) => (s.unlockedStages || 1) >= 2,
  },
  {
    id: 'st2',
    cat: 'stage',
    title: 'ステージ2クリア',
    cond: 'ステージ2 (中級) を完走クリア',
    desc: '難易度の上がったステージを走破し、実力を証明した。',
    isUnlocked: (s) => (s.unlockedStages || 1) >= 3,
  },
  {
    id: 'st3',
    cat: 'stage',
    title: 'ステージ3クリア',
    cond: 'ステージ3 (上級) を完走クリア',
    desc: '用意された全てのコースを制覇した、トップアスリート。',
    isUnlocked: (s) => (s.unlockedStages || 1) >= 4,
  },

  // コイン (3件)
  {
    id: 'c100',
    cat: 'coins',
    title: '100G達成',
    cond: '所持コイン100Gを達成',
    desc: 'コース上のコインを集め、ショップでの買い物を楽しむ富豪の卵。',
    isUnlocked: (s) => (s.coins || 0) >= 100,
  },
  {
    id: 'c500',
    cat: 'coins',
    title: '500G達成',
    cond: '所持コイン500Gを達成',
    desc: '多くのコインを貯蓄し、自在に強化を行える資産家。',
    isUnlocked: (s) => (s.coins || 0) >= 500,
  },
  {
    id: 'c1000',
    cat: 'coins',
    title: '1,000G達成',
    cond: '所持コイン1,000Gを達成',
    desc: '莫大な財を築いた、コース界随一の大富豪ランナー。',
    isUnlocked: (s) => (s.coins || 0) >= 1000,
  },

  // ショップ (6件)
  {
    id: 'sh_double_coins',
    cat: 'shop',
    title: 'コイン2倍入手',
    cond: 'ショップで「コイン2倍」を購入',
    desc: 'コイン獲得効率を劇的に引き上げるお得なアイテムを入手。',
    isUnlocked: (s) => (s.ownedItems || []).includes('double_coins'),
  },
  {
    id: 'sh_double_jump',
    cat: 'shop',
    title: '2段ジャンプ入手',
    cond: 'ショップで「スニーカー（2段ジャンプ）」を購入',
    desc: '空中での2段跳躍を会得し、アクションの幅を広げた。',
    isUnlocked: (s) => (s.ownedItems || []).includes('double_jump'),
  },
  {
    id: 'sh_magnet',
    cat: 'shop',
    title: 'マグネット入手',
    cond: 'ショップで「マグネット」を購入',
    desc: '磁力でコインを引き寄せ、回収効率を最大化した。',
    isUnlocked: (s) => (s.ownedItems || []).includes('magnet_coin'),
  },
  {
    id: 'sh_high_jump',
    cat: 'shop',
    title: 'ハイジャンプ入手',
    cond: 'ショップで「ハイジャンプ」を購入',
    desc: 'より高く跳ぶ技術を習得し、高所の障害物も容易に飛び越える。',
    isUnlocked: (s) => (s.ownedItems || []).includes('high_jump'),
  },
  {
    id: 'sh_infinite_jump',
    cat: 'shop',
    title: '無限ジャンプ入手',
    cond: 'ショップで「無限ジャンプ」を購入',
    desc: '空を自在に舞うが如く連続跳躍を可能にした究極の逸品。',
    isUnlocked: (s) => (s.ownedItems || []).includes('infinite_jump'),
  },
  {
    id: 'sh_master',
    cat: 'shop',
    title: 'ショップマスター',
    cond: 'ショップの全5種アイテムを全て購入・制覇',
    desc: '全てのアイテムを買い揃え、完璧な装備を整えた真のランナー。',
    isUnlocked: (s) => {
      const items = ['double_coins', 'double_jump', 'magnet_coin', 'high_jump', 'infinite_jump'];
      return items.every((i) => (s.ownedItems || []).includes(i));
    },
  },
];
