<script lang="ts">
  import { resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  interface ServiceStage {
    id: string;
    title: string;
    description: string;
    features: string[];
    actionLabel: string;
    actionHref: `/services/${string}`;
    image: string;
    imageAlt: string;
  }

  const stages: ServiceStage[] = [
    {
      id: "raw-capture",
      title: "Raw camera capture",
      description:
        "We begin with the untouched camera file: original lighting, flat colour, natural texture, and the full studio background still intact.",
      features: [
        "16-bit source workflow",
        "Original camera colour",
        "Untouched edge and skin detail",
      ],
      actionLabel: "View retouching",
      actionHref: "/services/image-editing",
      image: "/images/portfolio/model-raw.png",
      imageAlt:
        "Raw fashion studio capture before background removal and retouching",
    },
    {
      id: "clipping-path",
      title: "Precision clipping path",
      description:
        "An editor plots the silhouette point by point. The path follows the real garment, hands, hairline, and footwear instead of relying on an automatic cutout.",
      features: [
        "Hand-drawn Pen Tool path",
        "Garment and accessory cutouts",
        "Reusable vector path channels",
      ],
      actionLabel: "Explore clipping paths",
      actionHref: "/services/clipping-path",
      image: "/images/portfolio/model-clipping.png",
      imageAlt:
        "Fashion model with a blue Photoshop-style clipping path and anchor points",
    },
    {
      id: "background-isolation",
      title: "Clean subject isolation",
      description:
        "The traced subject is separated from the studio. Fine edges remain controlled while the image is prepared for transparent or clean white delivery.",
      features: [
        "Controlled hair and fabric edges",
        "Transparent PNG or TIFF",
        "Clean white e-commerce option",
      ],
      actionLabel: "See background removal",
      actionHref: "/services/background-removal",
      image: "/images/portfolio/model-isolated.png",
      imageAlt: "Fashion model cleanly isolated on a white background",
    },
    {
      id: "shadow-finish",
      title: "Shadow and final finish",
      description:
        "The full frame reveals how a restrained contact shadow grounds the model without making the composite feel artificial.",
      features: [
        "Natural contact shadow",
        "Balanced product-ready contrast",
        "Full-length edge review",
      ],
      actionLabel: "Explore shadow creation",
      actionHref: "/services/shadow-creation",
      image: "/images/portfolio/model-shadowed.png",
      imageAlt: "Finished retouched model with a soft natural contact shadow",
    },
    {
      id: "color-correction",
      title: "Fashion colour correction",
      description:
        "The final stage changes the ivory dress panels to a refined emerald green while preserving the original fabric folds, highlights, texture, and black construction.",
      features: [
        "Selective garment recolouring",
        "Original texture and folds preserved",
        "Consistent production-ready colour",
      ],
      actionLabel: "Explore colour correction",
      actionHref: "/services/color-correction",
      image: "/images/portfolio/model-color-corrected.png",
      imageAlt:
        "The same fashion model and dress with the ivory fabric corrected to emerald green",
    },
  ];

  let section: HTMLElement;
  let pinnedStage: HTMLElement;
  let activeIndex = $state(0);

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !pinnedStage) return;

      const { gsap, ScrollTrigger } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const navbar = document.querySelector<HTMLElement>(".site-header");
            const navbarHeight = () =>
              navbar?.getBoundingClientRect().height ?? 0;
            const syncViewport = () => {
              section.style.setProperty(
                "--breakdown-navbar-height",
                `${navbarHeight()}px`,
              );
              section.style.setProperty(
                "--breakdown-height",
                `${Math.max(560, window.innerHeight - navbarHeight())}px`,
              );
            };

            syncViewport();
            ScrollTrigger.addEventListener("refreshInit", syncViewport);

            const images = gsap.utils.toArray<HTMLElement>(
              ".breakdown-image-layer",
            );
            const panels = gsap.utils.toArray<HTMLElement>(
              ".breakdown-copy-panel",
            );
            const titleTexts = gsap.utils.toArray<HTMLElement>(
              ".breakdown-title-text",
            );
            const details = gsap.utils.toArray<HTMLElement>(
              ".breakdown-panel-details",
            );

            gsap.set(images, {
              autoAlpha: 0,
              clipPath: "inset(0% 0% 100% 0%)",
              scale: 1.025,
            });
            gsap.set(panels, { autoAlpha: 0 });
            gsap.set(titleTexts, {
              yPercent: 112,
              transformOrigin: "left bottom",
            });
            gsap.set(details, { autoAlpha: 0, y: 24 });
            gsap.set(images[0], {
              autoAlpha: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
            });
            gsap.set(panels[0], { autoAlpha: 1 });
            gsap.set(titleTexts[0], { yPercent: 0 });
            gsap.set(details[0], { autoAlpha: 1, y: 0 });

            const timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: () => `top ${navbarHeight()}px`,
                end: () => `+=${Math.max(window.innerHeight * 4.2, 3400)}`,
                pin: pinnedStage,
                pinSpacing: true,
                scrub: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  activeIndex = Math.min(
                    stages.length - 1,
                    Math.floor(self.progress * stages.length),
                  );
                },
              },
            });

            for (let index = 1; index < stages.length; index += 1) {
              const transitionStart = index - 0.25;

              timeline
                .set(
                  images[index],
                  {
                    autoAlpha: 1,
                    clipPath: "inset(0% 0% 100% 0%)",
                    scale: 1.025,
                  },
                  transitionStart,
                )
                .to(
                  images[index],
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.inOut",
                  },
                  transitionStart,
                )
                .set(images[index - 1], { autoAlpha: 0 }, transitionStart + 0.5)
                .to(
                  titleTexts[index - 1],
                  {
                    yPercent: -112,
                    duration: 0.3,
                    ease: "power2.in",
                  },
                  transitionStart,
                )
                .to(
                  details[index - 1],
                  {
                    autoAlpha: 0,
                    y: -18,
                    duration: 0.3,
                    ease: "power2.in",
                  },
                  transitionStart,
                )
                .set(panels[index], { autoAlpha: 1 }, transitionStart + 0.25)
                .fromTo(
                  titleTexts[index],
                  { yPercent: 112 },
                  {
                    yPercent: 0,
                    duration: 0.5,
                    ease: "power2.out",
                  },
                  transitionStart + 0.25,
                )
                .fromTo(
                  details[index],
                  { autoAlpha: 0, y: 24 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                  },
                  transitionStart + 0.25,
                );
            }

            timeline.to({}, { duration: 0.5 }, 4.5);
            ScrollTrigger.refresh();

            return () => {
              ScrollTrigger.removeEventListener("refreshInit", syncViewport);
              section.style.removeProperty("--breakdown-navbar-height");
              section.style.removeProperty("--breakdown-height");
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

<svelte:head>
  {#each stages as stage}
    <link rel="preload" as="image" href={stage.image} />
  {/each}
</svelte:head>

<section
  id="service-breakdown-rail"
  bind:this={section}
  aria-labelledby="service-breakdown-title"
  class="breakdown-section relative bg-brand-light text-brand-dark"
>
  <h2 id="service-breakdown-title" class="sr-only">
    Professional image post-production workflow
  </h2>

  <div bind:this={pinnedStage} class="breakdown-desktop">
    <div class="breakdown-grid site-shell">
      <figure class="breakdown-visual">
        <figcaption class="sr-only">
          Five stages of a professional fashion post-production workflow
        </figcaption>

        <div class="breakdown-image-frame">
          <div class="breakdown-image-stack">
            {#each stages as stage, index (stage.id)}
              <img
                src={stage.image}
                alt={index === activeIndex ? stage.imageAlt : ""}
                width="1024"
                height="1024"
                loading="eager"
                decoding="async"
                aria-hidden={index !== activeIndex}
                class="breakdown-image-layer"
              />
            {/each}
          </div>
        </div>
      </figure>

      <div class="breakdown-copy">
        <div class="breakdown-copy-stage">
          {#each stages as stage, index (stage.id)}
            <article
              aria-hidden={index !== activeIndex}
              class:pointer-events-none={index !== activeIndex}
              class="breakdown-copy-panel"
            >
              <h3 class="breakdown-title breakdown-title-mask">
                <span class="breakdown-title-text">{stage.title}</span>
              </h3>
              <div class="breakdown-panel-details">
                <p class="breakdown-description">{stage.description}</p>

                <ul class="breakdown-features">
                  {#each stage.features as feature}
                    <li>
                      <span aria-hidden="true"></span>
                      {feature}
                    </li>
                  {/each}
                </ul>

                <a
                  href={resolve(stage.actionHref)}
                  class="breakdown-link"
                  tabindex={index === activeIndex ? 0 : -1}
                >
                  {stage.actionLabel}
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </article>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <div class="breakdown-fallback site-shell">
    <div class="breakdown-fallback-heading">
      <h2 class="font-display text-5xl leading-[0.92] tracking-[-0.04em]">
        From camera file<br />
        <em class="text-brand-green">to final delivery.</em>
      </h2>
    </div>

    <div class="breakdown-fallback-list">
      {#each stages as stage (stage.id)}
        <article class="breakdown-fallback-stage">
          <figure>
            <img
              src={stage.image}
              alt={stage.imageAlt}
              width="1024"
              height="1024"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div>
            <h3
              class="font-display text-4xl leading-[0.95] tracking-[-0.035em]"
            >
              {stage.title}
            </h3>
            <p class="breakdown-description">{stage.description}</p>
            <ul class="breakdown-features">
              {#each stage.features as feature}
                <li>
                  <span aria-hidden="true"></span>
                  {feature}
                </li>
              {/each}
            </ul>
            <a href={resolve(stage.actionHref)} class="breakdown-link">
              {stage.actionLabel}
              <ArrowUpRight size={15} strokeWidth={1.7} aria-hidden="true" />
            </a>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .breakdown-desktop {
    display: none;
  }

  .breakdown-fallback {
    padding-block: 5rem;
  }

  .breakdown-fallback-heading {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 4rem;
  }

  .breakdown-fallback-list {
    display: grid;
    gap: 5rem;
  }

  .breakdown-fallback-stage {
    display: grid;
    gap: 2rem;
  }

  .breakdown-fallback-stage figure {
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border-radius: 1rem;
  }

  .breakdown-fallback-stage img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .breakdown-grid {
    display: grid;
    height: var(--breakdown-height, calc(100dvh - 4.35rem));
    min-height: 35rem;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: stretch;
  }

  .breakdown-visual {
    display: grid;
    min-width: 0;
    place-items: center;
    padding: clamp(1.5rem, 3vw, 3.5rem) clamp(1rem, 2.5vw, 3rem);
  }

  .breakdown-image-frame {
    position: relative;
    width: min(100%, calc((var(--breakdown-height, 44rem) - 5rem) * 0.75));
    max-height: calc(var(--breakdown-height, 44rem) - 5rem);
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border-radius: clamp(1rem, 1.6vw, 1.5rem);
    background: var(--color-brand-paper);
  }

  .breakdown-image-stack {
    position: absolute;
    inset: 0;
    will-change: transform;
  }

  .breakdown-image-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    will-change: clip-path, transform, opacity;
  }

  .breakdown-copy {
    display: flex;
    min-width: 0;
    flex-direction: column;
    padding: clamp(2.25rem, 4vw, 5rem) clamp(1.5rem, 5vw, 6rem)
      clamp(1.5rem, 3vw, 3.25rem) clamp(2rem, 5vw, 6rem);
  }

  .breakdown-copy-stage {
    position: relative;
    flex: 1;
    min-height: 25rem;
  }

  .breakdown-copy-panel {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    max-width: 36rem;
    transform: translateY(-50%);
  }

  .breakdown-title {
    max-width: 10ch;
    font-family: var(--font-display);
    font-size: clamp(3rem, 4.6vw, 5.5rem);
    line-height: 0.9;
    letter-spacing: -0.045em;
    text-wrap: balance;
  }

  .breakdown-title-mask {
    overflow: hidden;
    padding: 0 0.08em 0.16em;
    margin: 0 -0.08em -0.16em;
  }

  .breakdown-title-text {
    display: block;
    will-change: transform;
  }

  .breakdown-panel-details {
    will-change: transform, opacity;
  }

  .breakdown-description {
    max-width: 34rem;
    margin-top: 1.75rem;
    font-size: clamp(0.86rem, 1.15vw, 1rem);
    line-height: 1.65;
    color: color-mix(in srgb, var(--color-brand-dark) 72%, transparent);
  }

  .breakdown-features {
    display: grid;
    gap: 0.6rem;
    margin-top: 1.35rem;
  }

  .breakdown-features li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.63rem;
    letter-spacing: 0.045em;
    color: color-mix(in srgb, var(--color-brand-dark) 82%, transparent);
  }

  .breakdown-features li > span {
    width: 0.34rem;
    height: 0.34rem;
    flex: none;
    border-radius: 999px;
    background: var(--color-brand-green);
  }

  .breakdown-link {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    margin-top: 1.75rem;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 38%, transparent);
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition:
      gap 240ms ease,
      color 240ms ease,
      border-color 240ms ease;
  }

  .breakdown-link:hover {
    gap: 0.95rem;
    border-color: var(--color-brand-green);
    color: var(--color-brand-green);
  }

  @media (min-width: 48rem) and (prefers-reduced-motion: no-preference) {
    .breakdown-desktop {
      display: block;
      height: var(--breakdown-height, calc(100dvh - 4.35rem));
      min-height: 35rem;
      overflow: hidden;
      background: var(--color-brand-light);
    }

    .breakdown-fallback {
      display: none;
    }
  }

  @media (min-width: 48rem) and (max-height: 48rem) {
    .breakdown-copy {
      padding-block: 1.75rem;
    }

    .breakdown-copy-stage {
      min-height: 22rem;
    }

    .breakdown-title {
      font-size: clamp(2.7rem, 4vw, 4.4rem);
    }

    .breakdown-description {
      margin-top: 1.15rem;
      font-size: 0.82rem;
    }

    .breakdown-features {
      margin-top: 1rem;
    }

    .breakdown-link {
      margin-top: 1.2rem;
    }
  }

  @media (min-width: 40rem) and (max-width: 47.999rem),
    (min-width: 48rem) and (prefers-reduced-motion: reduce) {
    .breakdown-fallback-stage {
      grid-template-columns: minmax(14rem, 0.8fr) minmax(0, 1fr);
      align-items: center;
      gap: 3rem;
    }
  }

  @media (max-width: 39.999rem) {
    .breakdown-fallback {
      padding-block: 4rem;
    }

    .breakdown-fallback-list {
      gap: 4rem;
    }

    .breakdown-fallback-stage figure {
      max-height: 70svh;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .breakdown-image-stack,
    .breakdown-image-layer,
    .breakdown-title-text,
    .breakdown-panel-details {
      will-change: auto;
    }
  }
</style>
