import { ArticleListing } from "@/components/pages";
import { getArticlesByCategory } from "@/data/articles";
export const dynamic = "force-dynamic";
export default async function Events() { return <ArticleListing title="Social events" category="event" items={await getArticlesByCategory("event")} />; }