import { normalizeAddress } from "./address";

describe("normalizeAddress", () => {
  it("normalizes scheme and casing consistently", () => {
    expect(normalizeAddress(" HTTPS://TidePool.ZZ/ ")).toBe("tidepool.zz");
  });
  it("rejects paths and non-small-web domains", () => {
    expect(() => normalizeAddress("tidepool.zz/page")).toThrow("Enter a single .zz website address");
    expect(() => normalizeAddress("example.com")).toThrow();
  });
});
