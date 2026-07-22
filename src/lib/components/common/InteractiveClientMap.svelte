<script lang="ts">
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { LocateFixed, MapPinned } from "lucide-svelte";
  import { clientLocations } from "$lib/content/home";
  import {
    loadGoogleMaps,
    type GoogleMapInstance,
    type GoogleMarkerInstance,
  } from "$lib/utils/google-maps";
  import type { ClientLocationMarker } from "$lib/types/content";

  let mapElement: HTMLDivElement;
  let map: GoogleMapInstance | undefined;
  let markers: GoogleMarkerInstance[] = [];
  let selectedLocation = $state<ClientLocationMarker | null>(null);
  let mapStatus = $state<"loading" | "ready" | "missing-key" | "error">(
    "loading",
  );

  function createMarkerContent(location: ClientLocationMarker) {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "client-map-marker";
    marker.setAttribute(
      "aria-label",
      `${location.country}: ${location.clientCount.toLocaleString()} clients`,
    );
    marker.innerHTML = `<span class="client-map-marker__flag" aria-hidden="true">${location.flag}</span><span>Clients — ${location.clientCount.toLocaleString()}</span>`;
    marker.addEventListener("click", () => focusLocation(location));
    return marker;
  }

  function focusLocation(location: ClientLocationMarker) {
    selectedLocation = location;
    map?.panTo(location.position);
  }

  function resetMap() {
    selectedLocation = null;
    map?.panTo({ lat: 12, lng: 25 });
    map?.setZoom(window.innerWidth < 640 ? 1 : 2);
  }

  onMount(() => {
    const apiKey = env.PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      mapStatus = "missing-key";
      return;
    }

    let active = true;
    loadGoogleMaps(apiKey)
      .then((google) => {
        if (!active || !mapElement) return;

        const brandDark = getComputedStyle(document.documentElement)
          .getPropertyValue("--color-brand-dark")
          .trim();
        const defaultZoom = window.innerWidth < 640 ? 1 : 2;

        map = new google.maps.Map(mapElement, {
          center: { lat: 12, lng: 25 },
          zoom: defaultZoom,
          minZoom: defaultZoom,
          maxZoom: defaultZoom,
          mapId: env.PUBLIC_GOOGLE_MAP_ID || "DEMO_MAP_ID",
          colorScheme: "DARK",
          backgroundColor: brandDark,
          clickableIcons: false,
          disableDoubleClickZoom: true,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          keyboardShortcuts: true,
          scrollwheel: false,
          restriction: {
            latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
            strictBounds: false,
          },
        });

        markers = clientLocations.map(
          (location) =>
            new google.maps.marker.AdvancedMarkerElement({
              map: map as GoogleMapInstance,
              position: location.position,
              content: createMarkerContent(location),
              title: `${location.country}: ${location.clientCount.toLocaleString()} clients`,
            }),
        );
        mapStatus = "ready";
      })
      .catch(() => {
        if (active) mapStatus = "error";
      });

    return () => {
      active = false;
      markers.forEach((marker) => {
        marker.map = null;
      });
      markers = [];
    };
  });
</script>

