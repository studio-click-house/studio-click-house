import type { ServicePageData } from "$lib/types/service-detail";

const backgroundRemoveMedia = {
  heroProduct: {
    src: "/images/services/product-services/product-industrial-machinery-rack-server-cutout-after.webp",
    alt: "Perfume bottle isolated with clean directional lighting and crisp product boundaries",
    width: 1600,
    height: 2000,
  },
  heroCosmetics: {
    src: "/images/services/product-services/product-paw-osteosupport-cats-packaging-bottle.webp",
    alt: "Cosmetic bottles cutout with transparent glass edge preservation",
    width: 1600,
    height: 2000,
  },
  heroApparel: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-greenpoint-knit-cardigan-ice-blue-white.webp",
    alt: "Fashion apparel isolated against a pure studio background",
    width: 1600,
    height: 2000,
  },
  introPerfume: {
    src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-pink-cream-after.webp",
    alt: "Fragrance bottle cut out cleanly with natural drop shadow",
    width: 1600,
    height: 2000,
  },
  introShoes: {
    src: "/images/services/bags-accessories/accessories-antony-morato-white-leather-sneakers-3285.webp",
    alt: "Footwear cutout showcasing crisp sole curves and lace separation",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "/images/services/bags-accessories/accessories-adele-black-leather-bag-02-before.webp",
    alt: "Leather bag photographed before background removal",
    width: 1600,
    height: 2000,
  },
  comparisonCutout: {
    src: "/images/services/bags-accessories/accessories-adele-black-leather-bag-02-after.webp",
    alt: "Leather bag isolated with a clean background and natural contact shadow",
    width: 1600,
    height: 2000,
  },
  audienceEcommerce: {
    src: "/images/services/product-services/product-paw-osteocare-small-dogs-chews-packaging-after.webp",
    alt: "Online marketplace catalog manager preparing product listings",
    width: 1600,
    height: 2000,
  },
} as const;

