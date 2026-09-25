<script lang="ts">
  import { onMount } from "svelte";
  import { Check, ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { VideoColorGradingData } from "$lib/content/video-editing";

  let { data }: { data: VideoColorGradingData } = $props();

  let sliderPosition = $state(50);
  let isDragging = $state(false);
  let containerRef = $state<HTMLDivElement>();
  let sectionElement = $state<HTMLElement>();

  function updateSlider(clientX: number) {
    if (!containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    sliderPosition = percentage;
  }

  function handlePointerDown(e: PointerEvent) {
    isDragging = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    updateSlider(e.clientX);
  }

  function handlePointerUp(e: PointerEvent) {
    if (isDragging) {
      isDragging = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      sliderPosition = Math.max(0, sliderPosition - 5);
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      sliderPosition = Math.min(100, sliderPosition + 5);
      e.preventDefault();
    }
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
          gsap.from(".grading-reveal", {
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
      <!-- Left Column: Controlled Before / After Slider (Capped Height) -->
      <div class="grading-reveal lg:col-span-7">
        <div class="space-y-2.5">
          <div
            bind:this={containerRef}
            role="slider"
            aria-label="Color grade comparison slider"
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabindex="0"
            onkeydown={handleKeyDown}
            onpointerdown={handlePointerDown}
            onpointermove={handlePointerMove}
            onpointerup={handlePointerUp}
            onpointercancel={handlePointerUp}
            class="group relative aspect-video max-h-[440px] w-full cursor-ew-resize select-none overflow-hidden rounded-[2rem] bg-black shadow-xl touch-none focus-visible:outline-2 focus-visible:outline-brand-green"
          >
            <!-- Background: Camera Log -->
            <img
              src={data.rawImage.src}
              alt={data.rawImage.alt}
              class="pointer-events-none absolute inset-0 size-full object-cover"
              loading="lazy"
            />

            <!-- Foreground: Finished Color Grade (Clipped) -->
            <div
              class="pointer-events-none absolute inset-0 overflow-hidden"
              style="clip-path: polygon(0 0, {sliderPosition}% 0, {sliderPosition}% 100%, 0 100%);"
            >
              <img
                src={data.gradedImage.src}
                alt={data.gradedImage.alt}
                class="size-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- Divider Line & Handle -->
            <div
              class="pointer-events-none absolute bottom-0 top-0 z-20 w-0.5 bg-brand-green shadow-[0_0_12px_rgba(126,166,65,0.8)]"
              style="left: {sliderPosition}%;"
            >
              <div
                class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-brand-dark text-brand-green shadow-xl"
              >
                <span class="font-sans text-[0.6rem] font-bold">VS</span>
              </div>
            </div>

            <!-- Clear Corner Labels -->
            <div class="pointer-events-none absolute left-5 top-5 z-10 rounded-lg bg-black/70 px-3.5 py-1.5 backdrop-blur-md text-xs font-semibold text-brand-green">
              {data.gradedImage.label}
            </div>

            <div class="pointer-events-none absolute right-5 top-5 z-10 rounded-lg bg-black/70 px-3.5 py-1.5 backdrop-blur-md text-xs font-medium text-white/80">
              {data.rawImage.label}
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Service Description & Standards -->
      <div class="grading-reveal space-y-6 lg:col-span-5">
        <h2 class="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.15] tracking-[-0.03em] font-bold text-brand-dark pb-0.5">
          {data.heading}
        </h2>

        <p class="text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed">
          {data.description}
        </p>

        <!-- Highlights List -->
        <div class="space-y-3 pt-2">
          {#each data.highlights as item}
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
            <span>Book Color Grading</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
