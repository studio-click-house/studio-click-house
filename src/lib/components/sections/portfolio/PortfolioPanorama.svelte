<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { PortfolioPageData } from "$lib/types/portfolio";

  interface Props {
    data: NonNullable<PortfolioPageData["panorama"]>;
  }

  let { data }: Props = $props();

  let section = $state<HTMLElement | null>(null);
  let watermarkElem = $state<HTMLElement | null>(null);

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
          if (watermarkElem) {
            gsap.fromTo(
              watermarkElem,
              { xPercent: 15 },
              {
                xPercent: -15,
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

          const img = section?.querySelector(".panorama-img");
          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.12 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
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
  id="portfolio-craft-panorama"
  bind:this={section}
  aria-labelledby="panorama-title"
  class="relative overflow-hidden bg-brand-light py-16 lg:py-24 border-b border-brand-dark/10"
>
  <!-- Huge Typography Marquee / Watermark (like "Arts" in the reference image) -->
  <div
    bind:this={watermarkElem}
    class="pointer-events-none absolute -bottom-10 right-0 select-none text-[26vw] font-black uppercase tracking-tighter text-brand-dark/[0.04] leading-none whitespace-nowrap z-0 will-change-transform"
    aria-hidden="true"
  >
    {data.watermark}
  </div>

  <div class="site-shell relative z-10">
    <div class="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-brand-dark/10 shadow-2xl bg-white aspect-[21/9] sm:aspect-[24/9]">
      <img
        src={data.media.src}
        alt={data.media.alt}
        width={data.media.width}
        height={data.media.height}
        loading="lazy"
        decoding="async"
        class="panorama-img h-full w-full object-cover object-center will-change-transform"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-brand-dark/60 via-brand-dark/20 to-transparent pointer-events-none"></div>

      <!-- Content overlay -->
      <div class="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-2xl text-white">
        <div class="inline-flex items-center gap-2 rounded-md bg-white/20 backdrop-blur-md px-3 py-1 border border-white/20 w-fit mb-3">
          <span class="size-1.5 rounded-full bg-brand-green"></span>
          <span class="font-mono text-xs uppercase tracking-widest text-brand-green font-semibold">
            {data.badge}
          </span>
        </div>
        <h2 id="panorama-title" class="font-display text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight drop-shadow-md mb-2">
          {data.headline}
        </h2>
        <p class="text-xs sm:text-base text-white/85 font-normal leading-relaxed drop-shadow-sm max-w-lg">
          {data.subheadline}
        </p>
      </div>
    </div>
  </div>
</section>
