<script lang="ts">
  import { page } from "$app/state";
  import { error } from "@sveltejs/kit";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
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
  import { servicePages } from "$lib/content/service-pages";
  import { buildBreadcrumbSchema } from "$lib/utils/breadcrumbs";

  const serviceSlug = $derived(page.params.slug ?? "service");

  const pageData = $derived.by(() => {
    const data = servicePages[serviceSlug];
    if (!data) error(404, "Service not found");
    return data;
  });

  const serviceSchemaData = $derived(
    pageData
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: pageData.hero.title + " " + pageData.hero.titleAccent,
          url: `${siteConfig.url}/services/${pageData.slug}`,
          description: pageData.seo.description,
          serviceType: pageData.hero.title + " " + pageData.hero.titleAccent,
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

  const breadcrumbData = $derived(
    pageData
      ? buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: pageData.hero.title + " " + pageData.hero.titleAccent, path: `/services/${pageData.slug}` },
        ])
      : null,
  );
</script>

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
{#if breadcrumbData}
    <JsonLd data={breadcrumbData} />
{/if}

<main id="main-content" class="relative min-h-screen bg-brand-light">
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
