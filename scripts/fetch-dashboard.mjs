import fs from 'fs/promises';
import path from 'path';

// APIs to fetch
const WEATHER_API =
  'https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode,uv_index_max&hourly=weathercode&timezone=Asia%2FTokyo';
const AIR_QUALITY_API =
  'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=35.6895&longitude=139.6917&current=pm2_5,birch_pollen,grass_pollen,mugwort_pollen';
const SUNSET_API = (y, m, d) =>
  `https://api.sunrise-sunset.org/json?lat=35.6895&lng=139.6917&date=${y}-${m}-${d}&formatted=0`;

// 4つのビジネスドメイン法令プール（基本法系を六法に統一、会社法をビジネス系へ移設）
const LAW_POOLS = {
  basic: {
    categoryName: '基本法系 (六法)',
    laws: [
      { id: '321CONSTITUTION', name: '日本国憲法' },
      { id: '129AC0000000089', name: '民法' },
      { id: '132AC0000000048', name: '商法' },
    ],
  },
  ip_content: {
    categoryName: '知的財産・コンテンツ系',
    laws: [
      { id: '345AC0000000048', name: '著作権法' },
      { id: '334AC0000000121', name: '特許法' },
      { id: '334AC0000000125', name: '意匠法' },
      { id: '334AC0000000127', name: '商標法' },
      { id: '405AC0000000047', name: '不正競争防止法' },
    ],
  },
  it_security: {
    categoryName: 'IT・セキュリティ系',
    laws: [
      { id: '426AC1000000104', name: 'サイバーセキュリティ基本法' },
      { id: '411AC0000000128', name: '不正アクセス禁止法' },
      { id: '413AC0000000137', name: 'プロバイダ責任制限法' },
      { id: '415AC0000000057', name: '個人情報保護法' },
      { id: '412AC0000000102', name: '電子署名法' },
    ],
  },
  business: {
    categoryName: 'ビジネス・不動産系',
    laws: [
      { id: '417AC0000000086', name: '会社法' },
      { id: '323AC0000000025', name: '金融商品取引法' },
      { id: '322AC0000000049', name: '労働基準法' },
      { id: '351AC0000000057', name: '特定商取引法' },
      { id: '412AC0000000061', name: '消費者契約法' },
    ],
  },
};

const condMap = {
  0: '快晴☀️',
  1: '晴れ🌤️',
  2: '一部曇り⛅',
  3: '曇り☁️',
  45: '霧🌫️',
  48: '霧🌫️',
  51: '小雨🌦️',
  53: '雨🌧️',
  55: '強雨🌧️',
  61: '小雨🌦️',
  63: '雨🌧️',
  65: '強雨🌧️',
  71: '小雪🌨️',
  73: '雪❄️',
  75: '大雪❄️',
  80: 'にわか雨🌦️',
  81: '雨🌧️',
  82: '強いにわか雨🌧️',
  95: '雷雨⛈️',
  96: '雷雨⛈️',
  99: '雷雨⛈️',
};

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`Fetch failed for ${url}, attempt ${i + 1}:`, e.message);
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

async function fetchWeather() {
  const data = await fetchWithRetry(WEATHER_API);
  const currentTemp = data.current.temperature_2m;
  const currentCond = condMap[data.current.weathercode] || '不明';
  const max = data.daily.temperature_2m_max[0];
  const min = data.daily.temperature_2m_min[0];
  const uvIndex = data.daily.uv_index_max[0];
  const uvLabel =
    uvIndex < 3
      ? '低い'
      : uvIndex < 6
        ? '中程度'
        : uvIndex < 8
          ? '強い'
          : uvIndex < 11
            ? '非常に強い'
            : '極端に強い';

  const hours = data.hourly.time;
  const morn = hours.findIndex((t) => t.endsWith('T06:00'));
  const noon = hours.findIndex((t) => t.endsWith('T12:00'));
  const eve = hours.findIndex((t) => t.endsWith('T18:00'));
  const mornCond = morn >= 0 ? condMap[data.hourly.weathercode[morn]] || '不明' : '';
  const noonCond = noon >= 0 ? condMap[data.hourly.weathercode[noon]] || '不明' : '';
  const eveCond = eve >= 0 ? condMap[data.hourly.weathercode[eve]] || '不明' : '';

  return { currentTemp, currentCond, max, min, uvIndex, uvLabel, mornCond, noonCond, eveCond };
}

async function fetchAirQuality() {
  const data = await fetchWithRetry(AIR_QUALITY_API);
  const pm25 = data.current.pm2_5;
  const pm25Label = pm25 < 12 ? '良い' : pm25 < 35 ? '普通' : pm25 < 55 ? '悪い' : '非常に悪い';

  const pollenVars = ['birch_pollen', 'grass_pollen', 'mugwort_pollen'];
  let maxPollen = 0;
  for (const pv of pollenVars) {
    if (data.current[pv] > maxPollen) maxPollen = data.current[pv];
  }
  const pollenLabel =
    maxPollen < 10 ? 'なし' : maxPollen < 30 ? '中程度' : maxPollen < 100 ? '多い' : '非常に多い';

  return { pm25, pm25Label, pollenLabel };
}

