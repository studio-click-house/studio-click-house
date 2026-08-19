<script lang="ts">
  import { page } from "$app/state";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import PlaceholderPage from "$lib/components/common/PlaceholderPage.svelte";
  import ServiceDetailHero from "$lib/components/sections/service-detail/ServiceDetailHero.svelte";
  import ServiceDetailIntro from "$lib/components/sections/service-detail/ServiceDetailIntro.svelte";
  import ServiceDetailBeforeAfter from "$lib/components/sections/service-detail/ServiceDetailBeforeAfter.svelte";
  import ServiceDetailShowcase from "$lib/components/sections/service-detail/ServiceDetailShowcase.svelte";
  import ServiceDetailFeatures from "$lib/components/sections/service-detail/ServiceDetailFeatures.svelte";
  import ServiceDetailGallery from "$lib/components/sections/service-detail/ServiceDetailGallery.svelte";
  import ServiceDetailAudience from "$lib/components/sections/service-detail/ServiceDetailAudience.svelte";
  import ServiceDetailCta from "$lib/components/sections/service-detail/ServiceDetailCta.svelte";
  import FaqSection from "$lib/components/sections/FaqSection.svelte";
  import { siteConfig } from "$lib/config/site";
  import { backgroundRemovePage } from "$lib/content/background-remove";
  import { clippingPathPage } from "$lib/content/clipping-path";
  import { ghostMannequinPage } from "$lib/content/ghost-mannequin";
  import { editorialRetouchingPage } from "$lib/content/editorial-retouching";
  import { ecommerceRetouchingPage } from "$lib/content/ecommerce-retouching";
  import { jewelryRetouchingPage } from "$lib/content/jewelry-retouching";
  import { colorCorrectionPage } from "$lib/content/color-correction";
  import { aiRetouchPage } from "$lib/content/ai-retouch";
  import type { ServicePageData } from "$lib/types/service-detail";

  const serviceSlug = $derived(page.params.slug ?? "service");

  const servicePages: Record<string, ServicePageData> = {
    "background-remove": backgroundRemovePage,
    "clipping-path": clippingPathPage,
    "ghost-mannequin": ghostMannequinPage,
    "editorial-retouching": editorialRetouchingPage,
    "ecommerce-retouching": ecommerceRetouchingPage,
    "jewelry-retouching": jewelryRetouchingPage,
    "color-correction": colorCorrectionPage,
    "ai-retouch": aiRetouchPage,
  };

  const pageData = $derived(servicePages[serviceSlug]);

  const serviceTitle = $derived(
    serviceSlug
      .split("-")
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(" "),
  );

  const serviceSchemaData = $derived(
    pageData
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: pageData.hero.title + " " + pageData.hero.titleAccent,
          url: `${siteConfig.url}/services/${pageData.slug}`,
          description: pageData.seo.description,
          provider: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          },
        }
      : null,
  );

  const faqSchemaData = $derived(
    pageData
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: pageData.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null,
  );
</script>

{#if pageData}
  <PageMeta
    title={pageData.seo.title}
    description={pageData.seo.description}
    canonicalPath={`/services/${pageData.slug}`}
  />

  {#if serviceSchemaData}
    <JsonLd data={serviceSchemaData} />
  {/if}
  {#if faqSchemaData}
    <JsonLd data={faqSchemaData} />
  {/if}

  <main id="service-detail-page" class="relative min-h-screen bg-brand-light">
    <ServiceDetailHero data={pageData.hero} />
    <ServiceDetailIntro data={pageData.intro} />
    <ServiceDetailBeforeAfter data={pageData.beforeAfter} />
    <ServiceDetailShowcase data={pageData.showcase} />
    {#if pageData.gallery}
      <ServiceDetailGallery data={pageData.gallery} />
    {/if}
    <ServiceDetailFeatures
      heading={pageData.features.heading}
      items={pageData.features.items}
    />
    <ServiceDetailAudience
      heading={pageData.audience.heading}
      items={pageData.audience.items}
    />
    <FaqSection items={pageData.faqs} />
    <ServiceDetailCta data={pageData.cta} />
  </main>
{:else}
  <PlaceholderPage
    title={serviceTitle}
    eyebrow="Service detail"
    description="Detailed service scope, deliverables, workflow, and approved examples will be added here without inventing project claims."
    canonicalPath={`/services/${serviceSlug}`}
  />
{/if}
