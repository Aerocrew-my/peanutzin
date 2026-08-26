import { StoryPage } from "@/components/pages";
import { getArticleBySlug } from "@/data/articles";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params, article = await getArticleBySlug(slug);
  if (!article) return {};
  const url = new URL(`/stories/${slug}`, SITE_URL).toString();
  const images = article.image.startsWith("http") ? [{ url: article.image, alt: article.imageAlt ?? article.title }] : ["/opengraph-image"];
  return { title: article.title, description: article.excerpt, alternates: { canonical: url }, openGraph: { title: article.title, description: article.excerpt, url, type: "article", images, publishedTime: article.publishedAtIso, modifiedTime: article.modifiedAtIso, section: article.category }, twitter: { card: "summary_large_image", title: article.title, description: article.excerpt, images: images.map((image) => typeof image === "string" ? image : image.url) } };
}
export default async function StoryDetail({ params }: Props) {
  const { slug } = await params, article = await getArticleBySlug(slug); if (!article) notFound();
  const url = new URL(`/stories/${slug}`, SITE_URL).toString();
  const schema = article.category === "event" && article.eventStartAt ? { "@context": "https://schema.org", "@type": "Event", name: article.title, description: article.excerpt, startDate: article.eventStartAt, endDate: article.eventEndAt, location: article.eventLocation ? { "@type": "Place", name: article.eventLocation } : undefined, url, image: article.image.startsWith("http") ? article.image : undefined } : { "@context": "https://schema.org", "@type": article.category === "news" ? "NewsArticle" : "Article", headline: article.title, description: article.excerpt, image: article.image.startsWith("http") ? [article.image] : undefined, datePublished: article.publishedAtIso, dateModified: article.modifiedAtIso ?? article.publishedAtIso, mainEntityOfPage: url, publisher: { "@type": "Organization", name: "PEANUTZIN", url: SITE_URL.origin } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><StoryPage article={article} /></>;
}
