export interface Relic {
  id: string;
  name: string;
  desc: string;
  image: string;
}

export const RELIC_DB: Record<string, Relic & { isFixed?: boolean }> = {
  'ruby_ring': { id: 'ruby_ring', name: 'ルビーの指輪', desc: '戦闘勝利時に<br>HP2回復', image: new URL('../../assets/games/roguelike/images/relics/yubiwa_ruby.png', import.meta.url).href },
  'sapphire_ring': { id: 'sapphire_ring', name: 'サファイアの指輪', desc: '戦闘勝利時に<br>MP2回復', image: new URL('../../assets/games/roguelike/images/relics/yubiwa_sapphire.png', import.meta.url).href },
  'yubiwa_gold': { id: 'yubiwa_gold', name: '金の指輪', desc: '取得時に<br>最大HP +1', image: new URL('../../assets/games/roguelike/images/relics/yubiwa_gold.png', import.meta.url).href },
  'yubiwa_silver': { id: 'yubiwa_silver', name: '銀の指輪', desc: '取得時に<br>最大MP +1', image: new URL('../../assets/games/roguelike/images/relics/yubiwa_silver.png', import.meta.url).href },
  'shoes_sneaker': { id: 'shoes_sneaker', name: 'スニーカー', desc: 'ターン開始時の<br>行動回数 +1', image: new URL('../../assets/games/roguelike/images/relics/shoes_sneaker.png', import.meta.url).href },
  'book_madousyo': { id: 'book_madousyo', name: '魔導書', desc: '魔法攻撃の消費MP -1', image: new URL('../../assets/games/roguelike/images/relics/book_madousyo_necronomicon.png', import.meta.url).href },
  'game_ken': { id: 'game_ken', name: '剣', desc: '物理攻撃のダメージ +1', image: new URL('../../assets/games/roguelike/images/relics/game_ken.png', import.meta.url).href },
  'game_tate': { id: 'game_tate', name: '盾', desc: '敵からの被ダメージ -1', image: new URL('../../assets/games/roguelike/images/relics/game_tate.png', import.meta.url).href },
  'game_ken_seiken': { id: 'game_ken_seiken', name: '聖剣', desc: '物理攻撃ダメージ+1、<br>戦闘後HP2回復', image: new URL('../../assets/games/roguelike/images/relics/game_ken_seiken.png', import.meta.url).href, isFixed: true },
  'yubiwa_diamond': { id: 'yubiwa_diamond', name: 'ダイヤの指輪', desc: '被ダメージ-1、<br>戦闘後MP2回復', image: new URL('../../assets/games/roguelike/images/relics/yubiwa_diamond.png', import.meta.url).href, isFixed: true },
  'mermaid_necklace': { id: 'mermaid_necklace', name: '人魚のネックレス', desc: 'ターン開始時に<br>MP +1 回復', image: new URL('../../assets/games/roguelike/images/relics/syugei_glass_dome_accessory.png', import.meta.url).href, isFixed: true }
};
