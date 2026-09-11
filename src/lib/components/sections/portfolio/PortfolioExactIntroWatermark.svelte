<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";
  import { CheckCircle2, ShieldCheck, Layers } from "lucide-svelte";

  let section = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!section) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
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
            if (reduceMotion) {
              gsap.set(".intro-fade-item", { autoAlpha: 1, y: 0 });
              return;
            }

            const yOffset = isDesktop ? 34 : isTablet ? 28 : 38;
            const duration = isDesktop ? 0.9 : isTablet ? 0.8 : 0.75;
            const stagger = isDesktop ? 0.12 : isTablet ? 0.08 : 0.08;
            const startTrigger = isDesktop ? "top 78%" : isTablet ? "top 80%" : "top 78%";

            gsap.from(".intro-fade-item", {
              y: yOffset,
              autoAlpha: 0,
              duration,
              stagger,
              ease: isDesktop ? "power3.out" : "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: section,
                start: startTrigger,
                toggleActions: "play none none reverse",
              },
            });
          }
        );
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
  id="portfolio-studio-standard"
  bind:this={section}
  aria-label="Studio Introduction and Creative Standard"
  class="relative w-full bg-brand-light py-20 lg:py-28 overflow-hidden"
>
  <div class="site-shell relative z-10">
    <!-- Asymmetrical 2-Column Editorial Intro -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 lg:mb-20">
      <!-- Left Column: Bold Headline & Ethos -->
      <div class="lg:col-span-6 intro-fade-item">
        <span class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-green mb-3 block">
          Editorial Standard
        </span>
        <h2 class="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-dark leading-[1.08] tracking-tight">
          {$_('portfolio.intro.heading') || 'The High-End Post-Production Standard'}
        </h2>
      </div>

      <!-- Right Column: Dual Narrative Paragraphs & Quality Badges -->
      <div class="lg:col-span-6 space-y-6 text-sm sm:text-base text-brand-dark/80 font-normal leading-relaxed intro-fade-item">
        <p>
          {$_('portfolio.intro.p1') || 'Studio Click House represents over a decade of dedicated craftsmanship in luxury fashion retouching, intricate clipping paths, invisible ghost mannequin reconstruction, and high-fidelity color grading for world-renowned brands.'}
        </p>
        <p>
          {$_('portfolio.intro.p2') || 'Every image that passes through our workstations is handled by master digital artists adhering to lossless frequency separation, sub-pixel pen vector precision, and strict print-ready color standards.'}
        </p>
      </div>
    </div>

    <!-- Editorial Craftsmanship Proof Banner (Replaces tacky text-masked word with tactile craftsmanship showcase) -->
    <div class="intro-fade-item relative rounded-2xl md:rounded-3xl border border-brand-dark/10 bg-white p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-brand-dark/10">
        <!-- Quality Pillar 1 -->
        <div class="flex flex-col gap-3 pt-4 md:pt-0 md:pr-6">
          <div class="flex items-center gap-2.5 text-brand-green">
            <CheckCircle2 class="size-5 shrink-0" />
            <span class="font-mono text-xs font-bold uppercase tracking-wider text-brand-dark">16-Bit Precision</span>
          </div>
          <p class="text-xs sm:text-sm text-brand-dark/70 leading-relaxed font-normal">
            Lossless frequency separation preserving micro pore texture, fine hair flyaways, and fabric textile weave without plastic artificial smoothing.
          </p>
        </div>

        <!-- Quality Pillar 2 -->
        <div class="flex flex-col gap-3 pt-6 md:pt-0 md:px-6">
          <div class="flex items-center gap-2.5 text-brand-green">
            <Layers class="size-5 shrink-0" />
            <span class="font-mono text-xs font-bold uppercase tracking-wider text-brand-dark">Sub-Pixel Pen Paths</span>
          </div>
          <p class="text-xs sm:text-sm text-brand-dark/70 leading-relaxed font-normal">
            Hand-drawn Bézier curves with zero jagged anti-aliasing artifacts, embedded as persistent Photoshop paths for versatile client isolation.
          </p>
        </div>

        <!-- Quality Pillar 3 -->
        <div class="flex flex-col gap-3 pt-6 md:pt-0 md:pl-6">
          <div class="flex items-center gap-2.5 text-brand-green">
            <ShieldCheck class="size-5 shrink-0" />
            <span class="font-mono text-xs font-bold uppercase tracking-wider text-brand-dark">Delta-E Color Lock</span>
          </div>
          <p class="text-xs sm:text-sm text-brand-dark/70 leading-relaxed font-normal">
            Certified Pantone and digital swatch calibration ensuring 100% SKU color fidelity across lookbooks, e-commerce listings, and billboard prints.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
