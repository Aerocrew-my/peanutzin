import { ArticleListing } from "@/components/pages";
import { getArticlesByCategory } from "@/data/articles";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Events", "Book fairs, readings and cultural happenings across Malaysia.", "/events");
export const dynamic = "force-dynamic";
export default async function Events() { return <ArticleListing title="Social events" category="event" items={await getArticlesByCategory("event")} />; }
