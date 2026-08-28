import { ArticleListing } from "@/components/pages";
import { getArticlesByCategory } from "@/data/articles";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Book Gossips", "Conversations, recommendations and talk from Malaysia's lively book community.", "/gossips");
export const revalidate = 900;
export default async function Gossips() { return <ArticleListing title="Book gossips" category="gossip" items={await getArticlesByCategory("gossip")} />; }
