<script lang="ts">
  import { resolve } from "$app/paths";
  import { onMount } from "svelte";
  import { Layers3, Route, ShieldCheck, UsersRound } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { aboutOrbitCards } from "$lib/content/about-orbit";

  const frameRotations = [-2, 1, -1.5, 3, -2, 1.5, -1, 2] as const;
  const stackLayout = [
    { x: -38, y: -30, rotation: -7, scale: 0.88, zIndex: 44 },
    { x: 34, y: -28, rotation: 6, scale: 0.86, zIndex: 43 },
    { x: -54, y: 18, rotation: -10, scale: 0.84, zIndex: 42 },
    { x: 0, y: 0, rotation: 0, scale: 1, zIndex: 50 },
    { x: 52, y: 20, rotation: 9, scale: 0.82, zIndex: 41 },
    { x: -12, y: 8, rotation: -3, scale: 0.78, zIndex: 38 },
    { x: 10, y: 12, rotation: 3, scale: 0.76, zIndex: 37 },
    { x: 0, y: 18, rotation: 1, scale: 0.74, zIndex: 36 },
  ] as const;
  const totalSpinAngle = Math.PI * 0.75;

  const assurances = [
    {
      title: "Specialist routing",
      description:
        "Each brief moves to the people whose craft matches the image, format, and finishing requirement.",
      icon: UsersRound,
    },
    {
      title: "Reference-led batches",
      description:
        "An agreed first frame and shared finishing rules keep larger sets visually connected.",
      icon: Layers3,
    },
    {
      title: "Review checkpoints",
      description:
        "Quality review happens within the workflow, before final files are organised for handoff.",
      icon: ShieldCheck,
    },
    {
      title: "Workflow fit",
      description:
        "We work with established naming, review, transfer, and delivery conventions.",
      icon: Route,
    },
  ] as const;

  let sectionRef: HTMLElement;
  let orbitStageRef: HTMLElement;
  let stackGroupRef: HTMLElement;
  let centerTextRef: HTMLElement;
  let assurancePanelRef: HTMLElement;
  let pathLineRef: HTMLElement;
  let pathSignalRef: HTMLElement;
  let stackHoverRef: HTMLElement;
  let assuranceRows: HTMLElement[] = [];

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (
        !active ||
        !runtime ||
        !sectionRef ||
        !orbitStageRef ||
        !stackGroupRef ||
        !centerTextRef ||
        !assurancePanelRef ||
        !pathLineRef ||
        !pathSignalRef ||
        !stackHoverRef
      )
        return;

      const { gsap, ScrollTrigger } = runtime;

      context = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".orbit-card-item");
        const cardVisuals =
          gsap.utils.toArray<HTMLElement>(".orbit-card-visual");
        const totalCards = cards.length;
        const media = gsap.matchMedia();

        const getStageSize = () => ({
          width: orbitStageRef.clientWidth,
          height: orbitStageRef.clientHeight,
        });

        const getFramePosition = (
          index: number,
          total: number,
          width: number,
          height: number,
        ) => {
          const radiusX = width * 0.39;
          const radiusY = height * 0.56;
          const angle = (index / total) * (Math.PI * 2) - Math.PI / 2;

          return {
            x: Math.cos(angle) * radiusX,
            y: Math.sin(angle) * radiusY,
          };
        };

        const placeFrame = (card: HTMLElement, index: number) => {
          const { width, height } = getStageSize();
          const position = getFramePosition(index, totalCards, width, height);

          gsap.set(card, {
            x: position.x,
            y: position.y,
            rotation: frameRotations[index],
            scale: 1,
            zIndex: totalCards - index,
          });
        };

        const placeWheel = (
          motionProgress: number,
          spinProgress: number,
          stackProgress: number,
        ) => {
          const { width, height } = getStageSize();
          const initialRadiusX = width * 0.39;
          const initialRadiusY = height * 0.56;
          const finalRadius = Math.min(width * 0.115, height * 0.24, 160);
          const radiusX = gsap.utils.interpolate(
            initialRadiusX,
            finalRadius,
            motionProgress,
          );
          const radiusY = gsap.utils.interpolate(
            initialRadiusY,
            finalRadius,
            motionProgress,
          );
          const wheelCenterX = gsap.utils.interpolate(
            0,
            -Math.min(width * 0.27, 405),
            motionProgress,
          );
          const cardScale = gsap.utils.interpolate(1, 0.58, motionProgress);
          const stackBaseScale = gsap.utils.clamp(1.6, 2.1, 1900 / width);
          const spinAngle = spinProgress * totalSpinAngle;

          cards.forEach((card, index) => {
            const baseAngle =
              (index / totalCards) * (2 * Math.PI) - Math.PI / 2;
            const currentAngle = baseAngle + spinAngle;
            const layer = stackLayout[index];
            const wheelX = wheelCenterX + Math.cos(currentAngle) * radiusX;
            const wheelY = Math.sin(currentAngle) * radiusY;
            const wheelRotation = gsap.utils.interpolate(
              frameRotations[index],
              Math.sin(currentAngle) * 8,
              motionProgress,
            );

            gsap.set(card, {
              x: gsap.utils.interpolate(
                wheelX,
                wheelCenterX + layer.x,
                stackProgress,
              ),
              y: gsap.utils.interpolate(wheelY, layer.y, stackProgress),
              rotation: gsap.utils.interpolate(
                wheelRotation,
                layer.rotation,
                stackProgress,
              ),
              scale: gsap.utils.interpolate(
                cardScale,
                stackBaseScale * layer.scale,
                stackProgress,
              ),
              zIndex: stackProgress > 0.08 ? layer.zIndex : totalCards - index,
              autoAlpha: 1,
            });
          });
        };

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            cards.forEach(placeFrame);
            gsap.set(centerTextRef, { autoAlpha: 1, scale: 1, y: 0 });
            gsap.set(stackHoverRef, { pointerEvents: "none" });

            const frontVisual = cardVisuals[3];
            const depthVisuals = [
              cardVisuals[0],
              cardVisuals[1],
              cardVisuals[2],
              cardVisuals[4],
            ];
            const depthDirections = [
              { x: -8, y: -4 },
              { x: 8, y: -4 },
              { x: -10, y: 5 },
              { x: 10, y: 5 },
            ] as const;

            const groupTiltX = gsap.quickTo(stackGroupRef, "rotationX", {
              duration: 0.35,
              ease: "power2.out",
            });
            const groupTiltY = gsap.quickTo(stackGroupRef, "rotationY", {
              duration: 0.35,
              ease: "power2.out",
            });
            const groupScale = gsap.quickTo(stackGroupRef, "scale", {
              duration: 0.35,
              ease: "power2.out",
            });
            const frontScale = gsap.quickTo(frontVisual, "scale", {
              duration: 0.35,
              ease: "power2.out",
            });
            const layerDepth = cards.map((card) => ({
              z: gsap.quickTo(card, "z", {
                duration: 0.4,
                ease: "power2.out",
              }),
            }));
            const depthControls = depthVisuals.map((visual) => ({
              x: gsap.quickTo(visual, "x", {
                duration: 0.4,
                ease: "power2.out",
              }),
              y: gsap.quickTo(visual, "y", {
                duration: 0.4,
                ease: "power2.out",
              }),
            }));

            const handleStackPointerMove = (event: PointerEvent) => {
              if (event.pointerType !== "mouse") return;

              const bounds = stackHoverRef.getBoundingClientRect();
              const normX = (event.clientX - bounds.left) / bounds.width - 0.5;
              const normY = (event.clientY - bounds.top) / bounds.height - 0.5;

              groupTiltX(-normY * 8);
              groupTiltY(normX * 8);
              groupScale(1.015);
              frontScale(1.012);

              layerDepth.forEach((control, index) => {
                control.z(index === 3 ? 28 : -(index % 3) * 3);
              });

              depthControls.forEach((control, index) => {
                const direction = depthDirections[index];
                control.x(direction.x + normX * 5);
                control.y(direction.y + normY * 4);
              });
            };

            const resetStackHover = () => {
              groupTiltX(0);
              groupTiltY(0);
              groupScale(1);
              frontScale(1);

              layerDepth.forEach((control) => {
                control.z(0);
              });

              depthControls.forEach((control) => {
                control.x(0);
                control.y(0);
              });
            };

            stackHoverRef.addEventListener(
              "pointermove",
              handleStackPointerMove,
            );
            stackHoverRef.addEventListener("pointerleave", resetStackHover);

            gsap
              .timeline({
                scrollTrigger: {
                  id: "about-orbit-gallery-entrance",
                  trigger: sectionRef,
                  start: "top 88%",
                  end: "top top+=70",
                  scrub: 0.55,
                  refreshPriority: 120,
                  invalidateOnRefresh: true,
                },
              })
              .fromTo(
                cardVisuals,
                {
                  autoAlpha: 0,
                  y: (index) => 68 + (index % 3) * 20,
                  scale: 0.88,
                  rotation: (index) => (index % 2 === 0 ? -4 : 4),
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  rotation: 0,
                  duration: 1,
                  stagger: {
                    each: 0.035,
                    from: "edges",
                  },
                  ease: "power2.out",
                },
                0,
              )
              .fromTo(
                centerTextRef,
                {
                  autoAlpha: 0,
                  y: 34,
                  scale: 0.98,
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.72,
                  ease: "power2.out",
                },
                0.16,
              );

            const orbitProxy = { motion: 0, spin: 0, stack: 0 };
            const timeline = gsap.timeline({
              scrollTrigger: {
                id: "about-orbit-gallery-pin",
                trigger: sectionRef,
                start: "top top+=70",
                end: "+=250%",
                pin: true,
                pinSpacing: true,
                scrub: 0.5,
                anticipatePin: 1,
                refreshPriority: 110,
                invalidateOnRefresh: true,
              },
            });

            const renderCards = () => {
              placeWheel(orbitProxy.motion, orbitProxy.spin, orbitProxy.stack);
            };

            timeline
              .to(
                orbitProxy,
                {
                  spin: 1,
                  duration: 1.12,
                  ease: "none",
                  onUpdate: renderCards,
                },
                0,
              )
              .to(
                orbitProxy,
                {
                  stack: 1,
                  duration: 0.5,
                  ease: "power3.inOut",
                  onUpdate: renderCards,
                },
                0.62,
              )
              .to(
                orbitProxy,
                {
                  motion: 1,
                  duration: 1.12,
                  ease: "power2.inOut",
                  onUpdate: renderCards,
                },
                0,
              )
              .to(
                centerTextRef,
                {
                  autoAlpha: 0,
                  y: -18,
                  scale: 0.97,
                  duration: 0.34,
                  ease: "power2.out",
                },
                0.14,
              )
              .fromTo(
                assurancePanelRef,
                {
                  autoAlpha: 0,
                  xPercent: 115,
                  y: 0,
                  yPercent: -50,
                },
                {
                  autoAlpha: 1,
                  xPercent: 0,
                  y: 0,
                  yPercent: -50,
                  duration: 0.5,
                  ease: "power2.inOut",
                },
                0.54,
              )
              .fromTo(
                pathLineRef,
                {
                  scaleY: 0,
                },
                {
                  scaleY: 1,
                  duration: 0.5,
                  ease: "none",
                },
                0.62,
              )
              .fromTo(
                assuranceRows,
                {
                  autoAlpha: 0,
                  x: 18,
                  y: 68,
                },
                {
                  autoAlpha: 1,
                  x: 0,
                  y: 0,
                  duration: 0.32,
                  stagger: 0.06,
                  ease: "power3.out",
                },
                0.68,
              )
              .fromTo(
                pathSignalRef,
                {
                  y: 0,
                },
                {
                  y: () =>
                    Math.max(
                      0,
                      pathLineRef.clientHeight - pathSignalRef.offsetHeight,
                    ),
                  duration: 0.5,
                  ease: "none",
                },
                0.62,
              )
              .set(stackHoverRef, { pointerEvents: "auto" }, 0.9);

            return () => {
              stackHoverRef.removeEventListener(
                "pointermove",
                handleStackPointerMove,
              );
              stackHoverRef.removeEventListener(
                "pointerleave",
                resetStackHover,
              );
              gsap.killTweensOf(cardVisuals);
            };
          },
        );

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: reduce)",
          () => {
            placeWheel(1, 1, 1);
            gsap.set(centerTextRef, { autoAlpha: 0 });
            gsap.set(assurancePanelRef, {
              autoAlpha: 1,
              x: 0,
              xPercent: 0,
              y: 0,
              yPercent: -50,
            });
            gsap.set(assuranceRows, { autoAlpha: 1, x: 0, y: 0 });
            gsap.set(pathLineRef, { scaleY: 1 });
            gsap.set(pathSignalRef, { autoAlpha: 0 });
          },
        );

        return () => media.revert();
      }, sectionRef);

      requestAnimationFrame(() => {
        if (!active) return;
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="about-orbit-gallery"
  aria-label="Studio work and production advantages"
  bind:this={sectionRef}
  class="orbit-story relative min-h-[calc(100dvh-4.35rem)] overflow-visible bg-brand-paper text-brand-dark"
>
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(126,166,65,0.06)_0%,transparent_70%)]"
    aria-hidden="true"
  ></div>

  <div
    class="orbit-story-shell relative z-10 flex min-h-[calc(100dvh-4.35rem)] w-full items-center justify-center px-4"
  >
    <div
      bind:this={orbitStageRef}
      class="orbit-stage relative flex h-[34rem] w-full max-w-[92rem] items-center justify-center sm:h-[40rem] lg:h-[44rem]"
    >
      <div bind:this={stackGroupRef} class="orbit-stack-group">
        {#each aboutOrbitCards as card (card.id)}
          <div
            data-shape={card.shape}
            class="orbit-card-item absolute overflow-hidden rounded-xl shadow-xl transition-shadow duration-300 hover:shadow-2xl"
          >
            <figure
              class="orbit-card-visual relative h-full w-full overflow-hidden rounded-2xl bg-brand-dark"
            >
              <img
                src={card.media.src}
                alt={card.media.alt}
                width={card.media.width}
                height={card.media.height}
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover"
              />
            </figure>
          </div>
        {/each}
      </div>

      <div
        bind:this={stackHoverRef}
        class="stack-hover-zone"
        aria-hidden="true"
      ></div>

      <div
        bind:this={centerTextRef}
        class="orbit-center-copy relative z-30 max-w-[11rem] px-1 text-center sm:max-w-md sm:px-6"
      >
        <h2
          class="font-display text-2xl font-light leading-tight tracking-[-0.035em] text-brand-dark sm:text-4xl md:text-5xl lg:text-6xl"
        >
          AI <span class="italic text-brand-green">post-production</span>
        </h2>

        <p
          class="mt-4 text-xs leading-relaxed text-brand-dark/75 sm:text-sm md:text-base"
        >
          From AI-assisted image production and precision retouching to complex
          3D CGI rendering, our Dhaka studio combines intelligent workflows with
          human craft to create polished campaign assets.
        </p>

        <div class="mt-6 flex items-center justify-center gap-4">
          <a
            href={resolve("/portfolio")}
            class="inline-flex items-center rounded-lg bg-brand-dark px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-light transition-all hover:bg-brand-dark/90 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-brand-dark"
          >
            Explore Work →
          </a>
        </div>
      </div>

      <div
        id="why-trust-us"
        bind:this={assurancePanelRef}
        class="assurance-panel"
        aria-labelledby="why-trust-us-title"
      >
        <h2 id="why-trust-us-title" class="sr-only">
          Why choose Studio Click House
        </h2>

        <div bind:this={pathLineRef} class="quality-path" aria-hidden="true">
          <span bind:this={pathSignalRef} class="quality-signal"></span>
        </div>

        <div class="assurance-list">
          {#each assurances as assurance, index (assurance.title)}
            {@const Icon = assurance.icon}
            <article bind:this={assuranceRows[index]} class="assurance-row">
              <div class="assurance-icon">
                <Icon size={20} strokeWidth={1.45} aria-hidden="true" />
              </div>
              <div>
                <h3>{assurance.title}</h3>
                <p>{assurance.description}</p>
              </div>
              <span class="assurance-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .orbit-stage {
    perspective: 1100px;
  }

  .orbit-story {
    margin-top: clamp(5rem, 10vh, 8rem);
  }

  .orbit-stack-group {
    position: absolute;
    z-index: 20;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: 23% 50%;
    transform-style: preserve-3d;
    pointer-events: none;
    will-change: transform;
  }

  .orbit-card-item {
    width: clamp(7rem, 13vw, 12rem);
    aspect-ratio: 4 / 5;
    border-radius: 0.5rem;
    backface-visibility: hidden;
    transform-origin: center;
    transform-style: preserve-3d;
    will-change: transform;
  }

  .orbit-card-visual {
    transform-style: preserve-3d;
    will-change: transform, opacity;
  }

  .stack-hover-zone {
    position: absolute;
    z-index: 80;
    top: 50%;
    left: 23%;
    width: clamp(19rem, 38vw, 30rem);
    height: clamp(23rem, 45vw, 34rem);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .assurance-panel {
    position: absolute;
    top: 50%;
    right: clamp(0.5rem, 1.5vw, 1.75rem);
    width: min(46%, 42rem);
    padding-left: clamp(2rem, 3vw, 3.25rem);
    transform: translateY(-50%);
    will-change: transform, opacity;
  }

  .quality-path {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 1px;
    transform-origin: top;
    background: color-mix(in srgb, var(--color-brand-green) 28%, transparent);
    will-change: transform;
  }

  .quality-signal {
    position: absolute;
    top: 0;
    left: -0.3rem;
    width: 0.65rem;
    height: 0.65rem;
    border-radius: 50%;
    background: color-mix(
      in srgb,
      var(--color-brand-green) 68%,
      var(--color-brand-light)
    );
    box-shadow: 0 0 1.4rem
      color-mix(in srgb, var(--color-brand-green) 24%, transparent);
    will-change: transform;
  }

  .assurance-list {
    display: grid;
    border-top: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 14%, transparent);
  }

  .assurance-row {
    position: relative;
    display: grid;
    min-height: clamp(6.7rem, 14vh, 8.5rem);
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 1.15rem;
    align-items: start;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 14%, transparent);
    padding-block: clamp(1rem, 1.8vh, 1.35rem);
    will-change: transform, opacity;
  }

  .assurance-icon {
    display: grid;
    width: 2.65rem;
    height: 2.65rem;
    place-items: center;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-green) 18%, transparent);
    border-radius: 0.55rem;
    background: color-mix(in srgb, var(--color-brand-green) 6%, transparent);
    color: color-mix(
      in srgb,
      var(--color-brand-green) 72%,
      var(--color-brand-dark)
    );
  }

  .assurance-row h3 {
    font-size: 0.98rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .assurance-row p {
    max-width: 34rem;
    margin-top: 0.55rem;
    font-size: 0.76rem;
    line-height: 1.58;
    color: color-mix(in srgb, var(--color-brand-dark) 54%, transparent);
  }

  .assurance-index {
    padding-top: 0.2rem;
    font-family: var(--font-mono);
    font-size: 0.48rem;
    letter-spacing: 0.12em;
    color: var(--color-brand-green);
  }

  @media (max-width: 767px) {
    .orbit-story {
      min-height: auto;
      margin-top: 3rem;
      padding-block: 4rem;
    }

    .orbit-story-shell {
      min-height: auto;
      padding-inline: 1rem;
    }

    .orbit-stage {
      display: grid;
      height: auto;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.55rem;
    }

    .orbit-stack-group {
      display: contents;
    }

    .orbit-card-item {
      position: relative !important;
      width: 100%;
      border-radius: 0.4rem;
      transform: none !important;
    }

    .orbit-center-copy {
      order: -1;
      grid-column: 1 / -1;
      max-width: 29rem;
      margin: 0 auto 2.3rem;
      padding-inline: 1rem;
    }

    .assurance-panel {
      position: relative;
      top: auto;
      right: auto;
      width: 100%;
      grid-column: 1 / -1;
      margin-top: 2.5rem;
      padding-left: 0;
      transform: none;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .quality-path {
      display: none;
    }

    .assurance-row {
      min-height: auto;
      gap: 0.85rem;
      padding-block: 1.2rem;
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .assurance-row p {
      font-size: 0.73rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .orbit-card-item,
    .orbit-card-visual,
    .assurance-panel,
    .assurance-row,
    .quality-path,
    .quality-signal {
      will-change: auto;
    }
  }
</style>
