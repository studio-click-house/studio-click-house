<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { Check, ArrowRight } from "lucide-svelte";
  import { resolve } from "$app/paths";

  interface PlanFeature {
    text: string;
    included: boolean;
  }

  interface PricingPlan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    badge: string;
    features: PlanFeature[];
    buttonText: string;
    buttonHref: string;
  }

  const plans: PricingPlan[] = [
    {
      id: "basic",
      name: "Basic Plan",
      price: "$0.23",
      period: "/Per Image",
      badge: "Basic Plan",
      description: "Fast, Easy, and within anyone's reach.",
      features: [
        { text: "Delivery within 48 hours", included: true },
        { text: "1-500 Images / Order", included: true },
        { text: "Multiple Quality Check", included: true },
        { text: "Easy Upload & Download", included: true },
        { text: "24/7 Customer Support", included: true },
      ],
      buttonText: "Choose plan",
      buttonHref: "/contact?plan=basic",
    },
    {
      id: "standard",
      name: "Standard",
      price: "$0.29",
      period: "/Per Image",
      badge: "Standard",
      description: "Upgrade to the deal that can seal more sales",
      features: [
        { text: "Delivery Within 24 Hours", included: true },
        { text: "1-500 Images / Order", included: true },
        { text: "Multiple Quality Check", included: true },
        { text: "Easy Upload & Download", included: true },
        { text: "24/7 Customer Support", included: true },
      ],
      buttonText: "Choose plan",
      buttonHref: "/contact?plan=standard",
    },
    {
      id: "premium",
      name: "Premium",
      price: "$0.41",
      period: "/Per Image",
      badge: "Premium",
      description: "Features that streamline your work process.",
      features: [
        { text: "Delivery Within 12 Hours", included: true },
        { text: "1-500 Images / Order", included: true },
        { text: "Multiple Quality Check", included: true },
        { text: "Easy Upload & Download", included: true },
        { text: "24/7 Customer Support", included: true },
      ],
      buttonText: "Choose plan",
      buttonHref: "/contact?plan=premium",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Contact Us",
      period: "",
      badge: "Enterprise",
      description: "Advanced facilities to expand your business.",
      features: [
        { text: "As your requirements", included: true },
        { text: "Any Quantity", included: true },
        { text: "Multiple Quality Check", included: true },
        { text: "Easy Upload & Download", included: true },
        { text: "24/7 Customer Support", included: true },
      ],
      buttonText: "Contact Us",
      buttonHref: "/contact?plan=enterprise",
    },
  ];

  onMount(() => {
    let active = true;
    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime) return;
      const { gsap } = runtime;

      gsap.from(".pricing-container-reveal", {
        opacity: 0,
        y: 40,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#pricing-cards-section",
          start: "top 80%",
        },
      });
    });

    return () => {
      active = false;
    };
  });
</script>

<div id="pricing-cards-section" class="relative bg-brand-light text-brand-dark">
  <div class="site-shell">
    <!-- Unified Widescreen Container Grid (Matches first wireframe image with no gaps between cards) -->
    <div
      class="pricing-container-reveal relative w-full bg-white border border-brand-dark/10 rounded-[2rem] grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-brand-dark/10 shadow-sm z-10"
    >
      {#each plans as plan (plan.id)}
        <div
          class="group relative flex flex-col justify-between p-8 md:p-10 transition-all duration-300 ease-out bg-transparent border-2 border-transparent hover:scale-y-[1.05] hover:scale-x-[1.02] hover:z-30 hover:bg-white hover:border-brand-green hover:rounded-[1.75rem] hover:shadow-2xl"
        >
          <div>
            <!-- Price & Period -->
            <div class="flex items-baseline gap-1 mb-2">
              <span
                class="font-display text-4xl lg:text-5xl tracking-tight text-brand-dark transition-colors duration-300 group-hover:text-brand-green"
              >
                {plan.price}
              </span>
              {#if plan.period}
                <span class="text-sm text-brand-dark/50 font-medium">
                  {plan.period}
                </span>
              {/if}
            </div>

            <!-- Badge (Pill) -->
            <div
              class="inline-block text-[0.65rem] font-bold tracking-wider uppercase bg-brand-dark/5 text-brand-dark/60 px-3 py-1 rounded-full mb-6 transition-colors duration-300 group-hover:bg-brand-green/10 group-hover:text-brand-green"
            >
              {plan.badge}
            </div>

            <!-- Description -->
            <p class="text-sm text-brand-dark/70 leading-relaxed mb-6">
              {plan.description}
            </p>

            <!-- Features Checklist -->
            <ul class="space-y-3.5 mb-8 border-t border-brand-dark/10 pt-6">
              {#each plan.features as feature}
                <li class="flex items-start gap-2.5 text-xs text-brand-dark/80">
                  <div
                    class="w-4 h-4 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300 group-hover:bg-brand-green group-hover:text-brand-light"
                  >
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span>{feature.text}</span>
                </li>
              {/each}
            </ul>
          </div>

          <!-- Button -->
          <a
            href={plan.buttonHref}
            class="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-center tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 border border-brand-dark/10 bg-brand-dark/5 text-brand-dark group-hover:bg-brand-green group-hover:text-brand-light group-hover:border-brand-green"
          >
            <span>{plan.buttonText}</span>
            <ArrowRight
              size={14}
              class="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      {/each}
    </div>
  </div>
</div>
