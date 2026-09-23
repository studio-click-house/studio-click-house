import type { ServicePageData } from "$lib/types/service-detail";

const editorialRetouchingMedia = {
  heroPortrait: {
    src: "/images/services/model-beauty/model-cue-chic-editorial-fashion-0161.webp",
    alt: "High-end editorial beauty portrait with preserved natural skin texture and controlled highlights",
    width: 1600,
    height: 2000,
  },
  heroFashion: {
    src: "/images/services/model-beauty/model-cue-designer-fashion-editorial-0137.webp",
    alt: "High-fashion model in designer garment with refined magazine-grade color grading",
    width: 1600,
    height: 2000,
  },
  heroMonochrome: {
    src: "/images/services/model-beauty/beauty-fashion-editorial-night-glam-057-after.webp",
    alt: "Editorial fashion portrait with neon lighting and polished makeup detail",
    width: 2000,
    height: 1500,
  },
  introSkin: {
    src: "/images/services/model-beauty/beauty-skincare-facial-cream-retouch-0097-after.webp",
    alt: "Macro beauty shot showing frequency separation with authentic pore detail",
    width: 2000,
    height: 1500,
  },
  introHair: {
    src: "/images/services/model-beauty/beauty-fashion-editorial-night-glam-057-after.webp",
    alt: "Editorial hair styling with flyaway cleanup and controlled shine",
    width: 2000,
    height: 1500,
  },
  comparisonOriginal: {
    src: "/images/services/model-beauty/beauty-portrait-close-up-skincare-retouch-0500-before.webp",
    alt: "Raw beauty portrait with uneven studio lighting, blemishes, and flyaway hairs",
    width: 2000,
    height: 1500,
  },
  comparisonEditorial: {
    src: "/images/services/model-beauty/beauty-portrait-close-up-skincare-retouch-0500-after.webp",
    alt: "Finished magazine-grade beauty retouching with authentic skin pores and dodge and burn sculpting",
    width: 2000,
    height: 1500,
  },
  audienceAgencies: {
    src: "/images/services/model-beauty/model-male-headshot-leather-jacket-2301-after.webp",
    alt: "Editorial art director and beauty photographer reviewing high-resolution proofs",
    width: 1333,
    height: 2000,
  },
} as const;

