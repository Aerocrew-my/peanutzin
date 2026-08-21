import { BookPage } from "@/components/pages";
import { getBookBySlug } from "@/data/books";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function BookDetail({ params }: { params: Promise<{ slug: string }> }) { const book = await getBookBySlug((await params).slug); if (!book) notFound(); return <BookPage book={book} />; }