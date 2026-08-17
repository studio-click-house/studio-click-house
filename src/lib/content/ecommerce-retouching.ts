import { previewMedia } from "$lib/content/media";
import type { ServicePageData } from "$lib/types/service-detail";

const ecommerceRetouchingMedia = {
  heroPackshot: {
    src: "https://images.pexels.com/photos/10928896/pexels-photo-10928896.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "E-commerce cosmetic product packshot retouched to pure marketplace standards",
    width: 1800,
    height: 2400,
  },
  heroFootwear: {
    src: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Footwear packshot with clean white background and realistic contact shadow",
    width: 1600,
    height: 2000,
  },
  heroWatch: {
    src: "https://images.pexels.com/photos/11064129/pexels-photo-11064129.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Luxury watch with dust and scratch cleanup for online store listing",
    width: 1600,
    height: 2000,
  },
  introDust: {
    src: "https://images.pexels.com/photos/9496254/pexels-photo-9496254.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Sub-pixel dust, fingerprint, and scratch cleanup on glass bottle",
    width: 1600,
    height: 2000,
  },
  introAlignment: {
    src: "https://images.pexels.com/photos/12352170/pexels-photo-12352170.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Batch margin, crop, and vertical axis alignment across product line",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "https://images.pexels.com/photos/9496254/pexels-photo-9496254.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Raw studio product shot with micro-dust, scuffs, and uneven background tone",
    width: 1400,
    height: 1800,
  },
  comparisonRetouched: {
    src: "https://images.pexels.com/photos/11711811/pexels-photo-11711811.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Finished e-commerce packshot on pure white with clean reflections and balanced color",
    width: 1400,
    height: 1800,
  },
  audienceRetailers: {
    src: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "E-commerce operations manager updating high-volume online catalog",
    width: 1600,
    height: 2000,
  },
} as const;

