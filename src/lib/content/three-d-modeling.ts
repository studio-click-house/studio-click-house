import type { FaqItem, PreviewMedia } from "$lib/types/content";

export interface ThreeDHeroData {
  title: string;
  titleAccent: string;
  description: string;
}

export interface ThreeDServiceOverviewItem {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
}

export interface ThreeDModelingSectionData {
  id: string;
  heading: string;
  leadParagraph: string;
  bodyParagraph: string;
  capabilities: {
    title: string;
    description: string;
  }[];
  wireframeImage: {
    src: string;
    alt: string;
    label: string;
  };
  shadedImage: {
    src: string;
    alt: string;
    label: string;
  };
}

export interface ThreeDTexturingSectionData {
  id: string;
  heading: string;
  leadParagraph: string;
  bodyParagraph: string;
  capabilities: {
    title: string;
    description: string;
  }[];
  clayImage: {
    src: string;
    alt: string;
    label: string;
  };
  texturedImage: {
    src: string;
    alt: string;
    label: string;
  };
}

export interface ThreeDCgiSectionData {
  id: string;
  heading: string;
  leadParagraph: string;
  bodyParagraph: string;
  capabilities: {
    title: string;
    description: string;
  }[];
  renderImage: {
    src: string;
    alt: string;
  };
}

export interface ThreeDTurntablesSectionData {
  id: string;
  heading: string;
  leadParagraph: string;
  bodyParagraph: string;
  capabilities: {
    title: string;
    description: string;
  }[];
  turntableVideoSrc: string;
  turntablePoster: string;
}

export interface ThreeDWorkflowStep {
  step: string;
  title: string;
  timeframe: string;
  description: string;
}

export interface ThreeDDeliveryItem {
  headline: string;
  specs: {
    label: string;
    value: string;
  }[];
}

export interface ThreeDModelingPageData {
  seo: {
    title: string;
    description: string;
  };
  hero: ThreeDHeroData;
  servicesOverview: ThreeDServiceOverviewItem[];
  modeling: ThreeDModelingSectionData;
  texturing: ThreeDTexturingSectionData;
  cgiRendering: ThreeDCgiSectionData;
  turntables: ThreeDTurntablesSectionData;
  workflow: ThreeDWorkflowStep[];
  deliverables: ThreeDDeliveryItem[];
  faqs: FaqItem[];
  faqImages: PreviewMedia[];
}

