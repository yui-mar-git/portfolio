export interface Element {
  id: string;
  name: string;
  color: string;
  desc: string;
}

export const ELEMENTS: Record<string, Element> = {
  'fire': { id: 'fire', name: '火属性', color: '#ff6b6b', desc: '火による追加ダメージ' },
  'water': { id: 'water', name: '水属性', color: '#4dabf7', desc: '水による妨害や回復' },
  'wind': { id: 'wind', name: '風属性', color: '#51cf66', desc: '風による手札操作や回避' }
};
