<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";
  import { ArrowDown } from "lucide-svelte";

  let heroSection = $state<HTMLElement | null>(null);
  let heroVideo = $state<HTMLVideoElement | null>(null);

  $effect(() => {
    if (heroVideo) {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      heroVideo.muted = true;
      heroVideo.defaultMuted = true;
      const syncPlayback = () => {
        if (reducedMotion.matches) {
          heroVideo?.pause();
        } else {
          void heroVideo?.play().catch(() => {});
        }
      };
      syncPlayback();
      reducedMotion.addEventListener("change", syncPlayback);
      return () => reducedMotion.removeEventListener("change", syncPlayback);
    }
  });

  $effect(() => {
    if (!heroSection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !heroSection) return;
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
              gsap.set(".hero-anim-item", { autoAlpha: 1, y: 0 });
              return;
            }

            const yOffset = isDesktop ? 36 : isTablet ? 28 : 34;
            const duration = isDesktop ? 1.0 : isTablet ? 0.85 : 0.8;
            const stagger = isDesktop ? 0.12 : isTablet ? 0.08 : 0.08;

            gsap.from(".hero-anim-item", {
              y: yOffset,
              autoAlpha: 0,
              duration,
              stagger,
              ease: isDesktop ? "power3.out" : "power2.out",
              clearProps: "transform,opacity",
            });
          }
        );
        return () => media.revert();
      }, heroSection);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="portfolio-hero-banner"
  bind:this={heroSection}
  aria-label="Portfolio Hero"
  class="relative flex min-h-[100dvh] min-h-screen w-full items-center justify-center overflow-hidden bg-brand-dark pt-28 pb-16 md:pt-32 md:pb-24"
>
  <!-- Background Studio Video Atmosphere -->
  <video
    bind:this={heroVideo}
    poster="/images/portfolio/portfolio-fashion-studio-hero.jpg"
    loop
    muted
    playsinline
    preload="auto"
    class="absolute inset-0 h-full w-full object-cover object-center scale-105 opacity-60"
    aria-label="Studio Click House high-fashion post-production studio showcase"
  >
    <source
      src="/videos/work-fields-studio-production.mp4"
      type="video/mp4"
    />
  </video>

  <!-- Editorial Film Overlays (Pure Studio Tones, No Generic AI Glow) -->
  <div class="absolute inset-0 bg-brand-dark/65"></div>
  <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/40"></div>

  <div class="site-shell relative z-10 flex flex-col items-center text-center text-brand-light max-w-5xl mx-auto">
    <!-- Studio Eyebrow (Clean Editorial Typography, No AI Pill) -->
    <span class="hero-anim-item font-mono text-xs uppercase tracking-[0.25em] text-brand-light/70 mb-6 block font-medium">
      {$_('portfolio.hero.badge') || 'Portfolio · Selected Work · 2015–2026'}
    </span>

    <!-- Editorial Display Headline -->
    <h1 class="hero-anim-item font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal leading-[0.96] sm:leading-[0.92] tracking-tight text-brand-light mb-6">
      <span>{$_('portfolio.hero.title') || 'Visual Craft'}</span>,
      <span class="italic font-light text-brand-green">Made Tangible.</span>
    </h1>

    <!-- Subtitle with Studio Positioning -->
    <p class="hero-anim-item max-w-2xl text-base sm:text-lg md:text-xl text-brand-light/80 font-normal leading-relaxed mb-10 px-2">
      {$_('portfolio.hero.subtitle') || 'High-end post-production, editorial finishing & CGI archive for global fashion houses and commercial brands.'}
    </p>

    <!-- Quick In-Page Exploration Links -->
    <div class="hero-anim-item flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-mono text-xs uppercase tracking-wider w-full sm:w-auto px-4">
      <a
        href="#portfolio-before-after"
        class="w-full sm:w-auto text-center rounded-lg bg-brand-green px-6 py-3 text-white font-semibold transition-all hover:bg-brand-green/90 shadow-md hover:scale-105 active:scale-95"
      >
        Inspect Raw vs Final
      </a>
      <a
        href="#portfolio-mosaic-gallery"
        class="w-full sm:w-auto text-center rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-brand-light transition-all hover:bg-white/15 hover:border-white/40"
      >
        View Archive
      </a>
    </div>

    <!-- Bottom Scroll Cue -->
    <div class="hero-anim-item mt-14 sm:mt-16 flex flex-col items-center gap-2 text-brand-light/50 font-mono text-[10px] tracking-widest uppercase">
      <span>Scroll to Explore</span>
      <ArrowDown class="size-3.5 animate-bounce text-brand-green" />
    </div>
  </div>
</section>
