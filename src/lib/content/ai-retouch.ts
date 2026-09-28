import type { ServicePageData } from "$lib/types/service-detail";

const aiRetouchMedia = {
  heroModelStripedKnit: {
    src: "/images/ai-retouch/hero-ai-fashion-model-striped-knit.webp",
    alt: "AI-generated fashion model in studio wearing a striped knit sweater and denim jeans with accessories",
    width: 1122,
    height: 1402,
  },
  heroGhostMannequinKnit: {
    src: "/images/ai-retouch/hero-ai-ghost-mannequin-striped-knit.webp",
    alt: "Hollow ghost mannequin apparel presentation of striped knit sweater and denim jeans",
    width: 1122,
    height: 1402,
  },
  heroFlatlayKnit: {
    src: "/images/ai-retouch/hero-ai-flatlay-apparel-accessories.webp",
    alt: "Complete flat lay apparel styling of striped knit sweater, denim jeans, sneakers, and handbag",
    width: 1122,
    height: 1402,
  },
  heroFashion: {
    src: "/images/ai-retouch/hero-user-model-portrait.webp",
    alt: "Fashion model in a sculptural plum gown photographed in a pale studio",
    width: 1448,
    height: 1086,
  },
  heroScene: {
    src: "/images/ai-retouch/hero-user-model-scene.webp",
    alt: "Fashion model in a plum gown seated in a studio while a color reference is checked",
    width: 1448,
    height: 1086,
  },
  heroAiDistinctModel: {
    src: "/images/ai-retouch/hero-ai-distinct-model.webp",
    alt: "Curly-haired fashion model in a red dress against a pale studio backdrop",
    width: 1448,
    height: 1086,
  },
  introMasking: {
    src: "/images/ai-retouch/ai-ecommerce-masking.jpg",
    alt: "Sneaker outline showing detailed e-commerce subject masking",
    width: 1122,
    height: 1402,
  },
  introColor: {
    src: "/images/ai-retouch/ai-color-grading.jpg",
    alt: "Fashion portrait showing a digitally refined color grade",
    width: 1122,
    height: 1402,
  },
  introJewelry: {
    src: "/images/ai-retouching/ai-retouching-coordinated-fashion-lookbook.webp",
    alt: "AI-styled model presenting a coordinated beige outfit with matching apparel and accessories",
    width: 1122,
    height: 1402,
  },
  comparisonOriginal: {
    src: "/images/ai-retouch/ai-generated-white-terrycloth-bucket-bag-before.webp",
    alt: "Physical product prototype with rope handle before generative AI terrycloth fabric synthesis",
    width: 1092,
    height: 1365,
  },
  comparisonRetouched: {
    src: "/images/ai-retouch/ai-generated-white-terrycloth-bucket-bag-after.webp",
    alt: "AI-generated white terrycloth bucket bag with authentic textile micro-fibers and studio lighting",
    width: 1086,
    height: 1358,
  },
  showcaseBeauty: {
    src: "/images/ai-retouch/ai-beauty-retouching.jpg",
    alt: "Beauty portrait with mapped facial details for retouching",
    width: 1122,
    height: 1402,
  },
  showcaseFashion: {
    src: "/images/ai-retouch/ai-fashion-retouching.jpg",
    alt: "Editorial model image with AI-assisted fashion retouching details",
    width: 1122,
    height: 1402,
  },
  showcaseVideo: {
    src: "/images/ai-retouch/ai-video-editing.jpg",
    alt: "Editorial portrait surrounded by a digital video editing workflow",
    width: 1122,
    height: 1402,
  },
  galleryProduct: {
    src: "/images/ai-retouch/ai-product-compositing.jpg",
    alt: "Cosmetic bottle rendered within a composed product scene",
    width: 1122,
    height: 1402,
  },
  galleryCobalt: {
    src: "/images/ai-retouch/ai-model-cobalt.jpg",
    alt: "Generated fashion model wearing a cobalt evening gown",
    width: 896,
    height: 1200,
  },
  galleryMasking: {
    src: "/images/ai-retouch/ghost-mannequin-input.jpg",
    alt: "Green dress isolated on a ghost mannequin for apparel image preparation",
    width: 896,
    height: 1200,
  },
  galleryBeauty: {
    src: "/images/ai-retouch/beauty-editorial-glam-leopard-portrait-298-before.webp",
    alt: "Beauty editorial portrait with leopard styling prepared for retouching",
    width: 1500,
    height: 2000,
  },
  galleryApparel: {
    src: "/images/ai-retouch/ghost-mannequin-emerald.jpg",
    alt: "Emerald dress presented on a ghost mannequin against a clean backdrop",
    width: 896,
    height: 1200,
  },
  galleryEmerald: {
    src: "/images/ai-retouch/ai-model-emerald.jpg",
    alt: "Generated fashion model wearing an emerald evening gown",
    width: 896,
    height: 1200,
  },
  showcaseBefore: {
    src: "/images/ai-retouch/ai-retouching-stationery-branding-mockup-09-before.webp",
    alt: "Green floral summer dress flat lay garment before AI on-model generation",
    width: 155,
    height: 194,
  },
  showcaseAfter: {
    src: "/images/ai-retouch/ai-retouching-stationery-branding-mockup-10-after.webp",
    alt: "Photorealistic AI fashion model presenting the green floral dress in a bright studio environment",
    width: 239,
    height: 299,
  },
  galleryFlatlay: {
    src: "/images/ai-retouch/apparel-tinycottons-heart-print-jumpsuit-flatlay-after.webp",
    alt: "Children's patterned jumpsuit finished flat lay presentation with symmetrical sleeves",
    width: 1600,
    height: 2000,
  },
  galleryRuby: {
    src: "/images/ai-retouch/ai-model-ruby.jpg",
    alt: "Generated fashion model wearing a ruby evening gown in a studio setting",
    width: 896,
    height: 1200,
  },
  audienceBeauty: {
    src: "/images/ai-retouch/beauty-retouching.jpg",
    alt: "Beauty portrait receiving a makeup retouching pass",
    width: 1600,
    height: 900,
  },
  audienceFashion: {
    src: "/images/ai-retouch/jewelry-retouching.jpg",
    alt: "Close-up jewelry composition prepared for detail retouching",
    width: 1600,
    height: 900,
  },
  audienceCommerce: {
    src: "/images/ai-retouch/product-retouching.jpg",
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
      "Accelerate fashion catalogs and apparel lookbooks with generative AI workflows. We transform flat lays and ghost mannequins into photorealistic on-model presentations with master human retouchers verifying every pixel.",
    media: aiRetouchMedia.heroModelStripedKnit,
    mediaFit: "cover",
    aspectRatio: "4/5",
    supportingMedia: [
      aiRetouchMedia.heroGhostMannequinKnit,
      aiRetouchMedia.heroFlatlayKnit,
    ],
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
        media: aiRetouchMedia.introJewelry,
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
        media: aiRetouchMedia.introMasking,
      },
    ],
  },
  beforeAfter: {
    heading: "Physical prototype to generative product packshot.",
    description:
      "Watch a rough cardboard cylinder prototype and taped cord handle transform into a production-ready white terrycloth bucket bag, generated with authentic textile micro-fibers, realistic volume, and soft studio contact shadows.",
    bullets: [
      "Generative 3D texture & micro-fiber textile synthesis",
      "Seamless integration with physical hardware & cord handles",
      "High-end commercial packshots without physical fabric sampling",
    ],
    beforeSrc: aiRetouchMedia.comparisonOriginal.src,
    beforeAlt: aiRetouchMedia.comparisonOriginal.alt,
    afterSrc: aiRetouchMedia.comparisonRetouched.src,
    afterAlt: aiRetouchMedia.comparisonRetouched.alt,
    beforeLabel: "Before",
    afterLabel: "After",
    showLabels: true,
    width: aiRetouchMedia.comparisonRetouched.width,
    height: aiRetouchMedia.comparisonRetouched.height,
    layout: "cards",
    textPosition: "right",
  },
  showcase: {
    heading: "From flat garment to photorealistic on-model presentation",
    description:
      "Transform flat-lay and ghost mannequin dress photography into lifelike on-model catalog imagery. Our generative AI engine produces realistic fashion models wearing your exact garments with authentic drape, natural pose, and balanced studio lighting.",
    bullets: [
      "Flat apparel to photorealistic on-model styling",
      "Accurate fabric drape, pattern alignment & natural posture",
      "High-volume catalog lookbooks without on-location model shoots",
    ],
    theme: "light",
    beforeAfter: {
      before: {
        src: aiRetouchMedia.showcaseBefore.src,
        alt: aiRetouchMedia.showcaseBefore.alt,
        width: aiRetouchMedia.showcaseBefore.width,
        height: aiRetouchMedia.showcaseBefore.height,
        label: "Before",
      },
      after: {
        src: aiRetouchMedia.showcaseAfter.src,
        alt: aiRetouchMedia.showcaseAfter.alt,
        width: aiRetouchMedia.showcaseAfter.width,
        height: aiRetouchMedia.showcaseAfter.height,
        label: "After",
      },
    },
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
          ...aiRetouchMedia.galleryFlatlay,
        },
      },
      {
        id: "gallery-ai-creative",
        title: "Concept Art & Mood Styling",
        category: "Creative",
        technique: "Generative Atmosphere & Lighting LUTs",
        media: {
          ...aiRetouchMedia.galleryRuby,
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
  productTypes: [
    {
      id: "model-handbag",
      code: "01",
      title: "Model & Handbag",
      subtitle: "Fashion imagery with natural fabric, pose, and product detail.",
      src: "/images/ai-retouching/model-with-leather-handbag.webp",
      alt: "Fashion model wearing a white top and carrying a brown leather handbag",
    },
    {
      id: "leather-handbag",
      code: "02",
      title: "Leather Handbag",
      subtitle: "Clean product presentation with refined shape and material detail.",
      src: "/images/ai-retouching/leather-handbag-product-retouch.webp",
      alt: "Brown leather handbag photographed against a clean white background",
    },
    {
      id: "skincare-products",
      code: "03",
      title: "Skincare Products",
      subtitle: "Topical bottles arranged as a coordinated product lineup.",
      src: "/images/services/product-services/product-nora-topicals-serum-spray-lineup-yellow-background.webp",
      alt: "Serum and spray skincare products arranged against a yellow background",
    },
    {
      id: "emerald-dress",
      code: "04",
      title: "Emerald Mannequin Dress",
      subtitle: "Apparel shape and garment details presented without a visible mannequin.",
      src: "/images/ai-retouching/ghost-mannequin-emerald.webp",
      alt: "Emerald green dress presented on a ghost mannequin against a clean background",
    },
    {
      id: "zebra-pump",
      code: "05",
      title: "Zebra Print Pump",
      subtitle: "Footwear retouching that preserves a bold patterned finish.",
      src: "/images/ai-retouching/zebra-print-pointed-pump.png",
      alt: "Black and white zebra-print pointed-toe pump on a white background",
    },
    {
      id: "feather-corset",
      code: "06",
      title: "Feather-Trim Corset",
      subtitle: "Detailed black corset styling with a textured feather trim.",
      src: "/images/ai-retouching/black-feather-trim-corset.png",
      alt: "Black corset with feather trim photographed against a dark background",
    },
  ],
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
      src: "/images/ai-retouch/ai-ecommerce-masking.jpg",
      alt: "E-commerce product subject isolated for a consistent catalog background",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    {
      src: "/images/ai-retouch/ai-color-grading.jpg",
      alt: "AI color workflow preparing a fashion portrait for human review",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    {
      src: "/images/ai-retouch/ai-beauty-retouching.jpg",
      alt: "Beauty portrait prepared for an AI-assisted retouching pass",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    {
      src: "/images/ai-retouch/ai-product-compositing.jpg",
      alt: "Product scene composed for an AI-generated lifestyle background",
      width: 1122,
      height: 1402,
      credit: "Studio Click House",
    },
    {
      src: "/images/ai-retouch/ai-jewelry-retouching.jpg",
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
