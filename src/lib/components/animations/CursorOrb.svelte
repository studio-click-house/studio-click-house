<script lang="ts">
  import { onMount } from "svelte";

  let cursorElement: HTMLDivElement;
  let trailCanvas: HTMLCanvasElement;
  let isVisible = $state(false);
  let isInteractive = $state(false);
  let isPressed = $state(false);

  onMount(() => {
    const canUseCursorOrb = window.matchMedia(
      "(pointer: fine) and (min-width: 64rem) and (prefers-reduced-motion: no-preference)",
    );
    if (!canUseCursorOrb.matches || !cursorElement) return;

    let active = true;
    let removeMediaListener: (() => void) | undefined;

    import("gsap").then(({ gsap }) => {
      if (!active || !cursorElement) return;

      const trailContext = trailCanvas?.getContext("2d");
      if (!trailContext) return;
      const trailColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-brand-acid")
        .trim();

      type TrailPoint = {
        x: number;
        y: number;
        age: number;
        velocityX: number;
        velocityY: number;
      };

      const trailPoints: TrailPoint[] = [];
      let trailFrame: number | undefined;
      let trailWidth = 0;
      let trailHeight = 0;
      let trailPixelRatio = 1;
      let scrollVelocityX = 0;
      let scrollVelocityY = 0;
      let lastScrollX = window.scrollX;
      let lastScrollY = window.scrollY;
      let lastScrollTime = performance.now();

      const resizeTrail = () => {
        trailPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        trailWidth = window.innerWidth;
        trailHeight = window.innerHeight;
        trailCanvas.width = trailWidth * trailPixelRatio;
        trailCanvas.height = trailHeight * trailPixelRatio;
        trailContext.setTransform(trailPixelRatio, 0, 0, trailPixelRatio, 0, 0);
      };

      const drawTrail = () => {
        trailContext.clearRect(0, 0, trailWidth, trailHeight);
        trailContext.shadowColor = "transparent";
        trailContext.shadowBlur = 0;
        trailContext.strokeStyle = "transparent";

        if (
          lastPointerX !== undefined &&
          lastPointerY !== undefined &&
          (Math.abs(scrollVelocityX) > 0.05 || Math.abs(scrollVelocityY) > 0.05)
        ) {
          trailPoints.push({
            x: lastPointerX,
            y: lastPointerY,
            age: 0,
            velocityX: scrollVelocityX * 0.85,
            velocityY: scrollVelocityY * 0.85,
          });
          if (trailPoints.length > 48) trailPoints.shift();
          scrollVelocityX *= 0.9;
          scrollVelocityY *= 0.9;
        }

        for (let index = trailPoints.length - 1; index >= 0; index -= 1) {
          const point = trailPoints[index];
          point.age += 0.055;
          point.x += point.velocityX;
          point.y += point.velocityY;
          point.velocityX *= 0.94;
          point.velocityY *= 0.94;

          if (point.age >= 1) {
            trailPoints.splice(index, 1);
            continue;
          }

          const interactionBoost = isInteractive ? 1.55 : 1;
          const opacity = Math.min(
            (1 - point.age) * 0.88 * interactionBoost,
            1,
          );
          const radius = (2.6 - point.age * 1.3) * interactionBoost;

          trailContext.beginPath();
          trailContext.arc(point.x, point.y, radius, 0, Math.PI * 2);
          trailContext.globalAlpha = opacity;
          trailContext.fillStyle = trailColor;
          trailContext.fill();
        }

        trailContext.globalAlpha = 1;

        if (
          trailPoints.length > 0 ||
          Math.abs(scrollVelocityX) > 0.05 ||
          Math.abs(scrollVelocityY) > 0.05
        ) {
          trailFrame = window.requestAnimationFrame(drawTrail);
        } else {
          trailFrame = undefined;
        }
      };

      const startTrail = () => {
        if (trailFrame === undefined) {
          trailFrame = window.requestAnimationFrame(drawTrail);
        }
      };

      resizeTrail();

      const moveX = gsap.quickTo(cursorElement, "x", {
        duration: 0.75,
        ease: "power2.out",
      });
      const moveY = gsap.quickTo(cursorElement, "y", {
        duration: 0.75,
        ease: "power2.out",
      });
      const settleScaleX = gsap.quickTo(cursorElement, "scaleX", {
        duration: 0.34,
        ease: "power2.out",
      });
      const settleScaleY = gsap.quickTo(cursorElement, "scaleY", {
        duration: 0.34,
        ease: "power2.out",
      });
      const settleRotation = gsap.quickTo(cursorElement, "rotation", {
        duration: 0.4,
        ease: "power2.out",
      });
      const bubbleOffset = 36;
      let previousX: number | undefined;
      let previousY: number | undefined;
      let lastTrailX: number | undefined;
      let lastTrailY: number | undefined;
      let lastPointerX: number | undefined;
      let lastPointerY: number | undefined;
      let settleTimeout: ReturnType<typeof setTimeout> | undefined;

      gsap.set(cursorElement, {
        xPercent: -50,
        yPercent: -50,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        transformOrigin: "50% 50%",
      });

      const handlePointerMove = (event: PointerEvent) => {
        isVisible = true;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        isInteractive = Boolean(
          (event.target as Element | null)?.closest(
            "a, button, input, textarea, select, summary, [role='button']",
          ),
        );
        moveX(event.clientX + bubbleOffset);
        moveY(event.clientY + bubbleOffset);

        const trailDistance =
          lastTrailX === undefined || lastTrailY === undefined
            ? Number.POSITIVE_INFINITY
            : Math.hypot(
                event.clientX - lastTrailX,
                event.clientY - lastTrailY,
              );

        const scrollIsActive =
          Math.abs(scrollVelocityX) > 0.2 || Math.abs(scrollVelocityY) > 0.2;

        if (trailDistance >= 10 && !scrollIsActive) {
          trailPoints.push({
            x: event.clientX,
            y: event.clientY,
            age: 0,
            velocityX: 0,
            velocityY: 0,
          });
          if (trailPoints.length > 24) trailPoints.shift();
          lastTrailX = event.clientX;
          lastTrailY = event.clientY;
          startTrail();
        }

        if (previousX !== undefined && previousY !== undefined) {
          const deltaX = event.clientX - previousX;
          const deltaY = event.clientY - previousY;
          const movement = Math.min(Math.hypot(deltaX, deltaY) / 22, 1);

          settleScaleX(1 + movement * 0.18);
          settleScaleY(1 - movement * 0.08);
          settleRotation(Math.atan2(deltaY, deltaX) * (180 / Math.PI) * 0.35);
        }

        previousX = event.clientX;
        previousY = event.clientY;

        if (settleTimeout) clearTimeout(settleTimeout);
        settleTimeout = setTimeout(() => {
          settleScaleX(1);
          settleScaleY(1);
          settleRotation(0);
          settleTimeout = undefined;
        }, 90);
      };

      const handleScroll = () => {
        if (lastPointerX === undefined || lastPointerY === undefined) return;

        const now = performance.now();
        const elapsed = Math.max(now - lastScrollTime, 16);
        const frameScale = 16 / elapsed;
        const deltaX = window.scrollX - lastScrollX;
        const deltaY = window.scrollY - lastScrollY;

        scrollVelocityX = Math.max(-8, Math.min(8, deltaX * frameScale * 0.12));
        scrollVelocityY = Math.max(
          -10,
          Math.min(10, -deltaY * frameScale * 0.12),
        );
        lastScrollX = window.scrollX;
        lastScrollY = window.scrollY;
        lastScrollTime = now;
        startTrail();
      };

      const handlePointerOver = (event: PointerEvent) => {
        isInteractive = Boolean(
          (event.target as Element | null)?.closest(
            "a, button, input, textarea, select, summary, [role='button']",
          ),
        );
      };

      const handlePointerLeave = () => {
        isVisible = false;
        isInteractive = false;
        isPressed = false;
        previousX = undefined;
        previousY = undefined;
        lastTrailX = undefined;
        lastTrailY = undefined;
        lastPointerX = undefined;
        lastPointerY = undefined;
        scrollVelocityX = 0;
        scrollVelocityY = 0;
        lastScrollX = window.scrollX;
        lastScrollY = window.scrollY;
        lastScrollTime = performance.now();
        if (settleTimeout) clearTimeout(settleTimeout);
        settleScaleX(1);
        settleScaleY(1);
        settleRotation(0);
        trailPoints.length = 0;
        trailContext.clearRect(0, 0, trailWidth, trailHeight);
      };

      const handlePointerDown = (event: PointerEvent) => {
        isPressed = true;

        const burstCount = 12;
        for (let index = 0; index < burstCount; index += 1) {
          const angle = (Math.PI * 2 * index) / burstCount;
          const speed = 1.4 + (index % 3) * 0.45;
          trailPoints.push({
            x: event.clientX,
            y: event.clientY,
            age: 0,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed,
          });
        }
        startTrail();
      };

      const handlePointerUp = () => {
        isPressed = false;
      };

      const handleMediaChange = () => {
        if (!canUseCursorOrb.matches) handlePointerLeave();
      };

      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", resizeTrail);
      document.addEventListener("pointerover", handlePointerOver, {
        passive: true,
      });
      document.documentElement.addEventListener(
        "mouseleave",
        handlePointerLeave,
      );
      window.addEventListener("pointerdown", handlePointerDown, {
        passive: true,
      });
      window.addEventListener("pointerup", handlePointerUp, { passive: true });
      canUseCursorOrb.addEventListener("change", handleMediaChange);
      removeMediaListener = () => {
        if (settleTimeout) clearTimeout(settleTimeout);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", resizeTrail);
        document.removeEventListener("pointerover", handlePointerOver);
        document.documentElement.removeEventListener(
          "mouseleave",
          handlePointerLeave,
        );
        window.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("pointerup", handlePointerUp);
        canUseCursorOrb.removeEventListener("change", handleMediaChange);
        if (trailFrame !== undefined) window.cancelAnimationFrame(trailFrame);
        trailPoints.length = 0;
        scrollVelocityX = 0;
        scrollVelocityY = 0;
        trailContext.clearRect(0, 0, trailWidth, trailHeight);
      };
    });

    return () => {
      active = false;
      removeMediaListener?.();
    };
  });
