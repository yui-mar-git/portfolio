const fs = require('fs');
const files = ['src/scripts/roguelike/main.js', 'src/components/portfolio/RoguelikeUI.astro'];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/assets\/games\/roguelike\/(characters|icons|items|map|monsters|relics)\//g, 'assets/games/roguelike/images/$1/');
  fs.writeFileSync(file, content);
});
console.log('Fixed URLs');
