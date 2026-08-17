import { previewMedia } from "$lib/content/media";
import type { ServicePageData } from "$lib/types/service-detail";

const aiRetouchMedia = {
  heroWorkspace: {
    src: "https://images.pexels.com/photos/37848029/pexels-photo-37848029.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "AI-assisted post-production workspace with multi-display neural network rendering",
    width: 1800,
    height: 2400,
  },
  heroModel: {
    src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "AI background synthesis and lighting adaptation on fashion model shoot",
    width: 1600,
    height: 2000,
  },
  heroProduct: {
    src: "https://images.pexels.com/photos/10928896/pexels-photo-10928896.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Automated batch background replacement with realistic contact shadows",
    width: 1600,
    height: 2000,
  },
  introNeural: {
    src: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Neural mask generation isolating complex edges and object geometry",
    width: 1600,
    height: 2000,
  },
  introHumanQC: {
    src: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Senior artist performing manual quality assurance and touchup on AI output",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Raw batch photo with plain studio background before AI environment synthesis",
    width: 1400,
    height: 1800,
  },
  comparisonAi: {
    src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Finished image with AI-synthesized contextual background and balanced studio lighting",
    width: 1400,
    height: 1800,
  },
  audienceBrands: {
    src: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "High-growth digital brand team scaling high-volume seasonal campaign assets",
    width: 1600,
    height: 2000,
  },
} as const;

