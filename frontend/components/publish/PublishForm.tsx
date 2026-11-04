"use client";

import { useEffect, useState, type FormEvent } from "react";
import { siteService } from "@/services/site.service";
import type { Person } from "@/types";

export function PublishForm() {
  const [people, setPeople] = useState<Person[]>([]);
  const [publisherId, setPublisherId] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("<main>\n  <h1>My little website</h1>\n  <p>Write a few words for the small web.</p>\n</main>");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    siteService.people().then((items) => {
      const publishers = items.filter((person) => person.type !== "reader");
      setPeople(publishers);
      setPublisherId(publishers[0]?._id || "");
    }).catch((failure: Error) => setError(failure.message));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const site = await siteService.publish({ publisherId, address, title, htmlContent });
      setMessage(`Published ${site.address}. It is now available to browse and search.`);
      setAddress("");
      setTitle("");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Publishing failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="publish-form" onSubmit={submit}>
      <label>Publisher
        <select value={publisherId} onChange={(event) => setPublisherId(event.target.value)} required>
          {people.map((person) => <option key={person._id} value={person._id}>{person.name}</option>)}
        </select>
      </label>
      <div className="form-grid">
        <label>Website address
          <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="mygarden.zz" required maxLength={255} />
        </label>
        <label>Page title
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A Garden Notebook" required maxLength={120} />
        </label>
      </div>
      <label>HTML content
        <textarea value={htmlContent} onChange={(event) => setHtmlContent(event.target.value)} rows={13} required maxLength={50000} spellCheck={false} />
      </label>
      <p className="form-hint">Allowed: headings, paragraphs, lists, tables, links to .zz addresses and basic text formatting. Scripts and active content are removed.</p>
      {error && <p className="notice error" role="alert">{error}</p>}
      {message && <p className="notice success" role="status">{message}</p>}
      <button className="primary-button" type="submit" disabled={busy || !publisherId}>{busy ? "Publishing…" : "Publish website"}</button>
    </form>
  );
}
