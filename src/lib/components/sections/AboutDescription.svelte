<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpRight, Users, Clock, ShieldCheck, Globe } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";

  let section: HTMLElement;
  let copyBlock: HTMLElement;
  let highlightsBlock: HTMLElement;

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !copyBlock || !highlightsBlock) return;

      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            ".desc-title-line > span",
            { yPercent: 100, rotate: 1.2 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 88%",
                once: true,
              },
            }
          );

          gsap.fromTo(
            ".desc-story-item",
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                once: true,
              },
            }
          );

          gsap.fromTo(
            ".desc-stat-card",
            { autoAlpha: 0, y: 24, scale: 0.97 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                once: true,
              },
            }
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
  id="about-description"
  bind:this={section}
  aria-labelledby="about-description-title"
  class="relative overflow-hidden bg-brand-light pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-12 lg:pb-14 text-brand-dark"
>
  <div class="site-shell relative z-10">
    <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
      
      <!-- Left Column: Stylish Editorial Heading & Studio Story -->
      <div bind:this={copyBlock} class="lg:col-span-7">
        
        <!-- Display Headline with Mixed Editorial Typography -->
        <h2
          id="about-description-title"
          class="font-display text-[clamp(2.5rem,4.4vw,4.8rem)] leading-[0.92] tracking-[-0.04em]"
        >
          <span class="desc-title-line block overflow-hidden pb-1">
            <span class="block will-change-transform">About Us</span>
          </span>
          <span class="desc-title-line block overflow-hidden pb-1">
            <span class="block will-change-transform">
              <em class="font-display italic font-normal text-brand-green">Studio Click House.</em>
            </span>
          </span>
        </h2>

        <!-- Story Copy -->
        <div class="mt-6 space-y-4 max-w-xl">
          <p class="desc-story-item font-sans text-base leading-[1.55] font-normal text-brand-dark/90 sm:text-[1.15rem] sm:leading-[1.5]">
            {$_('home.aboutDescription.paragraph1') || 'Studio Click House is an international visual post-production house serving world-class photographers, global fashion brands, e-commerce retailers, and creative agencies.'}
          </p>
          
          <p class="desc-story-item text-xs leading-relaxed text-brand-dark/65 sm:text-sm font-sans">
            {$_('home.aboutDescription.paragraph2') || 'We specialize in editorial image retouching, video color grading, and photorealistic 3D CGI rendering. Combining meticulous human artistry with an overnight 24/7 production pipeline, our studio ensures every frame meets uncompromising creative and commercial standards.'}
          </p>
        </div>

        <!-- Action CTAs -->
        <div class="desc-story-item about-actions">
          <a
            href={resolve("/about")}
            class="about-action about-action-primary"
          >
            <span>{$_('home.aboutDescription.aboutStudio') || 'About the studio'}</span>
            <ArrowUpRight size={15} strokeWidth={1.7} />
          </a>

          <a
            href={resolve("/contact")}
            class="about-action about-action-secondary"
          >
            <span>{$_('home.aboutDescription.freeTrial') || 'Start Free Trial'}</span>
            <ArrowUpRight size={15} strokeWidth={1.7} />
          </a>
        </div>
      </div>

      <!-- Right Column: 4 Architecture-Themed Studio Location Cards -->
      <div bind:this={highlightsBlock} class="lg:col-span-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
          
          <!-- Card 1: Dhaka Production Atelier -->
          <div
            class="desc-stat-card group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-brand-dark/10 bg-white p-5 shadow-xs transition-all duration-300 hover:border-brand-dark/30 hover:shadow-md"
          >
            <!-- Top bar: Icon Badge + Monospace Tag -->
            <div class="relative z-10 flex items-center gap-2.5">
              <div class="grid h-8 w-8 place-items-center rounded-lg border border-brand-dark/10 bg-brand-light text-brand-dark/70 transition-colors duration-200 group-hover:border-brand-green/30 group-hover:text-brand-green">
                <Users size={15} strokeWidth={1.75} />
              </div>
              <span class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-brand-dark/50">
                {$_('home.aboutDescription.atelierTags.0') || 'ATELIER 01'}
              </span>
            </div>

            <!-- Content -->
            <div class="relative z-10 mt-4">
              <span class="font-display text-3xl font-bold tracking-tight text-brand-dark group-hover:text-brand-green transition-colors duration-200">
                {$_('home.aboutDescription.stats.0.value') || '150+'}
              </span>
              <h3 class="mt-1 font-sans text-xs sm:text-[0.82rem] font-semibold tracking-tight text-brand-dark">
                {$_('home.aboutDescription.stats.0.label') || 'Senior Specialists'}
              </h3>
              <p class="mt-0.5 text-[0.7rem] text-brand-dark/60 font-sans leading-tight">
                {$_('home.aboutDescription.stats.0.sub') || 'Dedicated in-house retouchers & 3D artists'}
              </p>
            </div>

            <!-- Architectural Art 1: Dhaka Studio Atelier HQ Silhouette -->
            <div class="pointer-events-none absolute right-1.5 bottom-0 opacity-15 transition-all duration-300 group-hover:opacity-35 group-hover:text-brand-green" aria-hidden="true">
              <svg width="155" height="50" viewBox="0 0 165 50" fill="none" stroke="currentColor" class="text-brand-dark group-hover:text-brand-green transition-colors duration-300">
                <path d="M5 50V32h14V18h16v32h10V10h18v40h12V22h16v28h12V14h18v36h12V28h15v22h8" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>

          <!-- Card 2: London European Hub Skyline -->
          <div
            class="desc-stat-card group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-brand-dark/10 bg-white p-5 shadow-xs transition-all duration-300 hover:border-brand-dark/30 hover:shadow-md"
          >
            <!-- Top bar: Icon Badge + Monospace Tag -->
            <div class="relative z-10 flex items-center gap-2.5">
              <div class="grid h-8 w-8 place-items-center rounded-lg border border-brand-dark/10 bg-brand-light text-brand-dark/70 transition-colors duration-200 group-hover:border-brand-green/30 group-hover:text-brand-green">
                <Clock size={15} strokeWidth={1.75} />
              </div>
              <span class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-brand-dark/50">
                {$_('home.aboutDescription.atelierTags.1') || 'CONTINUOUS'}
              </span>
            </div>

            <!-- Content -->
            <div class="relative z-10 mt-4">
              <span class="font-display text-3xl font-bold tracking-tight text-brand-dark group-hover:text-brand-green transition-colors duration-200">
                {$_('home.aboutDescription.stats.1.value') || '24/7'}
              </span>
              <h3 class="mt-1 font-sans text-xs sm:text-[0.82rem] font-semibold tracking-tight text-brand-dark">
                {$_('home.aboutDescription.stats.1.label') || 'Global Production'}
              </h3>
              <p class="mt-0.5 text-[0.7rem] text-brand-dark/60 font-sans leading-tight">
                {$_('home.aboutDescription.stats.1.sub') || 'Continuous worldwide overnight turnaround'}
              </p>
            </div>

            <!-- Architectural Art 2: London Landmark Skyline Silhouette -->
            <div class="pointer-events-none absolute right-1.5 bottom-0 opacity-15 transition-all duration-300 group-hover:opacity-35 group-hover:text-brand-green" aria-hidden="true">
              <svg width="155" height="50" viewBox="0 0 165 50" fill="none" stroke="currentColor" class="text-brand-dark group-hover:text-brand-green transition-colors duration-300">
                <path d="M5 50V40h10V26h8v24h8V12h8l2-6 2 6h8v38h12V20h14v30h10V30h14v20h10V16h16v34h12" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>

          <!-- Card 3: Stockholm Nordic Hub Skyline -->
          <div
            class="desc-stat-card group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-brand-dark/10 bg-white p-5 shadow-xs transition-all duration-300 hover:border-brand-dark/30 hover:shadow-md"
          >
            <!-- Top bar: Icon Badge + Monospace Tag -->
            <div class="relative z-10 flex items-center gap-2.5">
              <div class="grid h-8 w-8 place-items-center rounded-lg border border-brand-dark/10 bg-brand-light text-brand-dark/70 transition-colors duration-200 group-hover:border-brand-green/30 group-hover:text-brand-green">
                <ShieldCheck size={15} strokeWidth={1.75} />
              </div>
              <span class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-brand-dark/50">
                {$_('home.aboutDescription.atelierTags.2') || '3-TIER QC'}
              </span>
            </div>

            <!-- Content -->
            <div class="relative z-10 mt-4">
              <span class="font-display text-3xl font-bold tracking-tight text-brand-dark group-hover:text-brand-green transition-colors duration-200">
                {$_('home.aboutDescription.stats.2.value') || '99.8%'}
              </span>
              <h3 class="mt-1 font-sans text-xs sm:text-[0.82rem] font-semibold tracking-tight text-brand-dark">
                {$_('home.aboutDescription.stats.2.label') || 'QC Accuracy'}
              </h3>
              <p class="mt-0.5 text-[0.7rem] text-brand-dark/60 font-sans leading-tight">
                {$_('home.aboutDescription.stats.2.sub') || 'Three-tier precision inspection system'}
              </p>
            </div>

            <!-- Architectural Art 3: Stockholm City Hall & Spire Silhouette -->
            <div class="pointer-events-none absolute right-1.5 bottom-0 opacity-15 transition-all duration-300 group-hover:opacity-35 group-hover:text-brand-green" aria-hidden="true">
              <svg width="155" height="50" viewBox="0 0 165 50" fill="none" stroke="currentColor" class="text-brand-dark group-hover:text-brand-green transition-colors duration-300">
                <path d="M5 50V34h12V22h14v28h8V8l3-6 3 6v42h12V24h15v26h10V14h14v36h12V34h14v16h12" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>

          <!-- Card 4: Sydney APAC Hub Skyline -->
          <div
            class="desc-stat-card group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-brand-dark/10 bg-white p-5 shadow-xs transition-all duration-300 hover:border-brand-dark/30 hover:shadow-md"
          >
            <!-- Top bar: Icon Badge + Monospace Tag -->
            <div class="relative z-10 flex items-center gap-2.5">
              <div class="grid h-8 w-8 place-items-center rounded-lg border border-brand-dark/10 bg-brand-light text-brand-dark/70 transition-colors duration-200 group-hover:border-brand-green/30 group-hover:text-brand-green">
                <Globe size={15} strokeWidth={1.75} />
              </div>
              <span class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-brand-dark/50">
                {$_('home.aboutDescription.atelierTags.3') || 'WORLDWIDE'}
              </span>
            </div>

            <!-- Content -->
            <div class="relative z-10 mt-4">
              <span class="font-display text-3xl font-bold tracking-tight text-brand-dark group-hover:text-brand-green transition-colors duration-200">
                {$_('home.aboutDescription.stats.3.value') || '20+'}
              </span>
              <h3 class="mt-1 font-sans text-xs sm:text-[0.82rem] font-semibold tracking-tight text-brand-dark">
                {$_('home.aboutDescription.stats.3.label') || 'Countries Served'}
              </h3>
              <p class="mt-0.5 text-[0.7rem] text-brand-dark/60 font-sans leading-tight">
                {$_('home.aboutDescription.stats.3.sub') || 'Trusted by international luxury brands'}
              </p>
            </div>

            <!-- Architectural Art 4: Sydney Harbour & Opera Architectural Silhouette -->
            <div class="pointer-events-none absolute right-1.5 bottom-0 opacity-15 transition-all duration-300 group-hover:opacity-35 group-hover:text-brand-green" aria-hidden="true">
              <svg width="155" height="50" viewBox="0 0 165 50" fill="none" stroke="currentColor" class="text-brand-dark group-hover:text-brand-green transition-colors duration-300">
                <path d="M5 50V40h10c4-12 12-22 22-22v22h8c4-16 14-26 26-26v26h8c3-10 10-18 18-18v18h10V28h14v22h14" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .desc-title-line {
    display: block;
    overflow: hidden;
  }

  .desc-stat-card {
    opacity: 1;
    visibility: visible;
    min-height: 9.25rem;
  }

  .about-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .about-action {
    display: inline-flex;
    min-height: 3rem;
    min-width: 10.5rem;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-inline: 1rem;
    border: 1px solid var(--color-brand-dark);
    border-radius: 0.55rem;
    font-family: var(--font-sans);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.045em;
    text-transform: uppercase;
    transition:
      color 280ms ease,
      background 280ms ease,
      border-color 280ms ease,
      transform 280ms ease;
  }

  .about-action :global(svg) {
    transition: transform 280ms ease;
  }

  .about-action:hover :global(svg) {
    transform: translate(0.15rem, -0.15rem);
  }

  .about-action:active {
    transform: scale(0.98);
  }

  .about-action:focus-visible {
    outline: 3px solid var(--color-brand-green);
    outline-offset: 3px;
  }

  .about-action-primary {
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
  }

  .about-action-primary:hover {
    border-color: var(--color-brand-green);
    background: var(--color-brand-green);
    color: var(--color-brand-dark);
  }

  .about-action-secondary {
    background: color-mix(in srgb, var(--color-brand-paper) 72%, transparent);
    color: var(--color-brand-dark);
  }

  .about-action-secondary:hover {
    border-color: var(--color-brand-green);
    background: var(--color-brand-green);
  }

  @media (prefers-reduced-motion: reduce) {
    .desc-title-line > span,
    .desc-stat-card,
    .desc-story-item {
      will-change: auto;
    }
  }
</style>
