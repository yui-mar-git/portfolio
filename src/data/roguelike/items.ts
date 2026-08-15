export interface Item {
  id: string;
  name: string;
  desc: string;
  image: string;
  price?: number;
  notForSale?: boolean;
  flavor?: string;
}

export const ITEM_DB: Record<string, Item> = {
  sandwich: {
    id: 'sandwich',
    name: 'サンドウィッチ',
    desc: 'HP+2、MP+1<br>回復する',
    image: new URL('../../assets/games/roguelike/images/items/food_sandwitch.png', import.meta.url)
      .href,
    notForSale: true,
    flavor: '冒険者の空腹を満たす手作りのサンドウィッチ。',
  },
  hp_drink: {
    id: 'hp_drink',
    name: 'HPドリンク',
    desc: 'HPを3回復する',
    image: new URL(
      '../../assets/games/roguelike/images/items/juice_pack1_white.png',
      import.meta.url,
    ).href,
    price: 15,
    flavor: '滋養強壮に優れた活力の栄養ドリンク。',
  },
  mp_drink: {
    id: 'mp_drink',
    name: 'MPドリンク',
    desc: 'MPを3回復する',
    image: new URL(
      '../../assets/games/roguelike/images/items/juice_pack8_brown.png',
      import.meta.url,
    ).href,
    price: 15,
    flavor: '精神を研ぎ澄まし魔力を巡らせる濃厚な水薬。',
  },
  action_drink: {
    id: 'action_drink',
    name: '行動ドリンク',
    desc: '行動回数を+1する',
    image: new URL(
      '../../assets/games/roguelike/images/items/juice_pack2_pink.png',
      import.meta.url,
    ).href,
    price: 35,
    flavor: '反射神経を極限まで引き上げる覚醒の秘薬。',
  },
  poison_drug: {
    id: 'poison_drug',
    name: '毒薬',
    desc: '敵に毒を1付与する',
    image: new URL('../../assets/games/roguelike/images/items/medical_doku.png', import.meta.url)
      .href,
    price: 20,
    flavor: '敵の身体を静かにむしばむ劇薬。',
  },
  perfume: {
    id: 'perfume',
    name: '香水',
    desc: '敵を1ターン行動不能にする',
    image: new URL('../../assets/games/roguelike/images/items/kousui.png', import.meta.url).href,
    price: 25,
    flavor: '意識を眩ませて一時的に動きを封じる芳香。',
  },
  elixir: {
    id: 'elixir',
    name: '万能薬',
    desc: '自身のすべての状態異常を解除する',
    image: new URL(
      '../../assets/games/roguelike/images/items/medical_bannouyaku.png',
      import.meta.url,
    ).href,
    price: 30,
    flavor: '体内の不純物や呪詛を綺麗に浄化する霊水。',
  },
  dynamite: {
    id: 'dynamite',
    name: 'ダイナマイト',
    desc: '敵に5〜15のダメージを与える',
    image: new URL(
      '../../assets/games/roguelike/images/items/bakudan_dynamite.png',
      import.meta.url,
    ).href,
    price: 45,
    flavor: '強烈な爆風で周囲を吹き飛ばす爆薬。',
  },
  debug_kill: {
    id: 'debug_kill',
    name: '死神の鎌（デバッグ用）',
    desc: '何度使用してもなくならず、敵に100ダメージを与える',
    image: new URL('../../assets/games/roguelike/images/icons/no_image_square.jpg', import.meta.url)
      .href,
    notForSale: true,
    flavor: '開発者のみに許された絶対的な断罪の鎌。',
  },
};
