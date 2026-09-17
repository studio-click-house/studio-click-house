import type { PortfolioPageData } from "$lib/types/portfolio";

export const portfolioPageData: PortfolioPageData = {
  hero: {
    eyebrow: "Portfolio · Selected Work · 2015–2026",
    headingLine1: "Visual craft,",
    headingLine2: "made tangible.",
    description:
      "Selected editorial retouching, hand-drawn clipping paths, color correction, and 3D CGI for fashion brands, e-commerce studios, and creative agencies.",
    heroMedia: {
      src: "/images/services/model-beauty/model-cue-tailored-fashion-studio-0145.webp",
      alt: "Fashion editorial portrait showcasing Studio Click House post-production craft",
      width: 1600,
      height: 2000,
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
      title: "Mira",
      subtitle: "Clean accessory isolation",
      description:
        "Leather accessories separated from studio backdrops with controlled edge transitions. Delivered as transparent PNGs with natural drop shadow for flexible layout composition.",
      tags: ["Background Removal", "Isolation", "Accessories"],
      media: {
        src: "/images/services/bags-accessories/accessories-mira-leather-belt-black-01-after.webp",
        alt: "Designer leather belt cleanly isolated on transparent background",
        width: 1400,
        height: 2000,
        credit: "Studio Click House",
      },
      href: "/portfolio",
    },
    {
      id: "color-correction",
      year: "2025",
      category: "Colour Correction",
      title: "Royal Debut",
      subtitle: "Selective knitwear recolouring",
      description:
        "Original knit fabric tone balanced to calibrated navy while preserving weave texture, stitch highlights, and structural seam detail across the full garment.",
      tags: ["Colour Correction", "Knitwear", "Production"],
      media: {
        src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-royal-debut-navy-knit-top-after.webp",
        alt: "Navy knit top with colour-corrected fabric finish",
        width: 1400,
        height: 2000,
        credit: "Studio Click House",
      },
      href: "/portfolio",
    },
  ],

  gallery: [
    {
      id: "gallery-retouch-rachel-gilbert",
      category: "retouching",
      title: "Rachel Gilbert evening wear retouch",
      media: {
        src: "/images/services/model-beauty/model-rachel-gilbert-evening-dress-0081.webp",
        alt: "Rachel Gilbert designer evening dress high-end editorial and fabric fold retouching",
        width: 1333,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-jewelry-jules-earrings",
      category: "retouching",
      title: "Jules textured gold earrings luxury retouch",
      media: {
        src: "/images/services/jewelry/jewelry-jules-textured-gold-earrings-03-after.webp",
        alt: "Macro textured gold earrings surface polish and reflection balancing",
        width: 1500,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-accessories-astral-sunglasses",
      category: "clipping-path",
      title: "Astral eyewear sub-pixel clipping",
      media: {
        src: "/images/services/bags-accessories/accessories-astral-designer-sunglasses-side-profile-after.webp",
        alt: "Astral designer sunglasses side profile vector clipping path and isolation",
        width: 1600,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-apparel-tiny-jumpsuit",
      category: "color-correction",
      title: "Pattern & colorway calibration",
      media: {
        src: "/images/services/ghost-mannequin-apparel/apparel-tiny-big-sister-patterned-jumpsuit-flatlay-after.webp",
        alt: "Patterned jumpsuit fabric color matching and print calibration",
        width: 1333,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-accessories-kaminski-hat",
      category: "clipping-path",
      title: "Helen Kaminski woven straw hat masking",
      media: {
        src: "/images/services/bags-accessories/accessories-helen-kaminski-newport-straw-hat-3149-after.webp",
        alt: "Helen Kaminski artisan woven straw hat fine edge clipping path",
        width: 1334,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "square",
    },
    {
      id: "gallery-ghost-couture-gown",
      category: "ghost-mannequin",
      title: "Couture ruffle gown 3D ghost mannequin",
      media: {
        src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-couture-ruffle-evening-gown-black-after.webp",
        alt: "Black couture ruffle evening gown invisible ghost mannequin composite",
        width: 1334,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-model-corporate-headshot",
      category: "retouching",
      title: "Executive commercial portrait retouch",
      media: {
        src: "/images/services/model-beauty/model-corporate-headshot-executive-male-3683-after.webp",
        alt: "Corporate executive portrait natural skin retouching and lighting refinement",
        width: 1333,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-accessories-morato-footwear",
      category: "clipping-path",
      title: "Antony Morato footwear vector path",
      media: {
        src: "/images/services/bags-accessories/accessories-antony-morato-designer-footwear-3080.webp",
        alt: "Antony Morato designer leather footwear isolated with vector clipping",
        width: 1400,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "square",
    },
    {
      id: "gallery-cgi-product-showcase",
      category: "multipath",
      title: "Studio 3D CGI product modeling & render",
      media: {
        src: "/images/portfolio/cgi-product-showcase.png",
        alt: "Studio Click House 3D CGI photorealistic product rendering with caustics",
        width: 1200,
        height: 1200,
        credit: "Studio Click House",
      },
      aspectRatio: "square",
    },
    {
      id: "gallery-ghost-nadine-dress",
      category: "color-correction",
      title: "Nadine mini dress tone calibration",
      media: {
        src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-nadine-black-mini-dress-232-after.webp",
        alt: "Nadine designer mini dress fabric color correction and tone grading",
        width: 1500,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-product-machinery-cutout",
      category: "background-erase",
      title: "Technical equipment alpha cutout",
      media: {
        src: "/images/services/product-services/product-industrial-machinery-rack-server-cutout-after.webp",
        alt: "Industrial machinery rack server complex vector path extraction",
        width: 1500,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "square",
    },
    {
      id: "gallery-ghost-printemps-jacket",
      category: "ghost-mannequin",
      title: "Printemps zip jacket 3D neck joint",
      media: {
        src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-printemps-zip-through-jacket-walnut-194-after.webp",
        alt: "Walnut zip-through jacket invisible ghost mannequin hollow neck insertion",
        width: 1419,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-jewelry-charlotte-lotus",
      category: "retouching",
      title: "By Charlotte lotus gold earrings retouch",
      media: {
        src: "/images/services/jewelry/jewelry-by-charlotte-lotus-gold-earrings-0105.webp",
        alt: "By Charlotte lotus gold earrings high-end macro surface and reflection polish",
        width: 1400,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-ghost-womens-jacket",
      category: "ghost-mannequin",
      title: "Womens tailored jacket ghost mannequin",
      media: {
        src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-4m-womens-tailored-jacket-412-after.webp",
        alt: "4M womens tailored jacket invisible mannequin front and collar composite",
        width: 1400,
        height: 2000,
        credit: "Studio Click House",
      },
      aspectRatio: "tall",
    },
    {
      id: "gallery-product-harbour-flatlay",
      category: "background-erase",
      title: "Product packaging & clean flatlay",
      media: {
        src: "/images/services/product-services/product-harbour-early-learning-childcare-kit-flatlay-after.webp",
        alt: "Childcare kit product collection clean flatlay with balanced contact shadows",
        width: 1600,
        height: 1200,
        credit: "Studio Click House",
      },
      aspectRatio: "wide",
    },
    {
      id: "gallery-jewelry-charlotte-pendant",
      category: "retouching",
      title: "Delicate gold pendant fine jewelry retouch",
      media: {
        src: "/images/services/jewelry/jewelry-by-charlotte-delicate-gold-pendant-0046.webp",
        alt: "Delicate gold pendant high-resolution surface cleaning and metal tone grading",
        width: 1400,
        height: 2000,
        credit: "Studio Click House",
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

  magazineIntro: {
    eyebrow: "The Creative Standard · Est. 2015",
    title: "Commercial image finishing, frame by frame",
    watermarkText: "STUDIO",
    paragraphs: [
      "Studio Click House handles both high-volume catalogs and detailed editorial work. Our teams preserve fabric texture, natural skin detail, and the small visual cues that make a product feel real.",
      "Each delivery is reviewed for paths, masks, retouching, color consistency, and output settings before handoff.",
    ],
    featuredImage: {
      src: "/images/services/model-beauty/model-soleil-blue-resortwear-editorial-1308.webp",
      alt: "Editorial fashion portrait demonstrating high-end skin and textile retouching",
      width: 1333,
      height: 2000,
      credit: "Studio Click House",
    },
    secondaryImage: {
      src: "/images/services/jewelry/jewelry-by-charlotte-gold-chain-necklace-0092.webp",
      alt: "Creative jewelry and accessory retouching detail",
      width: 1400,
      height: 2000,
      credit: "Studio Click House",
    },
  },

  staggeredStories: [
    {
      id: "story-fashion-ceremony",
      category: "Editorial Retouching",
      title: "Haute Couture & Runway Lighting",
      description:
        "Lossless skin cleanup, fabric fold sculpting, and ambient lighting refinement for editorial campaigns.",
      year: "2025",
      media: {
        src: "/images/services/model-beauty/model-rachel-gilbert-designer-gown-0094.webp",
        alt: "Runway fashion editorial model retouching",
        width: 1333,
        height: 2000,
        credit: "Studio Click House",
      },
      position: "left-tall",
    },
    {
      id: "story-jewelry-sparkle",
      category: "Macro Jewelry",
      title: "Fine Gold & Gemstone Radiance",
      description:
        "Extreme close-up reflection balancing, metal polishing, and multi-focus compositing for luxury jewelers.",
      year: "2025",
      media: {
        src: "/images/services/jewelry/jewelry-emerald-cut-diamond-solitaire-gold-ring-after.webp",
        alt: "Diamond ring fine jewelry macro post-production",
        width: 1991,
        height: 2000,
        credit: "Studio Click House",
      },
      position: "center-grid",
    },
    {
      id: "story-cosmetics-glass",
      category: "Luxury Accessories",
      title: "Metallic Leather & Clean Reflection",
      description:
        "Sub-pixel pen path clipping with preserved metallic gold luster and hand-drawn natural drop shadows.",
      year: "2026",
      media: {
        src: "/images/services/bags-accessories/accessories-quinn-metallic-gold-bag-01-after.webp",
        alt: "Luxury metallic gold designer handbag with clean shadows",
        width: 1500,
        height: 2000,
        credit: "Studio Click House",
      },
      position: "center-grid",
    },
    {
      id: "story-ghost-mannequin",
      category: "Apparel Volume",
      title: "3D Hollow Neck Tailoring",
      description:
        "Front-and-back compositing that creates natural depth, collar alignment, and balanced drape.",
      year: "2025",
      media: {
        src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-couture-ruffle-evening-gown-black-after.webp",
        alt: "Couture evening gown ghost mannequin hollow neck composite",
        width: 1334,
        height: 2000,
        credit: "Studio Click House",
      },
      position: "right-offset",
    },
    {
      id: "story-color-mastery",
      category: "Color Correction",
      title: "Harmonized Garment Swatch Matching",
      description:
        "Precision pantone-matched recoloring across SKU variations without losing natural sheen or stitch fidelity.",
      year: "2026",
      media: {
        src: "/images/services/ghost-mannequin-apparel/apparel-montmartre-stripe-maxi-dress-169-after.webp",
        alt: "Fashion model colored fabric studio grading",
        width: 1500,
        height: 2000,
        credit: "Studio Click House",
      },
      position: "right-offset",
    },
  ],

  panorama: {
    watermark: "CRAFT",
    headline: "Precision Down to the Micron",
    subheadline:
      "Every fiber, edge transition, and reflection sculpted with dedicated digital artistry.",
    badge: "Mastery in Detail",
    media: {
      src: "/images/services/jewelry/jewelry-aquamarine-emerald-gold-ring-4030.webp",
      alt: "Aquamarine and emerald fine gold ring macro refraction and gemstone brilliance",
      width: 2000,
      height: 2000,
      credit: "Studio Click House",
    },
  },

  manifesto: {
    quote:
      "The true standard of post-production is invisible perfection: every pixel refined so the art, garment, and human expression feel completely effortless.",
    author: "Studio Click House",
    role: "Global Creative Post-Production & Color Studio",
  },

  brandPartners: [
    { name: "Vogue Creative", category: "Editorial" },
    { name: "Nordic Apparel", category: "E-Commerce" },
    { name: "Aurum Fine Jewelry", category: "Luxury Retail" },
    { name: "Lumière Cosmetics", category: "Beauty" },
    { name: "Atelier Studio Paris", category: "Commercial" },
    { name: "Monolith Footwear", category: "Apparel" },
  ],

  showreel: {
    title: "2026 Craft & Process Showreel",
    subtitle: "Behind The Scenes · Layer by Layer",
    description:
      "See how our artists take raw commercial camera files to catalog-ready delivery.",
    media: {
      src: "/images/portfolio/portfolio-fashion-studio-hero.jpg",
      alt: "Studio Click House post-production process showreel preview",
      width: 1600,
      height: 900,
      credit: "Studio Click House",
    },
  },

  stats: [
    { value: 5, suffix: "M+", label: "Assets delivered" },
    { value: 150, suffix: "+", label: "Digital artists" },
    { value: 10, suffix: "+", label: "Years of production" },
    { value: 99, suffix: ".8%", label: "On-time SLA rating" },
  ],

  cta: {
    heading: "Ready to see what we can do for your brand?",
    description:
      "Send a test image or video clip. We’ll confirm the workflow, turnaround, and delivery format before production starts.",
    primaryLabel: "Start a Project",
    primaryHref: "/contact",
    secondaryLabel: "Explore Services",
    secondaryHref: "/services",
  },
};