export const aiRetouchPage: ServicePageData = {
  slug: "ai-retouch",
  seo: {
    title:
      "AI Retouching Service | Generative AI Speed + Master Artist QC — Studio Click House",
    description:
      "Next-generation AI-assisted image retouching by Studio Click House. Neural background generation, smart cleanup, and high-velocity batch processing verified by expert human retouchers.",
  },
  hero: {
    title: "AI-Assisted",
    titleAccent: "Retouching.",
    description:
      "The velocity of proprietary generative AI workflows paired with the precision of veteran retouchers. Accelerate seasonal catalog drops, background synthesis, and bulk cleanups at enterprise scale with guaranteed quality.",
    media: aiRetouchMedia.heroWorkspace,
    supportingMedia: [
      aiRetouchMedia.heroModel,
      aiRetouchMedia.heroProduct,
    ],
  },
  intro: {
    heading: "What is human-in-the-loop AI retouching?",
    paragraphs: [
      "Pure AI tools often produce unpredictable artifacts, hallucinated details, and inconsistent brand colors. Studio Click House pioneers a hybrid 'human-in-the-loop' AI pipeline: our custom-trained neural models execute high-speed tasks like background replacement, bulk dust removal, and initial color passes in seconds, after which our senior digital artists refine the edges, inspect skin texture, and verify color fidelity to ensure 100% commercial excellence.",
    ],
    stages: [
      {
        label: "Automated Neural Segmentation",
        description:
          "Custom AI models rapidly segment subjects, identify skin blemishes, and isolate complex foreground objects.",
        media: aiRetouchMedia.introNeural,
      },
      {
        label: "Contextual Background Synthesis",
        description:
          "Generate hyper-realistic studio, lifestyle, or textured backdrops that automatically match subject lighting and shadows.",
        media: previewMedia.cgiProductShowcaseV2,
      },
      {
        label: "Master Artist Quality Control",
        description:
          "Senior human retouchers inspect every image under high magnification, hand-correcting any anomalies before export.",
        media: aiRetouchMedia.introHumanQC,
      },
    ],
  },
  beforeAfter: {
    heading: "See the hybrid AI velocity.",
    description:
      "Drag the slider to inspect how a basic studio product shot is transformed into a rich lifestyle scene using AI background synthesis with human master lighting refinement.",
    beforeSrc: aiRetouchMedia.comparisonOriginal.src,
    beforeAlt: aiRetouchMedia.comparisonOriginal.alt,
    afterSrc: aiRetouchMedia.comparisonAi.src,
    afterAlt: aiRetouchMedia.comparisonAi.alt,
    beforeLabel: "Basic studio raw",
    afterLabel: "AI scene synthesis",
    width: aiRetouchMedia.comparisonAi.width,
    height: aiRetouchMedia.comparisonAi.height,
    caption: "Drag to compare · AI background synthesis & lighting",
  },
  showcase: {
    heading: "Unmatched velocity for massive catalog drops.",
    description:
      "When you need 5,000+ images processed in hours rather than weeks, our AI-assisted pipeline delivers exponential speed advantages without compromising artistic integrity.",
    stats: [
      { value: "5x", label: "Faster production turnaround" },
      { value: "10,000+", label: "Batch scaling capacity per drop" },
      { value: "100%", label: "Human artist quality verification" },
    ],
    gallery: [
      {
        src: previewMedia.photoEditingShowcase.src,
        alt: "Fashion model with AI-assisted background enhancement and natural skin texture",
        width: previewMedia.photoEditingShowcase.width,
        height: previewMedia.photoEditingShowcase.height,
        caption: "AI fashion enhancement",
      },
      {
        src: previewMedia.cgiProductShowcaseV2.src,
        alt: "Product shot with AI-generated lifestyle staging and realistic light refraction",
        width: previewMedia.cgiProductShowcaseV2.width,
        height: previewMedia.cgiProductShowcaseV2.height,
        caption: "AI lifestyle environment",
      },
      {
        src: previewMedia.editingWorkspace.src,
        alt: "Multi-shift digital artists monitoring AI pipeline batches on calibrated monitors",
        width: previewMedia.editingWorkspace.width,
        height: previewMedia.editingWorkspace.height,
        caption: "24/7 human quality assurance",
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
          src: "https://images.pexels.com/photos/10928896/pexels-photo-10928896.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Virtual product staging with AI",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ai-apparel",
        title: "Bulk Apparel Color Shifting",
        category: "Fast Fashion",
        technique: "Neural Swatch Shifting & Fabric Retention",
        media: {
          src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Apparel color shifting with AI",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ai-cleanup",
        title: "Smart Distraction Removal",
        category: "Cleanup",
        technique: "Generative Fill & Texture Matching",
        media: {
          src: "https://images.pexels.com/photos/37848029/pexels-photo-37848029.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Smart distraction removal with AI",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ai-beauty",
        title: "High-Volume Beauty Prep",
        category: "Beauty",
        technique: "Neural Blemish Isolation + Manual Polish",
        media: {
          src: "https://images.pexels.com/photos/3762467/pexels-photo-3762467.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Beauty prep with AI",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ai-packshot",
        title: "Automated Catalog Packaging",
        category: "E-Commerce",
        technique: "Batch White Balance & Contact Shadow",
        media: {
          src: "https://images.pexels.com/photos/18302102/pexels-photo-18302102.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Automated catalog packaging with AI",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ai-creative",
        title: "Concept Art & Mood Styling",
        category: "Creative",
        technique: "Generative Atmosphere & Lighting LUTs",
        media: {
          src: "https://images.pexels.com/photos/30231432/pexels-photo-30231432.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Creative mood styling with AI",
          width: 1200,
          height: 1600,
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
          "Unlock significant per-image cost savings for high-volume catalogs and digital marketing campaigns.",
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
        media: aiRetouchMedia.audienceBrands,
      },
      {
        title: "Digital Marketing & Ad Agencies",
        description:
          "Generate dozens of creative lifestyle background variations for social ads and A/B testing without costly location reshoots.",
        media: previewMedia.photoEditingShowcase,
      },
      {
        title: "E-Commerce Aggregators & Brands",
        description:
          "Standardize thousands of supplier product images with automated alignment, shadow generation, and white-background compliance.",
        media: previewMedia.editingWorkspace,
      },
    ],
  },
  faqs: [
    {
      question: "How does human-in-the-loop AI retouching work?",
      answer:
        "Our proprietary AI models perform the initial heavy lifting—such as background separation, bulk dust removal, and preliminary color alignment. Then, experienced digital artists review the file under high zoom, hand-correcting fine details (such as fingers, hair, reflections, and logos) to ensure flawless commercial quality.",
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
      question: "Can AI generate realistic lifestyle backgrounds for studio packshots?",
      answer:
        "Yes. We can place plain studio product photos into photorealistic kitchen, bathroom, outdoor, or luxury marble settings, matching the lighting angle, color temperature, and contact shadows.",
    },
    {
      question: "Can we test this with our own product batch?",
      answer:
        "Yes, send us up to 5 sample images, and our team will provide a complimentary test edit demonstrating both our AI processing speed and human QC polish.",
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
          "Review our rapid turnaround and flawless edge quality with zero risk.",
      },
      {
        title: "Scale enterprise volumes",
        description:
          "Process massive seasonal catalog drops with sub-12-hour turnaround.",
      },
    ],
  },
};
