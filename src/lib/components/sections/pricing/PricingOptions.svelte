<script lang="ts">
  import PricingCalculator from "./PricingCalculator.svelte";
  import PricingCards from "./PricingCards.svelte";
  import { refreshScrollTriggers } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";

  type PricingView = "packages" | "custom";

  let activeView = $state<PricingView>("packages");

  function setView(view: PricingView) {
    if (activeView === view) return;
    activeView = view;
    setTimeout(() => {
      void refreshScrollTriggers();
    }, 60);
  }
</script>

<section
  id="pricing-options"
  aria-labelledby="pricing-options-title"
  class="relative border-b border-brand-dark/10 bg-brand-light py-16 sm:py-24 lg:py-32 text-brand-dark"
>
  <div class="site-shell">
    <header class="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
      <div class="max-w-3xl lg:col-span-8">
        <h2
          id="pricing-options-title"
          class="font-display text-[clamp(2.35rem,5.2vw,4.5rem)] leading-[0.94] tracking-[-0.04em] text-brand-dark"
        >
          {$_('pricing.options.heading') || 'Our Pricing'}
        </h2>
        <p
          class="mt-4 sm:mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-brand-dark/70"
        >
          {$_('pricing.options.description') || 'Choose a ready-made production package or build a custom estimate around your exact volume, complexity, and turnaround.'}
        </p>
      </div>

      <div
        class="flex w-full sm:w-fit rounded-[0.55rem] border border-brand-dark/20 bg-brand-paper p-1 lg:col-span-4 lg:justify-self-end"
        role="tablist"
        aria-label="Pricing options"
      >
        <button
          id="pricing-packages-tab"
          type="button"
          role="tab"
          aria-selected={activeView === "packages"}
          aria-controls="pricing-packages-panel"
          class="flex-1 sm:flex-initial min-h-11 rounded-[0.45rem] px-4 sm:px-6 font-mono text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer {activeView ===
          'packages'
            ? 'bg-brand-dark text-brand-light shadow-xs'
            : 'text-brand-dark/65 hover:text-brand-dark'}"
          onclick={() => setView("packages")}
        >
          {$_('pricing.options.packagesTab') || 'Packages'}
        </button>
        <button
          id="pricing-custom-tab"
          type="button"
          role="tab"
          aria-selected={activeView === "custom"}
          aria-controls="pricing-custom-panel"
          class="flex-1 sm:flex-initial min-h-11 rounded-[0.45rem] px-4 sm:px-6 font-mono text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer {activeView ===
          'custom'
            ? 'bg-brand-dark text-brand-light shadow-xs'
            : 'text-brand-dark/65 hover:text-brand-dark'}"
          onclick={() => setView("custom")}
        >
          {$_('pricing.options.customTab') || 'Custom Price'}
        </button>
      </div>
    </header>
  </div>

  <div
    id="pricing-packages-panel"
    role="tabpanel"
    aria-labelledby="pricing-packages-tab"
    hidden={activeView !== "packages"}
    class="mt-14 sm:mt-16"
  >
    <PricingCards />
  </div>

  <div
    id="pricing-custom-panel"
    role="tabpanel"
    aria-labelledby="pricing-custom-tab"
    hidden={activeView !== "custom"}
    class="mt-14 sm:mt-16"
  >
    <PricingCalculator />
  </div>
</section>
