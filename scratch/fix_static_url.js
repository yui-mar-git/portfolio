import fs from 'fs';
let content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');

// 1. Revert playBGM and playSE to simple object lookups
content = content.replace(
  /const url = new URL\('\.\.\/\.\.\/\.\.\/assets\/games\/roguelike\/audio\/bgm\/' \+ BGM_DB\[bgmId\], import\.meta\.url\)\.href;/,
  `const url = BGM_DB[bgmId];`
);
content = content.replace(
  /const path = new URL\('\.\.\/\.\.\/\.\.\/assets\/games\/roguelike\/audio\/se\/' \+ SE_DB\[seId\], import\.meta\.url\)\.href;/,
  `const path = SE_DB[seId];`
);

// 2. Rewrite BGM_DB values
content = content.replace(/(const BGM_DB = \{[\s\S]*?\};)/, (match) => {
  return match.replace(/'(.*?)'/g, (m, p1) => {
    if (p1.endsWith('.mp3')) {
      return `new URL('../../../assets/games/roguelike/audio/bgm/${p1}', import.meta.url).href`;
    }
    return m;
  });
});

// 3. Rewrite SE_DB values
content = content.replace(/(const SE_DB = \{[\s\S]*?\};)/, (match) => {
  return match.replace(/'(.*?)'/g, (m, p1) => {
    if (p1.endsWith('.mp3') || p1.endsWith('.wav')) {
      return `new URL('../../../assets/games/roguelike/audio/se/${p1}', import.meta.url).href`;
    }
    return m;
  });
});

fs.writeFileSync('src/pages/portfolio/roguelike/index.astro', content);
console.log('Fixed SE_DB and BGM_DB statically');
