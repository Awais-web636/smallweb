"use client";

import { useEffect, useState } from "react";
import { BrowserContent } from "@/components/browser/BrowserContent";
import { BrowserToolbar } from "@/components/browser/BrowserToolbar";
import { HistorySidebar } from "@/components/browser/HistorySidebar";
import { PersonSelector } from "@/components/browser/PersonSelector";
import { useBrowser } from "@/hooks/useBrowser";
import { siteService } from "@/services/site.service";
import type { Site } from "@/types";

export default function BrowserPage() {
  const browser = useBrowser();
  const [suggestedSites, setSuggestedSites] = useState<Site[]>([]);
  const [suggestedError, setSuggestedError] = useState("");
  const [blockedLink, setBlockedLink] = useState(false);

  useEffect(() => {
    siteService.list().then(setSuggestedSites).catch((failure: Error) => setSuggestedError(failure.message));
  }, []);

  return (
    <div className="app-shell">
      <section className="browser-workspace">
        <div className="workspace-title">
          <div>
            <p className="eyebrow">A BROWSER FOR A SMALLER WEB</p>
            <h1>Take a little <em>wander.</em></h1>
          </div>
          <PersonSelector people={browser.people} value={browser.personId} onChange={browser.setPersonId} disabled={browser.busy} />
        </div>

        {browser.peopleError && <p className="notice error" role="alert">{browser.peopleError}</p>}
        <div className="browser-window">
          <div className="window-top">
            <span className="window-lights"><i /><i /><i /></span>
            <span className="window-caption">SMALL WEB EXPLORER</span>
            <span className="window-status"><b /> LOCAL WEB</span>
          </div>
          <BrowserToolbar
            address={browser.address}
            onAddressChange={browser.setAddress}
            onNavigate={(address) => { setBlockedLink(false); void browser.navigate(address); }}
            onBack={() => void browser.move("back")}
            onForward={() => void browser.move("forward")}
            canGoBack={browser.canGoBack}
            canGoForward={browser.canGoForward}
            busy={browser.busy}
          />
          {blockedLink && <p className="notice warning">Only pages in the .zz small web can be opened from here.</p>}
          {browser.error ? (
            <div className="browser-message" role="status">
              <span className="message-symbol">↗</span>
              <p className="eyebrow">PAGE UNAVAILABLE</p>
              <h2>{browser.viewState.notFound ? "This address is a blank page." : "We couldn't open that page."}</h2>
              <p>{browser.error}</p>
              <button className="text-button" onClick={() => void browser.restoreCurrent()}>Return to the current page</button>
            </div>
          ) : browser.site ? (
            <BrowserContent
              key={`${browser.personId}-${browser.site.address}-${browser.navigation.currentIndex}`}
              entryId={browser.navigation.entries[browser.navigation.currentIndex]?.visitId || ""}
              address={browser.site.address}
              html={browser.site.htmlContent}
              scrollY={browser.currentScrollY}
              onNavigate={(address) => void browser.navigate(address, "link")}
              onBlockedLink={() => setBlockedLink(true)}
              onScroll={(entryId, position) => void browser.saveScroll(entryId, position)}
            />
          ) : browser.busy ? (
            <div className="browser-message"><span className="loader" /><p>Finding your place…</p></div>
          ) : (
            <div className="welcome-page">
              <div className="welcome-copy">
                <p className="eyebrow">TEN TINY WORLDS. ONE ADDRESS BAR.</p>
                <h2>Start somewhere<br /><em>unexpected.</em></h2>
                <p>These pages are made by people, connected by curiosity, and waiting just around the corner.</p>
              </div>
              <div className="suggested-sites">
                <p className="eyebrow">A FEW PLACES TO BEGIN</p>
                {suggestedError && <p className="suggested-error" role="status">{suggestedError}</p>}
                {suggestedSites.map((item, index) => (
                  <button key={item.address} onClick={() => void browser.navigate(item.address)}><span>0{index + 1}</span><b>{item.title}</b><i>{item.address}</i>↗</button>
                ))}
              </div>
            </div>
          )}
          {browser.busy && browser.site && <div className="loading-bar" aria-label="Loading page" />}
        </div>
      </section>
      <HistorySidebar visits={browser.visits} currentAddress={browser.currentAddress} onOpen={(address) => void browser.navigate(address, "history")} />
    </div>
  );
}
