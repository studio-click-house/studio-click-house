<script lang="ts">
  import { onMount } from "svelte";
  import { Plus } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { faqs } from "$lib/content/home";
  import type { FaqItem, PreviewMedia } from "$lib/types/content";
  import { _ } from "svelte-i18n";

  let { 
    items = faqs, 
    images = [],
    imageFit = "cover",
    title = "",
  } = $props<{ 
    items?: FaqItem[]; 
    images?: PreviewMedia[];
    imageFit?: "cover" | "contain";
    title?: string;
  }>();

  let isCustom = $derived(items !== faqs);
  let activeIndex = $state(0);

  let section: HTMLElement;
  let answerContainers: HTMLElement[] = [];

  function handleFaqClick(index: number) {
    if (activeIndex === index) {
      activeIndex = -1;

      registerScrollTrigger().then((runtime) => {
        if (!runtime) return;
        const { gsap } = runtime;
        const prevAnswer = answerContainers[index];
        if (prevAnswer) {
          gsap.to(prevAnswer, {
            height: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
      return;
    }

    const previousIndex = activeIndex;
    activeIndex = index;

    registerScrollTrigger().then((runtime) => {
      if (!runtime) return;
      const { gsap } = runtime;
      const prevAnswer = answerContainers[previousIndex];
      const nextAnswer = answerContainers[index];

      if (prevAnswer && previousIndex !== -1) {
        gsap.to(prevAnswer, {
          height: 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (nextAnswer) {
        gsap.to(nextAnswer, {
          height: "auto",
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });
  }

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 88%",
                toggleActions: "play none none none",
                once: true,
              },
            })
            .from(".faq-header-reveal", {
              autoAlpha: 0,
              y: 20,
              duration: 0.5,
              ease: "power3.out",
              clearProps: "opacity,visibility,transform",
            })
            .from(
              ".faq-row-reveal",
              {
                autoAlpha: 0,
                y: 16,
                duration: 0.4,
                stagger: 0.04,
                ease: "power2.out",
                clearProps: "opacity,visibility,transform",
              },
              "-=0.25",
            );
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
  id="faq"
  aria-labelledby="faq-section-title"
  class="relative isolate overflow-hidden py-12 sm:py-14 lg:py-16 text-brand-dark"
>
  <div class="site-shell relative z-10">
    <div class="mx-auto max-w-4xl">
      <!-- Section Header: Clean, confident, pure typography -->
      <div class="faq-header-reveal mb-8 sm:mb-10">
        <p class="mb-4 font-sans text-sm font-medium text-brand-dark/60">
          {$_("sectionLabels.faq") || "Questions & Answers"}
        </p>
        <h2
          id="faq-section-title"
          class="font-sans text-[clamp(2.4rem,4.5vw,3.85rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-brand-dark"
        >
          {title || $_('home.faq.title') || "Frequently Asked Questions"}
        </h2>
        <p class="mt-4 text-sm sm:text-base leading-relaxed text-brand-dark/65 max-w-xl font-normal">
          Direct details on file formats, turnaround planning, revisions, and production workflow for commercial imagery and motion.
        </p>
      </div>

      <!-- Hairline Accordion List (Pure Swiss Editorial — No Cards, No AI Bloat) -->
      <div class="border-t border-brand-dark/15">
        {#each items as item, index (item.question)}
          <div class="faq-row-reveal border-b border-brand-dark/15 transition-colors">
            <button
              id={`faq-trigger-${index + 1}`}
              type="button"
              class="w-full flex items-start justify-between gap-6 py-6 sm:py-7 text-left group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-dark cursor-pointer select-none"
              aria-expanded={activeIndex === index}
              aria-controls={`faq-panel-${index + 1}`}
              onclick={() => handleFaqClick(index)}
            >
              <div class="flex items-baseline gap-4 sm:gap-6 min-w-0 pr-4">
                <span class="font-sans text-xs font-medium text-brand-dark/50 transition-colors group-hover:text-brand-dark shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  class="font-sans font-semibold text-[1.0625rem] sm:text-[1.2rem] leading-snug text-brand-dark transition-colors duration-200 group-hover:opacity-75"
                >
                  {isCustom ? item.question : ($_(`home.faqs.${index}.question`) || item.question)}
                </h3>
              </div>

              <!-- Minimal hairline toggle (+ / -) -->
              <div
                class="size-6 shrink-0 flex items-center justify-center text-brand-dark/45 transition-transform duration-300 group-hover:text-brand-dark"
                class:rotate-45={activeIndex === index}
                aria-hidden="true"
              >
                <Plus class="size-4 stroke-[1.6]" />
              </div>
            </button>

            <!-- Expandable Answer Panel -->
            <div
              id={`faq-panel-${index + 1}`}
              bind:this={answerContainers[index]}
              class="overflow-hidden"
              style="height: {index === 0 ? 'auto' : '0px'}"
              role="region"
              aria-labelledby={`faq-trigger-${index + 1}`}
            >
              <div class="pb-6 sm:pb-7 pl-7 sm:pl-10">
                <p class="max-w-2xl text-[0.9375rem] sm:text-base leading-[1.7] text-brand-dark/70 font-normal">
                  {isCustom ? item.answer : ($_(`home.faqs.${index}.answer`) || item.answer)}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
