<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import ServicesHero from "$lib/components/sections/ServicesHero.svelte";
  import ServicesListShowcase from "$lib/components/sections/ServicesListShowcase.svelte";
  import ServicesStandards from "$lib/components/sections/ServicesStandards.svelte";
  import FaqSection from "$lib/components/sections/FaqSection.svelte";
  import ServicesCta from "$lib/components/sections/ServicesCta.svelte";
  import { servicesFaqs } from "$lib/content/services";
  import { siteConfig } from "$lib/config/site";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Image Editing, Video Retouching & CGI Services | ${siteConfig.name}`,
    url: `${siteConfig.url}/services`,
    description:
      "Explore our professional visual production capabilities. High-end e-commerce clipping, fashion portrait retouching, video color grading, and custom 3D CGI product renders.",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: servicesFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
</script>

<PageMeta
  title="Our Services | Image Editing, Retouching & Visual Production"
  description="Explore our high-end visual post-production capabilities. From high-volume clipping path and ghost mannequin to fashion retouching, video grading, and photorealistic 3D CGI renders."
  canonicalPath="/services"
/>

<JsonLd data={schemaData} />
<JsonLd data={faqSchemaData} />

<main
  id="services-page"
  class="relative bg-brand-light text-brand-dark min-h-screen"
>
  <!-- 1. Hero Section -->
  <ServicesHero />

  <!-- 2. Services Overview Grid & Interactive Before/After Showcase -->
  <ServicesListShowcase />

  <!-- 3. Quality Standards & Features Section -->
  <ServicesStandards />

  <!-- 4. Reused FAQ Section with custom Services FAQ content -->
  <FaqSection items={servicesFaqs} />

  <!-- 5. Closing Start a Project CTA -->
  <ServicesCta />
</main>
