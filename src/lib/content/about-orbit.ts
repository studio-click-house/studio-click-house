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
      src: "/images/about/orbit/ai-fashion-retouching.jpg",
      alt: "AI-assisted fashion portrait retouching with precision analysis layers",
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
      src: "/images/about/orbit/ai-product-compositing.jpg",
      alt: "AI-assisted luxury product composition with controlled generative lighting",
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
      src: "/images/about/orbit/ai-3d-cgi.jpg",
      alt: "AI-assisted 3D product model transitioning from wireframe to photorealistic CGI",
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
      src: "/images/about/orbit/ai-color-grading.jpg",
      alt: "AI-assisted cinematic color grading with connected scene nodes",
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
      src: "/images/about/orbit/ai-ecommerce-masking.jpg",
      alt: "AI-assisted sneaker isolation with precise product contour paths",
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
      src: "/images/about/orbit/ai-jewelry-retouching.jpg",
      alt: "AI-assisted jewelry retouching with macro reflection analysis",
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
      src: "/images/about/orbit/ai-beauty-retouching.jpg",
      alt: "AI-assisted beauty retouching preserving natural skin texture",
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
      src: "/images/about/orbit/ai-video-editing.jpg",
      alt: "AI-assisted commercial video editing with intelligent timeline markers",
      width: 1122,
      height: 1402,
    },
  },
];
