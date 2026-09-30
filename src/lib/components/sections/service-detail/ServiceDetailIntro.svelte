<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceIntroData } from "$lib/types/service-detail";

  let { data } = $props<{ data: ServiceIntroData }>();
  let section = $state<HTMLElement>();

  const stages = $derived(data.stages ?? []);

  // Split stages across left and right side of the center image (2 on left, 2 on right)
  const leftStages = $derived(
    stages.length <= 2 ? stages.slice(0, 1) : stages.slice(0, 2),
  );

  const rightStages = $derived.by(() => {
    if (stages.length <= 2) {
      return stages.slice(1);
    }
    const right = [...stages.slice(2)];
    // If only 3 stages total, add a complementary 4th standard point for visual symmetry
    if (right.length === 1) {
      right.push({
        label: "Production-Ready Export",
        description:
          "Layered PSD, embedded vector clipping paths, transparent PNG, and marketplace sRGB outputs.",
        media: stages[0]?.media,
      });
    }
    return right;
  });

  // Center visual: Static image, no swapping on hover
  const mainMedia = $derived(stages[0]?.media);

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      const currentSection = section;
      if (!active || !runtime || !currentSection) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: currentSection,
                start: "top 95%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from(".sd-intro-header", {
              autoAlpha: 0,
              y: 22,
              duration: 0.42,
              clearProps: "all",
            })
            .from(
              ".sd-intro-left-point",
              {
                autoAlpha: 0,
                x: -20,
                duration: 0.4,
                stagger: 0.05,
                clearProps: "all",
              },
              "-=0.4",
            )
            .from(
              ".sd-intro-center-media",
              {
                autoAlpha: 0,
                scale: 0.97,
                duration: 0.42,
                clearProps: "all",
              },
              "-=0.5",
            )
            .from(
              ".sd-intro-right-point",
              {
                autoAlpha: 0,
                x: 20,
                duration: 0.4,
                stagger: 0.05,
                clearProps: "all",
              },
              "-=0.6",
            );
        });

        return () => media.revert();
      }, currentSection);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  bind:this={section}
  id="service-detail-intro"
  aria-labelledby="service-detail-intro-title"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div class="site-shell relative z-10">
    <!-- Centered Editorial Header: Title only -->
    <div class="sd-intro-header mb-14 text-center sm:mb-18 lg:mb-20">
      <span
        class="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-brand-dark/50"
      >
        Service Overview
      </span>
      <h2
        id="service-detail-intro-title"
        class="mx-auto mt-3 max-w-[22ch] font-display text-[var(--text-section)] leading-[0.98] tracking-[-0.04em] text-brand-dark"
      >
        {data.heading}
      </h2>
    </div>

    <!-- Centerpiece Stage: Left Points (2) | Center Image | Right Points (2) -->
    <div
      class="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12"
    >
      <!-- Left Column: Simple Text Points (01, 02) with Green Hover & No Dividers -->
      <div class="flex flex-col justify-between gap-6 lg:col-span-4">
        {#each leftStages as stage, index (stage.label)}
          {@const stepIndex = index}
          <div
            class="sd-intro-left-point group flex flex-col items-start rounded-[1.75rem] border border-transparent bg-transparent p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-green hover:bg-white/80 hover:shadow-md sm:rounded-[2rem] sm:p-7"
          >
            <!-- Count in muted gray -->
            <span
              class="font-display text-2xl font-black tracking-tight text-brand-dark/25 transition-colors duration-300 group-hover:text-brand-dark/40 sm:text-3xl"
            >
              0{stepIndex + 1}
            </span>
            <!-- Simple clean title -->
            <h3
              class="mt-2.5 font-display text-base font-extrabold uppercase tracking-tight text-brand-dark sm:text-lg"
            >
              {stage.label}
            </h3>
            <!-- Simple clean description -->
            <p
              class="mt-2 text-sm leading-relaxed text-brand-dark/65 transition-colors duration-300 group-hover:text-brand-dark/90 sm:text-[0.93rem]"
            >
              {stage.description}
            </p>
          </div>
        {/each}
      </div>

      <!-- Centerpiece Visual (Static image, no hover swap) -->
      <div
        class="sd-intro-center-media order-first flex items-center justify-center lg:order-none lg:col-span-4"
      >
        {#if mainMedia}
          <figure
            class="relative mx-auto aspect-[4/5] w-full max-w-[22rem] overflow-hidden rounded-[1.75rem] border border-brand-dark/10 bg-white shadow-xl shadow-brand-dark/[0.04] sm:rounded-[2rem] lg:max-w-full"
          >
            <img
              src={mainMedia.src}
              alt={mainMedia.alt}
              width={mainMedia.width}
              height={mainMedia.height}
              loading="eager"
              class="size-full object-cover object-center"
            />
          </figure>
        {/if}
      </div>

      <!-- Right Column: Simple Text Points (03, 04) with Green Hover & No Dividers -->
      <div class="flex flex-col justify-between gap-6 lg:col-span-4">
        {#each rightStages as stage, index (stage.label)}
          {@const stepIndex = leftStages.length + index}
          <div
            class="sd-intro-right-point group flex flex-col items-start rounded-[1.75rem] border border-transparent bg-transparent p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-green hover:bg-white/80 hover:shadow-md sm:rounded-[2rem] sm:p-7"
          >
            <!-- Count in muted gray -->
            <span
              class="font-display text-2xl font-black tracking-tight text-brand-dark/25 transition-colors duration-300 group-hover:text-brand-dark/40 sm:text-3xl"
            >
              0{stepIndex + 1}
            </span>
            <!-- Simple clean title -->
            <h3
              class="mt-2.5 font-display text-base font-extrabold uppercase tracking-tight text-brand-dark sm:text-lg"
            >
              {stage.label}
            </h3>
            <!-- Simple clean description -->
            <p
              class="mt-2 text-sm leading-relaxed text-brand-dark/65 transition-colors duration-300 group-hover:text-brand-dark/90 sm:text-[0.93rem]"
            >
              {stage.description}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
