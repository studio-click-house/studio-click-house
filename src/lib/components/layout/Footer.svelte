<script lang="ts">
  import { onMount } from "svelte";
  import {
    Mail,
    MapPin,
    ArrowUpRight,
    Clock,
    Activity,
    Instagram,
    Linkedin,
    Facebook,
  } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { siteConfig } from "$lib/config/site";
  import { navigationItems } from "$lib/content/home";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  const socialLinks = Object.entries(siteConfig.links).filter(
    ([, href]) => href,
  );

  let timeString = $state("");
  let footerElement = $state<HTMLElement>();

  function scrollToTop(e: Event) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  onMount(() => {
    // Studio Live Clock (Dhaka, Bangladesh - Asia/Dhaka)
    const updateClock = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      timeString = new Intl.DateTimeFormat("en-US", options).format(new Date());
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    // GSAP ScrollTrigger Parallax for Watermark
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !footerElement) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            ".watermark-text",
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: footerElement,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 0.5,
              },
            },
          );
        });

        return () => media.revert();
      }, footerElement);
    });

    return () => {
      clearInterval(interval);
      active = false;
      context?.revert();
    };
  });
</script>

<footer
  bind:this={footerElement}
  id="site-footer"
  class="footer-container text-brand-light relative overflow-hidden border-t border-brand-light/5"
