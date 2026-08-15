import { CARD_DB } from './cards';
import { RELIC_DB } from './relics';
import { MONSTER_DB } from './enemies';

export interface RoguelikeAchievement {
  id: string;
  cat: 'area' | 'comp' | 'monster';
  title: string;
  cond: string;
  desc: string;
  isUnlocked: (
    stats: { clears?: number; maxArea?: number; maxFloor?: number },
    unlockedCards: string[],
    unlockedMonsters: string[],
    unlockedRelics?: string[],
  ) => boolean;
}

const totalCardCount = Object.keys(CARD_DB).length || 20;
const totalRelicCount = Object.keys(RELIC_DB).length || 15;
const totalMonsterCount = Object.keys(MONSTER_DB).length || 20;

export const RL_ACHIEVEMENTS: RoguelikeAchievement[] = [
  // エリア (3件)
  {
    id: 'ar1',
    cat: 'area',
    title: 'エリア1踏破',
    cond: 'エリア1のボスを撃破',
    desc: '新緑の森を突破し、最初の試練を乗り越えた冒険者の証。',
    isUnlocked: (st) => (st.maxArea || 1) >= 2 || (st.clears || 0) > 0,
  },
  {
    id: 'ar2',
    cat: 'area',
    title: 'エリア2踏破',
    cond: 'エリア2のボスを撃破',
    desc: '灼熱の洞窟を潜り抜け、凶悪な守護者を撃ち破った偉業。',
    isUnlocked: (st) => (st.maxArea || 1) >= 3 || (st.clears || 0) > 0,
  },
  {
    id: 'ar3',
    cat: 'area',
    title: 'エリア3踏破',
    cond: 'エリア3の最深部を攻略しゲームクリア',
    desc: '魔王の城塞深淵を制圧し、完全制覇を果たした英雄の栄誉。',
    isUnlocked: (st) => (st.clears || 0) > 0,
  },

  // 図鑑 - カード (6件)
  {
    id: 'c5p',
    cat: 'comp',
    title: 'カード5%解禁',
    cond: 'カード図鑑の解禁率5%以上達成',
    desc: '冒険の第一歩を踏み出し、最初のスキルカードを解禁した証。',
    isUnlocked: (_st, uC) => (uC?.length || 0) / totalCardCount >= 0.05,
  },
  {
    id: 'c10p',
    cat: 'comp',
    title: 'カード10%解禁',
    cond: 'カード図鑑の解禁率10%以上達成',
    desc: 'デッキ構築の初歩を学び、新たなカードを集め始めた証。',
    isUnlocked: (_st, uC) => (uC?.length || 0) / totalCardCount >= 0.1,
  },
  {
    id: 'c25p',
    cat: 'comp',
    title: 'カード25%解禁',
    cond: 'カード図鑑の解禁率25%以上達成',
    desc: '多様な戦術に触れ、カード収集の楽しさに目覚めた証。',
    isUnlocked: (_st, uC) => (uC?.length || 0) / totalCardCount >= 0.25,
  },
  {
    id: 'c50p',
    cat: 'comp',
    title: 'カード50%解禁',
    cond: 'カード図鑑の解禁率50%以上達成',
    desc: '半数のカードを使いこなし、幅広い戦略を扱える収集家。',
    isUnlocked: (_st, uC) => (uC?.length || 0) / totalCardCount >= 0.5,
  },
  {
    id: 'c75p',
    cat: 'comp',
    title: 'カード75%解禁',
    cond: 'カード図鑑の解禁率75%以上達成',
    desc: '大半のスキルと魔法カードを網羅した熟練のカードマスター。',
    isUnlocked: (_st, uC) => (uC?.length || 0) / totalCardCount >= 0.75,
  },
  {
    id: 'c100p',
    cat: 'comp',
    title: 'カード100%解禁',
    cond: 'カード図鑑を全種類コンプリート',
    desc: '世界に存在する全てのカードを集め尽くした究極の蒐集王。',
    isUnlocked: (_st, uC) => (uC?.length || 0) >= totalCardCount,
  },

  // 図鑑 - レリック (6件)
  {
    id: 'r5p',
    cat: 'comp',
    title: 'レリック5%解禁',
    cond: 'レリック図鑑の解禁率5%以上達成',
    desc: '初めて古代の秘宝を手に入れ、その加護を実感した証。',
    isUnlocked: (_st, _uC, _uM, uR) => (uR?.length || 0) / totalRelicCount >= 0.05,
  },
  {
    id: 'r10p',
    cat: 'comp',
    title: 'レリック10%解禁',
    cond: 'レリック図鑑の解禁率10%以上達成',
    desc: '古代の秘宝に触れ、その神秘的な力を知り始めた証。',
    isUnlocked: (_st, _uC, _uM, uR) => (uR?.length || 0) / totalRelicCount >= 0.1,
  },
  {
    id: 'r25p',
    cat: 'comp',
    title: 'レリック25%解禁',
    cond: 'レリック図鑑の解禁率25%以上達成',
    desc: 'ダンジョンに眠る遺物を集め、探索を有利に進める探検家。',
    isUnlocked: (_st, _uC, _uM, uR) => (uR?.length || 0) / totalRelicCount >= 0.25,
  },
  {
    id: 'r50p',
    cat: 'comp',
    title: 'レリック50%解禁',
    cond: 'レリック図鑑の解禁率50%以上達成',
    desc: '数々の秘宝の恩恵を受け、強大な力を手に入れたトレジャーハンター。',
    isUnlocked: (_st, _uC, _uM, uR) => (uR?.length || 0) / totalRelicCount >= 0.5,
  },
  {
    id: 'r75p',
    cat: 'comp',
    title: 'レリック75%解禁',
    cond: 'レリック図鑑の解禁率75%以上達成',
    desc: '世界中の古代遺産を熟知した、名高き考古学者。',
    isUnlocked: (_st, _uC, _uM, uR) => (uR?.length || 0) / totalRelicCount >= 0.75,
  },
  {
    id: 'r100p',
    cat: 'comp',
    title: 'レリック100%解禁',
    cond: 'レリック図鑑を全種類コンプリート',
    desc: '全レリックの力を解き放ち、神話の領域に達した伝説の覇者。',
    isUnlocked: (_st, _uC, _uM, uR) => (uR?.length || 0) >= totalRelicCount,
  },

  // 図鑑 - モンスター (6件)
  {
    id: 'm5p',
    cat: 'comp',
    title: 'モンスター5%解禁',
    cond: 'モンスター図鑑の解禁率5%以上達成',
    desc: '最初の魔物と交戦し、図鑑への記録を開始した証。',
    isUnlocked: (_st, _uC, uM) => (uM?.length || 0) / totalMonsterCount >= 0.05,
  },
  {
    id: 'm10p',
    cat: 'comp',
    title: 'モンスター10%解禁',
    cond: 'モンスター図鑑の解禁率10%以上達成',
    desc: '遭遇した魔物の習性を分析し、図鑑に記録し始めた証。',
    isUnlocked: (_st, _uC, uM) => (uM?.length || 0) / totalMonsterCount >= 0.1,
  },
  {
    id: 'm25p',
    cat: 'comp',
    title: 'モンスター25%解禁',
    cond: 'モンスター図鑑の解禁率25%以上達成',
    desc: '各地の凶悪なモンスターと交戦し、観察眼を磨いた冒険者。',
    isUnlocked: (_st, _uC, uM) => (uM?.length || 0) / totalMonsterCount >= 0.25,
  },
  {
    id: 'm50p',
    cat: 'comp',
    title: 'モンスター50%解禁',
    cond: 'モンスター図鑑の解禁率50%以上達成',
    desc: '半数の魔物の弱点・耐性を見抜き、戦闘を支配する研究者。',
    isUnlocked: (_st, _uC, uM) => (uM?.length || 0) / totalMonsterCount >= 0.5,
  },
  {
    id: 'm75p',
    cat: 'comp',
    title: 'モンスター75%解禁',
    cond: 'モンスター図鑑の解禁率75%以上達成',
    desc: 'ダンジョンに生息するあらゆる魔物を知り尽くした魔物博士。',
    isUnlocked: (_st, _uC, uM) => (uM?.length || 0) / totalMonsterCount >= 0.75,
  },
  {
    id: 'm100p',
    cat: 'comp',
    title: 'モンスター100%解禁',
    cond: 'モンスター図鑑を全種類コンプリート',
    desc: '全ての魔物を討ち果たし、生態系を完全網羅した偉大なる博物学者。',
    isUnlocked: (_st, _uC, uM) => (uM?.length || 0) >= totalMonsterCount,
  },

  // 特定モンスター討伐 (7件)
  {
    id: 'mob_bandit',
    cat: 'monster',
    title: 'バンディット討伐',
    cond: 'バンディットを撃破して図鑑に登録',
    desc: '街道を荒らす山賊の頭目を退治し、人々の安全を守った。',
    isUnlocked: (_st, _uC, uM) => (uM || []).includes('bandit'),
  },
  {
    id: 'mob_darkelf',
    cat: 'monster',
    title: 'ダークエルフ討伐',
    cond: 'ダークエルフを撃破して図鑑に登録',
    desc: '闇の魔術を操るエルフの暗殺者を退け、その誇りを打ち砕いた。',
    isUnlocked: (_st, _uC, uM) => (uM || []).includes('dark_elf'),
  },
  {
    id: 'mob_golem',
    cat: 'monster',
    title: 'ゴーレム討伐',
    cond: 'エリア1ボスのゴーレムを撃破',
    desc: '圧倒的な巨躯と防御力を誇る岩石巨人を打ち砕いた快挙。',
    isUnlocked: (_st, _uC, uM) => (uM || []).includes('golem'),
  },
  {
    id: 'mob_vampire',
    cat: 'monster',
    title: 'ヴァンパイア討伐',
    cond: 'エリア2ボスのヴァンパイアを撃破',
    desc: '夜を支配する吸血鬼の貴族を葬り、囚われの姫を救出した。',
    isUnlocked: (_st, _uC, uM) => (uM || []).includes('vampire'),
  },
  {
    id: 'mob_leviathan',
    cat: 'monster',
    title: 'リヴァイアサン討伐',
    cond: '深淵の海獣リヴァイアサンを撃破',
    desc: '荒れ狂う水を操る伝説の巨獣を鎮め、海の脅威を退けた。',
    isUnlocked: (_st, _uC, uM) => (uM || []).includes('leviathan'),
  },
  {
    id: 'mob_maou',
    cat: 'monster',
    title: '魔王討伐',
    cond: '城塞最深部の魔王を撃破',
    desc: '深淵の城塞にて魔王を討伐し、世界に光を取り戻した救世主。',
    isUnlocked: (_st, _uC, uM) => (uM || []).includes('maou'),
  },
  {
    id: 'mob_mimic',
    cat: 'monster',
    title: 'ミミック討伐',
    cond: '宝箱に擬態したミミックを撃破',
    desc: '油断ならぬ罠を暴き、狡猾な擬態魔物を返り討ちにした。',
    isUnlocked: (_st, _uC, uM) => (uM || []).includes('mimic'),
  },
];
