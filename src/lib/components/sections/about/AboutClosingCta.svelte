<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData } from "$lib/types/about";
  import { _ } from "svelte-i18n";
  import { resolve } from "$app/paths";

  let { closingCta } = $props<{ closingCta: AboutPageData["closingCta"] }>();

  let sectionRef: HTMLElement;

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionRef) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            ".closing-cta-reveal",
            { autoAlpha: 0, y: 24 },
            {
              scrollTrigger: {
                trigger: sectionRef,
                start: "top 88%",
                once: true,
              },
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.1,
              ease: "power2.out",
              clearProps: "all",
            },
          );

          media.add("(min-width: 1024px)", () => {
            gsap.fromTo(
              ".closing-focus-ring",
              { xPercent: 22, rotation: -24, scale: 0.72 },
              {
                scrollTrigger: {
                  trigger: sectionRef,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
                xPercent: -8,
                rotation: 34,
                scale: 1.08,
                ease: "none",
              },
            );
          });
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
  id="closing-cta"
  aria-label="Closing Call to Action"
  bind:this={sectionRef}
  class="section-space relative overflow-hidden border-t border-brand-dark/20 bg-brand-paper py-16 sm:py-24 md:py-32"
>
  <div
    class="closing-focus-ring pointer-events-none absolute -right-[18rem] -top-[18rem] aspect-square w-[46rem] rounded-full border border-brand-dark/12"
    aria-hidden="true"
  >
    <div
      class="absolute inset-[18%] rounded-full border border-brand-green/30"
    ></div>
    <div class="absolute left-1/2 top-0 h-full w-px bg-brand-dark/8"></div>
    <div class="absolute left-0 top-1/2 h-px w-full bg-brand-dark/8"></div>
  </div>

  <div class="site-shell relative z-10">
    <div
      class="grid gap-8 sm:gap-10 border-b border-brand-dark/25 pb-10 sm:pb-12 lg:grid-cols-12 lg:items-end lg:gap-12 md:pb-16"
    >
      <div class="closing-cta-reveal lg:col-span-8">
        <h2
          class="max-w-5xl font-display text-[clamp(2.5rem,5.5vw,6.5rem)] leading-[0.9] tracking-[-0.04em] text-brand-dark"
        >
          {$_('about.closingCta.heading') || closingCta.heading}
        </h2>
      </div>

      <div class="closing-cta-reveal lg:col-span-4 lg:pb-2">
        <p
          class="max-w-xl text-base leading-relaxed text-brand-dark/70 md:text-lg"
        >
          {$_('about.closingCta.description') || closingCta.description}
        </p>

        <div
          class="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
        >
          <a
            href={resolve(closingCta.primaryCtaHref)}
            class="inline-flex min-h-12 items-center justify-center gap-3 rounded-[0.55rem] bg-brand-dark px-7 text-sm font-semibold text-brand-light transition-colors duration-300 hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
          >
            <span>{$_('about.closingCta.primaryCtaLabel') || closingCta.primaryCtaLabel}</span>
            <ArrowRight class="w-5 h-5" />
          </a>

          <a
            href={resolve(closingCta.secondaryCtaHref)}
            class="border-b border-brand-dark/35 pb-1 text-sm font-semibold text-brand-dark transition-colors duration-300 hover:border-brand-green hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
          >
            <span>{$_('about.closingCta.secondaryCtaLabel') || closingCta.secondaryCtaLabel}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
