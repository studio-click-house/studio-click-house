<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { PortfolioPageData } from "$lib/types/portfolio";

  interface Props {
    data: NonNullable<PortfolioPageData["magazineIntro"]>;
  }

  let { data }: Props = $props();

  let section = $state<HTMLElement | null>(null);
  let watermarkText = $state<HTMLElement | null>(null);
  let mainImage = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!section) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          if (watermarkText) {
            gsap.fromTo(
              watermarkText,
              { xPercent: -10 },
              {
                xPercent: 10,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          }

          if (mainImage) {
            gsap.from(mainImage, {
              y: 60,
              autoAlpha: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            });
          }
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
  id="portfolio-magazine-intro"
  bind:this={section}
  aria-labelledby="magazine-intro-title"
  class="relative overflow-hidden bg-brand-light py-20 lg:py-32 border-b border-brand-dark/10"
>
  <!-- Giant Background Layered Typography -->
  <div
    bind:this={watermarkText}
    class="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 select-none text-[22vw] font-black uppercase tracking-tighter text-brand-dark/[0.04] leading-none whitespace-nowrap z-0 will-change-transform"
    aria-hidden="true"
  >
    {data.watermarkText}
  </div>

  <div class="site-shell relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <!-- Left Column: Editorial Storytelling with multi-column rhythm -->
      <div class="lg:col-span-6 flex flex-col justify-center">
        <div class="inline-flex items-center gap-2 mb-4">
          <span class="font-mono text-xs font-semibold tracking-widest uppercase text-brand-green">
            {data.eyebrow}
          </span>
        </div>

        <h2
          id="magazine-intro-title"
          class="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-brand-dark leading-[1.05] mb-8"
        >
          {data.title}
        </h2>

        <!-- Multi-paragraph narrative with rich typography -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base text-brand-dark/80 leading-relaxed font-normal">
          {#each data.paragraphs as paragraph}
            <p>{paragraph}</p>
          {/each}
        </div>

        <!-- Studio credentials mini-bar -->
        <div class="mt-10 pt-6 border-t border-brand-dark/10 flex flex-wrap items-center gap-6 sm:gap-10">
          <div>
            <span class="block font-display text-2xl sm:text-3xl font-light text-brand-dark">100%</span>
            <span class="font-mono text-[11px] uppercase tracking-wider text-brand-dark/60">Hand-drawn Pen Paths</span>
          </div>
          <div class="h-8 w-px bg-brand-dark/10"></div>
          <div>
            <span class="block font-display text-2xl sm:text-3xl font-light text-brand-dark">Lossless</span>
            <span class="font-mono text-[11px] uppercase tracking-wider text-brand-dark/60">Frequency Separation</span>
          </div>
          <div class="h-8 w-px bg-brand-dark/10"></div>
          <div>
            <span class="block font-display text-2xl sm:text-3xl font-light text-brand-green">24h SLA</span>
            <span class="font-mono text-[11px] uppercase tracking-wider text-brand-dark/60">Fast Turnaround</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Layered Model Photography overlapping the watermark -->
      <div class="lg:col-span-6 relative flex items-center justify-center">
        <!-- Main Layered Card -->
        <div
          bind:this={mainImage}
          class="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-brand-dark/10 bg-white"
        >
          <div class="aspect-[4/5] w-full overflow-hidden">
            <img
              src={data.featuredImage.src}
              alt={data.featuredImage.alt}
              width={data.featuredImage.width}
              height={data.featuredImage.height}
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div class="p-5 bg-white border-t border-brand-dark/10 flex items-center justify-between">
            <div>
              <span class="font-mono text-[10px] uppercase tracking-widest text-brand-green font-semibold">
                High-End Beauty
              </span>
              <h3 class="font-display text-base font-normal text-brand-dark">
                Natural Skin Grain Preservation
              </h3>
            </div>
            <span class="font-mono text-xs text-brand-dark/40">2026 Archive</span>
          </div>
        </div>

        <!-- Secondary Floating Offset Stamp Card -->
        <div
          class="hidden sm:block absolute -bottom-6 -left-6 z-20 w-44 rounded-xl overflow-hidden shadow-xl border border-brand-dark/10 bg-white p-2"
        >
          <img
            src={data.secondaryImage.src}
            alt={data.secondaryImage.alt}
            width={data.secondaryImage.width}
            height={data.secondaryImage.height}
            loading="lazy"
            decoding="async"
            class="h-36 w-full object-cover rounded-lg"
          />
          <span class="block text-center font-mono text-[9px] uppercase tracking-widest text-brand-dark/70 pt-2 font-medium">
            Macro Precision
          </span>
        </div>
      </div>
    </div>
  </div>
</section>
