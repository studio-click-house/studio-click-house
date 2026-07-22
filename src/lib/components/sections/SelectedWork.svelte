<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { workGalleryItems } from "$lib/content/home";

  const selectedProjects = workGalleryItems.slice(0, 3);

  let section: HTMLElement;
  let workHeader: HTMLElement;
  let scrollField: HTMLElement;
  let headingLines: HTMLElement[] = [];
  let projectEntries: HTMLElement[] = [];
  let projectPlates: HTMLElement[] = [];
  let projectImages: HTMLImageElement[] = [];
  let projectCopies: HTMLElement[] = [];
  let projectWords: HTMLElement[] = [];

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;

      const { gsap, ScrollTrigger } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(headingLines, {
            yPercent: 112,
            rotation: 2,
            duration: 1,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: {
              trigger: workHeader,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          });
        });

        media.add(
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          () => {
            projectEntries.forEach((entry, index) => {
              const plate = projectPlates[index];
              const image = projectImages[index];
              const copy = projectCopies[index];
              const word = projectWords[index];
              if (!plate || !image || !copy || !word) return;
              const titleWords = entry.querySelectorAll(".project-title-word");

              const direction = index % 2 === 0 ? 1 : -1;
              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: entry,
                  start: "top 88%",
                  end: "center 52%",
                  scrub: 0.55,
                  invalidateOnRefresh: true,
                },
              });

              timeline
                .fromTo(
                  plate,
                  {
                    xPercent: 7 * direction,
                    yPercent: 7,
                    rotation: 1.6 * direction,
                    scale: 0.96,
                  },
                  {
                    xPercent: 0,
                    yPercent: -3,
                    rotation: 0,
                    scale: 1,
                    duration: 1,
                    ease: "none",
                  },
                  0,
                )
                .fromTo(
                  image,
                  { xPercent: -3 * direction, yPercent: 6, scale: 1.12 },
                  {
                    xPercent: 2 * direction,
                    yPercent: -6,
                    scale: 1.03,
                    duration: 1,
                    ease: "none",
                  },
                  0,
                )
                .fromTo(
                  copy,
                  { x: -36 * direction, y: 24, autoAlpha: 0.45 },
                  {
                    x: 0,
                    y: -10,
                    autoAlpha: 1,
                    duration: 0.62,
                    ease: "none",
                  },
                  0.04,
                )
                .fromTo(
                  titleWords,
                  {
                    yPercent: 112,
                    rotation: (wordIndex) =>
                      (wordIndex % 2 === 0 ? -1.5 : 1.5) * direction,
                    scaleY: 0.84,
                    autoAlpha: 0.08,
                  },
                  {
                    yPercent: 0,
                    rotation: 0,
                    scaleY: 1,
                    autoAlpha: 1,
                    duration: 0.44,
                    stagger: 0.035,
                    ease: "none",
                  },
                  0.06,
                )
                .fromTo(
                  word,
                  { xPercent: -10 * direction, autoAlpha: 0.04 },
                  {
                    xPercent: 8 * direction,
                    autoAlpha: 0.1,
                    duration: 1,
                    ease: "none",
                  },
                  0,
                );
            });

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
  id="selected-work"
  bind:this={section}
  aria-labelledby="selected-work-title"
  class="selected-work overflow-clip bg-brand-paper text-brand-dark"
