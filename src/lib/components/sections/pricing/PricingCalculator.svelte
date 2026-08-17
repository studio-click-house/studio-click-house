<script lang="ts">
  import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-svelte";
  import { pricingCategories, pricingPageData } from "$lib/content/pricing";
  import { cn } from "$lib/utils";

  // Calculator State
  let activeCatIndex = $state(0);
  let volume = $state(10);
  let selectedComplexity = $state(0);
  let selectedTurnaround = $state(0);
  let selectedServices = $state<Record<string, boolean>>({});

  // Active Category Data
  let activeCategory = $derived(pricingCategories[activeCatIndex]);

  // Initialize selected services when category changes
  $effect(() => {
    const initial: Record<string, boolean> = {};
    activeCategory.rates.forEach((rate, i) => {
      initial[rate.slug] = i === 0 || i === 1; // default select first two
    });
    selectedServices = initial;
  });

  // Calculate pricing
  let calculatedPrice = $derived.by(() => {
    let baseSum = 0;
    activeCategory.rates.forEach((rate) => {
      if (selectedServices[rate.slug]) {
        baseSum += rate.basePrice;
      }
    });

    if (baseSum === 0) return 0;

    const compMultiplier =
      pricingPageData.calculator.complexityOptions[selectedComplexity]
        .multiplier;
    const turnMultiplier =
      pricingPageData.calculator.turnaroundOptions[selectedTurnaround]
        .multiplier;

    // Volume Discount factor
    let discount = 1.0;
    if (activeCategory.categoryName === "Image Editing") {
      if (volume > 200) discount = 0.7;
      else if (volume > 50) discount = 0.8;
      else if (volume > 10) discount = 0.9;
    } else if (activeCategory.categoryName === "Video Editing") {
      if (volume > 20) discount = 0.75;
      else if (volume > 5) discount = 0.85;
    } else {
      if (volume > 10) discount = 0.8;
      else if (volume > 3) discount = 0.9;
    }

    return Math.round(
      baseSum * volume * compMultiplier * turnMultiplier * discount,
    );
  });

  // Animate price changes
  let animatedPrice = $state(0);
  $effect(() => {
    const target = calculatedPrice;
    const obj = { val: animatedPrice };
    let isCancelled = false;
    let activeTween: { kill: () => void } | null = null;

    import("gsap").then(({ gsap }) => {
      if (isCancelled) return;
      activeTween = gsap.to(obj, {
        val: target,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: () => {
          animatedPrice = Math.round(obj.val);
        },
      });
    });

    return () => {
      isCancelled = true;
      if (activeTween) {
        activeTween.kill();
      }
    };
  });
</script>

