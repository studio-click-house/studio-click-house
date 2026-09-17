import type { PreviewMedia } from "$lib/types/content";
import type { ServicePageData } from "$lib/types/service-detail";

const clippingPathMedia = {
  heroPenPath: {
    src: "/images/services/bags-accessories/accessories-adele-black-leather-bag-01-before.webp",
    alt: "Luxury black leather handbag with hand-plotted pen tool vector clipping path",
    width: 1500,
    height: 2000,
  },
  heroStillLife: {
    src: "/images/services/jewelry/jewelry-westhill-diamond-halo-ring-set-alt-0213.webp",
    alt: "Fine jewelry diamond ring set outlined with precision vector clipping path",
    width: 1334,
    height: 2000,
  },
  heroJewelry: {
    src: "/images/services/bags-accessories/accessories-salinas-designer-sunglasses-front-view-before.webp",
    alt: "Designer sunglasses with curved frame and lens knockout vector path",
    width: 1600,
    height: 2000,
  },
  introCurve: {
    src: "/images/services/bags-accessories/accessories-astral-designer-sunglasses-side-profile-before.webp",
    alt: "Curved eyewear temple contour with sub-pixel bezier anchor points",
    width: 1600,
    height: 2000,
  },
  introComplex: {
    src: "/images/services/bags-accessories/accessories-quinn-metallic-gold-bag-810-before.webp",
    alt: "Metallic luxury bag with independent multi-path layer isolation for hardware and leather",
    width: 1500,
    height: 2000,
  },
  introPrePress: {
    src: "/images/services/ghost-mannequin-apparel/apparel-squad-indigo-denim-jeans-flatlay.webp",
    alt: "Denim apparel flatlay with complex seam paths prepped for pre-press CMYK separation",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "/images/services/product-services/product-industrial-machinery-rack-server-cutout-before.webp",
    alt: "Raw industrial machinery server rack photographed in a workshop before clipping path",
    width: 1500,
    height: 2000,
  },
  comparisonClipped: {
    src: "/images/services/product-services/product-industrial-machinery-rack-server-cutout-after.webp",
    alt: "Finished industrial machinery server rack cutout with complex vector path isolating all pipes, frames, and components",
    width: 1500,
    height: 2000,
  },
  showcaseJewelry: {
    src: "/images/services/jewelry/jewelry-westhill-halo-diamond-signet-ring-0126.webp",
    alt: "Multi-hole diamond halo ring vector clipping path knockout",
    width: 1334,
    height: 2000,
    caption: "Multi-path jewelry knockout",
  },
  showcaseAccessories: {
    src: "/images/services/bags-accessories/accessories-josel-trucker-hat-black-01.webp",
    alt: "Structured headwear with curved visor and eyelet knockout paths",
    width: 1600,
    height: 2000,
    caption: "Headwear contour vector path",
  },
  showcaseApparel: {
    src: "/images/services/ghost-mannequin-apparel/apparel-huxbaby-kids-patterned-romper-01.webp",
    alt: "Children's patterned apparel contour with neckline and button clipping paths",
    width: 1500,
    height: 2000,
    caption: "Apparel contour clipping",
  },
  gallerySimple: {
    src: "/images/services/bags-accessories/accessories-mini-insignia-cap-race-green-01.webp",
    alt: "Single outer contour packshot vector clipping path",
    width: 1600,
    height: 2000,
  },
  galleryMedium: {
    src: "/images/services/bags-accessories/accessories-adele-black-leather-bag-02-before.webp",
    alt: "Dual handle and metallic buckle multi-hole knockouts",
    width: 1500,
    height: 2000,
  },
  galleryComplex: {
    src: "/images/services/jewelry/jewelry-by-charlotte-gold-stud-earrings-0120.webp",
    alt: "Delicate stud earrings with micro-facet vector contours",
    width: 1600,
    height: 2000,
  },
  galleryApparel: {
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-couture-ruffle-evening-gown-black-before.webp",
    alt: "Intricate evening gown fabric folds and ruffle silhouette pathing",
    width: 1334,
    height: 2000,
  },
  galleryCosmetics: {
    src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-pink-cream-before.webp",
    alt: "Product bottle with cap, label, and body multi-path isolation channels",
    width: 1526,
    height: 2000,
  },
  gallerySuperComplex: {
    src: "/images/services/ghost-mannequin-apparel/apparel-ada-tactical-body-armour-vest-0059-before.webp",
    alt: "Super complex tactical vest with multiple straps, buckles, and webbing knockouts",
    width: 1500,
    height: 2000,
  },
  audiencePublishers: {
    src: "/images/services/ghost-mannequin-apparel/apparel-tinycottons-heart-print-jumpsuit-flatlay-after.webp",
    alt: "Catalog children's apparel flatlay prepared with clean vector clipping path for print pre-press",
    width: 1333,
    height: 2000,
  },
  audienceAdvertising: {
    src: "/images/services/product-services/product-food-cereal-granola-muesli-flatlay-berries-before.webp",
    alt: "Commercial packaging and advertising flatlay packshot cutout",
    width: 1445,
    height: 2000,
  },
  audienceCommercial: {
    src: "/images/services/bags-accessories/accessories-josel-trucker-hat-camel-brown-13.webp",
    alt: "High-volume commercial e-commerce product shoot pathing",
    width: 1600,
    height: 2000,
  },
} as const;

