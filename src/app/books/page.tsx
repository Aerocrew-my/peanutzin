import { BooksPage } from "@/components/pages";
import { getActiveBooks } from "@/data/books";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Books We Love", "A carefully chosen shelf of books from PEANUTZIN.", "/books");
export const dynamic = "force-dynamic";
export default async function Books() { return <BooksPage books={await getActiveBooks()} />; }
