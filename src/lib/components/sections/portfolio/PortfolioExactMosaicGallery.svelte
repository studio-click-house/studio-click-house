<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { X, ZoomIn } from "lucide-svelte";
  import { tick } from "svelte";
  import { _ } from "svelte-i18n";

  let gallerySection = $state<HTMLElement | null>(null);

  interface GalleryItem {
    id: string;
    src: string;
    alt: string;
    title: string;
    category: string;
    aspect: "square" | "tall" | "wide";
  }

  const galleryItems: GalleryItem[] = [
    {
      id: "gal-1",
      src: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Fashion model studio beauty portrait skin retouching",
      title: "Model Studio Beauty Retouch",
      category: "retouching",
      aspect: "tall",
    },
    {
      id: "gal-2",
      src: "https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Macro diamond ring polishing and sparkle enhancement",
      title: "Diamond Ring Luxury Retouch",
      category: "retouching",
      aspect: "wide",
    },
    {
      id: "gal-3",
      src: "https://images.pexels.com/photos/3989394/pexels-photo-3989394.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Glass perfume bottle isolated with natural drop shadow",
      title: "Perfume Glassware Isolation",
      category: "clipping-path",
      aspect: "wide",
    },
    {
      id: "gal-4",
      src: "https://images.pexels.com/photos/2738173/pexels-photo-2738173.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Fashion model posing under color corrected studio lights",
      title: "Editorial Silk Color Story",
      category: "color-correction",
      aspect: "tall",
    },
    {
      id: "gal-5",
      src: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Mechanical chronograph watch dial separated into vector paths",
      title: "Luxury Watch Multipath Mask",
      category: "clipping-path",
      aspect: "square",
    },
    {
      id: "gal-6",
      src: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
      alt: "Hollow tailored coat with invisible ghost mannequin collar composite",
      title: "Tailored Coat Ghost Mannequin",
      category: "ghost-mannequin",
      aspect: "tall",
    },
    {
      id: "gal-7",
      src: "https://images.pexels.com/photos/3762467/pexels-photo-3762467.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Female model skincare high-end facial skin retouching",
      title: "Skincare Luminescence Retouch",
      category: "retouching",
      aspect: "tall",
    },
    {
      id: "gal-8",
      src: "https://images.pexels.com/photos/1460838/pexels-photo-1460838.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "High heels luxury shoes isolated with vector clipping path",
      title: "Footwear Vector Clipping",
      category: "clipping-path",
      aspect: "square",
    },
    {
      id: "gal-9",
      src: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
      alt: "3D CGI cosmetic packaging render with studio reflections and glass caustics",
      title: "3D CGI Cosmetic Rendering",
      category: "cgi",
      aspect: "square",
    },
    {
      id: "gal-10",
      src: "https://images.pexels.com/photos/982585/pexels-photo-982585.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Model wearing color corrected silk evening dress",
      title: "Garment Hue & Swatch Shift",
      category: "color-correction",
      aspect: "tall",
    },
    {
      id: "gal-11",
      src: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Sneaker product isolated with clean clipping path",
      title: "Athletic Sneaker Path Isolation",
      category: "clipping-path",
      aspect: "square",
    },
    {
      id: "gal-12",
      src: "https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Black and white fashion model portrait retouch",
      title: "Monochrome Editorial Tone",
      category: "retouching",
      aspect: "tall",
    },
  ];

  const categories = [
    { id: "all", label: "All Works" },
    { id: "retouching", label: "Editorial Retouch" },
    { id: "clipping-path", label: "Vector Clipping" },
    { id: "color-correction", label: "Color Calibration" },
    { id: "ghost-mannequin", label: "Ghost Mannequin" },
    { id: "cgi", label: "3D CGI" },
  ] as const;

  let activeFilter = $state<string>("all");
  let selectedImage = $state<GalleryItem | null>(null);
  let closeButton = $state<HTMLButtonElement | null>(null);

  const filteredItems = $derived(
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter)
  );

  function openImage(item: GalleryItem) {
    selectedImage = item;
  }

  function closeImage() {
    selectedImage = null;
  }

  $effect(() => {
    if (!selectedImage) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    void tick().then(() => closeButton?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeImage();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  });

  $effect(() => {
    if (!gallerySection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !gallerySection) return;
      const { gsap } = runtime;
      const root = gallerySection;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add(
          {
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)",
            reduceMotion: "(prefers-reduced-motion: reduce)",
          },
          (ctx) => {
            const { isDesktop, isTablet, isMobile, reduceMotion } = ctx.conditions!;
            const header = root.querySelector(".mosaic-header-group");
            const tiles = root.querySelectorAll(".mosaic-item");

            if (reduceMotion) {
              gsap.set([header, ...tiles].filter(Boolean), { autoAlpha: 1, y: 0 });
              return;
            }

            if (isMobile) {
              if (header) {
                gsap.from(header, {
                  y: 34,
                  autoAlpha: 0,
                  duration: 0.75,
                  ease: "power2.out",
                  clearProps: "transform,opacity",
                  scrollTrigger: {
                    trigger: root,
                    start: "top 78%",
                    toggleActions: "play none none reverse",
                  },
                });
              }

              tiles.forEach((tile) => {
                gsap.from(tile, {
                  y: 36,
                  scale: 0.96,
                  autoAlpha: 0,
                  duration: 0.7,
                  ease: "power2.out",
                  clearProps: "transform,opacity",
                  scrollTrigger: {
                    trigger: tile,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                  },
                });
              });
            } else {
              const yOffset = isDesktop ? 34 : 26;
              const duration = isDesktop ? 0.85 : 0.75;

              if (header) {
                gsap.from(header, {
                  y: yOffset,
                  autoAlpha: 0,
                  duration,
                  ease: isDesktop ? "power3.out" : "power2.out",
                  clearProps: "transform,opacity",
                  scrollTrigger: {
                    trigger: root,
                    start: isDesktop ? "top 78%" : "top 80%",
                    toggleActions: "play none none reverse",
                  },
                });
              }

              tiles.forEach((tile) => {
                gsap.from(tile, {
                  y: yOffset,
                  scale: 0.97,
                  autoAlpha: 0,
                  duration,
                  ease: isDesktop ? "power3.out" : "power2.out",
                  clearProps: "transform,opacity",
                  scrollTrigger: {
                    trigger: tile,
                    start: "top 82%",
                    toggleActions: "play none none reverse",
                  },
                });
              });
            }
          }
        );
        return () => media.revert();
      }, root);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="portfolio-mosaic-gallery"
  bind:this={gallerySection}
  aria-label="Mosaic Craft Gallery"
  class="relative w-full bg-brand-light py-20 lg:py-32"
