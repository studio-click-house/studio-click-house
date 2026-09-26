<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceAudienceItem } from "$lib/types/service-detail";
  import { cn } from "$lib/utils";

  let { heading, description, items } = $props<{
    heading: string;
    description?: string;
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
          gsap.from(".sd-audience-header", {
            autoAlpha: 0,
            y: 24,
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
            y: 32,
            duration: 0.74,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: ".sd-audience-grid",
              start: "top 88%",
              once: true,
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
  class="relative isolate overflow-hidden py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div class="site-shell relative z-10">
    <div
      class="sd-audience-header mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
    >
      <h2
        id="service-detail-audience-title"
        class="max-w-[16ch] font-display text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.04em]"
      >
        {heading}
      </h2>
      {#if description}
        <p class="max-w-[42ch] text-base leading-7 text-brand-dark/64 lg:pb-1">
          {description}
        </p>
      {/if}
    </div>

    <div class="sd-audience-grid grid gap-5 md:grid-cols-3 lg:gap-6">
      {#each items as item (item.title)}
        {@const isCover = item.fit === "cover"}
        <article
          class="sd-audience-card group flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-brand-dark/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-dark/20 hover:shadow-lg"
        >
          <!-- Compact clean image presentation -->
          <figure
            class="relative aspect-[4/3.2] w-full overflow-hidden bg-white flex items-center justify-center p-4 sm:p-5"
          >
            <img
              src={item.media.src}
              alt={item.media.alt}
              width={item.media.width}
              height={item.media.height}
              loading="lazy"
              class={cn(
                "size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]",
                isCover ? "object-cover object-top" : "object-contain object-center"
              )}
            />
          </figure>

          <!-- Card Content Body: Just Title & Description -->
          <div class="flex flex-1 flex-col p-5 sm:p-6 pt-1 sm:pt-1">
            <h3
              class="font-sans text-lg sm:text-[1.12rem] font-semibold tracking-[-0.015em] leading-snug text-brand-dark transition-colors duration-300 group-hover:text-brand-green"
            >
              {item.title}
            </h3>

            <p class="mt-2 text-sm leading-relaxed text-brand-dark/65">
              {item.description}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
