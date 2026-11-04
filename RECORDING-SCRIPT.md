# Narrated walkthrough (about 4 minutes 40 seconds)

Capture the running app with a microphone. Start MongoDB, seed the database, and run both development servers before recording. Use **Ada North** for the main trail; the pages and timestamps are deterministic.

| Time | On screen | Narration |
|---|---|---|
| 0:00–0:25 | Start page and title | “This is The Small Web: a browser inside a website for a set of fictional, database-backed pages. The frontend is Next.js and React with TypeScript; the API is Express and TypeScript, and MongoDB stores sites, visits, people, and browser sessions.” |
| 0:25–0:55 | Select Ada North; open `tidepool.zz` | “There are no accounts. Browsers choose a predefined name. I’ll start at the tidepool and follow its internal link to the mountain field guide.” |
| 0:55–1:25 | Follow links to `mountain.zz`, `greenhouse.zz`, `bookcorner.zz` | “Each arrival makes a chronological visit and appends an entry to Ada’s separate navigation stack. Links stay inside the .zz web; this is not a real internet browser.” |
| 1:25–1:55 | Back twice, forward once; scroll one page and return | “Back and forward change the stack index without creating duplicate visit records. If I open a new page after going back, the old forward branch is discarded. Scroll position belongs to each stack entry, so returning restores that particular visit, not just the address.” |
| 1:55–2:20 | Open history sidebar and full history | “History is a separate chronological record per person. It survives refresh and is clickable; choosing a history row opens the page as a new navigation.” |
| 2:20–2:50 | Search for `water`; open a result, then use Back | “Search matches extracted page content, not just titles. Results show a text snippet and open through the browser navigation API, so Back returns to the previous browser entry.” |
| 2:50–3:25 | Publish a page at a fresh `.zz` address; open it | “A predefined publisher can add a title, address, and static HTML. The API validates the publisher and address, sanitizes the markup, stores searchable text, and makes the page browsable and searchable.” |
| 3:25–3:50 | Try searching a word on the new page | “This confirms the new document participates in content search immediately.” |
| 3:50–4:10 | Enter `not-a-site.zz`; show error | “A missing address is shown as unavailable. It is not recorded as a successful visit and does not change the existing stack.” |
| 4:10–4:40 | Return to a page; explain iframe and terminal/README briefly | “Published content is allowlist-sanitized and displayed in an iframe with no script permission, a restrictive content policy, and intercepted .zz links. Deliberately excluded are authentication, accounts, tabs, bookmarks, downloads, hosted assets, and external browsing. The seed can be repeated and produces the same sample web and history.” |

If a UI label or interaction changes, update this script before recording. Do not narrate a check as successful unless it was demonstrated against the running application.
