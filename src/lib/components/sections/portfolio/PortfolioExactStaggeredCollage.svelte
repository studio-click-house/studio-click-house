<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";
  import PortfolioVideoAudio from "$lib/components/common/PortfolioVideoAudio.svelte";
  let editorialVideo = $state<HTMLVideoElement>();

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
            const { isDesktop, isMobile, reduceMotion } =
              context.conditions!;
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
          },
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
  class="relative w-full bg-brand-light py-12 sm:py-14 lg:py-16 overflow-hidden"
>
  <div class="site-shell relative z-10">
    <!-- Asymmetric Collage Container -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
      <!-- Left Column Group -->
      <div class="md:col-span-6 flex flex-col gap-10 lg:gap-12">
        <!-- Top Left: Large Editorial Campaign Showcase -->
        <figure
          class="collage-item group m-0 w-full max-w-[32rem] md:ml-auto"
        >
          <div class="aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)] bg-brand-dark/5 relative">
            <video
              bind:this={editorialVideo}
              src="/images/video-editing/Fashion_editorial_montage_creation_1080p_20261001180512.mp4"
              poster="/images/services/model-beauty/beauty-fashion-editorial-night-glam-057-after.webp"
              muted
              loop
              playsinline
              preload="metadata"
              aria-label="Fashion editorial post-production film"
              class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            >
              <track kind="captions" />
            </video>
            <PortfolioVideoAudio video={editorialVideo} />
          </div>
          <figcaption
            class="pt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
          >
            <span class="font-sans text-sm font-medium text-brand-dark">
              {$_("portfolio.collage.selectedCampaign") || "Editorial Showcase"}
            </span>
            <span class="font-sans text-xs text-brand-dark/50"
              >Paris & Milan Seasons</span
            >
          </figcaption>
        </figure>

        <!-- Middle-Left: Micro-row (Text block on left + Garment Swatch on right) -->
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center"
        >
          <div class="collage-item flex flex-col justify-center">
            <h3 class="font-sans text-2xl text-brand-dark mb-2 font-semibold">
              {$_("portfolio.collage.pantonePrecision") || "Pantone Precision"}
            </h3>
            <p
              class="text-sm text-brand-dark/75 leading-relaxed font-normal"
            >
              {$_("portfolio.collage.pantoneDesc") ||
                "Flawless garment recoloring and skin tone harmony calibrated for high-end print lookbooks."}
            </p>
          </div>

          <div
            class="collage-item group aspect-square overflow-hidden rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)] bg-white flex items-center justify-center p-3 sm:p-4"
          >
            <img
              src="/images/services/ghost-mannequin-apparel/ghost-mannequin-antony-morato-winter-parka-brown-front-after.webp"
              alt="Antony Morato winter parka garment colorway calibration and tone fidelity"
              width="2000"
              height="2000"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <!-- Right Column Group -->
      <div class="md:col-span-6 flex flex-col gap-8 lg:gap-10 md:pt-8 lg:pt-12">
        <!-- Top Right Story Header & Paragraph -->
        <div class="collage-item max-w-lg">
          <span
            class="font-sans text-sm text-brand-dark/50 font-medium block mb-3"
          >
            {$_("portfolio.collage.selectedCampaign") || "Selected Campaign"}
          </span>
          <h2
            class="font-sans text-[length:var(--text-section)] text-brand-dark leading-[1.05] tracking-[-0.035em] mb-5 font-semibold text-balance"
          >
            {$_("portfolio.collage.hauteCouture") || "Haute Couture Retouch"}
          </h2>
          <p
            class="text-base text-brand-dark/70 font-normal leading-relaxed max-w-lg"
          >
            {$_("portfolio.collage.hauteCoutureDesc") ||
              "High-fashion editorial finishing engineered to maintain the authentic tactile texture of silk, velvet, and fine jewelry while perfecting lighting contour lines."}
          </p>
        </div>

        <!-- Middle-Right: Micro-row (Portrait Image on left + Description text on right) -->
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center"
        >
          <div
            class="collage-item group aspect-[4/5] overflow-hidden rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)] bg-white"
          >
            <img
              src="/images/services/model-beauty/model-female-headshot-white-blouse-0997-after.webp"
              alt="High-end studio beauty editorial skin texture and micro-contouring retouch"
              width="1333"
              height="2000"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div class="collage-item flex flex-col justify-center">
            <h3 class="font-sans text-2xl text-brand-dark mb-2 font-semibold">
              {$_("portfolio.collage.microContouring") || "Micro Contouring"}
            </h3>
            <p
              class="text-sm text-brand-dark/75 leading-relaxed font-normal"
            >
              {$_("portfolio.collage.microContouringDesc") ||
                "Non-destructive frequency separation preserving pore fidelity and natural skin luminescence."}
            </p>
          </div>
        </div>

        <!-- Bottom Right Feature Card (Footwear Vector Isolation) -->
        <div
          class="collage-item group"
        >
          <div
            class="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)] bg-white flex items-center justify-center p-4 sm:p-8"
          >
            <img
              src="/images/services/bags-accessories/accessories-antony-morato-white-leather-sneakers-3285.webp"
              alt="Antony Morato designer white leather sneakers vector pen clipping and contact shadow isolation"
              width="1400"
              height="2000"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div
            class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-3"
          >
            <h4 class="font-sans text-base text-brand-dark font-semibold">
              {$_("portfolio.collage.footwearIsolation") ||
                "Footwear Vector Isolation"}
            </h4>
            <span class="font-sans text-xs text-brand-dark/50">
              {$_("portfolio.collage.archiveBadge") || "2026 Archive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
