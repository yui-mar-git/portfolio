const fs = require('fs');
const path = require('path');

const enemiesFile = 'src/data/roguelike/enemies.ts';
let content = fs.readFileSync(enemiesFile, 'utf8');

function findFile(filename) {
  const roguelikePath = `src/assets/games/roguelike/images/monsters/${filename}`;
  if (fs.existsSync(roguelikePath)) return `../../assets/games/roguelike/images/monsters/${filename}`;
  
  const tdPath = `src/assets/games/tower-defense/images/enemy/${filename}`;
  if (fs.existsSync(tdPath)) return `../../assets/games/tower-defense/images/enemy/${filename}`;
  
  const tdBossPath = `src/assets/games/tower-defense/images/boss/${filename}`;
  if (fs.existsSync(tdBossPath)) return `../../assets/games/tower-defense/images/boss/${filename}`;
  
  const characterPath = `src/assets/games/roguelike/images/characters/${filename}`;
  if (fs.existsSync(characterPath)) return `../../assets/games/roguelike/images/characters/${filename}`;
  
  console.log('NOT FOUND:', filename);
  return `../../assets/games/roguelike/images/monsters/${filename}`;
}

content = content.replace(/new URL\('([^']+)', import\.meta\.url\)\.href/g, (match, p1) => {
  const filename = path.basename(p1);
  const correctPath = findFile(filename);
  return `new URL('${correctPath}', import.meta.url).href`;
});

fs.writeFileSync(enemiesFile, content);
console.log('Fixed enemies.ts');
