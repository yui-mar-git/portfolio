import Parser from 'rss-parser';
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

const parser = new Parser();

export async function getArticles(): Promise<Article[]> {
  const articles: Article[] = [];

  // 1. 外部RSSの取得
  for (const feed of RSS_FEED_URLS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      parsed.items.forEach((item) => {
        if (item.title && item.link) {
          articles.push({
            id: item.guid || item.link,
            title: item.title,
            link: item.link,
            pubDate: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : '',
            source: feed.source,
            description: item.contentSnippet || item.summary || '',
          });
        }
      });
    } catch (e) {
      console.warn(`Failed to fetch RSS feed from ${feed.url}:`, e);
    }
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
