<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { scrollToTarget } from "$lib/animations/lenis";
  import { ArrowRight, SlidersHorizontal } from "lucide-svelte";
  import { pricingPageData } from "$lib/content/pricing";
  import { _ } from "svelte-i18n";

  let heroSection: HTMLElement;

  const imageShowcases = [
    {
      title: "Editorial Retouching",
      unit: "image",
      offsetClass: "sm:translate-y-4",
      images: [
        {
          src: "/images/services/model-beauty/model-cue-chic-editorial-fashion-0161.webp",
          alt: "High-fashion luxury lookbook editorial fashion retouching",
        },
        {
          src: "/images/services/model-beauty/model-black-silk-floral-slip-dress-05.webp",
          alt: "Editorial silk gown fashion color and drape finishing",
        },
        {
          src: "/images/services/model-beauty/model-male-headshot-leather-jacket-2301-after.webp",
          alt: "Studio male portrait frequency separation and skin micro-contouring",
        },
      ],
    },
    {
      title: "3D Product CGI",
      unit: "asset",
      offsetClass: "sm:-translate-y-4",
      images: [
        {
          src: "/images/services/product-services/product-furniture-modern-patterned-armchair-velvet.webp",
          alt: "Photorealistic 3D CGI modern patterned velvet armchair rendering",
        },
        {
          src: "/images/services/jewelry/jewelry-aquamarine-emerald-gold-ring-4054.webp",
          alt: "Luxury 3D emerald and gold fine jewelry macro render",
        },
        {
          src: "/images/services/product-services/product-furniture-scandinavian-wood-side-table-dark.webp",
          alt: "Architectural Scandinavian dark wood table product staging render",
        },
      ],
    },
    {
      title: "Color & Finishing",
      unit: "video",
      offsetClass: "sm:translate-y-2",
      images: [
        {
          src: "/images/services/product-services/service-retouching-pattern-change-after.webp",
          alt: "Precision garment pattern change and color calibration master",
        },
        {
          src: "/images/services/product-services/architectural-aerial-london-cityscape-photography-after.webp",
          alt: "Cinematic commercial cityscape color grading and atmosphere finishing",
        },
        {
          src: "/images/services/jewelry/jewelry-editorial-seashell-gold-necklace-model-2061-after.webp",
          alt: "Editorial gold jewelry color grading and skin tone balance",
        },
      ],
    },
  ];

  const stats = [
    { value: "24h", label: "Turnaround SLA" },
    { value: "25%", label: "Volume tiering" },
    { value: "99.8%", label: "QC pass rate" },
  ];

  // Reactive index array for the cross-fade slideshow
  let activeIndexes = $state([0, 0, 0]);

  function activateCustomCalculator() {
    const customTab = document.getElementById("pricing-custom-tab");
    if (customTab) {
      customTab.click();
    }
    scrollToTarget("#pricing-options", { offset: -24, duration: 1.05 });
  }

  function activatePackages() {
    const packagesTab = document.getElementById("pricing-packages-tab");
    if (packagesTab) {
      packagesTab.click();
    }
    scrollToTarget("#pricing-options", { offset: -24, duration: 1.05 });
  }

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !heroSection) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: heroSection,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            },
          });

          tl.from(".hero-anim-item", {
            y: 18,
            opacity: 0,
            duration: 0.65,
            stagger: 0.07,
            ease: "power2.out",
            clearProps: "all",
          })
          .from(
            ".hero-img-anim",
            {
              y: 24,
              opacity: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: "power2.out",
              clearProps: "all",
            },
            "-=0.45",
          );
        });
        return () => media.revert();
      }, heroSection);
    });

    // Staggered slide changes to avoid simultaneous jumps
    const intervals = [
      setInterval(() => {
        if (active)
          activeIndexes[0] =
            (activeIndexes[0] + 1) % imageShowcases[0].images.length;
      }, 4200),
      setInterval(() => {
        if (active)
          activeIndexes[1] =
            (activeIndexes[1] + 1) % imageShowcases[1].images.length;
      }, 4600),
      setInterval(() => {
        if (active)
          activeIndexes[2] =
            (activeIndexes[2] + 1) % imageShowcases[2].images.length;
      }, 5000),
    ];

    return () => {
      active = false;
      context?.revert();
      intervals.forEach(clearInterval);
    };
  });
</script>

<section
  id="pricing-hero"
  bind:this={heroSection}
  aria-label="Pricing Hero"
  class="relative isolate flex min-h-[90dvh] flex-col justify-between overflow-hidden bg-brand-light pb-12 pt-28 text-brand-dark sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36"
