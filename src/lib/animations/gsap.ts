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

let initialRefreshPromise: Promise<void> | undefined;

export function refreshScrollTriggersAfterFonts() {
  if (!browser) return Promise.resolve();
  if (initialRefreshPromise) return initialRefreshPromise;

  initialRefreshPromise = (async () => {
    const runtime = await registerScrollTrigger();
    if (!runtime) return;

    await document.fonts.ready;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    runtime.ScrollTrigger.sort();
    runtime.ScrollTrigger.refresh();
  })();

  return initialRefreshPromise;
}

export async function refreshScrollTriggers() {
  if (!browser) return;
  const runtime = await registerScrollTrigger();
  if (!runtime) return;
  runtime.ScrollTrigger.refresh();
}