export const ecommerceRetouchingPage: ServicePageData = {
  slug: "ecommerce-retouching",
  seo: {
    title:
      "E-Commerce Product Retouching Service | High-Volume Catalog Editing — Studio Click House",
    description:
      "High-volume e-commerce product image retouching by Studio Click House. Dust & scratch removal, white background compliance, color matching, and 24/7 overnight batch delivery.",
  },
  hero: {
    title: "Ecommerce",
    titleAccent: "Retouching.",
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
      "In modern digital retail, your product photography is your salesperson. E-commerce retouching cleans up studio imperfections—micro-dust, sensor spots, scuffs, shipping creases, and reflections—while standardizing crop dimensions, margins, and color across thousands of SKUs. Our 24/7 production studio operates multi-shift teams to deliver flawless, conversion-optimized visuals that lower return rates and build customer trust.",
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
        media: previewMedia.perfumeStillLife,
      },
    ],
  },
  beforeAfter: {
    heading: "See the catalog-ready transformation.",
    description:
      "Drag the slider to inspect how raw studio packshots are polished, cleaned of dust, and matched to strict marketplace guidelines.",
    beforeSrc: ecommerceRetouchingMedia.comparisonOriginal.src,
    beforeAlt: ecommerceRetouchingMedia.comparisonOriginal.alt,
    afterSrc: ecommerceRetouchingMedia.comparisonRetouched.src,
    afterAlt: ecommerceRetouchingMedia.comparisonRetouched.alt,
    beforeLabel: "Raw capture",
    afterLabel: "Marketplace ready",
    width: ecommerceRetouchingMedia.comparisonRetouched.width,
    height: ecommerceRetouchingMedia.comparisonRetouched.height,
    caption: "Drag to compare · E-commerce product cleanup",
  },
  showcase: {
    heading: "Engineered to scale with your retail volume.",
    description:
      "With over 150+ trained artists operating around the clock in Dhaka, we effortlessly scale to handle 2,000+ complex product edits per day during peak catalog and holiday seasons.",
    stats: [
      { value: "2,000+", label: "Images retouched per 24 hours" },
      { value: "100%", label: "Amazon & Shopify guideline compliance" },
      { value: "0.1%", label: "Lowest revision rate in the industry" },
    ],
    gallery: [
      {
        src: previewMedia.perfumeShadow.src,
        alt: "Perfume product on pure white with natural ground shadow",
        width: previewMedia.perfumeShadow.width,
        height: previewMedia.perfumeShadow.height,
        caption: "Packshot on pure white",
      },
      {
        src: previewMedia.jewelryMacro.src,
        alt: "Jewelry macro showing polished metal surfaces and sparkling gem facets",
        width: previewMedia.jewelryMacro.width,
        height: previewMedia.jewelryMacro.height,
        caption: "Luxury accessory cleanup",
      },
      {
        src: previewMedia.photoEditingShowcase.src,
        alt: "Fashion garment line showing consistent lighting and wrinkle removal",
        width: previewMedia.photoEditingShowcase.width,
        height: previewMedia.photoEditingShowcase.height,
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
          src: "https://images.pexels.com/photos/10928896/pexels-photo-10928896.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Cosmetic product catalog retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ec-footwear",
        title: "Footwear & Sneaker Lines",
        category: "Footwear",
        technique: "Sole Clean, Shape Symmetry & Drop Shadow",
        media: {
          src: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Sneaker e-commerce retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ec-apparel",
        title: "Apparel & Ghost Mannequin Lines",
        category: "Fashion",
        technique: "Wrinkle Smoothing & Inner Collar Joint",
        media: {
          src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Apparel e-commerce catalog image",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ec-accessories",
        title: "Leather Goods & Bags",
        category: "Accessories",
        technique: "Hardware Polishing & Leather Grain Preservation",
        media: {
          src: "https://images.pexels.com/photos/11064129/pexels-photo-11064129.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Leather accessory product retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ec-fragrance",
        title: "Luxury Fragrance & Glassware",
        category: "Fragrance",
        technique: "Refraction Control & Specular Highlight Painting",
        media: {
          src: "https://images.pexels.com/photos/18302102/pexels-photo-18302102.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Perfume bottle e-commerce packshot",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ec-electronics",
        title: "Consumer Electronics",
        category: "Tech",
        technique: "Matte Texture & Bezel Cleanup",
        media: {
          src: "https://images.pexels.com/photos/37848029/pexels-photo-37848029.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Electronics product listing image",
          width: 1200,
          height: 1600,
        },
      },
    ],
  },
  features: {
    heading: "Why retail leaders scale with Studio Click House",
    items: [
      {
        icon: "CheckCircle2",
        title: "Marketplace Compliance Guaranteed",
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
        media: previewMedia.photoEditingShowcase,
      },
      {
        title: "Commercial Catalog Studios",
        description:
          "Scale your production throughput overnight by delegating high-volume cleanup and clipping work to our dedicated 24/7 floor.",
        media: previewMedia.editingWorkspace,
      },
    ],
  },
  faqs: [
    {
      question: "How do you guarantee batch consistency across thousands of SKUs?",
      answer:
        "We establish custom brand style guides for every client, documenting exact crop percentages, margin sizes, shadow softness, and color profiles. Automated verification scripts and senior QC managers verify that every file adheres strictly to these parameters.",
    },
    {
      question: "What is your standard turnaround time for a 1,000-image batch?",
      answer:
        "Standard batches of 500 to 1,000 images are delivered within 24 to 36 hours. For ongoing enterprise partnerships, we allocate dedicated artist pods operating 24/7 to guarantee consistent daily throughput.",
    },
    {
      question: "Can you provide files formatted for multiple marketplaces?",
      answer:
        "Yes. We can deliver multiple export formats per SKU—such as square 2000x2000px on pure white for Amazon, 4:5 vertical crops for social storefronts, and transparent PNGs for banner compositing.",
    },
    {
      question: "Do you offer shadow creation as part of e-commerce retouching?",
      answer:
        "Yes, we can preserve the original studio shadow, create a soft drop shadow, or add an elegant reflection shadow beneath the product.",
    },
    {
      question: "How do we get started with a trial batch?",
      answer:
        "Simply send us 3 to 5 sample images along with your catalog guidelines. We will deliver free test edits within 24 hours so you can verify our quality firsthand.",
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
          "Deliver seasonal catalog collections with guaranteed overnight turnarounds.",
      },
    ],
  },
};
