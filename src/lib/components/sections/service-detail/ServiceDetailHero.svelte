<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowRight, ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceDetailHeroData } from "$lib/types/service-detail";
  import { _ } from "svelte-i18n";

  let { data } = $props<{ data: ServiceDetailHeroData }>();
  let heroSection = $state<HTMLElement>();

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      const currentHero = heroSection;
      if (!active || !runtime || !currentHero) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(".sd-hero-kicker", {
              autoAlpha: 0,
              y: 16,
              duration: 0.6,
            })
            .from(
              ".sd-hero-title-line",
              {
                yPercent: 112,
                duration: 0.95,
                stagger: 0.08,
              },
              "-=0.35",
            )
            .from(
              ".sd-hero-copy-reveal",
              {
                autoAlpha: 0,
                y: 22,
                duration: 0.72,
                stagger: 0.08,
              },
              "-=0.55",
            )
            .from(
              ".sd-hero-media-card",
              {
                autoAlpha: 0,
                y: 30,
                scale: 0.96,
                duration: 0.82,
                stagger: 0.09,
              },
              "-=0.62",
            );

          const mediaStage = currentHero.querySelector<HTMLElement>(
            ".sd-hero-media-stage",
          );
          const movePrimaryX = gsap.quickTo(".sd-hero-media-primary", "x", {
            duration: 0.8,
            ease: "power3.out",
          });
          const movePrimaryY = gsap.quickTo(".sd-hero-media-primary", "y", {
            duration: 0.8,
            ease: "power3.out",
          });
          const moveSupportX = gsap.quickTo(".sd-hero-media-support", "x", {
            duration: 0.95,
            ease: "power3.out",
          });
          const moveSupportY = gsap.quickTo(".sd-hero-media-support", "y", {
            duration: 0.95,
            ease: "power3.out",
          });

          const moveMedia = (event: PointerEvent) => {
            if (!mediaStage) return;
            const bounds = mediaStage.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            movePrimaryX(x * 14);
            movePrimaryY(y * 12);
            moveSupportX(x * -10);
            moveSupportY(y * -8);
          };

          const resetMedia = () => {
            movePrimaryX(0);
            movePrimaryY(0);
            moveSupportX(0);
            moveSupportY(0);
          };

          mediaStage?.addEventListener("pointermove", moveMedia);
          mediaStage?.addEventListener("pointerleave", resetMedia);

          gsap.to(".sd-hero-copy-motion", {
            yPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: currentHero,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.to(".sd-hero-media-primary", {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: currentHero,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.to(".sd-hero-media-support", {
            yPercent: -14,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: currentHero,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          return () => {
            mediaStage?.removeEventListener("pointermove", moveMedia);
            mediaStage?.removeEventListener("pointerleave", resetMedia);
          };
        });

        return () => media.revert();
      }, currentHero);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  bind:this={heroSection}
  id="service-detail-hero"
  aria-labelledby="service-detail-hero-title"
  class="relative isolate min-h-dvh overflow-hidden bg-brand-dark pt-24 text-brand-light sm:pt-28"
>
  <div
    class="pointer-events-none absolute inset-0 opacity-45 [background:radial-gradient(ellipse_62%_56%_at_24%_42%,color-mix(in_srgb,var(--color-brand-green)_14%,transparent),transparent_58%)]"
    aria-hidden="true"
  ></div>
  <div
    class="sd-hero-glow pointer-events-none absolute -right-[10rem] top-[8%] size-[38rem] rounded-full bg-brand-green/20 opacity-80 blur-[100px]"
    aria-hidden="true"
  ></div>

  <div
    class="site-shell relative z-10 flex min-h-[calc(100dvh-6rem)] items-center py-12 sm:min-h-[calc(100dvh-7rem)] sm:py-14"
  >
    <div class="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-12">
      <div class="sd-hero-copy-motion lg:col-span-6">
        <p
          class="sd-hero-kicker font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-green"
        >
          {$_('serviceDetail.kicker') || 'Image post-production service'}
        </p>
        <h1
          id="service-detail-hero-title"
          class="mt-5 max-w-[9ch] font-display text-[clamp(4rem,7vw,7.8rem)] leading-[0.84] tracking-[-0.055em]"
        >
          <span class="block overflow-hidden pb-[0.08em]">
            <span class="sd-hero-title-line block">{data.title}</span>
          </span>
          <span class="block overflow-hidden pb-[0.08em]">
            <span class="sd-hero-title-line block text-brand-green">
              {data.titleAccent}
            </span>
          </span>
        </h1>

        <p
          class="sd-hero-copy-reveal mt-7 max-w-[44ch] text-base leading-7 text-brand-light/66 sm:text-lg"
        >
          {data.description}
        </p>

        <div class="sd-hero-copy-reveal mt-8 flex flex-wrap items-center gap-3">
          <a
            href={resolve("/contact")}
            class="group inline-flex min-h-12 items-center gap-3 rounded-[0.55rem] bg-brand-green px-6 text-sm font-semibold text-brand-dark transition-colors duration-300 hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
          >
            {$_('serviceDetail.placeOrder') || 'Place an order'}
            <ArrowUpRight
              class="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
          <a
            href={resolve("/pricing")}
            class="group inline-flex min-h-12 items-center gap-3 rounded-[0.55rem] border border-brand-light/22 px-5 text-sm font-semibold text-brand-light transition-colors duration-300 hover:border-brand-green hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
          >
            {$_('serviceDetail.getPriceIdea') || 'Get price idea'}
            <ArrowRight
              class="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>

      <div
        class="sd-hero-media-stage relative mx-auto w-full max-w-[42rem] lg:col-span-6 lg:mx-0 lg:justify-self-end"
      >
        <div
          class="pointer-events-none absolute inset-[8%] rounded-full bg-brand-green/24 blur-[86px]"
          aria-hidden="true"
        ></div>
        <div class="relative grid grid-cols-[1.12fr_0.88fr] gap-3 sm:gap-4">
          <figure
            class="sd-hero-media-card sd-hero-media-primary relative aspect-[4/5.25] overflow-hidden rounded-[1rem] border border-brand-light/10 bg-brand-light/5 shadow-2xl shadow-brand-dark/45"
          >
            <img
              src={data.media.src}
              alt={data.media.alt}
              width={data.media.width}
              height={data.media.height}
              class="size-full object-cover"
            />
          </figure>

          <div class="grid content-center gap-3 py-[8%] sm:gap-4">
            {#each data.supportingMedia.slice(0, 2) as item (item.src)}
              <figure
                class="sd-hero-media-card sd-hero-media-support relative aspect-[5/4] overflow-hidden rounded-[0.85rem] border border-brand-light/10 bg-brand-light/5 shadow-xl shadow-brand-dark/35"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  class="size-full object-cover"
                />
              </figure>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
