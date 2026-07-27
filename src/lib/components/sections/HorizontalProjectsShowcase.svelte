<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { showcaseProjects, workGalleryItems } from "$lib/content/home";

  let section: HTMLElement | null = null;
  let stage: HTMLElement | null = null;
  let workFieldsTrack: HTMLElement | null = null;
  let introVideo = $state<HTMLVideoElement | null>(null);

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;
    let mediaContext: { revert: () => void } | undefined;
    let videoObserver: IntersectionObserver | undefined;
    let lastPointerX = -1;
    let lastPointerY = -1;
    let activeHoverCard: HTMLElement | null = null;

    const syncHoverToPointer = () => {
      if (lastPointerX < 0 || !workFieldsTrack) return;

      const elementUnderPointer = document.elementFromPoint(
        lastPointerX,
        lastPointerY,
      );
      const cardUnderPointer =
        elementUnderPointer instanceof Element
          ? elementUnderPointer.closest<HTMLElement>(".work-card")
          : null;

      if (cardUnderPointer === activeHoverCard) return;

      activeHoverCard?.classList.remove("is-scroll-hover");
      if (cardUnderPointer && workFieldsTrack.contains(cardUnderPointer)) {
        cardUnderPointer.classList.add("is-scroll-hover");
        activeHoverCard = cardUnderPointer;
      } else {
        activeHoverCard = null;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      syncHoverToPointer();
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (!introVideo) return;
      if (e.matches) {
        introVideo.pause();
      } else if (
        !("IntersectionObserver" in window) ||
        (videoObserver && section)
      ) {
        void introVideo.play().catch(() => {});
      }
    };
    prefersReducedMotion.addEventListener("change", handleMotionChange);

    // Initial check for video playback
    if (introVideo) {
      if (prefersReducedMotion.matches) {
        introVideo.pause();
      } else if ("IntersectionObserver" in window && section) {
        videoObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !prefersReducedMotion.matches) {
              void introVideo?.play().catch(() => {});
            } else {
              introVideo?.pause();
            }
          },
          { rootMargin: "100px 0px", threshold: 0.05 },
        );
        videoObserver.observe(section);
      } else {
        void introVideo.play().catch(() => {});
      }
    }

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
            const localWorkFieldsTrack =
              localStage.querySelector<HTMLElement>(".work-fields-track");

            if (!intro || panels.length === 0 || !localWorkFieldsTrack) return;

            const viewportWidth = () => window.innerWidth;
            const stageHeight = () => localStage.clientHeight;
            const workFieldsDistance = () =>
              Math.max(0, localWorkFieldsTrack.scrollWidth - viewportWidth());
            const initialPanelPositions = [0.53, 0.84, 0.94];
            const initialBodyOffsets = [0.2, 0.58, 0.8];

            ScrollTrigger.getById("horizontal-projects-entry")?.kill();
            ScrollTrigger.getById("horizontal-projects-handoff")?.kill();
            ScrollTrigger.getById("horizontal-projects-pin")?.kill();

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

            gsap.set([intro, ...panels], {
              yPercent: 0,
              autoAlpha: 1,
            });
            gsap.set(localWorkFieldsTrack, {
              x: () => viewportWidth(),
              autoAlpha: 1,
              force3D: true,
            });
            const timeline = gsap.timeline({
              defaults: { duration: 1, ease: "none" },
              scrollTrigger: {
                id: "horizontal-projects-pin",
                trigger: localSection,
                start: "top top+=70",
                end: () =>
                  `+=${stageHeight() * 2.5 + localWorkFieldsTrack.scrollWidth}`,
                pin: localSection,
                pinSpacing: true,
                scrub: true,
                anticipatePin: 1,
                refreshPriority: 100,
                invalidateOnRefresh: true,
                onUpdate: syncHoverToPointer,
              },
            });

            timeline
              .to(intro, { xPercent: -100 }, 0)
              .to(panels[0], { x: 0 }, 0)
              .to(panels[1], { x: () => viewportWidth() * 0.666 }, 0)
              .to(panels[2], { x: () => viewportWidth() * 0.89 }, 0)
              .to(bodies[0], { y: 0, duration: 0.5, ease: "power1.out" }, 0.25)
              .to(
                mediaReveals[0],
                { scaleY: 1, duration: 0.5, ease: "power1.out" },
                0.28,
              )
              .to(
                mediaContents[0],
                { scaleY: 1, duration: 0.5, ease: "power1.out" },
                0.28,
              )
              .to(
                images[0],
                { scale: 1.045, duration: 0.5, ease: "power1.out" },
                0.28,
              )
              .to(
                revealLines[0],
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  stagger: 0.02,
                  duration: 0.3,
                  ease: "power3.out",
                },
                0.3,
              )
              .to(
                projectLinks[0],
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.2,
                  ease: "back.out(1.5)",
                },
                0.36,
              )
              .addLabel("secondProject", 0.75)
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
                  stagger: 0.015,
                  duration: 0.2,
                  ease: "power2.in",
                },
                "secondProject",
              )
              .to(
                projectLinks[0],
                { scale: 0, autoAlpha: 0, duration: 0.18 },
                "secondProject",
              )
              .to(
                bodies[1],
                { y: 0, duration: 0.5, ease: "power1.out" },
                "secondProject+=0.1",
              )
              .to(
                mediaReveals[1],
                { scaleY: 1, duration: 0.5, ease: "power1.out" },
                "secondProject+=0.14",
              )
              .to(
                mediaContents[1],
                { scaleY: 1, duration: 0.5, ease: "power1.out" },
                "secondProject+=0.14",
              )
              .to(
                images[1],
                { scale: 1.045, duration: 0.5, ease: "power1.out" },
                "secondProject+=0.14",
              )
              .to(
                revealLines[1],
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  stagger: 0.02,
                  duration: 0.3,
                  ease: "power3.out",
                },
                "secondProject+=0.16",
              )
              .to(
                projectLinks[1],
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.2,
                  ease: "back.out(1.5)",
                },
                "secondProject+=0.22",
              )
              .addLabel("thirdProject", "secondProject+=0.65")
              .to(
                panels[1],
                { x: () => viewportWidth() * -0.666 },
                "thirdProject",
              )
              .to(panels[2], { x: 0 }, "thirdProject")
              .to(
                localWorkFieldsTrack,
                { x: () => viewportWidth() * 0.666 },
                "thirdProject",
              )
              .to(
                revealLines[1],
                {
                  yPercent: -115,
                  autoAlpha: 0,
                  stagger: 0.015,
                  duration: 0.2,
                  ease: "power2.in",
                },
                "thirdProject",
              )
              .to(
                projectLinks[1],
                { scale: 0, autoAlpha: 0, duration: 0.18 },
                "thirdProject",
              )
              .to(
                bodies[2],
                { y: 0, duration: 0.5, ease: "power1.out" },
                "thirdProject+=0.1",
              )
              .to(
                mediaReveals[2],
                { scaleY: 1, duration: 0.5, ease: "power1.out" },
                "thirdProject+=0.14",
              )
              .to(
                mediaContents[2],
                { scaleY: 1, duration: 0.5, ease: "power1.out" },
                "thirdProject+=0.14",
              )
              .to(
                images[2],
                { scale: 1.045, duration: 0.5, ease: "power1.out" },
                "thirdProject+=0.14",
              )
              .to(
                revealLines[2],
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  stagger: 0.02,
                  duration: 0.3,
                  ease: "power3.out",
                },
                "thirdProject+=0.16",
              )
              .to(
                projectLinks[2],
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.2,
                  ease: "back.out(1.5)",
                },
                "thirdProject+=0.22",
              )
              .addLabel("workFields", "thirdProject+=1.05")
              .to(
                panels[2],
                {
                  x: () => viewportWidth() * -0.666,
                  duration: 0.9,
                  ease: "none",
                },
                "workFields",
              )
              .to(
                localWorkFieldsTrack,
                {
                  x: 0,
                  duration: 0.9,
                  ease: "none",
                  force3D: true,
                },
                "workFields",
              )
              .to(
                localWorkFieldsTrack,
                {
                  x: () => -workFieldsDistance(),
                  duration: 1.9,
                  ease: "none",
                  force3D: true,
                },
                "workFields+=0.9",
              );

            document.fonts.ready.then(() => {
              if (!active) return;
              ScrollTrigger.sort();
              ScrollTrigger.refresh();
            });
          },
        );
      }, localSection);
    });

    return () => {
      active = false;
      prefersReducedMotion.removeEventListener("change", handleMotionChange);
      window.removeEventListener("pointermove", handlePointerMove);
      activeHoverCard?.classList.remove("is-scroll-hover");
      videoObserver?.disconnect();
      mediaContext?.revert();
      context?.revert();
    };
  });
