<script lang="ts">
  /* eslint-disable svelte/no-navigation-without-resolve -- resolveServiceHref returns a resolved pathname. */
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import {
    Camera,
    Video,
    Layers,
    ChevronRight,
    ArrowUpRight,
  } from "lucide-svelte";
  import { services } from "$lib/content/home";
  import { resolveServiceHref } from "$lib/content/service-pages";
  import { _ } from "svelte-i18n";

  let { isOpen = false, onClose } = $props<{
    isOpen: boolean;
    onClose: () => void;
  }>();

  let activeCategory = $state<
    "Image Editing" | "Video Editing" | "3D Modeling"
  >("Image Editing");
  let activeServiceSlug = $state<string>("ai-retouch");
  let menuContainer = $state<HTMLDivElement>();
  let gsapModule = $state<typeof import("gsap").gsap | null>(null);

  function translate(key: string, fallback: string): string {
    const res = $_(key, { default: fallback });
    if (!res || res === key) return fallback;
    return res;
  }

  // Group services by category
  const activeCategoryServices = $derived(
    services.filter((s) => s.category === activeCategory),
  );

  const categories = [
    {
      id: "Image Editing" as const,
      key: "imageEditing",
      label: "Photo Editing",
      description: "Precision Photoshop & retouching at scale",
      icon: Camera,
    },
    {
      id: "Video Editing" as const,
      key: "videoEditing",
      label: "Video Editing",
      description: "Cinematic cuts, grading & social reels",
      icon: Video,
    },
    {
      id: "3D Modeling" as const,
      key: "modeling3d",
      label: "3D Product Modeling",
      description: "CGI rendering, shading & design",
      icon: Layers,
    },
  ];


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

  let isRendered = $state(false);

  // Open/Close Dropdown Panel Animation
  $effect(() => {
    if (!browser || !menuContainer) return;
    const gsap = gsapModule;
    const container = menuContainer;

    if (isOpen) {
      isRendered = true;
      if (gsap) {
        gsap.set(container, { display: "block" });

        gsap.fromTo(
          container,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.45,
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
        container.style.display = "block";
      }
    } else {
      if (gsap && isRendered) {
        gsap.to(container, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.3,
          ease: "power3.inOut",
          overwrite: "auto",
          onComplete: () => {
            if (container) container.style.display = "none";
            isRendered = false;
            activeCategory = "Image Editing";
            activeServiceSlug = "ai-retouch";
          },
        });
      } else {
        if (container) container.style.display = "none";
        isRendered = false;
        activeCategory = "Image Editing";
        activeServiceSlug = "ai-retouch";
      }
    }
  });

  // Stagger animate middle column links when activeCategory changes
  $effect(() => {
    if (!browser || !gsapModule || !menuContainer || !isOpen) return;
    const gsap = gsapModule;

    if (!categories.some((category) => category.id === activeCategory)) return;

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
  style:display={isRendered ? "block" : "none"}
  class="mega-menu-panel absolute top-full left-1/2 -translate-x-1/2 mt-7 w-[72rem] rounded-lg border border-brand-light/10 shadow-2xl p-8 z-50 overflow-hidden
  before:absolute before:inset-x-0 before:-top-7 before:h-7 before:content-['']"
>
  <div class="grid grid-cols-[20rem_1fr_22rem] gap-8 items-stretch">
    <!-- Left Column: 3 Category Selectors -->
    <div class="flex flex-col gap-4">
      <p
        class="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-brand-green font-semibold"
      >
        {translate("nav.divisions", "Our Divisions")}
      </p>
      <div class="flex flex-col gap-3">
        {#each categories as category (category.id)}
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
            class="group border border-brand-light/5 rounded-xl p-3.5 flex items-center justify-between transition-all duration-300 ease-out cursor-pointer outline-none hover:bg-brand-light/5 hover:border-brand-green/20 data-[active=true]:bg-brand-light/5 data-[active=true]:border-brand-green/60 data-[active=true]:shadow-[0_0_15px_rgba(126,166,65,0.15)] focus-visible:ring-1 focus-visible:ring-brand-green"
          >
            <div class="flex items-center gap-3">
              <!-- Icon Container -->
              <div
                class="size-8 flex items-center justify-center rounded-sm border border-brand-light/8 text-brand-light/50 transition-all duration-300 group-hover:border-brand-green/30 group-hover:text-brand-green group-data-[active=true]:border-brand-green/50 group-data-[active=true]:bg-brand-green/10 group-data-[active=true]:text-brand-green"
              >
                <category.icon size={15} strokeWidth={1.8} />
              </div>
              <div class="flex flex-col">
                <span
                  class="font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 {activeCategory ===
                  category.id
                    ? 'text-brand-green translate-x-0.5'
                    : 'text-brand-light/80 group-hover:text-brand-light'}"
                >
                  {translate(`nav.megaCategories.${category.key}.label`, category.label)}
                </span>
                <span
                  class="font-sans text-[0.62rem] text-brand-light/45 mt-0.5 transition-colors group-hover:text-brand-light/60 group-data-[active=true]:text-brand-light/70"
                >
                  {translate(`nav.megaCategories.${category.key}.description`, category.description)}
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
        class="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-brand-green mb-5 font-semibold"
      >
        {translate("nav.services", "Services")}
      </p>
      <ul class="flex flex-col gap-2.5">
        {#each activeCategoryServices as service, sIndex (service.slug)}
          {#if service.slug === "ai-retouch" || service.slug === "ai-video-generation"}
            <li
              class="middle-service-item relative rounded-lg border border-brand-green/50 bg-brand-green/[0.08] p-2.5 my-1 transition-all duration-300 ease-out hover:border-brand-green hover:bg-brand-green/[0.14] hover:shadow-[0_0_18px_rgba(126,166,65,0.25)] {service.slug ===
              activeServiceSlug
                ? 'border-brand-green shadow-[0_0_18px_rgba(126,166,65,0.25)] ring-1 ring-brand-green/40'
                : ''}"
              onmouseenter={() => (activeServiceSlug = service.slug)}
            >
              <a
                href={resolveServiceHref(service.slug)}
                onclick={onClose}
                class="group flex items-center justify-between text-left outline-none w-full"
              >
                <div class="flex items-center gap-2.5">
                  <span
                    class="font-display text-[0.7rem] font-bold tracking-wide text-brand-green"
                  >
                    {String(sIndex + 1).padStart(2, "0")}
                  </span>
                  <span
                    class="font-sans text-xs font-bold uppercase tracking-wider text-brand-green transition-all duration-300 ease-out {service.slug ===
                    activeServiceSlug
                      ? 'translate-x-1'
                      : 'group-hover:translate-x-1'}"
                  >
                    {translate(`home.services.${service.slug}.title`, service.title)}
                  </span>
                </div>
                <ArrowUpRight
                  size={14}
                  class="text-brand-green transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          {:else}
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
                href={resolveServiceHref(service.slug)}
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
                      ? 'text-brand-green translate-x-1.5'
                      : 'text-brand-light/80'}"
                  >
                    {translate(`home.services.${service.slug}.title`, service.title)}
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
          {/if}
        {/each}
      </ul>
    </div>

    <!-- Right Column: Image Preview Frame -->
    <div
      class="relative h-full min-h-[22rem] w-full overflow-hidden rounded-[2rem] border border-brand-light/10 bg-brand-dark/30 shadow-inner"
    >
      {#each services as service (service.slug)}
        <div
          class="mega-thumb-{service.slug} absolute inset-0 size-full pointer-events-none transition-all duration-700 ease-out {service.slug ===
          activeServiceSlug
            ? 'opacity-100 scale-100 z-10'
            : 'opacity-0 scale-105 z-0'}"
        >
          <img
            src={service.media.src}
            alt={service.media.alt}
            width={service.media.width}
            height={service.media.height}
            loading="lazy"
            class="size-full rounded-[2rem] object-cover transition-transform duration-700 ease-out"
          />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .mega-menu-panel {
    background: var(--navbar-surface, var(--color-brand-dark));
    width: min(72rem, calc(100vw - 2rem));
    max-width: calc(100vw - 2rem);
    max-height: calc(100dvh - 5rem);
    overflow-y: auto;
    scrollbar-width: none;
  }

  .mega-menu-panel::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 79.999rem) {
    .mega-menu-panel > div {
      grid-template-columns: minmax(11rem, 0.8fr) minmax(0, 1fr) minmax(14rem, 1fr);
      gap: 1.25rem;
    }
  }

  @media (max-width: 47.999rem) {
    .mega-menu-panel > div {
      grid-template-columns: minmax(0, 1fr);
      gap: 1rem;
    }

    .mega-menu-panel > div > div:nth-child(2) {
      border-inline: 0;
      padding-inline: 0;
    }

    .mega-menu-panel > div > div:last-child {
      min-height: 12rem;
    }
  }
</style>
