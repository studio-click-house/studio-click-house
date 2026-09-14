<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { scrollToTarget } from "$lib/animations/lenis";
  import type { AboutPageData, AboutStat } from "$lib/types/about";
  import { _ } from "svelte-i18n";

  let { hero } = $props<{ hero: AboutPageData["hero"] }>();

  let sectionRef: HTMLElement;
  let statsRef: HTMLElement;

  // Track stat values for display
  let displayedStats = $state<{ value: number; suffix: string }[]>([]);

  function handleScrollToVideo(e: MouseEvent) {
    e.preventDefault();
    scrollToTarget("#about-studio-video", { offset: -40 });
  }

  onMount(() => {
    displayedStats = hero.stats.map((s: AboutStat) => ({
      value: 0,
      suffix: s.suffix,
    }));
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionRef) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          // Editorial copy reveal
          gsap.from(".hero-editorial-item", {
            autoAlpha: 0,
            y: 28,
            duration: 0.95,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.1,
            clearProps: "all",
          });

          // Photographic collage entrance
          gsap.from(".hero-photo-primary", {
            autoAlpha: 0,
            scale: 0.94,
            duration: 1.1,
            ease: "power3.out",
            delay: 0.25,
            clearProps: "all",
          });

          gsap.from(".hero-photo-card", {
            autoAlpha: 0,
            y: 36,
            duration: 0.9,
            stagger: 0.15,
            ease: "power2.out",
            delay: 0.45,
            clearProps: "all",
          });

          // Counter animation
          if (statsRef) {
            gsap.to(
              {},
              {
                scrollTrigger: {
                  trigger: statsRef,
                  start: "top 95%",
                  once: true,
                },
                duration: 1.8,
                ease: "power2.out",
                onUpdate: function () {
                  const progress = this.progress();
                  displayedStats = hero.stats.map((s: AboutStat) => ({
                    value: Math.floor(s.value * progress),
                    suffix: s.suffix,
                  }));
                },
                onComplete: () => {
                  displayedStats = hero.stats.map((s: AboutStat) => ({
                    value: s.value,
                    suffix: s.suffix,
                  }));
                },
              },
            );
          }
        });

        media.add("(prefers-reduced-motion: reduce)", () => {
          displayedStats = hero.stats.map((s: AboutStat) => ({
            value: s.value,
            suffix: s.suffix,
          }));
        });
      }, sectionRef);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="about-hero"
  aria-label="About Studio Click House Hero"
  bind:this={sectionRef}
  class="relative min-h-[90dvh] lg:min-h-dvh overflow-hidden bg-brand-light pt-28 text-brand-dark sm:pt-32 lg:pt-36 flex flex-col justify-between"
