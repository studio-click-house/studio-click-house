import type { PreviewMedia } from "$lib/types/content";
import type { ServicePageData } from "$lib/types/service-detail";

const clippingPathMedia = {
  heroBicycle: {
    src: "/images/clipping-path/clipping-path-precision-path-bicycle.webp",
    alt: "Bicycle outlined with precise Photoshop pen-tool path points",
    width: 1122,
    height: 1402,
  },
  heroApparel: {
    src: "/images/clipping-path/clipping-path-apparel-tshirt-pen-path.webp",
    alt: "Brown T-shirt outlined with precise Photoshop pen-tool path points",
    width: 1122,
    height: 1402,
  },
  heroFootwear: {
    src: "/images/clipping-path/clipping-path-footwear-sneaker-pen-path.webp",
    alt: "Pair of dark sneakers outlined with detailed pen-tool path points",
    width: 1122,
    height: 1402,
  },
  introCurve: {
    src: "/images/services/bags-accessories/accessories-astral-designer-sunglasses-side-profile-after.webp",
    alt: "Curved eyewear temple contour with sub-pixel bezier anchor points",
    width: 1600,
    height: 2000,
  },
  introPathExamples: {
    src: "/images/clipping-path/clipping-path-multi-product-detail-path-examples.webp",
    alt: "Pen-tool path examples around handbags and footwear, including close-ups of leather and stitching",
    width: 1122,
    height: 1402,
  },
  introComplex: {
    src: "/images/services/bags-accessories/accessories-quinn-metallic-gold-bag-810-after.webp",
    alt: "Metallic luxury bag with independent multi-path layer isolation for hardware and leather",
    width: 1500,
    height: 2000,
  },
  introPrePress: {
    src: "/images/services/ghost-mannequin-apparel/apparel-tiny-big-sister-patterned-jumpsuit-flatlay-after.webp",
    alt: "Patterned apparel flatlay with complex seam paths prepped for pre-press CMYK separation",
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
  showcaseWatch: {
    src: "/images/clipping-path/clipping-path-multi-path-luxury-watch.webp",
    alt: "Luxury watch with separate precision clipping paths around its case, dial, and details",
    width: 1122,
    height: 1402,
  },
  showcaseFashion: {
    src: "/images/clipping-path/clipping-path-multi-path-fashion-model.webp",
    alt: "Fashion model and handbag outlined with separate clipping paths for garment details",
    width: 1122,
    height: 1402,
  },
  gallerySimple: {
    src: "/images/services/bags-accessories/accessories-mini-insignia-cap-race-green-01.webp",
    alt: "Single outer contour packshot vector clipping path",
    width: 1600,
    height: 2000,
  },
  galleryMedium: {
    src: "/images/services/bags-accessories/accessories-adele-black-leather-bag-02-after.webp",
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
    src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-couture-ruffle-evening-gown-black-after.webp",
    alt: "Intricate evening gown fabric folds and ruffle silhouette pathing",
    width: 1334,
    height: 2000,
  },
  galleryCosmetics: {
    src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-pink-cream-after.webp",
    alt: "Product bottle with cap, label, and body multi-path isolation channels",
    width: 1526,
    height: 2000,
  },
  gallerySuperComplex: {
    src: "/images/services/ghost-mannequin-apparel/apparel-ada-tactical-body-armour-vest-0059-after.webp",
    alt: "Super complex tactical vest with multiple straps, buckles, and webbing knockouts",
    width: 1500,
    height: 2000,
  },
  audiencePublishers: {
    src: "/images/services/ghost-mannequin-apparel/apparel-tiny-big-sister-colorblock-knit-cardigan-white.webp",
    alt: "Catalog knitwear apparel flatlay prepared with clean vector clipping path for print pre-press",
    width: 1600,
    height: 2000,
  },
  audienceAdvertising: {
    src: "/images/services/product-services/product-food-cereal-granola-muesli-flatlay-berries-after.webp",
    alt: "Commercial packaging and advertising flatlay packshot cutout",
    width: 1600,
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
    theme: "light",
    description:
      "Hand-drawn vector paths created in Adobe Photoshop at high magnification, supplied in layered PSD or pre-press TIFF files for print and digital use.",
    media: clippingPathMedia.heroBicycle,
    supportingMedia: [
      clippingPathMedia.heroApparel,
      clippingPathMedia.heroFootwear,
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
        media: clippingPathMedia.introPathExamples,
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
      "Compare the original machinery photo with the finished clipping path, keeping the frame, pipes, and components cleanly defined.",
    bullets: [
      "Trace smooth paths around complex contours",
      "Keep narrow gaps and inner edges clearly defined",
      "Prepare clean silhouettes for production use",
    ],
    beforeSrc: clippingPathMedia.comparisonOriginal.src,
    beforeAlt: clippingPathMedia.comparisonOriginal.alt,
    afterSrc: clippingPathMedia.comparisonClipped.src,
    afterAlt: clippingPathMedia.comparisonClipped.alt,
    beforeLabel: "Before",
    afterLabel: "After",
    width: clippingPathMedia.comparisonClipped.width,
    height: clippingPathMedia.comparisonClipped.height,
    layout: "cards",
    textPosition: "right",
  },
  showcase: {
    heading: "Multi-Path Clipping for Complex Products",
    theme: "light",
    description:
      "From detailed watch components to layered fashion and accessories, each element gets its own precise path for flexible editing and clean production output.",
    bullets: [
      "Separate product components into editable paths",
      "Preserve fine edges around hardware, clothing, and accessories",
      "Deliver organized paths for retouching and production",
    ],
    beforeAfter: {
      before: {
        ...clippingPathMedia.showcaseWatch,
        label: "Multi-path",
      },
      after: {
        ...clippingPathMedia.showcaseFashion,
        label: "Multi-path",
      },
    },
  },
  productTypes: [
    {
      id: "upholstered-chair",
      code: "01",
      title: "Upholstered Furniture",
      subtitle: "Trace curved chair silhouettes and detailed upholstery edges.",
      src: "/images/clipping-path/clipping-path-upholstered-accent-chair.webp",
      alt: "Upholstered accent chair outlined with a precision clipping path",
    },
    {
      id: "diamond-ring",
      code: "02",
      title: "Fine Jewelry",
      subtitle: "Define gemstone settings and inner openings with compound paths.",
      src: "/images/clipping-path/clipping-path-diamond-ring.webp",
      alt: "Diamond ring with separate outer and inner clipping paths",
    },
    {
      id: "baseball-cap",
      code: "03",
      title: "Caps & Headwear",
      subtitle: "Follow the crown and curved brim through detailed contours.",
      src: "/images/clipping-path/clipping-path-teal-baseball-cap.webp",
      alt: "Teal baseball cap outlined with a precision clipping path",
    },
    {
      id: "model-straw-hat",
      code: "04",
      title: "On-Model Fashion",
      subtitle: "Isolate the model, hair, and hat with a clean connected silhouette.",
      src: "/images/clipping-path/clipping-path-model-straw-hat.webp",
      alt: "Fashion model wearing a straw hat outlined with a clipping path",
    },
    {
      id: "designer-sunglasses",
      code: "05",
      title: "Eyewear",
      subtitle: "Separate frame contours, lenses, and open spaces accurately.",
      src: "/images/clipping-path/clipping-path-designer-sunglasses.webp",
      alt: "Designer sunglasses with frame and lens contours traced for clipping",
    },
    {
      id: "zebra-print-pump",
      code: "06",
      title: "Patterned Footwear",
      subtitle: "Keep pointed toes, heels, and cut-ins crisp around bold patterns.",
      src: "/images/clipping-path/clipping-path-zebra-print-pump.webp",
      alt: "Zebra-print pointed pump outlined with a precision clipping path",
    },
  ],
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
      src: "/images/services/jewelry/jewelry-celine-gold-sculptural-bangle-03-after.webp",
      alt: "Sculptural gold jewelry bangle vector clipping path knockout",
      width: 1500,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/bags-accessories/accessories-quinn-metallic-gold-bag-01-after.webp",
      alt: "Luxury metallic handbag multi-path vector isolation",
      width: 1500,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/jewelry/jewelry-westwood-statement-gold-earrings-02-after.webp",
      alt: "Statement gold earrings outlined with multi-point vector pathing",
      width: 1500,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-yellow-cream-after.webp",
      alt: "Cosmetic product bottle with clean vector path isolation",
      width: 1526,
      height: 2000,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/bags-accessories/accessories-antony-morato-white-leather-sneakers-3285.webp",
      alt: "High-volume catalog footwear cutout with precision vector clipping path",
      width: 1400,
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
