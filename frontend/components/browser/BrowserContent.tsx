"use client";

import { useCallback, useEffect, useRef } from "react";

function getInternalAddress(rawHref: string): string | null {
  const address = rawHref.trim().replace(/^https?:\/\//i, "").split(/[/?#]/)[0].toLowerCase();
  return /^[a-z0-9][a-z0-9-]*\.zz$/.test(address) ? address : null;
}

export function BrowserContent({
  html,
  address,
  entryId,
  scrollY,
  onNavigate,
  onBlockedLink,
  onScroll
}: {
  html: string;
  address: string;
  entryId: string;
  scrollY: number;
  onNavigate: (address: string) => void;
  onBlockedLink: () => void;
  onScroll: (entryId: string, scrollY: number) => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollHandler = useRef(onScroll);
  const entryIdRef = useRef(entryId);

  useEffect(() => {
    scrollHandler.current = onScroll;
    entryIdRef.current = entryId;
  }, [entryId, onScroll]);

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    const position = frameRef.current?.contentWindow?.scrollY;
    if (typeof position === "number") scrollHandler.current(entryIdRef.current, position);
  }, []);

  const onLoad = useCallback(() => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    const win = frame?.contentWindow;
    if (!doc || !win) return;

    doc.addEventListener("click", (event) => {
      const target = event.target;
      const ElementConstructor = win.document.defaultView?.Element;
      if (!ElementConstructor || !(target instanceof ElementConstructor)) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      event.preventDefault();
      const href = anchor.getAttribute("href") || "";
      const internalAddress = getInternalAddress(href);
      if (internalAddress) onNavigate(internalAddress);
      else onBlockedLink();
    });

    let attempts = 0;
    const restore = () => {
      attempts += 1;
      if (win.document.documentElement.scrollHeight >= scrollY || attempts >= 20) {
        win.scrollTo(0, scrollY);
      } else {
        win.requestAnimationFrame(restore);
      }
    };
    win.requestAnimationFrame(restore);

    win.addEventListener("scroll", () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => scrollHandler.current(entryIdRef.current, win.scrollY), 250);
    }, { passive: true });
  }, [onBlockedLink, onNavigate, scrollY]);

  const srcDoc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'; base-uri 'none'"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font:16px/1.7 system-ui,sans-serif;color:#24313a;max-width:760px;margin:0 auto;padding:32px 28px}h1,h2,h3{line-height:1.2;color:#16212c}a{color:#2469a8}img{max-width:100%}blockquote{border-left:3px solid #c8d3dd;padding-left:1rem;color:#596978}table{border-collapse:collapse}td,th{border:1px solid #ccd4da;padding:.45rem}</style></head><body>${html}</body></html>`;

  return (
    <section className="webpage" aria-label={`Website content at ${address}`}>
      <div className="page-origin"><span className="secure-dot" /> SMALL WEB <span>/</span> {address}</div>
      <iframe
        ref={frameRef}
        className="site-frame"
        title={`Published website: ${address}`}
        sandbox="allow-same-origin"
        referrerPolicy="no-referrer"
        srcDoc={srcDoc}
        onLoad={onLoad}
      />
    </section>
  );
}
