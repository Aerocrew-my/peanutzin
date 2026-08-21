import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";

export const metadata: Metadata = {
  title: { default: "PEANUTZIN | Book & Media", template: "%s | PEANUTZIN" },
  description: "A colourful Malaysian media publication for news, gossips, good reads and community.",
  openGraph: { title: "PEANUTZIN | Book & Media", description: "News, gossips and good reads.", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}
