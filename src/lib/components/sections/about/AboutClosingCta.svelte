<script lang="ts">
  import ServicesCta from "$lib/components/sections/ServicesCta.svelte";
  import type { AboutPageData } from "$lib/types/about";
  import { _ } from "svelte-i18n";

  let { closingCta } = $props<{ closingCta: AboutPageData["closingCta"] }>();
</script>

<ServicesCta
  sectionId="closing-cta"
  data={{
    heading: $_('about.closingCta.heading') || closingCta.heading,
    description: $_('about.closingCta.description') || closingCta.description,
  }}
/>
