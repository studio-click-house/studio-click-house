<script lang="ts">
  import type { EventGalleryPhoto, EventCategory } from "$lib/types/events";
  import { X, ChevronLeft, ChevronRight, Expand } from "lucide-svelte";
  import { _ } from "svelte-i18n";

  interface Props {
    photos: EventGalleryPhoto[];
  }

  let { photos }: Props = $props();

  type FilterType = "all" | EventCategory;

  let activeFilter = $state<FilterType>("all");
  let visibleLimit = $state<number>(12);
  let selectedPhotoIndex = $state<number | null>(null);

  const categories = [
    { id: "all", label: "All Photos" },
    { id: "nepal-tour", label: "Nepal Tour" },
    { id: "mawa-evening", label: "Mawa Evening" },
    { id: "football-match", label: "Football Match" },
    { id: "coxs-bazar", label: "Cox's Bazar" },
    { id: "dinner-buffet", label: "Dinner Buffet" },
    { id: "fun-day", label: "Fun Day" },
  ] as const;

  const filteredPhotos = $derived(
    activeFilter === "all"
      ? photos
      : photos.filter((p) => p.category === activeFilter)
  );

  const displayedPhotos = $derived(filteredPhotos.slice(0, visibleLimit));

  function selectCategory(catId: FilterType) {
    activeFilter = catId;
    visibleLimit = 12;
  }

  function loadMore() {
    visibleLimit += 12;
  }

  function countCategory(catId: FilterType): number {
    if (catId === "all") return photos.length;
    return photos.filter((p) => p.category === catId).length;
  }

  function openLightbox(index: number) {
    selectedPhotoIndex = index;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    selectedPhotoIndex = null;
    document.body.style.overflow = "";
  }

  function nextPhoto() {
    if (selectedPhotoIndex === null) return;
    selectedPhotoIndex = (selectedPhotoIndex + 1) % filteredPhotos.length;
  }

  function prevPhoto() {
    if (selectedPhotoIndex === null) return;
    selectedPhotoIndex =
      (selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (selectedPhotoIndex === null) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<section
  id="events-gallery"
  class="relative overflow-hidden bg-brand-paper py-20 text-brand-dark sm:py-28 lg:py-32"
>
  <div class="site-shell relative z-10">
    <!-- Clean Editorial Header (No AI pills, No robot icons) -->
    <div class="pb-2">
      <span class="font-mono text-xs uppercase tracking-[0.22em] text-brand-green font-medium mb-3 block">
        Visual Archive · All Photographs
      </span>

      <div class="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2
            class="max-w-[15ch] font-display text-[clamp(2.6rem,4.4vw,4.8rem)] font-normal leading-[0.94] tracking-tight text-brand-dark"
          >
            Life outside the studio.
          </h2>
          <p class="mt-4 max-w-xl text-base leading-relaxed text-brand-dark/70">
            A visual record of company tours, riverside sunsets, football matches, and celebrations across Bangladesh and beyond.
          </p>
        </div>
      </div>
    </div>

    <!-- Clean Typography Filter Bar (No AI pills) -->
    <div
      class="mt-8 flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Event gallery filters"
    >
      {#each categories as cat (cat.id)}
        {@const isActive = activeFilter === cat.id}
        {@const count = countCategory(cat.id)}
        <button
          type="button"
          role="tab"
          aria-selected={isActive}
          onclick={() => selectCategory(cat.id)}
          class="rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all {isActive
            ? 'bg-brand-dark text-white font-semibold shadow-sm'
            : 'border border-brand-dark/15 bg-white/80 text-brand-dark/75 hover:border-brand-dark/30 hover:bg-white hover:text-brand-dark'}"
        >
          <span>{cat.label} ({count})</span>
        </button>
      {/each}
    </div>

    <!-- Perfectly Organized Image Grid: 12 photos initially displayed -->
    <div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5">
      {#each displayedPhotos as photo, index (photo.id)}
        <button
          type="button"
          onclick={() => openLightbox(index)}
          aria-label={`Open photo ${photo.caption || photo.alt}`}
          class="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-dark/10 bg-white p-1.5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
        >
          <div class="relative size-full overflow-hidden rounded-xl">
            <img
              src={photo.src}
              alt={photo.alt}
              width="900"
              height="650"
              loading="lazy"
              decoding="async"
              class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
            />

            <!-- Vignette & Caption on hover -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>

            <div
              class="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 opacity-0 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 text-white"
            >
              <div class="pr-2">
                <span class="rounded bg-brand-green px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-brand-dark">
                  {photo.categoryLabel}
                </span>
                {#if photo.caption}
                  <p class="mt-1 line-clamp-1 text-sm font-medium text-white">
                    {photo.caption}
                  </p>
                {/if}
              </div>

              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md transition-all group-hover:bg-brand-green group-hover:text-brand-dark"
              >
                <Expand class="size-4" />
              </span>
            </div>
          </div>
        </button>
      {/each}
    </div>

    <!-- Load More Section: Initial 12 photos loaded, then load next batch -->
    {#if visibleLimit < filteredPhotos.length}
      <div class="mt-14 flex flex-col items-center justify-center text-center">
        <button
          type="button"
          onclick={loadMore}
          class="rounded-lg bg-brand-dark px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-brand-green hover:text-brand-dark"
        >
          Load More Photos ({filteredPhotos.length - displayedPhotos.length} remaining)
        </button>
      </div>
    {/if}
  </div>
</section>

<!-- Full-Screen Lightbox Modal -->
{#if selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex]}
  {@const current = filteredPhotos[selectedPhotoIndex]}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0c]/98 p-4 backdrop-blur-2xl animate-in fade-in duration-200 cursor-zoom-out"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-label="Photo viewer"
    onclick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
    onkeydown={(e) => { if (e.key === 'Escape') closeLightbox(); }}
  >
    <!-- Top Bar -->
    <div class="absolute inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 px-6 py-4 text-white">
      <div class="flex items-center gap-3 font-mono text-xs">
        <span class="rounded bg-brand-green px-2.5 py-0.5 font-bold uppercase tracking-wider text-brand-dark">
          {current.categoryLabel}
        </span>
        <span class="text-white/50">
          Photo {selectedPhotoIndex + 1} of {filteredPhotos.length}
        </span>
      </div>

      <button
        type="button"
        onclick={closeLightbox}
        aria-label="Close photo viewer"
        class="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-brand-green hover:text-brand-dark"
      >
        <X class="size-5" />
      </button>
    </div>

    <!-- Prev & Next -->
    <button
      type="button"
      onclick={prevPhoto}
      aria-label="Previous photograph"
      class="absolute left-4 top-1/2 z-50 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-brand-green hover:text-brand-dark sm:left-8"
    >
      <ChevronLeft class="size-6" />
    </button>

    <button
      type="button"
      onclick={nextPhoto}
      aria-label="Next photograph"
      class="absolute right-4 top-1/2 z-50 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-brand-green hover:text-brand-dark sm:right-8"
    >
      <ChevronRight class="size-6" />
    </button>

    <!-- Main Lightbox Photo -->
    <div class="relative flex max-h-[85vh] w-full max-w-5xl flex-col items-center justify-center pt-8">
      <div class="relative max-h-[64vh] max-w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
        <img
          src={current.src}
          alt={current.alt}
          class="max-h-[64vh] max-w-full object-contain"
        />
      </div>

      <div class="mt-4 max-w-xl text-center">
        {#if current.caption}
          <p class="font-display text-lg font-normal text-white sm:text-xl">
            {current.caption}
          </p>
        {/if}
        <p class="mt-1 font-mono text-xs text-white/50">
          {current.alt}
        </p>
      </div>

      <!-- Scrubber Filmstrip -->
      <div class="mt-5 hidden sm:flex max-w-2xl gap-2 overflow-x-auto p-1 scrollbar-thin">
        {#each filteredPhotos as thumb, tIdx (thumb.id)}
          <button
            type="button"
            onclick={() => (selectedPhotoIndex = tIdx)}
            aria-label={`Jump to photo ${tIdx + 1}`}
            class="size-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all {tIdx === selectedPhotoIndex
              ? 'border-brand-green scale-105 shadow-lg'
              : 'border-white/20 opacity-40 hover:opacity-100'}"
          >
            <img
              src={thumb.src}
              alt=""
              class="size-full object-cover"
            />
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
