/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.ratehawk.com" },
      { protocol: "https", hostname: "lmmhzqrulehhwgklkahw.supabase.co" },
      { protocol: "https", hostname: "gfypumkjomlvvpiiwdfq.supabase.co" },
    ],
  },
};

export default nextConfig;
