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
  class="relative w-full bg-brand-light pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-brand-dark/10"
>
  <div class="site-shell relative z-10">
    <!-- Top Row: Decorative Motif + 3-Column Text Grid (Exact layout from image) -->
    <div
      class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 lg:mb-24"
    >
      <!-- Left Column: Decorative Flourish + Bold Title -->
      <div class="md:col-span-4 flex flex-col items-start">
        <!-- SVG Flourish Motif in Brand Green -->
        <div class="flex items-center gap-1.5 text-brand-green mb-4">
          <svg
            class="size-6 text-brand-green"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 2L14.5 8.5L21 9.5L16 14.5L17.5 21L12 17.5L6.5 21L8 14.5L3 9.5L9.5 8.5L12 2Z"
            />
          </svg>
          <span
            class="font-mono text-xs uppercase tracking-widest font-semibold text-brand-green"
          >
            Editorial Standard
          </span>
        </div>

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

    <!-- Bottom Showcase: Giant Watermark Word with Centered Overlapping Cutout Photo (Exact match from image) -->
    <div class="relative flex items-center justify-center my-6 md:my-10">
      <!-- Massive Bold Watermark Text in Brand Green Tint -->
      <div
        class="font-display text-[22vw] sm:text-[20vw] lg:text-[18vw] font-black uppercase tracking-tighter text-brand-green/25 leading-none select-none text-center pointer-events-none w-full"
        aria-hidden="true"
      >
        STUDIO
      </div>

      <!-- Centered Layered Photo breaking right through the center of the letters (Exact match) -->
      <div
        bind:this={cutoutImage}
        class="absolute z-20 w-44 overflow-hidden border border-brand-dark/10 bg-brand-light shadow-xl sm:w-60 md:w-80 lg:w-96"
      >
        <div class="aspect-[4/3] w-full overflow-hidden bg-brand-dark/5">
          <img
            src="/images/work-fields/gallery/fashion-color.jpg"
            alt="Studio Click House fashion post-production craftsmanship"
            width="1600"
            height="900"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover object-center scale-105 transition-transform duration-700 hover:scale-110"
          />
        </div>
      </div>
    </div>
  </div>
</section>
