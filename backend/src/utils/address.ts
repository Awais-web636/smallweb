export function normalizeAddress(value: string): string {
  let address = value.trim().toLowerCase();
  address = address.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (address.includes("/") || address.includes("?") || address.includes("#")) {
    throw new Error("Enter a single .zz website address, such as tidepool.zz.");
  }
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.zz$/.test(address)) {
    throw new Error("Enter a valid .zz website address, such as tidepool.zz.");
  }
  return address;
}
