<script lang="ts">
  import { _ } from "svelte-i18n";
  import ServiceBookingLink from "$lib/components/common/ServiceBookingLink.svelte";
  import { onMount } from "svelte";
  import { Check } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import VideoControls from "$lib/components/common/VideoControls.svelte";
  import type { VideoCommercialData } from "$lib/content/video-editing";

  let { data }: { data: VideoCommercialData } = $props();

  let videoElement = $state<HTMLVideoElement>();
  let isPlaying = $state(false);
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
          gsap.from(".commercial-reveal", {
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
  class="relative isolate overflow-hidden bg-brand-light py-12 text-brand-dark sm:py-16"
>
  <div class="site-shell relative z-10">
    <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <!-- Left Column: Service Details & Deliverables -->
      <div class="commercial-reveal space-y-6 lg:col-span-5">
        <p class="font-sans text-sm font-medium text-brand-dark/50">
          {$_("sectionLabels.commercial")}
        </p>
        <h2 class="max-w-[20ch] font-sans font-semibold text-[length:var(--text-section)] leading-[1.05] tracking-[-0.04em] text-brand-dark">
          {data.heading}
        </h2>

        <p class="max-w-[38ch] text-sm sm:text-base leading-relaxed text-brand-dark/65">
          {data.leadParagraph}
        </p>

        <!-- What We Do / Deliverables -->
        <div class="space-y-3 pt-2">
          {#each data.capabilities as item (item.title)}
            <div class="flex items-start gap-3">
              <div class="flex size-5 items-center justify-center rounded-full bg-brand-green/20 text-brand-green shrink-0 mt-0.5">
                <Check size={12} strokeWidth={2.5} />
              </div>
              <div>
                <h3 class="font-sans text-sm font-semibold text-brand-dark">
                  {item.title}
                </h3>
                <p class="text-sm text-brand-dark/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          {/each}
        </div>

        <div class="pt-2">
          <ServiceBookingLink label="Book Commercial Editing" />
        </div>
      </div>

      <!-- Right Column: Controlled Work Sample Video Player -->
      <div class="commercial-reveal lg:col-span-7">
        <div class="group relative overflow-hidden rounded-[2rem] bg-brand-dark shadow-xl aspect-video max-h-[440px] w-full">
          <video
            bind:this={videoElement}
            poster={data.sampleVideo.poster}
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
            <source src={data.sampleVideo.src} type="video/mp4" />
          </video>

          <!-- Bottom Controls -->
          <div class="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <VideoControls {isPlaying} {isMuted} onTogglePlay={togglePlay} onToggleMute={toggleMute} playLabel="commercial sample" />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
