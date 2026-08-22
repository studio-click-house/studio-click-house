<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import CursorOrb from "$lib/components/animations/CursorOrb.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import FloatingSocialBar from "$lib/components/layout/FloatingSocialBar.svelte";
  import SitePreloader from "$lib/components/animations/SitePreloader.svelte";
  import { afterNavigate } from "$app/navigation";
  import { createLenis } from "$lib/animations/lenis";
  import { refreshScrollTriggersAfterFonts, refreshScrollTriggers } from "$lib/animations/gsap";

  let { children } = $props();
  let lenisRuntime: Awaited<ReturnType<typeof createLenis>> = null;

  afterNavigate((navigation) => {
    // Force scroll to top on page change, unless navigating to a hash link
    if (!navigation.to?.url.hash) {
      if (lenisRuntime?.lenis) {
        lenisRuntime.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }

    setTimeout(() => {
      void refreshScrollTriggers();
    }, 150);
  });

  onMount(() => {
    let active = true;

    const startLenis = () => {
      if (!active || lenisRuntime) return;

      createLenis().then((createdRuntime) => {
        if (!active) {
          createdRuntime?.destroy();
          return;
        }
        lenisRuntime = createdRuntime;
        void refreshScrollTriggersAfterFonts();
      });
    };

    const preloader = document.querySelector(".site-preloader");
    if (preloader) {
      window.addEventListener("site-preloader-complete", startLenis, {
        once: true,
      });
    } else {
      startLenis();
    }

    return () => {
      active = false;
      window.removeEventListener("site-preloader-complete", startLenis);
      lenisRuntime?.destroy();
    };
  });
</script>

<svelte:head>
  <link rel="icon" href="/images/brand/schl-logo.png" />
  <link rel="preload" as="image" href="/images/brand/schl-logo-green.png" />
  <link rel="preload" as="image" href="/images/brand/schl-logo-gray.png" />
  <link rel="preload" as="image" href="/images/brand/schl-logo.png" />
</svelte:head>

<a
  href="#main-content"
  class="sr-only fixed left-4 top-4 z-[60] bg-brand-light px-4 py-3 focus:not-sr-only"
  >Skip to content</a
>
<SitePreloader />
<Navbar />
<FloatingSocialBar />
<CursorOrb />
{@render children()}
<Footer />
