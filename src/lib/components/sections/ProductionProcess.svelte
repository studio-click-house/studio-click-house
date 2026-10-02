<script lang="ts">
  import { onMount, tick } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { PreviewMedia } from "$lib/types/content";
  import { _ } from "svelte-i18n";
  import {
    PhoneCall,
    FileEdit,
    ShieldCheck,
    Upload,
    PenTool,
    CheckCircle2,
    PackageCheck,
  } from "lucide-svelte";

  interface ProcessImage extends PreviewMedia {
    stageLabel: string;
    caption: string;
  }

  function homeWorkImage(
    src: string,
    alt: string,
    width: number,
    height: number,
    stageLabel: string = "",
    caption: string = "",
  ): ProcessImage {
    return {
      src,
      alt,
      width,
      height,
      credit: "Studio Click House",
      stageLabel,
      caption,
    };
  }

  const processSteps = [
    {
      title: "Client Outreach & Discovery",
      navTitle: "01 · Outreach",
      timing: "Initial Creative Consultation",
      icon: PhoneCall,
      description:
        "Direct consultation to review your brand visual identity, lighting preferences, monthly image volume, and required delivery timelines.",
      highlights: [
        "Dedicated creative producer assigned within 2–4 business hours",
        "Review brand guide, visual standards, lighting & monthly volume",
        "Same-day response SLA with flexible monthly batch planning",
      ],
      image: homeWorkImage(
        "/images/home/step-01-outreach.webp",
        "Direct client creative consultation and project discovery",
        1080,
        1350,
        "Consultation & Outreach",
        "Direct style definition & discovery",
      ),
    },
    {
      title: "Free Sample Test Edit",
      navTitle: "02 · Test Edit",
      timing: "Complimentary Sample Proof",
      icon: FileEdit,
      description:
        "Send 1–3 benchmark images. We produce a complimentary sample retouch to your exact guidelines so you can evaluate our craft before committing.",
      highlights: [
        "Complimentary sample test retouch on 1–3 benchmark images",
        "100% free with no obligation to evaluate craft and consistency",
        "Full-resolution proof and layered PSD with tailored adjustments",
      ],
      image: homeWorkImage(
        "/images/home/step-02-test-edit.webp",
        "Free sample test edit comparison proof",
        1200,
        1500,
        "Test Edit Proof",
        "Free sample quality sign-off",
      ),
    },
    {
      title: "Client Onboarding & NDA",
      navTitle: "03 · Onboarding",
      timing: "Account Setup & Guidelines",
      icon: ShieldCheck,
      description:
        "We execute bilateral NDAs, document your locked visual benchmarks, agree on volume pricing, and provision your dedicated studio account manager.",
      highlights: [
        "Bilateral NDA executed and confidential asset handling confirmed",
        "Documented visual benchmarks and locked color grading profiles",
        "Direct studio communication via dedicated Slack, Teams or email",
      ],
      image: homeWorkImage(
        "/images/home/step-03-onboarding.webp",
        "Studio onboarding and account setup desk",
        1200,
        1500,
        "Onboarding & NDA",
        "Locked benchmarks & manager setup",
      ),
    },
    {
      title: "Project Handover & Transfer",
      navTitle: "04 · Handover",
      timing: "Secure Batch Ingestion",
      icon: Upload,
      description:
        "Upload source shoots and batch briefs via Dropbox, Google Drive, WeTransfer, OneDrive, or private FTP. Our intake team confirms file integrity immediately.",
      highlights: [
        "Secure upload via Dropbox, Google Drive, WeTransfer, OneDrive or FTP",
        "Automated checksum and resolution audit verifying file integrity",
        "5,000+ daily asset ingestion capacity across RAW, TIFF, PSD and PNG",
      ],
      image: homeWorkImage(
        "/images/home/step-04-handover.webp",
        "Digital asset ingest and file verification desk",
        1200,
        1500,
        "Asset Ingestion",
        "Secure high-res batch transfer",
      ),
    },
    {
      title: "High-Precision Production",
      navTitle: "05 · Production",
      timing: "24/7 Dedicated Craft Suites",
      icon: PenTool,
      description:
        "Certified retouchers work 24/7 across dedicated dual shifts on calibrated hardware, strictly following your approved batch briefs and color profiles.",
      highlights: [
        "24/7 dedicated dual shifts on color-calibrated EIZO monitors",
        "Sub-pixel pen tool masking, meticulous skin texture & tone matching",
        "Specialized discipline artists assigned strictly by project category",
      ],
      image: homeWorkImage(
        "/images/home/step-05-production.webp",
        "High-precision 24/7 retouching craft production suite",
        1200,
        1500,
        "24/7 Production",
        "Sub-pixel pen tool & color craft",
      ),
    },
    {
      title: "5-Step Quality Control",
      navTitle: "06 · 5-Step QC",
      timing: "Multi-Stage Quality Audit",
      icon: CheckCircle2,
      description:
        "Every asset passes our 5-Step Quality Control: technical file audit, task brief confirmation, and senior artist inspection at 100% zoom for edge fidelity.",
      highlights: [
        "100% pixel-level review checking edge fidelity and natural grain",
        "Technical audit of color profiles, curves, clipping paths and bleed",
        "Final sign-off approval by Senior QC Lead and Master Retoucher",
      ],
      image: homeWorkImage(
        "/images/home/step-06-qc.webp",
        "5-step quality control audit at 100% zoom",
        1200,
        1500,
        "5-Step Audit",
        "100% zoom texture & color audit",
      ),
    },
    {
      title: "Delivery, Feedback & Billing",
      navTitle: "07 · Delivery",
      timing: "Master Handoff & Support",
      icon: PackageCheck,
      description:
        "Color-profiled web and print masters are delivered via secure cloud channels. Any requested adjustments receive immediate priority, followed by consolidated monthly billing.",
      highlights: [
        "Color-profiled web and print master files in organized archives",
        "Priority same-day adjustments for any requested fine-tuning",
        "Consolidated monthly invoicing with transparent batch tracking",
      ],
      image: homeWorkImage(
        "/images/home/step-07-delivery.webp",
        "Final delivery handoff and packaging",
        1200,
        1500,
        "Delivery & Release",
        "Color-profiled master handoff",
      ),
    },
  ] as const;

  const timelineMotion = { position: 0 };

  function createTimelinePath(position: number) {
    const stepWidth = 1200 / processSteps.length;
    const center = (position + 0.5) * stepWidth;
    const curveStart = center - 52;
    const curveEnd = center + 52;

    return `M-2400 42 H${curveStart} C${center - 28} 42 ${center - 26} 10 ${center} 10 C${center + 26} 10 ${center + 28} 42 ${curveEnd} 42 H1200`;
  }

  let section = $state<HTMLElement>();
  let stage = $state<HTMLElement>();
  let content = $state<HTMLElement>();
  let timelinePath = $state<SVGPathElement>();
  let tabs = $state<HTMLButtonElement[]>([]);
  let activeIndex = $state(0);
  let indicatorIndex = $state(0);
  let animateTo: ((index: number) => void) | undefined;
  let moveTimeline: ((index: number) => void) | undefined;
  let killTimelineMotion: (() => void) | undefined;
  let activeTransition: { kill: () => void } | undefined;
  let transitionVersion = 0;

  function showStep(index: number) {
    const nextIndex = (index + processSteps.length) % processSteps.length;
    indicatorIndex = nextIndex;

    if (moveTimeline) moveTimeline(nextIndex);
    else {
      timelineMotion.position = nextIndex;
      timelinePath?.setAttribute("d", createTimelinePath(nextIndex));
    }
    if (animateTo) animateTo(nextIndex);
    else activeIndex = nextIndex;
  }

  function handleTabKeydown(event: KeyboardEvent, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (index + direction + processSteps.length) % processSteps.length;
    tabs[nextIndex]?.focus();
    showStep(nextIndex);
  }

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    const preloadObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        const imageSources = new Set(
          processSteps.map((step) => step.image.src),
        );
        imageSources.forEach((src) => {
          const preloadImage = new window.Image();
          preloadImage.src = src;
        });
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    if (section) preloadObserver.observe(section);

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !stage || !content) return;

      const sectionEl = section;
      const contentEl = content;

      const { gsap } = runtime;
      killTimelineMotion = () => gsap.killTweensOf(timelineMotion);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      context = gsap.context(() => {
        moveTimeline = (index: number) => {
          if (reduceMotion) {
            timelineMotion.position = index;
            timelinePath?.setAttribute("d", createTimelinePath(index));
            return;
          }

          gsap.killTweensOf(timelineMotion);
          gsap.to(timelineMotion, {
            position: index,
            duration: 0.52,
            ease: "power2.inOut",
            overwrite: true,
            onUpdate: () => {
              timelinePath?.setAttribute(
                "d",
                createTimelinePath(timelineMotion.position),
              );
            },
          });
        };

        animateTo = (index: number) => {
          if (reduceMotion) {
            activeIndex = index;
            return;
          }

          transitionVersion += 1;
          const currentTransition = transitionVersion;
          activeTransition?.kill();

          const outgoingCard = sectionEl.querySelector(".process-image-card");

          const elementsToKill: (Element | null)[] = [outgoingCard, contentEl];
          gsap.killTweensOf(elementsToKill.filter(Boolean));

          const exitTimeline = gsap.timeline({
            onComplete: async () => {
              if (currentTransition !== transitionVersion) return;

              activeIndex = index;
              await tick();

              const incomingCard = sectionEl.querySelector(".process-image-card");

              const enterTimeline = gsap.timeline({
                onComplete: () => {
                  activeTransition = undefined;
                },
              });

              enterTimeline.fromTo(
                contentEl,
                { x: -24, autoAlpha: 0 },
                {
                  x: 0,
                  autoAlpha: 1,
                  duration: 0.48,
                  ease: "power3.out",
                  clearProps: "transform,opacity,visibility",
                },
                0,
              );

              if (incomingCard) {
                enterTimeline.fromTo(
                  incomingCard,
                  { x: 24, autoAlpha: 0 },
                  {
                    x: 0,
                    autoAlpha: 1,
                    duration: 0.52,
                    ease: "power3.out",
                    clearProps: "transform,opacity,visibility",
                  },
                  0.03,
                );
              }

              activeTransition = enterTimeline;
            },
          });

          exitTimeline.to(
            contentEl,
            {
              x: -16,
              autoAlpha: 0,
              duration: 0.18,
              ease: "power2.in",
            },
            0,
          );

          if (outgoingCard) {
            exitTimeline.to(
              outgoingCard,
              {
                x: 18,
                autoAlpha: 0,
                duration: 0.2,
                ease: "power2.in",
              },
              0,
            );
          }

          activeTransition = exitTimeline;
        };
      }, sectionEl);
    });

    return () => {
      active = false;
      transitionVersion += 1;
      activeTransition?.kill();
      killTimelineMotion?.();
      animateTo = undefined;
      moveTimeline = undefined;
      killTimelineMotion = undefined;
      preloadObserver.disconnect();
      context?.revert();
    };
  });