>
  <div class="site-shell relative z-10 my-auto pb-12 sm:pb-16">
    <div class="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
      <!-- Left Column: Editorial Copy & Studio Statement -->
      <div class="lg:col-span-5">
        <span
          class="hero-editorial-item font-mono text-xs uppercase tracking-[0.22em] text-brand-green font-medium mb-4 block"
        >
          Studio Collective &middot; Dhaka, Bangladesh
        </span>

        <h1
          class="hero-editorial-item font-display text-[clamp(2.75rem,5.2vw,5.5rem)] font-normal leading-[0.92] tracking-tight text-brand-dark"
        >
          <span class="block italic text-brand-dark/60 font-normal">
            {$_('about.hero.headingLine1') || hero.headingLine1}
          </span>
          <span>
            {$_('about.hero.headingLine2') || hero.headingLine2}.
          </span>
        </h1>

        <p
          class="hero-editorial-item mt-6 max-w-md text-base leading-relaxed text-brand-dark/75 sm:text-lg"
        >
          {$_('about.hero.positioning') || hero.positioning}
        </p>

        <!-- Clean Action Buttons (Matches EventsHero & PricingHero) -->
        <div class="hero-editorial-item mt-8 flex flex-wrap items-center gap-3.5">
          <a
            href="#about-studio-video"
            onclick={handleScrollToVideo}
            class="rounded-lg bg-brand-green px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-dark shadow-xs transition-all hover:bg-brand-dark hover:text-white cursor-pointer"
          >
            Watch Studio Film
          </a>
          <a
            href="#team-collective"
            class="rounded-lg border border-brand-dark/20 bg-white/80 px-6 py-3 font-mono text-xs uppercase tracking-wider text-brand-dark transition-all hover:border-brand-dark hover:bg-white"
          >
            Meet The Collective
          </a>
        </div>

        <!-- Integrated Stat Numbers (Matches PricingHero) -->
        <div
          bind:this={statsRef}
          class="hero-editorial-item mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-brand-dark/15 pt-6 sm:mt-12 sm:gap-6"
        >
          {#each hero.stats as stat, i (stat.label)}
            <div>
              <div
                class="font-display text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl lg:text-4xl"
              >
                <span>{displayedStats[i]?.value ?? stat.value}</span><span
                  class="text-brand-green">{stat.suffix}</span
                >
              </div>
              <div
                class="mt-1 font-mono text-[0.62rem] font-medium uppercase tracking-wider text-brand-dark/60 sm:text-[0.68rem]"
              >
                {$_(`about.hero.stats.${i}.label`) || stat.label}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Right Column: Natural Photographic Studio Collage (Matches EventsHero pattern) -->
      <div
        class="relative min-h-[26rem] sm:min-h-[34rem] lg:col-span-7 lg:min-h-[38rem]"
      >
        <!-- Primary Master Frame: Full Collective Celebration -->
        <figure
          class="hero-photo-primary absolute right-0 top-0 w-[88%] overflow-hidden rounded-2xl border border-brand-dark/10 bg-white p-2 shadow-xl"
        >
          <div class="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-brand-dark/5">
            <img
              src="/images/about/team/studio-click-house-team-01.jpg"
              alt="Studio Click House team collective"
              width="1200"
              height="825"
              fetchpriority="high"
              class="size-full object-cover"
            />
          </div>
        </figure>

        <!-- Secondary Photo Still: Production Floor & Workstations -->
        <figure
          class="hero-photo-card absolute bottom-[8%] left-0 w-[46%] -rotate-2 overflow-hidden rounded-xl border border-brand-dark/12 bg-white p-2 shadow-2xl transition-transform duration-500 hover:rotate-0 hover:scale-105 z-20"
        >
          <div class="aspect-[4/3] w-full overflow-hidden rounded-lg bg-brand-dark/5">
            <img
              src="/images/about/team/studio-click-house-team-02.jpg"
              alt="Studio Click House production floor workstations"
              width="640"
              height="480"
              class="size-full object-cover"
            />
          </div>
          <p class="mt-2 text-center font-mono text-[0.62rem] text-brand-dark/70 uppercase tracking-wider">
            Dhaka Production Floor
          </p>
        </figure>

        <!-- Tertiary Photo Still: Color Grading Suite -->
        <figure
          class="hero-photo-card absolute -bottom-2 right-[8%] w-[40%] rotate-2 overflow-hidden rounded-xl border border-brand-dark/12 bg-white p-2 shadow-2xl transition-transform duration-500 hover:rotate-0 hover:scale-105 z-20"
        >
          <div class="aspect-[4/3] w-full overflow-hidden rounded-lg bg-brand-dark/5">
            <img
              src="/images/about/team/studio-click-house-team-03.jpg"
              alt="Studio Click House color grading suite"
              width="600"
              height="450"
              class="size-full object-cover"
            />
          </div>
          <p class="mt-2 text-center font-mono text-[0.62rem] text-brand-dark/70 uppercase tracking-wider">
            Color Grading Suite
          </p>
        </figure>
      </div>
    </div>
  </div>
</section>
