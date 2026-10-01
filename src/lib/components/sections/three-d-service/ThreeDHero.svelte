<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowDown, X } from "lucide-svelte";
  import type { ThreeDHeroData } from "$lib/content/three-d-modeling";

  let { data }: { data?: ThreeDHeroData } = $props();

  let isInteracting = $state(false);

  function enter3D() {
    isInteracting = true;
  }

  function exit3D() {
    isInteracting = false;
  }

  function scrollToNextSection() {
    isInteracting = false;
    const target = document.getElementById("threed-studio-showcase");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape" && isInteracting) {
        exit3D();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<svelte:head>
  <!-- Fast Network Preconnects & DNS Prefetching for Sketchfab CDN Assets -->
  <link rel="preconnect" href="https://sketchfab.com" />
  <link rel="preconnect" href="https://media.sketchfab.com" crossorigin="" />
  <link rel="preconnect" href="https://static.sketchfab.com" crossorigin="" />
  <link rel="dns-prefetch" href="https://sketchfab.com" />
  <link rel="dns-prefetch" href="https://media.sketchfab.com" />
  <link rel="dns-prefetch" href="https://static.sketchfab.com" />
</svelte:head>

<section
  id="threed-hero"
  aria-label="3D Interactive Showcase"
  class="relative isolate w-full h-dvh bg-[#111111] overflow-hidden pt-16 sm:pt-20 flex flex-col select-none"
>
  <h1 class="sr-only">
    {data?.title ?? "3D Product Modeling, CGI Rendering & Web 3D"} - {data?.titleAccent ?? "Studio Click House"}
  </h1>

  <div class="relative w-full flex-1 overflow-hidden">
    <!-- Sketchfab 3D Embed with Eager Preloading & Viewport UI Cropping -->
    <iframe
      title="G0025 VR Virtual Reality Gallery &quot;Rock Garden&quot;"
      class="absolute -top-[54px] left-0 w-full h-[calc(100%+108px)] border-0 transition-opacity duration-300 {isInteracting ? 'pointer-events-auto' : 'pointer-events-none'}"
      loading="eager"
      allowfullscreen
      allow="autoplay; fullscreen; xr-spatial-tracking; web-share"
      src="https://sketchfab.com/models/222a90842e244818a5d6dd140926e1cd/embed?autostart=1&preload=1&ui_annotations=0&ui_controls=0&ui_infos=0&ui_watermark=0&ui_theme=dark&dnt=1"
    ></iframe>

    <!-- When NOT interacting: Click to Enter Button + Normal Scroll Passthrough -->
    {#if !isInteracting}
      <!-- Full click-to-activate backdrop -->
      <button
        type="button"
        onclick={enter3D}
        aria-label="Click to enter 3D gallery"
        class="absolute inset-0 z-10 cursor-pointer focus:outline-none bg-gradient-to-t from-black/40 via-transparent to-transparent"
      ></button>

      <!-- Center Action Button -->
      <div class="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          type="button"
          onclick={enter3D}
          class="rounded-full bg-brand-dark/90 px-6 py-2.5 text-xs font-medium tracking-wider text-brand-light shadow-2xl backdrop-blur-md border border-white/20 hover:border-white/50 hover:bg-brand-dark transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          Click to Enter 3D Gallery
        </button>
      </div>
    {:else}
      <!-- When interacting: Floating Exit Button in top corner -->
      <div class="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <button
          type="button"
          onclick={exit3D}
          class="flex items-center gap-1.5 rounded-full bg-brand-dark/90 px-4 py-2 text-xs font-medium tracking-wide text-brand-light shadow-xl backdrop-blur-md border border-white/20 hover:border-white/50 hover:bg-brand-dark transition-all duration-200 cursor-pointer active:scale-95"
          title="Exit 3D mode"
        >
          <X size={14} />
          <span>Exit 3D (Esc)</span>
        </button>
      </div>
    {/if}

    <!-- Always Accessible: Scroll Down to Services Button -->
    <div class="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
      <button
        type="button"
        onclick={scrollToNextSection}
        class="flex items-center gap-1.5 rounded-full bg-brand-dark/85 px-4 py-2 text-xs font-medium text-brand-light/90 shadow-lg backdrop-blur-md border border-white/15 hover:border-white/40 hover:bg-brand-dark transition-all duration-200 cursor-pointer active:scale-95"
      >
        <span>Scroll to Services</span>
        <ArrowDown size={13} strokeWidth={2} />
      </button>
    </div>
  </div>
</section>
