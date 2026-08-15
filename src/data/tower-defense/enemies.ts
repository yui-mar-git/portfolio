export interface EnemyData {
  hp: number;
  attack: number;
  speed: number;
  height: number;
  cooldown: number;
  textureKey: string;
  attackSE: string;
  isBoss: boolean;
}

export const ENEMY_DB: Record<string, EnemyData> = {
  slime: {
    hp: 30,
    attack: 10,
    speed: 20,
    height: 80,
    cooldown: 1500,
    textureKey: 'enemy_slime',
    attackSE: 'punch',
    isBoss: false,
  },
  goblin: {
    hp: 40,
    attack: 15,
    speed: 40,
    height: 80,
    cooldown: 1000,
    textureKey: 'enemy_goblin',
    attackSE: 'punch',
    isBoss: false,
  },
  ogre: {
    hp: 1000,
    attack: 40,
    speed: 20,
    height: 160,
    cooldown: 2000,
    textureKey: 'enemy_ogre',
    attackSE: 'smite',
    isBoss: true,
  },
  orc: {
    hp: 3500,
    attack: 60,
    speed: 20,
    height: 160,
    cooldown: 2000,
    textureKey: 'enemy_orc',
    attackSE: 'smite',
    isBoss: true,
  },
};
