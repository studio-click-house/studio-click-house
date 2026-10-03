<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { scrollToTarget } from "$lib/animations/lenis";
  import { ArrowRight, SlidersHorizontal } from "lucide-svelte";
  import { pricingPageData } from "$lib/content/pricing";
  import { _ } from "svelte-i18n";
  import { stripTitlePunctuation } from "$lib/utils";

  let heroSection: HTMLElement;

  const disciplines = [
    {
      title: "Editorial Retouching",
      media: {
        src: "/images/services/model-beauty/beauty-portrait-close-up-skincare-retouch-0500-after.webp",
        alt: "High-fashion beauty and skincare frequency separation retouching",
        width: 1500,
        height: 2000,
      },
    },
    {
      title: "3D CGI Modeling",
      media: {
        src: "/images/3d-modeling/Wireframe%20Clay%20Sneaker%20Render.png",
        alt: "Photorealistic 3D wireframe clay sneaker render",
        width: 1122,
        height: 1402,
      },
    },
    {
      title: "Color & Finishing",
      media: {
        src: "/images/services/jewelry/jewelry-westwood-statement-gold-earrings-02-after.webp",
        alt: "Sculptural gold earrings macro color grading and finish",
        width: 1600,
        height: 2000,
      },
    },
  ];

  let selectedDiscipline = $state(0);
  let autoTimer: ReturnType<typeof setInterval> | undefined;

  function startAutoChange() {
    stopAutoChange();
    autoTimer = setInterval(() => {
      selectedDiscipline = (selectedDiscipline + 1) % disciplines.length;
    }, 3800);
  }

  function stopAutoChange() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = undefined;
    }
  }

  function selectDiscipline(idx: number) {
    selectedDiscipline = idx;
    startAutoChange();
  }

  const stats = [
    { value: "24h", label: "Turnaround SLA" },
    { value: "25%", label: "Volume tiering" },
    { value: "99.8%", label: "QC pass rate" },
  ];

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

    startAutoChange();

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
          }).from(
            ".hero-media-frame",
            {
              autoAlpha: 0,
              y: 28,
              duration: 0.95,
              ease: "power3.out",
              clearProps: "all",
            },
            "-=0.45",
          );
        });
        return () => media.revert();
      }, heroSection);
    });

    return () => {
      active = false;
      stopAutoChange();
      context?.revert();
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
            {$_("pricing.hero.eyebrow") || pricingPageData.intro.eyebrow}
          </div>

          <!-- Main Headline -->
          <h1
            class="hero-anim-item font-sans uppercase mt-4 text-[clamp(2.35rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.045em] text-brand-dark font-bold"
          >
            {stripTitlePunctuation(
              $_("pricing.hero.heading1") || "Tailored production",
            )}
            <em class="text-brand-green not-italic"
              >{stripTitlePunctuation(
                $_("pricing.hero.heading2") || "estimates.",
              )}</em
            >
          </h1>

          <!-- Description -->
          <p
            class="hero-anim-item mt-5 sm:mt-6 text-sm sm:text-base leading-relaxed text-brand-dark/70 sm:text-lg"
          >
            {$_("pricing.hero.description") ||
              pricingPageData.intro.description}
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
              <span>{$_("pricing.hero.viewPackages") || "View packages"}</span>
              <ArrowRight
                class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onclick={activateCustomCalculator}
              class="group inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-control)] border border-brand-dark/20 bg-brand-dark/[0.04] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-dark transition-all duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-dark active:scale-[0.98] cursor-pointer"
            >
              <SlidersHorizontal class="h-3.5 w-3.5" />
              <span
                >{$_("pricing.hero.buildCustom") || "Build custom quote"}</span
              >
            </button>
          </div>

          <!-- Stats Grid -->
          <div
            class="hero-anim-item mt-10 sm:mt-12 grid max-w-sm grid-cols-3 gap-3 sm:gap-6 border-t border-brand-dark/12 pt-6"
          >
            {#each stats as stat, i (stat.label)}
              <div>
                <div
                  class="font-sans text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-brand-dark"
                >
                  {stat.value}
                </div>
                <div
                  class="mt-1 font-sans text-xs text-brand-dark/50"
                >
                  {$_(`pricing.hero.stats.${i}.label`) || stat.label}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Right Column: Single Clean 4:5 Visual Showcase (Matching ServicesHero) -->
      <div
        class="lg:col-span-7 xl:col-span-7 w-full flex flex-col items-center lg:items-end justify-center"
      >
        <div class="w-full max-w-[440px] sm:max-w-[460px] lg:max-w-[480px]">
          <!-- Clean 4:5 Media Frame (Zero White Border, Zero Shadow) -->
          <figure
            class="hero-media-frame relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-media)] bg-brand-dark/5"
          >
            {#each disciplines as disc, idx (disc.media.src)}
              <img
                src={disc.media.src}
                alt={disc.media.alt}
                width={disc.media.width}
                height={disc.media.height}
                fetchpriority={idx === 0 ? "high" : "low"}
                decoding="async"
                class="absolute inset-0 size-full object-cover object-center transition-opacity duration-500 ease-in-out {selectedDiscipline === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}"
              />
            {/each}
          </figure>

          <!-- Clean Minimal Category Selector (No Divider, Hover Change, Auto Change) -->
          <nav
            class="hero-anim-item mt-4 grid grid-cols-3 gap-2"
            aria-label="Discipline Showcase Selector"
          >
            {#each disciplines as disc, idx (disc.title)}
              <button
                type="button"
                onmouseenter={() => selectDiscipline(idx)}
                onclick={() => selectDiscipline(idx)}
                class="group flex flex-col items-start py-1.5 transition-colors cursor-pointer text-left"
              >
                <span
                  class="font-sans text-xs transition-colors {selectedDiscipline === idx ? 'text-brand-green font-bold' : 'text-brand-dark/40 group-hover:text-brand-dark/70'}"
                >
                  0{idx + 1}
                </span>
                <span
                  class="mt-0.5 text-xs font-semibold tracking-tight {selectedDiscipline === idx ? 'text-brand-dark' : 'text-brand-dark/60 group-hover:text-brand-dark'} transition-colors"
                >
                  {$_(`pricing.hero.showcases.${idx}.title`) || disc.title}
                </span>
              </button>
            {/each}
          </nav>
        </div>
      </div>
    </div>
  </div>
</section>
