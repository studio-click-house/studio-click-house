<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData } from "$lib/types/about";

  let { journey } = $props<{ journey: AboutPageData["journey"] }>();

  let sectionRef: HTMLElement;
  let timelineTrackRef: HTMLElement;
  let progressLineRef: HTMLElement;

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionRef) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          // Section header animation
          gsap.fromTo(
            ".journey-header-reveal",
            { autoAlpha: 0, y: 30 },
            {
              scrollTrigger: {
                trigger: sectionRef,
                start: "top 80%",
              },
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
            },
          );

          // Scroll-scrubbed connecting line fill
          if (timelineTrackRef && progressLineRef) {
            gsap.fromTo(
              progressLineRef,
              { scaleY: 0 },
              {
                scrollTrigger: {
                  trigger: timelineTrackRef,
                  start: "top 75%",
                  end: "bottom 35%",
                  scrub: 0.5,
                },
                scaleY: 1,
                transformOrigin: "top center",
                ease: "none",
              },
            );
          }

          // Individual milestone entry reveals
          const milestoneCards = gsap.utils.toArray<HTMLElement>(
            ".timeline-milestone-item",
          );
          milestoneCards.forEach((card) => {
            gsap.fromTo(
              card,
              { autoAlpha: 0, y: 40, scale: 0.96 },
              {
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  end: "top 45%",
                  toggleActions: "play none none reverse",
                },
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: "power2.out",
              },
            );
          });
        });
      }, sectionRef);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="our-journey"
  aria-label="Our Journey Timeline"
  bind:this={sectionRef}
  class="section-space relative overflow-hidden border-y border-brand-dark/15 bg-brand-light py-24 md:py-36"
>
  <div class="site-shell">
    <!-- Header -->
    <div class="mb-16 grid gap-7 lg:grid-cols-12 lg:items-end md:mb-24">
      <div
        class="journey-header-reveal flex items-center gap-3 lg:col-span-3 lg:self-start"
      >
        <span class="h-px w-8 bg-brand-green"></span>
        <p class="eyebrow text-brand-dark/70">{journey.eyebrow}</p>
      </div>
      <h2
        class="journey-header-reveal font-display text-[clamp(3.25rem,6vw,7rem)] leading-[0.86] tracking-[-0.05em] text-brand-dark lg:col-span-6"
      >
        {journey.heading}
      </h2>
      <p
        class="journey-header-reveal max-w-md text-base leading-relaxed text-brand-dark/70 lg:col-span-3 lg:pb-2 md:text-lg"
      >
        {journey.subheading}
      </p>
    </div>

    <!-- Timeline Container -->
    <div bind:this={timelineTrackRef} class="relative max-w-5xl mx-auto">
      <!-- Central / Left Connecting Vertical Line -->
      <div
        class="absolute top-0 bottom-0 left-2 w-px bg-brand-dark/15 md:left-1/2 md:-translate-x-1/2"
      >
        <div
          bind:this={progressLineRef}
          class="h-full w-full bg-brand-green"
        ></div>
      </div>

      <!-- Timeline Items -->
      <div class="space-y-12 md:space-y-20 relative">
        {#each journey.milestones as milestone, index (milestone.year)}
          {@const isEven = index % 2 === 0}
          <div
            class="timeline-milestone-item relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12"
          >
            <!-- Timeline Center Node Badge -->
            <div
              class="absolute left-2 z-10 h-3 w-3 -translate-x-1/2 overflow-hidden bg-brand-green text-transparent ring-4 ring-brand-light md:left-1/2"
            >
              {milestone.year.slice(2)}
            </div>

            <!-- Left / Right Layout Column 1 -->
            <div
              class="w-full md:w-1/2 pl-12 md:pl-0 {isEven
                ? 'md:pr-12 md:text-right'
                : 'md:order-2 md:pl-12 md:text-left'}"
            >
              <div
                class="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brand-green"
              >
                {milestone.year} · {milestone.subtitle}
              </div>
              <h3
                class="mb-3 font-display text-2xl font-normal text-brand-dark md:text-4xl"
              >
                {milestone.title}
              </h3>
              <p
                class="text-sm md:text-base text-brand-dark/80 leading-relaxed mb-4"
              >
                {milestone.description}
              </p>
              {#if milestone.statsHighlight}
                <div
                  class="inline-flex items-center gap-2 border-t border-brand-dark/25 pt-2 text-xs font-mono font-medium text-brand-dark/75"
                >
                  {milestone.statsHighlight}
                </div>
              {/if}
            </div>

            <!-- Left / Right Layout Column 2 (Supporting Image Card) -->
            <div
              class="w-full md:w-1/2 pl-12 md:pl-0 {isEven
                ? 'md:order-2 md:pl-12'
                : 'md:pr-12'}"
            >
              {#if milestone.media}
                <div
                  class="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-brand-paper"
                >
                  <img
                    src={milestone.media.src}
                    alt={milestone.media.alt}
                    width={milestone.media.width}
                    height={milestone.media.height}
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 text-white text-xs font-mono"
                  >
                    {milestone.media.credit}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
