<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import ServiceBreakdownRail from "$lib/components/sections/portfolio/ServiceBreakdownRail.svelte";
  import HorizontalProjectsShowcase from "$lib/components/sections/HorizontalProjectsShowcase.svelte";
  import AboutOrbitGallery from "$lib/components/sections/about/AboutOrbitGallery.svelte";
  import { siteConfig } from "$lib/config/site";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Service Breakdown & Showcase | ${siteConfig.name}`,
    url: `${siteConfig.url}/section`,
    description: "Explore our professional post-production workflow breakdown, selected project showcases, and fanned work orbit gallery.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    }
  };
</script>

<PageMeta
  title="Service Breakdown & Studio Showcase | Studio Click House"
  description="Step-by-step professional post-production workflow showing image editing, clipping paths, subject isolation, fanned work orbit gallery, and selected CGI project showcases."
  canonicalPath="/section"
/>

<JsonLd data={schemaData} />

<main class="relative bg-brand-light text-brand-dark">
  <ServiceBreakdownRail />
  <HorizontalProjectsShowcase />
  <AboutOrbitGallery />
</main>
