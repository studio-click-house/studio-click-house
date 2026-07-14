<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { workGalleryItems } from "$lib/content/home";

  const selectedProjects = workGalleryItems.slice(0, 3);

  let section: HTMLElement;
  let projectFrames: HTMLElement[] = [];
  let projectMedia: HTMLElement[] = [];
  let projectDetails: HTMLElement[] = [];
  let projectWords: HTMLElement[] = [];

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          () => {
            projectFrames.forEach((frame, index) => {
              const card = frame.closest(".project-card");
              const media = projectMedia[index];
              const details = projectDetails[index];
              if (!card || !media || !details) return;

              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: card,
                  start: "top 92%",
                  end: "bottom 8%",
                  scrub: 0.85,
                  invalidateOnRefresh: true,
                },
              });

              timeline
                .fromTo(
                  frame,
                  {
                    yPercent: index === 0 ? 10 : 14,
                    xPercent: index % 2 === 0 ? -6 : 6,
                    rotation: index % 2 === 0 ? -2.2 : 2.2,
                    scale: 0.94,
                  },
                  {
                    yPercent: -6,
                    xPercent: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 1,
                    ease: "none",
                  },
                  0,
                )
                .fromTo(
                  media,
                  {
                    xPercent: index % 2 === 0 ? 6 : -6,
                    yPercent: 6,
                    scale: 1.07,
                  },
                  {
                    xPercent: index % 2 === 0 ? -4 : 4,
                    yPercent: -6,
                    scale: 1.01,
                    duration: 1,
                    ease: "none",
                  },
                  0,
                )
                .fromTo(
                  details,
                  {
                    x: index % 2 === 0 ? 64 : -64,
                    y: 34,
                  },
                  {
                    x: 0,
                    y: -18,
                    duration: 1,
                    ease: "none",
                  },
                  0,
                );

              const word = projectWords[index];
              if (!word) return;

              gsap.fromTo(
                word,
                { xPercent: index % 2 === 0 ? -22 : 22 },
                {
                  xPercent: index % 2 === 0 ? 18 : -18,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 100%",
                    end: "bottom 0%",
                    scrub: 0.75,
                  },
                },
              );
            });
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
  class="overflow-hidden bg-brand-dark text-brand-light"
