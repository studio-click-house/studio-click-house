<script lang="ts">
  import InteractiveClientMap from "$lib/components/common/InteractiveClientMap.svelte";
</script>

<section
  id="client-locations"
  aria-label="Client locations map"
  class="overflow-hidden bg-brand-dark text-brand-light"
>
  <div class="border-y border-brand-light/10">
    <InteractiveClientMap />
  </div>
</section>
