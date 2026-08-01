<script lang="ts">
  let {
    beforeSrc,
    beforeAlt = "Original raw image",
    afterSrc,
    afterAlt = "Retouched finished image",
    width = 1024,
    height = 1024,
    beforeLabel = "Before",
    afterLabel = "After",
    aspectRatio = "aspect-[4/5]",
  } = $props<{
    beforeSrc: string;
    beforeAlt?: string;
    afterSrc: string;
    afterAlt?: string;
    width?: number;
    height?: number;
    beforeLabel?: string;
    afterLabel?: string;
    aspectRatio?: string;
  }>();

  let sliderPosition = $state(50);

  function handleInput(event: Event) {
    const input = event.currentTarget;
    if (input instanceof HTMLInputElement) {
      sliderPosition = Number(input.value);
    }
  }
</script>

<div
  class="before-after-container relative w-full select-none overflow-hidden bg-brand-paper {aspectRatio}"
  style="--slider-position: {sliderPosition}%"
>
  <figure class="absolute inset-0 m-0 size-full">
    <img
      src={beforeSrc}
      alt={beforeAlt}
      {width}
      {height}
      loading="lazy"
      class="size-full object-cover"
    />
    <span
      class="comparison-label absolute left-4 top-4 rounded-full px-3 py-1.5 font-mono text-[0.55rem] font-medium uppercase tracking-[0.16em] text-brand-light sm:left-5 sm:top-5"
    >
      {beforeLabel}
    </span>
  </figure>

  <figure
    class="pointer-events-none absolute inset-0 z-10 m-0 size-full"
    style="clip-path: inset(0 0 0 {sliderPosition}%)"
  >
    <img
      src={afterSrc}
      alt={afterAlt}
      {width}
      {height}
      loading="lazy"
      class="size-full object-cover"
    />
    <span
      class="comparison-label absolute right-4 top-4 rounded-full px-3 py-1.5 font-mono text-[0.55rem] font-medium uppercase tracking-[0.16em] text-brand-light sm:right-5 sm:top-5"
    >
      {afterLabel}
    </span>
  </figure>

  <div
    class="pointer-events-none absolute inset-y-0 z-20 w-px bg-brand-light"
    style="left: {sliderPosition}%"
  >
    <div
      class="comparison-handle pointer-events-none absolute left-1/2 top-1/2 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full"
    ></div>
  </div>

  <input
    type="range"
    min="0"
    max="100"
    value={sliderPosition}
    oninput={handleInput}
    class="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
    aria-label="Compare before and after images"
  />
</div>

<style>
  .before-after-container {
    border-radius: clamp(0.85rem, 1.5vw, 1.25rem);
    box-shadow: 0 1.25rem 3.5rem rgb(51 46 45 / 0.08);
  }

  .comparison-label,
  .comparison-handle {
    border: 1px solid rgb(248 248 246 / 0.42);
    background: rgb(51 46 45 / 0.3);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 0.28),
      0 0.5rem 1.5rem rgb(31 29 28 / 0.16);
    backdrop-filter: blur(12px) saturate(1.18);
  }

  .comparison-handle::after {
    position: absolute;
    inset: 50% auto auto 50%;
    width: 0.28rem;
    height: 0.28rem;
    border-radius: 999px;
    background: rgb(248 248 246 / 0.9);
    box-shadow: 0 0 0 0.28rem rgb(248 248 246 / 0.14);
    content: "";
    transform: translate(-50%, -50%);
  }

  input[type="range"]::-webkit-slider-runnable-track {
    background: transparent;
  }

  input[type="range"]::-webkit-slider-thumb {
    width: 40px;
    height: 100%;
    border: none;
    background: transparent;
  }
</style>
