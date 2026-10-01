<script lang="ts">
  import InteractiveClientMap from "$lib/components/common/InteractiveClientMap.svelte";
  import type { AboutPageData } from "$lib/types/about";

  let { closingCta } = $props<{
    closingCta: AboutPageData["closingCta"];
  }>();
</script>

<div id="client-locations" class="relative bg-brand-light text-brand-dark">
  <InteractiveClientMap {closingCta} />
</div>
