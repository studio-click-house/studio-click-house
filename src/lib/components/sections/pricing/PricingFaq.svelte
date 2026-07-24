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
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out"
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
  class="relative bg-brand-light text-brand-dark px-5 py-24 sm:px-10 lg:px-16 border-t border-brand-mist/50"
>
  <div class="site-shell max-w-4xl mx-auto">
    
    <!-- Header -->
    <header class="text-center mb-16">
      <span class="eyebrow text-brand-green block mb-3">FAQ</span>
      <h2 class="display-title text-[clamp(2rem,5vw,4.5rem)] mb-4 leading-none">Frequently Scoped</h2>
      <p class="text-brand-dark/70 text-sm sm:text-base max-w-xl mx-auto">
        Common questions regarding our production pipeline pricing, volume contracts, complexity tiers, and turnaround times.
      </p>
    </header>

    <!-- FAQ Accordion -->
    <div class="faq-grid flex flex-col border-t border-brand-mist">
      {#each pricingPageData.faqs as faq, index}
        <div class="faq-item border-b border-brand-mist/60 py-5 transition-all">
          <button
            class="w-full flex justify-between items-center text-left py-2 font-display text-lg sm:text-xl font-medium tracking-tight text-brand-dark hover:text-brand-green transition-colors focus:outline-none"
            onclick={() => toggle(index)}
          >
            <span>{faq.question}</span>
            <span class="ml-4 flex-shrink-0 w-8 h-8 rounded-none border border-brand-mist/60 flex items-center justify-center text-brand-dark/60 group-hover:text-brand-green group-hover:border-brand-green transition-colors">
              {#if openIndex === index}
                <Minus size={14} />
              {:else}
                <Plus size={14} />
              {/if}
            </span>
          </button>
          
          {#if openIndex === index}
            <div transition:slide={{ duration: 250 }} class="mt-3 pr-8">
              <p class="text-sm sm:text-base text-brand-dark/75 leading-relaxed font-mono uppercase text-[0.68rem] tracking-wide max-w-[65ch]">
                {faq.answer}
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>

  </div>
</section>
