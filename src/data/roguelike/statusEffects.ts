export interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff';
  desc: string;
}

export const STATUS_EFFECTS: Record<string, StatusEffect> = {
  'poison': { id: 'poison', name: '毒', type: 'debuff', desc: 'ターン開始時にダメージを受ける' },
  'burn': { id: 'burn', name: '火傷', type: 'debuff', desc: '攻撃するたびにダメージを受ける' },
  'weak': { id: 'weak', name: '弱体化', type: 'debuff', desc: '与えるダメージが25%減少する' },
  'vulnerable': { id: 'vulnerable', name: '脆弱', type: 'debuff', desc: '受けるダメージが50%増加する' },
  'strength': { id: 'strength', name: '筋力', type: 'buff', desc: '与える攻撃ダメージが増加する' }
};
