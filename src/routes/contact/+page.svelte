<script lang="ts">
  import ContactPage from "$lib/components/sections/contact/ContactPage.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import { siteConfig } from "$lib/config/site";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact | ${siteConfig.name}`,
    url: `${siteConfig.url}/contact`,
    description:
      "Start a conversation with Studio Click House about image editing, video post-production, and 3D CGI work.",
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.contact.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "Bangladesh",
      },
    },
  };
</script>

<PageMeta
  title="Contact Studio Click House | Start a Project"
  description="Start a conversation with Studio Click House about image editing, video post-production, and 3D CGI work for your next visual project."
  canonicalPath="/contact"
/>

<JsonLd data={contactSchema} />

<main id="main-content">
  <ContactPage />
</main>
