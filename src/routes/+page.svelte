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
  import ScrollImageStory from "$lib/components/sections/ScrollImageStory.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import { siteConfig } from "$lib/config/site";
  import { aboutPageData } from "$lib/content/about";
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
  title="Studio Click House (SCHL) | Image Editing, Retouching & Visual Production"
  description="Studio Click House (SCHL) is an editorial creative studio providing high-end photo retouching, image editing, video grading, and custom 3D CGI product renders for global brands and agencies."
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
  <ScrollImageStory />
  <ProductionProcess />        
  <FaqSection />
  <ClientLocations closingCta={aboutPageData.closingCta} />
</main>
