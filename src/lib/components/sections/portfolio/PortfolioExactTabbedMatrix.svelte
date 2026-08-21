<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let sectionElement = $state<HTMLElement | null>(null);

  interface ServiceItem {
    index: string;
    label: string;
    image: string;
    desc: string;
    deliverables: string[];
  }

  const services: ServiceItem[] = [
    {
      index: "01",
      label: "Editorial Retouch",
      image: "/images/work-fields/gallery/beauty-retouching.jpg",
      desc: "High-end fashion retouching, beauty cleaning, and fabric sculpting for global lookbooks and editorial campaigns.",
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
      image: "/images/work-fields/gallery/product-retouching.jpg",
      desc: "Precision hand-drawn clipping paths and multipath masks for flawless background isolation and recoloring.",
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
      image: "/images/work-fields/gallery/fashion-color.jpg",
      desc: "Calibrating and shifting product colors for absolute brand accuracy and seamless SKU consistency.",
      deliverables: [
        "Swatch & Color Target Matching",
        "Cross-SKU Color Consistency",
        "Product Color Changing",
        "Metallic & Sheen Enhancement",
      ],
    },
    {
      index: "04",
      label: "Special Scopes",
      image: "/images/portfolio/3d-cgi-showcase-v2.jpg",
      desc: "Bespoke post-production including invisible ghost mannequin, collar construction, and custom 3D CGI.",
      deliverables: [
        "Ghost Mannequin / Invisible",
        "Collar & Neck Joint Insertion",
        "Pattern Alignment & Stitching",
        "Macro Jewelry & Watch Polish",
      ],
    },
  ];

  $effect(() => {
    if (!sectionElement) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionElement) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".service-card", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionElement,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        });
        return () => media.revert();
      }, sectionElement);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<!-- Section 6: Editorial Services Catalog Grid (Aligned with Portfolio Visual Style) -->
<section
  id="portfolio-tabbed-matrix"
  bind:this={sectionElement}
  aria-label="Disciplines and Deliverables Catalog"
  class="relative w-full bg-brand-light py-20 lg:py-32 border-t border-brand-dark/10"
>
  <div class="site-shell relative z-10">
    
    <!-- Editorial Section Header -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 lg:mb-24 pb-8 border-b border-brand-dark/10">
      <div class="lg:col-span-12">
        <span class="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand-green mb-3 block">
          PROCESS SPECIFICATIONS
        </span>
        <h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-brand-dark leading-[1.05] tracking-tight">
          How we enforce <span class="italic font-light text-brand-green">precision</span> at scale.
        </h2>
      </div>
    </div>

    <!-- Spacious Editorial Service Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
      {#each services as item (item.index)}
        <div class="service-card flex flex-col group">
          <!-- Image Showcase Container -->
          <div class="relative overflow-hidden aspect-[3/2] rounded-xl md:rounded-2xl border border-brand-dark/10 bg-brand-dark/5">
            <img
              src={item.image}
              alt="{item.label} service example"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          <!-- Service Label Header -->
          <div class="flex items-baseline gap-2 mt-6 mb-3 border-b border-brand-dark/10 pb-2">
            <span class="font-mono text-xs text-brand-green font-bold">{item.index} //</span>
            <h3 class="font-display text-2xl font-normal text-brand-dark">{item.label}</h3>
          </div>

          <!-- Description -->
          <p class="text-xs sm:text-sm text-brand-dark/75 leading-relaxed font-normal mb-6 min-h-[3.5rem]">
            {item.desc}
          </p>

          <!-- Core Deliverables Bullet List -->
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-4 border-t border-brand-dark/5">
            {#each item.deliverables as del}
              <li class="flex items-start gap-2">
                <span class="text-brand-green font-mono text-[10px] mt-1">↳</span>
                <span class="text-xs sm:text-sm text-brand-dark/85 font-medium leading-tight">{del}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <!-- Bottom link to gallery in the same structural style -->
    <div class="mt-16 flex justify-end">
      <a
        href="#portfolio-mosaic-gallery"
        class="font-mono text-xs font-bold text-brand-dark hover:text-brand-green transition-colors uppercase tracking-widest inline-flex items-center gap-2 border border-brand-dark/15 py-3 px-6 hover:border-brand-green/45 select-none"
      >
        <span>Enter Mosaic Gallery</span>
        <span class="text-brand-green">↗</span>
      </a>
    </div>
  </div>
</section>
