import { HomePage } from "@/components/site";
import { getFeaturedArticles, getPublishedArticles, getTrendingArticles } from "@/data/articles";
import { getFeaturedBooks } from "@/data/books";
import { getSiteSettings } from "@/data/site-settings";

export const dynamic = "force-dynamic";

export default async function Home() {
	const [published, featured, trending, books, settings] = await Promise.all([getPublishedArticles(), getFeaturedArticles(), getTrendingArticles(), getFeaturedBooks(), getSiteSettings()]);
	const articles = [...featured, ...published.filter((article) => !featured.some((item) => item.id === article.id))];
	return <HomePage articles={articles.length ? articles : trending} books={books} announcement={typeof settings.announcement === "string" ? settings.announcement : undefined} />;
}