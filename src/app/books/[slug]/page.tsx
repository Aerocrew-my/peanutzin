import { BookPage } from "@/components/pages";
export default async function BookDetail({ params }: { params: Promise<{ slug: string }> }) { return <BookPage slug={(await params).slug} />; }