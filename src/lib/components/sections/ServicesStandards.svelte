<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";
  import { serviceStandards } from "$lib/content/services";

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
          gsap.from(".standards-reveal", {
            autoAlpha: 0,
            y: 30,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          });

          gsap.fromTo(
            ".standards-image",
            { yPercent: -5, scale: 1.04 },
            {
              yPercent: 5,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
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
  bind:this={section}
  id="services-standards"
  aria-labelledby="services-standards-title"
  class="relative overflow-hidden bg-brand-light py-16 text-brand-dark sm:py-20 lg:py-24"
>
  <div class="site-shell">
    <header class="grid gap-8 pb-10 lg:grid-cols-12 lg:items-end lg:pb-12">
      <div class="standards-reveal lg:col-span-8">
        <h2
          id="services-standards-title"
          class="max-w-[18ch] font-display text-[clamp(2.6rem,3.6vw,4rem)] leading-[0.92] tracking-[-0.04em]"
        >
          Quality is a system, not a final check.
        </h2>
      </div>

      <p
        class="standards-reveal max-w-[35ch] text-sm leading-[1.7] text-brand-dark/65 lg:col-span-4 lg:justify-self-end lg:text-base"
      >
        Every asset moves through calibrated production, secure transfer, and
        senior review before it leaves the studio.
      </p>
    </header>

    <figure
      class="standards-reveal relative aspect-[16/8] max-h-[22rem] overflow-hidden rounded-[1.25rem] sm:aspect-[16/6] lg:aspect-[16/4]"
    >
      <img
        src={previewMedia.editingWorkspace.src}
        alt={previewMedia.editingWorkspace.alt}
        width={previewMedia.editingWorkspace.width}
        height={previewMedia.editingWorkspace.height}
        loading="lazy"
        class="standards-image absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
      />
    </figure>

    <div class="mt-12 grid gap-x-14 gap-y-10 sm:grid-cols-2 lg:mt-14">
      {#each serviceStandards as standard, index (standard.title)}
        <article
          id={`service-standard-${index + 1}`}
          class="standards-reveal group"
        >
          <h3
            class="font-display text-[clamp(1.65rem,2.4vw,2.65rem)] leading-[0.95] tracking-[-0.03em] transition-colors duration-300 group-hover:text-brand-green"
          >
            {standard.title}
          </h3>
          <p
            class="mt-3 max-w-[42ch] text-sm leading-[1.65] text-brand-dark/60"
          >
            {standard.description}
          </p>
        </article>
      {/each}
    </div>
  </div>
</section>
