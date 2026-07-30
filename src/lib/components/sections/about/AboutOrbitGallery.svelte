<script lang="ts">
  import { resolve } from "$app/paths";
  import { onMount } from "svelte";
  import { ArrowUpRight } from "lucide-svelte";
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
      title: "Direction",
      description:
        "References, finishing standards and campaign requirements aligned.",
    },
    {
      title: "Specialist craft",
      description:
        "Retouching, colour and compositing expertise matched to every image.",
    },
    {
      title: "Production control",
      description:
        "Every asset reviewed for accuracy, consistency and visual continuity.",
    },
    {
      title: "Delivery",
      description:
        "Organised, production-ready files prepared for every required channel.",
    },
  ] as const;

  let sectionRef: HTMLElement;
  let orbitStageRef: HTMLElement;
  let stackGroupRef: HTMLElement;
  let centerTextRef: HTMLElement;
  let assurancePanelRef: HTMLElement;
  let workflowHeaderRef: HTMLElement;
  let workflowOutcomeRef: HTMLElement;
  let workflowLinkRef: HTMLAnchorElement;
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
        !workflowHeaderRef ||
        !workflowOutcomeRef ||
        !workflowLinkRef
      )
        return;

      const { gsap, ScrollTrigger } = runtime;

      ScrollTrigger.getById("about-orbit-gallery-entrance")?.kill(true);
      ScrollTrigger.getById("about-orbit-gallery-pin")?.kill(true);

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
          const stackBaseScale = gsap.utils.clamp(1.85, 2.15, 2250 / width);
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
            gsap.set(stackGroupRef, { pointerEvents: "none" });
            gsap.set(cards, { pointerEvents: "none" });

            gsap
              .timeline({
                scrollTrigger: {
                  id: "about-orbit-gallery-entrance",
                  trigger: sectionRef,
                  start: "top 88%",
                  end: "top top+=70",
                  scrub: true,
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
            const frontCard = cards[3];
            const animateStackFan = (expanded: boolean) => {
              if (orbitProxy.stack < 0.9) return;

              const { width } = getStageSize();
              const stackCenterX = -Math.min(width * 0.27, 405);
              const stackBaseScale = gsap.utils.clamp(1.85, 2.15, 2250 / width);

              cards.forEach((card, index) => {
                const layer = stackLayout[index];
                const side =
                  layer.x === 0
                    ? index % 2 === 0
                      ? -1
                      : 1
                    : Math.sign(layer.x);
                const fanOffset =
                  index === 3 || !expanded ? 0 : side * (48 + (index % 3) * 12);

                gsap.to(card, {
                  x: stackCenterX + layer.x + fanOffset,
                  y: layer.y,
                  rotation:
                    layer.rotation + (expanded && index !== 3 ? side * 2.5 : 0),
                  scale:
                    stackBaseScale *
                    layer.scale *
                    (expanded && index === 3 ? 1.015 : 1),
                  duration: 0.42,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              });
            };
            const expandStack = () => animateStackFan(true);
            const collapseStack = () => animateStackFan(false);

            frontCard.addEventListener("pointerenter", expandStack);
            frontCard.addEventListener("pointerleave", collapseStack);

            const renderCards = () => {
              placeWheel(orbitProxy.motion, orbitProxy.spin, orbitProxy.stack);
            };

            const timeline = gsap.timeline({
              onUpdate: renderCards,
              scrollTrigger: {
                id: "about-orbit-gallery-pin",
                trigger: sectionRef,
                start: "top top+=70",
                end: () => `+=${window.innerHeight * 1.9}`,
                pin: true,
                pinSpacing: true,
                scrub: true,
                anticipatePin: 1,
                refreshPriority: 110,
                invalidateOnRefresh: true,
              },
            });

            timeline
              .to(
                orbitProxy,
                {
                  spin: 1,
                  duration: 0.84,
                  ease: "none",
                },
                0,
              )
              .to(
                orbitProxy,
                {
                  stack: 1,
                  duration: 0.34,
                  ease: "power3.inOut",
                },
                0.38,
              )
              .to(
                orbitProxy,
                {
                  motion: 1,
                  duration: 0.84,
                  ease: "power2.inOut",
                },
                0,
              )
              .to(
                centerTextRef,
                {
                  autoAlpha: 0,
                  y: -18,
                  scale: 0.97,
                  duration: 0.3,
                  ease: "power2.out",
                },
                0.12,
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
                  duration: 0.18,
                  ease: "none",
                },
                0.32,
              )
              .fromTo(
                workflowHeaderRef,
                {
                  autoAlpha: 0,
                  x: 52,
                },
                {
                  autoAlpha: 1,
                  x: 0,
                  duration: 0.18,
                  ease: "none",
                },
                0.38,
              )
              .fromTo(
                assuranceRows,
                {
                  autoAlpha: 0,
                  x: (index) => (index % 2 === 0 ? 54 : -34),
                },
                {
                  autoAlpha: 1,
                  x: 0,
                  duration: 0.14,
                  stagger: 0.055,
                  ease: "none",
                },
                0.46,
              )
              .fromTo(
                workflowOutcomeRef,
                {
                  autoAlpha: 0,
                  y: 14,
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.16,
                  ease: "none",
                },
                0.72,
              )
              .fromTo(
                workflowLinkRef,
                {
                  autoAlpha: 0,
                  x: 20,
                },
                {
                  autoAlpha: 1,
                  x: 0,
                  duration: 0.14,
                  ease: "none",
                },
                0.82,
              )
              .set(frontCard, { pointerEvents: "auto" }, 0.9);

            return () => {
              frontCard.removeEventListener("pointerenter", expandStack);
              frontCard.removeEventListener("pointerleave", collapseStack);
              gsap.killTweensOf(cards);
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
            gsap.set(
              [
                workflowHeaderRef,
                assuranceRows,
                workflowOutcomeRef,
                workflowLinkRef,
              ],
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
              },
            );
            gsap.set(cards, { pointerEvents: "none" });
            gsap.set(cards[3], { pointerEvents: "auto" });
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
  class="orbit-story relative min-h-[calc(100dvh-4.35rem)] overflow-visible bg-brand-light text-brand-dark"
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
        {#each aboutOrbitCards as card, index (card.id)}
          <div
            data-shape={card.shape}
            class="orbit-card-item absolute rounded-xl"
          >
            <figure
              class="orbit-card-visual relative h-full w-full overflow-hidden rounded-2xl bg-brand-dark shadow-xl transition-shadow duration-300 hover:shadow-2xl"
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
        <header bind:this={workflowHeaderRef} class="workflow-header">
          <h2 id="why-trust-us-title">Why choose us</h2>
          <p>Specialist craft. <em>One controlled workflow.</em></p>
        </header>

        <div class="assurance-list" aria-label="Our production workflow">
          {#each assurances as assurance, index (assurance.title)}
            <article bind:this={assuranceRows[index]} class="assurance-row">
              <span class="assurance-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{assurance.title}</h3>
                <p>{assurance.description}</p>
              </div>
            </article>
          {/each}
        </div>

        <div bind:this={workflowOutcomeRef} class="workflow-outcome">
          <p>
            One brief. One specialist workflow.
            <strong>One consistent visual system.</strong>
          </p>
          <span>
            Scalable image post-production for ecommerce, fashion, beauty and
            jewellery brands.
          </span>
        </div>

        <a
          bind:this={workflowLinkRef}
          href={resolve("/contact")}
          class="workflow-link"
        >
          <span>Start a project</span>
          <span class="workflow-link-icon">
            <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </span>
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .orbit-stage {
    perspective: 1100px;
  }

  .orbit-story {
    padding-top: clamp(5rem, 10vh, 8rem);
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
    width: clamp(8rem, 14vw, 14rem);
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

  .assurance-panel {
    position: absolute;
    top: 50%;
    right: clamp(0.5rem, 1.5vw, 1.75rem);
    width: min(44%, 39rem);
    padding-left: 0;
    transform: translateY(-50%);
    will-change: transform, opacity;
  }

  .workflow-header {
    margin-bottom: clamp(1rem, 2vh, 1.5rem);
    will-change: transform, opacity;
  }

  .workflow-header > h2 {
    font-family: var(--font-display);
    font-size: clamp(2rem, 3.2vw, 3.65rem);
    font-weight: 300;
    line-height: 0.94;
    letter-spacing: -0.045em;
  }

  .workflow-header > p {
    margin-top: 0.65rem;
    font-size: clamp(0.78rem, 1vw, 0.95rem);
    line-height: 1.4;
    color: color-mix(in srgb, var(--color-brand-dark) 62%, transparent);
  }

  .workflow-header > p em {
    color: var(--color-brand-green);
    font-style: normal;
    font-weight: 600;
  }

  .assurance-list {
    display: grid;
    gap: 0.15rem;
  }

  .assurance-row {
    position: relative;
    display: grid;
    min-height: clamp(3.7rem, 7.5vh, 4.5rem);
    grid-template-columns: 2.15rem minmax(0, 1fr);
    gap: 0.75rem;
    align-items: center;
    padding-block: 0.55rem;
    will-change: transform, opacity;
  }

  .assurance-row h3 {
    font-size: 0.92rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .assurance-row p {
    max-width: 31rem;
    margin-top: 0.22rem;
    font-size: 0.7rem;
    line-height: 1.45;
    color: color-mix(in srgb, var(--color-brand-dark) 54%, transparent);
  }

  .assurance-index {
    align-self: start;
    padding-top: 0.18rem;
    font-family: var(--font-mono);
    font-size: 0.52rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--color-brand-green);
  }

  .workflow-outcome {
    margin-top: clamp(0.75rem, 1.5vh, 1rem);
    border-radius: 0.65rem;
    padding: clamp(0.85rem, 1.5vw, 1.15rem);
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
    will-change: transform, opacity;
  }

  .workflow-outcome > p {
    font-family: var(--font-display);
    font-size: clamp(1rem, 1.35vw, 1.3rem);
    font-weight: 300;
    line-height: 1.12;
    letter-spacing: -0.025em;
  }

  .workflow-outcome strong {
    display: block;
    color: color-mix(
      in srgb,
      var(--color-brand-green) 72%,
      var(--color-brand-light)
    );
    font-weight: 400;
  }

  .workflow-outcome > span {
    display: block;
    max-width: 30rem;
    margin-top: 0.55rem;
    color: color-mix(in srgb, var(--color-brand-light) 65%, transparent);
    font-size: 0.66rem;
    line-height: 1.5;
  }

  .workflow-link {
    display: inline-flex;
    min-height: 3rem;
    min-width: 10.5rem;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.75rem;
    border: 1px solid var(--color-brand-dark);
    border-radius: 0.2rem;
    padding-inline: 1rem;
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
    font-family: var(--font-sans);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.045em;
    text-transform: uppercase;
    transition:
      color 280ms ease,
      background 280ms ease,
      border-color 280ms ease,
      transform 280ms ease;
    will-change: transform, opacity;
  }

  .workflow-link-icon {
    display: grid;
    place-items: center;
    color: currentColor;
  }

  .workflow-link :global(svg) {
    transition: transform 280ms ease;
  }

  .workflow-link:hover {
    border-color: var(--color-brand-green);
    background: var(--color-brand-green);
    color: var(--color-brand-dark);
  }

  .workflow-link:hover .workflow-link-icon,
  .workflow-link:focus-visible .workflow-link-icon {
    transform: translate(0.15rem, -0.15rem);
  }

  .workflow-link:active {
    transform: scale(0.98);
  }

  .workflow-link:focus-visible {
    border-radius: 0.25rem;
    outline: 3px solid var(--color-brand-green);
    outline-offset: 3px;
  }

  @media (max-width: 767px) {
    .orbit-story {
      min-height: auto;
      margin-top: 0;
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
    .workflow-header,
    .assurance-row,
    .workflow-outcome,
    .workflow-link {
      will-change: auto;
    }
  }
</style>
