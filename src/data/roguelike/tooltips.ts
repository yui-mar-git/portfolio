export interface TooltipInfo {
  title: string;
  desc: string;
}

export const TOOLTIP_DB: Record<string, TooltipInfo> = {
  // カテゴリ（カード上部）
  physical: {
    title: '物理',
    desc: '<span class="tooltip-title tt-physical">物理:</span><br>行動回数を消費して物理的に攻撃するカード。<br>強力なカードにはMPを消費するものもある。',
  },
  spell: {
    title: '呪文',
    desc: '<span class="tooltip-title tt-spell">呪文:</span><br>行動回数を消費せずMPを消費して何度でも使用できる。<br>強力な呪文ほど消費MPが大きい。',
  },
  special: {
    title: '特殊',
    desc: '<span class="tooltip-title tt-special">特殊:</span><br>特殊な効果のあるカード。<br>戦闘中に一度ずつしか使用できない。',
  },

  // 属性（カード下部）
  fire: {
    title: '火属性',
    desc: '<span class="tooltip-title tt-fire">火属性:</span><br>火属性。水属性が苦手な敵に大ダメージを与えるが、<br>耐性を持つ敵にはダメージが減る。<br>うまく相手の弱点を見抜こう！',
  },
  ice: {
    title: '氷属性',
    desc: '<span class="tooltip-title tt-ice">氷属性:</span><br>水・氷属性。火属性が苦手な敵に大ダメージを与えるが、<br>耐性を持つ敵にはダメージが減る。<br>うまく相手の弱点を見抜こう！',
  },
  wind: {
    title: '風属性',
    desc: '<span class="tooltip-title tt-wind">風属性:</span><br>風属性。土属性が苦手な敵に大ダメージを与えるが、<br>耐性を持つ敵にはダメージが減る。<br>うまく相手の弱点を見抜こう！',
  },
  stone: {
    title: '土属性',
    desc: '<span class="tooltip-title tt-stone">土属性:</span><br>土・石属性。雷属性が苦手な敵に大ダメージを与えるが、<br>耐性を持つ敵にはダメージが減る。<br>うまく相手の弱点を見抜こう！',
  },
  thunder: {
    title: '雷属性',
    desc: '<span class="tooltip-title tt-thunder">雷属性:</span><br>雷属性。風属性が苦手な敵に大ダメージを与えるが、<br>耐性を持つ敵にはダメージが減る。<br>うまく相手の弱点を見抜こう！',
  },
  none: {
    title: '無属性',
    desc: '<span class="tooltip-title tt-none">無属性:</span><br>属性を持たない攻撃。弱点や耐性の影響を受けない。',
  },

  // 状態異常（カード下部）
  poison: {
    title: '毒',
    desc: '<span class="tooltip-title tt-poison">毒:</span><br>毒状態。ターンごとにダメージを受ける。',
  },
  paralyze: {
    title: '麻痺',
    desc: '<span class="tooltip-title tt-paralyze">麻痺:</span><br>麻痺状態。ターン中が来ても行動ができない。',
  },
  dazzle: {
    title: '幻惑',
    desc: '<span class="tooltip-title tt-dazzle">幻惑:</span><br>幻惑状態。物理カードが50%の確率で当たらない。',
  },
  silence: {
    title: '沈黙',
    desc: '<span class="tooltip-title tt-silence">沈黙:</span><br>沈黙状態。呪文カードが使えない。',
  },

  // 能力変化（カード下部）
  buff_up: {
    title: '能昇',
    desc: '<span class="tooltip-title tt-buff-up">能昇:</span><br>ステータスが上昇。<br>与ダメージ +1、被ダメージ -1。',
  },
  buff_down: {
    title: '能降',
    desc: '<span class="tooltip-title tt-buff-down">能降:</span><br>ステータスが下降。<br>与ダメージ -1、被ダメージ +1。',
  },

  // 回復・その他
  heal: {
    title: '回復',
    desc: '<span class="tooltip-title tt-heal">回復:</span><br>HPまたはMPを回復する効果。',
  },
};
