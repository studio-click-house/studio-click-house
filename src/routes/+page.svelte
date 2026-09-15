<script lang="ts">
  import PageScrollReveals from "$lib/components/animations/PageScrollReveals.svelte";
  import AboutOrbitGallery from "$lib/components/sections/about/AboutOrbitGallery.svelte";
  import ClientLocations from "$lib/components/sections/ClientLocations.svelte";
  import CreativeMarquee from "$lib/components/sections/CreativeMarquee.svelte";
  import FaqSection from "$lib/components/sections/FaqSection.svelte";
  import HomeHero from "$lib/components/sections/HomeHero.svelte";
  import HorizontalProjectsShowcase from "$lib/components/sections/HorizontalProjectsShowcase.svelte";
  import ProductionProcess from "$lib/components/sections/ProductionProcess.svelte";
  import AboutDescription from "$lib/components/sections/AboutDescription.svelte";
  import AiAboutSection from "$lib/components/sections/AiAboutSection.svelte";
  import ScrollImageStory from "$lib/components/sections/ScrollImageStory.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import { siteConfig } from "$lib/config/site";
  import { aboutPageData } from "$lib/content/about";
  import { faqs } from "$lib/content/home";
  import { homeFaqImages, homeOrbitCards } from "$lib/content/home-media";

  let { data } = $props();

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
  title="Photo Retouching & CGI Production | SCHL"
  description="Studio Click House provides photo retouching, clipping paths, color grading, and 3D CGI for e-commerce brands, agencies, photographers, and studios."
  canonicalPath="/"
/>
<JsonLd data={faqData} />

<main id="main-content">
  <PageScrollReveals />
  <HomeHero />
  <AboutDescription />
  <AiAboutSection />
  <AboutOrbitGallery cards={homeOrbitCards} />
  <HorizontalProjectsShowcase />
  <CreativeMarquee items={data.clientLogoItems} />
  <ScrollImageStory />
  <ProductionProcess />        
  <FaqSection images={homeFaqImages} />
  <ClientLocations closingCta={aboutPageData.closingCta} />
</main>
