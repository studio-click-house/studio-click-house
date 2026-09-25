<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ThreeDWorkflowStep } from "$lib/content/three-d-modeling";

  let { steps }: { steps: ThreeDWorkflowStep[] } = $props();

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
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: currentSection,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
            defaults: { ease: "power3.out" },
          });

          tl.from(".workflow-header", {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
            clearProps: "all",
          }).from(
            ".workflow-card",
            {
              y: 28,
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.08,
              clearProps: "all",
            },
            "-=0.35",
          );
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
  id="threed-workflow"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-28"
>
  <div class="site-shell relative z-10">
    <!-- Header Block -->
    <div class="workflow-header max-w-3xl space-y-4">
      <h2 class="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.15] tracking-[-0.03em] font-bold text-brand-dark">
        How we build 3D assets.
      </h2>

      <p class="text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed">
        From initial reference sketches and CAD files to final rendered masters, our workflow is simple and collaborative.
      </p>
    </div>

    <!-- 4-Step Process Grid (Rounded Cards with Green Border Hover) -->
    <div class="workflow-grid mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {#each steps as item}
        <div class="workflow-card flex flex-col justify-between rounded-[2rem] border border-brand-dark/10 bg-white p-7 sm:p-8 transition-colors duration-300 hover:border-brand-green">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xl font-bold text-brand-green">
                {item.step}
              </span>
              <span class="rounded-full bg-brand-dark/5 px-3 py-1 font-mono text-[0.68rem] font-semibold text-brand-dark/70">
                {item.timeframe}
              </span>
            </div>

            <h3 class="font-display text-xl font-bold tracking-tight text-brand-dark">
              {item.title}
            </h3>

            <p class="text-xs sm:text-sm leading-relaxed text-brand-dark/70">
              {item.description}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
