<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";
  import { CheckCircle2, Clock, Sparkles } from "lucide-svelte";

  let sectionElement = $state<HTMLElement | null>(null);
  let activeTab = $state(0);

  interface ServiceItem {
    index: string;
    label: string;
    image: string;
    desc: string;
    sla: string;
    deliverables: string[];
  }

  const services: ServiceItem[] = [
    {
      index: "01",
      label: "Editorial Retouch",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
      desc: "High-end fashion retouching, beauty cleaning, and fabric sculpting for global lookbooks and editorial campaigns.",
      sla: "12–24 Hours",
      deliverables: [
        "Campaign & High-End Fashion",
        "Commercial & Catalog Cleaning",
        "Anatomical & Fabric Sculpting",
        "High-End Beauty & Portraiture",
      ],
    },
    {
      index: "02",
      label: "Vector Clipping",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1400&q=85",
      desc: "Precision hand-drawn clipping paths and multipath masks for flawless background isolation and recoloring.",
      sla: "6–12 Hours",
      deliverables: [
        "Single Path Vector Clipping",
        "Multi-Path Layering & Masking",
        "Background Erasure & PNGs",
        "Contact Shadows & Reflections",
      ],
    },
    {
      index: "03",
      label: "Color & Swatches",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=85",
      desc: "Calibrating and shifting product colors for absolute brand accuracy and seamless SKU consistency.",
      sla: "12–18 Hours",
      deliverables: [
        "Swatch & Color Target Matching",
        "Cross-SKU Color Consistency",
        "Product Color Changing",
        "Metallic & Sheen Enhancement",
      ],
    },
    {
      index: "04",
      label: "3D CGI & Scopes",
      image: "/images/portfolio/3d-cgi-showcase-v2.webp",
      desc: "Bespoke 3D CGI product modeling, photorealistic rendering, wireframe visualization, and advanced luxury compositing.",
      sla: "24–48 Hours",
      deliverables: [
        "3D Mesh & Wireframe Modeling",
        "Photorealistic CGI Rendering",
        "Glass, Caustics & Refractions",
        "Macro Jewelry & Luxury Bottles",
      ],
    },
  ];

  let current = $derived(services[activeTab]);

  $effect(() => {
    if (!sectionElement) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionElement) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add(
          {
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          (context) => {
            const { isDesktop, isTablet, isMobile, reduceMotion } = context.conditions!;
            if (reduceMotion) {
              gsap.set(".matrix-anim-target", { autoAlpha: 1, y: 0 });
              return;
            }

            const yOffset = isDesktop ? 36 : isTablet ? 28 : 38;
            const duration = isDesktop ? 0.85 : isTablet ? 0.75 : 0.75;
            const startTrigger = isDesktop ? "top 78%" : isTablet ? "top 80%" : "top 78%";

            gsap.from(".matrix-anim-target", {
              y: yOffset,
              scale: 0.98,
              autoAlpha: 0,
              duration,
              ease: isDesktop ? "power3.out" : "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: sectionElement,
                start: startTrigger,
                toggleActions: "play none none reverse",
              },
            });
          }
        );
        return () => media.revert();
      }, sectionElement);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="portfolio-tabbed-matrix"
  bind:this={sectionElement}
  aria-label="Disciplines and Deliverables Catalog"
  class="relative w-full bg-brand-light py-20 lg:py-32"
>
  <div class="site-shell relative z-10">
    <!-- Editorial Section Header -->
    <div class="matrix-anim-target max-w-3xl mb-10 lg:mb-14">
      <span class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-green mb-3 block">
        {$_('portfolio.matrix.eyebrow') || 'Disciplines & Scopes'}
      </span>
      <h2 class="font-display text-3xl sm:text-5xl lg:text-6xl font-normal text-brand-dark leading-[1.05] tracking-tight mb-4">
        {$_('portfolio.matrix.headingPart1') || 'How we enforce'} <span class="italic font-light text-brand-green">{$_('portfolio.matrix.headingPart2') || 'precision'}</span> {$_('portfolio.matrix.headingPart3') || 'at scale.'}
      </h2>
      <p class="text-sm sm:text-base text-brand-dark/75 leading-relaxed font-normal">
        {$_('portfolio.matrix.description') || 'Explore our primary disciplines spanning campaign fashion, e-commerce catalog production, and 3D CGI.'}
      </p>
    </div>

    <!-- Clean Editorial Discipline Tabs (Horizontally scrollable on mobile) -->
    <div class="matrix-anim-target flex overflow-x-auto no-scrollbar sm:flex-wrap gap-4 sm:gap-8 mb-8 sm:mb-10 border-b border-brand-dark/10 pb-3" role="tablist" aria-label="Discipline Tabs">
      {#each services as item, index (item.index)}
        <button
          type="button"
          role="tab"
          id="discipline-tab-{index}"
          aria-selected={activeTab === index}
          aria-controls="discipline-panel-{index}"
          onclick={() => (activeTab = index)}
          class="flex items-center gap-2 pb-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border-b-2 -mb-[13px] shrink-0 {activeTab === index ? 'border-brand-green text-brand-dark font-bold' : 'border-transparent text-brand-dark/50 hover:text-brand-dark'}"
        >
          <span class="text-brand-green">{item.index}</span>
          <span>{item.label}</span>
        </button>
      {/each}
    </div>

    <!-- Active Discipline Feature Showcase -->
    <div
      id="discipline-panel-{activeTab}"
      role="tabpanel"
      aria-labelledby="discipline-tab-{activeTab}"
      class="matrix-anim-target grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-2xl md:rounded-3xl border border-brand-dark/10 bg-white p-6 sm:p-8 lg:p-12 shadow-sm"
    >
      <!-- Visual Column (Full Edge-to-Edge Frame) -->
      <div class="lg:col-span-6 relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-brand-dark/5 border border-brand-dark/10">
        <img
          src={current.image}
          alt="{current.label} deliverable preview"
          class="h-full w-full object-cover object-center transition-all duration-500"
          loading="lazy"
          decoding="async"
        />
      </div>

      <!-- Description & Deliverables Column -->
      <div class="lg:col-span-6 flex flex-col justify-center">
        <div class="flex flex-wrap items-baseline justify-between gap-2 mb-3 pb-3 border-b border-brand-dark/10">
          <div class="flex items-baseline gap-2">
            <span class="font-mono text-sm text-brand-green font-bold">{current.index} //</span>
            <h3 class="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-brand-dark">
              {current.label}
            </h3>
          </div>
          <span class="font-mono text-xs text-brand-dark/60 uppercase tracking-wider">
            Turnaround: {current.sla}
          </span>
        </div>

        <p class="text-sm sm:text-base text-brand-dark/75 leading-relaxed font-normal mb-8">
          {current.desc}
        </p>

        <div class="pt-6 border-t border-brand-dark/10">
          <span class="font-mono text-xs uppercase tracking-wider text-brand-dark/50 font-semibold block mb-4">
            Production Deliverables
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {#each current.deliverables as del (del)}
              <div class="flex items-center gap-2">
                <CheckCircle2 class="size-4 text-brand-green shrink-0" />
                <span class="text-xs sm:text-sm text-brand-dark/85 font-medium leading-tight">{del}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
