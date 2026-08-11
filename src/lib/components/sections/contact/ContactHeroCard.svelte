<script lang="ts">
  import { onDestroy } from "svelte";

  interface Props {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    aspectClass?: string;
    loading?: "eager" | "lazy";
  }

  let {
    src,
    alt = "",
    width = 1200,
    height = 1600,
    aspectClass = "aspect-[2/3] w-full",
    loading = "lazy",
  }: Props = $props();

  let cardElement = $state<HTMLElement | null>(null);
  let active = true;

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType !== "mouse" || !cardElement) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = cardElement.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const relativeY = event.clientY - bounds.top;

    const normalizedX = relativeX / bounds.width - 0.5;
    const normalizedY = relativeY / bounds.height - 0.5;

    import("gsap").then(({ gsap }) => {
      if (!active) return;
      gsap.to(cardElement, {
        rotateX: -normalizedY * 8,
        rotateY: normalizedX * 8,
        scale: 1.025,
        transformPerspective: 1000,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }

  function handlePointerLeave() {
    import("gsap").then(({ gsap }) => {
      if (!active) return;
      gsap.to(cardElement, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }

  onDestroy(() => {
    active = false;
    import("gsap").then(({ gsap }) => {
      gsap.killTweensOf(cardElement);
    });
  });
</script>

<div
  bind:this={cardElement}
  role="figure"
  aria-label="3D tilt visual card"
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
  class="contact-hero-tilt-card relative overflow-hidden rounded-[0.75rem] border border-brand-mist/40 bg-brand-dark select-none [perspective:1000px] [transform-style:preserve-3d] will-change-transform {aspectClass}"
>
  <img
    {src}
    {alt}
    {width}
    {height}
    {loading}
    class="absolute inset-0 size-full scale-[1.01] object-cover pointer-events-none"
  />
</div>
