<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { VideoWorkflowStep } from "$lib/content/video-editing";

  let { steps }: { steps: VideoWorkflowStep[] } = $props();

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
  id="video-workflow"
  class="relative isolate overflow-hidden bg-brand-light py-12 text-brand-dark sm:py-16"
>
  <div class="site-shell relative z-10">
    <!-- Header Block -->
    <div class="workflow-header max-w-3xl space-y-4">
      <p class="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-brand-dark/50">
        {$_("sectionLabels.workflow")}
      </p>
      <h2 class="max-w-[20ch] font-display text-[length:var(--text-section)] leading-[0.98] tracking-[-0.04em] text-brand-dark">
        How we work together.
      </h2>

      <p class="max-w-[38ch] text-sm sm:text-base leading-relaxed text-brand-dark/65">
        From sending your footage to final approval, our workflow is simple and collaborative.
      </p>
    </div>

    <!-- 4-Step Process Grid -->
    <div class="workflow-grid mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {#each steps as item (item.step)}
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
