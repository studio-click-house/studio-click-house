<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { PortfolioPageData } from "$lib/types/portfolio";

  interface Props {
    stories: NonNullable<PortfolioPageData["staggeredStories"]>;
  }

  let { stories }: Props = $props();

  let section = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!section) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap, ScrollTrigger } = runtime;
      const root = section;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const cards = root.querySelectorAll(".stagger-card");
          if (cards.length > 0) {
            ScrollTrigger.batch(cards, {
              start: "top 88%",
              onEnter: (batch) => {
                gsap.fromTo(
                  batch,
                  { autoAlpha: 0, y: 40 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.12,
                    ease: "power3.out",
                    overwrite: "auto",
                  },
                );
              },
              once: true,
            });

            // Parallax scroll on internal images
            cards.forEach((card) => {
              const img = card.querySelector("img");
              if (img) {
                gsap.fromTo(
                  img,
                  { yPercent: -5 },
                  {
                    yPercent: 5,
                    ease: "none",
                    scrollTrigger: {
                      trigger: card,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: true,
                    },
                  },
                );
              }
            });
          }
        });

        return () => media.revert();
      }, root);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="portfolio-staggered-showcase"
  bind:this={section}
  aria-labelledby="staggered-showcase-title"
  class="relative overflow-hidden bg-brand-light py-20 lg:py-32 border-b border-brand-dark/10"
>
  <div class="site-shell">
    <!-- Section Header -->
    <div class="max-w-3xl mb-14 lg:mb-20">
      <div class="inline-flex items-center gap-2 mb-3">
        <span class="size-1.5 rounded-full bg-brand-green"></span>
        <span
          class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-green"
        >
          Curated Highlights
        </span>
      </div>
      <h2
        id="staggered-showcase-title"
        class="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-dark leading-[1]"
      >
        Featured Stories & <span class="italic font-light text-brand-green"
          >Craft Highlights</span
        >
      </h2>
      <p
        class="mt-4 text-base sm:text-lg text-brand-dark/70 font-normal max-w-xl"
      >
        Explore individual production workflows, highlighting our signature
        multi-step retouching, clipping precision, and dimensional tailoring.
      </p>
    </div>

    <!-- Asymmetric Editorial Grid (Matches reference image layout) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
      <!-- Left Column: Large Tall Primary Story -->
      {#if stories[0]}
        {@const s1 = stories[0]}
        <article
          class="stagger-card md:col-span-6 lg:col-span-5 flex flex-col rounded-2xl overflow-hidden border border-brand-dark/10 bg-white shadow-lg transition-transform duration-500 hover:-translate-y-1"
        >
          <div
            class="relative aspect-[3/4] w-full overflow-hidden bg-brand-dark/5"
          >
            <img
              src={s1.media.src}
              alt={s1.media.alt}
              width={s1.media.width}
              height={s1.media.height}
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover will-change-transform scale-105"
            />
            <div
              class="absolute top-4 left-4 rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 border border-brand-dark/10 shadow-xs"
            >
              <span
                class="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-green"
              >
                {s1.category}
              </span>
            </div>
            <div
              class="absolute top-4 right-4 rounded-md bg-brand-dark/80 backdrop-blur-sm px-2 py-1 text-white"
            >
              <span class="font-mono text-[10px] uppercase tracking-wider"
                >{s1.year}</span
              >
            </div>
          </div>
          <div class="p-6 sm:p-8 flex flex-col justify-between flex-1">
            <div>
              <h3
                class="font-display text-2xl sm:text-3xl font-normal text-brand-dark leading-tight mb-3"
              >
                {s1.title}
              </h3>
              <p
                class="text-sm sm:text-base text-brand-dark/75 leading-relaxed font-normal"
              >
                {s1.description}
              </p>
            </div>
            <div
              class="mt-6 pt-4 border-t border-brand-dark/10 flex items-center justify-between"
            >
              <span class="font-mono text-xs text-brand-dark/60"
                >High-Fashion Lookbook</span
              >
              <span
                class="font-mono text-xs font-semibold text-brand-green uppercase tracking-wider"
                >Studio Verified</span
              >
            </div>
          </div>
        </article>
      {/if}

      <!-- Center / Right Offset Column: Stack of Varied Projects -->
      <div
        class="md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10"
      >
        {#each stories.slice(1) as story, i (story.id)}
          <article
            class="stagger-card flex flex-col rounded-2xl overflow-hidden border border-brand-dark/10 bg-white shadow-md transition-transform duration-500 hover:-translate-y-1 {i %
              2 ===
            1
              ? 'sm:translate-y-8'
              : ''}"
          >
            <div
              class="relative {i === 0
                ? 'aspect-video'
                : i === 1
                  ? 'aspect-square'
                  : 'aspect-[4/5]'} w-full overflow-hidden bg-brand-dark/5"
            >
              <img
                src={story.media.src}
                alt={story.media.alt}
                width={story.media.width}
                height={story.media.height}
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover will-change-transform scale-105"
              />
              <div
                class="absolute top-3 left-3 rounded-md bg-white/90 backdrop-blur-sm px-2 py-0.5 border border-brand-dark/10 shadow-xs"
              >
                <span
                  class="font-mono text-[9px] font-semibold uppercase tracking-widest text-brand-green"
                >
                  {story.category}
                </span>
              </div>
            </div>
            <div class="p-5 sm:p-6 flex flex-col justify-between flex-1">
              <div>
                <h3
                  class="font-display text-lg sm:text-xl font-normal text-brand-dark leading-tight mb-2"
                >
                  {story.title}
                </h3>
                <p
                  class="text-xs sm:text-sm text-brand-dark/75 leading-relaxed font-normal"
                >
                  {story.description}
                </p>
              </div>
              <div
                class="mt-4 pt-3 border-t border-brand-dark/10 flex items-center justify-between text-xs text-brand-dark/50 font-mono"
              >
                <span>{story.year}</span>
                <span class="text-brand-green">Precision Grade A</span>
              </div>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>
