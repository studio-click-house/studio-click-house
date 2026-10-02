<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { onMount } from "svelte";
  import { ArrowRight, ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { motion } from "$lib/animations/motion";
  import type { ServiceDetailCtaData } from "$lib/types/service-detail";
  import { _ } from "svelte-i18n";

  let { data }: { data?: ServiceDetailCtaData } = $props();
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
          gsap.from(".services-cta-reveal", {
            autoAlpha: 0,
            y: motion.reveal.y,
            duration: motion.duration.reveal,
            stagger: motion.reveal.stagger,
            ease: motion.ease,
            clearProps: "all",
            scrollTrigger: {
              trigger: section,
              start: motion.reveal.start,
              toggleActions: "play none none none",
            },
          });

          // Orbit rotation scrub
          media.add("(min-width: 1024px)", () => {
            gsap.fromTo(
              ".services-cta-orbit",
              { xPercent: 18, rotation: -18 },
              {
                xPercent: -4,
                rotation: 24,
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
  id={data ? "service-detail-cta" : "services-cta"}
  aria-labelledby={data ? "service-detail-cta-title" : "services-cta-title"}
  class="relative overflow-hidden bg-brand-light py-10 text-brand-dark sm:py-12 lg:py-14"
>
  <div
    class="services-cta-orbit pointer-events-none absolute -right-[14rem] -top-[18rem] h-[42rem] w-[42rem] rounded-full border border-brand-green/30"
    aria-hidden="true"
  ></div>
  <div
    class="services-cta-orbit pointer-events-none absolute -right-[6rem] -top-[10rem] h-[26rem] w-[26rem] rounded-full border border-brand-dark/12"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10">
    <div class="grid gap-12 lg:grid-cols-12 lg:items-end">
      <div class="services-cta-reveal lg:col-span-8">
        <p class="eyebrow mb-3 text-brand-dark/50">
          {$_("sectionLabels.project")}
        </p>
        <h2
          id={data ? "service-detail-cta-title" : "services-cta-title"}
          class={data ? "max-w-[18ch] font-display text-[length:var(--text-section)] leading-[0.98] tracking-[-0.04em]" : "max-w-[13ch] font-display text-[clamp(2.4rem,5.8vw,6.5rem)] leading-[0.92] tracking-[-0.045em]"}
        >
          {data?.heading ?? ($_('services.cta.heading') || 'Put the next image in motion.')}
        </h2>
      </div>

      <div class="services-cta-reveal lg:col-span-4 lg:pb-2">
        <p
          class="max-w-[34ch] text-sm leading-[1.65] text-brand-dark/72 sm:text-base"
        >
          {data?.description ?? ($_('services.cta.description') || 'Share the brief, sample files, and delivery window. Our production desk will map the right workflow and return a clear scope.')}
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <Button
            href={resolve("/contact")}
            size="lg"
            class="group gap-6 bg-brand-dark text-brand-light hover:bg-brand-green hover:text-brand-dark"
          >
            {data ? ($_('serviceDetail.placeOrder') || 'Start a project') : ($_('services.cta.startProject') || 'Start a project')}
            <ArrowUpRight
              class="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Button>
          <Button
            href={resolve("/contact")}
            variant="secondary"
            size="lg"
            class="group px-5"
          >
            {$_('services.cta.requestTest') || 'Request a test edit'}
            <ArrowRight
              class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Button>
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

    <div
      class="services-cta-reveal mt-14 grid gap-8 rounded-[1.5rem] bg-brand-paper p-6 sm:grid-cols-3 sm:p-8 lg:mt-16"
    >
      {#each data?.steps ?? [
        { title: $_('services.cta.steps.0.title') || 'Send the brief', description: $_('services.cta.steps.0.description') || 'Share references, sample files, volume, and timing.' },
        { title: $_('services.cta.steps.1.title') || 'Review a test', description: $_('services.cta.steps.1.description') || 'Approve the finish and confirm the production scope.' },
        { title: $_('services.cta.steps.2.title') || 'Move to production', description: $_('services.cta.steps.2.description') || 'Assets move through production and two-tier quality control.' },
      ] as step (step.title)}
        <div>
          <h3 class="text-base font-semibold">{step.title}</h3>
          <p class="mt-2 text-sm leading-[1.55] text-brand-dark/60">{step.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>
