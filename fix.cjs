const fs = require('fs');
['items.ts', 'enemies.ts'].forEach(file => {
  let content = fs.readFileSync('src/data/roguelike/' + file, 'utf8');
  content = content.replace(/image: '\/portfolio\/roguelike\/assets\/(?:items|enemies)\/([^']+)'/g, (match, filename) => {
    const folder = file === 'items.ts' ? 'items' : 'enemies';
    return "image: new URL('../../assets/games/roguelike/images/" + folder + "/" + filename + "', import.meta.url).href";
  });
  fs.writeFileSync('src/data/roguelike/' + file, content);
});
