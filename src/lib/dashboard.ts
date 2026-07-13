// src/lib/dashboard.ts

export interface CalendarInfo {
  dateStr: string;
  zodiac: string;
  zodiacAnimal: string;
  kanshi: string;
  rokuyo: string;
  nijushisekki: string;
  shichijuniko: string;
}

export function getCalendarInfo(date: Date = new Date()): CalendarInfo {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const dayStr = days[date.getDay()];
  
  const dateStr = `${y}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')} (${dayStr})`;

  // 12星座 (Western Zodiac)
  const zodiacs = [
    { sign: '♑', end: [1, 19] },
    { sign: '♒', end: [2, 18] },
    { sign: '♓', end: [3, 20] },
    { sign: '♈', end: [4, 19] },
    { sign: '♉', end: [5, 20] },
    { sign: '♊', end: [6, 21] },
    { sign: '♋', end: [7, 22] },
    { sign: '♌', end: [8, 22] },
    { sign: '♍', end: [9, 22] },
    { sign: '♎', end: [10, 23] },
    { sign: '♏', end: [11, 22] },
    { sign: '♐', end: [12, 21] },
    { sign: '♑', end: [12, 31] }
  ];
  let zodiac = zodiacs[0].sign;
  for (const z of zodiacs) {
    if (m < z.end[0] || (m === z.end[0] && d <= z.end[1])) {
      zodiac = z.sign;
      break;
    }
  }

  // 十二支 (Chinese Zodiac based on Year)
  const animals = ['申 (さる)', '酉 (とり)', '戌 (いぬ)', '亥 (いのしし)', '子 (ね)', '丑 (うし)', '寅 (とら)', '卯 (うさぎ)', '辰 (たつ)', '巳 (へび)', '午 (うま)', '未'];
  const zodiacAnimal = animals[y % 12];

  // 日干支 (Daily Kanshi)
  // 1970-01-01 is 甲戌 (Kanshi index 10).
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const baseDate = new Date(1970, 0, 1);
  const targetDate = new Date(y, m - 1, d);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  // Adding 10 because 1970-01-01 was index 10 (甲戌)
  let kanshiIndex = (diffDays + 10) % 60;
  if (kanshiIndex < 0) kanshiIndex += 60;
  const kanshi = `${stems[kanshiIndex % 10]}${branches[kanshiIndex % 12]}`;

  // 六曜 (Simplified pseudo-lunar calculation from GAS)
  // 厳密な旧暦ではない簡易計算
  const lunarMonth = (m + 9) % 12 + 1;
  const lunarDay = d;
  const rokuyoIndex = (lunarMonth + lunarDay) % 6;
  const rokuyoList = ['大安', '赤口', '先勝', '友引', '先負', '仏滅'];
  const rokuyo = rokuyoList[rokuyoIndex];

  // 二十四節気 (Nijushisekki) & 七十二候 (Shichijuniko) approximations
  // Using fixed ranges for simplicity.
  // Format: [month, day, Nijushisekki, Shichijuniko]
  const seasons = [
    [1, 6, '小寒', '芹乃栄'],
    [1, 10, '小寒', '水泉動'],
    [1, 15, '小寒', '雉始雊'],
    [1, 20, '大寒', '款冬華'],
    [1, 25, '大寒', '水沢腹堅'],
    [1, 30, '大寒', '鶏始乳'],
    [2, 4, '立春', '東風解凍'],
    [2, 9, '立春', '黄鶯睍睆'],
    [2, 14, '立春', '魚上氷'],
    [2, 19, '雨水', '土脉潤起'],
    [2, 24, '雨水', '霞始靆'],
    [2, 29, '雨水', '草木萌動'],
    [3, 6, '啓蟄', '蟄虫啓戸'],
    [3, 11, '啓蟄', '桃始笑'],
    [3, 16, '啓蟄', '菜虫化蝶'],
    [3, 21, '春分', '雀始巣'],
    [3, 26, '春分', '桜始開'],
    [3, 31, '春分', '雷乃発声'],
    [4, 5, '清明', '玄鳥至'],
    [4, 10, '清明', '鴻雁北'],
    [4, 15, '清明', '虹始見'],
    [4, 20, '穀雨', '葭始生'],
    [4, 25, '穀雨', '霜止出苗'],
    [4, 30, '穀雨', '牡丹華'],
    [5, 6, '立夏', '蛙始鳴'],
    [5, 11, '立夏', '蚯蚓出'],
    [5, 16, '立夏', '竹笋生'],
    [5, 21, '小満', '蚕起食桑'],
    [5, 26, '小満', '紅花栄'],
    [5, 31, '小満', '麦秋至'],
    [6, 6, '芒種', '蟷螂生'],
    [6, 11, '芒種', '腐草為蛍'],
    [6, 16, '芒種', '梅子黄'],
    [6, 21, '夏至', '乃東枯'],
    [6, 26, '夏至', '菖蒲華'],
    [7, 2, '夏至', '半夏生'],
    [7, 7, '小暑', '温風至'],
    [7, 12, '小暑', '蓮始開'],
    [7, 17, '小暑', '鷹乃学習'],
    [7, 23, '大暑', '桐始結花'],
    [7, 28, '大暑', '土潤溽暑'],
    [8, 2, '大暑', '大雨時行'],
    [8, 7, '立秋', '涼風至'],
    [8, 12, '立秋', '寒蝉鳴'],
    [8, 17, '立秋', '蒙霧升降'],
    [8, 23, '処暑', '綿柎開'],
    [8, 28, '処暑', '天地始粛'],
    [9, 2, '処暑', '禾乃登'],
    [9, 8, '白露', '草露白'],
    [9, 13, '白露', '鶺鴒鳴'],
    [9, 18, '白露', '玄鳥去'],
    [9, 23, '秋分', '雷乃収声'],
    [9, 28, '秋分', '蟄虫坏戸'],
    [10, 3, '秋分', '水始涸'],
    [10, 8, '寒露', '鴻雁来'],
    [10, 13, '寒露', '菊花開'],
    [10, 18, '寒露', '蟋蟀在戸'],
    [10, 23, '霜降', '霜始降'],
    [10, 28, '霜降', '霎時施'],
    [11, 2, '霜降', '楓蔦黄'],
    [11, 7, '立冬', '山茶始開'],
    [11, 12, '立冬', '地始凍'],
    [11, 17, '立冬', '金盞香'],
    [11, 22, '小雪', '虹蔵不見'],
    [11, 27, '小雪', '朔風払葉'],
    [12, 2, '小雪', '橘始黄'],
    [12, 7, '大雪', '閉塞成冬'],
    [12, 12, '大雪', '熊蟄穴'],
    [12, 17, '大雪', '鱖魚群'],
    [12, 22, '冬至', '乃東生'],
    [12, 27, '冬至', '麋角解'],
    [12, 31, '冬至', '雪下出麦']
  ];

  let nijushisekki = seasons[seasons.length - 1][2] as string;
  let shichijuniko = seasons[seasons.length - 1][3] as string;
  
  for (let i = seasons.length - 1; i >= 0; i--) {
    const sMonth = seasons[i][0] as number;
    const sDay = seasons[i][1] as number;
    if (m > sMonth || (m === sMonth && d >= sDay)) {
      nijushisekki = seasons[i][2] as string;
      shichijuniko = seasons[i][3] as string;
      break;
    }
  }

  return {
    dateStr,
    zodiac,
    zodiacAnimal,
    kanshi,
    rokuyo,
    nijushisekki,
    shichijuniko
  };
}
