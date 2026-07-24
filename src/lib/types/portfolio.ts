import type { PreviewMedia } from "./content";

export interface PortfolioFeaturedProject {
  id: string;
  year: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  tags: readonly string[];
  media: PreviewMedia;
  href: string;
}

export interface PortfolioGalleryItem {
  id: string;
  category: PortfolioCategory;
  title: string;
  media: PreviewMedia;
  aspectRatio: "tall" | "wide" | "square";
}

export type PortfolioCategory =
  | "all"
  | "clipping-path"
  | "multipath"
  | "ghost-mannequin"
  | "retouching"
  | "color-correction"
  | "background-erase"
  | "pattern-change"
  | "illustrator-banner";

export interface PortfolioCategoryFilter {
  id: PortfolioCategory;
  label: string;
}

export interface PortfolioBeforeAfter {
  id: string;
  title: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  before: PreviewMedia;
  after: PreviewMedia;
}

export interface PortfolioStat {
  value: number;
  suffix: string;
  label: string;
}

export interface PortfolioPageData {
  hero: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    heroMedia: PreviewMedia;
    categories: PortfolioCategoryFilter[];
  };
  featured: PortfolioFeaturedProject[];
  gallery: PortfolioGalleryItem[];
  comparison: PortfolioBeforeAfter;
  capabilities: string[];
  stats: PortfolioStat[];
  cta: {
    heading: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
}
