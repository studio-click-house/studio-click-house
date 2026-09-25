<script lang="ts">
  import { onMount } from "svelte";
  import { Play, Pause, Volume2, VolumeX, ArrowRight, ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { VideoHeroData, VideoServiceOverviewItem } from "$lib/content/video-editing";

  let { 
    data, 
    services 
  }: { 
    data: VideoHeroData; 
    services: VideoServiceOverviewItem[];
  } = $props();

  let videoElement = $state<HTMLVideoElement>();
  let isPlaying = $state(true);
  let isMuted = $state(true);
  let heroSection = $state<HTMLElement>();

  function togglePlay() {
    if (!videoElement) return;
    if (videoElement.paused) {
      videoElement.play();
      isPlaying = true;
    } else {
      videoElement.pause();
      isPlaying = false;
    }
  }

  function toggleMute() {
    if (!videoElement) return;
    videoElement.muted = !videoElement.muted;
    isMuted = videoElement.muted;
  }

  onMount(() => {
    let ctx: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      const currentHero = heroSection;
      if (!active || !runtime || !currentHero) return;
      const { gsap } = runtime;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(
            ".video-hero-title",
            {
              autoAlpha: 0,
              y: 18,
              duration: 0.85,
            },
            0.1,
          )
            .from(
              ".video-hero-lead",
              {
                autoAlpha: 0,
                y: 18,
                duration: 0.75,
              },
              "-=0.55",
            )
            .from(
              ".video-hero-actions",
              {
                autoAlpha: 0,
                y: 18,
                duration: 0.65,
              },
              "-=0.5",
            )
            .from(
              ".video-hero-media-stage",
              {
                autoAlpha: 0,
                y: 28,
                duration: 0.85,
              },
              "-=0.5",
            );
        });
      }, currentHero);
    });

    return () => {
      active = false;
      ctx?.revert();
    };
  });
</script>

<section
  bind:this={heroSection}
  id="video-hero"
  aria-labelledby="video-hero-title"
  class="relative isolate min-h-dvh overflow-hidden bg-brand-light text-brand-dark transition-colors duration-300 pt-20 sm:pt-24"
>
  <!-- Ambient Backdrop Glow (Matching ServiceDetailHero) -->
  <div
    class="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(ellipse_62%_56%_at_24%_42%,rgba(126,166,65,0.08),transparent_58%)]"
    aria-hidden="true"
  ></div>
  <div
    class="pointer-events-none absolute -right-[10rem] top-[8%] size-[38rem] rounded-full bg-brand-green/10 opacity-70 blur-[120px]"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10 flex min-h-[calc(100dvh-6rem)] items-center py-10 sm:py-12">
    <div class="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-12">
      <!-- Left Column: Copy & Actions (lg:col-span-5) -->
      <div class="space-y-6 lg:col-span-5">
        <h1
          id="video-hero-title"
          class="video-hero-title font-display text-[clamp(2.5rem,4.4vw,4.6rem)] leading-[0.96] tracking-[-0.038em] font-bold text-brand-dark pb-1"
        >
          <span class="block">{data.title}</span>
          <span class="block text-brand-green font-light italic mt-1.5 sm:mt-2">
            {data.titleAccent}
          </span>
        </h1>

        <p class="video-hero-lead max-w-[46ch] text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed">
          {data.description}
        </p>

        <div class="video-hero-actions flex flex-wrap items-center gap-3.5 pt-1">
          <a
            href="/contact"
            class="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-brand-dark px-7 text-sm font-semibold text-brand-light transition-all duration-300 hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-brand-green"
          >
            <span>Start a Video Project</span>
            <ArrowRight size={16} class="transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <a
            href="#commercial-editing"
            class="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-brand-dark/20 bg-white/70 px-6 text-sm font-semibold text-brand-dark transition-all duration-300 hover:border-brand-dark hover:bg-white focus-visible:outline-2 focus-visible:outline-brand-green"
          >
            <span>View Services</span>
          </a>
        </div>
      </div>

      <!-- Right Column: Media Stage - Video Showreel + 4 Services (lg:col-span-7) -->
      <div class="video-hero-media-stage space-y-3 sm:space-y-3.5 lg:col-span-7">
        <!-- Main Showreel Video (16:9, Borderless, Controls) -->
        <div class="group relative overflow-hidden rounded-[2rem] bg-black shadow-2xl aspect-video w-full">
          <video
            bind:this={videoElement}
            poster={data.videoPoster}
            playsinline
            loop
            muted
            autoplay
            preload="auto"
            class="size-full object-cover"
            onloadedmetadata={(e) => {
              const v = e.currentTarget;
              v.muted = true;
              v.play().then(() => { isPlaying = true; }).catch(() => {});
            }}
            onplay={() => { isPlaying = true; }}
            onpause={() => { isPlaying = false; }}
          >
            <source src="/videos/ai%20section%20video.mp4" type="video/mp4" />
            <source src={data.videoSrc} type="video/mp4" />
          </video>

          <!-- Bottom Controls (Clean, Borderless) -->
          <div
            class="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 sm:p-5 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
          >
            <div class="flex items-center gap-3">
              <button
                type="button"
                onclick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                class="flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-all duration-200 hover:bg-brand-green hover:text-brand-dark cursor-pointer"
              >
                {#if isPlaying}
                  <Pause size={14} />
                {:else}
                  <Play size={14} class="translate-x-0.5" />
                {/if}
              </button>

              <button
                type="button"
                onclick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                class="flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-all duration-200 hover:bg-white/30 cursor-pointer"
              >
                {#if isMuted}
                  <VolumeX size={14} />
                {:else}
                  <Volume2 size={14} />
                {/if}
              </button>
            </div>
          </div>
        </div>

        <!-- 4 Fast Service Anchor Cards in a Clean 4-Column Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {#each services as item}
            <a
              href={`#${item.id}`}
              class="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-brand-dark p-3 shadow-md transition-all duration-300 hover:shadow-xl aspect-[16/10]"
            >
              <!-- Background Thumbnail with Overlay -->
              <img
                src={item.image}
                alt={item.title}
                class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/50 to-transparent"></div>

              <div class="relative z-10 flex items-center justify-between">
                <span class="text-[0.68rem] font-mono font-bold text-brand-green">
                  {item.number}
                </span>
                <ArrowUpRight size={13} class="text-brand-light/70 group-hover:text-brand-green transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div class="relative z-10">
                <h2 class="font-display text-[0.72rem] sm:text-xs font-bold text-brand-light group-hover:text-brand-green transition-colors leading-tight line-clamp-2">
                  {item.title}
                </h2>
              </div>
            </a>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
