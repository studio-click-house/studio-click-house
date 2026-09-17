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
    fit?: "cover" | "contain";
    bg?: string;
  }

  const galleryItems: GalleryItem[] = [
    {
      id: "gal-1",
      src: "/images/services/model-beauty/model-rachel-gilbert-evening-dress-0081.webp",
      alt: "Crystal evening clutch bag vector clipping path and fine reflection balancing",
      title: "Crystal Evening Bag Retouch",
      category: "retouching",
      aspect: "tall",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-2",
      src: "/images/services/jewelry/jewelry-jules-textured-gold-earrings-03-after.webp",
      alt: "Macro textured gold earrings surface polish and reflection balancing",
      title: "Jules Textured Gold Earrings Retouch",
      category: "retouching",
      aspect: "wide",
      fit: "cover",
      bg: "bg-[#E8E8E8]",
    },
    {
      id: "gal-3",
      src: "/images/services/bags-accessories/accessories-astral-designer-sunglasses-side-profile-after.webp",
      alt: "Astral designer sunglasses side profile vector clipping path and isolation",
      title: "Astral Eyewear Sub-Pixel Clipping",
      category: "clipping-path",
      aspect: "wide",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-4",
      src: "/images/services/ghost-mannequin-apparel/apparel-tiny-big-sister-patterned-jumpsuit-flatlay-after.webp",
      alt: "Patterned jumpsuit fabric color matching and print calibration",
      title: "Pattern & Colorway Calibration",
      category: "color-correction",
      aspect: "tall",
      fit: "contain",
      bg: "bg-[#F3EADD]",
    },
    {
      id: "gal-5",
      src: "/images/services/bags-accessories/accessories-helen-kaminski-newport-straw-hat-3149-after.webp",
      alt: "Helen Kaminski artisan woven straw hat summer editorial lookbook retouching",
      title: "Helen Kaminski Summer Editorial Retouch",
      category: "retouching",
      aspect: "tall",
      fit: "cover",
      bg: "bg-[#B7B6B0]",
    },
    {
      id: "gal-6",
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-couture-ruffle-evening-gown-black-after.webp",
      alt: "Black couture ruffle evening gown invisible ghost mannequin composite",
      title: "Couture Ruffle Gown 3D Ghost Mannequin",
      category: "ghost-mannequin",
      aspect: "tall",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-7",
      src: "/images/services/model-beauty/model-corporate-headshot-executive-male-3683-after.webp",
      alt: "Corporate executive portrait natural skin retouching and lighting refinement",
      title: "Executive Commercial Portrait Retouch",
      category: "retouching",
      aspect: "tall",
      fit: "cover",
    },
    {
      id: "gal-8",
      src: "/images/services/bags-accessories/accessories-antony-morato-designer-footwear-3080.webp",
      alt: "Antony Morato designer leather footwear isolated with vector clipping",
      title: "Antony Morato Footwear Vector Path",
      category: "clipping-path",
      aspect: "square",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-9",
      src: "/images/portfolio/cgi-product-showcase.png",
      alt: "Studio Click House 3D CGI photorealistic product rendering with caustics",
      title: "Studio 3D CGI Product Modeling & Render",
      category: "cgi",
      aspect: "square",
      fit: "cover",
    },
    {
      id: "gal-10",
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-nadine-black-mini-dress-232-after.webp",
      alt: "Nadine designer mini dress fabric color correction and tone grading",
      title: "Nadine Mini Dress Tone Calibration",
      category: "color-correction",
      aspect: "tall",
      fit: "contain",
      bg: "bg-[#E8E8E8]",
    },
    {
      id: "gal-11",
      src: "/images/services/product-services/product-industrial-machinery-rack-server-cutout-after.webp",
      alt: "Industrial machinery rack server complex vector path extraction",
      title: "Technical Equipment Alpha Cutout",
      category: "clipping-path",
      aspect: "square",
      fit: "contain",
      bg: "bg-[#202020]",
    },
    {
      id: "gal-12",
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-printemps-zip-through-jacket-walnut-194-after.webp",
      alt: "Walnut zip-through jacket invisible ghost mannequin hollow neck insertion",
      title: "Printemps Zip Jacket 3D Neck Joint",
      category: "ghost-mannequin",
      aspect: "tall",
      fit: "contain",
      bg: "bg-[#F2ECE7]",
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
          class="group relative overflow-hidden rounded-2xl border border-brand-dark/10 {item.bg || 'bg-white'} text-left cursor-pointer aspect-[4/5] shadow-2xs hover:shadow-md transition-shadow duration-300 flex items-center justify-center {item.fit === 'cover' ? 'p-0' : 'p-4 sm:p-6'}"
          aria-label="View {item.title}"
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            class="h-full w-full {item.fit === 'cover' ? 'object-cover object-top' : 'object-contain'} transition-transform duration-700 ease-out group-hover:scale-105"
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
          class="h-full w-full object-contain max-h-[72vh] rounded-xl border border-white/10"
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
