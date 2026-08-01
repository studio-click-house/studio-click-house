<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowRight, ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { registerScrollTrigger } from "$lib/animations/gsap";

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
  id="services-cta"
  aria-labelledby="services-cta-title"
  class="relative overflow-hidden bg-brand-light py-18 text-brand-dark sm:py-20 lg:py-24"
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
        <h2
          id="services-cta-title"
          class="max-w-[13ch] font-display text-[clamp(3.3rem,5.8vw,6.5rem)] leading-[0.86] tracking-[-0.045em]"
        >
          Put the next image in motion.
        </h2>
      </div>

      <div class="services-cta-reveal lg:col-span-4 lg:pb-2">
        <p
          class="max-w-[34ch] text-sm leading-[1.65] text-brand-dark/72 sm:text-base"
        >
          Share the brief, sample files, and delivery window. Our production
          desk will map the right workflow and return a clear scope.
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={resolve("/contact")}
            class="group inline-flex min-h-12 items-center gap-6 rounded-full bg-brand-dark px-6 text-sm font-semibold text-brand-light transition-colors duration-300 hover:bg-brand-green hover:text-brand-dark"
          >
            Start a project
            <ArrowUpRight
              class="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
          <a
            href={resolve("/contact")}
            class="group inline-flex min-h-12 items-center gap-3 rounded-full border border-brand-dark/25 px-5 text-sm font-semibold transition-colors duration-300 hover:border-brand-green hover:text-brand-green"
          >
            Request a test edit
            <ArrowRight
              class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>

        <a
          href={resolve("/pricing")}
          class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-dark/65 transition-colors duration-300 hover:text-brand-green"
        >
          View rate guide
          <ArrowRight class="h-4 w-4" />
        </a>
      </div>
    </div>

    <div
      class="services-cta-reveal mt-14 grid gap-8 rounded-[1.25rem] bg-brand-paper p-6 sm:grid-cols-3 sm:p-8 lg:mt-16"
    >
      <div>
        <h3 class="text-base font-semibold">Send the brief</h3>
        <p class="mt-2 text-sm leading-[1.55] text-brand-dark/60">
          Share references, sample files, volume, and timing.
        </p>
      </div>
      <div>
        <h3 class="text-base font-semibold">Review a test</h3>
        <p class="mt-2 text-sm leading-[1.55] text-brand-dark/60">
          Approve the finish and confirm the production scope.
        </p>
      </div>
      <div>
        <h3 class="text-base font-semibold">Move to production</h3>
        <p class="mt-2 text-sm leading-[1.55] text-brand-dark/60">
          Assets move through production and two-tier quality control.
        </p>
      </div>
    </div>
  </div>
</section>
