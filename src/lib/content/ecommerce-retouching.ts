import type { ServicePageData } from "$lib/types/service-detail";

const ecommerceRetouchingMedia = {
  heroPackshot: {
    src: "/images/services/product-services/product-furniture-scandinavian-oak-chair-hero.png",
    alt: "Realistic light oak dining chair photographed for an e-commerce catalog",
    width: 1122,
    height: 1402,
  },
  heroFootwear: {
    src: "/images/services/bags-accessories/accessories-antony-morato-white-leather-sneakers-3285.webp",
    alt: "White leather sneakers prepared for a clean e-commerce catalog presentation",
    width: 1600,
    height: 2000,
  },
  heroWatch: {
    src: "/images/services/product-services/product-industrial-metal-storage-rack-shelving-after.webp",
    alt: "Industrial storage rack prepared as a clean e-commerce product listing",
    width: 1600,
    height: 2000,
  },
  introDust: {
    src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-pink-cream-before.webp",
    alt: "Raw cosmetic product image before dust, scuff, and surface cleanup",
    width: 1600,
    height: 2000,
  },
  introAlignment: {
    src: "/images/services/product-services/product-industrial-metal-storage-rack-shelving-after.webp",
    alt: "Industrial product cutout aligned with a consistent catalog crop and margin",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "/images/services/model-beauty/model-fashion-denim-jeans-tanktop-289-before.webp",
    alt: "Fashion model wearing a denim outfit before e-commerce model retouching",
    width: 1333,
    height: 2000,
  },
  comparisonRetouched: {
    src: "/images/services/model-beauty/model-fashion-denim-jeans-tanktop-289-after.webp",
    alt: "Fashion model wearing a denim outfit after e-commerce model retouching",
    width: 1333,
    height: 2000,
  },
  audienceRetailers: {
    src: "/images/services/product-services/product-food-cereal-granola-muesli-flatlay-berries-after.webp",
    alt: "Food product flatlay prepared for a consistent high-volume online catalog",
    width: 1600,
    height: 2000,
  },
} as const;

