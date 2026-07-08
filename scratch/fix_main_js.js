import fs from 'fs';

let content = fs.readFileSync('scratch/old_index.astro', 'utf8');

const startTag = '<script>';
const endTag = '</script>';
const start = content.indexOf(startTag);
const end = content.lastIndexOf(endTag);

if (start !== -1 && end !== -1) {
  let script = content.substring(start + startTag.length, end);

  // Remove BGM_PATH and SE_PATH variables
  script = script.replace(/const BGM_PATH = '[^']+';\s*/g, '');
  script = script.replace(/const SE_PATH = '[^']+';\s*/g, '');

  // Replace BGM_DB dictionary values
  script = script.replace(/const BGM_DB = {([^}]+)};/g, (match, body) => {
    let newBody = body.replace(/'([^']+)':\s*'([^']+)'/g, (m, key, filename) => {
      return `'${key}': new URL('../../assets/games/roguelike/audio/bgm/${filename}', import.meta.url).href`;
    });
    return `const BGM_DB = {${newBody}};`;
  });

  // Replace SE_DB dictionary values to new Audio() wrapped URLs!
  script = script.replace(/const SE_DB = {([^}]+)};/g, (match, body) => {
    let newBody = body.replace(/'([^']+)':\s*'([^']+)'/g, (m, key, filename) => {
      return `'${key}': new Audio(new URL('../../assets/games/roguelike/audio/se/${filename}', import.meta.url).href)`;
    });
    return `const SE_DB = {${newBody}};`;
  });

  // Change playBGM to NOT prepend BGM_PATH
  script = script.replace(/BGM_PATH \+ BGM_DB\[bgmId\]/g, 'BGM_DB[bgmId]');
  
  // Change playSE to handle Audio objects directly
  script = script.replace(/const se = new Audio\(SE_PATH \+ SE_DB\[seId\]\);/g, 'const se = SE_DB[seId]; se.currentTime = 0;');

  // AVATAR_IMAGES
  script = script.replace(/const AVATAR_IMAGES = {([^}]+)};/g, (match, body) => {
    let newBody = body.replace(/'([^']+)':\s*'\/portfolio\/common\/assets\/([^']+)'/g, (m, key, path) => {
      // replace assets/ characters/... to assets/games/roguelike/images/characters/...
      let fixedPath = path.replace(/^(characters|icons|items|map|monsters|relics)\//, 'images/$1/');
      return `'${key}': new URL('../../assets/games/roguelike/${fixedPath}', import.meta.url).href`;
    });
    return `const AVATAR_IMAGES = {${newBody}};`;
  });

  // Any other '/portfolio/common/assets/' strings in the script
  script = script.replace(/'\/portfolio\/common\/assets\/([^']+)'/g, (match, path) => {
    let fixedPath = path.replace(/^(characters|icons|items|map|monsters|relics)\//, 'images/$1/');
    return `new URL('../../assets/games/roguelike/${fixedPath}', import.meta.url).href`;
  });

  // Fix template literal `/portfolio/common/assets/${...}`
  script = script.replace(/`\/portfolio\/common\/assets\/\$\{([^}]+)\}`/g, (match, expr) => {
    // we can't easily use new URL with dynamic expressions in Vite unless we use import.meta.glob or construct it.
    // Wait! `return new URL('../../assets/games/roguelike/images/' + ${expr}, import.meta.url).href` works in modern Vite!
    return `new URL('../../assets/games/roguelike/images/' + ${expr}.replace(/^(characters|icons|items|map|monsters|relics)\\//, ''), import.meta.url).href`;
  });

  // Write to main.js
  fs.writeFileSync('src/scripts/roguelike/main.js', script);
  console.log('Successfully recovered and fixed main.js');
} else {
  console.log('Script tag not found');
}
