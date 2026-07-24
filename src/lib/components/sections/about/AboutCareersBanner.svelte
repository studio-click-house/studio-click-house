<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData } from "$lib/types/about";

  let { careers } = $props<{ careers: AboutPageData["careers"] }>();
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
            ".careers-banner-content",
            { autoAlpha: 0, y: 36 },
            {
              scrollTrigger: { trigger: sectionRef, start: "top 80%" },
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
            },
          );

          gsap.fromTo(
            ".careers-media",
            { yPercent: -8, scale: 1.14 },
            {
              scrollTrigger: {
                trigger: sectionRef,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
              yPercent: 8,
              scale: 1.14,
              ease: "none",
            },
          );

          gsap.fromTo(
            ".careers-lens-ring",
            { rotation: -30, scale: 0.78 },
            {
              scrollTrigger: {
                trigger: sectionRef,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
              rotation: 75,
              scale: 1.12,
              ease: "none",
            },
          );
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
  id="careers-banner"
  aria-label="Careers Banner"
  bind:this={sectionRef}
  class="relative overflow-hidden bg-brand-dark text-brand-light"
>
  <div class="grid lg:min-h-[42rem] lg:grid-cols-2">
    <div
      class="relative m-4 min-h-[22rem] overflow-hidden rounded-2xl lg:order-2 lg:my-6 lg:mr-6 lg:ml-0 lg:min-h-0"
    >
      <img
        src={careers.bgMedia.src}
        alt={careers.bgMedia.alt}
        width={careers.bgMedia.width}
        height={careers.bgMedia.height}
        loading="lazy"
        decoding="async"
        class="careers-media absolute inset-0 h-full w-full object-cover grayscale"
      />
      <div class="absolute inset-0 bg-brand-dark/20"></div>
      <div
        class="careers-lens-ring pointer-events-none absolute -right-20 top-1/2 aspect-square w-[min(70vw,34rem)] -translate-y-1/2 rounded-full border border-white/35"
        aria-hidden="true"
      >
        <div
          class="absolute inset-[16%] rounded-full border border-brand-green/70"
        ></div>
        <span class="absolute left-1/2 top-0 h-full w-px bg-white/20"></span>
        <span class="absolute left-0 top-1/2 h-px w-full bg-white/20"></span>
      </div>
      <p
        class="absolute bottom-5 right-5 border-t border-white/35 pt-2 text-[0.68rem] uppercase tracking-[0.16em] text-white/75"
      >
        Inside the studio
      </p>
    </div>

    <div class="careers-banner-content flex items-center lg:order-1">
      <div class="w-full px-5 py-20 sm:px-10 md:py-28 lg:px-[max(3rem,8vw)]">
        <h2
          class="max-w-[10ch] font-display text-[clamp(3.25rem,5.5vw,6.5rem)] leading-[0.84] tracking-[-0.05em] text-white"
        >
          {careers.heading}
        </h2>

        <p
          class="mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
        >
          {careers.description}
        </p>

        <dl
          class="mt-10 grid grid-cols-3 border-y border-white/20 py-5 text-white/70"
        >
          <div>
            <dt class="font-display text-2xl text-white sm:text-3xl">150+</dt>
            <dd class="mt-1 text-[0.62rem] uppercase tracking-[0.13em]">
              Artists
            </dd>
          </div>
          <div class="border-x border-white/20 px-4 sm:px-6">
            <dt class="font-display text-2xl text-white sm:text-3xl">24/7</dt>
            <dd class="mt-1 text-[0.62rem] uppercase tracking-[0.13em]">
              Operations
            </dd>
          </div>
          <div class="pl-4 sm:pl-6">
            <dt class="font-display text-2xl text-white sm:text-3xl">Dhaka</dt>
            <dd class="mt-1 text-[0.62rem] uppercase tracking-[0.13em]">
              Studio HQ
            </dd>
          </div>
        </dl>

        <a
          href={careers.ctaHref}
          class="mt-10 inline-flex min-h-12 items-center gap-5 border-b border-brand-green pb-1 text-sm font-semibold text-brand-light transition-colors duration-300 hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          <span>{careers.ctaLabel}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </div>
</section>
