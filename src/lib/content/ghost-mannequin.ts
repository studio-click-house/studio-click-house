import type { ServicePageData } from "$lib/types/service-detail";

const ghostMannequinMedia = {
  heroPrimary: {
    src: "/images/ghost-mannequin/ghost-mannequin-camilla-silk-headscarf-marchesa-after.webp",
    alt: "Finished ghost mannequin silk headscarf presentation with natural fold shaping",
    width: 1333,
    height: 1666,
  },
  heroTee: {
    src: "/images/ghost-mannequin/ghost-mannequin-antony-morato-winter-parka-brown-back-before.webp",
    alt: "Winter parka on physical mannequin before retouching",
    width: 1600,
    height: 2000,
  },
  heroKnit: {
    src: "/images/ghost-mannequin/ghost-mannequin-camilla-tri-bodysuit-bambino-front-after.webp",
    alt: "Ghost mannequin bodysuit presentation with seamless shaping",
    width: 1334,
    height: 1668,
  },
  introBlouseSilk: {
    src: "/images/ghost-mannequin/ghost-mannequin-camilla-batwing-shirt-front.webp",
    alt: "Silk designer blouse showing intricate neckline compositing and inner brand label",
    width: 1333,
    height: 1666,
  },
  introBlouseTailored: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-he-ss23-womens-blouse-0023-before.webp",
    alt: "Women's tailored blouse with symmetric sleeve warping and collar shaping",
    width: 1429,
    height: 2000,
  },
  introParka: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-4m-womens-structured-parka-4513-before.webp",
    alt: "Structured apparel parka with crease smoothing and 3D interior shadow depth",
    width: 1333,
    height: 2000,
  },
  comparisonBefore: {
    src: "/images/ghost-mannequin/ghost-mannequin-symmetric-jacket-before.webp",
    alt: "Apparel jacket photographed on physical mannequin before symmetry shaping and ghost composite",
    width: 1600,
    height: 2000,
  },
  comparisonAfter: {
    src: "/images/ghost-mannequin/ghost-mannequin-symmetric-jacket-after.webp",
    alt: "Finished hollow-man ghost mannequin presentation with symmetric lapels, inner lining, and 3D depth",
    width: 1600,
    height: 2000,
  },
  showcaseShirt: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-he-ss23-mens-button-shirt-012-after-white.webp",
    alt: "Men's tailored button-down shirt with seamless invisible collar joint and inner label",
    width: 1429,
    height: 2000,
  },
  showcaseGown: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-chloe-black-gown-g1-white.webp",
    alt: "Luxury evening gown hollow mannequin presentation with elegant drape and neckline",
    width: 1500,
    height: 2000,
  },
  showcaseParka: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-antony-morato-winter-parka-brown-front-after.webp",
    alt: "Tailored winter parka with 3D hood volume and seamless ghost mannequin collar joint",
    width: 2000,
    height: 2000,
  },
  galleryBlazer: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-printemps-zip-through-jacket-walnut-194-before.webp",
    alt: "Tailored zip jacket with clean interior lining and lapel symmetry",
    width: 1419,
    height: 2000,
  },
  galleryHoodie: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-antony-morato-winter-parka-brown-front-before.webp",
    alt: "Winter parka showing 3D hood volume and inner lining joint",
    width: 2000,
    height: 2000,
  },
  galleryDress: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-nadine-black-mini-dress-232-before.webp",
    alt: "Contemporary mini dress with clean shoulder joint and bottom hem shaping",
    width: 1500,
    height: 2000,
  },
  galleryTee: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-royal-debut-navy-knit-top-before.webp",
    alt: "Navy knit top with collar rounding and clean neckline composite",
    width: 1334,
    height: 2000,
  },
  gallerySport: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-academy-short-chalk-pink-after.webp",
    alt: "Athletic apparel short with waistband symmetry and hollow depth",
    width: 1420,
    height: 2000,
  },
  galleryLingerie: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-boody-sleep-cami-lilac-0249-after.webp",
    alt: "Delicate sleep camisole with clean strap masking and hollow neckline",
    width: 1541,
    height: 2000,
  },
  audienceFashion: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-couture-ruffle-evening-gown-black-square.webp",
    alt: "Luxury couture evening gown ghost mannequin presentation with hollow neckline and flowing drape",
    width: 2000,
    height: 2000,
  },
  audienceMarketplaces: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-printemps-zip-through-jacket-walnut-square.webp",
    alt: "E-commerce marketplace apparel listing with clean white background and uniform drape",
    width: 2000,
    height: 2000,
  },
  audiencePhotographers: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-antony-morato-winter-parka-brown-back-after.webp",
    alt: "Commercial apparel photoshoot deliverable with 3D hood volume and inner lining composite",
    width: 2000,
    height: 2000,
  },
} as const;

