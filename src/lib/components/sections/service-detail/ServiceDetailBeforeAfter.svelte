<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowDown, ArrowUpRight } from "lucide-svelte";
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
                start: "top 88%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            })
            .from(".sd-ba-copy", {
              autoAlpha: 0,
              y: 22,
              duration: 0.78,
              clearProps: "all",
            })
            .from(
              ".sd-ba-media",
              {
                autoAlpha: 0,
                y: 36,
                duration: 0.85,
                clearProps: "all",
              },
              "-=0.48",
            );

          if (currentSection.querySelector(".sd-ba-card")) {
            gsap.to(".sd-ba-card", {
              yPercent: -6,
              stagger: 0.06,
              ease: "none",
              scrollTrigger: {
                trigger: currentSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            });
          }
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
    {#if data.layout === "cards"}
      <!-- 2-Card 4:5 Direct Comparison: Images Left, Text Right -->
      <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <!-- 2-Card 4:5 Before & After Grid (Left: Columns 1-7) -->
        <div class="sd-ba-media relative lg:order-1 lg:col-span-7 pb-2 sm:pb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
            <!-- Before Card (First: top aligned) -->
            <figure
              class="sd-ba-card group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-brand-dark/10 bg-white shadow-lg shadow-brand-dark/[0.03] transition-all duration-500 hover:shadow-xl hover:border-brand-dark/20 sm:-translate-y-2"
            >
              <img
                src={data.beforeSrc}
                alt={data.beforeAlt}
                width={data.width}
                height={data.height}
                loading="lazy"
                class="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
              <span
                class="absolute top-4 left-4 z-10 inline-flex items-center rounded-full border border-brand-dark/10 bg-white/90 px-3.5 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em] text-brand-dark/75 shadow-sm backdrop-blur-md"
              >
                {data.beforeLabel || "Before"}
              </span>
            </figure>

            <!-- After Card (Second: staggered offset so images are not on the same horizontal line) -->
            <figure
              class="sd-ba-card group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-brand-dark/10 bg-white shadow-lg shadow-brand-dark/[0.03] transition-all duration-500 hover:shadow-xl hover:border-brand-green/30 sm:translate-y-8"
            >
              <img
                src={data.afterSrc}
                alt={data.afterAlt}
                width={data.width}
                height={data.height}
                loading="lazy"
                class="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />
              <span
                class="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-brand-dark/10 bg-white/90 px-3.5 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em] text-brand-dark/75 shadow-sm backdrop-blur-md"
              >
                <span class="size-1.5 rounded-full bg-brand-green"></span>
                {data.afterLabel || "After"}
              </span>
            </figure>
          </div>
        </div>

        <!-- Text & Details (Right: Columns 8-12) -->
        <div class="sd-ba-copy lg:order-2 lg:col-span-5 lg:pl-4">
          <h2
            id="service-detail-before-after-title"
            class="max-w-[20ch] font-display text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.04em]"
          >
            {data.heading}
          </h2>
          {#if data.description}
            <p class="mt-6 max-w-[38ch] text-base leading-7 text-brand-dark/64">
              {data.description}
            </p>
          {/if}

          {#if data.bullets && data.bullets.length > 0}
            <ul class="mt-6 space-y-2.5">
              {#each data.bullets as bullet}
                <li class="flex items-center gap-2.5 text-sm text-brand-dark/75">
                  <span class="size-1.5 shrink-0 rounded-full bg-brand-green"></span>
                  <span>{bullet}</span>
                </li>
              {/each}
            </ul>
          {/if}

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={resolve("/contact")}
              class="group inline-flex min-h-12 items-center gap-4 rounded-[0.55rem] bg-brand-dark px-6 font-mono text-[0.64rem] font-bold uppercase tracking-[0.12em] text-brand-light transition-colors duration-300 hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
            >
              Discuss your project
              <ArrowUpRight
                class="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#service-detail-showcase"
              class="group inline-flex min-h-12 items-center gap-2 rounded-[0.55rem] border border-brand-dark/18 px-4 text-sm font-semibold transition-colors duration-300 hover:border-brand-green hover:text-brand-green"
            >
              View comparison
              <ArrowDown
                class="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    {:else}
      <!-- Classic Slider Layout (for other service pages) -->
      <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <!-- Left: Slider (Columns 1-7) -->
        <div class="sd-ba-media sd-ba-slider lg:order-1 lg:col-span-7">
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
              showLabels={data.showLabels}
              mediaFit="contain"
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
    {/if}
  </div>
</section>
