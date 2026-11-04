"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PersonSelector } from "@/components/browser/PersonSelector";
import { historyService } from "@/services/history.service";
import { siteService } from "@/services/site.service";
import type { Person, Visit } from "@/types";

export default function HistoryPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [personId, setPersonId] = useState("");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    siteService.people().then((items) => {
      setPeople(items);
      const requested = new URLSearchParams(window.location.search).get("person");
      const saved = window.localStorage.getItem("small-web-person");
      setPersonId(items.find((person) => person._id === requested)?._id
        || items.find((person) => person._id === saved)?._id
        || items[0]?._id || "");
    }).catch((failure: Error) => setError(failure.message));
  }, []);

  useEffect(() => {
    if (!personId) return;
    let active = true;
    window.localStorage.setItem("small-web-person", personId);
    historyService.list(personId)
      .then((items) => { if (active) setVisits(items); })
      .catch((failure: Error) => { if (active) setError(failure.message); });
    return () => { active = false; };
  }, [personId]);

  return (
    <section className="content-page">
      <div className="history-page-heading">
        <div><p className="eyebrow">PLACES YOU HAVE BEEN</p><h1>Your reading <em>trail.</em></h1></div>
        <PersonSelector people={people} value={personId} onChange={(id) => {
          setVisits([]);
          setError("");
          setPersonId(id);
        }} />
      </div>
      <p className="page-lede">Visits are kept in chronological order for each person. Select a page to return to it.</p>
      {error && <p className="notice error" role="alert">{error}</p>}
      {visits.length === 0 ? <p className="empty-state">No visits yet. Start at the <Link href="/">browser</Link> and find a page.</p> : (
        <ol className="full-history-list">
          {[...visits].reverse().map((visit) => {
            const title = typeof visit.siteId === "object" ? visit.siteId.title : undefined;
            return <li key={visit._id}>
              <time>{new Date(visit.visitedAt).toLocaleString()}</time>
              <span className="history-kind">{visit.navigationType}</span>
              <div><strong>{title || visit.address}</strong><span>{visit.address}</span></div>
              <Link className="text-link" href={`/?address=${encodeURIComponent(visit.address)}&person=${encodeURIComponent(personId)}&via=history`}>Return →</Link>
            </li>;
          })}
        </ol>
      )}
    </section>
  );
}
