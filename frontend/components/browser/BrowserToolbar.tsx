"use client";

import type { FormEvent } from "react";

export function BrowserToolbar({
  address,
  onAddressChange,
  onNavigate,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
  busy
}: {
  address: string;
  onAddressChange: (value: string) => void;
  onNavigate: (address: string) => void;
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  busy: boolean;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNavigate(address);
  }
  return (
    <div className="browser-toolbar">
      <div className="nav-buttons">
        <button type="button" className="icon-button" aria-label="Back" title="Back" disabled={!canGoBack || busy} onClick={onBack}>←</button>
        <button type="button" className="icon-button" aria-label="Forward" title="Forward" disabled={!canGoForward || busy} onClick={onForward}>→</button>
      </div>
      <form className="address-form" onSubmit={submit}>
        <span className="address-lock" aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="address">Website address</label>
        <input id="address" value={address} onChange={(event) => onAddressChange(event.target.value)} placeholder="Try tidepool.zz" autoComplete="off" />
        <button type="submit" className="go-button" disabled={busy || !address.trim()}>{busy ? "Opening…" : "Go"}</button>
      </form>
    </div>
  );
}
