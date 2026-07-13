<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";

  let section: HTMLElement;
  let imageMedia: HTMLDivElement;
  let monochromeLayer: HTMLImageElement;

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !imageMedia || !monochromeLayer)
        return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                end: "bottom 45%",
                scrub: 0.85,
              },
            });

            timeline
              .fromTo(
                imageMedia,
                { scale: 0.84, yPercent: 5 },
                { scale: 1, yPercent: 0, ease: "none" },
                0,
              )
              .fromTo(
                monochromeLayer,
                { autoAlpha: 1 },
                { autoAlpha: 0.16, ease: "none" },
                0.08,
              );
          },
        );

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
  id="studio-introduction"
  bind:this={section}
  aria-labelledby="studio-introduction-title"
  class="section-space bg-brand-paper"
>
  <div class="site-shell grid gap-14 lg:grid-cols-12 lg:items-start">
    <div class="lg:col-span-4 lg:pt-16">
      <p class="eyebrow text-brand-green">Studio introduction</p>
      <p
        data-scroll-copy
        class="mt-7 max-w-sm text-sm leading-relaxed text-brand-dark/60"
      >
        A focused post-production partner for people building campaigns,
        catalogs, editorial stories, and visual systems.
      </p>
      <a href={resolve("/about")} data-scroll-copy class="text-link mt-8"
        >Meet the studio <ArrowUpRight size={16} /></a
      >
    </div>

    <div class="lg:col-span-8">
      <h2
        id="studio-introduction-title"
        class="font-display text-[clamp(3.2rem,7vw,7.75rem)] leading-[0.92] tracking-[-0.04em]"
      >
        The polish should never overpower the picture.
      </h2>
      <div class="mt-10 grid gap-7 sm:grid-cols-[1.2fr_0.8fr] sm:items-end">
        <figure class="relative">
          <div class="about-image-stage overflow-hidden bg-brand-dark">
            <div
              bind:this={imageMedia}
              class="about-image-media relative origin-center will-change-transform"
            >
              <img
                src={previewMedia.monochromePortrait.src}
                alt={previewMedia.monochromePortrait.alt}
                width={previewMedia.monochromePortrait.width}
                height={previewMedia.monochromePortrait.height}
                loading="lazy"
                class="aspect-[4/5] w-full object-cover"
              />
              <img
                bind:this={monochromeLayer}
                src={previewMedia.monochromePortrait.src}
                alt=""
                aria-hidden="true"
                width={previewMedia.monochromePortrait.width}
                height={previewMedia.monochromePortrait.height}
                loading="lazy"
                class="absolute inset-0 aspect-[4/5] w-full object-cover grayscale will-change-[opacity]"
              />
            </div>
          </div>
          <span
            class="absolute -left-3 -top-3 size-8 border-l border-t border-brand-coral"
            aria-hidden="true"
          ></span>
          <figcaption
            class="mt-3 flex justify-between gap-4 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-brand-dark/50"
          >
            <span>Temporary editorial study</span><span>Proof 01</span>
          </figcaption>
        </figure>
        <div
          data-scroll-copy
          class="space-y-5 text-base leading-relaxed text-brand-dark/70"
        >
          <p>
            Studio Click House supports image editing, retouching, and visual
            production with attention to material, light, color, and the way
            each frame belongs to the wider brand.
          </p>
          <p>
            The work is collaborative and production-minded: understand the
            intended use, agree on a visual reference, then carry those
            decisions consistently through the set.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
