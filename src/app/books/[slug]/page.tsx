import { BookPage } from "@/components/pages";
import { getBookBySlug } from "@/data/books";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
export const revalidate = 900;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params, book = await getBookBySlug(slug); if (!book) return {}; const description = book.description ?? `${book.title} by ${book.author}, from the PEANUTZIN shelf.`; const url = new URL(`/books/${slug}`, SITE_URL).toString(), images = book.cover.startsWith("http") ? [book.cover] : ["/opengraph-image"]; return { title: book.title, description, alternates: { canonical: url }, openGraph: { title: book.title, description, url, type: "book", images }, twitter: { card: "summary_large_image", title: book.title, description, images } }; }
export default async function BookDetail({ params }: Props) { const { slug } = await params, book = await getBookBySlug(slug); if (!book) notFound(); const schema = { "@context": "https://schema.org", "@type": "Book", name: book.title, author: { "@type": "Person", name: book.author }, description: book.description, image: book.cover.startsWith("http") ? book.cover : undefined, url: new URL(`/books/${slug}`, SITE_URL).toString() }; return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><BookPage book={book} /></>; }
