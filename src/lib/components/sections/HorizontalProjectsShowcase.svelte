<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { showcaseProjects, workGalleryItems } from "$lib/content/home";
  import type {
    PreviewMedia,
    ShowcaseProjectMedia,
    WorkGalleryItem,
  } from "$lib/types/content";

  const finalShowcaseProject = showcaseProjects.at(-1);
  type WorkFieldSectionItem = Omit<WorkGalleryItem, "media"> & {
    media: ShowcaseProjectMedia;
  };

  const workFieldLandscapeMedia: Record<string, PreviewMedia> = {
    "product-finishing": {
      src: "/images/work-fields/gallery/product-retouching.jpg",
      alt: "Perfume bottle photographed with controlled liquid movement for product retouching",
      width: 1600,
      height: 900,
      credit: "Temporary preview photo by Bolarinwa Olasunkanmi via Pexels",
    },
    "beauty-detail": {
      src: "/images/work-fields/gallery/beauty-retouching.jpg",
      alt: "Makeup artist refining a model's complexion in a controlled studio",
      width: 1600,
      height: 900,
      credit: "Temporary preview photo by Angel Rondon via Pexels",
    },
    "fashion-color": {
      src: "/images/work-fields/gallery/fashion-color.jpg",
      alt: "Fashion model wearing saturated red and green styling during a studio shoot",
      width: 1600,
      height: 900,
      credit: "Temporary preview photo by Gustavo Denuncio via Pexels",
    },
    "jewelry-detail": {
      src: "/images/work-fields/gallery/jewelry-retouching.jpg",
      alt: "Pearl and gold jewelry arranged with beauty products for detailed finishing",
      width: 1600,
      height: 900,
      credit: "Temporary preview photo by Misolo Cosmetic via Pexels",
    },
    "shadow-study": {
      src: "/images/work-fields/gallery/product-composition.jpg",
      alt: "Golden perfume bottle composed with directional natural shadows",
      width: 1600,
      height: 900,
      credit: "Temporary preview photo by Khulood Abdulghani via Pexels",
    },
  };
  const withImageKind = (item: WorkGalleryItem): WorkFieldSectionItem => ({
    ...item,
    media: {
      ...(workFieldLandscapeMedia[item.id] ?? item.media),
      kind: "image",
    },
  });
  const workFieldDemoItem: WorkFieldSectionItem = {
    id: "commercial-video-editing",
    category: "Commercial video editing",
    title: "Movement shaped for product and campaign stories.",
    description:
      "A temporary studio-production reel representing commercial editing, pacing, color, and delivery for branded video.",
    tags: ["Video", "Editing"],
    media: {
      kind: "video",
      src: "/videos/work-fields-studio-production.mp4",
      poster: "/images/work-fields/studio-production-poster.jpg",
      alt: "Photographer producing commercial product imagery in a studio",
      width: 1920,
      height: 1080,
      credit: "Temporary demo footage via Mixkit",
    },
  };
  const workFieldGalleryItems = [
    ...workGalleryItems.slice(0, 2).map(withImageKind),
    workFieldDemoItem,
    ...workGalleryItems.slice(2).map(withImageKind),
  ];
  const workFieldServiceLabels: Record<string, string> = {
    "product-finishing": "Product retouching",
    "beauty-detail": "Beauty retouching",
    "commercial-video-editing": "Commercial video editing",
    "fashion-color": "Fashion color correction",
    "jewelry-detail": "Jewelry retouching",
    "shadow-study": "Product image composition",
  };
  const workFieldServiceSlugs: Record<string, string> = {
    "product-finishing": "ecommerce-retouching",
    "beauty-detail": "editorial-retouching",
    "commercial-video-editing": "commercial-editing",
    "fashion-color": "color-correction",
    "jewelry-detail": "jewelry-retouching",
    "shadow-study": "ecommerce-retouching",
  };
  const workFieldItems =
    finalShowcaseProject?.media.kind === "image"
      ? [
          {
            ...workGalleryItems[0],
            id: `showcase-handoff-${finalShowcaseProject.id}`,
            title: finalShowcaseProject.title,
            category: finalShowcaseProject.category,
            description: finalShowcaseProject.description,
            tags: ["3D", "CGI"],
            media: finalShowcaseProject.media,
          },
          ...workFieldGalleryItems,
        ]
      : workFieldGalleryItems;

  let section: HTMLElement | null = null;
  let stage: HTMLElement | null = null;
  let workFieldsTrack: HTMLElement | null = null;
  let introVideo = $state<HTMLVideoElement | null>(null);

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;
    let videoObserver: IntersectionObserver | undefined;

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
            const localWorkFieldsStage =
              localStage.querySelector<HTMLElement>(".work-fields-track");
            const workFieldsMediaTrack = localStage.querySelector<HTMLElement>(
              ".work-fields-media-track",
            );
            const workFieldsMediaViewport =
              localStage.querySelector<HTMLElement>(
                ".work-fields-media-viewport",
              );
            const workFieldsMediaExitWash =
              localStage.querySelector<HTMLElement>(
                ".work-fields-media-exit-wash",
              );
            const workFieldsCopy =
              localStage.querySelector<HTMLElement>(".work-fields-copy");
            const workFieldsIntroPanel = localStage.querySelector<HTMLElement>(
              ".work-fields-intro-panel",
            );
            const workFieldsIntroLines = gsap.utils.toArray<HTMLElement>(
              ".work-fields-intro-inner",
            );
            const handoffMedia = localStage.querySelector<HTMLElement>(
              ".work-field-handoff-media",
            );
            const handoffSlide = localStage.querySelector<HTMLElement>(
              ".work-field-handoff-slide",
            );
            const handoffDetails = localStage.querySelector<HTMLElement>(
              ".work-field-handoff-details",
            );
            const handoffCounter = localStage.querySelector<HTMLElement>(
              ".work-field-handoff-counter",
            );
            const workFieldImages =
              gsap.utils.toArray<HTMLElement>(".work-field-image");
            const workFieldProgressItems = gsap.utils.toArray<HTMLElement>(
              ".work-field-progress-item",
            );

            if (
              !intro ||
              panels.length === 0 ||
              !localWorkFieldsStage ||
              !workFieldsMediaTrack ||
              !workFieldsMediaViewport ||
              !workFieldsMediaExitWash ||
              !workFieldsCopy ||
              !workFieldsIntroPanel ||
              !handoffMedia ||
              !handoffSlide ||
              !handoffDetails ||
              !handoffCounter ||
              workFieldProgressItems.length === 0
            ) {
              return;
            }

            const viewportWidth = () => window.innerWidth;
            const stageHeight = () => localStage.clientHeight;
            const workFieldCardRatio = 0.48;
            const workFieldTrackSteps = Math.max(
              1,
              workFieldItems.length - 1 / workFieldCardRatio,
            );
            const workFieldTrackStepDuration = 0.42;
            const workFieldTrackDuration =
              workFieldTrackSteps * workFieldTrackStepDuration;
            const firstWorkFieldProgressTime = 1.05;
            const lastWorkFieldProgressTime =
              0.9 + workFieldTrackDuration - 0.2;
            const workFieldProgressInterval =
              (lastWorkFieldProgressTime - firstWorkFieldProgressTime) /
              Math.max(1, workFieldGalleryItems.length - 1);
            const initialPanelPositions = [0.53, 0.84, 0.94];
            const initialBodyOffsets = [0.34, 0.52, 0.62];

            ScrollTrigger.getById("horizontal-projects-entry")?.kill(true);
            ScrollTrigger.getById("horizontal-projects-handoff")?.kill(true);
            ScrollTrigger.getById("horizontal-projects-pin")?.kill(true);

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
                scale: 1.12,
                transformOrigin: "center center",
                force3D: true,
              });
              gsap.set(mediaReveals[index], {
                scaleY: 0.68,
                transformOrigin: "top center",
                force3D: true,
              });
              gsap.set(mediaContents[index], {
                scaleY: 1 / 0.68,
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
            gsap.set(localWorkFieldsStage, {
              x: 0,
              autoAlpha: 0,
              force3D: true,
            });
            gsap.set(workFieldsMediaTrack, {
              y: 0,
              force3D: true,
            });
            gsap.set(workFieldsMediaViewport, {
              width: "66.6%",
            });
            gsap.set(workFieldsMediaExitWash, { autoAlpha: 0 });
            gsap.set(handoffDetails, {
              top: "70%",
              autoAlpha: 1,
            });
            gsap.set(workFieldsCopy, {
              x: () => viewportWidth() / 3,
              force3D: true,
            });
            gsap.set(workFieldImages, {
              scale: 1.02,
              transformOrigin: "center center",
              force3D: true,
            });
            gsap.set(workFieldsIntroPanel, { autoAlpha: 1 });
            gsap.set(workFieldsIntroLines, {
              yPercent: 115,
              autoAlpha: 0,
              force3D: true,
            });
            gsap.set(workFieldProgressItems, {
              y: 12,
              autoAlpha: 0,
              force3D: true,
            });

            const timeline = gsap.timeline({
              defaults: { duration: 1, ease: "none" },
              scrollTrigger: {
                id: "horizontal-projects-pin",
                trigger: localSection,
                start: "top top+=70",
                end: () =>
                  `+=${stageHeight() * (3.9 + workFieldTrackSteps * 0.48)}`,
                pin: localStage,
                pinSpacing: true,
                scrub: true,
                anticipatePin: 1,
                refreshPriority: 100,
                invalidateOnRefresh: true,
              },
            });

            timeline
              .to(intro, { xPercent: -100 }, 0)
              .to(panels[0], { x: 0 }, 0)
              .to(panels[1], { x: () => viewportWidth() * 0.666 }, 0)
              .to(panels[2], { x: () => viewportWidth() * 0.89 }, 0)
              .to(bodies[0], { y: 0, duration: 0.64, ease: "power2.out" }, 0.2)
              .to(
                mediaReveals[0],
                { scaleY: 1, duration: 0.62, ease: "power2.out" },
                0.22,
              )
              .to(
                mediaContents[0],
                { scaleY: 1, duration: 0.62, ease: "power2.out" },
                0.22,
              )
              .to(
                images[0],
                { scale: 1.02, duration: 0.72, ease: "power2.out" },
                0.22,
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
                0.42,
              )
              .to(
                projectLinks[0],
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.2,
                  ease: "back.out(1.5)",
                },
                0.5,
              )
              .addLabel("secondProject", 0.92)
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
                bodies[1],
                { y: 0, duration: 0.64, ease: "power2.out" },
                "secondProject+=0.06",
              )
              .to(
                mediaReveals[1],
                { scaleY: 1, duration: 0.62, ease: "power2.out" },
                "secondProject+=0.08",
              )
              .to(
                mediaContents[1],
                { scaleY: 1, duration: 0.62, ease: "power2.out" },
                "secondProject+=0.08",
              )
              .to(
                images[1],
                { scale: 1.02, duration: 0.72, ease: "power2.out" },
                "secondProject+=0.08",
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
                "secondProject+=0.28",
              )
              .to(
                projectLinks[1],
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.2,
                  ease: "back.out(1.5)",
                },
                "secondProject+=0.36",
              )
              .addLabel("thirdProject", "secondProject+=0.82")
              .to(
                panels[1],
                { x: () => viewportWidth() * -0.666 },
                "thirdProject",
              )
              .to(panels[2], { x: 0 }, "thirdProject")
              .to(
                bodies[2],
                { y: 0, duration: 0.64, ease: "power2.out" },
                "thirdProject+=0.06",
              )
              .to(
                mediaReveals[2],
                { scaleY: 1, duration: 0.62, ease: "power2.out" },
                "thirdProject+=0.08",
              )
              .to(
                mediaContents[2],
                { scaleY: 1, duration: 0.62, ease: "power2.out" },
                "thirdProject+=0.08",
              )
              .to(
                images[2],
                { scale: 1.02, duration: 0.72, ease: "power2.out" },
                "thirdProject+=0.08",
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
                "thirdProject+=0.28",
              )
              .to(
                projectLinks[2],
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.2,
                  ease: "back.out(1.5)",
                },
                "thirdProject+=0.36",
              )
              .addLabel("workFields", "thirdProject+=1.05")
              .set(
                panels[2],
                {
                  autoAlpha: 0,
                },
                "workFields",
              )
              .set(
                localWorkFieldsStage,
                {
                  x: 0,
                  autoAlpha: 1,
                  force3D: true,
                },
                "workFields",
              )
              .to(
                handoffDetails,
                {
                  top: "100%",
                  duration: 0.9,
                  ease: "none",
                },
                "workFields",
              )
              .set(handoffDetails, { autoAlpha: 0 }, "workFields+=0.9")
              .to(
                handoffCounter,
                {
                  autoAlpha: 0,
                  duration: 0.24,
                  ease: "none",
                },
                "workFields",
              )
              .to(
                handoffSlide,
                {
                  height: "48%",
                  duration: 0.9,
                  ease: "none",
                },
                "workFields",
              )
              .to(
                handoffMedia,
                {
                  height: "100%",
                  duration: 0.9,
                  ease: "none",
                },
                "workFields",
              )
              .to(
                workFieldsIntroLines,
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  stagger: 0.03,
                  duration: 0.4,
                  ease: "power3.out",
                },
                "workFields+=0.08",
              )
              .to(
                workFieldsMediaTrack,
                {
                  y: () =>
                    -stageHeight() * workFieldCardRatio * workFieldTrackSteps,
                  duration: workFieldTrackDuration,
                  ease: "none",
                  force3D: true,
                },
                "workFields+=0.9",
              )
              .to(
                workFieldsMediaViewport,
                {
                  width: "33.333%",
                  duration: 0.9,
                  ease: "none",
                },
                "workFields",
              )
              .to(
                workFieldsCopy,
                {
                  x: 0,
                  duration: 0.9,
                  ease: "none",
                  force3D: true,
                },
                "workFields",
              )
              .to(
                workFieldsMediaExitWash,
                {
                  autoAlpha: 1,
                  duration: 0.18,
                  ease: "none",
                },
                `workFields+=${0.72 + workFieldTrackDuration}`,
              );

            for (
              let index = 0;
              index < workFieldGalleryItems.length;
              index += 1
            ) {
              const fieldLabel = `workFieldProgress${index + 1}`;
              const fieldTime =
                firstWorkFieldProgressTime + index * workFieldProgressInterval;

              timeline.addLabel(fieldLabel, `workFields+=${fieldTime}`).to(
                workFieldProgressItems[index],
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.24,
                  ease: "power3.out",
                },
                fieldLabel,
              );
            }

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
      videoObserver?.disconnect();
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
    class="project-stage relative h-[calc(100dvh_-_4.35rem)] overflow-hidden bg-brand-light"
  >
    <article
      class="showcase-intro absolute inset-y-0 left-0 z-[1] flex w-[53%] flex-col justify-center border-r border-brand-dark/15 bg-brand-light px-[clamp(1.5rem,3vw,3.5rem)] py-[clamp(2rem,5vh,3.5rem)] text-brand-light overflow-hidden"
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
        <h3
          class="max-w-[8ch] font-display text-[clamp(3.6rem,6.8vw,7.75rem)] font-medium uppercase leading-[0.82] tracking-[-0.065em] text-brand-light"
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
    </article>

    {#each showcaseProjects as project, index (project.id)}
      <article
        class="project-panel absolute inset-y-0 left-0 w-[66.6vw] overflow-hidden border-l border-brand-dark/15"
        style:background-color={project.bgColor}
        aria-labelledby="project-title-{project.id}"
      >
        <div
          class="project-body relative z-[1] h-full w-full will-change-transform"
        >
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
      class="work-fields-track absolute inset-0 z-20 overflow-hidden bg-brand-light"
      aria-labelledby="work-fields-rail-title"
    >
      <h2 id="work-fields-rail-title" class="sr-only">
        Visual production fields
      </h2>

      <div class="work-fields-desktop relative h-full w-full">
        <div
          class="work-fields-media-viewport absolute inset-y-0 left-0 h-full w-[66.6%] overflow-hidden bg-brand-dark"
        >
          <div class="work-fields-media-track h-full will-change-transform">
            {#each workFieldItems as item, index (item.id)}
              <figure
                class:work-field-handoff-slide={index === 0}
                class="work-field-slide relative overflow-hidden"
              >
                {#if index === 0 && finalShowcaseProject?.media.kind === "image"}
                  <div
                    class="work-field-handoff-media relative h-[70%] overflow-hidden"
                  >
                    <img
                      src={finalShowcaseProject.media.src}
                      alt=""
                      width={finalShowcaseProject.media.width}
                      height={finalShowcaseProject.media.height}
                      loading="lazy"
                      class="work-field-image h-full w-full object-cover object-center will-change-transform"
                    />
                    <div
                      class="work-field-handoff-counter pointer-events-none absolute inset-x-0 top-0 flex items-center justify-end p-[clamp(1rem,2vw,2rem)] font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-brand-light mix-blend-difference"
                    >
                      <span
                        >{String(showcaseProjects.length).padStart(2, "0")} / {String(
                          showcaseProjects.length,
                        ).padStart(2, "0")}</span
                      >
                    </div>
                  </div>

                  <div
                    class="work-field-handoff-details absolute inset-x-0 bottom-0 top-[70%] z-[2] flex flex-col overflow-hidden px-[clamp(1.25rem,2.4vw,2.75rem)] py-[clamp(0.75rem,1.5vh,1.1rem)] text-brand-dark"
                    style:background-color={finalShowcaseProject.bgColor}
                  >
                    <div
                      class="grid grid-cols-[auto_1fr_1.35fr] items-start gap-[clamp(1rem,3vw,4rem)] border-b border-brand-dark/20 pb-4"
                    >
                      <span
                        class="rounded-full border border-brand-dark/50 px-3 py-1 font-mono text-[0.58rem] font-bold"
                      >
                        {finalShowcaseProject.year}
                      </span>
                      <p
                        class="font-mono text-[0.58rem] font-bold uppercase tracking-[0.13em]"
                      >
                        {finalShowcaseProject.category}
                      </p>
                      <p
                        class="max-w-[34ch] text-[clamp(0.72rem,0.85vw,0.9rem)] leading-[1.35]"
                      >
                        {finalShowcaseProject.description}
                      </p>
                    </div>

                    <div
                      class="flex flex-1 items-center justify-center px-20 text-center"
                    >
                      <h3
                        class="pb-[0.08em] font-display text-[clamp(2.6rem,5vw,5.75rem)] font-medium leading-[0.8] tracking-[-0.06em]"
                      >
                        {finalShowcaseProject.title}
                      </h3>
                      <span
                        class="absolute bottom-4 right-4 flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border border-brand-dark bg-brand-dark text-brand-light"
                      >
                        <ArrowUpRight class="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                {:else}
                  <div
                    class="work-field-image-shell h-full w-full will-change-transform"
                  >
                    {#if item.media.kind === "video"}
                      <video
                        src={item.media.src}
                        poster={item.media.poster}
                        width={item.media.width}
                        height={item.media.height}
                        autoplay
                        muted
                        loop
                        playsinline
                        preload="metadata"
                        aria-label={item.media.alt}
                        class="work-field-image h-full w-full object-cover will-change-transform"
                      ></video>
                    {:else}
                      <img
                        src={item.media.src}
                        alt={item.media.alt}
                        width={item.media.width}
                        height={item.media.height}
                        loading="lazy"
                        class="work-field-image h-full w-full object-cover will-change-transform"
                      />
                    {/if}
                  </div>
                  <div
                    class="work-field-hover-shade pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-brand-dark/35 opacity-0"
                    aria-hidden="true"
                  ></div>
                  <div
                    class="work-field-hover-copy pointer-events-none absolute inset-0 text-brand-light"
                  >
                    <div
                      class="work-field-hover-detail absolute inset-x-0 top-0 flex items-center justify-between gap-5 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.8rem,1.5vh,1.2rem)]"
                    >
                      <p
                        class="font-mono text-[0.56rem] font-bold uppercase tracking-[0.14em]"
                      >
                        {item.category}
                      </p>
                      <span
                        class="rounded-full border border-brand-light/80 px-3 py-1 font-mono text-[0.54rem] font-bold"
                      >
                        {String(index).padStart(2, "0")} / {String(
                          workFieldGalleryItems.length,
                        ).padStart(2, "0")}
                      </span>
                    </div>
                    <h3
                      class="work-field-hover-detail absolute bottom-[clamp(1rem,2vw,1.5rem)] left-[clamp(1rem,2vw,1.5rem)] max-w-[70%] font-display text-[clamp(1.3rem,1.8vw,2rem)] leading-[0.95] tracking-[-0.035em]"
                    >
                      {item.title}
                    </h3>
                    <a
                      href={resolve("/services")}
                      class="work-field-slide-arrow pointer-events-auto absolute bottom-[clamp(0.75rem,1.5vw,1.25rem)] right-[clamp(0.75rem,1.5vw,1.25rem)] flex h-[clamp(3.5rem,4.6vw,4.5rem)] w-[clamp(3.5rem,4.6vw,4.5rem)] items-center justify-center rounded-full border border-brand-light text-brand-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-light"
                      aria-label="Explore {item.title}"
                    >
                      <span class="work-field-slide-arrow-icon">
                        <ArrowUpRight class="h-5 w-5" />
                      </span>
                    </a>
                  </div>
                {/if}
              </figure>
            {/each}
          </div>
          <div
            class="work-fields-media-exit-wash pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[24%] bg-gradient-to-b from-transparent to-brand-light"
            aria-hidden="true"
          ></div>
        </div>

        <aside
          class="work-fields-copy absolute inset-y-0 left-[33.333%] right-0 flex h-full min-w-0 flex-col overflow-hidden bg-brand-light text-brand-dark will-change-transform"
          aria-label="Studio Click House image and video post-production services"
        >
          <div class="relative min-h-0 flex-1 overflow-hidden">
            <article
              class="work-fields-intro-panel absolute inset-0 flex items-center justify-center px-[clamp(1.5rem,4vw,5rem)] py-[clamp(1.5rem,4vh,3.5rem)]"
              aria-labelledby="work-fields-intro-title"
            >
              <div class="w-full max-w-[48rem]">
                <p
                  class="work-fields-intro-inner mb-5 font-mono text-[0.58rem] font-bold uppercase tracking-[0.18em] text-brand-green"
                >
                  Image and video post-production
                </p>
                <h3
                  id="work-fields-intro-title"
                  class="overflow-hidden pb-[0.12em] font-display text-[clamp(2.8rem,4.7vw,5.8rem)] font-medium leading-[0.86] tracking-[-0.055em]"
                >
                  <span class="work-fields-intro-inner block">
                    Built around every final frame.
                  </span>
                </h3>
                <p
                  class="mt-[clamp(1.25rem,2.5vh,2rem)] max-w-[52ch] overflow-hidden text-[clamp(0.8rem,0.95vw,0.98rem)] leading-[1.55] text-brand-dark/70"
                >
                  <span class="work-fields-intro-inner block">
                    Studio Click House supports ecommerce and campaign
                    production with product, beauty, fashion and jewelry
                    retouching, color correction, CGI, and commercial video
                    editing.
                  </span>
                </p>

                <ol
                  class="mt-[clamp(1.5rem,3vh,2.5rem)]"
                  aria-label="Post-production capabilities revealed by scroll"
                >
                  {#each workFieldGalleryItems as item, index (item.id)}
                    {@const serviceSlug =
                      workFieldServiceSlugs[item.id] ?? "ecommerce-retouching"}
                    <li
                      class="work-field-progress-item border-t border-brand-dark/15 last:border-b"
                    >
                      <a
                        href={resolve("/services/[slug]", {
                          slug: serviceSlug,
                        })}
                        class="group grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 py-[clamp(0.5rem,0.9vh,0.7rem)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-dark"
                        aria-label="Explore the {workFieldServiceLabels[
                          item.id
                        ] ?? item.category} service"
                      >
                        <span
                          class="font-mono text-[0.56rem] font-bold tracking-[0.12em]"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          class="text-[clamp(0.78rem,0.95vw,0.98rem)] font-medium"
                        >
                          {workFieldServiceLabels[item.id] ?? item.category}
                        </span>
                        <span
                          class="grid h-8 w-8 place-items-center rounded-full border border-brand-dark/35 transition-colors duration-300 group-hover:border-brand-dark group-hover:bg-brand-dark group-hover:text-brand-light"
                        >
                          <ArrowUpRight
                            class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </li>
                  {/each}
                </ol>
              </div>
            </article>
          </div>
        </aside>
      </div>

      <div class="work-fields-mobile h-full gap-3">
        {#each workFieldGalleryItems as item (item.id)}
          <article
            class="work-card relative h-full w-[88vw] shrink-0 snap-center overflow-hidden border border-brand-light/10 bg-brand-light/5"
          >
            {#if item.media.kind === "video"}
              <video
                src={item.media.src}
                poster={item.media.poster}
                width={item.media.width}
                height={item.media.height}
                autoplay
                muted
                loop
                playsinline
                preload="metadata"
                aria-label={item.media.alt}
                class="work-card-image h-full w-full object-cover"
              ></video>
            {:else}
              <img
                src={item.media.src}
                alt={item.media.alt}
                width={item.media.width}
                height={item.media.height}
                loading="lazy"
                class="work-card-image h-full w-full object-cover"
              />
            {/if}
            <div
              class="work-card-shade absolute inset-0"
              aria-hidden="true"
            ></div>
            <div class="work-card-copy absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <div class="work-card-detail">
                <h3
                  class="max-w-sm font-display text-2xl leading-[1.0] tracking-[-0.025em] text-brand-light sm:text-3xl"
                >
                  {item.title}
                </h3>
                <p
                  class="mt-4 max-w-sm text-sm leading-relaxed text-brand-light/80"
                >
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        {/each}
      </div>
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

  @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
    .work-fields-track {
      visibility: hidden;
      opacity: 0;
    }
  }

  @media (min-width: 768px) {
    .work-fields-track::after {
      position: absolute;
      z-index: 50;
      inset: 0;
      background: radial-gradient(
        ellipse 62% 100% at 50% 100%,
        color-mix(in srgb, var(--color-brand-green) 20%, transparent),
        transparent 68%
      );
      content: "";
      pointer-events: none;
    }
  }

  .work-fields-desktop {
    display: block;
  }

  .work-fields-mobile {
    display: none;
  }

  .work-fields-media-track,
  .work-field-image,
  .work-field-progress-item {
    will-change: transform;
  }

  .work-field-slide {
    height: 48%;
  }

  .work-field-handoff-slide {
    height: 100%;
  }

  .work-field-image-shell {
    transition: transform 720ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .work-field-hover-shade {
    transition: opacity 420ms ease;
  }

  .work-field-hover-detail {
    opacity: 0;
    transform: translateY(0.7rem);
    transition:
      opacity 360ms ease,
      transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .work-field-slide-arrow {
    background-color: transparent;
    opacity: 0;
    transform: scale(0.82);
    transition:
      opacity 260ms ease,
      transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
      background-color 360ms ease,
      border-color 360ms ease,
      color 360ms ease;
  }

  .work-field-slide-arrow-icon {
    transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .work-field-slide:hover .work-field-image-shell,
  .work-field-slide:focus-within .work-field-image-shell {
    transform: scale(1.045);
  }

  .work-field-slide:hover .work-field-hover-shade,
  .work-field-slide:focus-within .work-field-hover-shade {
    opacity: 1;
  }

  .work-field-slide:hover .work-field-hover-detail,
  .work-field-slide:focus-within .work-field-hover-detail {
    opacity: 1;
    transform: translateY(0);
  }

  .work-field-slide:hover .work-field-slide-arrow,
  .work-field-slide:focus-within .work-field-slide-arrow {
    border-color: var(--color-brand-light);
    background-color: var(--color-brand-light);
    color: var(--color-brand-dark);
    transform: scale(1);
    opacity: 1;
    transition-delay: 0ms, 0ms, 160ms, 160ms, 160ms;
  }

  .work-field-slide:hover .work-field-slide-arrow-icon,
  .work-field-slide:focus-within .work-field-slide-arrow-icon {
    transform: translate(0.12rem, -0.12rem);
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
      width: max-content;
      flex: 0 0 auto;
      transform: none !important;
      will-change: auto;
    }

    .work-fields-desktop {
      display: none;
    }

    .work-fields-mobile {
      display: flex;
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
      width: max-content;
      flex: 0 0 auto;
      transform: none !important;
      will-change: auto;
    }

    .work-fields-desktop {
      display: none;
    }

    .work-fields-mobile {
      display: flex;
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
    .work-field-image-shell {
      transition: none;
    }

    .work-field-hover-shade {
      opacity: 1;
      transition: none;
    }

    .work-field-hover-detail {
      opacity: 1;
      transform: none;
      transition: none;
    }

    .work-field-slide-arrow {
      border-color: var(--color-brand-light);
      background-color: var(--color-brand-light);
      color: var(--color-brand-dark);
      transform: scale(1);
      opacity: 1;
      transition: none;
    }

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
