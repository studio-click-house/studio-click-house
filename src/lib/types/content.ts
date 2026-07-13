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
