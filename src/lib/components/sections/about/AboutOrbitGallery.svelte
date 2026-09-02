<script lang="ts">
  import { resolve } from "$app/paths";
  import { onMount } from "svelte";
  import {
    ArrowUpRight,
    Compass,
    Wand2,
    ShieldCheck,
    Check,
  } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { aboutOrbitCards } from "$lib/content/about-orbit";
  import { _ } from "svelte-i18n";

  const frameRotations = [-2, 1, -1.5, 3, -2, 1.5, -1, 2] as const;
  const stackLayout = [
    { x: -20, y: -16, rotation: -4, scale: 0.9, zIndex: 44, z: 24 },
    { x: 18, y: -15, rotation: 3.5, scale: 0.88, zIndex: 43, z: 20 },
    { x: -28, y: 10, rotation: -5.5, scale: 0.86, zIndex: 42, z: 16 },
    { x: 0, y: 0, rotation: 0, scale: 1, zIndex: 50, z: 80 },
    { x: 26, y: 12, rotation: 5, scale: 0.84, zIndex: 41, z: 12 },
    { x: -6, y: 5, rotation: -1.5, scale: 0.82, zIndex: 38, z: 8 },
    { x: 5, y: 6, rotation: 1.5, scale: 0.8, zIndex: 37, z: 4 },
    { x: 0, y: 10, rotation: 0.5, scale: 0.78, zIndex: 36, z: 0 },
  ] as const;
  const totalSpinAngle = Math.PI * 0.75;

  const assurances = [
    {
      step: "01",
      title: "Direction",
      description:
        "Every project starts with clear references, technical specifications and creative goals.",
      icon: Compass,
      cardIndex: 3,
      tag: "Direction & Framing",
    },
    {
      step: "02",
      title: "Specialist craft",
      description:
        "Dedicated editors and 3D CGI artists matched to your project requirements.",
      icon: Wand2,
      cardIndex: 1,
      tag: "Specialist Craft",
    },
    {
      step: "03",
      title: "Quality control",
      description:
        "Every file reviewed for immaculate skin texture, edge accuracy, and lighting consistency.",
      icon: ShieldCheck,
      cardIndex: 6,
      tag: "Macro Quality Review",
    },
    {
      step: "04",
      title: "Delivery",
      description:
        "Production-ready, multi-channel high-res assets delivered on time with strict SLA.",
      icon: Check,
      cardIndex: 0,
      tag: "Multi-Format Export",
    },
  ] as const;

  let activeStep = $state(0);
  let activeCardIndex = $state(3);
  let isInteractive = $state(false);

  let sectionRef: HTMLElement;
  let orbitStageRef: HTMLElement;
  let stackGroupRef: HTMLElement;
  let centerTextRef: HTMLElement;
  let assurancePanelRef: HTMLElement;
  let workflowHeaderRef: HTMLElement;
  let workflowOutcomeRef: HTMLElement;
  let workflowLinkRef: HTMLAnchorElement;
  let assuranceRows: HTMLElement[] = [];
  let triggerCardSelect: ((index: number) => void) | undefined;

  const getStackSlot = (cardIndex: number, currentFrontIndex: number) => {
    if (cardIndex === currentFrontIndex) {
      return stackLayout[3];
    }
    const otherSlots = [0, 1, 2, 4, 5, 6, 7];
    const offset = (cardIndex - currentFrontIndex + 8) % 8;
    const slotIdx = otherSlots[(offset - 1 + 7) % 7];
    return stackLayout[slotIdx];
  };

  function selectStep(stepIndex: number) {
    if (!isInteractive) return;
    activeStep = stepIndex;
    const targetCard = assurances[stepIndex].cardIndex;
    activeCardIndex = targetCard;
    triggerCardSelect?.(targetCard);
  }

  function onCardClick(cardIndex: number) {
    if (!isInteractive) return;
    const stepIdx = assurances.findIndex((a) => a.cardIndex === cardIndex);
    if (stepIdx !== -1) {
      selectStep(stepIdx);
    } else {
      activeCardIndex = cardIndex;
      triggerCardSelect?.(cardIndex);
    }
  }

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

        let stackReady = false;
        let isHovering = false;
        type QuickToFn = ReturnType<typeof gsap.quickTo>;
        let cardQuickX: QuickToFn[] = [];
        let cardQuickY: QuickToFn[] = [];

        const getStageSize = () => ({
          width: orbitStageRef?.clientWidth || window.innerWidth,
          height:
            orbitStageRef?.clientHeight ||
            Math.min(window.innerHeight * 0.75, 700),
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
            const layer = getStackSlot(index, activeCardIndex);
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
          const isStacked = stackProgress > 0.95;
          if (isStacked !== stackReady) {
            stackReady = isStacked;
            isInteractive = isStacked;
            cards.forEach((card) => {
              gsap.set(card, { pointerEvents: isStacked ? "auto" : "none" });
            });
            if (assurancePanelRef) {
              gsap.set(assurancePanelRef, {
                pointerEvents: isStacked ? "auto" : "none",
              });
            }
            if (isStacked) {
              if (cardQuickX.length === 0) {
                cards.forEach((card) => {
                  gsap.set(card, { transformPerspective: 1000 });
                  cardQuickX.push(
                    gsap.quickTo(card, "rotateX", {
                      duration: 0.5,
                      ease: "power2.out",
                    }),
                  );
                  cardQuickY.push(
                    gsap.quickTo(card, "rotateY", {
                      duration: 0.5,
                      ease: "power2.out",
                    }),
                  );
                });
              }
            } else {
              isHovering = false;
              cardQuickX.forEach((fn) => fn(0));
              cardQuickY.forEach((fn) => fn(0));
            }
          }
        };

        triggerCardSelect = (targetCardIndex: number) => {
          if (!stackReady) return;
          const { width } = getStageSize();
          const wheelCenterX = -Math.min(width * 0.27, 405);
          const stackBaseScale = gsap.utils.clamp(1.5, 1.85, 2000 / width);

          cards.forEach((card, index) => {
            const layer = getStackSlot(index, targetCardIndex);
            gsap.to(card, {
              x: wheelCenterX + layer.x,
              y: layer.y - 36,
              z: layer.z,
              rotation: layer.rotation,
              scale: stackBaseScale * layer.scale,
              zIndex: layer.zIndex,
              duration: 0.42,
              ease: "power2.out",
              overwrite: "auto",
            });
          });
        };

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            isInteractive = false;
            placeWheel(0, 0, 0);
            gsap.set(centerTextRef, { autoAlpha: 1, scale: 1, y: 0 });
            gsap.set(stackGroupRef, { pointerEvents: "none" });
            gsap.set(cards, { pointerEvents: "none" });
            gsap.set(assurancePanelRef, { pointerEvents: "none" });

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

            const handlePointerMove = (event: PointerEvent) => {
              if (!stackReady || !isHovering || event.pointerType !== "mouse")
                return;
              if (cardQuickX.length === 0) return;

              const stageBounds = orbitStageRef.getBoundingClientRect();
              const halfWidth = stageBounds.width * 0.5;
              const normX = gsap.utils.clamp(
                -0.5,
                0.5,
                (event.clientX - stageBounds.left - halfWidth * 0.5) /
                  halfWidth,
              );
              const normY = gsap.utils.clamp(
                -0.5,
                0.5,
                (event.clientY - stageBounds.top - stageBounds.height * 0.5) /
                  stageBounds.height,
              );

              cards.forEach((_card, index) => {
                const isFront = index === activeCardIndex;
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

            orbitStageRef.addEventListener("pointerenter", handlePointerEnter);
            window.addEventListener("pointermove", handlePointerMove);
            orbitStageRef.addEventListener("pointerleave", handlePointerLeave);

            const renderCards = () => {
              placeWheel(orbitProxy.motion, orbitProxy.spin, orbitProxy.stack);
            };

            const timeline = gsap.timeline({
              onUpdate: renderCards,
              scrollTrigger: {
                id: "about-orbit-gallery-pin",
                trigger: sectionRef,
                start: "top top+=70",
                end: () => `+=${window.innerHeight * 1.5}`,
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
              isInteractive = false;
              isHovering = false;
              cardQuickX = [];
              cardQuickY = [];
              triggerCardSelect = undefined;
              orbitStageRef?.removeEventListener("pointerenter", handlePointerEnter);
              window.removeEventListener("pointermove", handlePointerMove);
              orbitStageRef?.removeEventListener("pointerleave", handlePointerLeave);
              gsap.killTweensOf(cards);
              gsap.killTweensOf(cardVisuals);
            };
          },
        );

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: reduce)",
          () => {
            placeWheel(1, 1, 1);
            isInteractive = true;
            gsap.set(centerTextRef, { autoAlpha: 0 });
            gsap.set(assurancePanelRef, {
              autoAlpha: 1,
              x: 0,
              xPercent: 0,
              y: 0,
              yPercent: -50,
              pointerEvents: "auto",
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
            gsap.set(cards, { pointerEvents: "auto" });
          },
        );

        return () => media.revert();
      }, sectionRef);

      ScrollTrigger.refresh();
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
      <span
        class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-brand-green"
      >
        {$_('home.aboutOrbit.eyebrow')}
      </span>
      <h2
        class="font-display text-2xl font-light leading-tight tracking-[-0.03em] text-brand-dark mt-2"
      >
        {$_('home.aboutOrbit.heading')}
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
        <span
          class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-brand-green"
        >
          {$_('home.aboutOrbit.eyebrow')}
        </span>
        <h2
          class="font-display text-[clamp(1.8rem,3vw,2.8rem)] font-light leading-[1.05] tracking-[-0.045em] text-brand-dark mt-2"
        >
          {$_('home.aboutOrbit.heading')}
        </h2>
      </header>

      <!-- Left: Stacked cards -->
      <div bind:this={stackGroupRef} class="orbit-stack-group">
        {#each aboutOrbitCards as card, index (card.id)}
          <div
            data-shape={card.shape}
            class="orbit-card-item absolute rounded-2xl overflow-hidden cursor-pointer"
            role="button"
            tabindex="0"
            onclick={() => onCardClick(index)}
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCardClick(index);
              }
            }}
          >
            <figure
              class="orbit-card-visual relative h-full w-full overflow-hidden rounded-2xl shadow-xl transition-all duration-300 group hover:shadow-2xl"
            >
              <img
                src={card.media.src}
                alt={card.media.alt}
                width={card.media.width}
                height={card.media.height}
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />

              <!-- Sleek glass sheen overlay -->
              <div
                class="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-white/10 opacity-70 transition-opacity duration-300 group-hover:opacity-90"
              ></div>

              <!-- Stage Badge on every Card -->
              <div
                class="card-stage-pill pointer-events-none absolute top-2.5 left-2.5 z-30 inline-flex items-center rounded-lg border border-white/20 bg-brand-dark/45 px-2.5 py-1 text-brand-light backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.25)] max-w-[calc(100%-1.25rem)] transition-all duration-300"
              >
                <span class="font-sans text-[0.68rem] font-medium tracking-tight text-white truncate">
                  {card.title}
                </span>
              </div>
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
          AI <span class="italic text-brand-green">{$_('home.aboutOrbit.postProduction')}</span>
        </h2>

        <p
          class="mt-4 text-xs leading-relaxed text-brand-dark/75 sm:text-sm md:text-base"
        >
          {$_('home.aboutOrbit.description')}
        </p>

        <div class="mt-8">
          <a
            href={resolve("/portfolio")}
            class="group inline-flex items-center gap-2 rounded-full border border-brand-dark/15 bg-transparent px-5 py-2.5 font-sans text-xs font-semibold text-brand-dark transition-all duration-300 hover:border-brand-dark/30 hover:bg-brand-dark/5"
          >
            <span>{$_('home.aboutOrbit.explore')}</span>
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
        class="assurance-panel {isInteractive ? 'is-interactive' : ''}"
        aria-label="Our Process"
      >
        <div class="assurance-track-wrapper relative flex gap-3 sm:gap-4 items-stretch">
          <!-- Sliding glowing indicator rail on desktop -->
          <div class="assurance-rail relative hidden w-[3px] rounded-full bg-brand-dark/10 sm:block overflow-hidden my-1">
            <div
              class="assurance-rail-active absolute left-0 w-full rounded-full bg-brand-green shadow-[0_0_12px_rgba(126,166,65,0.9)] transition-all duration-300 ease-out"
              style="top: {activeStep * 25}%; height: 25%;"
            ></div>
          </div>

          <!-- 4 interactive step cards -->
          <div class="assurance-list flex-1 flex flex-col gap-1.5" role="tablist" aria-label="Our production milestones">
            {#each assurances as assurance, index (assurance.title)}
              {@const Icon = assurance.icon}
              {@const isActive = activeStep === index}
              <button
                type="button"
                bind:this={assuranceRows[index]}
                class="assurance-row group cursor-pointer text-left w-full {isActive ? 'is-active' : ''}"
                role="tab"
                tabindex="0"
                aria-selected={isActive}
                onclick={() => selectStep(index)}
                onmouseenter={() => selectStep(index)}
                onkeydown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectStep(index);
                  }
                }}
              >
                <div class="assurance-content w-full">
                  <div class="assurance-header-row flex items-center justify-between w-full">
                    <div class="assurance-title-row flex items-center gap-3">
                      <div
                        class="assurance-row-icon flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300 {isActive
                          ? 'border-brand-green bg-brand-green text-brand-light shadow-sm'
                          : 'border-brand-dark/10 bg-brand-dark/5 text-brand-dark group-hover:border-brand-green/40 group-hover:bg-brand-green/10 group-hover:text-brand-green'}"
                      >
                        <Icon size={15} strokeWidth={1.75} />
                      </div>
                      <h3 class="font-display font-medium text-[1.05rem] leading-tight text-brand-dark">
                        {assurance.title}
                      </h3>
                    </div>

                    <!-- Step number badge -->
                    <span
                      class="font-mono text-xs font-bold transition-all duration-300 px-2 py-0.5 rounded-full {isActive
                        ? 'bg-brand-green/15 text-brand-green border border-brand-green/30'
                        : 'text-brand-dark/30 group-hover:text-brand-dark/70'}"
                    >
                      {assurance.step}
                    </span>
                  </div>

                  <p class="assurance-description mt-2 text-[0.78rem] leading-relaxed transition-colors duration-300 {isActive ? 'text-brand-dark/85 font-normal' : 'text-brand-dark/60'}">
                    {assurance.description}
                  </p>
                </div>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- DESKTOP FOOTER (Absolute positioned, hidden on mobile) -->
      <footer
        bind:this={workflowOutcomeRef}
        class="workflow-footer absolute bottom-0 left-0 w-full border-t border-brand-dark/10 pt-4 flex flex-row items-center justify-between gap-8 hidden md:flex"
      >
        <!-- Metrics Grid -->
        <div class="flex-1 grid grid-cols-4 gap-6 text-left">
          <div class="metric-item group transition-transform duration-200 hover:-translate-y-0.5">
            <span
              class="block font-display text-[clamp(1.5rem,2vw,2.2rem)] font-light leading-none text-brand-dark"
              >{$_('home.aboutOrbit.stats.0.value') || '150+'}</span
            >
            <span
              class="block mt-1.5 font-mono text-[0.52rem] uppercase tracking-wider text-brand-dark/50"
              >{$_('home.aboutOrbit.stats.0.label') || 'Creative Specialists'}</span
            >
          </div>
          <div class="orbit-stat-fade-up">
            <span
              class="block font-display text-[clamp(1.5rem,2vw,2.2rem)] font-light leading-none text-brand-dark"
              >{$_('home.aboutOrbit.stats.1.value') || '10+ Years'}</span
            >
            <span
              class="block mt-1.5 font-mono text-[0.52rem] uppercase tracking-wider text-brand-dark/50"
              >{$_('home.aboutOrbit.stats.1.label') || 'Proven Experience'}</span
            >
          </div>
          <div class="orbit-stat-fade-up">
            <div class="flex items-center justify-between">
              <span
                class="block font-display text-[clamp(1.5rem,2vw,2.2rem)] font-light leading-none text-brand-dark"
                >{$_('home.aboutOrbit.stats.2.value') || '24/7'}</span
              >
              <div
                class="size-2 animate-pulse rounded-full bg-brand-green/80"
                aria-hidden="true"
              ></div>
            </div>
            <span
              class="block mt-1.5 font-mono text-[0.52rem] uppercase tracking-wider text-brand-dark/50"
              >{$_('home.aboutOrbit.stats.2.label') || 'Production Studio'}</span
            >
          </div>
          <div class="orbit-stat-fade-up">
            <span
              class="block font-display text-[clamp(1.5rem,2vw,2.2rem)] font-light leading-none text-brand-dark"
              >{$_('home.aboutOrbit.stats.3.value') || '99%'}</span
            >
            <span
              class="block mt-1.5 font-mono text-[0.52rem] uppercase tracking-wider text-brand-dark/50"
              >{$_('home.aboutOrbit.stats.3.label') || 'On-Time Delivery'}</span
            >
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
        <div class="flex flex-col">
          <span
            class="block font-display text-2xl font-light leading-none text-brand-dark"
            >{$_('home.aboutOrbit.stats.0.value') || '150+'}</span
          >
          <span
            class="block mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-brand-dark/50"
            >{$_('home.aboutOrbit.stats.0.label') || 'Creative Specialists'}</span
          >
        </div>
        <div class="flex flex-col">
          <span
            class="block font-display text-2xl font-light leading-none text-brand-dark"
            >{$_('home.aboutOrbit.stats.1.value') || '10+ Years'}</span
          >
          <span
            class="block mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-brand-dark/50"
            >{$_('home.aboutOrbit.stats.1.label') || 'Proven Experience'}</span
          >
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-3">
            <span
              class="block font-display text-2xl font-light leading-none text-brand-dark"
              >{$_('home.aboutOrbit.stats.2.value') || '24/7'}</span
            >
            <div
              class="size-1.5 animate-pulse rounded-full bg-brand-green"
              aria-hidden="true"
            ></div>
          </div>
          <span
            class="block mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-brand-dark/50"
            >{$_('home.aboutOrbit.stats.2.label') || 'Production Studio'}</span
          >
        </div>
        <div class="flex flex-col">
          <span
            class="block font-display text-2xl font-light leading-none text-brand-dark"
            >{$_('home.aboutOrbit.stats.3.value') || '99%'}</span
          >
          <span
            class="block mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-brand-dark/50"
            >{$_('home.aboutOrbit.stats.3.label') || 'On-Time Delivery'}</span
          >
        </div>
      </div>
      <div class="flex justify-start mt-2">
        <a href={resolve("/contact")} class="workflow-link !mt-0">
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
    background-image: radial-gradient(
      color-mix(in srgb, var(--color-brand-dark) 5%, transparent) 1px,
      transparent 1px
    );
    background-size: 28px 28px;
    position: relative;
  }

  .orbit-story::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 10% 30%,
        rgba(201, 255, 90, 0.12) 0%,
        transparent 45%
      ),
      radial-gradient(
        circle at 90% 70%,
        rgba(126, 166, 65, 0.08) 0%,
        transparent 50%
      );
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
    border-radius: 1rem;
    backface-visibility: hidden;
    transform-origin: center;
    transform-style: preserve-3d;
    border: none;
    outline: none;
  }

  .orbit-card-visual {
    transform-style: preserve-3d;
    border-radius: 1rem;
    border: none;
    outline: none;
  }

  .assurance-panel {
    position: absolute;
    top: 50%;
    right: clamp(0.5rem, 1.5vw, 1.75rem);
    width: min(44%, 39rem);
    padding-left: 0;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .assurance-panel.is-interactive {
    pointer-events: auto;
  }

  .assurance-panel:not(.is-interactive) .assurance-row {
    pointer-events: none !important;
    cursor: default !important;
  }

  .assurance-list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .assurance-row {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 0.95rem 1.15rem;
    border-radius: 0.85rem;
    border: 1px solid transparent;
    transition:
      transform 280ms cubic-bezier(0.16, 1, 0.3, 1),
      background-color 280ms ease,
      border-color 280ms ease,
      box-shadow 280ms ease;
  }

  .assurance-panel.is-interactive .assurance-row:hover,
  .assurance-panel.is-interactive .assurance-row.is-active {
    transform: translateX(0.4rem);
    background-color: color-mix(
      in srgb,
      var(--color-brand-green) 5%,
      transparent
    );
    border-color: color-mix(
      in srgb,
      var(--color-brand-green) 24%,
      transparent
    );
  }

  .assurance-panel.is-interactive .assurance-row.is-active {
    box-shadow: 0 4px 20px -4px rgba(126, 166, 65, 0.12);
  }

  .assurance-content {
    display: flex;
    flex-direction: column;
  }

  .assurance-title-row {
    display: flex;
    align-items: center;
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
      pointer-events: auto !important;
    }

    .assurance-row {
      min-height: auto;
      gap: 0.85rem;
      padding: 0.85rem 1rem;
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      cursor: pointer !important;
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

