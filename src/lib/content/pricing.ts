import type { PreviewMedia } from "$lib/types/content";

export interface PricingServiceRate {
  name: string;
  slug: string;
  basePrice: number;
  unit: string;
  description: string;
  features: string[];
}

export interface PricingCategory {
  categoryName: "Image Editing" | "Video Editing" | "3D Modeling";
  description: string;
  rates: PricingServiceRate[];
}

export const pricingCategories: PricingCategory[] = [
  {
    categoryName: "Image Editing",
    description: "Pixel-perfect retouching, color correction, and clipping paths scaled for campaigns, lookbooks, or high-volume e-commerce catalogs.",
    rates: [
      {
        name: "Background Removal",
        slug: "background-removal",
        basePrice: 1.50,
        unit: "image",
        description: "Precise mask isolation and transparent/solid backing.",
        features: ["Clean vector-based masks", "Transparent or pure white backing", "Standard shadow retention option", "Multiple export formats"]
      },
      {
        name: "Clipping Path",
        slug: "clipping-path",
        basePrice: 2.00,
        unit: "image",
        description: "Hand-drawn pen tool paths tracing subject silhouettes.",
        features: ["100% hand-drawn vector paths", "Compound paths for complex shapes", "Clean edges, no auto-tracing", "Clipping path embedded in PSD/TIFF"]
      },
      {
        name: "Ghost Mannequin",
        slug: "ghost-mannequin",
        basePrice: 3.50,
        unit: "image",
        description: "Combining multiple garment frames for a hollow-mannequin fit.",
        features: ["Seamless neckline/cuff merging", "Interior fabric reconstruction", "Wrinkle softening & alignment", "Consistent symmetrical shaping"]
      },
      {
        name: "Ecommerce Retouching",
        slug: "ecommerce-retouching",
        basePrice: 3.00,
        unit: "image",
        description: "Optimized batch cleaning, color balancing, and standardizing.",
        features: ["Dust & scratch removal", "Symmetric alignment & crop", "Color matching to product code", "Optimized web/print output"]
      },
      {
        name: "Jewelry Retouching",
        slug: "jewelry-retouching",
        basePrice: 8.00,
        unit: "image",
        description: "Close-up stone and metal enhancement preserving reflections.",
        features: ["Metal surface polish & shine", "Facet stone enhancement", "Prong & setting cleanup", "Reflection reconstruction"]
      },
      {
        name: "Editorial Retouching",
        slug: "editorial-retouching",
        basePrice: 15.00,
        unit: "image",
        description: "Bespoke lookbook, advertising, and high-fashion portrait finishing.",
        features: ["Frequency separation skin work", "Dodge & burn color balancing", "Garment styling & crease control", "Creative color grading & mood alignment"]
      }
    ]
  },
  {
    categoryName: "Video Editing",
    description: "Precision post-production, multi-format cutdowns, and cinematic color grading for advertisements, social channels, and brand reels.",
    rates: [
      {
        name: "Social Cutdowns",
        slug: "social-cutdowns",
        basePrice: 45.00,
        unit: "video",
        description: "Vertical reformatting and snappy edits for TikTok, Reels, or Shorts.",
        features: ["Dynamic auto/manual reframing", "Optimized captions & text overlays", "Engaging hook-oriented editing", "Up to 60 seconds duration"]
      },
      {
        name: "Color Grading",
        slug: "color-grading",
        basePrice: 90.00,
        unit: "video",
        description: "Tonal matching, exposure correction, and bespoke look development.",
        features: ["LUT development & matching", "Skin tone preservation", "Secondary color corrections", "Cohesive look across multiple clips"]
      },
      {
        name: "Commercial Editing",
        slug: "commercial-editing",
        basePrice: 150.00,
        unit: "video",
        description: "Full-scale storytelling, narrative edits, sound design, and finishing.",
        features: ["Creative pacing & assembly", "Sound design & audio mixing", "Bespoke text motion graphics", "Multiple revisions & aspect ratios"]
      }
    ]
  },
  {
    categoryName: "3D Modeling",
    description: "High-fidelity product modeling, custom PBR material mapping, and photorealistic CGI staging for digital lookbooks or interactive web displays.",
    rates: [
      {
        name: "3D Product Modeling",
        slug: "3d-product-modeling",
        basePrice: 250.00,
        unit: "asset",
        description: "Mesh construction from orthographic photos or blueprints.",
        features: ["Clean quad-based topology", "Accurate scale & dimensions", "Ready for real-time web engines", "Low-poly or high-poly outputs"]
      },
      {
        name: "Texturing & Shading",
        slug: "texturing-shading",
        basePrice: 120.00,
        unit: "asset",
        description: "Custom PBR texture mapping (roughness, metalness, normal).",
        features: ["Authentic glass, metal, fabric", "Up to 4K resolution maps", "Seamless procedural textures", "Material tuning for targeted engines"]
      },
      {
        name: "CGI Rendering",
        slug: "cgi-rendering",
        basePrice: 180.00,
        unit: "render",
        description: "Photorealistic camera composition, studio lighting, and staging.",
        features: ["Studio lighting setup", "Bespoke background staging", "Multiple camera angles", "Post-render retouching included"]
      }
    ]
  }
];

export const pricingPageData = {
  intro: {
    eyebrow: "PRICING & CAPABILITIES",
    title: "Tailored Production Estimates",
    description: "Configure your scope below to estimate the production cost. All final rates are scoped around volume, complexity, and specific turnaround requirements."
  },
  calculator: {
    volumeLabel: "Volume",
    complexityLabel: "Complexity Level",
    complexityOptions: [
      { label: "Standard", multiplier: 1.0, description: "Standard files with uniform guidelines." },
      { label: "Detailed", multiplier: 1.25, description: "Highly detailed surfaces or complex edges." },
      { label: "Complex", multiplier: 1.6, description: "Reflective, transparent, or high-precision requirements." }
    ],
    turnaroundLabel: "Turnaround Priority",
    turnaroundOptions: [
      { label: "Standard (3-5 Days)", multiplier: 1.0, description: "Regular studio production queue." },
      { label: "Express (48 Hours)", multiplier: 1.25, description: "Priority queue placement (+25%)." },
      { label: "Rush (24 Hours)", multiplier: 1.5, description: "Immediate dedicated production (+50%)." }
    ]
  },
  faqs: [
    {
      question: "Are there volume discounts?",
      answer: "Yes. Our calculator applies progressive volume scaling. For massive monthly volumes (1,000+ images or regular video batches), contact our studio for custom contract pricing."
    },
    {
      question: "How do you calculate complexity?",
      answer: "Complexity is determined by the subject matter. Standard refers to simple shapes and uniform textures. Complex covers items like jewelry, fine wire meshes, transparent containers, or complex editorial skin retouching."
    },
    {
      question: "What is your minimum order size?",
      answer: "We do not have a strict minimum order size, but custom projects are subject to a minimum project fee of $50 to cover scoping and initial setup."
    },
    {
      question: "How do files get delivered?",
      answer: "We deliver final assets through secure Cloudflare R2 links, custom client portals, or shared production folders (Google Drive, Dropbox, Frame.io) as agreed."
    }
  ]
};
