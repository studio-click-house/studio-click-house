<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";

  let collageSection = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!collageSection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !collageSection) return;
      const { gsap } = runtime;
      const root = collageSection;

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
            const cards = root.querySelectorAll(".collage-item");

            if (reduceMotion) {
              gsap.set(cards, { autoAlpha: 1, y: 0 });
              return;
            }

            if (isMobile) {
              cards.forEach((card) => {
                gsap.from(card, {
                  y: 42,
                  scale: 0.97,
                  autoAlpha: 0,
                  duration: 0.75,
                  ease: "power2.out",
                  clearProps: "transform,opacity",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                  },
                });
              });
            } else {
              const yOffset = isDesktop ? 40 : 28;
              const duration = isDesktop ? 0.9 : 0.8;
              const stagger = isDesktop ? 0.1 : 0.08;
              const startTrigger = isDesktop ? "top 76%" : "top 78%";

              gsap.from(cards, {
                y: yOffset,
                scale: 0.98,
                autoAlpha: 0,
                duration,
                stagger,
                ease: isDesktop ? "power3.out" : "power2.out",
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: root,
                  start: startTrigger,
                  toggleActions: "play none none reverse",
                },
              });
            }
          }
        );
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
  id="portfolio-staggered-collage"
  bind:this={collageSection}
  aria-label="Editorial Showcase Collage"
  class="relative w-full bg-brand-light py-20 lg:py-28 overflow-hidden"
>
  <div class="site-shell relative z-10">
    <!-- Asymmetric Collage Container -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
      <!-- Left Column Group -->
      <div class="md:col-span-6 flex flex-col gap-8">
        <!-- Top Left: Large Editorial Campaign Showcase -->
        <div
          class="collage-item group overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-sm"
        >
          <div class="aspect-[4/3] w-full overflow-hidden bg-brand-dark/5">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85"
              alt="Haute couture runway model editorial post-production"
              width="1600"
              height="900"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div class="p-5 border-t border-brand-dark/10 flex items-center justify-between">
            <span class="font-display text-base font-normal text-brand-dark">
              {$_('portfolio.collage.selectedCampaign') || 'Editorial Showcase'}
            </span>
            <span class="font-mono text-xs text-brand-dark/50">Paris & Milan Seasons</span>
          </div>
        </div>

        <!-- Middle-Left: Micro-row (Text block on left + Garment Swatch on right) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div class="collage-item flex flex-col justify-center">
            <h3 class="font-display text-2xl font-normal text-brand-dark mb-2">
              {$_('portfolio.collage.pantonePrecision') || 'Pantone Precision'}
            </h3>
            <p class="text-xs sm:text-sm text-brand-dark/75 leading-relaxed font-normal">
              {$_('portfolio.collage.pantoneDesc') || 'Flawless garment recoloring and skin tone harmony calibrated for high-end print lookbooks.'}
            </p>
          </div>

          <div
            class="collage-item group aspect-square overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=800&q=85"
              alt="Pleated silk garment colorway calibration detail"
              width="600"
              height="600"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <!-- Right Column Group -->
      <div class="md:col-span-6 flex flex-col gap-8">
        <!-- Top Right Story Header & Paragraph -->
        <div class="collage-item pt-2 pb-2">
          <span class="font-mono text-xs uppercase tracking-widest text-brand-green font-semibold block mb-2">
            {$_('portfolio.collage.selectedCampaign') || 'Selected Campaign'}
          </span>
          <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-dark leading-tight tracking-tight mb-3">
            {$_('portfolio.collage.hauteCouture') || 'Haute Couture Retouch'}
          </h2>
          <p class="text-sm sm:text-base text-brand-dark/80 font-normal leading-relaxed max-w-lg">
            {$_('portfolio.collage.hauteCoutureDesc') || 'High-fashion editorial finishing engineered to maintain the authentic tactile texture of silk, velvet, and fine jewelry while perfecting lighting contour lines.'}
          </p>
        </div>

        <!-- Middle-Right: Micro-row (Portrait Image on left + Description text on right) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div
            class="collage-item group aspect-[3/4] overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85"
              alt="High-end studio beauty editorial skin texture and micro-contouring"
              width="1600"
              height="900"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div class="collage-item flex flex-col justify-center">
            <h3 class="font-display text-2xl font-normal text-brand-dark mb-2">
              {$_('portfolio.collage.microContouring') || 'Micro Contouring'}
            </h3>
            <p class="text-xs sm:text-sm text-brand-dark/75 leading-relaxed font-normal">
              {$_('portfolio.collage.microContouringDesc') || 'Non-destructive frequency separation preserving pore fidelity and natural skin luminescence.'}
            </p>
          </div>
        </div>

        <!-- Bottom Right Feature Card (Footwear Vector Isolation) -->
        <div
          class="collage-item group overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-sm"
        >
          <div class="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-brand-dark/5">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85"
              alt="Athletic footwear vector pen clipping and studio contact shadow isolation"
              width="1600"
              height="900"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div class="flex items-center justify-between border-t border-brand-dark/10 p-4">
            <h4 class="font-display text-base font-normal text-brand-dark">
              {$_('portfolio.collage.footwearIsolation') || 'Footwear Vector Isolation'}
            </h4>
            <span class="font-mono text-xs text-brand-dark/50">
              {$_('portfolio.collage.archiveBadge') || '2026 Archive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
