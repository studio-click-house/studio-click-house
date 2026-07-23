<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { showcaseProjects } from "$lib/content/home";

  let section: HTMLElement | null = null;
  let stage: HTMLElement | null = null;

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;
    let mediaContext: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !stage) return;

      const localSection = section;
      const localStage = stage;
      const { gsap, ScrollTrigger } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        mediaContext = media;

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const intro =
              localStage.querySelector<HTMLElement>(".showcase-intro");
            const panels = gsap.utils.toArray<HTMLElement>(".project-panel");
            const bodies = gsap.utils.toArray<HTMLElement>(".project-body");
            const mediaReveals = gsap.utils.toArray<HTMLElement>(
              ".project-media-reveal",
            );
            const mediaContents = gsap.utils.toArray<HTMLElement>(
              ".project-media-content",
            );
            const images = gsap.utils.toArray<HTMLElement>(".project-image");
            const revealLines = panels.map((panel) =>
              gsap.utils.toArray<HTMLElement>(".detail-reveal-inner", panel),
            );
            const projectLinks =
              gsap.utils.toArray<HTMLElement>(".project-link");

            if (!intro || panels.length === 0) return;

            const viewportWidth = () => window.innerWidth;
            const stageHeight = () => localStage.clientHeight;
            const initialPanelPositions = [0.5, 0.84, 0.94];
            const initialBodyOffsets = [0.2, 0.58, 0.8];

            panels.forEach((panel, index) => {
              gsap.set(panel, {
                x: () =>
                  viewportWidth() * (initialPanelPositions[index] ?? 0.94),
                zIndex: index + 2,
                force3D: true,
              });
              gsap.set(bodies[index], {
                y: () => stageHeight() * (initialBodyOffsets[index] ?? 0.8),
                force3D: true,
              });
              gsap.set(images[index], {
                scale: 1.015,
                transformOrigin: "center center",
                force3D: true,
              });
              gsap.set(mediaReveals[index], {
                scaleY: 0.6,
                transformOrigin: "top center",
                force3D: true,
              });
              gsap.set(mediaContents[index], {
                scaleY: 1 / 0.6,
                transformOrigin: "top center",
                force3D: true,
              });
              gsap.set(revealLines[index], {
                yPercent: 115,
                autoAlpha: 0,
                force3D: true,
              });
              gsap.set(projectLinks[index], { scale: 0, autoAlpha: 0 });
            });

            const timeline = gsap.timeline({
              defaults: { duration: 1, ease: "none" },
              scrollTrigger: {
                trigger: localSection,
                start: "top top+=70",
                end: () => `+=${stageHeight() * 2.85}`,
                pin: localStage,
                pinSpacing: true,
                scrub: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            timeline
              .to(intro, { xPercent: -100 }, 0)
              .to(panels[0], { x: 0 }, 0)
              .to(panels[1], { x: () => viewportWidth() * 0.666 }, 0)
              .to(panels[2], { x: () => viewportWidth() * 0.89 }, 0)
              .to(bodies[0], { y: 0, duration: 0.86, ease: "power1.out" }, 0.58)
              .to(
                mediaReveals[0],
                { scaleY: 1, duration: 0.86, ease: "power1.out" },
                0.62,
              )
              .to(
                mediaContents[0],
                { scaleY: 1, duration: 0.86, ease: "power1.out" },
                0.62,
              )
              .to(
                images[0],
                { scale: 1.045, duration: 0.9, ease: "power1.out" },
                0.62,
              )
              .to(
                revealLines[0],
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  stagger: 0.025,
                  duration: 0.3,
                  ease: "power3.out",
                },
                1.08,
              )
              .to(
                projectLinks[0],
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.22,
                  ease: "back.out(1.5)",
                },
                1.2,
              )
              .addLabel("secondProject", 1.44)
              .to(
                panels[0],
                { x: () => viewportWidth() * -0.666 },
                "secondProject",
              )
              .to(panels[1], { x: 0 }, "secondProject")
              .to(
                panels[2],
                { x: () => viewportWidth() * 0.666 },
                "secondProject",
              )
              .to(
                revealLines[0],
                {
                  yPercent: -115,
                  autoAlpha: 0,
                  stagger: 0.02,
                  duration: 0.24,
                  ease: "power2.in",
                },
                "secondProject",
              )
              .to(
                projectLinks[0],
                { scale: 0, autoAlpha: 0, duration: 0.2 },
                "secondProject",
              )
              .to(
                bodies[1],
                { y: 0, duration: 0.92, ease: "power1.out" },
                "secondProject+=0.32",
              )
              .to(
                mediaReveals[1],
                { scaleY: 1, duration: 0.92, ease: "power1.out" },
                "secondProject+=0.36",
              )
              .to(
                mediaContents[1],
                { scaleY: 1, duration: 0.92, ease: "power1.out" },
                "secondProject+=0.36",
              )
              .to(
                images[1],
                { scale: 1.045, duration: 0.96, ease: "power1.out" },
                "secondProject+=0.36",
              )
              .to(
                revealLines[1],
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  stagger: 0.025,
                  duration: 0.3,
                  ease: "power3.out",
                },
                "secondProject+=0.92",
              )
              .to(
                projectLinks[1],
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.22,
                  ease: "back.out(1.5)",
                },
                "secondProject+=1.04",
              )
              .addLabel("thirdProject", 2.72)
              .to(
                panels[1],
                { x: () => viewportWidth() * -0.666 },
                "thirdProject",
              )
              .to(panels[2], { x: 0 }, "thirdProject")
              .to(
                revealLines[1],
                {
                  yPercent: -115,
                  autoAlpha: 0,
                  stagger: 0.02,
                  duration: 0.24,
                  ease: "power2.in",
                },
                "thirdProject",
              )
              .to(
                projectLinks[1],
                { scale: 0, autoAlpha: 0, duration: 0.2 },
                "thirdProject",
              )
              .to(
                bodies[2],
                { y: 0, duration: 0.92, ease: "power1.out" },
                "thirdProject+=0.32",
              )
              .to(
                mediaReveals[2],
                { scaleY: 1, duration: 0.92, ease: "power1.out" },
                "thirdProject+=0.36",
              )
              .to(
                mediaContents[2],
                { scaleY: 1, duration: 0.92, ease: "power1.out" },
                "thirdProject+=0.36",
              )
              .to(
                images[2],
                { scale: 1.045, duration: 0.96, ease: "power1.out" },
                "thirdProject+=0.36",
              )
              .to(
                revealLines[2],
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  stagger: 0.025,
                  duration: 0.3,
                  ease: "power3.out",
                },
                "thirdProject+=0.92",
              )
              .to(
                projectLinks[2],
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.22,
                  ease: "back.out(1.5)",
                },
                "thirdProject+=1.04",
              )
              .to({}, { duration: 0.12 }, "thirdProject+=1.3");

            document.fonts.ready.then(() => {
              if (active) ScrollTrigger.refresh();
            });
          },
        );
      }, localSection);
    });

    return () => {
      active = false;
      mediaContext?.revert();
      context?.revert();
    };
  });
