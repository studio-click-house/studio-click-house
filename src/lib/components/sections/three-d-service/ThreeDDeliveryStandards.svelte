<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ThreeDDeliveryItem } from "$lib/content/three-d-modeling";

  let { deliverables }: { deliverables: ThreeDDeliveryItem[] } = $props();

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

          tl.from(".deliverables-header", {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
            clearProps: "all",
          }).from(
            ".deliverable-card",
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
  id="threed-deliverables"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-28"
>
  <div class="site-shell relative z-10">
    <!-- Header Block -->
    <div class="deliverables-header max-w-3xl space-y-4">
      <h2 class="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.15] tracking-[-0.03em] font-bold text-brand-dark">
        What we deliver.
      </h2>

      <p class="text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed">
        You decide the 3D file formats, render sizes, and resolutions you need. We deliver production-ready 3D assets formatted for web, mobile AR, and print.
      </p>
    </div>

    <!-- Deliverables Grid (Rounded Cards with Green Border Hover) -->
    <div class="deliverables-grid mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {#each deliverables as block (block.headline)}
        <div class="deliverable-card rounded-[2rem] border border-brand-dark/10 bg-white p-8 sm:p-9 transition-colors duration-300 hover:border-brand-green flex flex-col justify-between">
          <div class="space-y-6">
            <div>
              <h3 class="font-display text-xl font-bold tracking-tight text-brand-dark">
                {block.headline}
              </h3>
            </div>

            <!-- Spec List: Clean, readable feature list with brand-green indicator -->
            <div class="space-y-4 pt-1">
              {#each block.specs as spec (spec.label)}
                <div class="flex items-start gap-3">
                  <div class="size-1.5 rounded-full bg-brand-green mt-2 shrink-0"></div>
                  <div class="space-y-0.5">
                    <div class="font-sans text-sm font-semibold text-brand-dark">
                      {spec.label}
                    </div>
                    <div class="font-sans text-xs text-brand-dark/70 leading-relaxed">
                      {spec.value}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
