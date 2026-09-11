<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import ImageTrailSection from "$lib/components/sections/ImageTrailSection.svelte";
  import ScrollChoreography from "$lib/components/sections/ScrollChoreography.svelte";
  import CollectionSurfer from "$lib/components/sections/CollectionSurfer.svelte";
  import ServiceBreakdownRail from "$lib/components/sections/portfolio/ServiceBreakdownRail.svelte";
  import ScrollImageStory from "$lib/components/sections/ScrollImageStory.svelte";
  import ServicesSection from "$lib/components/sections/ServicesSection.svelte";
</script>

<PageMeta
  title="Service Breakdown & Studio Showcase | Studio Click House"
  description="Step-by-step professional post-production workflow showing image editing, clipping paths, subject isolation, fanned work orbit gallery, and selected CGI project showcases."
  canonicalPath="/section"
  noindex={true}
/>

<main id="main-content" class="relative bg-brand-light text-brand-dark">
  <ScrollChoreography />
  <ScrollImageStory />
  <ServicesSection />
  <ServiceBreakdownRail />
  <ImageTrailSection />
  <CollectionSurfer />
</main>
