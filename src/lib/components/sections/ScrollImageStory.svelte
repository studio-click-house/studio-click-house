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

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".story-copy", {
            autoAlpha: 0,
            y: 34,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          });
        });

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap.fromTo(
              ".story-image",
              { yPercent: 7 },
              {
                yPercent: -7,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
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
  class="relative overflow-hidden bg-brand-dark pt-16 pb-2 text-brand-light sm:pt-20 sm:pb-3"
>
  <div
    class="site-shell grid gap-14 lg:grid-cols-[0.68fr_1.32fr] lg:items-center"
  >
    <div>
      <p class="story-copy eyebrow text-brand-green">
        Scroll study · source to final
      </p>
      <h2
        id="scroll-image-story-title"
        class="story-copy mt-8 max-w-md font-display text-6xl leading-[0.92] tracking-[-0.04em] sm:text-7xl"
      >
        One image. Many quiet decisions.
      </h2>
      <p
        class="story-copy mt-8 max-w-sm text-sm leading-relaxed text-brand-light/65"
      >
        A visual workflow can move from source review to cleanup, color, detail,
        and final delivery without losing the character of the original frame.
      </p>
    </div>

    <figure class="story-image will-change-transform">
      <div class="overflow-hidden">
        <img
          src={previewMedia.perfumeStillLife.src}
          alt={previewMedia.perfumeStillLife.alt}
          width={previewMedia.perfumeStillLife.width}
          height={previewMedia.perfumeStillLife.height}
          loading="lazy"
          class="aspect-[4/3] w-full object-cover"
        />
      </div>
      <figcaption
        class="mt-3 flex justify-between gap-4 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-brand-light/50"
      >
        <span>01 · Source / composition</span>
        <span>Scroll study</span>
      </figcaption>
    </figure>
  </div>
</section>
