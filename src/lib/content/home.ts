import { previewMedia } from "$lib/content/media";
import type {
  ClientLogoItem,
  ClientLocationMarker,
  FaqItem,
  ServiceItem,
  TestimonialItem,
  WorkGalleryItem,
} from "$lib/types/content";
import type { RouteId } from "$app/types";

export const navigationItems = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Events", href: "/events" },
  { label: "CSR", href: "/csr" },
  { label: "Careers", href: "/careers" },
] as const satisfies readonly { label: string; href: RouteId }[];

export const services: ServiceItem[] = [
  // Image Editing
  {
    title: "Background remove",
    slug: "background-remove",
    description: "Clean subject isolation and backdrop extraction.",
    media: previewMedia.perfumeShadow,
    category: "Image Editing",
  },
  {
    title: "Clipping path",
    slug: "clipping-path",
    description:
      "Precise subject isolation for clean, flexible image production.",
    media: previewMedia.perfumeStillLife,
    category: "Image Editing",
  },
  {
    title: "Ghost mannequin",
    slug: "ghost-mannequin",
    description:
      "Garment construction that keeps shape and fit visually clear.",
    media: previewMedia.monochromePortrait,
    category: "Image Editing",
  },
  {
    title: "Editorial retouching",
    slug: "editorial-retouching",
    description:
      "High-end, detailed finishing guided by material, light, and brand context.",
    media: previewMedia.studioPortrait,
    category: "Image Editing",
  },
  {
    title: "Ecommerce retouching",
    slug: "ecommerce-retouching",
    description:
      "Polished image enhancement tailored for high-volume online store listings.",
    media: previewMedia.jewelryDetail,
    category: "Image Editing",
  },
  {
    title: "Jewelry retouching",
    slug: "jewelry-retouching",
    description:
      "Close-detail cleanup that protects reflections, texture, and form.",
    media: previewMedia.jewelryMacro,
    category: "Image Editing",
  },
  {
    title: "Color correction",
    slug: "color-correction",
    description:
      "Controlled color alignment across individual frames and full batches.",
    media: previewMedia.redStudioPortrait,
    category: "Image Editing",
  },
  {
    title: "AI retouch",
    slug: "ai-retouch",
    description:
      "Next-gen AI-assisted editing for rapid, high-quality bulk processing.",
    media: previewMedia.editingWorkspace,
    category: "Image Editing",
  },

  // Video Editing
  {
    title: "Commercial editing",
    slug: "commercial-editing",
    description:
      "Polished post-production for brand reels, commercial spots, and product campaigns.",
    media: previewMedia.videoColorGrading,
    category: "Video Editing",
  },
  {
    title: "Color grading",
    slug: "color-grading",
    description:
      "Calibrated color balance and aesthetic toning for cohesive video sets.",
    media: previewMedia.redStudioPortrait,
    category: "Video Editing",
  },
  {
    title: "Social cutdowns",
    slug: "social-cutdowns",
    description:
      "Punchy, fast-turnaround video revisions tailored for social platforms.",
    media: previewMedia.editingWorkspace,
    category: "Video Editing",
  },

  // 3D Modeling
  {
    title: "3D product modeling",
    slug: "3d-product-modeling",
    description:
      "Accurate, lightweight 3D models built directly from reference designs.",
    media: previewMedia.product3dModel,
    category: "3D Modeling",
  },
  {
    title: "Texturing & shading",
    slug: "texturing-shading",
    description:
      "Custom PBR material maps depicting authentic metal, glass, and fabrics.",
    media: previewMedia.jewelryMacro,
    category: "3D Modeling",
  },
  {
    title: "CGI rendering",
    slug: "cgi-rendering",
    description:
      "Photorealistic 3D product renders with custom studio staging.",
    media: previewMedia.perfumeStillLife,
    category: "3D Modeling",
  },
];

export const workGalleryItems: WorkGalleryItem[] = [
  {
    id: "product-finishing",
    category: "Product finishing",
    title: "Shape, light, and a clean final frame.",
    description:
      "A considered product image keeps its material and lighting believable while removing visual distractions.",
    tags: ["Product", "Retouching"],
    media: previewMedia.perfumeStillLife,
  },
  {
    id: "beauty-detail",
    category: "Beauty detail",
    title: "Texture stays present. Distraction falls away.",
    description:
      "Focused finishing balances skin detail, tone, and the intended character of the portrait.",
    tags: ["Beauty", "High-end"],
    media: previewMedia.studioPortrait,
  },
  {
    id: "fashion-color",
    category: "Fashion color",
    title: "Color decisions that belong to the full story.",
    description:
      "Controlled color treatment helps separate the subject while keeping a campaign visually connected.",
    tags: ["Fashion", "Color"],
    media: previewMedia.redStudioPortrait,
  },
  {
    id: "jewelry-detail",
    category: "Jewelry detail",
    title: "Small surfaces, closely considered.",
    description:
      "Reflection, edge definition, and material detail are handled without flattening the object.",
    tags: ["Jewelry", "Detail"],
    media: previewMedia.jewelryMacro,
  },
  {
    id: "shadow-study",
    category: "Shadow study",
    title: "A grounded image still needs room to breathe.",
    description:
      "Directional shadow and negative space give a product weight without making the composition feel heavy.",
    tags: ["Shadow", "Composition"],
    media: previewMedia.perfumeShadow,
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
