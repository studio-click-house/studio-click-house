<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import PortfolioCinematicHero from "$lib/components/sections/portfolio/PortfolioCinematicHero.svelte";
  import WorkGrid from "$lib/components/sections/portfolio/WorkGrid.svelte";
  import PortfolioCta from "$lib/components/sections/portfolio/PortfolioCta.svelte";
  import { siteConfig } from "$lib/config/site";
  import { portfolioPageData } from "$lib/content/portfolio";

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Portfolio | ${siteConfig.name}`,
    url: `${siteConfig.url}/portfolio`,
    description:
      "Selected post-production work spanning fashion editorial retouching, precision clipping paths, background removal, colour correction, and 3D CGI rendering by Studio Click House.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
</script>

<PageMeta
  title="Portfolio | Selected Post-Production Work — Studio Click House"
  description="Explore Studio Click House's portfolio of photo retouching, precision clipping path, background removal, colour correction, and 3D CGI rendering work for fashion brands and global studios."
  canonicalPath="/portfolio"
/>

<JsonLd data={portfolioSchema} />

<main id="main-content" class="relative">
  <PortfolioCinematicHero hero={portfolioPageData.hero} />
  <WorkGrid items={portfolioPageData.gallery} />
  <PortfolioCta cta={portfolioPageData.cta} />
</main>
