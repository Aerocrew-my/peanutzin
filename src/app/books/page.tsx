import { BooksPage } from "@/components/pages";
import { getActiveBooks } from "@/data/books";
export const dynamic = "force-dynamic";
export default async function Books() { return <BooksPage books={await getActiveBooks()} />; }