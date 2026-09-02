<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowDown, ArrowUpRight } from "lucide-svelte";
  import BrandMarquee from "$lib/components/sections/BrandMarquee.svelte";
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
    let isPreloaderComplete = !document.querySelector(".site-preloader");
    let startHeroMotion: (() => void) | undefined;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const startVideo = () => {
      if (!isPreloaderComplete || prefersReducedMotion.matches || !heroVideo)
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
      startHeroMotion?.();
      if (isHeroVisible) startVideo();
    };

    if (!isPreloaderComplete) {
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
            .from(".hero-media", { scale: 1.05, duration: 1.4, ease: "power2.out" });

          heroLines.forEach((line, i) => {
            const durations = [0.72, 0.95, 0.78];
            const eases = ["power3.out", "power4.out", "power3.out"];
            const offsets = [0.1, 0.18, 0.28];
            timeline.from(
              line,
              {
                yPercent: 110,
                duration: durations[i] ?? 0.78,
                ease: eases[i] ?? "power3.out",
              },
              offsets[i] ?? 0.1,
            );
          });

          timeline.from(
            ".hero-detail",
            { autoAlpha: 0, y: 24, duration: 0.7, ease: "power2.out" },
            0.55,
          );

          startHeroMotion = () => timeline.play();
          if (isPreloaderComplete) startHeroMotion();
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
      preload="metadata"
      aria-hidden="true"
      tabindex="-1"
      oncanplay={handleVideoCanPlay}
      class:video-ready={isVideoReady}
      class="hero-video absolute inset-0 size-full object-cover object-[58%_center]"
    >
      <source src="/videos/hero%20section.webm" type="video/webm" />
    </video>
  </div>
  <div
    class="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,33,31,0.58)_0%,rgba(32,33,31,0.25)_50%,rgba(32,33,31,0)_100%)]"
  ></div>
  <div
    class="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-brand-dark/55 to-transparent"
  ></div>

  <div
    class="site-shell relative grid min-h-[100dvh] content-end pb-24 pt-32 sm:pb-28 lg:grid-cols-[1fr_19rem] lg:items-end lg:gap-10"
  >
    <div>
      <h1
        class="max-w-[12ch] font-display text-[clamp(2.75rem,6.8vw,6.25rem)] leading-[0.86] tracking-[-0.045em]"
      >
        <span class="block overflow-hidden pb-4 -mb-4"
          ><span class="hero-line block">{$_('home.hero.title1') || 'Every image,'}</span></span
        >
        <span class="block overflow-hidden pb-4 -mb-4"
          ><span class="hero-line block italic text-brand-green">{$_('home.hero.title2') || 'finished'}</span
          ></span
        >
        <span class="block overflow-hidden pb-4 -mb-4"
          ><span class="hero-line block">{$_('home.hero.title3') || 'with intent.'}</span></span
        >
      </h1>
    </div>

    <div class="hero-detail mt-10 pt-6 lg:mt-0 lg:border-l lg:border-brand-light/15 lg:pl-8">
      <p class="text-sm leading-relaxed text-brand-light/70 sm:text-base">
        {$_('home.hero.subtitle') || 'Studio Click House shapes still and moving images for brands, studios, and production teams that care about the final frame.'}
      </p>
      <div class="mt-7 flex flex-wrap items-center gap-5">
        <a
          href={resolve("/contact")}
          class="group inline-flex items-center gap-3 rounded-sm bg-brand-green px-5 py-3.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-brand-light hover:text-brand-dark active:scale-[0.98]"
          >{$_('home.hero.cta') || 'Start a project'}
          <ArrowUpRight
            size={15}
            strokeWidth={1.8}
            class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          /></a
        >
        <a
          href={resolve("/#horizontal-projects-showcase")}
          class="hero-explore-link inline-flex items-center gap-2 text-sm font-semibold text-brand-light group"
        >
          <span class="hero-explore-label">{$_('home.hero.explore') || 'Explore services'}</span>
          <span
            class="flex transition-transform duration-300 group-hover:translate-y-0.5"
          >
            <ArrowDown size={14} strokeWidth={1.8} />
          </span>
        </a>
      </div>
    </div>
  </div>

  <div
    class="scroll-indicator absolute bottom-[5.5rem] left-1/2 -translate-x-1/2 z-25 flex flex-col items-center gap-2 pointer-events-none"
  >
    <span
      class="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.25em] text-brand-light/45"
    >
      {$_('home.hero.scroll')}
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

  .hero-explore-label {
    position: relative;
    padding-bottom: 2px;
  }

  .hero-explore-label::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hero-explore-link:hover .hero-explore-label::after {
    transform: scaleX(1);
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
