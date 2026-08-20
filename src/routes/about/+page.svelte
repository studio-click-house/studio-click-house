<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import AboutHero from "$lib/components/sections/about/AboutHero.svelte";
  import AboutPeople from "$lib/components/sections/about/AboutPeople.svelte";
  import AboutTimeline from "$lib/components/sections/about/AboutTimeline.svelte";
  import AboutCareersBanner from "$lib/components/sections/about/AboutCareersBanner.svelte";
  import AboutLeadership from "$lib/components/sections/about/AboutLeadership.svelte";
  import DirectorsMessage from "$lib/components/sections/DirectorsMessage.svelte";
  import AboutClosingCta from "$lib/components/sections/about/AboutClosingCta.svelte";
  import { aboutPageData } from "$lib/content/about";
  import { siteConfig } from "$lib/config/site";

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${siteConfig.url}/about#webpage`,
        url: `${siteConfig.url}/about`,
        name: `About Us | ${siteConfig.name}`,
        description:
          "The company story, team collective, values, and journey of Studio Click House in Dhaka, Bangladesh.",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteConfig.url}/#website`,
          url: siteConfig.url,
          name: siteConfig.name,
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}${siteConfig.ogImage}`,
        foundingDate: "2015",
        description:
          "A specialized post-production studio delivering photo retouching, video editing, and 3D CGI for e-commerce, fashion brands, and global studios.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Dhaka",
          addressCountry: "Bangladesh",
        },
        sameAs: [
          siteConfig.links.linkedin,
          siteConfig.links.instagram,
          siteConfig.links.facebook,
        ].filter(Boolean),
      },
    ],
  };
</script>

<PageMeta
  title="About Us | Studio Click House (SCHL) — Dhaka Post-Production"
  description="Discover the journey, team, and values of Studio Click House (SCHL), a premier photo retouching, video color grading, and custom 3D CGI production studio based in Dhaka, Bangladesh."
  canonicalPath="/about"
/>

<JsonLd data={schemaData} />

<main class="relative bg-brand-light text-brand-dark">
  <AboutHero hero={aboutPageData.hero} />
  <AboutPeople people={aboutPageData.people} />
  <AboutTimeline journey={aboutPageData.journey} />
  <AboutCareersBanner careers={aboutPageData.careers} />
  <AboutLeadership leadership={aboutPageData.leadership} />
  <DirectorsMessage />
  <AboutClosingCta closingCta={aboutPageData.closingCta} />
</main>
