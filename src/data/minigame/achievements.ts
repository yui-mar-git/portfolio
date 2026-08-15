export interface MinigameAchievement {
  id: string;
  cat: 'tap' | 'title';
  title: string;
  cond: string;
  desc: string;
  isUnlocked: (highScore: number) => boolean;
}

export const MINI_ACHIEVEMENTS: MinigameAchievement[] = [
  {
    id: 't30',
    cat: 'tap',
    title: '30ヒット達成',
    cond: '1ゲームで30ヒット以上記録',
    desc: 'リズムよく画面を連打し、最初の目標スコアを達成。',
    isUnlocked: (hs) => hs >= 30,
  },
  {
    id: 't60',
    cat: 'tap',
    title: '60ヒット達成',
    cond: '1ゲームで60ヒット以上記録',
    desc: '驚異的な連打速度でターゲットを連続ヒット。',
    isUnlocked: (hs) => hs >= 60,
  },
  {
    id: 't100',
    cat: 'tap',
    title: '100ヒット超連打',
    cond: '1ゲームで100ヒット以上記録',
    desc: '1秒間に3回以上の超速タップを維持した奇跡の連打。',
    isUnlocked: (hs) => hs >= 100,
  },
  {
    id: 'rnk1',
    cat: 'title',
    title: 'ルーキータッパー',
    cond: 'ゲームを1回以上プレイしてクリア',
    desc: 'タップゲームへの第一歩を踏み出したプレイヤー。',
    isUnlocked: (hs) => hs > 0,
  },
  {
    id: 'rnk2',
    cat: 'title',
    title: 'タップマスター',
    cond: '60ヒット以上を達成し称号獲得',
    desc: '連打のコツを掴み、ハイスコアを量産する熟練者。',
    isUnlocked: (hs) => hs >= 60,
  },
  {
    id: 'rnk3',
    cat: 'title',
    title: '神速の指先',
    cond: '100ヒット以上を達成し最高称号獲得',
    desc: '指先が残像を描くレベルに達した伝説の連打神。',
    isUnlocked: (hs) => hs >= 100,
  },
];
