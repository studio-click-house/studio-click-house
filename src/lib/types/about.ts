import type { PreviewMedia } from "./content";

export interface AboutStat {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

export interface TeamMoment {
  id: string;
  title: string;
  category: string;
  media: PreviewMedia;
}

export interface CoreValueItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  statsHighlight?: string;
  media?: PreviewMedia;
}

export interface LeaderItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  linkedinUrl?: string;
  media: PreviewMedia;
}

export interface AboutPageData {
  hero: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    positioning: string;
    stats: AboutStat[];
    bannerMedia: PreviewMedia;
  };
  people: {
    eyebrow: string;
    heading: string;
    subheading: string;
    heroCollectiveMedia: PreviewMedia;
    moments: TeamMoment[];
  };
  values: {
    eyebrow: string;
    heading: string;
    subheading: string;
    items: CoreValueItem[];
  };
  journey: {
    eyebrow: string;
    heading: string;
    subheading: string;
    milestones: TimelineMilestone[];
  };
  careers: {
    eyebrow: string;
    heading: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    bgMedia: PreviewMedia;
  };
  leadership: {
    eyebrow: string;
    heading: string;
    subheading: string;
    members: LeaderItem[];
  };
  closingCta: {
    heading: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
}
