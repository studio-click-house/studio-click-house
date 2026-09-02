<script lang="ts">
  import { onMount } from "svelte";
  import {
    ArrowUp,
    Instagram,
    Linkedin,
    Facebook,
    MessageCircle,
    Youtube,
  } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { siteConfig } from "$lib/config/site";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";

  const services = [
    { label: "Photo Retouching", href: "/services" },
    { label: "Background Removal", href: "/services/background-remove" },
    { label: "Color Correction", href: "/services/color-correction" },
    { label: "Video Editing", href: "/services/video-editing" },
    { label: "3D & CGI Modeling", href: "/services/3d-modeling" },
  ] as const;

  interface CompanyLink {
    label: string;
    href: "/about" | "/careers" | "/pricing" | "/portfolio" | "/events" | "/contact";
    badge?: string;
  }

  const companyLinks: readonly CompanyLink[] = [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers", badge: "Hiring" },
    { label: "Pricing", href: "/pricing" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Events & CSR", href: "/events" },
    { label: "Contact", href: "/contact" },
  ];

  const policyLinks = [
    { label: "CSR & Community", href: "/csr" },
    { label: "Data Security & NDA", href: "/privacy" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/terms" },
  ] as const;

  const directLines = [
    { code: "BD", label: "Bangladesh HQ", number: "+880 9609-777111", href: "tel:+8809609777111" },
    { code: "UK", label: "London Office", number: "+44 333 004 7739", href: "tel:+443330047739" },
    { code: "SE", label: "Stockholm Hub", number: "+46 8 559 24212", href: "tel:+46855924212" },
    { code: "AU", label: "Sydney Hub", number: "+61 4 8396 3759", href: "tel:+61483963759" },
  ] as const;

  const affiliations = [
    {
      name: "BACCO",
      caption: "Call Centre & Outsourcing",
      fullName: "Bangladesh Association of Call Centre & Outsourcing",
      src: "/images/affiliations/bacco.png",
      width: 842,
      height: 296,
    },
    {
      name: "BASIS",
      caption: "Software & Information Services",
      fullName: "Bangladesh Association of Software & Information Services",
      src: "/images/affiliations/basis.svg",
      width: 299,
      height: 105,
    },
    {
      name: "DCCI",
      caption: "Dhaka Chamber of Commerce",
      fullName: "Dhaka Chamber of Commerce & Industry",
      src: "/images/affiliations/dcci.png",
      width: 1459,
      height: 348,
    },
    {
      name: "ISO",
      caption: "ISO Certified",
      fullName: "International Organization for Standardization",
      src: "/images/affiliations/iso-wordmark.svg",
      width: 172,
      height: 59,
    },
  ] as const;

  const socials = [
    { label: "Instagram", href: siteConfig.links.instagram || "https://instagram.com/studioclickhouse", icon: Instagram },
    { label: "LinkedIn", href: siteConfig.links.linkedin || "https://linkedin.com/company/studioclickhouse", icon: Linkedin },
    { label: "Facebook", href: siteConfig.links.facebook || "https://facebook.com/studioclickhouse", icon: Facebook },
    { label: "WhatsApp", href: siteConfig.links.whatsapp || "https://wa.me/8809609777111", icon: MessageCircle },
    { label: "YouTube", href: siteConfig.links.youtube || "https://youtube.com/@studioclickhouse", icon: Youtube },
  ] as const;

  let footerElement = $state<HTMLElement>();

  function scrollToTop(e: Event) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !footerElement) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".footer-reveal", {
            autoAlpha: 0,
            y: 20,
            duration: 0.75,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerElement,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });

        return () => media.revert();
      }, footerElement);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<footer
  bind:this={footerElement}
  id="site-footer"
  class="relative overflow-hidden bg-brand-light text-brand-dark pt-16 pb-8"
