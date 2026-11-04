export type StackEntry = { address: string; scrollY: number; visitId?: unknown };

export function pushEntry(
  entries: StackEntry[],
  currentIndex: number,
  newEntry: StackEntry
): StackEntry[] {
  return [...entries.slice(0, currentIndex + 1), newEntry];
}

export function adjacentIndex(currentIndex: number, entryCount: number, direction: "back" | "forward"): number {
  const index = currentIndex + (direction === "back" ? -1 : 1);
  if (index < 0 || index >= entryCount) return -1;
  return index;
}

export function updateEntryScroll(entries: StackEntry[], entryId: string, scrollY: number): boolean {
  const entry = entries.find((candidate) => String(candidate.visitId) === entryId);
  if (!entry) return false;
  entry.scrollY = scrollY;
  return true;
}
