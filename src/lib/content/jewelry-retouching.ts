import type { ServicePageData } from "$lib/types/service-detail";

const jewelryRetouchingMedia = {
  heroJewelry: {
    src: "/images/services/jewelry/jewelry-emerald-halo-diamond-ring-water-splash.webp",
    alt: "Emerald halo diamond ring on a bright white surface beside blue water",
    width: 1600,
    height: 2000,
  },
  heroRing: {
    src: "/images/services/jewelry/jewelry-westhill-diamond-halo-ring-set-alt-0213.webp",
    alt: "Fine jewelry diamond halo ring set with precision micro-prongs and sparkling facets",
    width: 1600,
    height: 2000,
  },
  heroPendant: {
    src: "/images/services/jewelry/jewelry-by-charlotte-delicate-gold-pendant-0046.webp",
    alt: "Delicate gold pendant necklace photographed with clean specular reflections and delicate gradient shadows",
    width: 1600,
    height: 2000,
  },
  introDiamond: {
    src: "/images/jewelry-retouching/jewelry-retouching-gold-diamond-comparison-board.webp",
    alt: "Before and after jewelry retouching examples for diamond rings, a pendant, earrings, and bracelet",
    width: 1600,
    height: 2000,
  },
  introMetal: {
    src: "/images/services/jewelry/jewelry-westhill-organic-gold-band-ring-0122.webp",
    alt: "Polished gold band smoothing with preserved metallic reflections",
    width: 1600,
    height: 2000,
  },
  introSparkle: {
    src: "/images/services/jewelry/jewelry-pink-sapphire-diamond-halo-platinum-ring-after.webp",
    alt: "Focus stacking and diamond sparkle control on platinum ring",
    width: 1600,
    height: 2000,
  },
  comparisonBandBefore: {
    src: "/images/services/jewelry/jewelry-oval-diamond-eternity-band-gold-before.webp",
    alt: "Gold and diamond eternity band before retouching, with a marked studio background",
    width: 1596,
    height: 1995,
  },
  comparisonBandAfter: {
    src: "/images/services/jewelry/jewelry-oval-diamond-eternity-band-gold-after.webp",
    alt: "Gold and diamond eternity band after cleanup and jewelry retouching",
    width: 1596,
    height: 1995,
  },
  comparisonSapphireBefore: {
    src: "/images/services/jewelry/jewelry-pink-sapphire-diamond-halo-platinum-ring-before.webp",
    alt: "Pink sapphire halo ring before high-end jewelry retouching",
    width: 1598,
    height: 1997,
  },
  comparisonSapphireAfter: {
    src: "/images/services/jewelry/jewelry-pink-sapphire-diamond-halo-platinum-ring-after.webp",
    alt: "Pink sapphire halo ring after high-end jewelry retouching",
    width: 1598,
    height: 1997,
  },
  audienceBrands: {
    src: "/images/services/jewelry/jewelry-aquamarine-emerald-gold-ring-4054.webp",
    alt: "Fine jewelry brand ring collection with balanced reflections and brilliant stones",
    width: 1600,
    height: 2000,
  },
  audienceBoutiques: {
    src: "/images/services/jewelry/jewelry-westhill-diamond-spot-stack-ring-0170.webp",
    alt: "Luxury boutique diamond stack rings retouched for e-commerce catalog consistency",
    width: 1600,
    height: 2000,
  },
  audienceAuction: {
    src: "/images/services/jewelry/jewelry-aquamarine-emerald-gold-ring-4072.webp",
    alt: "High-resolution gemstone ring presentation for auction catalogs and art direction",
    width: 1600,
    height: 2000,
  },
} as const;

