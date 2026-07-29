<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import AboutClosingCta from "$lib/components/sections/about/AboutClosingCta.svelte";
  import PageScrollReveals from "$lib/components/animations/PageScrollReveals.svelte";
  import PricingHero from "$lib/components/sections/pricing/PricingHero.svelte";
  import PricingOptions from "$lib/components/sections/pricing/PricingOptions.svelte";
  import PricingAssurances from "$lib/components/sections/pricing/PricingAssurances.svelte";
  import FaqSection from "$lib/components/sections/FaqSection.svelte";
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

<main id="pricing-page" class="relative bg-brand-light text-brand-dark">
  <PageScrollReveals />

  <!-- Cinematic Three.js WebGL Interactive Wave / Image Hero -->
  <PricingHero />

  <PricingOptions />

  <PricingAssurances />

  <!-- Shared Studio FAQ Section ("our faq section alredy have just use it") -->
  <FaqSection />

  <!-- Closing Call-to-Action -->
  <AboutClosingCta closingCta={aboutPageData.closingCta} />
</main>
