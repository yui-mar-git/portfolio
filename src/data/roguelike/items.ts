export interface Item {
  id: string;
  name: string;
  desc: string;
  image: string;
  price?: number;
  notForSale?: boolean;
}

export const ITEM_DB: Record<string, Item> = {
  'sandwich': { id: 'sandwich', name: 'サンドウィッチ', desc: 'HPを2、MPを1回復する', image: new URL('../../assets/games/roguelike/images/items/food_sandwitch.png', import.meta.url).href, notForSale: true },
  'hp_drink': { id: 'hp_drink', name: 'HPドリンク', desc: 'HPを3回復する', image: new URL('../../assets/games/roguelike/images/items/juice_pack1_white.png', import.meta.url).href, price: 15 },
  'mp_drink': { id: 'mp_drink', name: 'MPドリンク', desc: 'MPを3回復する', image: new URL('../../assets/games/roguelike/images/items/juice_pack8_brown.png', import.meta.url).href, price: 15 },
  'action_drink': { id: 'action_drink', name: '行動ドリンク', desc: '行動回数を+1する', image: new URL('../../assets/games/roguelike/images/items/juice_pack2_pink.png', import.meta.url).href, price: 30 },
  'poison_drug': { id: 'poison_drug', name: '毒薬', desc: '敵に毒を1付与する', image: new URL('../../assets/games/roguelike/images/items/medical_doku.png', import.meta.url).href, price: 20 },
  'perfume': { id: 'perfume', name: '香水', desc: '敵を1ターン行動不能にする', image: new URL('../../assets/games/roguelike/images/items/kousui.png', import.meta.url).href, price: 20 },
  'elixir': { id: 'elixir', name: '万能薬', desc: '自身のすべての状態異常を解除する', image: new URL('../../assets/games/roguelike/images/items/medical_bannouyaku.png', import.meta.url).href, price: 30 },
  'dynamite': { id: 'dynamite', name: 'ダイナマイト', desc: '敵に5〜15のダメージを与える', image: new URL('../../assets/games/roguelike/images/items/bakudan_dynamite.png', import.meta.url).href, price: 50 },
  'debug_kill': { id: 'debug_kill', name: '死神の鎌（デバッグ用）', desc: '何度使用してもなくならず、敵に100ダメージを与える', image: new URL('../../assets/games/roguelike/images/icons/no_image_square.jpg', import.meta.url).href, notForSale: true }
};
