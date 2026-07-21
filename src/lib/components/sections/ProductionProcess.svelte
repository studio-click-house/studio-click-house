<script lang="ts">
  import { onMount, tick } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";

  const originalDress = {
    src: "/images/about/colorways/dress-color-original.jpg",
    alt: "Original studio portrait before color finishing",
    width: 1024,
    height: 1536,
  } as const;

  const emeraldDress = {
    src: "/images/about/colorways/dress-color-emerald.png",
    alt: "Studio portrait after emerald color finishing",
    width: 1024,
    height: 1536,
  } as const;

  const cobaltDress = {
    src: "/images/about/colorways/dress-color-cobalt.png",
    alt: "Studio portrait after cobalt color finishing",
    width: 1024,
    height: 1536,
  } as const;

  const plumDress = {
    src: "/images/about/colorways/dress-color-plum.png",
    alt: "Studio portrait after plum color finishing",
    width: 1024,
    height: 1536,
  } as const;

  const processSteps = [
    {
      title: "Brief and file intake",
      navTitle: "Brief intake",
      timing: "Project start",
      description:
        "We review your source files, references, volume, output formats, and delivery priorities before production begins.",
      images: [
        previewMedia.editingWorkspace,
        originalDress,
        previewMedia.studioPortrait,
      ],
    },
    {
      title: "Reference alignment",
      navTitle: "Reference",
      timing: "Before production",
      description:
        "A sample image defines the approved finish, so color, texture, crop, and detail treatment are clear from the start.",
      images: [
        previewMedia.perfumeShadow,
        emeraldDress,
        previewMedia.jewelryDetail,
      ],
    },
    {
      title: "Team assignment",
      navTitle: "Team assignment",
      timing: "Production setup",
      description:
        "The project manager routes each batch to specialists whose experience matches the service and visual standard required.",
      images: [
        previewMedia.monochromePortrait,
        previewMedia.editingWorkspace,
        previewMedia.redStudioPortrait,
      ],
    },
    {
      title: "Specialist editing",
      navTitle: "Editing",
      timing: "Active production",
      description:
        "Editors work from the approved reference while preserving consistent naming, dimensions, color, and finishing across the batch.",
      images: [
        previewMedia.videoColorGrading,
        cobaltDress,
        previewMedia.product3dModel,
      ],
    },
    {
      title: "Quality review",
      navTitle: "Quality review",
      timing: "Before delivery",
      description:
        "A separate review checks detail, consistency, technical specifications, and the agreed reference before files leave the studio.",
      images: [
        previewMedia.jewelryMacro,
        plumDress,
        previewMedia.perfumeStillLife,
      ],
    },
    {
      title: "Delivery and feedback",
      navTitle: "Delivery",
      timing: "Final handoff",
      description:
        "Final files arrive organised and ready to use, with one clear feedback path for any consolidated finishing notes.",
      images: [emeraldDress, cobaltDress, plumDress],
    },
  ] as const;

  const timelineMotion = { position: 0 };

  function createTimelinePath(position: number) {
    const center = (position + 0.5) * 200;
    const curveStart = center - 58;
    const curveEnd = center + 58;

    return `M-2400 42 H${curveStart} C${center - 30} 42 ${center - 28} 10 ${center} 10 C${center + 28} 10 ${center + 30} 42 ${curveEnd} 42 H1200`;
  }

  let section: HTMLElement;
  let stage: HTMLElement;
  let content: HTMLElement;
  let timelinePath: SVGPathElement;
  let tabs: HTMLButtonElement[] = [];
  let activeIndex = $state(0);
  let indicatorIndex = $state(0);
  let animateTo: ((index: number) => void) | undefined;
  let moveTimeline: ((index: number) => void) | undefined;
  let killTimelineMotion: (() => void) | undefined;
  let activeTransition: { kill: () => void } | undefined;
  let transitionVersion = 0;

  function showStep(index: number) {
    const nextIndex = (index + processSteps.length) % processSteps.length;
    if (nextIndex === indicatorIndex) return;

    indicatorIndex = nextIndex;
    if (moveTimeline) moveTimeline(nextIndex);
    else {
      timelineMotion.position = nextIndex;
      timelinePath?.setAttribute("d", createTimelinePath(nextIndex));
    }
    if (animateTo) animateTo(nextIndex);
    else activeIndex = nextIndex;
  }

  function handleTabKeydown(event: KeyboardEvent, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (index + direction + processSteps.length) % processSteps.length;
    tabs[nextIndex]?.focus();
    showStep(nextIndex);
  }

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;
    const preloadObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        const imageSources = new Set(
          processSteps.flatMap((step) => step.images.map((image) => image.src)),
        );
        imageSources.forEach((src) => {
          const preloadImage = new window.Image();
          preloadImage.src = src;
        });
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    preloadObserver.observe(section);

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !stage || !content) return;

      const { gsap } = runtime;
      killTimelineMotion = () => gsap.killTweensOf(timelineMotion);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      context = gsap.context(() => {
        moveTimeline = (index: number) => {
          if (reduceMotion) {
            timelineMotion.position = index;
            timelinePath.setAttribute("d", createTimelinePath(index));
            return;
          }

          gsap.killTweensOf(timelineMotion);
          gsap.to(timelineMotion, {
            position: index,
            duration: 0.58,
            ease: "power2.inOut",
            overwrite: true,
            onUpdate: () => {
              timelinePath.setAttribute(
                "d",
                createTimelinePath(timelineMotion.position),
              );
            },
          });
        };

        if (!reduceMotion) {
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section,
                start: "top 92%",
                end: "top 28%",
                scrub: 0.82,
              },
            })
            .from(".process-intro > *", {
              y: 42,
              autoAlpha: 0.12,
              duration: 0.42,
              stagger: 0.065,
            })
            .from(
              ".process-images-left .process-image",
              {
                x: -72,
                y: 44,
                scale: 0.91,
                autoAlpha: 0.16,
                duration: 0.58,
                stagger: 0.08,
              },
              0.04,
            )
            .from(
              ".process-image-right",
              {
                x: 72,
                y: 38,
                scale: 0.92,
                autoAlpha: 0.16,
                duration: 0.58,
              },
              0.06,
            )
            .from(
              ".process-tabs > button",
              {
                y: 26,
                autoAlpha: 0.1,
                duration: 0.34,
                stagger: 0.045,
              },
              0.34,
            );

          gsap.fromTo(
            ".process-orb-left",
            { x: -54, y: -34, scale: 0.88 },
            {
              x: 34,
              y: 58,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );

          gsap.fromTo(
            ".process-orb-right",
            { x: 48, y: 40, scale: 1.04 },
            {
              x: -38,
              y: -52,
              scale: 0.9,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.72,
              },
            },
          );
        }

        animateTo = (index: number) => {
          if (reduceMotion) {
            activeIndex = index;
            return;
          }

          transitionVersion += 1;
          const currentTransition = transitionVersion;
          activeTransition?.kill();

          const outgoingLeft = section.querySelectorAll(
            ".process-images-left .process-image",
          );
          const outgoingRight = section.querySelector(".process-image-right");

          gsap.killTweensOf([outgoingLeft, outgoingRight, content]);
          activeTransition = gsap
            .timeline({
              onComplete: async () => {
                if (currentTransition !== transitionVersion) return;

                activeIndex = index;
                await tick();

                const incomingLeft = section.querySelectorAll(
                  ".process-images-left .process-image",
                );
                const incomingRight = section.querySelector(
                  ".process-image-right",
                );

                activeTransition = gsap
                  .timeline({
                    onComplete: () => {
                      activeTransition = undefined;
                    },
                  })
                  .fromTo(
                    incomingLeft,
                    { x: -76, autoAlpha: 0 },
                    {
                      x: 0,
                      autoAlpha: 1,
                      duration: 0.68,
                      stagger: 0.08,
                      ease: "power3.out",
                      clearProps: "transform,opacity,visibility",
                    },
                    0,
                  )
                  .fromTo(
                    content,
                    { y: 22, autoAlpha: 0 },
                    {
                      y: 0,
                      autoAlpha: 1,
                      duration: 0.58,
                      ease: "power3.out",
                      clearProps: "transform,opacity,visibility",
                    },
                    0.08,
                  )
                  .fromTo(
                    incomingRight,
                    { x: 76, y: 24, autoAlpha: 0 },
                    {
                      x: 0,
                      y: 0,
                      autoAlpha: 1,
                      duration: 0.72,
                      ease: "power3.out",
                      clearProps: "transform,opacity,visibility",
                    },
                    0.04,
                  );
              },
            })
            .to(
              outgoingLeft,
              {
                x: -48,
                autoAlpha: 0,
                duration: 0.28,
                stagger: 0.035,
                ease: "power2.in",
              },
              0,
            )
            .to(
              content,
              {
                y: -14,
                autoAlpha: 0,
                duration: 0.24,
                ease: "power2.in",
              },
              0,
            )
            .to(
              outgoingRight,
              {
                x: 48,
                y: -18,
                autoAlpha: 0,
                duration: 0.3,
                ease: "power2.in",
              },
              0,
            );
        };
      }, section);
    });

    return () => {
      active = false;
      transitionVersion += 1;
      activeTransition?.kill();
      killTimelineMotion?.();
      animateTo = undefined;
      moveTimeline = undefined;
      killTimelineMotion = undefined;
      preloadObserver.disconnect();
      context?.revert();
    };
  });
