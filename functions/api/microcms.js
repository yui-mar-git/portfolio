export async function onRequest(context) {
  const { request, env } = context;
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const limit = searchParams.get('limit') || '100';

  if (!endpoint) {
    return new Response(JSON.stringify({ error: 'Endpoint is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const microcmsApiKey = env.MICROCMS_API_KEY;
  const microcmsServiceId = env.MICROCMS_SERVICE_ID;

  if (!microcmsApiKey || !microcmsServiceId) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const microcmsUrl = `https://${microcmsServiceId}.microcms.io/api/v1/${endpoint}?limit=${limit}`;

  try {
    const response = await fetch(microcmsUrl, {
      headers: {
        'X-MICROCMS-API-KEY': microcmsApiKey
      }
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from MicroCMS' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