>
  <h2 id="selected-work-title" class="sr-only">Selected portfolio studies</h2>

  <div class="project-stage relative bg-brand-dark">
    <div class="project-stage-shell site-shell relative">
      <div
        class="stage-meta flex flex-wrap items-center justify-between gap-4 border-y border-brand-light/15 py-5 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-brand-light/50"
      >
        <span class="text-brand-green">Selected work</span>
        <span>Direction, resolved frame by frame</span>
        <a
          href={resolve("/portfolio")}
          class="group inline-flex items-center gap-2 text-brand-light transition-colors hover:text-brand-green"
        >
          Explore portfolio
          <ArrowUpRight
            size={14}
            class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      <div class="project-stack">
        {#each selectedProjects as project, index (project.id)}
          <article class="project-card border-b border-brand-light/12">
            <p
              bind:this={projectWords[index]}
              class="project-word pointer-events-none font-display italic tracking-[-0.05em] text-brand-light"
              aria-hidden="true"
            >
              {project.category}
            </p>

            <div class="project-layout">
              <figure
                bind:this={projectFrames[index]}
                class="project-print relative overflow-hidden border border-brand-light/20 bg-brand-dark shadow-2xl shadow-black/30 will-change-transform"
              >
                <img
                  bind:this={projectMedia[index]}
                  src={project.media.src}
                  alt={project.media.alt}
                  width={project.media.width}
                  height={project.media.height}
                  loading="lazy"
                  class="project-media object-cover will-change-transform"
                />
                <div
                  class="project-shade absolute inset-0"
                  aria-hidden="true"
                ></div>
                <figcaption
                  class="project-image-meta absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-brand-light/15 bg-brand-dark/60 px-4 py-3 font-mono text-[0.52rem] uppercase tracking-[0.14em] backdrop-blur-sm"
                >
                  <span class="text-brand-green">{project.category}</span>
                  <span class="text-brand-light/55">Finished study</span>
                </figcaption>
              </figure>

              <div
                bind:this={projectDetails[index]}
                class="project-copy border-t border-brand-light/20 pt-5 will-change-transform"
              >
                <p
                  class="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-brand-green"
                >
                  {project.category}
                </p>
                <h3
                  class="project-title mt-5 font-display leading-[0.92] tracking-[-0.035em]"
                >
                  {project.title}
                </h3>
                <p
                  class="mt-4 max-w-xl text-sm leading-relaxed text-brand-light/65 sm:text-base"
                >
                  {project.description}
                </p>
                <div class="mt-5 flex flex-wrap gap-2">
                  {#each project.tags as tag (tag)}
                    <span
                      class="border border-brand-light/25 px-3 py-1.5 font-mono text-[0.52rem] uppercase tracking-[0.13em] text-brand-light/70"
                      >{tag}</span
                    >
                  {/each}
                </div>
              </div>
            </div>
          </article>
        {/each}
      </div>

      <p
        class="stage-note py-6 text-right font-mono text-[0.54rem] uppercase tracking-[0.14em] text-brand-light/35"
      >
        Preview media · final client-approved case studies will replace these
        studies
      </p>
    </div>
  </div>
</section>

<style>
  .project-stage {
    background-image: radial-gradient(
      circle at 75% 45%,
      color-mix(in srgb, var(--color-brand-green) 10%, transparent),
      transparent 36%
    );
  }

  .project-card {
    position: relative;
    padding-block: 1.5rem 2.5rem;
  }

  .project-word {
    display: none;
  }

  .project-layout {
    display: grid;
    gap: 1.75rem;
  }

  .project-print {
    min-height: 28rem;
    aspect-ratio: 4 / 5;
  }

  .project-title {
    font-size: clamp(2.5rem, 11vw, 4.5rem);
  }

  .project-media {
    position: absolute;
    inset: -10%;
    width: 120%;
    height: 120%;
  }

  .project-shade {
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--color-brand-dark) 38%, transparent),
      transparent 30%,
      transparent
    );
  }

  @media (min-width: 640px) {
    .project-print {
      aspect-ratio: 4 / 3;
    }
  }

  @media (min-width: 1024px) {
    .project-card {
      min-height: min(78svh, 52rem);
      padding-block: clamp(2rem, 3.5vw, 3.75rem);
    }

    .project-card:first-child {
      padding-top: clamp(1rem, 2vw, 2rem);
    }

    .project-card + .project-card {
      margin-top: -3svh;
    }

    .project-layout {
      display: grid;
      min-height: min(70svh, 47rem);
      grid-template-columns: repeat(12, minmax(0, 1fr));
      align-items: center;
      gap: clamp(2rem, 4vw, 5rem);
    }

    .project-word {
      position: absolute;
      right: -0.04em;
      top: 8%;
      display: block;
      max-width: 76%;
      font-size: clamp(6rem, 11vw, 12rem);
      line-height: 0.72;
      text-align: right;
      opacity: 0.12;
      will-change: transform;
    }

    .project-card:nth-child(even) .project-word {
      right: auto;
      left: -0.04em;
      text-align: left;
    }

    .project-print {
      grid-column: 1 / span 7;
      width: 100%;
      height: min(66svh, 44rem);
      min-height: 0;
      aspect-ratio: auto;
    }

    .project-copy {
      z-index: 2;
      grid-column: 9 / -1;
      max-width: 24rem;
    }

    .project-title {
      font-size: clamp(2.75rem, 3.5vw, 4.25rem);
      text-wrap: balance;
    }

    .project-card:nth-child(even) .project-print {
      grid-column: 6 / -1;
    }

    .project-card:nth-child(even) .project-copy {
      grid-row: 1;
      grid-column: 1 / span 4;
    }
  }
</style>
