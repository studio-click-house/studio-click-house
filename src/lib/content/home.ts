import { previewMedia, studioDressColorways } from "$lib/content/media";
import type {
  ClientLogoItem,
  ClientLocationMarker,
  FaqItem,
  ServiceItem,
  ServiceShowcase,
  TestimonialItem,
  WorkGalleryItem,
  ShowcaseProjectItem,
} from "$lib/types/content";
import type { RouteId } from "$app/types";

export const navigationItems = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Section", href: "/section" },
  { label: "Events", href: "/events" },
  { label: "CSR", href: "/csr" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
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

export const serviceShowcases: ServiceShowcase[] = [
  {
    category: "Image Editing",
    displayTitle: "Image editing",
    description:
      "Isolation, retouching, color, and detail work for individual frames or complete production batches.",
    media: {
      kind: "comparison",
      beforeLabel: "Before",
      afterLabel: "After",
      before: {
        src: "/images/about/colorways/dress-color-original.jpg",
        alt: "Original studio portrait before color correction",
        width: 1024,
        height: 1536,
        credit: "Studio Click House local preview asset",
      },
      after: {
        ...studioDressColorways[0],
        credit: "Studio Click House local preview asset",
      },
    },
  },
  {
    category: "Video Editing",
    displayTitle: "Video editing",
    description:
      "Commercial edits, social cutdowns, and controlled grading shaped for each format and viewing context.",
    media: {
      kind: "video",
      src: "/videos/ai section video.mp4",
      poster: previewMedia.editingWorkspace,
      alt: "Studio video editing and post-production preview",
    },
  },
  {
    category: "3D Modeling",
    displayTitle: "3D & CGI",
    description:
      "Product modeling, material development, and CGI rendering for believable commercial imagery.",
    media: {
      kind: "comparison",
      beforeLabel: "Model",
      afterLabel: "Render",
      before: previewMedia.product3dModel,
      after: previewMedia.perfumeStillLife,
    },
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

export const testimonials: TestimonialItem[] = [
  {
    quote:
      "Studio Click House has been a very good help to speed up the day to day process at our Studio. Very dedicated and always ready to take challenges.",
    name: "Jilhaj",
    role: "Managing Director",
    company: "Studio Click House",
    avatar: "/images/profile image/MD/Jilhaj.png",
  },
];

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
  {
    id: "united-kingdom",
    country: "United Kingdom",
    flag: "🇬🇧",
    position: { lat: 54.8, lng: -3.4 },
  },
  {
    id: "denmark",
    country: "Denmark",
    flag: "🇩🇰",
    position: { lat: 56.26, lng: 9.5 },
  },
  {
    id: "norway",
    country: "Norway",
    flag: "🇳🇴",
    position: { lat: 60.47, lng: 8.47 },
  },
  {
    id: "spain",
    country: "Spain",
    flag: "🇪🇸",
    position: { lat: 40.46, lng: -3.75 },
  },
  {
    id: "france",
    country: "France",
    flag: "🇫🇷",
    position: { lat: 46.23, lng: 2.21 },
  },
  {
    id: "sweden",
    country: "Sweden",
    flag: "🇸🇪",
    position: { lat: 60.13, lng: 18.64 },
  },
];

export const showcaseProjects: ShowcaseProjectItem[] = [
  {
    id: "archidomo",
    year: "2026",
    category: "Raw capture",
    title: "Archidomo",
    description:
      "Untouched camera files showcasing original lighting, color, and raw studio backdrop.",
    bgColor: "rgb(155, 172, 179)",
    media: {
      src: "/images/portfolio/model-raw.png",
      alt: "Raw camera capture",
      width: 1200,
      height: 1600,
      credit: "Studio Click House",
    },
    href: "/portfolio",
  },
  {
    id: "beauty-detail",
    year: "2026",
    category: "Precision clipping",
    title: "Orlinski",
    description:
      "Point-by-point hand-drawn vector paths tracing silhouettes with absolute precision.",
    bgColor: "rgb(193, 154, 162)",
    media: {
      src: "/images/portfolio/model-clipping.png",
      alt: "Precision clipping path work",
      width: 1200,
      height: 1600,
      credit: "Studio Click House",
    },
    href: "/portfolio",
  },
  {
    id: "pikko",
    year: "2025",
    category: "Clean isolation",
    title: "Pikko",
    description:
      "Subjects separated cleanly from the studio background, prepared for white or transparent layouts.",
    bgColor: "rgb(147, 168, 149)",
    media: {
      src: "/images/portfolio/model-isolated.png",
      alt: "Isolated fashion portrait",
      width: 1200,
      height: 1600,
      credit: "Studio Click House",
    },
    href: "/portfolio",
  },
];
