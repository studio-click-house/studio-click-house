<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import {
    ArrowUpRight,
    ChevronDown,
    Globe,
    LogIn,
    Menu,
    X,
  } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { navigationItems } from "$lib/content/home";
  import MegaMenu from "./MegaMenu.svelte";

  let isScrolled = $state(false);
  let isMegaMenuOpen = $state(false);
  let isCompanyMenuOpen = $state(false);
  let isMenuOpen = $state(false);
  let headerElement: HTMLElement;
  let megaMenuCloseTimeout: ReturnType<typeof setTimeout> | undefined;
  let companyMenuCloseTimeout: ReturnType<typeof setTimeout> | undefined;

  const primaryNavigationItems = navigationItems.filter(
    (item) =>
      item.label !== "Events" &&
      item.label !== "CSR" &&
      item.label !== "Careers",
  );
  const companyNavigationItems = navigationItems.filter(
    (item) =>
      item.label === "Events" ||
      item.label === "CSR" ||
      item.label === "Careers",
  );

  function openMegaMenu() {
    if (megaMenuCloseTimeout) {
      clearTimeout(megaMenuCloseTimeout);
      megaMenuCloseTimeout = undefined;
    }
    isCompanyMenuOpen = false;
    isMegaMenuOpen = true;
  }

  function closeMegaMenuWithGrace() {
    megaMenuCloseTimeout = setTimeout(() => {
      isMegaMenuOpen = false;
      megaMenuCloseTimeout = undefined;
    }, 220);
  }

  function openCompanyMenu() {
    if (companyMenuCloseTimeout) {
      clearTimeout(companyMenuCloseTimeout);
      companyMenuCloseTimeout = undefined;
    }
    isMegaMenuOpen = false;
    isCompanyMenuOpen = true;
  }

  function closeCompanyMenuWithGrace() {
    companyMenuCloseTimeout = setTimeout(() => {
      isCompanyMenuOpen = false;
      companyMenuCloseTimeout = undefined;
    }, 180);
  }

  function closeNavigationMenus() {
    isMegaMenuOpen = false;
    isCompanyMenuOpen = false;
  }

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;
    let revertMedia: (() => void) | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !headerElement) return;

      const { gsap, ScrollTrigger } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        revertMedia = () => media.revert();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .set(headerElement, { yPercent: -100 })
            .to(headerElement, { yPercent: 0, duration: 1 })
            .from(
              ".nav-reveal",
              {
                y: 18,
                autoAlpha: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: "power3.out",
              },
              "-=0.45",
            )
            .from(
              ".project-action",
              {
                scale: 0.82,
                autoAlpha: 0,
                duration: 0.55,
                ease: "back.out(1.8)",
              },
              "-=0.35",
            );

          ScrollTrigger.create({
            id: "studio-navigation",
            start: 0,
            end: "max",
            onUpdate: (self) => {
              isScrolled = self.scroll() > 36;
            },
          });
        });

        media.add("(prefers-reduced-motion: reduce)", () => {
          ScrollTrigger.create({
            id: "studio-navigation-reduced-motion",
            start: 0,
            end: "max",
            onUpdate: (self) => {
              isScrolled = self.scroll() > 36;
            },
          });
        });
      }, headerElement);
    });

    return () => {
      active = false;
      if (megaMenuCloseTimeout) clearTimeout(megaMenuCloseTimeout);
      if (companyMenuCloseTimeout) clearTimeout(companyMenuCloseTimeout);
      revertMedia?.();
      context?.revert();
    };
  });
</script>

<header
  id="site-header"
  bind:this={headerElement}
  role="none"
  class:is-scrolled={isScrolled}
  class="site-header fixed inset-x-0 top-0 z-50 w-full select-none"
