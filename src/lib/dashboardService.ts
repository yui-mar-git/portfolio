// src/lib/dashboardService.ts
import { getCalendarInfo, getJstDate } from '@/lib/dashboard';
import fallbackData from '@/data/dashboard.json';

export interface FullDashboardData {
  // Layer A: 100%保証データ
  dateStr: string;
  zodiac: string;
  kanshi: string;
  rokuyo: string;
  nijushisekki: string;
  shichijuniko: string;

  // Layer B: 外部連携データ
  weather: {
    max: number;
    min: number;
    mornCond: string;
    noonCond: string;
    eveCond: string;
    uvIndex: number;
    uvLabel: string;
  };
  warning: {
    title: string;
    status: string;
    isAlert: boolean;
  };
  air: {
    pm25: number;
    pm25Label: string;
    pollenLabel: string;
  };
  sunset: string;
  moonStr: string;
  law: {
    name: string;
    title: string;
    sentence: string;
  };
}

// WMOコード変換 (アイコン絵文字付き)
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

// UV インデックス ラベル判定
function getUvLabel(uv: number): string {
  if (uv < 3) return '弱い';
  if (uv < 6) return '中程度';
  if (uv < 8) return '強い';
  if (uv < 11) return '非常に強い';
  return '極端に強い';
}

// PM2.5 レベル判定 (元データと同じ日本語表記)
function getPm25Label(pm25: number): string {
  if (pm25 <= 12.0) return '良い';
  if (pm25 <= 35.4) return '普通';
  if (pm25 <= 55.4) return 'やや高い';
  return '高い';
}

/**
 * 気象庁 (JMA) 防災情報 API から東京都の最新警報・注意報を取得
 */
