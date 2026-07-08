import fs from 'fs';
let content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');

// 1. playBGM fix
content = content.replace(
  /const url = BGM_PATH \+ BGM_DB\[bgmId\];/,
  `const url = new URL('../../../assets/games/roguelike/audio/bgm/' + BGM_DB[bgmId], import.meta.url).href;`
);

// 2. playSE fix
content = content.replace(
  /const path = SE_DB\[seId\];/,
  `const path = new URL('../../../assets/games/roguelike/audio/se/' + SE_DB[seId], import.meta.url).href;`
);

// 3. Fix other images in JS (like CHARACTER_IMAGES, ICONS, etc.)
// Search for '/portfolio/roguelike/assets/images/...'
content = content.replace(/'\/portfolio\/roguelike\/assets\/(.*?)'/g, (match, p1) => {
  return `new URL('../../../assets/games/roguelike/${p1}', import.meta.url).href`;
});

// Fix BGM_PATH and SE_PATH variables so they don't break if used elsewhere
content = content.replace(
  /const BGM_PATH = '\/portfolio\/roguelike\/assets\/audio\/bgm\/';/,
  `const BGM_PATH = '../../../assets/games/roguelike/audio/bgm/';`
);
content = content.replace(
  /const SE_PATH = '\/portfolio\/roguelike\/assets\/audio\/se\/';/,
  `const SE_PATH = '../../../assets/games/roguelike/audio/se/';`
);

// 4. Fix howto button size
content = content.replace(
  /<button id="howto-btn" class="btn btn-secondary" style="margin-top: 1rem; width: 100%;">遊び方<\/button>/,
  '<button id="howto-btn" class="btn btn-secondary btn-full" style="margin-top: 1rem;">遊び方</button>'
);
content = content.replace(
  /<button id="config-btn" class="btn btn-secondary" style="margin-top: 1rem; width: 100%;">コンフィグ<\/button>/,
  '<button id="config-btn" class="btn btn-secondary btn-full" style="margin-top: 1rem;">コンフィグ</button>'
);

fs.writeFileSync('src/pages/portfolio/roguelike/index.astro', content);
console.log('Fixed paths and button size');
