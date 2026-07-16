<script lang="ts">
  import { onMount } from "svelte";

  let cursorElement: HTMLDivElement;
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

      const moveX = gsap.quickTo(cursorElement, "x", {
        duration: 0.75,
        ease: "power2.out",
      });
      const moveY = gsap.quickTo(cursorElement, "y", {
        duration: 0.75,
        ease: "power2.out",
      });
      gsap.set(cursorElement, { xPercent: -50, yPercent: -50 });

      const handlePointerMove = (event: PointerEvent) => {
        isVisible = true;
        moveX(event.clientX);
        moveY(event.clientY);
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
      };

      const handlePointerDown = () => {
        isPressed = true;
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
        window.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerover", handlePointerOver);
        document.documentElement.removeEventListener(
          "mouseleave",
          handlePointerLeave,
        );
        window.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("pointerup", handlePointerUp);
        canUseCursorOrb.removeEventListener("change", handleMediaChange);
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

<style>
  .cursor-bubble {
    will-change: transform;
  }

  .bubble-shell {
    position: relative;
    display: block;
    width: 0.95rem;
    height: 0.95rem;
    margin-top: 1.65rem;
    margin-left: 1.65rem;
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
    background: var(--color-brand-acid);
    box-shadow: 0 0 1.2rem
      color-mix(in srgb, var(--color-brand-acid) 58%, transparent);
  }

  .cursor-pressed {
    transform: scale(0.6);
  }

  @media (pointer: coarse),
    (max-width: 63.999rem),
    (prefers-reduced-motion: reduce) {
    .cursor-bubble {
      display: none;
    }
  }
</style>
