import type { Metadata } from "next";
import "./globals.css";
import "./phase10.css";
import "./phase10-navigation.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { DEFAULT_DESCRIPTION, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: "PEANUTZIN | Book & Media", template: "%s | PEANUTZIN" },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: "PEANUTZIN | Book & Media", description: DEFAULT_DESCRIPTION, url: "/", siteName: "PEANUTZIN", type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "PEANUTZIN | Book & Media", description: DEFAULT_DESCRIPTION, images: ["/opengraph-image"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}
