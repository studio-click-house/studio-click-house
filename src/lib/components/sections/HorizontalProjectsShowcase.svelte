<script lang="ts">
  /* eslint-disable svelte/no-navigation-without-resolve -- resolveServiceHref returns a resolved pathname. */
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { resolveServiceHref } from "$lib/content/service-pages";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { showcaseProjects, workGalleryItems } from "$lib/content/home";
  import { getRemoteImageSrcset } from "$lib/utils/responsive-media";
  import { _ } from "svelte-i18n";
  import type {
    PreviewMedia,
    ShowcaseProjectMedia,
    WorkGalleryItem,
  } from "$lib/types/content";

  const finalShowcaseProject = showcaseProjects.at(-1);
  type WorkFieldSectionItem = Omit<WorkGalleryItem, "media"> & {
    media: ShowcaseProjectMedia;
  };

  const workFieldPortraitMedia: Record<string, PreviewMedia> = {
    "product-finishing": {
      src: "/images/services/product-services/product-architectural-skylight-roof-window-section.webp",
      alt: "Architectural roof-window product photographed for a clear commercial product image",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    "beauty-detail": {
      src: "/images/services/model-beauty/beauty-editorial-glam-leopard-portrait-298-after.webp",
      alt: "Beauty portrait with polished editorial makeup and leopard print styling",
      width: 1500,
      height: 2000,
      credit: "Studio Click House",
    },
    "fashion-color": {
      src: "/images/services/model-beauty/model-fashion-male-suit-street-editorial-after.webp",
      alt: "Fashion model in a blue suit photographed on a city street",
      width: 1544,
      height: 2000,
      credit: "Studio Click House",
    },
    "jewelry-detail": {
      src: "/images/services/jewelry/jewelry-westwood-statement-gold-earrings-02-after.webp",
      alt: "Pair of sculptural gold earrings with a polished finish",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
    "shadow-study": {
      src: "/images/services/bags-accessories/accessories-quinn-metallic-gold-bag-810-after.webp",
      alt: "Metallic gold handbag photographed against a clean studio background",
      width: 1600,
      height: 2000,
      credit: "Studio Click House",
    },
  };
  const withImageKind = (item: WorkGalleryItem): WorkFieldSectionItem => ({
    ...item,
    media: {
      ...(workFieldPortraitMedia[item.id] ?? item.media),
      kind: "image",
    },
  });
  const workFieldDemoItem: WorkFieldSectionItem = {
    id: "commercial-video-editing",
    category: "Commercial video editing",
    title: "Movement shaped for product and campaign stories.",
    description:
      "Commercial editing, pacing, color, and delivery for high-impact branded video campaigns.",
    tags: ["Video", "Editing"],
    media: {
      kind: "video",
      src: "/images/video-editing/Fashion_e-commerce_film_production_1080p_20261001185052.mp4",
      alt: "Fashion e-commerce film production and commercial editing",
      width: 1920,
      height: 1080,
      credit: "Studio Click House",
    },
  };
  const workFieldLifestyleVideoItem: WorkFieldSectionItem = {
    id: "fashion-lifestyle-video",
    category: "Editorial fashion motion",
    title: "Cinematic pacing that elevates brand identity.",
    description:
      "High-end fashion editorial reels, lifestyle campaign cutdowns, and color grading tuned for digital screens.",
    tags: ["Fashion", "Motion"],
    media: {
      kind: "video",
      src: "/images/video-editing/Fashion_model_in_sunlight_20261001165857.mp4",
      alt: "Fashion lifestyle editorial video reel in natural sunlight",
      width: 1920,
      height: 1080,
      credit: "Studio Click House",
    },
  };
  const workFieldGalleryItems = [
    workFieldDemoItem,
    withImageKind(workGalleryItems[0]),
    withImageKind(workGalleryItems[1]),
    workFieldLifestyleVideoItem,
    ...workGalleryItems.slice(2).map(withImageKind),
  ];
  const workFieldServiceLabels: Record<string, string> = {
    "product-finishing": "Product retouching",
    "beauty-detail": "Beauty retouching",
    "commercial-video-editing": "Commercial video editing",
    "fashion-lifestyle-video": "Fashion video editing",
    "fashion-color": "Fashion color correction",
    "jewelry-detail": "Jewelry retouching",
    "shadow-study": "Product image composition",
  };
  const workFieldServiceSlugs: Record<string, string> = {
    "product-finishing": "ecommerce-retouching",
    "beauty-detail": "editorial-retouching",
    "commercial-video-editing": "commercial-editing",
    "fashion-lifestyle-video": "commercial-editing",
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

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;
    let videoObserver: IntersectionObserver | undefined;
    const stageVideos = Array.from(
      stage?.querySelectorAll<HTMLVideoElement>("video") ?? [],
    );

    // Ensure every video cues its true first frame so that the native video frame is visible as thumbnail
    stageVideos.forEach((v) => {
      const cueFirstFrame = () => {
        if (v.currentTime === 0) {
          v.currentTime = 0.001;
        }
      };
      if (v.readyState >= 1) {
        cueFirstFrame();
      } else {
        v.addEventListener("loadedmetadata", cueFirstFrame, { once: true });
      }
    });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let isSectionNearViewport = false;
    let hoveredVideo: HTMLVideoElement | null = null;
    let currentPlayingVideo: HTMLVideoElement | null = null;
    let isRafScheduled = false;

    // Track in-flight play promises to strictly prevent DOMException AbortError
    // when pause() is requested before play() fulfills
    const playPromises = new WeakMap<HTMLVideoElement, Promise<void>>();

    const safePlay = (video: HTMLVideoElement) => {
      if (!video.paused || playPromises.has(video)) return;
      try {
        const promise = video.play();
        if (promise !== undefined) {
          playPromises.set(video, promise);
          promise
            .catch(() => {})
            .finally(() => {
              playPromises.delete(video);
              // If target changed while awaiting play, safely pause now
              if (currentPlayingVideo !== video && !video.paused) {
                video.pause();
              }
            });
        }
      } catch {
        // Safe catch for environment restrictions
      }
    };

    const safePause = (video: HTMLVideoElement) => {
      if (video.paused) return;
      const pending = playPromises.get(video);
      if (pending) {
        pending
          .then(() => {
            if (currentPlayingVideo !== video && !video.paused) {
              video.pause();
            }
          })
          .catch(() => {});
      } else {
        video.pause();
      }
    };

    const pauseAllStageVideos = () => {
      currentPlayingVideo = null;
      stageVideos.forEach((video) => {
        safePause(video);
      });
    };

    const isVideoVisibleOnScreen = (video: HTMLVideoElement): boolean => {
      if (!video.isConnected) return false;
      const rect = video.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      // Must be vertically in viewport
      if (rect.bottom < 40 || rect.top > window.innerHeight - 40) return false;
      // Must be horizontally in viewport
      if (rect.right < 40 || rect.left > window.innerWidth - 40) return false;
      // Must overlap horizontally with at least 15% of viewport width
      const overlapWidth =
        Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0);
      return overlapWidth > window.innerWidth * 0.15;
    };

    const getDistanceFromCenter = (video: HTMLVideoElement): number => {
      const rect = video.getBoundingClientRect();
      const videoCenterX = (rect.left + rect.right) * 0.5;
      const vpCenterX = window.innerWidth * 0.5;
      return Math.abs(videoCenterX - vpCenterX);
    };

    const getFocusedVideo = (): HTMLVideoElement | null => {
      const visibleVideos = stageVideos.filter(isVideoVisibleOnScreen);
      if (visibleVideos.length === 0) return null;

      // Hysteresis deadband: if a video is already playing and remains visible,
      // require the candidate to be at least 120px closer to the center before switching.
      // This completely prevents rapid jitter, audio/video decoder stalls, and freezing during scroll.
      if (currentPlayingVideo && isVideoVisibleOnScreen(currentPlayingVideo)) {
        const currentDist = getDistanceFromCenter(currentPlayingVideo);
        let bestAlternate: HTMLVideoElement | null = null;
        let minAlternateDist = currentDist;

        for (const v of visibleVideos) {
          if (v === currentPlayingVideo) continue;
          const d = getDistanceFromCenter(v);
          if (d < minAlternateDist) {
            minAlternateDist = d;
            bestAlternate = v;
          }
        }

        if (bestAlternate && currentDist - minAlternateDist > 120) {
          return bestAlternate;
        }

        return currentPlayingVideo;
      }

      // Initial or fallback selection: pick the video closest to viewport center
      let bestVideo: HTMLVideoElement | null = null;
      let minDistance = Infinity;

      for (const v of visibleVideos) {
        const d = getDistanceFromCenter(v);
        if (d < minDistance) {
          minDistance = d;
          bestVideo = v;
        }
      }

      return bestVideo;
    };

    const updateFocusedVideo = () => {
      isRafScheduled = false;
      if (!active || prefersReducedMotion.matches || !isSectionNearViewport) {
        pauseAllStageVideos();
        return;
      }

      // If user is hovering over any card with a video, play that video exclusively
      const targetVideo = hoveredVideo ?? getFocusedVideo();
      currentPlayingVideo = targetVideo;

      stageVideos.forEach((video) => {
        if (video === targetVideo) {
          safePlay(video);
        } else {
          safePause(video);
        }
      });
    };

    const scheduleUpdateFocusedVideo = () => {
      if (!isRafScheduled) {
        isRafScheduled = true;
        requestAnimationFrame(updateFocusedVideo);
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        pauseAllStageVideos();
      } else if (isSectionNearViewport) {
        scheduleUpdateFocusedVideo();
      }
    };
    prefersReducedMotion.addEventListener("change", handleMotionChange);

    // Attach hover listeners to each card container so hovering plays its video
    const hoverCleanupFns: Array<() => void> = [];
    stageVideos.forEach((video) => {
      const card =
        video.closest<HTMLElement>(
          ".project-panel, .showcase-intro, .work-field-slide, .work-card",
        ) ?? video;

      const onEnter = () => {
        hoveredVideo = video;
        scheduleUpdateFocusedVideo();
      };

      const onLeave = (e: MouseEvent) => {
        if (card.contains(e.relatedTarget as Node)) return;
        if (hoveredVideo === video) {
          hoveredVideo = null;
        }
        scheduleUpdateFocusedVideo();
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      hoverCleanupFns.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    window.addEventListener("scroll", scheduleUpdateFocusedVideo, {
      passive: true,
    });
    window.addEventListener("resize", scheduleUpdateFocusedVideo, {
      passive: true,
    });

    if (prefersReducedMotion.matches) {
      pauseAllStageVideos();
    } else if ("IntersectionObserver" in window && section) {
      videoObserver = new IntersectionObserver(
        ([entry]) => {
          isSectionNearViewport = Boolean(entry?.isIntersecting);
          if (isSectionNearViewport && !prefersReducedMotion.matches) {
            scheduleUpdateFocusedVideo();
          } else {
            pauseAllStageVideos();
          }
        },
        { rootMargin: "300px 0px", threshold: 0.01 },
      );
      videoObserver.observe(section);
    } else {
      isSectionNearViewport = true;
      scheduleUpdateFocusedVideo();
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
            const workFieldsMediaContent =
              localStage.querySelector<HTMLElement>(
                ".work-fields-media-content",
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
              !workFieldsMediaContent ||
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
            const workFieldCardRatio = 0.9;
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
            const projectTransitionDuration = 0.82;
            const initialPanelPositions = [0.5, 0.83, 0.93];
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
                scale: 1,
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
              width: "100%",
              force3D: true,
            });
            gsap.set(workFieldsMediaViewport, {
              scaleX: 1,
              transformOrigin: "left center",
              force3D: true,
            });
            gsap.set(workFieldsMediaContent, {
              scaleX: 1,
              transformOrigin: "left center",
              force3D: true,
            });
            gsap.set(workFieldsMediaExitWash, { autoAlpha: 0 });
            gsap.set(handoffDetails, {
              top: "0%",
              y: 0,
              autoAlpha: 1,
              force3D: true,
            });
            gsap.set(workFieldsCopy, {
              x: () => viewportWidth() / 3,
              force3D: true,
            });
            gsap.set(workFieldImages, {
              scale: 1,
              transformOrigin: "center center",
              force3D: true,
            });
            gsap.set(
              workFieldImages.filter((image) =>
                image.classList.contains("work-field-shadow-image"),
              ),
              {
                scale: 1.14,
                transformOrigin: "center top",
                force3D: true,
              },
            );
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
                  `+=${stageHeight() * (3.9 + Math.max(0, panels.length - 3) * projectTransitionDuration + workFieldTrackSteps * workFieldCardRatio)}`,
                pin: localStage,
                pinSpacing: true,
                scrub: true,
                refreshPriority: 100,
                invalidateOnRefresh: true,
                onUpdate: scheduleUpdateFocusedVideo,
              },
            });

            timeline
              .to(intro, { xPercent: -100 }, 0)
              .to(panels[0], { x: 0 }, 0)
              .to(panels[1], { x: () => viewportWidth() * 0.666 }, 0)
              .to(panels[2], { x: () => viewportWidth() * 0.89 }, 0);

            const revealProject = (
              index: number,
              position: number | string,
              isFirstProject = false,
            ) => {
              const offset = (first: number, next: number) => {
                const value = isFirstProject ? first : next;
                return typeof position === "number"
                  ? position + value
                  : String(position) + "+=" + value;
              };

              timeline
                .to(
                  bodies[index],
                  { y: 0, duration: 0.64, ease: "power2.out" },
                  offset(0.2, 0.06),
                )
                .to(
                  mediaReveals[index],
                  { scaleY: 1, duration: 0.62, ease: "power2.out" },
                  offset(0.22, 0.08),
                )
                .to(
                  mediaContents[index],
                  { scaleY: 1, duration: 0.62, ease: "power2.out" },
                  offset(0.22, 0.08),
                )
                .to(
                  images[index],
                  { scale: 1, duration: 0.72, ease: "power2.out" },
                  offset(0.22, 0.08),
                )
                .to(
                  revealLines[index],
                  {
                    yPercent: 0,
                    autoAlpha: 1,
                    stagger: 0.02,
                    duration: 0.3,
                    ease: "power3.out",
                  },
                  offset(0.42, 0.28),
                )
                .to(
                  projectLinks[index],
                  {
                    scale: 1,
                    autoAlpha: 1,
                    duration: 0.2,
                    ease: "back.out(1.5)",
                  },
                  offset(0.2, 0.16),
                );
            };

            revealProject(0, 0, true);

            let previousProjectLabel = "firstProject";
            timeline.addLabel(previousProjectLabel, 0);

            for (let index = 1; index < panels.length; index += 1) {
              const projectLabel = "project" + (index + 1);
              const transitionDelay =
                index === 1 ? 0.92 : projectTransitionDuration;

              timeline
                .addLabel(
                  projectLabel,
                  previousProjectLabel + "+=" + transitionDelay,
                )
                .to(
                  projectLinks[index - 1],
                  { scale: 0, autoAlpha: 0, duration: 0.15 },
                  projectLabel + "+=0.5",
                )
                .to(
                  panels[index - 1],
                  { x: () => viewportWidth() * -0.666 },
                  projectLabel,
                )
                .to(panels[index], { x: 0 }, projectLabel);

              if (panels[index + 1]) {
                timeline.to(
                  panels[index + 1],
                  { x: () => viewportWidth() * 0.666 },
                  projectLabel,
                );
              }

              revealProject(index, projectLabel);
              previousProjectLabel = projectLabel;
            }

            const lastProjectIndex = panels.length - 1;

            timeline
              .addLabel("workFields", previousProjectLabel + "+=1.05")
              .to(
                projectLinks[lastProjectIndex],
                { scale: 0, autoAlpha: 0, duration: 0.15 },
                "workFields",
              )
              .set(panels[lastProjectIndex], { autoAlpha: 0 }, "workFields")
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
                  paddingTop: 0,
                  paddingBottom: 0,
                  duration: 0.9,
                  ease: "none",
                },
                "workFields",
              )
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
                  height: `${workFieldCardRatio * 100}%`,
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
                  width: "50%",
                  duration: 0.9,
                  ease: "none",
                },
                "workFields",
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
                  scaleX: 0.5,
                  duration: 0.9,
                  ease: "none",
                  force3D: true,
                },
                "workFields",
              )
              .to(
                workFieldsMediaContent,
                {
                  scaleX: 2,
                  duration: 0.9,
                  ease: "none",
                  force3D: true,
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

            return;
          },
        );
      }, localSection);

      ScrollTrigger.refresh();
    });

    return () => {
      active = false;
      pauseAllStageVideos();
      hoverCleanupFns.forEach((fn) => fn());
      window.removeEventListener("scroll", scheduleUpdateFocusedVideo);
      window.removeEventListener("resize", scheduleUpdateFocusedVideo);
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
      class="showcase-intro absolute inset-y-0 left-0 z-[1] flex w-[50%] flex-col items-center justify-center border-r border-brand-dark/15 bg-brand-light px-[clamp(1.5rem,3vw,3.5rem)] py-[clamp(2rem,5vh,3.5rem)] text-center text-brand-light overflow-hidden"
    >
      <!-- Background Video with dark overlay for rich contrast -->
      <div class="absolute inset-0 z-0 pointer-events-none">
        <video
          src="/images/video-editing/Fashion_editorial_montage_creation_1080p_20261001180512.mp4"
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
          class="h-full w-full object-cover object-center"
        ></video>
        <!-- Dark gradient overlay to pop the white text -->
        <div
          class="absolute inset-0 bg-brand-dark/50 z-10"
          aria-hidden="true"
        ></div>
      </div>

      <div class="relative z-10 flex flex-col items-center text-center">
        <p class="eyebrow mb-3 text-brand-light/60">
          {$_("sectionLabels.divisions")}
        </p>
        <h3
          class="font-display text-[clamp(3.6rem,6.8vw,7.75rem)] font-medium uppercase leading-[0.82] tracking-[-0.065em] text-brand-light"
        >
          {$_("home.showcaseIntro.title1") || "Our"}<br />{$_(
            "home.showcaseIntro.title2",
          ) || "services"}
        </h3>
        <p
          class="mt-[clamp(1.5rem,3vh,2.25rem)] max-w-[36rem] text-center text-[clamp(0.85rem,1.05vw,1.05rem)] leading-[1.4] text-brand-light/85"
        >
          {$_("home.showcaseIntro.description") ||
            "One production partner for polished stills, considered motion, and believable 3D imagery—built around the needs of each project."}
        </p>
      </div>
    </article>

    {#each showcaseProjects as project (project.id)}
      <article
        class="project-panel absolute inset-y-0 left-0 w-[66.6vw] overflow-hidden border-l border-brand-dark/15 bg-brand-dark"
        aria-labelledby="project-title-{project.id}"
      >
        <div class="project-body relative z-[1] h-full w-full">
          <div class="project-media absolute inset-0 overflow-hidden">
            <div
              class="project-media-reveal absolute inset-0 origin-top overflow-hidden"
            >
              <div
                class="project-media-content relative h-full w-full origin-top"
              >
                {#if project.media.kind === "video"}
                  <video
                    src={project.media.src}
                    poster={project.media.poster}
                    width={project.media.width}
                    height={project.media.height}
                    muted
                    loop
                    playsinline
                    preload="metadata"
                    aria-label={project.media.alt}
                    class="project-image h-full w-full object-cover"
                    style:object-position={project.media.objectPosition ||
                      "center"}
                  ></video>
                {:else}
                  <img
                    src={project.media.src}
                    srcset={getRemoteImageSrcset(project.media.src)}
                    sizes="67vw"
                    alt={project.media.alt}
                    width={project.media.width}
                    height={project.media.height}
                    loading="lazy"
                    class="project-image h-full w-full object-cover"
                    style:object-position={project.media.objectPosition ||
                      "center"}
                  />
                {/if}
              </div>
            </div>
          </div>

          <div
            class="project-details absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-brand-dark/95 via-brand-dark/35 to-transparent px-[clamp(1.25rem,3vw,3rem)] pb-[clamp(1.5rem,3vw,3rem)] pt-24 text-brand-light"
          >
            <div class="mb-4 flex items-center gap-4">
              <span
                class="detail-reveal rounded-full border border-brand-light/60 px-3 py-1 font-mono text-[0.65rem] font-bold"
                ><span class="detail-reveal-inner block">{project.year}</span
                ></span
              >
              <p
                class="detail-reveal font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-brand-light/60"
              >
                <span class="detail-reveal-inner block"
                  >{$_(`home.showcaseProjects.${project.id}.category`) ||
                    project.category}</span
                >
              </p>
            </div>
            <h3
              id="project-title-{project.id}"
              class="detail-reveal max-w-[12ch] pb-1 font-display text-[clamp(2.8rem,6.4vw,6rem)] font-bold uppercase leading-[0.84] tracking-[-0.06em]"
            >
              <span class="detail-reveal-inner block"
                >{$_(`home.showcaseProjects.${project.id}.title`) ||
                  project.title}</span
              >
            </h3>
            <p
              class="detail-reveal mt-4 max-w-[48ch] text-[clamp(0.95rem,1.35vw,1.25rem)] font-semibold italic leading-[1.3] text-brand-light/90"
            >
              <span class="detail-reveal-inner block"
                >{$_(`home.showcaseProjects.${project.id}.description`) ||
                  project.description}</span
              >
            </p>
            <ul
              class="mt-5 flex flex-wrap gap-x-5 gap-y-2"
              aria-label="Service capabilities"
            >
              {#each project.capabilities as capability}
                <li
                  class="detail-reveal inline-flex items-center gap-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-brand-light/80"
                >
                  <span
                    class="detail-reveal-inner inline-flex items-center gap-2"
                    ><span
                      class="size-2 rounded-full bg-brand-green"
                      aria-hidden="true"
                    ></span>{capability}</span
                  >
                </li>
              {/each}
            </ul>
            <a
              href={resolve(project.href as "/services")}
              class="group project-link mt-6 inline-flex w-fit items-center gap-3 border-b-2 border-brand-green pb-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-brand-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
              aria-label="View capabilities for {project.title}"
            >
              {$_("services.hero.viewCapabilities") || "View capabilities"}
              <ArrowUpRight
                class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
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
          <div class="work-fields-media-content h-full w-full">
            <div class="work-fields-media-track h-full">
              {#each workFieldItems as item, index (item.id)}
                <figure
                  class:work-field-handoff-slide={index === 0}
                  class="work-field-slide relative overflow-hidden"
                >
                  {#if index === 0 && finalShowcaseProject && item.media.kind === "image"}
                    <div
                      class="work-field-handoff-media relative h-full overflow-hidden bg-brand-dark"
                    >
                      <img
                        src={item.media.src}
                        srcset={getRemoteImageSrcset(item.media.src)}
                        sizes="67vw"
                        alt=""
                        width={item.media.width}
                        height={item.media.height}
                        loading="lazy"
                        class="work-field-image h-full w-full object-cover object-center"
                        style:object-position={item.media.objectPosition ||
                          "center"}
                      />
                      <div
                        class="work-field-handoff-counter hidden"
                        aria-hidden="true"
                      ></div>
                    </div>

                    <div
                      class="work-field-handoff-details absolute inset-0 z-[2] flex flex-col justify-end overflow-hidden bg-gradient-to-t from-brand-dark/95 via-brand-dark/35 to-transparent px-[clamp(1.25rem,3vw,3rem)] pb-[clamp(1.5rem,3vw,3rem)] pt-24 text-brand-light"
                    >
                      <div class="mb-4 flex items-center gap-4">
                        <span
                          class="rounded-full border border-brand-light/60 px-3 py-1 font-mono text-[0.65rem] font-bold"
                        >
                          {finalShowcaseProject.year}
                        </span>
                        <p
                          class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em]"
                        >
                          {$_(
                            `home.showcaseProjects.${finalShowcaseProject.id}.category`,
                          ) || finalShowcaseProject.category}
                        </p>
                      </div>

                      <h3
                        class="max-w-[12ch] pb-1 font-display text-[clamp(2.8rem,6.4vw,6rem)] font-bold uppercase leading-[0.84] tracking-[-0.06em]"
                      >
                        {$_(
                          `home.showcaseProjects.${finalShowcaseProject.id}.title`,
                        ) || finalShowcaseProject.title}
                      </h3>
                      <p
                        class="mt-4 max-w-[48ch] text-[clamp(0.95rem,1.35vw,1.25rem)] font-semibold italic leading-[1.3] text-brand-light/90"
                      >
                        {$_(
                          `home.showcaseProjects.${finalShowcaseProject.id}.description`,
                        ) || finalShowcaseProject.description}
                      </p>
                      <ul
                        class="mt-5 flex flex-wrap gap-x-5 gap-y-2"
                        aria-label="Service capabilities"
                      >
                        {#each finalShowcaseProject.capabilities as capability}
                          <li
                            class="inline-flex items-center gap-2 font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-brand-light/80"
                          >
                            <span
                              class="size-2 rounded-full bg-brand-green"
                              aria-hidden="true"
                            ></span>{capability}
                          </li>
                        {/each}
                      </ul>
                      <a
                        href={resolve(finalShowcaseProject.href as "/services")}
                        class="mt-6 inline-flex w-fit items-center gap-3 border-b-2 border-brand-green pb-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-brand-light"
                      >
                        {$_("services.hero.viewCapabilities") ||
                          "View capabilities"}
                        <ArrowUpRight class="h-4 w-4" />
                      </a>
                    </div>
                  {:else}
                    <div class="work-field-image-shell h-full w-full">
                      {#if item.media.kind === "video"}
                        <video
                          src={item.media.src}
                          poster={item.media.poster}
                          width={item.media.width}
                          height={item.media.height}
                          muted
                          loop
                          playsinline
                          preload="metadata"
                          aria-label={item.media.alt}
                          class="work-field-image h-full w-full object-cover"
                        ></video>
                      {:else}
                        <img
                          src={item.media.src}
                          srcset={getRemoteImageSrcset(item.media.src)}
                          sizes="67vw"
                          alt={item.media.alt}
                          width={item.media.width}
                          height={item.media.height}
                          loading="lazy"
                          class="work-field-image h-full w-full object-cover"
                          class:work-field-shadow-image={item.id ===
                            "shadow-study"}
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
                          {$_(`home.workGalleryItems.${item.id}.category`) ||
                            item.category}
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
                        {$_(`home.workGalleryItems.${item.id}.title`) ||
                          item.title}
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
          </div>
          <div
            class="work-fields-media-exit-wash pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[24%] bg-gradient-to-b from-transparent to-brand-light"
            aria-hidden="true"
          ></div>
        </div>

        <aside
          class="work-fields-copy absolute inset-y-0 left-[33.333%] right-0 flex h-full min-w-0 flex-col overflow-hidden bg-brand-light text-brand-dark"
          aria-label="Studio Click House image and video post-production services"
        >
          <div class="relative min-h-0 flex-1 overflow-hidden">
            <article
              class="work-fields-intro-panel absolute inset-0 flex items-center justify-center px-[clamp(1.5rem,4vw,5rem)] py-[clamp(1.5rem,4vh,3.5rem)]"
              aria-labelledby="work-fields-intro-title"
            >
              <div class="w-full max-w-[48rem]">
                <p
                  class="work-fields-intro-inner mb-5 font-mono text-[0.58rem] font-bold uppercase tracking-[0.18em] text-brand-dark/50"
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
                        href={resolveServiceHref(serviceSlug)}
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
            class="work-card relative h-full w-[calc(100vw-2rem)] shrink-0 snap-start overflow-hidden rounded-[2rem] border border-brand-light/10 bg-brand-light/5"
          >
            {#if item.media.kind === "video"}
              <video
                src={item.media.src}
                poster={item.media.poster}
                width={item.media.width}
                height={item.media.height}
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
                srcset={getRemoteImageSrcset(item.media.src)}
                sizes="calc(100vw - 2rem)"
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
                  {$_(`home.workGalleryItems.${item.id}.title`) || item.title}
                </h3>
                <p
                  class="mt-4 max-w-sm text-sm leading-relaxed text-brand-light/80"
                >
                  {$_(`home.workGalleryItems.${item.id}.description`) ||
                    item.description}
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
  .project-stage {
    contain: layout paint;
  }

  .detail-reveal {
    overflow: hidden;
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

  .work-field-slide {
    height: 90%;
  }

  .work-field-handoff-slide {
    height: 100%;
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
      flex-direction: column;
      height: auto;
      width: 100%;
      gap: 0.75rem;
      overflow: hidden;
      padding-inline: 1rem;
      scrollbar-width: none;
    }

    .project-stage::-webkit-scrollbar {
      display: none;
    }

    .showcase-intro,
    .project-panel {
      position: relative;
      inset: auto;
      width: 100%;
      min-width: 0;
      height: 82dvh;
      transform: none !important;
    }

    .work-fields-track {
      position: relative;
      inset: auto;
      z-index: auto;
      height: auto;
      width: 100%;
      transform: none !important;
      will-change: auto;
    }

    .work-fields-desktop {
      display: none;
    }

    .work-fields-mobile {
      display: grid;
    }

    .work-card {
      width: 100%;
      min-height: 82dvh;
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

    .work-card-detail {
      transform: none;
      visibility: visible;
    }

    .work-card-detail > * {
      opacity: 1;
      transform: none;
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
