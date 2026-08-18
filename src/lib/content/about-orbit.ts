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
    title: "AI Fashion Retouching",
    category: "Intelligent finishing",
    shape: "tall",
    media: {
      src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1122&q=85",
      alt: "High-fashion editorial model with designer styling and studio lighting",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-2",
    title: "AI Product Compositing",
    category: "Generative studio",
    shape: "compact",
    media: {
      src: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1122&q=85",
      alt: "Luxury amber glass perfume bottle with studio lighting and warm reflections",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-3",
    title: "Generative 3D CGI",
    category: "AI visualization",
    shape: "portrait",
    media: {
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1122&q=85",
      alt: "High-fashion model in a flowing couture designer dress with editorial motion",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-4",
    title: "Intelligent Color Grading",
    category: "Cinematic AI",
    shape: "tall",
    media: {
      src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1122&q=85",
      alt: "Cinematic beauty portrait with golden studio lighting and immaculate retouching",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-5",
    title: "AI E-commerce Masking",
    category: "Smart isolation",
    shape: "portrait",
    media: {
      src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1122&q=85",
      alt: "Luxury designer leather handbag on an editorial studio podium",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-6",
    title: "AI Jewelry Retouching",
    category: "Precision detail",
    shape: "compact",
    media: {
      src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1122&q=85",
      alt: "Luxury brilliant diamond ring close-up with pristine facets and polished reflections",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-7",
    title: "AI Beauty Retouching",
    category: "Natural texture",
    shape: "portrait",
    media: {
      src: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?auto=format&fit=crop&w=1122&q=85",
      alt: "High-end skincare beauty portrait with luminous complexion and natural skin texture",
      width: 1122,
      height: 1402,
    },
  },
  {
    id: "orbit-8",
    title: "AI Video Editing",
    category: "Intelligent motion",
    shape: "tall",
    media: {
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1122&q=85",
      alt: "Striking fashion editorial portrait with cinematic lighting and high-fashion styling",
      width: 1122,
      height: 1402,
    },
  },
];
