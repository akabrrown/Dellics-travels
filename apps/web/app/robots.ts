import type { MetadataRoute } from "next";

const BASE_URL = "https://www.dellicstravels.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/pages/",
          "/pages/*",
          "/pages/visa.html",
          "/*.html",
          "/visa",
        ],
      },
      {
        userAgent: "Googlebot",
        disallow: [
          "/admin",
          "/pages/",
          "/pages/*",
          "/pages/visa.html",
          "/*.html",
          "/visa",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