</script>

<div
  bind:this={cursorElement}
  aria-hidden="true"
  class="cursor-bubble fixed left-0 top-0 z-[110] pointer-events-none"
>
  <span
    class:cursor-visible={isVisible}
    class:cursor-interactive={isInteractive}
    class:cursor-pressed={isPressed}
    class="bubble-shell"
  >
  </span>
</div>

<canvas
  bind:this={trailCanvas}
  aria-hidden="true"
  class="cursor-trail fixed inset-0 z-[109] pointer-events-none"
></canvas>

<style>
  .cursor-bubble {
    will-change: transform;
  }

  .cursor-trail {
    width: 100vw;
    height: 100vh;
  }

  .bubble-shell {
    display: none;
    position: relative;
    width: 1.4rem;
    height: 1.4rem;
    margin-top: 0;
    margin-left: 0;
    border-radius: 999px;
    background: var(--color-brand-green);
    box-shadow: 0 0 1rem
      color-mix(in srgb, var(--color-brand-green) 46%, transparent);
    opacity: 0;
    transform: scale(0.72);
    transition:
      opacity 180ms ease,
      transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
      background 220ms ease,
      box-shadow 220ms ease;
  }

  .cursor-visible {
    opacity: 1;
    transform: scale(1);
  }

  .cursor-interactive {
    transform: scale(1.32);
    background: color-mix(
      in srgb,
      var(--color-brand-green) 72%,
      var(--color-brand-dark)
    );
    box-shadow: 0 0 1.2rem
      color-mix(in srgb, var(--color-brand-green) 58%, transparent);
  }

  .cursor-pressed {
    transform: scale(0.6);
    background: color-mix(
      in srgb,
      var(--color-brand-green) 48%,
      var(--color-brand-dark)
    );
    box-shadow: 0 0 1rem
      color-mix(in srgb, var(--color-brand-green) 42%, transparent);
  }

  @media (pointer: coarse),
    (max-width: 63.999rem),
    (prefers-reduced-motion: reduce) {
    .cursor-bubble {
      display: none;
    }
  }
</style>
