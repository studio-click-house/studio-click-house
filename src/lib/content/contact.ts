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
    image: "/images/portfolio/photo-editing-showcase.png",
    imageAlt: "Finished fashion portrait with controlled retouching and color",
  },
  {
    name: contactServices[1],
    descriptor: "Commercial edits, social versions, and controlled grading.",
    image: "/images/hero/hero-poster.jpg",
    imageAlt: "Studio video post-production preview frame",
  },
  {
    name: contactServices[2],
    descriptor: "Product modeling, material development, and CGI rendering.",
    image: "/images/portfolio/model-shadowed.png",
    imageAlt: "Fashion product image with a finished dimensional shadow",
  },
] as const;
