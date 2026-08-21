<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import PortfolioExactHero from "$lib/components/sections/portfolio/PortfolioExactHero.svelte";
  import PortfolioExactIntroWatermark from "$lib/components/sections/portfolio/PortfolioExactIntroWatermark.svelte";
  import PortfolioExactStaggeredCollage from "$lib/components/sections/portfolio/PortfolioExactStaggeredCollage.svelte";
  import PortfolioExactPanorama from "$lib/components/sections/portfolio/PortfolioExactPanorama.svelte";
  import PortfolioExactTabbedMatrix from "$lib/components/sections/portfolio/PortfolioExactTabbedMatrix.svelte";
  import PortfolioExactMosaicGallery from "$lib/components/sections/portfolio/PortfolioExactMosaicGallery.svelte";
  import PortfolioExactManifesto from "$lib/components/sections/portfolio/PortfolioExactManifesto.svelte";
  import PortfolioExactPartners from "$lib/components/sections/portfolio/PortfolioExactPartners.svelte";
  import PortfolioExactShowreel from "$lib/components/sections/portfolio/PortfolioExactShowreel.svelte";
  import PortfolioExactStats from "$lib/components/sections/portfolio/PortfolioExactStats.svelte";
  import { siteConfig } from "$lib/config/site";

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

  $effect(() => {
    document.body.classList.add("portfolio-light-page");

    return () => {
      document.body.classList.remove("portfolio-light-page");
    };
  });
</script>

<PageMeta
  title="Portfolio | Selected Post-Production Work — Studio Click House"
  description="Explore the Studio Click House portfolio showcasing selected work in luxury fashion retouching, pen path clipping, background isolation, and 3D CGI renders."
  canonicalPath="/portfolio"
/>

<JsonLd data={portfolioSchema} />

<main
  id="main-content"
  class="relative bg-brand-light min-h-screen text-brand-dark overflow-x-hidden"
>
  <!-- 1. Hero with artistic display title -->
  <PortfolioExactHero />

  <!-- 2. 3-Column Intro + Giant STUDIO watermark with centered overlapping cutout photo -->
  <PortfolioExactIntroWatermark />

  <!-- 3. Staggered Asymmetric Collage + "Performing Craft" / "Craft" watermark divider -->
  <PortfolioExactStaggeredCollage />

  <!-- 4. Full-Width Panoramic Weave Texture Photo -->
  <PortfolioExactPanorama />

  <!-- 5. 4-Tab Matrix with Giant "26" Callout + 2-Column Schedule Grid + "Gallery ↗" label -->
  <PortfolioExactTabbedMatrix />

  <!-- 6. Tight 2-Tier 7-Image Mosaic Gallery -->
  <PortfolioExactMosaicGallery />

  <!-- 7. Centered Manifesto Quote with Brand Leaf Emblem -->
  <PortfolioExactManifesto />

  <!-- 8. Sponsor & Partner Minimal Monochrome Matrix -->
  <PortfolioExactPartners />

  <!-- 9. Featured Video / Showreel Spotlight with Centered Play Button -->
  <PortfolioExactShowreel />

  <!-- 10. 9 : 60 : 250 : 50 Numbers Row with Colons + Bottom Botanical Flourish -->
  <PortfolioExactStats />
</main>

<style>
  :global(.portfolio-light-page #site-footer) {
    border-color: color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
    background: var(--color-brand-light);
    color: var(--color-brand-dark);
  }

  :global(.portfolio-light-page #site-footer [class*="text-brand-light"]) {
    color: color-mix(in srgb, var(--color-brand-dark) 72%, transparent);
  }

  :global(.portfolio-light-page #site-footer [class*="border-brand-light"]) {
    border-color: color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
  }

  :global(.portfolio-light-page #site-footer .footer-glow) {
    opacity: 0.18;
  }
</style>
