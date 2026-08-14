import type { MetadataRoute } from "next";

const base = "https://mednational.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/membership",
    "/events",
    "/calendar",
    "/leadership",
    "/family",
    "/alumni",
    "/service",
    "/accomplishments",
    "/gallery",
    "/donate",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
