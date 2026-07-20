<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import CursorOrb from "$lib/components/animations/CursorOrb.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import SitePreloader from "$lib/components/animations/SitePreloader.svelte";
  import { createLenis } from "$lib/animations/lenis";

  let { children } = $props();

  onMount(() => {
    let active = true;
    let runtime: Awaited<ReturnType<typeof createLenis>> = null;

    const startLenis = () => {
      if (!active || runtime) return;

      createLenis().then((createdRuntime) => {
        if (!active) {
          createdRuntime?.destroy();
          return;
        }
        runtime = createdRuntime;
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
      runtime?.destroy();
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
<CursorOrb />
{@render children()}
<Footer />
