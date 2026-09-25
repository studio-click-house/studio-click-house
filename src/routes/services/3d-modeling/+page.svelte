<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import ThreeDHero from "$lib/components/sections/three-d-service/ThreeDHero.svelte";
  import ThreeDProductModelingService from "$lib/components/sections/three-d-service/ThreeDProductModelingService.svelte";
  import ThreeDCgiRenderingService from "$lib/components/sections/three-d-service/ThreeDCgiRenderingService.svelte";
  import ThreeDWebInteractiveService from "$lib/components/sections/three-d-service/ThreeDWebInteractiveService.svelte";
  import ThreeDWorkflow from "$lib/components/sections/three-d-service/ThreeDWorkflow.svelte";
  import ThreeDDeliveryStandards from "$lib/components/sections/three-d-service/ThreeDDeliveryStandards.svelte";
  import FaqSection from "$lib/components/sections/FaqSection.svelte";
  import ServicesCta from "$lib/components/sections/ServicesCta.svelte";
  import { siteConfig } from "$lib/config/site";
  import { threeDModelingPageData } from "$lib/content/three-d-modeling";
  import { buildBreadcrumbSchema } from "$lib/utils/breadcrumbs";

  const serviceSchemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "3D Product Modeling, PBR Texturing & CGI Rendering",
    url: `${siteConfig.url}/services/3d-modeling`,
    description: threeDModelingPageData.seo.description,
    serviceType: "3D Product Modeling, PBR Shading, CGI Rendering & Web 3D",
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
    mainEntity: threeDModelingPageData.faqs.map((faq) => ({
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
    { name: "3D Modeling & CGI", path: "/services/3d-modeling" },
  ]);
</script>

<PageMeta
  title={threeDModelingPageData.seo.title}
  description={threeDModelingPageData.seo.description}
  canonicalPath="/services/3d-modeling"
/>

<JsonLd data={serviceSchemaData} />
<JsonLd data={faqSchemaData} />
<JsonLd data={breadcrumbData} />

<main id="main-content" class="relative min-h-screen bg-brand-light text-brand-dark">
  <!-- 1. Hero: Clean White Studio Stage 3D Showcase with Smooth Drag Rotation -->
  <ThreeDHero data={threeDModelingPageData.hero} />

  <!-- 2. Service Topic 01: 3D Product Modeling & Quad Topology -->
  <ThreeDProductModelingService data={threeDModelingPageData.modeling} />

  <!-- 3. Service Topic 02: Photorealistic CGI Renders & Studio Lighting -->
  <ThreeDCgiRenderingService data={threeDModelingPageData.cgiRendering} />

  <!-- 4. Service Topic 03: Interactive Web 3D & 360 Spinners -->
  <ThreeDWebInteractiveService data={threeDModelingPageData.turntables} />

  <!-- 5. Production Workflow: 4-Step Collaborative 3D Timeline -->
  <ThreeDWorkflow steps={threeDModelingPageData.workflow} />

  <!-- 6. Deliverables: Formats, Renders & Client Delivery -->
  <ThreeDDeliveryStandards deliverables={threeDModelingPageData.deliverables} />

  <!-- 7. Client FAQs with Real Studio Work -->
  <FaqSection
    items={threeDModelingPageData.faqs}
    images={threeDModelingPageData.faqImages}
  />

  <!-- 8. Start a Project CTA -->
  <ServicesCta />
</main>
