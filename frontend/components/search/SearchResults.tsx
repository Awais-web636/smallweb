"use client";

import type { SearchResult } from "@/types";
import Link from "next/link";

export function SearchResults({ results, personId }: { results: SearchResult[]; personId?: string }) {
  if (results.length === 0) return <p className="empty-state">No pages matched that search. Try another word or phrase.</p>;
  return (
    <div className="results-list">
      {results.map((result) => (
        <article className="result-card" key={result.address}>
          <div className="result-address">{result.address}</div>
          <h2>{result.title}</h2>
          <p>{result.snippet}</p>
          <Link className="text-link" href={`/?address=${encodeURIComponent(result.address)}${personId ? `&person=${encodeURIComponent(personId)}` : ""}&via=search`}>Open page <span>→</span></Link>
        </article>
      ))}
    </div>
  );
}
