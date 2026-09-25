<script lang="ts">
  /* eslint-disable svelte/no-navigation-without-resolve -- resolveServiceHref returns a resolved pathname. */
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { resolveServiceHref } from "$lib/content/service-pages";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";
  import { services } from "$lib/content/home";
  import BeforeAfterSlider from "$lib/components/common/BeforeAfterSlider.svelte";
  import ShowcaseProduct3DViewer from "$lib/components/common/ShowcaseProduct3DViewer.svelte";
  import { _ } from "svelte-i18n";

  type DivisionMedia =
    | {
        kind: "comparison";
        beforeSrc: string;
        beforeAlt: string;
        afterSrc: string;
        afterAlt: string;
        beforeLabel: string;
        afterLabel: string;
        width: number;
        height: number;
      }
    | {
        kind: "video";
        src: string;
        poster: string;
      }
    | {
        kind: "image";
        src: string;
        alt: string;
        width: number;
        height: number;
      }
    | {
        kind: "3d";
        modelPath?: string;
      };

  const divisions: Array<{
    id: string;
    title: string;
    description: string;
    reverse: boolean;
    services: typeof services;
    media: DivisionMedia;
  }> = [
    {
      id: "service-showcase-photo",
      title: "Every pixel, resolved.",
      description:
        "High-volume image finishing with the restraint required for fashion, jewelry, product, and campaign work.",
      reverse: false,
      services: services.filter(
        (service) => service.category === "Image Editing",
      ),
      media: {
        kind: "comparison",
        beforeSrc: "/images/services/product-services/product-industrial-metal-storage-rack-shelving-before.webp",
        beforeAlt: "Storage rack photographed in its original outdoor setting",
        afterSrc: "/images/services/product-services/product-industrial-metal-storage-rack-shelving-after.webp",
        afterAlt: "Same storage rack isolated on a clean white background",
        beforeLabel: "Raw image",
        afterLabel: "Retouched",
        width: 1506,
        height: 2000,
      },
    },
    {
      id: "service-showcase-video",
      title: "Motion with a clear point of view.",
      description:
        "Commercial edits, campaign films, and platform-ready cutdowns shaped through pacing, sound, and calibrated color.",
      reverse: true,
      services: services.filter(
        (service) => service.category === "Video Editing",
      ),
      media: {
        kind: "video",
        src: "/videos/editing-video-720p.webm",
        poster: "/images/services/model-beauty/model-menswear-streetwear-studio-127.webp",
      },
    },
    {
      id: "service-showcase-3d",
      title: "Built before it exists.",
      description:
        "Accurate models, considered materials, and photorealistic product scenes created for launches, catalogs, and campaigns.",
      reverse: false,
      services: services.filter(
        (service) => service.category === "3D Modeling",
      ),
      media: {
        kind: "3d",
        modelPath: "/models/SheenChair.glb",
      },
    },
  ];

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
          const chapters = gsap.utils.toArray<HTMLElement>(".service-chapter");

          // Desktop (min-width: 1024px): horizontal slide & subtle media scrub
          media.add("(min-width: 1024px)", () => {
            chapters.forEach((chapter) => {
              const chapterContent =
                chapter.querySelector<HTMLElement>(".chapter-content");
              const isReverse = chapter.dataset.reverse === "true";

              if (chapterContent) {
                gsap.fromTo(
                  chapterContent,
                  { x: isReverse ? 40 : -40, autoAlpha: 0.35 },
                  {
                    x: 0,
                    autoAlpha: 1,
                    ease: "power2.out",
                    clearProps: "all",
                    scrollTrigger: {
                      trigger: chapter,
                      start: "top 88%",
                      end: "top 52%",
                      scrub: 1,
                    },
                  },
                );
              }

              const chapterMedia = chapter.querySelector<HTMLElement>(
                ".chapter-scroll-media",
              );

              if (chapterMedia) {
                gsap.fromTo(
                  chapterMedia,
                  { y: 50, scale: 0.94 },
                  {
                    y: -20,
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                      trigger: chapter,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 1,
                    },
                  },
                );
              }
            });
          });

          // Mobile & Tablet (max-width: 1023px): vertical reveal without horizontal jitter
          media.add("(max-width: 1023px)", () => {
            chapters.forEach((chapter) => {
              const chapterContent =
                chapter.querySelector<HTMLElement>(".chapter-content");
              const chapterMedia = chapter.querySelector<HTMLElement>(
                ".chapter-scroll-media",
              );

              if (chapterContent) {
                gsap.fromTo(
                  chapterContent,
                  { y: 28, autoAlpha: 0 },
                  {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.75,
                    ease: "power2.out",
                    clearProps: "all",
                    scrollTrigger: {
                      trigger: chapter,
                      start: "top 88%",
                      once: true,
                    },
                  },
                );
              }

              if (chapterMedia) {
                gsap.fromTo(
                  chapterMedia,
                  { y: 30, autoAlpha: 0 },
                  {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    clearProps: "all",
                    scrollTrigger: {
                      trigger: chapter,
                      start: "top 85%",
                      once: true,
                    },
                  },
                );
              }
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
  id="services-details"
  aria-labelledby="services-details-title"
  class="bg-brand-light text-brand-dark"
>
  <div class="site-shell">
    <h2 id="services-details-title" class="sr-only">{$_('services.showcase.heading') || 'Production services'}</h2>

    {#each divisions as division, divIdx (division.id)}
      <article
        id={division.id}
        class="service-chapter grid gap-y-10 py-16 sm:py-18 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:py-16"
        data-reverse={division.reverse}
      >
        <div class="chapter-content">
          <header class="chapter-copy chapter-reveal">
            <h3
              class="max-w-[12ch] font-display text-[clamp(2.5rem,3.8vw,4.35rem)] leading-[0.9] tracking-[-0.04em]"
            >
              {$_(`services.showcase.divisions.${divIdx}.title`) || division.title}
            </h3>
            <p
              class="mt-5 max-w-[38rem] text-[0.95rem] leading-[1.65] text-brand-dark/65 lg:max-w-[38ch]"
            >
              {$_(`services.showcase.divisions.${divIdx}.description`) || division.description}
            </p>
            <a
              href={resolve("/contact")}
              class="mt-6 inline-flex items-center gap-2 rounded-[0.55rem] border border-brand-dark/25 px-4 py-2 text-xs font-semibold transition-colors duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-light"
            >
              {$_('services.showcase.planWorkflow') || 'Plan this workflow'}
              <ArrowUpRight class="h-3.5 w-3.5" />
            </a>
          </header>

          <div class="chapter-services chapter-reveal mt-6 lg:mt-7">
            <div class="grid gap-x-8 sm:grid-cols-2">
              {#each division.services as service (service.slug)}
                <a
                  href={resolveServiceHref(service.slug)}
                  class="group grid grid-cols-[1fr_auto] items-center gap-3 py-3 transition-colors duration-300 hover:text-brand-green {service.slug ===
                  'ai-retouch'
                    ? 'rounded-lg border border-brand-green/40 bg-brand-green/[0.04] px-3 my-0.5 shadow-[0_0_12px_rgba(126,166,65,0.08)]'
                    : ''}"
                >
                  <span
                    class="text-sm font-medium tracking-[-0.01em] sm:text-base {service.slug ===
                    'ai-retouch'
                      ? 'text-brand-green font-semibold'
                      : ''}"
                  >
                    {service.title}
                  </span>
                  <ArrowUpRight
                    class="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-green {service.slug ===
                    'ai-retouch'
                      ? 'text-brand-green'
                      : 'text-brand-dark/45'}"
                  />
                </a>
              {/each}
            </div>
          </div>
        </div>

        <div
          class="chapter-media chapter-scroll-media relative w-full max-w-[28rem] sm:max-w-[32rem] lg:max-w-[28rem] justify-self-center"
        >
          {#if division.media.kind === "comparison"}
            <BeforeAfterSlider
              beforeSrc={division.media.beforeSrc}
              beforeAlt={division.media.beforeAlt}
              afterSrc={division.media.afterSrc}
              afterAlt={division.media.afterAlt}
              beforeLabel={division.media.beforeLabel}
              afterLabel={division.media.afterLabel}
              width={division.media.width}
              height={division.media.height}
              beforeWidth={division.media.width}
              beforeHeight={division.media.height}
              ariaLabel="Compare the original storage rack photo with its cleaned product cutout"
            />
          {:else if division.media.kind === "video"}
            <figure
              class="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-brand-dark/10 bg-brand-dark shadow-xl shadow-brand-dark/5"
            >
              <video
                poster={division.media.poster}
                autoplay
                muted
                loop
                playsinline
                preload="auto"
                class="h-full w-full rounded-[2rem] object-cover"
                aria-label="Studio video editing and color grading preview"
                onloadedmetadata={(e) => {
                  const v = e.currentTarget;
                  v.muted = true;
                  v.play().catch(() => {});
                }}
              >
                <source src="/videos/editing_video.mp4" type="video/mp4" />
                <source src="/videos/editing-video-720p.webm" type="video/webm" />
              </video>
            </figure>
          {:else if division.media.kind === "3d"}
            <ShowcaseProduct3DViewer modelPath={division.media.modelPath} />
          {:else}
            <figure
              class="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-brand-dark/10 bg-brand-dark shadow-xl shadow-brand-dark/5"
            >
              <img
                src={division.media.src}
                alt={division.media.alt}
                width={division.media.width}
                height={division.media.height}
                loading="lazy"
                class="h-full w-full rounded-[2rem] object-cover"
              />
            </figure>
          {/if}
        </div>
      </article>
    {/each}
  </div>
</section>

<style>
  @media (min-width: 1024px) {
    .service-chapter .chapter-content {
      grid-column: 1 / 7;
    }

    .service-chapter .chapter-media {
      grid-column: 8 / 13;
      justify-self: end;
    }

    .service-chapter[data-reverse="true"] .chapter-content {
      grid-column: 7 / 13;
    }

    .service-chapter[data-reverse="true"] .chapter-media {
      grid-column: 1 / 6;
      grid-row: 1;
      justify-self: start;
    }
  }
</style>
