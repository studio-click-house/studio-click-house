import { previewMedia } from "$lib/content/media";
import type { ServicePageData } from "$lib/types/service-detail";

const jewelryRetouchingMedia = {
  heroJewelry: {
    src: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Luxury diamond ring retouched with polished metal luster and sparkling gemstone clarity",
    width: 1800,
    height: 2400,
  },
  heroPearls: {
    src: "https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Pearl necklace photographed with clean specular reflections and delicate gradient shadows",
    width: 1600,
    height: 2000,
  },
  heroWatch: {
    src: "https://images.pexels.com/photos/11064129/pexels-photo-11064129.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Luxury gold chronograph retouched with brushed bezel detail and glare control",
    width: 1600,
    height: 2000,
  },
  introDiamond: {
    src: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Macro diamond facet contrast enhancement and rainbow spectral dispersion",
    width: 1600,
    height: 2000,
  },
  introMetal: {
    src: "https://images.pexels.com/photos/11064129/pexels-photo-11064129.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Polished gold and platinum metal smoothing with preserved reflections",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Raw jewelry macro shot showing sensor dust, micro-scratches, and dull metal reflections",
    width: 1400,
    height: 1800,
  },
  comparisonRetouched: {
    src: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Finished luxury jewelry retouch with crystal-clear diamonds, pristine gold luster, and soft shadow",
    width: 1400,
    height: 1800,
  },
  audienceJewelers: {
    src: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Luxury jewelry designer inspecting high-resolution gemstone details",
    width: 1600,
    height: 2000,
  },
} as const;

