<script lang="ts">
  import { onDestroy } from "svelte";

  interface Props {
    beforeSrc: string;
    beforeAlt?: string;
    afterSrc: string;
    afterAlt?: string;
    width?: number;
    height?: number;
    beforeWidth?: number;
    beforeHeight?: number;
    beforeLabel?: string;
    afterLabel?: string;
    ariaLabel?: string;
    backLeftSrc?: string;
    backLeftWidth?: number;
    backLeftHeight?: number;
    backRightSrc?: string;
    backRightWidth?: number;
    backRightHeight?: number;
  }

  let {
    beforeSrc,
    beforeAlt = "Original image before editing",
    afterSrc,
    afterAlt = "Finished image after editing",
    width = 1024,
    height = 1280,
    beforeWidth = width,
    beforeHeight = height,
    beforeLabel = "Before",
    afterLabel = "After",
    ariaLabel = "Compare before and after images",
    backLeftSrc = beforeSrc,
    backLeftWidth = beforeWidth,
    backLeftHeight = beforeHeight,
    backRightSrc = afterSrc,
    backRightWidth = width,
    backRightHeight = height,
  }: Props = $props();

  let sliderPosition = $state(52);
  let mediaPreviewElement = $state<HTMLElement>();
  let glowElement = $state<HTMLElement>();
  let backCardLeft = $state<HTMLElement>();
  let backCardRight = $state<HTMLElement>();
  let active = true;

  const backCardClass =
    "pointer-events-none absolute inset-0 m-0 size-full overflow-hidden rounded-[clamp(0.85rem,1.5vw,1.25rem)] bg-brand-dark opacity-[0.42] shadow-[0_1rem_3rem_rgb(0_0_0/0.24)] [filter:saturate(0.68)_brightness(0.8)] [transition:transform_0.45s_cubic-bezier(0.16,1,0.3,1),opacity_0.45s_ease] [will-change:transform,opacity] motion-reduce:transition-none";
  const comparisonImageClass = "absolute inset-0 m-0 size-full overflow-hidden";
  const comparisonMediaClass =
    "absolute inset-0 size-full scale-[1.02] object-cover";
  const mediaLabelClass =
    "absolute top-[0.8rem] z-[5] rounded-full border border-brand-light/30 bg-brand-dark/40 px-3 py-[0.38rem] font-mono text-[0.46rem] uppercase tracking-[0.13em] text-brand-light backdrop-blur-[0.35rem]";

  function updateComparison(event: Event) {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) return;

    sliderPosition = Number(input.value);
  }

  function previewComparison(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;

    const control = event.currentTarget;
    if (!(control instanceof HTMLInputElement)) return;

    const bounds = control.getBoundingClientRect();
    const pointerPosition =
      ((event.clientX - bounds.left) / bounds.width) * 100;
    sliderPosition = Math.min(100, Math.max(0, pointerPosition));
  }

  function handlePointerMove(event: PointerEvent) {
    const previewElement = mediaPreviewElement;
    if (
      event.pointerType !== "mouse" ||
      !previewElement ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = previewElement.getBoundingClientRect();
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;

    void import("gsap").then(({ gsap }) => {
      if (!active) return;

      gsap.to(previewElement, {
        rotateX: -normalizedY * 8,
        rotateY: normalizedX * 8,
        scale: 1.015,
        transformPerspective: 1000,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (glowElement) {
        gsap.to(glowElement, {
          x: normalizedX * 24,
          y: normalizedY * 24,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (backCardLeft) {
        gsap.to(backCardLeft, {
          x: -24 + normalizedX * 10,
          y: -12 + normalizedY * 8,
          rotate: -6 + normalizedX * 4,
          scale: 0.96,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (backCardRight) {
        gsap.to(backCardRight, {
          x: 24 + normalizedX * 10,
          y: 12 + normalizedY * 8,
          rotate: 6 + normalizedX * 4,
          scale: 0.96,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    });
  }

  function handlePointerLeave() {
    const previewElement = mediaPreviewElement;
    if (!previewElement) return;

    void import("gsap").then(({ gsap }) => {
      if (!active) return;

      gsap.to(previewElement, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (glowElement) {
        gsap.to(glowElement, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (backCardLeft) {
        gsap.to(backCardLeft, {
          x: -12,
          y: -6,
          rotate: -3,
          scale: 0.94,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (backCardRight) {
        gsap.to(backCardRight, {
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

  onDestroy(() => {
    active = false;

    void import("gsap").then(({ gsap }) => {
      gsap.killTweensOf([
        mediaPreviewElement,
        glowElement,
        backCardLeft,
        backCardRight,
      ]);
    });
  });
</script>

<div
  bind:this={glowElement}
  class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-brand-green)_12%,transparent)_0%,transparent_70%)] blur-[30px] will-change-transform"
  aria-hidden="true"
></div>

<div
  class="preview-stack relative z-[1] aspect-[4/5] w-full [perspective:1000px] [transform-style:preserve-3d] motion-reduce:animate-none"
>
  <figure
    bind:this={backCardLeft}
    class="{backCardClass} z-[-1] -translate-x-3 -translate-y-1.5 -rotate-3 scale-[0.94]"
    aria-hidden="true"
  >
    <img
      src={backLeftSrc}
      alt=""
      width={backLeftWidth}
      height={backLeftHeight}
      loading="lazy"
      class="size-full object-cover"
    />
  </figure>

  <figure
    bind:this={backCardRight}
    class="{backCardClass} z-[-2] translate-x-3 translate-y-1.5 rotate-3 scale-[0.94]"
    aria-hidden="true"
  >
    <img
      src={backRightSrc}
      alt=""
      width={backRightWidth}
      height={backRightHeight}
      loading="lazy"
      class="size-full object-cover"
    />
  </figure>

  <div
    bind:this={mediaPreviewElement}
    role="group"
    aria-label={ariaLabel}
    onpointermove={handlePointerMove}
    onpointerleave={handlePointerLeave}
    class="comparison-preview group relative z-[2] isolate m-0 aspect-[4/5] overflow-hidden rounded-[clamp(0.85rem,1.5vw,1.25rem)] bg-brand-dark text-brand-light shadow-[0_2rem_5rem_rgb(0_0_0/0.42)] [backface-visibility:hidden] [transform-style:preserve-3d] will-change-transform"
  >
    <figure class={comparisonImageClass}>
      <img
        src={beforeSrc}
        alt={beforeAlt}
        width={beforeWidth}
        height={beforeHeight}
        loading="lazy"
        class="{comparisonMediaClass} [filter:saturate(0.5)_contrast(0.9)_brightness(0.92)]"
      />
    </figure>

    <figure
      class="comparison-after {comparisonImageClass} z-[2] [will-change:clip-path]"
      style={`--comparison-position: ${sliderPosition}%`}
    >
      <img
        src={afterSrc}
        alt={afterAlt}
        {width}
        {height}
        loading="lazy"
        class={comparisonMediaClass}
      />
    </figure>

    <span class="{mediaLabelClass} left-[0.8rem]">{beforeLabel}</span>
    <span class="{mediaLabelClass} right-[0.8rem]">{afterLabel}</span>

    <span
      class="comparison-divider pointer-events-none absolute inset-y-0 z-[4] w-px bg-brand-light/80 [will-change:left]"
      style={`--comparison-position: ${sliderPosition}%`}
      aria-hidden="true"
    >
      <span
        class="absolute left-1/2 top-1/2 grid aspect-square w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand-light/60 bg-brand-dark/60 text-[0.65rem] text-brand-light backdrop-blur-[0.35rem]"
        >&harr;</span
      >
    </span>

    <input
      class="comparison-control absolute inset-0 z-[6] m-0 size-full cursor-ew-resize opacity-0 focus:outline-none"
      type="range"
      min="0"
      max="100"
      value={sliderPosition}
      aria-label={ariaLabel}
      oninput={updateComparison}
      onpointermove={previewComparison}
    />
  </div>
</div>

<style>
  .preview-stack {
    animation: preview-enter 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .comparison-after {
    clip-path: inset(0 0 0 var(--comparison-position));
  }

  .comparison-divider {
    left: var(--comparison-position);
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

  @media (prefers-reduced-motion: reduce) {
    .preview-stack {
      animation: none;
    }
  }
</style>
