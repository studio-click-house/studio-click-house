<script lang="ts">
  import { onMount } from "svelte";
  import { Play, Pause, Volume2, VolumeX, Check, ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { VideoAiGenerationData } from "$lib/content/video-editing";

  let { data }: { data: VideoAiGenerationData } = $props();

  let videoElement = $state<HTMLVideoElement>();
  let isPlaying = $state(true);
  let isMuted = $state(true);
  let sectionElement = $state<HTMLElement>();

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
      const currentSection = sectionElement;
      if (!active || !runtime || !currentSection) return;
      const { gsap } = runtime;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".ai-video-reveal", {
            y: 28,
            autoAlpha: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: currentSection,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        });
      }, currentSection);
    });

    return () => {
      active = false;
      ctx?.revert();
    };
  });
</script>

<section
  bind:this={sectionElement}
  id={data.id}
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-28"
>
  <div class="site-shell relative z-10">
    <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <!-- Left Column: Controlled AI Motion Video Player -->
      <div class="ai-video-reveal lg:col-span-7">
        <div class="group relative overflow-hidden rounded-[2rem] bg-brand-dark shadow-xl aspect-video max-h-[440px] w-full">
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

          <!-- Bottom Controls -->
          <div class="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <div class="flex items-center gap-3">
              <button
                type="button"
                onclick={togglePlay}
                aria-label={isPlaying ? "Pause AI video sample" : "Play AI video sample"}
                class="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-all duration-200 hover:bg-brand-green hover:text-brand-dark cursor-pointer"
              >
                {#if isPlaying}
                  <Pause size={15} />
                {:else}
                  <Play size={15} class="translate-x-0.5" />
                {/if}
              </button>

              <button
                type="button"
                onclick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                class="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white transition-all duration-200 hover:bg-white/30 cursor-pointer"
              >
                {#if isMuted}
                  <VolumeX size={15} />
                {:else}
                  <Volume2 size={15} />
                {/if}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Details & Deliverables -->
      <div class="ai-video-reveal space-y-6 lg:col-span-5">
        <h2 class="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.15] tracking-[-0.03em] font-bold text-brand-dark pb-0.5">
          {data.heading}
        </h2>

        <p class="text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed">
          {data.leadParagraph}
        </p>

        <!-- Features List -->
        <div class="space-y-3 pt-2">
          {#each data.features as item}
            <div class="flex items-start gap-3">
              <div class="flex size-5 items-center justify-center rounded-full bg-brand-green/20 text-brand-green shrink-0 mt-0.5">
                <Check size={12} strokeWidth={2.5} />
              </div>
              <div>
                <h3 class="font-sans text-sm font-semibold text-brand-dark">
                  {item.title}
                </h3>
                <p class="text-xs sm:text-sm text-brand-dark/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          {/each}
        </div>

        <div class="pt-2">
          <a
            href="/contact"
            class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-green font-bold hover:text-brand-dark transition-colors"
          >
            <span>Commission AI Video</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
