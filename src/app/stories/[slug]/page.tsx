import { StoryPage } from "@/components/pages";
export default async function StoryDetail({ params }: { params: Promise<{ slug: string }> }) { return <StoryPage slug={(await params).slug} />; }