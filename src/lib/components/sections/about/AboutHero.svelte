<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData, AboutStat } from "$lib/types/about";

  let { hero } = $props<{ hero: AboutPageData["hero"] }>();

  let sectionRef: HTMLElement;
  let bannerRef: HTMLElement;
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
          // Hero title & positioning text entrance
          gsap.fromTo(
            ".hero-animate-text",
            { autoAlpha: 0, y: 36 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
            },
          );

          // Counter animation on viewport scroll trigger
          if (statsRef) {
            gsap.to(
              {},
              {
                scrollTrigger: {
                  trigger: statsRef,
                  start: "top 88%",
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

          // Banner reveal animation
          if (bannerRef) {
            gsap.fromTo(
              bannerRef,
              {
                autoAlpha: 0.3,
                scale: 0.96,
                clipPath: "inset(6% 4% 6% 4% round 1.5rem)",
              },
              {
                scrollTrigger: {
                  trigger: bannerRef,
                  start: "top 85%",
                  end: "top 25%",
                  scrub: 0.8,
                },
                autoAlpha: 1,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0% round 1rem)",
                ease: "none",
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
  class="section-space relative overflow-hidden pt-28 md:pt-36"
>
  <div class="site-shell">
    <div
      class="grid gap-10 border-t border-brand-dark/25 pt-5 lg:grid-cols-12 lg:gap-12"
    >
      <div class="hero-animate-text lg:col-span-3">
        <p class="eyebrow flex items-center gap-3 text-brand-dark/70">
          <span class="h-px w-8 bg-brand-green"></span>
          {hero.eyebrow}
        </p>
      </div>

      <div class="lg:col-span-9">
        <h1
          class="hero-animate-text mb-8 font-display text-[clamp(4.25rem,9.2vw,10.5rem)] leading-[0.78] tracking-[-0.06em]"
        >
          <span
            class="block text-[0.42em] font-normal italic leading-none text-brand-dark/48"
          >
            {hero.headingLine1}
          </span>
          <span class="block max-w-[9ch] text-brand-dark"
            >{hero.headingLine2}</span
          >
        </h1>

        <p
          class="hero-animate-text ml-auto max-w-3xl text-lg leading-relaxed text-brand-dark/75 md:text-2xl"
        >
          {hero.positioning}
        </p>
      </div>
    </div>

    <div
      bind:this={statsRef}
      class="hero-animate-text mt-14 grid gap-0 border-y border-brand-dark/20 sm:grid-cols-3 md:mt-20"
    >
      {#each hero.stats as stat, i (stat.label)}
        <div
          class="flex flex-col border-b border-brand-dark/20 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0 md:py-7"
        >
          <div
            class="mb-2 font-display text-4xl tracking-[-0.04em] text-brand-dark md:text-6xl"
          >
            <span>{displayedStats[i]?.value ?? stat.value}</span><span
              class="text-brand-green">{stat.suffix}</span
            >
          </div>
          <div class="text-sm font-semibold text-brand-dark/90">
            {stat.label}
          </div>
          <div
            class="mt-1 max-w-[15rem] text-xs leading-relaxed text-brand-dark/58"
          >
            {stat.sublabel}
          </div>
        </div>
      {/each}
    </div>

    <div
      bind:this={bannerRef}
      class="relative mt-10 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-paper sm:aspect-[16/9] md:mt-14 md:aspect-[21/9]"
    >
      <img
        src={hero.bannerMedia.src}
        alt={hero.bannerMedia.alt}
        width={hero.bannerMedia.width}
        height={hero.bannerMedia.height}
        loading="eager"
        decoding="async"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent"
      ></div>
      <div
        class="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/25 px-4 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-white/85 md:px-6"
      >
        <span>{hero.bannerMedia.credit}</span>
        <span>Dhaka, Bangladesh</span>
      </div>
    </div>
  </div>
</section>
