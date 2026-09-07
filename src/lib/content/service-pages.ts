import { aiRetouchPage } from "$lib/content/ai-retouch";
import { backgroundRemovePage } from "$lib/content/background-remove";
import { clippingPathPage } from "$lib/content/clipping-path";
import { colorCorrectionPage } from "$lib/content/color-correction";
import { ecommerceRetouchingPage } from "$lib/content/ecommerce-retouching";
import { editorialRetouchingPage } from "$lib/content/editorial-retouching";
import { ghostMannequinPage } from "$lib/content/ghost-mannequin";
import { jewelryRetouchingPage } from "$lib/content/jewelry-retouching";
import type { ServicePageData } from "$lib/types/service-detail";
import { resolve } from "$app/paths";
import type { ResolvedPathname } from "$app/types";

export const servicePages: Record<string, ServicePageData> = {
  "background-remove": backgroundRemovePage,
  "clipping-path": clippingPathPage,
  "ghost-mannequin": ghostMannequinPage,
  "editorial-retouching": editorialRetouchingPage,
  "ecommerce-retouching": ecommerceRetouchingPage,
  "jewelry-retouching": jewelryRetouchingPage,
  "color-correction": colorCorrectionPage,
  "ai-retouch": aiRetouchPage,
};

export const implementedServiceSlugs = Object.keys(servicePages);

const videoServiceSlugs = new Set(["commercial-editing", "color-grading", "social-cutdowns", "video-editing"]);
const threeDimensionalServiceSlugs = new Set(["3d-product-modeling", "texturing-shading", "cgi-rendering", "3d-modeling"]);

export function resolveServiceHref(slug: string): ResolvedPathname {
  if (servicePages[slug]) {
    return resolve("/services/[slug]", { slug });
  }
  if (videoServiceSlugs.has(slug)) return resolve("/services#video-editing");
  if (threeDimensionalServiceSlugs.has(slug)) return resolve("/services#3d-modeling");
  return resolve("/services#photo-editing");
}
