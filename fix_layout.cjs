const fs = require('fs');
const file = 'src/pages/portfolio/roguelike/index.astro';
let content = fs.readFileSync(file, 'utf8');

// Center start-screen-custom
if (content.includes('.start-screen-custom {')) {
  content = content.replace(
    /\\.start-screen-custom \{[\\s\\S]*?\\}/,
    `.start-screen-custom {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0f0f1a;
      z-index: 99;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 1.2rem;
      box-sizing: border-box;
    }`
  );
}

// Center class-select-screen-custom
if (content.includes('.class-select-screen-custom {')) {
  content = content.replace(
    /\\.class-select-screen-custom \{[\\s\\S]*?\\}/,
    `.class-select-screen-custom {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0f0f1a;
      z-index: 98;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 1.2rem;
      box-sizing: border-box;
      overflow-y: auto;
    }`
  );
}

// Ensure the grid takes 100% width or max-width so it's not squished vertically
if (content.includes('.class-grid-custom {')) {
  content = content.replace(
    /\\.class-grid-custom \{[\\s\\S]*?\\}/,
    `.class-grid-custom {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }`
  );
}

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed alignment in roguelike/index.astro');