</script>

<section
  id="production-process"
  bind:this={section}
  aria-labelledby="production-process-title"
  class="process-section overflow-hidden bg-brand-light text-brand-dark"
>
  <div class="process-orb process-orb-left" aria-hidden="true"></div>
  <div class="process-orb process-orb-right" aria-hidden="true"></div>

  <div class="site-shell process-shell">
    <div
      bind:this={stage}
      id="production-process-panel"
      class="process-stage"
      role="tabpanel"
      aria-labelledby={`production-process-tab-${activeIndex}`}
    >
      <div class="process-images process-images-left" aria-hidden="true">
        <figure class="process-image process-image-left-back">
          <img
            src={processSteps[activeIndex].images[0].src}
            alt=""
            width={processSteps[activeIndex].images[0].width}
            height={processSteps[activeIndex].images[0].height}
            loading="lazy"
          />
        </figure>
        <figure class="process-image process-image-left-front">
          <img
            src={processSteps[activeIndex].images[1].src}
            alt=""
            width={processSteps[activeIndex].images[1].width}
            height={processSteps[activeIndex].images[1].height}
            loading="lazy"
          />
        </figure>
      </div>

      <div bind:this={content} class="process-intro">
        <p>{processSteps[activeIndex].timing}</p>
        <h2 id="production-process-title">
          {processSteps[activeIndex].title}
        </h2>
        <div class="process-rule" aria-hidden="true"></div>
        <p>{processSteps[activeIndex].description}</p>
      </div>

      <figure class="process-image process-image-right" aria-hidden="true">
        <img
          src={processSteps[activeIndex].images[2].src}
          alt=""
          width={processSteps[activeIndex].images[2].width}
          height={processSteps[activeIndex].images[2].height}
          loading="lazy"
        />
      </figure>
    </div>

    <div class="process-navigation">
      <div
        class="process-tabs"
        role="tablist"
        aria-label="Production workflow stages"
      >
        <svg
          class="process-timeline-line"
          viewBox="0 0 1200 54"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path bind:this={timelinePath} d={createTimelinePath(0)} />
        </svg>

        {#each processSteps as step, index (step.title)}
          <button
            bind:this={tabs[index]}
            id={`production-process-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={indicatorIndex === index}
            aria-controls="production-process-panel"
            tabindex={indicatorIndex === index ? 0 : -1}
            class:active={indicatorIndex === index}
            onclick={() => showStep(index)}
            onkeydown={(event) => handleTabKeydown(event, index)}
          >
            <span>{step.navTitle}</span>
            <i aria-hidden="true"></i>
          </button>
        {/each}

        <div
          class="active-step-indicator"
          style={`--active-step: ${indicatorIndex}`}
          aria-hidden="true"
        >
          <i></i>
          <b>{String(indicatorIndex + 1).padStart(2, "0")}</b>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .process-section {
    position: relative;
    padding-block: clamp(3.75rem, 6vw, 6.25rem);
  }

  .process-shell {
    position: relative;
    z-index: 1;
  }

  .process-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .process-orb-left {
    top: 8%;
    left: -14rem;
    width: 34rem;
    height: 34rem;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--color-brand-green) 9%, transparent),
      transparent 70%
    );
  }

  .process-orb-right {
    right: -16rem;
    bottom: -18rem;
    width: 40rem;
    height: 40rem;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--color-brand-green) 7%, transparent),
      transparent 70%
    );
  }

  .process-stage {
    display: grid;
    min-height: clamp(29rem, 42vw, 36rem);
    grid-template-areas:
      "left"
      "copy"
      "right";
    gap: 2rem;
    align-items: center;
  }

  .process-images-left {
    position: relative;
    grid-area: left;
    min-height: 17rem;
  }

  .process-image {
    overflow: hidden;
    border-radius: 1rem;
    background: var(--color-brand-mist);
    box-shadow: 0 1.25rem 3.5rem
      color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    will-change: transform, opacity;
  }

  .process-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .process-image:hover img {
    transform: scale(1.045);
  }

  .process-image-left-back {
    position: absolute;
    top: 0;
    right: 8%;
    width: 58%;
    height: 11rem;
  }

  .process-image-left-front {
    position: absolute;
    bottom: 0;
    left: 6%;
    width: 62%;
    height: 13rem;
  }

  .process-intro {
    grid-area: copy;
    max-width: 38rem;
    margin-inline: auto;
    text-align: center;
  }

  .process-intro > p:first-child {
    font-size: 0.82rem;
    color: color-mix(in srgb, var(--color-brand-dark) 58%, transparent);
  }

  .process-intro h2 {
    max-width: 16ch;
    margin: 1.2rem auto 0;
    font-family: var(--font-sans);
    font-size: clamp(2.15rem, 4vw, 4.25rem);
    font-weight: 500;
    line-height: 1.02;
    letter-spacing: -0.052em;
  }

  .process-rule {
    width: 2.5rem;
    height: 1px;
    margin: 1.5rem auto;
    background: var(--color-brand-green);
  }

  .process-intro > p:last-child {
    max-width: 36rem;
    margin-inline: auto;
    font-size: 0.88rem;
    line-height: 1.7;
    color: color-mix(in srgb, var(--color-brand-dark) 58%, transparent);
  }

  .process-image-right {
    grid-area: right;
    width: min(72vw, 18rem);
    height: 20rem;
    justify-self: center;
  }

  .process-navigation {
    position: relative;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    overflow-x: auto;
    background: var(--color-brand-light);
    padding: 1.25rem 0 0.5rem;
    scrollbar-width: none;
  }

  .process-navigation::-webkit-scrollbar {
    display: none;
  }

  .process-tabs {
    position: relative;
    display: grid;
    width: calc(100% - 2rem);
    max-width: 90rem;
    min-width: 58rem;
    margin-inline: auto;
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .process-tabs button {
    position: relative;
    z-index: 1;
    min-height: 7.8rem;
    padding-inline: 0.5rem;
    color: color-mix(in srgb, var(--color-brand-dark) 52%, transparent);
    text-align: center;
    transition: color 240ms ease;
  }

  .process-tabs button:hover,
  .process-tabs button.active {
    color: var(--color-brand-dark);
  }

  .process-tabs button > span {
    position: absolute;
    top: 0.2rem;
    right: 0.35rem;
    left: 0.35rem;
    font-size: 0.78rem;
    letter-spacing: 0.01em;
  }

  .process-timeline-line {
    position: absolute;
    right: 0;
    bottom: 1rem;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 3.5rem;
    overflow: visible;
    pointer-events: none;
  }

  .process-timeline-line path {
    fill: none;
    stroke: color-mix(in srgb, var(--color-brand-dark) 72%, transparent);
    stroke-width: 1.35;
    vector-effect: non-scaling-stroke;
  }

  .process-tabs button > i {
    position: absolute;
    bottom: 3.48rem;
    left: 50%;
    z-index: 2;
    display: block;
    width: 0.7rem;
    height: 0.7rem;
    transform: translateX(-50%);
    border: 1px solid var(--color-brand-dark);
    border-radius: 50%;
    background: var(--color-brand-light);
    transition:
      transform 280ms ease,
      opacity 180ms ease,
      background-color 280ms ease;
  }

  .process-tabs button.active > i {
    opacity: 0;
  }

  .active-step-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 3;
    width: calc(100% / 6);
    height: 7.8rem;
    transform: translateX(calc(var(--active-step) * 100%));
    pointer-events: none;
    transition: transform 580ms cubic-bezier(0.65, 0, 0.35, 1);
    will-change: transform;
  }

  .active-step-indicator > i {
    position: absolute;
    bottom: 3.35rem;
    left: 50%;
    z-index: 2;
    width: 1rem;
    height: 1rem;
    transform: translateX(-50%);
    border-radius: 50%;
    background: var(--color-brand-dark);
  }

  .active-step-indicator > b {
    position: absolute;
    bottom: 0.1rem;
    left: 50%;
    z-index: 2;
    display: grid;
    width: 2rem;
    height: 2rem;
    place-items: center;
    border: 1px solid transparent;
    border-radius: 50%;
    background: var(--color-brand-light);
    font-family: var(--font-mono);
    font-size: 0.55rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    transform: translateX(-50%) translateY(0.15rem);
    border-color: var(--color-brand-dark);
  }

  .process-tabs button:focus-visible {
    border-radius: 0.5rem;
    outline: 2px solid var(--color-brand-green);
    outline-offset: 0.25rem;
  }

  @media (min-width: 768px) {
    .process-stage {
      grid-template-areas: "left copy right";
      grid-template-columns: minmax(15rem, 0.78fr) minmax(26rem, 1.2fr) minmax(
          15rem,
          0.78fr
        );
      gap: clamp(2rem, 5vw, 6rem);
    }

    .process-images-left {
      min-height: 25rem;
    }

    .process-image-left-back {
      right: 0;
      width: 68%;
      height: 12.5rem;
    }

    .process-image-left-front {
      left: 0;
      width: 72%;
      height: 17rem;
    }

    .process-image-right {
      width: 78%;
      max-width: 19rem;
      height: 22rem;
    }
  }

  @media (max-width: 767px) {
    .process-stage {
      min-height: auto;
    }

    .process-intro {
      order: -1;
    }

    .process-image-right {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .process-stage,
    .process-image,
    .process-tabs > * {
      transform: none !important;
      opacity: 1 !important;
    }

    .process-image img,
    .process-tabs button,
    .process-tabs button > i,
    .active-step-indicator {
      transition: none;
    }
  }
</style>
