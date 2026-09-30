<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";

  let partnersSection = $state<HTMLElement | null>(null);

  const partners = [
    { name: "White Fox", src: "/images/clients/white_fox_logo.png", category: "Global Fashion" },
    { name: "Carla Zampatti", src: "/images/clients/carla_zampatti_logo.png", category: "Haute Runway" },
    { name: "Bec + Bridge", src: "/images/clients/bec_and_bridge_logo.png", category: "Designer Apparel" },
    {
      name: "Christopher Esber",
      src: "/images/clients/christopher_esber_logo.png",
      category: "Luxury Runway",
    },
    { name: "St. Agni", src: "/images/clients/st_agni_logo.png", category: "Minimalist Studio" },
    { name: "Bondi Born", src: "/images/clients/bondi_born_logo.png", category: "Resort & Swim" },
    { name: "Emma Lewisham", src: "/images/clients/emma_lewisham_logo.png", category: "Circular Skincare" },
    { name: "Status Anxiety", src: "/images/clients/status_anxiety_logo.png", category: "Luxury Leather" },
  ];

  $effect(() => {
    if (!partnersSection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !partnersSection) return;
      const { gsap } = runtime;
      const root = partnersSection;

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
            const { isDesktop, isTablet, reduceMotion } = ctx.conditions!;
            const header = root.querySelector(".partners-header");
            const tiles = root.querySelectorAll(".partner-tile");

            if (reduceMotion) {
              gsap.set([header, ...tiles].filter(Boolean), { autoAlpha: 1, y: 0 });
              return;
            }

            const yOffset = isDesktop ? 16 : isTablet ? 14 : 18;
            const duration = isDesktop ? 0.6 : isTablet ? 0.5 : 0.5;
            const stagger = isDesktop ? 0.03 : isTablet ? 0.02 : 0.03;
            const startTrigger = "top 95%";

            if (header) {
              gsap.from(header, {
                y: yOffset,
                autoAlpha: 0,
                duration,
                ease: "power2.out",
                clearProps: "all",
                scrollTrigger: {
                  trigger: root,
                  start: startTrigger,
                  once: true,
                },
              });
            }

            gsap.from(tiles, {
              y: yOffset,
              opacity: 0,
              duration,
              stagger,
              ease: "power2.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: root,
                start: startTrigger,
                once: true,
              },
            });
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
  id="portfolio-partner-logos"
  bind:this={partnersSection}
  aria-label="Brand Partners and Sponsors"
  class="relative w-full bg-brand-light py-8 lg:py-12 text-center overflow-hidden"
>
  <div class="site-shell max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="partners-header">
      <span class="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark/50 mb-2.5 block">
        Trust & Scale
      </span>
      <h2 class="font-display text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-brand-dark mb-8 sm:mb-10">
        {$_('portfolio.partners.title') || 'Selected Brand Partners'}
      </h2>
    </div>

    <!-- Full-Width Luxury Partner Matrix with Responsive 1px Hairline Grid -->
    <div
      class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)] border border-brand-dark/10 bg-brand-dark/10 gap-[1px] shadow-sm overflow-hidden"
    >
      {#each partners as partner (partner.src)}
        <div
          class="partner-tile group relative flex flex-col min-h-24 sm:min-h-32 lg:min-h-36 items-center justify-center p-3 sm:p-5 bg-white transition-all duration-300 hover:bg-white cursor-pointer select-none"
        >
          <!-- Logo with scale, color restore, and elevation on hover -->
          <img
            src={partner.src}
            alt="{partner.name} logo"
            width="180"
            height="64"
            loading="lazy"
            decoding="async"
            class="max-h-8 sm:max-h-9 lg:max-h-10 w-auto max-w-[78px] sm:max-w-[88px] lg:max-w-[98px] object-contain opacity-70 sm:opacity-50 grayscale-0 sm:grayscale sm:group-hover:grayscale-0 sm:group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 relative z-10"
          />

          <!-- Category tag that reveals smoothly on hover -->
          <span
            class="absolute bottom-2.5 font-mono text-[9px] uppercase tracking-wider text-brand-green opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 font-medium z-10"
          >
            {partner.category}
          </span>

          <!-- Green accent baseline line on hover -->
          <div
            class="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center z-20"
          ></div>
        </div>
      {/each}
    </div>
  </div>
</section>
