<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";

  let manifestoSection = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!manifestoSection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !manifestoSection) return;
      const { gsap } = runtime;
      const root = manifestoSection;

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
            const items = root.querySelectorAll(".manifesto-anim-item");

            if (reduceMotion) {
              gsap.set(items, { autoAlpha: 1, y: 0 });
              return;
            }

            const yOffset = isDesktop ? 34 : isTablet ? 26 : 38;
            const duration = isDesktop ? 0.9 : isTablet ? 0.8 : 0.75;
            const stagger = isDesktop ? 0.1 : isTablet ? 0.08 : 0.08;
            const startTrigger = isDesktop ? "top 80%" : isTablet ? "top 80%" : "top 78%";

            gsap.from(items, {
              y: yOffset,
              autoAlpha: 0,
              duration,
              stagger,
              ease: isDesktop ? "power3.out" : "power2.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: root,
                start: startTrigger,
                toggleActions: "play none none reverse",
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
  id="portfolio-manifesto-quote"
  bind:this={manifestoSection}
  aria-label="Studio Creative Manifesto"
  class="relative w-full bg-brand-light pt-16 pb-6 lg:pt-24 lg:pb-8 text-center"
>
  <div class="site-shell max-w-4xl mx-auto flex flex-col items-center">
    <span class="manifesto-anim-item font-mono text-xs font-semibold uppercase tracking-[0.25em] text-brand-green mb-8 block">
      Our Philosophy
    </span>

    <blockquote
      class="manifesto-anim-item font-display text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.25] text-brand-dark tracking-tight mb-8 text-balance"
    >
      {$_('portfolio.manifesto.quote') || '“The true standard of post-production is invisible perfection: every pixel refined so the art, garment, and human expression feel completely effortless.”'}
    </blockquote>

    <div class="manifesto-anim-item flex flex-col items-center">
      <cite class="not-italic font-display text-lg sm:text-xl font-normal text-brand-dark mb-1">
        {$_('portfolio.manifesto.author') || 'Studio Click House'}
      </cite>
      <span class="font-mono text-xs uppercase tracking-widest text-brand-dark/60">
        {$_('portfolio.manifesto.role') || 'Global Creative Post-Production & Color Studio'}
      </span>
    </div>
  </div>
</section>
