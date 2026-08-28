import { BooksPage } from "@/components/pages";
import { getActiveBooks } from "@/data/books";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Discover Books and New Voices", "A curated Malaysian shelf of PEANUTZIN editions, independent publishers, emerging authors and eBooks.", "/books");
export const revalidate = 900;
export default async function Books() { return <BooksPage books={await getActiveBooks()} />; }
