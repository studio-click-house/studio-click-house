<script lang="ts">
  import { resolve } from "$app/paths";
  import { onMount } from "svelte";
  import { ArrowUpRight, Compass, Wand2, ShieldCheck, Check } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { aboutOrbitCards } from "$lib/content/about-orbit";

  const frameRotations = [-2, 1, -1.5, 3, -2, 1.5, -1, 2] as const;
  const stackLayout = [
    { x: -20, y: -16, rotation: -4, scale: 0.90, zIndex: 44, z: 24 },
    { x: 18, y: -15, rotation: 3.5, scale: 0.88, zIndex: 43, z: 20 },
    { x: -28, y: 10, rotation: -5.5, scale: 0.86, zIndex: 42, z: 16 },
    { x: 0, y: 0, rotation: 0, scale: 1, zIndex: 50, z: 80 },
    { x: 26, y: 12, rotation: 5, scale: 0.84, zIndex: 41, z: 12 },
    { x: -6, y: 5, rotation: -1.5, scale: 0.82, zIndex: 38, z: 8 },
    { x: 5, y: 6, rotation: 1.5, scale: 0.80, zIndex: 37, z: 4 },
    { x: 0, y: 10, rotation: 0.5, scale: 0.78, zIndex: 36, z: 0 },
  ] as const;
  const totalSpinAngle = Math.PI * 0.75;

  const assurances = [
    {
      title: "Direction",
      description: "Every project starts with clear references, technical specifications and creative goals.",
      icon: Compass,
    },
    {
      title: "Specialist craft",
      description: "Dedicated editors matched to your project.",
      icon: Wand2,
    },
    {
      title: "Quality control",
      description: "Every file reviewed before delivery.",
      icon: ShieldCheck,
    },
    {
      title: "Delivery",
      description: "Production-ready assets delivered on time.",
      icon: Check,
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
        const frontCard = cards[3];

        let stackReady = false;
        let isHovering = false;
        type QuickToFn = ReturnType<typeof gsap.quickTo>;
        let cardQuickX: QuickToFn[] = [];
        let cardQuickY: QuickToFn[] = [];

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
          const stackBaseScale = gsap.utils.clamp(1.5, 1.85, 2000 / width);
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
              y: gsap.utils.interpolate(wheelY, layer.y - 36, stackProgress),
              z: gsap.utils.interpolate(0, layer.z, stackProgress),
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

          // Reactively manage pointer-events and hover states based on stackProgress
          const isStacked = stackProgress > 0.92;
          if (isStacked !== stackReady) {
            stackReady = isStacked;
            gsap.set(frontCard, { pointerEvents: isStacked ? "auto" : "none" });
            if (isStacked) {
              if (cardQuickX.length === 0) {
                cards.forEach((card) => {
                  gsap.set(card, { transformPerspective: 1000 });
                  cardQuickX.push(gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power2.out" }));
                  cardQuickY.push(gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power2.out" }));
                });
              }
            } else {
              isHovering = false;
              cardQuickX.forEach((fn) => fn(0));
              cardQuickY.forEach((fn) => fn(0));
            }
          }
        };

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            cards.forEach(placeFrame);
            gsap.set(centerTextRef, { autoAlpha: 1, scale: 1, y: 0 });
            gsap.set(stackGroupRef, { pointerEvents: "none" });
            gsap.set(cards, { pointerEvents: "none" });
            const entranceLayers = [...cardVisuals, centerTextRef];
            const storyLayers = [
              ...cards,
              stackGroupRef,
              assurancePanelRef,
              workflowHeaderRef,
              ...assuranceRows,
              workflowOutcomeRef,
              workflowLinkRef,
            ];
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

            const handlePointerEnter = (event: PointerEvent) => {
              if (!stackReady || event.pointerType !== "mouse") return;
              isHovering = true;
            };

            // Use orbitStageRef (no GSAP transforms) as stable coordinate space.
            const handlePointerMove = (event: PointerEvent) => {
              if (!stackReady || !isHovering || event.pointerType !== "mouse") return;
              if (cardQuickX.length === 0) return;

              const stageBounds = orbitStageRef.getBoundingClientRect();
              const halfWidth = stageBounds.width * 0.5;
              const normX = gsap.utils.clamp(
                -0.5, 0.5,
                (event.clientX - stageBounds.left - halfWidth * 0.5) / halfWidth,
              );
              const normY = gsap.utils.clamp(
                -0.5, 0.5,
                (event.clientY - stageBounds.top - stageBounds.height * 0.5) / stageBounds.height,
              );

              // Front card (index 3): full tilt
              // Back cards: opposite tilt scaled down to create parallax depth
              cards.forEach((_card, index) => {
                const isFront = index === 3;
                const tiltScale = isFront ? 1 : -(0.3 + (index % 3) * 0.1);
                cardQuickX[index]?.(-normY * 8 * tiltScale);
                cardQuickY[index]?.(normX * 8 * tiltScale);
              });
            };

            const handlePointerLeave = (event: PointerEvent) => {
              if (!stackReady || event.pointerType !== "mouse") return;
              isHovering = false;
              cardQuickX.forEach((fn) => fn(0));
              cardQuickY.forEach((fn) => fn(0));
            };

            // Listeners on window so they fire regardless of which child receives the pointer.
            // frontCard receives pointerenter/leave naturally for the enter/exit gate.
            frontCard.addEventListener("pointerenter", handlePointerEnter);
            window.addEventListener("pointermove", handlePointerMove);
            frontCard.addEventListener("pointerleave", handlePointerLeave);

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
              );

            return () => {
              stackReady = false;
              isHovering = false;
              cardQuickX = [];
              cardQuickY = [];
              frontCard.removeEventListener("pointerenter", handlePointerEnter);
              window.removeEventListener("pointermove", handlePointerMove);
              frontCard.removeEventListener("pointerleave", handlePointerLeave);
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
    <!-- MOBILE HEADER (visible on mobile, hidden on desktop) -->
    <header class="w-full pb-6 mb-6 block md:hidden">
      <span class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-brand-green">
        Our Production System
      </span>
      <h2
        class="font-display text-2xl font-light leading-tight tracking-[-0.03em] text-brand-dark mt-2"
      >
        Quality isn't the last step. It's every step.
      </h2>
    </header>

    <div
      bind:this={orbitStageRef}
      class="orbit-stage relative flex h-[34rem] w-full max-w-[92rem] items-center justify-center sm:h-[40rem] lg:h-[44rem]"
    >
      <!-- DESKTOP HEADER (Absolute positioned on the right top, hidden on mobile) -->
      <header
        bind:this={workflowHeaderRef}
        class="workflow-header absolute top-0 pb-4 hidden md:block"
        style="right: clamp(0.5rem, 1.5vw, 1.75rem); width: min(44%, 39rem);"
      >
        <span class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-brand-green">
          Our Production System
        </span>
        <h2
          class="font-display text-[clamp(1.8rem,3vw,2.8rem)] font-light leading-[1.05] tracking-[-0.045em] text-brand-dark mt-2"
        >
          Quality isn't the last step. It's every step.
        </h2>
      </header>

      <!-- Left: Stacked cards -->
      <div bind:this={stackGroupRef} class="orbit-stack-group">
        {#each aboutOrbitCards as card, index (card.id)}
          <div
            data-shape={card.shape}
            class="orbit-card-item absolute rounded-xl"
          >
            <figure
              class="orbit-card-visual relative h-full w-full overflow-hidden rounded-2xl bg-brand-dark shadow-xl transition-shadow duration-300 hover:shadow-2xl border border-brand-dark/5"
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

      <!-- Center: Orbit copy (only visible during spinning phase) -->
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
            class="group inline-flex min-h-[3rem] min-w-[10.5rem] items-center justify-between gap-4 border border-brand-dark rounded-[0.55rem] bg-brand-dark px-4 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.045em] text-brand-light transition-all duration-[280ms] ease-out hover:border-brand-green hover:bg-brand-green hover:text-brand-dark active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-brand-green focus-visible:outline-offset-[3px]"
          >
            <span>Explore Work</span>
            <ArrowUpRight
              size={15}
              strokeWidth={1.7}
              class="transition-transform duration-[280ms] group-hover:translate-x-[0.15rem] group-hover:-translate-y-[0.15rem]"
            />
          </a>
        </div>
      </div>

      <!-- Right: Process Timeline Milestones (slides in on scroll collapse) -->
      <div
        id="why-trust-us"
        bind:this={assurancePanelRef}
        class="assurance-panel"
        aria-label="Our Process"
      >

        <div class="assurance-list" aria-label="Our production milestones">
          {#each assurances as assurance, index (assurance.title)}
            {@const Icon = assurance.icon}
            <article bind:this={assuranceRows[index]} class="assurance-row">
              <span class="assurance-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div class="assurance-content">
                <div class="assurance-title-row">
                  <span class="assurance-row-icon"><Icon size={15} strokeWidth={1.5} /></span>
                  <h3>{assurance.title}</h3>
                </div>
                <p>{assurance.description}</p>
              </div>
            </article>
          {/each}
        </div>
      </div>

      <!-- DESKTOP FOOTER (Absolute positioned, hidden on mobile) -->
      <footer
        bind:this={workflowOutcomeRef}
        class="workflow-footer absolute bottom-0 left-0 w-full border-t border-brand-dark/10 pt-4 flex flex-row items-center justify-between gap-8 hidden md:flex"
      >
        <!-- Metrics Grid -->
        <div class="flex-1 grid grid-cols-4 gap-6 text-left">
          <div class="metric-item">
            <span class="block font-display text-[clamp(1.5rem,2vw,2.2rem)] font-light leading-none text-brand-dark">150+</span>
            <span class="block mt-1 font-mono text-[0.52rem] uppercase tracking-wider text-brand-dark/50">Creative Specialists</span>
          </div>
          <div class="metric-item">
            <span class="block font-display text-[clamp(1.5rem,2vw,2.2rem)] font-light leading-none text-brand-dark">10+ Years</span>
            <span class="block mt-1 font-mono text-[0.52rem] uppercase tracking-wider text-brand-dark/50">Proven Experience</span>
          </div>
          <div class="metric-item">
            <span class="block font-display text-[clamp(1.5rem,2vw,2.2rem)] font-light leading-none text-brand-dark">24/7</span>
            <span class="block mt-1 font-mono text-[0.52rem] uppercase tracking-wider text-brand-dark/50">Production Studio</span>
          </div>
          <div class="metric-item">
            <span class="block font-display text-[clamp(1.5rem,2vw,2.2rem)] font-light leading-none text-brand-dark">99%</span>
            <span class="block mt-1 font-mono text-[0.52rem] uppercase tracking-wider text-brand-dark/50">On-Time Delivery</span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="flex justify-end">
          <a
            bind:this={workflowLinkRef}
            href={resolve("/contact")}
            class="workflow-link !mt-0"
          >
            <span>Start a project</span>
            <span class="workflow-link-icon">
              <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </a>
        </div>
      </footer>
    </div>

    <!-- MOBILE FOOTER (visible on mobile, hidden on desktop) -->
    <footer
      class="w-full border-t border-brand-dark/10 pt-8 mt-8 flex flex-col gap-6 block md:hidden"
    >
      <div class="grid grid-cols-2 gap-6 text-left">
        <div class="metric-item">
          <span class="block font-display text-2xl font-light leading-none text-brand-dark">150+</span>
          <span class="block mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-brand-dark/50">Creative Specialists</span>
        </div>
        <div class="metric-item">
          <span class="block font-display text-2xl font-light leading-none text-brand-dark">10+ Years</span>
          <span class="block mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-brand-dark/50">Proven Experience</span>
        </div>
        <div class="metric-item">
          <span class="block font-display text-2xl font-light leading-none text-brand-dark">24/7</span>
          <span class="block mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-brand-dark/50">Production Studio</span>
        </div>
        <div class="metric-item">
          <span class="block font-display text-2xl font-light leading-none text-brand-dark">99%</span>
          <span class="block mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-brand-dark/50">On-Time Delivery</span>
        </div>
      </div>
      <div class="flex justify-start mt-2">
        <a
          href={resolve("/contact")}
          class="workflow-link !mt-0"
        >
          <span>Start a project</span>
          <span class="workflow-link-icon">
            <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </span>
        </a>
      </div>
    </footer>
  </div>
</section>

<style>
  .orbit-stage {
    perspective: 1100px;
  }

  .orbit-story {
    padding-block: clamp(4rem, 7vw, 7rem);
    background-image: radial-gradient(color-mix(in srgb, var(--color-brand-dark) 5%, transparent) 1px, transparent 1px);
    background-size: 28px 28px;
    position: relative;
  }

  .orbit-story::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 10% 30%, rgba(201, 255, 90, 0.12) 0%, transparent 45%),
                radial-gradient(circle at 90% 70%, rgba(126, 166, 65, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
    mask-image: linear-gradient(to bottom, transparent 0%, black 120px);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 120px);
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
  }

  .orbit-card-item {
    width: clamp(8.5rem, 14vw, 15rem);
    aspect-ratio: 4 / 5;
    border-radius: 0.6rem;
    backface-visibility: hidden;
    transform-origin: center;
    transform-style: preserve-3d;
  }

  .orbit-card-visual {
    transform-style: preserve-3d;
  }

  .assurance-panel {
    position: absolute;
    top: 50%;
    right: clamp(0.5rem, 1.5vw, 1.75rem);
    width: min(44%, 39rem);
    padding-left: 0;
    transform: translateY(-50%);
  }

  .assurance-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-top: 1px solid color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
  }

  .assurance-row {
    position: relative;
    display: grid;
    grid-template-columns: 2.2rem minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
    padding-block: 1.35rem;
    border-bottom: 1px solid color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
    transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), background-color 320ms ease;
  }

  .assurance-row:hover {
    transform: translateX(0.5rem);
    background-color: color-mix(in srgb, var(--color-brand-green) 4%, transparent);
  }

  .assurance-index {
    align-self: start;
    padding-top: 0.15rem;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--color-brand-green);
  }

  .assurance-content {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .assurance-title-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .assurance-row-icon {
    display: inline-flex;
    color: var(--color-brand-green);
  }

  .assurance-row h3 {
    font-family: var(--font-sans);
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    text-transform: capitalize;
    color: var(--color-brand-dark);
  }

  .assurance-row p {
    font-size: 0.76rem;
    line-height: 1.5;
    color: color-mix(in srgb, var(--color-brand-dark) 65%, transparent);
    max-width: 32rem;
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
    border-radius: 0.55rem;
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
    border-radius: 0.55rem;
    outline: 3px solid var(--color-brand-green);
    outline-offset: 3px;
  }

  @media (max-width: 767px) {
    .orbit-story {
      min-height: auto;
      margin-top: 0;
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
    .workflow-link {
      will-change: auto;
    }
  }
</style>
