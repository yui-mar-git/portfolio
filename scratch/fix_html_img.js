import fs from 'fs';
let content = fs.readFileSync('src/pages/portfolio/roguelike/index.astro', 'utf8');

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

content = content.replace('---', '---\n' + imports);

content = content.replace('src="../../../assets/games/roguelike/images/characters/figure_rpg_character_yuusya.png"', 'src={yuusyaImg.src}');
content = content.replace('src="../../../assets/games/roguelike/images/characters/figure_rpg_character_kenshi.png"', 'src={kenshiImg.src}');
content = content.replace('src="../../../assets/games/roguelike/images/characters/figure_rpg_character_mahoutsukai.png"', 'src={mahoutsukaiImg.src}');
content = content.replace('src="../../../assets/games/roguelike/images/characters/figure_rpg_character_butouka.png"', 'src={butoukaImg.src}');
content = content.replace('src="../../../assets/games/roguelike/images/map/building_hotel_pet.png"', 'src={hotelImg.src}');
content = content.replace('src="../../../assets/games/roguelike/images/characters/fantasy_pixy2.png"', 'src={pixyImg.src}');
content = content.replace('src="../../../assets/games/roguelike/images/map/omise_shop_tatemono.png"', 'src={shopImg.src}');
content = content.replace('src="../../../assets/games/roguelike/images/icons/no_image_square.jpg"', 'src={noImageImg.src}');
content = content.replace('src="../../../assets/games/roguelike/images/characters/royal_king.png"', 'src={kingImg.src}');

fs.writeFileSync('src/pages/portfolio/roguelike/index.astro', content);
console.log('Fixed HTML img tags');
