<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { faqs } from "$lib/content/home";
  import { previewMedia } from "$lib/content/media";

  const faqImages = [
    previewMedia.jewelryMacro,       // Q1: Formats
    previewMedia.jewelryDetail,      // Q2: Turnaround
    previewMedia.redStudioPortrait,  // Q3: Revisions
    previewMedia.editingWorkspace,   // Q4: Transfer
    previewMedia.perfumeShadow,      // Q5: Consistency
    previewMedia.studioPortrait,     // Q6: Workflow
  ];

  const telemetryData = [
    { code: "FMT.RAW // PSB // TIFF" },
    { code: "SCHED.CONFIRMED" },
    { code: "VER.03 // ACTIVE" },
    { code: "SSH.ENCRYPTED" },
    { code: "ISO.CALIBRATED" },
    { code: "CONV.INTEGRATED" }
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
            overwrite: "auto"
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
          overwrite: "auto"
        });
      }

      if (nextAnswer) {
        gsap.to(nextAnswer, {
          height: "auto",
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto"
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
          gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          })
          .from(".faq-reveal-left", {
            autoAlpha: 0,
            x: -24,
            duration: 0.8,
            ease: "power3.out",
          })
          .from(".faq-reveal-right", {
            autoAlpha: 0,
            x: 24,
            duration: 0.8,
            ease: "power3.out",
          }, "-=0.8")
          .from(".faq-item-reveal", {
            autoAlpha: 0,
            y: 20,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          }, "-=0.6");
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
          }
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
  id="faq-section"
  bind:this={section}
  aria-labelledby="faq-section-title"
  class="section-space relative overflow-hidden bg-brand-light py-24 sm:py-32 text-brand-dark"
>
  <!-- Background design accents -->
  <div class="absolute inset-x-0 top-0 h-px bg-brand-dark/10" aria-hidden="true"></div>
  <div class="absolute inset-x-0 bottom-0 h-px bg-brand-dark/10" aria-hidden="true"></div>

  <div class="site-shell">
    <div class="grid gap-14 lg:grid-cols-12 lg:gap-16 items-start">
      
      <!-- Left Column: Questions List (Columns 1-7) -->
      <div class="faq-reveal-left lg:col-span-7 space-y-10">
        
        <!-- Header -->
        <div class="border-b border-brand-dark/10 pb-8">
          <p class="eyebrow text-brand-green">Working together</p>
          <h2
            id="faq-section-title"
            class="mt-6 font-display text-[clamp(2.75rem,5.5vw,4.5rem)] leading-[0.92] tracking-[-0.040em] text-brand-dark"
          >
            Questions.
          </h2>
        </div>

        <!-- Accordion List -->
        <div class="divide-y divide-brand-dark/15 border-b border-brand-dark/15">
          {#each faqs as item, index (item.question)}
            <div class="faq-item-reveal">
              <button
                id={`faq-trigger-${index + 1}`}
                type="button"
                class="w-full text-left py-7 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green transition-colors"
                aria-expanded={activeIndex === index}
                aria-controls={`faq-panel-${index + 1}`}
                onmouseenter={() => handleFaqClick(index, true)}
                onclick={() => handleFaqClick(index, false)}
              >
                <!-- Question heading -->
                <div class="flex justify-between items-center gap-6">
                  <div class="flex items-start gap-4 sm:gap-6">
                    <span class="font-mono text-[0.62rem] text-brand-green/75 tracking-wider font-bold mt-1.5 sm:mt-2.5">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3
                      class="font-display text-[1.35rem] tracking-[-0.02em] sm:text-2xl lg:text-[1.65rem] text-brand-dark transition-colors duration-300 group-hover:text-brand-green"
                      class:text-brand-green={activeIndex === index}
                    >
                      {item.question}
                    </h3>
                  </div>
                  
                  <!-- Crosshair expandable toggle icon -->
                  <div class="relative size-6 flex items-center justify-center text-brand-dark/50" aria-hidden="true">
                    <span class="absolute w-4 h-0.5 bg-current transition-transform duration-300" class:rotate-90={activeIndex !== index}></span>
                    <span class="absolute w-4 h-0.5 bg-current"></span>
                  </div>
                </div>
                
                <!-- Answer slide panel (controlled by GSAP height changes) -->
                <div
                  id={`faq-panel-${index + 1}`}
                  bind:this={answerContainers[index]}
                  class="overflow-hidden"
                  style="height: {index === 0 ? 'auto' : '0px'}"
                  role="region"
                  aria-labelledby={`faq-trigger-${index + 1}`}
                >
                  <p class="max-w-2xl pt-5 pb-2 pl-8 sm:pl-10 text-sm leading-relaxed text-brand-dark/65 sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </button>
            </div>
          {/each}
        </div>

      </div>

      <!-- Right Column: Dedicated Sticky Viewport Frame (Columns 8-12) -->
      <div class="faq-reveal-right lg:col-span-5 lg:sticky lg:top-[18vh] lg:self-start pointer-events-none">
        <div class="relative overflow-hidden aspect-[4/5] w-full max-w-[28rem] mx-auto lg:mx-0 rounded-sm">
          
          <!-- Colored Image viewport -->
          <div class="relative size-full overflow-hidden bg-brand-light">
            <!-- Scroll Parallax Wrapper -->
            <div class="faq-parallax-image absolute inset-x-0 top-[-15%] h-[130%] pointer-events-none">
              {#each faqImages as img, idx (img.src)}
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
