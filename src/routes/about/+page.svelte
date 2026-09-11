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
  import { buildBreadcrumbSchema } from "$lib/utils/breadcrumbs";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteConfig.url}/about#webpage`,
    url: `${siteConfig.url}/about`,
    name: `About Us | ${siteConfig.name}`,
    description:
      "The company story, team collective, values, and journey of Studio Click House in Dhaka, Bangladesh.",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
  };

  const breadcrumbData = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);
</script>

<PageMeta
  title="About Us | Studio Click House — Dhaka Post-Production"
  description="Discover the journey, team, and values of Studio Click House, a premier photo retouching, video color grading, and custom 3D CGI production studio based in Dhaka, Bangladesh."
  canonicalPath="/about"
/>

<JsonLd data={schemaData} />
<JsonLd data={breadcrumbData} />

<main id="main-content" class="relative bg-brand-light text-brand-dark">
  <AboutHero hero={aboutPageData.hero} />
  <AboutPeople people={aboutPageData.people} />
  <AboutTimeline journey={aboutPageData.journey} />
  <AboutCareersBanner careers={aboutPageData.careers} />
  <AboutLeadership leadership={aboutPageData.leadership} />
  <DirectorsMessage />
  <AboutClosingCta closingCta={aboutPageData.closingCta} />
</main>
