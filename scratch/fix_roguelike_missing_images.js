import fs from 'fs';
let content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');

const folders = ['monsters', 'icons', 'characters', 'map', 'relics', 'items'];
for (const folder of folders) {
  const target = `new URL('../../../assets/games/roguelike/${folder}/`;
  const replacement = `new URL('../../../assets/games/roguelike/images/${folder}/`;
  content = content.split(target).join(replacement);
}

fs.writeFileSync('src/pages/portfolio/roguelike/index.astro', content);
console.log('Fixed missing images folder');
