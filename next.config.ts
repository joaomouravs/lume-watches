import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF antes de WebP: as fotografias do site são grandes e de baixo
    // contraste local, exatamente o caso em que o AVIF ganha mais peso.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
