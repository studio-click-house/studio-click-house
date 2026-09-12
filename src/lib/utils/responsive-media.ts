const responsiveImageWidths = [480, 800, 1200] as const;

export function getRemoteImageSrcset(src: string) {
  let url: URL;

  try {
    url = new URL(src);
  } catch {
    return undefined;
  }

  const supportsWidthTransform =
    url.hostname === "images.pexels.com" ||
    url.hostname === "images.unsplash.com";

  if (!supportsWidthTransform) return undefined;

  return responsiveImageWidths
    .map((width) => {
      const candidate = new URL(url);
      candidate.searchParams.set("w", String(width));
      if (candidate.hostname === "images.unsplash.com") {
        candidate.searchParams.set("q", "80");
      }
      return `${candidate.toString()} ${width}w`;
    })
    .join(", ");
}
