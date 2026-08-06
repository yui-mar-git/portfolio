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

// 登録したい外部RSSフィードのURLリスト（将来的にZenn/Qiita/note/Hatena等を開設した際にURLを追加）
export const RSS_FEED_URLS: { url: string; source: Article['source'] }[] = [
  // 例: { url: 'https://zenn.dev/your_username/feed', source: 'Zenn' },
  // 例: { url: 'https://qiita.com/your_username/feed.atom', source: 'Qiita' },
  // 例: { url: 'https://note.com/your_username/rss', source: 'note' },
  // 例: { url: 'https://your_blog.hatenablog.com/rss', source: 'Hatena' },
];

interface MicroCMSNote {
  id: string;
  title: string;
  url?: string;
  content?: string;
  description?: string;
  publishedAt?: string;
  createdAt: string;
}

async function fetchRssFeed(feedUrl: string, source: Article['source']): Promise<Article[]> {
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
      const dateRaw = dateMatch
        ? (dateMatch[1] || dateMatch[2] || dateMatch[3] || '').trim()
        : '';
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

  // 1. 外部RSSの取得
  for (const feed of RSS_FEED_URLS) {
    const fetched = await fetchRssFeed(feed.url, feed.source);
    articles.push(...fetched);
  }

  // 2. microCMS からの取得 (notes エンドポイントが存在する場合)
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
    // microCMS エンドポイントが未作成の場合は安全に無視
  }

  // 日付の降順（新しい順）でソート
  return articles.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));
}
