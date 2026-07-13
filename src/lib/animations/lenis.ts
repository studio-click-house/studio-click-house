import { browser } from "$app/environment";

export async function createLenis() {
  if (!browser) {
    return null;
  }

  const [{ default: Lenis }, { gsap }] = await Promise.all([
    import("lenis"),
    import("gsap"),
  ]);
  const lenis = new Lenis();
  const updateLenis = (time: number) => lenis.raf(time * 1000);

  gsap.ticker.add(updateLenis);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy() {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    },
  };
}
