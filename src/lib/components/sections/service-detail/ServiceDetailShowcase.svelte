<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowDown, ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceShowcaseData } from "$lib/types/service-detail";

  let { data } = $props<{ data: ServiceShowcaseData }>();
  let section = $state<HTMLElement>();

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      const currentSection = section;
      if (!active || !runtime || !currentSection) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: currentSection,
                start: "top 76%",
                once: true,
              },
              defaults: { ease: "expo.out" },
            })
            .from(".sd-proof-copy", {
              autoAlpha: 0,
              x: -28,
              duration: 0.82,
            })
            .from(
              ".sd-proof-card",
              {
                autoAlpha: 0,
                y: 38,
                scale: 0.965,
                duration: 0.9,
                stagger: 0.1,
              },
              "-=0.5",
            )
            .from(
              ".sd-proof-metric-reveal",
              {
                yPercent: 110,
                duration: 0.72,
                stagger: 0.08,
              },
              "-=0.62",
            );

          gsap.to(".sd-proof-copy-motion", {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: currentSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.to(".sd-proof-card-main", {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: currentSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.to(".sd-proof-card-side", {
            yPercent: -11,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: currentSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.fromTo(
            ".sd-proof-glow",
            { yPercent: -24, autoAlpha: 0.35 },
            {
              yPercent: 34,
              autoAlpha: 0.8,
              ease: "none",
              scrollTrigger: {
                trigger: currentSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1,
              },
            },
          );
        });

        return () => media.revert();
      }, currentSection);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  bind:this={section}
  id="service-detail-showcase"
  aria-labelledby="service-detail-showcase-title"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div
    class="sd-proof-glow pointer-events-none absolute -right-40 top-[10%] size-[34rem] rounded-full bg-brand-green/18 blur-[115px]"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10">
    <div class="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
      <div class="sd-proof-copy sd-proof-copy-motion lg:col-span-5 lg:pr-4">
        <p
          class="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-brand-green"
        >
          Proof in practice
        </p>
        <h2
          id="service-detail-showcase-title"
          class="mt-4 max-w-[11ch] font-display text-[clamp(2.9rem,5vw,5.25rem)] leading-[0.88] tracking-[-0.045em]"
        >
          {data.heading}
        </h2>

        {#if data.description}
          <p class="mt-6 max-w-[38ch] text-base leading-7 text-brand-dark/64">
            {data.description}
          </p>
        {/if}

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={resolve("/contact")}
            class="group inline-flex min-h-12 items-center gap-4 rounded-[0.55rem] bg-brand-dark px-6 font-mono text-[0.64rem] font-bold uppercase tracking-[0.12em] text-brand-light transition-colors duration-300 hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
          >
            Discuss your project
            <ArrowUpRight
              class="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
          <a
            href="#service-detail-before-after"
            class="group inline-flex min-h-12 items-center gap-2 rounded-[0.55rem] border border-brand-dark/18 px-4 text-sm font-semibold transition-colors duration-300 hover:border-brand-green hover:text-brand-green"
          >
            View comparison
            <ArrowDown
              class="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </div>

      <div class="relative lg:col-span-7">
        <div class="grid grid-cols-[1.12fr_0.88fr] gap-3 sm:gap-4">
          {#if data.gallery?.[0] && data.stats?.[0]}
            <figure
              class="sd-proof-card sd-proof-card-main group relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-brand-dark shadow-2xl shadow-brand-dark/15"
            >
              <img
                src={data.gallery[0].src}
                alt={data.gallery[0].alt}
                width={data.gallery[0].width}
                height={data.gallery[0].height}
                loading="lazy"
                class="size-full object-cover"
              />
              <span
                class="absolute inset-0 bg-gradient-to-t from-brand-dark/92 via-brand-dark/5 to-transparent"
              ></span>
              <figcaption class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <span class="block overflow-hidden pb-1">
                  <span
                    class="sd-proof-metric-reveal block font-display text-[clamp(2.7rem,4vw,4.25rem)] leading-none tracking-[-0.04em] text-brand-light"
                  >
                    {data.stats[0].value}
                  </span>
                </span>
                <span
                  class="mt-2 block max-w-[24ch] text-sm leading-5 text-brand-light/68"
                >
                  {data.stats[0].label}
                </span>
              </figcaption>
            </figure>
          {/if}

          <div class="grid content-center gap-3 py-[7%] sm:gap-4">
            {#each [1, 2] as index}
              {#if data.gallery?.[index] && data.stats?.[index]}
                <figure
                  class="sd-proof-card sd-proof-card-side relative aspect-[5/4] overflow-hidden rounded-[0.85rem] bg-brand-dark shadow-xl shadow-brand-dark/12"
                >
                  <img
                    src={data.gallery[index].src}
                    alt={data.gallery[index].alt}
                    width={data.gallery[index].width}
                    height={data.gallery[index].height}
                    loading="lazy"
                    class="size-full object-cover"
                  />
                  <span
                    class="absolute inset-0 bg-gradient-to-t from-brand-dark/94 via-brand-dark/10 to-brand-dark/5"
                  ></span>
                  <figcaption class="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <span class="block overflow-hidden pb-1">
                      <span
                        class="sd-proof-metric-reveal block font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-none tracking-[-0.035em] text-brand-light"
                      >
                        {data.stats[index].value}
                      </span>
                    </span>
                    <span
                      class="mt-1.5 block text-xs leading-4 text-brand-light/66 sm:text-sm sm:leading-5"
                    >
                      {data.stats[index].label}
                    </span>
                  </figcaption>
                </figure>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
