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
  import { _ } from "svelte-i18n";
  import MegaMenu from "./MegaMenu.svelte";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";

  let isScrolled = $state(false);
  let isMegaMenuOpen = $state(false);
  let isMenuOpen = $state(false);
  let headerElement: HTMLElement;
  let megaMenuCloseTimeout: ReturnType<typeof setTimeout> | undefined;

  function openMegaMenu() {
    if (megaMenuCloseTimeout) {
      clearTimeout(megaMenuCloseTimeout);
      megaMenuCloseTimeout = undefined;
    }
    isMegaMenuOpen = true;
  }

  function closeMegaMenuWithGrace() {
    megaMenuCloseTimeout = setTimeout(() => {
      isMegaMenuOpen = false;
      megaMenuCloseTimeout = undefined;
    }, 220);
  }

  function closeNavigationMenus() {
    isMegaMenuOpen = false;
  }

  onMount(() => {
    let active = true;
    let hasStarted = false;
    let shouldRevealHeader = false;
    let hasLogoLanded = false;
    const waitsForPreloader = Boolean(
      document.querySelector(".site-preloader"),
    );
    let context: { revert: () => void } | undefined;
    let revertMedia: (() => void) | undefined;
    let resumeNavigation: (() => void) | undefined;
    let startNavigation: (() => void) | undefined;

    const handlePreloaderHeaderReveal = () => {
      shouldRevealHeader = true;
      startNavigation?.();
    };

    const handlePreloaderLogoLanded = () => {
      hasLogoLanded = true;
      resumeNavigation?.();
    };

    if (waitsForPreloader) {
      window.addEventListener(
        "site-preloader-header-reveal",
        handlePreloaderHeaderReveal,
        { once: true },
      );
      window.addEventListener(
        "site-preloader-logo-landed",
        handlePreloaderLogoLanded,
        { once: true },
      );
    }

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !headerElement) return;

      const { gsap, ScrollTrigger } = runtime;

      if (waitsForPreloader) gsap.set(headerElement, { yPercent: -100 });

      startNavigation = () => {
        if (!active || hasStarted) return;
        hasStarted = true;

        context = gsap.context(() => {
          const media = gsap.matchMedia();
          revertMedia = () => media.revert();

          media.add("(prefers-reduced-motion: no-preference)", () => {
            const headerDuration = waitsForPreloader ? 0.52 : 1;
            const revealDuration = waitsForPreloader ? 0.5 : 0.7;

            const timeline = gsap
              .timeline({
                defaults: { ease: "power4.out" },
                onComplete: () => {
                  if (waitsForPreloader) {
                    window.dispatchEvent(new CustomEvent("site-header-ready"));
                  }
                },
              })
              .set(headerElement, { yPercent: -100 })
              .to(headerElement, { yPercent: 0, duration: headerDuration });

            if (waitsForPreloader) {
              timeline.addPause(">", () => {
                if (hasLogoLanded) timeline.play();
              });
              resumeNavigation = () => timeline.play();
            }

            if (waitsForPreloader) {
              timeline
                .from(
                  ".nav-reveal:not(.brand-block)",
                  {
                    y: 18,
                    autoAlpha: 0,
                    duration: revealDuration,
                    stagger: 0.055,
                    ease: "power3.out",
                  },
                  ">",
                )
                .from(
                  ".project-action",
                  {
                    scale: 0.82,
                    autoAlpha: 0,
                    duration: 0.4,
                    ease: "back.out(1.8)",
                  },
                  "-=0.28",
                );
            } else {
              timeline
                .from(
                  ".nav-reveal",
                  {
                    y: 18,
                    autoAlpha: 0,
                    duration: revealDuration,
                    stagger: 0.08,
                    ease: "power3.out",
                  },
                  "-=0.45",
                )
                .from(
                  ".brand-mark",
                  {
                    scale: 0.86,
                    rotation: -3,
                    autoAlpha: 0,
                    duration: 0.8,
                    ease: "power3.out",
                  },
                  "-=0.6",
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
            }

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
            gsap.set(headerElement, { yPercent: 0 });
            ScrollTrigger.create({
              id: "studio-navigation-reduced-motion",
              start: 0,
              end: "max",
              onUpdate: (self) => {
                isScrolled = self.scroll() > 36;
              },
            });

            if (waitsForPreloader) {
              resumeNavigation = () => {
                window.dispatchEvent(new CustomEvent("site-header-ready"));
              };
              if (hasLogoLanded) resumeNavigation();
            }
          });
        }, headerElement);
      };

      if (!waitsForPreloader || shouldRevealHeader || hasLogoLanded)
        startNavigation();
    });

    return () => {
      active = false;
      window.removeEventListener(
        "site-preloader-header-reveal",
        handlePreloaderHeaderReveal,
      );
      window.removeEventListener(
        "site-preloader-logo-landed",
        handlePreloaderLogoLanded,
      );
      if (megaMenuCloseTimeout) clearTimeout(megaMenuCloseTimeout);
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
      {#each navigationItems as item (item.href)}
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
                if (!isMegaMenuOpen) {
                  event.preventDefault();
                  isMegaMenuOpen = true;
                }
              }}
              aria-current={page.url.pathname === item.href
                ? "page"
                : undefined}
              class:active={isMegaMenuOpen || page.url.pathname === item.href}
              class="nav-link inline-flex items-center gap-1.5 py-2 outline-none"
            >
              <span class="nav-label">
                {#each ($_('nav.' + item.label.toLowerCase()) || item.label).split("") as letter, letterIndex (letterIndex)}
                  <span
                    class="nav-letter"
                    data-letter={letter}
                    style={`--letter-index: ${letterIndex}`}>{letter}</span
                  >
                {/each}
              </span>
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
            <span class="nav-label">
              {#each ($_('nav.' + item.label.toLowerCase()) || item.label).split("") as letter, letterIndex (letterIndex)}
                <span
                  class="nav-letter"
                  data-letter={letter}
                  style={`--letter-index: ${letterIndex}`}>{letter}</span
                >
              {/each}
            </span>
          </a>
        {/if}
      {/each}
    </div>

    <div class="nav-actions relative z-50 flex items-center justify-end">
      <div class="nav-action-group nav-reveal hidden sm:flex items-center">
        <a
          href={resolve("/contact")}
          onmouseenter={closeNavigationMenus}
          class="project-action inline-flex items-center justify-between"
        >
          <span>{$_('nav.free_trial') || 'Free trial'}</span>
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
          <span>{$_('nav.login') || 'Login'}</span>
        </a>

        <div class="hidden xl:flex ml-2">
          <LanguageSwitcher />
        </div>
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
            SCHL · Navigation
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
                style="transition-delay: {index * 35}ms"
              >
                <span class="flex items-baseline gap-3">
                  <span class="font-mono text-[0.55rem] text-brand-light/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    class="font-display text-xl tracking-tight text-brand-light group-hover/link:text-brand-green"
                  >
                    {$_('nav.' + item.label.toLowerCase()) || item.label}
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
            {$_('nav.login') || 'Login'} <ArrowUpRight size={14} strokeWidth={1.7} />
          </a>
          <div class="flex items-center justify-center px-4 py-2">
            <LanguageSwitcher />
          </div>
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
    isolation: isolate;
    transform: translateZ(0);
    backface-visibility: hidden;
    will-change: transform;
  }

  .nav-surface {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 4.35rem;
    padding-inline: 0.65rem;
    color: var(--color-brand-light);
  }

  .brand-block {
    height: 3.35rem;
    padding-inline: 0.5rem 1rem;
  }

  .brand-mark {
    height: 3rem;
    transform-origin: left center;
  }

  .nav-links {
    gap: clamp(0.75rem, 1.1vw, 1.35rem);
    padding-inline: clamp(1rem, 2vw, 2rem);
  }

  .nav-link {
    position: relative;
    isolation: isolate;
    font-family: var(--font-sans);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.018em;
    color: color-mix(in srgb, var(--color-brand-light) 78%, transparent);
    transition: color 220ms ease;
  }

  .nav-label {
    color: color-mix(in srgb, var(--color-brand-light) 78%, transparent);
  }

  .nav-letter {
    position: relative;
    display: inline-block;
    color: inherit;
  }

  .nav-letter::after {
    position: absolute;
    inset: 0;
    content: attr(data-letter);
    color: var(--color-brand-green);
    clip-path: inset(0 100% 0 0);
    transition: clip-path 210ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .nav-link:hover .nav-letter::after {
    clip-path: inset(0 0 0 0);
    transition-delay: calc(var(--letter-index) * 60ms);
  }

  .nav-link.active .nav-letter::after {
    clip-path: inset(0 0 0 0);
  }

  .nav-link:hover,
  .nav-link.active {
    color: var(--color-brand-green);
  }

  .nav-action-group {
    gap: 0.5rem;
  }

  .project-action {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    min-height: 2.45rem;
    min-width: 9rem;
    gap: 0.55rem;
    padding-inline: 0.95rem;
    background: var(--color-brand-green);
    color: var(--color-brand-dark);
    border: 1px solid var(--color-brand-green);
    border-radius: 4px;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.018em;
    text-transform: uppercase;
    transition:
      color 280ms ease,
      border-color 280ms ease,
      background 280ms ease;
  }

  .project-action:hover {
    color: var(--color-brand-dark);
    border-color: var(--color-brand-light);
    background: var(--color-brand-light);
  }

  .login-action {
    min-height: 2.45rem;
    gap: 0.55rem;
    padding-inline: 0.85rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 26%, transparent);
    border-radius: 4px;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.018em;
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
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
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
      gap: 0.5rem;
    }
  }

  @media (max-width: 39.999rem) {
    .nav-surface {
      width: 100%;
      min-height: 3.5rem;
      padding-inline: 0.75rem;
    }

    .brand-block {
      height: 3.5rem;
      padding-inline: 0;
    }

    .brand-mark {
      height: 2.55rem;
    }

    .nav-actions {
      margin-left: auto;
      gap: 0.4rem;
    }

    .menu-action {
      width: 2.5rem;
      min-width: 2.5rem;
      height: 2.5rem;
      min-height: 2.5rem;
      padding-inline: 0;
      justify-content: center;
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