</script>

<section
  id="horizontal-projects-showcase"
  bind:this={section}
  aria-labelledby="showcase-title"
  class="relative bg-brand-dark"
>
  <h2 id="showcase-title" class="sr-only">Selected works</h2>

  <div
    bind:this={stage}
    class="project-stage relative h-[calc(100dvh_-_4.35rem)] overflow-hidden bg-brand-light"
  >
    <article
      class="showcase-intro absolute inset-y-0 left-0 z-[1] flex w-1/2 flex-col justify-between border-r border-brand-dark/15 bg-brand-light px-[clamp(1.5rem,3vw,3.5rem)] pb-[clamp(1.25rem,3vh,2rem)] pt-[clamp(2rem,5vh,3.5rem)] text-brand-dark"
    >
      <div>
        <p
          class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.24em] text-brand-dark/55"
        >
          Selected works · 2025–26
        </p>
        <h3
          class="mt-[clamp(2rem,5vh,3.5rem)] max-w-[8ch] font-display text-[clamp(3.6rem,6.8vw,7.75rem)] font-medium uppercase leading-[0.82] tracking-[-0.065em]"
        >
          Selected<br />work
        </h3>
        <p
          class="mt-[clamp(1.5rem,3vh,2.25rem)] max-w-[38rem] text-[clamp(0.82rem,1vw,1rem)] leading-[1.4] text-brand-dark/78"
        >
          From raw capture to finished campaign assets, every frame is shaped
          with restraint, precision, and a close eye for the detail that makes
          it believable.
        </p>
      </div>

      <div
        class="flex items-end justify-between gap-5 border-t border-brand-dark/25 pt-5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em]"
      >
        <span>Scroll to explore</span>
        <span>{String(showcaseProjects.length).padStart(2, "0")} projects</span>
      </div>
    </article>

    {#each showcaseProjects as project, index (project.id)}
      <article
        class="project-panel absolute inset-y-0 left-0 w-[66.6vw] overflow-hidden border-l border-brand-dark/15"
        style:background-color={project.bgColor}
        aria-labelledby="project-title-{project.id}"
      >
        <div class="project-body h-full w-full will-change-transform">
          <div class="project-media relative h-[70%] overflow-hidden">
            <div
              class="project-media-reveal absolute inset-0 origin-top overflow-hidden will-change-transform"
            >
              <div
                class="project-media-content relative h-full w-full origin-top will-change-transform"
              >
                <img
                  src={project.media.src}
                  alt={project.media.alt}
                  width={project.media.width}
                  height={project.media.height}
                  loading="lazy"
                  class="project-image h-full w-full object-cover object-center will-change-transform"
                />

                <div
                  class="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-[clamp(1rem,2vw,2rem)] font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-brand-light mix-blend-difference"
                >
                  <span>Studio Click House</span>
                  <span
                    >{String(index + 1).padStart(2, "0")} / {String(
                      showcaseProjects.length,
                    ).padStart(2, "0")}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div
            class="project-details relative flex h-[30%] flex-col px-[clamp(1.25rem,2.4vw,2.75rem)] py-[clamp(0.75rem,1.5vh,1.1rem)] text-brand-dark"
          >
            <div
              class="grid grid-cols-[auto_1fr_1.35fr] items-start gap-[clamp(1rem,3vw,4rem)] border-b border-brand-dark/20 pb-4"
            >
              <span
                class="detail-reveal rounded-full border border-brand-dark/50 px-3 py-1 font-mono text-[0.58rem] font-bold"
              >
                <span class="detail-reveal-inner block">{project.year}</span>
              </span>
              <p
                class="detail-reveal font-mono text-[0.58rem] font-bold uppercase tracking-[0.13em]"
              >
                <span class="detail-reveal-inner block">{project.category}</span
                >
              </p>
              <p
                class="detail-reveal max-w-[34ch] text-[clamp(0.72rem,0.85vw,0.9rem)] leading-[1.35]"
              >
                <span class="detail-reveal-inner block"
                  >{project.description}</span
                >
              </p>
            </div>

            <div
              class="flex flex-1 items-center justify-center px-20 text-center"
            >
              <h3
                id="project-title-{project.id}"
                class="detail-reveal pb-[0.08em] font-display text-[clamp(2.6rem,5vw,5.75rem)] font-medium leading-[0.8] tracking-[-0.06em]"
              >
                <span class="detail-reveal-inner block">{project.title}</span>
              </h3>
              <a
                href={project.href}
                class="project-link group absolute bottom-4 right-4 flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center rounded-full border border-brand-dark bg-brand-dark text-brand-light transition-colors duration-300 hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-dark"
                aria-label="View project {project.title}"
              >
                <ArrowUpRight
                  class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>

        <span
          class="pointer-events-none absolute bottom-4 left-4 z-[4] font-mono text-[0.6rem] font-bold text-brand-dark"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </article>
    {/each}
  </div>
</section>

<style>
  .showcase-intro,
  .project-panel,
  .project-body,
  .project-image,
  .project-details {
    will-change: transform;
  }

  .detail-reveal {
    overflow: hidden;
  }

  .detail-reveal-inner {
    will-change: transform;
  }

  @media (max-width: 767px) {
    #horizontal-projects-showcase {
      overflow: hidden;
      padding-block: 1rem;
    }

    .project-stage {
      display: flex;
      height: auto;
      width: 100%;
      gap: 0.75rem;
      overflow-x: auto;
      padding-inline: 1rem;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
    }

    .project-stage::-webkit-scrollbar {
      display: none;
    }

    .showcase-intro,
    .project-panel {
      position: relative;
      inset: auto;
      width: 88vw;
      min-width: 88vw;
      height: 82dvh;
      transform: none !important;
      scroll-snap-align: center;
    }

    .showcase-intro {
      padding: 4.5rem 1.5rem 1.5rem;
    }

    .showcase-intro h3 {
      margin-top: 3rem;
      font-size: clamp(4rem, 20vw, 6.5rem);
    }

    .project-body {
      transform: none !important;
    }

    .project-media {
      height: 52dvh;
    }

    .project-details {
      min-height: 30dvh;
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .detail-reveal-inner,
    .project-link {
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .project-details > :first-child {
      grid-template-columns: auto 1fr;
    }

    .project-details > :first-child p:last-child {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) and (min-width: 768px) {
    .project-stage {
      display: flex;
      width: 100%;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
    }

    .showcase-intro,
    .project-panel {
      position: relative;
      inset: auto;
      flex: 0 0 82vw;
      width: 82vw;
      transform: none !important;
      scroll-snap-align: start;
    }

    .showcase-intro {
      flex-basis: 50vw;
      width: 50vw;
    }

    .project-body,
    .project-details,
    .project-image {
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .detail-reveal-inner,
    .project-link {
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
  }
</style>
