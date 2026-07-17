<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { resolve } from "$app/paths";
  import {
    Camera,
    Video,
    Layers,
    ChevronRight,
    ArrowUpRight,
  } from "lucide-svelte";
  import { services } from "$lib/content/home";

  let { isOpen = false, onClose } = $props<{
    isOpen: boolean;
    onClose: () => void;
  }>();

  let activeCategory = $state<
    "Image Editing" | "Video Editing" | "3D Modeling"
  >("Image Editing");
  let activeServiceSlug = $state<string>("background-remove");
  let menuContainer = $state<HTMLDivElement>();
  let gsapModule = $state<any>(null);

  // Group services by category
  const activeCategoryServices = $derived(
    services.filter((s) => s.category === activeCategory),
  );

  const categories = [
    {
      id: "Image Editing" as const,
      label: "Photo Editing",
      description: "Precision Photoshop & retouching at scale",
      icon: Camera,
    },
    {
      id: "Video Editing" as const,
      label: "Video Editing",
      description: "Cinematic cuts, grading & social reels",
      icon: Video,
    },
    {
      id: "3D Modeling" as const,
      label: "3D Product Modeling",
      description: "CGI rendering, shading & design",
      icon: Layers,
    },
  ];

  const previewRevealVariants = [
    { clipPath: "inset(0% 100% 0% 0%)", x: -24, y: 0 },
    { clipPath: "inset(0% 0% 0% 100%)", x: 24, y: 0 },
    { clipPath: "inset(100% 0% 0% 0%)", x: 0, y: 20 },
    { clipPath: "inset(0% 0% 100% 0%)", x: 0, y: -20 },
  ] as const;

  onMount(() => {
    import("gsap").then((m) => {
      gsapModule = m.gsap;
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  // Open/Close Dropdown Panel Animation
  $effect(() => {
    if (!browser || !gsapModule || !menuContainer) return;
    const gsap = gsapModule;

    if (isOpen) {
      gsap.set(menuContainer, { display: "block" });

      gsap.fromTo(
        menuContainer,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        },
      );

      gsap.fromTo(
        ".middle-service-item",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.02,
          ease: "power2.out",
          delay: 0.05,
          overwrite: "auto",
        },
      );
    } else {
      gsap.to(menuContainer, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.35,
        ease: "power3.inOut",
        overwrite: "auto",
        onComplete: () => {
          gsap.set(menuContainer, { display: "none" });
          activeCategory = "Image Editing";
          activeServiceSlug = "background-remove";
        },
      });
    }
  });

  // Stagger animate middle column links when activeCategory changes
  $effect(() => {
    if (!browser || !gsapModule || !menuContainer || !isOpen) return;
    const gsap = gsapModule;

    // Establish dependency tracking
    const _cat = activeCategory;

    gsap.fromTo(
      ".middle-service-item",
      { opacity: 0, x: -10 },
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: "power2.out",
        overwrite: "auto",
      },
    );
  });

  // Alternate the preview direction so service browsing stays tactile.
  $effect(() => {
    if (!browser || !gsapModule || !menuContainer || !isOpen) return;
    const gsap = gsapModule;

    // Establish dependency tracking
    const _slug = activeServiceSlug;

    const activeFrame = menuContainer.querySelector(`.mega-thumb-${_slug}`);
    const activeImage = menuContainer.querySelector(`.mega-thumb-${_slug} img`);
    if (activeImage && activeFrame) {
      const serviceIndex = services.findIndex(
        (service) => service.slug === _slug,
      );
      const revealVariant =
        previewRevealVariants[serviceIndex % previewRevealVariants.length];

      gsap.fromTo(
        activeFrame,
        { clipPath: revealVariant.clipPath },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
        },
      );
      gsap.fromTo(
        activeImage,
        { scale: 1.1, x: revealVariant.x, y: revealVariant.y },
        {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.52,
          ease: "power3.out",
          overwrite: "auto",
        },
      );
    }
  });

  function handleCategoryHover(
    catId: "Image Editing" | "Video Editing" | "3D Modeling",
  ) {
    if (activeCategory === catId) return;
    activeCategory = catId;
    const catServices = services.filter((s) => s.category === catId);
    if (catServices.length > 0) {
      activeServiceSlug = catServices[0].slug;
    }
  }
</script>

<div
  bind:this={menuContainer}
  class="mega-menu-panel absolute top-full left-1/2 -translate-x-1/2 mt-7 w-[72rem] rounded-lg border border-brand-light/10 shadow-2xl p-8 hidden z-50 overflow-hidden
  before:absolute before:inset-x-0 before:-top-7 before:h-7 before:content-['']"
