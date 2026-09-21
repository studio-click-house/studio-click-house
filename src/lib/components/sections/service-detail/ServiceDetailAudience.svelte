<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceAudienceItem } from "$lib/types/service-detail";
  import { cn } from "$lib/utils";

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
            clearProps: "all",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
            },
          });

          gsap.from(".sd-audience-card", {
            autoAlpha: 0,
            y: 30,
            duration: 0.74,
            stagger: 0.09,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: ".sd-audience-grid",
              start: "top 88%",
              once: true,
            },
          });

          media.add("(min-width: 1024px)", () => {
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
  class="relative isolate overflow-hidden py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div class="site-shell relative z-10">
    <div class="sd-audience-heading mb-9 lg:mb-11">
      <h2
        id="service-detail-audience-title"
        class="max-w-2xl font-display text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.04em]"
      >
        {heading}
      </h2>
    </div>

    <div class="sd-audience-grid grid gap-4 md:grid-cols-3 lg:gap-5">
      {#each items as item (item.title)}
        {@const isContain = item.fit === "contain"}
        <article
          class="sd-audience-card group flex flex-col overflow-hidden rounded-[2rem] border border-brand-dark/10 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-brand-dark/5 hover:border-brand-dark/20"
        >
          <figure
            class={cn(
              "relative aspect-[4/3.15] overflow-hidden flex items-center justify-center transition-colors duration-300",
              isContain
                ? "bg-white p-3 sm:p-4"
                : "bg-brand-dark/5"
            )}
          >
            <img
              src={item.media.src}
              alt={item.media.alt}
              width={item.media.width}
              height={item.media.height}
              loading="lazy"
              class={cn(
                "transition-transform duration-700 ease-out group-hover:scale-105",
                isContain
                  ? "size-full object-contain"
                  : "absolute inset-0 size-full object-cover object-center"
              )}
            />
          </figure>
          <div class="flex flex-1 flex-col p-5 sm:p-6">
            <h3
              class="text-xl font-semibold tracking-[-0.015em] text-brand-dark transition-colors duration-300 group-hover:text-brand-green"
            >
              {item.title}
            </h3>
            <p class="mt-2.5 text-sm leading-6 text-brand-dark/65">
              {item.description}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
