export type ArticleCategory = "news" | "gossip" | "event" | "feature";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  category: ArticleCategory;
  image: string;
  imageAlt?: string;
  publishedAt: string;
  featured?: boolean;
  trendingRank?: number;
  eventStartAt?: string;
  eventEndAt?: string;
  eventLocation?: string;
  sourceName?: string;
  sourceUrl?: string;
  eventUrl?: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  priceCents: number;
  currency: "MYR";
  cover: string;
  description?: string;
  featured?: boolean;
  stockQuantity?: number | null;
}