>
  <div class="site-shell relative z-10">
    <!-- Main Top Grid -->
    <div class="footer-reveal grid gap-10 lg:grid-cols-12 lg:gap-12 pb-8">
      <!-- Left Column: Brand, Direct Contacts, Socials & Payments -->
      <div class="lg:col-span-5 space-y-5">
        <div class="space-y-2.5">
          <div class="flex items-center">
            <img
              src="/images/brand/schl-logo.png"
              alt="Studio Click House"
              width="190"
              height="95"
              class="h-9 w-auto"
            />
          </div>
          <p class="font-mono text-[0.65rem] font-bold tracking-[0.22em] text-brand-dark uppercase">
            {$_('footer.tagline') || 'Every Pixel Finished With Intent'}
          </p>
        </div>

        <p class="text-[0.86rem] leading-relaxed text-brand-dark/70 max-w-md font-sans">
          {$_('footer.description') || 'Studio Click House is a full-scale Creative Post-Production Studio helping global E-commerce brands, Retailers, Agencies, and Photo studios produce clean, consistent, high-impact content at scale.'}
        </p>

        <!-- Direct Email -->
        <div>
          <span class="font-mono text-[0.56rem] font-bold uppercase tracking-[0.2em] text-brand-dark/45 block mb-1">
            {$_('footer.emailUs') || 'Email Us'}
          </span>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            class="font-sans text-xl font-bold tracking-tight text-brand-dark border-b-2 border-brand-dark pb-0.5 hover:text-brand-green hover:border-brand-green transition-colors"
          >
            {siteConfig.contact.email}
          </a>
        </div>

        <!-- Newsletter Subscription -->
        <div class="max-w-md pt-2">
          <span class="font-mono text-[0.56rem] font-bold uppercase tracking-[0.2em] text-brand-dark/45 block mb-2">
            {$_('footer.newsletterTitle') || 'Join our newsletter'}
          </span>
          <form class="flex w-full items-center">
            <input
              type="email"
              placeholder={$_('footer.newsletterPlaceholder') || 'Enter your email'}
              required
              class="w-full rounded-l-md border border-r-0 border-brand-dark/15 bg-white px-3 py-2 text-[0.8rem] text-brand-dark placeholder:text-brand-dark/40 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            />
            <button
              type="submit"
              class="rounded-r-md bg-brand-dark px-4 py-2 text-[0.8rem] font-semibold text-white transition-colors hover:bg-brand-green whitespace-nowrap border border-brand-dark hover:border-brand-green"
            >
              {$_('footer.newsletterButton') || 'Subscribe'}
            </button>
          </form>
        </div>

        <!-- Original Studio Social Media Tiles -->
        <div class="pt-1">
          <div class="flex flex-wrap items-center gap-2">
            {#each socials as item (item.label)}
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                class="group flex size-9 items-center justify-center rounded-[8px] border border-brand-dark/12 bg-white text-brand-dark/70 shadow-xs transition-all duration-250 hover:-translate-y-0.5 hover:border-brand-dark hover:bg-brand-dark hover:text-white"
                title={item.label}
                aria-label={item.label}
              >
                <item.icon size={15} strokeWidth={1.8} class="transition-transform duration-200 group-hover:scale-110" />
              </a>
            {/each}
          </div>
        </div>

        <!-- Payment Badges moved right after Social Media -->
        <div class="pt-2">
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Visa -->
            <div
              class="h-7 w-12 rounded-[4px] bg-white px-1 flex items-center justify-center shadow-xs border border-brand-dark/10 transition-transform duration-200 hover:scale-105"
              title="Visa"
            >
              <svg viewBox="0 0 48 32" class="h-3.5 w-auto" role="img" aria-label="Visa">
                <path fill="#1A1F71" d="M19.5 9.8l-3.2 12.4h-3l3.2-12.4h3zm15.4 8l1.6-4.3.9 4.3h-2.5zm3.3 4.4h2.8l-2.5-12.4h-2.6c-.6 0-1.1.3-1.3.9l-4.5 11.5h3.1l.6-1.7h3.9l.4 1.7zm-7.9-4.1c0-3.3-4.6-3.5-4.6-5 0-.5.5-1 1.4-1 .9 0 1.5.2 2.1.5l.4-1.7c-.6-.2-1.4-.4-2.4-.4-2.5 0-4.3 1.3-4.3 3.2 0 1.4 1.3 2.1 2.2 2.7 1 .5 1.3.9 1.3 1.3 0 .8-.8 1.1-1.5 1.1-.9 0-1.8-.2-2.6-.7l-.4 1.8c.8.3 1.7.5 2.8.5 2.7 0 4.5-1.3 4.5-3.6zM16.8 9.8l-4.8 12.4h-2.9l-2.4-9.9c-.1-.5-.3-.8-.8-1-1.1-.6-2.3-1-3.4-1.3l.1-.3h5c.7 0 1.2.4 1.4 1.2l1.3 6.5 3.1-7.7h3.2z" />
              </svg>
            </div>

            <!-- Mastercard -->
            <div
              class="h-7 w-12 rounded-[4px] bg-[#222324] px-1 flex items-center justify-center shadow-xs border border-white/10 transition-transform duration-200 hover:scale-105"
              title="Mastercard"
            >
              <svg viewBox="0 0 38 24" class="h-3.5 w-auto" role="img" aria-label="Mastercard">
                <circle cx="13" cy="12" r="9" fill="#EB001B" />
                <circle cx="25" cy="12" r="9" fill="#F79E1B" />
                <path d="M19 5.3a8.9 8.9 0 0 1 3.4 6.7 8.9 8.9 0 0 1-3.4 6.7 8.9 8.9 0 0 1-3.4-6.7c0-2.6 1.3-5 3.4-6.7z" fill="#FF5F00" />
              </svg>
            </div>

            <!-- PayPal -->
            <div
              class="h-7 w-12 rounded-[4px] bg-white px-1 flex items-center justify-center shadow-xs border border-brand-dark/10 transition-transform duration-200 hover:scale-105"
              title="PayPal"
            >
              <svg viewBox="0 0 34 24" class="h-3.5 w-auto" role="img" aria-label="PayPal">
                <path fill="#003087" d="M11.5 19.5h-4a.6.6 0 0 1-.6-.7l3.8-15.6c.1-.4.5-.7.9-.7h6.2c2.2 0 3.8.5 4.7 1.5.9 1 1.1 2.1.8 3.7-.6 3.1-2.6 4.9-5.8 4.9h-3.4c-.4 0-.7.3-.8.7l-1.6 6.2z"/>
                <path fill="#0079C1" d="M14.8 13.7c.4-.1.8-.1 1.2-.1 3.2 0 5.2-1.8 5.8-4.9.3-1.6.1-2.7-.8-3.7-.4-.4-.9-.8-1.5-1-.2 1.4-.7 2.6-1.5 3.5-1.1 1.2-2.7 1.8-4.6 1.8h-2.4c-.4 0-.7.3-.8.7l-1.7 6.7h3.1l1.1-4.4c.1-.4.5-.6.9-.6h1.2z"/>
                <path fill="#00457C" d="M14.5 9.4c0-.1.1-.3.1-.4.2-.8.8-1.5 1.5-2 .7-.6 1.6-.9 2.7-.9h-6.2c-.4 0-.8.3-.9.7l-3.8 15.6a.6.6 0 0 0 .6.7h4l1.6-6.2c.1-.4.4-.7.8-.7h1.4c3.2 0 5.2-1.8 5.8-4.9.1-.5.1-.9.1-1.3-1.8.1-3.6.5-5 1.4-.9.6-1.5 1.3-1.9 2.6z"/>
              </svg>
            </div>

            <!-- American Express -->
            <div
              class="h-7 w-12 rounded-[4px] bg-[#006FCF] px-1 flex items-center justify-center shadow-xs border border-[#006FCF]/40 transition-transform duration-200 hover:scale-105"
              title="American Express"
            >
              <span class="font-mono text-[0.55rem] font-black tracking-tighter text-white uppercase">AMEX</span>
            </div>

            <!-- Apple Pay -->
            <div
              class="h-7 w-12 rounded-[4px] bg-white px-1 flex items-center justify-center shadow-xs border border-brand-dark/10 transition-transform duration-200 hover:scale-105"
              title="Apple Pay"
            >
              <svg viewBox="0 0 38 24" class="h-3.5 w-auto fill-black" role="img" aria-label="Apple Pay">
                <path d="M7.7 7.7c-.5.6-1.3 1-2.1.9-.1-.8.2-1.7.7-2.2.5-.6 1.3-.9 2-.9.1.8-.2 1.6-.6 2.2zm.6 1.1c-1.2-.1-2.1.7-2.7.7-.6 0-1.4-.6-2.3-.6-1.2 0-2.3.7-2.9 1.8-1.3 2.2-.3 5.4.9 7.2.6.9 1.3 1.8 2.3 1.8s1.3-.6 2.5-.6c1.1 0 1.4.6 2.4.6 1 0 1.7-.9 2.3-1.8.7-1 1-2 1-2-.1 0-2-.8-2-3 0-1.9 1.5-2.8 1.6-2.9-1-.1-1.9-1.2-3.1-1.2zM15 5.5v12.2h1.6V12h2.9c2.3 0 3.8-1.5 3.8-3.3 0-1.8-1.5-3.2-3.8-3.2H15zm1.6 1.5h2.8c1.5 0 2.3.8 2.3 1.8s-.8 1.8-2.3 1.8h-2.8V7zm9.6 10.8c.8 0 1.6-.4 1.9-1.1v1h1.5V11.2h-1.5v1c-.4-.7-1.1-1.1-1.9-1.1-1.6 0-2.7 1.4-2.7 3.3 0 2 1.1 3.4 2.7 3.4zm.5-1.4c-.9 0-1.6-.7-1.6-2s.7-2 1.6-2 1.6.7 1.6 2-.7 2-1.6 2zm6.7 3.7l1.7-4.6-2.3-6.2h1.7l1.4 4.3 1.4-4.3h1.7l-3.9 9.6c-.4 1-.9 1.2-1.7 1.2h-1v-.9z"/>
              </svg>
            </div>

            <!-- Google Pay -->
            <div
              class="h-7 w-12 rounded-[4px] bg-white px-1 flex items-center justify-center shadow-xs border border-brand-dark/10 transition-transform duration-200 hover:scale-105"
              title="Google Pay"
            >
              <svg viewBox="0 0 38 24" class="h-3.5 w-auto" role="img" aria-label="Google Pay">
                <path fill="#4285F4" d="M12.8 11.2h-5v2.3h2.9c-.2 1.2-1.3 2-2.9 2-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1c.8 0 1.5.3 2.1.8l1.7-1.7C10.7 7.5 9.3 7 7.8 7 4.9 7 2.6 9.3 2.6 12.2s2.3 5.2 5.2 5.2c3 0 5-2.1 5-5.1 0-.4 0-.8-.1-1.1h.1z"/>
                <path fill="#5F6368" d="M16.5 5.5v12.2h1.6V12h2.9c2.3 0 3.8-1.5 3.8-3.3 0-1.8-1.5-3.2-3.8-3.2h-4.5zm1.6 1.5h2.8c1.5 0 2.3.8 2.3 1.8s-.8 1.8-2.3 1.8h-2.8V7zm9.6 10.8c.8 0 1.6-.4 1.9-1.1v1h1.5V11.2h-1.5v1c-.4-.7-1.1-1.1-1.9-1.1-1.6 0-2.7 1.4-2.7 3.3 0 2 1.1 3.4 2.7 3.4zm.5-1.4c-.9 0-1.6-.7-1.6-2s.7-2 1.6-2 1.6.7 1.6 2-.7 2-1.6 2zm6.7 3.7l1.7-4.6-2.3-6.2h1.7l1.4 4.3 1.4-4.3h1.7l-3.9 9.6c-.4 1-.9 1.2-1.7 1.2h-1v-.9z"/>
              </svg>
            </div>

            <!-- SSLCommerz -->
            <div
              class="h-7 w-12 rounded-[4px] bg-[#003E78] px-1 flex items-center justify-center shadow-xs border border-[#003E78]/40 transition-transform duration-200 hover:scale-105"
              title="SSLCommerz"
            >
              <span class="flex flex-col items-center leading-none">
                <span class="font-mono text-[0.55rem] font-black tracking-tight text-white">SSL</span>
                <span class="font-mono text-[0.4rem] font-bold tracking-[0.06em] text-white/85">COMMERZ</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: OUR LOCATIONS (4 Country Cards + Navigation) -->
      <div class="lg:col-span-7 space-y-4">
        <div class="flex items-center justify-between pb-1">
          <p class="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-dark/45">
            {$_('footer.locationsTitle') || 'Our Locations'}
          </p>
          <span class="font-mono text-[0.65rem] text-brand-dark/50 font-semibold">{$_('footer.productionTag') || '24/7 Global Production'}</span>
        </div>

        <!-- Headquarters Card (Bangladesh / Dhaka) -->
        <div class="relative overflow-hidden rounded-[14px] border border-brand-dark/10 bg-white p-5 shadow-xs transition-all duration-300 hover:border-brand-dark/30 hover:shadow-sm">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span class="font-mono text-[0.58rem] font-bold uppercase tracking-[0.2em] text-brand-dark/45 block mb-1">
                {$_('footer.headquarters') || 'Headquarters'}
              </span>
              <h3 class="font-display text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark flex items-baseline gap-2.5">
                DHAKA <span class="font-sans text-xs font-medium text-brand-dark/50">Bangladesh</span>
              </h3>
              <p class="mt-1 text-[0.76rem] text-brand-dark/60 font-sans max-w-sm">
                Level 1, West Boxnagar, Demra, Dhaka-1361
              </p>
            </div>
            <div class="flex flex-col md:items-end gap-0.5 font-mono text-[0.75rem]">
              <a
                href="tel:+8809609777111"
                class="font-bold text-brand-dark hover:text-brand-green transition-colors tabular-nums"
              >
                +880 9609-777111
              </a>
            </div>
          </div>
          <!-- Architectural Skyline Watermark Outline -->
          <div class="pointer-events-none absolute right-3 bottom-0 opacity-15" aria-hidden="true">
            <svg width="220" height="65" viewBox="0 0 220 65" fill="none" stroke="currentColor" class="text-brand-dark">
              <path d="M5 65V45h15V30h10v35h12V18h20v47h15V8h18v57h12V25h16v40h15V20h20v45h15V35h15v30h12" stroke-width="1.5" />
            </svg>
          </div>
        </div>

        <!-- 3 Regional Hub Cards Grid (United Kingdom, Sweden, Australia) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- United Kingdom / London -->
          <div class="relative overflow-hidden rounded-[12px] border border-brand-dark/10 bg-white p-4 shadow-xs transition-all duration-300 hover:border-brand-dark/30 hover:shadow-sm flex flex-col justify-between">
            <div>
              <span class="font-mono text-[0.55rem] font-bold uppercase tracking-[0.18em] text-brand-dark/45 block mb-0.5">
                {$_('footer.europeHub') || 'Europe Hub'}
              </span>
              <h4 class="font-display text-lg font-bold text-brand-dark flex items-baseline gap-1.5">
                LONDON <span class="font-sans text-[0.68rem] font-normal text-brand-dark/50">UK</span>
              </h4>
              <p class="text-[0.7rem] text-brand-dark/50 font-sans mt-0.5">London, UK</p>
            </div>
            <div class="mt-2.5 pt-2 border-t border-brand-dark/6">
              <a href="tel:+443330047739" class="font-mono text-[0.7rem] font-medium text-brand-dark/80 hover:text-brand-green transition-colors block tabular-nums">
                +44 333 004 7739
              </a>
            </div>
          </div>

          <!-- Sweden / Stockholm -->
          <div class="relative overflow-hidden rounded-[12px] border border-brand-dark/10 bg-white p-4 shadow-xs transition-all duration-300 hover:border-brand-dark/30 hover:shadow-sm flex flex-col justify-between">
            <div>
              <span class="font-mono text-[0.55rem] font-bold uppercase tracking-[0.18em] text-brand-dark/45 block mb-0.5">
                {$_('footer.nordicHub') || 'Nordic Hub'}
              </span>
              <h4 class="font-display text-lg font-bold text-brand-dark flex items-baseline gap-1.5">
                SWEDEN <span class="font-sans text-[0.68rem] font-normal text-brand-dark/50">Stockholm</span>
              </h4>
              <p class="text-[0.7rem] text-brand-dark/50 font-sans mt-0.5">Stockholm, Sweden</p>
            </div>
            <div class="mt-2.5 pt-2 border-t border-brand-dark/6">
              <a href="tel:+46855924212" class="font-mono text-[0.7rem] font-medium text-brand-dark/80 hover:text-brand-green transition-colors block tabular-nums">
                +46 8 559 24212
              </a>
            </div>
          </div>

          <!-- Australia / Sydney -->
          <div class="relative overflow-hidden rounded-[12px] border border-brand-dark/10 bg-white p-4 shadow-xs transition-all duration-300 hover:border-brand-dark/30 hover:shadow-sm flex flex-col justify-between">
            <div>
              <span class="font-mono text-[0.55rem] font-bold uppercase tracking-[0.18em] text-brand-dark/45 block mb-0.5">
                {$_('footer.americasApac') || 'Americas & APAC'}
              </span>
              <h4 class="font-display text-lg font-bold text-brand-dark flex items-baseline gap-1.5">
                AUSTRALIA <span class="font-sans text-[0.68rem] font-normal text-brand-dark/50">Sydney</span>
              </h4>
              <p class="text-[0.7rem] text-brand-dark/50 font-sans mt-0.5">Sydney, Australia</p>
            </div>
            <div class="mt-2.5 pt-2 border-t border-brand-dark/6">
              <a href="tel:+61483963759" class="font-mono text-[0.7rem] font-medium text-brand-dark/80 hover:text-brand-green transition-colors block tabular-nums">
                +61 4 8396 3759
              </a>
            </div>
          </div>
        </div>

        <!-- Navigation Columns below Locations -->
        <div class="grid grid-cols-3 gap-5 pt-4">
          <!-- Company -->
          <div class="space-y-2.5">
            <p class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-brand-dark/45">
              {$_('footer.company') || 'Company'}
            </p>
            <ul class="space-y-1.5 text-[0.82rem]">
              {#each companyLinks as link, idx (link.href)}
                <li>
                  <a
                    href={resolve(link.href)}
                    class="text-brand-dark/75 hover:text-brand-green transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{$_(`footer.companyLinks.${idx}`) || link.label}</span>
                    {#if link.badge}
                      <span class="rounded bg-brand-acid px-1 py-0.2 font-mono text-[0.5rem] font-bold uppercase text-brand-dark">
                        {link.badge}
                      </span>
                    {/if}
                  </a>
                </li>
              {/each}
              <li>
                <a
                  href={resolve("/contact")}
                  class="font-bold text-brand-green hover:underline decoration-brand-green underline-offset-4"
                >
                  {$_('footer.freeTrial') || 'Free Trial'}
                </a>
              </li>
            </ul>
          </div>

          <!-- Services -->
          <div class="space-y-2.5">
            <p class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-brand-dark/45">
              {$_('footer.services') || 'Services'}
            </p>
            <ul class="space-y-1.5 text-[0.82rem]">
              {#each services as link, idx (link.href)}
                <li>
                  <a
                    href={resolve(link.href)}
                    class="text-brand-dark/75 hover:text-brand-green transition-colors"
                  >
                    {$_(`footer.serviceLinks.${idx}`) || link.label}
                  </a>
                </li>
              {/each}
            </ul>
          </div>

          <!-- Policy -->
          <div class="space-y-2.5">
            <p class="font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-brand-dark/45">
              {$_('footer.policy') || 'Policy'}
            </p>
            <ul class="space-y-1.5 text-[0.82rem]">
              {#each policyLinks as link, idx (link.label)}
                <li>
                  <a
                    href={resolve(link.href)}
                    class="text-brand-dark/70 hover:text-brand-green transition-colors"
                  >
                    {$_(`footer.policyLinks.${idx}`) || link.label}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>



    <!-- Accreditation & Membership Card -->
    <div id="footer-affiliations" class="footer-reveal">
      <div class="overflow-hidden rounded-[14px] border border-brand-dark/10 bg-white shadow-xs">
        <div class="flex items-center justify-between px-5 pt-4 pb-1">
          <p class="font-mono text-[0.56rem] font-bold uppercase tracking-[0.2em] text-brand-dark/45">
            {$_('footer.accreditations') || 'Accredited & Member Of'}
          </p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4">
          {#each affiliations as item, i (item.name)}
            <div
              class="group flex flex-col items-center justify-center gap-2.5 border-brand-dark/8 px-4 py-5 transition-colors duration-300 hover:bg-brand-dark/[0.02] {i % 2 === 0
                ? 'border-r'
                : ''} {i < 2 ? 'border-b sm:border-b-0' : ''} {i < 3 ? 'sm:border-r' : ''}"
            >
              <img
                src={item.src}
                alt={item.fullName}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
                title={item.fullName}
                class="h-7 w-auto object-contain transition-all duration-300 [filter:grayscale(100%)_brightness(0)_opacity(60%)] group-hover:opacity-100 group-hover:[filter:grayscale(0%)_brightness(1)_opacity(100%)] md:h-8"
              />
              <span class="text-center font-mono text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-brand-dark/45">
                {item.caption}
              </span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Bottom Legal Bar -->
    <div
      class="footer-reveal flex flex-col gap-3 pt-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-brand-dark/50 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>
        &copy; {new Date().getFullYear()} {$_('footer.allRightsReserved') || 'Studio Click House Limited. All rights reserved.'}
      </p>
      <div class="flex items-center gap-6">
        <a
          href={resolve("/privacy")}
          class="hover:text-brand-dark transition-colors">{$_('footer.privacy') || 'Privacy'}</a
        >
        <a
          href={resolve("/terms")}
          class="hover:text-brand-dark transition-colors">{$_('footer.terms') || 'Terms'}</a
        >
        <a
          href="#top"
          onclick={scrollToTop}
          class="group flex items-center gap-1.5 text-brand-dark hover:text-brand-green transition-colors font-bold"
        >
          <span>{$_('footer.backToTop') || 'Back to top'}</span>
          <ArrowUp
            size={13}
            class="transition-transform duration-300 group-hover:-translate-y-1"
          />
        </a>
      </div>
    </div>
  </div>
</footer>