<div class="relative min-h-[30rem] bg-brand-dark sm:min-h-[38rem]">
  <div
    id="client-locations-map"
    bind:this={mapElement}
    class="absolute inset-0"
    role="application"
    aria-label="Interactive map of Studio Click House client locations"
  ></div>

  {#if mapStatus === "loading"}
    <div class="map-state" role="status">
      <span class="map-loader" aria-hidden="true"></span>
      Loading client map
    </div>
  {:else if mapStatus === "missing-key" || mapStatus === "error"}
    <div class="map-state" role="status">
      <MapPinned size={24} class="text-brand-green" aria-hidden="true" />
      <strong class="font-display text-2xl font-normal">
        {mapStatus === "missing-key"
          ? "Map connection required"
          : "Map temporarily unavailable"}
      </strong>
      <span
        class="max-w-sm text-center text-xs leading-relaxed text-brand-light/50"
      >
        {mapStatus === "missing-key"
          ? "Add the public Google Maps API key to display the interactive map."
          : "The location list remains available while the map connection recovers."}
      </span>
    </div>
  {/if}

  {#if mapStatus === "ready"}
    <div
      class="absolute right-4 top-4 z-10 border border-brand-light/15 bg-brand-dark/90 text-brand-light backdrop-blur-sm"
    >
      <button
        class="map-control"
        type="button"
        aria-label="Show all client locations"
        onclick={resetMap}><LocateFixed size={16} /></button
      >
    </div>
  {/if}

  {#if selectedLocation}
    <div
      class="absolute bottom-4 left-4 z-10 max-w-[calc(100%-2rem)] border border-brand-green/60 bg-brand-dark/95 p-4 text-brand-light backdrop-blur-sm sm:min-w-72"
    >
      <p
        class="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-green"
      >
        Selected location
      </p>
      <div class="mt-3 flex items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <span class="text-2xl" aria-hidden="true"
            >{selectedLocation.flag}</span
          >
          <strong class="text-sm font-medium">{selectedLocation.country}</strong
          >
        </div>
        <span class="font-mono text-xs text-brand-green"
          >{selectedLocation.clientCount.toLocaleString()} clients</span
        >
      </div>
    </div>
  {/if}
</div>

<nav
  id="client-locations-legend"
  aria-label="Client locations"
  class="border-t border-brand-light/10 bg-black/15"
>
  <ul class="site-shell flex gap-2 overflow-x-auto py-4">
    {#each clientLocations as location (location.id)}
      <li>
        <button
          type="button"
          class="flex min-w-max items-center gap-2 border px-3 py-2 font-mono text-[0.58rem] uppercase tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green {selectedLocation?.id ===
          location.id
            ? 'border-brand-green bg-brand-green text-brand-dark font-bold'
            : 'border-brand-light/15 text-brand-light/65 hover:border-brand-green/60 hover:text-brand-green'}"
          onclick={() => focusLocation(location)}
        >
          <span aria-hidden="true">{location.flag}</span>
          {location.country} · {location.clientCount.toLocaleString()}
        </button>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .map-state {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.75rem;
    background-image:
      linear-gradient(
        color-mix(in srgb, var(--color-brand-light) 4%, transparent) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--color-brand-light) 4%, transparent) 1px,
        transparent 1px
      );
    background-size: 3rem 3rem;
    color: var(--color-brand-light);
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .map-loader {
    width: 1.75rem;
    height: 1.75rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-green) 25%, transparent);
    border-top-color: var(--color-brand-green);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .map-control {
    display: grid;
    width: 2.75rem;
    height: 2.75rem;
    place-items: center;
    color: var(--color-brand-light);
    transition:
      color 180ms ease,
      background-color 180ms ease;
  }

  .map-control:hover,
  .map-control:focus-visible {
    background: var(--color-brand-green);
    color: var(--color-brand-dark);
    outline: none;
  }

  :global(.client-map-marker) {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    border: 1px solid var(--color-brand-green);
    border-radius: 2px;
    background: color-mix(in srgb, var(--color-brand-dark) 94%, transparent);
    box-shadow: 0 0 20px
      color-mix(in srgb, var(--color-brand-green) 18%, transparent);
    padding: 0.32rem 0.45rem;
    color: var(--color-brand-green);
    font-family: var(--font-mono);
    font-size: 0.55rem;
    letter-spacing: 0.03em;
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
    transition:
      transform 180ms ease,
      background-color 180ms ease;
  }

  :global(.client-map-marker)::after {
    position: absolute;
    top: 100%;
    left: 50%;
    border-top: 7px solid var(--color-brand-green);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: "";
    transform: translateX(-50%);
  }

  :global(.client-map-marker:hover),
  :global(.client-map-marker:focus-visible) {
    background: var(--color-brand-green);
    color: var(--color-brand-dark);
    outline: none;
    transform: translateY(-2px);
  }

  :global(.client-map-marker__flag) {
    font-size: 0.8rem;
    line-height: 1;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .map-loader {
      animation: none;
    }
  }
</style>
