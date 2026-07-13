<script lang="ts">
  import InteractiveClientMap from "$lib/components/common/InteractiveClientMap.svelte";
</script>

<section
  id="client-locations"
  aria-labelledby="client-locations-title"
  class="overflow-hidden bg-brand-dark pt-20 text-brand-light sm:pt-28"
>
  <div class="site-shell pb-12 sm:pb-16">
    <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
      <div>
        <p class="eyebrow text-brand-green">Client locations</p>
        <h2
          id="client-locations-title"
          class="mt-7 max-w-4xl font-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.88] tracking-[-0.04em]"
        >
          Creative support, without borders.
        </h2>
      </div>
      <div class="max-w-xl lg:justify-self-end lg:pb-2">
        <p class="text-sm leading-relaxed text-brand-light/60">
          Explore the countries where Studio Click House supports client
          production. Drag the map, zoom in, or select a marker to inspect each
          location.
        </p>
        <p
          class="mt-7 flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-brand-light/45"
        >
          <span class="size-2 bg-brand-green" aria-hidden="true"></span>
          Interactive global network
        </p>
      </div>
    </div>
  </div>

  <div class="border-y border-brand-green/60">
    <InteractiveClientMap />
  </div>
</section>
