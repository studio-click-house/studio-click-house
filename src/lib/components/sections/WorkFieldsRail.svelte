<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { workGalleryItems } from "$lib/content/home";

  let section: HTMLElement;
  let viewport: HTMLElement;
  let track: HTMLElement;

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !viewport || !track) return;

      const { gsap, ScrollTrigger } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          "(min-width: 768px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)",
          () => {
            const navbar = document.querySelector<HTMLElement>(".site-header");
            const navbarHeight = () =>
              navbar?.getBoundingClientRect().height ?? 0;
            const syncRailHeight = () => {
              const visibleHeight = Math.max(
                0,
                window.innerHeight - navbarHeight(),
              );
              section.style.setProperty(
                "--rail-viewport-height",
                `${visibleHeight}px`,
              );
            };
            const horizontalDistance = () =>
              Math.max(0, track.scrollWidth - viewport.clientWidth + 32);
            const introDistance = () =>
              Math.min(Math.max(window.innerHeight * 0.06, 64), 96);

            syncRailHeight();
            ScrollTrigger.addEventListener("refreshInit", syncRailHeight);

            const railTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: () => `top ${navbarHeight()}px`,
                end: () => `+=${horizontalDistance() + introDistance()}`,
                pin: true,
                pinSpacing: true,
                scrub: true,
                anticipatePin: 0,
                invalidateOnRefresh: true,
              },
            });

            railTimeline.to(
              track,
              {
                x: () => -horizontalDistance(),
                ease: "none",
                force3D: true,
                duration: 1,
              },
              0.06,
            );

            ScrollTrigger.refresh();

            return () => {
              ScrollTrigger.removeEventListener("refreshInit", syncRailHeight);
              section.style.removeProperty("--rail-viewport-height");
            };
          },
        );

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="work-fields-rail"
  bind:this={section}
  aria-labelledby="work-fields-rail-title"
  class="relative flex min-h-svh flex-col justify-start overflow-hidden bg-brand-dark text-brand-light"
>
  <h2 id="work-fields-rail-title" class="sr-only">Visual production fields</h2>

  <div
    bind:this={viewport}
    class="rail-viewport overflow-x-auto md:h-full md:overflow-hidden"
  >
    <div
      bind:this={track}
      class="rail-track flex w-max snap-x snap-mandatory gap-3 px-0 md:h-full md:snap-none md:pr-12 md:pl-0"
    >
      {#each workGalleryItems as item (item.id)}
        <article
          class="work-card relative w-[78vw] max-w-[30rem] shrink-0 snap-start overflow-hidden bg-brand-light/5 md:h-full md:w-[clamp(22rem,36vw,38rem)] md:max-w-none"
        >
          <img
            src={item.media.src}
            alt={item.media.alt}
            width={item.media.width}
            height={item.media.height}
            loading="lazy"
            class="work-card-image aspect-[4/5] w-full object-cover md:h-full md:aspect-auto"
          />
          <div
            class="work-card-shade absolute inset-0"
            aria-hidden="true"
          ></div>
          <div class="work-card-copy absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div class="work-card-detail">
              <h3
                class="mt-5 max-w-sm font-display text-3xl leading-[0.95] tracking-[-0.025em] sm:text-4xl"
              >
                {item.title}
              </h3>
              <p
                class="mt-4 max-w-sm text-sm leading-relaxed text-brand-light/70"
              >
                {item.description}
              </p>
              <ul class="mt-5 flex flex-wrap gap-2" aria-label="Work tags">
                {#each item.tags as tag (tag)}
                  <li
                    class="border border-brand-light/25 px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-brand-light/75"
                  >
                    {tag}
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  @media (min-width: 48rem) and (min-height: 40.625rem) {
    #work-fields-rail {
      height: var(--rail-viewport-height, calc(100dvh - 4.35rem));
      min-height: var(--rail-viewport-height, calc(100dvh - 4.35rem));
    }
  }

  .rail-viewport {
    scrollbar-width: none;
  }

  .rail-viewport::-webkit-scrollbar {
    display: none;
  }

  .rail-track {
    will-change: transform;
  }

  .work-card-image {
    transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .work-card-shade {
    background: linear-gradient(
      to top,
      rgb(18 17 17 / 0.9),
      rgb(18 17 17 / 0.1) 62%,
      transparent
    );
  }

  .work-card-detail {
    max-height: 22rem;
    transform: translateY(0.6rem);
    visibility: hidden;
    transition:
      transform 760ms cubic-bezier(0.22, 1, 0.36, 1),
      visibility 0s linear 760ms;
  }

  .work-card-detail > * {
    opacity: 0;
    transform: translateY(0.7rem);
    transition:
      opacity 520ms ease,
      transform 680ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .work-card-detail > p {
    transition-delay: 120ms;
  }

  .work-card-detail > ul {
    transition-delay: 220ms;
  }

  .work-card:hover .work-card-image {
    transform: scale(1.06);
  }

  .work-card:hover .work-card-detail {
    transform: translateY(0);
    visibility: visible;
    transition-delay: 0s;
  }

  .work-card:hover .work-card-detail > * {
    opacity: 1;
    transform: translateY(0);
  }

  @media (hover: none), (prefers-reduced-motion: reduce) {
    .rail-track {
      will-change: auto;
    }

    .work-card-detail {
      max-height: 22rem;
      transform: none;
      visibility: visible;
      transition: none;
    }

    .work-card-detail > * {
      opacity: 1;
      transform: none;
      transition: none;
    }

    .work-card-image {
      transition: none;
    }
  }
</style>
