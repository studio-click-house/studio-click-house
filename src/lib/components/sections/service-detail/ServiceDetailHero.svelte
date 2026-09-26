<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowRight, ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceDetailHeroData } from "$lib/types/service-detail";
  import { cn } from "$lib/utils";
  import { _ } from "svelte-i18n";

  let { data } = $props<{ data: ServiceDetailHeroData }>();
  let heroSection = $state<HTMLElement>();
  const isLight = $derived(data.theme === "light");
  const titleWidthClass = $derived(
    data.titleWidth === "wide" ? "max-w-[11ch]" : "max-w-[9ch]",
  );
  const isFourFive = $derived(data.aspectRatio === "4/5");

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
          const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });

          if (currentHero.querySelector(".sd-hero-kicker")) {
            heroTl.from(".sd-hero-kicker", {
              autoAlpha: 0,
              y: 16,
              duration: 0.6,
              clearProps: "all",
            });
          }

          heroTl.from(
            ".sd-hero-title-line",
            {
              yPercent: 112,
              duration: 0.95,
              stagger: 0.08,
              clearProps: "all",
            },
            currentHero.querySelector(".sd-hero-kicker") ? "-=0.35" : 0,
          )
            .from(
              ".sd-hero-copy-reveal",
              {
                autoAlpha: 0,
                y: 22,
                duration: 0.72,
                stagger: 0.08,
                clearProps: "all",
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
                clearProps: "all",
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
            if (event.pointerType !== "mouse" || !mediaStage) return;
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

          // Desktop-only scrub
          media.add("(min-width: 1024px)", () => {
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
  class={cn(
    "relative isolate min-h-dvh overflow-hidden pt-24 sm:pt-28 transition-colors duration-300",
    isLight
      ? "bg-brand-light text-brand-dark"
      : "bg-brand-dark text-brand-light",
  )}
>
  <div
    class={cn(
      "pointer-events-none absolute inset-0",
      isLight
        ? "opacity-60 [background:radial-gradient(ellipse_62%_56%_at_24%_42%,rgba(126,166,65,0.08),transparent_58%)]"
        : "opacity-45 [background:radial-gradient(ellipse_62%_56%_at_24%_42%,color-mix(in_srgb,var(--color-brand-green)_14%,transparent),transparent_58%)]",
    )}
    aria-hidden="true"
  ></div>
  <div
    class={cn(
      "sd-hero-glow pointer-events-none absolute -right-[10rem] top-[8%] size-[38rem] rounded-full",
      isLight
        ? "bg-brand-green/10 opacity-70 blur-[120px]"
        : "bg-brand-green/20 opacity-80 blur-[100px]",
    )}
    aria-hidden="true"
  ></div>

  <div
    class="site-shell relative z-10 flex min-h-[calc(100dvh-6rem)] items-center py-12 sm:min-h-[calc(100dvh-7rem)] sm:py-14"
  >
    <div class="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-12">
      <div class="sd-hero-copy-motion lg:col-span-6">
        {#if data.kicker}
          <p
            class="sd-hero-kicker font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-green"
          >
            {data.kicker}
          </p>
        {/if}
        <h1
          id="service-detail-hero-title"
          class={cn(
            data.kicker ? "mt-5" : "",
            "font-display text-[clamp(4rem,7vw,7.8rem)] leading-[0.84] tracking-[-0.055em]",
            titleWidthClass,
          )}
        >
          <span class="block overflow-hidden pb-[0.08em]">
            <span
              class={cn(
                "sd-hero-title-line block",
                isLight ? "text-brand-dark" : "text-brand-light",
              )}
            >
              {data.title}
            </span>
          </span>
          <span class="block overflow-hidden pb-[0.08em]">
            <span class="sd-hero-title-line block text-brand-green">
              {data.titleAccent}
            </span>
          </span>
        </h1>

        <p
          class={cn(
            "sd-hero-copy-reveal mt-7 max-w-[44ch] text-base leading-7 sm:text-lg",
            isLight ? "text-brand-dark/70" : "text-brand-light/66",
          )}
        >
          {data.description}
        </p>

        <div class="sd-hero-copy-reveal mt-8 flex flex-wrap items-center gap-3">
          <a
            href={resolve("/contact")}
            class={cn(
              "group inline-flex min-h-12 items-center gap-3 rounded-[0.55rem] bg-brand-green px-6 text-sm font-semibold text-brand-dark transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green",
              isLight
                ? "hover:bg-brand-dark hover:text-white"
                : "hover:bg-brand-light",
            )}
          >
            {$_("serviceDetail.placeOrder") || "Place an order"}
            <ArrowUpRight
              class="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
          <a
            href={resolve("/pricing")}
            class={cn(
              "group inline-flex min-h-12 items-center gap-3 rounded-[0.55rem] px-5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green",
              isLight
                ? "border border-brand-dark/20 bg-white/70 text-brand-dark hover:border-brand-green hover:text-brand-green hover:bg-white"
                : "border border-brand-light/22 text-brand-light hover:border-brand-green hover:text-brand-green",
            )}
          >
            {$_("serviceDetail.getPriceIdea") || "Get price idea"}
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
          class={cn(
            "pointer-events-none absolute inset-[8%] rounded-full blur-[86px]",
            isLight ? "bg-brand-green/12" : "bg-brand-green/24",
          )}
          aria-hidden="true"
        ></div>
        <div
          class={cn(
            "relative grid items-center gap-3 sm:gap-4",
            isFourFive
              ? "grid-cols-[2.05fr_1fr]"
              : "grid-cols-[1.12fr_0.88fr]",
          )}
        >
          <figure
            class={cn(
              "sd-hero-media-card sd-hero-media-primary relative overflow-hidden rounded-[2rem] transition-all duration-300",
              isFourFive
                ? "aspect-[4/5] p-0"
                : (data.mediaFit === "cover" ? "aspect-[3/3.85] p-0" : "aspect-[3/3.85] p-3 sm:p-5"),
              isLight
                ? "border border-brand-dark/10 bg-white shadow-xl shadow-brand-dark/6"
                : "border border-brand-light/10 bg-brand-light/5 shadow-2xl shadow-brand-dark/45",
            )}
          >
            <img
              src={data.media.src}
              alt={data.media.alt}
              width={data.media.width}
              height={data.media.height}
              class={cn(
                "size-full",
                isFourFive || data.mediaFit === "cover" ? "object-cover" : "object-contain",
              )}
            />
          </figure>

          <div
            class={cn(
              "grid content-center gap-3 sm:gap-4",
              !isFourFive && "py-[3%]",
            )}
          >
            {#each data.supportingMedia.slice(0, 2) as item (item.src)}
              <figure
                class={cn(
                  "sd-hero-media-card sd-hero-media-support relative overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] transition-all duration-300",
                  isFourFive
                    ? "aspect-[4/5] p-0"
                    : (item.width > item.height
                        ? "aspect-[4/3] p-0"
                        : "aspect-[4/3.15] p-2.5 sm:p-3.5"),
                  isLight
                    ? "border border-brand-dark/10 bg-white shadow-lg shadow-brand-dark/5"
                    : "border border-brand-light/10 bg-brand-light/5 shadow-xl shadow-brand-dark/35",
                )}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  class={cn(
                    "size-full",
                    isFourFive || item.width > item.height
                      ? "object-cover"
                      : "object-contain",
                  )}
                />
              </figure>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
