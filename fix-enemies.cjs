const fs = require('fs');
let content = fs.readFileSync('src/data/roguelike/enemies.ts', 'utf8');
content = content.replace(/image: '\/portfolio\/roguelike\/assets\/monsters\/([^']+)'/g, (match, filename) => {
  return "image: new URL('../../assets/games/roguelike/images/monsters/" + filename + "', import.meta.url).href";
});
fs.writeFileSync('src/data/roguelike/enemies.ts', content);
