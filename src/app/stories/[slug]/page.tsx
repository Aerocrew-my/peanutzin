import { StoryPage } from "@/components/pages";
import { getArticleBySlug } from "@/data/articles";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function StoryDetail({ params }: { params: Promise<{ slug: string }> }) { const article = await getArticleBySlug((await params).slug); if (!article) notFound(); return <StoryPage article={article} />; }