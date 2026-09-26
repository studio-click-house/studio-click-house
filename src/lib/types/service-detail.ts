import type { FaqItem, PreviewMedia } from "$lib/types/content";

export type ServiceVisualMedia = Pick<
  PreviewMedia,
  "src" | "alt" | "width" | "height"
>;

export interface ServiceDetailHeroData {
  title: string;
  titleAccent: string;
  description: string;
  media: ServiceVisualMedia;
  mediaFit?: "contain" | "cover";
  supportingMedia: ServiceVisualMedia[];
  theme?: "light" | "dark";
  titleWidth?: "standard" | "wide";
  aspectRatio?: "4/5" | "standard";
  kicker?: string;
}

export interface ServiceIntroData {
  heading: string;
  paragraphs: string[];
  stages?: {
    label: string;
    description: string;
    media: ServiceVisualMedia;
  }[];
}

export interface ServiceFeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceAudienceItem {
  title: string;
  description: string;
  media: ServiceVisualMedia;
  fit?: "contain" | "cover";
  deliverable?: string;
  examples?: string[];
}

export interface ServiceBeforeAfterData {
  heading: string;
  description?: string;
  beforeSrc: string;
  beforeAlt: string;
  afterSrc: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  showLabels?: boolean;
  width: number;
  height: number;
  caption?: string;
  bullets?: string[];
  showButtons?: boolean;
  layout?: "slider" | "cards";
  textPosition?: "left" | "right";
}

export interface ServiceShowcaseGalleryItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  objectPosition?: string;
}

export interface ServiceShowcaseData {
  heading: string;
  description?: string;
  bullets?: string[];
  stats?: { value: string; label: string }[];
  gallery?: ServiceShowcaseGalleryItem[];
  beforeAfter?: {
    before: ServiceVisualMedia & { label?: string; caption?: string };
    after: ServiceVisualMedia & { label?: string; caption?: string };
  };
  theme?: "light" | "dark";
}

export interface ServiceGalleryItem {
  id: string;
  title: string;
  category: string;
  technique: string;
  media: ServiceVisualMedia;
}

export interface ServiceGalleryData {
  heading: string;
  description?: string;
  items: ServiceGalleryItem[];
}

export interface ServiceDetailCtaData {
  heading: string;
  description: string;
  steps: {
    title: string;
    description: string;
  }[];
}

export interface ServicePageData {
  slug: string;
  seo: {
    title: string;
    description: string;
  };
  hero: ServiceDetailHeroData;
  intro: ServiceIntroData;
  beforeAfter: ServiceBeforeAfterData;
  showcase: ServiceShowcaseData;
  gallery?: ServiceGalleryData;
  features: {
    heading: string;
    items: ServiceFeatureItem[];
  };
  audience: {
    heading: string;
    description?: string;
    items: ServiceAudienceItem[];
  };
  faqs: FaqItem[];
  faqImages?: PreviewMedia[];
  cta: ServiceDetailCtaData;
}
