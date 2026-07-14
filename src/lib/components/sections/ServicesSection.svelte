<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { services } from "$lib/content/home";

  let serviceGrid: HTMLOListElement;
  let serviceItems: HTMLElement[] = [];
  let serviceCards: HTMLAnchorElement[] = [];
  let serviceMedia: HTMLElement[] = [];
  let serviceCopy: HTMLElement[] = [];
  let serviceImages: HTMLImageElement[] = [];

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let revertMedia: (() => void) | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !serviceGrid) return;

      const { gsap } = runtime;
      const mediaContext = gsap.matchMedia();
      revertMedia = () => mediaContext.revert();

      context = gsap.context(() => {
        mediaContext.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.set(serviceCards, { autoAlpha: 0 });

          serviceItems.forEach((item, index) => {
            const card = serviceCards[index];
            const media = serviceMedia[index];
            const copy = serviceCopy[index];
            const image = serviceImages[index];
            if (!card || !media || !copy || !image) return;

            const reveal = gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                once: true,
                refreshPriority: -20,
              },
            });

            reveal
              .fromTo(
                card,
                { autoAlpha: 0, y: 38 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.85,
                  ease: "power3.out",
                },
              )
              .fromTo(
                media,
                {
                  scaleX: 0.72,
                  transformOrigin:
                    index % 2 === 0 ? "left center" : "right center",
                },
                {
                  scaleX: 1,
                  duration: 0.95,
                  ease: "power3.out",
                },
                0,
              )
              .fromTo(
                copy,
                { x: index % 2 === 0 ? 28 : -28 },
                { x: 0, duration: 0.85, ease: "power3.out" },
                0.08,
              );

            gsap.fromTo(
              image,
              { yPercent: -7, scale: 1.1 },
              {
                yPercent: 7,
                scale: 1.03,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.05,
                  refreshPriority: -20,
                },
              },
            );
          });
        });
      }, serviceGrid);
    });

    return () => {
      active = false;
      revertMedia?.();
      context?.revert();
    };
  });
</script>

<section
  id="studio-services"
  aria-labelledby="studio-services-title"
  class="section-space overflow-hidden bg-brand-light text-brand-dark"
>
  <div class="site-shell">
    <div
      class="grid gap-8 border-b border-brand-dark/15 pb-10 lg:grid-cols-[1fr_0.72fr] lg:items-end"
    >
      <div>
        <p class="eyebrow text-brand-green">Capabilities</p>
        <h2
          id="studio-services-title"
          class="mt-7 max-w-4xl text-balance font-display text-[clamp(3.5rem,6vw,6.5rem)] leading-[0.88] tracking-[-0.04em]"
        >
          Built around the image.
        </h2>
      </div>

      <div class="max-w-lg lg:justify-self-end">
        <p
          class="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-brand-dark/40"
        >
          Image production · eight capabilities
        </p>
        <p class="mt-4 text-sm leading-relaxed text-brand-dark/65 sm:text-base">
          Precise production services for clean assets, considered finishing,
          and consistent delivery across every frame.
        </p>
      </div>
    </div>

    <ol
      id="capabilities-service-list"
      bind:this={serviceGrid}
      class="service-grid mt-10 border-t border-brand-dark/15 lg:mt-14"
    >
      {#each services as service, index (service.slug)}
        <li
          bind:this={serviceItems[index]}
          class="service-item border-b border-brand-dark/15"
        >
          <a
            bind:this={serviceCards[index]}
            id={`capability-${service.slug}`}
            href={resolve("/services/[slug]", { slug: service.slug })}
            class="service-card group grid items-stretch focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
            aria-describedby={`service-description-${index}`}
          >
            <span
              bind:this={serviceMedia[index]}
              class="service-media relative block overflow-hidden bg-brand-paper"
            >
              <img
                bind:this={serviceImages[index]}
                src={service.media.src}
                alt={service.media.alt}
                width={service.media.width}
                height={service.media.height}
                loading="lazy"
                class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
              />
              <span
                class="absolute left-3 top-3 bg-brand-dark px-2.5 py-1.5 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-brand-light"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </span>

            <span
              bind:this={serviceCopy[index]}
              class="service-copy flex min-w-0 flex-col justify-between p-5 sm:p-6"
            >
              <span>
                <span
                  class="block font-mono text-[0.52rem] uppercase tracking-[0.15em] text-brand-green"
                >
                  Studio service
                </span>
                <span
                  class="service-title mt-3 block text-balance font-display text-[clamp(1.65rem,2.2vw,2.35rem)] leading-[0.98] tracking-[-0.025em]"
                >
                  {service.title}
                </span>
                <span
                  id={`service-description-${index}`}
                  class="mt-3 block max-w-sm text-[0.78rem] leading-relaxed text-brand-dark/55 sm:text-sm"
                >
                  {service.description}
                </span>
              </span>

              <span
                class="mt-5 flex items-center justify-between border-t border-brand-dark/12 pt-3 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-brand-dark/45"
              >
                View service
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  class="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </span>
          </a>
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .service-card {
    grid-template-columns: minmax(7.5rem, 36%) minmax(0, 1fr);
    min-height: 13rem;
  }

  .service-media img {
    will-change: transform;
  }

  .service-title {
    transition:
      color 250ms ease,
      transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .service-card:hover .service-title,
  .service-card:focus-visible .service-title {
    color: var(--color-brand-green);
    transform: translateX(0.25rem);
  }

  @media (min-width: 768px) {
    .service-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    }

    .service-item:nth-child(odd) {
      padding-right: clamp(1.25rem, 2.5vw, 3rem);
      border-right: 1px solid
        color-mix(in srgb, var(--color-brand-dark) 15%, transparent);
    }

    .service-item:nth-child(even) {
      padding-left: clamp(1.25rem, 2.5vw, 3rem);
    }

    .service-item:nth-child(4n + 2) .service-card,
    .service-item:nth-child(4n + 3) .service-card {
      grid-template-columns: minmax(0, 1fr) minmax(7.5rem, 36%);
    }

    .service-item:nth-child(4n + 2) .service-media,
    .service-item:nth-child(4n + 3) .service-media {
      order: 2;
    }

    .service-item:nth-child(4n + 2) .service-copy,
    .service-item:nth-child(4n + 3) .service-copy {
      order: 1;
    }
  }

  @media (min-width: 1280px) {
    .service-card {
      min-height: 15rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .service-title {
      transition: none;
    }
  }
</style>