async function fetchJmaWarnings(): Promise<{ title: string; status: string; isAlert: boolean }> {
  try {
    const res = await fetch('https://www.jma.go.jp/bosai/warning/data/warning/130000.json');
    if (!res.ok) throw new Error(`JMA API status: ${res.status}`);
    const data = await res.json();

    const warnings: string[] = [];
    let isAlert = false;

    if (Array.isArray(data)) {
      for (const area of data) {
        if (area.areaTypes) {
          for (const type of area.areaTypes) {
            if (type.areas) {
              for (const a of type.areas) {
                if (a.warnings) {
                  for (const w of a.warnings) {
                    if (w.status === '発表' || w.status === '継続') {
                      if (w.name) {
                        warnings.push(w.name);
                        if (w.name.includes('警報') || w.name.includes('特別警報')) {
                          isAlert = true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    const uniqueWarnings = Array.from(new Set(warnings));
    if (uniqueWarnings.length > 0) {
      return {
        title: '気象警報・注意報',
        status: uniqueWarnings.slice(0, 3).join('・'),
        isAlert,
      };
    }

    return {
      title: '気象警報・注意報',
      status: 'なし',
      isAlert: false,
    };
  } catch (err) {
    console.warn('気象庁APIの取得に失敗しました:', err);
    return {
      title: '気象警報・注意報',
      status: 'なし',
      isAlert: false,
    };
  }
}

/**
 * Cloudflare Workers Weather Proxy 経由で大気質 (PM2.5)・花粉情報を取得
 */
async function fetchAirQuality(): Promise<{ pm25: number; pm25Label: string; pollenLabel: string }> {
  try {
    const directUrl =
      'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=35.6895&longitude=139.6917&current=pm2_5,alder_pollen,birch_pollen,grass_pollen';
    // プロキシ優先、失敗時はダイレクト通信
    let res: Response;
    try {
      res = await fetch('/api/weather?type=air');
      if (!res.ok) res = await fetch(directUrl);
    } catch {
      res = await fetch(directUrl);
    }

    if (!res.ok) throw new Error(`Air Quality API status: ${res.status}`);
    const data = await res.json();

    const pm25 = Math.round((data.current?.pm2_5 ?? fallbackData.air.pm25) * 10) / 10;
    const alder = data.current?.alder_pollen ?? 0;
    const birch = data.current?.birch_pollen ?? 0;
    const grass = data.current?.grass_pollen ?? 0;
    const totalPollen = alder + birch + grass;
    const pollenLabel = totalPollen > 10 ? 'やや多い' : 'なし';

    return {
      pm25,
      pm25Label: getPm25Label(pm25),
      pollenLabel,
    };
  } catch (err) {
    console.warn('Air Quality APIの取得に失敗しました:', err);
    return {
      pm25: fallbackData.air.pm25,
      pm25Label: fallbackData.air.pm25Label,
      pollenLabel: fallbackData.air.pollenLabel,
    };
  }
}

/**
 * Cloudflare Workers Weather Proxy 経由で天気予報・気温・UVインデックス・日没時刻を取得
 */
async function fetchWeatherDetails() {
  try {
    const directUrl =
      'https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max,sunset&hourly=weathercode&timezone=Asia%2FTokyo';
    let res: Response;
    try {
      res = await fetch('/api/weather?type=forecast');
      if (!res.ok) res = await fetch(directUrl);
    } catch {
      res = await fetch(directUrl);
    }

    if (!res.ok) throw new Error(`Weather API status: ${res.status}`);
    const data = await res.json();

    const max = Math.round(data.daily?.temperature_2m_max?.[0] ?? fallbackData.weather.max);
    const min = Math.round(data.daily?.temperature_2m_min?.[0] ?? fallbackData.weather.min);
    const rawUv = data.daily?.uv_index_max?.[0] ?? fallbackData.weather.uvIndex;
    const uvIndex = Math.round(rawUv * 100) / 100;

    const hourlyCodes: number[] = data.hourly?.weathercode || [];
    const mornCode = hourlyCodes[6] ?? 0;
    const noonCode = hourlyCodes[12] ?? 0;
    const eveCode = hourlyCodes[18] ?? 0;

    let sunset = fallbackData.sunset;
    const sunsetRaw = data.daily?.sunset?.[0];
    if (sunsetRaw && typeof sunsetRaw === 'string') {
      const parts = sunsetRaw.split('T');
      if (parts[1]) {
        sunset = parts[1].substring(0, 5);
      }
    }

    return {
      max,
      min,
      mornCond: parseWmoCode(mornCode),
      noonCond: parseWmoCode(noonCode),
      eveCond: parseWmoCode(eveCode),
      uvIndex,
      uvLabel: getUvLabel(uvIndex),
      sunset,
    };
  } catch (err) {
    console.warn('Weather APIの取得に失敗しました:', err);
    return {
      max: fallbackData.weather.max,
      min: fallbackData.weather.min,
      mornCond: fallbackData.weather.mornCond,
      noonCond: fallbackData.weather.noonCond,
      eveCond: fallbackData.weather.eveCond,
      uvIndex: fallbackData.weather.uvIndex,
      uvLabel: fallbackData.weather.uvLabel,
      sunset: fallbackData.sunset,
    };
  }
}

/**
 * 2層構造ダッシュボード統合データ取得関数
 */
export async function getFullDashboardData(): Promise<FullDashboardData> {
  const jstNow = getJstDate();
  const cal = getCalendarInfo(jstNow);
  const todayKey = jstNow.toISOString().split('T')[0];

  let layerBData: {
    weather: FullDashboardData['weather'];
    warning: FullDashboardData['warning'];
    air: FullDashboardData['air'];
    sunset: string;
  } | null = null;

  // キャッシュキーを v3 に更新し、undefined 防御を追加
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const cachedStr = localStorage.getItem('dashboard_layer_b_cache_v3');
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (
          cached &&
          cached.dateKey === todayKey &&
          cached.data?.weather?.uvIndex !== undefined &&
          cached.data?.air?.pollenLabel !== undefined
        ) {
          layerBData = cached.data;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (!layerBData) {
    const [weatherRes, warningRes, airRes] = await Promise.all([
      fetchWeatherDetails(),
      fetchJmaWarnings(),
      fetchAirQuality(),
    ]);

    layerBData = {
      weather: {
        max: weatherRes.max,
        min: weatherRes.min,
        mornCond: weatherRes.mornCond,
        noonCond: weatherRes.noonCond,
        eveCond: weatherRes.eveCond,
        uvIndex: weatherRes.uvIndex ?? fallbackData.weather.uvIndex,
        uvLabel: weatherRes.uvLabel ?? fallbackData.weather.uvLabel,
      },
      warning: warningRes,
      air: {
        pm25: airRes.pm25 ?? fallbackData.air.pm25,
        pm25Label: airRes.pm25Label ?? fallbackData.air.pm25Label,
        pollenLabel: airRes.pollenLabel ?? fallbackData.air.pollenLabel,
      },
      sunset: weatherRes.sunset,
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(
          'dashboard_layer_b_cache_v3',
          JSON.stringify({ dateKey: todayKey, data: layerBData })
        );
      } catch (e) {
        // ignore
      }
    }
  }

  return {
    dateStr: cal.dateStr,
    zodiac: cal.zodiac,
    kanshi: cal.kanshi,
    rokuyo: cal.rokuyo,
    nijushisekki: cal.nijushisekki,
    shichijuniko: cal.shichijuniko,
    weather: {
      max: layerBData.weather?.max ?? fallbackData.weather.max,
      min: layerBData.weather?.min ?? fallbackData.weather.min,
      mornCond: layerBData.weather?.mornCond ?? fallbackData.weather.mornCond,
      noonCond: layerBData.weather?.noonCond ?? fallbackData.weather.noonCond,
      eveCond: layerBData.weather?.eveCond ?? fallbackData.weather.eveCond,
      uvIndex: layerBData.weather?.uvIndex ?? fallbackData.weather.uvIndex,
      uvLabel: layerBData.weather?.uvLabel ?? fallbackData.weather.uvLabel,
    },
    warning: layerBData.warning,
    air: {
      pm25: layerBData.air?.pm25 ?? fallbackData.air.pm25,
      pm25Label: layerBData.air?.pm25Label ?? fallbackData.air.pm25Label,
      pollenLabel: layerBData.air?.pollenLabel ?? fallbackData.air.pollenLabel,
    },
    sunset: layerBData.sunset ?? fallbackData.sunset,
    moonStr: fallbackData.moonStr,
    law: fallbackData.law,
  };
}
