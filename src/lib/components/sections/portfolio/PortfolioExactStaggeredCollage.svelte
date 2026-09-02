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
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const cards = root.querySelectorAll(".collage-item");
            gsap.from(cards, {
              y: 35,
              autoAlpha: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: root,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            });
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

<!-- Section 3: Staggered Asymmetrical Collage Grid (Exact Match to Reference Image) -->
<section
  id="portfolio-staggered-collage"
  bind:this={collageSection}
  aria-label="Editorial Showcase Collage"
  class="relative w-full bg-brand-light py-16 lg:py-24 overflow-hidden"
>
  <div class="site-shell relative z-10">
    <!-- Asymmetric Collage Container -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
      <!-- Left Column Grid Group -->
      <div class="md:col-span-6 flex flex-col gap-8">
        <!-- Top Left Large Image (Matches top-left image in reference) -->
        <div
          class="collage-item group overflow-hidden rounded-xl md:rounded-2xl border border-brand-dark/10 bg-brand-light"
        >
          <div class="aspect-[4/3] w-full overflow-hidden bg-brand-dark/5">
            <img
              src="/images/work-fields/gallery/fashion-color.jpg"
              alt="Fashion editorial runway post-production"
              width="1600"
              height="900"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        <!-- Middle-Left: 2-column micro row (Text block on left + Square Image on right) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div class="collage-item flex flex-col justify-center">
            <span
              class="font-mono text-xs uppercase tracking-widest text-brand-green font-semibold mb-1"
            >
              {$_('portfolio.collage.colorMastery') || 'Color Mastery'}
            </span>
            <h3 class="font-display text-xl font-normal text-brand-dark mb-2">
              {$_('portfolio.collage.pantonePrecision') || 'Pantone Precision'}
            </h3>
            <p
              class="text-xs sm:text-sm text-brand-dark/75 leading-relaxed font-normal"
            >
              {$_('portfolio.collage.pantoneDesc') || 'Flawless garment recoloring and skin tone harmony calibrated for high-end print lookbooks.'}
            </p>
          </div>

          <div
            class="collage-item group aspect-square overflow-hidden rounded-xl md:rounded-2xl border border-brand-dark/10 bg-brand-light"
          >
            <img
              src="/images/about/colorways/dress-color-emerald.webp"
              alt="Fabric color correction swatch detail"
              width="600"
              height="600"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <!-- Right Column Grid Group -->
      <div class="md:col-span-6 flex flex-col gap-8">
        <!-- Top Right Story Header & Paragraph (Matches "Opening ceremony" in reference) -->
        <div class="collage-item pt-2 pb-4">
          <span
            class="font-mono text-xs uppercase tracking-widest text-brand-green font-semibold block mb-2"
          >
            {$_('portfolio.collage.selectedCampaign') || 'Selected Campaign'}
          </span>
          <h2
            class="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-dark leading-tight tracking-tight mb-3"
          >
            {$_('portfolio.collage.hauteCouture') || 'Haute Couture Retouch'}
          </h2>
          <p
            class="text-sm sm:text-base text-brand-dark/80 font-normal leading-relaxed max-w-lg"
          >
            {$_('portfolio.collage.hauteCoutureDesc') || 'High-fashion editorial finishing engineered to maintain the authentic tactile texture of silk, velvet, and fine jewelry while perfecting lighting contour lines.'}
          </p>
        </div>

        <!-- Middle-Right: 2-column micro row (Portrait Image on left + Description text on right) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div
            class="collage-item group aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl border border-brand-dark/10 bg-brand-light"
          >
            <img
              src="/images/work-fields/gallery/beauty-retouching.jpg"
              alt="Editorial beauty portrait contouring"
              width="1600"
              height="900"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div class="collage-item flex flex-col justify-center">
            <span
              class="font-mono text-xs uppercase tracking-widest text-brand-green font-semibold mb-1"
            >
              {$_('portfolio.collage.macroDetail') || 'Macro Detail'}
            </span>
            <h3 class="font-display text-xl font-normal text-brand-dark mb-2">
              {$_('portfolio.collage.microContouring') || 'Micro Contouring'}
            </h3>
            <p
              class="text-xs sm:text-sm text-brand-dark/75 leading-relaxed font-normal"
            >
              {$_('portfolio.collage.microContouringDesc') || 'Non-destructive frequency separation preserving pore fidelity and natural skin luminescence.'}
            </p>
          </div>
        </div>

        <!-- Bottom Right Feature Card (Matches bottom right photo and card in reference) -->
        <div
          class="collage-item group overflow-hidden rounded-xl md:rounded-2xl border border-brand-dark/10 bg-brand-light"
        >
          <div class="aspect-[16/9] w-full overflow-hidden bg-brand-dark/5">
            <img
              src="/images/portfolio/photo-editing-showcase.png"
              alt="Ghost mannequin 3D neck composite"
              width="1024"
              height="1024"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div
            class="flex items-center justify-between border-t border-brand-dark/10 bg-brand-light p-4"
          >
            <div>
              <span
                class="font-mono text-[10px] uppercase tracking-wider text-brand-green font-semibold"
              >
                {$_('portfolio.collage.apparelVolume') || 'Apparel Volume'}
              </span>
              <h4 class="font-display text-base font-normal text-brand-dark">
                {$_('portfolio.collage.hollowJoint') || '3D Hollow Joint Tailoring'}
              </h4>
            </div>
            <span class="font-mono text-xs text-brand-dark/50"
              >{$_('portfolio.collage.archiveBadge') || '2026 Archive'}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Section 4 (Embedded Divider): Left label + Giant Right Watermark Word (Photo Masked Match) -->
    <div
      class="mt-20 pt-8 flex items-baseline justify-between overflow-hidden relative select-none"
    >
      <div
        class="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-brand-dark tracking-tight"
      >
        {$_('portfolio.collage.performingCraft') || 'Performing Craft'}
      </div>
      <div
        class="craft-image-mask font-display text-6xl sm:text-8xl lg:text-9xl font-black uppercase leading-none select-none tracking-tighter -mr-4 pointer-events-none"
        aria-hidden="true"
      >
        Craft
      </div>
    </div>
  </div>
</section>

<style>
  .craft-image-mask {
    background-image: url("/images/work-fields/gallery/product-retouching.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    filter: drop-shadow(0 8px 20px rgba(51, 46, 45, 0.08));
  }
</style>
