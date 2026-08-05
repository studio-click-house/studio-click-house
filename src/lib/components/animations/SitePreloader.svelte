<script lang="ts">
  import { onMount } from "svelte";

  type LogoParticle = {
    color: string;
    delay: number;
    drift: number;
    phase: number;
    size: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
  };

  type LandingParticle = LogoParticle & {
    targetSize: number;
  };

  let isVisible = $state(true);
  let isExiting = $state(false);
  let isFormationReady = $state(false);
  let backdropElement = $state<HTMLDivElement>();
  let particleCanvasElement = $state<HTMLCanvasElement>();
  let logoElement = $state<HTMLDivElement>();

  onMount(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const minimumDisplayDuration = reduceMotion ? 180 : 1900;
    let formationTimeline: { kill: () => void } | undefined;
    let landingTimeline: { kill: () => void } | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let headerReadyTimer: ReturnType<typeof setTimeout> | undefined;
    let formationFrame: number | undefined;
    let hasFinished = false;
    let isDisposed = false;
    let isPageReady = document.readyState !== "loading";
    let hasFormationCompleted = false;
    let isExitScheduled = false;
    let formationStartedAt = performance.now();
    let targetLogo: HTMLElement | null = null;
    let targetBrandBlock: HTMLElement | null = null;
    let targetHeader: HTMLElement | null = null;
    let criticalLogoImage: HTMLImageElement | undefined;

    const prepareHeaderLogo = () => {
      targetLogo = document.querySelector<HTMLElement>(
        "#site-header .brand-mark",
      );
      targetBrandBlock =
        targetLogo?.closest<HTMLElement>(".brand-block") ?? null;
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
      document.documentElement.dataset.preloaderComplete = "true";
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

    const playParticleLanding = async (
      sourceRect: DOMRect,
      targetRect: DOMRect,
    ) => {
      const logoImage = criticalLogoImage;
      const canvas = particleCanvasElement;
      const logo = logoElement;
      const backdrop = backdropElement;
      const completeLogo = logo?.querySelector<HTMLElement>(
        ".preloader-logo-complete",
      );
      const context = canvas?.getContext("2d");

      if (!logoImage || !canvas || !backdrop || !completeLogo || !context) {
        completeLogoFlight();
        return;
      }

      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        window.innerWidth < 640 ? 1.5 : 2,
      );
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const particles = createLandingParticles(
        logoImage,
        sourceRect,
        targetRect,
      );
      const landing = { progress: 0 };

      const renderLandingParticles = () => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const particle of particles) {
          const localProgress = Math.min(
            1,
            Math.max(
              0,
              (landing.progress - particle.delay) / (1 - particle.delay),
            ),
          );
          const easedProgress = 1 - Math.pow(1 - localProgress, 3);
          const scatter = Math.sin(easedProgress * Math.PI) * particle.drift;
          const x =
            particle.startX +
            (particle.targetX - particle.startX) * easedProgress +
            Math.cos(particle.phase) * scatter;
          const y =
            particle.startY +
            (particle.targetY - particle.startY) * easedProgress +
            Math.sin(particle.phase) * scatter;
          const size =
            particle.size +
            (particle.targetSize - particle.size) * easedProgress;

          context.fillStyle = particle.color;
          context.fillRect(x, y, size, size);
        }
      };

      renderLandingParticles();

      try {
        const { gsap } = await import("gsap");
        if (isDisposed) return;

        landingTimeline = gsap
          .timeline({ onComplete: completeLogoFlight })
          .set(canvas, { autoAlpha: 1 })
          .to(
            completeLogo,
            {
              autoAlpha: 0,
              duration: 0.14,
              ease: "power1.out",
            },
            0,
          )
          .to(
            landing,
            {
              progress: 1,
              duration: 0.96,
              ease: "none",
              onUpdate: renderLandingParticles,
            },
            0,
          )
          .to(
            backdrop,
            {
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
            },
            0.08,
          );
      } catch {
        backdrop.style.setProperty("opacity", "0");
        completeLogo.style.setProperty("opacity", "0");
        completeLogoFlight();
      }
    };

    const beginExit = () => {
      if (isExiting) return;
      isExiting = true;
      window.dispatchEvent(new CustomEvent("site-preloader-header-reveal"));

      if (!targetLogo) prepareHeaderLogo();

      if (reduceMotion || !targetLogo || !logoElement || !backdropElement) {
        completeLogoFlight();
        return;
      }

      const sourceRect = logoElement.getBoundingClientRect();
      targetHeader?.classList.add("preloader-measure-target");
      const targetRect = targetLogo.getBoundingClientRect();
      targetHeader?.classList.remove("preloader-measure-target");
      void playParticleLanding(sourceRect, targetRect);
    };

    prepareHeaderLogo();
    window.addEventListener("site-header-ready", handleHeaderReady, {
      once: true,
    });

    const scheduleExit = () => {
      if (!isPageReady || !hasFormationCompleted || isExitScheduled) return;
      isExitScheduled = true;
      const remaining = Math.max(
        0,
        minimumDisplayDuration - (performance.now() - formationStartedAt),
      );
      hideTimer = setTimeout(beginExit, remaining);
    };

    const completeFormation = () => {
      if (hasFormationCompleted || isDisposed) return;
      hasFormationCompleted = true;
      scheduleExit();
    };

    const handleDocumentReady = () => {
      isPageReady = true;
      scheduleExit();
    };

    const createParticles = (
      logoImage: HTMLImageElement,
      logoRect: DOMRect,
    ) => {
      const sampleCanvas = document.createElement("canvas");
      const sampleContext = sampleCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (!sampleContext) return [];

      sampleCanvas.width = logoImage.naturalWidth;
      sampleCanvas.height = logoImage.naturalHeight;
      sampleContext.drawImage(logoImage, 0, 0);

      const { data } = sampleContext.getImageData(
        0,
        0,
        sampleCanvas.width,
        sampleCanvas.height,
      );
      const sampleStep =
        window.innerWidth < 640 ? 14 : window.innerWidth < 1024 ? 11 : 9;
      const particles: LogoParticle[] = [];

      for (
        let sourceY = 0;
        sourceY < sampleCanvas.height;
        sourceY += sampleStep
      ) {
        for (
          let sourceX = 0;
          sourceX < sampleCanvas.width;
          sourceX += sampleStep
        ) {
          const pixelIndex = (sourceY * sampleCanvas.width + sourceX) * 4;
          const alpha = data[pixelIndex + 3];
          if (alpha < 96) continue;

          const targetX =
            logoRect.left + (sourceX / sampleCanvas.width) * logoRect.width;
          const targetY =
            logoRect.top + (sourceY / sampleCanvas.height) * logoRect.height;
          const horizontalProgress = sourceX / sampleCanvas.width;
          const travelDistance =
            logoRect.left + 90 + Math.random() * window.innerWidth * 0.58;

          particles.push({
            color: `rgba(${data[pixelIndex]}, ${data[pixelIndex + 1]}, ${data[pixelIndex + 2]}, ${alpha / 255})`,
            delay: horizontalProgress * 0.22 + Math.random() * 0.06,
            drift: 12 + Math.random() * 34,
            phase: Math.random() * Math.PI * 2,
            size: 1.1 + Math.random() * 2.2,
            startX: targetX - travelDistance,
            startY: targetY + (Math.random() - 0.5) * window.innerHeight * 0.78,
            targetX,
            targetY,
          });
        }
      }

      return particles;
    };

    const createLandingParticles = (
      logoImage: HTMLImageElement,
      sourceRect: DOMRect,
      targetRect: DOMRect,
    ) => {
      const sampleCanvas = document.createElement("canvas");
      const sampleContext = sampleCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (!sampleContext) return [];

      sampleCanvas.width = logoImage.naturalWidth;
      sampleCanvas.height = logoImage.naturalHeight;
      sampleContext.drawImage(logoImage, 0, 0);

      const { data } = sampleContext.getImageData(
        0,
        0,
        sampleCanvas.width,
        sampleCanvas.height,
      );
      const sampleStep = window.innerWidth < 640 ? 13 : 9;
      const sourceSize = Math.max(
        1,
        (sampleStep / sampleCanvas.width) * sourceRect.width * 0.94,
      );
      const targetSize = Math.max(
        0.8,
        (sampleStep / sampleCanvas.width) * targetRect.width * 1.08,
      );
      const particles: LandingParticle[] = [];

      for (
        let sourceY = 0;
        sourceY < sampleCanvas.height;
        sourceY += sampleStep
      ) {
        for (
          let sourceX = 0;
          sourceX < sampleCanvas.width;
          sourceX += sampleStep
        ) {
          const pixelIndex = (sourceY * sampleCanvas.width + sourceX) * 4;
          const alpha = data[pixelIndex + 3];
          if (alpha < 96) continue;

          const horizontalProgress = sourceX / sampleCanvas.width;
          const verticalProgress = sourceY / sampleCanvas.height;

          particles.push({
            color: `rgba(${data[pixelIndex]}, ${data[pixelIndex + 1]}, ${data[pixelIndex + 2]}, ${alpha / 255})`,
            delay: horizontalProgress * 0.1 + Math.random() * 0.045,
            drift: 14 + Math.random() * 32,
            phase: Math.random() * Math.PI * 2,
            size: sourceSize,
            startX: sourceRect.left + horizontalProgress * sourceRect.width,
            startY: sourceRect.top + verticalProgress * sourceRect.height,
            targetSize,
            targetX: targetRect.left + horizontalProgress * targetRect.width,
            targetY: targetRect.top + verticalProgress * targetRect.height,
          });
        }
      }

      return particles;
    };

    const playParticleFormation = async (logoImage: HTMLImageElement) => {
      if (
        !logoElement ||
        !particleCanvasElement ||
        reduceMotion ||
        isDisposed
      ) {
        completeFormation();
        return;
      }

      const context = particleCanvasElement.getContext("2d");
      const completeLogo = logoElement.querySelector<HTMLElement>(
        ".preloader-logo-complete",
      );
      if (!context || !completeLogo) {
        completeLogo?.style.setProperty("opacity", "1");
        completeFormation();
        return;
      }

      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        window.innerWidth < 640 ? 1.5 : 2,
      );
      particleCanvasElement.width = Math.round(window.innerWidth * pixelRatio);
      particleCanvasElement.height = Math.round(
        window.innerHeight * pixelRatio,
      );
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const particles = createParticles(
        logoImage,
        logoElement.getBoundingClientRect(),
      );
      const formation = { progress: 0 };

      const renderParticles = () => {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const particle of particles) {
          const localProgress = Math.min(
            1,
            Math.max(0, (formation.progress - particle.delay) / 0.58),
          );
          if (localProgress <= 0) continue;

          const easedProgress = 1 - Math.pow(1 - localProgress, 3);
          const remainingMotion = 1 - easedProgress;
          const wave =
            Math.sin(particle.phase + localProgress * Math.PI * 4) *
            particle.drift *
            remainingMotion;
          const x =
            particle.startX +
            (particle.targetX - particle.startX) * easedProgress;
          const y =
            particle.startY +
            (particle.targetY - particle.startY) * easedProgress +
            wave;
          const alpha = Math.min(1, localProgress / 0.16);
          const width =
            particle.size * (1.8 - Math.min(0.8, localProgress * 0.8));
          const height = particle.size * (0.52 + localProgress * 0.48);

          context.globalAlpha = alpha;
          context.fillStyle = particle.color;
          context.fillRect(x, y, width, height);
        }

        context.globalAlpha = 1;
      };

      try {
        const { gsap } = await import("gsap");
        if (isDisposed) return;

        formationTimeline = gsap
          .timeline({ onComplete: completeFormation })
          .to(formation, {
            progress: 1,
            duration: 1.46,
            ease: "none",
            onUpdate: renderParticles,
          })
          .to(
            completeLogo,
            {
              autoAlpha: 1,
              duration: 0.12,
              ease: "power2.out",
            },
            "-=0.16",
          )
          .to(
            particleCanvasElement,
            {
              autoAlpha: 0,
              duration: 0.14,
              ease: "power2.out",
            },
            "<",
          );
      } catch {
        completeLogo.style.setProperty("opacity", "1");
        particleCanvasElement.style.setProperty("opacity", "0");
        completeFormation();
      }
    };

    const startFormation = (logoImage: HTMLImageElement) => {
      formationFrame = requestAnimationFrame(() => {
        if (isDisposed) return;
        formationStartedAt = performance.now();
        isFormationReady = true;
        void playParticleFormation(logoImage);
        scheduleExit();
      });
    };

    const waitForCriticalLogoAsset = async () => {
      const logoImage = new Image();
      logoImage.decoding = "async";
      logoImage.src = "/images/brand/schl-logo.png";

      await Promise.race([
        new Promise<void>((resolve) => {
          logoImage.onload = () => {
            void logoImage
              .decode()
              .catch(() => undefined)
              .then(() => resolve());
          };
          logoImage.onerror = () => resolve();
          if (logoImage.complete) {
            void logoImage
              .decode()
              .catch(() => undefined)
              .then(() => resolve());
          }
        }),
        new Promise<void>((resolve) => setTimeout(resolve, 180)),
      ]);

      if (!isDisposed && logoImage.naturalWidth > 0) {
        criticalLogoImage = logoImage;
        startFormation(logoImage);
      } else if (!isDisposed) {
        isFormationReady = true;
        logoElement
          ?.querySelector<HTMLElement>(".preloader-logo-complete")
          ?.style.setProperty("opacity", "1");
        completeFormation();
      }
    };

    if (!isPageReady) {
      document.addEventListener("DOMContentLoaded", handleDocumentReady, {
        once: true,
      });
    }
    void waitForCriticalLogoAsset();

    return () => {
      isDisposed = true;
      document.removeEventListener("DOMContentLoaded", handleDocumentReady);
      window.removeEventListener("site-header-ready", handleHeaderReady);
      if (formationFrame) cancelAnimationFrame(formationFrame);
      if (hideTimer) clearTimeout(hideTimer);
      if (headerReadyTimer) clearTimeout(headerReadyTimer);
      formationTimeline?.kill();
      landingTimeline?.kill();
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
    <div
      class="preloader-backdrop"
      bind:this={backdropElement}
      aria-hidden="true"
    ></div>

    <canvas
      class="preloader-particle-field"
      bind:this={particleCanvasElement}
      aria-hidden="true"
    ></canvas>

    <div
      class:preloader-formation-ready={isFormationReady}
      class="preloader-logo"
      bind:this={logoElement}
      aria-hidden="true"
    >
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
    will-change: opacity;
  }

  .preloader-particle-field {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
    contain: strict;
    will-change: opacity;
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

  .preloader-logo-complete {
    display: block;
    width: 100%;
    height: auto;
    opacity: 0;
  }

  @media (max-width: 39.999rem) {
    .preloader-logo {
      width: min(54vw, 13rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .preloader-particle-field {
      display: none;
    }

    .preloader-logo-complete {
      opacity: 1;
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
