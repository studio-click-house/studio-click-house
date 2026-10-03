<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";
  import { ArrowDown } from "lucide-svelte";
  import { stripTitlePunctuation } from "$lib/utils";

  let heroSection = $state<HTMLElement | null>(null);
  let heroVideo = $state<HTMLVideoElement | null>(null);

  $effect(() => {
    if (heroVideo && heroSection) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      let isVisible = false;
      heroVideo.muted = true;
      heroVideo.defaultMuted = true;
      const syncPlayback = () => {
        if (reducedMotion.matches || document.hidden || !isVisible) {
          heroVideo?.pause();
        } else {
          void heroVideo?.play().catch(() => {});
        }
      };
      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        syncPlayback();
      });
      observer.observe(heroSection);
      reducedMotion.addEventListener("change", syncPlayback);
      document.addEventListener("visibilitychange", syncPlayback);
      return () => {
        observer.disconnect();
        reducedMotion.removeEventListener("change", syncPlayback);
        document.removeEventListener("visibilitychange", syncPlayback);
        heroVideo?.pause();
      };
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
            const { isDesktop, isTablet, reduceMotion } = context.conditions!;
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
          },
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
    autoplay
    loop
    muted
    playsinline
    preload="metadata"
    class="absolute inset-0 h-full w-full object-cover object-center scale-105 opacity-85 transition-opacity duration-700"
    aria-label="Studio Click House high-fashion post-production studio showcase"
  >
    <source src="/videos/portfolio-hero-production.mp4" type="video/mp4" />
    <track kind="captions" />
  </video>

  <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/45 via-brand-dark/30 to-brand-dark/55"></div>

  <div
    class="site-shell relative z-10 flex flex-col items-center text-center text-brand-light max-w-5xl mx-auto"
  >
    <!-- Studio Eyebrow (Clean Editorial Typography, No AI Pill) -->
    <span
      class="hero-anim-item mb-8 block font-sans text-sm text-brand-light/70 font-medium"
    >
      {$_("portfolio.hero.badge") || "Portfolio · Selected Work · 2015–2026"}
    </span>

    <!-- Editorial Display Headline -->
    <h1
      class="hero-anim-item font-sans uppercase mb-6 max-w-5xl text-[clamp(2.75rem,5.5vw,5.5rem)] leading-[1.02] tracking-[-0.045em] text-brand-light font-bold"
    >
      <span class="block"
        >{stripTitlePunctuation(
          $_("portfolio.hero.title") || "Visual Craft",
        )}</span
      >
      <span class="text-brand-green block">Made Tangible</span>
    </h1>

    <!-- Subtitle with Studio Positioning -->
    <p
      class="hero-anim-item max-w-2xl text-base sm:text-lg md:text-xl text-brand-light/80 font-normal leading-relaxed mb-10 px-2"
    >
      {$_("portfolio.hero.subtitle") ||
        "High-end post-production, editorial finishing & CGI archive for global fashion houses and commercial brands."}
    </p>

    <!-- Quick In-Page Exploration Links -->
    <div
      class="hero-anim-item flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-sans text-xs w-full sm:w-auto px-4"
    >
      <Button href="#portfolio-before-after" size="lg" class="w-full sm:w-auto">
        Inspect Raw vs Final
      </Button>
      <Button
        href="#portfolio-mosaic-gallery"
        variant="secondary"
        size="lg"
        class="w-full border-white/20 bg-white/5 text-brand-light hover:border-white/40 hover:bg-white/15 hover:text-brand-light sm:w-auto"
      >
        View Archive
      </Button>
    </div>

    <!-- Bottom Scroll Cue -->
    <div
      class="hero-anim-item mt-14 sm:mt-16 flex flex-col items-center gap-2 text-brand-light/50 font-sans text-xs"
    >
      <span>Scroll to Explore</span>
      <ArrowDown class="size-3.5 animate-bounce text-brand-green" />
    </div>
  </div>
</section>