export const clippingPathPage: ServicePageData = {
  slug: "clipping-path",
  seo: {
    title:
      "Clipping Path Services | Studio Click House",
    description:
      "Hand-drawn Photoshop clipping paths with compound paths, color separation, and pre-press-ready PSD or TIFF files for catalogs and agencies.",
  },
  hero: {
    title: "Clipping",
    titleAccent: "Path.",
    description:
      "Hand-drawn vector paths created in Adobe Photoshop at high magnification, supplied in layered PSD or pre-press TIFF files for print and digital use.",
    media: clippingPathMedia.heroPenPath,
    supportingMedia: [
      clippingPathMedia.heroStillLife,
      clippingPathMedia.heroJewelry,
    ],
  },
  intro: {
    heading: "What is hand-crafted clipping path?",
    paragraphs: [
      "A clipping path is a closed vector path created with Photoshop's Pen Tool to isolate a 2D image from its background. Our retouchers plot smooth anchor points along natural object boundaries at high magnification for clean print and digital output.",
    ],
    stages: [
      {
        label: "Sub-Pixel Bezier Curves",
        description:
          "Anchor points are plotted along natural inner object edges to avoid background color spill or harsh cutout borders.",
        media: clippingPathMedia.introCurve,
      },
      {
        label: "Multi-Path Layer Isolation",
        description:
          "We create independent named sub-paths for buttons, collars, soles, and dials for selective color shifting and retouching.",
        media: clippingPathMedia.introComplex,
      },
      {
        label: "Pre-Press & CMYK Preparation",
        description:
          "Paths are saved as active clipping paths with designated flatness settings ready for InDesign, Illustrator, and web pipelines.",
        media: clippingPathMedia.introPrePress,
      },
    ],
  },
  beforeAfter: {
    heading: "See the bezier precision.",
    description:
      "Drag the slider to inspect the razor-sharp boundary definition of a manual Photoshop clipping path versus raw photo edges.",
    beforeSrc: clippingPathMedia.comparisonOriginal.src,
    beforeAlt: clippingPathMedia.comparisonOriginal.alt,
    afterSrc: clippingPathMedia.comparisonClipped.src,
    afterAlt: clippingPathMedia.comparisonClipped.alt,
    beforeLabel: "Unclipped raw",
    afterLabel: "Vector clipped",
    width: clippingPathMedia.comparisonClipped.width,
    height: clippingPathMedia.comparisonClipped.height,
    caption: "Drag to compare · Vector pen tool path",
  },
  showcase: {
    heading: "Clipping paths for catalogs and print production",
    description:
      "Our team processes complex multi-path assignments for leading fashion lookbooks, commercial packaging designers, and global e-commerce retail networks.",
    stats: [
      { value: "300%+", label: "Zoom level precision on every path" },
      { value: "100%", label: "Manual pen tool craft (zero AI halo)" },
      { value: "50k+", label: "Paths delivered per month" },
    ],
    gallery: [
      {
        src: clippingPathMedia.showcaseJewelry.src,
        alt: clippingPathMedia.showcaseJewelry.alt,
        width: clippingPathMedia.showcaseJewelry.width,
        height: clippingPathMedia.showcaseJewelry.height,
        caption: clippingPathMedia.showcaseJewelry.caption,
      },
      {
        src: clippingPathMedia.showcaseAccessories.src,
        alt: clippingPathMedia.showcaseAccessories.alt,
        width: clippingPathMedia.showcaseAccessories.width,
        height: clippingPathMedia.showcaseAccessories.height,
        caption: clippingPathMedia.showcaseAccessories.caption,
      },
      {
        src: clippingPathMedia.showcaseApparel.src,
        alt: clippingPathMedia.showcaseApparel.alt,
        width: clippingPathMedia.showcaseApparel.width,
        height: clippingPathMedia.showcaseApparel.height,
        caption: clippingPathMedia.showcaseApparel.caption,
      },
    ],
  },
  gallery: {
    heading: "Selected Path Complexity Levels",
    description:
      "From simple geometric packshots to intricate multi-hole jewelry, machinery, and lace, view our path classification standards.",
    items: [
      {
        id: "gallery-cp-simple",
        title: "Basic Geometric Packshot",
        category: "Simple Path",
        technique: "Single Outer Contour Path",
        media: clippingPathMedia.gallerySimple,
      },
      {
        id: "gallery-cp-footwear",
        title: "Footwear & Eyelet Knockouts",
        category: "Medium Path",
        technique: "Multi-Hole Lace & Sole Paths",
        media: clippingPathMedia.galleryMedium,
      },
      {
        id: "gallery-cp-jewelry",
        title: "Fine Jewelry & Gemstone Facets",
        category: "Complex Path",
        technique: "Compound Multi-Prong Paths",
        media: clippingPathMedia.galleryComplex,
      },
      {
        id: "gallery-cp-apparel",
        title: "Garment Wrinkles & Fabric Folds",
        category: "Medium Path",
        technique: "Silhouette Edge Tracing",
        media: clippingPathMedia.galleryApparel,
      },
      {
        id: "gallery-cp-cosmetics",
        title: "Cosmetic Set Multi-Path",
        category: "Multi-Path",
        technique: "Individual Component Masking",
        media: clippingPathMedia.galleryCosmetics,
      },
      {
        id: "gallery-cp-furniture",
        title: "Tactical Gear & Hardware Multi-Path",
        category: "Super Complex",
        technique: "Webbing, Buckle & Seam Multi-Paths",
        media: clippingPathMedia.gallerySuperComplex,
      },
    ],
  },
  features: {
    heading: "Why top production studios choose our paths",
    items: [
      {
        icon: "PenTool",
        title: "Hand-Drawn Vector Precision",
        description:
          "Every path is hand-plotted with smooth bezier handles placed exactly where curves transition naturally.",
      },
      {
        icon: "FolderTree",
        title: "Named Multi-Path Layers",
        description:
          "We organize complex products into named sub-paths (e.g. 'Body', 'Sole', 'Laces', 'Logo') for quick color grading.",
      },
      {
        icon: "Sliders",
        title: "Inward 0.5px Edge Offsets",
        description:
          "Paths are drawn 0.5px inside object boundaries to completely eliminate background color bleed on dark backdrops.",
      },
      {
        icon: "Clock",
        title: "Overnight Production SLAs",
        description:
          "Our 24/7 studio guarantees turnaround within 12 to 24 hours even for batches exceeding 1,000 complex files.",
      },
      {
        icon: "FileCheck",
        title: "InDesign & Pre-Press Ready",
        description:
          "Embedded clipping paths with flat curve tolerances ready for immediate desktop publishing and CMYK separation.",
      },
      {
        icon: "ShieldAlert",
        title: "Zero Automation Artifacts",
        description:
          "We reject automated AI magic-wand selection tools to ensure zero fuzzy pixels or chopped edges.",
      },
    ],
  },
  audience: {
    heading: "Who relies on our clipping path service?",
    items: [
      {
        title: "Print & Catalog Publishers",
        description:
          "Pre-press production teams requiring embedded vector paths for clean InDesign layouts and CMYK color separation.",
        media: clippingPathMedia.audiencePublishers,
      },
      {
        title: "Advertising & Packaging Studios",
        description:
          "Design agencies needing isolated brand packshots and multi-path assets for high-resolution packaging key art.",
        media: clippingPathMedia.audienceAdvertising,
      },
      {
        title: "Commercial Photography Studios",
        description:
          "High-volume catalog and commercial studios offloading pathing tasks to maintain focus on client shooting days.",
        media: clippingPathMedia.audienceCommercial,
      },
    ],
  },
  faqs: [
    {
      question: "What is the difference between single path and multi-path?",
      answer:
        "A single clipping path isolates the outer boundary of an object from its background. A multi-path contains multiple independent vector paths drawn around different components (such as laces, sole, logo, or collar), allowing art directors to independently color grade or manipulate each part.",
    },
    {
      question: "Will the vector path be embedded into the file?",
      answer:
        "Yes. We deliver layered PSD or TIFF files with active, named Photoshop Paths saved in the Paths panel, compatible with Adobe Illustrator, InDesign, and Photoshop.",
    },
    {
      question: "How do you avoid background color fringing?",
      answer:
        "Our retouchers zoom in to 300% and manually place bezier points approximately 0.5 to 1 pixel inside the subject boundary, ensuring no background halos remain when the product is placed onto a new background.",
    },
    {
      question: "Can you handle complex items like jewelry and bicycles?",
      answer:
        "Yes, our artists specialize in super-complex pathing involving dozens of internal hole cutouts, spokes, mesh fabrics, and intricate gemstone prongs.",
    },
    {
      question: "What is the turnaround time for a batch of 500 images?",
      answer:
        "Batches of up to 500 images are typically completed within 24 hours. Express 12-hour turnaround is also available upon request.",
    },
  ],
  faqImages: [
    {
      src: "/images/services/jewelry/jewelry-celine-gold-sculptural-bangle-03-before.webp",
      alt: "Sculptural gold jewelry bangle vector clipping path outline",
      width: 1500,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-yellow-cream-before.webp",
      alt: "Cosmetic product bottle with clean vector path isolation",
      width: 1526,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/jewelry/jewelry-westwood-statement-gold-earrings-02-before.webp",
      alt: "Statement gold earrings outlined with multi-point vector pathing",
      width: 1500,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-flux-tee-walnut-brown-after.webp",
      alt: "Apparel t-shirt cleanly isolated with manual pen tool path",
      width: 1420,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-boody-raglan-sleep-top-lilac-after.webp",
      alt: "High-volume catalog sleep top cutout with precision vector clipping path",
      width: 1541,
      height: 2000,
      credit: "Studio Click House",
    },
  ],
  cta: {
    heading: "Need clean vector clipping paths?",
    description:
      "Send us 3 sample images and experience our hand-crafted pen tool precision firsthand with a free trial edit.",
    steps: [
      {
        title: "Submit sample files",
        description:
          "Share up to 3 test files with your path naming or knockout instructions.",
      },
      {
        title: "Evaluate path accuracy",
        description:
          "Inspect our anchor point placement and curve smoothness at 300% zoom.",
      },
      {
        title: "Scale your workflow",
        description:
          "Submit entire seasonal production runs with 24/7 delivery assurance.",
      },
    ],
  },
};
