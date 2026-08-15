import shoesImg from '../../assets/games/run-action/images/item/shoes_sneaker.png';
import noImg from '../../assets/games/run-action/images/item/no_image_square.jpg';

export interface ShopItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  unlockStage: number;
  img: any;
}

export const ITEM_DB: ShopItem[] = [
  {
    id: 'double_coins',
    name: 'コイン2倍',
    desc: '獲得コイン数が 2倍 に増加',
    price: 40,
    unlockStage: 1,
    img: noImg,
  },
  {
    id: 'double_jump',
    name: '2段ジャンプ',
    desc: '空中でもう1回ジャンプが可能になる',
    price: 80,
    unlockStage: 1,
    img: shoesImg,
  },
  {
    id: 'magnet_coin',
    name: 'マグネット',
    desc: '近くのコインを自動引き寄せる',
    price: 120,
    unlockStage: 2,
    img: noImg,
  },
  {
    id: 'high_jump',
    name: 'ハイジャンプ',
    desc: '長押しでより高く跳べる',
    price: 150,
    unlockStage: 3,
    img: shoesImg,
  },
  {
    id: 'infinite_jump',
    name: '無限ジャンプ',
    desc: '空中でも何回でも連続ジャンプが可能',
    price: 250,
    unlockStage: 4,
    img: shoesImg,
  },
];

export const SHOP_ITEMS = ITEM_DB;
