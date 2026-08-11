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
      telephone: siteConfig.contact.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Level 1, West Boxnagar, Holding: 112/11, Ward: 67, Sarulia, Demra",
        addressLocality: "Dhaka",
        postalCode: "1361",
        addressCountry: "Bangladesh",
      },
      contactPoint: siteConfig.contact.offices.map((office) => ({
        "@type": "ContactPoint",
        telephone: office.phone,
        email: office.email,
        areaServed: office.country,
        contactType: "customer support",
      })),
    },
  };
</script>

<PageMeta
  title="Contact Studio Click House (SCHL) | Start a Project"
  description="Bring your unfinished visual material to the studio. Plan image editing, fashion retouching, or CGI product modeling workflows with the Studio Click House (SCHL) team."
  canonicalPath="/contact"
/>

<JsonLd data={contactSchema} />

<main id="main-content">
  <ContactPage />
</main>
