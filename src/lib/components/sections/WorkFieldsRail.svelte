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
            const horizontalDistance = () =>
              Math.max(0, track.scrollWidth - viewport.clientWidth + 32);

            gsap.fromTo(
              track,
              { x: 0 },
              {
                x: () => -horizontalDistance(),
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: () => `+=${horizontalDistance()}`,
                  pin: true,
                  pinSpacing: true,
                  scrub: 0.9,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              },
            );

            ScrollTrigger.refresh();
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
  class="relative flex min-h-svh flex-col justify-start overflow-hidden bg-brand-dark pt-2 text-brand-light"
>
  <div class="site-shell flex items-center justify-between gap-6 py-3">
    <div>
      <p class="eyebrow text-brand-green">Fields of work</p>
      <h2 id="work-fields-rail-title" class="sr-only">
        Visual production fields
      </h2>
    </div>
    <p
      class="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-brand-light/45"
    >
      Scroll to move · hover to read
    </p>
  </div>

  <div
    bind:this={viewport}
    class="rail-viewport overflow-x-auto md:overflow-hidden"
  >
    <div
      bind:this={track}
      class="rail-track flex w-max snap-x snap-mandatory gap-3 px-4 md:snap-none md:pr-12 md:pl-[max(1rem,calc((100vw-90rem)/2))]"
    >
      {#each workGalleryItems as item, index (item.id)}
        <article
          class="work-card relative w-[78vw] max-w-[30rem] shrink-0 snap-start overflow-hidden bg-brand-light/5 md:h-[calc(100svh-4.25rem)] md:w-[clamp(22rem,36vw,38rem)] md:max-w-none"
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
            <div
              class="flex items-center justify-between gap-4 font-mono text-[0.6rem] uppercase tracking-[0.15em]"
            >
              <span class="text-brand-green"
                >{String(index + 1).padStart(2, "0")}</span
              >
              <span class="text-brand-light/65">{item.category}</span>
            </div>
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
  .rail-viewport {
    scrollbar-width: none;
  }

  .rail-viewport::-webkit-scrollbar {
    display: none;
  }

  .work-card-image {
    transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
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
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(1rem);
    transition:
      max-height 550ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 350ms ease,
      transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .work-card:hover .work-card-image {
    transform: scale(1.025);
  }

  .work-card:hover .work-card-detail {
    max-height: 22rem;
    opacity: 1;
    transform: translateY(0);
  }

  @media (hover: none), (prefers-reduced-motion: reduce) {
    .work-card-detail {
      max-height: 22rem;
      opacity: 1;
      transform: none;
    }

    .work-card-image {
      transition: none;
    }
  }
</style>
