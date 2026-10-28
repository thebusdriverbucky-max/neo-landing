import type { NextConfig } from "next";
import { OPTIMIZED_IMAGE_PATTERNS } from "./lib/remote-images";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: OPTIMIZED_IMAGE_PATTERNS,
  },
};

export default nextConfig;