export const jewelryRetouchingPage: ServicePageData = {
  slug: "jewelry-retouching",
  seo: {
    title:
      "High-End Jewelry Retouching Service | Diamond & Gemstone Editing — Studio Click House",
    description:
      "Specialized jewelry photo retouching by Studio Click House. Macro diamond sparkle, gemstone clarity, gold & platinum polishing, focus stacking alignment, and reflection cleanup for luxury brands.",
  },
  hero: {
    title: "Jewelry",
    titleAccent: "Retouching.",
    description:
      "High-precision macro retouching for fine jewelry, luxury watches, and gemstones. We eliminate micro-dust, polish metals, balance specular reflections, and enhance diamond sparkle without losing natural authenticity.",
    media: jewelryRetouchingMedia.heroJewelry,
    supportingMedia: [
      jewelryRetouchingMedia.heroPearls,
      jewelryRetouchingMedia.heroWatch,
    ],
  },
  intro: {
    heading: "What is high-precision jewelry retouching?",
    paragraphs: [
      "Jewelry is the most technically challenging subject in commercial photography. Macro lenses reveal microscopic dust, scratches, camera reflections, and depth-of-field blur that can diminish the perceived value of a luxury piece. Our specialist jewelry artists clean and polish precious metals (yellow gold, white gold, rose gold, platinum), align focus stacks, enhance gemstone clarity, and balance light dispersion to make every diamond and gemstone gleam with brilliance.",
    ],
    stages: [
      {
        label: "Gemstone Clarity & Facet Polish",
        description:
          "We clean internal cloudiness, sharpen facet junctions, and balance light refraction across diamonds and precious stones.",
        media: jewelryRetouchingMedia.introDiamond,
      },
      {
        label: "Precious Metal Smoothing & Tone",
        description:
          "Scratches and porous metal textures are smoothed while preserving natural brushed and mirror reflection lines.",
        media: jewelryRetouchingMedia.introMetal,
      },
      {
        label: "Focus Stacking & Sparkle Control",
        description:
          "We blend multi-exposure focus stacks and add subtle, realistic sparkle highlights to make prongs and stones pop.",
        media: previewMedia.jewelryMacro,
      },
    ],
  },
  beforeAfter: {
    heading: "See the brilliant transformation.",
    description:
      "Drag the slider to inspect how macro dust, reflections, and dull metals are transformed into a sparkling, pristine luxury jewelry presentation.",
    beforeSrc: jewelryRetouchingMedia.comparisonOriginal.src,
    beforeAlt: jewelryRetouchingMedia.comparisonOriginal.alt,
    afterSrc: jewelryRetouchingMedia.comparisonRetouched.src,
    afterAlt: jewelryRetouchingMedia.comparisonRetouched.alt,
    beforeLabel: "Raw macro",
    afterLabel: "Luxury retouched",
    width: jewelryRetouchingMedia.comparisonRetouched.width,
    height: jewelryRetouchingMedia.comparisonRetouched.height,
    caption: "Drag to compare · Diamond & gold polishing",
  },
  showcase: {
    heading: "Trusted by fine jewelers & luxury watchmakers.",
    description:
      "From high-jewelry auction catalogs to online luxury storefronts, our dedicated jewelry specialists ensure every carat and curve reflects true craftsmanship.",
    stats: [
      { value: "500%+", label: "Magnification inspection during cleanup" },
      { value: "100%", label: "Authentic gemstone color preservation" },
      { value: "10+ Yrs", label: "Jewelry retouching studio specialization" },
    ],
    gallery: [
      {
        src: previewMedia.jewelryMacro.src,
        alt: "Macro diamond ring showing clean facet lines and balanced metal reflections",
        width: previewMedia.jewelryMacro.width,
        height: previewMedia.jewelryMacro.height,
        caption: "Diamond ring brilliance",
      },
      {
        src: previewMedia.jewelryDetail.src,
        alt: "Pearl necklace with smooth specular sheen and gradient drop shadow",
        width: previewMedia.jewelryDetail.width,
        height: previewMedia.jewelryDetail.height,
        caption: "Pearl sheen & reflection",
      },
      {
        src: previewMedia.perfumeStillLife.src,
        alt: "Luxury timepiece with polished gold case and crystal-clear sapphire glass",
        width: previewMedia.perfumeStillLife.width,
        height: previewMedia.perfumeStillLife.height,
        caption: "Timepiece metal & glass finish",
      },
    ],
  },
  gallery: {
    heading: "Selected Jewelry Projects",
    description:
      "Explore diverse jewelry retouching projects across diamond engagement rings, luxury watches, pearls, and colored gemstones.",
    items: [
      {
        id: "gallery-jw-ring",
        title: "Diamond Solitaire Engagement Ring",
        category: "Diamonds",
        technique: "Facet Sharpening & Prong Polish",
        media: {
          src: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Diamond solitaire ring macro retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-jw-pearls",
        title: "South Sea Pearl Necklace",
        category: "Pearls",
        technique: "Nacre Sheen & Specular Gradient",
        media: {
          src: "https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Pearl necklace luxury retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-jw-watch",
        title: "Luxury Gold Chronograph",
        category: "Watches",
        technique: "Dial Dusting, Hands & Bezel Polish",
        media: {
          src: "https://images.pexels.com/photos/11064129/pexels-photo-11064129.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Gold watch luxury retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-jw-gemstone",
        title: "Emerald & Sapphire Earrings",
        category: "Gemstones",
        technique: "Hue Saturation & Internal Inclusion Clean",
        media: {
          src: "https://images.pexels.com/photos/10928896/pexels-photo-10928896.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Colored gemstone earrings retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-jw-bracelet",
        title: "Platinum Tennis Bracelet",
        category: "Fine Jewelry",
        technique: "Multi-Prong Masking & Diamond Sparkle",
        media: {
          src: "https://images.pexels.com/photos/18302102/pexels-photo-18302102.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Tennis bracelet diamond retouching",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-jw-gold",
        title: "Handcrafted Gold Bangle",
        category: "Gold Goods",
        technique: "Surface Reflection Smoothing",
        media: {
          src: "https://images.pexels.com/photos/12352170/pexels-photo-12352170.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Gold bangle jewelry retouching",
          width: 1200,
          height: 1600,
        },
      },
    ],
  },
  features: {
    heading: "The anatomy of our jewelry retouching pipeline",
    items: [
      {
        icon: "Gem",
        title: "Gemstone Facet Sharpening",
        description:
          "We sharpen internal facet edges and balance spectral light dispersion to make stones look radiant and deep.",
      },
      {
        icon: "Sparkles",
        title: "Precious Metal Smoothing",
        description:
          "We eliminate casting pits, micro-scratches, and solder marks while preserving realistic brushed and high-polish reflections.",
      },
      {
        icon: "Focus",
        title: "Focus Stack Alignment",
        description:
          "We seamlessly blend multi-bracket focus shots to ensure edge-to-edge sharpness from front prongs to rear shank.",
      },
      {
        icon: "Sun",
        title: "Reflection & Glare Control",
        description:
          "We remove camera reflections, studio softbox glare, and dark shadows while maintaining natural metallic curvature.",
      },
      {
        icon: "Palette",
        title: "True Metal Color Calibration",
        description:
          "Accurate differentiation between 14k/18k yellow gold, rose gold, white gold, platinum, and sterling silver.",
      },
      {
        icon: "ShieldCheck",
        title: "Sub-Pixel Detail Inspection",
        description:
          "Senior jewelry directors inspect every file at 500% zoom before delivery to guarantee museum-grade polish.",
      },
    ],
  },
  audience: {
    heading: "Who benefits from this service?",
    items: [
      {
        title: "Fine Jewelry Brands & Designers",
        description:
          "Showcase high-value rings, necklaces, and bespoke pieces with the luxury elegance and sparkle your craftsmanship deserves.",
        media: jewelryRetouchingMedia.audienceJewelers,
      },
      {
        title: "Luxury Watchmakers & Dealers",
        description:
          "Present chronographs, bezels, and sapphire dials with pristine reflection balance and immaculate legibility.",
        media: previewMedia.photoEditingShowcase,
      },
      {
        title: "Auction Houses & Catalog Publishers",
        description:
          "Produce high-resolution print catalog images that convey gemstone purity, carat value, and authentic provenance.",
        media: previewMedia.editingWorkspace,
      },
    ],
  },
  faqs: [
    {
      question: "How do you handle macro lens focus stacking?",
      answer:
        "We accept multi-frame focus brackets. Our team aligns and blends the images to create a composite with infinite depth of field, ensuring that the front stone, side prongs, and rear shank are all tack-sharp.",
    },
    {
      question: "Can you change the metal color (e.g., from yellow gold to rose gold or platinum)?",
      answer:
        "Yes. We can recolor metal components to showcase all available metal variants (yellow gold, white gold, rose gold, platinum) from a single photoshoot, saving significant production costs.",
    },
    {
      question: "Do you retain the natural color of colored gemstones?",
      answer:
        "Yes, we carefully protect the authentic hue and saturation of rubies, emeralds, sapphires, and opals, balancing internal light without distorting true gemological characteristics.",
    },
    {
      question: "What is the turnaround time for luxury jewelry retouching?",
      answer:
        "Jewelry retouching requires high artistry. Batches of 20 to 50 items are typically delivered in 24 to 48 hours. Express 24-hour delivery is available for urgent launches.",
    },
    {
      question: "Can I test your jewelry retouching quality on a sample file?",
      answer:
        "Yes, send us 1 to 2 RAW jewelry or watch files, and we will deliver a free test edit showcasing our diamond and metal finish.",
    },
  ],
  cta: {
    heading: "Make your jewelry collection sparkle",
    description:
      "Send us your macro jewelry shots. Our senior jewelry artists will deliver a complimentary test edit and custom quote.",
    steps: [
      {
        title: "Submit macro RAW files",
        description:
          "Upload your jewelry photos or focus-stacked brackets with your styling notes.",
      },
      {
        title: "Inspect test brilliance",
        description:
          "Examine our metal smoothing and gemstone clarity at 500% zoom with zero obligation.",
      },
      {
        title: "Launch luxury catalog",
        description:
          "Receive high-resolution, print-ready and e-commerce formatted deliverables.",
      },
    ],
  },
};
