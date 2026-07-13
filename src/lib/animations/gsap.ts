import { browser } from "$app/environment";

let isScrollTriggerRegistered = false;

export async function registerScrollTrigger() {
  if (!browser) {
    return null;
  }

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);

  if (!isScrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isScrollTriggerRegistered = true;
  }

  return { gsap, ScrollTrigger };
}
