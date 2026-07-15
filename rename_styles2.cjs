const fs = require('fs');

const astroFiles = [
  'src/pages/portfolio/roguelike/index.astro',
  'src/components/portfolio/MinigameUI.astro',
  'src/components/portfolio/RunActionUI.astro',
  'src/components/portfolio/TowerDefenseUI.astro',
  'src/pages/contact/index.astro',
  'src/pages/profile/index.astro',
  'src/layouts/GameLayout.astro'
];

let classMapping = {};

// Find all rl-style-XX definitions inside <style> blocks
astroFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  const regex = /\.rl-style-(\d+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const oldClass = `rl-style-${match[1]}`;
    if (!classMapping[oldClass]) {
      classMapping[oldClass] = `ui-custom-${match[1]}`; // fallback
    }
  }
});

// Generate semantic names based on usage
astroFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  Object.keys(classMapping).forEach(oldClass => {
    const idRegex = new RegExp(`id="([^"]+)"[^>]*class="[^"]*${oldClass}[^"]*"|class="[^"]*${oldClass}[^"]*"[^>]*id="([^"]+)"`);
    const idMatch = content.match(idRegex);
    if (idMatch) {
      const idName = idMatch[1] || idMatch[2];
      classMapping[oldClass] = `${idName}-custom`;
    } else {
      const classRegex = new RegExp(`class="([^"]*)${oldClass}([^"]*)"`);
      const cMatch = content.match(classRegex);
      if (cMatch) {
        const otherClasses = (cMatch[1] + cMatch[2]).trim().split(/\\s+/).filter(c => c && !c.startsWith('rl-style'));
        if (otherClasses.length > 0) {
          classMapping[oldClass] = `${otherClasses[0]}-custom`;
        }
      }
    }
  });
});

// Rename in Astro files
astroFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  Object.keys(classMapping).forEach(oldClass => {
    const newClass = classMapping[oldClass];
    // Replace definitions in CSS
    content = content.replace(new RegExp(`\\.${oldClass}(?![\\w-])`, 'g'), `.${newClass}`);
    // Replace usages in HTML
    content = content.replace(new RegExp(`\\b${oldClass}\\b`, 'g'), newClass);
  });
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Renamed rl-style-XX classes in all files!');
