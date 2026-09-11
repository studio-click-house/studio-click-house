<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { Play, Pause } from "lucide-svelte";
  import { _ } from "svelte-i18n";

  let showreelSection = $state<HTMLElement | null>(null);
  let showreelVideo = $state<HTMLVideoElement | null>(null);
  let isPlaying = $state(true);

  function togglePlay() {
    if (!showreelVideo) return;
    if (showreelVideo.paused) {
      void showreelVideo.play();
      isPlaying = true;
    } else {
      showreelVideo.pause();
      isPlaying = false;
    }
  }

  $effect(() => {
    if (showreelVideo) {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      showreelVideo.muted = true;
      showreelVideo.defaultMuted = true;
      const syncPlayback = () => {
        if (reducedMotion.matches) {
          showreelVideo?.pause();
          isPlaying = false;
        } else {
          void showreelVideo?.play().then(() => { isPlaying = true; }).catch(() => {});
        }
      };
      syncPlayback();
      reducedMotion.addEventListener("change", syncPlayback);
      return () => reducedMotion.removeEventListener("change", syncPlayback);
    }
  });

  $effect(() => {
    if (!showreelSection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !showreelSection) return;
      const { gsap } = runtime;
      const root = showreelSection;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add(
          {
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          (ctx) => {
            const { isDesktop, isTablet, isMobile, reduceMotion } = ctx.conditions!;
            const elements = root.querySelectorAll(".showreel-anim-target");

            if (reduceMotion) {
              gsap.set(elements, { autoAlpha: 1, y: 0 });
              return;
            }

            const yOffset = isDesktop ? 34 : isTablet ? 26 : 38;
            const duration = isDesktop ? 0.85 : isTablet ? 0.75 : 0.75;
            const stagger = isDesktop ? 0.1 : isTablet ? 0.08 : 0.08;
            const startTrigger = isDesktop ? "top 78%" : isTablet ? "top 80%" : "top 78%";

            gsap.from(elements, {
              y: yOffset,
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
  id="portfolio-showreel-video"
  bind:this={showreelSection}
  aria-label="Studio Video Showreel"
  class="relative w-full overflow-hidden bg-brand-light pt-8 pb-20 lg:pt-12 lg:pb-28"
>
  <div class="site-shell max-w-6xl mx-auto">
    <!-- Header -->
    <div class="showreel-anim-target max-w-2xl mb-8 sm:mb-12">
      <span class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-green mb-3 block">
        Process Spotlight
      </span>
      <h2 class="font-display text-3xl sm:text-5xl font-normal tracking-tight text-brand-dark mb-3">
        {$_('portfolio.showreel.title') || 'Process & Craft Showreel'}
      </h2>
      <p class="text-sm sm:text-base text-brand-dark/70 font-normal">
        {$_('portfolio.showreel.subtitle') || 'Behind the layers · From raw capture to finished campaign.'}
      </p>
    </div>

    <!-- Video Showcase Container -->
    <div class="showreel-anim-target relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden border border-brand-dark/10 bg-brand-dark shadow-2xl group">
      <video
        bind:this={showreelVideo}
        poster="/images/portfolio/portfolio-fashion-studio-hero.jpg"
        loop
        muted
        playsinline
        preload="auto"
        class="h-full w-full object-cover object-center"
        aria-label="Studio Click House commercial and editorial video showcase"
      >
        <source
          src="/videos/work-fields-studio-production.mp4"
          type="video/mp4"
        />
        <source
          src="https://videos.pexels.com/video-files/29539460/12715672_1920_1080_30fps.mp4"
          type="video/mp4"
        />
      </video>

      <!-- Overlay Play/Pause Action -->
      <div class="absolute inset-0 bg-brand-dark/20 flex items-center justify-center pointer-events-none">
        <button
          type="button"
          onclick={togglePlay}
          class="pointer-events-auto size-14 sm:size-16 rounded-full bg-brand-dark/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 hover:bg-brand-green hover:text-brand-dark transition-all duration-300 shadow-xl cursor-pointer"
          aria-label={isPlaying ? "Pause showreel video" : "Play showreel video"}
        >
          {#if isPlaying}
            <Pause class="size-6" />
          {:else}
            <Play class="size-6 translate-x-0.5" />
          {/if}
        </button>
      </div>
    </div>
  </div>
</section>
