<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight, ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceDetailCtaData } from "$lib/types/service-detail";

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
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          });

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
                scrub: true,
              },
            },
          );
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
  class="relative overflow-hidden bg-brand-dark py-16 text-brand-light sm:py-20 lg:py-24"
>
  <!-- Decorative orbits -->
  <div
    class="sd-cta-orbit pointer-events-none absolute -right-[14rem] -top-[18rem] h-[42rem] w-[42rem] rounded-full border border-brand-green/20"
    aria-hidden="true"
  ></div>
  <div
    class="sd-cta-orbit pointer-events-none absolute -right-[6rem] -top-[10rem] h-[26rem] w-[26rem] rounded-full border border-brand-light/8"
    aria-hidden="true"
  ></div>
  <div
    class="pointer-events-none absolute -bottom-56 left-[8%] size-[34rem] rounded-full bg-brand-green/14 blur-[125px]"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10">
    <div class="grid gap-12 lg:grid-cols-12 lg:items-end">
      <!-- Left: Heading -->
      <div class="sd-cta-reveal lg:col-span-7">
        <h2
          id="service-detail-cta-title"
          class="max-w-2xl font-display text-[clamp(2.4rem,3.8vw,3.8rem)] leading-[0.98] tracking-[-0.04em]"
        >
          {data.heading}
        </h2>
      </div>

      <!-- Right: Description + Actions -->
      <div class="sd-cta-reveal lg:col-span-5 lg:pb-2">
        <p
          class="max-w-[38ch] text-sm leading-[1.65] text-brand-light/65 sm:text-base"
        >
          {data.description}
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={resolve("/contact")}
            class="group inline-flex min-h-12 items-center gap-5 rounded-[0.55rem] bg-brand-green px-6 text-sm font-semibold text-brand-dark transition-colors duration-300 hover:bg-brand-light focus-visible:outline-brand-green"
          >
            Place an order
            <ArrowUpRight
              class="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
          <a
            href={resolve("/pricing")}
            class="group inline-flex min-h-12 items-center gap-3 rounded-[0.55rem] border border-brand-light/20 px-5 text-sm font-semibold text-brand-light transition-colors duration-300 hover:border-brand-green hover:text-brand-green"
          >
            Get price idea
            <ArrowRight
              class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </div>

    <!-- Workflow steps -->
    <div
      class="sd-cta-reveal mt-12 grid gap-8 rounded-[1rem] border border-brand-light/8 bg-brand-light/[0.04] p-6 sm:grid-cols-3 sm:p-8 lg:mt-14"
    >
      {#each data.steps as step, index (step.title)}
        <div class="flex gap-5">
          <span
            class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-green/30 font-mono text-xs font-medium text-brand-green"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 class="text-base font-semibold text-brand-light">
              {step.title}
            </h3>
            <p class="mt-1.5 text-sm leading-[1.55] text-brand-light/55">
              {step.description}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
