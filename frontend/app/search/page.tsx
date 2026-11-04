"use client";

import { useState, type FormEvent } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { searchService } from "@/services/search.service";
import type { SearchResult } from "@/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      setResults(await searchService.search(query));
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Search failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="content-page">
      <p className="eyebrow">LOOK THROUGH THE WEB</p>
      <h1>Search the <em>small web.</em></h1>
      <p className="page-lede">Search the words people wrote on their pages, not just the labels on them.</p>
      <form className="search-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="search-query">Search website content</label>
        <input id="search-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “water”, “stars” or “maps”" maxLength={120} />
        <button className="primary-button" disabled={busy || !query.trim()}>{busy ? "Searching…" : "Search"}</button>
      </form>
      {error && <p className="notice error" role="alert">{error}</p>}
      {results && <><p className="results-caption">{results.length} {results.length === 1 ? "page" : "pages"} found for “{query}”</p><SearchResults results={results} /></>}
    </section>
  );
}
