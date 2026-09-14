/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.ratehawk.com" },
      { protocol: "https", hostname: "cdn.worldota.net" },
      { protocol: "https", hostname: "**.worldota.net" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lmmhzqrulehhwgklkahw.supabase.co" },
      { protocol: "https", hostname: "gfypumkjomlvvpiiwdfq.supabase.co" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
