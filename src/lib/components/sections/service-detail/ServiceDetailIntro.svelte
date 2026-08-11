<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceIntroData } from "$lib/types/service-detail";

  let { data } = $props<{ data: ServiceIntroData }>();
  let section = $state<HTMLElement>();

  const stages = $derived(data.stages ?? []);
  const studyMedia = $derived(stages[0]?.media);

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
              defaults: { ease: "power3.out" },
            })
            .from(".sd-intro-copy", {
              autoAlpha: 0,
              y: 28,
              duration: 0.82,
              stagger: 0.08,
            })
            .from(
              ".sd-study-principle",
              {
                autoAlpha: 0,
                x: -18,
                duration: 0.6,
                stagger: 0.1,
              },
              "-=0.45",
            );

          gsap.from(".sd-study-frame", {
            autoAlpha: 0,
            y: 90,
            scale: 0.97,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".sd-study-frame",
              start: "top 88%",
              once: true,
            },
          });
        });

        media.add(
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          () => {
            const progressTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: currentSection,
                start: "top 12%",
                end: "bottom 72%",
                scrub: true,
              },
            });

            progressTimeline
              .fromTo(
                ".sd-study-progress",
                { scaleY: 0 },
                {
                  scaleY: 1,
                  transformOrigin: "top center",
                  ease: "none",
                  duration: 1,
                },
                0,
              )
              .fromTo(
                ".sd-study-scan",
                { yPercent: -115, autoAlpha: 0.12 },
                {
                  yPercent: 115,
                  autoAlpha: 0.72,
                  ease: "none",
                  duration: 1,
                },
                0,
              )
              .fromTo(
                ".sd-study-focus",
                { autoAlpha: 0.18, scale: 0.94 },
                {
                  autoAlpha: 1,
                  scale: 1,
                  stagger: 0.24,
                  ease: "power1.out",
                  duration: 0.22,
                },
                0.08,
              )
              .to(
                ".sd-study-image",
                {
                  scale: 1.035,
                  yPercent: 2,
                  ease: "none",
                  duration: 1,
                },
                0,
              );

            gsap.to(".sd-study-glow", {
              xPercent: 44,
              yPercent: -26,
              ease: "none",
              scrollTrigger: {
                trigger: currentSection,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          },
        );

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
  id="service-detail-intro"
  aria-labelledby="service-detail-intro-title"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div
    class="sd-study-glow pointer-events-none absolute -left-56 top-[34%] size-[38rem] rounded-full bg-brand-green/15 blur-[125px]"
    aria-hidden="true"
  ></div>
  <div
    class="pointer-events-none absolute -right-40 bottom-[8%] size-[27rem] rounded-full bg-brand-green/8 blur-[110px]"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10">
    <div class="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <div class="lg:col-span-5">
        <div class="lg:sticky lg:top-28">
          <p
            class="sd-intro-copy font-mono text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-brand-green"
          >
            The color foundation
          </p>
          <h2
            id="service-detail-intro-title"
            class="sd-intro-copy mt-4 max-w-[10ch] font-display text-[clamp(2.8rem,5.2vw,5.15rem)] leading-[0.89] tracking-[-0.045em]"
          >
            {data.heading}
          </h2>

          <div class="mt-7 max-w-[34rem]">
            {#each data.paragraphs as paragraph}
              <p
                class="sd-intro-copy text-base leading-[1.7] text-brand-dark/64 sm:text-[1.03rem] [&+&]:mt-4"
              >
                {paragraph}
              </p>
            {/each}
          </div>

          {#if stages.length > 0}
            <div class="relative mt-9 max-w-[34rem] pl-9">
              <span
                class="absolute bottom-5 left-[0.42rem] top-5 w-px bg-brand-dark/12"
                aria-hidden="true"
              >
                <span
                  class="sd-study-progress block size-full origin-top bg-brand-green"
                ></span>
              </span>

              <ol>
                {#each stages as stage, index (stage.label)}
                  <li
                    class="sd-study-principle relative border-t border-brand-dark/10 py-4 first:border-t-0"
                  >
                    <span
                      class="absolute -left-9 top-[1.15rem] grid size-3.5 place-items-center rounded-full border border-brand-green/50 bg-brand-light"
                      aria-hidden="true"
                    >
                      <span class="size-1 rounded-full bg-brand-green"></span>
                    </span>
                    <p
                      class="font-mono text-[0.51rem] font-semibold uppercase tracking-[0.15em] text-brand-green"
                    >
                      Principle 0{index + 1}
                    </p>
                    <h3
                      class="mt-1.5 text-base font-semibold tracking-[-0.015em]"
                    >
                      {stage.label}
                    </h3>
                    <p class="mt-1.5 text-sm leading-6 text-brand-dark/53">
                      {stage.description}
                    </p>
                  </li>
                {/each}
              </ol>
            </div>
          {/if}
        </div>
      </div>

      {#if studyMedia && stages.length > 0}
        <div class="lg:sticky lg:top-28 lg:col-span-7 lg:self-start lg:pt-6">
          <figure
            class="sd-study-frame relative mx-auto aspect-square w-full max-w-[43rem] overflow-hidden rounded-[1.25rem] border border-brand-dark/10 bg-brand-dark shadow-[0_2.5rem_7rem_rgb(32_33_31/0.16)] [transform-style:preserve-3d]"
          >
            <img
              src={studyMedia.src}
              alt={studyMedia.alt}
              width={studyMedia.width}
              height={studyMedia.height}
              loading="lazy"
              class="sd-study-image absolute inset-0 size-full scale-[1.01] object-cover"
            />

            <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/62 via-transparent to-brand-dark/8"
              aria-hidden="true"
            ></div>
            <div
              class="sd-study-scan pointer-events-none absolute inset-x-[-12%] top-1/2 h-40 bg-gradient-to-b from-transparent via-brand-green/24 to-transparent blur-2xl"
              aria-hidden="true"
            ></div>

            <div
              class="sd-study-focus-field absolute inset-0"
              aria-hidden="true"
            >
              {#each stages as stage, index (stage.label)}
                <div class="sd-study-focus" data-focus={index + 1}>
                  <span class="sd-study-focus-line"></span>
                  <span class="sd-study-focus-label">{stage.label}</span>
                </div>
              {/each}
            </div>

            <figcaption
              class="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7"
            >
              <span
                class="max-w-[22ch] font-mono text-[0.52rem] font-semibold uppercase leading-5 tracking-[0.15em] text-brand-light/72"
              >
                Color is corrected as one connected system
              </span>
              <span
                class="rounded-full border border-brand-light/22 bg-brand-dark/40 px-3 py-1.5 font-mono text-[0.48rem] uppercase tracking-[0.14em] text-brand-light backdrop-blur-md"
              >
                Study 01
              </span>
            </figcaption>
          </figure>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .sd-study-focus {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    transform-origin: center;
  }

  .sd-study-focus[data-focus="1"] {
    right: 5%;
    top: 18%;
  }

  .sd-study-focus[data-focus="2"] {
    left: 5%;
    top: 45%;
    flex-direction: row-reverse;
  }

  .sd-study-focus[data-focus="3"] {
    right: 5%;
    top: 68%;
  }

  .sd-study-focus-line {
    width: clamp(2.3rem, 7vw, 5.5rem);
    height: 1px;
    background: color-mix(in srgb, var(--color-brand-light) 60%, transparent);
  }

  .sd-study-focus-label {
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 24%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-brand-dark) 48%, transparent);
    padding: 0.45rem 0.7rem;
    color: var(--color-brand-light);
    font-family: var(--font-mono);
    font-size: 0.48rem;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    backdrop-filter: blur(0.45rem);
  }

  @media (max-width: 639px) {
    .sd-study-focus-label {
      max-width: 8.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
