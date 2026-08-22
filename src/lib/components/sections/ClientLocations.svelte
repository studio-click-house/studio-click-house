<script lang="ts">
  import InteractiveClientMap from "$lib/components/common/InteractiveClientMap.svelte";
  import type { AboutPageData } from "$lib/types/about";

  let { closingCta } = $props<{
    closingCta: AboutPageData["closingCta"];
  }>();
</script>

<section
  id="client-locations"
  aria-label="Client locations map"
  class="overflow-hidden bg-brand-dark text-brand-light"
>
  <InteractiveClientMap {closingCta} />
</section>