export const jewelryRetouchingPage: ServicePageData = {
  slug: "jewelry-retouching",
  seo: {
    title:
      "Jewelry Photo Retouching | Studio Click House",
    description:
      "Specialized jewelry photo retouching by Studio Click House. Macro diamond sparkle, gemstone clarity, gold & platinum polishing, focus stacking alignment, and reflection cleanup for luxury brands.",
  },
  hero: {
    title: "Jewelry",
    titleAccent: "Retouching.",
    theme: "light",
    mediaFit: "cover",
    aspectRatio: "4/5",
    description:
      "Macro retouching for fine jewelry, luxury watches, and gemstones. We remove dust, polish metals, control reflections, and enhance diamond sparkle without losing natural detail.",
    media: jewelryRetouchingMedia.heroJewelry,
    supportingMedia: [
      jewelryRetouchingMedia.heroRing,
      jewelryRetouchingMedia.heroPendant,
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
        media: jewelryRetouchingMedia.introSparkle,
      },
    ],
  },
  beforeAfter: {
    heading: "Diamond eternity band retouching",
    description:
      "Compare the original eternity band with its clean catalog finish, refining the diamonds and gold while keeping the setting true to the piece.",
    bullets: [
      "Remove dust and distracting background marks",
      "Refine diamond clarity and setting detail",
      "Preserve natural gold tone and metal reflections",
    ],
    beforeSrc: jewelryRetouchingMedia.comparisonBandBefore.src,
    beforeAlt: jewelryRetouchingMedia.comparisonBandBefore.alt,
    afterSrc: jewelryRetouchingMedia.comparisonBandAfter.src,
    afterAlt: jewelryRetouchingMedia.comparisonBandAfter.alt,
    beforeLabel: "Before",
    afterLabel: "After",
    width: jewelryRetouchingMedia.comparisonBandAfter.width,
    height: jewelryRetouchingMedia.comparisonBandAfter.height,
    layout: "cards",
    textPosition: "right",
  },
  showcase: {
    heading: "High-end jewelry retouching",
    theme: "light",
    description:
      "Refine a pink sapphire and platinum halo ring with careful facet cleanup, balanced reflections, and natural gemstone color.",
    bullets: [
      "Clean dust and surface distractions",
      "Refine sapphire facets and surrounding diamond detail",
      "Polish platinum reflections while preserving natural tone",
    ],
    beforeAfter: {
      before: { ...jewelryRetouchingMedia.comparisonSapphireBefore, label: "Before" },
      after: { ...jewelryRetouchingMedia.comparisonSapphireAfter, label: "After" },
    },
  },
  productTypes: [
    {
      id: "gold-stud-earrings",
      code: "01",
      title: "Gold Stud Earrings",
      subtitle: "Polish gold settings and bring out clear, balanced stone detail.",
      src: "/images/services/jewelry/jewelry-by-charlotte-gold-stud-earrings-0120.webp",
      alt: "Gold stud earrings retouched for a jewelry catalog",
    },
    {
      id: "brilliant-solitaire-ring",
      code: "02",
      title: "Brilliant Solitaire Ring",
      subtitle: "Refine diamond facets and keep the solitaire setting crisp.",
      src: "/images/services/jewelry/jewelry-round-brilliant-solitaire-diamond-ring-studio.webp",
      alt: "Round brilliant solitaire diamond ring in a studio product image",
    },
    {
      id: "aquamarine-emerald-ring",
      code: "03",
      title: "Aquamarine & Emerald Ring",
      subtitle: "Balance color and reflections across mixed gemstones and gold.",
      src: "/images/services/jewelry/jewelry-aquamarine-emerald-gold-ring-4072.webp",
      alt: "Gold ring with aquamarine and emerald gemstones",
    },
    {
      id: "rose-gold-halo-ring",
      code: "04",
      title: "Rose Gold Halo Ring",
      subtitle: "Show the twisted band and halo setting with natural metal tone.",
      src: "/images/services/jewelry/jewelry-rose-gold-solitaire-halo-twisted-band-ring.webp",
      alt: "Rose gold solitaire halo ring with a twisted band",
    },
    {
      id: "diamond-eternity-band",
      code: "05",
      title: "Diamond Eternity Band",
      subtitle: "Keep each stone and setting defined in a vivid campaign image.",
      src: "/images/services/jewelry/jewelry-diamond-eternity-band-submerged-blue-water.webp",
      alt: "Diamond eternity band photographed against a blue water setting",
    },
    {
      id: "rose-gold-chevron-bridal-set",
      code: "06",
      title: "Rose Gold Chevron Bridal Set",
      subtitle: "Present the curved bridal bands with clean edges and detail.",
      src: "/images/services/jewelry/jewelry-rose-gold-diamond-curved-chevron-bridal-set.webp",
      alt: "Rose gold diamond curved chevron bridal ring set",
    },
  ],
  gallery: {
    heading: "Selected Jewelry Projects",
    description:
      "Explore diverse jewelry retouching projects across diamond engagement rings, luxury watches, pearls, and colored gemstones.",
    items: [
      {
        id: "gallery-jw-solitaire",
        title: "Emerald-Cut Diamond Solitaire",
        category: "Diamond Rings",
        technique: "Facet Edge Alignment & Prong Polish",
        media: {
          src: "/images/services/jewelry/jewelry-emerald-cut-diamond-solitaire-gold-ring-after.webp",
          alt: "Diamond solitaire ring macro retouching",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-jw-halo",
        title: "Pink Sapphire Halo Ring",
        category: "Colored Gems",
        technique: "Micro-Pavé Sparkle & Tone Balance",
        media: {
          src: "/images/services/jewelry/jewelry-pink-sapphire-diamond-halo-platinum-ring-after.webp",
          alt: "Pink sapphire halo ring luxury retouching",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-jw-bangle",
        title: "Sculptural Gold Bangle",
        category: "Gold Goods",
        technique: "Curved Reflection Smoothing",
        media: {
          src: "/images/services/jewelry/jewelry-celine-gold-sculptural-bangle-03-after.webp",
          alt: "Gold bangle jewelry retouching",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-jw-eternity",
        title: "Oval Diamond Eternity Band",
        category: "Wedding Bands",
        technique: "Multi-Stone Focus Stack Blending",
        media: {
          src: "/images/services/jewelry/jewelry-oval-diamond-eternity-band-gold-after.webp",
          alt: "Oval diamond eternity band retouching",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-jw-necklace",
        title: "Fine Gold Chain & Pendant",
        category: "Necklaces",
        technique: "Micro-Link Definition & Specular Sheen",
        media: {
          src: "/images/services/jewelry/jewelry-by-charlotte-gold-chain-necklace-0092.webp",
          alt: "Gold chain necklace luxury retouching",
          width: 1600,
          height: 2000,
        },
      },
      {
        id: "gallery-jw-earrings",
        title: "Textured Gold Drop Earrings",
        category: "Earrings",
        technique: "Organic Texture Preservation",
        media: {
          src: "/images/services/jewelry/jewelry-jules-textured-gold-earrings-03-after.webp",
          alt: "Textured gold earrings retouching",
          width: 1600,
          height: 2000,
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
          "We blend multi-bracket focus shots for edge-to-edge sharpness from front prongs to rear shank.",
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
          "Show rings, necklaces, watches, and one-off pieces with controlled reflections, clear stones, and natural metal detail.",
        media: jewelryRetouchingMedia.audienceBrands,
      },
      {
        title: "Luxury Boutiques & E-Commerce",
        description:
          "Present engagement rings, wedding bands, and ear jewelry with uniform studio reflections and calibrated color consistency.",
        media: jewelryRetouchingMedia.audienceBoutiques,
      },
      {
        title: "Auction Houses & Catalog Publishers",
        description:
          "Produce high-resolution print catalog images that convey gemstone purity, carat value, and authentic provenance.",
        media: jewelryRetouchingMedia.audienceAuction,
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
  faqImages: [
    {
      src: "/images/services/jewelry/jewelry-celine-gold-sculptural-bangle-03-after.webp",
      alt: "Sculptural gold jewelry bangle retouched with pristine reflection balance",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/jewelry/jewelry-pink-sapphire-diamond-halo-platinum-ring-after.webp",
      alt: "Pink sapphire and diamond halo ring with facet sparkle enhancement",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/jewelry/jewelry-emerald-cut-diamond-solitaire-gold-ring-after.webp",
      alt: "Emerald-cut diamond ring showing clean internal facets and polished prongs",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/jewelry/jewelry-oval-diamond-eternity-band-gold-after.webp",
      alt: "Oval diamond eternity wedding band with multi-stone focus alignment",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/jewelry/jewelry-westwood-statement-gold-earrings-02-after.webp",
      alt: "Statement gold earrings with smooth specular sheen and warm gold calibration",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
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
