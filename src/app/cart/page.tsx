import { CartView } from "@/components/cart/cart-pages";import{getActiveBooks}from"@/data/books";
export const dynamic="force-dynamic";export default async function Cart(){return <CartView books={await getActiveBooks()}/>}
