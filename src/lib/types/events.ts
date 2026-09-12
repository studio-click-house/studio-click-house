export type CompanyEventStatus = "upcoming" | "past";

export interface CompanyEvent {
  id: string;
  title: string;
  summary: string;
  date: string;
  location: string;
  status: CompanyEventStatus;
  format: string;
  image: string;
  imageAlt: string;
  focus: string[];
  gallery?: EventGalleryPhoto[];
}

export interface EventActivity {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export type EventCategory =
  | "nepal-tour"
  | "coxs-bazar"
  | "dinner-buffet"
  | "fun-day"
  | "football-match"
  | "mawa-evening";

export interface EventGalleryPhoto {
  id: string;
  src: string;
  alt: string;
  category: EventCategory;
  categoryLabel: string;
  caption?: string;
}
