export interface RetroShootingAchievement {
  id: string;
  cat: 'score' | 'rank';
  title: string;
  cond: string;
  desc: string;
  isUnlocked: (highScore: number) => boolean;
}

export const STG_ACHIEVEMENTS: RetroShootingAchievement[] = [
  {
    id: 'sc1000',
    cat: 'score',
    title: '1,000pt達成',
    cond: 'スコア1,000点以上を獲得',
    desc: '敵機撃墜の基本をマスターし、スコアを伸ばし始めたルーキーパイロット。',
    isUnlocked: (hs) => hs >= 1000,
  },
  {
    id: 'sc3000',
    cat: 'score',
    title: '3,000pt達成',
    cond: 'スコア3,000点以上を獲得',
    desc: '激しい弾幕を潜り抜け、ハイスコアを更新し続けるベテラン機長。',
    isUnlocked: (hs) => hs >= 3000,
  },
  {
    id: 'sc5000',
    cat: 'score',
    title: '5,000pt達成',
    cond: 'スコア5,000点以上を獲得',
    desc: '圧倒的な弾幕回避能力と正確な射撃で戦場を支配したエース。',
    isUnlocked: (hs) => hs >= 5000,
  },
  {
    id: 'sc10000',
    cat: 'score',
    title: '10,000pt達成',
    cond: 'スコア10,000点以上を獲得',
    desc: '神がかった操縦技術で敵艦隊を壊滅させた伝説のパイロット。',
    isUnlocked: (hs) => hs >= 10000,
  },
  {
    id: 'rkA',
    cat: 'rank',
    title: 'ランクA到達',
    cond: 'スコア5,000点以上で称号獲得',
    desc: '全空軍の中でもトップクラスの戦績を誇るパイロットの証。',
    isUnlocked: (hs) => hs >= 5000,
  },
  {
    id: 'rkS',
    cat: 'rank',
    title: 'ランクS (撃墜王)',
    cond: 'スコア10,000点以上で最高称号獲得',
    desc: '敵から恐れられ、味方から讃えられるシューティング界の撃墜王。',
    isUnlocked: (hs) => hs >= 10000,
  },
];
