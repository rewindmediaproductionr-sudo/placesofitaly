import type { NextConfig } from "next";

// URL dell'app WikiReel (deployata separatamente su Vercel), proxata sotto
// /wikireel così che compaia su placesofitaly.com invece che su *.vercel.app.
// Configurabile via env per puntare a un ambiente diverso senza toccare il codice.
const WIKIREEL_URL =
  process.env.WIKIREEL_URL || "https://weki-reel.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/wikireel",
        destination: `${WIKIREEL_URL}/wikireel`,
      },
      {
        source: "/wikireel/:path*",
        destination: `${WIKIREEL_URL}/wikireel/:path*`,
      },
    ];
  },
};

export default nextConfig;
