import { previewMedia } from "$lib/content/media";
import type { ServicePageData } from "$lib/types/service-detail";

const editorialRetouchingMedia = {
  heroPortrait: {
    src: "https://images.pexels.com/photos/37233404/pexels-photo-37233404.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "High-end editorial beauty portrait with preserved natural skin texture and controlled highlights",
    width: 1800,
    height: 2400,
  },
  heroFashion: {
    src: "https://images.pexels.com/photos/2738173/pexels-photo-2738173.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "High-fashion model in designer garment with refined magazine-grade color grading",
    width: 1600,
    height: 2000,
  },
  heroMonochrome: {
    src: "https://images.pexels.com/photos/24972993/pexels-photo-24972993.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Monochrome editorial portrait highlighting dramatic light sculpting and contrast",
    width: 1600,
    height: 2000,
  },
  introSkin: {
    src: "https://images.pexels.com/photos/3762467/pexels-photo-3762467.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Macro beauty shot showing frequency separation with authentic pore detail",
    width: 1600,
    height: 2000,
  },
  introHair: {
    src: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Editorial hair styling with meticulous flyaway strand cleanup and shine sculpting",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "https://images.pexels.com/photos/3762467/pexels-photo-3762467.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Raw beauty portrait with uneven studio lighting, blemishes, and flyaway hairs",
    width: 1400,
    height: 1800,
  },
  comparisonEditorial: {
    src: "https://images.pexels.com/photos/30231432/pexels-photo-30231432.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Finished magazine-grade beauty retouching with authentic skin pores and dodge and burn sculpting",
    width: 1400,
    height: 1800,
  },
  audienceAgencies: {
    src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Editorial art director and beauty photographer reviewing high-resolution proofs",
    width: 1600,
    height: 2000,
  },
} as const;

export const editorialRetouchingPage: ServicePageData = {
  slug: "editorial-retouching",
  seo: {
    title:
      "Editorial Retouching Service | High-End Beauty & Magazine Post-Production — Studio Click House",
    description:
      "High-end editorial photo retouching by Studio Click House. Frequency separation, micro dodge and burn, natural skin pore preservation, flyaway hair cleanup, and color grading for fashion magazines.",
  },
  hero: {
    title: "Editorial",
    titleAccent: "Retouching.",
    description:
      "Fine-art post-production for high-fashion campaigns, beauty close-ups, and magazine covers. We employ manual dodge & burn and frequency separation to elevate every frame while preserving genuine skin texture and lighting character.",
    media: editorialRetouchingMedia.heroPortrait,
    supportingMedia: [
      editorialRetouchingMedia.heroFashion,
      editorialRetouchingMedia.heroMonochrome,
    ],
  },
  intro: {
    heading: "What is high-end editorial retouching?",
    paragraphs: [
      "Editorial retouching is the pinnacle of commercial post-production. It demands an uncompromising artistic touch where every blemish, flyaway hair, and tonal irregularity is addressed without resorting to destructive blurs or artificial plastic smoothing. Using 16-bit non-destructive workflows, our master retouchers sculpt light, harmonize complex skin tones, and refine garments to meet the rigorous standards of global fashion publications and luxury advertising houses.",
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
        media: previewMedia.redStudioPortrait,
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
    heading: "Trusted by top fashion photographers & luxury campaigns.",
    description:
      "Our senior beauty artists collaborate with international commercial photographers, modeling agencies, and magazine editors to deliver cover-ready visuals under tight press deadlines.",
    stats: [
      { value: "16-bit", label: "Non-destructive Photoshop workflow" },
      { value: "0%", label: "Plastic skin blur (100% texture intact)" },
      { value: "10+ Yrs", label: "Specialized fashion studio experience" },
    ],
    gallery: [
      {
        src: previewMedia.studioPortrait.src,
        alt: "Studio fashion portrait with refined skin tones and soft specular highlights",
        width: previewMedia.studioPortrait.width,
        height: previewMedia.studioPortrait.height,
        caption: "High-fashion beauty grade",
      },
      {
        src: previewMedia.redStudioPortrait.src,
        alt: "Vivid editorial fashion story with saturated tonal styling",
        width: previewMedia.redStudioPortrait.width,
        height: previewMedia.redStudioPortrait.height,
        caption: "Color-driven campaign look",
      },
      {
        src: previewMedia.monochromePortrait.src,
        alt: "Dramatic black-and-white fashion portrait with sculpted shadows",
        width: previewMedia.monochromePortrait.width,
        height: previewMedia.monochromePortrait.height,
        caption: "Monochrome contrast study",
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
          src: "https://images.pexels.com/photos/3762467/pexels-photo-3762467.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Macro beauty skin retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ed-couture",
        title: "Haute Couture Runway Story",
        category: "Fashion",
        technique: "Garment Fabric & Crease Refinement",
        media: {
          src: "https://images.pexels.com/photos/2738173/pexels-photo-2738173.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "High fashion editorial retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ed-hair",
        title: "Hair Care & Strand Definition",
        category: "Hair Styling",
        technique: "Flyaway Removal & Volume Painting",
        media: {
          src: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Hair care campaign retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ed-portrait",
        title: "Fine-Art Editorial Portrait",
        category: "Editorial",
        technique: "Tone Curve & Color Grading",
        media: {
          src: "https://images.pexels.com/photos/30231432/pexels-photo-30231432.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Fine art editorial portrait grade",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ed-swimwear",
        title: "Location Campaign Lookbook",
        category: "Campaign",
        technique: "Atmospheric Lighting & Skin Tone Match",
        media: {
          src: "https://images.pexels.com/photos/18336955/pexels-photo-18336955.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Campaign location fashion retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-ed-monochrome",
        title: "Black & White Sculpted Series",
        category: "Monochrome",
        technique: "Tonal Zone Luminance Sculpting",
        media: {
          src: "https://images.pexels.com/photos/24972993/pexels-photo-24972993.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Monochrome beauty lighting retouching",
          width: 1200,
          height: 1600,
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
          "Partner with trusted high-end retouchers who understand light, anatomy, and how to execute your creative vision flawlessly.",
        media: editorialRetouchingMedia.audienceAgencies,
      },
      {
        title: "Magazine Editors & Art Directors",
        description:
          "Ensure cover stories and editorial spreads meet high-resolution print press standards with zero digital artifacts.",
        media: previewMedia.editingWorkspace,
      },
      {
        title: "Cosmetic & Luxury Fashion Brands",
        description:
          "Produce captivating campaign imagery that communicates prestige, flawless texture, and authentic brand elegance.",
        media: previewMedia.photoEditingShowcase,
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
  cta: {
    heading: "Elevate your next editorial campaign",
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
