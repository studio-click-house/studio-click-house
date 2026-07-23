<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import PortfolioHero from "$lib/components/sections/portfolio/PortfolioHero.svelte";
  import ServiceBreakdownRail from "$lib/components/sections/portfolio/ServiceBreakdownRail.svelte";
  import SelectedWork from "$lib/components/sections/SelectedWork.svelte";
  import AboutClosingCta from "$lib/components/sections/about/AboutClosingCta.svelte";
  import { siteConfig } from "$lib/config/site";
  import { aboutPageData } from "$lib/content/about";

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Portfolio | ${siteConfig.name}`,
    url: `${siteConfig.url}/portfolio`,
    description:
      "Selected post-production work, fashion editorial skin retouching, precision clipping paths, background removal, and 3D CGI rendering by Studio Click House.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
</script>

<PageMeta
  title="Portfolio | Selected Post-Production Work — Studio Click House"
  description="Explore Studio Click House's portfolio of photo retouching, precision clipping path, background removal, and 3D CGI rendering work for fashion brands and global studios."
  canonicalPath="/portfolio"
/>

<JsonLd data={portfolioSchema} />

<main class="relative bg-brand-light text-brand-dark">
  <PortfolioHero />
  <ServiceBreakdownRail />
  <SelectedWork />
  <AboutClosingCta closingCta={aboutPageData.closingCta} />
</main>


