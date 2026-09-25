<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpRight, Sparkles } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let sectionElement = $state<HTMLElement>();

  const showcases = [
    {
      id: "dual-phase-fragrance",
      title: "Dual-Phase Luxury Perfume",
      subtitle: "3D Quad Wireframe & Photorealistic Glass",
      description: "Subdivision surface modeling showing clean quad topology transitioning into emerald glass refraction, liquid physics, and dark studio lighting.",
      image: "/images/portfolio/3d-cgi-showcase-v2.webp",
      tags: ["Quad Topology", "Glass Refraction", "Liquid Physics"],
      span: "lg:col-span-7",
      aspect: "aspect-[16/10]",
    },
    {
      id: "ray-traced-bottle",
      title: "Aurélie Night Veil Fragrance",
      subtitle: "Commercial Ray-Traced Hero Still",
      description: "Physically based ray-traced lighting, textured slate stone base, optical glass caustics, and embossed metallic gold typography.",
      image: "/images/portfolio/cgi-product-showcase.png",
      tags: ["Ray-Traced Caustics", "Foil Stamping", "PBR Slate"],
      span: "lg:col-span-5",
      aspect: "aspect-[16/12] lg:aspect-[16/10]",
    },
  ];

  onMount(() => {
    let ctx: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      const currentSection = sectionElement;
      if (!active || !runtime || !currentSection) return;
      const { gsap } = runtime;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: currentSection,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
            defaults: { ease: "power3.out" },
          });

          tl.from(".gallery-header", {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
            clearProps: "all",
          }).from(
            ".gallery-card",
            {
              y: 32,
              autoAlpha: 0,
              duration: 0.75,
              stagger: 0.12,
              clearProps: "all",
            },
            "-=0.35",
          );
        });
      }, currentSection);
    });

    return () => {
      active = false;
      ctx?.revert();
    };
  });
</script>

<section
  bind:this={sectionElement}
  id="threed-showcase"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-28"
>
  <div class="site-shell relative z-10 space-y-12">
    <!-- Header Block -->
    <div class="gallery-header max-w-3xl space-y-4">
      <h2 class="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.15] tracking-[-0.03em] font-bold text-brand-dark">
        Photorealistic 3D gallery.
      </h2>

      <p class="text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed">
        Real 3D models and commercial CGI renders created for luxury packaging, cosmetics, and brand campaigns.
      </p>
    </div>

    <!-- 3D Showcase Grid (Large Editorial Cards) -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {#each showcases as item}
        <div
          class="gallery-card group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-brand-dark/10 bg-white transition-all duration-300 hover:border-brand-green {item.span}"
        >
          <!-- Image Stage -->
          <div class="relative w-full overflow-hidden bg-black {item.aspect}">
            <img
              src={item.image}
              alt={item.title}
              class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- Content Details -->
          <div class="p-7 sm:p-9 space-y-4">
            <div class="space-y-1.5">
              <span class="font-mono text-xs uppercase tracking-wider text-brand-green font-bold">
                {item.subtitle}
              </span>
              <h3 class="font-display text-2xl font-bold tracking-tight text-brand-dark">
                {item.title}
              </h3>
            </div>

            <p class="text-sm leading-relaxed text-brand-dark/75 max-w-[54ch]">
              {item.description}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap items-center gap-2 pt-2">
              {#each item.tags as tag}
                <span class="rounded-full bg-brand-dark/5 px-3 py-1 text-xs font-semibold text-brand-dark/70">
                  {tag}
                </span>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
