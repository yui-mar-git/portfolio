import fs from 'fs';

let content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');

// Remove absolute BGM_PATH and SE_PATH variables if they exist
content = content.replace(/const BGM_PATH = '[^']+';\s*/g, '');
content = content.replace(/const SE_PATH = '[^']+';\s*/g, '');

// Replace BGM_DB string values to Vite URL resolutions
content = content.replace(/const BGM_DB = {([^}]+)};/g, (match, body) => {
  let newBody = body.replace(/'([^']+)':\s*'([^']+)'/g, (m, key, filename) => {
    return `'${key}': new URL('../../../assets/games/roguelike/audio/bgm/${filename}', import.meta.url).href`;
  });
  return `const BGM_DB = {${newBody}};`;
});

// Replace SE_DB string values to Vite URL resolutions
content = content.replace(/const SE_DB = {([^}]+)};/g, (match, body) => {
  let newBody = body.replace(/'([^']+)':\s*'([^']+)'/g, (m, key, filename) => {
    return `'${key}': new URL('../../../assets/games/roguelike/audio/se/${filename}', import.meta.url).href`;
  });
  return `const SE_DB = {${newBody}};`;
});

// Fix playBGM
content = content.replace(/BGM_PATH \+ BGM_DB\[bgmId\]/g, 'BGM_DB[bgmId]');

// Fix playSE to create Audio with the correct string
content = content.replace(/const se = new Audio\(SE_PATH \+ SE_DB\[seId\]\);/g, 'const se = new Audio(SE_DB[seId]);');

// Fix AVATAR_IMAGES dictionary
content = content.replace(/const AVATAR_IMAGES = {([^}]+)};/g, (match, body) => {
  let newBody = body.replace(/'([^']+)':\s*'\/portfolio\/common\/assets\/([^']+)'/g, (m, key, path) => {
    let fixedPath = path.replace(/^(characters|icons|items|map|monsters|relics)\//, 'images/$1/');
    return `'${key}': new URL('../../../assets/games/roguelike/${fixedPath}', import.meta.url).href`;
  });
  return `const AVATAR_IMAGES = {${newBody}};`;
});

// Fix other occurrences of /portfolio/common/assets/
content = content.replace(/'\/portfolio\/common\/assets\/([^']+)'/g, (match, path) => {
  let fixedPath = path.replace(/^(characters|icons|items|map|monsters|relics)\//, 'images/$1/');
  return `new URL('../../../assets/games/roguelike/${fixedPath}', import.meta.url).href`;
});

// Fix dynamic template literals `/portfolio/common/assets/${...}`
content = content.replace(/`\/portfolio\/common\/assets\/\$\{([^}]+)\}`/g, (match, expr) => {
  return `new URL('../../../assets/games/roguelike/images/' + ${expr}.replace(/^(characters|icons|items|map|monsters|relics)\\\//, ''), import.meta.url).href`;
});

// Append closing tags if missing
if (!content.includes('</script>')) {
  content += '\n</script>\n  </GameLayout>\n';
}

fs.writeFileSync('src/pages/portfolio/roguelike/index.astro', content);
console.log('Fixed index.astro successfully');
