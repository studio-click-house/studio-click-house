import type { PreviewMedia } from "$lib/types/content";

// Approved Studio Click House preview media assets.
export const previewMedia = {
  studioPortrait: {
    src: "/images/services/model-beauty/model-cue-chic-editorial-fashion-0161.webp",
    alt: "Fashion portrait photographed under controlled studio lighting",
    width: 1600,
    height: 2000,
    credit: "Studio Click House",
  },
  editingWorkspace: {
    src: "/images/about/orbit/ai-video-editing.jpg",
    alt: "Photo and video editing workspace with color-calibrated monitors",
    width: 1122,
    height: 1402,
    credit: "Studio Click House",
  },
  monochromePortrait: {
    src: "/images/services/model-beauty/model-corporate-headshot-executive-male-3683-after.webp",
    alt: "Monochrome editorial portrait in a photography studio",
    width: 1600,
    height: 2000,
    credit: "Studio Click House",
  },
  redStudioPortrait: {
    src: "/images/services/model-beauty/model-rachel-gilbert-designer-gown-0094.webp",
    alt: "Editorial fashion portrait against a saturated studio backdrop",
    width: 1600,
    height: 2000,
    credit: "Studio Click House",
  },
  perfumeStillLife: {
    src: "/images/services/product-services/color-correction-coral-perfume-showcase.png",
    alt: "Perfume bottle arranged as a polished product still life",
    width: 1200,
    height: 1200,
    credit: "Studio Click House",
  },
  perfumeShadow: {
    src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-pink-cream-after.webp",
    alt: "Perfume product photographed with directional light and shadow",
    width: 1600,
    height: 2000,
    credit: "Studio Click House",
  },
  jewelryMacro: {
    src: "/images/services/jewelry/jewelry-oval-diamond-solitaire-engagement-ring-whitegold-after.webp",
    alt: "Pearl and diamond jewelry photographed against a reflective surface",
    width: 1600,
    height: 2000,
    credit: "Studio Click House",
  },
  jewelryDetail: {
    src: "/images/services/jewelry/jewelry-westhill-diamond-halo-ring-set-alt-0213.webp",
    alt: "Detailed close-up of a diamond and gold ring set",
    width: 1600,
    height: 2000,
    credit: "Studio Click House",
  },
  videoColorGrading: {
    src: "/images/about/orbit/ai-color-grading.jpg",
    alt: "Video timeline and color grading interface in editing suite",
    width: 1122,
    height: 1402,
    credit: "Studio Click House",
  },
  product3dModel: {
    src: "/images/portfolio/3d-cgi-showcase-v2.webp",
    alt: "3D wireframe mesh modeling software interface",
    width: 1200,
    height: 675,
    credit: "Studio Click House",
  },
  photoEditingShowcase: {
    src: "/images/portfolio/photo-editing-showcase.webp",
    alt: "Finished luxury fashion editorial portrait showcasing professional retouching and color grading",
    width: 1024,
    height: 1024,
    credit: "Studio Click House",
  },
  cgiProductShowcase: {
    src: "/images/portfolio/cgi-product-showcase.png",
    alt: "Photorealistic 3D CGI product render of a luxury glass perfume bottle",
    width: 1024,
    height: 1024,
    credit: "Studio Click House",
  },
  cgiProductShowcaseV2: {
    src: "/images/portfolio/3d-cgi-showcase-v2.webp",
    alt: "3D fragrance bottle transitioning from wireframe model to photorealistic CGI render",
    width: 1200,
    height: 675,
    credit: "Studio Click House AI-assisted concept image",
  },
} satisfies Record<string, PreviewMedia>;

export const studioDressColorways = [
  {
    id: "emerald",
    label: "Emerald",
    src: "/images/about/colorways/dress-color-emerald.webp",
    alt: "Studio portrait demonstrating an emerald outfit color correction",
    width: 1024,
    height: 1536,
  },
  {
    id: "cobalt",
    label: "Cobalt",
    src: "/images/about/colorways/dress-color-cobalt.webp",
    alt: "Studio portrait demonstrating a cobalt outfit color correction",
    width: 1024,
    height: 1536,
  },
  {
    id: "plum",
    label: "Plum",
    src: "/images/about/colorways/dress-color-plum.webp",
    alt: "Studio portrait demonstrating a plum outfit color correction",
    width: 1024,
    height: 1536,
  },
] as const;
