"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Article, Book } from "@/types/content";
import { categoryLabel, navItems } from "@/data/mock-data";
import { formatMoney } from "@/lib/format";

export function Mark({ tone = "coral" }: { tone?: string }) {
  return <span className={`art-mark art-${tone}`} aria-hidden="true"><i /><b /></span>;
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("peanutzin-theme");
    const next = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("peanutzin-theme", next ? "dark" : "light");
  }
  return <button className="icon-button" onClick={toggle} aria-label={`Switch to ${dark ? "light" : "dark"} theme`}>{dark ? "sun" : "moon"}</button>;
}

export function SearchBox({ open, onClose, articles, books }: { open: boolean; onClose: () => void; articles: Article[]; books: Book[] }) {
  const [query, setQuery] = useState("");
  const results = [...articles, ...books].filter((item) => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  if (!open) return null;
  return <div className="search-layer" role="dialog" aria-modal="true" aria-label="Search PEANUTZIN"><div className="search-box"><button className="close-button" onClick={onClose} aria-label="Close search">close</button><p className="eyebrow">Find a good read</p><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories and books" />{query && <div className="search-results">{results.length ? results.map((item) => <Link key={item.id} href={"author" in item ? `/books/${item.slug}` : `/stories/${item.slug}`} onClick={onClose}>{item.title}<span>{"author" in item ? item.author : categoryLabel[item.category]}</span></Link>) : <p>No matches yet. Try another word.</p>}</div>}</div></div>;
}

export function Header({ articles = [], books = [], announcement = "KL International Book Fair 2026 · Hall 4, Booth 123" }: { articles?: Article[]; books?: Book[]; announcement?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState(true);
  useEffect(() => { if (localStorage.getItem("peanutzin-notice") === "hidden") document.documentElement.classList.add("notice-dismissed"); }, []);
  function dismiss() { setNotice(false); document.documentElement.classList.add("notice-dismissed"); localStorage.setItem("peanutzin-notice", "hidden"); }
  return <><div className={`announcement ${notice ? "" : "is-hidden"}`}><span>{announcement}</span><Link href="/events">See what&apos;s on</Link><button onClick={dismiss} aria-label="Dismiss announcement">close</button></div><header className="site-header"><div className="mobile-row"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">menu</button><Link className="wordmark" href="/">PEANUTZIN<small>BOOK &amp; MEDIA | SIMPLE MINIMAL</small></Link><button className="menu-button" onClick={() => setSearchOpen(true)} aria-label="Open search">search</button><Link className="menu-button" href="/cart" aria-label="Cart">cart</Link></div><div className="header-inner"><Link className="wordmark" href="/">PEANUTZIN<small>BOOK &amp; MEDIA | SIMPLE MINIMAL</small></Link><nav aria-label="Primary navigation">{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><div className="header-tools"><button className="text-button" onClick={() => setSearchOpen(true)}>search</button><Link className="text-button accent" href="/contact">Subscribe</Link><Link className="text-button" href="/cart">cart</Link><ThemeToggle /></div></div></header><SearchBox articles={articles} books={books} open={searchOpen} onClose={() => setSearchOpen(false)} /><div className={`mobile-drawer ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}><div className="drawer-head"><span className="eyebrow">Menu</span><button className="close-button" onClick={() => setMenuOpen(false)} aria-label="Close menu">close</button></div>{navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}<Link href="/contact" onClick={() => setMenuOpen(false)}>Subscribe</Link><ThemeToggle /></div></>;
}

export function ArticleCard({ article, lead = false }: { article: Article; lead?: boolean }) {
  return <Link className={`article-card ${lead ? "lead" : ""}`} href={`/stories/${article.slug}`}><Mark tone={article.image} /><div className="card-copy"><span className="eyebrow">{categoryLabel[article.category]}</span><h3>{article.title}</h3><p>{article.excerpt}</p><time>{article.publishedAt}</time></div></Link>;
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  function submit(event: React.FormEvent) { event.preventDefault(); if (/^\S+@\S+\.\S+$/.test(email)) setSent(true); }
  return <section className="newsletter"><div><p className="eyebrow">The good stuff, occasionally</p><h2>Let&apos;s stay in touch!</h2><p>Get the latest stories, events and book recommendations straight to your inbox.</p></div>{sent ? <p className="success-message">You&apos;re on the list. See you in your inbox.</p> : <form onSubmit={submit}><label htmlFor="email">Email address</label><div><input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /><button className="button button-dark">Subscribe</button></div></form>}</section>;
}

export function Footer() { return <footer><div className="footer-main"><div><Link className="wordmark" href="/">PEANUTZIN<small>BOOK &amp; MEDIA | SIMPLE MINIMAL</small></Link><p>Independent publishing and cultural media from Malaysia.</p></div><div><h3>Explore</h3>{navItems.slice(0, 5).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div><div><h3>About Us</h3>{["Our Story", "Team", "Submissions", "Careers", "Contact"].map((item) => <Link key={item} href={item === "Contact" ? "/contact" : "/about"}>{item}</Link>)}</div><div><h3>Support</h3>{["FAQ", "Shipping & Returns", "Terms of Service", "Privacy Policy"].map((item) => <Link key={item} href="/about">{item}</Link>)}</div></div><div className="footer-bottom"><span>© 2026 PEANUTZIN</span><span>Made with care in Malaysia · Instagram · TikTok</span></div></footer>; }

export function HomePage({ articles, books, announcement }: { articles: Article[]; books: Book[]; announcement?: string }) {
  return <><Header articles={articles} books={books} announcement={announcement} /><main><section className="hero container"><div className="hero-copy"><p className="eyebrow">#jompeanutzin</p><h1>News, gossips<br />and good reads.</h1><p className="hero-intro">Your daily dose of stories, social events, book picks and everything happening in Malaysia and beyond.</p><div className="button-row"><Link className="button button-coral" href="/news">Read the latest</Link><Link className="button button-outline" href="/books">Explore books</Link></div></div><div className="hero-art"><Mark tone="coral" /><span>stories<br />worth<br />sharing</span><em>new!</em></div></section><section className="pillars container">{[["01", "Fresh News", "What's happening", "teal"], ["02", "Book Gossips", "What people are saying", "coral"], ["03", "Social Events", "Join the fun", "yellow"], ["04", "Good Reads", "Books we love", "blue"]].map(([number, title, subtitle, tone]) => <div className={`pillar ${tone}`} key={title}><span>{number}</span><div><h3>{title}</h3><p>{subtitle}</p></div></div>)}</section><section className="section container"><div className="section-heading"><div><p className="eyebrow">Fresh from the peanut gallery</p><h2>What&apos;s Happening</h2></div><Link href="/news">View all news <span aria-hidden="true">-&gt;</span></Link></div><div className="article-grid">{articles.slice(0, 4).map((article, index) => <ArticleCard article={article} lead={index === 0} key={article.id} />)}</div></section><section className="split-section container"><div className="trending"><div className="section-heading"><h2>Trending Now</h2><span className="eyebrow">Right this minute</span></div>{articles.filter((article) => article.trendingRank).map((article) => <Link className="trend-item" key={article.id} href={`/stories/${article.slug}`}><strong>{String(article.trendingRank).padStart(2, "0")}</strong><Mark tone={article.image} /><span><b>{article.title}</b><small>{article.publishedAt}</small></span></Link>)}</div><div className="books-preview"><div className="section-heading"><h2>Books we love</h2><Link href="/books">Shop the shelf -&gt;</Link></div><div className="book-grid">{books.slice(0, 3).map((book) => <Link className="book-card" href={`/books/${book.slug}`} key={book.id}><Mark tone={book.cover} /><h3>{book.title}</h3><p>{book.author}</p><strong>{formatMoney(book.priceCents, book.currency)}</strong></Link>)}</div></div></section></main><Newsletter /><Footer /><MobileNav /></>;
}

export function MobileNav() { return <nav className="mobile-bottom" aria-label="Mobile navigation"><Link href="/">home</Link><Link href="/news">news</Link><Link href="/events">events</Link><Link href="/books">books</Link><Link href="/about">menu</Link></nav>; }
export function PageShell({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) { return <><Header /><main className="page-main container"><p className="eyebrow">{eyebrow ?? "PEANUTZIN"}</p><h1>{title}</h1>{children}</main><Footer /><MobileNav /></>; }
