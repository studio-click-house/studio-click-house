<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowDown, ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { servicesHero } from "$lib/content/services";
  import { previewMedia } from "$lib/content/media";

  let heroSection = $state<HTMLElement>();

  const disciplines = [
    {
      index: "01",
      label: "Image editing",
      media: previewMedia.studioPortrait,
    },
    {
      index: "02",
      label: "Video post",
      media: previewMedia.videoColorGrading,
    },
    {
      index: "03",
      label: "3D & CGI",
      media: previewMedia.cgiProductShowcase,
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
            })
            .from(
              ".services-hero-media",
              {
                autoAlpha: 0,
                scale: 0.96,
                y: 32,
                duration: 1.05,
                transformOrigin: "center bottom",
              },
              "-=0.72",
            )
            .from(
              ".services-hero-meta",
              {
                autoAlpha: 0,
                y: 20,
                duration: 0.72,
                stagger: 0.07,
              },
              "-=0.68",
            );

          gsap.to(".services-hero-scroll-media", {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.to(".services-hero-text-motion", {
            y: -72,
            autoAlpha: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.to(".services-hero-media-row", {
            y: -20,
            scale: 0.975,
            transformOrigin: "center bottom",
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
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
  class="relative isolate min-h-dvh overflow-hidden bg-brand-dark pb-10 pt-24 text-brand-light sm:pb-12 sm:pt-28"
>
  <div
    class="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_76%_38%,color-mix(in_srgb,var(--color-brand-green)_18%,transparent),transparent_31%)]"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10">
    <div class="grid items-end gap-10 py-10 lg:grid-cols-12 lg:gap-8 lg:py-14">
      <div class="services-hero-text-motion lg:col-span-8">
        <h1
          id="services-hero-title"
          class="font-display text-[clamp(3.4rem,6.8vw,7.5rem)] leading-[0.84] tracking-[-0.05em]"
        >
          <span class="block overflow-hidden pb-[0.08em]">
            <span class="services-hero-title-line block"
              >Precision <em class="text-brand-green">finish.</em></span
            >
          </span>
          <span class="block overflow-hidden pb-[0.08em]">
            <span class="services-hero-title-line block">Built to scale.</span>
          </span>
        </h1>
      </div>

      <div
        class="services-hero-meta services-hero-text-motion lg:col-span-4 lg:self-end lg:pb-3"
      >
        <p
          class="max-w-[34rem] text-base leading-[1.6] text-brand-light/68 lg:max-w-[30ch]"
        >
          {servicesHero.description}
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-5">
          <a
            href={resolve("/contact")}
            class="group inline-flex min-h-12 items-center gap-3 rounded-full bg-brand-green px-6 text-sm font-semibold text-brand-dark transition-colors duration-300 hover:bg-brand-light focus-visible:outline-brand-green"
          >
            Discuss a project
            <ArrowUpRight
              class="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
          <a
            href="#services-details"
            class="group inline-flex items-center gap-2 border-b border-brand-light/35 pb-1 text-sm font-medium text-brand-light transition-colors duration-300 hover:border-brand-green hover:text-brand-green"
          >
            View capabilities
            <ArrowDown
              class="h-4 w-4 transition-transform group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </div>

    <div class="services-hero-media-row grid gap-4 lg:grid-cols-12 lg:gap-6">
      <figure
        class="services-hero-media relative aspect-[16/10] overflow-hidden rounded-[1rem] lg:col-span-6 lg:aspect-[16/8]"
      >
        <img
          src={servicesHero.media.src}
          alt={servicesHero.media.alt}
          width={servicesHero.media.width}
          height={servicesHero.media.height}
          class="services-hero-scroll-media h-[112%] w-full object-cover"
        />
      </figure>

      <div class="grid gap-2 sm:grid-cols-3 lg:col-span-6">
        {#each disciplines as discipline (discipline.index)}
          <a
            href={`#service-showcase-${discipline.index === "01" ? "photo" : discipline.index === "02" ? "video" : "3d"}`}
            class="services-hero-meta group relative flex min-h-36 items-end overflow-hidden rounded-[1rem] bg-brand-light/[0.045] p-4 transition-colors duration-300 sm:min-h-52 lg:min-h-full lg:p-5"
          >
            <img
              src={discipline.media.src}
              alt={discipline.media.alt}
              width={discipline.media.width}
              height={discipline.media.height}
              loading="lazy"
              class="services-hero-scroll-media absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <span
              class="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/10 to-brand-dark/35"
            ></span>
            <span
              class="relative z-[1] flex items-end justify-between gap-3 text-sm font-medium text-brand-light"
            >
              {discipline.label}
              <ArrowUpRight
                class="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </a>
        {/each}
      </div>
    </div>
  </div>
</section>
