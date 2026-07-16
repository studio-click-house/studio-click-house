<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowDown, ArrowUpRight } from "lucide-svelte";
  import BrandMarquee from "$lib/components/sections/BrandMarquee.svelte";

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
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const startVideo = () => {
      if (prefersReducedMotion.matches || !heroVideo) return;
      heroVideo.preload = "metadata";
      heroVideo.load();
      void heroVideo.play().catch(() => {
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
            if (heroVideo.preload === "none") startVideo();
            else if (isVideoReady && !prefersReducedMotion.matches) {
              void heroVideo.play().catch(() => {});
            }
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

    import("gsap").then(({ gsap }) => {
      if (!active || !section) return;
      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".hero-media", { scale: 1.08, duration: 1.6 })
            .from(
              ".hero-line",
              { yPercent: 110, duration: 1.05, stagger: 0.11 },
              0.18,
            )
            .from(
              ".hero-detail",
              { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.08 },
              0.65,
            );
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
      <source src="/videos/hero%20section.webm" type="video/webm" />
    </video>
  </div>
  <div
    class="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,33,31,0.5)_0%,rgba(32,33,31,0.2)_50%,rgba(32,33,31,0)_100%)]"
  ></div>
  <div
    class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-dark/25 to-transparent"
  ></div>

  <div
    class="site-shell relative grid min-h-[100dvh] content-end pb-24 pt-32 sm:pb-28 lg:grid-cols-[1fr_19rem] lg:items-end lg:gap-10"
  >
    <div>
      <h1
        class="max-w-[12ch] font-display text-[clamp(2.75rem,6.8vw,6.25rem)] leading-[0.86] tracking-[-0.045em]"
      >
        <span class="block overflow-hidden pb-4 -mb-4"
          ><span class="hero-line block">Every image,</span></span
        >
        <span class="block overflow-hidden pb-4 -mb-4"
          ><span class="hero-line block italic text-brand-green">finished</span
          ></span
        >
        <span class="block overflow-hidden pb-4 -mb-4"
          ><span class="hero-line block">with intent.</span></span
        >
      </h1>
    </div>

    <div class="hero-detail mt-10 pt-6 lg:mt-0">
      <p class="text-sm leading-relaxed text-brand-light/75 sm:text-base">
        Studio Click House shapes still and moving images for brands, studios,
        and production teams that care about the final frame.
      </p>
      <div class="mt-7 flex flex-wrap items-center gap-5">
        <a
          href={resolve("/contact")}
          class="group inline-flex items-center gap-3 rounded-[0.2rem] bg-brand-green px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-brand-light hover:text-brand-dark active:scale-[0.98]"
          >Start a project
          <ArrowUpRight
            size={17}
            strokeWidth={1.7}
            class="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          /></a
        >
        <a
          href={resolve("/#selected-work")}
          class="text-link text-brand-light group"
          >See the work
          <ArrowDown
            size={15}
            strokeWidth={1.7}
            class="transition-transform duration-300 group-hover:translate-y-1"
          /></a
        >
      </div>
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

  @media (prefers-reduced-motion: reduce) {
    .hero-video {
      display: none;
    }
  }
</style>
