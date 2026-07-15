const fs = require('fs');

const games = [
  {
    file: 'src/components/portfolio/RoguelikeUI.astro',
    content: `
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>コマンドを選んで敵を倒していくローグライク風RPGです。</p>
        <p>敵の攻撃パターンを読んで、適切な魔法や攻撃を選択しましょう。</p>
        <p>HPが尽きないように注意しながら、連戦を勝ち抜いてください。</p>
      </div>
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>毒や火傷などの状態異常はターン終了時にダメージを受けます。</p>
        <p>回復カードを使って素早く対処しましょう。</p>
      </div>
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>「町」や「妖精」でカードを強化できます。</p>
        <p>自分だけの最強のデッキを作り上げましょう。</p>
      </div>`
  },
  {
    file: 'src/components/portfolio/MinigameUI.astro',
    content: `
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>・1~9のパネルをタップして、合計が「10」になるように素早く選びます。</p>
      </div>
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>・10になるとパネルが消え、スコアが加算されます。</p>
      </div>
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>・制限時間内にできるだけ多くのパネルを消して高得点を目指しましょう。</p>
      </div>`
  },
  {
    file: 'src/components/portfolio/RunActionUI.astro',
    content: `
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>・自動で走るキャラクターを操作して、障害物を避けながら進むゲームです。</p>
      </div>
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>・画面タップでジャンプします。</p>
      </div>
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>・障害物に当たるとゲームオーバーです。どこまで進めるか挑戦しましょう。</p>
      </div>`
  },
  {
    file: 'src/components/portfolio/TowerDefenseUI.astro',
    content: `
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>・時間経過で「コスト」がたまります。</p>
      </div>
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>・コストを払ってユニットを召喚し、迫りくる敵から拠点を防衛してください。</p>
      </div>
      <div class="howto-content" style="text-align: left; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
        <p>・「ベースキャンプ」でゴールドを使ってユニットを強化できます。</p>
      </div>`
  }
];

games.forEach(game => {
  if (fs.existsSync(game.file)) {
    let content = fs.readFileSync(game.file, 'utf8');
    if (!content.includes('import HowToPlayModal')) {
      content = content.replace('---', "---\nimport HowToPlayModal from './HowToPlayModal.astro';");
    }
    
    const startIdx = content.indexOf('<div id="howto-modal"');
    if (startIdx !== -1) {
      const endIdx = content.indexOf('</div>', content.indexOf('<button id="close-howto-btn"', startIdx)) + 6;
      content = content.substring(0, startIdx) + '<HowToPlayModal>' + game.content + '</HowToPlayModal>' + content.substring(endIdx);
    }
    
    content = content.replace('<h3>コンフィグ</h3>', '<button class="modal-close-x-btn" id="close-config-btn-x">&times;</button>\n      <h3>コンフィグ</h3>');
    content = content.replace('<h3>クレジット・使用素材</h3>', '<button class="modal-close-x-btn" id="close-credits-btn-x">&times;</button>\n      <h3>クレジット・使用素材</h3>');
    
    content = content.replace('<button id="close-config-btn"', '<button id="howto-btn-in-config" class="btn btn-secondary btn-full btn-howto" style="margin-top: 1rem;">遊び方を見る</button>\n          <button id="close-config-btn"');
    
    fs.writeFileSync(game.file, content, 'utf8');
  }
});

console.log('Injected HowToPlayModal and X buttons into all games.');
