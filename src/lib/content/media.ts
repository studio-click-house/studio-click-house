import type { PreviewMedia } from "$lib/types/content";

// Temporary Pexels preview media. Replace these URLs with approved R2 assets later.
export const previewMedia = {
  studioPortrait: {
    src: "https://images.pexels.com/photos/37233404/pexels-photo-37233404.jpeg?auto=compress&cs=tinysrgb&w=2200",
    alt: "Fashion portrait photographed under controlled studio lighting",
    width: 2200,
    height: 1467,
    credit: "Temporary preview photo by Khanh LP via Pexels",
  },
  editingWorkspace: {
    src: "https://images.pexels.com/photos/37848029/pexels-photo-37848029.jpeg?auto=compress&cs=tinysrgb&w=2000",
    alt: "Photo editing workspace with multiple displays",
    width: 2000,
    height: 1333,
    credit: "Temporary preview photo by Tom Fisk via Pexels",
  },
  monochromePortrait: {
    src: "https://images.pexels.com/photos/24972993/pexels-photo-24972993.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Monochrome editorial portrait in a photography studio",
    width: 1800,
    height: 2700,
    credit: "Temporary preview photo via Pexels",
  },
  redStudioPortrait: {
    src: "https://images.pexels.com/photos/17173186/pexels-photo-17173186.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Editorial fashion portrait against a saturated studio backdrop",
    width: 1800,
    height: 2700,
    credit: "Temporary preview photo via Pexels",
  },
  perfumeStillLife: {
    src: "https://images.pexels.com/photos/18302102/pexels-photo-18302102.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Perfume bottle arranged as a polished product still life",
    width: 1800,
    height: 2700,
    credit: "Temporary preview photo by Usama Ishtiaq via Pexels",
  },
  perfumeShadow: {
    src: "https://images.pexels.com/photos/11711811/pexels-photo-11711811.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Perfume product photographed with directional light and shadow",
    width: 1800,
    height: 2400,
    credit: "Temporary preview photo by Anis Salmani via Pexels",
  },
  jewelryMacro: {
    src: "https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Pearl jewelry photographed against a reflective surface",
    width: 1800,
    height: 2400,
    credit: "Temporary preview photo by Alexey Demidov via Pexels",
  },
  jewelryDetail: {
    src: "https://images.pexels.com/photos/11064129/pexels-photo-11064129.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Detailed close-up of a pearl necklace",
    width: 1800,
    height: 2400,
    credit: "Temporary preview photo by Alexey Demidov via Pexels",
  },
  videoColorGrading: {
    src: "https://images.pexels.com/photos/325111/pexels-photo-325111.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "Video timeline and color grading interface in editing suite",
    width: 1800,
    height: 1200,
    credit: "Temporary preview photo via Pexels",
  },
  product3dModel: {
    src: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1800",
    alt: "3D wireframe mesh modeling software interface",
    width: 1800,
    height: 1200,
    credit: "Temporary preview photo via Pexels",
  },
} satisfies Record<string, PreviewMedia>;
