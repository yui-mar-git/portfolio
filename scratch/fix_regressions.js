import fs from 'fs';
let content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');

// 1. Fix playSE
content = content.replace(/const path = SE_DB\[seId\].startsWith\('\/'\) \? SE_DB\[seId\] : SE_PATH \+ SE_DB\[seId\];/, 'const path = SE_DB[seId];');

// 2. Remove duplicate playSE from howtoBtn
content = content.replace(
`    if (howtoBtn) {
      howtoBtn.addEventListener('click', () => {
        playSE('cursor');
        if (howtoModal) howtoModal.classList.add('active');
        if (modalOverlay) modalOverlay.classList.add('active');
      });
    }`,
`    if (howtoBtn) {
      howtoBtn.addEventListener('click', () => {
        if (howtoModal) howtoModal.classList.add('active');
        if (modalOverlay) modalOverlay.classList.add('active');
      });
    }`
);

content = content.replace(
`    if (closeHowtoBtn) {
      closeHowtoBtn.addEventListener('click', () => {
        playSE('cursor');
        if (howtoModal) howtoModal.classList.remove('active');
        if (modalOverlay) modalOverlay.classList.remove('active');
      });
    }`,
`    if (closeHowtoBtn) {
      closeHowtoBtn.addEventListener('click', () => {
        if (howtoModal) howtoModal.classList.remove('active');
        if (modalOverlay) modalOverlay.classList.remove('active');
      });
    }`
);

// 3. Fix btnBackToTitle listener
const btnGameStartRegex = /const btnGameStart = document\.getElementById\('btn-game-start'\);[\s\S]*?if \(btnGameStart\) \{[\s\S]*?btnGameStart\.addEventListener\('click', \(\) => \{[\s\S]*?initGame\(\);[\s\S]*?\}\);[\s\S]*?\}/;

const newListener = `const btnBackToTitle = document.getElementById('btn-back-to-title');
    if (btnBackToTitle) {
      btnBackToTitle.addEventListener('click', () => {
        if (classSelectScreen) classSelectScreen.style.display = 'none';
        if (startScreen) startScreen.style.display = 'flex';
        playBGM('start');
      });
    }`;

if (btnGameStartRegex.test(content)) {
  content = content.replace(btnGameStartRegex, newListener);
} else {
  // If btn-game-start wasn't found (maybe it was already replaced partially?), just append it before the config modal part
  if (!content.includes('btnBackToTitle.addEventListener')) {
    content = content.replace('// 各種ポップアップモーダル', newListener + '\n\n    // 各種ポップアップモーダル');
  }
}

fs.writeFileSync('src/pages/portfolio/roguelike/index.astro', content);
console.log('Fixed playSE and btnBackToTitle');
