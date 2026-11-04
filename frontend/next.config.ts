import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").origin;
    const scriptPolicy = process.env.NODE_ENV === "development"
      ? "'self' 'unsafe-inline' 'unsafe-eval'"
      : "'self' 'unsafe-inline'";
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: `default-src 'self'; script-src ${scriptPolicy}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ${apiOrigin}; frame-src 'self' about:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'` },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
      ]
    }];
  }
};

export default nextConfig;
