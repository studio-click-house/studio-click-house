export const contactServices = [
  "Image editing",
  "Video post-production",
  "3D & CGI",
] as const;

export const contactServiceDetails = [
  {
    name: contactServices[0],
    descriptor: "Retouching, isolation, color, and production-ready finishing.",
    image: "/images/portfolio/model-retouched.png",
    imageAlt: "Finished fashion portrait after image retouching",
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

export const projectInputs = [
  {
    label: "Source",
    title: "Show us what exists.",
    description:
      "A raw frame, rough cut, model, reference, or marked proof gives the conversation a real starting point.",
  },
  {
    label: "Direction",
    title: "Name the decision.",
    description:
      "Tell us what must change, what must remain true, and where the final work needs to live.",
  },
  {
    label: "Delivery",
    title: "Define the finish.",
    description:
      "Share the intended formats, volume, review path, and timing so the production shape is visible early.",
  },
] as const;

export const contactProcess = [
  {
    title: "We read the material",
    description:
      "The studio reviews the brief, available source files, and the result you need.",
  },
  {
    title: "We shape the path",
    description:
      "Scope, workflow, file transfer, review stages, and timing are aligned around the actual project.",
  },
  {
    title: "The work begins",
    description:
      "Once the route is clear, production starts with shared references and an agreed finish.",
  },
] as const;
