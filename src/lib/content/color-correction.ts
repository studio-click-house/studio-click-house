import { previewMedia } from "$lib/content/media";
import type { ServicePageData } from "$lib/types/service-detail";

const colorCorrectionMedia = {
  heroPortrait: {
    src: "https://images.pexels.com/photos/30231432/pexels-photo-30231432.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Fashion portrait shaped with vivid studio color and controlled skin tones",
    width: 1800,
    height: 2400,
  },
  heroProduct: {
    src: "https://images.pexels.com/photos/10928896/pexels-photo-10928896.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Cosmetic product photographed against a colorful studio arrangement",
    width: 1600,
    height: 2000,
  },
  heroColorStudy: {
    src: "https://images.pexels.com/photos/31142571/pexels-photo-31142571.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Editorial portrait illuminated with contrasting color light",
    width: 1600,
    height: 2000,
  },
  introSerum: {
    src: "https://images.pexels.com/photos/9496254/pexels-photo-9496254.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Serum bottle photographed with precise warm highlights and neutral shadows",
    width: 1600,
    height: 2000,
  },
  introCosmetics: {
    src: "https://images.pexels.com/photos/12352170/pexels-photo-12352170.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Cosmetic bottles arranged in a clean tonal product composition",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "/images/about/colorways/dress-color-original.jpg",
    alt: "Original studio fashion photograph before garment color correction",
    width: 1024,
    height: 1536,
  },
  comparisonCorrected: {
    src: "/images/about/colorways/dress-color-cobalt.webp",
    alt: "Studio fashion photograph after cobalt garment color correction",
    width: 1024,
    height: 1536,
  },
  audienceFashion: {
    src: "https://images.pexels.com/photos/18336955/pexels-photo-18336955.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Fashion model photographed against a vivid red studio background",
    width: 1600,
    height: 2200,
  },
} as const;

export const colorCorrectionPage: ServicePageData = {
  slug: "color-correction",
  seo: {
    title:
      "Color Correction Service | Professional Image Color Editing — Studio Click House",
    description:
      "Elevate the vibrancy and coherence of your images with Studio Click House's Color Correction service. Expert color adjustment for e-commerce, photography, and promotional materials.",
  },
  hero: {
    title: "Color",
    titleAccent: "Correction.",
    description:
      "Elevate the vibrancy and coherence of your images with precision color adjustment. Our expert team enhances every visual to align with your brand's aesthetic and meet production-grade standards.",
    media: colorCorrectionMedia.heroPortrait,
    supportingMedia: [
      colorCorrectionMedia.heroProduct,
      colorCorrectionMedia.heroColorStudy,
    ],
  },
  intro: {
    heading: "What is color correction?",
    paragraphs: [
      "Color correction is all about transforming your footage into an eye-catching masterpiece. Adjusting each clip to get a consistent look entails fine-tuning white balance, fixing exposure, balancing whites and blacks, and increasing contrast and saturation. Even minor adjustments can make a tremendous difference to the overall quality of your images.",
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
        media: previewMedia.videoColorGrading,
      },
    ],
  },
  beforeAfter: {
    heading: "See the difference.",
    description:
      "Drag the slider to inspect how controlled color adjustment changes the garment while preserving skin tone and studio detail.",
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
    heading: "Why we deliver the best results.",
    description:
      "We combine calibrated hardware, trained artists, and a rigorous multi-step review process to deliver consistent, production-grade color correction across every project.",
    stats: [
      { value: "150+", label: "Trained digital artists working daily" },
      { value: "24/7", label: "Production capacity across time zones" },
      { value: "3-step", label: "Quality control on every image" },
    ],
    gallery: [
      {
        src: previewMedia.photoEditingShowcase.src,
        alt: "Professional fashion portrait showcasing color grading and retouching quality",
        width: previewMedia.photoEditingShowcase.width,
        height: previewMedia.photoEditingShowcase.height,
        caption: "Editorial color grading",
      },
      {
        src: previewMedia.jewelryMacro.src,
        alt: "Jewelry macro photography with accurate color reproduction",
        width: previewMedia.jewelryMacro.width,
        height: previewMedia.jewelryMacro.height,
        caption: "Jewelry color matching",
      },
      {
        src: previewMedia.cgiProductShowcase.src,
        alt: "Luxury fragrance product with refined color and reflective detail",
        width: previewMedia.cgiProductShowcase.width,
        height: previewMedia.cgiProductShowcase.height,
        caption: "Reflective product finish",
      },
    ],
  },
  gallery: {
    heading: "Selected Work & Color Studies",
    description:
      "A curated lookbook of high-precision color correction, skin tone calibration, and series harmonization delivered for brands and studios.",
    items: [
      {
        id: "gallery-fashion-editorial",
        title: "Editorial Fashion & Tone Calibration",
        category: "Fashion",
        technique: "Selective Hue Matching",
        media: {
          src: "https://images.pexels.com/photos/2738173/pexels-photo-2738173.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Editorial fashion portrait with color corrected studio lights",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-beauty-skincare",
        title: "Beauty & Skin Tone Harmonization",
        category: "Beauty",
        technique: "Skin-Tone Balancing",
        media: {
          src: "https://images.pexels.com/photos/3762467/pexels-photo-3762467.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Female model skincare facial color correction and tone grading",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-cosmetics-vibrancy",
        title: "Cosmetics & Lip Shade True-Match",
        category: "Cosmetics",
        technique: "Batch Saturation Matching",
        media: {
          src: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Cosmetics product and beauty portrait with matched color vibrancy",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-luxury-jewelry",
        title: "Fine Jewelry & Metal Lustre",
        category: "Luxury",
        technique: "White-Balance & Specular Control",
        media: {
          src: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Luxury diamond ring and polished gemstone color enhancement",
          width: 1200,
          height: 800,
        },
      },
      {
        id: "gallery-garment-recolor",
        title: "Apparel Colorways & Fabric Shifting",
        category: "Apparel",
        technique: "Fabric True-Match Recoloring",
        media: {
          src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1800",
          alt: "Garment recolored with preserved fabric texture and shadow detail",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-fragrance-still-life",
        title: "Fragrance Still Life & Atmosphere",
        category: "Still Life",
        technique: "Contrast & Ambient Grading",
        media: {
          src: "https://images.pexels.com/photos/18302102/pexels-photo-18302102.jpeg?auto=compress&cs=tinysrgb&w=1800",
          alt: "Glass perfume still life with balanced ambient tones and reflection",
          width: 1200,
          height: 1600,
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
        title: "100% Money-Back Guarantee",
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
        media: colorCorrectionMedia.audienceFashion,
      },
      {
        title: "Wedding Photography",
        description:
          "Stunning, high-quality photos capture the day's magic and create lasting memories. Where lighting conditions pose challenges, color correction transforms images into true works of art.",
        media: previewMedia.editingWorkspace,
      },
      {
        title: "E-commerce Products",
        description:
          "Platforms such as Amazon, Shopify, eBay, and Etsy all necessitate visually striking and impeccably edited photos to engage and captivate customers.",
        media: previewMedia.cgiProductShowcaseV2,
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
        "We implement a meticulous three-step quality control process to ensure every image meets our high standards. Our team is committed to delivering exceptional quality in every project.",
    },
    {
      question:
        "Is there a satisfaction guarantee for the Color Correction service?",
      answer:
        "Yes, we offer a 100% money-back guarantee if you are not fully satisfied with our service. Ensuring your satisfaction is our utmost priority.",
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
