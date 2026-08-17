import { previewMedia } from "$lib/content/media";
import type { ServicePageData } from "$lib/types/service-detail";

const ghostMannequinMedia = {
  heroApparel: {
    src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Fashion garment displayed with 3D invisible ghost mannequin effect showing inner collar and tag",
    width: 1800,
    height: 2400,
  },
  heroBlazer: {
    src: "https://images.pexels.com/photos/37233404/pexels-photo-37233404.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Tailored suit jacket with seamless neck joint and symmetric lapel alignment",
    width: 1600,
    height: 2000,
  },
  heroHoodie: {
    src: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Casual hoodie with hollow-man 3D hood volume and inner lining",
    width: 1600,
    height: 2000,
  },
  introJoint: {
    src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Apparel neck joint compositing step showing front and inner label alignment",
    width: 1600,
    height: 2000,
  },
  introSymmetry: {
    src: "https://images.pexels.com/photos/37233404/pexels-photo-37233404.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Symmetric sleeve and hem warping for balanced garment drape",
    width: 1600,
    height: 2000,
  },
  comparisonOriginal: {
    src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Garment photographed on physical plastic mannequin stand before editing",
    width: 1400,
    height: 1800,
  },
  comparisonGhost: {
    src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1400",
    alt: "Finished hollow-man ghost mannequin presentation with inner tag and 3D volume",
    width: 1400,
    height: 1800,
  },
  audienceFashion: {
    src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Fashion brand creative team reviewing seasonal e-commerce lookbook assets",
    width: 1600,
    height: 2000,
  },
} as const;

