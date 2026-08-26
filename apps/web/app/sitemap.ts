import type { MetadataRoute } from "next";

const BASE_URL = "https://www.dellicstravels.com"; // confirm the production domain with the user before deploy

const STATIC_ROUTES = [
  "/",
  "/flights",
  "/hotels",
  "/tours",
  "/transfers",
  "/visa",
  "/destinations",
  "/destinations/africa",
  "/destinations/asia",
  "/destinations/europe",
  "/destinations/middle-east",
  "/destinations/north-america",
  "/corporate",
  "/diaspora",
  "/services",
  "/credentials",
  "/gallery",
  "/about",
  "/contact",
  "/inquire",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
