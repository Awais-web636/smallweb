"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { historyService } from "@/services/history.service";
import { navigationService } from "@/services/navigation.service";
import { siteService } from "@/services/site.service";
import { ApiError } from "@/lib/api";
import type { NavigationState, Person, Site, Visit } from "@/types";

const emptyNavigation: NavigationState = {
  entries: [],
  currentIndex: -1,
  canGoBack: false,
  canGoForward: false
};

export function useBrowser() {
  const [people, setPeople] = useState<Person[]>([]);
  const [personId, setPersonId] = useState("");
  const [navigation, setNavigation] = useState(emptyNavigation);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [site, setSite] = useState<Site | null>(null);
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [peopleError, setPeopleError] = useState("");
  const loadedQuery = useRef(false);

  useEffect(() => {
    let active = true;
    siteService.people().then((items) => {
      if (!active) return;
      setPeople(items);
      const requestedPerson = new URLSearchParams(window.location.search).get("person");
      const savedPerson = window.localStorage.getItem("small-web-person");
      const chosen = items.find((person) => person._id === requestedPerson)
        || items.find((person) => person._id === savedPerson)
        || items.find((person) => person.type !== "publisher")
        || items[0];
      if (chosen) setPersonId(chosen._id);
      else setPeopleError("No predefined people are available. Run the backend seed command.");
    }).catch((failure: Error) => {
      if (active) setPeopleError(failure.message);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!personId) return;
    let active = true;
    Promise.resolve()
      .then(() => {
        if (!active) return null;
        setBusy(true);
        setError("");
        return Promise.all([navigationService.get(personId), historyService.list(personId)]);
      })
      .then(async (result) => {
        if (!result) return;
        const [nextNavigation, nextVisits] = result;
        if (!active) return;
        setNavigation(nextNavigation);
        setVisits(nextVisits);
        const query = new URLSearchParams(window.location.search);
        const requestedAddress = query.get("address");
        if (requestedAddress && !loadedQuery.current) {
          loadedQuery.current = true;
          setAddress(requestedAddress);
          const result = await navigationService.navigate(personId, requestedAddress, query.get("via") || "typed");
          if (!active) return;
          setNavigation(result.navigation);
          setVisits(await historyService.list(personId));
          setSite(result.site);
          setError("");
          return;
        }
        const current = nextNavigation.entries[nextNavigation.currentIndex];
        if (current) {
          setAddress(current.address);
          setSite(await siteService.get(current.address));
        } else {
          setSite(null);
          setAddress("");
        }
      })
      .catch((failure: Error) => {
        if (active) {
          setSite(null);
          setError(failure.message);
        }
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => { active = false; };
  }, [personId]);

  useEffect(() => {
    if (personId) window.localStorage.setItem("small-web-person", personId);
  }, [personId]);

  const navigate = useCallback(async (addressInput: string, navigationType = "typed") => {
    if (!personId) return;
    setAddress(addressInput);
    setBusy(true);
    setError("");
    try {
      const result = await navigationService.navigate(personId, addressInput, navigationType);
      setNavigation(result.navigation);
      setAddress(result.site.address);
      setSite(result.site);
      setVisits(await historyService.list(personId));
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "The page could not be opened.");
    } finally {
      setBusy(false);
    }
  }, [personId]);

  const move = useCallback(async (direction: "back" | "forward") => {
    if (!personId) return;
    setBusy(true);
    setError("");
    try {
      const result = direction === "back"
        ? await navigationService.back(personId)
        : await navigationService.forward(personId);
      setNavigation(result.navigation);
      setAddress(result.site.address);
      setSite(result.site);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Navigation failed.");
    } finally {
      setBusy(false);
    }
  }, [personId]);

  const saveScroll = useCallback(async (entryId: string, scrollY: number) => {
    if (!personId || !entryId) return;
    try {
      const updated = await navigationService.saveScroll(personId, entryId, scrollY);
      setNavigation(updated);
    } catch (failure) {
      if (failure instanceof ApiError && failure.code === "NAVIGATION_ENTRY_MISSING") return;
      setError(failure instanceof Error ? failure.message : "The page position could not be saved.");
    }
  }, [personId]);

  const currentEntry = navigation.entries[navigation.currentIndex];

  const restoreCurrent = useCallback(async () => {
    if (!currentEntry) {
      setSite(null);
      setAddress("");
      setError("");
      return;
    }
    try {
      setSite(await siteService.get(currentEntry.address));
      setAddress(currentEntry.address);
      setError("");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "The current page could not be restored.");
    }
  }, [currentEntry]);

  const currentScrollY = currentEntry?.scrollY || 0;
  const canGoBack = navigation.canGoBack;
  const canGoForward = navigation.canGoForward;
  const currentAddress = currentEntry?.address || "";
  const viewState = useMemo(() => ({
    loading: busy,
    notFound: Boolean(error && error.includes("No website exists")),
    error
  }), [busy, error]);

  return {
    people, personId, setPersonId, navigation, visits, site, address, setAddress,
    busy, error, peopleError, navigate, move, saveScroll, restoreCurrent, currentScrollY,
    currentAddress, canGoBack, canGoForward, viewState
  };
}
