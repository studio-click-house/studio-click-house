import type { RequestHandler } from "./$types";
import { siteConfig } from "$lib/config/site";
import { services } from "$lib/content/home";

const staticPaths = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/pricing",
  "/events",
  "/csr",
  "/careers",
  "/login",
  "/contact",
  "/privacy",
  "/terms",
];

export const GET: RequestHandler = () => {
  const paths = [
    ...staticPaths,
    ...services.map((service) => `/services/${service.slug}`),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${siteConfig.url}${path}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
