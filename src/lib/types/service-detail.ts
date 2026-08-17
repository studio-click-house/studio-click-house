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
  supportingMedia: ServiceVisualMedia[];
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
}

export interface ServiceBeforeAfterData {
  heading: string;
  description?: string;
  beforeSrc: string;
  beforeAlt: string;
  afterSrc: string;
  afterAlt: string;
  beforeLabel: string;
  afterLabel: string;
  width: number;
  height: number;
  caption?: string;
}

export interface ServiceShowcaseGalleryItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface ServiceShowcaseData {
  heading: string;
  description?: string;
  stats?: { value: string; label: string }[];
  gallery?: ServiceShowcaseGalleryItem[];
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
    items: ServiceAudienceItem[];
  };
  faqs: FaqItem[];
  cta: ServiceDetailCtaData;
}
