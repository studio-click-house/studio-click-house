<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight, ArrowRight } from "lucide-svelte";
  import BrandMarquee from "$lib/components/sections/BrandMarquee.svelte";
  import { stripTitlePunctuation } from "$lib/utils";
  import { _ } from "svelte-i18n";

  let section: HTMLElement;
  let heroVideo: HTMLVideoElement;
  let isVideoReady = $state(false);

  function handleVideoCanPlay() {
    isVideoReady = true;
  }

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;
    let isHeroVisible = true;
    let hasVideoIntent = false;
    let isPreloaderComplete = !document.querySelector(".site-preloader");
    let isPreloaderExiting = isPreloaderComplete;
    let startHeroMotion: (() => void) | undefined;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const startVideo = () => {
      if (
        !hasVideoIntent ||
        !isPreloaderComplete ||
        prefersReducedMotion.matches ||
        !heroVideo
      )
        return;
      heroVideo.preload = "auto";
      if (heroVideo.readyState === HTMLMediaElement.HAVE_NOTHING) {
        heroVideo.load();
      }
      void heroVideo
        .play()
        .then(() => {
          if (active) isVideoReady = true;
        })
        .catch(() => {
          // The poster remains visible if browser autoplay policy blocks playback.
        });
    };

    const videoIntentEvents = [
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart",
    ] as const;
    const handleFirstVideoIntent = () => {
      hasVideoIntent = true;
      videoIntentEvents.forEach((eventName) =>
        window.removeEventListener(eventName, handleFirstVideoIntent),
      );
      if (isHeroVisible) startVideo();
    };

    videoIntentEvents.forEach((eventName) =>
      window.addEventListener(eventName, handleFirstVideoIntent, {
        once: true,
        passive: true,
      }),
    );

    let videoObserver: IntersectionObserver | undefined;

    if (prefersReducedMotion.matches) {
      heroVideo.pause();
    } else if ("IntersectionObserver" in window) {
      videoObserver = new IntersectionObserver(
        ([entry]) => {
          isHeroVisible = entry.isIntersecting;

          if (isHeroVisible) {
            if (!isPreloaderComplete) return;
            startVideo();
          } else {
            heroVideo.pause();
          }
        },
        { rootMargin: "160px 0px", threshold: 0.05 },
      );
      videoObserver.observe(section);
    } else {
      startVideo();
    }

    const handleMotionPreferenceChange = () => {
      if (prefersReducedMotion.matches) {
        heroVideo.pause();
        isVideoReady = false;
      } else if (isHeroVisible) {
        startVideo();
      }
    };

    prefersReducedMotion.addEventListener(
      "change",
      handleMotionPreferenceChange,
    );

    const handlePreloaderComplete = () => {
      isPreloaderComplete = true;
      isPreloaderExiting = true;
      startHeroMotion?.();
      if (isHeroVisible) startVideo();
    };

    const handlePreloaderHeaderReveal = () => {
      isPreloaderExiting = true;
      startHeroMotion?.();
    };

    if (!isPreloaderComplete) {
      window.addEventListener(
        "site-preloader-header-reveal",
        handlePreloaderHeaderReveal,
        { once: true },
      );
      window.addEventListener(
        "site-preloader-complete",
        handlePreloaderComplete,
        { once: true },
      );
    }

    import("gsap").then(({ gsap }) => {
      if (!active || !section) return;
      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const heroLines = gsap.utils.toArray<HTMLElement>(".hero-line");
          const timeline = gsap
            .timeline({
              paused: true,
            })
            .from(".hero-media", {
              scale: 1.05,
              duration: 1.4,
              ease: "power2.out",
            });

          heroLines.forEach((line, i) => {
            timeline.from(
              line,
              {
                yPercent: 100,
                opacity: 0,
                duration: 0.75,
                ease: "power3.out",
              },
              0.15 + i * 0.1,
            );
          });

          timeline.from(
            ".hero-subtitle",
            {
              y: 12,
              opacity: 0,
              duration: 0.55,
              ease: "power2.out",
            },
            0.32,
          );

          timeline.from(
            ".hero-meta",
            {
              y: 12,
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
            },
            0.4,
          );

          timeline.from(
            ".hero-actions",
            {
              y: 14,
              opacity: 0,
              duration: 0.55,
              ease: "power2.out",
            },
            0.46,
          );

          timeline.from(
            ".hero-sidebar",
            {
              y: 18,
              opacity: 0,
              duration: 0.7,
              ease: "power2.out",
            },
            0.35,
          );

          startHeroMotion = () => timeline.play();
          if (isPreloaderExiting) startHeroMotion();
        });
        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      videoObserver?.disconnect();
      prefersReducedMotion.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );
      videoIntentEvents.forEach((eventName) =>
        window.removeEventListener(eventName, handleFirstVideoIntent),
      );
      window.removeEventListener(
        "site-preloader-header-reveal",
        handlePreloaderHeaderReveal,
      );
      window.removeEventListener(
        "site-preloader-complete",
        handlePreloaderComplete,
      );
      context?.revert();
    };
  });
