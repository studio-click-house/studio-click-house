export interface PreviewMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
}

export interface ServiceItem {
  title: string;
  slug: string;
  description: string;
  media: PreviewMedia;
  category: "Image Editing" | "Video Editing" | "3D Modeling";
}

export type ServiceShowcaseMedia =
  | {
      kind: "comparison";
      before: PreviewMedia;
      after: PreviewMedia;
      beforeLabel: string;
      afterLabel: string;
    }
  | {
      kind: "video";
      src: string;
      poster: PreviewMedia;
      alt: string;
    };

export interface ServiceShowcase {
  category: ServiceItem["category"];
  displayTitle: string;
  description: string;
  media: ServiceShowcaseMedia;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  company: string;
}

export interface ClientLocationMarker {
  id: string;
  country: string;
  flag: string;
  clientCount: number;
  position: {
    lat: number;
    lng: number;
  };
}

export interface ClientLogoItem {
  id: string;
  label: string;
  shortLabel: string;
  logoSrc?: string;
  width?: number;
  height?: number;
}

export interface WorkGalleryItem {
  id: string;
  category: string;
  title: string;
  description: string;
  tags: readonly string[];
  media: PreviewMedia;
}
