import { previewMedia } from "$lib/content/media";
import type { PortfolioPageData } from "$lib/types/portfolio";

export const portfolioPageData: PortfolioPageData = {
  hero: {
    eyebrow: "Portfolio · Selected Work · 2015–2026",
    headingLine1: "Visual craft,",
    headingLine2: "made tangible.",
    description:
      "A curated selection of editorial retouching, precision clipping, color correction, and 3D CGI work produced for fashion brands, e-commerce studios, and global creative agencies.",
    heroMedia: {
      src: "https://images.pexels.com/photos/20194705/pexels-photo-20194705.jpeg?auto=compress&cs=tinysrgb&w=1800",
      alt: "Fashion editorial portrait showcasing Studio Click House post-production craft",
      width: 1200,
      height: 1600,
      credit: "Studio Click House",
    },
    categories: [
      { id: "all", label: "All Work" },
      { id: "fashion", label: "Fashion & Editorial" },
      { id: "ecommerce", label: "E-Commerce" },
      { id: "3d-cgi", label: "3D CGI" },
      { id: "color", label: "Color Grading" },
      { id: "clipping", label: "Clipping Path" },
    ],
  },

  featured: [
    {
      id: "clean-isolation",
      year: "2025",
      category: "Background Removal",
      title: "Pikko",
      subtitle: "Clean subject isolation",
      description:
        "Subjects separated from studio backdrops with controlled hair and fabric edges. Delivered as transparent PNGs for flexible layout composition.",
      tags: ["Background Removal", "Isolation", "Fashion"],
      media: {
        src: "https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg?auto=compress&cs=tinysrgb&w=1800",
        alt: "Fashion model cleanly isolated on transparent background",
        width: 1200,
        height: 1600,
        credit: "Studio Click House",
      },
      href: "/portfolio",
    },
    {
      id: "color-correction",
      year: "2025",
      category: "Colour Correction",
      title: "Verdeaux",
      subtitle: "Selective garment recolouring",
      description:
        "Original ivory dress fabric corrected to emerald green while preserving folds, highlights, texture, and construction detail across the full garment.",
      tags: ["Colour Correction", "Fashion", "Production"],
      media: {
        src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1800",
        alt: "Fashion model with colour-corrected emerald dress",
        width: 1200,
        height: 1600,
        credit: "Studio Click House",
      },
      href: "/portfolio",
    },
  ],

  gallery: [
    {
      id: "gallery-portrait-studio",
      category: "fashion",
      title: "Studio portrait finishing",
      media: {
        src: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Studio portrait under custom soft light settings",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-cosmetics-product",
      category: "ecommerce",
      title: "Skincare product serum",
      media: {
        src: "https://images.pexels.com/photos/3762467/pexels-photo-3762467.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Premium skincare glass bottle macro shot",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-jewelry-macro",
      category: "ecommerce",
      title: "Luxury watch macro",
      media: {
        src: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "High-end mechanical watch dial close up",
        width: 1200,
        height: 1200,
        credit: "Pexels"
      },
      aspectRatio: "square",
    },
    {
      id: "gallery-red-editorial",
      category: "fashion",
      title: "Red studio editorial",
      media: {
        src: "https://images.pexels.com/photos/2738173/pexels-photo-2738173.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Fashion model posing against saturated background",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-niche-perfume",
      category: "ecommerce",
      title: "Glass perfume bottle still life",
      media: {
        src: "https://images.pexels.com/photos/3989394/pexels-photo-3989394.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Perfume bottle photographed with soft gradient shadows",
        width: 1200,
        height: 800,
        credit: "Pexels"
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-monochrome",
      category: "fashion",
      title: "Monochrome high-fashion",
      media: {
        src: "https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Dramatic high contrast black and white fashion portrait",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-3d-model",
      category: "3d-cgi",
      title: "CGI abstract glass refraction",
      media: {
        src: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Abstract 3D generated transparent glass ripples",
        width: 1200,
        height: 800,
        credit: "Pexels"
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-handbag-detail",
      category: "ecommerce",
      title: "Leather handbag details",
      media: {
        src: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Close up details of designer leather bag stitches",
        width: 1200,
        height: 1200,
        credit: "Pexels"
      },
      aspectRatio: "square",
    },
    {
      id: "gallery-sunglasses-product",
      category: "ecommerce",
      title: "Modern designer sunglasses",
      media: {
        src: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Sunglasses photographed on reflective studio surface",
        width: 1200,
        height: 800,
        credit: "Pexels"
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-workspace",
      category: "color",
      title: "Color grading workstation",
      media: {
        src: "https://images.pexels.com/photos/325111/pexels-photo-325111.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Video color grading workspace with control panels",
        width: 1200,
        height: 800,
        credit: "Pexels"
      },
      aspectRatio: "wide",
    },
  ],

  comparison: {
    id: "fashion-retouch-comparison",
    title: "From camera file to final delivery",
    description:
      "The raw studio capture and the finished retouched frame, side by side. Skin detail preserved, distractions removed, colour balanced for the campaign.",
    beforeLabel: "Raw capture",
    afterLabel: "Final delivery",
    before: {
      src: "/images/portfolio/model-raw.png",
      alt: "Unretouched raw camera file from fashion studio shoot",
      width: 1200,
      height: 1600,
      credit: "Studio Click House",
    },
    after: {
      src: "/images/portfolio/model-color-corrected.png",
      alt: "Final retouched and colour-corrected fashion portrait",
      width: 1200,
      height: 1600,
      credit: "Studio Click House",
    },
  },

  capabilities: [
    "Skin Retouching",
    "Clipping Path",
    "Ghost Mannequin",
    "Colour Correction",
    "3D CGI Rendering",
    "Background Removal",
    "Shadow Creation",
    "Video Grading",
    "E-Commerce Batch",
    "Editorial Finishing",
  ],

  stats: [
    { value: 5, suffix: "M+", label: "Assets delivered" },
    { value: 150, suffix: "+", label: "Digital artists" },
    { value: 10, suffix: "+", label: "Years of production" },
  ],

  cta: {
    heading: "Ready to see what we can do for your brand?",
    description:
      "Send us a test image or video clip. Experience our overnight turnaround, pixel precision, and dedicated project management firsthand.",
    primaryLabel: "Start a Project",
    primaryHref: "/contact",
    secondaryLabel: "Explore Services",
    secondaryHref: "/services",
  },
};
