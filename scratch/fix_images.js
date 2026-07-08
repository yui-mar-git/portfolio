import fs from 'fs';
let content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');

// HTML attributes
content = content.replace(/"\/portfolio\/roguelike\/assets\/([^"]+)"/g, (match, path) => {
  let fixedPath = path.replace(/^(characters|icons|items|map|monsters|relics)\//, 'images/$1/');
  return `"../../../assets/games/roguelike/${fixedPath}"`;
});

// JS strings (single quotes)
content = content.replace(/'\/portfolio\/roguelike\/assets\/([^']+)'/g, (match, path) => {
  let fixedPath = path.replace(/^(characters|icons|items|map|monsters|relics)\//, 'images/$1/');
  return `new URL('../../../assets/games/roguelike/${fixedPath}', import.meta.url).href`;
});

// JS template literals if any
content = content.replace(/`\/portfolio\/roguelike\/assets\/\$\{([^}]+)\}`/g, (match, expr) => {
  return `new URL('../../../assets/games/roguelike/images/' + ${expr}.replace(/^(characters|icons|items|map|monsters|relics)\\\//, ''), import.meta.url).href`;
});

fs.writeFileSync('src/pages/portfolio/roguelike/index.astro', content);
console.log('Fixed image paths');
