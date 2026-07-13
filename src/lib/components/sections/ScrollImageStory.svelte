<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";

  let section: HTMLElement;

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;
    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap.fromTo(
              ".story-card-a",
              { xPercent: -12, yPercent: 8 },
              {
                xPercent: 3,
                yPercent: -10,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
            gsap.fromTo(
              ".story-card-b",
              { xPercent: 10, yPercent: 14 },
              {
                xPercent: -4,
                yPercent: -8,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.9,
                },
              },
            );
            gsap.fromTo(
              ".story-card-c",
              { yPercent: 20 },
              {
                yPercent: -14,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          },
        );
        return () => media.revert();
      }, section);
    });
    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="scroll-image-story"
  bind:this={section}
  aria-labelledby="scroll-image-story-title"
  class="relative overflow-hidden bg-brand-dark py-24 text-brand-light sm:py-32 lg:min-h-[130vh]"
>
  <div
    class="site-shell grid gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:items-start"
  >
    <div class="lg:sticky lg:top-32">
      <p class="eyebrow text-brand-green">Scroll study · source to final</p>
      <h2
        id="scroll-image-story-title"
        class="mt-8 max-w-md font-display text-6xl leading-[0.92] tracking-[-0.04em] sm:text-7xl"
      >
        One image. Many quiet decisions.
      </h2>
      <p class="mt-8 max-w-sm text-sm leading-relaxed text-brand-light/65">
        A visual workflow can move from source review to cleanup, color, detail,
        and final delivery without losing the character of the original frame.
      </p>
    </div>

    <div
      class="relative grid min-h-[50rem] grid-cols-6 grid-rows-6 sm:min-h-[64rem]"
    >
      <figure
        class="story-card-a col-span-5 col-start-1 row-span-3 row-start-1 will-change-transform"
      >
        <img
          src={previewMedia.perfumeStillLife.src}
          alt={previewMedia.perfumeStillLife.alt}
          width={previewMedia.perfumeStillLife.width}
          height={previewMedia.perfumeStillLife.height}
          loading="lazy"
          class="size-full object-cover"
        />
        <figcaption
          class="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-brand-light/50"
        >
          01 · Source / composition
        </figcaption>
      </figure>
      <figure
        class="story-card-b z-10 col-span-4 col-start-3 row-span-3 row-start-3 border-[0.75rem] border-brand-dark will-change-transform sm:border-[1.25rem]"
      >
        <img
          src={previewMedia.jewelryMacro.src}
          alt={previewMedia.jewelryMacro.alt}
          width={previewMedia.jewelryMacro.width}
          height={previewMedia.jewelryMacro.height}
          loading="lazy"
          class="size-full object-cover"
        />
        <figcaption
          class="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-brand-light/50"
        >
          02 · Detail / material
        </figcaption>
      </figure>
      <figure
        class="story-card-c z-20 col-span-3 col-start-1 row-span-2 row-start-5 border-[0.75rem] border-brand-dark will-change-transform sm:border-[1.25rem]"
      >
        <img
          src={previewMedia.redStudioPortrait.src}
          alt={previewMedia.redStudioPortrait.alt}
          width={previewMedia.redStudioPortrait.width}
          height={previewMedia.redStudioPortrait.height}
          loading="lazy"
          class="size-full object-cover"
        />
        <figcaption
          class="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-brand-light/50"
        >
          03 · Final / consistency
        </figcaption>
      </figure>
    </div>
  </div>
</section>
