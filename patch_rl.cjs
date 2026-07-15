const fs = require('fs');

// Patch RoguelikeUI.astro
const uiPath = 'src/components/portfolio/RoguelikeUI.astro';
let ui = fs.readFileSync(uiPath, 'utf8');

if (!ui.includes('id="upgrade-confirm-modal"')) {
  const modalHTML = `
  <!-- Upgrade Confirm Modal -->
  <div id="upgrade-confirm-modal" class="config-modal">
    <button class="modal-close-x-btn" id="close-upgrade-confirm-btn-x">&times;</button>
    <h3>カード強化</h3>
    <div style="margin-bottom: 1.5rem; text-align: center;">
      <div id="upgrade-confirm-card" style="display: inline-block; margin-bottom: 1rem;"></div>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 0.5rem;">このカードを強化しますか？</p>
      <p id="upgrade-cost-text" style="color: #ffb84d; font-weight: bold;"></p>
    </div>
    <div style="display: flex; gap: 10px;">
      <button id="btn-upgrade-yes" class="btn btn-primary" style="flex: 1;">強化する</button>
      <button id="btn-upgrade-no" class="btn btn-secondary" style="flex: 1;">キャンセル</button>
    </div>
  </div>
  <!-- Tooltip Element -->
  <div id="card-tooltip" class="card-tooltip" style="display: none;">
    <div class="tooltip-header">
      <span id="tooltip-name" class="tooltip-name"></span>
      <span id="tooltip-cost" class="tooltip-cost"></span>
    </div>
    <div id="tooltip-category" class="tooltip-category"></div>
    <div id="tooltip-desc" class="tooltip-desc"></div>
  </div>
  
  <style>
  .card-tooltip {
    position: fixed;
    background: rgba(10, 10, 20, 0.95);
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    padding: 10px;
    width: 220px;
    z-index: 10000;
    pointer-events: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 0.85rem;
    line-height: 1.4;
  }
  .tooltip-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 5px;
    margin-bottom: 5px;
  }
  .tooltip-name {
    font-weight: bold;
    color: var(--primary-color);
  }
  .tooltip-cost {
    color: #ffb84d;
  }
  .tooltip-category {
    font-size: 0.75rem;
    color: #aaa;
    margin-bottom: 5px;
  }
  .tooltip-desc {
    color: #ddd;
  }
  </style>
  `;
  
  const endIdx = ui.indexOf('</div>\n</main>');
  if (endIdx !== -1) {
    ui = ui.substring(0, endIdx) + modalHTML + ui.substring(endIdx);
  } else {
    ui += modalHTML;
  }
  fs.writeFileSync(uiPath, ui, 'utf8');
}

// Patch main.js
const mainPath = 'src/scripts/roguelike/main.js';
let main = fs.readFileSync(mainPath, 'utf8');

// We need to inject tooltip logic
if (!main.includes('const cardTooltip = document.getElementById(\'card-tooltip\')')) {
  const tooltipScript = `
document.addEventListener('DOMContentLoaded', () => {
  const cardTooltip = document.getElementById('card-tooltip');
  if (!cardTooltip) return;
  const tName = document.getElementById('tooltip-name');
  const tCost = document.getElementById('tooltip-cost');
  const tCat = document.getElementById('tooltip-category');
  const tDesc = document.getElementById('tooltip-desc');
  
  document.addEventListener('mouseover', (e) => {
    const cardEl = e.target.closest('.battle-card');
    if (cardEl && cardEl.dataset.cardId) {
      const cardData = Object.values(window._gameContext?.cards || {}).find(c => c.id === cardEl.dataset.cardId);
      if (cardData) {
        tName.textContent = cardData.name + (cardData.upgraded ? '+' : '');
        tCost.textContent = 'MP: ' + cardData.cost;
        tCat.textContent = cardData.category || '攻撃';
        tDesc.innerHTML = (cardData.description || '').replace(/\\n/g, '<br>');
        
        const rect = cardEl.getBoundingClientRect();
        cardTooltip.style.display = 'block';
        cardTooltip.style.left = Math.min(rect.right + 10, window.innerWidth - 230) + 'px';
        cardTooltip.style.top = Math.min(rect.top, window.innerHeight - cardTooltip.offsetHeight - 10) + 'px';
      }
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.battle-card')) {
      cardTooltip.style.display = 'none';
    }
  });
});
`;
  main += tooltipScript;
}

// Replace simple alert with modal for upgrade
if (main.includes("const sure = confirm(`「${c.name}」を強化しますか？\\n\\n(必要ゴールド: ${cost})`);")) {
  main = main.replace(
    "const sure = confirm(`「${c.name}」を強化しますか？\\n\\n(必要ゴールド: ${cost})`);",
    "const sure = false; showUpgradeConfirm(c, cardEl, cost, (confirmed) => { if (!confirmed) return; "
  );
  main = main.replace(
    "cardEl.classList.add('upgraded');\n            saveGameData();\n          }",
    "cardEl.classList.add('upgraded');\n            saveGameData();\n          });"
  );
}

if (!main.includes('function showUpgradeConfirm')) {
  main += `
function showUpgradeConfirm(card, cardEl, cost, callback) {
  const modal = document.getElementById('upgrade-confirm-modal');
  const overlay = document.getElementById('modal-overlay');
  if (!modal || !overlay) {
    callback(confirm(\`「\${card.name}」を強化しますか？\\n\\n(必要ゴールド: \${cost})\`));
    return;
  }
  
  const container = document.getElementById('upgrade-confirm-card');
  container.innerHTML = '';
  const clone = cardEl.cloneNode(true);
  clone.style.pointerEvents = 'none';
  container.appendChild(clone);
  
  document.getElementById('upgrade-cost-text').textContent = \`必要ゴールド: \${cost}G\`;
  
  modal.classList.add('active');
  overlay.classList.add('active');
  
  const btnYes = document.getElementById('btn-upgrade-yes');
  const btnNo = document.getElementById('btn-upgrade-no');
  const btnClose = document.getElementById('close-upgrade-confirm-btn-x');
  
  const cleanup = () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    btnYes.removeEventListener('click', onYes);
    btnNo.removeEventListener('click', onNo);
    btnClose.removeEventListener('click', onNo);
  };
  
  const onYes = () => { cleanup(); callback(true); };
  const onNo = () => { cleanup(); callback(false); };
  
  btnYes.addEventListener('click', onYes);
  btnNo.addEventListener('click', onNo);
  btnClose.addEventListener('click', onNo);
}
`;
}

fs.writeFileSync(mainPath, main, 'utf8');
console.log('Patched main.js and RoguelikeUI.astro');
