<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import HorizontalProjectsShowcase from "$lib/components/sections/HorizontalProjectsShowcase.svelte";
  import AboutClosingCta from "$lib/components/sections/about/AboutClosingCta.svelte";
  import { ArrowLeft, ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { siteConfig } from "$lib/config/site";
  import { aboutPageData } from "$lib/content/about";

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Pricing | ${siteConfig.name}`,
    url: `${siteConfig.url}/pricing`,
    description:
      "Explore photography, image retouching, and 3D CGI pricing models and selected works at Studio Click House.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
</script>

<PageMeta
  title="Pricing | Project Scope & Visual Production — Studio Click House"
  description="Explore Studio Click House's project scope estimates, photo retouching rates, and premium visual production packages."
  canonicalPath="/pricing"
/>

<JsonLd data={pricingSchema} />

<main id="pricing-page" class="relative bg-brand-light text-brand-dark pt-32">
  <header
    class="site-shell grid min-h-[50dvh] content-between gap-16 px-5 pb-16 pt-12 sm:px-10 lg:px-16"
  >
    <p class="font-mono text-xs uppercase tracking-[0.2em] text-brand-green">
      Pricing & Value
    </p>
    <div>
      <h1
        class="font-display text-[clamp(2.75rem,6.8vw,6.25rem)] font-bold tracking-[-0.04em] leading-[0.88] max-w-6xl"
      >
        Project<br />Pricing
      </h1>
      <p
        class="mt-8 max-w-xl text-base leading-relaxed text-brand-dark/70 sm:text-lg"
      >
        Explore our selected project showcases below. Rates and custom project
        scope estimates are tailored to your volume, complexity, and specific
        delivery requirements.
      </p>
    </div>
    <div
      class="flex flex-wrap gap-7 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em]"
    >
      <a
        href={resolve("/")}
        class="group inline-flex items-center gap-2 hover:text-brand-green transition-colors"
      >
        <ArrowLeft size={16} /> Back home
      </a>
      <a
        href={resolve("/contact")}
        class="group inline-flex items-center gap-2 hover:text-brand-green transition-colors"
      >
        Discuss a project <ArrowUpRight size={16} />
      </a>
    </div>
  </header>

  <!-- WebGL Pinned Horizontal Projects Showcase -->
  <HorizontalProjectsShowcase />

  <AboutClosingCta closingCta={aboutPageData.closingCta} />
</main>
