import fs from 'fs';
let content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');

// 1. Add frontmatter imports
const imports = `
import yuusyaImg from '../../../assets/games/roguelike/images/characters/figure_rpg_character_yuusya.png';
import kenshiImg from '../../../assets/games/roguelike/images/characters/figure_rpg_character_kenshi.png';
import mahoutsukaiImg from '../../../assets/games/roguelike/images/characters/figure_rpg_character_mahoutsukai.png';
import butoukaImg from '../../../assets/games/roguelike/images/characters/figure_rpg_character_butouka.png';
import hotelImg from '../../../assets/games/roguelike/images/map/building_hotel_pet.png';
import pixyImg from '../../../assets/games/roguelike/images/characters/fantasy_pixy2.png';
import shopImg from '../../../assets/games/roguelike/images/map/omise_shop_tatemono.png';
import noImageImg from '../../../assets/games/roguelike/images/icons/no_image_square.jpg';
import kingImg from '../../../assets/games/roguelike/images/characters/royal_king.png';
`;
if (!content.includes('import yuusyaImg')) {
  content = content.replace('---', '---\n' + imports);
}

// 2. Fix HTML img tags
content = content.replace(/src="[^"]*figure_rpg_character_yuusya\.png"/, 'src={yuusyaImg.src}');
content = content.replace(/src="[^"]*figure_rpg_character_kenshi\.png"/, 'src={kenshiImg.src}');
content = content.replace(/src="[^"]*figure_rpg_character_mahoutsukai\.png"/, 'src={mahoutsukaiImg.src}');
content = content.replace(/src="[^"]*figure_rpg_character_butouka\.png"/, 'src={butoukaImg.src}');
content = content.replace(/src="[^"]*building_hotel_pet\.png"/, 'src={hotelImg.src}');
content = content.replace(/src="[^"]*fantasy_pixy2\.png"/, 'src={pixyImg.src}');
content = content.replace(/src="[^"]*omise_shop_tatemono\.png"/, 'src={shopImg.src}');
content = content.replace(/src="[^"]*no_image_square\.jpg"/, 'src={noImageImg.src}');
content = content.replace(/src="[^"]*royal_king\.png"/, 'src={kingImg.src}');

// 3. Replace btn-game-start with btn-back-to-title
content = content.replace(
  '<button id="btn-game-start" class="btn btn-full" style="margin-top: 0.5rem;">冒険の旅へ出る</button>',
  '<button id="btn-back-to-title" class="btn btn-secondary btn-full" style="margin-top: 0.5rem;">戻る</button>'
);

// 4. Update preview text
content = content.replace(
  "if (preview) preview.textContent = '勇者が選択されています';",
  "if (preview) preview.textContent = '職業をクリックして冒険を始めてください';"
);
content = content.replace(
  />勇者が選択されています<\/p>/,
  '>職業をクリックして冒険を始めてください</p>'
);

// 5. Update card click listener
content = content.replace(
  /if \(preview\) preview\.textContent = `\$\{CLASS_NAMES\[selectedClass\] \|\| selectedClass\}が選択されています`;/,
  `showGameConfirm('冒険の開始', \`\${CLASS_NAMES[selectedClass] || selectedClass}として冒険にでますか？\`, () => {
            initGame();
          });`
);

// 6. Replace btnGameStart listener with btnBackToTitle
const oldListener = `    const btnGameStart = document.getElementById('btn-game-start');
    if (btnGameStart) {
      btnGameStart.addEventListener('click', () => {
        initGame();
      });
    }`;
const newListener = `    const btnBackToTitle = document.getElementById('btn-back-to-title');
    if (btnBackToTitle) {
      btnBackToTitle.addEventListener('click', () => {
        if (classSelectScreen) classSelectScreen.style.display = 'none';
        if (startScreen) startScreen.style.display = 'flex';
        playBGM('start');
      });
    }`;
content = content.replace(oldListener, newListener);

fs.writeFileSync('src/pages/portfolio/roguelike/index.astro', content);
console.log('Successfully applied all fixes');
