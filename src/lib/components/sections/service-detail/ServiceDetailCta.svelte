<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight, ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceDetailCtaData } from "$lib/types/service-detail";
  import { _ } from "svelte-i18n";

  let { data } = $props<{ data: ServiceDetailCtaData }>();

  let section = $state<HTMLElement>();

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".sd-cta-reveal", {
            autoAlpha: 0,
            y: 34,
            duration: 0.85,
            stagger: 0.09,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });

          media.add("(min-width: 1024px)", () => {
            gsap.fromTo(
              ".sd-cta-orbit",
              { xPercent: 16, rotation: -14 },
              {
                xPercent: -6,
                rotation: 22,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          });
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
  bind:this={section}
  id="service-detail-cta"
  aria-labelledby="service-detail-cta-title"
  class="relative overflow-hidden bg-brand-light py-18 text-brand-dark sm:py-20 lg:py-24"
>
  <div
    class="sd-cta-orbit pointer-events-none absolute -right-[14rem] -top-[18rem] h-[42rem] w-[42rem] rounded-full border border-brand-green/30"
    aria-hidden="true"
  ></div>
  <div
    class="sd-cta-orbit pointer-events-none absolute -right-[6rem] -top-[10rem] h-[26rem] w-[26rem] rounded-full border border-brand-dark/12"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10">
    <div class="grid gap-12 lg:grid-cols-12 lg:items-end">
      <!-- Left: Display Heading -->
      <div class="sd-cta-reveal lg:col-span-8">
        <h2
          id="service-detail-cta-title"
          class="max-w-[13ch] font-display text-[clamp(2.4rem,5.8vw,6.5rem)] leading-[0.92] tracking-[-0.045em]"
        >
          {data.heading}
        </h2>
      </div>

      <!-- Right: Description + Actions -->
      <div class="sd-cta-reveal lg:col-span-4 lg:pb-2">
        <p
          class="max-w-[34ch] text-sm leading-[1.65] text-brand-dark/72 sm:text-base"
        >
          {data.description}
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={resolve("/contact")}
            class="group inline-flex min-h-12 items-center gap-6 rounded-sm bg-brand-dark px-6 text-sm font-semibold text-brand-light transition-colors duration-300 hover:bg-brand-green hover:text-brand-dark"
          >
            {$_('serviceDetail.placeOrder') || 'Start a project'}
            <ArrowUpRight
              class="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
          <a
            href={resolve("/contact")}
            class="group inline-flex min-h-12 items-center gap-3 rounded-sm border border-brand-dark/25 px-5 text-sm font-semibold transition-colors duration-300 hover:border-brand-green hover:text-brand-green"
          >
            {$_('services.cta.requestTest') || 'Request a test edit'}
            <ArrowRight
              class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>

        <a
          href={resolve("/pricing")}
          class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-dark/65 transition-colors duration-300 hover:text-brand-green"
        >
          {$_('services.cta.viewRateGuide') || 'View rate guide'}
          <ArrowRight class="h-4 w-4" />
        </a>
      </div>
    </div>

    <!-- Workflow steps: Rounded brand-paper container matching /services CTA -->
    <div
      class="sd-cta-reveal mt-14 grid gap-8 rounded-[1.5rem] bg-brand-paper p-6 sm:grid-cols-3 sm:p-8 lg:mt-16"
    >
      {#each data.steps as step (step.title)}
        <div>
          <h3 class="text-base font-semibold">{step.title}</h3>
          <p class="mt-2 text-sm leading-[1.55] text-brand-dark/60">
            {step.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>
