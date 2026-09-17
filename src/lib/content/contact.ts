export const contactServices = [
  "Image editing",
  "Video post-production",
  "3D & CGI",
] as const;

export const contactHeroImages = [
  {
    src: "/images/services/model-beauty/model-black-silk-floral-slip-dress-15.webp",
    alt: "High fashion editorial silk slip dress retouching showcase",
  },
  {
    src: "/images/services/jewelry/jewelry-aquamarine-emerald-gold-ring-4072.webp",
    alt: "Macro fine jewelry aquamarine emerald and gold ring retouching",
  },
  {
    src: "/images/services/product-services/product-food-editorial-pancake-breakfast-spread.webp",
    alt: "Commercial food styling and editorial product composition",
  },
] as const;

export const contactServiceDetails = [
  {
    name: contactServices[0],
    descriptor: "Retouching, isolation, color, and production-ready finishing.",
    image: "/images/services/ghost-mannequin-apparel/apparel-montmartre-stripe-maxi-dress-146.webp",
    imageAlt: "High fashion editorial model in designer pleated maxi dress",
    objectPosition: "object-[center_6%]",
  },
  {
    name: contactServices[1],
    descriptor: "Commercial edits, social versions, and controlled grading.",
    image: "/images/services/model-beauty/model-executive-headshot-male-gradient-bg-0033.webp",
    imageAlt: "Commercial executive portrait with cinematic studio lighting and controlled color grading",
    objectPosition: "object-[center_6%]",
  },
  {
    name: contactServices[2],
    descriptor: "Product modeling, material development, and CGI rendering.",
    image: "/images/services/ghost-mannequin-apparel/ghost-mannequin-antony-morato-fleece-jacket.webp",
    imageAlt: "Editorial studio model in designer navy jacket showcasing 3D CGI apparel finishing",
    objectPosition: "object-[center_6%]",
  },
] as const;
