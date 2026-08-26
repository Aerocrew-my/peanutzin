import { CartView } from "@/components/cart/cart-pages";import{getActiveBooks}from"@/data/books";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Your Cart", robots: { index: false, follow: false } };
export const dynamic="force-dynamic";export default async function Cart(){return <CartView books={await getActiveBooks()}/>}