async function fetchSunset() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const data = await fetchWithRetry(SUNSET_API(y, m, d));
  const sunset = new Date(data.results.sunset);

  const jst = new Date(sunset.getTime() + 9 * 60 * 60 * 1000);
  const hh = String(jst.getUTCHours()).padStart(2, '0');
  const mm = String(jst.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

// 単一の法令からランダムな1条文を取得するヘルパー
async function fetchSingleArticle(lawObj, categoryName) {
  try {
    const res = await fetch(`https://elaws.e-gov.go.jp/api/1/lawdata/${lawObj.id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const mainText = text.split('<SupplProvision>')[0] || text;
    const articleRegex =
      /<ArticleTitle>(.*?)<\/ArticleTitle>[\s\S]*?<Sentence[^>]*>(.*?)<\/Sentence>/g;
    const articles = [];
    let match;
    while ((match = articleRegex.exec(mainText)) !== null) {
      articles.push({ title: match[1], sentence: match[2] });
    }
    if (articles.length > 0) {
      const selected = articles[Math.floor(Math.random() * articles.length)];
      return {
        category: categoryName,
        lawId: lawObj.id,
        name: lawObj.name,
        title: selected.title,
        sentence: selected.sentence.replace(/<[^>]*>?/gm, '').trim(),
      };
    }
  } catch (e) {
    console.error(`Law fetch failed for ${lawObj.name}:`, e.message);
  }
  return null;
}

// 5ジャンルの法則に従い「5つの条文」を重複なく抽出
async function fetch5DomainLaws() {
  const results = [];
  const usedLawIds = new Set();

  // 1〜4. 4つのプールから指定順（基本法系(六法) ➔ 知的財産・コンテンツ系 ➔ ITセキュリティ ➔ ビジネス・不動産系）で各1つずつ抽出
  for (const [poolKey, pool] of Object.entries(LAW_POOLS)) {
    let available = pool.laws.filter((l) => !usedLawIds.has(l.id));
    while (available.length > 0) {
      const idx = Math.floor(Math.random() * available.length);
      const pickedLaw = available[idx];
      const article = await fetchSingleArticle(pickedLaw, pool.categoryName);
      if (article) {
        results.push(article);
        usedLawIds.add(pickedLaw.id);
        break;
      }
      available.splice(idx, 1);
    }
  }

  // 5. ランダム枠（全法令から重複なしで1件抽出）
  const allLaws = Object.values(LAW_POOLS).flatMap((p) =>
    p.laws.map((l) => ({ ...l, categoryName: `ピックアップ (${p.categoryName})` }))
  );
  const remainingLaws = allLaws.filter((l) => !usedLawIds.has(l.id));
  if (remainingLaws.length > 0) {
    const randomLaw = remainingLaws[Math.floor(Math.random() * remainingLaws.length)];
    const article = await fetchSingleArticle(randomLaw, randomLaw.categoryName);
    if (article) {
      results.push(article);
    }
  }

  // フォールバック
  if (results.length === 0) {
    results.push({
      category: '基本法系 (六法)',
      lawId: '321CONSTITUTION',
      name: '日本国憲法',
      title: '第一条',
      sentence: '天皇は、日本国の象徴であり日本国民統合の象徴であつて、この地位は、主権の存する日本国民の総意に基く。',
    });
  }

  return results;
}

async function main() {
  try {
    console.log('Fetching dashboard data & 5-domain laws (Roppo + Corporate)...');
    const weather = await fetchWeather();
    const air = await fetchAirQuality();
    const sunset = await fetchSunset();
    const laws = await fetch5DomainLaws();

    // Get Moon Age
    const today = new Date();
    const base = new Date(2026, 0, 19, 4, 53, 0);
    const diff = (today.getTime() - base.getTime()) / (1000 * 60 * 60 * 24);
    const age = ((diff % 29.53) + 29.53) % 29.53;
    let moonStr = '🌑 新月';
    if (age > 1.5 && age <= 6) moonStr = '🌒 三日月';
    else if (age > 6 && age <= 9.5) moonStr = '🌓 上弦の月';
    else if (age > 9.5 && age <= 13) moonStr = '🌔 十三夜月';
    else if (age > 13 && age <= 16.5) moonStr = '🌕 満月';
    else if (age > 16.5 && age <= 20) moonStr = '🌖 十六夜月';
    else if (age > 20 && age <= 23.5) moonStr = '🌗 下弦の月';
    else if (age > 23.5 && age <= 27) moonStr = '🌘 有明月';

    // Output Data
    const output = {
      weather,
      air,
      sunset,
      moonStr,
      laws,
      law: laws[0],
    };

    const outPath = path.join(process.cwd(), 'src', 'data', 'dashboard.json');
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`Successfully saved ${laws.length} laws to ${outPath}`);
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err);
    process.exit(1);
  }
}

main();
