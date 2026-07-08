import fs from 'fs';
let content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');

// Replace base + '...'
content = content.replace(/base \+ '(.*?)'/g, "new URL('../../../assets/games/roguelike/images/map/$1', import.meta.url).href");

// Replace BASE_MAP + '...'
content = content.replace(/BASE_MAP \+ '(.*?)'/g, "new URL('../../../assets/games/roguelike/images/map/$1', import.meta.url).href");

// Replace BASE_CH + '...'
content = content.replace(/BASE_CH \+ '(.*?)'/g, "new URL('../../../assets/games/roguelike/images/characters/$1', import.meta.url).href");

// Remove the definitions of base, BASE_MAP, BASE_CH if they exist
content = content.replace(/const base = new URL\('.*?', import\.meta\.url\)\.href;/g, '');
content = content.replace(/const BASE_MAP = new URL\('.*?', import\.meta\.url\)\.href;/g, '');
content = content.replace(/const BASE_CH = new URL\('.*?', import\.meta\.url\)\.href;/g, '');

fs.writeFileSync('src/pages/portfolio/roguelike/index.astro', content);
console.log('Fixed dynamic URLs');