export const threeDModelingPageData: ThreeDModelingPageData = {
  seo: {
    title: "3D Product Modeling, PBR Texturing & CGI Rendering | Studio Click House",
    description:
      "High-end 3D product modeling, PBR material texturing, and photorealistic CGI rendering for luxury goods, packaging, footwear, and consumer brands.",
  },

  hero: {
    title: "3D product modeling",
    titleAccent: "& CGI rendering.",
    description:
      "We create photorealistic 3D models, custom PBR textures, and commercial CGI renders for packaging, fashion, jewelry, and digital campaigns.",
  },

  servicesOverview: [
    {
      id: "3d-product-modeling",
      number: "01",
      title: "3D Product Modeling",
      description: "Subdivision surface modeling with clean quad topology for packaging, bottles, and hardware.",
      image: "/images/work-fields/studio-production-poster.jpg",
    },
    {
      id: "texturing-shading",
      number: "02",
      title: "Texturing & Shading",
      description: "Realistic surface materials including brushed metal, frosted glass, leather, and fabrics.",
      image: "/images/services/jewelry/jewelry-editorial-seashell-gold-necklace-model-2061-after.webp",
    },
    {
      id: "cgi-rendering",
      number: "03",
      title: "CGI Rendering",
      description: "Virtual studio lighting and high-resolution commercial hero stills ready for print and web.",
      image: "/images/services/model-beauty/beauty-editorial-glam-makeup-retouch-0969-after.webp",
    },
    {
      id: "turntables-motion",
      number: "04",
      title: "360 Turntables & Web 3D",
      description: "Interactive 360 web viewers and smooth rotation loops for modern e-commerce storefronts.",
      image: "/images/services/model-beauty/model-cue-designer-fashion-editorial-0137.webp",
    },
  ],

  modeling: {
    id: "3d-product-modeling",
    heading: "3D Product Modeling",
    leadParagraph:
      "We build dimensionally accurate, production-grade 3D product models from CAD engineering files, sketches, or photographic references.",
    bodyParagraph:
      "Every curve, bevel, and seam is constructed using clean subdivision quad topology. This guarantees zero surface pinching, perfect highlights under any lighting condition, and seamless compatibility across all major 3D software.",
    capabilities: [
      {
        title: "Clean Sub-D Quad Topology",
        description: "Flawless surface curvature with zero pinching, faceting, or shading artifacts.",
      },
      {
        title: "Exact CAD & Measurement Scale",
        description: "Modeled to exact physical millimeter dimensions for manufacturing and packaging.",
      },
      {
        title: "Multi-Format 3D Pipeline",
        description: "Delivered in universal production formats including .GLB, .FBX, .OBJ, and .BLEND.",
      },
      {
        title: "Clean Hierarchy & UV Maps",
        description: "Properly unwrapped UVs, centered pivots, and organized named material groups.",
      },
    ],
    wireframeImage: {
      src: "/images/portfolio/3d-cgi-showcase-v2.webp",
      alt: "Subdivision surface wireframe and shaded product topology",
      label: "Quad Wireframe & Surface Model",
    },
    shadedImage: {
      src: "/images/portfolio/3d-cgi-showcase-v2.webp",
      alt: "Finished commercial 3D shaded product model",
      label: "Finished 3D Model",
    },
  },

  texturing: {
    id: "texturing-shading",
    heading: "Texturing & Shading",
    leadParagraph:
      "We reproduce the exact tactile quality of physical materials—from brushed aluminum and crystal glass to soft leather and embossed packaging.",
    bodyParagraph:
      "Using calibrated PBR (Physically Based Rendering) maps, our materials react realistically to changing light angles, reflections, and camera perspectives.",
    capabilities: [
      {
        title: "Calibrated PBR Surfaces",
        description: "Accurate roughness, specular reflections, metallic response, and subsurface scattering.",
      },
      {
        title: "Ultra-Sharp 4K & 8K Maps",
        description: "High-resolution texture maps that remain pin-sharp even in extreme macro close-ups.",
      },
      {
        title: "Custom Brand Foils & Embossing",
        description: "Embossed logos, metallic foil stamping, and tactile packaging finishes.",
      },
    ],
    clayImage: {
      src: "/images/portfolio/3d-cgi-showcase-v2.webp",
      alt: "Clay surface render",
      label: "Clay Surface",
    },
    texturedImage: {
      src: "/images/portfolio/cgi-product-showcase.png",
      alt: "Finished PBR material surface",
      label: "Finished PBR Material",
    },
  },

  cgiRendering: {
    id: "cgi-rendering",
    heading: "CGI Rendering",
    leadParagraph:
      "Commercial product photography without the cost, delays, or physical sample shipping of a traditional photo shoot.",
    bodyParagraph:
      "We set up virtual studio lighting rigs and ray-traced materials that capture true-to-life reflections, glass refraction, and subtle caustic light dispersion. Generate dozens of hero camera angles and infinite colorways from one single master 3D scene.",
    capabilities: [
      {
        title: "Virtual Studio Lighting",
        description: "Soft diffusers, rim accents, and customized dramatic reflections calibrated to your brand.",
      },
      {
        title: "Up to 8K Resolution",
        description: "Crisp, print-ready resolution for billboards, packaging, and high-DPI web displays.",
      },
      {
        title: "Transparent Alpha Cutouts",
        description: "Isolated product cutouts ready for immediate placement into catalog designs and ads.",
      },
      {
        title: "Rapid Colorway Iterations",
        description: "Swap textures, finishes, and labels in hours without booking a new studio session.",
      },
    ],
    renderImage: {
      src: "/images/portfolio/cgi-product-showcase.png",
      alt: "High-resolution ray-traced luxury perfume packshot with caustic reflections",
    },
  },

  turntables: {
    id: "web-3d-turntables",
    heading: "Interactive Web 3D & 360 Spinners",
    leadParagraph:
      "Give online shoppers the power to spin, zoom, and inspect your product from every angle directly in their browser.",
    bodyParagraph:
      "Interactive 3D increases customer engagement, reduces return rates, and elevates conversion. We build lightweight glTF/GLB models under 3MB optimized for sub-second loading on Shopify, WooCommerce, and custom web applications.",
    capabilities: [
      {
        title: "Sub-3MB Lightweight Web Assets",
        description: "Draco-compressed GLB files that load in milliseconds even on mobile connections.",
      },
      {
        title: "360° Touch & Drag Rotation",
        description: "Fluid, responsive 360-degree product inspection on desktop and mobile screens.",
      },
      {
        title: "Apple AR & WebXR Ready",
        description: "Instant augmented reality preview directly in mobile Safari and Chrome.",
      },
      {
        title: "Seamless Storefront Embed",
        description: "Zero-lag embedding for Shopify product pages, Webflow, and custom headless sites.",
      },
    ],
    turntableVideoSrc: "/videos/editing-video-720p.webm",
    turntablePoster: "/images/portfolio/3d-cgi-showcase-v2.webp",
  },

  workflow: [
    {
      step: "01",
      title: "References & Specs",
      timeframe: "Day 1",
      description: "Send us your CAD files, sketches, physical product samples, or reference photos.",
    },
    {
      step: "02",
      title: "3D Mesh Modeling",
      timeframe: "1 to 2 Days",
      description: "We build the high-precision 3D geometry and share interactive view links for shape approval.",
    },
    {
      step: "03",
      title: "Materials & Lighting",
      timeframe: "1 to 2 Days",
      description: "We apply realistic PBR textures, set up studio lighting, and send draft renders for review.",
    },
    {
      step: "04",
      title: "Final 3D Delivery",
      timeframe: "Hand-off",
      description: "Download high-res renders, master 3D files (GLB, FBX, OBJ), and layered source files.",
    },
  ],

  deliverables: [
    {
      headline: "Any 3D file format",
      specs: [
        { label: "Web & Mobile AR", value: "Optimized .GLB and .USDZ for instant web loading." },
        { label: "Production & Games", value: "Standard .FBX and .OBJ files compatible with all software." },
        { label: "Native Project Files", value: "Full project scene files (Blender / Cinema 4D / Maya)." },
        { label: "Clean Hierarchy", value: "Organized meshes, named material groups, and centered pivots." },
      ],
    },
    {
      headline: "High-resolution renders",
      specs: [
        { label: "Print & Hero Stills", value: "Ultra-sharp 4K and 8K renders in TIFF, PNG, or JPG." },
        { label: "Transparent Cutouts", value: "Alpha channel PNGs ready to drop onto any website background." },
        { label: "Layered EXR Files", value: "Multi-pass renders with separate depth, reflection, and shadow passes." },
        { label: "Consistent Color", value: "Calibrated Rec.709 and sRGB color profiles for digital and print." },
      ],
    },
    {
      headline: "Fast delivery & support",
      specs: [
        { label: "First Previews in 48h", value: "Early wireframe and clay previews to verify scale and shape." },
        { label: "Frame-by-Frame Notes", value: "Private review links to click and leave feedback on any angle." },
        { label: "Quick Revision Passes", value: "Fast adjustments to lighting, camera angles, and materials." },
        { label: "Permanent Archives", value: "Secure cloud backup so your 3D assets are always ready for new renders." },
      ],
    },
  ],

  faqs: [
    {
      question: "What files do you need to start a 3D modeling project?",
      answer:
        "We can work from CAD files (STEP, IGES), technical blueprints, 2D sketches, or even photos taken with your smartphone from different angles.",
    },
    {
      question: "Can we use these 3D models directly on our website or Shopify store?",
      answer:
        "Yes. We export lightweight, highly optimized GLB files specifically formatted for Shopify 3D, Three.js viewers, and mobile AR.",
    },
    {
      question: "How realistic are your CGI product renders compared to photography?",
      answer:
        "Our renders use physically based materials and ray-traced lighting that accurately simulate real glass, metals, fabrics, and plastics. In most cases, they look cleaner and sharper than physical photography.",
    },
    {
      question: "Can you change product colors or labels later without rebuilding the model?",
      answer:
        "Yes, absolutely. Once the 3D model is built, creating new colorways, packaging labels, or lighting moods is fast and cost-effective.",
    },
    {
      question: "What is your typical turnaround time for a 3D product model?",
      answer:
        "Standard product models take 2 to 4 business days. First clay previews are typically delivered within 48 hours for early feedback.",
    },
    {
      question: "Do we own the full intellectual property and 3D files?",
      answer:
        "Yes. You receive full ownership of the final 3D models, textures, and rendered images with no licensing restrictions.",
    },
  ],

  faqImages: [
    {
      src: "/images/portfolio/3d-cgi-showcase-v2.webp",
      alt: "3D CAD modeling, topology, and clay product preview",
      width: 1200,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/product-services/product-furniture-scandinavian-oak-chair-hero.png",
      alt: "Web-optimized 3D model for Shopify and e-commerce stores",
      width: 1200,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/portfolio/cgi-product-showcase.png",
      alt: "Photorealistic ray-traced product render with glass caustics",
      width: 1200,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/product-services/color-correction-coral-perfume-showcase.png",
      alt: "Fast packaging colorway iterations and material shaders",
      width: 1200,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/services/jewelry/jewelry-editorial-seashell-gold-necklace-model-2061-after.webp",
      alt: "High-precision jewelry 3D modeling and photorealistic render",
      width: 1200,
      height: 1500,
      credit: "Studio Click House",
    },
    {
      src: "/images/work-fields/studio-production-poster.jpg",
      alt: "Master 3D studio production assets and lighting archives",
      width: 1280,
      height: 720,
      credit: "Studio Click House",
    },
  ],
};
