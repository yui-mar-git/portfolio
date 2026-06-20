const MICROCMS_API_KEY = import.meta.env.MICROCMS_API_KEY;
const MICROCMS_SERVICE_ID = import.meta.env.MICROCMS_SERVICE_ID;

export async function fetchMicroCMS<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`https://${MICROCMS_SERVICE_ID}.microcms.io/api/v1/${endpoint}`);
  
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url.toString(), {
    headers: {
      'X-MICROCMS-API-KEY': MICROCMS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`MicroCMS API error: ${response.statusText}`);
  }

  return response.json();
}
