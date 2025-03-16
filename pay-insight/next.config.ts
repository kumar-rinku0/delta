import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*", // The :path parameter is used here so will not be automatically passed in the query
      },
      {
        source: "/(.*)",
        destination: "/", // Redirect all other routes to the root
      },
    ];
  },
};

export default nextConfig;
