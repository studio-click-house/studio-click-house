<script lang="ts">
  import { onMount, tick } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData } from "$lib/types/about";
  import { _ } from "svelte-i18n";

  let { journey } = $props<{ journey: AboutPageData["journey"] }>();
  let sectionRef: HTMLElement;
  let timelineTrackRef: HTMLElement;
  let progressPathRef: SVGPathElement;
  let routePath = $state("");
  let routeViewBox = $state("0 0 1 1");
  let yearCutouts = $state<{ x: number; y: number; rx: number; ry: number }[]>([]);

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;
    let resizeFrame = 0;
    let refreshAnimation: (() => void) | undefined;

    function updateRoute() {
      const bounds = timelineTrackRef.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const markers = Array.from(
        timelineTrackRef.querySelectorAll<HTMLElement>(".journey-year"),
      ).map((marker) => {
        const rect = marker.getBoundingClientRect();
        return {
          x: rect.left - bounds.left + rect.width / 2,
          y: rect.top - bounds.top + rect.height / 2,
          rx: rect.width / 2 + 8,
          ry: rect.height / 2 + 12,
        };
      });
      if (!markers.length) return;
      yearCutouts = markers;
      const first = markers[0];
      const last = markers[markers.length - 1];
      const bend = window.matchMedia("(min-width: 768px)").matches
        ? Math.min(bounds.width * 0.1, 130)
        : 22;
      let path = `M ${first.x} ${Math.max(0, first.y - 64)} L ${first.x} ${first.y}`;
      for (let i = 1; i < markers.length; i++) {
        const previous = markers[i - 1];
        const next = markers[i];
        const distance = (next.y - previous.y) * 0.42;
        const offset = i % 2 === 0 ? -bend : bend;
        path += ` C ${previous.x + offset} ${previous.y + distance}, ${next.x + offset} ${next.y - distance}, ${next.x} ${next.y}`;
      }
      routePath = `${path} L ${last.x} ${Math.min(bounds.height, last.y + 64)}`;
      routeViewBox = `0 0 ${bounds.width} ${bounds.height}`;
      void tick().then(() => {
        if (active) refreshAnimation?.();
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(updateRoute);
    });
    resizeObserver.observe(timelineTrackRef);
    updateRoute();
    void document.fonts.ready.then(() => { if (active) updateRoute(); });

    registerScrollTrigger().then(async (runtime) => {
      await document.fonts.ready;
      if (!active) return;
      updateRoute();
      await tick();
      if (!active || !runtime || !sectionRef) return;
      const { gsap, ScrollTrigger } = runtime;
      refreshAnimation = () => ScrollTrigger.refresh();
      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".journey-header-reveal", {
            autoAlpha: 0,
            y: 24,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: { trigger: sectionRef, start: "top 88%", once: true },
          });
          gsap.fromTo(progressPathRef,
            {
              strokeDasharray: () => `${progressPathRef.getTotalLength()} ${progressPathRef.getTotalLength()}`,
              strokeDashoffset: () => progressPathRef.getTotalLength(),
            },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: timelineTrackRef,
                start: "top 65%",
                end: "bottom 65%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
          for (const chapter of timelineTrackRef.querySelectorAll(".journey-chapter")) {
            gsap.fromTo(chapter.querySelector(".journey-year-label"), {
              opacity: 0.4,
              scale: 0.92,
            }, {
              opacity: 1,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: chapter.querySelector(".journey-year"),
                start: "center 85%",
                end: "center 55%",
                scrub: 0.4,
              },
            });
            gsap.from(chapter.querySelectorAll(".journey-chapter-content"), {
              autoAlpha: 0,
              y: 28,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
              clearProps: "all",
              scrollTrigger: { trigger: chapter, start: "top 88%", toggleActions: "play none none reverse" },
            });
          }
        });
        media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
          for (const image of timelineTrackRef.querySelectorAll(".journey-photo-frame img")) {
            gsap.fromTo(image, { yPercent: -4, scale: 1.12 }, {
              yPercent: 4,
              scale: 1.1,
              ease: "none",
              scrollTrigger: {
                trigger: image.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            });
          }
        });
      }, sectionRef);
      ScrollTrigger.refresh();
    });
    return () => {
      active = false;
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      refreshAnimation = undefined;
      context?.revert();
    };
  });
</script>

<section
  id="our-journey"
  aria-labelledby="our-journey-title"
  bind:this={sectionRef}
  class="relative overflow-hidden bg-brand-light py-14 sm:py-16 lg:py-20"