export const backgroundRemovePage: ServicePageData = {
  slug: "background-remove",
  seo: {
    title: "Background Removal Service | Studio Click House",
    description:
      "Product and fashion background removal with hand-drawn paths, alpha masks, and natural shadows for e-commerce, advertising, and print.",
  },
  hero: {
    title: "Background",
    titleAccent: "Removal.",
    theme: "light",
    titleWidth: "wide",
    description:
      "Isolate products, models, and complex objects with clean edges. We use hand-drawn clipping paths and alpha masks for white, transparent, or custom backgrounds.",
    media: backgroundRemoveMedia.heroProduct,
    supportingMedia: [
      backgroundRemoveMedia.heroCosmetics,
      backgroundRemoveMedia.heroApparel,
    ],
  },
  intro: {
    heading: "What is professional background removal?",
    paragraphs: [
      "Background removal separates your subject from distracting surroundings, creating clean, versatile assets for e-commerce catalogs, advertising campaigns, and print packaging. Our artists use hand-drawn Photoshop pen paths and multi-channel alpha masking to preserve the finest details—from stray hair and soft fur to transparent glassware and delicate lace.",
    ],
    stages: [
      {
        label: "Hand-Drawn Vector Path",
        description:
          "Our artists trace every curve manually using Photoshop's Pen Tool for razor-sharp, natural outlines.",
        media: backgroundRemoveMedia.introPerfume,
      },
      {
        label: "Alpha Channel Hair Masking",
        description:
          "Soft edges, wool textures, and wispy hair are separated with multi-channel color masking.",
        media: backgroundRemoveMedia.introShoes,
      },
      {
        label: "Shadow & Reflection Synthesis",
        description:
          "We add natural drop shadows, cast reflections, or pure transparency suited for marketplace standards.",
        media: {
          src: "/images/services/bags-accessories/accessories-adele-black-leather-bag-01-after-white.webp",
          alt: "Leather bag isolated with a natural contact shadow",
          width: 1600,
          height: 2000,
        },
      },
    ],
  },
  beforeAfter: {
    heading: "See the cutout difference.",
    description:
      "Drag the slider to inspect how background removal isolates the subject while preserving clean edges and realistic contact shadows.",
    beforeSrc: backgroundRemoveMedia.comparisonOriginal.src,
    beforeAlt: backgroundRemoveMedia.comparisonOriginal.alt,
    afterSrc: backgroundRemoveMedia.comparisonCutout.src,
    afterAlt: backgroundRemoveMedia.comparisonCutout.alt,
    beforeLabel: "Raw photo",
    afterLabel: "Isolated cutout",
    width: backgroundRemoveMedia.comparisonCutout.width,
    height: backgroundRemoveMedia.comparisonCutout.height,
    caption: "Drag to compare · Background isolation",
  },
  showcase: {
    heading: "Background removal for high-volume catalogs",
    description:
      "From single hero campaign visuals to 5,000+ SKU seasonal drops, our 24/7 studio delivers pixel-perfect cutouts with overnight turnaround and strict quality inspection.",
    stats: [
      { value: "2,000+", label: "Images processed per day" },
      { value: "100%", label: "Hand-drawn pen tool paths" },
      { value: "12-24h", label: "Standard turnaround window" },
    ],
    gallery: [
      {
        src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-yellow-cream-after.webp",
        alt: "Isolated perfume bottle with generated directional contact shadow",
        width: 1600,
        height: 2000,
        caption: "Product isolation & ground shadow",
      },
      {
        src: "/images/services/jewelry/jewelry-celine-gold-sculptural-bangle-03-after.webp",
        alt: "Macro jewelry cutout with preserved fine metal edges",
        width: 1600,
        height: 2000,
        caption: "Fine jewelry path extraction",
      },
      {
        src: "/images/services/model-beauty/model-fashion-black-outfit-studio-63-after.webp",
        alt: "Fashion model cutout with clean silhouette definition",
        width: 1333,
        height: 2000,
        caption: "Complex hair & silhouette masking",
      },
    ],
  },
  gallery: {
    heading: "Selected Cutout Projects",
    description:
      "Explore diverse background extraction examples across footwear, beauty, luxury jewelry, and fashion lookbooks.",
    items: [
      {
        id: "gallery-bg-footwear",
        title: "Footwear Catalog Isolation",
        category: "E-commerce",
        technique: "Compound Pen Path & Sole Clean",
        media: {
          src: "/images/services/bags-accessories/accessories-antony-morato-designer-footwear-3080.webp",
          alt: "Footwear cutout on clean backdrop",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-bg-cosmetics",
        title: "Cosmetic Bottle Extraction",
        category: "Beauty",
        technique: "Refraction & Glass Alpha Mask",
        media: {
          src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-pink-cream-before.webp",
          alt: "Cosmetic bottle isolated with glass transparency",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-bg-model",
        title: "Model Hair & Fur Masking",
        category: "Fashion",
        technique: "Multi-Channel Hair Extraction",
        media: {
          src: "/images/services/model-beauty/beauty-high-fashion-orchid-headpiece-portrait-after.webp",
          alt: "Model cutout with preserved flyaway hair",
          width: 1500,
          height: 2000,
        },
      },
      {
        id: "gallery-bg-jewelry",
        title: "Luxury Watch Isolation",
        category: "Jewelry",
        technique: "Sub-Pixel Bezier Outline",
        media: {
          src: "/images/services/jewelry/jewelry-oval-diamond-solitaire-engagement-ring-whitegold-after.webp",
          alt: "Luxury jewelry necklace on transparent backdrop",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-bg-apparel",
        title: "Garment Silhouette Cutout",
        category: "Apparel",
        technique: "Edge Smoothing & Contact Shadow",
        media: {
          src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-printemps-zip-through-jacket-walnut-194-after.webp",
          alt: "Fashion garment cutout on pure white",
          width: 1419,
          height: 2000,
        },
      },
      {
        id: "gallery-bg-still-life",
        title: "Fragrance Still Life Packshot",
        category: "Packshot",
        technique: "Transparent Reflection Retention",
        media: {
          src: "/images/services/product-services/product-harbour-early-learning-childcare-kit-flatlay-after.webp",
          alt: "Fragrance bottle on pure white with natural base shadow",
          width: 1600,
          height: 2000,
        },
      },
    ],
  },
  features: {
    heading: "Why brands trust our cutout pipeline",
    items: [
      {
        icon: "Scissors",
        title: "100% Hand-Drawn Pen Tool Paths",
        description:
          "We never rely on jagged AI auto-selectors. Every clipping path is drawn by hand by seasoned Photoshop artists zoomed to 300%.",
      },
      {
        icon: "Layers",
        title: "Transparent & Layered Delivery",
        description:
          "Receive files in layered PSD, TIFF with embedded paths, transparent PNG, or marketplace-compliant pure white sRGB JPEGs.",
      },
      {
        icon: "Sun",
        title: "Natural Drop & Cast Shadows",
        description:
          "Ground your products with custom drop shadows, original contact shadows, or reflective mirror surfaces.",
      },
      {
        icon: "ShieldCheck",
        title: "Two-Tier Quality Control",
        description:
          "Every file is reviewed by both the production artist and a quality control supervisor before client delivery.",
      },
      {
        icon: "Zap",
        title: "Overnight Turnaround Available",
        description:
          "Take advantage of our 24/7 multi-shift production floor to deliver high-volume batches overnight with zero SLA breach.",
      },
      {
        icon: "BadgeDollarSign",
        title: "Volume Tier Discounts",
        description:
          "Enjoy transparent per-image pricing with substantial discounts on bulk catalogs and seasonal collection drops.",
      },
    ],
  },
  audience: {
    heading: "Who benefits from this service?",
    items: [
      {
        title: "E-Commerce Sellers",
        description:
          "Meet strict pure-white background requirements for Amazon, Shopify, eBay, and Google Shopping without manual hassle.",
        media: backgroundRemoveMedia.audienceEcommerce,
      },
      {
        title: "Advertising & Creative Agencies",
        description:
          "Obtain clean, isolated subject assets ready for multi-layer compositing, billboard layouts, and digital campaign banners.",
        media: {
          src: "/images/services/product-services/product-industrial-machinery-rack-server-cutout-before.webp",
          alt: "Industrial product prepared for layered compositing and clean background removal",
          width: 1600,
          height: 2000,
        },
      },
      {
        title: "Commercial Photographers",
        description:
          "Offload time-consuming post-shoot clipping work to our dedicated team and focus on shooting higher-margin campaigns.",
        media: {
          src: "/images/services/bags-accessories/accessories-mira-leather-belt-nude-01-after.webp",
          alt: "Accessory product isolated for commercial photography delivery",
          width: 1600,
          height: 2000,
        },
      },
    ],
  },
  faqs: [
    {
      question: "How do you handle complex hair, fur, and transparent objects?",
      answer:
        "We use advanced multi-channel color masking and alpha matting combined with hand-drawn pen paths. This allows us to cleanly extract fine flyaway hairs, animal fur, transparent glassware, and tulle fabrics without losing edge softness.",
    },
    {
      question: "Which file formats can I deliver and receive?",
      answer:
        "We accept RAW, PSD, PSB, TIFF, PNG, and JPEG formats. Delivered files can be provided as layered PSDs with active vector paths, transparent PNGs, or optimized pure white JPEGs according to your specifications.",
    },
    {
      question: "Can you keep the original natural shadow of the product?",
      answer:
        "Yes. We can retain the original natural studio shadow, create a soft directional drop shadow, or generate a realistic reflective surface beneath the product.",
    },
    {
      question: "What is your turnaround time for high-volume orders?",
      answer:
        "Standard orders of up to 500 images are delivered within 24 hours. Express 12-hour turnaround is available for time-sensitive releases. For orders above 2,000 images, we establish dedicated production schedules.",
    },
    {
      question: "Do you offer free test edits?",
      answer:
        "Yes, we provide free trial edits for up to 3 sample images so you can evaluate our path precision and quality before placing a full batch order.",
    },
  ],
  faqImages: [
    {
      src: "/images/services/bags-accessories/accessories-josel-trucker-hat-black-01.webp",
      alt: "Black trucker hat isolated with clean edge separation",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/jewelry/jewelry-westhill-halo-diamond-signet-ring-0126.webp",
      alt: "Diamond ring isolated with precise fine-edge extraction",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/product-services/product-furniture-scandinavian-wood-dining-chair-natural.webp",
      alt: "Scandinavian wood dining chair prepared for a clean catalog background",
      width: 570,
      height: 570,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/product-services/product-food-cereal-granola-muesli-flatlay-berries-after.webp",
      alt: "Food product flatlay separated for a clean commercial presentation",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/product-services/product-furniture-scandinavian-oak-chair-hero.png",
      alt: "Scandinavian chair isolated for a clean product catalog background",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
  ],
  cta: {
    heading: "Ready for pixel-perfect background removal?",
    description:
      "Send us a sample batch or describe your catalog guidelines. Our dedicated production team will deliver a complimentary test edit and custom volume quote within hours.",
    steps: [
      {
        title: "Send test images",
        description:
          "Upload up to 3 sample files and specify your background requirements.",
      },
      {
        title: "Review trial cutouts",
        description:
          "Inspect our hand-drawn path precision and edge quality with zero commitment.",
      },
      {
        title: "Scale your batch",
        description:
          "Submit full catalog volumes and receive overnight deliveries through secure transfer.",
      },
    ],
  },
};
