import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    minimumCacheTTL: 3600,
  },
  // Turbopack root fix: prevents confusion from parent-directory lockfile
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
