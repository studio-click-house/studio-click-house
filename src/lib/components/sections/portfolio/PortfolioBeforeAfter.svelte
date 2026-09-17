<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";

  let section = $state<HTMLElement | null>(null);
  let activeStageIndex = $state(0);

  const stages = [
    {
      step: "01",
      title: "Raw Camera Capture",
      desc: "Untouched 16-bit sensor data with original studio lighting, neutral exposure, and capture backdrop.",
      image: "/images/portfolio/model-raw.png",
      badge: "16-Bit Studio RAW",
    },
    {
      step: "02",
      title: "Pen Vector Path",
      desc: "Hand-drawn Bézier anchor paths mapping garment contours, silhouette edges, and fabric folds.",
      image: "/images/portfolio/model-clipping.png",
      badge: "Vector Clipping",
    },
    {
      step: "03",
      title: "Subject Isolation",
      desc: "Clean background extraction with sub-pixel edge transitions, hair flyaway control, and alpha channel.",
      image: "/images/portfolio/model-isolated.png",
      badge: "Edge Isolation",
    },
    {
      step: "04",
      title: "Contact Shadow",
      desc: "Natural diffused ground shadow engineered for authentic perspective depth on campaign backdrops.",
      image: "/images/portfolio/model-shadowed.png",
      badge: "Ground Shadow",
    },
    {
      step: "05",
      title: "Campaign Color Master",
      desc: "Selective emerald garment color grading, skin frequency separation, and print-calibrated delivery.",
      image: "/images/portfolio/model-color-corrected.png",
      badge: "Color Master",
    },
  ];

  function nextStage() {
    activeStageIndex = (activeStageIndex + 1) % stages.length;
  }

  function prevStage() {
    activeStageIndex = (activeStageIndex - 1 + stages.length) % stages.length;
  }

  function onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activeStageIndex = index;
    } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      activeStageIndex = (index + 1) % stages.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      activeStageIndex = (index - 1 + stages.length) % stages.length;
    }
  }

  $effect(() => {
    if (!section) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add(
          {
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          (context) => {
            const { isDesktop, isTablet, isMobile, reduceMotion } = context.conditions!;
            if (reduceMotion) {
              gsap.set(".process-fade-item", { autoAlpha: 1, y: 0 });
              return;
            }

            const yOffset = isDesktop ? 32 : isTablet ? 26 : 38;
            const duration = isDesktop ? 0.85 : isTablet ? 0.75 : 0.75;
            const stagger = isDesktop ? 0.1 : isTablet ? 0.08 : 0.08;
            const startTrigger = isDesktop ? "top 78%" : isTablet ? "top 80%" : "top 78%";

            gsap.from(".process-fade-item", {
              y: yOffset,
              scale: 0.97,
              autoAlpha: 0,
              duration,
              stagger,
              ease: isDesktop ? "power3.out" : "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: section,
                start: startTrigger,
                toggleActions: "play none none reverse",
              },
            });
          }
        );
        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="portfolio-before-after"
  bind:this={section}
  aria-label="Studio post-production process breakdown"
  class="relative w-full bg-brand-light py-16 sm:py-20 lg:py-32 overflow-hidden scroll-mt-20 sm:scroll-mt-28"
>

  <div class="site-shell relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Mobile Editorial Header (Shown only on mobile/tablet screens < lg so user reads headline first) -->
    <div class="lg:hidden w-full max-w-md mx-auto mb-8 text-center process-fade-item">
      <span class="font-mono text-xs uppercase tracking-[0.2em] text-brand-green font-semibold block mb-2">
        Inspection Craft
      </span>
      <h2 class="font-display text-2xl sm:text-3xl font-normal text-brand-dark leading-tight tracking-tight mb-2">
        From Studio RAW to <em class="font-display italic font-normal text-brand-green">Campaign Master.</em>
      </h2>
      <p class="text-xs sm:text-sm text-brand-dark/75 leading-relaxed font-normal">
        Tap the controls below to inspect each stage of post-production craft.
      </p>
    </div>

    <!-- Centered 2-Column Composition matching Orbit Gallery: Left Stacked Visuals, Right Interactive Steps -->
    <div class="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-20">
      <!-- Left Column: Rich Portrait Visual with Visible Stacked Card Depth -->
      <div class="w-full lg:w-auto shrink-0 flex flex-col items-center justify-center process-fade-item">
        <div class="relative w-[270px] sm:w-[360px] lg:w-[410px] max-w-[calc(100vw-3rem)] aspect-[3/4] flex items-center justify-center">
          <!-- Stack Card Layer 2 (Backmost with photo glimpse & rotation) -->
          <div
            class="absolute inset-0 rounded-3xl overflow-hidden shadow-lg transform translate-x-3 translate-y-2 rotate-3 sm:translate-x-5 sm:translate-y-3.5 sm:rotate-4 pointer-events-none transition-transform duration-500 border border-brand-dark/10 bg-brand-dark/15"
          >
            <img
              src="/images/portfolio/model-raw.png"
              alt=""
              class="w-full h-full object-cover object-center opacity-40 blur-[0.5px]"
              loading="lazy"
              decoding="async"
            />
            <div class="absolute inset-0 bg-brand-dark/25"></div>
          </div>

          <!-- Stack Card Layer 1 (Middle with photo glimpse & counter-rotation) -->
          <div
            class="absolute inset-0 rounded-3xl overflow-hidden shadow-xl transform translate-x-1.5 translate-y-1 -rotate-1 sm:translate-x-2.5 sm:translate-y-1.5 sm:-rotate-2 pointer-events-none transition-transform duration-500 border border-brand-dark/10 bg-brand-dark/25"
          >
            <img
              src="/images/portfolio/model-clipping.png"
              alt=""
              class="w-full h-full object-cover object-center opacity-65"
              loading="lazy"
              decoding="async"
            />
            <div class="absolute inset-0 bg-brand-dark/15"></div>
          </div>

          <!-- Front Visual Card: Prominent Portrait with Smooth Crossfade -->
          <div
            class="relative w-full h-full rounded-3xl overflow-hidden bg-white shadow-2xl border border-brand-dark/10 z-10 select-none"
          >
            <!-- Images Layer with crossfade -->
            {#each stages as stage, idx (stage.step)}
              <img
                src={stage.image}
                alt="{stage.title} portrait view"
                class="absolute inset-0 h-full w-full object-cover object-center transition-all duration-500 ease-out pointer-events-none {activeStageIndex === idx
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 z-0'}"
                loading="lazy"
                decoding="async"
              />
            {/each}

            <!-- Bottom ambient gradient for editorial depth -->
            <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent opacity-70 z-20"
            ></div>

            <!-- Glass Badge on Top-Left (Matches Orbit Gallery Card Pill) -->
            <div
              class="pointer-events-none absolute top-4 left-4 z-30 inline-flex items-center rounded-xl border border-white/25 bg-brand-dark/50 px-3.5 py-1.5 text-brand-light backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-300"
            >
              <span class="font-sans text-xs font-medium tracking-tight text-white">
                {stages[activeStageIndex].badge}
              </span>
            </div>
          </div>
        </div>

        <!-- Mobile/Tablet Interactive Stepper Controls (Directly below preview card) -->
        <div class="mt-5 flex items-center justify-between w-[270px] sm:w-[360px] max-w-[calc(100vw-3rem)] lg:hidden bg-white px-3 py-2 rounded-2xl border border-brand-dark/10 shadow-xs">
          <button
            type="button"
            onclick={prevStage}
            aria-label="View previous stage"
            class="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-brand-dark/70 hover:text-brand-green py-1.5 px-2.5 rounded-lg hover:bg-brand-dark/5 transition-colors cursor-pointer active:scale-95"
          >
            <ChevronLeft class="size-4 text-brand-green" />
            <span>Prev</span>
          </button>

          <!-- Stage indicator text -->
          <div class="flex items-center gap-1.5 font-mono text-xs font-semibold text-brand-dark">
            <span class="text-brand-green">{stages[activeStageIndex].step}</span>
            <span class="text-brand-dark/30">/</span>
            <span>05</span>
          </div>

          <button
            type="button"
            onclick={nextStage}
            aria-label="View next stage"
            class="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-brand-dark/70 hover:text-brand-green py-1.5 px-2.5 rounded-lg hover:bg-brand-dark/5 transition-colors cursor-pointer active:scale-95"
          >
            <span>Next</span>
            <ChevronRight class="size-4 text-brand-green" />
          </button>
        </div>
      </div>

      <!-- Right Column: Editorial Narrative & Steps List -->
      <div class="w-full lg:max-w-[540px] flex flex-col process-fade-item">
        <!-- Desktop Title & Intro (Hidden on mobile) -->
        <div class="hidden lg:block mb-7">
          <span class="font-mono text-xs uppercase tracking-[0.2em] text-brand-green font-semibold block mb-2">
            Inspection Craft
          </span>
          <h2 class="font-display text-2xl sm:text-3xl lg:text-[2.2rem] xl:text-[2.65rem] font-normal text-brand-dark leading-[1.15] tracking-tight mb-3 xl:whitespace-nowrap">
            From Studio RAW to <em class="font-display italic font-normal text-brand-green">Campaign Master.</em>
          </h2>
          <p class="text-sm sm:text-base text-brand-dark/75 leading-relaxed font-normal max-w-lg">
            Behind every high-fashion campaign asset lies rigorous multi-pass digital craft. Hover or click each phase to inspect how raw captures evolve into publication-ready masters.
          </p>
        </div>

        <!-- Interactive Steps with Sliding Vertical Indicator Rail -->
        <div class="relative flex gap-3.5 sm:gap-4 items-stretch w-full">
          <!-- Rail Indicator (Tracks Active Step) -->
          <div class="relative hidden w-[3px] rounded-full bg-brand-dark/10 sm:block overflow-hidden my-1.5 shrink-0">
            <div
              class="absolute left-0 w-full rounded-full bg-brand-green transition-all duration-300 ease-out"
              style="top: {(activeStageIndex / stages.length) * 100}%; height: {100 / stages.length}%;"
            ></div>
          </div>

          <!-- Step Buttons List -->
          <div class="flex-1 flex flex-col gap-2" role="tablist" aria-label="Production stages">
            {#each stages as stage, idx (stage.step)}
              {@const isActive = activeStageIndex === idx}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                tabindex="0"
                onmouseenter={() => (activeStageIndex = idx)}
                onclick={() => (activeStageIndex = idx)}
                onkeydown={(e) => onKeyDown(e, idx)}
                class="group flex flex-col text-left py-3 px-4 sm:px-5 rounded-xl transition-all duration-200 cursor-pointer {isActive
                  ? 'bg-white shadow-sm border border-brand-dark/10 translate-x-1'
                  : 'hover:bg-white/50 hover:translate-x-1 border border-transparent'}"
              >
                <div class="flex items-start gap-3.5 sm:gap-4 w-full">
                  <span
                    class="font-display text-xl sm:text-2xl font-light leading-none select-none transition-colors duration-200 pt-0.5 shrink-0 w-7 {isActive
                      ? 'text-brand-green font-normal'
                      : 'text-brand-dark/25 group-hover:text-brand-dark/60'}"
                  >
                    {stage.step}
                  </span>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-display text-base sm:text-lg font-normal text-brand-dark leading-snug">
                      {stage.title}
                    </h3>
                    {#if isActive}
                      <p class="mt-1.5 text-xs sm:text-sm text-brand-dark/70 leading-relaxed font-normal">
                        {stage.desc}
                      </p>
                    {/if}
                  </div>
                </div>
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

