<script lang="ts">
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import JsonLd from "$lib/components/seo/JsonLd.svelte";
  import EventsHero from "$lib/components/sections/events/EventsHero.svelte";
  import EventsUpcoming from "$lib/components/sections/events/EventsUpcoming.svelte";
  import EventsArchive from "$lib/components/sections/events/EventsArchive.svelte";
  import EventsCulture from "$lib/components/sections/events/EventsCulture.svelte";
  import EventsClosing from "$lib/components/sections/events/EventsClosing.svelte";
  import EventsPageMotion from "$lib/components/sections/events/EventsPageMotion.svelte";
  import {
    eventActivities,
    pastEvents,
    upcomingEvent,
  } from "$lib/content/events";
  import { siteConfig } from "$lib/config/site";
  import { buildBreadcrumbSchema } from "$lib/utils/breadcrumbs";

  let pageRoot = $state<HTMLElement>();

  const breadcrumbData = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
  ]);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/events#webpage`,
    url: `${siteConfig.url}/events`,
    name: `Company Events & Activities | ${siteConfig.name}`,
    description:
      "A visual journal of upcoming and past Studio Click House company events, creative sessions, workshops, and studio activities.",
  };
</script>

<PageMeta
  title="Company Events & Activities | Studio Click House"
  description="Explore upcoming and past Studio Click House company events, creative sessions, workshops, and the activities that bring our studio together."
  canonicalPath="/events"
/>

<JsonLd data={schemaData} />
<JsonLd data={breadcrumbData} />

<main id="main-content" bind:this={pageRoot} class="relative overflow-clip">
  <EventsHero upcoming={upcomingEvent} archive={pastEvents} />
  <EventsUpcoming event={upcomingEvent} />
  <EventsArchive events={pastEvents} />
  <EventsCulture activities={eventActivities} />
  <EventsClosing />
</main>

{#if pageRoot}
  <EventsPageMotion root={pageRoot} />
{/if}
