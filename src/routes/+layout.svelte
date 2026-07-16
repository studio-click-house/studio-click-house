<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import CursorOrb from "$lib/components/animations/CursorOrb.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { createLenis } from "$lib/animations/lenis";

  let { children } = $props();

  onMount(() => {
    let active = true;
    let runtime: Awaited<ReturnType<typeof createLenis>> = null;

    createLenis().then((createdRuntime) => {
      if (!active) {
        createdRuntime?.destroy();
        return;
      }
      runtime = createdRuntime;
    });

    return () => {
      active = false;
      runtime?.destroy();
    };
  });
</script>

<svelte:head>
  <link rel="icon" href="/images/brand/schl-logo.png" />
</svelte:head>

<a
  href="#main-content"
  class="sr-only fixed left-4 top-4 z-[60] bg-brand-light px-4 py-3 focus:not-sr-only"
  >Skip to content</a
>
<Navbar />
<CursorOrb />
{@render children()}
<Footer />
