<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { PortfolioPageData } from "$lib/types/portfolio";

  interface Props {
    hero: PortfolioPageData["hero"];
  }

  let { hero }: Props = $props();

  let section = $state<HTMLElement | null>(null);
  let headlineElem = $state<HTMLElement | null>(null);
  let badgeElem = $state<HTMLElement | null>(null);
  let imageElem = $state<HTMLElement | null>(null);

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
          const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

          if (badgeElem) {
            tl.from(badgeElem, {
              y: 20,
              autoAlpha: 0,
              duration: 0.8,
            });
          }

          if (headlineElem) {
            const words = headlineElem.querySelectorAll(".hero-word");
            tl.from(
              words,
              {
                yPercent: 120,
                rotate: 2,
                duration: 1.1,
                stagger: 0.08,
              },
              "-=0.5",
            );
          }

          if (imageElem) {
            tl.from(
              imageElem,
              {
                scale: 1.08,
                autoAlpha: 0,
                duration: 1.3,
                ease: "power3.out",
              },
              "-=0.9",
            );

            gsap.to(imageElem.querySelector("img"), {
              yPercent: 12,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom top",
                scrub: true,
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
  id="portfolio-editorial-hero"
  bind:this={section}
  aria-labelledby="portfolio-editorial-title"
  class="relative min-h-[90dvh] w-full overflow-hidden bg-brand-light pt-28 pb-16 lg:pt-36 lg:pb-24 border-b border-brand-dark/10"
>
  <!-- Background artistic watermark typography -->
  <div
    class="pointer-events-none absolute -top-12 -left-8 select-none text-[18vw] font-black uppercase tracking-tighter text-brand-dark/[0.03] leading-none z-0"
    aria-hidden="true"
  >
    PORTFOLIO
  </div>

  <div class="site-shell relative z-10 flex flex-col items-center text-center">
    <!-- Top badge ribbon -->
    <div
      bind:this={badgeElem}
      class="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-dark/15 bg-white/80 px-4 py-1.5 backdrop-blur-sm shadow-xs"
    >
      <span class="size-2 rounded-full bg-brand-green animate-pulse"></span>
      <span class="font-mono text-xs font-medium tracking-widest text-brand-dark uppercase">
        {hero.eyebrow}
      </span>
    </div>

    <!-- Main Headline with expressive display typography -->
    <h1
      id="portfolio-editorial-title"
      bind:this={headlineElem}
      class="font-display max-w-5xl text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight text-brand-dark leading-[0.92] mb-6"
    >
      <span class="inline-block overflow-hidden pb-1">
        <span class="hero-word inline-block">{hero.headingLine1}</span>
      </span>{" "}
      <span class="inline-block overflow-hidden pb-1">
        <span class="hero-word inline-block italic font-light text-brand-green">{hero.headingLine2}</span>
      </span>
    </h1>

    <!-- Descriptive text -->
    <p class="max-w-2xl text-base sm:text-lg md:text-xl text-brand-dark/75 leading-relaxed font-normal mb-12">
      {hero.description}
    </p>

    <!-- Centerpiece Hero Media Framing -->
    <div
      bind:this={imageElem}
      class="relative w-full max-w-5xl rounded-2xl md:rounded-3xl overflow-hidden border border-brand-dark/10 shadow-2xl bg-brand-dark/5 aspect-[16/9] sm:aspect-[21/9]"
    >
      <img
        src={hero.heroMedia.src}
        alt={hero.heroMedia.alt}
        width={hero.heroMedia.width}
        height={hero.heroMedia.height}
        fetchpriority="high"
        loading="eager"
        class="h-full w-full object-cover object-center will-change-transform scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent pointer-events-none"></div>

      <!-- Floating Media Caption & Badge -->
      <div class="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-4 text-white z-10">
        <div>
          <span class="block font-mono text-[10px] sm:text-xs tracking-widest uppercase text-brand-green drop-shadow-sm font-semibold">
            Featured Editorial
          </span>
          <span class="font-display text-lg sm:text-2xl font-light drop-shadow-sm">
            High-Fashion Precision Retouching
          </span>
        </div>
        <div class="hidden sm:flex items-center gap-2 rounded-lg bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/15">
          <span class="font-mono text-[11px] tracking-wider text-white/90">
            CMYK & sRGB Mastered
          </span>
        </div>
      </div>
    </div>
  </div>
</section>