export const ecommerceRetouchingPage: ServicePageData = {
  slug: "ecommerce-retouching",
  seo: {
    title: "E-commerce Product Retouching | Studio Click House",
    description:
      "High-volume e-commerce product image retouching by Studio Click House. Dust & scratch removal, white background compliance, color matching, and 24/7 overnight batch delivery.",
  },
  hero: {
    title: "Ecommerce",
    titleAccent: "Retouching.",
    theme: "light",
    titleWidth: "wide",
    description:
      "High-capacity, high-conversion product retouching built for Amazon, Shopify, eBay, and luxury online retailers. We eliminate dust, scratches, and inconsistencies to deliver uniform, pristine catalog listings overnight.",
    media: ecommerceRetouchingMedia.heroPackshot,
    supportingMedia: [
      ecommerceRetouchingMedia.heroFootwear,
      ecommerceRetouchingMedia.heroWatch,
    ],
  },
  intro: {
    heading: "What is professional e-commerce retouching?",
    paragraphs: [
      "E-commerce retouching cleans dust, sensor spots, scuffs, creases, and unwanted reflections while standardizing crop, margins, and color across product SKUs. Our multi-shift production team supports large catalog batches and agreed deadlines.",
    ],
    stages: [
      {
        label: "Sub-Pixel Dust & Scuff Removal",
        description:
          "We clean product surfaces, remove lens flare artifacts, wipe away fingerprints, and repair micro-scratches.",
        media: ecommerceRetouchingMedia.introDust,
      },
      {
        label: "Marketplace Alignment & Margins",
        description:
          "Images are aligned to uniform vertical axes with standardized 85% image fills and pure white (#FFFFFF) backdrops.",
        media: ecommerceRetouchingMedia.introAlignment,
      },
      {
        label: "True-Color Swatch Verification",
        description:
          "We cross-reference product hues against physical color swatches to prevent customer returns caused by color discrepancy.",
        media: {
          src: "/images/services/product-services/product-food-cereal-granola-muesli-flatlay-berries-after.webp",
          alt: "Food product flatlay retouched with consistent color and clean presentation",
          width: 1600,
          height: 2000,
        },
      },
    ],
  },
  beforeAfter: {
    heading: "See the catalog-ready finish",
    description:
      "Drag the slider to inspect how a fashion model image is cleaned and refined for a consistent e-commerce catalog presentation.",
    beforeSrc: ecommerceRetouchingMedia.comparisonOriginal.src,
    beforeAlt: ecommerceRetouchingMedia.comparisonOriginal.alt,
    afterSrc: ecommerceRetouchingMedia.comparisonRetouched.src,
    afterAlt: ecommerceRetouchingMedia.comparisonRetouched.alt,
    beforeLabel: "Raw model image",
    afterLabel: "Catalog ready",
    width: ecommerceRetouchingMedia.comparisonRetouched.width,
    height: ecommerceRetouchingMedia.comparisonRetouched.height,
    caption: "Drag to compare · Fashion catalog retouching",
  },
  showcase: {
    heading: "Product retouching for retail volume",
    description:
      "With over 150+ trained artists operating around the clock in Dhaka, we effortlessly scale to handle 2,000+ complex product edits per day during peak catalog and holiday seasons.",
    stats: [
      { value: "2,000+", label: "Images retouched per 24 hours" },
      { value: "100%", label: "Amazon & Shopify guideline compliance" },
      { value: "0.1%", label: "Lowest revision rate in the industry" },
    ],
    gallery: [
      {
        src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-yellow-cream-after.webp",
        alt: "Yellow cosmetic product packshot with a clean catalog finish",
        width: 1600,
        height: 2000,
        caption: "Packshot on pure white",
      },
      {
        src: "/images/services/jewelry/jewelry-aquamarine-emerald-gold-ring-4030.webp",
        alt: "Retouched gemstone ring with polished metal and clear facets",
        width: 1600,
        height: 2000,
        caption: "Luxury accessory cleanup",
      },
      {
        src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-greenpoint-knit-cardigan-ice-blue-white.webp",
        alt: "Finished knit cardigan prepared for a consistent apparel catalog",
        width: 1600,
        height: 2000,
        caption: "Apparel catalog uniformity",
      },
    ],
  },
  gallery: {
    heading: "Selected E-Commerce Categories",
    description:
      "Explore high-volume retouching results across cosmetics, consumer electronics, footwear, apparel, and homeware.",
    items: [
      {
        id: "gallery-ec-cosmetics",
        title: "Cosmetics & Skincare Packshots",
        category: "Beauty",
        technique: "Glass Reflection & Label Alignment",
        media: {
          src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-pink-cream-after.webp",
          alt: "Cosmetic product catalog retouching",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-ec-footwear",
        title: "Footwear & Sneaker Lines",
        category: "Footwear",
        technique: "Sole Clean, Shape Symmetry & Drop Shadow",
        media: {
          src: "/images/services/bags-accessories/accessories-antony-morato-white-leather-sneakers-3285.webp",
          alt: "Sneaker e-commerce retouching",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-ec-apparel",
        title: "Apparel & Ghost Mannequin Lines",
        category: "Fashion",
        technique: "Wrinkle Smoothing & Inner Collar Joint",
        media: {
          src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-greenpoint-knit-cardigan-ice-blue-white.webp",
          alt: "Apparel e-commerce catalog image with a finished ghost mannequin presentation",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-ec-accessories",
        title: "Leather Goods & Bags",
        category: "Accessories",
        technique: "Hardware Polishing & Leather Grain Preservation",
        media: {
          src: "/images/services/bags-accessories/accessories-quinn-metallic-gold-bag-810-after.webp",
          alt: "Leather accessory product retouching",
          width: 1500,
          height: 2000,
        },
      },
      {
        id: "gallery-ec-fragrance",
        title: "Luxury Fragrance & Glassware",
        category: "Fragrance",
        technique: "Refraction Control & Specular Highlight Painting",
        media: {
          src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-yellow-cream-after.webp",
          alt: "Cosmetic bottle e-commerce packshot",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-ec-electronics",
        title: "Consumer Electronics",
        category: "Tech",
        technique: "Matte Texture & Bezel Cleanup",
        media: {
          src: "/images/services/product-services/product-industrial-machinery-rack-server-cutout-after.webp",
          alt: "Complex product cutout prepared for a catalog listing",
          width: 1600,
          height: 2000,
        },
      },
    ],
  },
  features: {
    heading: "Why e-commerce teams use Studio Click House",
    items: [
      {
        icon: "CheckCircle2",
        title: "Marketplace-ready exports",
        description:
          "100% compliant with Amazon, Shopify, Walmart, Target, and eBay specifications for pure white RGB(255,255,255) backdrops and aspect ratios.",
      },
      {
        icon: "Zap",
        title: "Overnight 24/7 Production Shifts",
        description:
          "Upload your daytime shoot files and receive retouched, catalog-formatted listings ready for upload before your morning coffee.",
      },
      {
        icon: "Sparkles",
        title: "Micro-Dust & Scratch Eradication",
        description:
          "We clean every surface, seam, and edge under high magnification so your products look brand-new and luxurious.",
      },
      {
        icon: "Maximize2",
        title: "Strict Sizing & Margin Uniformity",
        description:
          "Every product in a category receives identical alignment, margin percentage, and crop ratios for a clean, cohesive grid aesthetic.",
      },
      {
        icon: "ShieldCheck",
        title: "Two-Tier Quality Control",
        description:
          "Every batch passes an artist review and a senior QC director inspection before export to eliminate errors and revision lag.",
      },
      {
        icon: "BadgePercent",
        title: "Competitive High-Volume Pricing",
        description:
          "Tiered volume pricing designed to dramatically lower your per-SKU cost of content production while boosting conversion rates.",
      },
    ],
  },
  audience: {
    heading: "Who benefits from this service?",
    items: [
      {
        title: "Direct-to-Consumer Brands",
        description:
          "Create uniform, high-converting Shopify and custom storefront listings that establish consumer trust and drive add-to-cart clicks.",
        media: ecommerceRetouchingMedia.audienceRetailers,
      },
      {
        title: "Amazon & Marketplace Sellers",
        description:
          "Ensure your main and secondary product images pass strict marketplace compliance without risking listing suppression.",
        media: {
          src: "/images/services/product-services/product-harbour-early-learning-childcare-kit-flatlay-after.webp",
          alt: "Children's product kit presented as a clean marketplace flatlay",
          width: 1600,
          height: 2000,
        },
      },
      {
        title: "Commercial Catalog Studios",
        description:
          "Scale your production throughput overnight by delegating high-volume cleanup and clipping work to our dedicated 24/7 floor.",
        media: {
          src: "/images/services/product-services/product-industrial-metal-storage-rack-shelving-after.webp",
          alt: "Industrial product image prepared for a high-volume catalog",
          width: 1600,
          height: 2000,
        },
      },
    ],
  },
  faqs: [
    {
      question:
        "How do you guarantee batch consistency across thousands of SKUs?",
      answer:
        "We establish custom brand style guides for every client, documenting exact crop percentages, margin sizes, shadow softness, and color profiles. Automated verification scripts and senior QC managers verify that every file adheres strictly to these parameters.",
    },
    {
      question:
        "What is your standard turnaround time for a 1,000-image batch?",
      answer:
        "Standard batches of 500 to 1,000 images are delivered within 24 to 36 hours. For ongoing enterprise partnerships, we allocate dedicated artist pods operating 24/7 to guarantee consistent daily throughput.",
    },
    {
      question: "Can you provide files formatted for multiple marketplaces?",
      answer:
        "Yes. We can deliver multiple export formats per SKU—such as square 2000x2000px on pure white for Amazon, 4:5 vertical crops for social storefronts, and transparent PNGs for banner compositing.",
    },
    {
      question:
        "Do you offer shadow creation as part of e-commerce retouching?",
      answer:
        "Yes, we can preserve the original studio shadow, create a soft drop shadow, or add an elegant reflection shadow beneath the product.",
    },
    {
      question: "How do we get started with a trial batch?",
      answer:
        "Simply send us 3 to 5 sample images along with your catalog guidelines. We will deliver free test edits within 24 hours so you can verify our quality firsthand.",
    },
  ],
  faqImages: [
    {
      src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-yellow-cream-after.webp",
      alt: "Yellow cosmetic packshot with clean white-background retouching",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/bags-accessories/accessories-antony-morato-white-leather-sneakers-3285.webp",
      alt: "White leather sneakers prepared for a marketplace product listing",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-greenpoint-knit-cardigan-ice-blue-white.webp",
      alt: "Ice-blue cardigan prepared for a uniform apparel catalog",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/product-services/product-harbour-early-learning-childcare-kit-flatlay-after.webp",
      alt: "Children's product kit flatlay with a clean commercial finish",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/bags-accessories/accessories-quinn-metallic-gold-bag-810-after.webp",
      alt: "Metallic handbag retouched for a consistent accessories catalog",
      width: 1500,
      height: 2000,
      credit: "Studio Click House",
    },
  ],
  cta: {
    heading: "Scale your e-commerce catalog with zero friction",
    description:
      "Send us your sample images and catalog specifications. We will deliver a free trial edit and a custom volume rate within hours.",
    steps: [
      {
        title: "Send sample batch",
        description:
          "Upload up to 5 test images with your crop, margin, and background guidelines.",
      },
      {
        title: "Review trial listings",
        description:
          "Inspect our dust cleanup, white balance, and edge definition with zero commitment.",
      },
      {
        title: "Launch high-volume pipeline",
        description:
          "Keep seasonal catalog collections moving with agreed overnight turnaround windows.",
      },
    ],
  },
};
