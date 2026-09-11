import type { RequestHandler } from "./$types";
import { siteConfig } from "$lib/config/site";
import { implementedServiceSlugs } from "$lib/content/service-pages";

const staticPaths: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/portfolio", changefreq: "weekly", priority: "0.9" },
  { path: "/pricing", changefreq: "monthly", priority: "0.8" },
  { path: "/events", changefreq: "monthly", priority: "0.6" },
  { path: "/csr", changefreq: "yearly", priority: "0.4" },
  { path: "/careers", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
];

export const GET: RequestHandler = () => {
  const lastmod = new Date().toISOString().split("T")[0];

  const entries = [
    ...staticPaths.map((p) => ({
      loc: `${siteConfig.url}${p.path}`,
      lastmod,
      changefreq: p.changefreq,
      priority: p.priority,
    })),
    ...implementedServiceSlugs.map((slug) => ({
      loc: `${siteConfig.url}/services/${slug}`,
      lastmod,
      changefreq: "monthly" as const,
      priority: "0.8",
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
