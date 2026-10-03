<script lang="ts">
  import { onMount } from "svelte";
  import { ChevronLeft, ChevronRight, X } from "lucide-svelte";
  import type { EventGalleryPhoto } from "$lib/types/events";

  let {
    photos,
    selectedIndex,
    title,
    countLabel = "Photo",
    onSelect,
    onClose,
  }: {
    photos: EventGalleryPhoto[];
    selectedIndex: number;
    title: string;
    countLabel?: string;
    onSelect: (index: number) => void;
    onClose: () => void;
  } = $props();

  let current = $derived(photos[selectedIndex]);

  function move(direction: number) {
    if (photos.length) onSelect((selectedIndex + direction + photos.length) % photos.length);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") onClose();
    if (event.key === "ArrowRight") move(1);
    if (event.key === "ArrowLeft") move(-1);
  }

  onMount(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if current}
  <div
    class="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-brand-dark/98 p-4 backdrop-blur-2xl"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label={`${title} photo viewer`}
    onclick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    onkeydown={(event) => { if (event.key === "Escape") onClose(); }}
  >
    <div class="absolute inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 px-6 py-4 text-white">
      <div class="flex items-center gap-3 font-sans text-xs">
        <span class="rounded bg-brand-green px-2.5 py-0.5 font-bold uppercase tracking-wider text-brand-dark">{title}</span>
        <span class="text-white/70">{countLabel} {selectedIndex + 1} of {photos.length}</span>
      </div>
      <button type="button" onclick={onClose} aria-label="Close photo viewer" class="flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-brand-green">
        <X class="size-5" />
      </button>
    </div>

    <button type="button" onclick={() => move(-1)} aria-label="Previous photograph" class="absolute left-4 top-1/2 z-50 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-brand-green sm:left-8">
      <ChevronLeft class="size-6" />
    </button>
    <button type="button" onclick={() => move(1)} aria-label="Next photograph" class="absolute right-4 top-1/2 z-50 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-brand-green sm:right-8">
      <ChevronRight class="size-6" />
    </button>

    <div class="relative flex max-h-[85vh] w-full max-w-5xl flex-col items-center justify-center pt-8">
      <div class="relative max-h-[64vh] max-w-full overflow-hidden rounded-[var(--radius-media)] border border-white/10 shadow-2xl">
        <img src={current.src} alt={current.alt} loading="eager" class="max-h-[64vh] max-w-full object-contain" />
      </div>
      <div class="mt-4 max-w-xl text-center text-white">
        {#if current.caption}<p class="font-sans text-lg sm:text-xl font-semibold">{current.caption}</p>{/if}
        <p class="mt-1 font-sans text-xs text-white/70">{current.alt}</p>
      </div>
      <div class="mt-5 hidden max-w-2xl gap-2 overflow-x-auto p-1 sm:flex">
        {#each photos as thumb, index (thumb.id)}
          <button type="button" onclick={() => onSelect(index)} aria-label={`Jump to ${countLabel.toLowerCase()} ${index + 1}`} aria-current={index === selectedIndex ? "true" : undefined} class="size-12 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity {index === selectedIndex ? 'border-brand-green opacity-100' : 'border-white/30 opacity-60 hover:opacity-100'}">
            <img src={thumb.src} alt="" loading="lazy" decoding="async" class="size-full object-cover" />
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
