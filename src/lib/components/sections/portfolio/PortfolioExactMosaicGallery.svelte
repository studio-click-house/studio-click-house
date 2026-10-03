<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { X } from "lucide-svelte";
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
    zoom?: boolean;
    isVideo?: boolean;
    poster?: string;
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
      id: "gal-v1",
      src: "/images/video-editing/Creating_fashion_commercial_video_1080p_20261002180624.mp4",
      poster: "/images/services/model-beauty/model-female-headshot-white-blouse-0997-after.webp",
      alt: "Commercial high-fashion studio video production and color grading",
      title: "Commercial Fashion Film",
      category: "video",
      aspect: "tall",
      fit: "cover",
      isVideo: true,
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
      id: "gal-v2",
      src: "/images/video-editing/Create_fashion_campaign_video_1080p_20261001180912.mp4",
      poster: "/images/services/model-beauty/beauty-fashion-editorial-night-glam-057-after.webp",
      alt: "Autumn high-fashion lookbook video montage and dynamic motion cuts",
      title: "Autumn Lookbook Motion Reel",
      category: "video",
      aspect: "tall",
      fit: "cover",
      isVideo: true,
    },
    {
      id: "gal-4",
      src: "/images/services/ghost-mannequin-apparel/apparel-tiny-big-sister-patterned-jumpsuit-flatlay-after.webp",
      alt: "Patterned jumpsuit fabric color matching and print calibration",
      title: "Pattern & Colorway Calibration",
      category: "color-correction",
      aspect: "tall",
      fit: "contain",
      bg: "bg-white",
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
      id: "gal-v3",
      src: "/images/video-editing/Creating_luxury_product_hero_film_20261002180255.mp4",
      poster: "/images/services/3d-cgi/graphical-fragrance-cgi.webp",
      alt: "Luxury fragrance bottle cinematic lighting choreography and hero commercial",
      title: "Luxury Fragrance Hero Film",
      category: "video",
      aspect: "tall",
      fit: "cover",
      isVideo: true,
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
      id: "gal-v4",
      src: "/images/video-editing/Macro_jewelry_retouching_focus_20260914143303.mp4",
      poster: "/images/services/jewelry/jewelry-jules-textured-gold-earrings-03-after.webp",
      alt: "Macro fine jewelry reflection control and gold shimmer cinematography",
      title: "Fine Jewelry Macro Film",
      category: "video",
      aspect: "square",
      fit: "cover",
      isVideo: true,
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
      id: "gal-v5",
      src: "/images/video-editing/Fashion_website_hero_film_1080p_20261002180020.mp4",
      poster: "/images/services/model-beauty/model-corporate-headshot-executive-male-3683-after.webp",
      alt: "Fashion brand digital website hero film motion design and lookbook pacing",
      title: "Digital Campaign Hero Film",
      category: "video",
      aspect: "wide",
      fit: "cover",
      isVideo: true,
    },
    {
      id: "gal-10",
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-nadine-black-mini-dress-232-after.webp",
      alt: "Nadine designer mini dress fabric color correction and tone grading",
      title: "Nadine Mini Dress Tone Calibration",
      category: "color-correction",
      aspect: "tall",
      fit: "cover",
      zoom: true,
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
      id: "gal-v6",
      src: "/images/video-editing/Fashion_e-commerce_video_montage_1080p_20261001184732.mp4",
      poster: "/images/services/ghost-mannequin-apparel/apparel-tiny-big-sister-patterned-jumpsuit-flatlay-after.webp",
      alt: "Rapid e-commerce apparel video montage and color harmonization",
      title: "Apparel Motion Lookbook",
      category: "video",
      aspect: "tall",
      fit: "cover",
      isVideo: true,
    },
    {
      id: "gal-12",
      src: "/images/services/model-beauty/model-black-silk-floral-slip-dress-27.webp",
      alt: "Editorial portrait of a model wearing a black floral silk slip dress",
      title: "Black Silk Slip Dress Editorial Retouch",
      category: "retouching",
      aspect: "tall",
      fit: "cover",
      bg: "bg-[#E8E8E8]",
    },
    {
      id: "gal-13",
      src: "/images/services/model-beauty/beauty-high-fashion-orchid-headpiece-portrait-after.webp",
      alt: "High-fashion beauty portrait with an orchid headpiece and refined skin retouching",
      title: "Orchid Headpiece Beauty Retouch",
      category: "retouching",
      aspect: "tall",
      fit: "cover",
    },
    {
      id: "gal-v7",
      src: "/images/video-editing/Cosmetic_jar_with_floating_gummies_20261001165911.mp4",
      poster: "/images/services/3d-product/3d-isometric-living-room-interior-soft-blue.webp",
      alt: "Cosmetic jar 3D kinetic motion simulation and liquid floating elements",
      title: "Cosmetic Jar 3D Kinetic Film",
      category: "video",
      aspect: "square",
      fit: "cover",
      isVideo: true,
    },
    {
      id: "gal-14",
      src: "/images/services/model-beauty/model-michael-lo-sordo-ivory-couture-0388.webp",
      alt: "Model in an ivory couture gown with polished editorial retouching",
      title: "Ivory Couture Editorial Retouch",
      category: "retouching",
      aspect: "tall",
      fit: "cover",
    },
    {
      id: "gal-15",
      src: "/images/services/bags-accessories/accessories-salinas-designer-sunglasses-front-view-after.webp",
      alt: "Salinas designer sunglasses isolated with a clean, precise edge",
      title: "Salinas Eyewear Clipping Path",
      category: "clipping-path",
      aspect: "wide",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-16",
      src: "/images/services/bags-accessories/accessories-adele-black-leather-bag-02-after.webp",
      alt: "Black leather designer bag isolated with clean contours and preserved texture",
      title: "Adele Leather Bag Clipping Path",
      category: "clipping-path",
      aspect: "tall",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-v8",
      src: "/images/video-editing/Model_holding_perfume_bottle_20261001165916.mp4",
      poster: "/images/services/model-beauty/model-black-silk-floral-slip-dress-27.webp",
      alt: "Model holding luxury perfume bottle commercial lighting and skin grading",
      title: "Luxury Perfume Commercial Cut",
      category: "video",
      aspect: "tall",
      fit: "cover",
      isVideo: true,
    },
    {
      id: "gal-17",
      src: "/images/services/ghost-mannequin-apparel/apparel-montmartre-stripe-maxi-dress-169-after.webp",
      alt: "Striped maxi dress with consistent fabric color and preserved pattern detail",
      title: "Montmartre Stripe Color Correction",
      category: "color-correction",
      aspect: "tall",
      fit: "cover",
    },
    {
      id: "gal-18",
      src: "/images/services/product-services/product-gem-whole-body-cream-deodorant-pink-cream-after.webp",
      alt: "Pink cream deodorant product image with balanced color and clean finish",
      title: "Gem Pink Cream Color Correction",
      category: "color-correction",
      aspect: "square",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-19",
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-4m-mens-tailored-coat-007-after.webp",
      alt: "Tailored men's coat displayed as a clean hollow-form ghost mannequin image",
      title: "Tailored Coat Ghost Mannequin",
      category: "ghost-mannequin",
      aspect: "tall",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-v9",
      src: "/images/services/3d-product/3d-animated-abstract-geometric-clay-spheres.mp4",
      poster: "/images/services/3d-product/3d-isometric-living-room-interior-pastel-peach.webp",
      alt: "Kinetic clay spheres 3D simulation and abstract material shading",
      title: "Kinetic Clay Spheres Motion",
      category: "video",
      aspect: "square",
      fit: "cover",
      isVideo: true,
    },
    {
      id: "gal-20",
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-greenpoint-knit-cardigan-ice-blue-after.webp",
      alt: "Ice-blue knit cardigan shaped and presented with a ghost mannequin finish",
      title: "Greenpoint Cardigan Ghost Mannequin",
      category: "ghost-mannequin",
      aspect: "tall",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-21",
      src: "/images/services/3d-product/3d-isometric-living-room-interior-soft-blue.webp",
      alt: "Soft-blue isometric living room rendered as a detailed 3D interior scene",
      title: "Soft Blue Interior CGI",
      category: "cgi",
      aspect: "square",
      fit: "cover",
    },
    {
      id: "gal-v10",
      src: "/images/video-editing/Fashion_editorial_montage_creation_1080p_20261001181249.mp4",
      poster: "/images/services/model-beauty/model-rachel-gilbert-evening-dress-0081.webp",
      alt: "Editorial master cut film montage and pacing revision",
      title: "Editorial Master Reel",
      category: "video",
      aspect: "tall",
      fit: "cover",
      isVideo: true,
    },
    {
      id: "gal-22",
      src: "/images/services/3d-product/3d-isometric-living-room-interior-forest-green.webp",
      alt: "Forest-green isometric living room rendered with detailed furniture and lighting",
      title: "Forest Green Interior CGI",
      category: "cgi",
      aspect: "square",
      fit: "cover",
    },
    {
      id: "gal-23",
      src: "/images/services/model-beauty/model-soleil-blue-summer-fashion-1834.webp",
      alt: "Model wearing blue summer fashion with polished editorial color and skin retouching",
      title: "Blue Summer Editorial Retouch",
      category: "retouching",
      aspect: "tall",
      fit: "cover",
    },
    {
      id: "gal-24",
      src: "/images/services/model-beauty/beauty-editorial-glam-makeup-retouch-0969-after.webp",
      alt: "Glamour beauty portrait with detailed makeup and natural skin retouching",
      title: "Glamour Beauty Editorial Retouch",
      category: "retouching",
      aspect: "tall",
      fit: "cover",
    },
    {
      id: "gal-25",
      src: "/images/services/bags-accessories/accessories-josel-trucker-hat-black-01.webp",
      alt: "Black trucker cap isolated with a clean product edge",
      title: "Josel Trucker Cap Clipping Path",
      category: "clipping-path",
      aspect: "square",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-26",
      src: "/images/services/bags-accessories/accessories-quinn-metallic-gold-bag-810-after.webp",
      alt: "Metallic gold handbag cleanly isolated with reflective details preserved",
      title: "Quinn Metallic Bag Clipping Path",
      category: "clipping-path",
      aspect: "tall",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-27",
      src: "/images/services/product-services/color-correction-coral-perfume-showcase.png",
      alt: "Coral perfume product image with balanced color and controlled highlights",
      title: "Coral Perfume Color Correction",
      category: "color-correction",
      aspect: "square",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-28",
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-royal-debut-navy-knit-top-after.webp",
      alt: "Navy knit top with corrected color and consistent garment detail",
      title: "Royal Debut Knitwear Color Correction",
      category: "color-correction",
      aspect: "tall",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-29",
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-boody-sleep-tee-lilac-0306-after.webp",
      alt: "Lilac sleep tee shaped and presented with a ghost mannequin finish",
      title: "Boody Sleep Tee Ghost Mannequin",
      category: "ghost-mannequin",
      aspect: "tall",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-30",
      src: "/images/services/ghost-mannequin-apparel/ghost-mannequin-antony-morato-winter-parka-brown-front-after.webp",
      alt: "Brown winter parka with a clean front-facing ghost mannequin composite",
      title: "Antony Morato Parka Ghost Mannequin",
      category: "ghost-mannequin",
      aspect: "tall",
      fit: "contain",
      bg: "bg-white",
    },
    {
      id: "gal-31",
      src: "/images/services/3d-product/3d-isometric-living-room-interior-coral-purple.webp",
      alt: "Coral and purple isometric living room rendered as a detailed 3D interior scene",
      title: "Coral Interior CGI",
      category: "cgi",
      aspect: "square",
      fit: "cover",
    },
    {
      id: "gal-32",
      src: "/images/services/3d-product/3d-isometric-living-room-interior-pastel-peach.webp",
      alt: "Pastel peach isometric living room rendered with detailed furniture and lighting",
      title: "Pastel Interior CGI",
      category: "cgi",
      aspect: "square",
      fit: "cover",
    },
  ];

  const categories = [
    { id: "all", label: "All Works" },
    { id: "retouching", label: "Editorial Retouch" },
    { id: "video", label: "Commercial Video" },
    { id: "clipping-path", label: "Vector Clipping" },
    { id: "color-correction", label: "Color Calibration" },
    { id: "ghost-mannequin", label: "Ghost Mannequin" },
    { id: "cgi", label: "3D CGI" },
  ] as const;

  let activeFilter = $state<string>("all");
  let visibleLimit = $state(12);
  let selectedImage = $state<GalleryItem | null>(null);
  let closeButton = $state<HTMLButtonElement | null>(null);

  const filteredItems = $derived(
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter)
  );
  const displayedItems = $derived(filteredItems.slice(0, visibleLimit));

  function selectCategory(category: string) {
    activeFilter = category;
    visibleLimit = 12;
  }

  function loadMore() {
    visibleLimit += 12;
  }

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
            const { isDesktop, isMobile, reduceMotion } = ctx.conditions!;
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
  class="relative w-full bg-brand-light py-12 sm:py-14 lg:py-16"
