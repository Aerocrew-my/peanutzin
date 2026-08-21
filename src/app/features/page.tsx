import { ArticleListing } from "@/components/pages";
import { getArticlesByCategory } from "@/data/articles";
export const dynamic = "force-dynamic";
export default async function Features() { return <ArticleListing title="Good features" category="feature" items={await getArticlesByCategory("feature")} />; }