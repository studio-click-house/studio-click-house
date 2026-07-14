<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import { ArrowUpRight, Menu, X } from "lucide-svelte";
  import { navigationItems } from "$lib/content/home";

  let isMenuOpen = $state(false);
  let isLogoVisible = $state(true);
  let menuButton = $state<HTMLButtonElement>();
  let menuPanel = $state<HTMLDivElement>();

  function closeMenu() {
    isMenuOpen = false;
  }

  onMount(() => {
    let scrollAnchorY = Math.max(window.scrollY, 0);
    let scrollFrame: number | undefined;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !isMenuOpen) return;
      closeMenu();
      menuButton?.focus();
    }

    function handlePointerDown(event: PointerEvent) {
      if (!isMenuOpen || !(event.target instanceof Node)) return;
      if (
        menuPanel?.contains(event.target) ||
        menuButton?.contains(event.target)
      )
        return;
      closeMenu();
    }

    function updateLogoVisibility() {
      scrollFrame = undefined;

      const currentScrollY = Math.max(window.scrollY, 0);
      const scrollDelta = currentScrollY - scrollAnchorY;
      const workFieldsRail = document.getElementById("work-fields-rail");
      const railBounds = workFieldsRail?.getBoundingClientRect();
      const isRailActive = Boolean(
        railBounds &&
          railBounds.top <= 24 &&
          railBounds.bottom > window.innerHeight * 0.5,
      );

      if (isMenuOpen || currentScrollY <= 48) {
        isLogoVisible = true;
        scrollAnchorY = currentScrollY;
      } else if (isRailActive) {
        isLogoVisible = false;
        scrollAnchorY = currentScrollY;
      } else if (scrollDelta > 8) {
        isLogoVisible = false;
        scrollAnchorY = currentScrollY;
      } else if (scrollDelta < -8) {
        isLogoVisible = true;
        scrollAnchorY = currentScrollY;
      }
    }

    function handleScroll() {
      if (scrollFrame !== undefined) return;
      scrollFrame = window.requestAnimationFrame(updateLogoVisibility);
    }

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateLogoVisibility();

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame !== undefined) window.cancelAnimationFrame(scrollFrame);
    };
  });
</script>

<header
  id="site-header"
  class="pointer-events-none fixed inset-x-0 top-0 z-50 py-4 sm:py-6"
>
  <nav
    id="primary-navigation"
    aria-label="Primary navigation"
    class="site-shell flex items-start justify-between"
  >
    <a
      href={resolve("/")}
      aria-label="Studio Click House home"
      class:logo-hidden={!isMenuOpen && !isLogoVisible}
      class="site-logo pointer-events-auto relative z-10 block shrink-0 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
    >
      <img
        src="/images/brand/schl-logo.png"
        alt="Studio Click House"
        width="144"
        height="76"
        class="h-10 w-auto drop-shadow-[0_2px_8px_rgba(32,33,31,0.22)] sm:h-12"
      />
    </a>

    <div class="pointer-events-auto flex items-center gap-2 sm:gap-3">
      <a
        href={resolve("/contact")}
        class="project-action group hidden items-center justify-between gap-4 border border-brand-light/30 bg-brand-dark/95 px-5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-light backdrop-blur-xl transition-colors hover:border-brand-green hover:bg-brand-green hover:text-brand-dark active:scale-[0.98] sm:inline-flex"
      >
        Start a project
        <ArrowUpRight
          size={15}
          strokeWidth={1.7}
          class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>

      <div class="relative">
        <button
          bind:this={menuButton}
          type="button"
          class="menu-action group flex items-center gap-3 border border-brand-light/30 bg-brand-dark/95 px-4 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-brand-light backdrop-blur-xl transition-colors hover:border-brand-green hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green active:scale-[0.98] sm:px-5"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation-panel"
          onclick={() => (isMenuOpen = !isMenuOpen)}
        >
          <span>{isMenuOpen ? "Close" : "Menu"}</span>
          {#if isMenuOpen}
            <X
              size={17}
              strokeWidth={1.7}
              class="transition-colors group-hover:text-brand-dark"
            />
          {:else}
            <Menu
              size={17}
              strokeWidth={1.7}
              class="transition-colors group-hover:text-brand-dark"
            />
          {/if}
        </button>

        {#if isMenuOpen}
          <div
            bind:this={menuPanel}
            id="primary-navigation-panel"
            class="navigation-panel absolute right-0 top-[calc(100%+0.75rem)] w-[min(38rem,calc(100vw-2rem))] overflow-hidden border border-brand-light/15 bg-brand-dark/95 text-brand-light shadow-2xl shadow-brand-dark/25 backdrop-blur-2xl"
          >
            <div
              class="flex items-center justify-between border-b border-brand-light/10 px-5 py-4 sm:px-7"
            >
              <p
                class="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-brand-green"
              >
                Explore the studio
              </p>
              <p
                class="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-brand-light/35"
              >
                SCH · Navigation
              </p>
            </div>

            <ol aria-label="Main routes" class="grid sm:grid-cols-2">
              {#each navigationItems as item (item.href)}
                <li class="border-b border-brand-light/10 odd:sm:border-r">
                  <a
                    href={resolve(item.href)}
                    onclick={closeMenu}
                    aria-current={page.url.pathname === item.href
                      ? "page"
                      : undefined}
                    class="group/link flex items-end justify-between gap-6 px-5 py-5 transition-colors hover:bg-brand-light/[0.06] sm:px-7 sm:py-7"
                  >
                    <span
                      class="font-display text-2xl tracking-[-0.02em] sm:text-3xl"
                    >
                      {item.label}
                    </span>
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.6}
                      class="shrink-0 text-brand-light/35 transition-all duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-brand-green"
                    />
                  </a>
                </li>
              {/each}
            </ol>

            <a
              href={resolve("/contact")}
              onclick={closeMenu}
              class="group flex items-center justify-between bg-brand-green px-5 py-5 text-xs font-bold uppercase tracking-[0.14em] text-brand-dark sm:px-7"
            >
              Discuss a new project
              <ArrowUpRight
                size={17}
                strokeWidth={1.7}
                class="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </div>
        {/if}
      </div>
    </div>
  </nav>
</header>

<style>
  .project-action {
    height: 2.9rem;
    min-width: 11.75rem;
  }

  .site-logo {
    transition:
      opacity 220ms ease,
      transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .site-logo.logo-hidden {
    pointer-events: none;
    opacity: 0;
    transform: translateY(-0.75rem);
  }

  .site-logo.logo-hidden:focus-visible {
    pointer-events: auto;
    opacity: 1;
    transform: translateY(0);
  }

  .menu-action {
    height: 2.9rem;
    min-width: 5.9rem;
    justify-content: space-between;
  }

  .navigation-panel {
    animation: reveal-navigation 220ms cubic-bezier(0.16, 1, 0.3, 1) both;
    transform-origin: top right;
  }

  @keyframes reveal-navigation {
    from {
      opacity: 0;
      transform: translateY(-0.5rem) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .site-logo {
      transition: none;
    }

    .site-logo.logo-hidden {
      transform: none;
    }

    .navigation-panel {
      animation: none;
    }
  }
</style>
