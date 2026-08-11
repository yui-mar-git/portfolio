import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Cloudflare Workers (Pages Functions) 上で動作する Weather API プロキシ
 * 外部の Open-Meteo API を安全に中継し、キャッシュ・レスポンスヘッダーを付与して返却する
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'forecast';

    let targetUrl = '';
    if (type === 'air') {
      targetUrl =
        'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=35.6895&longitude=139.6917&current=pm2_5,alder_pollen,birch_pollen,grass_pollen';
    } else if (type === 'jma') {
      targetUrl = 'https://www.jma.go.jp/bosai/warning/data/warning/130000.json';
    } else {
      targetUrl =
        'https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max,sunset&hourly=weathercode&timezone=Asia%2FTokyo';
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Portfolio-WeatherProxy/1.0',
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream API returned status ${response.status}` }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
      );
    }

    const data = await response.json();

    // 1時間 (3600秒) のエッジキャッシュを指示するレスポンスヘッダーを付与
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Weather Proxy Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch weather proxy data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
};