export const ghostMannequinPage: ServicePageData = {
  slug: "ghost-mannequin",
  seo: {
    title:
      "Ghost Mannequin Service | Invisible Mannequin Neck Joint Effect — Studio Click House",
    description:
      "Professional ghost mannequin & neck joint photo editing by Studio Click House. 3D hollow-man apparel compositing, inner tag alignment, wrinkle smoothing, and symmetric garment shaping.",
  },
  hero: {
    title: "Ghost",
    titleAccent: "Mannequin.",
    description:
      "Showcase the true fit, shape, and 3D volume of your apparel without distracting plastic mannequins. We seamlessly combine front, back, and inner collar shots into lifelike hollow-man presentations.",
    media: ghostMannequinMedia.heroApparel,
    supportingMedia: [
      ghostMannequinMedia.heroBlazer,
      ghostMannequinMedia.heroHoodie,
    ],
  },
  intro: {
    heading: "What is the ghost mannequin effect?",
    paragraphs: [
      "The ghost mannequin (or invisible mannequin) technique creates a 3D, hollow-body effect for apparel photography by digitally removing the mannequin stand and compositing the inner neckline, brand tag, and interior lining into one seamless garment image. It gives shoppers a clear sense of how the clothing drapes and fits in real life while keeping catalog presentations uniform and distraction-free.",
    ],
    stages: [
      {
        label: "Neck Joint & Tag Compositing",
        description:
          "We combine the primary front shot with the interior collar photo, aligning the brand label and inner stitching seamlessly.",
        media: ghostMannequinMedia.introJoint,
      },
      {
        label: "Symmetric Shape & Drape Warping",
        description:
          "Sleeves, hemlines, and shoulder seams are adjusted for balanced symmetry while preserving natural fabric physics.",
        media: ghostMannequinMedia.introSymmetry,
      },
      {
        label: "Wrinkle Reduction & Shadow Depth",
        description:
          "Unwanted creases and fabric puckering are softened, and realistic interior shadow depth is applied to enhance 3D volume.",
        media: previewMedia.photoEditingShowcase,
      },
    ],
  },
  beforeAfter: {
    heading: "See the 3D hollow-man transformation.",
    description:
      "Drag the slider to inspect how a plastic mannequin stand is removed and replaced with a realistic inner collar joint and balanced drape.",
    beforeSrc: ghostMannequinMedia.comparisonOriginal.src,
    beforeAlt: ghostMannequinMedia.comparisonOriginal.alt,
    afterSrc: ghostMannequinMedia.comparisonGhost.src,
    afterAlt: ghostMannequinMedia.comparisonGhost.alt,
    beforeLabel: "On mannequin",
    afterLabel: "Invisible 3D ghost",
    width: ghostMannequinMedia.comparisonGhost.width,
    height: ghostMannequinMedia.comparisonGhost.height,
    caption: "Drag to compare · Ghost mannequin neck joint",
  },
  showcase: {
    heading: "High-capacity apparel finishing for global fashion brands.",
    description:
      "Whether you sell tailored suits, activewear, lingerie, or luxury knitwear, our 24/7 post-production studio delivers consistent, high-volume ghost mannequin edits with rapid turnaround.",
    stats: [
      { value: "3,000+", label: "Garments processed weekly" },
      { value: "100%", label: "Consistent hem & neckline alignment" },
      { value: "24h", label: "Standard catalog turnaround" },
    ],
    gallery: [
      {
        src: previewMedia.photoEditingShowcase.src,
        alt: "Tailored suit jacket with clean interior lining and symmetric lapels",
        width: previewMedia.photoEditingShowcase.width,
        height: previewMedia.photoEditingShowcase.height,
        caption: "Blazer & suit neck joint",
      },
      {
        src: previewMedia.redStudioPortrait.src,
        alt: "Fashion dress displayed with realistic 3D volume and interior collar",
        width: previewMedia.redStudioPortrait.width,
        height: previewMedia.redStudioPortrait.height,
        caption: "Dress & skirt volume shaping",
      },
      {
        src: previewMedia.monochromePortrait.src,
        alt: "Apparel lookbook showing consistent ghost mannequin alignment across a series",
        width: previewMedia.monochromePortrait.width,
        height: previewMedia.monochromePortrait.height,
        caption: "Catalog series uniformity",
      },
    ],
  },
  gallery: {
    heading: "Selected Apparel Categories",
    description:
      "Explore diverse ghost mannequin executions across casual tops, luxury outerwear, activewear, and intricate dresses.",
    items: [
      {
        id: "gallery-gm-blazer",
        title: "Tailored Blazer & Suit Jacket",
        category: "Outerwear",
        technique: "Lapel Symmetry & Inner Lining Joint",
        media: {
          src: "https://images.pexels.com/photos/37233404/pexels-photo-37233404.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Tailored blazer ghost mannequin",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-gm-hoodie",
        title: "Casual Hoodie & Sweatshirt",
        category: "Streetwear",
        technique: "Hood Interior & Drawstring Cleanup",
        media: {
          src: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Streetwear hoodie ghost mannequin",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-gm-dress",
        title: "Evening Dress & Maxi Gown",
        category: "Dresses",
        technique: "Flowing Fabric & Bottom Hem Joint",
        media: {
          src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Evening dress invisible mannequin",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-gm-tshirt",
        title: "Crewneck & V-Neck T-Shirts",
        category: "Basics",
        technique: "Tag Alignment & Collar Rounding",
        media: {
          src: "https://images.pexels.com/photos/2738173/pexels-photo-2738173.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "T-shirt crewneck ghost mannequin",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-gm-sportswear",
        title: "Athletic Tops & Windbreakers",
        category: "Activewear",
        technique: "Zipper Joint & Dynamic Fit Warping",
        media: {
          src: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Sportswear jacket invisible mannequin",
          width: 1200,
          height: 1600,
        },
      },
      {
        id: "gallery-gm-lingerie",
        title: "Lingerie & Swimwear",
        category: "Intimates",
        technique: "Delicate Strap & Lace Masking",
        media: {
          src: "https://images.pexels.com/photos/18336955/pexels-photo-18336955.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Swimwear ghost mannequin presentation",
          width: 1200,
          height: 1600,
        },
      },
    ],
  },
  features: {
    heading: "Why top fashion brands partner with us",
    items: [
      {
        icon: "Shirt",
        title: "Seamless Inner Tag & Neck Joints",
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
    items: [
      {
        title: "Fashion Brands & Apparel Retailers",
        description:
          "Create uniform, high-converting product pages that clearly communicate fit and cut without the cost of hiring on-model shoots.",
        media: ghostMannequinMedia.audienceFashion,
      },
      {
        title: "E-Commerce Marketplaces",
        description:
          "Standardize third-party seller clothing images to maintain a cohesive, professional aesthetic across your storefront.",
        media: previewMedia.photoEditingShowcase,
      },
      {
        title: "Commercial Fashion Photographers",
        description:
          "Provide end-to-end hollow-man composite deliverables to your apparel clients without spending hours on Photoshop neck joints.",
        media: previewMedia.editingWorkspace,
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
          "Inspect our seamless neck joint and 3D volume shaping with zero risk.",
      },
      {
        title: "Scale your collection",
        description:
          "Receive overnight catalog-ready deliverables across all seasonal lines.",
      },
    ],
  },
};
