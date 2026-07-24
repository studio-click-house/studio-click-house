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
      { id: "clipping-path", label: "Clipping Path (CP)" },
      { id: "multipath", label: "Multipath" },
      { id: "ghost-mannequin", label: "Ghost Mannequin & 3D Neck" },
      { id: "retouching", label: "High-End Retouch" },
      { id: "color-correction", label: "Color Correction & Change" },
      { id: "background-erase", label: "Background Erase & Shadow" },
      { id: "pattern-change", label: "Pattern & Language Change" },
      { id: "illustrator-banner", label: "Illustrator & Banner" },
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
      id: "gallery-retouch-model-portrait",
      category: "retouching",
      title: "Model studio beauty retouch",
      media: {
        src: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Fashion model studio beauty portrait skin retouching",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-jewelry-ring",
      category: "retouching",
      title: "Diamond ring luxury retouch",
      media: {
        src: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Macro diamond ring polishing and sparkle enhancement",
        width: 1200,
        height: 800,
        credit: "Pexels"
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-product-perfume",
      category: "background-erase",
      title: "Perfume bottle background erase",
      media: {
        src: "https://images.pexels.com/photos/3989394/pexels-photo-3989394.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Glass perfume bottle isolated with natural drop shadow",
        width: 1200,
        height: 800,
        credit: "Pexels"
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-model-editorial-red",
      category: "color-correction",
      title: "Editorial model color grading",
      media: {
        src: "https://images.pexels.com/photos/2738173/pexels-photo-2738173.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Fashion model posing under color corrected studio lights",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-jewelry-watch-chronograph",
      category: "multipath",
      title: "Luxury watch multipath isolation",
      media: {
        src: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Mechanical chronograph watch dial separated into vector paths",
        width: 1200,
        height: 1200,
        credit: "Pexels"
      },
      aspectRatio: "square",
    },
    {
      id: "gallery-ghost-suit-model",
      category: "ghost-mannequin",
      title: "Tailored suit ghost mannequin 3D neck",
      media: {
        src: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Hollow suit jacket with 3D neck joint creation",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-model-skincare",
      category: "retouching",
      title: "Model skincare serum retouch",
      media: {
        src: "https://images.pexels.com/photos/3762467/pexels-photo-3762467.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Female model skincare high-end facial skin retouching",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-product-heels",
      category: "clipping-path",
      title: "Designer heels clipping path",
      media: {
        src: "https://images.pexels.com/photos/1460838/pexels-photo-1460838.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "High heels luxury shoes isolated with vector clipping path",
        width: 1200,
        height: 1200,
        credit: "Pexels"
      },
      aspectRatio: "square",
    },
    {
      id: "gallery-jewelry-necklace",
      category: "retouching",
      title: "Gold necklace jewelry retouch",
      media: {
        src: "https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Luxury gold necklace macro shine & surface retouching",
        width: 1200,
        height: 800,
        credit: "Pexels"
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-model-dress-recolor",
      category: "color-correction",
      title: "Garment color change & shade shift",
      media: {
        src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Model wearing color corrected silk evening dress",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-product-sneaker",
      category: "clipping-path",
      title: "Athletic sneaker vector CP",
      media: {
        src: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Sneaker product isolated with clean clipping path",
        width: 1200,
        height: 1200,
        credit: "Pexels"
      },
      aspectRatio: "square",
    },
    {
      id: "gallery-model-pattern-dress",
      category: "pattern-change",
      title: "Model dress pattern replacement",
      media: {
        src: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Model wearing custom pattern swatch replaced dress",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-product-cosmetics",
      category: "background-erase",
      title: "Cosmetic bottle background removal",
      media: {
        src: "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Skincare product bottle transparent background removal",
        width: 1200,
        height: 800,
        credit: "Pexels"
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-ghost-shirt",
      category: "ghost-mannequin",
      title: "Invisible mannequin shirt 3D neck",
      media: {
        src: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Apparel shirt ghost mannequin joint insert",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-illustrator-campaign",
      category: "illustrator-banner",
      title: "E-Commerce banner & vector layout",
      media: {
        src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Product advertising campaign banner graphic design",
        width: 1200,
        height: 800,
        credit: "Pexels"
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-model-monochrome",
      category: "retouching",
      title: "Monochrome fashion retouching",
      media: {
        src: "https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Black and white fashion model portrait retouch",
        width: 1200,
        height: 1600,
        credit: "Pexels"
      },
      aspectRatio: "tall",
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
