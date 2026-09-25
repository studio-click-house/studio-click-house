<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import VideoHero from "$lib/components/sections/video-service/VideoHero.svelte";
  import VideoCommercialEditing from "$lib/components/sections/video-service/VideoCommercialEditing.svelte";
  import VideoColorGrading from "$lib/components/sections/video-service/VideoColorGrading.svelte";
  import VideoSocialCutdowns from "$lib/components/sections/video-service/VideoSocialCutdowns.svelte";
  import VideoAiGeneration from "$lib/components/sections/video-service/VideoAiGeneration.svelte";
  import VideoWorkflow from "$lib/components/sections/video-service/VideoWorkflow.svelte";
  import VideoDeliveryStandards from "$lib/components/sections/video-service/VideoDeliveryStandards.svelte";
  import FaqSection from "$lib/components/sections/FaqSection.svelte";
  import ServicesCta from "$lib/components/sections/ServicesCta.svelte";
  import { siteConfig } from "$lib/config/site";
  import { videoEditingPageData } from "$lib/content/video-editing";
  import { buildBreadcrumbSchema } from "$lib/utils/breadcrumbs";

  const serviceSchemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Commercial Video Editing, Color Grading & AI Video Generation",
    url: `${siteConfig.url}/services/video-editing`,
    description: videoEditingPageData.seo.description,
    serviceType: "Commercial Video Editing, Color Grading, Multi-Format Cutdowns & AI Motion",
    areaServed: "Worldwide",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${siteConfig.url}/contact`,
      serviceSmsNumber: siteConfig.contact.phone,
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: videoEditingPageData.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbData = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Video & AI Post-Production", path: "/services/video-editing" },
  ]);
</script>

<PageMeta
  title={videoEditingPageData.seo.title}
  description={videoEditingPageData.seo.description}
  canonicalPath="/services/video-editing"
/>

<JsonLd data={serviceSchemaData} />
<JsonLd data={faqSchemaData} />
<JsonLd data={breadcrumbData} />

<main id="main-content" class="relative min-h-screen bg-brand-light text-brand-dark">
  <!-- 1. Hero with Controlled Showreel & Immediate 4-Service Navigation -->
  <VideoHero 
    data={videoEditingPageData.hero} 
    services={videoEditingPageData.servicesOverview}
  />

  <!-- 2. Service 01: Commercial Video Editing & Sample Reel -->
  <VideoCommercialEditing data={videoEditingPageData.commercial} />

  <!-- 3. Service 02: Color Grading & Interactive Before/After Log Slider -->
  <VideoColorGrading data={videoEditingPageData.grading} />

  <!-- 4. Service 03: Social Media Cutdowns & 16:9 vs 9:16 Mobile Comparison -->
  <VideoSocialCutdowns data={videoEditingPageData.social} />

  <!-- 5. Service 04: AI Video Generation & Motion Synthesis Reel -->
  <VideoAiGeneration data={videoEditingPageData.aiGeneration} />

  <!-- 6. Production Workflow: 4-Step Collaborative Production Timeline -->
  <VideoWorkflow steps={videoEditingPageData.workflow} />

  <!-- 7. Delivery Standards: Codecs, Loudness & Archival Packages -->
  <VideoDeliveryStandards standards={videoEditingPageData.standards} />

  <!-- 8. Client FAQs -->
  <FaqSection
    items={videoEditingPageData.faqs}
    images={videoEditingPageData.faqImages}
  />

  <!-- 9. Start a Project CTA -->
  <ServicesCta />
</main>
