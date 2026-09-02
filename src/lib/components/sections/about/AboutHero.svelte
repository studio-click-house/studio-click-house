<script lang="ts">
  import { onMount } from "svelte";
  import { Pause, Play, Volume2, VolumeX } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { loadYouTubeApi, type YouTubePlayer } from "$lib/utils/youtube";
  import type { AboutPageData, AboutStat } from "$lib/types/about";
  import { _ } from "svelte-i18n";

  let { hero } = $props<{ hero: AboutPageData["hero"] }>();

  const STUDIO_VIDEO_ID = "9_M5BgsK7MI";
  const YT_STATE_PLAYING = 1;

  let sectionRef: HTMLElement;
  let bannerRef: HTMLElement;
  let playerMount: HTMLElement;
  let statsRef: HTMLElement;

  // Track stat values for display
  let displayedStats = $state<{ value: number; suffix: string }[]>([]);

  // Video player state
  let player: YouTubePlayer | null = null;
  let videoPlaying = $state(false);
  let videoMuted = $state(true);
  let currentTime = $state(0);
  let videoDuration = $state(0);
  let isSeeking = false;

  const seekPercent = $derived(
    videoDuration > 0 ? Math.min(100, (currentTime / videoDuration) * 100) : 0,
  );

  function formatTime(totalSeconds: number): string {
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function togglePlay() {
    if (!player) return;
    if (videoPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  function toggleMute() {
    if (!player) return;
    if (videoMuted) {
      player.unMute();
    } else {
      player.mute();
    }
    videoMuted = !videoMuted;
  }

  onMount(() => {
    displayedStats = hero.stats.map((s: AboutStat) => ({
      value: 0,
      suffix: s.suffix,
    }));
    let active = true;
    let context: { revert: () => void } | undefined;
    let timePoll: ReturnType<typeof setInterval> | undefined;

    loadYouTubeApi().then((YT) => {
      if (!active || !playerMount) return;

      player = new YT.Player(playerMount, {
        videoId: STUDIO_VIDEO_ID,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: STUDIO_VIDEO_ID,
          controls: 0,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            bannerRef?.querySelector("iframe")?.setAttribute("title", "Studio Click House Workspace Video");
          },
          onStateChange: (event) => {
            videoPlaying = event.data === YT_STATE_PLAYING;
          },
        },
      });

      timePoll = setInterval(() => {
        if (!player || isSeeking) return;
        currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration > 0) {
          videoDuration = duration;
        }
      }, 250);
    });

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionRef) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          // Editorial typography split line mask reveal
          gsap.from(".hero-line-inner", {
            yPercent: 115,
            rotation: 2.2,
            duration: 1.15,
            stagger: 0.12,
            ease: "power4.out",
            delay: 0.1,
          });

          // Positioning description text
          gsap.fromTo(
            ".hero-description-reveal",
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              delay: 0.45,
            },
          );

          // Counter animation on viewport scroll trigger
          if (statsRef) {
            gsap.to(
              {},
              {
                scrollTrigger: {
                  trigger: statsRef,
                  start: "top 88%",
                  once: true,
                },
                duration: 1.8,
                ease: "power2.out",
                onUpdate: function () {
                  const progress = this.progress();
                  displayedStats = hero.stats.map((s: AboutStat) => ({
                    value: Math.floor(s.value * progress),
                    suffix: s.suffix,
                  }));
                },
                onComplete: () => {
                  displayedStats = hero.stats.map((s: AboutStat) => ({
                    value: s.value,
                    suffix: s.suffix,
                  }));
                },
              },
            );
          }

          // Banner reveal animation with scrub
          if (bannerRef) {
            gsap.fromTo(
              bannerRef,
              {
                autoAlpha: 0.4,
                scale: 0.96,
                clipPath: "inset(5% 3% 5% 3% round 1.5rem)",
              },
              {
                scrollTrigger: {
                  trigger: bannerRef,
                  start: "top 85%",
                  end: "top 25%",
                  scrub: 0.8,
                },
                autoAlpha: 1,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0% round 1rem)",
                ease: "none",
              },
            );
          }
        });

        media.add("(prefers-reduced-motion: reduce)", () => {
          displayedStats = hero.stats.map((s: AboutStat) => ({
            value: s.value,
            suffix: s.suffix,
          }));
        });
      }, sectionRef);
    });

    return () => {
      active = false;
      context?.revert();
      if (timePoll) clearInterval(timePoll);
      player?.destroy();
      player = null;
    };
  });
</script>

<section
  id="about-hero"
  aria-label="About Studio Click House Hero"
  bind:this={sectionRef}
  class="section-space relative overflow-hidden pt-28 md:pt-36"
