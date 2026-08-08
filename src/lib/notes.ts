import { fetchMicroCMS } from './microcms';
import type { MicroCMSListResponse } from '@/types/microcms';

export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: 'Zenn' | 'Qiita' | 'note' | 'Hatena' | 'microCMS' | 'Blog';
  description?: string;
  thumbnail?: string;
}

export interface TechArticle {
  title: string;
  url: string;
  date: string;
  source: 'Qiita' | 'Zenn' | 'note';
}

const QIITA_USER_ID = 'yui-mar';
const ZENN_USER_ID = 'yui_mar';
const NOTE_USER_ID = 'yui_mar';

async function fetchQiitaArticles(): Promise<TechArticle[]> {
  try {
    const res = await fetch(`https://qiita.com/api/v2/users/${QIITA_USER_ID}/items?per_page=5`, {
      headers: {
        'User-Agent': 'AstroPortfolioApp/1.0',
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      title: item.title || '',
      url: item.url || '',
      date: item.created_at ? item.created_at.split('T')[0] : '',
      source: 'Qiita' as const,
    }));
  } catch (e) {
    console.warn('Failed to fetch Qiita articles:', e);
    return [];
  }
}

async function parseRssFeed(url: string, source: 'Zenn' | 'note'): Promise<TechArticle[]> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'AstroPortfolioApp/1.0',
      },
    });
    if (!res.ok) return [];
    const text = await res.text();
    const items: TechArticle[] = [];
    const matches = text.matchAll(/<item>([\s\S]*?)<\/item>|<entry>([\s\S]*?)<\/entry>/gi);

    for (const match of matches) {
      const block = match[1] || match[2];
      const titleMatch = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const linkMatch = block.match(
        /<link[^>]*href="([^"]+)"|<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i,
      );
      const dateMatch = block.match(
        /<pubDate>([\s\S]*?)<\/pubDate>|<published>([\s\S]*?)<\/published>|<updated>([\s\S]*?)<\/updated>/i,
      );

      const title = titleMatch ? titleMatch[1].trim() : '';
      const link = linkMatch ? (linkMatch[1] || linkMatch[2] || '').trim() : '';
      const dateRaw = dateMatch ? (dateMatch[1] || dateMatch[2] || dateMatch[3] || '').trim() : '';

      if (title && link) {
        let dateStr = '';
        if (dateRaw) {
          try {
            dateStr = new Date(dateRaw).toISOString().split('T')[0];
          } catch {
            dateStr = dateRaw;
          }
        }

        items.push({
          title,
          url: link,
          date: dateStr,
          source,
        });
      }
    }
    return items;
  } catch (e) {
    console.warn(`Failed to fetch RSS feed from ${url}:`, e);
    return [];
  }
}

async function parseRssFeedWithFallback(
  primaryId: string,
  secondaryId: string,
  baseUrl: string,
  pathSuffix: string,
  source: 'Zenn' | 'note',
): Promise<TechArticle[]> {
  let items = await parseRssFeed(`${baseUrl}/${primaryId}/${pathSuffix}`, source);
  if (items.length === 0 && primaryId !== secondaryId) {
    items = await parseRssFeed(`${baseUrl}/${secondaryId}/${pathSuffix}`, source);
  }
  return items;
}

export async function getTechArticles(limit: number = 6): Promise<TechArticle[]> {
  try {
    const [qiitaArticles, zennArticles, noteArticles] = await Promise.all([
      fetchQiitaArticles(),
      parseRssFeedWithFallback(ZENN_USER_ID, 'yui-mar', 'https://zenn.dev', 'feed', 'Zenn'),
      parseRssFeedWithFallback(NOTE_USER_ID, 'yui-mar', 'https://note.com', 'rss', 'note'),
    ]);

    const combined = [...qiitaArticles, ...zennArticles, ...noteArticles];
    combined.sort((a, b) => (a.date < b.date ? 1 : -1));

    return combined.slice(0, limit);
  } catch (e) {
    console.error('Failed to get tech articles:', e);
    return [];
  }
}

// 登録したい外部RSSフィードのURLリスト（旧互換用）
export const RSS_FEED_URLS: { url: string; source: Article['source'] }[] = [
  { url: `https://zenn.dev/${ZENN_USER_ID}/feed`, source: 'Zenn' },
  { url: `https://note.com/${NOTE_USER_ID}/rss`, source: 'note' },
];

async function fetchRssFeedLegacy(feedUrl: string, source: Article['source']): Promise<Article[]> {
  const items: Article[] = [];
  try {
    const res = await fetch(feedUrl);
    if (!res.ok) return items;
    const text = await res.text();
    const matches = text.matchAll(/<item>([\s\S]*?)<\/item>|<entry>([\s\S]*?)<\/entry>/gi);
    for (const match of matches) {
      const block = match[1] || match[2];
      const titleMatch = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const linkMatch = block.match(
        /<link[^>]*href="([^"]+)"|<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i,
      );
      const dateMatch = block.match(
        /<pubDate>([\s\S]*?)<\/pubDate>|<published>([\s\S]*?)<\/published>|<updated>([\s\S]*?)<\/updated>/i,
      );
      const descMatch = block.match(
        /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>|<summary>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i,
      );

      const title = titleMatch ? titleMatch[1].trim() : '';
      const link = linkMatch ? (linkMatch[1] || linkMatch[2] || '').trim() : '';
      const dateRaw = dateMatch ? (dateMatch[1] || dateMatch[2] || dateMatch[3] || '').trim() : '';
      const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

      if (title && link) {
        items.push({
          id: link,
          title,
          link,
          pubDate: dateRaw ? new Date(dateRaw).toISOString().split('T')[0] : '',
          source,
          description: description.slice(0, 120),
        });
      }
    }
  } catch (e) {
    console.warn(`Failed to fetch RSS feed from ${feedUrl}:`, e);
  }
  return items;
}

export async function getArticles(): Promise<Article[]> {
  const articles: Article[] = [];

  // Qiita API
  const qiitaTech = await fetchQiitaArticles();
  qiitaTech.forEach((q) => {
    articles.push({
      id: q.url,
      title: q.title,
      link: q.url,
      pubDate: q.date,
      source: 'Qiita',
    });
  });

  // 外部RSS
  for (const feed of RSS_FEED_URLS) {
    const fetched = await fetchRssFeedLegacy(feed.url, feed.source);
    articles.push(...fetched);
  }

  // microCMS からの取得
  try {
    const cmsRes = await fetchMicroCMS<MicroCMSListResponse<MicroCMSNote>>('notes', {
      limit: '100',
    });
    if (cmsRes && cmsRes.contents) {
      cmsRes.contents.forEach((item) => {
        articles.push({
          id: item.id,
          title: item.title,
          link: item.url || `/notes/${item.id}`,
          pubDate: (item.publishedAt || item.createdAt).split('T')[0],
          source: 'microCMS',
          description: item.description || '',
        });
      });
    }
  } catch {
    // microCMS 未作成時は安全にスルー
  }

  return articles.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));
}
