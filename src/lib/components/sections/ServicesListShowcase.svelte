<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";
  import { services } from "$lib/content/home";
  import BeforeAfterSlider from "$lib/components/common/BeforeAfterSlider.svelte";

  type DivisionMedia =
    | {
        kind: "comparison";
        beforeSrc: string;
        beforeAlt: string;
        afterSrc: string;
        afterAlt: string;
        beforeLabel: string;
        afterLabel: string;
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
        beforeSrc: "/images/portfolio/model-raw.png",
        beforeAlt: "Original studio portrait before photo editing",
        afterSrc: "/images/portfolio/model-retouched.png",
        afterAlt:
          "Finished editorial portrait after professional color correction and skin retouching",
        beforeLabel: "Raw image",
        afterLabel: "Retouched",
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
        poster: previewMedia.editingWorkspace.src,
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
        kind: "image",
        src: previewMedia.cgiProductShowcaseV2.src,
        alt: previewMedia.cgiProductShowcaseV2.alt,
        width: previewMedia.cgiProductShowcaseV2.width,
        height: previewMedia.cgiProductShowcaseV2.height,
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

          chapters.forEach((chapter) => {
            const chapterContent =
              chapter.querySelector<HTMLElement>(".chapter-content");
            const isReverse = chapter.dataset.reverse === "true";

            if (chapterContent) {
              gsap.fromTo(
                chapterContent,
                { x: isReverse ? 52 : -52, autoAlpha: 0.35 },
                {
                  x: 0,
                  autoAlpha: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: chapter,
                    start: "top 92%",
                    end: "top 48%",
                    scrub: true,
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
                { y: 76, scale: 0.91 },
                {
                  y: -28,
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: chapter,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                },
              );
            }
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
    <h2 id="services-details-title" class="sr-only">Production services</h2>

    {#each divisions as division (division.id)}
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
              {division.title}
            </h3>
            <p
              class="mt-5 max-w-[38rem] text-[0.95rem] leading-[1.65] text-brand-dark/65 lg:max-w-[38ch]"
            >
              {division.description}
            </p>
            <a
              href={resolve("/contact")}
              class="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-dark/25 px-4 py-2 text-xs font-semibold transition-colors duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-light"
            >
              Plan this workflow
              <ArrowUpRight class="h-3.5 w-3.5" />
            </a>
          </header>

          <div class="chapter-services chapter-reveal mt-6 lg:mt-7">
            <div class="grid gap-x-8 sm:grid-cols-2">
              {#each division.services as service (service.slug)}
                <a
                  href={resolve("/services/[slug]", { slug: service.slug })}
                  class="group grid grid-cols-[1fr_auto] items-center gap-3 py-3 transition-colors duration-300 hover:text-brand-green"
                >
                  <span
                    class="text-sm font-medium tracking-[-0.01em] sm:text-base"
                  >
                    {service.title}
                  </span>
                  <ArrowUpRight
                    class="h-4 w-4 text-brand-dark/45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-green"
                  />
                </a>
              {/each}
            </div>
          </div>
        </div>

        <div
          class="chapter-media chapter-scroll-media w-full max-w-[28rem] justify-self-center"
        >
          {#if division.media.kind === "comparison"}
            <BeforeAfterSlider
              beforeSrc={division.media.beforeSrc}
              beforeAlt={division.media.beforeAlt}
              afterSrc={division.media.afterSrc}
              afterAlt={division.media.afterAlt}
              beforeLabel={division.media.beforeLabel}
              afterLabel={division.media.afterLabel}
              aspectRatio="aspect-[4/5]"
            />
          {:else if division.media.kind === "video"}
            <figure
              class="relative aspect-[4/5] overflow-hidden rounded-[clamp(0.85rem,1.5vw,1.25rem)] bg-brand-dark"
            >
              <video
                src={division.media.src}
                poster={division.media.poster}
                autoplay
                muted
                loop
                playsinline
                preload="metadata"
                class="h-full w-full object-cover"
                aria-label="Studio video editing and color grading preview"
              ></video>
            </figure>
          {:else}
            <figure
              class="relative aspect-[4/5] overflow-hidden rounded-[clamp(0.85rem,1.5vw,1.25rem)] bg-brand-dark"
            >
              <img
                src={division.media.src}
                alt={division.media.alt}
                width={division.media.width}
                height={division.media.height}
                loading="lazy"
                class="h-full w-full object-cover"
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
