import { HomePage } from "@/components/site";
import { getPublishedArticles } from "@/data/articles";
import { getActiveBooks } from "@/data/books";
import { getSiteSettings } from "@/data/site-settings";

export const revalidate = 900;

export default async function Home() {
	const [published, activeBooks, settings] = await Promise.all([getPublishedArticles(), getActiveBooks(), getSiteSettings()]);
	const featured = published.filter((article) => article.featured);
	const trending = published.filter((article) => article.trendingRank).sort((a, b) => (a.trendingRank ?? 0) - (b.trendingRank ?? 0));
	const books = activeBooks.filter((book) => book.featured);
	const articles = [...featured, ...published.filter((article) => !featured.some((item) => item.id === article.id))];
	return <HomePage articles={articles.length ? articles : trending} books={books} announcement={typeof settings.announcement === "string" ? settings.announcement : undefined} />;
}
