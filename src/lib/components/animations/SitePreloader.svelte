<script lang="ts">
  import { onMount } from "svelte";

  let isVisible = $state(true);
  let isExiting = $state(false);
  let isDrawingReady = $state(false);
  let backdropElement = $state<HTMLDivElement>();
  let logoElement = $state<HTMLDivElement>();

  onMount(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animations: Animation[] = [];
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let headerReadyTimer: ReturnType<typeof setTimeout> | undefined;
    let drawingFrame: number | undefined;
    let hasFinished = false;
    let isDisposed = false;
    let isPageLoaded = document.readyState === "complete";
    let isExitScheduled = false;
    let drawingStartedAt = performance.now();
    let targetLogo: HTMLElement | null = null;
    let targetBrandBlock: HTMLElement | null = null;
    let targetHeader: HTMLElement | null = null;

    const prepareHeaderLogo = () => {
      targetLogo = document.querySelector<HTMLElement>("#site-header .brand-mark");
      targetBrandBlock = targetLogo?.closest<HTMLElement>(".brand-block") ?? null;
      targetHeader = targetLogo?.closest<HTMLElement>("#site-header") ?? null;
      targetLogo?.classList.add("preloader-logo-target");
      targetBrandBlock?.classList.add("preloader-brand-target");
    };

    const restoreHeaderLogo = () => {
      targetLogo?.classList.remove("preloader-logo-target");
      targetBrandBlock?.classList.remove("preloader-brand-target");
    };

    const finish = () => {
      if (hasFinished) return;
      hasFinished = true;
      restoreHeaderLogo();
      window.dispatchEvent(new CustomEvent("site-preloader-complete"));
      isVisible = false;
    };

    const completeLogoFlight = () => {
      window.dispatchEvent(new CustomEvent("site-preloader-logo-landed"));
      headerReadyTimer = setTimeout(finish, 1600);
    };

    const handleHeaderReady = () => {
      if (headerReadyTimer) clearTimeout(headerReadyTimer);
      finish();
    };

    const beginExit = () => {
      if (isExiting) return;
      isExiting = true;

      if (!targetLogo) prepareHeaderLogo();

      if (reduceMotion || !targetLogo || !logoElement || !backdropElement) {
        completeLogoFlight();
        return;
      }

      const sourceRect = logoElement.getBoundingClientRect();
      targetHeader?.classList.add("preloader-measure-target");
      const targetRect = targetLogo.getBoundingClientRect();
      targetHeader?.classList.remove("preloader-measure-target");
      const translateX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
      const translateY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
      const targetScale = targetRect.width / sourceRect.width;

      animations.push(
        backdropElement.animate(
          [
            { opacity: 1 },
            { opacity: 1, offset: 0.18 },
            { opacity: 0 },
          ],
          {
            duration: 720,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "forwards",
          },
        ),
      );

      const logoAnimation = logoElement.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)" },
          {
            transform: `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${targetScale})`,
          },
        ],
        {
          duration: 720,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      );

      animations.push(logoAnimation);
      logoAnimation.finished.then(completeLogoFlight).catch(finish);
    };

    prepareHeaderLogo();
    window.addEventListener("site-header-ready", handleHeaderReady, { once: true });

    const scheduleExit = () => {
      if (!isPageLoaded || !isDrawingReady || isExitScheduled) return;
      isExitScheduled = true;
      const minimumDuration = reduceMotion ? 160 : 1580;
      const remaining = Math.max(0, minimumDuration - (performance.now() - drawingStartedAt));
      hideTimer = setTimeout(beginExit, remaining);
    };

    const handleWindowLoad = () => {
      isPageLoaded = true;
      scheduleExit();
    };

    const playDrawingSequence = () => {
      if (!logoElement || reduceMotion) return;

      const drawingSteps = [
        { selector: ".logo-draw-monogram", distance: 760, duration: 450, delay: 30 },
        { selector: ".logo-draw-h", distance: 560, duration: 360, delay: 220 },
        { selector: ".logo-draw-base", distance: 190, duration: 180, delay: 600 },
        { selector: ".logo-draw-flight", distance: 390, duration: 350, delay: 790 },
        { selector: ".logo-draw-plane", distance: 270, duration: 220, delay: 1150 },
      ];

      drawingSteps.forEach(({ selector, distance, duration, delay }) => {
        const path = logoElement?.querySelector<SVGPathElement>(selector);
        if (!path) return;

        animations.push(
          path.animate(
            [{ strokeDashoffset: `${distance}` }, { strokeDashoffset: "0" }],
            {
              duration,
              delay,
              easing: "cubic-bezier(0.65, 0, 0.35, 1)",
              fill: "forwards",
            },
          ),
        );
      });

      const completeLogo = logoElement.querySelector<HTMLElement>(".preloader-logo-complete");
      if (completeLogo) {
        animations.push(
          completeLogo.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 140,
            delay: 1380,
            easing: "linear",
            fill: "forwards",
          }),
        );
      }
    };

    const startDrawing = () => {
      drawingFrame = requestAnimationFrame(() => {
        if (isDisposed) return;
        drawingStartedAt = performance.now();
        isDrawingReady = true;
        playDrawingSequence();
        scheduleExit();
      });
    };

    const waitForCriticalLogoAssets = async () => {
      const sources = [
        "/images/brand/schl-logo-green.png",
        "/images/brand/schl-logo-gray.png",
        "/images/brand/schl-logo.png",
      ];

      const decodePromises = sources.map(
        (source) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.decoding = "async";
            image.onload = () => {
              void image
                .decode()
                .catch(() => undefined)
                .then(() => resolve());
            };
            image.onerror = () => resolve();
            image.src = source;
            if (image.complete) {
              void image
                .decode()
                .catch(() => undefined)
                .then(() => resolve());
            }
          }),
      );

      await Promise.race([
        Promise.all(decodePromises),
        new Promise<void>((resolve) => setTimeout(resolve, 140)),
      ]);

      if (!isDisposed) startDrawing();
    };

    if (!isPageLoaded) {
      window.addEventListener("load", handleWindowLoad, { once: true });
    }
    void waitForCriticalLogoAssets();

    return () => {
      isDisposed = true;
      window.removeEventListener("load", handleWindowLoad);
      window.removeEventListener("site-header-ready", handleHeaderReady);
      if (drawingFrame) cancelAnimationFrame(drawingFrame);
      if (hideTimer) clearTimeout(hideTimer);
      if (headerReadyTimer) clearTimeout(headerReadyTimer);
      animations.forEach((animation) => animation.cancel());
      restoreHeaderLogo();
    };
  });