>
  <!-- Top layered ambient glows -->
  <div class="footer-glow glow-bubble-1" aria-hidden="true"></div>
  <div class="footer-glow glow-bubble-2" aria-hidden="true"></div>

  <div class="site-shell pb-8 pt-20 relative z-10">
    <!-- Top Footer CTA Section -->
    <div
      class="border-b border-brand-light/10 pb-16 pt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-10"
    >
      <div class="space-y-4">
        <p class="eyebrow text-brand-green tracking-[0.2em] font-medium">Get in Touch</p>
        <h2
          class="font-display text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] tracking-tight text-brand-light/90 max-w-[20ch]"
        >
          Let's create something extraordinary.
        </h2>
      </div>
      <div class="pt-2">
        <a
          href={resolve("/contact")}
          class="group inline-flex min-h-14 items-center gap-6 bg-brand-green px-8 text-sm font-semibold text-brand-dark transition-all duration-300 hover:bg-brand-light hover:text-brand-dark focus-visible:outline-brand-green"
        >
          Start a project
          <ArrowUpRight
            class="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </div>

    <!-- Main Navigation Grid -->
    <div class="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 border-b border-brand-light/5">
      <!-- Col 1: Branding (Span 4) -->
      <div id="footer-brand" class="lg:col-span-4 space-y-6">
        <div class="flex items-center gap-3">
          <img
            src="/images/brand/schl-logo.png"
            alt="Studio Click House"
            width="180"
            height="95"
            class="h-10 w-auto opacity-95 transition-opacity hover:opacity-100"
          />
        </div>
        <p class="max-w-xs text-sm leading-relaxed text-brand-light/60 font-sans">
          Studio Click House is a creative studio providing professional image, video, 3D, and CGI production services for brands, eCommerce businesses, photographers, and agencies worldwide. Since 2015, we have delivered high-quality results with fast turnaround times.
        </p>

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
                class="text-brand-light/75 transition-colors hover:text-brand-green hover-underline-anim flex items-center gap-1 group"
              >
                {item.label}
              </a>
            </li>
          {/each}
          <li>
            <a
              href={resolve("/contact")}
              class="text-brand-light/75 transition-colors hover:text-brand-green hover-underline-anim flex items-center gap-1 group"
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
            <MapPin size={14} class="text-brand-green/85 mt-0.5 shrink-0" />
            <span>
              {siteConfig.contact.location}<br />
              {siteConfig.contact.country}
            </span>
          </div>
          <div class="flex items-center gap-2.5">
            <Mail size={14} class="text-brand-green/85 shrink-0" />
            <a
              href={`mailto:${siteConfig.contact.email}`}
              class="hover:text-brand-green transition-colors hover-underline-anim"
            >
              {siteConfig.contact.email}
            </a>
          </div>
          <!-- Live Studio Clock readout -->
          {#if timeString}
            <div class="flex items-center gap-2.5 pt-2 border-t border-brand-light/5 font-mono text-[0.68rem] text-brand-light/50">
              <Clock size={12} class="text-brand-green/75" />
              <span class="uppercase tracking-wider">Studio Time:</span>
              <span class="text-brand-light/80 font-medium tabular-nums">{timeString} (UTC+6)</span>
            </div>
          {/if}
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
                  class="capitalize text-brand-light/75 hover:text-brand-green transition-colors hover-underline-anim inline-flex items-center gap-2 group"
                >
                  {#if label.toLowerCase() === 'instagram'}
                    <Instagram size={14} class="opacity-70 group-hover:opacity-100 transition-opacity" />
                  {:else if label.toLowerCase() === 'linkedin'}
                    <Linkedin size={14} class="opacity-70 group-hover:opacity-100 transition-opacity" />
                  {:else if label.toLowerCase() === 'facebook'}
                    <Facebook size={14} class="opacity-70 group-hover:opacity-100 transition-opacity" />
                  {/if}
                  <span>{label}</span>
                  <span class="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-[0.65rem] opacity-0 group-hover:opacity-100">↗</span>
                </a>
              </li>
            {/each}
          </ul>
        {:else}
          <ul class="space-y-3.5 text-xs">
            <li>
              <a
                href="https://instagram.com"
                rel="noreferrer"
                target="_blank"
                class="text-brand-light/75 hover:text-brand-green transition-colors hover-underline-anim inline-flex items-center gap-2 group"
              >
                <Instagram size={14} class="opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>Instagram</span>
                <span class="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-[0.65rem] opacity-0 group-hover:opacity-100">↗</span>
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                rel="noreferrer"
                target="_blank"
                class="text-brand-light/75 hover:text-brand-green transition-colors hover-underline-anim inline-flex items-center gap-2 group"
              >
                <Linkedin size={14} class="opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>LinkedIn</span>
                <span class="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-[0.65rem] opacity-0 group-hover:opacity-100">↗</span>
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                rel="noreferrer"
                target="_blank"
                class="text-brand-light/75 hover:text-brand-green transition-colors hover-underline-anim inline-flex items-center gap-2 group"
              >
                <Facebook size={14} class="opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>Facebook</span>
                <span class="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 text-[0.65rem] opacity-0 group-hover:opacity-100">↗</span>
              </a>
            </li>
          </ul>
        {/if}
      </div>
    </div>

    <!-- Outlined Watermark (Huge) -->
    <div
      class="watermark-container pointer-events-none select-none overflow-hidden py-10"
    >
      <div
        class="watermark-text text-[clamp(2rem,6.8vw,8rem)] font-display font-extrabold text-center tracking-tight leading-none uppercase whitespace-nowrap"
      >
        Studio Click House
      </div>
    </div>

    <!-- Bottom Legal Bar -->
    <div
      id="footer-legal"
      class="flex flex-col gap-4 pt-6 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-brand-light/45 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>
        &copy; {new Date().getFullYear()} Studio Click House. All rights reserved.
      </p>
      <div class="flex items-center gap-6 font-mono">
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
          class="group flex items-center gap-1.5 text-brand-green/80 hover:text-brand-green transition-colors"
        >
          <span>Back to top</span>
          <span class="inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
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
    border-radius: 9999px;
    filter: blur(80px);
    pointer-events: none;
    user-select: none;
    opacity: 0.8;
  }

  .glow-bubble-1 {
    top: -10rem;
    right: 5%;
    width: min(45rem, 80vw);
    height: 35rem;
    background: radial-gradient(
      circle,
      rgba(126, 166, 65, 0.08) 0%,
      transparent 70%
    );
  }

  .glow-bubble-2 {
    bottom: -5rem;
    left: -5rem;
    width: min(35rem, 60vw);
    height: 30rem;
    background: radial-gradient(
      circle,
      rgba(201, 255, 90, 0.035) 0%,
      transparent 65%
    );
  }

  .watermark-container {
    perspective: 1000px;
  }

  .watermark-text {
    background: linear-gradient(
      90deg,
      rgba(248, 248, 246, 0.05) 0%,
      rgba(248, 248, 246, 0.05) 25%,
      var(--color-brand-green) 45%,
      var(--color-brand-acid) 50%,
      var(--color-brand-green) 55%,
      rgba(248, 248, 246, 0.05) 75%,
      rgba(248, 248, 246, 0.05) 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px rgba(126, 166, 65, 0.2);
    animation: snake-text-flow 6s linear infinite;
    will-change: transform, background-position;
  }

  @keyframes snake-text-flow {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* Custom underline hover animation for premium look */
  .hover-underline-anim {
    position: relative;
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
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hover-underline-anim:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
</style>
