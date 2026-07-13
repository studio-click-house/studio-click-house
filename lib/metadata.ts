import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function generatePageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  return {
    title: `${title} | ${siteConfig.shortName}`,
    description: description || siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      url: path,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage }],
      type: "website",
    },
  };
}
