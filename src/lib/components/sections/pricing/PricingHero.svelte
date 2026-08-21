<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { ArrowRight, SlidersHorizontal } from "lucide-svelte";
  import { pricingPageData, pricingCategories } from "$lib/content/pricing";

  let heroSection: HTMLElement;

  const imageShowcases = [
    {
      title: "Editorial Retouching",
      unit: "image",
      offsetClass: "sm:translate-y-4",
      images: [
        {
          src: "https://images.pexels.com/photos/37233404/pexels-photo-37233404.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Luxury fashion editorial portrait with skin retouching",
        },
        {
          src: "https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Professional studio beauty headshot",
        },
        {
          src: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Creative garment catalog lighting retouching",
        },
      ],
    },
    {
      title: "3D Product CGI",
      unit: "asset",
      offsetClass: "sm:-translate-y-4",
      images: [
        {
          src: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Photorealistic 3D product render of fragrance bottle",
        },
        {
          src: "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Luxury cosmetic tube render on pedestal",
        },
        {
          src: "https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Luxury wristwatch CGI close-up staging",
        },
      ],
    },
    {
      title: "Color & Finishing",
      unit: "video",
      offsetClass: "sm:translate-y-2",
      images: [
        {
          src: "https://images.pexels.com/photos/18302102/pexels-photo-18302102.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Luxury perfume still life with studio lighting",
        },
        {
          src: "https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Warm color grading still life scene",
        },
        {
          src: "https://images.pexels.com/photos/2773498/pexels-photo-2773498.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Moody cinematographic still lighting details",
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

  function scrollToSection(selector: string) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  function activateCustomCalculator() {
    const customTab = document.getElementById("pricing-custom-tab");
    if (customTab) {
      customTab.click();
      document
        .getElementById("pricing-options")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollToSection("#pricing-options");
    }
  }

  function activatePackages() {
    const packagesTab = document.getElementById("pricing-packages-tab");
    if (packagesTab) {
      packagesTab.click();
      document
        .getElementById("pricing-options")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollToSection("#pricing-options");
    }
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
          gsap.from(".hero-anim-item", {
            y: 16,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          });
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
  class="relative isolate flex min-h-[92dvh] flex-col justify-between overflow-hidden bg-brand-light pb-12 pt-28 text-brand-dark sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36"
>
  <!-- Site Shell Container -->
  <div class="site-shell relative z-10 my-auto">
    <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
      <!-- Left Column: The Statement & Scoping Navigation -->
      <div class="lg:col-span-5 xl:col-span-5">
        <div class="max-w-xl">
          <!-- Eyebrow -->
          <div class="hero-anim-item eyebrow text-brand-dark/50">
            {pricingPageData.intro.eyebrow}
          </div>

          <!-- Main Headline -->
          <h1
            class="hero-anim-item mt-4 font-display text-[clamp(2.75rem,5.2vw,4.5rem)] font-bold leading-[0.94] tracking-[-0.04em] text-brand-dark"
          >
            Tailored production
            <em class="font-normal text-brand-green not-italic">estimates.</em>
          </h1>

          <!-- Description -->
          <p
            class="hero-anim-item mt-6 text-base leading-relaxed text-brand-dark/70 sm:text-lg"
          >
            {pricingPageData.intro.description}
          </p>

          <!-- Action Links -->
          <div
            class="hero-anim-item mt-9 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <button
              type="button"
              onclick={activatePackages}
              class="group inline-flex items-center gap-2.5 text-sm font-semibold text-brand-dark transition-colors hover:text-brand-green"
            >
              <span>View packages</span>
              <ArrowRight
                class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onclick={activateCustomCalculator}
              class="group inline-flex items-center gap-2 rounded-full border border-brand-dark/20 bg-brand-dark/[0.04] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-dark transition-all duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-dark active:scale-[0.98]"
            >
              <SlidersHorizontal class="h-3.5 w-3.5" />
              <span>Build custom quote</span>
            </button>
          </div>

          <!-- Stats Grid -->
          <div
            class="hero-anim-item mt-12 grid max-w-sm grid-cols-3 gap-6 border-t border-brand-dark/12 pt-6"
          >
            {#each stats as stat}
              <div>
                <div
                  class="font-display text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl"
                >
                  {stat.value}
                </div>
                <div
                  class="mt-1 font-mono text-[0.62rem] uppercase tracking-wider text-brand-dark/50 sm:text-[0.68rem]"
                >
                  {stat.label}
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
          class="grid w-full grid-cols-3 gap-3.5 sm:gap-4.5 items-center max-w-[620px]"
        >
          {#each imageShowcases as item, cardIdx (item.title)}
            <div
              class="group relative flex min-h-[340px] sm:min-h-[410px] lg:min-h-[440px] xl:min-h-[480px] w-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 hover:shadow-[0_28px_60px_-15px_rgba(0,0,0,0.2)] hover:-translate-y-2 {item.offsetClass}"
            >
              <!-- Cross-fading Images List -->
              {#each item.images as img, imgIdx}
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
                class="relative z-20 mt-auto m-1.5 sm:m-2 rounded-lg bg-white/90 p-1.5 sm:p-2 backdrop-blur-md shadow-sm border border-black/[0.04]"
              >
                <div
                  class="font-display text-[0.62rem] sm:text-[0.68rem] font-bold leading-tight tracking-tight text-brand-dark"
                >
                  {item.title}
                </div>
                <div
                  class="mt-0.5 font-mono text-[0.45rem] sm:text-[0.5rem] uppercase tracking-wider text-brand-dark/50"
                >
                  Per {item.unit}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