<div id="pricing-configurator" class="relative bg-brand-light text-brand-dark">
  <div class="site-shell">
    <div
      class="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-brand-dark/10 bg-white shadow-sm lg:grid-cols-12"
    >
      <!-- Compact configuration controls -->
      <div class="flex flex-col gap-8 p-6 sm:p-8 lg:col-span-8 lg:p-10">
        <!-- Pipeline Category Selection -->
        <div>
          <h3
            class="mb-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-dark/55"
          >
            Pipeline Category
          </h3>
          <div class="flex flex-wrap gap-3">
            {#each pricingCategories as category, index}
              <button
                type="button"
                class={cn(
                  "rounded-[0.55rem] border px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-wider transition-all duration-200 cursor-pointer",
                  activeCatIndex === index
                    ? "border-brand-dark bg-brand-dark text-brand-light font-bold shadow-sm"
                    : "border-brand-dark/20 text-brand-dark/75 hover:border-brand-dark hover:text-brand-dark bg-transparent",
                )}
                onclick={() => (activeCatIndex = index)}
              >
                {category.categoryName}
              </button>
            {/each}
          </div>
        </div>

        <!-- Modules Selection -->
        <div>
          <h3
            class="mb-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-dark/55"
          >
            Services
          </h3>
          <div class="grid gap-2 sm:grid-cols-2">
            {#each activeCategory.rates as rate}
              <button
                type="button"
                class={cn(
                  "flex min-h-16 items-center justify-between gap-4 rounded-[0.55rem] border bg-transparent px-4 py-3 text-left transition-all duration-200 cursor-pointer",
                  selectedServices[rate.slug]
                    ? "border-brand-green bg-brand-green/5 text-brand-dark shadow-sm"
                    : "border-brand-dark/15 hover:border-brand-dark/30 text-brand-dark/75",
                )}
                onclick={() => {
                  selectedServices[rate.slug] = !selectedServices[rate.slug];
                }}
              >
                <div class="min-w-0">
                  <span
                    class="block text-sm font-semibold leading-tight tracking-tight text-brand-dark"
                  >
                    {rate.name}
                  </span>
                  <span
                    class="mt-1 block font-mono text-[0.62rem] text-brand-dark/52"
                  >
                    ${rate.basePrice.toFixed(2)}/{rate.unit}
                  </span>
                </div>
                <div class="flex items-center">
                  <div
                    class={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                      selectedServices[rate.slug]
                        ? "border-brand-green bg-brand-green text-brand-light"
                        : "border-brand-dark/25",
                    )}
                  >
                    {#if selectedServices[rate.slug]}
                      <Check size={12} strokeWidth={3} />
                    {/if}
                  </div>
                </div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Volume & Complexity in a clean 2-column grid -->
        <div
          class="grid grid-cols-1 gap-3 border-t border-brand-dark/10 pt-8 md:grid-cols-2"
        >
          <!-- Volume -->
          <div
            class="rounded-xl border border-brand-dark/12 bg-brand-paper p-5"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-sm font-semibold text-brand-dark">
                Estimated Volume
              </h3>
              <span
                class="font-mono text-xs font-bold bg-brand-green/15 text-brand-green px-2.5 py-1 rounded-md"
              >
                {volume}
                {activeCategory.rates[0]?.unit ?? "units"}
              </span>
            </div>
            <input
              id="volume-slider"
              type="range"
              min="1"
              max={activeCategory.categoryName === "Image Editing"
                ? "300"
                : activeCategory.categoryName === "Video Editing"
                  ? "40"
                  : "20"}
              bind:value={volume}
              class="w-full accent-brand-green bg-brand-dark/15 h-1 rounded-lg cursor-pointer outline-none"
            />
            <div
              class="flex justify-between text-xs font-mono text-brand-dark/55 mt-3"
            >
              <span>Min: 1</span>
              <span
                >Max: {activeCategory.categoryName === "Image Editing"
                  ? "300"
                  : activeCategory.categoryName === "Video Editing"
                    ? "40"
                    : "20"}</span
              >
            </div>
          </div>

          <!-- Complexity -->
          <div
            class="rounded-xl border border-brand-dark/12 bg-brand-paper p-5"
          >
            <h3 class="mb-4 text-sm font-semibold text-brand-dark">
              Production Complexity
            </h3>
            <div class="grid grid-cols-3 gap-2">
              {#each pricingPageData.calculator.complexityOptions as option, index}
                <button
                  type="button"
                  class={cn(
                    "py-2.5 rounded-[0.55rem] font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer text-center",
                    selectedComplexity === index
                      ? "bg-brand-dark text-brand-light font-bold"
                      : "border border-brand-dark/15 hover:bg-brand-dark/5 text-brand-dark/75",
                  )}
                  onclick={() => (selectedComplexity = index)}
                >
                  {option.label}
                </button>
              {/each}
            </div>
            <p class="text-xs text-brand-dark/65 mt-3 leading-relaxed">
              {pricingPageData.calculator.complexityOptions[selectedComplexity]
                .description}
            </p>
          </div>
        </div>

        <!-- Priority / Turnaround -->
        <div class="rounded-xl border border-brand-dark/12 bg-brand-paper p-5">
          <h3 class="mb-4 text-sm font-semibold text-brand-dark">
            Delivery Priority
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {#each pricingPageData.calculator.turnaroundOptions as option, index}
              <button
                type="button"
                class={cn(
                  "p-3.5 rounded-[0.55rem] text-left border flex flex-col justify-between transition-all duration-200 cursor-pointer",
                  selectedTurnaround === index
                    ? "border-brand-dark bg-brand-dark text-brand-light font-semibold shadow-sm"
                    : "border-brand-dark/15 text-brand-dark/75 hover:border-brand-dark/30 bg-transparent",
                )}
                onclick={() => (selectedTurnaround = index)}
              >
                <span class="text-sm font-medium">{option.label}</span>
                <span
                  class={cn(
                    "text-xs font-mono mt-1",
                    selectedTurnaround === index
                      ? "text-brand-green"
                      : "text-brand-dark/55",
                  )}
                >
                  {option.multiplier === 1.0
                    ? "Base Rate"
                    : `+${Math.round((option.multiplier - 1.0) * 100)}%`}
                </span>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Live estimate summary -->
      <div
        class="border-t border-brand-dark/10 bg-brand-paper p-6 sm:p-8 lg:col-span-4 lg:border-l lg:border-t-0 lg:p-10"
      >
        <div class="flex h-full flex-col">
          <div
            class="flex items-center justify-between border-b border-brand-dark/15 pb-6"
          >
            <div>
              <p
                class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-green"
              >
                Real-Time Calculation
              </p>
              <h3
                class="mt-1 font-display text-2xl font-normal text-brand-dark"
              >
                Investment Summary
              </h3>
            </div>
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green/10 text-brand-green"
            >
              <Sparkles size={18} />
            </div>
          </div>

          <!-- Price display -->
          <div class="py-8 border-b border-brand-dark/15">
            <div class="flex items-baseline gap-2">
              <span
                class="font-display text-5xl font-bold tracking-tight text-brand-dark"
              >
                ${animatedPrice}
              </span>
              <span
                class="font-mono text-sm font-semibold uppercase text-brand-dark/60"
              >
                USD
              </span>
            </div>
            <p class="mt-2 text-xs text-brand-dark/65 leading-relaxed">
              Estimated total based on selected volume, complexity, and
              priority.
            </p>
          </div>

          <!-- Active Selections Summary List -->
          <div class="py-6 space-y-4 border-b border-brand-dark/15 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-brand-dark/70">Selected Pipeline:</span>
              <span class="font-semibold text-brand-dark"
                >{activeCategory.categoryName}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-dark/70">Estimated Units:</span>
              <span class="font-semibold text-brand-dark"
                >{volume} {activeCategory.rates[0]?.unit ?? "units"}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-dark/70">Complexity Level:</span>
              <span class="font-semibold text-brand-dark"
                >{pricingPageData.calculator.complexityOptions[
                  selectedComplexity
                ].label}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-brand-dark/70">Turnaround SLA:</span>
              <span class="font-semibold text-brand-green"
                >{pricingPageData.calculator.turnaroundOptions[
                  selectedTurnaround
                ].label}</span
              >
            </div>
          </div>

          <!-- CTAs -->
          <div class="pt-8 flex flex-col gap-3">
            <a
              href={`/contact?service=${encodeURIComponent(activeCategory.categoryName.toLowerCase().replace(" ", "-"))}&volume=${volume}&complexity=${selectedComplexity}&turnaround=${selectedTurnaround}`}
              class="w-full py-4 px-6 bg-brand-green text-white text-center font-mono text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors duration-300 flex items-center justify-center gap-2 rounded-[0.55rem] shadow-sm"
            >
              Request Custom Proposal <ArrowRight size={16} />
            </a>
            <a
              href="/contact"
              class="w-full py-3.5 px-6 border border-brand-dark/20 text-brand-dark text-center font-mono text-xs font-semibold uppercase tracking-widest hover:border-brand-dark hover:bg-brand-dark/5 transition-colors duration-300 rounded-[0.55rem]"
            >
              Book a Consultation
            </a>
          </div>

          <!-- Guarantee pill -->
          <div
            class="mt-6 flex items-center justify-center gap-2 text-xs text-brand-dark/65"
          >
            <ShieldCheck size={14} class="text-brand-green" />
            <span>Dedicated project manager & SLA guarantee included.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
