<script lang="ts">
  import PricingCalculator from "./PricingCalculator.svelte";
  import PricingCards from "./PricingCards.svelte";

  type PricingView = "packages" | "custom";

  let activeView = $state<PricingView>("packages");
</script>

<section
  id="pricing-options"
  aria-labelledby="pricing-options-title"
  class="relative border-b border-brand-dark/10 bg-brand-light py-24 text-brand-dark sm:py-32"
>
  <div class="site-shell">
    <header class="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
      <div class="max-w-3xl lg:col-span-8">
        <h2
          id="pricing-options-title"
          class="font-display text-[clamp(2.75rem,5.5vw,4.5rem)] leading-[0.92] tracking-[-0.04em] text-brand-dark"
        >
          Our Pricing
        </h2>
        <p
          class="mt-5 max-w-xl text-sm leading-relaxed text-brand-dark/70 sm:text-base"
        >
          Choose a ready-made production package or build a custom estimate
          around your exact volume, complexity, and turnaround.
        </p>
      </div>

      <div
        class="flex w-fit rounded-[0.55rem] border border-brand-dark/20 bg-brand-paper p-1 lg:col-span-4 lg:justify-self-end"
        role="tablist"
        aria-label="Pricing options"
      >
        <button
          id="pricing-packages-tab"
          type="button"
          role="tab"
          aria-selected={activeView === "packages"}
          aria-controls="pricing-packages-panel"
          class="min-h-11 rounded-[0.45rem] px-5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-6 {activeView ===
          'packages'
            ? 'bg-brand-dark text-brand-light'
            : 'text-brand-dark/65 hover:text-brand-dark'}"
          onclick={() => (activeView = "packages")}
        >
          Packages
        </button>
        <button
          id="pricing-custom-tab"
          type="button"
          role="tab"
          aria-selected={activeView === "custom"}
          aria-controls="pricing-custom-panel"
          class="min-h-11 rounded-[0.45rem] px-5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-6 {activeView ===
          'custom'
            ? 'bg-brand-dark text-brand-light'
            : 'text-brand-dark/65 hover:text-brand-dark'}"
          onclick={() => (activeView = "custom")}
        >
          Custom Price
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
