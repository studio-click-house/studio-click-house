import type { ServicePageData } from "$lib/types/service-detail";

const colorCorrectionMedia = {
  heroProductMain: {
    src: "/images/services/product-services/color-correction-cobalt-serum-hero.png",
    alt: "Cobalt blue serum bottle photographed with accurate product color",
    width: 1122,
    height: 1402,
  },
  heroProduct: {
    src: "/images/services/product-services/product-food-cereal-granola-muesli-flatlay-berries-after.webp",
    alt: "Food product flatlay with corrected berry, grain, and neutral tones",
    width: 1600,
    height: 2000,
  },
  heroColorStudy: {
    src: "/images/services/product-services/product-paw-osteosupport-cats-packaging-bottle.webp",
    alt: "Pet care packaging with controlled label and product color",
    width: 1600,
    height: 2000,
  },
  introSerum: {
    src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-pink-cream-after.webp",
    alt: "Pink cosmetic cream product with neutral highlights and controlled shadows",
    width: 1600,
    height: 2000,
  },
  introCosmetics: {
    src: "/images/services/product-services/product-industrial-machinery-rack-server-cutout-after.webp",
    alt: "Industrial product with consistent color and neutral tonal detail",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-yellow-cream-before.webp",
    alt: "Cosmetic cream product before color correction",
    width: 1600,
    height: 2000,
  },
  comparisonCorrected: {
    src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-yellow-cream-after.webp",
    alt: "Cosmetic cream product after color correction",
    width: 1600,
    height: 2000,
  },
  audienceProduct: {
    src: "/images/services/product-services/product-furniture-scandinavian-round-stool-light-wood.webp",
    alt: "Light wood stool product with balanced material and color detail",
    width: 570,
    height: 570,
  },
} as const;

