<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceIntroData } from "$lib/types/service-detail";

  let { data } = $props<{ data: ServiceIntroData }>();
  let section = $state<HTMLElement>();
  let activeStep = $state(0);

  const stages = $derived(data.stages ?? []);
  const studyMedia = $derived(stages[0]?.media);

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      const currentSection = section;
      if (!active || !runtime || !currentSection) return;
      const { gsap, ScrollTrigger } = runtime;

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
            .from(".sd-intro-copy", {
              autoAlpha: 0,
              y: 28,
              duration: 0.82,
              stagger: 0.08,
              clearProps: "all",
            })
            .from(
              ".sd-study-frame",
              {
                autoAlpha: 0,
                y: 40,
                duration: 0.9,
                clearProps: "all",
              },
              "-=0.5",
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
  class="relative isolate overflow-hidden py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div class="site-shell relative z-10">
    <div class="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
      <!-- Left Column: Copy + Interactive Steps List -->
      <div class="lg:col-span-5">
        <div>
          <h2
            id="service-detail-intro-title"
            class="sd-intro-copy max-w-[20ch] font-display text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.04em]"
          >
            {data.heading}
          </h2>

          <div class="mt-7 max-w-[34rem]">
            {#each data.paragraphs as paragraph (paragraph)}
              <p
                class="sd-intro-copy text-base leading-[1.7] text-brand-dark/64 sm:text-[1.03rem] [&+&]:mt-4"
              >
                {paragraph}
              </p>
            {/each}
          </div>

          {#if stages.length > 0}
            <div class="relative mt-8 max-w-[34rem] flex gap-3 sm:gap-4 items-stretch">
              <!-- Sliding glowing green indicator rail (matching AboutOrbitGallery) -->
              <div
                class="relative hidden w-[3px] rounded-full bg-brand-dark/10 sm:block overflow-hidden my-1 shrink-0"
                aria-hidden="true"
              >
                <div
                  class="absolute left-0 w-full rounded-full bg-brand-green shadow-[0_0_12px_rgba(126,166,65,0.9)] transition-all duration-300 ease-out"
                  style="top: {(activeStep / stages.length) * 100}%; height: {100 / stages.length}%;"
                ></div>
              </div>

              <!-- Interactive Step Cards -->
              <div
                class="flex-1 flex flex-col gap-2.5 w-full"
                role="tablist"
                aria-label="Garment workflow stages"
              >
                {#each stages as stage, index (stage.label)}
                  {@const isActive = activeStep === index}
                  <button
                    type="button"
                    class="group text-left w-full cursor-pointer rounded-[1rem] p-3.5 sm:p-4 transition-all duration-300 {isActive
                      ? 'bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border border-brand-dark/9 translate-x-1.5'
                      : 'bg-transparent border border-transparent hover:bg-brand-dark/[0.03] hover:translate-x-1'}"
                    role="tab"
                    tabindex="0"
                    aria-selected={isActive}
                    onclick={() => (activeStep = index)}
                    onmouseenter={() => (activeStep = index)}
                  >
                    <div class="flex items-start gap-3.5 sm:gap-4 w-full">
                      <!-- Large editorial numeral (matches AboutOrbitGallery exactly) -->
                      <span
                        class="font-display text-2xl sm:text-[1.85rem] font-light leading-none select-none transition-colors duration-300 w-7 sm:w-8 shrink-0 pt-0.5 {isActive
                          ? 'text-brand-green'
                          : 'text-brand-dark/25 group-hover:text-brand-dark/60'}"
                      >
                        0{index + 1}
                      </span>

                      <!-- Title + Description -->
                      <div class="flex-1 min-w-0">
                        <h3
                          class="font-sans font-semibold text-[0.95rem] sm:text-[1rem] leading-tight text-brand-dark tracking-[-0.01em]"
                        >
                          {stage.label}
                        </h3>

                        <p
                          class="mt-1.5 text-xs sm:text-[0.84rem] leading-relaxed transition-colors duration-300 {isActive
                            ? 'text-brand-dark/85 font-normal'
                            : 'text-brand-dark/55'}"
                        >
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Right Column: Single Clean Image Frame with Interactive Frosted Pointer Tabs -->
      {#if studyMedia}
        <div class="lg:col-span-7 lg:self-start lg:pt-2">
          <figure
            class="sd-study-frame relative mx-auto aspect-[4/5] w-full max-w-[30rem] overflow-hidden rounded-[2rem] border border-brand-dark/10 bg-white shadow-xl shadow-brand-dark/[0.04]"
          >
            <!-- Direct Single Clean Image (No overlays, no pill tags) -->
            <img
              src={studyMedia.src}
              alt={studyMedia.alt}
              width={studyMedia.width}
              height={studyMedia.height}
              loading="eager"
              class="sd-study-image size-full object-cover object-center"
            />
          </figure>
        </div>
      {/if}
    </div>
  </div>
</section>
