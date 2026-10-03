<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowDown, ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { scrollToTarget } from "$lib/animations/lenis";
  import { servicesHero } from "$lib/content/services";
  import { stripTitlePunctuation } from "$lib/utils";
  import { _ } from "svelte-i18n";

  let heroSection = $state<HTMLElement>();

  function handleScroll(target: string) {
    scrollToTarget(target, { offset: -60 });
  }

  const disciplines = [
    {
      label: "AI photo editing",
      target: "#service-showcase-ai",
      media: {
        src: "/images/services/ai-retouching/ai-editorial-fashion.webp",
        alt: "Editorial fashion portrait with sculptural forest green and ivory tailoring",
        width: 1122,
        height: 1402,
      },
    },
    {
      label: "Image editing",
      target: "#service-showcase-photo",
      media: {
        src: "/images/services/model-beauty/beauty-editorial-glam-makeup-retouch-0969-after.webp",
        alt: "Finished editorial beauty portrait with refined makeup and skin retouching",
        width: 1500,
        height: 2000,
      },
    },
    {
      label: "Video post",
      target: "#service-showcase-video",
      media: {
        src: "/images/services/model-beauty/model-fashion-black-outfit-studio-63-after.webp",
        alt: "Finished fashion portrait prepared for commercial post-production",
        width: 1544,
        height: 2000,
      },
    },
    {
      label: "3D & CGI",
      target: "#service-showcase-3d",
      media: {
        src: "/images/services/3d-cgi/olive-metal-audio-speaker.webp",
        alt: "Photorealistic 3D render of an olive metal speaker with a woven acoustic grille",
        width: 1122,
        height: 1402,
      },
    },
  ];

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !heroSection) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".services-hero-title-line", {
              yPercent: 110,
              duration: 1.05,
              stagger: 0.08,
              delay: 0.12,
              clearProps: "all",
            })
            .from(
              ".services-hero-meta",
              {
                autoAlpha: 0,
                y: 18,
                duration: 0.65,
                stagger: 0.06,
                clearProps: "all",
              },
              "-=0.55",
            );
        });

        return () => media.revert();
      }, heroSection);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  bind:this={heroSection}
  id="services-hero"
  aria-labelledby="services-hero-title"
  class="relative isolate min-h-dvh overflow-hidden bg-brand-light pb-10 pt-24 text-brand-dark sm:pb-12 sm:pt-28 lg:h-dvh lg:min-h-0 lg:pb-4 lg:pt-20"
>
  <div class="site-shell relative z-10 lg:h-full">
    <div
      class="grid gap-x-10 gap-y-8 py-8 sm:py-10 lg:h-full lg:grid-cols-12 lg:items-center lg:gap-x-14 lg:py-4"
    >
      <div class="services-hero-text-motion lg:col-span-5">
        <p
          class="mb-6 font-sans text-sm font-medium text-brand-dark/50"
        >
          {$_("services.showcase.heading") || "Our services"}
        </p>
        <h1
          id="services-hero-title"
          class="font-sans font-bold tracking-[-0.045em] text-[clamp(3rem,5.5vw,5.5rem)] leading-[1.02] text-brand-dark"
        >
          <span class="block overflow-hidden pb-[0.12em]">
            <span class="services-hero-title-line block">
              {stripTitlePunctuation(
                $_("services.hero.heading1") || "Precision",
              )}
            </span>
          </span>
          <span class="block overflow-hidden pb-[0.12em]">
            <span class="services-hero-title-line block text-brand-green">
              {stripTitlePunctuation($_("services.hero.heading2") || "finish.")}
            </span>
          </span>
          <span class="mt-2 block overflow-hidden pb-[0.12em]">
            <span
              class="services-hero-title-line block text-[0.43em] font-semibold tracking-[-0.025em]"
            >
              {stripTitlePunctuation(
                $_("services.hero.heading3") || "Built to scale.",
              )}
            </span>
          </span>
        </h1>
        <p
          class="services-hero-meta mt-7 max-w-[34rem] text-base leading-[1.6] text-brand-dark/70"
        >
          {$_("services.hero.description") || servicesHero.description}
        </p>
        <div class="services-hero-meta mt-6 flex flex-wrap items-center gap-5">
          <Button href={resolve("/contact")} size="lg" class="group">
            {$_("services.hero.discussProject") || "Discuss a project"}
            <ArrowUpRight
              class="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Button>
          <a
            href="#services-details"
            onclick={(e) => {
              e.preventDefault();
              handleScroll("#services-details");
            }}
            class="group inline-flex items-center gap-2 border-b border-brand-dark/30 pb-1 text-sm font-medium text-brand-dark/85 transition-colors duration-300 hover:border-brand-green hover:text-brand-green"
          >
            {$_("services.hero.viewCapabilities") || "View capabilities"}
            <ArrowDown
              class="h-4 w-4 transition-transform group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </div>

      <div
        class="services-hero-media-row lg:col-span-7 lg:w-full lg:max-w-[40rem]"
      >
        <figure
          class="services-hero-media relative aspect-[4/3] overflow-hidden rounded-[var(--radius-media)] bg-brand-dark lg:aspect-[1.35]"
        >
          <img
            src="/images/editorial-retouching/beauty-fashion-neon-escalator-crystal-glam.webp"
            alt="Beauty fashion editorial portrait with crystal styling and neon escalator lighting"
            width={1600}
            height={2000}
            fetchpriority="high"
            class="services-hero-scroll-media absolute inset-0 h-full w-full object-cover object-top"
          />
        </figure>

        <nav
          class="services-hero-meta mt-5 grid grid-cols-1 gap-x-8 sm:grid-cols-2"
          aria-label="Service categories"
        >
          {#each disciplines as discipline, discIdx (discipline.label)}
            <a
              href={discipline.target}
              onclick={(e) => {
                e.preventDefault();
                handleScroll(discipline.target);
              }}
              class="group flex min-h-12 items-center justify-between gap-3 py-2 text-sm font-semibold text-brand-dark transition-colors duration-300 hover:text-brand-green sm:text-base"
            >
              <span class="flex items-center gap-3">
                <span class="font-sans text-xs text-brand-dark/40">
                  0{discIdx + 1}
                </span>
                {$_(`services.hero.disciplines.${discIdx}`) || discipline.label}
              </span>
              <ArrowUpRight
                class="h-4 w-4 shrink-0 text-brand-dark/45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-green"
              />
            </a>
          {/each}
        </nav>
      </div>
    </div>
  </div>
</section>
