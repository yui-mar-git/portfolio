import fs from 'fs/promises';
import path from 'path';

// APIs to fetch
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode,uv_index_max&hourly=weathercode&timezone=Asia%2FTokyo';
const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=35.6895&longitude=139.6917&current=pm2_5,birch_pollen,grass_pollen,mugwort_pollen';
const SUNSET_API = (y, m, d) => `https://api.sunrise-sunset.org/json?lat=35.6895&lng=139.6917&date=${y}-${m}-${d}&formatted=0`;
const EGOV_LAWS = [
  { id: '321CONSTITUTION', name: '日本国憲法' },
  { id: '405AC0000000047', name: '不正競争防止法' },
  { id: '415AC0000000057', name: '個人情報保護法' }
];

const condMap = {
  0:'快晴☀️', 1:'晴れ🌤️', 2:'一部曇り⛅', 3:'曇り☁️',
  45:'霧🌫️', 48:'霧🌫️',
  51:'小雨🌦️', 53:'雨🌧️', 55:'強雨🌧️',
  61:'小雨🌦️', 63:'雨🌧️', 65:'強雨🌧️',
  71:'小雪🌨️', 73:'雪❄️', 75:'大雪❄️',
  80:'にわか雨🌦️', 81:'雨🌧️', 82:'強いにわか雨🌧️',
  95:'雷雨⛈️', 96:'雷雨⛈️', 99:'雷雨⛈️'
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
      await new Promise(r => setTimeout(r, 2000));
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
  const uvLabel = uvIndex < 3 ? '低い' :
                  uvIndex < 6 ? '中程度' :
                  uvIndex < 8 ? '強い' :
                  uvIndex < 11 ? '非常に強い' : '極端に強い';
  
  const hours = data.hourly.time;
  const morn = hours.findIndex(t => t.endsWith('T06:00'));
  const noon = hours.findIndex(t => t.endsWith('T12:00'));
  const eve = hours.findIndex(t => t.endsWith('T18:00'));
  const mornCond = morn >= 0 ? (condMap[data.hourly.weathercode[morn]] || '不明') : '';
  const noonCond = noon >= 0 ? (condMap[data.hourly.weathercode[noon]] || '不明') : '';
  const eveCond = eve >= 0 ? (condMap[data.hourly.weathercode[eve]] || '不明') : '';

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
  const pollenLabel = maxPollen < 10 ? 'なし' : maxPollen < 30 ? '中程度' : maxPollen < 100 ? '多い' : '非常に多い';

  return { pm25, pm25Label, pollenLabel };
}

async function fetchSunset() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const data = await fetchWithRetry(SUNSET_API(y, m, d));
  const sunset = new Date(data.results.sunset);
  
  // Format to HH:mm in JST
  const jst = new Date(sunset.getTime() + 9 * 60 * 60 * 1000);
  const hh = String(jst.getUTCHours()).padStart(2, '0');
  const mm = String(jst.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

async function fetchLaw() {
  const law = EGOV_LAWS[Math.floor(Math.random() * EGOV_LAWS.length)];
  try {
    const res = await fetch(`https://elaws.e-gov.go.jp/api/1/lawdata/${law.id}`);
    const text = await res.text();
    // Very simple regex parsing for e-Gov XML
    const mainText = text.split('<SupplProvision>')[0] || text;
    const articleRegex = /<ArticleTitle>(.*?)<\/ArticleTitle>[\s\S]*?<Sentence[^>]*>(.*?)<\/Sentence>/g;
    const articles = [];
    let match;
    while ((match = articleRegex.exec(mainText)) !== null) {
      articles.push({ title: match[1], sentence: match[2] });
    }
    if (articles.length > 0) {
      const selected = articles[Math.floor(Math.random() * articles.length)];
      return {
        name: law.name,
        title: selected.title,
        sentence: selected.sentence.replace(/<[^>]*>?/gm, '') // strip any internal XML tags
      };
    }
  } catch (e) {
    console.error('Law fetch failed:', e);
  }
  return { name: '日本国憲法', title: '第一条', sentence: '天皇は、日本国の象徴であり日本国民統合の象徴であつて、この地位は、主権の存する日本国民の総意に基く。' };
}

async function main() {
  try {
    console.log('Fetching dashboard data...');
    const weather = await fetchWeather();
    const air = await fetchAirQuality();
    const sunset = await fetchSunset();
    const law = await fetchLaw();

    // Get Moon Age
    const today = new Date();
    const base = new Date(2026, 0, 19, 4, 53, 0); // 2026-01-19 New Moon
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
      law
    };

    const outPath = path.join(process.cwd(), 'src', 'data', 'dashboard.json');
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(output, null, 2), 'utf-8');
    console.log('Successfully saved to', outPath);

  } catch (err) {
    console.error('Failed to fetch dashboard data:', err);
    process.exit(1); // Exit with error for GitHub Actions retry
  }
}

main();