</script>

<section
  id="production-process"
  bind:this={section}
  aria-labelledby="production-process-title"
  class="process-section overflow-hidden bg-brand-light text-brand-dark py-10 sm:py-12 lg:py-14"
>
  <div class="site-shell process-shell">
    <div
      bind:this={stage}
      id="production-process-panel"
      class="process-stage"
      role="tabpanel"
      aria-labelledby={`production-process-tab-${activeIndex}`}
    >
      <!-- Unified Left Side: Editorial Story & Stage Protocols Combined in One Cohesive Block -->
      <div bind:this={content} class="process-editorial-block">
        <div class="process-intro">
          <span class="process-watermark-num" aria-hidden="true">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <div class="process-timing eyebrow text-brand-dark/55 flex items-center gap-2">
            <span>{$_(`home.processSteps.${activeIndex}.timing`) || processSteps[activeIndex].timing}</span>
            <span class="text-brand-dark/25">·</span>
            <span class="font-mono text-[0.6875rem]">Phase 0{activeIndex + 1} / 07</span>
          </div>
          <h2 id="production-process-title">
            {$_(`home.processSteps.${activeIndex}.title`) || processSteps[activeIndex].title}
          </h2>
          <p class="process-desc">
            {$_(`home.processSteps.${activeIndex}.description`) || processSteps[activeIndex].description}
          </p>
        </div>

        <!-- Clean Stage Highlights (No divider lines, clean green dots) -->
        <ul class="process-highlights-list" aria-label="Stage highlights">
          {#each processSteps[activeIndex].highlights as point}
            <li class="process-highlight-item">
              <span class="process-highlight-dot" aria-hidden="true"></span>
              <span class="process-highlight-text">{point}</span>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Right: Single 4:5 Aspect Ratio Image With Zero Border -->
      <figure class="process-image-card" aria-hidden="true">
        <img
          src={processSteps[activeIndex].image.src}
          alt={processSteps[activeIndex].image.alt}
          width={processSteps[activeIndex].image.width}
          height={processSteps[activeIndex].image.height}
          loading="lazy"
        />
        {#if processSteps[activeIndex].image.caption}
          <div class="process-image-caption">
            {processSteps[activeIndex].image.caption}
          </div>
        {/if}
      </figure>
    </div>

    <!-- Bottom Horizontal Timeline Tabs (Hover & Click Moves Step) -->
    <div class="process-navigation">
      <div
        class="process-tabs"
        role="tablist"
        aria-label="Production workflow stages"
        style={`--step-count: ${processSteps.length};`}
      >
        <svg
          class="process-timeline-line"
          viewBox="0 0 1200 54"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path bind:this={timelinePath} d={createTimelinePath(0)} />
        </svg>

        {#each processSteps as step, index (step.title)}
          {@const StepIcon = step.icon}
          <button
            bind:this={tabs[index]}
            id={`production-process-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={indicatorIndex === index}
            aria-controls="production-process-panel"
            tabindex={indicatorIndex === index ? 0 : -1}
            class:active={indicatorIndex === index}
            onclick={() => showStep(index)}
            onmouseenter={() => showStep(index)}
            onfocus={() => showStep(index)}
            onkeydown={(event) => handleTabKeydown(event, index)}
          >
            <div class="tab-label-group">
              <StepIcon class="tab-step-icon" aria-hidden="true" />
              <span>{$_(`home.processSteps.${index}.navTitle`) || step.navTitle}</span>
            </div>
            <i aria-hidden="true"></i>
          </button>
        {/each}

        <div
          class="active-step-indicator"
          style={`--active-step: ${indicatorIndex}; --step-count: ${processSteps.length};`}
          aria-hidden="true"
        >
          <i></i>
          <b>{String(indicatorIndex + 1).padStart(2, "0")}</b>
        </div>
      </div>
    </div>

    <!-- Workflow Intake & Formats Bar (Divider Removed) -->
    <div
      class="mt-3 sm:mt-4 flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs text-brand-dark/70 pt-1"
    >
      <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
        <span
          class="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-dark/50 mr-1"
        >
          Sharing Platforms:
        </span>
        <span
          class="rounded-full border border-brand-dark/12 bg-white/70 px-3 py-1 font-mono text-[0.6875rem] font-semibold text-brand-dark shadow-2xs"
          >Dropbox</span
        >
        <span
          class="rounded-full border border-brand-dark/12 bg-white/70 px-3 py-1 font-mono text-[0.6875rem] font-semibold text-brand-dark shadow-2xs"
          >Google Drive</span
        >
        <span
          class="rounded-full border border-brand-dark/12 bg-white/70 px-3 py-1 font-mono text-[0.6875rem] font-semibold text-brand-dark shadow-2xs"
          >WeTransfer</span
        >
        <span
          class="rounded-full border border-brand-dark/12 bg-white/70 px-3 py-1 font-mono text-[0.6875rem] font-semibold text-brand-dark shadow-2xs"
          >OneDrive</span
        >
        <span
          class="rounded-full border border-brand-dark/12 bg-white/70 px-3 py-1 font-mono text-[0.6875rem] font-semibold text-brand-dark shadow-2xs"
          >Private FTP</span
        >
      </div>

      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span
          class="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-brand-dark/50 mr-1"
        >
          Supported Formats:
        </span>
        <span
          class="rounded border border-brand-dark/12 bg-brand-dark/[0.04] px-2 py-0.5 font-mono text-[0.65rem] font-bold text-brand-dark"
          >RAW</span
        >
        <span
          class="rounded border border-brand-dark/12 bg-brand-dark/[0.04] px-2 py-0.5 font-mono text-[0.65rem] font-medium text-brand-dark/80"
          >PSD</span
        >
        <span
          class="rounded border border-brand-dark/12 bg-brand-dark/[0.04] px-2 py-0.5 font-mono text-[0.65rem] font-medium text-brand-dark/80"
          >TIFF</span
        >
        <span
          class="rounded border border-brand-dark/12 bg-brand-dark/[0.04] px-2 py-0.5 font-mono text-[0.65rem] font-medium text-brand-dark/80"
          >PNG</span
        >
        <span
          class="rounded border border-brand-dark/12 bg-brand-dark/[0.04] px-2 py-0.5 font-mono text-[0.65rem] font-medium text-brand-dark/80"
          >JPG</span
        >
        <span
          class="rounded border border-brand-dark/12 bg-brand-dark/[0.04] px-2 py-0.5 font-mono text-[0.65rem] font-medium text-brand-dark/80"
          >AI</span
        >
        <span
          class="rounded border border-brand-dark/12 bg-brand-dark/[0.04] px-2 py-0.5 font-mono text-[0.65rem] font-medium text-brand-dark/80"
          >PDF</span
        >
      </div>
    </div>
  </div>
</section>

<style>
  .process-section {
    position: relative;
  }

  .process-shell {
    position: relative;
    z-index: 1;
  }

  .process-stage {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: center;
    margin-bottom: clamp(1.5rem, 2.8vh, 2.5rem);
  }

  .process-editorial-block {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 40rem;
    text-align: left;
  }

  .process-intro {
    position: relative;
  }

  .process-watermark-num {
    position: absolute;
    top: -1.75rem;
    left: -0.5rem;
    font-family: var(--font-display);
    font-size: clamp(6.5rem, 10vw, 9.5rem);
    font-weight: 400;
    line-height: 1;
    color: color-mix(in srgb, var(--color-brand-dark) 8.5%, transparent);
    user-select: none;
    pointer-events: none;
    z-index: -1;
    letter-spacing: -0.05em;
  }

  .process-timing {
    position: relative;
  }

  .process-intro h2 {
    position: relative;
    max-width: 18ch;
    margin: 0.6rem 0 0;
    font-family: var(--font-display);
    font-size: clamp(2.15rem, 3.2vw, 3.1rem);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--color-brand-dark);
  }

  .process-desc {
    position: relative;
    max-width: 36rem;
    margin: 0.75rem 0 0;
    font-size: 0.975rem;
    line-height: 1.7;
    color: color-mix(in srgb, var(--color-brand-dark) 80%, transparent);
  }

  /* Clean Stage Highlights (No Dividers, Green Dots) */
  .process-highlights-list {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    margin-top: 1.35rem;
    padding: 0;
    list-style: none;
    max-width: 36rem;
  }

  .process-highlight-item {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .process-highlight-dot {
    width: 0.4375rem;
    height: 0.4375rem;
    border-radius: 9999px;
    background-color: var(--color-brand-green);
    flex-shrink: 0;
    transform: translateY(-0.1rem);
  }

  .process-highlight-text {
    font-size: 0.9375rem;
    line-height: 1.55;
    color: color-mix(in srgb, var(--color-brand-dark) 85%, transparent);
    font-weight: 400;
  }

  /* Right 4:5 Single Image Card */
  .process-image-card {
    position: relative;
    overflow: hidden;
    border-radius: 1.75rem;
    border: none !important;
    outline: none !important;
    aspect-ratio: 4 / 5;
    width: 100%;
    max-width: clamp(17.5rem, 23vw, 23.5rem);
    max-height: clamp(22rem, 43vh, 29rem);
    justify-self: end;
    background: var(--color-brand-mist);
    box-shadow: none !important;
    will-change: transform, opacity;
  }

  .process-image-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: none !important;
    outline: none !important;
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .process-image-card:hover img {
    transform: scale(1.035);
  }

  .process-image-caption {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    line-height: 1.2;
    color: #fff;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    opacity: 0;
    transition: opacity 300ms ease;
  }

  .process-image-card:hover .process-image-caption {
    opacity: 1;
  }

  @media (min-width: 768px) {
    .process-stage {
      grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
      gap: clamp(2.5rem, 5vw, 5rem);
      max-width: 75rem;
      margin-inline: auto;
      margin-bottom: clamp(1.5rem, 2.8vh, 2.5rem);
    }
  }

  @media (max-width: 767px) {
    .process-stage {
      margin-bottom: 2.5rem;
    }

    .process-editorial-block {
      max-width: 100%;
    }

    .process-image-card {
      max-width: 20rem;
      justify-self: center;
      border-radius: 1.25rem;
    }
  }

  .process-navigation {
    position: relative;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    overflow-x: auto;
    background: var(--color-brand-light);
    padding: 0.5rem 0 0.25rem;
    scrollbar-width: none;
  }

  .process-navigation::-webkit-scrollbar {
    display: none;
  }

  .process-tabs {
    position: relative;
    display: grid;
    width: calc(100% - 2rem);
    max-width: 92rem;
    min-width: 64rem;
    margin-inline: auto;
    grid-template-columns: repeat(var(--step-count, 7), minmax(0, 1fr));
  }

  .process-tabs button {
    position: relative;
    z-index: 1;
    min-height: 8.2rem;
    padding-inline: 0.35rem;
    color: color-mix(in srgb, var(--color-brand-dark) 75%, transparent);
    text-align: center;
    transition: color 240ms ease;
    cursor: pointer;
  }

  .process-tabs button:hover,
  .process-tabs button.active {
    color: var(--color-brand-dark);
  }

  .tab-label-group {
    position: absolute;
    top: 0.15rem;
    right: 0.25rem;
    left: 0.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
  }

  :global(.tab-step-icon) {
    width: 1.15rem;
    height: 1.15rem;
    opacity: 0.65;
    transition:
      opacity 240ms ease,
      transform 240ms ease;
  }

  .process-tabs button:hover :global(.tab-step-icon),
  .process-tabs button.active :global(.tab-step-icon) {
    opacity: 1;
    transform: translateY(-2px);
  }

  .tab-label-group > span {
    font-size: 0.74rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.2;
  }

  .process-tabs button.active .tab-label-group > span {
    font-weight: 600;
  }

  .process-timeline-line {
    position: absolute;
    right: 0;
    bottom: 1rem;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 3.5rem;
    overflow: visible;
    pointer-events: none;
  }

  .process-timeline-line path {
    fill: none;
    stroke: color-mix(in srgb, var(--color-brand-dark) 72%, transparent);
    stroke-width: 1.35;
    vector-effect: non-scaling-stroke;
  }

  .process-tabs button > i {
    position: absolute;
    bottom: 3.48rem;
    left: 50%;
    z-index: 2;
    display: block;
    width: 0.7rem;
    height: 0.7rem;
    transform: translateX(-50%);
    border: 1px solid var(--color-brand-dark);
    border-radius: 50%;
    background: var(--color-brand-light);
    transition:
      transform 280ms ease,
      opacity 180ms ease,
      background-color 280ms ease;
  }

  .process-tabs button.active > i {
    opacity: 0;
  }

  .active-step-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 3;
    width: calc(100% / var(--step-count, 7));
    height: 8.2rem;
    transform: translateX(calc(var(--active-step) * 100%));
    pointer-events: none;
    transition: transform 580ms cubic-bezier(0.65, 0, 0.35, 1);
    will-change: transform;
  }

  .active-step-indicator > i {
    position: absolute;
    bottom: 3.35rem;
    left: 50%;
    z-index: 2;
    width: 1rem;
    height: 1rem;
    transform: translateX(-50%);
    border-radius: 50%;
    background: var(--color-brand-dark);
  }

  .active-step-indicator > b {
    position: absolute;
    bottom: 0.1rem;
    left: 50%;
    z-index: 2;
    display: grid;
    width: 2rem;
    height: 2rem;
    place-items: center;
    border: 1px solid var(--color-brand-dark);
    border-radius: 50%;
    background: var(--color-brand-light);
    font-family: var(--font-mono);
    font-size: 0.58rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    transform: translateX(-50%) translateY(0.15rem);
    color: var(--color-brand-dark);
  }

  .process-tabs button:focus-visible {
    border-radius: 0.5rem;
    outline: 2px solid var(--color-brand-green);
    outline-offset: 0.25rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .process-stage,
    .process-editorial-block,
    .process-image-card,
    .process-tabs > * {
      transform: none !important;
      opacity: 1 !important;
    }

    .process-image-card img,
    .process-tabs button,
    .process-tabs button > i,
    .active-step-indicator {
      transition: none;
    }
  }
</style>
