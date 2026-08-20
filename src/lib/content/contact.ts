export const contactServices = [
  "Image editing",
  "Video post-production",
  "3D & CGI",
] as const;

export const contactHeroImages = [
  {
    src: "/images/contact/project-handoff.png",
    alt: "Creative collaborators handing over fashion contact sheets and a marked proof sleeve",
  },
  {
    src: "/images/portfolio/model-retouched.png",
    alt: "Finished fashion portrait after image retouching",
  },
  {
    src: "/images/portfolio/cgi-product-showcase.png",
    alt: "Finished product image from a 3D CGI production",
  },
] as const;

export const contactServiceDetails = [
  {
    name: contactServices[0],
    descriptor: "Retouching, isolation, color, and production-ready finishing.",
    image: "/images/work-fields/gallery/fashion-color.jpg",
    imageAlt: "Fashion model during professional studio photoshoot and retouching session",
  },
  {
    name: contactServices[1],
    descriptor: "Commercial edits, social versions, and controlled grading.",
    image: "/images/work-fields/studio-production-poster.jpg",
    imageAlt: "Studio production set with camera operator, lighting, and product staging",
  },
  {
    name: contactServices[2],
    descriptor: "Product modeling, material development, and CGI rendering.",
    image: "/images/work-fields/gallery/product-retouching.jpg",
    imageAlt: "Commercial fragrance product photography with high-speed water splash",
  },
] as const;
