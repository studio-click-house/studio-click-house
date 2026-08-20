<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let section = $state<HTMLElement | null>(null);
  let cutoutImage = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!section) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          if (cutoutImage) {
            gsap.from(cutoutImage, {
              scale: 0.9,
              y: 40,
              autoAlpha: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            });
          }
        });
        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<!-- Section 2: 3-Column Intro + Giant Watermark with Overlapping Center Cutout (Exact Match) -->
<section
  id="portfolio-intro-watermark"
  bind:this={section}
  aria-label="Studio Introduction and Creative Standard"
  class="relative w-full bg-brand-light pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden"
>
  <div class="site-shell relative z-10">
    <!-- Top Row: Decorative Motif + 3-Column Text Grid (Exact layout from image) -->
    <div
      class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 lg:mb-24"
    >
      <!-- Left Column: Bold Title -->
      <div class="md:col-span-4 flex flex-col items-start">
        <h2
          class="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-brand-dark leading-[1.1] tracking-tight"
        >
          The High-End Post-Production Standard 2026
        </h2>
      </div>

      <!-- Center Column: Editorial Narrative Paragraph 1 -->
      <div
        class="md:col-span-4 text-sm sm:text-base text-brand-dark/80 font-normal leading-relaxed"
      >
        <p>
          Studio Click House represents over a decade of dedicated craftsmanship
          in luxury fashion retouching, intricate clipping paths, invisible
          ghost mannequin reconstruction, and high-fidelity color grading for
          world-renowned brands.
        </p>
      </div>

      <!-- Right Column: Editorial Narrative Paragraph 2 -->
      <div
        class="md:col-span-4 text-sm sm:text-base text-brand-dark/80 font-normal leading-relaxed"
      >
        <p>
          Every image that passes through our workstations is handled by master
          digital artists adhering to lossless frequency separation, sub-pixel
          pen vector precision, and strict print-ready color standards.
        </p>
      </div>
    </div>

    <!-- Bottom Showcase: Giant Word Masked with Photo (Image 2 Match) -->
    <div class="relative flex items-center justify-center my-6 md:my-10 overflow-hidden select-none">
      <div
        bind:this={cutoutImage}
        class="studio-image-mask font-display text-[22vw] sm:text-[20vw] lg:text-[18vw] font-black uppercase tracking-tighter leading-none text-center w-full"
        aria-label="Studio Click House"
      >
        STUDIO
      </div>
    </div>
  </div>
</section>

<style>
  .studio-image-mask {
    background-image: url("/images/work-fields/gallery/fashion-color.jpg");
    background-size: cover;
    background-position: center 35%;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    filter: drop-shadow(0 10px 25px rgba(51, 46, 45, 0.08));
    will-change: transform;
  }
</style>
