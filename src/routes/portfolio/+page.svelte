<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import PortfolioExactHero from "$lib/components/sections/portfolio/PortfolioExactHero.svelte";
  import PortfolioExactIntroWatermark from "$lib/components/sections/portfolio/PortfolioExactIntroWatermark.svelte";
  import PortfolioBeforeAfter from "$lib/components/sections/portfolio/PortfolioBeforeAfter.svelte";
  import PortfolioExactStaggeredCollage from "$lib/components/sections/portfolio/PortfolioExactStaggeredCollage.svelte";
  import PortfolioExactPanorama from "$lib/components/sections/portfolio/PortfolioExactPanorama.svelte";
  import PortfolioExactTabbedMatrix from "$lib/components/sections/portfolio/PortfolioExactTabbedMatrix.svelte";
  import PortfolioExactMosaicGallery from "$lib/components/sections/portfolio/PortfolioExactMosaicGallery.svelte";
  import PortfolioExactManifesto from "$lib/components/sections/portfolio/PortfolioExactManifesto.svelte";
  import PortfolioExactPartners from "$lib/components/sections/portfolio/PortfolioExactPartners.svelte";
  import PortfolioExactShowreel from "$lib/components/sections/portfolio/PortfolioExactShowreel.svelte";
  import PortfolioExactStats from "$lib/components/sections/portfolio/PortfolioExactStats.svelte";
  import { siteConfig } from "$lib/config/site";
  import { buildBreadcrumbSchema } from "$lib/utils/breadcrumbs";

  const breadcrumbData = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
  ]);

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
  title="Retouching & CGI Portfolio | SCHL"
  description="See selected SCHL work across fashion retouching, clipping paths, background removal, color correction, ghost mannequin, and 3D CGI."
  canonicalPath="/portfolio"
/>

<JsonLd data={portfolioSchema} />
<JsonLd data={breadcrumbData} />

<main
  id="main-content"
  class="relative bg-brand-light min-h-screen text-brand-dark overflow-x-hidden"
>
  <!-- 1. Hero with editorial display title & atmosphere -->
  <PortfolioExactHero />

  <!-- 2. Studio Introduction & 3 Technical Quality Pillars -->
  <PortfolioExactIntroWatermark />

  <!-- 3. Interactive Before/After Split Inspection Slider (Raw vs Retouched) -->
  <PortfolioBeforeAfter />

  <!-- 4. Staggered Asymmetric Editorial Collage -->
  <PortfolioExactStaggeredCollage />

  <!-- 5. Full-Width Panoramic Craft Spread -->
  <PortfolioExactPanorama />

  <!-- 6. Interactive Disciplines & Deliverables Matrix -->
  <PortfolioExactTabbedMatrix />

  <!-- 7. Filterable Work Archive Gallery with Lightbox -->
  <PortfolioExactMosaicGallery />

  <!-- 8. Authentic Studio Craft Manifesto -->
  <PortfolioExactManifesto />

  <!-- 9. Selected Luxury Brand Partners Matrix -->
  <PortfolioExactPartners />

  <!-- 10. Featured Studio Showreel with Interactive Controls -->
  <PortfolioExactShowreel />

  <!-- 11. Verified Studio Metrics (5M+, 150+, 10+, 99.8%) & Luxury Studio CTA -->
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