</script>

{#if isVisible}
  <div
    class:site-preloader-exiting={isExiting}
    class="site-preloader"
    role="status"
    aria-label="Loading Studio Click House"
    aria-live="polite"
  >
    <div class="preloader-backdrop" bind:this={backdropElement} aria-hidden="true"></div>

    <div class="preloader-atmosphere" aria-hidden="true">
      <span class="preloader-glow preloader-glow-left"></span>
      <span class="preloader-glow preloader-glow-right"></span>
    </div>

    <div
      class:preloader-drawing-ready={isDrawingReady}
      class="preloader-logo"
      bind:this={logoElement}
      aria-hidden="true"
    >
      <svg
        class="preloader-logo-drawing"
        viewBox="0 0 715 377"
        role="presentation"
      >
        <defs>
          <mask id="schl-green-draw-mask" class="logo-reveal-mask">
            <rect width="715" height="377" fill="transparent" />
            <path
              class="logo-draw-path logo-draw-monogram"
              d="M260 158H96C38 158 34 224 95 224H211C245 224 256 238 256 263C256 303 301 315 350 315H456"
            />
            <path
              class="logo-draw-path logo-draw-h"
              d="M451 157V316M451 231H642M642 157V316"
            />
          </mask>
          <mask id="schl-gray-draw-mask" class="logo-reveal-mask">
            <rect width="715" height="377" fill="transparent" />
            <path
              class="logo-draw-path logo-draw-base"
              d="M48 315H221"
            />
            <path
              class="logo-draw-path logo-draw-flight"
              d="M241 210C305 135 402 89 548 61"
            />
            <path
              class="logo-draw-path logo-draw-plane"
              d="M562 20L682 47L590 89"
            />
          </mask>
        </defs>
        <image
          href="/images/brand/schl-logo-green.png"
          width="715"
          height="377"
          mask="url(#schl-green-draw-mask)"
        />
        <image
          href="/images/brand/schl-logo-gray.png"
          width="715"
          height="377"
          mask="url(#schl-gray-draw-mask)"
        />
      </svg>
      <img
        class="preloader-logo-complete"
        src="/images/brand/schl-logo.png"
        alt=""
        width="715"
        height="377"
      />
    </div>
    <span class="sr-only">Loading</span>
  </div>
{/if}

<style>
  .site-preloader {
    position: fixed;
    inset: 0;
    z-index: 200;
    overflow: hidden;
    pointer-events: auto;
  }

  .site-preloader-exiting {
    pointer-events: none;
  }

  .preloader-backdrop {
    position: absolute;
    inset: 0;
    overflow: hidden;
    color: var(--color-brand-light);
    background: var(--color-brand-dark);
  }

  .preloader-atmosphere {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
    transition: opacity 220ms ease;
  }

  .site-preloader-exiting .preloader-atmosphere {
    opacity: 0;
  }

  .preloader-glow {
    position: absolute;
    width: clamp(20rem, 38vw, 36rem);
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--color-brand-green) 18%, transparent);
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--color-brand-green) 24%, transparent) 0%,
      color-mix(in srgb, var(--color-brand-green) 9%, transparent) 38%,
      transparent 70%
    );
    will-change: transform, opacity;
  }

  .preloader-glow-left {
    left: -10%;
    bottom: -34%;
    opacity: 0.65;
    animation: drift-left-glow 4.8s ease-in-out infinite alternate;
  }

  .preloader-glow-right {
    top: -38%;
    right: -8%;
    opacity: 0.42;
    animation: drift-right-glow 5.4s ease-in-out infinite alternate;
  }

  .preloader-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    width: clamp(11rem, 20vw, 18rem);
    transform: translate(-50%, -50%);
    transform-origin: center center;
    contain: layout paint;
    will-change: transform;
  }

  .preloader-logo-drawing,
  .preloader-logo-complete {
    display: block;
    width: 100%;
    height: auto;
  }

  .preloader-logo-complete {
    position: absolute;
    inset: 0;
    opacity: 0;
  }

  .logo-draw-path {
    fill: none;
    stroke: white;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .logo-reveal-mask {
    mask-type: alpha;
  }

  .logo-draw-monogram {
    stroke-width: 62;
    stroke-dasharray: 760;
    stroke-dashoffset: 760;
  }

  .logo-draw-h {
    stroke-width: 66;
    stroke-linecap: square;
    stroke-dasharray: 560;
    stroke-dashoffset: 560;
  }

  .logo-draw-base {
    stroke-width: 62;
    stroke-linecap: square;
    stroke-dasharray: 190;
    stroke-dashoffset: 190;
  }

  .logo-draw-flight {
    stroke-width: 52;
    stroke-dasharray: 390;
    stroke-dashoffset: 390;
  }

  .logo-draw-plane {
    stroke-width: 64;
    stroke-dasharray: 270;
    stroke-dashoffset: 270;
  }

  @keyframes drift-left-glow {
    from {
      transform: translate3d(-4%, 5%, 0) scale(0.92);
    }
    to {
      transform: translate3d(12%, -8%, 0) scale(1.08);
    }
  }

  @keyframes drift-right-glow {
    from {
      transform: translate3d(7%, -5%, 0) scale(1.05);
    }
    to {
      transform: translate3d(-10%, 10%, 0) scale(0.9);
    }
  }

  @media (max-width: 39.999rem) {
    .preloader-glow-right {
      display: none;
    }

    .preloader-glow-left {
      width: 26rem;
      opacity: 0.48;
    }

    .preloader-logo {
      width: min(54vw, 13rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .logo-draw-path,
    .preloader-logo-complete,
    .preloader-glow {
      animation: none;
    }

    .preloader-logo-complete {
      opacity: 1;
    }

    .preloader-logo-drawing {
      display: none;
    }
  }

  :global(#site-header .brand-block.preloader-brand-target),
  :global(#site-header .brand-mark.preloader-logo-target) {
    visibility: hidden !important;
    transform: none !important;
  }

  :global(#site-header.preloader-measure-target) {
    transform: none !important;
  }
</style>