>
  <header bind:this={workHeader} class="work-header site-shell">
    <div class="work-header-line">
      <p class="eyebrow text-brand-green">Selected work</p>
      <p
        class="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-brand-dark/45"
      >
        Direction becomes proof
      </p>
    </div>

    <div class="work-heading-grid">
      <h2
        id="selected-work-title"
        class="font-display text-[clamp(4rem,9vw,10rem)] leading-[0.8] tracking-[-0.055em]"
      >
        <span class="work-title-line"
          ><span bind:this={headingLines[0]}>Decisions,</span></span
        >
        <span class="work-title-line"
          ><span bind:this={headingLines[1]} class="italic text-brand-green"
            >made visible.</span
          ></span
        >
      </h2>

      <a href={resolve("/portfolio")} class="portfolio-link group">
        <span>Explore portfolio</span>
        <ArrowUpRight
          size={17}
          class="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </a>
    </div>
  </header>

  <div bind:this={scrollField} class="work-scroll-field">
    <div class="work-stage site-shell">
      <div class="project-field">
        {#each selectedProjects as project, index (project.id)}
          <article bind:this={projectEntries[index]} class="project-entry">
            <p
              bind:this={projectWords[index]}
              class="project-word font-display italic"
              aria-hidden="true"
            >
              {project.category}
            </p>

            <figure bind:this={projectPlates[index]} class="project-plate">
              <img
                bind:this={projectImages[index]}
                src={project.media.src}
                alt={project.media.alt}
                width={project.media.width}
                height={project.media.height}
                loading="lazy"
                class="project-image"
              />
              <figcaption class="project-caption">
                <span class="caption-category">{project.category}</span>
                <span class="caption-index"
                  >Study / {String(index + 1).padStart(2, "0")}</span
                >
              </figcaption>
            </figure>

            <div bind:this={projectCopies[index]} class="project-copy">
              <p
                class="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-brand-green font-semibold"
              >
                Proof {String(index + 1).padStart(2, "0")} / {project.category}
              </p>
              <h3
                class="mt-5 font-display text-[clamp(2.8rem,4.5vw,5.4rem)] leading-[0.88] tracking-[-0.042em]"
              >
                {#each project.title.split(" ") as word, wordIndex (`${project.id}-${wordIndex}`)}
                  <span class="project-title-word-mask"
                    ><span class="project-title-word">{word}</span></span
                  >
                {/each}
              </h3>
              <p
                class="mt-6 max-w-md text-sm leading-relaxed text-brand-dark/75 sm:text-base"
              >
                {project.description}
              </p>
              <div class="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                {#each project.tags as tag (tag)}
                  <span class="project-tag">{tag}</span>
                {/each}
              </div>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>

  <footer class="work-footer site-shell">
    <p>
      Preview media · final client-approved case studies will replace these
      studies
    </p>
    <a href={resolve("/portfolio")} class="text-brand-green font-semibold">View all work ↗</a>
  </footer>
</section>

<style>
  .selected-work {
    position: relative;
  }

  .work-header {
    padding-block: 0 clamp(2rem, 4vw, 4rem);
  }

  .work-header-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-block: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 15%, transparent);
    padding-block: 1.1rem;
  }

  .work-heading-grid {
    display: grid;
    gap: 2.5rem;
    margin-top: clamp(2rem, 4vw, 4rem);
  }

  .work-title-line {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }

  .work-title-line > span {
    display: block;
    transform-origin: left bottom;
    will-change: transform;
  }

  .portfolio-link {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 1rem;
    align-self: end;
    border-bottom: 1px solid currentColor;
    padding-bottom: 0.55rem;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--color-brand-dark);
    transition: color 250ms ease;
  }

  .portfolio-link:hover {
    color: var(--color-brand-green);
  }

  .work-scroll-field,
  .work-stage {
    position: relative;
  }

  .project-field {
    display: grid;
  }

  .project-entry {
    position: relative;
    display: grid;
    gap: 2rem;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 14%, transparent);
    padding-block: 2rem 4rem;
  }

  .project-word {
    display: none;
  }

  .project-plate {
    position: relative;
    min-height: 32rem;
    overflow: hidden;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 15%, transparent);
    background: var(--color-brand-light);
  }

  .project-image {
    position: absolute;
    inset: -7%;
    width: 114%;
    height: 114%;
    object-fit: cover;
    will-change: transform;
  }

  .project-caption {
    position: absolute;
    inset: 0;
    pointer-events: none;
    font-family: var(--font-mono);
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.13em;
    color: color-mix(in srgb, var(--color-brand-light) 90%, transparent);
    text-shadow: 0 1px 14px var(--color-brand-dark);
  }

  .caption-category {
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .caption-category::before {
    width: 1.75rem;
    height: 1px;
    background: var(--color-brand-green);
    content: "";
  }

  .caption-index {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding-left: 0.55rem;
    border-left: 1px solid
      color-mix(in srgb, var(--color-brand-light) 45%, transparent);
    writing-mode: vertical-rl;
  }

  .project-title-word-mask {
    display: inline-block;
    overflow: hidden;
    margin-right: 0.18em;
    padding-bottom: 0.08em;
    vertical-align: bottom;
  }

  .project-title-word {
    display: block;
    transform-origin: left bottom;
    will-change: transform, opacity;
  }

  .project-copy {
    border-top: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 17%, transparent);
    padding-top: 1.75rem;
  }

  .project-tag {
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 22%, transparent);
    padding-bottom: 0.3rem;
    font-family: var(--font-mono);
    font-size: 0.52rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: color-mix(in srgb, var(--color-brand-dark) 65%, transparent);
  }

  .work-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    border-top: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 15%, transparent);
    padding-block: 1.5rem 3rem;
    font-family: var(--font-mono);
    font-size: 0.52rem;
    text-transform: uppercase;
    letter-spacing: 0.13em;
    color: color-mix(in srgb, var(--color-brand-dark) 55%, transparent);
  }

  @media (min-width: 640px) {
    .project-plate {
      min-height: 44rem;
    }
  }

  @media (min-width: 1024px) {
    .work-heading-grid {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
    }

    .project-entry {
      min-height: min(84svh, 54rem);
      grid-template-columns: repeat(12, minmax(0, 1fr));
      align-items: center;
      gap: clamp(2rem, 4vw, 5rem);
      padding-block: clamp(2.5rem, 5vw, 5rem);
    }

    .project-word {
      position: absolute;
      right: -0.03em;
      top: 12%;
      display: block;
      max-width: 78%;
      font-size: clamp(7rem, 12vw, 14rem);
      line-height: 0.7;
      text-align: right;
      letter-spacing: -0.055em;
      color: var(--color-brand-dark);
      opacity: 0.05;
      pointer-events: none;
      will-change: transform, opacity;
    }

    .project-plate {
      grid-column: 5 / -1;
      width: 100%;
      height: min(70svh, 47rem);
      min-height: 0;
      transform-origin: center;
      will-change: transform;
    }

    .project-copy {
      z-index: 2;
      grid-row: 1;
      grid-column: 1 / span 4;
      border-top: 0;
      padding-top: 0;
      will-change: transform, opacity;
    }

    .project-entry:nth-child(even) .project-word {
      right: auto;
      left: -0.03em;
      text-align: left;
    }

    .project-entry:nth-child(even) .project-plate {
      grid-column: 1 / span 8;
    }

    .project-entry:nth-child(even) .project-copy {
      grid-column: 9 / -1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .project-plate,
    .project-image,
    .project-copy,
    .project-word,
    .project-title-word {
      transform: none !important;
      opacity: 1 !important;
    }
  }
</style>