export const ghostMannequinPage: ServicePageData = {
  slug: "ghost-mannequin",
  seo: {
    title:
      "Ghost Mannequin Services | Studio Click House",
    description:
      "Ghost mannequin and invisible mannequin editing for apparel brands, including neck joints, inner-label compositing, wrinkle cleanup, and garment shaping.",
  },
  hero: {
    title: "Ghost",
    titleAccent: "Mannequin.",
    theme: "light",
    description:
      "Show the fit and shape of apparel without a visible mannequin. We combine front, back, and inner-collar shots into clean hollow-man product images.",
    media: ghostMannequinMedia.heroPrimary,
    mediaFit: "cover",
    aspectRatio: "4/5",
    supportingMedia: [
      ghostMannequinMedia.heroTee,
      ghostMannequinMedia.heroKnit,
    ],
  },
  intro: {
    heading: "What is the ghost mannequin effect?",
    paragraphs: [
      "The ghost mannequin, or invisible mannequin, technique removes the mannequin stand and composites the inner neckline, brand tag, and lining into one hollow-body garment image. It shows shoppers how the garment is shaped while keeping catalog images consistent.",
    ],
    stages: [
      {
        label: "Neck Joint & Tag Compositing",
        description:
          "We combine the front shot with the interior collar photo, aligning the brand label and inner stitching.",
        media: ghostMannequinMedia.introBlouseSilk,
      },
      {
        label: "Symmetric Shape & Drape Warping",
        description:
          "Sleeves, hemlines, and shoulder seams are adjusted for balanced symmetry while preserving natural fabric physics.",
        media: ghostMannequinMedia.introBlouseTailored,
      },
      {
        label: "Wrinkle Reduction & Shadow Depth",
        description:
          "Unwanted creases and fabric puckering are softened, and realistic interior shadow depth is applied to enhance 3D volume.",
        media: ghostMannequinMedia.introParka,
      },
    ],
  },
  beforeAfter: {
    heading: "See the 3D hollow-man transformation.",
    description:
      "Inspect how a physical mannequin stand is removed and composited with a realistic inner collar joint, clean neck label, balanced drape, and natural fabric volume.",
    bullets: [
      "Invisible neck joint & interior label compositing",
      "Balanced 3D drape, lapel symmetry & natural curve",
      "Wrinkle cleanup with realistic interior shadow depth",
    ],
    beforeSrc: ghostMannequinMedia.comparisonBefore.src,
    beforeAlt: ghostMannequinMedia.comparisonBefore.alt,
    afterSrc: ghostMannequinMedia.comparisonAfter.src,
    afterAlt: ghostMannequinMedia.comparisonAfter.alt,
    beforeLabel: "Before",
    afterLabel: "After",
    showLabels: true,
    width: ghostMannequinMedia.comparisonAfter.width,
    height: ghostMannequinMedia.comparisonAfter.height,
    layout: "cards",
  },
  showcase: {
    heading: "Ghost mannequin & flat lay apparel catalogs",
    description:
      "From overhead flat lays to structured ghost mannequin sets, we balance garment geometry, align sleeves and collars, and soften unwanted creases while preserving natural fabric weave and fold depth.",
    bullets: [
      "Flat lay straightening & sleeve symmetry",
      "Fabric texture preservation with gentle de-wrinkling",
      "High-volume e-commerce catalog consistency",
    ],
    theme: "light",
    beforeAfter: {
      before: {
        src: "/images/ghost-mannequin/apparel-tiny-big-sister-patterned-jumpsuit-flatlay-before.webp",
        alt: "Apparel patterned jumpsuit unedited overhead flat lay before styling and straightening",
        width: 1333,
        height: 1666,
        label: "Before",
      },
      after: {
        src: "/images/ghost-mannequin/apparel-tiny-big-sister-patterned-jumpsuit-flatlay-after.webp",
        alt: "Apparel patterned jumpsuit finished flat lay presentation with symmetrical sleeves and de-wrinkled texture",
        width: 1333,
        height: 1666,
        label: "After",
      },
    },
  },
  gallery: {
    heading: "Selected Apparel Categories",
    items: [
      {
        id: "gallery-gm-blazer",
        title: "Tailored Blazer & Suit Jacket",
        category: "Outerwear",
        technique: "Lapel Symmetry & Inner Lining Joint",
        media: {
          src: ghostMannequinMedia.galleryBlazer.src,
          alt: ghostMannequinMedia.galleryBlazer.alt,
          width: ghostMannequinMedia.galleryBlazer.width,
          height: ghostMannequinMedia.galleryBlazer.height,
        },
      },
      {
        id: "gallery-gm-hoodie",
        title: "Casual Hoodie & Sweatshirt",
        category: "Streetwear",
        technique: "Hood Interior & Drawstring Cleanup",
        media: {
          src: ghostMannequinMedia.galleryHoodie.src,
          alt: ghostMannequinMedia.galleryHoodie.alt,
          width: ghostMannequinMedia.galleryHoodie.width,
          height: ghostMannequinMedia.galleryHoodie.height,
        },
      },
      {
        id: "gallery-gm-dress",
        title: "Evening Dress & Maxi Gown",
        category: "Dresses",
        technique: "Flowing Fabric & Bottom Hem Joint",
        media: {
          src: ghostMannequinMedia.galleryDress.src,
          alt: ghostMannequinMedia.galleryDress.alt,
          width: ghostMannequinMedia.galleryDress.width,
          height: ghostMannequinMedia.galleryDress.height,
        },
      },
      {
        id: "gallery-gm-tshirt",
        title: "Crewneck & V-Neck T-Shirts",
        category: "Basics",
        technique: "Tag Alignment & Collar Rounding",
        media: {
          src: ghostMannequinMedia.galleryTee.src,
          alt: ghostMannequinMedia.galleryTee.alt,
          width: ghostMannequinMedia.galleryTee.width,
          height: ghostMannequinMedia.galleryTee.height,
        },
      },
      {
        id: "gallery-gm-sportswear",
        title: "Athletic Tops & Windbreakers",
        category: "Activewear",
        technique: "Zipper Joint & Dynamic Fit Warping",
        media: {
          src: ghostMannequinMedia.gallerySport.src,
          alt: ghostMannequinMedia.gallerySport.alt,
          width: ghostMannequinMedia.gallerySport.width,
          height: ghostMannequinMedia.gallerySport.height,
        },
      },
      {
        id: "gallery-gm-lingerie",
        title: "Lingerie & Swimwear",
        category: "Intimates",
        technique: "Delicate Strap & Lace Masking",
        media: {
          src: ghostMannequinMedia.galleryLingerie.src,
          alt: ghostMannequinMedia.galleryLingerie.alt,
          width: ghostMannequinMedia.galleryLingerie.width,
          height: ghostMannequinMedia.galleryLingerie.height,
        },
      },
    ],
  },
  features: {
    heading: "Why top fashion brands partner with us",
    items: [
      {
        icon: "Shirt",
        title: "Inner Tag and Neck Joints",
        description:
          "We match interior fabric textures, stitching lines, and size labels precisely for a natural, authentic inside-collar view.",
      },
      {
        icon: "Scale",
        title: "Symmetric Warping & Drape",
        description:
          "Uneven shoulders, twisted hemlines, and crooked sleeves are straightened to present a crisp, balanced silhouette.",
      },
      {
        icon: "Sparkles",
        title: "Crease & Wrinkle Removal",
        description:
          "We remove transit creases, shipping folds, and unwanted fabric puckers while retaining natural material texture.",
      },
      {
        icon: "Layers",
        title: "Bottom Hem & Sleeve 3D Volume",
        description:
          "For jackets, dresses, and long sleeves, we composite bottom hem interiors and cuff openings to maintain full 360° depth.",
      },
      {
        icon: "Clock",
        title: "Overnight Catalog Delivery",
        description:
          "Shoot during the day and have your entire e-commerce apparel catalog retouched, formatted, and ready to publish by morning.",
      },
      {
        icon: "ShieldCheck",
        title: "Rigid Multi-Stage QC",
        description:
          "Every garment is checked for dimensional consistency, accurate color retention, and clean transparent cutouts.",
      },
    ],
  },
  audience: {
    heading: "Who benefits from this service?",
    description:
      "Reliable, high-volume apparel post-production tailored for lookbooks, multi-vendor marketplaces, and high-throughput photo studios.",
    items: [
      {
        title: "Fashion Brands & Apparel Retailers",
        description:
          "Create uniform, high-converting product pages that clearly communicate fit and cut without the cost of hiring on-model shoots.",
        deliverable: "Lookbook & Catalog Alignment",
        examples: [
          "Inner collar & brand tag alignment",
          "Uniform multi-garment silhouette symmetry",
          "Optimized for Shopify, Magento & BigCommerce",
        ],
        media: ghostMannequinMedia.audienceFashion,
      },
      {
        title: "E-Commerce Marketplaces",
        description:
          "Standardize third-party seller clothing images to maintain a cohesive, professional aesthetic across your storefront.",
        deliverable: "High-Volume Batch Processing",
        examples: [
          "Amazon, ASOS & Zalando guideline compliance",
          "Pure white clipping & transparent alpha backgrounds",
          "Automated QA & rapid 24h turnaround at scale",
        ],
        media: ghostMannequinMedia.audienceMarketplaces,
      },
      {
        title: "Commercial Fashion Photographers",
        description:
          "Provide end-to-end hollow-man composite deliverables to your apparel clients without spending hours on Photoshop neck joints.",
        deliverable: "Studio Production Extension",
        examples: [
          "Complex neck joint & inner lining compositing",
          "Crease de-wrinkling while retaining fabric weave",
          "Layered PSDs with native shadow isolation",
        ],
        media: ghostMannequinMedia.audiencePhotographers,
      },
    ],
  },
  faqs: [
    {
      question: "How should I photograph garments for ghost mannequin editing?",
      answer:
        "Take two photos of each garment under identical lighting: 1) The front shot of the garment on a static mannequin stand, and 2) The inside shot of the neck and back collar (either on a flat surface or with the garment turned inside-out on the mannequin) showing the brand label.",
    },
    {
      question: "Can you create 3D volume for sleeves and bottom hemlines?",
      answer:
        "Yes. If you provide secondary photos of the inside cuffs and bottom hem, we composite them into the main image to create realistic 3D depth from top to bottom.",
    },
    {
      question: "What if the garment is wrinkled from transit?",
      answer:
        "Our ghost mannequin service includes wrinkle and crease smoothing. We remove distracting transport folds while preserving the natural texture, weave, and highlights of the fabric.",
    },
    {
      question: "Which formats and backgrounds do you provide?",
      answer:
        "We deliver files on pure white backgrounds, transparent PNGs, or layered PSDs with active clipping paths and separate shadow layers.",
    },
    {
      question: "Can I get a free test on my garment photos?",
      answer:
        "Yes, send us front and inside collar photos for up to 3 garments, and we will deliver a free ghost mannequin sample within 24 hours.",
    },
  ],
  faqImages: [
    {
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-printemps-zip-through-jacket-walnut-194-after.webp",
      alt: "Tailored zip jacket showing symmetrical sleeves and hollow neck joint",
      width: 1419,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-couture-ruffle-evening-gown-black-after.webp",
      alt: "3D hollow volume, sleeve shaping, and flowing bottom hemline composite on luxury couture gown",
      width: 1334,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ghost-mannequin-apparel/apparel-kids-heart-star-pajama-pants-flatlay-after.webp",
      alt: "Wrinkle-smoothed garment presentation retaining natural fabric texture and waistband depth",
      width: 1333,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-camilla-feather-throw-over-back-after.webp",
      alt: "Designer throw-over silk outerwear showing clean hemline composite",
      width: 1333,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-nadine-black-mini-dress-232-after.webp",
      alt: "Contemporary mini dress with clean shoulder joint and bottom hem shaping",
      width: 1500,
      height: 2000,
      credit: "Studio Click House",
    },
  ],
  cta: {
    heading: "Transform your apparel catalog today",
    description:
      "Send us your front and collar shots. Our skilled retouchers will deliver a complimentary ghost mannequin sample and volume quote.",
    steps: [
      {
        title: "Upload front & collar shots",
        description:
          "Share garment photos along with any brand label or styling preferences.",
      },
      {
        title: "Review trial composite",
        description:
          "Inspect our neck-joint and 3D volume work before committing to a full batch.",
      },
      {
        title: "Scale your collection",
        description:
          "Receive overnight catalog-ready deliverables across all seasonal lines.",
      },
    ],
  },
};
