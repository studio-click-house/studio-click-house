<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData, AboutStat } from "$lib/types/about";
  import { _ } from "svelte-i18n";

  let { hero } = $props<{ hero: AboutPageData["hero"] }>();

  let sectionRef: HTMLElement;
  let statsRef: HTMLElement;

  // Track stat values for display
  let displayedStats = $state<{ value: number; suffix: string }[]>([]);

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
          // Editorial typography split line mask reveal
          gsap.from(".hero-line-inner", {
            yPercent: 115,
            rotation: 2.2,
            duration: 1.15,
            stagger: 0.12,
            ease: "power4.out",
            delay: 0.1,
            clearProps: "all",
          });

          // Positioning description text
          gsap.fromTo(
            ".hero-description-reveal",
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              delay: 0.45,
              clearProps: "all",
            },
          );

          // Counter animation on viewport scroll trigger
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
  class="relative min-h-[100dvh] overflow-hidden bg-brand-light"
>
  <!-- Hero Background Image & Gradient Mesh Layer (visible studio photo) -->
  <div class="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
    <img
      src="/images/about/team/studio-click-house-team-02.jpg"
      alt="Studio Click House production floor background"
      class="h-full w-full object-cover opacity-45 md:opacity-55 transition-opacity duration-700"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-brand-light via-brand-light/60 to-brand-light/30"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-brand-light/95 via-brand-light/70 to-brand-light/30"></div>
  </div>

  <!-- Hero Shell: Same min-h-[100dvh] full viewport height as HomeHero & ServicesHero, with perfect site-shell alignment -->
  <div class="site-shell relative z-10 flex min-h-[100dvh] flex-col justify-between pt-28 pb-6 sm:pt-32 sm:pb-8 md:pt-36 md:pb-10 lg:pt-40 lg:pb-12">
    <!-- Top Content Block: bold increased typography -->
    <div class="max-w-4xl pt-2 sm:pt-4">
      <h1
        class="font-display text-[clamp(3rem,7.5vw,9rem)] leading-[0.86] tracking-[-0.05em]"
      >
        <span class="block overflow-hidden pt-2 pb-1">
          <span
            class="hero-line-inner block text-[0.40em] font-normal italic leading-none text-brand-dark/65"
          >
            {$_('about.hero.headingLine1') || hero.headingLine1}
          </span>
        </span>
        <span class="block overflow-hidden pt-1 pb-1">
          <span class="hero-line-inner block text-brand-dark"
            >{$_('about.hero.headingLine2') || hero.headingLine2}</span
          >
        </span>
      </h1>

      <p
        class="hero-description-reveal mt-5 max-w-2xl text-base leading-relaxed text-brand-dark/80 sm:mt-6 sm:text-lg md:text-xl"
      >
        {$_('about.hero.positioning') || hero.positioning}
      </p>
    </div>

    <!-- Stat Counter Grid: Anchored to the very bottom of the 100dvh viewport, completely hiding the video below the fold -->
    <div
      bind:this={statsRef}
      class="hero-stats-bar mt-auto grid gap-0 border-y border-brand-dark/20 sm:grid-cols-3 bg-brand-light/60 backdrop-blur-sm"
    >
      {#each hero.stats as stat, i (stat.label)}
        <div
          class="group relative flex flex-col border-b border-brand-dark/20 py-4 transition-colors duration-300 hover:bg-brand-dark/[0.03] last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0 md:py-6"
        >
          <div
            class="mb-1 font-display text-3xl tracking-[-0.04em] text-brand-dark transition-colors duration-300 group-hover:text-brand-green sm:text-4xl md:text-5xl lg:text-6xl"
          >
            <span>{displayedStats[i]?.value ?? stat.value}</span><span
              class="text-brand-green">{stat.suffix}</span
            >
          </div>
          <div class="text-sm font-semibold text-brand-dark/95">
            {$_(`about.hero.stats.${i}.label`) || stat.label}
          </div>
          <div
            class="mt-0.5 max-w-[16rem] text-xs leading-relaxed text-brand-dark/65"
          >
            {$_(`about.hero.stats.${i}.sublabel`) || stat.sublabel}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