>
  <div class="site-shell relative z-10">
    <!-- Header & Interactive Category Filters -->
    <div class="mosaic-header-group flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 lg:mb-16">
      <div class="max-w-2xl">
        <span class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-green mb-3 block">
          Work Archive
        </span>
        <h2 class="font-display text-3xl sm:text-5xl lg:text-6xl font-normal text-brand-dark leading-[1] tracking-tight">
          Selected Productions
        </h2>
      </div>

      <!-- Clean Editorial Filter Tabs (Horizontally scrollable on mobile) -->
      <nav class="flex overflow-x-auto no-scrollbar sm:flex-wrap gap-4 sm:gap-6 border-b border-brand-dark/10 pb-2 w-full md:w-auto" aria-label="Portfolio Category Filter">
        {#each categories as cat (cat.id)}
          <button
            type="button"
            onclick={() => (activeFilter = cat.id)}
            class="font-mono text-xs uppercase tracking-wider pb-1 transition-colors cursor-pointer border-b-2 -mb-[9px] shrink-0 {activeFilter === cat.id ? 'border-brand-green text-brand-dark font-bold' : 'border-transparent text-brand-dark/50 hover:text-brand-dark'}"
            aria-pressed={activeFilter === cat.id}
          >
            {cat.label}
          </button>
        {/each}
      </nav>
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {#each filteredItems as item (item.id)}
        <button
          type="button"
          onclick={() => openImage(item)}
          class="group relative overflow-hidden rounded-2xl border border-brand-dark/10 bg-white text-left cursor-pointer aspect-[4/5] shadow-2xs hover:shadow-md transition-shadow duration-300"
          aria-label="View {item.title}"
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <!-- Editorial Gradient Overlay on Hover (Clean, No Floating Circular Pills) -->
          <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
            <div>
              <span class="font-mono text-[10px] uppercase tracking-widest text-brand-green font-semibold block mb-1">
                {item.category.replace("-", " ")}
              </span>
              <h3 class="font-display text-lg font-normal text-white">
                {item.title}
              </h3>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</section>

<!-- Lightbox Modal -->
{#if selectedImage}
  <div
    role="dialog"
    aria-modal="true"
    aria-label="{selectedImage.title} preview"
    class="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/90 p-4 sm:p-6 backdrop-blur-md"
    tabindex="-1"
  >
    <button
      type="button"
      class="fixed inset-0 h-full w-full cursor-default bg-transparent"
      onclick={closeImage}
      aria-label="{$_('portfolio.mosaic.closeModal') || 'Close preview'}"
      tabindex="-1"
    ></button>

    <div
      class="relative z-10 flex max-h-[92vh] max-w-5xl w-full flex-col items-center overflow-hidden rounded-3xl bg-brand-dark border border-white/15 shadow-2xl"
    >
      <button
        bind:this={closeButton}
        type="button"
        onclick={closeImage}
        class="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-brand-green hover:text-brand-dark transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-brand-green cursor-pointer"
        aria-label="{$_('portfolio.mosaic.closeModal') || 'Close preview'}"
      >
        <X class="h-5 w-5" />
      </button>

      <div class="max-h-[75vh] w-full overflow-hidden bg-black/40 flex items-center justify-center p-4">
        <img
          src={selectedImage.src}
          alt={selectedImage.alt}
          class="h-full w-full object-contain max-h-[72vh] rounded-xl"
        />
      </div>

      <div
        class="flex w-full items-center justify-between border-t border-white/10 bg-brand-dark px-6 py-4 text-brand-light"
      >
        <div>
          <span
            class="font-mono text-xs uppercase tracking-widest text-brand-green font-semibold"
          >
            {selectedImage.category.replace("-", " ")}
          </span>
          <h3 class="font-display text-xl font-normal text-white">
            {selectedImage.title}
          </h3>
        </div>
        <span class="font-mono text-xs text-brand-light/50">Studio Click House Archive</span>
      </div>
    </div>
  </div>
{/if}
