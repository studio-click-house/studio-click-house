import type { ServicePageData } from "$lib/types/service-detail";

const ecommerceRetouchingMedia = {
  heroPackshot: {
    src: "/images/ecommerce-retouching/product-misolo-skincare-serum-dropper-cream-zen-stones.webp",
    alt: "Misolo skincare serum, cream, and dropper bottles styled with zen stones",
    width: 1600,
    height: 2000,
  },
  heroFootwear: {
    src: "/images/ecommerce-retouching/product-services-footwear-sneaker-retouch-04.webp",
    alt: "Pair of ivory pointed flats with textured toes prepared for an e-commerce catalog",
    width: 1122,
    height: 1402,
  },
  heroWatch: {
    src: "/images/ecommerce-retouching/accessories-luxury-turquoise-quilted-handbag-perfume-flatlay.webp",
    alt: "Turquoise quilted handbag and perfume styled together for an e-commerce flat lay",
    width: 1600,
    height: 2000,
  },
  introCatalogBoard: {
    src: "/images/ecommerce-retouching/ecommerce-retouching-fashion-catalog-detail-board.webp",
    alt: "Fashion catalog board showing a model with apparel, handbag, and footwear detail comparisons",
    width: 1122,
    height: 1402,
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
  productBefore: {
    src: "/images/ecommerce-retouching/accessories-quinn-metallic-gold-bag-01-before.webp",
    alt: "Metallic gold handbag before product retouching",
    width: 1500,
    height: 1875,
  },
  productAfter: {
    src: "/images/ecommerce-retouching/accessories-quinn-metallic-gold-bag-01-after.webp",
    alt: "Metallic gold handbag after product retouching",
    width: 1500,
    height: 1875,
  },
  shadowBefore: {
    src: "/images/ecommerce-retouching/product-services-drop-shadow-ricin-bio-bottle-before.webp",
    alt: "Ricin bio bottle before drop shadow retouching",
    width: 1600,
    height: 2000,
  },
  shadowAfter: {
    src: "/images/ecommerce-retouching/product-services-drop-shadow-ricin-bio-bottle-after.webp",
    alt: "Ricin bio bottle after drop shadow retouching",
    width: 1600,
    height: 2000,
  },
  packshotBefore: {
    src: "/images/ecommerce-retouching/product-services-commercial-packshot-retouch-before.webp",
    alt: "Commercial product packshot before high-end retouching",
    width: 1600,
    height: 2000,
  },
  packshotAfter: {
    src: "/images/ecommerce-retouching/product-services-commercial-packshot-retouch-after.webp",
    alt: "Commercial product packshot after high-end retouching",
    width: 1600,
    height: 2000,
  },
  maskingBefore: {
    src: "/images/ecommerce-retouching/product-services-masking-fashion-jacket-before.webp",
    alt: "Fashion jacket before image masking and edge isolation",
    width: 1600,
    height: 2000,
  },
  maskingAfter: {
    src: "/images/ecommerce-retouching/product-services-masking-fashion-jacket-after.webp",
    alt: "Fashion jacket after image masking and edge isolation",
    width: 1600,
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
    mediaFit: "cover",
    aspectRatio: "4/5",
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
        media: ecommerceRetouchingMedia.introCatalogBoard,
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
    heading: "E-commerce model retouching",
    description:
      "Compare the original fashion image with its polished catalog version, keeping the garment and model presentation consistent.",
    bullets: [
      "Preserve natural skin texture and garment detail",
      "Refine folds, fit, and color for catalog consistency",
      "Keep model imagery cohesive across product listings",
    ],
    beforeSrc: ecommerceRetouchingMedia.comparisonOriginal.src,
    beforeAlt: ecommerceRetouchingMedia.comparisonOriginal.alt,
    afterSrc: ecommerceRetouchingMedia.comparisonRetouched.src,
    afterAlt: ecommerceRetouchingMedia.comparisonRetouched.alt,
    beforeLabel: "Before",
    afterLabel: "After",
    width: ecommerceRetouchingMedia.comparisonRetouched.width,
    height: ecommerceRetouchingMedia.comparisonRetouched.height,
    layout: "cards",
    textPosition: "right",
  },
  showcase: {
    heading: "E-commerce product retouching",
    description:
      "Clean product surfaces, refine metallic finishes, and preserve material detail for consistent e-commerce catalogs.",
    bullets: [
      "Remove surface marks while preserving material texture",
      "Refine metallic highlights and product color",
      "Keep catalog framing and presentation consistent",
    ],
    theme: "light",
    beforeAfter: {
      before: { ...ecommerceRetouchingMedia.productBefore, label: "Before" },
      after: { ...ecommerceRetouchingMedia.productAfter, label: "After" },
    },
  },
  additionalBeforeAfter: [
    {
      sectionId: "ecommerce-retouching-shadow-comparison",
      heading: "Natural drop shadow retouching",
      description:
        "Add a soft, realistic grounding shadow to product packshots while keeping the bottle, label, and background clean.",
      bullets: [
        "Add a soft, realistic contact shadow",
        "Keep the bottle and label details clear",
        "Ground the product without distracting from it",
      ],
      beforeSrc: ecommerceRetouchingMedia.shadowBefore.src,
      beforeAlt: ecommerceRetouchingMedia.shadowBefore.alt,
      afterSrc: ecommerceRetouchingMedia.shadowAfter.src,
      afterAlt: ecommerceRetouchingMedia.shadowAfter.alt,
      beforeLabel: "Before",
      afterLabel: "After",
      width: ecommerceRetouchingMedia.shadowAfter.width,
      height: ecommerceRetouchingMedia.shadowAfter.height,
      layout: "cards",
      textPosition: "right",
    },
    {
      sectionId: "ecommerce-retouching-high-end-comparison",
      heading: "High-end retouching",
      description:
        "Polish commercial packshots with careful cleanup, balanced lighting, and refined detail while preserving the product’s natural form.",
      bullets: [
        "Balance highlights and surface detail",
        "Clean minor marks and distracting reflections",
        "Preserve the product’s natural shape and color",
      ],
      beforeSrc: ecommerceRetouchingMedia.packshotBefore.src,
      beforeAlt: ecommerceRetouchingMedia.packshotBefore.alt,
      afterSrc: ecommerceRetouchingMedia.packshotAfter.src,
      afterAlt: ecommerceRetouchingMedia.packshotAfter.alt,
      beforeLabel: "Before",
      afterLabel: "After",
      width: ecommerceRetouchingMedia.packshotAfter.width,
      height: ecommerceRetouchingMedia.packshotAfter.height,
      layout: "cards",
      textPosition: "left",
    },
    {
      sectionId: "ecommerce-retouching-image-masking-comparison",
      heading: "Precise image masking",
      description:
        "Isolate the jacket with clean, accurate edges so it can be placed on a new background or prepared for catalog use.",
      bullets: [
        "Trace accurate edges around the jacket silhouette",
        "Preserve fine fabric details during isolation",
        "Prepare a clean cutout for new backgrounds",
      ],
      beforeSrc: ecommerceRetouchingMedia.maskingBefore.src,
      beforeAlt: ecommerceRetouchingMedia.maskingBefore.alt,
      afterSrc: ecommerceRetouchingMedia.maskingAfter.src,
      afterAlt: ecommerceRetouchingMedia.maskingAfter.alt,
      beforeLabel: "Before",
      afterLabel: "After",
      width: ecommerceRetouchingMedia.maskingAfter.width,
      height: ecommerceRetouchingMedia.maskingAfter.height,
      layout: "cards",
      textPosition: "right",
    },
  ],
  productTypes: [
    {
      id: "pink-chalk-shorts",
      code: "01",
      title: "Pink Chalk Shorts",
      subtitle: "Ghost mannequin apparel with balanced shape and clean fabric detail.",
      src: "/images/ecommerce-retouching/ghost-mannequin-academy-short-chalk-pink-after.webp",
      alt: "Pink chalk shorts finished with a ghost mannequin presentation",
    },
    {
      id: "white-leather-sneakers",
      code: "02",
      title: "White Leather Sneakers",
      subtitle: "Clean leather surfaces, seams, and edges for footwear catalogs.",
      src: "/images/ecommerce-retouching/accessories-antony-morato-white-leather-sneakers-3285.webp",
      alt: "White leather sneakers prepared for an e-commerce catalog",
    },
    {
      id: "designer-sunglasses",
      code: "03",
      title: "Designer Sunglasses",
      subtitle: "Preserve frame shape, lens tint, and controlled reflections.",
      src: "/images/ecommerce-retouching/accessories-astral-designer-sunglasses-side-profile-before.webp",
      alt: "Designer sunglasses shown in side profile before retouching",
    },
    {
      id: "black-trucker-hat",
      code: "04",
      title: "Black Trucker Hat",
      subtitle: "Show mesh, stitching, and brim shape with clear product detail.",
      src: "/images/ecommerce-retouching/accessories-josel-trucker-hat-black-01.webp",
      alt: "Black trucker hat presented for an e-commerce product listing",
    },
    {
      id: "skincare-cream-jars",
      code: "05",
      title: "Skincare Cream Jars",
      subtitle: "Refine packaging color and detail across a coordinated product set.",
      src: "/images/ecommerce-retouching/product-misolo-skincare-serum-bamboo-cream-jars-trio.webp",
      alt: "Misolo skincare serum and bamboo cream jars arranged as a product trio",
    },
    {
      id: "mens-tailored-coat",
      code: "06",
      title: "Men’s Tailored Coat",
      subtitle: "Present the coat silhouette and construction with natural shape.",
      src: "/images/ecommerce-retouching/ghost-mannequin-4m-mens-tailored-coat-007-after.webp",
      alt: "Men’s tailored coat finished with a ghost mannequin presentation",
    },
  ],
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
