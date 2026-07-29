<script lang="ts">
  import { onMount } from "svelte";
  import { pricingPageData } from "$lib/content/pricing";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { Plus, Minus } from "lucide-svelte";
  import { slide } from "svelte/transition";
  import { cn } from "$lib/utils";

  let sectionEl: HTMLElement;
  let openIndex = $state<number | null>(null);

  const toggle = (index: number) => {
    openIndex = openIndex === index ? null : index;
  };

  onMount(() => {
    let ctx: any;
    registerScrollTrigger().then((gsapRuntime) => {
      if (!gsapRuntime || !sectionEl) return;
      const { gsap } = gsapRuntime;

      ctx = gsap.context(() => {
        gsap.from(".faq-item", {
          scrollTrigger: {
            trigger: ".faq-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        });
      }, sectionEl);
    });

    return () => {
      ctx?.revert();
    };
  });
</script>

<section
  bind:this={sectionEl}
  id="pricing-faq"
  class="section-space relative bg-brand-light text-brand-dark py-24 md:py-36"
>
  <div class="site-shell max-w-4xl mx-auto">
    <!-- Header -->
    <header class="text-center mb-16">
      <h2
        class="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-[-0.04em] leading-none mb-4 text-brand-dark"
      >
        Frequently Scoped
      </h2>
      <p class="text-brand-dark/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
        Common questions regarding our production pipeline pricing, volume
        contracts, complexity tiers, and turnaround SLAs.
      </p>
    </header>

    <!-- FAQ Accordion -->
    <div class="faq-grid flex flex-col border-t border-brand-dark/15">
      {#each pricingPageData.faqs as faq, index}
        <div class="faq-item border-b border-brand-dark/15 py-6 transition-all">
          <button
            type="button"
            class="w-full flex justify-between items-center text-left py-2 font-display text-xl sm:text-2xl font-normal tracking-tight text-brand-dark hover:text-brand-green transition-colors focus:outline-none cursor-pointer"
            onclick={() => toggle(index)}
          >
            <span>{faq.question}</span>
            <span
              class="ml-4 flex-shrink-0 w-9 h-9 rounded-full border border-brand-dark/20 flex items-center justify-center text-brand-dark/70 group-hover:text-brand-green group-hover:border-brand-green transition-colors"
            >
              {#if openIndex === index}
                <Minus size={16} />
              {:else}
                <Plus size={16} />
              {/if}
            </span>
          </button>

          {#if openIndex === index}
            <div transition:slide={{ duration: 250 }} class="mt-4 pr-10">
              <p
                class="text-base sm:text-lg text-brand-dark/75 leading-relaxed font-sans max-w-[65ch]"
              >
                {faq.answer}
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
