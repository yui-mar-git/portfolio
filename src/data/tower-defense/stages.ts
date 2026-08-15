import type { EnemyData } from './enemies';
import { ENEMY_DB } from './enemies';

export interface StageWaveConfig {
  stageId: number;
  name: string;
  maxWaves: number;
  enemiesPerWave: number[];
  bgm: string;
  getEnemyForSpawn: (waveIndex: number, isLastEnemyInFinalWave: boolean) => EnemyData;
}

export const STAGE_CONFIGS: Record<number, StageWaveConfig> = {
  1: {
    stageId: 1,
    name: 'ステージ1 (初級)',
    maxWaves: 3,
    enemiesPerWave: [5, 8, 12],
    bgm: 'field05',
    getEnemyForSpawn: (_wave, _isLast) => ENEMY_DB.slime,
  },
  2: {
    stageId: 2,
    name: 'ステージ2 (中級)',
    maxWaves: 3,
    enemiesPerWave: [6, 10, 15],
    bgm: 'field11',
    getEnemyForSpawn: (_wave, isLast) => {
      if (isLast) return ENEMY_DB.ogre;
      return Math.random() < 0.5 ? ENEMY_DB.goblin : ENEMY_DB.slime;
    },
  },
  3: {
    stageId: 3,
    name: 'ステージ3 (上級)',
    maxWaves: 3,
    enemiesPerWave: [8, 12, 18],
    bgm: 'boss02',
    getEnemyForSpawn: (_wave, isLast) => {
      if (isLast) return ENEMY_DB.orc;
      return ENEMY_DB.goblin;
    },
  },
};
