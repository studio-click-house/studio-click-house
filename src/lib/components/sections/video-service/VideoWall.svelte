<script lang="ts">
  import { onMount } from "svelte";
  import { Volume2, VolumeX, ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { VideoWallData, VideoWallItem } from "$lib/content/video-editing";

  let { data }: { data: VideoWallData } = $props();

  let sectionElement = $state<HTMLElement>();
  let activeAudioId = $state<string | null>(null);

  // References to video elements
  let videoElements = new Map<string, HTMLVideoElement>();

  function unmuteBigVideo() {
    const bigVideo = videoElements.get(data.featured.id);
    if (!bigVideo) return;
    bigVideo.muted = false;
    activeAudioId = data.featured.id;
    bigVideo.play().catch(() => {
      // Browser blocked unmuted autoplay prior to user interaction
      bigVideo.muted = true;
      activeAudioId = null;
      bigVideo.play().catch(() => {});
    });
  }

  function registerVideo(node: HTMLVideoElement, id: string) {
    videoElements.set(id, node);
    if (id === data.featured.id) {
      // Big video attempts auto-audio
      unmuteBigVideo();
    }
    return {
      destroy() {
        videoElements.delete(id);
      },
    };
  }

  function toggleAudio(id: string, e?: MouseEvent) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (activeAudioId === id) {
      // Mute active video
      const current = videoElements.get(id);
      if (current) current.muted = true;
      activeAudioId = null;
    } else {
      // Mute previous video if any
      if (activeAudioId) {
        const prev = videoElements.get(activeAudioId);
        if (prev) prev.muted = true;
      }
      // Unmute new video
      const current = videoElements.get(id);
      if (current) {
        current.muted = false;
        activeAudioId = id;
        current.play().catch(() => {});
      }
    }
  }

  onMount(() => {
    let ctx: { revert: () => void } | undefined;
    let observer: IntersectionObserver | undefined;
    let active = true;

    // Auto-unmute big video on initial run
    unmuteBigVideo();

    // Browser audio unlock on first user gesture anywhere
    const handleFirstGesture = () => {
      if (!active) return;
      const bigVideo = videoElements.get(data.featured.id);
      if (bigVideo) {
        bigVideo.muted = false;
        activeAudioId = data.featured.id;
        bigVideo.play().catch(() => {});
      }
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("click", handleFirstGesture, { passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    // IntersectionObserver to only run videos when in view, saving GPU/CPU
    if ("IntersectionObserver" in window && sectionElement) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const shouldPlay = entry.isIntersecting;
            videoElements.forEach((video, id) => {
              if (shouldPlay) {
                if (id === data.featured.id) {
                  // When big video runs in view, auto turn audio on
                  video.muted = false;
                  activeAudioId = data.featured.id;
                  video.play().catch(() => {
                    video.muted = true;
                    activeAudioId = null;
                    video.play().catch(() => {});
                  });
                } else {
                  video.muted = true;
                  video.play().catch(() => {});
                }
              } else {
                video.pause();
                // If section leaves view, ensure audio is muted
                if (!video.muted) {
                  video.muted = true;
                  activeAudioId = null;
                }
              }
            });
          });
        },
        { threshold: 0.15 }
      );

      observer.observe(sectionElement);
    }

    // Editorial entrance animation via GSAP
    registerScrollTrigger().then((runtime) => {
      const currentSection = sectionElement;
      if (!active || !runtime || !currentSection) return;
      const { gsap } = runtime;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".wall-card", {
            y: 32,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: currentSection,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        });
      }, currentSection);
    });

    return () => {
      active = false;
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      observer?.disconnect();
      ctx?.revert();
      videoElements.forEach((video) => {
        video.pause();
        video.src = "";
      });
      videoElements.clear();
    };
  });
</script>

<section
  bind:this={sectionElement}
  id={data.id}
  class="relative isolate overflow-hidden bg-brand-light py-12 text-brand-dark sm:py-16"
>
  <div class="site-shell relative z-10">
    <!-- Header: Editorial Title + View All Link -->
    <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <p class="font-sans text-sm font-medium text-brand-dark/50 mb-2">
          AI Motion Gallery
        </p>
        <h2
          class="font-sans font-semibold text-[length:var(--text-section)] leading-[1.05] tracking-[-0.04em] text-brand-dark"
        >
          {data.heading}
        </h2>
      </div>

      <a
        href={data.viewAllHref}
        class="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-dark/80 hover:text-brand-dark transition-colors tracking-tight whitespace-nowrap pb-1"
      >
        <span>{data.viewAllLabel}</span>
        <span
          class="inline-block transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        >
          &rarr;
        </span>
      </a>
    </div>

    <!-- Unified 5-Column Editorial Wall Grid: Equal 1fr rows, zero gaps, perfect bottom alignment -->
    <div
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:grid-rows-2 gap-3.5 sm:gap-4 items-stretch"
    >
      <!-- Left Column: Featured Video (Spans 2 columns & 2 rows, locks total grid height) -->
      <div
        class="wall-card col-span-2 sm:col-span-3 lg:col-span-2 lg:row-span-2 relative w-full aspect-[3/4.2] sm:aspect-[3/4.2] lg:aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl bg-brand-dark/5 shadow-sm"
      >
        <video
          use:registerVideo={data.featured.id}
          src={data.featured.videoSrc}
          playsinline
          loop
          muted
          autoplay
          preload="metadata"
          class="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
          aria-label={data.featured.title}
        ></video>

        <!-- Top Action / Audio Indicator -->
        <div class="absolute top-3 right-3 z-20">
          <button
            type="button"
            onclick={(e) => toggleAudio(data.featured.id, e)}
            class="flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/60 hover:scale-105 active:scale-95"
            aria-label={activeAudioId === data.featured.id ? "Mute audio" : "Unmute audio"}
          >
            {#if activeAudioId === data.featured.id}
              <Volume2 size={15} />
            {:else}
              <VolumeX size={15} />
            {/if}
          </button>
        </div>

        <!-- Editorial Tag matching reference screenshot -->
        <div class="absolute bottom-4 left-4 z-20">
          <span
            class="inline-block bg-white px-2.5 py-1 text-[11px] font-bold tracking-wider text-black uppercase shadow-xs rounded-[2px]"
          >
            AI GENERATED
          </span>
        </div>
      </div>

      <!-- Right 6 Cards: Fill full 1fr height of Row 1 & Row 2 with zero extra gap -->
      {#each data.items as item (item.id)}
        <div
          class="wall-card group relative aspect-[3/4.4] lg:aspect-auto h-full w-full min-h-0 overflow-hidden rounded-xl sm:rounded-2xl bg-brand-dark/5 shadow-sm"
        >
          <video
            use:registerVideo={item.id}
            src={item.videoSrc}
            playsinline
            loop
            muted
            autoplay
            preload="metadata"
            class="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            aria-label={item.title}
          ></video>

          <!-- Audio Toggle Button on Hover -->
          <div
            class="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <button
              type="button"
              onclick={(e) => toggleAudio(item.id, e)}
              class="flex size-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/60 hover:scale-105 active:scale-95"
              aria-label={activeAudioId === item.id ? "Mute audio" : "Unmute audio"}
            >
              {#if activeAudioId === item.id}
                <Volume2 size={13} />
              {:else}
                <VolumeX size={13} />
              {/if}
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
