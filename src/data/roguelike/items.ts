export interface Item {
  id: string;
  name: string;
  desc: string;
  image: string;
}

export const ITEM_DB: Record<string, Item> = {
  'sandwich': { id: 'sandwich', name: 'サンドイッチ', desc: 'HPを 3 回復する', image: '/portfolio/roguelike/assets/items/food_sandwitch.png' },
  'elixir': { id: 'elixir', name: '万能薬', desc: '自身の毒を解除し、HPを 1 回復する', image: '/portfolio/roguelike/assets/items/medical_bannouyaku.png' },
  'perfume': { id: 'perfume', name: '香水', desc: '敵に毒1を付与する', image: '/portfolio/roguelike/assets/items/kousui.png' }
};
