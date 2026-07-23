<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let sectionRef: HTMLElement;
  let activeFilter = $state("all");

  const categories = [
    { id: "all", label: "All Work" },
    { id: "fashion", label: "Fashion & Editorial" },
    { id: "ecommerce", label: "E-Commerce & Packshots" },
    { id: "3d-cgi", label: "3D CGI & Motion" },
    { id: "color", label: "Color Grading" },
  ];

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionRef) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        gsap.fromTo(
          ".hero-text-anim",
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
          },
        );
      }, sectionRef);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  bind:this={sectionRef}
  id="portfolio-hero"
  aria-labelledby="portfolio-hero-title"
  class="relative overflow-hidden bg-brand-light pt-28 pb-12 text-brand-dark sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20"
>
  <!-- Subtle Grid Background -->
  <div
    class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(51,46,45,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,46,45,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10">
    <!-- Top Eyebrow -->
    <div
      class="hero-text-anim flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-dark/50"
    >
      <span class="h-px w-8 bg-brand-dark/20"></span>
      <span>Selected Work & Case Studies</span>
    </div>

    <!-- Main Title -->
    <h1
      id="portfolio-hero-title"
      class="hero-text-anim mt-6 font-display text-4xl font-light leading-[1.05] tracking-[-0.04em] text-brand-dark sm:text-6xl lg:text-7xl"
    >
      Visual precision <br />
      <span class="italic text-brand-green">in every frame.</span>
    </h1>

    <p
      class="hero-text-anim mt-6 max-w-2xl text-sm leading-relaxed text-brand-dark/78 sm:text-base md:text-lg"
    >
      Explore our studio portfolio across high-end editorial skin retouching,
      precision clipping path, background removal, and 3D CGI rendering.
    </p>

    <!-- Filter Pills -->
    <div
      class="hero-text-anim mt-10 flex flex-wrap items-center gap-2 sm:gap-3"
    >
      {#each categories as category (category.id)}
        <button
          type="button"
          onclick={() => (activeFilter = category.id)}
          class="rounded-full px-5 py-2.5 font-mono text-xs font-semibold tracking-wider transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-dark {activeFilter ===
          category.id
            ? 'bg-brand-dark text-brand-light shadow-md'
            : 'bg-brand-dark/5 text-brand-dark/70 hover:bg-brand-dark/10 hover:text-brand-dark'}"
        >
          {category.label}
        </button>
      {/each}
    </div>
  </div>
</section>
