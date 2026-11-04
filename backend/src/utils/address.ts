import { AppError } from "../errors/app-error";

export function normalizeAddress(value: string): string {
  let address = value.trim().toLowerCase();
  address = address.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (address.includes("/") || address.includes("?") || address.includes("#")) {
    throw new AppError(400, "Enter a single .zz website address, such as tidepool.zz.", "INVALID_ADDRESS");
  }
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.zz$/.test(address)) {
    throw new AppError(400, "Enter a valid .zz website address, such as tidepool.zz.", "INVALID_ADDRESS");
  }
  return address;
}
