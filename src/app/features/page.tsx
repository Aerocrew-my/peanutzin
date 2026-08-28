import { ArticleListing } from "@/components/pages";
import { getArticlesByCategory } from "@/data/articles";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Features", "People, books and ideas explored with an independent Malaysian point of view.", "/features");
export const revalidate = 900;
export default async function Features() { return <ArticleListing title="Good features" category="feature" items={await getArticlesByCategory("feature")} />; }
