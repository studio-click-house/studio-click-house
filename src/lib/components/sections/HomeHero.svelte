<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowDown, ArrowUpRight } from "lucide-svelte";
  import BrandMarquee from "$lib/components/sections/BrandMarquee.svelte";
  import { previewMedia } from "$lib/content/media";

  let section: HTMLElement;

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    import("gsap").then(({ gsap }) => {
      if (!active || !section) return;
      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".hero-media", { scale: 1.08, duration: 1.6 })
            .from(
              ".hero-line",
              { yPercent: 110, duration: 1.05, stagger: 0.11 },
              0.18,
            )
            .from(
              ".hero-detail",
              { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.08 },
              0.65,
            );
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
  id="home-hero"
  bind:this={section}
  class="relative min-h-[100dvh] overflow-hidden bg-brand-dark text-brand-light"
>
  <img
    src={previewMedia.studioPortrait.src}
    alt={previewMedia.studioPortrait.alt}
    width={previewMedia.studioPortrait.width}
    height={previewMedia.studioPortrait.height}
    fetchpriority="high"
    class="hero-media absolute inset-0 size-full object-cover object-[58%_center] will-change-transform"
  />
  <div
    class="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,33,31,0.92)_0%,rgba(32,33,31,0.48)_50%,rgba(32,33,31,0.12)_100%)]"
  ></div>
  <div
    class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-dark/70 to-transparent"
  ></div>

  <div
    class="site-shell relative grid min-h-[100dvh] content-end pb-24 pt-32 sm:pb-28 lg:grid-cols-[1fr_19rem] lg:items-end lg:gap-10"
  >
    <div>
      <p class="hero-detail eyebrow mb-6 text-brand-green">
        Image editing · Retouching · Visual production
      </p>
      <h1
        class="max-w-[12ch] font-display text-[clamp(4rem,10.5vw,10.5rem)] leading-[0.82] tracking-[-0.05em]"
      >
        <span class="block overflow-hidden"
          ><span class="hero-line block">Every image,</span></span
        >
        <span class="block overflow-hidden"
          ><span class="hero-line block italic text-brand-green">finished</span
          ></span
        >
        <span class="block overflow-hidden"
          ><span class="hero-line block">with intent.</span></span
        >
      </h1>
    </div>

    <div class="hero-detail mt-10 border-t border-brand-light/30 pt-6 lg:mt-0">
      <p class="text-sm leading-relaxed text-brand-light/75 sm:text-base">
        Studio Click House shapes still and moving images for brands, studios,
        and production teams that care about the final frame.
      </p>
      <div class="mt-7 flex flex-wrap items-center gap-5">
        <a
          href={resolve("/contact")}
          class="inline-flex items-center gap-3 bg-brand-green px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition-transform active:scale-[0.98]"
          >Start a project <ArrowUpRight size={17} /></a
        >
        <a href={resolve("/#selected-work")} class="text-link text-brand-light"
          >See the work <ArrowDown size={15} /></a
        >
      </div>
    </div>
  </div>

  <BrandMarquee />

  <p
    class="absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-90 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-brand-light/55 xl:block"
  >
    Preview media · replace with approved studio work
  </p>
</section>
