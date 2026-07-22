<script lang="ts">
  import { onMount, tick } from "svelte";
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { services, serviceShowcases } from "$lib/content/home";

  let activeShowcaseIndex = $state(0);
  let activeServiceIndex = $state(0);
  let comparisonPosition = $state(52);
  let activeShowcase = $derived(
    serviceShowcases[activeShowcaseIndex] ?? serviceShowcases[0],
  );
  let activeServices = $derived(
    services.filter((service) => service.category === activeShowcase?.category),
  );
  let activeService = $derived(
    activeServices[activeServiceIndex] ?? activeServices[0],
  );

  // Dynamic back cards images: next and previous in category list
  let backLeftMedia = $derived(
    activeServices[(activeServiceIndex - 1 + activeServices.length) % activeServices.length]?.media ?? activeService?.media
  );
  let backRightMedia = $derived(
    activeServices[(activeServiceIndex + 1) % activeServices.length]?.media ?? activeService?.media
  );

  // DOM elements for animation bindings
  let sectionElement = $state<HTMLElement>();
  let tabElements: HTMLButtonElement[] = [];
  let tabIndicatorElement = $state<HTMLElement>();
  let mediaPreviewElement = $state<HTMLElement>();
  let glowElement = $state<HTMLElement>();
  let backCardLeft = $state<HTMLElement>();
  let backCardRight = $state<HTMLElement>();

  function activateShowcase(index: number) {
    if (activeShowcaseIndex === index) return;
    activeShowcaseIndex = index;
    activeServiceIndex = 0;
    comparisonPosition = 52;
  }

  function activateService(index: number) {
    if (activeServiceIndex === index) return;

    activeServiceIndex = index;
    comparisonPosition = 52;
  }

  function updateComparison(event: Event) {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) return;

    comparisonPosition = Number(input.value);
  }

  function previewComparison(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;

    const control = event.currentTarget;
    if (!(control instanceof HTMLInputElement)) return;

    const bounds = control.getBoundingClientRect();
    const pointerPosition =
      ((event.clientX - bounds.left) / bounds.width) * 100;
    comparisonPosition = Math.min(100, Math.max(0, pointerPosition));
  }

  // Animate indicator capsule
  function moveIndicator(index: number) {
    const activeTab = tabElements[index];
    const indicator = tabIndicatorElement;
    if (!activeTab || !indicator) return;

    import("gsap").then(({ gsap }) => {
      gsap.to(indicator, {
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
        duration: 0.38,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  }

  // React to tab index changes
  $effect(() => {
    const index = activeShowcaseIndex;
    void tick().then(() => {
      moveIndicator(index);
    });
  });

  // 3D Perspective Tilt & Fan-out Handlers
  function handlePointerMove(event: PointerEvent) {
    const previewEl = mediaPreviewElement;
    if (event.pointerType !== "mouse" || !previewEl) return;

    const bounds = previewEl.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    // Normalize coordinates from -0.5 to 0.5
    const normX = x / bounds.width - 0.5;
    const normY = y / bounds.height - 0.5;

    const tiltX = -normY * 8; // max 8 degrees tilt on X
    const tiltY = normX * 8; // max 8 degrees tilt on Y

    const glowEl = glowElement;
    const leftEl = backCardLeft;
    const rightEl = backCardRight;

    import("gsap").then(({ gsap }) => {
      // Tilt main comparison card
      gsap.to(previewEl, {
        rotateX: tiltX,
        rotateY: tiltY,
        scale: 1.015,
        transformPerspective: 1000,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Shift glow slightly
      if (glowEl) {
        gsap.to(glowEl, {
          x: normX * 24,
          y: normY * 24,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      // Fan out back cards: left slides further left, right slides further right
      if (leftEl) {
        gsap.to(leftEl, {
          x: -24 + normX * 10,
          y: -12 + normY * 8,
          rotate: -6 + normX * 4,
          scale: 0.96,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (rightEl) {
        gsap.to(rightEl, {
          x: 24 + normX * 10,
          y: 12 + normY * 8,
          rotate: 6 + normX * 4,
          scale: 0.96,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    });
  }

  function handlePointerLeave() {
    const previewEl = mediaPreviewElement;
    if (!previewEl) return;

    const glowEl = glowElement;
    const leftEl = backCardLeft;
    const rightEl = backCardRight;

    import("gsap").then(({ gsap }) => {
      // Reset main card
      gsap.to(previewEl, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Reset glow
      if (glowEl) {
        gsap.to(glowEl, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      // Reset back cards to resting fanned position
      if (leftEl) {
        gsap.to(leftEl, {
          x: -12,
          y: -6,
          rotate: -3,
          scale: 0.94,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (rightEl) {
        gsap.to(rightEl, {
          x: 12,
          y: 6,
          rotate: 3,
          scale: 0.94,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    });
  }

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    // Initial positioning
    void tick().then(() => {
      moveIndicator(activeShowcaseIndex);
    });

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionElement) return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: sectionElement,
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            })
            .from(".service-header > *", {
              y: 20,
              autoAlpha: 0,
              duration: 0.65,
              ease: "power3.out",
            })
            .from(
              ".category-tabs",
              {
                y: 15,
                autoAlpha: 0,
                duration: 0.55,
                ease: "power3.out",
              },
              "-=0.35",
            )
            .from(
              ".service-workspace",
              {
                y: 25,
                autoAlpha: 0,
                duration: 0.65,
                ease: "power3.out",
              },
              "-=0.25",
            );
        });

        return () => media.revert();
      }, sectionElement);
    });

    const handleResize = () => {
      moveIndicator(activeShowcaseIndex);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      active = false;
      window.removeEventListener("resize", handleResize);
      context?.revert();
    };
  });
</script>

<section
  id="studio-services"
  bind:this={sectionElement}
  aria-labelledby="studio-services-title"
  class="service-section bg-brand-light text-brand-dark"
>
  <div class="service-shell site-shell">
    <header class="service-header">
      <h2 id="studio-services-title" class="service-title font-display">
        Our services
      </h2>
    </header>

    <div
      class="category-tabs"
      role="tablist"
      aria-label="Studio service categories"
    >
      <!-- Sliding Capsule Indicator -->
      <div bind:this={tabIndicatorElement} class="category-tab-indicator"></div>

      {#each serviceShowcases as showcase, index (showcase.category)}
        <button
          id={`service-tab-${index}`}
          bind:this={tabElements[index]}
          type="button"
          role="tab"
          aria-selected={activeShowcaseIndex === index}
          aria-controls="service-workspace"
          class:active={activeShowcaseIndex === index}
          class="category-tab"
          onclick={() => activateShowcase(index)}
          onmouseenter={() => activateShowcase(index)}
          onfocus={() => activateShowcase(index)}
        >
          {showcase.displayTitle}
        </button>
      {/each}
    </div>

    {#if activeShowcase}
      <div
        id="service-workspace"
        role="tabpanel"
        aria-labelledby={`service-tab-${activeShowcaseIndex}`}
        class="service-workspace"
      >
        <nav
          class="service-index"
          aria-label={`${activeShowcase.displayTitle} services`}
        >
          {#each activeServices as service, index (service.slug)}
            <a
              id={`capability-${service.slug}`}
              href={resolve("/services/[slug]", { slug: service.slug })}
              class="service-row"
              class:active-service={activeServiceIndex === index}
              onmouseenter={() => activateService(index)}
              onfocus={() => activateService(index)}
            >
              <span class="service-row-content">
                <span class="service-main">
                  <span class="service-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span class="service-name">{service.title}</span>
                </span>
                <ArrowUpRight size={16} strokeWidth={1.45} aria-hidden="true" />
              </span>
            </a>
          {/each}
        </nav>

        {#if activeService}
          <div class="preview-column" aria-live="polite">
            <!-- Background Radial Glow -->
            <div bind:this={glowElement} class="preview-glow"></div>

            {#key activeService.slug}
              <div class="preview-stack relative aspect-[4/5] w-full">
                <!-- Back Card Left -->
                {#if backLeftMedia}
                  <figure
                    bind:this={backCardLeft}
                    class="back-card back-card-left"
                    aria-hidden="true"
                  >
                    <img
                      src={backLeftMedia.src}
                      alt=""
                      width={backLeftMedia.width}
                      height={backLeftMedia.height}
                      loading="lazy"
                    />
                  </figure>
                {/if}

                <!-- Back Card Right -->
                {#if backRightMedia}
                  <figure
                    bind:this={backCardRight}
                    class="back-card back-card-right"
                    aria-hidden="true"
                  >
                    <img
                      src={backRightMedia.src}
                      alt=""
                      width={backRightMedia.width}
                      height={backRightMedia.height}
                      loading="lazy"
                    />
                  </figure>
                {/if}

                <!-- Main Comparison Card (Front) -->
                <div
                  bind:this={mediaPreviewElement}
                  role="presentation"
                  onpointermove={handlePointerMove}
                  onpointerleave={handlePointerLeave}
                  class="media-preview comparison-preview"
                >
                  <figure class="comparison-image comparison-before">
                    <img
                      src={activeService.media.src}
                      alt=""
                      aria-hidden="true"
                      width={activeService.media.width}
                      height={activeService.media.height}
                    />
                  </figure>

                  <figure
                    class="comparison-image comparison-after"
                    style={`--comparison-position: ${comparisonPosition}%`}
                  >
                    <img
                      src={activeService.media.src}
                      alt={activeService.media.alt}
                      width={activeService.media.width}
                      height={activeService.media.height}
                    />
                  </figure>

                  <span class="media-label media-label-before">Before</span>
                  <span class="media-label media-label-after">After</span>

                  <span
                    class="comparison-divider"
                    style={`--comparison-position: ${comparisonPosition}%`}
                    aria-hidden="true"
                  >
                    <span>↔</span>
                  </span>

                  <input
                    class="comparison-control"
                    type="range"
                    min="0"
                    max="100"
                    value={comparisonPosition}
                    aria-label={`Compare before and after for ${activeService.title}`}
                    oninput={updateComparison}
                    onpointermove={previewComparison}
                  />
                </div>
              </div>
            {/key}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>

<style>
  .service-section {
    position: relative;
  }

  .service-shell {
    display: grid;
    padding-top: clamp(3rem, 5vw, 5rem);
    padding-bottom: clamp(3rem, 5vw, 5rem);
  }

  .service-header {
    padding-bottom: clamp(0.85rem, 1.4vw, 1.25rem);
  }

  .service-title {
    font-size: clamp(2.5rem, 4.4vw, 4.5rem);
    line-height: 0.9;
    letter-spacing: -0.045em;
  }

  .category-tabs {
    position: relative;
    display: flex;
    align-items: center;
    width: fit-content;
    max-width: 100%;
    overflow-x: auto;
    margin-top: clamp(1rem, 1.8vw, 1.5rem);
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    border-radius: 0.35rem;
    overflow: hidden;
    scrollbar-width: none;
    background: var(--color-brand-paper);
    padding: 0.25rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .category-tabs::-webkit-scrollbar {
    display: none;
  }

  .category-tab-indicator {
    position: absolute;
    top: 0.25rem;
    bottom: 0.25rem;
    left: 0;
    width: 0;
    background: var(--color-brand-green);
    border-radius: 0.25rem;
    z-index: 0;
    pointer-events: none;
  }

  .category-tab {
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
    min-width: clamp(8.75rem, 13vw, 11.5rem);
    padding: 0.65rem clamp(0.9rem, 1.6vw, 1.4rem);
    border-radius: 0.25rem;
    color: color-mix(in srgb, var(--color-brand-dark) 68%, transparent);
    font-family: var(--font-mono);
    font-size: clamp(0.65rem, 0.9vw, 0.75rem);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
    background: transparent;
    border: 0;
    cursor: pointer;
    transition: color 280ms ease;
  }

  .category-tab:hover,
  .category-tab:focus-visible {
    color: var(--color-brand-dark);
  }

  .category-tab.active {
    color: var(--color-brand-dark);
    font-weight: 700;
  }

  .service-workspace {
    display: grid;
    gap: clamp(2.25rem, 4.5vw, 5rem);
    align-items: start;
    margin-top: clamp(1.5rem, 2.5vw, 2.25rem);
  }

  .service-index {
    min-width: 0;
    border-top: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 16%, transparent);
  }

  .service-row {
    position: relative;
    z-index: 0;
    display: block;
    width: 100%;
    padding: clamp(0.68rem, 1vw, 0.88rem) 0;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 16%, transparent);
    font-size: clamp(0.95rem, 1.2vw, 1.1rem);
    font-weight: 500;
    letter-spacing: -0.015em;
    transition: color 220ms ease;
  }

  .service-row-content {
    display: grid;
    width: 100%;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1rem;
    align-items: center;
  }

  .service-main {
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: clamp(0.75rem, 1.4vw, 1.25rem);
    align-items: center;
    transform-origin: left center;
    transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .service-number {
    color: color-mix(in srgb, var(--color-brand-dark) 45%, transparent);
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.14em;
    transition: color 220ms ease;
  }

  .service-name {
    min-width: 0;
  }

  .service-row :global(svg) {
    flex: none;
    color: color-mix(in srgb, var(--color-brand-dark) 45%, transparent);
    transition:
      color 220ms ease,
      transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .service-row:hover,
  .service-row:focus-visible,
  .service-row.active-service {
    z-index: 1;
    color: var(--color-brand-green);
  }

  .service-row:hover .service-main,
  .service-row:focus-visible .service-main,
  .service-row.active-service .service-main {
    transform: scale(1.08);
  }

  .service-row:hover :global(svg),
  .service-row:focus-visible :global(svg),
  .service-row.active-service :global(svg) {
    color: var(--color-brand-green);
    transform: none;
  }

  .service-row:hover .service-number,
  .service-row:focus-visible .service-number,
  .service-row.active-service .service-number {
    color: var(--color-brand-green);
  }

  .preview-column {
    position: relative;
    width: min(100%, 30rem);
    justify-self: center;
  }

  .preview-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--color-brand-green) 12%, transparent) 0%,
      transparent 70%
    );
    filter: blur(30px);
    z-index: -1;
    pointer-events: none;
    will-change: transform;
  }

  .preview-stack {
    position: relative;
    z-index: 1;
    transform-style: preserve-3d;
    perspective: 1000px;
    animation: preview-enter 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .back-card {
    position: absolute;
    inset: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: clamp(0.85rem, 1.5vw, 1.25rem);
    background: var(--color-brand-dark);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.24);
    opacity: 0.42;
    filter: saturate(0.68) brightness(0.8);
    transition:
      transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.45s ease;
    pointer-events: none;
    will-change: transform, opacity;
  }

  .back-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .back-card-left {
    z-index: -1;
    transform: translateX(-12px) translateY(-6px) rotate(-3deg) scale(0.94);
  }

  .back-card-right {
    z-index: -2;
    transform: translateX(12px) translateY(6px) rotate(3deg) scale(0.94);
  }

  .media-preview {
    position: relative;
    z-index: 2;
    isolation: isolate;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    border-radius: clamp(0.85rem, 1.5vw, 1.25rem);
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
    margin: 0;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform;
    box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.42);
  }

  .comparison-image,
  .comparison-image img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .comparison-image {
    margin: 0;
    overflow: hidden;
  }

  .comparison-image img {
    object-fit: cover;
    transform: scale(1.02);
  }

  .comparison-before img {
    filter: saturate(0.5) contrast(0.9) brightness(0.92);
  }

  .comparison-after {
    z-index: 2;
    clip-path: inset(0 0 0 var(--comparison-position));
    will-change: clip-path;
  }

  .media-label {
    position: absolute;
    z-index: 5;
    top: 0.8rem;
    padding: 0.38rem 0.75rem;
    border: 1px solid rgb(248 248 246 / 0.28);
    border-radius: 9999px;
    background: rgb(32 33 31 / 0.38);
    color: var(--color-brand-light);
    font-family: var(--font-mono);
    font-size: 0.46rem;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    backdrop-filter: blur(0.35rem);
  }

  .media-label-before {
    left: 0.8rem;
  }

  .media-label-after {
    right: 0.8rem;
  }

  .comparison-divider {
    position: absolute;
    z-index: 4;
    top: 0;
    bottom: 0;
    left: var(--comparison-position);
    width: 1px;
    background: rgb(248 248 246 / 0.78);
    pointer-events: none;
    will-change: left;
  }

  .comparison-divider > span {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    width: 2.25rem;
    aspect-ratio: 1;
    place-items: center;
    border: 1px solid rgb(248 248 246 / 0.58);
    border-radius: 50%;
    background: rgb(32 33 31 / 0.58);
    color: var(--color-brand-light);
    font-size: 0.65rem;
    backdrop-filter: blur(0.35rem);
    transform: translate(-50%, -50%);
  }

  .comparison-control {
    position: absolute;
    z-index: 6;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: ew-resize;
  }

  .comparison-control:focus {
    outline: none;
  }

  .comparison-preview:has(.comparison-control:focus-visible)
    .comparison-divider
    > span {
    background: color-mix(
      in srgb,
      var(--color-brand-green) 72%,
      var(--color-brand-dark)
    );
  }

  @keyframes preview-enter {
    from {
      opacity: 0;
      transform: translateY(0.6rem) scale(0.988);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (min-width: 64rem) {
    .service-workspace {
      grid-template-columns: minmax(0, 1.15fr) minmax(20rem, 0.85fr);
    }

    .preview-column {
      justify-self: end;
      margin-top: -5rem;
    }
  }

  @media (max-width: 63.999rem) {
    .preview-column {
      grid-row: 1;
      justify-self: start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .category-tab,
    .service-row,
    .service-main,
    .service-row :global(svg) {
      transition: none;
    }

    .media-preview {
      animation: none;
    }
  }
</style>
