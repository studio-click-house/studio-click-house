<script lang="ts">
  import { onMount } from "svelte";
  import { Plus } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { faqs } from "$lib/content/home";
  import { previewMedia } from "$lib/content/media";
  import type { FaqItem, PreviewMedia } from "$lib/types/content";
  import { _ } from "svelte-i18n";

  const defaultFaqImages = [
    previewMedia.jewelryMacro, // Q1: Formats
    previewMedia.jewelryDetail, // Q2: Turnaround
    previewMedia.redStudioPortrait, // Q3: Revisions
    previewMedia.editingWorkspace, // Q4: Transfer
    previewMedia.perfumeShadow, // Q5: Consistency
    previewMedia.studioPortrait, // Q6: Workflow
  ];

  let { 
    items = faqs, 
    images = defaultFaqImages 
  } = $props<{ 
    items?: FaqItem[]; 
    images?: PreviewMedia[]; 
  }>();

  const telemetryData = [
    { code: "FMT.RAW // PSB // TIFF" },
    { code: "SCHED.CONFIRMED" },
    { code: "VER.03 // ACTIVE" },
    { code: "SSH.ENCRYPTED" },
    { code: "ISO.CALIBRATED" },
    { code: "CONV.INTEGRATED" },
  ];

  let activeIndex = $state(0);
  let activeImageIndex = $state(0);
  let section: HTMLElement;
  let answerContainers: HTMLElement[] = [];
  function handleFaqClick(index: number, isHover = false) {
    // Toggle active accordion off on repeated clicks
    if (activeIndex === index) {
      if (isHover) return;

      activeIndex = -1;

      registerScrollTrigger().then((runtime) => {
        if (!runtime) return;
        const { gsap } = runtime;
        const prevAnswer = answerContainers[index];
        if (prevAnswer) {
          gsap.to(prevAnswer, {
            height: 0,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
      return;
    }

    const previousIndex = activeIndex;
    activeIndex = index;
    activeImageIndex = index; // Keep the last image visible even when accordion is collapsed

    registerScrollTrigger().then((runtime) => {
      if (!runtime) return;
      const { gsap } = runtime;
      const prevAnswer = answerContainers[previousIndex];
      const nextAnswer = answerContainers[index];

      if (prevAnswer && previousIndex !== -1) {
        gsap.to(prevAnswer, {
          height: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      if (nextAnswer) {
        gsap.to(nextAnswer, {
          height: "auto",
          duration: 0.45,
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
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
              },
            })
            .from("#faq-section-title", {
              autoAlpha: 0,
              y: 24,
              duration: 0.7,
              ease: "power3.out",
            })
            .from(
              ".faq-item-reveal",
              {
                autoAlpha: 0,
                y: 20,
                duration: 0.6,
                stagger: 0.07,
                ease: "power3.out",
                clearProps: "opacity,visibility,transform",
              },
              "-=0.4",
            )
            .from(
              ".faq-reveal-right",
              {
                autoAlpha: 0,
                x: 24,
                duration: 0.8,
                ease: "power3.out",
                clearProps: "opacity,visibility,transform",
              },
              "-=0.5",
            );
        });

        // Parallax image scroll trigger (matches scroll movement of Section 2)
        media.add(
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap.fromTo(
              ".faq-parallax-image",
              { yPercent: 12 },
              {
                yPercent: -12,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.55,
                },
              },
            );
          },
        );

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
  aria-labelledby="faq-title"
  class="relative isolate overflow-hidden py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div class="site-shell relative z-10">
    <div class="grid gap-14 lg:grid-cols-12 lg:gap-16 items-start">
      <!-- Left Column: Questions List (Columns 1-7) -->
      <div class="faq-reveal-left lg:col-span-7 space-y-6">
        <!-- Header -->
        <div class="pb-2">
          <h2
            id="faq-section-title"
            class="font-display text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.04em] text-brand-dark"
          >
            {$_('home.faq.title')}
          </h2>
        </div>

        <!-- Accordion List: Separate rounded row cards (table/pill style) -->
        <div class="space-y-3 sm:space-y-3.5">
          {#each items as item, index (item.question)}
            <div
              class="faq-item-reveal rounded-2xl border transition-all duration-300 overflow-hidden {activeIndex === index
                ? 'border-brand-green/60 bg-white shadow-sm ring-1 ring-brand-green/15'
                : 'border-brand-dark/10 bg-white/70 hover:bg-white hover:border-brand-dark/25 shadow-xs'}"
            >
              <button
                id={`faq-trigger-${index + 1}`}
                type="button"
                class="w-full flex items-center justify-between gap-4 px-5 py-4.5 sm:px-6 sm:py-5 text-left group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green transition-colors cursor-pointer"
                aria-expanded={activeIndex === index}
                aria-controls={`faq-panel-${index + 1}`}
                onmouseenter={() => handleFaqClick(index, true)}
                onclick={() => handleFaqClick(index, false)}
              >
                <!-- Question heading -->
                <h3
                  class="font-sans font-semibold text-[1.02rem] sm:text-[1.12rem] leading-snug text-brand-dark transition-colors duration-200 group-hover:text-brand-green"
                  class:text-brand-green={activeIndex === index}
                >
                  {$_(`home.faqs.${index}.question`) || item.question}
                </h3>

                <!-- Circular Plus icon pill matching screenshot -->
                <div
                  class="size-8 sm:size-9 shrink-0 rounded-full flex items-center justify-center border transition-all duration-300 {activeIndex === index
                    ? 'border-brand-green bg-brand-green text-white rotate-45 shadow-xs'
                    : 'border-brand-dark/15 bg-brand-dark/5 text-brand-dark/60 group-hover:border-brand-green/40 group-hover:text-brand-green group-hover:bg-brand-green/10'}"
                  aria-hidden="true"
                >
                  <Plus class="size-4 sm:size-4.5 stroke-[2.2] transition-transform duration-300" />
                </div>
              </button>

              <!-- Answer slide panel (controlled by GSAP height changes) -->
              <div
                id={`faq-panel-${index + 1}`}
                bind:this={answerContainers[index]}
                class="overflow-hidden"
                style="height: {index === 0 ? 'auto' : '0px'}"
                role="region"
                aria-labelledby={`faq-trigger-${index + 1}`}
              >
                <div class="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 border-t border-brand-dark/6 mt-0.5 pt-3.5">
                  <p class="max-w-2xl text-sm leading-relaxed text-brand-dark/70 sm:text-[0.95rem]">
                    {$_(`home.faqs.${index}.answer`) || item.answer}
                  </p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Right Column: Dedicated Sticky Viewport Frame (Columns 8-12) -->
      <div
        class="faq-reveal-right lg:col-span-5 lg:sticky lg:top-[18vh] lg:self-start pointer-events-none"
      >
        <div
          class="relative overflow-hidden aspect-[4/5] w-full max-w-[28rem] mx-auto lg:mx-0 rounded-[1.5rem]"
        >
          <!-- Colored Image viewport -->
          <div class="relative size-full overflow-hidden bg-brand-light">
            <!-- Scroll Parallax Wrapper -->
            <div
              class="faq-parallax-image absolute inset-x-0 top-[-15%] h-[130%] pointer-events-none"
            >
              {#each images as img, idx (img.src)}
                <img
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  loading="lazy"
                  class="absolute inset-0 size-full object-cover transition-all duration-700 ease-out"
                  class:opacity-100={activeImageIndex === idx}
                  class:scale-100={activeImageIndex === idx}
                  class:opacity-0={activeImageIndex !== idx}
                  class:scale-105={activeImageIndex !== idx}
                />
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
