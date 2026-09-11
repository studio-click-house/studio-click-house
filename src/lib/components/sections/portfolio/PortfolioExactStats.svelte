<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { _ } from "svelte-i18n";

  let statsSection = $state<HTMLElement | null>(null);

  const metrics = [
    { value: "5M+", label: "Assets Delivered" },
    { value: "150+", label: "Digital Artists" },
    { value: "10+", label: "Years of Craft" },
    { value: "99.8%", label: "On-Time SLA" },
  ];

  $effect(() => {
    if (!statsSection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !statsSection) return;
      const { gsap } = runtime;
      const root = statsSection;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add(
          {
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          (ctx) => {
            const { isDesktop, isTablet, isMobile, reduceMotion } = ctx.conditions!;
            const metricItems = root.querySelectorAll(".metric-anim-item");
            const ctaCard = root.querySelector(".cta-anim-card");

            if (reduceMotion) {
              gsap.set([...metricItems, ctaCard].filter(Boolean), { autoAlpha: 1, y: 0 });
              return;
            }

            const yOffset = isDesktop ? 34 : isTablet ? 26 : 38;
            const duration = isDesktop ? 0.85 : isTablet ? 0.75 : 0.75;
            const stagger = isDesktop ? 0.08 : isTablet ? 0.06 : 0.08;
            const startTrigger = isDesktop ? "top 80%" : isTablet ? "top 80%" : "top 78%";

            gsap.from(metricItems, {
              y: yOffset,
              autoAlpha: 0,
              duration,
              stagger,
              ease: isDesktop ? "power3.out" : "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: root.querySelector(".metrics-grid"),
                start: startTrigger,
                toggleActions: "play none none reverse",
              },
            });

            if (ctaCard) {
              gsap.from(ctaCard, {
                y: yOffset,
                autoAlpha: 0,
                duration: duration + 0.1,
                ease: isDesktop ? "power3.out" : "power2.out",
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: ctaCard,
                  start: isDesktop ? "top 82%" : isTablet ? "top 82%" : "top 80%",
                  toggleActions: "play none none reverse",
                },
              });
            }
          }
        );
        return () => media.revert();
      }, root);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="portfolio-glance-stats"
  bind:this={statsSection}
  aria-label="Studio at a Glance Statistics"
  class="relative w-full bg-brand-light py-20 lg:py-32 overflow-hidden"
>
  <div class="site-shell max-w-5xl mx-auto flex flex-col items-center text-center">
    <!-- Centered Eyebrow -->
    <span class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-green mb-10 block">
      {$_('portfolio.stats.eyebrow') || 'Verified Studio Metrics'}
    </span>

    <!-- 4 Real Authentic Metrics in a Clean Editorial Grid -->
    <div
      class="metrics-grid grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full mb-16 sm:mb-20 pb-8"
    >
      {#each metrics as m (m.label)}
        <div class="metric-anim-item flex flex-col items-center">
          <div class="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-brand-dark leading-none tracking-tight">
            {m.value}
          </div>
          <span class="font-mono text-xs uppercase tracking-wider text-brand-dark/60 mt-3 font-medium">
            {m.label}
          </span>
        </div>
      {/each}
    </div>

    <!-- Luxury Studio Conversion CTA (Closing Moment) -->
    <div class="cta-anim-card max-w-3xl flex flex-col items-center w-full px-2">
      <h2 class="font-display text-3xl sm:text-5xl lg:text-6xl font-normal text-brand-dark leading-[1.08] tracking-tight mb-6">
        {$_('portfolio.stats.ctaHeading') || 'Ready to see what we can do for your brand?'}
      </h2>

      <p class="text-sm sm:text-base text-brand-dark/75 leading-relaxed font-normal max-w-xl mb-10">
        {$_('portfolio.stats.ctaDesc') || 'Send us a test image or video clip. Experience our overnight turnaround, pixel precision, and dedicated project management firsthand.'}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <a
          href={resolve('/contact')}
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green px-6 sm:px-8 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-brand-green/90 transition-all hover:scale-105 active:scale-95 text-center"
        >
          <span>{$_('portfolio.stats.ctaButton') || 'Request Free Test Retouch'}</span>
          <ArrowUpRight class="size-4 shrink-0" />
        </a>

        <a
          href={resolve('/services')}
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-brand-dark/20 bg-white px-6 sm:px-8 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-brand-dark hover:border-brand-dark transition-all hover:bg-brand-dark/5 text-center"
        >
          <span>Explore Services</span>
        </a>
      </div>
    </div>
  </div>
</section>
