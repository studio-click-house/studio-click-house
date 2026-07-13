import { previewMedia } from "$lib/content/media";
import type {
  ClientLogoItem,
  ClientLocationMarker,
  FaqItem,
  ServiceItem,
  TestimonialItem,
} from "$lib/types/content";
import type { RouteId } from "$app/types";

export const navigationItems = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Journal", href: "/blog" },
] as const satisfies readonly { label: string; href: RouteId }[];

export const clientLogoItems: ClientLogoItem[] = Array.from(
  { length: 15 },
  (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: `client-logo-${number}`,
      label: `Client logo ${number}`,
      shortLabel: `CL / ${number}`,
    };
  },
);

export const services: ServiceItem[] = [
  {
    title: "Clipping path",
    slug: "clipping-path",
    description:
      "Precise subject isolation for clean, flexible image production.",
    media: previewMedia.perfumeStillLife,
  },
  {
    title: "Ghost mannequin",
    slug: "ghost-mannequin",
    description:
      "Garment construction that keeps shape and fit visually clear.",
    media: previewMedia.monochromePortrait,
  },
  {
    title: "High-end retouching",
    slug: "high-end-retouching",
    description:
      "Detailed finishing guided by material, light, and brand context.",
    media: previewMedia.studioPortrait,
  },
  {
    title: "Shadow creation",
    slug: "shadow-creation",
    description:
      "Grounded, natural-looking shadows built for consistent product sets.",
    media: previewMedia.perfumeShadow,
  },
  {
    title: "Color correction",
    slug: "color-correction",
    description:
      "Controlled color alignment across individual frames and full batches.",
    media: previewMedia.redStudioPortrait,
  },
  {
    title: "Neck joint editing",
    slug: "neck-joint-editing",
    description:
      "Clean garment reconstruction for invisible mannequin workflows.",
    media: previewMedia.monochromePortrait,
  },
  {
    title: "Jewelry retouching",
    slug: "jewelry-retouching",
    description:
      "Close-detail cleanup that protects reflections, texture, and form.",
    media: previewMedia.jewelryMacro,
  },
  {
    title: "Image and video editing",
    slug: "image-video-editing",
    description:
      "Flexible post-production support for still and moving campaigns.",
    media: previewMedia.editingWorkspace,
  },
];

export const testimonials: TestimonialItem[] = [];

export const faqs: FaqItem[] = [
  {
    question: "Which file formats can you work with?",
    answer:
      "File requirements depend on the work. Share your available source files and intended outputs so the studio can confirm the right production path before work begins.",
  },
  {
    question: "How is turnaround planned?",
    answer:
      "Timing is scoped around image count, complexity, source quality, feedback stages, and final delivery needs. A schedule is confirmed for each project rather than assumed in advance.",
  },
  {
    question: "How do revisions work?",
    answer:
      "Revision needs are agreed during scoping. Clear visual references and consolidated feedback help the studio keep decisions consistent across the full image set.",
  },
  {
    question: "How should files be transferred?",
    answer:
      "The transfer method is confirmed with the project. Production files should be shared through an agreed secure workspace rather than public links containing sensitive material.",
  },
  {
    question: "Can you keep a large batch visually consistent?",
    answer:
      "Yes. Reference frames, shared finishing rules, and review checkpoints can be established before a larger batch moves through production.",
  },
  {
    question: "Can the studio join an existing creative workflow?",
    answer:
      "The studio can work from your naming, review, and delivery conventions when those requirements are shared during scoping.",
  },
];

export const clientLocations: ClientLocationMarker[] = [
  {
    id: "united-states",
    country: "United States",
    flag: "🇺🇸",
    clientCount: 1200,
    position: { lat: 39.8, lng: -98.6 },
  },
  {
    id: "brazil",
    country: "Brazil",
    flag: "🇧🇷",
    clientCount: 354,
    position: { lat: -14.2, lng: -51.9 },
  },
  {
    id: "argentina",
    country: "Argentina",
    flag: "🇦🇷",
    clientCount: 124,
    position: { lat: -38.4, lng: -63.6 },
  },
  {
    id: "south-africa",
    country: "South Africa",
    flag: "🇿🇦",
    clientCount: 68,
    position: { lat: -30.6, lng: 22.9 },
  },
  {
    id: "united-arab-emirates",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    clientCount: 857,
    position: { lat: 23.4, lng: 53.8 },
  },
  {
    id: "bangladesh",
    country: "Bangladesh",
    flag: "🇧🇩",
    clientCount: 5000,
    position: { lat: 23.685, lng: 90.356 },
  },
  {
    id: "china",
    country: "China",
    flag: "🇨🇳",
    clientCount: 742,
    position: { lat: 35.86, lng: 104.2 },
  },
  {
    id: "australia",
    country: "Australia",
    flag: "🇦🇺",
    clientCount: 1050,
    position: { lat: -25.27, lng: 133.775 },
  },
];
