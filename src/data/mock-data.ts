import type { Article, Book } from "@/types/content";

export const articles: Article[] = [
  { id: "a1", slug: "klibf-returns-with-a-bigger-reading-party", title: "KL International Book Fair returns with a bigger reading party", excerpt: "The annual celebration of stories, writers and curious readers is back in full colour.", category: "event", image: "coral", publishedAt: "21 Aug 2026", featured: true, trendingRank: 1 },
  { id: "a2", slug: "booktok-malaysia-is-making-room-for-local-voices", title: "BookTok Malaysia is making room for local voices", excerpt: "A new wave of reviewers is turning the page on what gets talked about online.", category: "gossip", image: "teal", publishedAt: "19 Aug 2026", trendingRank: 2 },
  { id: "a3", slug: "the-independent-publishers-changing-the-shelf", title: "The independent publishers changing the shelf", excerpt: "Meet the small teams putting brave, beautiful books into Malaysian hands.", category: "feature", image: "yellow", publishedAt: "17 Aug 2026", trendingRank: 3 },
  { id: "a4", slug: "five-ways-to-find-your-next-community", title: "Five ways to find your next reading community", excerpt: "From quiet clubs to loud launches, there is a room for every kind of reader.", category: "news", image: "blue", publishedAt: "15 Aug 2026", trendingRank: 4 },
  { id: "a5", slug: "what-authors-are-reading-this-month", title: "What Malaysian authors are reading this month", excerpt: "We asked the people behind the pages to share their current favourites.", category: "gossip", image: "pink", publishedAt: "12 Aug 2026" },
];

export const books: Book[] = [
  { id: "b1", slug: "putera-cilik", title: "Putera Cilik", author: "A. Samad Said", priceCents: 3200, currency: "MYR", cover: "coral", featured: true, description: "A small story with a wonderfully large heart." },
  { id: "b2", slug: "laut-bercerita", title: "Laut Bercerita", author: "Leila S. Chudori", priceCents: 5800, currency: "MYR", cover: "teal", featured: true, description: "A moving novel about memory, friendship and the sea." },
  { id: "b3", slug: "memori-seorang-geisha", title: "Memori Seorang Geisha", author: "Arthur Golden", priceCents: 4500, currency: "MYR", cover: "yellow", featured: true, description: "A sweeping story of a life shaped by art and resilience." },
  { id: "b4", slug: "the-art-of-rest", title: "The Art of Rest", author: "Claudia Hammond", priceCents: 4900, currency: "MYR", cover: "blue" },
];

export const navItems = [
  { label: "News", href: "/news" }, { label: "Gossips", href: "/gossips" },
  { label: "Events", href: "/events" }, { label: "Features", href: "/features" },
  { label: "Books", href: "/books" }, { label: "About", href: "/about" },
];

export const categoryLabel = { news: "News", gossip: "Gossips", event: "Events", feature: "Features" } as const;