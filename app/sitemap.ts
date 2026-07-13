import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, lastModified: new Date(), priority: 1 },
    { url: `${siteConfig.url}/about`, lastModified: new Date(), priority: 0.8 },
    {
      url: `${siteConfig.url}/services`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/portfolio`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/pricing`,
      lastModified: new Date(),
      priority: 0.7,
    },
    { url: `${siteConfig.url}/blog`, lastModified: new Date(), priority: 0.7 },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date(),
      priority: 0.6,
    },
  ];
}
