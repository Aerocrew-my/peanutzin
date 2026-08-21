import { CheckoutView } from "@/components/cart/cart-pages";import{getActiveBooks}from"@/data/books";
export const dynamic="force-dynamic";export default async function Checkout(){return <CheckoutView books={await getActiveBooks()}/>}
