import Link from "next/link";
import { AdminShell, DataError, Notice } from "@/components/admin/shell";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/format";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}) {
  const q = await searchParams, { data, error } = await (await createClient()).from("books").select("*").order("updated_at",{ascending:false});
  return <AdminShell section="Books"><div className="admin-title"><h1>Books</h1><Link className="button button-coral" href="/admin/books/new">New book</Link></div><Notice searchParams={q}/>{error ? <DataError message={`Books could not be loaded (${error.message}).`} /> : data?.length ? <div className="cms-list">{data.map(book => <Link href={`/admin/books/${book.id}`} key={book.id}><strong>{book.title}</strong><span>{book.author} · {formatMoney(book.price_cents,book.currency)} · stock {book.stock_quantity ?? "—"}</span><small>{book.active ? "Active" : "Inactive"}{book.featured ? " · featured" : ""}</small></Link>)}</div> : <div className="empty-state"><h2>No books yet.</h2><p>Create a book to start the inventory.</p></div>}</AdminShell>;
}
