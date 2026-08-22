import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  // Allow local network IP access for testing from mobile devices
  // @ts-ignore
  allowedDevOrigins: ["10.143.2.15", "localhost", "127.0.0.1"],
};

export default nextConfig;
