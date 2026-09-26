<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceGalleryData } from "$lib/types/service-detail";
  import { _ } from "svelte-i18n";

  let { data } = $props<{ data: ServiceGalleryData }>();
  let section = $state<HTMLElement>();
  let trackRef = $state<HTMLElement>();

  let isHovered = $state(false);
  let isDragging = $state(false);
  let startX = 0;
  let startScrollLeft = 0;

  // Duplicate items for continuous exploration
  const galleryItems = $derived([...data.items, ...data.items]);

  function scrollPrev() {
    if (!trackRef) return;
    const card = trackRef.querySelector<HTMLElement>(".sd-gallery-card");
    const step = (card?.offsetWidth ?? 350) + 24;
    trackRef.scrollBy({ left: -step, behavior: "smooth" });
  }

  function scrollNext() {
    if (!trackRef) return;
    const card = trackRef.querySelector<HTMLElement>(".sd-gallery-card");
    const step = (card?.offsetWidth ?? 350) + 24;
    trackRef.scrollBy({ left: step, behavior: "smooth" });
  }

  function onPointerDown(e: PointerEvent) {
    if (!trackRef) return;
    isDragging = true;
    startX = e.clientX;
    startScrollLeft = trackRef.scrollLeft;
    trackRef.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging || !trackRef) return;
    const deltaX = e.clientX - startX;
    trackRef.scrollLeft = startScrollLeft - deltaX;
  }

  function onPointerUp(e: PointerEvent) {
    if (!isDragging || !trackRef) return;
    isDragging = false;
    try {
      trackRef.releasePointerCapture(e.pointerId);
    } catch {}
  }

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;
    let rafId: number | undefined;

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

          gsap.from(".sd-gallery-track", {
            autoAlpha: 0,
            y: 30,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          });

          // Gentle ambient drift that pauses on hover or drag
          function drift() {
            if (trackRef && !isHovered && !isDragging) {
              trackRef.scrollLeft += 0.65;
              if (trackRef.scrollLeft >= trackRef.scrollWidth / 2) {
                trackRef.scrollLeft = 0;
              }
            }
            rafId = requestAnimationFrame(drift);
          }
          rafId = requestAnimationFrame(drift);
        });

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      if (rafId) cancelAnimationFrame(rafId);
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
  <div class="site-shell relative z-10 mb-8 sm:mb-10 lg:mb-12">
    <!-- Header with 2-line title, description, and interactive slider controls -->
    <div
      class="sd-filmstrip-header flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
    >
      <h2
        id="service-detail-gallery-title"
        class="max-w-[18ch] shrink-0 font-display text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.04em]"
      >
        {data.heading}
      </h2>

      {#if data.description}
        <p class="max-w-[40ch] text-base leading-7 text-brand-dark/64">
          {data.description}
        </p>
      {/if}

      <!-- Controls group: Prev/Next arrows + Portfolio Link -->
      <div class="flex shrink-0 items-center gap-3 self-start sm:self-end">
        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={scrollPrev}
            aria-label="Previous apparel category"
            class="flex size-10 items-center justify-center rounded-full border border-brand-dark/15 bg-white text-brand-dark shadow-xs transition-all duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-dark active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onclick={scrollNext}
            aria-label="Next apparel category"
            class="flex size-10 items-center justify-center rounded-full border border-brand-dark/15 bg-white text-brand-dark shadow-xs transition-all duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-dark active:scale-95 cursor-pointer"
          >
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        <a
          href={resolve("/portfolio")}
          class="group inline-flex shrink-0 items-center justify-between gap-2 rounded-[0.55rem] border border-brand-dark/18 bg-brand-paper px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-dark transition-all duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-dark"
        >
          <span>{$_('serviceDetail.exploreFullPortfolio') || 'Explore Full Portfolio'}</span>
          <ArrowUpRight
            size={14}
            class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  </div>

  <!-- Interactive Tactile Reel (NO white shadow overlays) -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="relative w-full overflow-hidden"
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
  >
    <!-- Draggable / Scrollable Track -->
    <div
      bind:this={trackRef}
      class="sd-gallery-track flex gap-5 overflow-x-auto py-3 px-4 sm:px-8 lg:px-12 select-none cursor-grab active:cursor-grabbing"
      onpointerdown={onPointerDown}
      onpointermove={onPointerMove}
      onpointerup={onPointerUp}
      onpointercancel={onPointerUp}
      role="region"
      aria-label="Apparel categories slider"
    >
      {#each galleryItems as item, idx (`${item.id}-${idx}`)}
        <article
          class="sd-gallery-card group relative aspect-[4/5] w-[17.5rem] sm:w-[21rem] lg:w-[23.5rem] shrink-0 overflow-hidden rounded-[2rem] border border-brand-dark/10 bg-white shadow-md shadow-brand-dark/[0.04] transition-all duration-500 hover:-translate-y-2 hover:border-brand-dark/25 hover:shadow-2xl hover:shadow-brand-dark/10"
        >
          <!-- High-res Media with smooth zoom -->
          <img
            src={item.media.src}
            alt={item.media.alt}
            width={item.media.width}
            height={item.media.height}
            loading="lazy"
            draggable="false"
            class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .sd-gallery-track {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .sd-gallery-track::-webkit-scrollbar {
    display: none;
  }
</style>