>
  <!-- Hero Background Image & Gradient Mesh Layer -->
  <div class="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
    <img
      src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=2200"
      alt=""
      class="h-full w-full object-cover opacity-35 md:opacity-45"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-brand-light via-brand-light/70 to-brand-light/35"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-brand-light via-brand-light/60 to-transparent"></div>
  </div>

  <div class="site-shell relative z-10">
    <div class="pt-5">
      <div>
        <h1
          class="mb-8 font-display text-[clamp(4.25rem,9.2vw,10.5rem)] leading-[0.78] tracking-[-0.06em]"
        >
          <span class="block overflow-hidden pb-2">
            <span
              class="hero-line-inner block text-[0.42em] font-normal italic leading-none text-brand-dark/48"
            >
              {$_('about.hero.headingLine1') || hero.headingLine1}
            </span>
          </span>
          <span class="block overflow-hidden">
            <span class="hero-line-inner block max-w-[9ch] text-brand-dark"
              >{$_('about.hero.headingLine2') || hero.headingLine2}</span
            >
          </span>
        </h1>

        <p
          class="hero-description-reveal ml-auto max-w-3xl text-lg leading-relaxed text-brand-dark/75 md:text-2xl"
        >
          {$_('about.hero.positioning') || hero.positioning}
        </p>
      </div>
    </div>

    <!-- Stat Counter Grid -->
    <div
      bind:this={statsRef}
      class="hero-stats-bar mt-14 grid gap-0 border-y border-brand-dark/20 sm:grid-cols-3 md:mt-20"
    >
      {#each hero.stats as stat, i (stat.label)}
        <div
          class="group relative flex flex-col border-b border-brand-dark/20 py-5 transition-colors duration-300 hover:bg-brand-dark/[0.02] last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0 md:py-7"
        >
          <div
            class="mb-2 font-display text-4xl tracking-[-0.04em] text-brand-dark transition-colors duration-300 group-hover:text-brand-green md:text-6xl"
          >
            <span>{displayedStats[i]?.value ?? stat.value}</span><span
              class="text-brand-green">{stat.suffix}</span
            >
          </div>
          <div class="text-sm font-semibold text-brand-dark/90">
            {$_(`about.hero.stats.${i}.label`) || stat.label}
          </div>
          <div
            class="mt-1 max-w-[15rem] text-xs leading-relaxed text-brand-dark/58"
          >
            {$_(`about.hero.stats.${i}.sublabel`) || stat.sublabel}
          </div>
        </div>
      {/each}
    </div>

    <!-- Widescreen Video Banner Frame -->
    <div
      bind:this={bannerRef}
      class="relative mt-8 aspect-[2.35/1] w-full overflow-hidden rounded-2xl bg-brand-dark shadow-2xl md:mt-12"
    >
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[118%] -translate-x-1/2 -translate-y-1/2 scale-[1.06]"
      >
        <div bind:this={playerMount} class="h-full w-full"></div>
      </div>

      <!-- Paused Cover: hides YouTube's own paused overlay and offers a clean play affordance -->
      {#if !videoPlaying}
        <button
          type="button"
          onclick={togglePlay}
          aria-label="Play studio video"
          class="absolute inset-0 z-[5] flex items-center justify-center bg-brand-dark/60 backdrop-blur-[3px]"
        >
          <span
            class="flex size-12 items-center justify-center rounded-full bg-brand-green text-brand-dark shadow-[0_0_28px_rgba(126,166,65,0.5)] transition-transform duration-200 hover:scale-110 sm:size-14"
          >
            <Play size={18} class="fill-current translate-x-[1px]" aria-hidden="true" />
          </span>
        </button>
      {/if}

      <!-- Custom Video Controls -->
      <div
        id="about-video-controls"
        class="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-2.5 pt-8 sm:gap-3 sm:px-5 sm:pb-3"
      >
        <button
          type="button"
          onclick={togglePlay}
          aria-label={videoPlaying ? "Pause studio video" : "Play studio video"}
          class="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-brand-green hover:text-brand-dark active:scale-95 sm:size-8"
        >
          {#if videoPlaying}
            <Pause size={13} class="fill-current" aria-hidden="true" />
          {:else}
            <Play size={13} class="fill-current translate-x-[1px]" aria-hidden="true" />
          {/if}
        </button>

        <span class="shrink-0 font-mono text-[0.62rem] tabular-nums text-white/85 sm:text-[0.68rem]">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min="0"
          max={videoDuration}
          value={currentTime}
          aria-label="Seek studio video"
          class="video-seek h-1 flex-1 cursor-pointer"
          style={`--seek-fill: ${seekPercent}%`}
          onpointerdown={(e) => {
            isSeeking = true;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onpointerup={() => (isSeeking = false)}
          oninput={(e) => (currentTime = Number(e.currentTarget.value))}
          onchange={(e) => {
            player?.seekTo(Number(e.currentTarget.value), true);
            isSeeking = false;
          }}
        />

        <span class="shrink-0 font-mono text-[0.62rem] tabular-nums text-white/55 sm:text-[0.68rem]">
          {formatTime(videoDuration)}
        </span>

        <button
          type="button"
          onclick={toggleMute}
          aria-label={videoMuted ? "Unmute studio video" : "Mute studio video"}
          class="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-brand-green hover:text-brand-dark active:scale-95 sm:size-8"
        >
          {#if videoMuted}
            <VolumeX size={13} aria-hidden="true" />
          {:else}
            <Volume2 size={13} aria-hidden="true" />
          {/if}
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  .video-seek {
    -webkit-appearance: none;
    appearance: none;
    border-radius: 9999px;
    background: linear-gradient(
      to right,
      var(--color-brand-green) var(--seek-fill, 0%),
      rgb(255 255 255 / 0.25) var(--seek-fill, 0%)
    );
    outline: none;
  }

  .video-seek::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 0.75rem;
    width: 0.75rem;
    border: none;
    border-radius: 9999px;
    background: white;
    box-shadow: 0 1px 4px rgb(0 0 0 / 0.4);
    transition: transform 0.15s ease;
  }

  .video-seek:hover::-webkit-slider-thumb,
  .video-seek:focus-visible::-webkit-slider-thumb {
    transform: scale(1.25);
  }

  .video-seek::-moz-range-thumb {
    height: 0.75rem;
    width: 0.75rem;
    border: none;
    border-radius: 9999px;
    background: white;
    box-shadow: 0 1px 4px rgb(0 0 0 / 0.4);
  }

  .video-seek:focus-visible {
    box-shadow: 0 0 0 2px rgb(255 255 255 / 0.6);
  }
</style>
