<script lang="ts">
  import { Mail, MapPin } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { siteConfig } from "$lib/config/site";
  import { navigationItems } from "$lib/content/home";

  const socialLinks = Object.entries(siteConfig.links).filter(
    ([, href]) => href,
  );

  function scrollToTop(e: Event) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
</script>

<footer
  id="site-footer"
  class="footer-container text-brand-light relative overflow-hidden"
>
  <!-- Top glow design accent -->
  <div class="footer-glow" aria-hidden="true"></div>

  <div class="site-shell pb-8 pt-24 sm:pt-32 relative z-10">
    <!-- Main Navigation Grid -->
    <div class="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
      <!-- Col 1: Branding (Span 4) -->
      <div id="footer-brand" class="lg:col-span-4 space-y-6">
        <div class="flex items-center gap-3">
          <img
            src="/images/brand/schl-logo.png"
            alt="Studio Click House"
            width="180"
            height="95"
            class="h-10 w-auto brightness-0 invert opacity-90"
          />
        </div>
        <p class="max-w-xs text-sm leading-relaxed text-brand-light/60">
          High-end visual production, retouching, and CGI built around the work.
        </p>
        <div class="flex items-center gap-2.5 pt-2">
          <span class="relative flex size-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full size-2 bg-brand-green"
            ></span>
          </span>
          <span
            class="font-mono text-[0.62rem] uppercase tracking-wider text-brand-light/45"
          >
            System Operational // Global Studio
          </span>
        </div>
      </div>

      <!-- Col 2: Navigation Links (Span 3) -->
      <nav
        id="footer-navigation"
        aria-label="Footer navigation"
        class="lg:col-span-3 space-y-6"
      >
        <p class="eyebrow text-brand-light/40 tracking-[0.15em]">Explore</p>
        <ul class="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
          {#each navigationItems as item (item.href)}
            <li>
              <a
                href={resolve(item.href)}
                class="text-brand-light/75 transition-colors hover:text-brand-green hover-underline-anim"
              >
                {item.label}
              </a>
            </li>
          {/each}
          <li>
            <a
              href={resolve("/contact")}
              class="text-brand-light/75 transition-colors hover:text-brand-green hover-underline-anim"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <!-- Col 3: Contact details (Span 3) -->
      <div id="footer-contact-details" class="lg:col-span-3 space-y-6">
        <p class="eyebrow text-brand-light/40 tracking-[0.15em]">Office</p>
        <div class="space-y-4 text-xs text-brand-light/75 leading-relaxed">
          <div class="flex items-start gap-2.5">
            <MapPin size={14} class="text-brand-green/80 mt-0.5 shrink-0" />
            <span>
              {siteConfig.contact.location}<br />
              {siteConfig.contact.country} // {siteConfig.contact.timezone}
            </span>
          </div>
          <div class="flex items-center gap-2.5">
            <Mail size={14} class="text-brand-green/80 shrink-0" />
            <a
              href={`mailto:${siteConfig.contact.email}`}
              class="hover:text-brand-green transition-colors hover-underline-anim"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </div>

      <!-- Col 4: Social / Follow (Span 2) -->
      <div id="footer-social" class="lg:col-span-2 space-y-6">
        <p class="eyebrow text-brand-light/40 tracking-[0.15em]">Follow</p>
        {#if socialLinks.length}
          <ul class="space-y-3.5 text-xs">
            {#each socialLinks as [label, href] (label)}
              <li>
                <a
                  {href}
                  rel="noreferrer"
                  target="_blank"
                  class="capitalize text-brand-light/75 hover:text-brand-green transition-colors hover-underline-anim"
                >
                  {label}
                </a>
              </li>
            {/each}
          </ul>
        {:else}
          <ul class="space-y-3.5 text-xs text-brand-light/75">
            <li>
              <a
                href="https://instagram.com"
                rel="noreferrer"
                target="_blank"
                class="text-brand-light/75 hover:text-brand-green transition-colors hover-underline-anim"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                rel="noreferrer"
                target="_blank"
                class="text-brand-light/75 hover:text-brand-green transition-colors hover-underline-anim"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://vimeo.com"
                rel="noreferrer"
                target="_blank"
                class="text-brand-light/75 hover:text-brand-green transition-colors hover-underline-anim"
              >
                Vimeo
              </a>
            </li>
          </ul>
        {/if}
      </div>
    </div>

    <!-- Outlined Watermark (Huge) -->
    <div
      class="watermark-container pointer-events-none select-none overflow-hidden py-4 border-t border-brand-light/5"
    >
      <div
        class="watermark-text text-[clamp(2.5rem,8.8vw,9.5rem)] font-display font-extrabold text-center tracking-tight leading-none uppercase"
      >
        Studio Click House
      </div>
    </div>

    <!-- Bottom Legal Bar -->
    <div
      id="footer-legal"
      class="flex flex-col gap-4 border-t border-brand-light/10 pt-6 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-brand-light/45 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>
        &copy; {new Date().getFullYear()} Studio Click House. All rights reserved.
      </p>
      <div class="flex items-center gap-6">
        <a
          href={resolve("/privacy")}
          class="hover:text-brand-light transition-colors">Privacy</a
        >
        <a
          href={resolve("/terms")}
          class="hover:text-brand-light transition-colors">Terms</a
        >
        <a
          href="#top"
          onclick={scrollToTop}
          class="flex items-center gap-1.5 text-brand-green/80 hover:text-brand-green transition-colors"
        >
          <span>Back to top</span>
          <span class="inline-block -rotate-90">→</span>
        </a>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer-container {
    background: var(--color-brand-dark);
  }

  .footer-glow {
    position: absolute;
    top: 0;
    right: 10%;
    width: min(45rem, 80vw);
    height: 35rem;
    border-radius: 9999px;
    background: radial-gradient(
      circle,
      rgba(126, 166, 65, 0.065) 0%,
      transparent 68%
    );
    filter: blur(40px);
    pointer-events: none;
    user-select: none;
  }

  .watermark-text {
    -webkit-text-stroke: 1px rgba(248, 248, 246, 0.025);
    color: transparent;
  }

  /* Custom underline hover animation for premium look */
  .hover-underline-anim {
    position: relative;
    display: inline-block;
  }

  .hover-underline-anim::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: var(--color-brand-green);
    transform-origin: bottom right;
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .hover-underline-anim:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
</style>
