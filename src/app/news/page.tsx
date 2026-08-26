import { ArticleListing } from "@/components/pages";
import { getArticlesByCategory } from "@/data/articles";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("News", "Fresh Malaysian publishing, culture and community news from PEANUTZIN.", "/news");
export const dynamic = "force-dynamic";
export default async function News() { return <ArticleListing title="What's happening" category="news" items={await getArticlesByCategory("news")} />; }
