<script lang="ts">
  import { onMount } from "svelte";
  import { portfolioPageData } from "$lib/content/portfolio";

  const trailImages = portfolioPageData.gallery
    .slice(0, 8)
    .map((item) => item.media.src);

  const imageWidth = 200;
  const imageHeight = 200;
  const threshold = 50;
  const duration = 1.6;

  let sectionElement: HTMLElement;

  onMount(() => {
    let active = true;
    let animationFrame: number | undefined;
    let imagePosition = 0;
    let zIndexValue = 1;
    let parentSize = { width: 0, height: 0 };
    let mousePosition = { x: 0, y: 0 };
    let cachedMousePosition = { x: 0, y: 0 };
    let lastMousePosition = { x: 0, y: 0 };
    const activeTimelines = new Set<{ kill: () => void }>();

    const calculateParentSize = () => {
      const rect = sectionElement.getBoundingClientRect();
      parentSize = { width: rect.width, height: rect.height };
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = sectionElement.getBoundingClientRect();
      mousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    calculateParentSize();

    import("gsap").then(({ gsap }) => {
      if (!active) return;

      const images = Array.from(
        sectionElement.querySelectorAll<HTMLImageElement>(".trail-image"),
      );
      if (images.length === 0) return;

      const lerp = (start: number, end: number, amount: number) =>
        (1 - amount) * start + amount * end;

      const getPointerDistance = () => {
        const deltaX = mousePosition.x - lastMousePosition.x;
        const deltaY = mousePosition.y - lastMousePosition.y;
        return Math.hypot(deltaX, deltaY);
      };

      const showNextImage = () => {
        const image = images[imagePosition];
        if (!image) return;

        const imageRect = image.getBoundingClientRect();
        const exitPosition = duration - 1 > 0 ? duration - 1 : 0.4;
        gsap.killTweensOf(image);

        let timeline: ReturnType<typeof gsap.timeline>;
        timeline = gsap
          .timeline({
            onComplete: () => activeTimelines.delete(timeline),
          })
          .set(image, {
            startAt: { opacity: 0 },
            opacity: 1,
            zIndex: zIndexValue,
            x: cachedMousePosition.x - imageRect.width / 2,
            y: cachedMousePosition.y - imageRect.height / 2,
          })
          .to(image, {
            duration,
            ease: "expo.out",
            x: mousePosition.x - imageRect.width / 2,
            y: mousePosition.y - imageRect.height / 2,
          })
          .to(
            image,
            {
              duration: 1,
              ease: "power1.out",
              opacity: 0,
            },
            exitPosition,
          )
          .to(
            image,
            {
              duration: 1,
              ease: "power4.inOut",
              y: `+=${parentSize.height + imageRect.height / 2}`,
            },
            exitPosition,
          );

        activeTimelines.add(timeline);
      };

      const renderImages = () => {
        if (!active) return;

        const distance = getPointerDistance();
        cachedMousePosition.x = lerp(
          cachedMousePosition.x,
          mousePosition.x,
          0.1,
        );
        cachedMousePosition.y = lerp(
          cachedMousePosition.y,
          mousePosition.y,
          0.1,
        );

        if (distance > threshold) {
          showNextImage();
          zIndexValue += 1;
          imagePosition = (imagePosition + 1) % images.length;
          lastMousePosition = { ...mousePosition };
        }

        animationFrame = requestAnimationFrame(renderImages);
      };

      animationFrame = requestAnimationFrame(renderImages);
    });

    sectionElement.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", calculateParentSize);

    return () => {
      active = false;
      sectionElement.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", calculateParentSize);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      activeTimelines.forEach((timeline) => timeline.kill());
      activeTimelines.clear();
    };
  });
</script>

<section
  id="image-trail"
  bind:this={sectionElement}
  aria-labelledby="image-trail-title"
  class="image-trail-section"
  style={`--trail-image-width: ${imageWidth}px; --trail-image-height: ${imageHeight}px;`}
>
  <div class="trail-copy">
    <p class="trail-kicker">
      <span aria-hidden="true"></span>
      Interactive image trail
    </p>

    <h2 id="image-trail-title">
      Move through
      <em>the work.</em>
    </h2>

    <p class="trail-description">
      Move your pointer across the field to release a trail of selected fashion,
      product, and detail frames.
    </p>

    <div class="trail-meta" aria-hidden="true">
      <span>08 selected frames</span>
      <span>Pointer study</span>
    </div>
  </div>

  {#each trailImages as image (image)}
    <img
      class="trail-image"
      src={image}
      alt=""
      width={imageWidth}
      height={imageHeight}
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
  {/each}
</section>

<style>
  .image-trail-section {
    position: relative;
    isolation: isolate;
    z-index: 0;
    display: flex;
    width: 100%;
    min-height: max(38rem, 100svh);
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: color-mix(
      in srgb,
      var(--color-brand-green) 42%,
      var(--color-brand-paper)
    );
    touch-action: pan-y;
  }

  .trail-image {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--trail-image-width);
    height: var(--trail-image-height);
    object-fit: cover;
    opacity: 0;
    pointer-events: none;
    will-change: transform, opacity;
  }

  .trail-copy {
    position: absolute;
    top: 50%;
    left: clamp(1.25rem, 5vw, 5rem);
    z-index: 0;
    width: min(34rem, calc(100% - 2.5rem));
    color: var(--color-brand-dark);
    pointer-events: none;
    transform: translateY(-50%);
  }

  .trail-kicker {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin: 0 0 1.25rem;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .trail-kicker span {
    width: 2.75rem;
    height: 1px;
    background: currentColor;
  }

  .trail-copy h2 {
    max-width: 9ch;
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(4rem, 8.4vw, 8.8rem);
    font-weight: 400;
    line-height: 0.82;
    letter-spacing: -0.055em;
  }

  .trail-copy h2 em {
    display: block;
    font-weight: 400;
  }

  .trail-description {
    max-width: 28rem;
    margin: 2rem 0 0;
    font-size: clamp(0.95rem, 1.25vw, 1.1rem);
    line-height: 1.55;
  }

  .trail-meta {
    display: flex;
    gap: 1.5rem;
    margin-top: 2.25rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  @media (max-width: 39.999rem) {
    .image-trail-section {
      min-height: 70svh;
    }

    .trail-image {
      width: 8.75rem;
      height: 8.75rem;
    }

    .trail-copy {
      top: auto;
      bottom: 3rem;
      transform: none;
    }

    .trail-copy h2 {
      font-size: clamp(3.5rem, 18vw, 5.25rem);
    }

    .trail-description {
      max-width: 20rem;
      margin-top: 1.4rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .image-trail-section {
      min-height: auto;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .trail-copy {
      position: relative;
      top: auto;
      left: auto;
      grid-column: 1 / -1;
      width: auto;
      padding: clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 5rem);
      transform: none;
    }

    .trail-image {
      position: static;
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      opacity: 1;
      will-change: auto;
    }
  }
</style>
