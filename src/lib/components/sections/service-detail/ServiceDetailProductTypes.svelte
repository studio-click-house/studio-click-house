<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ServiceProductTypeItem } from "$lib/types/service-detail";

  const defaultItems: ServiceProductTypeItem[] = [
    {
      id: "apparel",
      code: "01",
      title: "Apparel & Fashion",
      subtitle: "Ghost mannequin, on-model fashion, and flat-lay garments.",
      src: "/images/product-types/product-type-apparel-jacket.webp",
      alt: "Apparel ghost mannequin jacket product retouching",
    },
    {
      id: "accessories",
      code: "02",
      title: "Accessories & Soft Goods",
      subtitle: "Silk scarves, eyewear, leather belts, and styling accessories.",
      src: "/images/product-types/product-type-accessories-scarf.webp",
      alt: "Luxury printed silk headscarf product clipping",
    },
    {
      id: "jewelry",
      code: "03",
      title: "Jewelry & Timepieces",
      subtitle: "Fine watches, precious metals, and gemstone reflections.",
      src: "/images/product-types/product-type-jewelry-watch.webp",
      alt: "Luxury wrist watch studio retouching and reflection control",
    },
    {
      id: "footwear",
      code: "04",
      title: "Footwear & Athletic",
      subtitle: "Performance sneakers, athletic cleats, and leather footwear.",
      src: "/images/product-types/product-type-footwear-sneaker.webp",
      alt: "Athletic sports sneaker footwear retouching",
    },
    {
      id: "hardlines",
      code: "05",
      title: "Hardlines & Homeware",
      subtitle: "Furniture, electronics, appliances, and packaged goods.",
      src: "/images/product-types/product-type-furniture-chair.webp",
      alt: "Classic wooden spindle chair homeware cutout",
    },
    {
      id: "denim",
      code: "06",
      title: "Denim & Tailoring",
      subtitle: "Indigo denim jeans, tailored trousers, and outerwear.",
      src: "/images/product-types/product-type-denim-jeans.webp",
      alt: "Indigo denim jeans flat-lay apparel editing",
    },
  ];

  let {
    eyebrow = "Catalog Scope",
    heading = "Built for every product type.",
    description = "From clean product cutouts to complex multi-layered edge isolation, our studio handles every product category with consistent, catalog-wide precision.",
    items = defaultItems,
  } = $props<{
    eyebrow?: string;
    heading?: string;
    description?: string;
    items?: ServiceProductTypeItem[];
  }>();

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
          gsap.from(".sd-pt-header", {
            autoAlpha: 0,
            y: 22,
            duration: 0.42,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: section,
              start: "top 95%",
              once: true,
            },
          });

          gsap.from(".sd-pt-item", {
            autoAlpha: 0,
            y: 24,
            duration: 0.4,
            stagger: 0.04,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: ".sd-pt-grid",
              start: "top 95%",
              once: true,
            },
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
  id="built-for-every-product-type"
  aria-labelledby="built-for-every-product-type-title"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-24 lg:py-28"
>
  <div class="site-shell relative z-10">
    <!-- Split Header matching Features reference -->
    <div
      class="sd-pt-header mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
    >
      <div>
        <span
          class="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-brand-dark/50"
        >
          {eyebrow}
        </span>
        <h2
          id="built-for-every-product-type-title"
          class="mt-3 max-w-[20ch] font-display text-[clamp(2.2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.04em] text-brand-dark"
        >
          {heading}
        </h2>
      </div>

      {#if description}
        <p
          class="shrink-0 max-w-[38ch] text-sm sm:text-base leading-relaxed text-brand-dark/65 lg:pb-0.5"
        >
          {description}
        </p>
      {/if}
    </div>

    <!-- Editorial 6-Item Visual Grid with Image Hover Text Overlay -->
    <div
      class="sd-pt-grid grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12"
    >
      {#each items as item (item.id)}
        <article class="sd-pt-item group flex flex-col">
          <!-- Image Stage matching Hero / Before-After rounded radius and border -->
          <div
            class="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-brand-dark/10 bg-white shadow-sm transition-all duration-500 ease-out group-hover:border-brand-dark/25 group-hover:shadow-md"
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              class="size-full object-contain"
            />

            <!-- Hover Text Overlay over the image -->
            <div
              class="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 sm:p-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span
                class="font-mono text-xs font-semibold tracking-wider text-white/60"
              >
                /{item.code}
              </span>
              <h3
                class="mt-1 translate-y-2 font-display text-lg font-extrabold uppercase tracking-tight text-white transition-transform duration-300 group-hover:translate-y-0 sm:text-xl"
              >
                {item.title}
              </h3>
              <p
                class="mt-1.5 text-xs leading-relaxed text-white/80 translate-y-2 transition-transform duration-300 delay-75 group-hover:translate-y-0 sm:text-sm"
              >
                {item.subtitle}
              </p>
            </div>
          </div>
          <h3
            class="mt-4 text-center font-display text-base font-extrabold uppercase tracking-tight text-brand-dark"
          >
            {item.title}
          </h3>
        </article>
      {/each}
    </div>
  </div>
</section>
