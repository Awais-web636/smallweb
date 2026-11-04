import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Small Web",
  description: "A little browser for a web made of small, human pages."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link className="brand" href="/" aria-label="The Small Web home">
            <span className="brand-mark">s.</span><span>small<span className="brand-light">web</span></span>
          </Link>
          <nav className="top-nav" aria-label="Main navigation">
            <Link href="/">Browse</Link>
            <Link href="/search">Search</Link>
            <Link href="/history">History</Link>
            <Link className="publish-link" href="/publish">+ Publish</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer"><span>THE SMALL WEB</span><span>A place for pages worth wandering into.</span></footer>
      </body>
    </html>
  );
}
