import { previewMedia, studioDressColorways } from "$lib/content/media";
import type {
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
  { label: "Events", href: "/events" },
  { label: "CSR", href: "/csr" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const satisfies readonly { label: string; href: RouteId }[];

export const services: ServiceItem[] = [
  // Image Editing
  {
    title: "AI photo retouch",
    slug: "ai-retouch",
    description:
      "Next-gen AI-assisted editing for rapid, high-quality bulk processing.",
    media: {
      src: "/images/services/ai-retouch/hero-ai-fashion.webp",
      alt: "Fashion model in sculptural gown enhanced with AI retouching workflow",
      width: 1448,
      height: 1086,
      credit: "Studio Click House",
    },
    category: "Image Editing",
  },
  {
    title: "Background remove",
    slug: "background-remove",
    description: "Clean subject isolation and backdrop extraction.",
    media: {
      src: "/images/services/bags-accessories/accessories-adele-black-leather-bag-01-before.webp",
      alt: "Designer leather handbag prepared for clean background removal",
      width: 1500,
      height: 2000,
      credit: "Studio Click House",
    },
    category: "Image Editing",
  },
  {
    title: "Clipping path",
    slug: "clipping-path",
    description:
      "Precise subject isolation for clean, flexible image production.",
    media: {
      src: "/images/services/bags-accessories/accessories-astral-designer-sunglasses-side-profile-before.webp",
      alt: "Designer sunglasses profile with crisp contours for vector clipping path",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    category: "Image Editing",
  },
  {
    title: "Ghost mannequin",
    slug: "ghost-mannequin",
    description:
      "Garment construction that keeps shape and fit visually clear.",
    media: {
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-greenpoint-knit-cardigan-ice-blue-white.webp",
      alt: "Ice-blue knit cardigan ghost mannequin with hollow 3D collar joint",
      width: 1420,
      height: 2000,
      credit: "Studio Click House",
    },
    category: "Image Editing",
  },
  {
    title: "Editorial retouching",
    slug: "editorial-retouching",
    description:
      "High-end, detailed finishing guided by material, light, and brand context.",
    media: {
      src: "/images/services/ai-retouch/ai-fashion-retouching.jpg",
      alt: "High-end editorial fashion beauty retouching with authentic skin texture and micro dodge and burn",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    category: "Image Editing",
  },
  {
    title: "Ecommerce retouching",
    slug: "ecommerce-retouching",
    description:
      "Polished image enhancement tailored for high-volume online store listings.",
    media: {
      src: "/images/services/model-beauty/beauty-portrait-close-up-skincare-retouch-0500-after.webp",
      alt: "Close-up skincare portrait with professional commercial e-commerce retouching",
      width: 2000,
      height: 1500,
      credit: "Studio Click House",
    },
    category: "Image Editing",
  },
  {
    title: "Jewelry retouching",
    slug: "jewelry-retouching",
    description:
      "Close-detail cleanup that protects reflections, texture, and form.",
    media: {
      src: "/images/services/jewelry/jewelry-aquamarine-emerald-gold-ring-4054.webp",
      alt: "Fine luxury diamond and gemstone ring with specular reflection preservation",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    category: "Image Editing",
  },
  {
    title: "Color correction",
    slug: "color-correction",
    description:
      "Controlled color alignment across individual frames and full batches.",
    media: {
      src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-pink-cream-before.webp",
      alt: "Cosmetic cream deodorant product color balanced on glass studio surface",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    category: "Image Editing",
  },

  // Video Editing
  {
    title: "Commercial editing",
    slug: "commercial-editing",
    description:
      "Polished post-production for brand reels, commercial spots, and product campaigns.",
    media: {
      src: "/images/about/orbit/ai-video-editing.jpg",
      alt: "Professional commercial video editing suite with multi-track timeline and sequence grading",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    category: "Video Editing",
  },
  {
    title: "Color grading",
    slug: "color-grading",
    description:
      "Calibrated color balance and aesthetic toning for cohesive video sets.",
    media: {
      src: "/images/about/orbit/ai-color-grading.jpg",
      alt: "Cinematic color grading console with color wheels and waveform monitors",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    category: "Video Editing",
  },
  {
    title: "Social cutdowns",
    slug: "social-cutdowns",
    description:
      "Punchy, fast-turnaround video revisions tailored for social platforms.",
    media: {
      src: "/images/about/video-pipeline/stage-2-motion-upscale.webp",
      alt: "Fast-paced social video revision and motion upscale sequence",
      width: 1200,
      height: 670,
      credit: "Studio Click House",
    },
    category: "Video Editing",
  },
  {
    title: "AI video generation",
    slug: "ai-video-generation",
    description:
      "Generative motion synthesis, neural camera extensions, and cinematic AI sequences.",
    media: {
      src: "/images/about/video-pipeline/stage-1-raw-synthesis.webp",
      alt: "Neural AI motion synthesis and generative video pipeline",
      width: 1200,
      height: 670,
      credit: "Studio Click House",
    },
    category: "Video Editing",
  },

  // 3D Modeling
  {
    title: "3D product modeling",
    slug: "3d-product-modeling",
    description:
      "Accurate, lightweight 3D models built directly from reference designs.",
    media: {
      src: "/images/about/orbit/ai-3d-cgi.jpg",
      alt: "3D wireframe mesh modeling transitioning to finished product geometry",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    category: "3D Modeling",
  },
  {
    title: "Texturing & shading",
    slug: "texturing-shading",
    description:
      "Custom PBR material maps depicting authentic metal, glass, and fabrics.",
    media: {
      src: "/images/portfolio/3d-cgi-showcase-v2.webp",
      alt: "3D PBR material texturing, displacement maps, and realistic shader development",
      width: 1200,
      height: 675,
      credit: "Studio Click House",
    },
    category: "3D Modeling",
  },
  {
    title: "CGI rendering",
    slug: "cgi-rendering",
    description:
      "Photorealistic 3D product renders with custom studio staging.",
    media: {
      src: "/images/portfolio/cgi-product-showcase.png",
      alt: "Photorealistic 3D CGI product render of a luxury glass perfume bottle",
      width: 1024,
      height: 1024,
      credit: "Studio Click House",
    },
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
      "Great design is not just about how something looks; it’s about how it makes people see, feel, and remember.",
    name: "Jilhaj Hossain Raju",
    role: "Managing Director",
    company: "Studio Click House Ltd.",
    avatar: "/images/profile image/MD/Jilhaj.webp",
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
    id: "photo-editing",
    year: "01",
    category: "Image post-production",
    title: "Photo editing",
    description:
      "Retouching, color correction, clipping, and clean finishing for polished campaign and e-commerce imagery.",
    bgColor:
      "color-mix(in srgb, var(--color-brand-coral) 32%, var(--color-brand-paper))",
    media: {
      kind: "image",
      ...previewMedia.photoEditingShowcase,
      objectPosition: "top",
    },
    href: "/services",
  },
  {
    id: "video-editing",
    year: "02",
    category: "Motion post-production",
    title: "Video editing",
    description:
      "Commercial edits, social cutdowns, retouching, and controlled color grading shaped for every viewing format.",
    bgColor:
      "color-mix(in srgb, var(--color-brand-green) 38%, var(--color-brand-paper))",
    media: {
      kind: "video",
      src: "/videos/editing-video-720p.webm",
      poster: "/images/work-fields/studio-production-poster.jpg",
      alt: "Studio video editing and post-production preview",
      width: 1280,
      height: 720,
      credit: "Studio Click House",
    },
    href: "/services",
  },
  {
    id: "3d-cgi",
    year: "03",
    category: "Digital production",
    title: "3D & CGI",
    description:
      "Product modeling, material development, lighting, and photorealistic CGI rendering for commercial imagery.",
    bgColor:
      "color-mix(in srgb, var(--color-brand-dark) 17%, var(--color-brand-mist))",
    media: {
      kind: "image",
      ...previewMedia.cgiProductShowcaseV2,
    },
    href: "/services",
  },
];
