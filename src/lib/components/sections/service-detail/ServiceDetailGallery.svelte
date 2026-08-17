<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceGalleryData } from "$lib/types/service-detail";

  let { data } = $props<{ data: ServiceGalleryData }>();
  let section = $state<HTMLElement>();

  // Duplicate items for seamless continuous infinite marquee
  const marqueeItems = $derived([...data.items, ...data.items]);

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".sd-filmstrip-header", {
            autoAlpha: 0,
            y: 24,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
            },
          });

          gsap.from(".sd-filmstrip-container", {
            autoAlpha: 0,
            y: 30,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".sd-filmstrip-container",
              start: "top 92%",
              once: true,
            },
          });
        });

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  bind:this={section}
  id="service-detail-gallery"
  aria-labelledby="service-detail-gallery-title"
  class="relative isolate overflow-hidden py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div class="site-shell relative z-10 mb-9 lg:mb-12">
    <!-- Header with 2-line title & CTA -->
    <div
      class="sd-filmstrip-header flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
    >
      <div class="max-w-2xl">
        <h2
          id="service-detail-gallery-title"
          class="max-w-[18ch] font-display text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.04em]"
        >
          {data.heading}
        </h2>
        {#if data.description}
          <p class="mt-4 max-w-[48ch] text-base leading-7 text-brand-dark/64">
            {data.description}
          </p>
        {/if}
      </div>

      <a
        href={resolve("/portfolio")}
        class="group inline-flex shrink-0 items-center justify-between gap-2.5 rounded-[0.55rem] border border-brand-dark/18 bg-brand-paper px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-dark transition-all duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-dark"
      >
        <span>Explore Full Portfolio</span>
        <ArrowUpRight
          size={15}
          class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </a>
    </div>
  </div>

  <!-- Pure Minimalist Cinematic Filmstrip Reel -->
  <div class="sd-filmstrip-container relative w-full overflow-hidden">
    <!-- Edge soft vignette gradients -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-brand-light to-transparent sm:w-28"
      aria-hidden="true"
    ></div>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-brand-light to-transparent sm:w-28"
      aria-hidden="true"
    ></div>

    <!-- Marquee Track (pauses on hover) -->
    <div class="filmstrip-track flex gap-5 py-2 hover:[animation-play-state:paused]">
      {#each marqueeItems as item, idx (`${item.id}-${idx}`)}
        <article
          class="group relative aspect-[4/5] w-[17.5rem] shrink-0 overflow-hidden rounded-[0.95rem] transition-all duration-400 hover:-translate-y-1.5 sm:w-[20.5rem] lg:w-[23rem]"
        >
          <!-- High-res Media with smooth zoom -->
          <img
            src={item.media.src}
            alt={item.media.alt}
            width={item.media.width}
            height={item.media.height}
            loading="lazy"
            class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />

          <!-- Top category pill -->
          <div class="absolute left-3.5 top-3.5 flex items-center">
            <span
              class="rounded-[0.55rem] border border-brand-light/20 bg-brand-dark/50 px-2.5 py-1 font-mono text-[0.52rem] font-medium uppercase tracking-wider text-brand-light backdrop-blur-md transition-colors duration-300 group-hover:border-brand-green/40 group-hover:bg-brand-dark/75"
            >
              {item.category}
            </span>
          </div>

          <!-- Clean Hover Overlay: Title Only -->
          <div
            class="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent p-5 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
          >
            <h3 class="text-sm font-semibold tracking-[-0.015em] text-brand-light sm:text-base leading-snug">
              {item.title}
            </h3>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .filmstrip-track {
    width: max-content;
    animation: filmstrip-scroll 38s linear infinite;
  }

  @keyframes filmstrip-scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .filmstrip-track {
      animation: none;
      overflow-x: auto;
      width: auto;
    }
  }
</style>
