<script lang="ts">
  import { clientLocations } from "$lib/content/home";
</script>

<section
  id="client-locations"
  aria-labelledby="client-locations-title"
  class="section-space bg-brand-green text-brand-dark"
>
  <div class="site-shell">
    <div class="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
      <div>
        <p class="eyebrow">Client locations</p>
        <h2
          id="client-locations-title"
          class="mt-7 font-display text-[clamp(3.8rem,7vw,7rem)] leading-[0.9] tracking-[-0.04em]"
        >
          A global workflow, ready for real locations.
        </h2>
      </div>
      <p class="max-w-xl text-sm leading-relaxed lg:justify-self-end">
        Confirmed client countries and regions have not been provided, so this
        map intentionally shows no invented markers or project counts.
      </p>
    </div>

    <div
      class="mt-16 grid border-y border-brand-dark/30 lg:grid-cols-[1fr_18rem]"
    >
      <figure
        id="client-locations-map"
        class="relative min-h-80 overflow-hidden border-b border-brand-dark/30 p-5 lg:min-h-[34rem] lg:border-b-0 lg:border-r"
      >
        <svg
          viewBox="0 0 1000 500"
          role="img"
          aria-labelledby="map-title map-description"
          class="size-full opacity-70"
        >
          <title id="map-title"
            >Placeholder world map without client markers</title
          >
          <desc id="map-description"
            >An abstract world map base prepared for confirmed Studio Click
            House client locations. No location data is currently shown.</desc
          >
          <g
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            vector-effect="non-scaling-stroke"
          >
            <path
              d="M80 135 145 82l115 18 45 42-20 58-50 20-16 70-64 34-26-56-49-18-34-66Z"
            />
            <path d="m270 286 62 32 38 74-28 76-42-22-31-91Z" />
            <path
              d="m455 105 63-42 100 22 38 51 89 3 78 50-36 45-97-6-45 52-65-21-24-61-76-28Z"
            />
            <path d="m510 222 70 28 38 75-42 109-58-47-28-93Z" />
            <path d="m788 330 58-29 73 32-10 54-83 19-49-35Z" />
            <path
              d="M0 250h1000M250 0v500M500 0v500M750 0v500"
              stroke-dasharray="3 10"
              opacity=".35"
            />
          </g>
        </svg>
        <p
          class="absolute bottom-5 left-5 font-mono text-[0.6rem] uppercase tracking-[0.14em]"
        >
          Map base · no confirmed data
        </p>
      </figure>

      <div
        id="client-locations-legend"
        class="flex flex-col justify-between gap-16 p-6"
      >
        <div>
          <p class="eyebrow">Legend</p>
          {#if clientLocations.length}<ul class="mt-6 space-y-3">
              {#each clientLocations as location (location)}<li>
                  {location}
                </li>{/each}
            </ul>{:else}<p role="status" class="mt-6 text-sm leading-relaxed">
              Confirmed client locations will appear here when supplied.
            </p>{/if}
        </div>
        <p
          class="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.12em]"
        >
          Text alternatives and country details are ready for future expansion.
        </p>
      </div>
    </div>
  </div>
</section>
