<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { serviceStandards } from "$lib/content/services";
  import { _ } from "svelte-i18n";

  const productionGallery = [
    {
      src: "/images/work-fields/gallery/product-retouching.jpg",
      alt: "Product image production with controlled water and lighting effects",
    },
    {
      src: "/images/work-fields/gallery/jewelry-retouching.jpg",
      alt: "Jewelry and cosmetics arranged for detailed commercial retouching",
    },
    {
      src: "/images/work-fields/gallery/fashion-color.jpg",
      alt: "Fashion production scene under controlled studio lighting",
    },
  ] as const;

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

          const galleryImages = gsap.utils.toArray<HTMLElement>(
            ".standards-gallery-image",
          );

          galleryImages.forEach((image, index) => {
            const direction = index % 2 === 0 ? 1 : -1;

            gsap.fromTo(
              image,
              { yPercent: 7 * direction, scale: 1.08 },
              {
                yPercent: -7 * direction,
                scale: 1.01,
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
    <div class="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
      <div
        class="standards-reveal standards-gallery grid grid-cols-2 gap-3 lg:col-span-7 lg:h-[37rem] lg:grid-cols-7 lg:grid-rows-2"
      >
        {#each productionGallery as image, index (image.src)}
          <figure
            class="standards-gallery-frame relative overflow-hidden rounded-[1.5rem] {index ===
            0
              ? 'col-span-2 aspect-[4/3] lg:col-span-4 lg:row-span-2 lg:aspect-auto'
              : 'aspect-[4/3] lg:col-span-3 lg:aspect-auto'}"
          >
            <img
              src={image.src}
              alt={image.alt}
              width="1920"
              height="1080"
              loading="lazy"
              class="standards-gallery-image absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
            />
          </figure>
        {/each}
      </div>

      <div class="lg:col-span-5">
        <header>
          <div class="standards-reveal">
            <h2
              id="services-standards-title"
              class="max-w-[12ch] font-display text-[clamp(2.6rem,3.6vw,4rem)] leading-[0.92] tracking-[-0.04em]"
            >
              {$_('services.standards.heading') || 'Quality is a system, not a final check.'}
            </h2>
          </div>

          <p
            class="standards-reveal mt-6 max-w-[38ch] text-sm leading-[1.7] text-brand-dark/65 lg:text-base"
          >
            {$_('services.standards.description') || 'Every asset moves through calibrated production, secure transfer, and senior review before it leaves the studio.'}
          </p>
        </header>

        <div class="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
          {#each serviceStandards as standard, index (standard.title)}
            <article
              id={`service-standard-${index + 1}`}
              class="standards-reveal group pl-3 border-l-2 border-transparent transition-all duration-300 hover:border-brand-green/50 hover:translate-x-[3px]"
            >
              <h3
                class="text-[1rem] font-semibold tracking-[-0.02em] transition-colors duration-300 group-hover:text-brand-green sm:text-[1.05rem]"
              >
                {$_(`services.standards.items.${index}.title`) || standard.title}
              </h3>
              <p
                class="mt-2 max-w-[46ch] text-sm leading-[1.6] text-brand-dark/58"
              >
                {$_(`services.standards.items.${index}.description`) || standard.description}
              </p>
            </article>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