>
  <!-- Site Shell Container -->
  <div class="site-shell relative z-10 my-auto">
    <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
      <!-- Left Column: The Statement & Scoping Navigation -->
      <div class="lg:col-span-5 xl:col-span-5">
        <div class="max-w-xl">
          <!-- Eyebrow -->
          <div class="hero-anim-item eyebrow text-brand-dark/50">
            {$_('pricing.hero.eyebrow') || pricingPageData.intro.eyebrow}
          </div>

          <!-- Main Headline -->
          <h1
            class="hero-anim-item mt-4 font-display text-[clamp(2.35rem,5vw,4.5rem)] font-bold leading-[0.94] tracking-[-0.04em] text-brand-dark"
          >
            {$_('pricing.hero.heading1') || 'Tailored production'}
            <em class="font-normal text-brand-green not-italic">{$_('pricing.hero.heading2') || 'estimates.'}</em>
          </h1>

          <!-- Description -->
          <p
            class="hero-anim-item mt-5 sm:mt-6 text-sm sm:text-base leading-relaxed text-brand-dark/70 sm:text-lg"
          >
            {$_('pricing.hero.description') || pricingPageData.intro.description}
          </p>

          <!-- Action Links -->
          <div
            class="hero-anim-item mt-8 sm:mt-9 flex flex-wrap items-center gap-4 sm:gap-x-8 sm:gap-y-4"
          >
            <button
              type="button"
              onclick={activatePackages}
              class="group inline-flex min-h-[44px] items-center gap-2.5 text-sm font-semibold text-brand-dark transition-colors hover:text-brand-green cursor-pointer"
            >
              <span>{$_('pricing.hero.viewPackages') || 'View packages'}</span>
              <ArrowRight
                class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onclick={activateCustomCalculator}
              class="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-brand-dark/20 bg-brand-dark/[0.04] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-dark transition-all duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-dark active:scale-[0.98] cursor-pointer"
            >
              <SlidersHorizontal class="h-3.5 w-3.5" />
              <span>{$_('pricing.hero.buildCustom') || 'Build custom quote'}</span>
            </button>
          </div>

          <!-- Stats Grid -->
          <div
            class="hero-anim-item mt-10 sm:mt-12 grid max-w-sm grid-cols-3 gap-3 sm:gap-6 border-t border-brand-dark/12 pt-6"
          >
            {#each stats as stat, i (stat.label)}
              <div>
                <div
                  class="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-brand-dark"
                >
                  {stat.value}
                </div>
                <div
                  class="mt-1 font-mono text-[0.6rem] uppercase tracking-wider text-brand-dark/50 sm:text-[0.68rem]"
                >
                  {$_(`pricing.hero.stats.${i}.label`) || stat.label}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Right Column: 3-Image Slideshow Composition -->
      <div
        class="lg:col-span-7 xl:col-span-7 flex items-center justify-center lg:justify-end w-full"
      >
        <div
          class="grid w-full grid-cols-3 gap-2.5 sm:gap-4 lg:gap-4.5 items-center max-w-[620px]"
        >
          {#each imageShowcases as item, cardIdx (item.title)}
            <div class="hero-img-anim w-full">
              <div
                class="group relative flex min-h-[220px] sm:min-h-[330px] md:min-h-[390px] lg:min-h-[430px] xl:min-h-[470px] w-full flex-col overflow-hidden rounded-2xl sm:rounded-[1.5rem] bg-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.18)] hover:-translate-y-2 {item.offsetClass}"
              >
                <!-- Cross-fading Images List -->
                {#each item.images as img, imgIdx (img.src)}
                  <img
                    src={img.src}
                    alt={img.alt}
                    width="600"
                    height="900"
                    fetchpriority={imgIdx === 0 ? "high" : "low"}
                    decoding="async"
                    class="absolute inset-0 size-full object-cover object-center transition-opacity duration-1000 ease-in-out group-hover:scale-105 {activeIndexes[
                      cardIdx
                    ] === imgIdx
                      ? 'opacity-100 z-10'
                      : 'opacity-0 z-0'}"
                  />
                {/each}

                <!-- Bottom Sleek Micro Info Bar -->
                <div
                  class="relative z-20 mt-auto m-1 sm:m-2 rounded-md sm:rounded-lg bg-white/95 p-1.5 sm:p-2 backdrop-blur-md shadow-xs border border-black/[0.04]"
                >
                  <div
                    class="font-display text-[0.58rem] sm:text-[0.68rem] font-bold leading-tight tracking-tight text-brand-dark truncate"
                  >
                    {$_(`pricing.hero.showcases.${cardIdx}.title`) || item.title}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
