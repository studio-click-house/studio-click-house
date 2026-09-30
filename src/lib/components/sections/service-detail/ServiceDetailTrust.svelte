<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { motion } from "$lib/animations/motion";

  export interface TrustItem {
    title: string;
    description: string;
  }

  const defaultItems: TrustItem[] = [
    {
      title: "12+ Years Experience",
      description: "Supporting commercial visual post-production since 2012.",
    },
    {
      title: "Dedicated Teams",
      description:
        "A production team aligned with your requirements, references and quality expectations.",
    },
    {
      title: "100+ Specialists",
      description:
        "Experienced post-production specialists across our visual content capabilities.",
    },
    {
      title: "24/6 Production",
      description:
        "Production runs six days a week to keep work moving across time zones.",
    },
    {
      title: "Consistent Quality",
      description:
        "Client-specific references and QA processes help maintain consistency across every delivery.",
    },
    {
      title: "Enterprise NDA Security",
      description:
        "Information security and confidentiality practices designed for professional content operations.",
    },
  ];

  let {
    preheading = "Why Studio Click House?",
    heading = "Built for",
    headingAccent = "Reliable Delivery.",
    description = "The people, processes and production infrastructure to support demanding commercial e-commerce workflows.",
    items = defaultItems,
  } = $props<{
    preheading?: string;
    heading?: string;
    headingAccent?: string;
    description?: string;
    items?: TrustItem[];
  }>();

  let section = $state<HTMLElement>();

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".sd-trust-left", {
            autoAlpha: 0,
            y: motion.reveal.y,
            duration: motion.duration.reveal,
            ease: motion.ease,
            clearProps: "all",
            scrollTrigger: {
              trigger: section,
              start: motion.reveal.start,
              once: true,
            },
          });

          gsap.from(".sd-trust-cell", {
            autoAlpha: 0,
            y: motion.reveal.y,
            duration: motion.duration.reveal,
            stagger: motion.reveal.stagger,
            ease: motion.ease,
            clearProps: "all",
            scrollTrigger: {
              trigger: ".sd-trust-grid",
              start: motion.reveal.start,
              once: true,
            },
          });
        });

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  bind:this={section}
  id="why-studio-click-house"
  aria-labelledby="why-studio-click-house-title"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div class="site-shell relative z-10">
    <div class="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
      <!-- Left Side: Editorial Headline & Copy -->
      <div class="sd-trust-left lg:sticky lg:top-28 lg:col-span-5 lg:pr-6">
        <p
          class="font-display text-lg font-bold tracking-tight text-brand-dark/70 sm:text-xl"
        >
          {preheading}
        </p>

        <h2
          id="why-studio-click-house-title"
          class="mt-3 max-w-[20ch] font-display text-[var(--text-section)] leading-[0.98] tracking-[-0.04em] text-brand-dark"
        >
          {heading}
          <span class="block text-brand-dark">{headingAccent}</span>
        </h2>

        <p class="mt-6 max-w-[34ch] text-base leading-relaxed text-brand-dark/65">
          {description}
        </p>
      </div>

      <!-- Right Side: Hairline Divider Grid (Not Box Cards) -->
      <div
        class="sd-trust-grid grid grid-cols-1 border-t border-brand-dark/10 sm:grid-cols-2 lg:col-span-7"
      >
        {#each items as item, i (item.title)}
          {@const isOddCol = i % 2 === 0}
          <div
            class="sd-trust-cell group border-b border-brand-dark/10 p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:bg-brand-green {isOddCol
              ? 'sm:border-r sm:border-brand-dark/10'
              : ''}"
          >
            <h3
              class="font-display text-base font-extrabold uppercase tracking-tight text-brand-dark transition-colors duration-300 sm:text-lg"
            >
              {item.title}
            </h3>
            <p
              class="mt-2.5 text-sm leading-relaxed text-brand-dark/65 transition-colors duration-300 group-hover:text-brand-dark/85"
            >
              {item.description}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