export const editorialRetouchingPage: ServicePageData = {
  slug: "editorial-retouching",
  seo: {
    title: "Editorial Photo Retouching | Studio Click House",
    description:
      "High-end editorial photo retouching by Studio Click House. Frequency separation, micro dodge and burn, natural skin pore preservation, flyaway hair cleanup, and color grading for fashion magazines.",
  },
  hero: {
    title: "Editorial",
    titleAccent: "Retouching.",
    theme: "light",
    titleWidth: "wide",
    description:
      "Photo retouching for fashion campaigns, beauty close-ups, and magazine covers. Manual dodge and burn and frequency separation refine each frame while keeping real skin texture and lighting character.",
    media: editorialRetouchingMedia.heroPortrait,
    supportingMedia: [
      editorialRetouchingMedia.heroFashion,
      editorialRetouchingMedia.heroMonochrome,
    ],
  },
  intro: {
    heading: "What is high-end editorial retouching?",
    paragraphs: [
      "Editorial retouching refines blemishes, flyaway hair, uneven tones, and garment details without flattening the image. Our artists use 16-bit non-destructive workflows, manual dodge and burn, and frequency separation to keep skin texture and lighting believable.",
    ],
    stages: [
      {
        label: "Frequency Separation & Blemish Cleanup",
        description:
          "We decouple high-frequency skin pores from low-frequency color tones to remove distractions without eroding texture.",
        media: editorialRetouchingMedia.introSkin,
      },
      {
        label: "Micro Dodge & Burn Light Sculpting",
        description:
          "Pixel-by-pixel luminance adjustments sculpt facial contours, highlight cheekbones, and balance skin transition areas.",
        media: editorialRetouchingMedia.introHair,
      },
      {
        label: "Color Harmonization & Mood Grading",
        description:
          "Editorial grade tones, color balance, and filmic contrast are applied in calibrated 16-bit ProPhoto/Adobe RGB color spaces.",
        media: {
          src: "/images/services/model-beauty/beauty-editorial-glam-makeup-retouch-0969-after.webp",
          alt: "Editorial makeup portrait with controlled color and contrast",
          width: 2000,
          height: 1500,
        },
      },
    ],
  },
  beforeAfter: {
    heading: "See the editorial finishing touch.",
    description:
      "Drag the slider to inspect how frequency separation and manual dodge & burn enhance beauty portraiture while keeping authentic skin pores 100% intact.",
    beforeSrc: editorialRetouchingMedia.comparisonOriginal.src,
    beforeAlt: editorialRetouchingMedia.comparisonOriginal.alt,
    afterSrc: editorialRetouchingMedia.comparisonEditorial.src,
    afterAlt: editorialRetouchingMedia.comparisonEditorial.alt,
    beforeLabel: "Raw capture",
    afterLabel: "Editorial finished",
    width: editorialRetouchingMedia.comparisonEditorial.width,
    height: editorialRetouchingMedia.comparisonEditorial.height,
    caption: "Drag to compare · High-end skin & lighting retouching",
  },
  showcase: {
    heading: "Editorial retouching for fashion and beauty teams",
    description:
      "Our senior beauty artists collaborate with international commercial photographers, modeling agencies, and magazine editors to deliver cover-ready visuals under tight press deadlines.",
    stats: [
      { value: "16-bit", label: "Non-destructive Photoshop workflow" },
      { value: "0%", label: "Plastic skin blur (100% texture intact)" },
      { value: "10+ Yrs", label: "Specialized fashion studio experience" },
    ],
    gallery: [
      {
        src: "/images/services/model-beauty/model-black-silk-floral-slip-dress-05.webp",
        alt: "Studio fashion portrait with refined skin tones and soft specular highlights",
        width: 1408,
        height: 2000,
        caption: "High-fashion beauty grade",
        objectPosition: "center top",
      },
      {
        src: "/images/services/model-beauty/beauty-fashion-neon-escalator-crystal-glam.webp",
        alt: "Vivid editorial fashion story with saturated tonal styling",
        width: 2000,
        height: 1500,
        caption: "Color-driven campaign look",
      },
      {
        src: "/images/services/model-beauty/beauty-editorial-glam-makeup-retouch-0969-after.webp",
        alt: "Close-up editorial beauty portrait with detailed eye makeup and refined skin texture",
        width: 2000,
        height: 1500,
        caption: "Editorial makeup and detail",
      },
    ],
  },
  gallery: {
    heading: "Selected Editorial Lookbooks",
    description:
      "Explore diverse editorial retouching projects spanning luxury beauty, haute couture fashion, hair styling, and male grooming.",
    items: [
      {
        id: "gallery-ed-beauty",
        title: "Macro Beauty & Lip Lustre",
        category: "Beauty",
        technique: "Micro Dodge & Burn + Specular Shaping",
        media: {
          src: "/images/services/model-beauty/beauty-editorial-glam-leopard-portrait-298-after.webp",
          alt: "Macro beauty skin retouching",
          width: 1500,
          height: 2000,
        },
      },
      {
        id: "gallery-ed-couture",
        title: "Haute Couture Runway Story",
        category: "Fashion",
        technique: "Garment Fabric & Crease Refinement",
        media: {
          src: "/images/services/model-beauty/model-michael-lo-sordo-ivory-couture-0393-after.webp",
          alt: "High fashion editorial retouching",
          width: 1333,
          height: 2000,
        },
      },
      {
        id: "gallery-ed-hair",
        title: "Hair Care & Strand Definition",
        category: "Hair Styling",
        technique: "Flyaway Removal & Volume Painting",
        media: {
          src: "/images/services/model-beauty/beauty-high-fashion-orchid-headpiece-portrait-before.webp",
          alt: "Hair care campaign retouching",
          width: 1500,
          height: 2000,
        },
      },
      {
        id: "gallery-ed-portrait",
        title: "Fine-Art Editorial Portrait",
        category: "Editorial",
        technique: "Tone Curve & Color Grading",
        media: {
          src: "/images/services/model-beauty/model-rachel-gilbert-designer-gown-0094.webp",
          alt: "Fine art editorial portrait grade",
          width: 1333,
          height: 2000,
        },
      },
      {
        id: "gallery-ed-swimwear",
        title: "Location Campaign Lookbook",
        category: "Campaign",
        technique: "Atmospheric Lighting & Skin Tone Match",
        media: {
          src: "/images/services/model-beauty/model-soleil-blue-resortwear-editorial-1308.webp",
          alt: "Campaign location fashion retouching",
          width: 1333,
          height: 2000,
        },
      },
      {
        id: "gallery-ed-monochrome",
        title: "Black & White Sculpted Series",
        category: "Monochrome",
        technique: "Tonal Zone Luminance Sculpting",
        media: {
          src: "/images/services/model-beauty/model-executive-headshot-male-gradient-bg-0033.webp",
          alt: "Monochrome beauty lighting retouching",
          width: 1333,
          height: 2000,
        },
      },
    ],
  },
  features: {
    heading: "The hallmarks of our editorial craft",
    items: [
      {
        icon: "Wand2",
        title: "100% Manual Dodge & Burn",
        description:
          "We use curve adjustment layers to paint micro-luminance variations by hand, creating natural 3D depth without skin flattening.",
      },
      {
        icon: "Eye",
        title: "Pore-Level Texture Preservation",
        description:
          "We never use generic blur plugins. Every single pore, skin highlight, and subtle texture variation remains crisp and tactile.",
      },
      {
        icon: "Layers",
        title: "16-Bit Non-Destructive Layer Stacks",
        description:
          "All retouching is organized on clearly labeled layers in 16-bit depth (Color, Dodge/Burn, Texture, Final Grade) for full auditability.",
      },
      {
        icon: "Sparkles",
        title: "Hair & Makeup Refinement",
        description:
          "We clean up rogue flyaway hairs, even out makeup blending, clean lipstick bleed, and enhance eye reflections with fine-art precision.",
      },
      {
        icon: "Palette",
        title: "Calibrated Color Matching",
        description:
          "Our EIZO-calibrated displays ensure accurate skintone reproduction across sRGB, Adobe RGB, Display P3, and CMYK press profiles.",
      },
      {
        icon: "Lock",
        title: "Strict NDA & Asset Security",
        description:
          "Unreleased lookbooks and embargoed campaign files are protected by end-to-end encryption and air-gapped storage protocols.",
      },
    ],
  },
  audience: {
    heading: "Who benefits from this service?",
    items: [
      {
        title: "Fashion & Beauty Photographers",
        description:
          "Work with retouchers who understand light, anatomy, and how to follow a creative brief.",
        media: editorialRetouchingMedia.audienceAgencies,
      },
      {
        title: "Magazine Editors & Art Directors",
        description:
          "Ensure cover stories and editorial spreads meet high-resolution print press standards with zero digital artifacts.",
        media: {
          src: "/images/services/model-beauty/model-female-headshot-white-blouse-0997-after.webp",
          alt: "Editorial portrait prepared for magazine proofing and art direction review",
          width: 1333,
          height: 2000,
        },
      },
      {
        title: "Cosmetic & Luxury Fashion Brands",
        description:
          "Produce campaign imagery with controlled texture, considered lighting, and a finish that fits the brand.",
        media: {
          src: "/images/services/model-beauty/model-rachel-gilbert-evening-dress-0081.webp",
          alt: "Luxury fashion campaign portrait with controlled texture and lighting",
          width: 1333,
          height: 2000,
        },
      },
    ],
  },
  faqs: [
    {
      question: "What is your philosophy on skin retouching?",
      answer:
        "We believe authentic skin texture is the hallmark of luxury photography. We never blur skin or use automated smoothing algorithms. Instead, we use micro dodge & burn and frequency separation to remove temporary blemishes while preserving every natural pore, freckle, and skin contour.",
    },
    {
      question: "Which file formats should I send?",
      answer:
        "For best editorial results, send uncompressed 16-bit RAW files (CR3, NEF, ARW, DNG) or 16-bit PSD/TIFF files. This gives our colorists maximum dynamic range for shadow recovery and color grading.",
    },
    {
      question: "Can you match the mood of a specific visual reference?",
      answer:
        "Yes. You can provide moodboards, lighting references, or tear sheets, and our team will match the grain, contrast, color temperature, and tonal palette of your creative direction.",
    },
    {
      question: "What is the turnaround time for an editorial story?",
      answer:
        "Editorial stories (6 to 20 frames) typically require 24 to 48 hours for first proofs. We offer expedited 24-hour turnaround for urgent press deadlines.",
    },
    {
      question: "Do you offer test edits on our RAW files?",
      answer:
        "Yes, we offer a complimentary test edit on 1 to 2 RAW files so you can review our skin texture fidelity and color styling before booking your project.",
    },
  ],
  faqImages: [
    {
      src: "/images/services/model-beauty/beauty-skincare-facial-cream-retouch-0097-before.webp",
      alt: "Beauty portrait before editorial skin retouching",
      width: 2000,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/model-beauty/model-cue-tailored-fashion-studio-0145.webp",
      alt: "Tailored fashion portrait prepared for an editorial lookbook",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/model-beauty/model-fashion-male-suit-street-editorial-after.webp",
      alt: "Editorial menswear portrait with refined garment texture and light",
      width: 1544,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/model-beauty/model-corporate-headshot-executive-male-3683-after.webp",
      alt: "Male portrait with natural skin texture and controlled tonal finish",
      width: 1333,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/model-beauty/model-soleil-blue-summer-fashion-1862.webp",
      alt: "Summer fashion editorial portrait with clean color and fabric detail",
      width: 1333,
      height: 2000,
      credit: "Studio Click House",
    },
  ],
  cta: {
    heading: "Prepare your next editorial campaign",
    description:
      "Send us your raw files and moodboard. Our senior retouchers will produce a complimentary test grade tailored to your art direction.",
    steps: [
      {
        title: "Send RAW files & reference",
        description:
          "Upload your 16-bit raw captures with your lighting and mood notes.",
      },
      {
        title: "Review high-res proofs",
        description:
          "Inspect our skin texture preservation and dodge & burn sculpting at 100% zoom.",
      },
      {
        title: "Publish cover-ready assets",
        description:
          "Receive layered 16-bit PSDs and calibrated output files ready for press.",
      },
    ],
  },
};
