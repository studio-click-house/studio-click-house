<script lang="ts">
  import PageScrollReveals from "$lib/components/animations/PageScrollReveals.svelte";
  import AboutOrbitGallery from "$lib/components/sections/about/AboutOrbitGallery.svelte";
  import ClientLocations from "$lib/components/sections/ClientLocations.svelte";
  import CreativeMarquee from "$lib/components/sections/CreativeMarquee.svelte";
  import FaqSection from "$lib/components/sections/FaqSection.svelte";
  import HomeHero from "$lib/components/sections/HomeHero.svelte";
  import HorizontalProjectsShowcase from "$lib/components/sections/HorizontalProjectsShowcase.svelte";
  import ProductionProcess from "$lib/components/sections/ProductionProcess.svelte";
  import StudioIntroduction from "$lib/components/sections/StudioIntroduction.svelte";
  import TestimonialsSection from "$lib/components/sections/TestimonialsSection.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import { siteConfig } from "$lib/config/site";
  import { faqs } from "$lib/content/home";

  let { data } = $props();
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/brand/schl-logo.png`,
    description: siteConfig.description,
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
</script>

<PageMeta
  title="Studio Click House | Image Editing, Retouching & Visual Production"
  description="Studio Click House provides image editing, retouching, and visual production for brands, studios, and production teams."
  canonicalPath="/"
/>
<JsonLd data={organizationData} />
<JsonLd data={faqData} />

<main id="main-content">
  <PageScrollReveals />
  <HomeHero />
  <StudioIntroduction />
  <AboutOrbitGallery />
  <HorizontalProjectsShowcase />
  <CreativeMarquee items={data.clientLogoItems} />
  <ProductionProcess />
  <TestimonialsSection />
  <FaqSection />
  <ClientLocations />
</main>