>
  <div class="grid grid-cols-[20rem_1fr_22rem] gap-8 items-stretch">
    <!-- Left Column: 3 Category Selectors -->
    <div class="flex flex-col gap-4">
      <p
        class="font-sans text-[0.55rem] uppercase tracking-[0.2em] text-brand-green font-semibold"
      >
        Our Divisions
      </p>
      <div class="flex flex-col gap-3">
        {#each categories as category}
          <div
            role="button"
            tabindex="0"
            data-active={activeCategory === category.id}
            onmouseenter={() => handleCategoryHover(category.id)}
            onclick={() => handleCategoryHover(category.id)}
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCategoryHover(category.id);
              }
            }}
            class="group border border-brand-light/5 rounded-xl p-3.5 flex items-center justify-between transition-all duration-300 ease-out cursor-pointer outline-none hover:bg-brand-light/5 hover:border-brand-green/20 data-[active=true]:bg-brand-light/5 data-[active=true]:border-brand-green/40 focus-visible:ring-1 focus-visible:ring-brand-green"
          >
            <div class="flex items-center gap-3">
              <!-- Icon Container -->
              <div
                class="size-9 flex items-center justify-center rounded-lg bg-brand-light/5 text-brand-light/60 transition-colors group-hover:bg-brand-green/10 group-hover:text-brand-green group-data-[active=true]:bg-brand-green group-data-[active=true]:text-brand-dark"
              >
                <category.icon size={16} strokeWidth={2} />
              </div>
              <div class="flex flex-col">
                <span
                  class="font-sans text-xs font-bold uppercase tracking-wider transition-colors {activeCategory ===
                  category.id
                    ? 'text-brand-green'
                    : 'text-brand-light/80 group-hover:text-brand-light'}"
                >
                  {category.label}
                </span>
                <span
                  class="font-sans text-[0.62rem] text-brand-light/45 mt-0.5 transition-colors group-hover:text-brand-light/60 group-data-[active=true]:text-brand-light/70"
                >
                  {category.description}
                </span>
              </div>
            </div>
            <!-- Chevron Indicator -->
            <ChevronRight
              size={13}
              class="text-brand-light/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-brand-green group-data-[active=true]:text-brand-green"
            />
          </div>
        {/each}
      </div>
    </div>

    <!-- Middle Column: Dynamic Services List -->
    <div class="border-l border-r border-brand-light/5 px-6">
      <p
        class="font-sans text-[0.55rem] uppercase tracking-[0.2em] text-brand-green mb-5 font-semibold"
      >
        Services
      </p>
      <ul class="flex flex-col gap-2.5">
        {#each activeCategoryServices as service, sIndex}
          <li
            class="middle-service-item border-b border-brand-light/5 pb-2.5 last:border-0 relative pl-3.5 animate-duration-200"
            onmouseenter={() => (activeServiceSlug = service.slug)}
          >
            <!-- Vertical Active Line Indicator -->
            <span
              class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 bg-brand-green transition-all duration-300 origin-center"
              style="opacity: {service.slug === activeServiceSlug
                ? 1
                : 0}; transform: translateY(-50%) scaleY({service.slug ===
              activeServiceSlug
                ? 1
                : 0})"
            ></span>

            <a
              href={resolve("/services/[slug]", { slug: service.slug })}
              onclick={onClose}
              class="group flex items-center justify-between text-left py-0.5 outline-none w-full"
            >
              <div class="flex items-center gap-2.5">
                <span
                  class="font-display text-[0.7rem] font-bold tracking-wide transition-colors duration-200 {service.slug ===
                  activeServiceSlug
                    ? 'text-brand-green'
                    : 'text-brand-light/30'}"
                >
                  {String(sIndex + 1).padStart(2, "0")}
                </span>
                <span
                  class="font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-out {service.slug ===
                  activeServiceSlug
                    ? 'text-brand-green translate-x-1'
                    : 'text-brand-light/80'}"
                >
                  {service.title}
                </span>
              </div>
              <ArrowUpRight
                size={13}
                class="text-brand-light/20 transition-all duration-300 group-hover:text-brand-green group-hover:translate-x-0.5 group-hover:-translate-y-0.5 {service.slug ===
                activeServiceSlug
                  ? 'opacity-100'
                  : 'opacity-40'}"
              />
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Right Column: Image Preview Frame -->
    <div
      class="relative h-full min-h-[22rem] w-full overflow-hidden rounded-lg border border-brand-light/10 bg-brand-dark/30"
    >
      {#each services as service}
        <div
          class="mega-thumb-{service.slug} absolute inset-0 size-full transition-opacity duration-300"
          style="opacity: {service.slug === activeServiceSlug
            ? 1
            : 0}; z-index: {service.slug === activeServiceSlug ? 1 : 0}"
        >
          <img
            src={service.media.src}
            alt={service.media.alt}
            width={service.media.width}
            height={service.media.height}
            class="size-full object-cover"
          />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .mega-menu-panel {
    background: var(--navbar-surface, var(--color-brand-dark));
  }
</style>
