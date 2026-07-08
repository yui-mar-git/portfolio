import fs from 'fs';
let content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');
const start = content.indexOf('<script>');
const end = content.lastIndexOf('</script>');
if (start !== -1 && end !== -1) {
  content = content.substring(0, start) + '<script src="../../../scripts/roguelike/main.js"></script>' + content.substring(end + 9);
  fs.writeFileSync('src/pages/portfolio/roguelike/index.astro', content);
  console.log('Successfully replaced script tag');
} else {
  console.log('Script tag not found');
}
