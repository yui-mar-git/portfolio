export interface StageInfo {
  id: number;
  name: string;
  targetDistance: number;
  desc: string;
}

export interface EnemyPlacement {
  type: 'ground' | 'flying';
  x: number;
  y?: number;
}

export interface FixedStageLayout {
  goalX: number;
  holes: number[];
  obstacles: number[];
  enemies: EnemyPlacement[];
  coins: number[];
}

export const STAGE_CONFIG: StageInfo[] = [
  { id: 1, name: 'ステージ1 (初級)', targetDistance: 500, desc: '障害物とコインの基本コース' },
  { id: 2, name: 'ステージ2 (中級)', targetDistance: 800, desc: '二足歩行エネミー登場地帯' },
  { id: 3, name: 'ステージ3 (上級)', targetDistance: 1200, desc: '飛行敵と高難易度穴コース' },
];

export const FIXED_STAGES: Record<number, FixedStageLayout> = {
  1: {
    goalX: 4200,
    holes: [2100, 2700, 3300, 3800],
    obstacles: [1800, 2400, 3000, 3500],
    enemies: [
      { type: 'ground', x: 2250 },
      { type: 'ground', x: 2850 },
      { type: 'ground', x: 3400 },
    ],
    coins: [1600, 1640, 1680, 2000, 2040, 2500, 2540, 3100, 3140, 3600, 3640],
  },
  2: {
    goalX: 4800,
    holes: [1800, 2400, 3000, 3600, 4200],
    obstacles: [1650, 2150, 2750, 3350, 3950],
    enemies: [
      { type: 'ground', x: 1950 },
      { type: 'flying', x: 2550, y: -65 },
      { type: 'ground', x: 3150 },
      { type: 'flying', x: 3750, y: -70 },
    ],
    coins: [1600, 1640, 2050, 2090, 2650, 2690, 3250, 3850],
  },
  3: {
    goalX: 5400,
    holes: [1750, 2250, 2750, 3250, 3750, 4250, 4750],
    obstacles: [1600, 2050, 2550, 3050, 3550, 4050, 4550],
    enemies: [
      { type: 'ground', x: 1850 },
      { type: 'flying', x: 2350, y: -75 },
      { type: 'ground', x: 2850 },
      { type: 'flying', x: 3350, y: -80 },
      { type: 'ground', x: 3850 },
      { type: 'flying', x: 4350, y: -75 },
    ],
    coins: [1600, 1640, 2150, 2190, 2650, 2690, 3150, 3650, 4150, 4650],
  },
};
