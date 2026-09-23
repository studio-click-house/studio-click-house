import type { ServicePageData } from "$lib/types/service-detail";

const aiRetouchMedia = {
  heroFashion: {
    src: "/images/services/ai-retouch/hero-user-model-portrait.webp",
    alt: "Fashion model in a sculptural plum gown photographed in a pale studio",
    width: 1448,
    height: 1086,
  },
  heroScene: {
    src: "/images/services/ai-retouch/hero-user-model-scene.webp",
    alt: "Fashion model in a plum gown seated in a studio while a color reference is checked",
    width: 1448,
    height: 1086,
  },
  heroAiDistinctModel: {
    src: "/images/services/ai-retouch/hero-ai-distinct-model.webp",
    alt: "Curly-haired fashion model in a red dress against a pale studio backdrop",
    width: 1448,
    height: 1086,
  },
  introMasking: {
    src: "/images/services/ai-retouch/ai-ecommerce-masking.jpg",
    alt: "Sneaker outline showing detailed e-commerce subject masking",
    width: 1122,
    height: 1402,
  },
  introColor: {
    src: "/images/services/ai-retouch/ai-color-grading.jpg",
    alt: "Fashion portrait showing a digitally refined color grade",
    width: 1122,
    height: 1402,
  },
  introJewelry: {
    src: "/images/services/ai-retouch/ai-jewelry-retouching.jpg",
    alt: "Fine jewelry detail prepared for a high-resolution retouching pass",
    width: 1122,
    height: 1402,
  },
  comparisonOriginal: {
    src: "/images/services/ai-retouch/apparel-chloe-gown-color-shift-before.webp",
    alt: "Magenta evening gown before catalog color retouching",
    width: 1600,
    height: 2000,
  },
  comparisonRetouched: {
    src: "/images/services/ai-retouch/apparel-chloe-gown-color-shift-after.webp",
    alt: "The same evening gown after a dark color shift and cleanup",
    width: 1600,
    height: 2000,
  },
  showcaseBeauty: {
    src: "/images/services/ai-retouch/ai-beauty-retouching.jpg",
    alt: "Beauty portrait with mapped facial details for retouching",
    width: 1122,
    height: 1402,
  },
  showcaseFashion: {
    src: "/images/services/ai-retouch/ai-fashion-retouching.jpg",
    alt: "Editorial model image with AI-assisted fashion retouching details",
    width: 1122,
    height: 1402,
  },
  showcaseVideo: {
    src: "/images/services/ai-retouch/ai-video-editing.jpg",
    alt: "Editorial portrait surrounded by a digital video editing workflow",
    width: 1122,
    height: 1402,
  },
  galleryProduct: {
    src: "/images/services/ai-retouch/ai-product-compositing.jpg",
    alt: "Cosmetic bottle rendered within a composed product scene",
    width: 1122,
    height: 1402,
  },
  galleryCobalt: {
    src: "/images/services/ai-retouch/ai-model-cobalt.jpg",
    alt: "Generated fashion model wearing a cobalt evening gown",
    width: 896,
    height: 1200,
  },
  galleryMasking: {
    src: "/images/services/ai-retouch/ghost-mannequin-input.jpg",
    alt: "Green dress isolated on a ghost mannequin for apparel image preparation",
    width: 896,
    height: 1200,
  },
  galleryBeauty: {
    src: "/images/services/ai-retouch/beauty-editorial-glam-leopard-portrait-298-before.webp",
    alt: "Beauty editorial portrait with leopard styling prepared for retouching",
    width: 1500,
    height: 2000,
  },
  galleryApparel: {
    src: "/images/services/ai-retouch/ghost-mannequin-emerald.jpg",
    alt: "Emerald dress presented on a ghost mannequin against a clean backdrop",
    width: 896,
    height: 1200,
  },
  galleryEmerald: {
    src: "/images/services/ai-retouch/ai-model-emerald.jpg",
    alt: "Generated fashion model wearing an emerald evening gown",
    width: 896,
    height: 1200,
  },
  audienceBeauty: {
    src: "/images/services/ai-retouch/beauty-retouching.jpg",
    alt: "Beauty portrait receiving a makeup retouching pass",
    width: 1600,
    height: 900,
  },
  audienceFashion: {
    src: "/images/services/ai-retouch/jewelry-retouching.jpg",
    alt: "Close-up jewelry composition prepared for detail retouching",
    width: 1600,
    height: 900,
  },
  audienceCommerce: {
    src: "/images/services/ai-retouch/product-retouching.jpg",
    alt: "Product image prepared for an e-commerce catalog",
    width: 1600,
    height: 900,
  },
} as const;

