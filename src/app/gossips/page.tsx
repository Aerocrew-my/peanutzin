import { ArticleListing } from "@/components/pages";
import { getArticlesByCategory } from "@/data/articles";
export const dynamic = "force-dynamic";
export default async function Gossips() { return <ArticleListing title="Book gossips" category="gossip" items={await getArticlesByCategory("gossip")} />; }