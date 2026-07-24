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
          // Editorial typography split line mask reveal
          gsap.from(".hero-line-inner", {
            yPercent: 115,
            rotation: 2.2,
            duration: 1.15,
            stagger: 0.12,
            ease: "power4.out",
            delay: 0.1,
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

          // Banner reveal animation with scrub
          if (bannerRef) {
            gsap.fromTo(
              bannerRef,
              {
                autoAlpha: 0.4,
                scale: 0.96,
                clipPath: "inset(5% 3% 5% 3% round 1.5rem)",
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
  <!-- Hero Background Image & Gradient Mesh Layer -->
  <div class="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
    <img
      src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=2200"
      alt=""
      class="h-full w-full object-cover opacity-35 md:opacity-45"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-brand-light via-brand-light/70 to-brand-light/35"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-brand-light via-brand-light/60 to-transparent"></div>
  </div>

  <!-- Background Layout Grid Lines (Subtle Editorial Depth) -->
  <div class="pointer-events-none absolute inset-0 select-none opacity-20" aria-hidden="true">
    <div class="site-shell h-full border-x border-brand-dark/10">
      <div class="grid h-full grid-cols-12">
        <div class="border-r border-brand-dark/10 col-span-3"></div>
        <div class="border-r border-brand-dark/10 col-span-6"></div>
      </div>
    </div>
  </div>

  <div class="site-shell relative z-10">
    <div class="pt-5">
      <div>
        <h1
          class="mb-8 font-display text-[clamp(4.25rem,9.2vw,10.5rem)] leading-[0.78] tracking-[-0.06em]"
        >
          <span class="block overflow-hidden pb-2">
            <span
              class="hero-line-inner block text-[0.42em] font-normal italic leading-none text-brand-dark/48"
            >
              {hero.headingLine1}
            </span>
          </span>
          <span class="block overflow-hidden">
            <span class="hero-line-inner block max-w-[9ch] text-brand-dark"
              >{hero.headingLine2}</span
            >
          </span>
        </h1>

        <p
          class="hero-description-reveal ml-auto max-w-3xl text-lg leading-relaxed text-brand-dark/75 md:text-2xl"
        >
          {hero.positioning}
        </p>
      </div>
    </div>

    <!-- Stat Counter Grid -->
    <div
      bind:this={statsRef}
      class="hero-stats-bar mt-14 grid gap-0 border-y border-brand-dark/20 sm:grid-cols-3 md:mt-20"
    >
      {#each hero.stats as stat, i (stat.label)}
        <div
          class="group relative flex flex-col border-b border-brand-dark/20 py-5 transition-colors duration-300 hover:bg-brand-dark/[0.02] last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0 md:py-7"
        >
          <div
            class="mb-2 font-display text-4xl tracking-[-0.04em] text-brand-dark transition-colors duration-300 group-hover:text-brand-green md:text-6xl"
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

    <!-- Widescreen Video Banner Frame -->
    <div
      bind:this={bannerRef}
      class="relative mt-8 aspect-[2.35/1] w-full overflow-hidden rounded-2xl bg-brand-dark border border-brand-dark/10 shadow-2xl md:mt-12"
    >
      <iframe
        class="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[118%] -translate-x-1/2 -translate-y-1/2 scale-[1.06]"
        src="https://www.youtube-nocookie.com/embed/9_M5BgsK7MI?autoplay=1&mute=1&loop=1&playlist=9_M5BgsK7MI&controls=0&rel=0&modestbranding=1&playsinline=1&vq=hd1080"
        title="Studio Click House Workspace Video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</section>