export const aiRetouchPage: ServicePageData = {
  slug: "ai-retouch",
  seo: {
    title: "AI Photo Retouching | Studio Click House",
    description:
      "AI-assisted photo retouching with human quality control for background generation, cleanup, and high-volume e-commerce image processing.",
  },
  hero: {
    title: "AI-Assisted",
    titleAccent: "Retouching.",
    theme: "light",
    description:
      "Use AI-assisted workflows for seasonal catalogs, background synthesis, and bulk cleanup, with trained retouchers checking the output before delivery.",
    media: aiRetouchMedia.heroAiDistinctModel,
    mediaFit: "cover",
    supportingMedia: [aiRetouchMedia.heroFashion, aiRetouchMedia.heroScene],
  },
  intro: {
    heading: "What is human-in-the-loop AI retouching?",
    paragraphs: [
      "AI tools can introduce artifacts, invented details, and inconsistent color. Our AI-assisted workflow handles background replacement, bulk dust removal, and initial color passes; trained retouchers then check edges, skin texture, logos, and color before export.",
    ],
    stages: [
      {
        label: "Automated Neural Segmentation",
        description:
          "Custom AI models rapidly segment subjects, identify skin blemishes, and isolate complex foreground objects.",
        media: aiRetouchMedia.introMasking,
      },
      {
        label: "Contextual Background Synthesis",
        description:
          "Generate hyper-realistic studio, lifestyle, or textured backdrops that automatically match subject lighting and shadows.",
        media: aiRetouchMedia.introColor,
      },
      {
        label: "Master Artist Quality Control",
        description:
          "Senior human retouchers inspect every image under high magnification, hand-correcting any anomalies before export.",
        media: aiRetouchMedia.introJewelry,
      },
    ],
  },
  beforeAfter: {
    heading: "See the hybrid AI velocity.",
    description:
      "Compare a vivid evening-gown original with a dark catalog color shift, keeping the garment shape and folds consistent.",
    beforeSrc: aiRetouchMedia.comparisonOriginal.src,
    beforeAlt: aiRetouchMedia.comparisonOriginal.alt,
    afterSrc: aiRetouchMedia.comparisonRetouched.src,
    afterAlt: aiRetouchMedia.comparisonRetouched.alt,
    beforeLabel: "Original",
    afterLabel: "Retouched",
    width: aiRetouchMedia.comparisonRetouched.width,
    height: aiRetouchMedia.comparisonRetouched.height,
    caption: "Drag to compare · AI-assisted color shift",
  },
  showcase: {
    heading: "AI-assisted retouching for large catalogs",
    description:
      "When you need 5,000+ images processed in hours rather than weeks, our AI-assisted pipeline delivers exponential speed advantages without compromising artistic integrity.",
    stats: [
      { value: "5x", label: "Faster production turnaround" },
      { value: "10,000+", label: "Batch scaling capacity per drop" },
      { value: "100%", label: "Human artist quality verification" },
    ],
    gallery: [
      {
        ...aiRetouchMedia.showcaseBeauty,
        caption: "AI beauty retouching",
      },
      {
        ...aiRetouchMedia.showcaseFashion,
        caption: "AI fashion retouching",
      },
      {
        ...aiRetouchMedia.showcaseVideo,
        caption: "AI video workflow",
      },
    ],
  },
  gallery: {
    heading: "Selected AI-Assisted Projects",
    description:
      "Explore diverse applications of AI-powered background generation, smart object removal, rapid color shifting, and bulk catalog scaling.",
    items: [
      {
        id: "gallery-ai-staging",
        title: "Virtual Product Staging",
        category: "Product Staging",
        technique: "AI Environment Synthesis & Light Harmonization",
        media: {
          ...aiRetouchMedia.galleryProduct,
        },
      },
      {
        id: "gallery-ai-apparel",
        title: "Bulk Apparel Color Shifting",
        category: "Fast Fashion",
        technique: "Neural Swatch Shifting & Fabric Retention",
        media: {
          ...aiRetouchMedia.galleryCobalt,
        },
      },
      {
        id: "gallery-ai-cleanup",
        title: "Smart Distraction Removal",
        category: "Cleanup",
        technique: "Generative Fill & Texture Matching",
        media: {
          ...aiRetouchMedia.galleryMasking,
        },
      },
      {
        id: "gallery-ai-beauty",
        title: "High-Volume Beauty Prep",
        category: "Beauty",
        technique: "Neural Blemish Isolation + Manual Polish",
        media: {
          ...aiRetouchMedia.galleryBeauty,
        },
      },
      {
        id: "gallery-ai-packshot",
        title: "Automated Catalog Packaging",
        category: "E-Commerce",
        technique: "Batch White Balance & Contact Shadow",
        media: {
          ...aiRetouchMedia.galleryApparel,
        },
      },
      {
        id: "gallery-ai-creative",
        title: "Concept Art & Mood Styling",
        category: "Creative",
        technique: "Generative Atmosphere & Lighting LUTs",
        media: {
          ...aiRetouchMedia.galleryEmerald,
        },
      },
    ],
  },
  features: {
    heading: "The best of artificial intelligence and human artistry",
    items: [
      {
        icon: "Cpu",
        title: "Proprietary AI Architecture",
        description:
          "Our custom-trained neural models are tuned specifically on commercial product, jewelry, and fashion post-production datasets.",
      },
      {
        icon: "UserCheck",
        title: "100% Human Master Inspection",
        description:
          "Every single AI-processed asset is inspected and manually perfected by senior retouchers before leaving our studio.",
      },
      {
        icon: "Zap",
        title: "Sub-12 Hour Turnaround",
        description:
          "Slash turnaround times by up to 80% on massive seasonal volume drops, getting products onto storefronts days earlier.",
      },
      {
        icon: "Lock",
        title: "Air-Gapped Enterprise Security",
        description:
          "Your source media is processed on private, secure on-premise servers with strict NDA guarantees—never used for public model training.",
      },
      {
        icon: "Sparkles",
        title: "Realistic Shadow & Reflection Physics",
        description:
          "AI-synthesized scenes calculate accurate light falloff, ambient occlusion, and ground contact shadows tailored to the subject.",
      },
      {
        icon: "BadgePercent",
        title: "Cost-Efficient Bulk Rates",
        description:
          "Reduce manual work on high-volume catalogs and digital marketing batches.",
      },
    ],
  },
  audience: {
    heading: "Who benefits from this service?",
    items: [
      {
        title: "Fast-Fashion & High-Volume Retailers",
        description:
          "Process thousands of seasonal catalog SKUs overnight, slashing post-production costs while keeping presentation quality high.",
        media: aiRetouchMedia.audienceBeauty,
      },
      {
        title: "Digital Marketing & Ad Agencies",
        description:
          "Generate dozens of creative lifestyle background variations for social ads and A/B testing without costly location reshoots.",
        media: aiRetouchMedia.audienceFashion,
      },
      {
        title: "E-Commerce Aggregators & Brands",
        description:
          "Standardize thousands of supplier product images with automated alignment, shadow generation, and white-background compliance.",
        media: aiRetouchMedia.audienceCommerce,
      },
    ],
  },
  faqs: [
    {
      question: "How does human-in-the-loop AI retouching work?",
      answer:
        "AI-assisted tools handle background separation, bulk dust removal, and initial color alignment. Digital artists then review each file at high zoom and correct details such as fingers, hair, reflections, and logos.",
    },
    {
      question: "Are our client images used to train public AI models?",
      answer:
        "Never. All processing runs on our private, secure cloud infrastructure. Client files are protected by strict non-disclosure agreements (NDAs) and are never uploaded to public AI platforms or used for third-party model training.",
    },
    {
      question: "How does AI retouching compare in cost to manual retouching?",
      answer:
        "AI-assisted retouching typically reduces per-image production costs by 40% to 60% for high-volume batches (500+ images), while maintaining quality comparable to purely manual workflows.",
    },
    {
      question:
        "Can AI generate realistic lifestyle backgrounds for studio packshots?",
      answer:
        "Yes. We can place plain studio product photos into photorealistic kitchen, bathroom, outdoor, or luxury marble settings, matching the lighting angle, color temperature, and contact shadows.",
    },
    {
      question: "Can we test this with our own product batch?",
      answer:
        "Yes, send us up to 5 sample images, and our team will provide a complimentary test edit demonstrating both our AI processing speed and human QC polish.",
    },
  ],
  faqImages: [
    {
      src: "/images/services/ai-retouch/ai-ecommerce-masking.jpg",
      alt: "E-commerce product subject isolated for a consistent catalog background",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ai-retouch/ai-color-grading.jpg",
      alt: "AI color workflow preparing a fashion portrait for human review",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ai-retouch/ai-beauty-retouching.jpg",
      alt: "Beauty portrait prepared for an AI-assisted retouching pass",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ai-retouch/ai-product-compositing.jpg",
      alt: "Product scene composed for an AI-generated lifestyle background",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ai-retouch/ai-jewelry-retouching.jpg",
      alt: "Jewelry detail prepared for a retouching quality check",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
  ],
  cta: {
    heading: "Supercharge your post-production pipeline",
    description:
      "Send us a sample batch. Experience the speed of next-gen AI coupled with the quality of master retouchers.",
    steps: [
      {
        title: "Upload sample files",
        description:
          "Share up to 5 images with your background or enhancement instructions.",
      },
      {
        title: "Inspect AI + QC results",
        description:
          "Review our turnaround and edge quality before committing to a full batch.",
      },
      {
        title: "Scale enterprise volumes",
        description:
          "Process massive seasonal catalog drops with sub-12-hour turnaround.",
      },
    ],
  },
};