</script>

<section
  id="home-hero"
  bind:this={section}
  class="relative min-h-[100dvh] overflow-hidden bg-brand-dark text-brand-light"
>
  <div class="hero-media absolute inset-0 size-full will-change-transform">
    <img
      src="/images/hero/hero-poster.jpg"
      alt=""
      width="1440"
      height="900"
      fetchpriority="high"
      decoding="async"
      aria-hidden="true"
      class="hero-poster absolute inset-0 size-full object-cover object-[58%_center]"
    />
    <video
      bind:this={heroVideo}
      muted
      loop
      playsinline
      preload="none"
      aria-hidden="true"
      tabindex="-1"
      oncanplay={handleVideoCanPlay}
      class:video-ready={isVideoReady}
      class="hero-video absolute inset-0 size-full object-cover object-[58%_center]"
    >
      <source src="/videos/hero%20section.mp4" type="video/mp4" />
    </video>
  </div>
  <!-- Directional gradients for high legibility over background media -->
  <div
    class="absolute inset-0 bg-gradient-to-r from-brand-dark/85 via-brand-dark/40 to-brand-dark/80 pointer-events-none"
  ></div>
  <div
    class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-dark/95 via-brand-dark/45 to-transparent pointer-events-none"
  ></div>
  <div
    class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-dark/60 to-transparent pointer-events-none"
  ></div>

  <div
    class="site-shell relative z-20 grid min-h-[100dvh] content-end pb-24 pt-32 sm:pb-28 lg:grid-cols-12 lg:items-end lg:gap-10"
  >
    <!-- Left Column: Refined Title, Subtitle, Chips & CTAs -->
    <div class="lg:col-span-7 xl:col-span-7 flex flex-col justify-end">

      <!-- Refined Editorial Title -->
      <p class="eyebrow mb-3 text-brand-light/60">
        {$_("sectionLabels.studio")}
      </p>
      <h1
        class="max-w-2xl font-sans font-bold tracking-tight text-white text-[clamp(1.85rem,3.4vw,3.25rem)] leading-[1.12] select-none"
      >
        <span class="block overflow-hidden pb-0.5">
          <span class="hero-line block">
            {stripTitlePunctuation($_("home.hero.title1") || "Visual Post-Production")}
          </span>
        </span>
        <span class="block overflow-hidden pb-1">
          <span class="hero-line block text-white/95">
            {stripTitlePunctuation($_("home.hero.title2") || "Built to Scale")}
          </span>
        </span>
      </h1>

      <!-- Editorial Subtitle -->
      <p
        class="hero-subtitle mt-3.5 sm:mt-4 max-w-lg text-sm sm:text-[0.9375rem] font-normal leading-relaxed text-white/70"
      >
        {$_("home.hero.subtitle") ||
          "High-volume retouching, CGI modeling, and video post-production for brands and creative teams worldwide."}
      </p>

      <!-- Target Audience Chips -->
      <div class="hero-meta mt-4 flex flex-wrap items-center gap-2">
        <span
          class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-wider text-white/60"
        >
          E-Commerce
        </span>
        <span
          class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-wider text-white/60"
        >
          Fashion Brands
        </span>
        <span
          class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-wider text-white/60"
        >
          Creative Teams
        </span>
      </div>

      <!-- Refined Action CTAs -->
      <div class="hero-actions mt-6 flex flex-wrap items-center gap-3 sm:gap-3.5">
        <a
          href={resolve("/contact")}
          class="hero-btn-primary group inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-5 sm:px-6 py-2.5 sm:py-3 font-mono text-[0.6875rem] sm:text-xs font-bold uppercase tracking-[0.12em] text-brand-dark transition-all duration-300 hover:bg-brand-light hover:text-brand-dark hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-brand-green/20"
        >
          <span>{$_("home.hero.bookMeeting") || "Book a meeting"}</span>
          <ArrowUpRight
            size={14}
            strokeWidth={2.4}
            class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>

        <a
          href={resolve("/contact")}
          class="hero-btn-secondary group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-brand-dark/50 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 font-mono text-[0.6875rem] sm:text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-dark hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{$_("home.hero.startTrial") || "Start free trial"}</span>
          <ArrowRight
            size={14}
            strokeWidth={2.2}
            class="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </div>
    </div>

    <!-- Right Column: Pure Editorial Typography (No card style) -->
    <div
      class="hero-sidebar mt-10 lg:mt-0 lg:col-span-5 flex flex-col justify-end lg:items-end text-left lg:text-right"
    >
      <div class="space-y-6 max-w-xs sm:max-w-sm">
        <!-- Capacity Stat Block -->
        <div>
          <span
            class="block font-mono text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-brand-light/60"
          >
            {$_("home.hero.capacityLabel") || "CAPACITY"}
          </span>
          <div class="mt-1 flex items-baseline gap-2.5 lg:justify-end">
            <span
              class="font-sans text-4xl sm:text-5xl font-black tracking-tight text-white"
            >
              {$_("home.hero.capacityNumber") || "150+"}
            </span>
            <span
              class="font-mono text-xs uppercase tracking-wider text-white/70"
            >
              {$_("home.hero.capacityRole") || "In-House Specialists"}
            </span>
          </div>
          <p class="mt-1 font-mono text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-wider text-white/50">
            {$_("home.hero.capacitySub") || "24/7 Production · 2,000+ Daily Output"}
          </p>
        </div>

        <!-- Identity / Heritage Statement -->
        <div class="border-t border-white/10 pt-5">
          <span
            class="block font-mono text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-brand-light/60"
          >
            {$_("home.hero.identityLabel") || "OUR IDENTITY"}
          </span>
          <p
            class="mt-2 text-xs sm:text-[0.8125rem] font-medium uppercase leading-relaxed tracking-[0.05em] text-white/75"
          >
            {$_("home.hero.identityDesc") ||
              "Since 2015 supporting creative teams behind the scenes with dedicated post-production capacity."}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div
    class="scroll-indicator absolute bottom-[5.5rem] left-1/2 -translate-x-1/2 z-25 flex flex-col items-center gap-2 pointer-events-none"
  >
    <span
      class="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.25em] text-brand-light/45"
    >
      {$_("home.hero.scroll")}
    </span>
    <div
      class="scroll-mouse flex justify-center items-start w-[20px] h-[34px] border border-brand-light/35 rounded-full"
    >
      <div
        class="scroll-wheel w-[3px] h-[8px] mt-1.5 bg-brand-light/55 rounded-full"
      ></div>
    </div>
  </div>

  <BrandMarquee />
</section>

<style>
  .hero-poster {
    background: var(--color-brand-dark);
  }

  .hero-video {
    opacity: 0;
    transition: opacity 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hero-video.video-ready {
    opacity: 1;
  }


  .scroll-indicator {
    animation: scroll-fade-in 1s ease 1.2s both;
  }

  .scroll-wheel {
    animation: scroll-wheel-dot 2.6s cubic-bezier(0.76, 0, 0.24, 1) infinite;
  }

  @keyframes scroll-wheel-dot {
    0% {
      transform: translateY(0);
      opacity: 0;
    }
    15% {
      opacity: 1;
    }
    50% {
      transform: translateY(12px);
      opacity: 1;
    }
    65%,
    100% {
      transform: translateY(12px);
      opacity: 0;
    }
  }

  @keyframes scroll-fade-in {
    from {
      opacity: 0;
      transform: translate(-50%, 0.5rem);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  @media (max-width: 39.999rem) {
    .scroll-indicator {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-video {
      display: none;
    }
    .scroll-indicator,
    .scroll-wheel {
      animation: none;
    }
    .scroll-indicator {
      opacity: 0.6;
    }
  }
</style>
