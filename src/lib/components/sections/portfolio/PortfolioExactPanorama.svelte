<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let panoramaSection = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!panoramaSection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !panoramaSection) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const img = panoramaSection?.querySelector(".panorama-frame-img");
          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.08 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: panoramaSection,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }
        });
        return () => media.revert();
      }, panoramaSection);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<!-- Section 5: Full-Width Panoramic Craftsmanship Texture Photo (Exact Match to Weaving Banner in Image) -->
<section
  id="portfolio-craft-panorama"
  bind:this={panoramaSection}
  aria-label="Full-Width Craftsmanship Texture Panorama"
  class="relative w-full bg-brand-light pb-16 lg:pb-24 overflow-hidden"
>
  <div class="w-full max-w-[100vw] overflow-hidden">
    <div
      class="relative w-full aspect-[21/9] sm:aspect-[24/9] max-h-[580px] overflow-hidden bg-brand-dark/10"
    >
      <img
        src="/images/work-fields/gallery/jewelry-retouching.jpg"
        alt="Jewelry and product textures refined with sub-pixel precision"
        width="1600"
        height="900"
        loading="lazy"
        decoding="async"
        class="panorama-frame-img h-full w-full object-cover object-center will-change-transform"
      />
    </div>
  </div>
</section>
