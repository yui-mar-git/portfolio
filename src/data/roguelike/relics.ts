export interface Relic {
  id: string;
  name: string;
  desc: string;
  image: string;
  flavor?: string;
}

export const RELIC_DB: Record<string, Relic & { isFixed?: boolean }> = {
  // ===================================================
  // 1. ランダム入手レリック (Random Drop / Shop)
  // ===================================================
  ruby_ring: {
    id: 'ruby_ring',
    name: 'ルビーの指輪',
    desc: '戦闘勝利時に<br>HP2回復',
    image: new URL('../../assets/games/roguelike/images/relics/yubiwa_ruby.png', import.meta.url)
      .href,
    flavor: '鮮やかな紅玉の輝きで生命力を高める指輪',
  },
  sapphire_ring: {
    id: 'sapphire_ring',
    name: 'サファイアの指輪',
    desc: '戦闘勝利時に<br>MP2回復',
    image: new URL(
      '../../assets/games/roguelike/images/relics/yubiwa_sapphire.png',
      import.meta.url,
    ).href,
    flavor: '深い蒼玉の輝きで精神力を高める指輪。',
  },
  yubiwa_gold: {
    id: 'yubiwa_gold',
    name: '金の指輪',
    desc: '取得時に<br>最大HP +1',
    image: new URL('../../assets/games/roguelike/images/relics/yubiwa_gold.png', import.meta.url)
      .href,
    flavor: '黄金の加護により着用者の生命力を高める指輪。',
  },
  yubiwa_silver: {
    id: 'yubiwa_silver',
    name: '銀の指輪',
    desc: '取得時に<br>最大MP +1',
    image: new URL('../../assets/games/roguelike/images/relics/yubiwa_silver.png', import.meta.url)
      .href,
    flavor: '白銀の加護により着用者の精神力を高める指輪。',
  },
  shoes_sneaker: {
    id: 'shoes_sneaker',
    name: 'スニーカー',
    desc: 'ターン開始時の<br>行動回数 +1',
    image: new URL('../../assets/games/roguelike/images/relics/shoes_sneaker.png', import.meta.url)
      .href,
    flavor: '軽快な足取りで戦場を駆け抜ける靴。',
  },
  book_madousyo: {
    id: 'book_madousyo',
    name: '魔導書',
    desc: '魔法攻撃の<br>消費MP -1',
    image: new URL(
      '../../assets/games/roguelike/images/relics/book_madousyo_necronomicon.png',
      import.meta.url,
    ).href,
    flavor: '古代魔導の効率的な詠唱法が記された極意書。',
  },
  game_ken: {
    id: 'game_ken',
    name: '剣',
    desc: '物理攻撃の<br>与ダメージ +1',
    image: new URL('../../assets/games/roguelike/images/relics/game_ken.png', import.meta.url).href,
    flavor: '職人の手で丹念に研がれた鉄製の剣。',
  },
  game_tate: {
    id: 'game_tate',
    name: '盾',
    desc: '被ダメージ -1',
    image: new URL('../../assets/games/roguelike/images/relics/game_tate.png', import.meta.url)
      .href,
    flavor: '攻撃から身を守る鉄製の盾。',
  },
  creditcard_gold: {
    id: 'creditcard_gold',
    name: 'ゴールドカード',
    desc: '戦闘勝利時の<br>獲得G +50%',
    image: new URL('../../assets/games/roguelike/images/relics/creditcard_gold.png', import.meta.url)
      .href,
    flavor: '金運を上げる黄金のカード。勝利時の獲得Gが増加する。',
  },
  tsue_sennin: {
    id: 'tsue_sennin',
    name: '杖',
    desc: '呪文攻撃の<br>ダメージ +1',
    image: new URL('../../assets/games/roguelike/images/relics/tsue_sennin.png', import.meta.url).href,
    flavor: '古木から削り出された杖。魔力を増幅させる。',
  },
  fashion_boot_short: {
    id: 'fashion_boot_short',
    name: 'ブーツ',
    desc: '戦闘開始1ターン目<br>カード引枚数 +1',
    image: new URL(
      '../../assets/games/roguelike/images/relics/fashion_boot_short.png',
      import.meta.url,
    ).href,
    flavor: '軽快な足取りを可能にするオシャレなショートブーツ。',
  },
  silkhat: {
    id: 'silkhat',
    name: 'シルクハット',
    desc: '被バフ、与デバフ<br>効果ターン数 +1',
    image: new URL('../../assets/games/roguelike/images/relics/silkhat.png', import.meta.url).href,
    flavor: '奇術師が好むシルクハット。タネも仕掛けもございません。',
  },
  'fashion_beret_bere-bou': {
    id: 'fashion_beret_bere-bou',
    name: 'ベレー帽',
    desc: '属性攻撃の<br>ダメージ +1',
    image: new URL(
      '../../assets/games/roguelike/images/relics/fashion_beret_bere-bou.png',
      import.meta.url,
    ).href,
    flavor: '芸術家が好むベレー帽。色覚が研ぎ澄まされる……気がする。',
  },
  mermaid_necklace: {
    id: 'mermaid_necklace',
    name: '人魚のネックレス',
    desc: '毎ターン<br>MP +1 回復',
    image: new URL(
      '../../assets/games/roguelike/images/relics/syugei_glass_dome_accessory.png',
      import.meta.url,
    ).href,
    flavor: '人魚「いずれは陸にも販路を拡げたいと思っています」',
  },

  // ===================================================
  // 2. ショップ限定ブラックカード (Shop Exclusive)
  // ===================================================
  creditcard_black: {
    id: 'creditcard_black',
    name: 'ブラックカード',
    desc: '獲得G +50% ＆<br>買い出し・施設代 50%引き',
    image: new URL('../../assets/games/roguelike/images/relics/creditcard_black.png', import.meta.url)
      .href,
    isFixed: true,
    flavor: '——お客さん、"VIP"だね？',
  },

  // ===================================================
  // 3. イベントマス限定レリック (Event Exclusive)
  // ===================================================
  game_ken_seiken: {
    id: 'game_ken_seiken',
    name: '聖剣',
    desc: '物理攻撃ダメージ+1、<br>戦闘後HP2回復',
    image: new URL(
      '../../assets/games/roguelike/images/relics/game_ken_seiken.png',
      import.meta.url,
    ).href,
    isFixed: true,
    flavor: 'エルフ「我らエルフの里の特産品です。良かったらお土産キーホルダーも買ってね」',
  },
  yubiwa_diamond: {
    id: 'yubiwa_diamond',
    name: 'ダイヤの指輪',
    desc: '被ダメージ-1、<br>戦闘後MP2回復',
    image: new URL('../../assets/games/roguelike/images/relics/yubiwa_diamond.png', import.meta.url)
      .href,
    isFixed: true,
    flavor: '姫「わたくしとお揃っちでしてよ！」',
  },
};
