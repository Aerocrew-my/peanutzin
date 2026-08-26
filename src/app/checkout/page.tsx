import { CheckoutView } from "@/components/cart/cart-pages";import{getActiveBooks}from"@/data/books";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };
export const dynamic="force-dynamic";export default async function Checkout(){return <CheckoutView books={await getActiveBooks()}/>}