</script>

<section
  id="horizontal-projects-showcase"
  bind:this={section}
  aria-labelledby="showcase-title"
  class="relative isolate bg-brand-dark"
>
  <h2 id="showcase-title" class="sr-only">Our services</h2>

  <div
    bind:this={stage}
    class="project-stage relative h-[calc(100dvh_-_4.35rem)] overflow-hidden bg-brand-paper"
  >
    <article
      class="showcase-intro absolute inset-y-0 left-0 z-[1] flex w-[53%] flex-col justify-between border-r border-brand-dark/15 bg-brand-paper px-[clamp(1.5rem,3vw,3.5rem)] pb-[clamp(1.25rem,3vh,2rem)] pt-[clamp(2rem,5vh,3.5rem)] text-brand-light overflow-hidden"
    >
      <!-- Background Video playing editing workflow, full opacity for rich colors -->
      <div class="absolute inset-0 z-0 opacity-100 pointer-events-none">
        <video
          bind:this={introVideo}
          muted
          loop
          playsinline
          preload="metadata"
          class="h-full w-full object-cover"
        >
          <source src="/videos/editing_video.mp4" type="video/mp4" />
        </video>
        <!-- Dark gradient overlay to pop the white text -->
        <div
          class="absolute inset-0 bg-brand-dark/45 z-10"
          aria-hidden="true"
        ></div>
      </div>

      <div class="relative z-10">
        <p
          class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.24em] text-brand-light/60"
        >
          Studio capabilities
        </p>
        <h3
          class="mt-[clamp(2rem,5vh,3.5rem)] max-w-[8ch] font-display text-[clamp(3.6rem,6.8vw,7.75rem)] font-medium uppercase leading-[0.82] tracking-[-0.065em] text-brand-light"
        >
          Our<br />services
        </h3>
        <p
          class="mt-[clamp(1.5rem,3vh,2.25rem)] max-w-[38rem] text-[clamp(0.82rem,1vw,1rem)] leading-[1.4] text-brand-light/80"
        >
          One production partner for polished stills, considered motion, and
          believable 3D imagery—built around the needs of each project.
        </p>
      </div>

      <div
        class="relative z-10 flex items-end justify-between gap-5 border-t border-brand-light/20 pt-5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-brand-light/90"
      >
        <span>Scroll to explore</span>
        <span>{String(showcaseProjects.length).padStart(2, "0")} services</span>
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
                {#if project.media.kind === "video"}
                  <video
                    src={project.media.src}
                    poster={project.media.poster}
                    width={project.media.width}
                    height={project.media.height}
                    autoplay
                    muted
                    loop
                    playsinline
                    preload="metadata"
                    aria-label={project.media.alt}
                    class="project-image h-full w-full object-cover object-center will-change-transform"
                  ></video>
                {:else}
                  <img
                    src={project.media.src}
                    alt={project.media.alt}
                    width={project.media.width}
                    height={project.media.height}
                    loading="lazy"
                    class="project-image h-full w-full object-cover object-center will-change-transform"
                  />
                {/if}

                <div
                  class="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-end p-[clamp(1rem,2vw,2rem)] font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-brand-light mix-blend-difference"
                >
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
                href={resolve(project.href as "/services")}
                class="project-link group absolute bottom-4 right-4 flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center rounded-full border border-brand-dark bg-brand-dark text-brand-light transition-colors duration-300 hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-dark"
                aria-label="Explore {project.title} services"
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

    <div
      id="work-fields-rail"
      bind:this={workFieldsTrack}
      class="work-fields-track absolute inset-y-0 left-0 z-20 flex w-max gap-3 bg-brand-dark"
      aria-labelledby="work-fields-rail-title"
    >
      <h2 id="work-fields-rail-title" class="sr-only">
        Visual production fields
      </h2>

      {#each workGalleryItems as item (item.id)}
        <article
          class="work-card relative h-full w-[clamp(22rem,36vw,38rem)] shrink-0 overflow-hidden border border-brand-light/10 bg-brand-light/5"
        >
          <img
            src={item.media.src}
            alt={item.media.alt}
            width={item.media.width}
            height={item.media.height}
            loading="lazy"
            class="work-card-image h-full w-full object-cover"
          />
          <div
            class="work-card-shade absolute inset-0"
            aria-hidden="true"
          ></div>
          <div class="work-card-copy absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div class="work-card-detail">
              <h3
                class="mt-5 max-w-sm font-display text-3xl leading-[0.95] tracking-[-0.025em] text-brand-light sm:text-4xl"
              >
                {item.title}
              </h3>
              <p
                class="mt-4 max-w-sm text-sm leading-relaxed text-brand-light/80"
              >
                {item.description}
              </p>
              <ul class="mt-5 flex flex-wrap gap-2" aria-label="Work tags">
                {#each item.tags as tag (tag)}
                  <li
                    class="border border-brand-light/25 px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-brand-light/80"
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

  .work-fields-track {
    will-change: transform;
  }

  .work-card-image {
    transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .work-card-shade {
    background: linear-gradient(
      to top,
      rgba(18, 17, 17, 0.92),
      rgba(18, 17, 17, 0.3) 62%,
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

  .work-card:hover .work-card-image,
  .work-card:global(.is-scroll-hover) .work-card-image {
    transform: scale(1.06);
  }

  .work-card:hover .work-card-detail,
  .work-card:global(.is-scroll-hover) .work-card-detail {
    transform: translateY(0);
    visibility: visible;
    transition-delay: 0s;
  }

  .work-card:hover .work-card-detail > *,
  .work-card:global(.is-scroll-hover) .work-card-detail > * {
    opacity: 1;
    transform: translateY(0);
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

    .work-fields-track {
      position: relative;
      inset: auto;
      z-index: auto;
      height: 82dvh;
      flex: 0 0 auto;
      transform: none !important;
      will-change: auto;
    }

    .work-card {
      width: 88vw;
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

    .work-fields-track {
      position: relative;
      inset: auto;
      z-index: auto;
      height: 100%;
      flex: 0 0 auto;
      transform: none !important;
      will-change: auto;
    }

    .work-card {
      width: 82vw;
      scroll-snap-align: start;
    }

    .showcase-intro {
      flex-basis: 53vw;
      width: 53vw;
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

  @media (hover: none), (prefers-reduced-motion: reduce) {
    .work-card-detail {
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
