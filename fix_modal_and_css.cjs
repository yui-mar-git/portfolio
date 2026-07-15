const fs = require('fs');

const howtoPath = 'src/components/portfolio/HowToPlayModal.astro';
let content = fs.readFileSync(howtoPath, 'utf8');

// Change astro:page-load to DOMContentLoaded
content = content.replace("document.addEventListener('astro:page-load', () => {", "document.addEventListener('DOMContentLoaded', () => {");
fs.writeFileSync(howtoPath, content, 'utf8');

// Add .modal-close-x-btn and fix .dv-card-list to global.css
const globalCssPath = 'src/styles/global.css';
let css = fs.readFileSync(globalCssPath, 'utf8');

if (!css.includes('.modal-close-x-btn')) {
    css += `
.modal-close-x-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}
.modal-close-x-btn:hover {
  color: #ffb84d;
}
`;
}

// Fix .dv-card-list to have 6 cards per row
css = css.replace(/grid-template-columns: repeat\(auto-fill, minmax\(75px, 1fr\)\);/g, 'grid-template-columns: repeat(6, 1fr);');
// Also add aspect-ratio to cards in lists
if (!css.includes('aspect-ratio: 90 / 145')) {
    css = css.replace('.dv-card-list :global(.battle-card),\n#fairy-card-list :global(.battle-card) {', 
        '.dv-card-list :global(.battle-card),\n#fairy-card-list :global(.battle-card),\n#town-shop-list :global(.battle-card) {\n  aspect-ratio: 90 / 145;\n  height: auto;');
}
fs.writeFileSync(globalCssPath, css, 'utf8');
console.log('Fixed HowToPlayModal.astro and global.css');
