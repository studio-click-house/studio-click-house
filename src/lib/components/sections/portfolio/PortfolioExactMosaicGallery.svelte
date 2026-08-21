<script lang="ts">
  import { X } from "lucide-svelte";
  import { tick } from "svelte";

  interface GalleryItem {
    src: string;
    alt: string;
    title: string;
    category: string;
  }

  const galleryItems: GalleryItem[] = [
    // Top Row (4 photos)
    {
      src: "/images/portfolio/photo-editing-showcase.png",
      alt: "Model beauty portrait profile retouch",
      title: "Model Beauty Profile",
      category: "Skin Retouching",
    },
    {
      src: "/images/work-fields/gallery/jewelry-retouching.jpg",
      alt: "Pearl bracelet and product styling retouch",
      title: "Jewelry Styling Detail",
      category: "Fine Jewelry",
    },
    {
      src: "/images/about/orbit/ai-product-compositing.jpg",
      alt: "Fashion accessory studio shoot",
      title: "Accessory Grading",
      category: "Color Correction",
    },
    {
      src: "/images/work-fields/gallery/product-retouching.jpg",
      alt: "Perfume glass bottle reflection",
      title: "Glassware Isolation",
      category: "Clipping Path",
    },
    // Bottom Row (3 photos)
    {
      src: "/images/work-fields/gallery/beauty-retouching.jpg",
      alt: "Beauty model during a professional makeup production",
      title: "Beauty Production",
      category: "Editorial Retouch",
    },
    {
      src: "/images/work-fields/gallery/fashion-color.jpg",
      alt: "Fashion model on a color-graded studio set",
      title: "Fashion Color Story",
      category: "Couture Campaign",
    },
    {
      src: "/images/portfolio/3d-cgi-showcase-v2.jpg",
      alt: "CGI perfume bottle with wireframe construction overlay",
      title: "CGI Product Finish",
      category: "3D & CGI",
    },
  ];

  let selectedImage = $state<GalleryItem | null>(null);
  let closeButton = $state<HTMLButtonElement | null>(null);

  function openImage(item: GalleryItem) {
    selectedImage = item;
  }

  function closeImage() {
    selectedImage = null;
  }

  $effect(() => {
    if (!selectedImage) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    void tick().then(() => closeButton?.focus());

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeImage();
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  });
</script>

<!-- Section 7: Tight 2-Tier Mosaic Gallery (Exact Match to Image Gallery Grid) -->
<section
  id="portfolio-mosaic-gallery"
  aria-label="Mosaic Craft Gallery"
  class="relative w-full bg-brand-light py-16 lg:py-24"
>
  <div class="site-shell relative z-10">
    <!-- Top Row of Mosaic (4 photos side-by-side matching image) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
      {#each galleryItems.slice(0, 4) as item (item.src)}
        <button
          type="button"
          onclick={() => openImage(item)}
          class="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-brand-dark/10 bg-brand-light text-left"
          aria-label="View {item.title}"
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            class="absolute inset-0 bg-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white"
          >
            <span
              class="font-mono text-[9px] uppercase tracking-wider text-brand-green font-semibold"
            >
              {item.category}
            </span>
            <span class="font-display text-xs sm:text-sm font-normal">
              {item.title}
            </span>
          </div>
        </button>
      {/each}
    </div>

    <!-- Bottom Row of Mosaic (3 photos: narrow portrait, wide landscape, square matching image) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
      <!-- Item 1: Narrow Portrait (3 cols) -->
      <button
        type="button"
        onclick={() => openImage(galleryItems[4])}
        class="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-brand-dark/10 bg-brand-light text-left md:col-span-3 md:h-full md:aspect-auto"
        aria-label="View {galleryItems[4].title}"
      >
        <img
          src={galleryItems[4].src}
          alt={galleryItems[4].alt}
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white"
        >
          <span
            class="font-mono text-[9px] uppercase tracking-wider text-brand-green font-semibold"
          >
            {galleryItems[4].category}
          </span>
          <span class="font-display text-xs sm:text-sm font-normal">
            {galleryItems[4].title}
          </span>
        </div>
      </button>

      <!-- Item 2: Wide Landscape (6 cols) -->
      <button
        type="button"
        onclick={() => openImage(galleryItems[5])}
        class="group relative aspect-[16/9] cursor-pointer overflow-hidden rounded-xl border border-brand-dark/10 bg-brand-light text-left md:col-span-6"
        aria-label="View {galleryItems[5].title}"
      >
        <img
          src={galleryItems[5].src}
          alt={galleryItems[5].alt}
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white"
        >
          <span
            class="font-mono text-[10px] uppercase tracking-wider text-brand-green font-semibold"
          >
            {galleryItems[5].category}
          </span>
          <span class="font-display text-base sm:text-lg font-normal">
            {galleryItems[5].title}
          </span>
        </div>
      </button>

      <!-- Item 3: Square/Standard (3 cols) -->
      <button
        type="button"
        onclick={() => openImage(galleryItems[6])}
        class="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-brand-dark/10 bg-brand-light text-left md:col-span-3 md:h-full md:aspect-auto"
        aria-label="View {galleryItems[6].title}"
      >
        <img
          src={galleryItems[6].src}
          alt={galleryItems[6].alt}
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white"
        >
          <span
            class="font-mono text-[9px] uppercase tracking-wider text-brand-green font-semibold"
          >
            {galleryItems[6].category}
          </span>
          <span class="font-display text-xs sm:text-sm font-normal">
            {galleryItems[6].title}
          </span>
        </div>
      </button>
    </div>
  </div>

  <!-- Lightbox Modal -->
  {#if selectedImage}
    <dialog
      open
      class="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-brand-dark/90 p-4 backdrop-blur-md"
      aria-label={selectedImage.title}
      onclick={(event) => {
        if (event.target === event.currentTarget) closeImage();
      }}
    >
      <div
        class="relative flex max-h-[90dvh] w-full max-w-4xl flex-col items-center overflow-hidden rounded-2xl border border-brand-dark/10 bg-brand-light p-4 shadow-2xl sm:p-6"
      >
        <button
          bind:this={closeButton}
          type="button"
          onclick={closeImage}
          class="absolute top-4 right-4 z-10 rounded-full bg-brand-dark/10 p-2 text-brand-dark hover:bg-brand-dark/20 transition-colors cursor-pointer"
          aria-label="Close lightbox"
        >
          <X class="size-5" />
        </button>

        <div
          class="flex max-h-[70dvh] w-full items-center justify-center overflow-hidden bg-brand-dark/5"
        >
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            class="max-h-[70dvh] w-auto object-contain"
          />
        </div>

        <div
          class="w-full mt-4 flex items-center justify-between pt-3 border-t border-brand-dark/10"
        >
          <div>
            <span
              class="font-mono text-[10px] uppercase tracking-widest text-brand-green font-semibold"
            >
              {selectedImage.category}
            </span>
            <h4 class="font-display text-xl font-normal text-brand-dark">
              {selectedImage.title}
            </h4>
          </div>
          <span class="font-mono text-xs text-brand-dark/50"
            >Studio Click House Archive</span
          >
        </div>
      </div>
    </dialog>
  {/if}
</section>