>
  <div class="site-shell relative z-10">
    <!-- Header & Interactive Category Filters -->
    <div class="mosaic-header-group flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 lg:mb-10">
      <div class="max-w-2xl">
        <span class="font-sans text-sm text-brand-dark/50 mb-3 block font-medium">
          Work Archive
        </span>
        <h2 class="font-sans text-3xl sm:text-5xl lg:text-6xl text-brand-dark leading-[1.05] tracking-tight font-semibold">
          Selected Productions
        </h2>
      </div>

      <!-- Clean Editorial Filter Tabs (Horizontally scrollable on mobile) -->
      <nav class="flex overflow-x-auto no-scrollbar sm:flex-wrap gap-4 sm:gap-6 border-b border-brand-dark/10 pb-2 w-full md:w-auto" aria-label="Portfolio Category Filter">
        {#each categories as cat (cat.id)}
          <button
            type="button"
            onclick={() => selectCategory(cat.id)}
            class="font-sans text-sm font-medium pb-1 transition-colors cursor-pointer border-b-2 -mb-2 shrink-0 {activeFilter === cat.id ? 'border-brand-green text-brand-dark font-bold' : 'border-transparent text-brand-dark/50 hover:text-brand-dark'}"
            aria-pressed={activeFilter === cat.id}
          >
            {cat.label}
          </button>
        {/each}
      </nav>
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {#each displayedItems as item (item.id)}
        <button
          type="button"
          onclick={() => openImage(item)}
          class="group relative overflow-hidden rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)] border border-brand-dark/10 {item.bg || 'bg-white'} text-left cursor-pointer aspect-[4/5] shadow-2xs hover:shadow-md transition-shadow duration-300 flex items-center justify-center"
          aria-label="View {item.title}"
        >
          {#if item.isVideo}
            <video
              src={item.src}
              poster={item.poster}
              autoplay
              muted
              loop
              playsinline
              preload="metadata"
              class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            >
              <track kind="captions" />
            </video>
          {:else}
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              class="absolute inset-0 h-full w-full {item.fit === 'cover' ? 'object-cover object-top' : 'object-contain'} {item.zoom ? 'scale-[1.06] group-hover:scale-[1.11]' : 'group-hover:scale-105'} transition-transform duration-700 ease-out"
            />
          {/if}

          <div class="absolute inset-0 bg-brand-dark/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white z-10">
            <div>
              <span class="font-sans text-xs text-brand-green font-semibold block mb-1">
                {item.category.replace("-", " ")}
              </span>
              <h3 class="font-sans text-lg text-white font-semibold">
                {item.title}
              </h3>
            </div>
          </div>
        </button>
      {/each}
    </div>

    {#if displayedItems.length < filteredItems.length}
      <div class="mt-14 flex flex-col items-center justify-center text-center">
        <Button
          type="button"
          onclick={loadMore}
          size="lg"
          class="bg-brand-dark px-8 font-sans text-sm text-brand-light hover:bg-brand-green hover:text-brand-dark font-semibold"
        >
          Load More Productions ({filteredItems.length - displayedItems.length} remaining)
        </Button>
      </div>
    {/if}
  </div>
</section>

<!-- Lightbox Modal -->
{#if selectedImage}
  <div
    role="dialog"
    aria-modal="true"
    aria-label="{selectedImage.title} preview"
    class="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/90 p-4 sm:p-6"
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
      class="relative z-10 flex max-h-[92vh] max-w-5xl w-full flex-col items-center overflow-hidden rounded-[2rem] bg-brand-dark border border-white/15 shadow-2xl"
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
        {#if selectedImage.isVideo}
          <video
            src={selectedImage.src}
            poster={selectedImage.poster}
            controls
            autoplay
            muted
            playsinline
            class="h-full w-full object-contain max-h-[72vh] rounded-[1.5rem] border border-white/10"
          >
            <track kind="captions" />
          </video>
        {:else}
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            class="h-full w-full object-contain max-h-[72vh] rounded-[1.5rem] border border-white/10"
          />
        {/if}
      </div>

      <div
        class="flex w-full items-center justify-between border-t border-white/10 bg-brand-dark px-6 py-4 text-brand-light"
      >
        <div>
          <span
            class="font-sans text-xs text-brand-green font-semibold"
          >
            {selectedImage.category.replace("-", " ")}
          </span>
          <h3 class="font-sans text-xl text-white font-semibold">
            {selectedImage.title}
          </h3>
        </div>
        <span class="font-sans text-xs text-brand-light/50">Studio Click House Archive</span>
      </div>
    </div>
  </div>
{/if}

<style>
  nav[aria-label="Portfolio Category Filter"] {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  nav[aria-label="Portfolio Category Filter"]::-webkit-scrollbar {
    display: none;
  }
</style>
