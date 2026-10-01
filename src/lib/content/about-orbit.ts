export interface AboutOrbitCard {
  id: string;
  title: string;
  category: string;
  shape: "portrait" | "tall" | "compact";
  media: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const aboutOrbitCards: AboutOrbitCard[] = [
  {
    id: "orbit-1",
    title: "Tailored Ivory Blazer",
    category: "Outerwear",
    shape: "tall",
    media: {
      src: "/images/ai-retouching/composite-product-1-blazer.webp",
      alt: "Tailored ivory blazer studio packshot",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-2",
    title: "Ribbed Scoop Tank",
    category: "Knitwear",
    shape: "portrait",
    media: {
      src: "/images/ai-retouching/composite-product-2-top.webp",
      alt: "Ribbed white scoop-neck tank top studio packshot",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-3",
    title: "Pleated Wide-Leg Trousers",
    category: "Bottoms",
    shape: "tall",
    media: {
      src: "/images/ai-retouching/composite-product-3-trousers.webp",
      alt: "Pleated wide-leg trousers studio packshot",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-4",
    title: "Cognac Leather Handbag",
    category: "Accessories",
    shape: "compact",
    media: {
      src: "/images/ai-retouching/composite-product-4-handbag.webp",
      alt: "Tan leather handbag studio packshot",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-5",
    title: "Pointed Ivory Pumps",
    category: "Footwear",
    shape: "compact",
    media: {
      src: "/images/ai-retouching/composite-product-5-heels.webp",
      alt: "Pointed ivory stiletto pumps studio packshot",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-6",
    title: "Gold Hoop Earrings",
    category: "Jewelry",
    shape: "portrait",
    media: {
      src: "/images/ai-retouching/composite-product-6-heels.webp",
      alt: "Polished gold hoop earrings studio packshot",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-7",
    title: "Classic Gold Watch",
    category: "Watches",
    shape: "tall",
    media: {
      src: "/images/ai-retouching/composite-product-6-watch.webp",
      alt: "Luxury gold watch studio packshot",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-8",
    title: "Designer Sunglasses",
    category: "Eyewear",
    shape: "compact",
    media: {
      src: "/images/ai-retouching/composite-product-8-heels.webp",
      alt: "Tortoiseshell designer sunglasses studio packshot",
      width: 1122,
      height: 1402,
    },
  },
];
