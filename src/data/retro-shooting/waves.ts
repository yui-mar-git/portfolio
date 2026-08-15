export interface WaveConfig {
  rows: number;
  cols: number;
  invaderSpeedX: number;
  spacingX: number;
  spacingY: number;
  startY: number;
}

export function getWaveConfig(wave: number): WaveConfig {
  let rows = 4;
  let cols = 8;
  let invaderSpeedX = 65;

  if (wave === 1) {
    rows = 3;
    cols = 6;
    invaderSpeedX = 35;
  } else if (wave === 2) {
    rows = 4;
    cols = 7;
    invaderSpeedX = 50;
  } else if (wave === 3) {
    rows = 4;
    cols = 8;
    invaderSpeedX = 65;
  } else {
    rows = 4;
    cols = 8;
    invaderSpeedX = 65 + (wave - 3) * 10;
  }

  return {
    rows,
    cols,
    invaderSpeedX,
    spacingX: 65,
    spacingY: 45,
    startY: 80,
  };
}

export const ENEMY_SCORES = {
  enemy_type_a: 100,
  enemy_type_b: 50,
  saucer_ufo: 300,
};
