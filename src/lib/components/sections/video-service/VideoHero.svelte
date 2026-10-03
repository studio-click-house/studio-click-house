<script lang="ts">
  import { _ } from "svelte-i18n";
  import { Button } from "$lib/components/ui/button";
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowRight } from "lucide-svelte";
  import { stripTitlePunctuation } from "$lib/utils";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import VideoControls from "$lib/components/common/VideoControls.svelte";
  import type { VideoHeroData } from "$lib/content/video-editing";

  let { data }: { data: VideoHeroData } = $props();

  let videoElement = $state<HTMLVideoElement>();
  let isPlaying = $state(false);
  let isMuted = $state(true);
  let heroSection = $state<HTMLElement>();

  function togglePlay() {
    if (!videoElement) return;
    if (videoElement.paused) {
      videoElement.play().catch(() => {});
    } else {
      videoElement.pause();
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

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoElement?.play().catch(() => {});
    }

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
  class="relative isolate flex min-h-dvh overflow-hidden bg-brand-dark pt-20 text-brand-light sm:pt-24"
>
  <video
    bind:this={videoElement}
    poster={data.videoPoster}
    playsinline
    loop
    muted
    preload="metadata"
    aria-hidden="true"
    class="absolute inset-0 size-full object-cover"
    onplay={() => {
      isPlaying = true;
    }}
    onpause={() => {
      isPlaying = false;
    }}
  >
    <source src={data.videoSrc} type="video/mp4" />
  </video>

  <div
    class="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/55 to-brand-dark/10"
    aria-hidden="true"
  ></div>
  <div
    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-brand-dark/15"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10 flex items-center py-12 sm:py-16">
    <div class="w-full max-w-3xl space-y-7">
      <p class="font-sans text-sm font-medium mb-3 text-brand-light/60">
        {$_("sectionLabels.video")}
      </p>
      <h1
        id="video-hero-title"
        class="video-hero-title max-w-[12ch] font-sans font-bold uppercase text-[clamp(3rem,6.5vw,6.2rem)] leading-[1.02] tracking-[-0.045em] text-brand-light"
      >
        <span class="block">{stripTitlePunctuation(data.title)}</span>
        <span class="text-brand-green mt-2 block sm:mt-3">
          {stripTitlePunctuation(data.titleAccent)}
        </span>
      </h1>

      <p
        class="video-hero-lead max-w-[46ch] text-base leading-relaxed text-brand-light/85 sm:text-lg"
      >
        {data.description}
      </p>

      <div class="video-hero-actions flex flex-wrap items-center gap-3.5 pt-1">
        <Button
          href={resolve("/contact")}
          size="lg"
          class="group px-7 hover:bg-brand-light hover:text-brand-dark"
        >
          <span>Start a Video Project</span>
          <ArrowRight
            size={16}
            class="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Button>

        <Button
          href="#commercial-editing"
          variant="secondary"
          size="lg"
          class="border-brand-light/50 bg-brand-dark/20 text-brand-light hover:border-brand-light hover:bg-brand-light/10 hover:text-brand-light"
        >
          <span>View Services</span>
        </Button>
      </div>
    </div>
  </div>

  <div class="absolute bottom-5 right-5 z-20 sm:bottom-8 sm:right-8">
    <VideoControls
      {isPlaying}
      {isMuted}
      onTogglePlay={togglePlay}
      onToggleMute={toggleMute}
      tone="hero"
    />
  </div>
</section>
