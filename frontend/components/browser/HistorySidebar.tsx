"use client";

import type { Visit } from "@/types";
import Link from "next/link";

export function HistorySidebar({
  visits,
  currentAddress,
  onOpen
}: {
  visits: Visit[];
  currentAddress: string;
  onOpen: (address: string) => void;
}) {
  return (
    <aside className="history-panel" aria-label="Browsing history">
      <div className="panel-heading">
        <div><p className="eyebrow">YOUR TRAIL</p><h2>History</h2></div>
        <span className="count-pill">{visits.length}</span>
      </div>
      {visits.length === 0 ? (
        <p className="empty-note">Pages you visit will appear here.</p>
      ) : (
        <ol className="history-list">
          {[...visits].reverse().map((visit) => {
            const title = typeof visit.siteId === "object" ? visit.siteId.title : undefined;
            return (
              <li key={visit._id}>
                <button className={`history-item ${visit.address === currentAddress ? "selected" : ""}`} onClick={() => onOpen(visit.address)}>
                  <span className="history-title">{title || visit.address}</span>
                  <span className="history-address">{visit.address}</span>
                  <time>{new Date(visit.visitedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                </button>
              </li>
            );
          })}
        </ol>
      )}
      <Link className="all-history-link" href="/history">View full history <span>↗</span></Link>
    </aside>
  );
}
