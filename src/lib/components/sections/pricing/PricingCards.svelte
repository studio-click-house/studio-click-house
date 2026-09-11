<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { Check, ArrowRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { _ } from "svelte-i18n";

  interface ServiceItem {
    name: string;
    price: string;
  }

  interface PricingPlan {
    id: string;
    name: string;
    description: string;
    services: ServiceItem[];
    features: string[];
    buttonText: string;
    buttonHref: string;
  }

  const plans: PricingPlan[] = [
    {
      id: "cut-outs-service",
      name: "Cut-Outs Service",
      description: "Pixel-perfect hand-drawn vector paths and soft edge masking.",
      services: [
        { name: "Clipping Path", price: "€0.50" },
        { name: "Image Masking", price: "€1.50" },
        { name: "Object Remove", price: "€0.80" },
        { name: "Shadow Making", price: "€2.00" },
        { name: "360 Image", price: "€1.00" },
        { name: "E-commerce Image", price: "€1.00" },
        { name: "Neck Join/Ghost Mannequin", price: "€2.00" },
      ],
      features: [
        "Free Trial",
        "Secure FTP",
        "3 Steps Quality Control",
        "24×7 Support",
        "Low Cost",
        "Bulk Offer"
      ],
      buttonText: "Order Now",
      buttonHref: "/contact?plan=cut-outs",
    },
    {
      id: "enhancement",
      name: "Enhancement",
      description: "Creative retouching, color correction, and restoration.",
      services: [
        { name: "Image Retouch", price: "€1.00" },
        { name: "Creative Retouch", price: "€2.50" },
        { name: "High-end Retouch", price: "€3.00" },
        { name: "Image Manipulation", price: "€5.00" },
        { name: "Color Correction", price: "€1.50" },
        { name: "Color Change", price: "€1.00" },
        { name: "Pattern Change", price: "€5.00" },
        { name: "Real Estate Photo", price: "€4.00" },
        { name: "Old Photo Restoration", price: "€10.00" },
      ],
      features: [
        "Free Trial",
        "Secure FTP",
        "3 Steps Quality Control",
        "24×7 Support",
        "Low Cost",
        "Bulk Offer"
      ],
      buttonText: "Order Now",
      buttonHref: "/contact?plan=enhancement",
    },
    {
      id: "vector-illustration",
      name: "Vector Illustration & Conversion",
      description: "Raster-to-vector tracing, plans, logo designs, and custom artwork.",
      services: [
        { name: "Raster to Vector", price: "€5.00" },
        { name: "Plan Drawing", price: "€20.00" },
        { name: "Logo Design", price: "€5.00" },
        { name: "Drawing of product", price: "€5.00" },
        { name: "Advertising Design", price: "€10.00" },
        { name: "Illustration", price: "€20.00" },
      ],
      features: [
        "Free Trial",
        "Secure FTP",
        "3 Steps Quality Control",
        "24×7 Support",
        "Low Cost",
        "Bulk Offer"
      ],
      buttonText: "Order Now",
      buttonHref: "/contact?plan=illustration",
    },
    {
      id: "ai-services",
      name: "AI Services",
      description: "Generative AI background synthesis, relighting, and model generation.",
      services: [
        { name: "AI Background Synthesis", price: "€0.80" },
        { name: "AI Product Relighting", price: "€1.20" },
        { name: "AI Model Generation", price: "€2.00" },
        { name: "AI Face Swap & Match", price: "€1.50" },
        { name: "AI Resolution Upscale", price: "€0.30" },
        { name: "AI Pattern Synthesis", price: "€1.00" },
      ],
      features: [
        "Free Trial",
        "Secure FTP",
        "3 Steps Quality Control",
        "24×7 Support",
        "Low Cost",
        "Bulk Offer"
      ],
      buttonText: "Order Now",
      buttonHref: "/contact?plan=ai-services",
    },
  ];

  let activePlanId = $state("enhancement");

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        gsap.from(".pricing-container-reveal", {
          opacity: 0,
          y: 28,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#pricing-cards-section",
            start: "top 90%",
            once: true,
          },
          clearProps: "all",
        });
      });
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<div id="pricing-cards-section" class="relative bg-brand-light text-brand-dark">
  <div class="site-shell">
    <!-- Responsive Grid: 1 col on mobile, 2 cols on tablet/iPad, 4 cols on desktop -->
    <div
      class="pricing-container-reveal relative w-full bg-brand-dark/10 border border-brand-dark/10 rounded-[1.5rem] sm:rounded-[2rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden shadow-sm z-10"
    >
      {#each plans as plan, planIdx (plan.id)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          onmouseenter={() => (activePlanId = plan.id)}
          onclick={() => (activePlanId = plan.id)}
          class="relative flex flex-col justify-between p-6 sm:p-7 xl:p-8 transition-all duration-300 ease-out bg-white {
            activePlanId === plan.id
              ? 'z-20 ring-2 ring-brand-green shadow-lg'
              : 'z-10 hover:bg-brand-light/30'
          }"
        >
          <div>
            <!-- Header Solid Black Badge Block -->
            <div
              class="w-full bg-brand-dark text-brand-light text-center py-3.5 px-3 sm:px-4 rounded-xl font-mono text-[0.68rem] sm:text-[0.72rem] font-bold uppercase tracking-wider mb-6 flex items-center justify-center min-h-[58px] sm:min-h-[66px] shadow-xs"
            >
              {$_(`pricing.packages.plans.${planIdx}.name`) || plan.name}
            </div>

            <!-- Description -->
            <p class="text-xs text-brand-dark/65 leading-relaxed mb-6 font-sans">
              {$_(`pricing.packages.plans.${planIdx}.description`) || plan.description}
            </p>

            <!-- Services & Prices Dashed List -->
            <div class="mb-6 sm:mb-8">
              <ul class="space-y-0.5">
                {#each plan.services as svc, svcIdx (`${svcIdx}-${svc.name}`)}
                  <li class="flex items-center justify-between gap-2 py-2 border-b border-dashed border-brand-dark/12 text-xs sm:text-[0.78rem] text-brand-dark">
                    <span class="font-medium text-left pr-1 min-w-0 break-words leading-snug">{$_(`pricing.packages.plans.${planIdx}.services.${svcIdx}.name`) || svc.name}</span>
                    <span class="font-mono font-bold text-brand-green shrink-0">{svc.price}</span>
                  </li>
                {/each}
              </ul>
            </div>

            <!-- Guarantees Checklist -->
            <ul class="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
              {#each plan.features as feature, featureIdx (`${featureIdx}-${feature}`)}
                <li class="flex items-start gap-2.5 text-xs text-brand-dark/75 font-mono">
                  <div
                    class="w-4 h-4 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span>{$_(`pricing.packages.features.${featureIdx}`) || feature}</span>
                </li>
              {/each}
            </ul>
          </div>

          <!-- Button -->
          <a
            href={resolve(plan.buttonHref as "/contact")}
            class="min-h-[44px] w-full py-3 px-4 rounded-[0.55rem] text-xs font-bold text-center tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 border cursor-pointer {
              activePlanId === plan.id
                ? 'bg-brand-green text-brand-light border-brand-green shadow-xs'
                : 'border-brand-dark/10 bg-brand-dark/5 text-brand-dark hover:bg-brand-dark/10'
            }"
          >
            <span>{$_('pricing.packages.orderNow') || plan.buttonText}</span>
            <ArrowRight
              size={14}
              class="transition-transform duration-300 {activePlanId === plan.id ? 'translate-x-1' : ''}"
            />
          </a>
        </div>
      {/each}
    </div>
  </div>
</div>