export const colorCorrectionPage: ServicePageData = {
  slug: "color-correction",
  seo: {
    title: "Product Photo Color Correction | SCHL",
    description:
      "Product photo color correction for e-commerce, catalogs, campaigns, and brand teams. Match white balance, exposure, skin tones, and product color across a series.",
  },
  hero: {
    title: "Color",
    titleAccent: "Correction.",
    theme: "light",
    titleWidth: "wide",
    description:
      "Correct white balance, exposure, and product color so a complete image set looks consistent across screens, marketplaces, and print.",
    media: colorCorrectionMedia.heroProductMain,
    supportingMedia: [
      colorCorrectionMedia.heroProduct,
      colorCorrectionMedia.heroColorStudy,
    ],
  },
  intro: {
    heading: "What is color correction?",
    paragraphs: [
      "Color correction sets a reliable base for a consistent image series. We adjust white balance, exposure, black and white points, contrast, and saturation for product, fashion, and campaign work.",
    ],
    stages: [
      {
        label: "Neutralize the source",
        description:
          "Correct white balance and exposure so the image begins from a clean, dependable base.",
        media: colorCorrectionMedia.introSerum,
      },
      {
        label: "Match the series",
        description:
          "Align hue, contrast, and product color across every frame in the collection.",
        media: colorCorrectionMedia.introCosmetics,
      },
      {
        label: "Finish for output",
        description:
          "Refine saturation and tonal range for the final marketplace, campaign, or screen.",
        media: {
          src: "/images/services/product-services/product-industrial-metal-storage-rack-shelving-after.webp",
          alt: "Industrial product with controlled contrast and consistent neutral color",
          width: 1600,
          height: 2000,
        },
      },
    ],
  },
  beforeAfter: {
    heading: "See the difference.",
    description:
      "Drag the slider to inspect how controlled color adjustment improves product tone, packaging color, and studio detail.",
    beforeSrc: colorCorrectionMedia.comparisonOriginal.src,
    beforeAlt: colorCorrectionMedia.comparisonOriginal.alt,
    afterSrc: colorCorrectionMedia.comparisonCorrected.src,
    afterAlt: colorCorrectionMedia.comparisonCorrected.alt,
    beforeLabel: "Original",
    afterLabel: "Color corrected",
    width: colorCorrectionMedia.comparisonCorrected.width,
    height: colorCorrectionMedia.comparisonCorrected.height,
    caption: "Drag to compare · Color transformation",
  },
  showcase: {
    heading: "Color correction for consistent image sets",
    description:
      "We combine calibrated hardware, trained artists, and a rigorous multi-step review process to deliver consistent, production-grade color correction across every project.",
    stats: [
      { value: "150+", label: "Trained digital artists working daily" },
      { value: "24/7", label: "Production capacity across time zones" },
      { value: "3-step", label: "Quality control on every image" },
    ],
    gallery: [
      {
        src: "/images/services/product-services/color-correction-coral-perfume-showcase.png",
        alt: "Coral perfume product with accurate color and controlled highlights",
        width: 1122,
        height: 1402,
        caption: "Product color balancing",
      },
      {
        src: "/images/services/jewelry/jewelry-westhill-organic-gold-band-ring-0122.webp",
        alt: "Gold jewelry product with accurate metal color reproduction",
        width: 1600,
        height: 2000,
        caption: "Jewelry color matching",
      },
      {
        src: "/images/services/bags-accessories/accessories-astral-designer-sunglasses-side-profile-after.webp",
        alt: "Sunglasses product with refined reflective color detail",
        width: 1600,
        height: 2000,
        caption: "Reflective product color finish",
      },
    ],
  },
  gallery: {
    heading: "Selected Work & Color Studies",
    description:
      "Selected color correction, skin-tone calibration, and image-series matching for brands and studios.",
    items: [
      {
        id: "gallery-food-product-tone-calibration",
        title: "Food Product & Tone Calibration",
        category: "Food Product",
        technique: "Selective Hue Matching",
        media: {
          src: "/images/services/product-services/product-food-editorial-pancake-breakfast-spread.webp",
          alt: "Food product flatlay with balanced color and tonal detail",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-cosmetics-packaging-harmonization",
        title: "Cosmetics & Packaging Harmonization",
        category: "Cosmetics",
        technique: "Packaging Tone Balancing",
        media: {
          src: "/images/services/product-services/product-furniture-scandinavian-wood-side-table-dark.webp",
          alt: "Furniture product with corrected wood tone and balanced color",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-pet-care-packaging-vibrancy",
        title: "Pet Care Packaging True-Match",
        category: "Packaging",
        technique: "Batch Saturation Matching",
        media: {
          src: "/images/services/product-services/product-paw-osteocare-small-dogs-chews-packaging-after.webp",
          alt: "Pet care packaging with matched label color and tonal consistency",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-luxury-jewelry-metal-lustre",
        title: "Fine Jewelry & Metal Lustre",
        category: "Jewelry",
        technique: "White-Balance & Specular Control",
        media: {
          src: "/images/services/jewelry/jewelry-emerald-cut-diamond-solitaire-gold-ring-after.webp",
          alt: "Gold jewelry product with corrected gemstone and metal color",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-leather-product-recolor",
        title: "Leather Product Tone Shifting",
        category: "Accessories",
        technique: "Material True-Match Recoloring",
        media: {
          src: "/images/services/bags-accessories/accessories-adele-black-leather-bag-01-after.webp",
          alt: "Leather bag product with preserved material texture and corrected tone",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-food-still-life-atmosphere",
        title: "Food Still Life & Atmosphere",
        category: "Still Life",
        technique: "Contrast & Ambient Grading",
        media: {
          src: "/images/services/product-services/product-harbour-early-learning-childcare-kit-flatlay-after.webp",
          alt: "Product kit still life with balanced ambient tones and natural color",
          width: 1600,
          height: 2000,
        },
      },
    ],
  },
  features: {
    heading: "Why choose our service?",
    items: [
      {
        icon: "Palette",
        title: "Expertise in Color Adjustment",
        description:
          "Our designers employ sophisticated techniques to enhance the hues, saturation, and balance of your images, elevating their overall appeal and ensuring they effectively convey the desired mood and message.",
      },
      {
        icon: "BadgeDollarSign",
        title: "Affordable & Flexible Pricing",
        description:
          "We offer competitive pricing tailored to each project, with attractive discounts for bulk orders. Our goal is to provide top-notch services that fit your budget.",
      },
      {
        icon: "ShieldCheck",
        title: "Commitment to Quality",
        description:
          "Quality is at the core of what we do. Our rigorous three-step quality control process ensures every image meets the highest standards of excellence.",
      },
      {
        icon: "Zap",
        title: "Swift Turnaround Times",
        description:
          "We know time is of the essence. Our team is dedicated to delivering your images quickly without compromising quality, keeping your projects on schedule.",
      },
      {
        icon: "TicketCheck",
        title: "Clear review process",
        description:
          "Customer satisfaction is our top priority. We are confident in our ability to exceed your expectations, offering a 100% money-back guarantee if you're not completely satisfied.",
      },
      {
        icon: "Headphones",
        title: "24/7 Dedicated Support",
        description:
          "Our production studio operates around the clock. Whether you have custom color instructions, urgent volume batches, or revisions, our team is always available to help.",
      },
    ],
  },
  audience: {
    heading: "Who benefits from this service?",
    items: [
      {
        title: "Photographers",
        description:
          "To get high-quality images, you need the right color balance. Professional color correction, brightness, contrast, and fine-tuning adjustments are key to making your images pop.",
        media: colorCorrectionMedia.audienceProduct,
      },
      {
        title: "Wedding Photography",
        description:
          "Stunning, high-quality photos capture the day's magic and create lasting memories. Where lighting conditions pose challenges, color correction transforms images into true works of art.",
        media: {
          src: "/images/services/jewelry/jewelry-by-charlotte-gold-chain-necklace-0092.webp",
          alt: "Jewelry product prepared for consistent tonal correction",
          width: 1600,
          height: 2000,
        },
      },
      {
        title: "E-commerce Products",
        description:
          "Platforms such as Amazon, Shopify, eBay, and Etsy all necessitate visually striking and impeccably edited photos to engage and captivate customers.",
        media: {
          src: "/images/services/bags-accessories/accessories-helen-kaminski-cheries-woven-hat-3586-after.webp",
          alt: "E-commerce accessory product with consistent color and reflective finish",
          width: 1600,
          height: 2000,
        },
      },
    ],
  },
  faqs: [
    {
      question:
        "What does the Color Correction service entail at Studio Click House?",
      answer:
        "Our Color Correction service involves fine-tuning the colors in your images to enhance their vibrancy, consistency, and overall appeal. We adjust hues, saturation, and balance to ensure your visuals align perfectly with your brand's aesthetic.",
    },
    {
      question:
        "How is the pricing structured for the Color Correction service?",
      answer:
        "Pricing is competitive and customized based on the specific needs of each project. We also provide discounts for bulk orders to offer cost-effective solutions for our clients.",
    },
    {
      question:
        "What is the usual turnaround time for the Color Correction service?",
      answer:
        "We prioritize quick delivery without compromising quality. Turnaround times are tailored to meet your scheduling needs, ensuring your projects stay on track.",
    },
    {
      question:
        "How does Studio Click House ensure the quality of its Color Correction service?",
      answer:
        "Every image goes through a three-step review for color, consistency, and export settings before delivery.",
    },
    {
      question:
        "Is there a satisfaction guarantee for the Color Correction service?",
      answer:
        "Yes, we offer a 100% money-back guarantee if you are not fully satisfied with our service. Ensuring your satisfaction is our utmost priority.",
    },
  ],
  faqImages: [
    {
      src: "/images/services/product-services/product-industrial-metal-storage-rack-shelving-before.webp",
      alt: "Outdoor metal shelving product before color correction",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/product-services/product-architectural-skylight-roof-window-section.webp",
      alt: "Architectural product with balanced neutral metal tones",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/jewelry/jewelry-oval-diamond-eternity-band-gold-after.webp",
      alt: "Gold jewelry product with controlled metal color and reflections",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/bags-accessories/accessories-mira-leather-belt-black-01-after.webp",
      alt: "Leather accessory with consistent reflective color finish",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/product-services/product-furniture-scandinavian-wood-dining-chair-natural.webp",
      alt: "Furniture product with neutral white balance and controlled contrast",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
  ],
  cta: {
    heading: "Need high-quality color correction?",
    description:
      "Studio Click House is one of the best Color Correction service providers. We deliver professional color correction at an affordable cost. Send us sample files and we will prepare a quote according to your requirements.",
    steps: [
      {
        title: "Send sample files",
        description:
          "Share your images, references, and delivery requirements.",
      },
      {
        title: "Review a test edit",
        description:
          "Approve the color correction style before full production.",
      },
      {
        title: "Receive final delivery",
        description: "Assets pass through our three-step QC before handoff.",
      },
    ],
  },
};
