import { ArticleListing } from "@/components/pages";
import { getArticlesByCategory } from "@/data/articles";
export const dynamic = "force-dynamic";
export default async function News() { return <ArticleListing title="What's happening" category="news" items={await getArticlesByCategory("news")} />; }