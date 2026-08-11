<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceAudienceItem } from "$lib/types/service-detail";

  let { heading, items } = $props<{
    heading: string;
    items: ServiceAudienceItem[];
  }>();

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
          gsap.from(".sd-audience-heading", {
            autoAlpha: 0,
            y: 22,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
            },
          });

          gsap.from(".sd-audience-card", {
            autoAlpha: 0,
            y: 30,
            duration: 0.74,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".sd-audience-grid",
              start: "top 82%",
              once: true,
            },
          });

          gsap.to(".sd-audience-parallax-img", {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
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
  id="service-detail-audience"
  aria-labelledby="service-detail-audience-title"
  class="relative isolate overflow-hidden bg-brand-light py-16 text-brand-dark sm:py-20 lg:py-24"
>
  <div
    class="pointer-events-none absolute -right-52 top-[12%] size-[32rem] rounded-full bg-brand-green/10 blur-[120px]"
    aria-hidden="true"
  ></div>
  <div class="site-shell relative z-10">
    <div class="sd-audience-heading mb-9 lg:mb-11">
      <p
        class="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-brand-green"
      >
        Built for real workflows
      </p>
      <h2
        id="service-detail-audience-title"
        class="mt-4 max-w-[16ch] font-display text-[clamp(2.7rem,4.6vw,4.8rem)] leading-[0.9] tracking-[-0.04em]"
      >
        {heading}
      </h2>
    </div>

    <div class="sd-audience-grid grid gap-4 md:grid-cols-3 lg:gap-5">
      {#each items as item (item.title)}
        <article
          class="sd-audience-card overflow-hidden rounded-[0.95rem] border border-brand-dark/10 bg-brand-paper"
        >
          <figure class="relative aspect-[4/3] overflow-hidden bg-brand-dark/5">
            <img
              src={item.media.src}
              alt={item.media.alt}
              width={item.media.width}
              height={item.media.height}
              loading="lazy"
              class="sd-audience-parallax-img absolute inset-x-0 -top-[4%] h-[108%] w-full object-cover"
            />
          </figure>
          <div class="p-5 sm:p-6">
            <h3 class="text-xl font-semibold tracking-[-0.015em]">
              {item.title}
            </h3>
            <p class="mt-3 text-sm leading-6 text-brand-dark/62">
              {item.description}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
