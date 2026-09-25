<script lang="ts">
  import { onMount } from "svelte";
  import { Check, ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let sectionElement = $state<HTMLElement>();

  const capabilities = [
    {
      number: "01",
      title: "Luxury Bottles & Cosmetics",
      description: "Subsurface scattering for creams, true-to-life liquid physics, glass thickness refraction, and custom pump/cap mechanics.",
      deliverables: ["Physical glass refraction", "Liquid fill & bubbles", "Embossed typography & foils"],
    },
    {
      number: "02",
      title: "Fine Jewelry & Precious Metals",
      description: "Faceted gemstone dispersion, 18k yellow, rose, and white gold shaders, platinum, and micro-prong setting details.",
      deliverables: ["Diamond optical caustics", "Polished metal reflections", "Micro-detail gemstone prongs"],
    },
    {
      number: "03",
      title: "E-Commerce & Packaging",
      description: "Die-line folding cartons, matte finish pouches, metallic foil stamping, and vacuum-sealed shrink wraps.",
      deliverables: ["Accurate die-line folding", "Matte & gloss UV spot foils", "Photorealistic retail packs"],
    },
    {
      number: "04",
      title: "Electronics & Hard Surface",
      description: "Precision CAD surfacing, brushed aluminum chassis, tactile buttons, lens coatings, and micro-textured plastics.",
      deliverables: ["CAD to clean quad conversion", "Brushed metal finishes", "Detailed port & button bevels"],
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

          tl.from(".capabilities-header", {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
            clearProps: "all",
          }).from(
            ".capability-card",
            {
              y: 28,
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.08,
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
  id="threed-capabilities"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-28"
>
  <div class="site-shell relative z-10 space-y-12">
    <!-- Header Block -->
    <div class="capabilities-header max-w-3xl space-y-4">
      <h2 class="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.15] tracking-[-0.03em] font-bold text-brand-dark">
        What we model and create.
      </h2>

      <p class="text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed">
        From luxury perfumes and fine jewelry to retail packaging and consumer electronics, we specialize in high-end commercial 3D assets.
      </p>
    </div>

    <!-- 4 Capabilities Grid (Rounded Cards with Green Border Hover) -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {#each capabilities as item}
        <div class="capability-card flex flex-col justify-between rounded-[2rem] border border-brand-dark/10 bg-white p-7 sm:p-8 transition-colors duration-300 hover:border-brand-green">
          <div class="space-y-5">
            <span class="font-mono text-xl font-bold text-brand-green">
              {item.number}
            </span>

            <div class="space-y-2">
              <h3 class="font-display text-xl font-bold tracking-tight text-brand-dark">
                {item.title}
              </h3>
              <p class="text-xs sm:text-sm leading-relaxed text-brand-dark/70">
                {item.description}
              </p>
            </div>

            <!-- Deliverable bullets -->
            <div class="space-y-2 pt-2 border-t border-brand-dark/6">
              {#each item.deliverables as d}
                <div class="flex items-center gap-2">
                  <div class="size-1 rounded-full bg-brand-green shrink-0"></div>
                  <span class="font-sans text-xs text-brand-dark/80 font-medium">{d}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