>
  <nav
    id="primary-navigation"
    aria-label="Primary navigation"
    class="nav-surface site-shell relative grid items-center"
  >
    <a
      href={resolve("/")}
      aria-label="Studio Click House home"
      onmouseenter={closeNavigationMenus}
      onclick={() => {
        isMenuOpen = false;
        closeNavigationMenus();
      }}
      class="brand-block nav-reveal relative z-50 flex min-w-0 items-center"
    >
      <img
        src="/images/brand/schl-logo.png"
        alt="Studio Click House"
        width="144"
        height="76"
        class="brand-mark w-auto"
      />
    </a>

    <div
      class="nav-reveal nav-links hidden xl:flex items-center justify-center"
    >
      {#each primaryNavigationItems as item (item.href)}
        {#if item.label === "Services"}
          <div
            class="relative"
            role="none"
            onmouseenter={openMegaMenu}
            onmouseleave={closeMegaMenuWithGrace}
          >
            <a
              href={resolve(item.href)}
              onmouseenter={openMegaMenu}
              onclick={(event) => {
                event.preventDefault();
                isMegaMenuOpen = !isMegaMenuOpen;
              }}
              aria-current={page.url.pathname === item.href
                ? "page"
                : undefined}
              class:active={isMegaMenuOpen || page.url.pathname === item.href}
              class="nav-link inline-flex items-center gap-1.5 py-2 outline-none"
            >
              {item.label}
              <ChevronDown
                size={11}
                strokeWidth={1.8}
                class="block shrink-0 transition-transform duration-300 {isMegaMenuOpen
                  ? 'rotate-180'
                  : ''}"
              />
            </a>
            <MegaMenu isOpen={isMegaMenuOpen} onClose={closeNavigationMenus} />
          </div>
        {:else}
          <a
            href={resolve(item.href)}
            onmouseenter={closeNavigationMenus}
            aria-current={page.url.pathname === item.href ? "page" : undefined}
            class:active={page.url.pathname === item.href}
            class="nav-link inline-flex items-center py-2"
          >
            {item.label}
          </a>
        {/if}
      {/each}

      <div
        class="relative"
        role="none"
        onmouseenter={openCompanyMenu}
        onmouseleave={closeCompanyMenuWithGrace}
      >
        <button
          type="button"
          aria-expanded={isCompanyMenuOpen}
          aria-controls="company-navigation-menu"
          class:active={isCompanyMenuOpen ||
            companyNavigationItems.some(
              (item) => page.url.pathname === item.href,
            )}
          class="nav-link inline-flex items-center gap-1.5 py-2 outline-none"
          onclick={() => (isCompanyMenuOpen = !isCompanyMenuOpen)}
        >
          Company
          <ChevronDown
            size={11}
            strokeWidth={1.8}
            class="block shrink-0 transition-transform duration-300 {isCompanyMenuOpen
              ? 'rotate-180'
              : ''}"
          />
        </button>

        {#if isCompanyMenuOpen}
          <div
            id="company-navigation-menu"
            class="company-menu absolute left-1/2 top-full z-[60] mt-7 w-36 -translate-x-1/2 rounded-lg border border-brand-light/12 p-1.5 shadow-xl shadow-brand-dark/25 before:absolute before:inset-x-0 before:-top-7 before:h-7 before:content-['']"
          >
            {#each companyNavigationItems as item (item.href)}
              <a
                href={resolve(item.href)}
                aria-current={page.url.pathname === item.href
                  ? "page"
                  : undefined}
                onclick={closeNavigationMenus}
                class="flex items-center justify-between px-3 py-2 font-sans text-[0.72rem] font-medium tracking-[0.018em] text-brand-light/80 transition-colors hover:bg-brand-light/8 hover:text-brand-green"
              >
                {item.label}
                <ArrowUpRight size={12} strokeWidth={1.7} />
              </a>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="nav-actions relative z-50 flex items-center justify-end">
      <div class="nav-action-group nav-reveal hidden sm:flex items-center">
        <a
          href={resolve("/contact")}
          onmouseenter={closeNavigationMenus}
          class="project-action inline-flex items-center justify-between"
        >
          <span>Free trial</span>
          <ArrowUpRight
            size={14}
            strokeWidth={1.7}
            class="transition-transform duration-300"
          />
        </a>

        <a
          href={resolve("/login")}
          onmouseenter={closeNavigationMenus}
          class="login-action hidden xl:inline-flex items-center gap-1.5"
        >
          <LogIn size={14} strokeWidth={1.7} />
          <span>Login</span>
        </a>

        <button
          type="button"
          class="language-action hidden xl:inline-flex items-center gap-1.5"
          aria-label="Current language: English"
        >
          <Globe size={14} strokeWidth={1.7} />
          <span>EN</span>
        </button>
      </div>

      <button
        type="button"
        class="menu-action nav-reveal flex xl:hidden items-center justify-between"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation-panel"
        aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
        onclick={() => (isMenuOpen = !isMenuOpen)}
      >
        <span class="hidden sm:inline">{isMenuOpen ? "Close" : "Menu"}</span>
        {#if isMenuOpen}
          <X size={16} strokeWidth={1.8} />
        {:else}
          <Menu size={16} strokeWidth={1.8} />
        {/if}
      </button>
    </div>

    {#if isMenuOpen}
      <div
        id="mobile-navigation-panel"
        class="navigation-panel absolute inset-x-0 overflow-hidden border border-brand-light/15 bg-brand-dark/92 text-brand-light shadow-2xl shadow-brand-dark/35 backdrop-blur-2xl xl:hidden"
      >
        <div
          class="flex items-center justify-between border-b border-brand-light/10 bg-brand-light/5 px-5 py-4 sm:px-7"
        >
          <p
            class="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-brand-green"
          >
            Explore the studio
          </p>
          <p
            class="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-light/40"
          >
            SCH · Navigation
          </p>
        </div>

        <ol aria-label="Mobile routes" class="mobile-route-grid">
          {#each navigationItems as item, index (item.href)}
            <li>
              <a
                href={resolve(item.href)}
                onclick={() => (isMenuOpen = false)}
                aria-current={page.url.pathname === item.href
                  ? "page"
                  : undefined}
                class="group/link flex h-full items-center justify-between px-6 py-5 transition-colors hover:bg-brand-light/8"
              >
                <span class="flex items-baseline gap-3">
                  <span class="font-mono text-[0.55rem] text-brand-light/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    class="font-display text-xl tracking-tight text-brand-light group-hover/link:text-brand-green"
                  >
                    {item.label}
                  </span>
                </span>
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.6}
                  class="text-brand-light/35 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-brand-green"
                />
              </a>
            </li>
          {/each}
        </ol>

        <div
          class="mobile-utilities flex items-stretch border-t border-brand-light/10"
        >
          <a
            href={resolve("/login")}
            onclick={() => (isMenuOpen = false)}
            class="flex flex-1 items-center justify-between border-r border-brand-light/10 px-6 py-4 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
          >
            Login <ArrowUpRight size={14} strokeWidth={1.7} />
          </a>
          <button
            type="button"
            class="flex items-center gap-2 px-6 py-4 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
          >
            <Globe size={13} /> EN
          </button>
        </div>
      </div>
    {/if}
  </nav>
</header>

<style>
  .site-header {
    --navbar-surface: rgb(12 11 10);
    padding-top: 0;
    background: var(--navbar-surface);
    box-shadow: 0 0.75rem 2.5rem rgb(0 0 0 / 0.35);
    -webkit-backdrop-filter: blur(18px) saturate(130%);
    backdrop-filter: blur(18px) saturate(130%);
    will-change: transform;
  }

  .nav-surface {
    grid-template-columns: minmax(8rem, 1fr) auto minmax(15rem, 1fr);
    min-height: 4.35rem;
    padding-inline: 0.65rem;
    color: var(--color-brand-light);
  }

  .brand-block {
    height: 3.05rem;
    padding-inline: 0.5rem 1rem;
  }

  .brand-mark {
    height: 2.15rem;
    transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .brand-block:hover .brand-mark {
    transform: translateY(-0.1rem);
  }

  .nav-links {
    gap: clamp(1rem, 1.6vw, 1.75rem);
    padding-inline: clamp(1rem, 2vw, 2rem);
  }

  .nav-link {
    position: relative;
    font-family: var(--font-sans);
    font-size: 0.82rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.018em;
    color: color-mix(in srgb, var(--color-brand-light) 78%, transparent);
    transition: color 220ms ease;
  }

  .nav-link:hover,
  .nav-link.active {
    color: var(--color-brand-green);
  }

  .company-menu {
    background: var(--navbar-surface);
  }

  .nav-action-group {
    gap: 0.5rem;
  }

  .project-action {
    min-height: 2.45rem;
    min-width: 8.5rem;
    gap: 0.8rem;
    padding-inline: 0.85rem;
    background: color-mix(in srgb, var(--color-brand-light) 5%, transparent);
    color: var(--color-brand-light);
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 26%, transparent);
    border-radius: 0.2rem;
    font-family: var(--font-sans);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    transition:
      color 280ms ease,
      border-color 280ms ease,
      background 280ms ease;
  }

  .project-action:hover {
    color: var(--color-brand-dark);
    border-color: var(--color-brand-green);
    background: var(--color-brand-green);
  }

  .login-action {
    min-height: 2.45rem;
    gap: 0.55rem;
    padding-inline: 0.85rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 26%, transparent);
    border-radius: 0.2rem;
    font-family: var(--font-sans);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: var(--color-brand-light);
    background: transparent;
    transition:
      color 220ms ease,
      border-color 220ms ease,
      background 220ms ease;
  }

  .login-action:hover {
    color: var(--color-brand-dark);
    border-color: var(--color-brand-green);
    background: var(--color-brand-green);
  }

  .language-action {
    min-height: 2.45rem;
    margin-left: 0.6rem;
    gap: 0.55rem;
    padding-inline: 0.85rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 26%, transparent);
    border-radius: 0.2rem;
    font-family: var(--font-sans);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: var(--color-brand-light);
    background: transparent;
    transition:
      color 220ms ease,
      border-color 220ms ease,
      background 220ms ease;
  }

  .language-action:hover {
    color: var(--color-brand-dark);
    border-color: var(--color-brand-green);
    background: var(--color-brand-green);
  }

  .project-action:active,
  .menu-action:active {
    transform: scale(0.98);
  }

  .menu-action {
    min-height: 2.85rem;
    min-width: 2.85rem;
    gap: 0.75rem;
    padding-inline: 0.85rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 28%, transparent);
    border-radius: 0.2rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition:
      background 220ms ease,
      border-color 220ms ease,
      transform 150ms ease;
  }

  .menu-action:hover {
    background: var(--color-brand-green);
    border-color: var(--color-brand-green);
  }

  .navigation-panel {
    top: calc(100% + 0.6rem);
    animation: reveal-navigation 380ms cubic-bezier(0.16, 1, 0.3, 1) both;
    transform-origin: top center;
  }

  .mobile-route-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mobile-route-grid li {
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-brand-light) 10%, transparent);
  }

  .mobile-route-grid li:nth-child(odd) {
    border-right: 1px solid
      color-mix(in srgb, var(--color-brand-light) 10%, transparent);
  }

  @keyframes reveal-navigation {
    from {
      opacity: 0;
      transform: translateY(-0.7rem) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 79.999rem) {
    .nav-surface {
      grid-template-columns: minmax(8rem, 1fr) auto;
    }
  }

  @media (max-width: 39.999rem) {
    .nav-surface {
      min-height: 3.9rem;
      padding-inline: 0.45rem;
    }

    .brand-block {
      height: 2.75rem;
      padding-inline: 0.35rem 0.7rem;
    }

    .brand-mark {
      height: 1.8rem;
    }

    .nav-actions {
      gap: 0.4rem;
    }

    .mobile-route-grid {
      grid-template-columns: 1fr;
    }

    .mobile-route-grid li:nth-child(odd) {
      border-right: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .navigation-panel {
      animation: none;
    }
  }
</style>
