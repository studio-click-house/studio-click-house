<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let section = $state<HTMLElement | null>(null);

  interface QualityPillar {
    step: string;
    title: string;
    spec: string;
    badge: string;
    desc: string;
    image: string;
    href: string;
  }

  const pillars: QualityPillar[] = [
    {
      step: "01",
      title: "Editorial Retouching",
      spec: "16-Bit Precision",
      badge: "Skin & Texture",
      desc: "Lossless frequency separation preserving micro pore texture, fine hair flyaways, and fabric textile weave without artificial smoothing.",
      image: "/images/services/model-beauty/beauty-high-fashion-orchid-headpiece-portrait-after.webp",
      href: "/services/editorial-retouching",
    },
    {
      step: "02",
      title: "Multi-Path & Clipping",
      spec: "Sub-Pixel Pen Paths",
      badge: "Vector Paths",
      desc: "Hand-drawn Bézier curves with zero jagged anti-aliasing artifacts, embedded as persistent Photoshop paths for versatile client isolation.",
      image: "/images/clipping-path/clipping-path-multi-path-luxury-watch.webp",
      href: "/services/clipping-path",
    },
    {
      step: "03",
      title: "Color Correction",
      spec: "Delta-E Color Lock",
      badge: "Pantone Match",
      desc: "Certified Pantone and digital swatch calibration ensuring 100% SKU color fidelity across lookbooks, e-commerce listings, and billboard prints.",
      image: "/images/color-correction/product-services-color-correction-editorial-garment-after.webp",
      href: "/services/color-correction",
    },
  ];

  $effect(() => {
    if (!section) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
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
          (ctx) => {
            const { isDesktop, isTablet, reduceMotion } = ctx.conditions!;
            if (reduceMotion) {
              gsap.set(".intro-fade-item", { autoAlpha: 1, y: 0 });
              return;
            }

            const yOffset = isDesktop ? 26 : isTablet ? 22 : 18;
            const duration = isDesktop ? 0.85 : isTablet ? 0.75 : 0.7;
            const stagger = isDesktop ? 0.12 : isTablet ? 0.08 : 0.06;
            const startTrigger = isDesktop ? "top 82%" : "top 84%";

            gsap.from(".intro-fade-item", {
              y: yOffset,
              autoAlpha: 0,
              duration,
              stagger,
              ease: "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: section,
                start: startTrigger,
                toggleActions: "play none none reverse",
              },
            });
          }
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
  id="portfolio-studio-standard"
  bind:this={section}
  aria-label="Studio Introduction and Creative Standard"
  class="relative w-full bg-brand-light py-16 sm:py-20 lg:py-26 overflow-hidden scroll-mt-20 sm:scroll-mt-28"
>
  <div class="site-shell relative z-10">
    <!-- Editorial Section Header: Consistent 2-Column Split (Left Headline, Right Single Description) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12 sm:mb-16 lg:mb-20 intro-fade-item">
      <!-- Left: Eyebrow (Grey) + Display Title -->
      <div class="lg:col-span-7">
        <p class="font-sans text-sm text-brand-dark/50 mb-3 font-medium">
          Editorial Standard
        </p>
        <h2 class="font-sans text-[length:var(--text-section)] leading-[1.05] tracking-[-0.04em] text-brand-dark font-semibold">
          The High-End <span class="not-italic font-semibold text-brand-green">Post-Production</span> Standard
        </h2>
      </div>

      <!-- Right: Single Unified Editorial Description -->
      <div class="lg:col-span-5 flex flex-col justify-end">
        <p class="text-sm sm:text-base text-brand-dark/70 leading-relaxed font-normal">
          Studio Click House has more than a decade of experience in fashion retouching, hand-drawn clipping paths, ghost mannequin compositing, and color grading for commercial image sets. Artists work in non-destructive PSD and TIFF workflows, using frequency separation, precise pen paths, and agreed color profiles for print and screen.
        </p>
      </div>
    </div>

    <!-- 3 Photographic Craft Windows (16-Bit Texture, Sub-Pixel Pen Paths, Delta-E Color Calibration) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 intro-fade-item">
      {#each pillars as pillar (pillar.step)}
        <div class="group flex flex-col justify-between">
          <div>
            <!-- Media Window with 4:5 Aspect Ratio & Subtle Zoom Effect -->
            <div class="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-dark/5 border border-brand-dark/10 shadow-xs mb-5">
              <img
                src={pillar.image}
                alt="{pillar.title} studio standard proof"
                class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
              <div class="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-brand-dark/85 backdrop-blur-xs font-sans text-xs text-brand-light font-medium">
                {pillar.badge}
              </div>
            </div>

            <!-- Step Index + Spec Badge -->
            <div class="flex items-baseline justify-between gap-2 mb-2">
              <span class="font-sans text-xs font-bold text-brand-green">
                {pillar.step}
              </span>
              <span class="font-sans text-xs text-brand-dark/45 font-medium">
                {pillar.spec}
              </span>
            </div>

            <!-- Pillar Title -->
            <h3 class="font-sans text-xl sm:text-2xl text-brand-dark tracking-tight mb-2.5 font-semibold">
              <a href={pillar.href} class="hover:text-brand-green transition-colors inline-block">
                {pillar.title}
              </a>
            </h3>

            <!-- Pillar Description -->
            <p class="text-sm text-brand-dark/65 leading-relaxed font-normal">
              {pillar.desc}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
