import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "PEANUTZIN | Book & Media", template: "%s | PEANUTZIN" },
  description: "A colourful Malaysian media publication for news, gossips, good reads and community.",
  openGraph: { title: "PEANUTZIN | Book & Media", description: "News, gossips and good reads.", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
