import { browser } from "$app/environment";
import { registerScrollTrigger } from "$lib/animations/gsap";

const scrollListeners = new Set<() => void>();

export function onLenisScroll(listener: () => void) {
  scrollListeners.add(listener);
  return () => scrollListeners.delete(listener);
}

let activeLenis: { scrollTo: (target: string | HTMLElement | number, options?: Record<string, unknown>) => void } | null = null;

export function scrollToTarget(
  target: string | HTMLElement | number,
  options: { offset?: number; immediate?: boolean; duration?: number } = {},
) {
  if (!browser) return;
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el == null) return;

  if (activeLenis) {
    activeLenis.scrollTo(el, {
      offset: options.offset ?? -20,
      immediate: options.immediate ?? false,
      duration: options.duration ?? 1.1,
    });
  } else {
    if (typeof el === "number") {
      window.scrollTo({ top: el, behavior: options.immediate ? "auto" : "smooth" });
    } else {
      el.scrollIntoView({ behavior: options.immediate ? "auto" : "smooth" });
    }
  }
}

export async function createLenis() {
  if (!browser) {
    return null;
  }

  const [{ default: Lenis }, { gsap }, runtime] = await Promise.all([
    import("lenis"),
    import("gsap"),
    registerScrollTrigger(),
  ]);
  if (!runtime) return null;
  const { ScrollTrigger } = runtime;

  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
  });
  activeLenis = lenis;

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
      activeLenis = null;
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    },
  };
}
