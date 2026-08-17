import { previewMedia } from "$lib/content/media";
import type { ServicePageData } from "$lib/types/service-detail";

const clippingPathMedia = {
  heroPenPath: {
    src: "https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Photoshop pen tool vector clipping path drawn around a luxury product",
    width: 1800,
    height: 2400,
  },
  heroStillLife: {
    src: "https://images.pexels.com/photos/18302102/pexels-photo-18302102.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Perfume bottle with precision vector bezier curve path",
    width: 1600,
    height: 2000,
  },
  heroJewelry: {
    src: "https://images.pexels.com/photos/11064129/pexels-photo-11064129.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Fine jewelry necklace outlined with complex multi-path anchor points",
    width: 1600,
    height: 2000,
  },
  introCurve: {
    src: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Footwear sole with high-precision vector clipping path",
    width: 1600,
    height: 2000,
  },
  introComplex: {
    src: "https://images.pexels.com/photos/10928896/pexels-photo-10928896.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Cosmetic container with multi-path color separation channels",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Raw luxury product photo before hand-drawn vector clipping path",
    width: 1400,
    height: 1800,
  },
  comparisonClipped: {
    src: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Finished jewelry asset with closed vector path and crisp bezier curves",
    width: 1400,
    height: 1800,
  },
  audienceAgencies: {
    src: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Catalog art director reviewing print pre-press clipping paths",
    width: 1600,
    height: 2000,
  },
} as const;

export const clippingPathPage: ServicePageData = {
  slug: "clipping-path",
  seo: {
    title:
      "Hand-Drawn Clipping Path Service | Photoshop Vector Paths — Studio Click House",
    description:
      "100% hand-crafted Photoshop clipping path service. Closed vector bezier curves, multi-path color isolation, and pre-press ready PSD/TIFF files for agencies and print catalogs.",
  },
  hero: {
    title: "Clipping",
    titleAccent: "Path.",
    description:
      "Precision hand-drawn vector paths created in Adobe Photoshop at 300%+ zoom. Guaranteed smooth bezier curves with zero jagged artifacts, embedded into layered PSDs or pre-press TIFFs.",
    media: clippingPathMedia.heroPenPath,
    supportingMedia: [
      clippingPathMedia.heroStillLife,
      clippingPathMedia.heroJewelry,
    ],
  },
  intro: {
    heading: "What is hand-crafted clipping path?",
    paragraphs: [
      "A clipping path is a closed vector path created using Photoshop's Pen Tool that isolates a 2D image from its background. Unlike automated software or magic-wand tools that leave jagged, pixelated halos, our experienced retouchers zoom in to 300% to manually plot smooth anchor points along natural object boundaries, ensuring flawless print and digital integration.",
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
        media: previewMedia.editingWorkspace,
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
    heading: "Built for catalog publishers & print production.",
    description:
      "Our team processes complex multi-path assignments for leading fashion lookbooks, commercial packaging designers, and global e-commerce retail networks.",
    stats: [
      { value: "300%+", label: "Zoom level precision on every path" },
      { value: "100%", label: "Manual pen tool craft (zero AI halo)" },
      { value: "50k+", label: "Paths delivered per month" },
    ],
    gallery: [
      {
        src: previewMedia.jewelryMacro.src,
        alt: "Complex multi-path jewelry isolation showing multiple hole knockouts",
        width: previewMedia.jewelryMacro.width,
        height: previewMedia.jewelryMacro.height,
        caption: "Multi-path jewelry knockout",
      },
      {
        src: previewMedia.perfumeStillLife.src,
        alt: "Fragrance bottle with curved glass vector clipping path",
        width: previewMedia.perfumeStillLife.width,
        height: previewMedia.perfumeStillLife.height,
        caption: "Glass curvature vector path",
      },
      {
        src: previewMedia.photoEditingShowcase.src,
        alt: "Fashion editorial subject path with clothing fold separation",
        width: previewMedia.photoEditingShowcase.width,
        height: previewMedia.photoEditingShowcase.height,
        caption: "Apparel contour clipping",
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
        media: {
          src: "https://images.pexels.com/photos/11711811/pexels-photo-11711811.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Perfume bottle simple clipping path",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-cp-footwear",
        title: "Footwear & Eyelet Knockouts",
        category: "Medium Path",
        technique: "Multi-Hole Lace & Sole Paths",
        media: {
          src: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Footwear multi-hole clipping path",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-cp-jewelry",
        title: "Fine Jewelry & Gemstone Facets",
        category: "Complex Path",
        technique: "Compound Multi-Prong Paths",
        media: {
          src: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Jewelry gemstone intricate clipping path",
          width: 1200,
          height: 800,
        },
      },
      {
        id: "gallery-cp-apparel",
        title: "Garment Wrinkles & Fabric Folds",
        category: "Medium Path",
        technique: "Silhouette Edge Tracing",
        media: {
          src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Garment outline vector path",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-cp-cosmetics",
        title: "Cosmetic Set Multi-Path",
        category: "Multi-Path",
        technique: "Individual Component Masking",
        media: {
          src: "https://images.pexels.com/photos/12352170/pexels-photo-12352170.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Cosmetic bottles separate multi-path channels",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-cp-furniture",
        title: "Luxury Watch Chronograph",
        category: "Super Complex",
        technique: "Dial, Bezel & Strap Multi-Paths",
        media: {
          src: "https://images.pexels.com/photos/11064129/pexels-photo-11064129.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Luxury watch multi-path clipping",
          width: 1200,
          height: 1600,
        },
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
        media: clippingPathMedia.audienceAgencies,
      },
      {
        title: "Advertising & Packaging Studios",
        description:
          "Design agencies needing isolated brand packshots and multi-path assets for high-resolution packaging key art.",
        media: previewMedia.editingWorkspace,
      },
      {
        title: "Commercial Photography Studios",
        description:
          "High-volume catalog and commercial studios offloading pathing tasks to maintain focus on client shooting days.",
        media: previewMedia.photoEditingShowcase,
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
  cta: {
    heading: "Need flawless vector clipping paths?",
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
