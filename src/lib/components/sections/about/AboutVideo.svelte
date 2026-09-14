<script lang="ts">
  import { onMount } from "svelte";
  import { Pause, Play, Volume2, VolumeX } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { loadYouTubeApi, type YouTubePlayer } from "$lib/utils/youtube";
  import { _ } from "svelte-i18n";

  const STUDIO_VIDEO_ID = "9_M5BgsK7MI";
  const YT_STATE_PLAYING = 1;

  let sectionRef: HTMLElement;
  let bannerRef: HTMLElement;
  let playerMount: HTMLElement;

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
            bannerRef
              ?.querySelector("iframe")
              ?.setAttribute("title", "Studio Click House Workspace Video");
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
          if (bannerRef) {
            media.add("(min-width: 1024px)", () => {
              gsap.fromTo(
                bannerRef,
                {
                  autoAlpha: 0.5,
                  scale: 0.96,
                  clipPath: "inset(4% 2% 4% 2% round 1.5rem)",
                },
                {
                  scrollTrigger: {
                    trigger: bannerRef,
                    start: "top 90%",
                    end: "top 35%",
                    scrub: 0.8,
                  },
                  autoAlpha: 1,
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
                  ease: "none",
                },
              );
            });

            media.add("(max-width: 1023px)", () => {
              gsap.fromTo(
                bannerRef,
                { autoAlpha: 0, y: 28 },
                {
                  scrollTrigger: {
                    trigger: bannerRef,
                    start: "top 88%",
                    once: true,
                  },
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power2.out",
                  clearProps: "all",
                },
              );
            });
          }
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
  id="about-studio-video"
  aria-label="Studio Click House Workspace Video"
  bind:this={sectionRef}
  class="section-space relative overflow-hidden py-12 md:py-20 bg-brand-light"
>
  <div class="site-shell">
    <div
      bind:this={bannerRef}
      class="relative aspect-[16/10] sm:aspect-[2.35/1] w-full overflow-hidden rounded-2xl bg-brand-dark shadow-2xl"
    >
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[118%] -translate-x-1/2 -translate-y-1/2 scale-[1.06]"
      >
        <div bind:this={playerMount} class="h-full w-full"></div>
      </div>

      <!-- Paused Cover -->
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
            <Play
              size={18}
              class="fill-current translate-x-[1px]"
              aria-hidden="true"
            />
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
            <Play
              size={13}
              class="fill-current translate-x-[1px]"
              aria-hidden="true"
            />
          {/if}
        </button>

        <span
          class="shrink-0 font-mono text-[0.62rem] tabular-nums text-white/85 sm:text-[0.68rem]"
        >
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

        <span
          class="shrink-0 font-mono text-[0.62rem] tabular-nums text-white/55 sm:text-[0.68rem]"
        >
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
