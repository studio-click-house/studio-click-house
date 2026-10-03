<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import ServiceActionPair from "$lib/components/common/ServiceActionPair.svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import BeforeAfterSlider from "$lib/components/common/BeforeAfterSlider.svelte";
  import { cn } from "$lib/utils";
  import type { ServiceBeforeAfterData } from "$lib/types/service-detail";

  let {
    data,
    sectionId = "service-detail-before-after",
    imageLoading = "lazy",
  } = $props<{
    data: ServiceBeforeAfterData;
    sectionId?: string;
    imageLoading?: "eager" | "lazy";
  }>();
  const headingId = $derived(`${sectionId}-title`);
  let section = $state<HTMLElement>();

  const beforeList = $derived(
    data.beforeCards && data.beforeCards.length > 0
      ? data.beforeCards
      : [
          {
            src: data.beforeSrc,
            alt: data.beforeAlt,
            label: data.beforeLabel || "Before",
            width: data.width,
            height: data.height,
          },
        ],
  );

  let activeBeforeIndex = $state(0);
  let isHoveringBefore = $state(false);

  $effect(() => {
    if (beforeList.length <= 1 || isHoveringBefore) return;
    const interval = setInterval(() => {
      activeBeforeIndex = (activeBeforeIndex + 1) % beforeList.length;
    }, 3600);
    return () => clearInterval(interval);
  });

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
            .from(".sd-ba-copy", {
              autoAlpha: 0,
              y: 22,
              duration: 0.42,
              clearProps: "all",
            })
            .from(
              ".sd-ba-media",
              {
                autoAlpha: 0,
                y: 36,
                duration: 0.48,
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
  id={sectionId}
  aria-labelledby={headingId}
  class="relative isolate overflow-hidden py-12 text-brand-dark sm:py-14 lg:py-16"
>
  <div class="site-shell relative z-10">
    {#if data.layout === "cards"}
      <!-- 2-card direct comparison with interactive multi-before switcher -->
      <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div
          class={cn(
            "sd-ba-media relative lg:col-span-7 pb-2 sm:pb-6",
            data.textPosition === "left"
              ? "lg:order-2"
              : data.textPosition === "right"
                ? "lg:order-1"
                : "",
          )}
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
            <!-- BEFORE CARD -->
            <figure
              onmouseenter={() => (isHoveringBefore = true)}
              onmouseleave={() => (isHoveringBefore = false)}
              class="sd-ba-card group relative aspect-[4/5] overflow-hidden rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)] border border-brand-dark/10 bg-white shadow-lg shadow-brand-dark/[0.03] transition-all duration-500 hover:shadow-xl hover:border-brand-dark/20 sm:-translate-y-2"
            >
              {#each beforeList as card, idx (card.src)}
                <img
                  src={card.src}
                  alt={card.alt}
                  width={card.width ?? data.width}
                  height={card.height ?? data.height}
                  loading={imageLoading}
                  fetchpriority={imageLoading === "eager" && idx === 0 ? "high" : undefined}
                  class={cn(
                    "size-full object-cover object-center transition-opacity duration-500 ease-out",
                    beforeList.length > 1 ? "absolute inset-0" : "",
                    idx === activeBeforeIndex
                      ? "opacity-100 z-0"
                      : "opacity-0 pointer-events-none -z-10",
                  )}
                />
              {/each}

              {#if beforeList.length > 1}
                <!-- Multi-Before interactive tabs -->
                <div
                  class="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-auto"
                >
                  <div
                    class="inline-flex rounded-full border border-brand-dark/10 bg-white/95 p-0.5 shadow-sm backdrop-blur-md"
                  >
                    {#each beforeList as card, idx}
                      <button
                        type="button"
                        onclick={() => (activeBeforeIndex = idx)}
                        class={cn(
                          "rounded-full px-2.5 py-1 font-sans text-xs font-medium transition-all duration-200 cursor-pointer",
                          activeBeforeIndex === idx
                            ? "bg-brand-dark text-brand-light shadow-sm"
                            : "text-brand-dark/65 hover:text-brand-dark hover:bg-brand-dark/5",
                        )}
                      >
                        {card.label || `Before ${idx + 1}`}
                      </button>
                    {/each}
                  </div>

                  <span
                    class="inline-flex items-center rounded-full border border-brand-dark/10 bg-white/90 px-2.5 py-1 font-sans text-xs font-medium text-brand-dark/75 shadow-sm backdrop-blur-md"
                  >
                    Before
                  </span>
                </div>

                <!-- Subtle pagination dots at bottom -->
                <div
                  class="absolute bottom-3.5 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-auto"
                >
                  {#each beforeList as _, idx}
                    <button
                      type="button"
                      onclick={() => (activeBeforeIndex = idx)}
                      aria-label={`View before input ${idx + 1}`}
                      class={cn(
                        "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                        activeBeforeIndex === idx
                          ? "w-5 bg-brand-dark"
                          : "w-1.5 bg-brand-dark/30 hover:bg-brand-dark/60",
                      )}
                    ></button>
                  {/each}
                </div>
              {:else if data.showLabels !== false}
                <span
                  class="absolute top-4 left-4 z-10 inline-flex items-center rounded-full border border-brand-dark/10 bg-white/90 px-3.5 py-1 font-sans text-xs font-medium text-brand-dark/75 shadow-sm backdrop-blur-md"
                >
                  {data.beforeLabel || "Before"}
                </span>
              {/if}
            </figure>

            <!-- AFTER CARD -->
            <figure
              class="sd-ba-card group relative aspect-[4/5] overflow-hidden rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)] border border-brand-dark/10 bg-white shadow-lg shadow-brand-dark/[0.03] transition-all duration-500 hover:shadow-xl hover:border-brand-green/30 sm:translate-y-8"
            >
              <img
                src={data.afterSrc}
                alt={data.afterAlt}
                width={data.width}
                height={data.height}
                loading={imageLoading}
                fetchpriority={imageLoading === "eager" ? "high" : undefined}
                class="size-full object-cover object-center"
              />
              {#if data.showLabels !== false}
                <span
                  class="absolute top-4 left-4 z-10 inline-flex items-center rounded-full border border-brand-dark/10 bg-white/90 px-3.5 py-1 font-sans text-xs font-medium text-brand-dark/75 shadow-sm backdrop-blur-md"
                >
                  {data.afterLabel || "After"}
                </span>
              {/if}
            </figure>
          </div>
        </div>

        <div
          class={cn(
            "sd-ba-copy lg:col-span-5",
            data.textPosition === "left"
              ? "lg:order-1 lg:pr-6"
              : "lg:order-2 lg:pl-6",
          )}
        >
          <p class="font-sans text-sm font-medium mb-3 text-brand-dark/50">
            {$_("sectionLabels.comparison")}
          </p>
          <h2
            id={headingId}
            class="max-w-[20ch] font-sans font-semibold text-[length:var(--text-section)] leading-[1.05] tracking-[-0.04em]"
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
              {#each data.bullets as bullet (bullet)}
                <li class="flex items-center gap-2.5 text-sm text-brand-dark/75">
                  <span class="size-1.5 shrink-0 rounded-full bg-brand-green"></span>
                  <span>{bullet}</span>
                </li>
              {/each}
            </ul>
          {/if}

          <ServiceActionPair
            comparisonHref={data.comparisonHref || "#service-detail-showcase"}
          />
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
              imageLoading={imageLoading}
              mediaFit="contain"
              ariaLabel="Compare before and after service results"
            />
          </div>
        </div>

        <!-- Right: Text & Details (Columns 8-12) -->
        <div class="sd-ba-copy lg:order-2 lg:col-span-5 lg:pl-4">
          <p class="font-sans text-sm font-medium mb-3 text-brand-dark/50">
            {$_("sectionLabels.comparison")}
          </p>
          <h2
            id={headingId}
            class="max-w-[20ch] font-sans font-semibold text-[length:var(--text-section)] leading-[1.05] tracking-[-0.04em]"
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
              class="mt-7 border-l border-brand-green/70 pl-4 font-sans text-xs text-brand-dark/45"
            >
              {data.caption}
            </p>
          {/if}

          {#if data.bullets && data.bullets.length > 0}
            <ul class="mt-6 space-y-2.5">
              {#each data.bullets as bullet (bullet)}
                <li class="flex items-center gap-2.5 text-sm text-brand-dark/75">
                  <span class="size-1.5 shrink-0 rounded-full bg-brand-green"></span>
                  <span>{bullet}</span>
                </li>
              {/each}
            </ul>
          {/if}

          <ServiceActionPair
            comparisonHref={data.comparisonHref || "#service-detail-showcase"}
          />
        </div>
      </div>
    {/if}
  </div>
</section>
