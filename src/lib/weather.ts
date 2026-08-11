// src/lib/weather.ts
import fallbackData from '@/data/dashboard.json';

export interface WeatherData {
  max: number;
  min: number;
  mornCond: string;
  noonCond: string;
  eveCond: string;
}

// WMO Weather interpretation codes (WW) を日本語表記およびアイコン絵文字付きで変換
function parseWmoCode(code: number): string {
  if (code === 0) return '快晴☀️';
  if (code === 1 || code === 2) return '晴れ☀️';
  if (code === 3) return '曇り☁️';
  if (code === 45 || code === 48) return '霧🌫️';
  if (code >= 51 && code <= 55) return '小雨🌦️';
  if ((code >= 56 && code <= 67) || (code >= 80 && code <= 82)) return '雨🌧️';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return '雪❄️';
  if (code >= 95 && code <= 99) return '雷雨🌩️';
  return '晴れ☀️';
}

/**
 * Cloudflare Workers Weather Proxy 経由で東京エリアの天気予報を取得する
 */
export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    const directUrl =
      'https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weathercode&timezone=Asia%2FTokyo';

    let response: Response;
    try {
      response = await fetch('/api/weather?type=forecast');
      if (!response.ok) response = await fetch(directUrl);
    } catch {
      response = await fetch(directUrl);
    }

    if (!response.ok) {
      throw new Error(`Weather API status: ${response.status}`);
    }

    const data = await response.json();

    // 本日の最高・最低気温
    const max = Math.round(data.daily?.temperature_2m_max?.[0] ?? fallbackData.weather.max);
    const min = Math.round(data.daily?.temperature_2m_min?.[0] ?? fallbackData.weather.min);

    // 時間帯別天気 (06:00, 12:00, 18:00)
    const hourlyCodes: number[] = data.hourly?.weathercode || [];
    const mornCode = hourlyCodes[6] ?? 0;
    const noonCode = hourlyCodes[12] ?? 0;
    const eveCode = hourlyCodes[18] ?? 0;

    return {
      max,
      min,
      mornCond: parseWmoCode(mornCode),
      noonCond: parseWmoCode(noonCode),
      eveCond: parseWmoCode(eveCode),
    };
  } catch (error) {
    console.warn('Open-Meteo APIの取得に失敗しました。フォールバックデータを使用します:', error);
    return {
      max: fallbackData.weather.max,
      min: fallbackData.weather.min,
      mornCond: fallbackData.weather.mornCond,
      noonCond: fallbackData.weather.noonCond,
      eveCond: fallbackData.weather.eveCond,
    };
  }
}
