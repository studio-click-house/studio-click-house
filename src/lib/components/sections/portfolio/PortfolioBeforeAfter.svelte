<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { onMount } from "svelte";

  let section = $state<HTMLElement | null>(null);

  interface ProcessStage {
    step: string;
    title: string;
    badge: string;
    desc: string;
    image: string;
  }

  const stages: ProcessStage[] = [
    {
      step: "01",
      title: "Studio RAW",
      badge: "Sensor Capture",
      desc: "Untouched 16-bit camera sensor data with neutral studio lighting and original capture backdrop.",
      image: "/images/portfolio/model-raw.png",
    },
    {
      step: "02",
      title: "Vector Pen Path",
      badge: "Bézier Precision",
      desc: "Hand-drawn vector anchor paths mapping garment drape, silhouette boundaries, and subtle fabric folds.",
      image: "/images/portfolio/model-clipping-4x5.png",
    },
    {
      step: "03",
      title: "Edge Isolation",
      badge: "Alpha Cutout",
      desc: "Sub-pixel background extraction preserving natural hair flyaways and clean edge transparency.",
      image: "/images/portfolio/model-isolated.png",
    },
    {
      step: "04",
      title: "Contact Shadow",
      badge: "Spatial Depth",
      desc: "Diffused perspective ground shadow engineered for authentic dimensional realism on campaign backdrops.",
      image: "/images/portfolio/model-shadowed.png",
    },
    {
      step: "05",
      title: "Campaign Color Master",
      badge: "Color Master",
      desc: "Selective emerald garment color grading, skin frequency separation, and publication-ready delivery.",
      image: "/images/portfolio/model-color-master-4x5.png",
    },
  ];

  onMount(() => {
    let active = true;
    let ctx: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".stage-col", {
            y: 32,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        });
      }, section);
    });

    return () => {
      active = false;
      ctx?.revert();
    };
  });
</script>

<section
  id="portfolio-before-after"
  bind:this={section}
  aria-label="Studio post-production process breakdown"
  class="relative w-full bg-brand-light py-14 sm:py-18 lg:py-24 overflow-hidden scroll-mt-20 sm:scroll-mt-28"
>
  <div class="site-shell relative z-10">
    <!-- Editorial Section Header: 2-Column Split Eliminating Empty Right Side -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12 sm:mb-16 lg:mb-20">
      <div class="lg:col-span-7">
        <p class="font-sans text-sm text-brand-dark/50 mb-3 font-medium">
          03 / Inspection Craft
        </p>
        <h2 class="font-sans text-[length:var(--text-section)] leading-[1.05] tracking-[-0.04em] text-brand-dark font-semibold">
          From Studio RAW to <span class="not-italic font-semibold text-brand-green">Campaign Master.</span>
        </h2>
      </div>

      <div class="lg:col-span-5 flex flex-col justify-end">
        <p class="text-sm sm:text-base text-brand-dark/70 leading-relaxed font-normal">
          Behind every high-fashion campaign asset lies rigorous multi-pass digital craft. Trace how raw sensor captures evolve through manual vector paths into publication-ready masters.
        </p>
      </div>
    </div>

    <!-- 5-Stage Panoramic Process Spread -->
    <div
      class="flex overflow-x-auto no-scrollbar gap-5 pb-4 -mx-4 px-4 snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:gap-5 xl:gap-6 lg:overflow-visible lg:p-0 lg:m-0 items-stretch"
    >
      {#each stages as stage (stage.step)}
        <div
          class="stage-col group flex flex-col justify-between shrink-0 w-[78vw] sm:w-[280px] lg:w-auto snap-center"
        >
          <div>
            <!-- Media Window: Architectural portrait frame with subtle hover scale -->
            <div class="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white border border-brand-dark/10 shadow-xs mb-5">
              <img
                src={stage.image}
                alt="{stage.title} post-production step"
                class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
                decoding="async"
              />
            </div>

            <!-- Step Index + Badge -->
            <div class="flex items-baseline justify-between gap-2 mb-2">
              <span class="font-sans text-xs font-bold {stage.step === '05' ? 'text-brand-green' : 'text-brand-dark/40'}">
                {stage.step}
              </span>
              <span class="font-sans text-xs text-brand-dark/45 font-medium">
                {stage.badge}
              </span>
            </div>

            <!-- Stage Title -->
            <h3 class="font-sans text-xl lg:text-[1.35rem] leading-tight tracking-tight text-brand-dark mb-2.5 font-semibold">
              {stage.title}
            </h3>

            <!-- Clean, Concise Craft Description -->
            <p class="text-sm text-brand-dark/65 leading-relaxed font-normal">
              {stage.desc}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