>
  <div class="site-shell">
    <header class="mb-12 grid gap-6 md:mb-16 lg:grid-cols-12 lg:items-end">
      <div class="journey-header-reveal lg:col-span-7">
        <p class="eyebrow mb-3 text-brand-dark/50">{$_("sectionLabels.journey")}</p>
        <h2 id="our-journey-title" class="max-w-[13ch] font-sans text-[length:var(--text-section)] font-semibold leading-[1.05] tracking-[-0.04em] text-brand-dark">
          {$_('about.journey.heading') || journey.heading}
        </h2>
      </div>
      <p class="journey-header-reveal max-w-xl text-base leading-relaxed text-brand-dark/70 lg:col-span-5">
        {$_('about.journey.subheading') || journey.subheading}
      </p>
    </header>

    <div id="studio-story-timeline" bind:this={timelineTrackRef} class="journey-track relative">
      <svg class="journey-route pointer-events-none absolute inset-0 h-full w-full" viewBox={routeViewBox} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <mask id="studio-story-route-mask" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="white" />
            {#each yearCutouts as cutout, index (index)}
              <ellipse cx={cutout.x} cy={cutout.y} rx={cutout.rx} ry={cutout.ry} fill="black" />
            {/each}
          </mask>
        </defs>
        <g mask="url(#studio-story-route-mask)">
          <path d={routePath} class="journey-road" />
          <path d={routePath} class="journey-route-base" />
          <path bind:this={progressPathRef} d={routePath} class="journey-route-progress" />
        </g>
      </svg>

      <ol class="relative m-0 list-none space-y-12 p-0 md:space-y-16 lg:space-y-20">
        {#each journey.milestones as milestone, index (milestone.year)}
          <li id={`studio-story-${milestone.year}`} class="journey-chapter" class:journey-chapter-reverse={index % 2 === 1}>
            <div class="journey-year font-sans font-bold tabular-nums tracking-[-0.05em] text-brand-dark">
              <span class="journey-year-label inline-block py-3">{milestone.year}</span>
            </div>
            <div class="journey-copy journey-chapter-content">
              <p class="mb-3 text-sm font-medium text-brand-dark/50">
                {$_(`about.journey.milestones.${index}.subtitle`) || milestone.subtitle}
              </p>
              <h3 class="mb-4 max-w-[20ch] font-sans text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-brand-dark lg:text-3xl">
                {$_(`about.journey.milestones.${index}.title`) || milestone.title}
              </h3>
              <p class="max-w-md text-sm leading-relaxed text-brand-dark/70 sm:text-base">
                {$_(`about.journey.milestones.${index}.description`) || milestone.description}
              </p>
              {#if milestone.statsHighlight}
                <p class="mt-5 text-sm font-semibold leading-relaxed text-brand-dark/80">
                  {$_(`about.journey.milestones.${index}.statsHighlight`) || milestone.statsHighlight}
                </p>
              {/if}
            </div>
            {#if milestone.media}
              <figure class="journey-photo journey-chapter-content m-0">
                <div class="journey-photo-frame overflow-hidden bg-brand-paper">
                  <img src={milestone.media.src} alt={milestone.media.alt} width={milestone.media.width} height={milestone.media.height} loading="lazy" decoding="async" class="h-full w-full object-cover" />
                </div>
                {#if milestone.media.credit}
                  <figcaption class="mt-3 text-xs leading-relaxed text-brand-dark/50">{milestone.media.credit}</figcaption>
                {/if}
              </figure>
            {/if}
          </li>
        {/each}
      </ol>
    </div>
  </div>
</section>

<style>
  .journey-road {
    fill: none;
    stroke: var(--color-brand-dark);
    opacity: 0.04;
    stroke-width: 18;
    stroke-linecap: round;
  }
  .journey-route-base,
  .journey-route-progress {
    fill: none;
    stroke: var(--color-brand-green);
    stroke-width: 2;
    stroke-linecap: round;
  }
  .journey-route-base { stroke: var(--color-brand-dark); opacity: 0.12; }
  .journey-route-progress { stroke-width: 3; }
  .journey-chapter {
    display: grid;
    grid-template-columns: 4.75rem minmax(0, 1fr);
    align-items: start;
    column-gap: 1rem;
    row-gap: 1.5rem;
  }
  .journey-year {
    grid-column: 1;
    grid-row: 1;
    position: relative;
    z-index: 1;
    text-align: center;
    font-size: 1.75rem;
    line-height: 1;
    padding-top: 0.5rem;
  }
  .journey-copy { grid-column: 2; grid-row: 1; }
  .journey-photo { grid-column: 2; grid-row: 2; width: 100%; }
  .journey-photo-frame {
    aspect-ratio: 4 / 3;
    border-radius: var(--radius-media-sm);
  }
  @media (min-width: 48rem) {
    .journey-road { stroke-width: 32; }
    .journey-chapter {
      grid-template-columns: minmax(0, 1fr) 8rem minmax(0, 1fr);
      align-items: center;
      gap: 2rem;
      min-height: 22rem;
    }
    .journey-year {
      grid-column: 2;
      grid-row: 1;
      font-size: 2.25rem;
      padding-top: 0;
    }
    .journey-copy { grid-column: 1; grid-row: 1; }
    .journey-photo { grid-column: 3; grid-row: 1; max-width: 28rem; justify-self: end; }
    .journey-photo-frame {
      border-radius: 5rem var(--radius-media) var(--radius-media) var(--radius-media);
    }
    .journey-chapter-reverse .journey-copy { grid-column: 3; }
    .journey-chapter-reverse .journey-photo { grid-column: 1; justify-self: start; }
    .journey-chapter-reverse .journey-photo-frame {
      border-radius: var(--radius-media) 5rem var(--radius-media) var(--radius-media);
    }
  }
  @media (min-width: 64rem) {
    .journey-chapter { column-gap: 3.5rem; }
    .journey-year { font-size: 2.75rem; }
  }
</style>
