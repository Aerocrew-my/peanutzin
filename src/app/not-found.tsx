import Link from "next/link";

export default function NotFound() {
  return <main className="page-main container"><p className="eyebrow">PEANUTZIN</p><h1>That page has turned.</h1><div className="empty-state"><p>We could not find that story or book.</p><div className="button-row"><Link className="button button-coral" href="/">Home</Link><Link className="button button-outline" href="/news">Latest stories</Link><Link className="button button-outline" href="/books">Books</Link></div></div></main>;
}
