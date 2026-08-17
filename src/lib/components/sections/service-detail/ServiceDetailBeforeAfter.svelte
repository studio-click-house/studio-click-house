<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import BeforeAfterSlider from "$lib/components/common/BeforeAfterSlider.svelte";
  import type { ServiceBeforeAfterData } from "$lib/types/service-detail";

  let { data } = $props<{ data: ServiceBeforeAfterData }>();
  let section = $state<HTMLElement>();

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
                start: "top 78%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from(".sd-ba-copy", {
              autoAlpha: 0,
              x: -26,
              duration: 0.78,
            })
            .from(
              ".sd-ba-slider",
              {
                autoAlpha: 0,
                y: 72,
                scale: 0.975,
                duration: 0.95,
              },
              "-=0.48",
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
  id="service-detail-before-after"
  aria-labelledby="service-detail-before-after-title"
  class="relative isolate overflow-hidden py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div class="site-shell relative z-10">
    <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <!-- Left: Slider (Columns 1-7) -->
      <div class="sd-ba-slider lg:order-1 lg:col-span-7">
        <div class="relative mx-auto max-w-[27rem] lg:ml-0 lg:mr-auto">
          <BeforeAfterSlider
            beforeSrc={data.beforeSrc}
            beforeAlt={data.beforeAlt}
            afterSrc={data.afterSrc}
            afterAlt={data.afterAlt}
            width={data.width}
            height={data.height}
            beforeLabel={data.beforeLabel}
            afterLabel={data.afterLabel}
            ariaLabel="Compare before and after service results"
          />
        </div>
      </div>

      <!-- Right: Text & Details (Columns 8-12) -->
      <div class="sd-ba-copy lg:order-2 lg:col-span-5 lg:pl-4">
        <h2
          id="service-detail-before-after-title"
          class="max-w-[20ch] font-display text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.04em]"
        >
          {data.heading}
        </h2>
        {#if data.description}
          <p class="mt-5 max-w-[42ch] text-base leading-7 text-brand-dark/62">
            {data.description}
          </p>
        {/if}

        {#if data.caption}
          <p
            class="mt-7 border-l border-brand-green/70 pl-4 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-dark/45"
          >
            {data.caption}
          </p>
        {/if}
      </div>
    </div>
  </div>
</section>
