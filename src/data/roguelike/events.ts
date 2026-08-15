import madScientistImg from '../../assets/games/roguelike/images/characters/job_scientist_mad.png';
import noImg from '../../assets/games/roguelike/images/icons/no_image_square.jpg';

export interface EventOption {
  text: string;
  type: 'drink_potion' | 'leave';
  isCustomNav?: boolean;
}

export interface MapEvent {
  id: string;
  title: string;
  image: string;
  text: string;
  options: EventOption[];
}

export const MAP_EVENTS: MapEvent[] = [
  {
    id: 'mad_scientist',
    title: 'マッドサイエンティストの実験',
    image: madScientistImg,
    text: '薄暗い部屋で、怪しげな白衣の男が試験管を振っています。\n「ヒヒヒ…私の特製ドリンクを試してみないか？すごい効果があるぞぉ…？」',
    options: [
      {
        text: '[飲む] 赤色の怪しい液体',
        type: 'drink_potion',
        isCustomNav: true,
      },
      {
        text: '[飲む] 青色の怪しい液体',
        type: 'drink_potion',
        isCustomNav: true,
      },
      {
        text: '[飲む] 緑色の怪しい液体',
        type: 'drink_potion',
        isCustomNav: true,
      },
      {
        text: 'やめておく (立ち去る)',
        type: 'leave',
        isCustomNav: true,
      },
    ],
  },
];
