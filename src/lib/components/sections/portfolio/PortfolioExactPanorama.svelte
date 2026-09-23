<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let panoramaSection = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!panoramaSection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !panoramaSection) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add(
          {
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          (context) => {
            const { isDesktop, isTablet, isMobile, reduceMotion } = context.conditions!;
            const img = panoramaSection?.querySelector(".panorama-frame-img");
            const caption = panoramaSection?.querySelector(".panorama-caption");

            if (!img) return;

            if (reduceMotion) {
              gsap.set([img, caption].filter(Boolean), { autoAlpha: 1, scale: 1, yPercent: 0, y: 0 });
              return;
            }

            const scaleStart = isDesktop ? 1.08 : isTablet ? 1.06 : 1.08;
            const yRange = isDesktop ? 4 : isTablet ? 3.5 : 5.5;
            const scrubVal = isDesktop ? 1 : isTablet ? 0.8 : 0.7;
            const captionY = isDesktop ? 24 : isTablet ? 20 : 28;
            const startTrigger = isDesktop ? "top 78%" : isTablet ? "top 80%" : "top 78%";

            // Continuous scroll parallax on all platforms, tuned for buttery 60-120fps glide
            gsap.fromTo(
              img,
              { scale: scaleStart, yPercent: -yRange },
              {
                scale: 1,
                yPercent: yRange,
                ease: "none",
                scrollTrigger: {
                  trigger: panoramaSection,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: scrubVal,
                },
              }
            );

            if (caption) {
              gsap.from(caption, {
                y: captionY,
                autoAlpha: 0,
                duration: 0.8,
                ease: "power2.out",
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: panoramaSection,
                  start: startTrigger,
                  toggleActions: "play none none reverse",
                },
              });
            }
          }
        );
        return () => media.revert();
      }, panoramaSection);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="portfolio-craft-panorama"
  bind:this={panoramaSection}
  aria-label="Full-Width Craftsmanship Texture Panorama"
  class="relative w-full bg-brand-light py-16 lg:py-24 overflow-hidden"
>
  <div class="site-shell relative z-10">
    <div
      class="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] max-h-[580px] rounded-2xl md:rounded-3xl border border-brand-dark/10 shadow-2xl overflow-hidden bg-brand-dark"
    >
      <img
        src="/images/services/ai-retouch/jewelry-retouching.jpg"
        alt="Pearl necklace and gold jewelry arranged for a fine-jewelry retouching showcase"
        width="1600"
        height="900"
        loading="lazy"
        decoding="async"
        class="panorama-frame-img h-full w-full object-cover object-center will-change-transform"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/15 to-transparent pointer-events-none"></div>

      <!-- Editorial Spread Caption (Clean Typography, No Floating Pills) -->
      <div class="panorama-caption absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 flex flex-wrap items-end justify-between gap-4 text-brand-light z-10">
        <div>
          <span class="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-green font-semibold block mb-1">
            Macro Materiality
          </span>
          <h3 class="font-display text-xl sm:text-3xl font-normal text-white drop-shadow-sm">
            Fine Jewelry, Watch Refraction & Gemstone Radiance
          </h3>
        </div>
        <span class="hidden sm:block font-mono text-xs uppercase tracking-widest text-white/70">
          Multi-Focus Stacking · 8K Master
        </span>
      </div>
    </div>
  </div>
</section>
