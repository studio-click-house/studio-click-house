<script lang="ts">
  import { onMount } from "svelte";
  import { pricingCategories } from "$lib/content/pricing";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { Check, ArrowUpRight } from "lucide-svelte";
  import { cn } from "$lib/utils";

  let sectionEl: HTMLElement;

  onMount(() => {
    let ctx: any;
    registerScrollTrigger().then((gsapRuntime) => {
      if (!gsapRuntime || !sectionEl) return;
      const { gsap, ScrollTrigger } = gsapRuntime;

      ctx = gsap.context(() => {
        // Fade in headers
        gsap.from(".details-header", {
          scrollTrigger: {
            trigger: ".details-header",
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out"
        });

        // Stagger categories fade-in
        gsap.utils.toArray(".category-block").forEach((block: any) => {
          gsap.from(block.querySelectorAll(".rate-row"), {
            scrollTrigger: {
              trigger: block,
              start: "top 75%",
              toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: -20,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out"
          });
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
  id="pricing-details" 
  class="relative bg-brand-light text-brand-dark px-5 py-24 sm:px-10 lg:px-16"
>
  <div class="site-shell">
    
    <!-- Header -->
    <header class="details-header max-w-3xl mb-20">
      <span class="eyebrow text-brand-green block mb-3">Service Matrix</span>
      <h2 class="display-title mb-6 leading-none">Rate Structure</h2>
      <p class="text-brand-dark/70 text-base sm:text-lg leading-relaxed">
        Browse our comprehensive rate matrix across image post-production, video finishing, and 3D CGI pipelines. Final rates are adapted based on volume and complexity.
      </p>
    </header>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 gap-20">
      {#each pricingCategories as category}
        <div class="category-block border-t border-brand-mist pt-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <!-- Category Meta -->
            <div class="lg:col-span-4 lg:sticky lg:top-24">
              <span class="font-mono text-xs text-brand-green uppercase tracking-widest font-semibold block mb-2">
                Department
              </span>
              <h3 class="font-display text-4xl mb-4 font-normal">{category.categoryName}</h3>
              <p class="text-sm text-brand-dark/70 leading-relaxed max-w-sm">
                {category.description}
              </p>
              <a 
                href="/contact?service={category.categoryName.toLowerCase().replace(' ', '-')}" 
                class="group inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase font-bold tracking-widest text-brand-dark hover:text-brand-green transition-colors mt-6"
              >
                Inquire for pipeline <ArrowUpRight size={14} class="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <!-- Rates List -->
            <div class="lg:col-span-8 flex flex-col gap-6">
              {#each category.rates as rate}
                <div class="rate-row group border-b border-brand-mist/40 pb-6 transition-all duration-200">
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div class="max-w-xl">
                      <div class="flex items-center gap-3">
                        <h4 class="font-display text-2xl font-normal group-hover:text-brand-green transition-colors">
                          {rate.name}
                        </h4>
                        <span class="font-mono text-[0.68rem] text-brand-dark/40 border border-brand-mist/55 px-2 py-0.5 uppercase tracking-wider">
                          From ${rate.basePrice.toFixed(2)}/{rate.unit}
                        </span>
                      </div>
                      <p class="text-sm text-brand-dark/60 mt-2 leading-relaxed">
                        {rate.description}
                      </p>
                    </div>
                  </div>

                  <!-- Deliverables Grid -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pl-0 transition-opacity">
                    {#each rate.features as feature}
                      <div class="flex items-center gap-2 text-xs text-brand-dark/70 font-mono">
                        <Check size={12} class="text-brand-green flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>

          </div>
        </div>
      {/each}
    </div>

  </div>
</section>
