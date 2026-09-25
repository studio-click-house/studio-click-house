<script lang="ts">
  import { onMount } from "svelte";
  import { Check, ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { VideoSocialCutdownsData } from "$lib/content/video-editing";

  let { data }: { data: VideoSocialCutdownsData } = $props();

  let sectionElement = $state<HTMLElement>();

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
          gsap.from(".social-reveal", {
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
      <!-- Left Column: Details & Deliverables -->
      <div class="social-reveal space-y-6 lg:col-span-5">
        <h2 class="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.15] tracking-[-0.03em] font-bold text-brand-dark pb-0.5">
          {data.heading}
        </h2>

        <p class="text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed">
          {data.description}
        </p>

        <!-- Principles List -->
        <div class="space-y-3 pt-2">
          {#each data.principles as item}
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
            <span>Request Social Cutdowns</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <!-- Right Column: Clean Borderless Comparison Stage -->
      <div class="social-reveal lg:col-span-7">
        <div class="grid grid-cols-1 sm:grid-cols-12 items-center gap-5 sm:gap-6">
          <!-- 16:9 Horizontal Master Video (Borderless rounded viewport) -->
          <div class="sm:col-span-7">
            <div class="group relative overflow-hidden rounded-[2rem] bg-black shadow-xl aspect-video w-full">
              <video
                src="/videos/stage-3-master-grade.mp4"
                playsinline
                autoplay
                loop
                muted
                preload="auto"
                class="size-full object-cover"
                onloadedmetadata={(e) => {
                  const v = e.currentTarget;
                  v.muted = true;
                  v.play().catch(() => {});
                }}
              ></video>
            </div>
          </div>

          <!-- 9:16 Vertical Mobile Video (Borderless rounded viewport, no phone frame) -->
          <div class="sm:col-span-5 flex justify-center">
            <div class="relative w-full max-w-[220px] overflow-hidden rounded-[2rem] bg-black shadow-xl aspect-[9/16]">
              <video
                src="/videos/stage-3-master-grade.mp4"
                playsinline
                autoplay
                loop
                muted
                preload="auto"
                class="size-full object-cover"
                onloadedmetadata={(e) => {
                  const v = e.currentTarget;
                  v.muted = true;
                  v.play().catch(() => {});
                }}
              ></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
