import { browser } from "$app/environment";

const scrollListeners = new Set<() => void>();

export function onLenisScroll(listener: () => void) {
  scrollListeners.add(listener);
  return () => scrollListeners.delete(listener);
}

export async function createLenis() {
  if (!browser) {
    return null;
  }

  const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
    import("lenis"),
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
  });
  const updateLenis = (time: number) => lenis.raf(time * 1000);
  const handleScroll = () => {
    ScrollTrigger.update();
    scrollListeners.forEach((listener) => listener());
  };

  lenis.on("scroll", handleScroll);
  gsap.ticker.add(updateLenis);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy() {
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    },
  };
}
