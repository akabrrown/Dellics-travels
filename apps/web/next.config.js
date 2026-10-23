/** @type {import('next').NextConfig} */
const nextConfig = {
      async redirects() {
    return [
      {
        source: '/login',
        destination: '/signin',
        permanent: true,
      },
      // Legacy static site redirects (prevents 404 Destination Not Found from Google)
      {
        source: '/pages/visa.html',
        destination: '/visa',
        permanent: true,
      },
      {
        source: '/pages/visa',
        destination: '/visa',
        permanent: true,
      },
      {
        source: '/pages/tours.html',
        destination: '/tours',
        permanent: true,
      },
      {
        source: '/pages/transfers.html',
        destination: '/transfers',
        permanent: true,
      },
      {
        source: '/pages/services.html',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/pages/corporate.html',
        destination: '/corporate',
        permanent: true,
      },
      {
        source: '/pages/diaspora.html',
        destination: '/diaspora',
        permanent: true,
      },
      {
        source: '/pages/:slug.html',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/pages/:slug',
        destination: '/:slug',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Content-Security-Policy', value: "base-uri 'none';" }
        ]
      },
      // De-index visa services and legacy pages from Google Search and other search engines
      {
        source: '/visa',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' }
        ]
      },
      {
        source: '/pages/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' }
        ]
      }
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.ratehawk.com" },
      { protocol: "https", hostname: "cdn.worldota.net" },
      { protocol: "https", hostname: "**.worldota.net" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lmmhzqrulehhwgklkahw.supabase.co" },
      { protocol: "https", hostname: "gfypumkjomlvvpiiwdfq.supabase.co" },
    ],
  },
  output: "standalone",
};

export default nextConfig;
// v2
