import { adjacentIndex, pushEntry, updateEntryScroll } from "./navigation-stack";

describe("navigation stack", () => {
  it("moves backward and forward without adding entries", () => {
    const entries = ["a.zz", "b.zz", "c.zz"].map((address) => ({ address, scrollY: 0 }));
    expect(adjacentIndex(2, entries.length, "back")).toBe(1);
    expect(adjacentIndex(1, entries.length, "forward")).toBe(2);
    expect(entries).toHaveLength(3);
  });

  it("drops the old forward path when a new page is opened", () => {
    const entries = ["a.zz", "b.zz", "c.zz", "d.zz"].map((address) => ({ address, scrollY: 0 }));
    const next = pushEntry(entries, 1, { address: "e.zz", scrollY: 0 });
    expect(next.map((entry) => entry.address)).toEqual(["a.zz", "b.zz", "e.zz"]);
  });

  it("handles both navigation boundaries", () => {
    expect(adjacentIndex(0, 1, "back")).toBe(-1);
    expect(adjacentIndex(0, 1, "forward")).toBe(-1);
  });

  it("restores scroll by visit entry, even when the same address appears twice", () => {
    const entries = [
      { address: "a.zz", scrollY: 40, visitId: "first" },
      { address: "a.zz", scrollY: 120, visitId: "second" }
    ];
    expect(updateEntryScroll(entries, "first", 75)).toBe(true);
    expect(entries.map((entry) => entry.scrollY)).toEqual([75, 120]);
    expect(updateEntryScroll(entries, "missing", 10)).toBe(false);
  });
});
