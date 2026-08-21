export type ArticleCategory = "news" | "gossip" | "event" | "feature";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  image: string;
  publishedAt: string;
  featured?: boolean;
  trendingRank?: number;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  cover: string;
  description?: string;
  featured?: boolean;
}