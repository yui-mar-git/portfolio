export interface UnitBaseData {
  cost: number;
  hp: number;
  attack: number;
  cooldown: number;
  speed: number;
  range: number;
  texture: string;
  height: number;
  attackSE: string;
}

export type UnitType = 'sword' | 'shield' | 'mage' | 'butouka';

export const BASE_UNIT_DB: Record<UnitType, UnitBaseData> = {
  sword: {
    cost: 130,
    hp: 100,
    attack: 20,
    cooldown: 666,
    speed: 50,
    range: 80,
    texture: 'unit_sword',
    height: 80,
    attackSE: 'strike',
  },
  shield: {
    cost: 50,
    hp: 200,
    attack: 20,
    cooldown: 1000,
    speed: 30,
    range: 60,
    texture: 'unit_shield',
    height: 90,
    attackSE: 'smite',
  },
  mage: {
    cost: 90,
    hp: 30,
    attack: 15,
    cooldown: 3000,
    speed: 25,
    range: 200,
    texture: 'unit_mage',
    height: 80,
    attackSE: 'energyball',
  },
  butouka: {
    cost: 20,
    hp: 50,
    attack: 15,
    cooldown: 333,
    speed: 80,
    range: 60,
    texture: 'unit_butouka',
    height: 70,
    attackSE: 'strike',
  },
};

export interface CalculatedUnitData extends UnitBaseData {
  originalType: UnitType;
}

export function calculateUnitStats(
  type: UnitType,
  levels: Record<string, number> = {},
): CalculatedUnitData {
  const base = BASE_UNIT_DB[type];
  const lv = levels[type] || 1;
  const baseStatsLv = levels['baseStats'] || 1;
  const globalBuff = 1 + (baseStatsLv - 1) * 0.05;
  return {
    ...base,
    originalType: type,
    hp: Math.floor(base.hp * (1 + (lv - 1) * 0.2) * globalBuff),
    attack: Math.floor(base.attack * (1 + (lv - 1) * 0.2) * globalBuff),
    speed: Math.floor(base.speed * (1 + (lv - 1) * 0.1) * globalBuff),
  };
}
