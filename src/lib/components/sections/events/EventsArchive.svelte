<script lang="ts">
  import type { CompanyEvent } from "$lib/types/events";
  import PhotoLightbox from "$lib/components/common/PhotoLightbox.svelte";

  interface Props {
    events: CompanyEvent[];
  }

  let { events }: Props = $props();

  // Active tour lightbox state
  let activeTour = $state<CompanyEvent | null>(null);
  let activePhotoIndex = $state<number>(0);

  function openTourGallery(event: CompanyEvent, startIndex: number = 0) {
    if (!event.gallery || event.gallery.length === 0) return;
    activeTour = event;
    activePhotoIndex = startIndex;
  }

  function closeTourGallery() {
    activeTour = null;
    activePhotoIndex = 0;
  }

</script>

<section
  id="event-archive"
  class="relative overflow-hidden bg-brand-paper py-20 text-brand-dark sm:py-28 lg:py-36"
>
  <div class="site-shell">
    <!-- Editorial Header with Index Metadata -->
    <div class="pb-2">
      <span class="font-mono text-xs uppercase tracking-[0.22em] text-brand-green-ink font-medium mb-4 block">
        Expeditions & Company Tours · {events.length} Chapters
      </span>

      <div class="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2
          class="max-w-[16ch] font-display text-[clamp(2.8rem,4.8vw,5.4rem)] font-normal leading-[0.92] tracking-tight text-brand-dark"
        >
          Journeys that built our culture.
        </h2>
        <p class="max-w-md text-base leading-relaxed text-brand-dark/70">
          Every expedition holds stories of discovery, authentic teamwork, and shared creative rejuvenation outside production walls.
        </p>
      </div>
    </div>

    <!-- Editorial Chapter Entries -->
    <div class="mt-16 space-y-28 sm:mt-24 sm:space-y-36 lg:space-y-44">
      {#each events as event, index (event.id)}
        {@const gallery = event.gallery || []}
        {@const galleryCount = gallery.length}
        {@const chapterNum = String(index + 1).padStart(2, "0")}

        <article
          id={`event-${event.id}`}
          class="relative grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16"
          data-event-archive
        >
          <!-- Giant Architectural Chapter Index -->
          <div class="absolute -top-12 left-0 pointer-events-none select-none font-display text-[5.5rem] font-light leading-none text-brand-dark/[0.04] sm:-top-16 sm:text-[8rem] lg:text-[10rem]">
            {chapterNum}
          </div>

          <!-- Asymmetric Visual Collage -->
          <div
            class:lg:order-2={index % 2 === 1}
            class="relative lg:col-span-7"
            data-event-media
          >
            <!-- Primary Focal Photo Frame -->
            <button
              type="button"
              onclick={() => openTourGallery(event, 0)}
              class="group relative block aspect-[16/11] w-full overflow-hidden rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)] border border-brand-dark/10 bg-white p-2 text-left shadow-xl transition-all duration-500 hover:shadow-2xl sm:aspect-[16/10] cursor-pointer"
              aria-label={`Open photo gallery for ${event.title}`}
            >
              <div class="relative size-full overflow-hidden rounded-[var(--radius-card-sm)] sm:rounded-[var(--radius-card)]">
                <img
                  src={event.image}
                  alt={event.imageAlt}
                  width="1400"
                  height="950"
                  loading="lazy"
                  decoding="async"
                  class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/65 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80"></div>

                <!-- Floating top bar inside cover: Clean View All badge -->
                <div class="absolute inset-x-0 top-0 z-20 flex items-center justify-end p-4 text-white">
                  <span
                    class="rounded-md bg-white/95 px-3.5 py-1.5 font-mono text-xs font-semibold text-brand-dark shadow-md transition-all group-hover:bg-brand-green group-hover:text-brand-dark"
                  >
                    View All
                  </span>
                </div>
              </div>
            </button>

            <!-- Overlapping Offset Thumbnail (if at least 2 photos) -->
            {#if gallery.length > 1}
              <button
                type="button"
                onclick={() => openTourGallery(event, 1)}
                class="group/offset absolute -bottom-6 -right-3 hidden sm:block w-[38%] overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] border border-brand-dark/12 bg-white p-1.5 shadow-2xl transition-all duration-500 hover:scale-105 hover:z-30 cursor-pointer {index % 2 === 1 ? '-rotate-2 -left-3 right-auto' : 'rotate-2'}"
                aria-label="Enlarge preview snapshot"
              >
                <div class="aspect-[4/3] w-full overflow-hidden rounded-[1.2rem] sm:rounded-[1.4rem]">
                  <img
                    src={gallery[1].src}
                    alt={gallery[1].alt}
                    loading="lazy"
                    decoding="async"
                    class="size-full object-cover transition-transform duration-500 group-hover/offset:scale-105"
                  />
                </div>
              </button>
            {/if}
          </div>

          <!-- Editorial Story Column -->
          <div
            class:lg:order-1={index % 2 === 1}
            class="relative z-10 lg:col-span-5"
            data-event-copy
          >
            <div class="flex items-center gap-3 font-mono text-xs text-brand-dark/60">
              <span class="font-bold text-brand-green-ink">Chapter {chapterNum}</span>
              <span>·</span>
              <span>{event.date}</span>
            </div>

            <h3
              class="mt-4 font-display text-[clamp(2.3rem,3.6vw,3.8rem)] font-normal leading-[0.94] tracking-[-0.035em] text-brand-dark"
            >
              {event.title}
            </h3>

            <p class="mt-4 text-sm leading-relaxed text-brand-dark/72 sm:text-base">
              {event.summary}
            </p>

            <div class="mt-4 font-mono text-xs uppercase tracking-wider text-brand-dark/65 font-medium">
              {event.location}
            </div>

            <!-- Focus Tags -->
            <div class="mt-5 flex flex-wrap gap-2">
              {#each event.focus as tag (tag)}
                <span class="rounded-md border border-brand-dark/12 bg-white/70 px-3 py-1 font-mono text-xs text-brand-dark/75">
                  {tag}
                </span>
              {/each}
            </div>

            <!-- Interactive Thumbnails Strip & Action -->
            {#if galleryCount > 0}
              {@const floatingPhoto = gallery.length > 1 ? gallery[1] : null}
              {@const otherPhotos = gallery.filter((p) => p.src !== event.image && (!floatingPhoto || p.src !== floatingPhoto.src))}
              {@const displayThumbs = otherPhotos.length >= 4 ? otherPhotos.slice(0, 4) : gallery.slice(0, 4)}
              {@const hasMore = otherPhotos.length > 4}
              {@const remainingCount = Math.max(0, otherPhotos.length - 3)}

              <div class="mt-8">
                <div class="flex items-center justify-end mb-3">
                  <button
                    type="button"
                    onclick={() => openTourGallery(event, 0)}
                    class="font-mono text-xs font-semibold text-brand-green hover:text-brand-dark transition-colors"
                  >
                    View all {galleryCount} photos →
                  </button>
                </div>

                <!-- 4 Filmstrip Thumbnails: Unique additional photos (zero repetition) -->
                <div class="grid grid-cols-4 gap-2.5">
                  {#each displayThumbs as photo, photoIdx (photo.id)}
                    {@const isLast = photoIdx === 3 && hasMore}
                    {@const targetIndex = gallery.findIndex((p) => p.id === photo.id)}
                    <button
                      type="button"
                      onclick={() => openTourGallery(event, targetIndex >= 0 ? targetIndex : photoIdx)}
                      aria-label={`Open image from ${event.title}`}
                      class="group/thumb relative aspect-square overflow-hidden rounded-xl border border-brand-dark/12 bg-white p-0.5 shadow-sm transition-all hover:scale-105 hover:shadow-md focus:ring-2 focus:ring-brand-green"
                    >
                      <div class="size-full overflow-hidden rounded-lg">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading="lazy"
                          decoding="async"
                          class="size-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                        />
                      </div>
                      {#if isLast}
                        <div class="absolute inset-0.5 flex items-center justify-center rounded-lg bg-brand-dark/85 font-mono text-xs font-bold text-brand-light backdrop-blur-[2px]">
                          +{remainingCount}
                        </div>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

{#if activeTour?.gallery?.[activePhotoIndex]}
  <PhotoLightbox photos={activeTour.gallery} selectedIndex={activePhotoIndex} title={activeTour.title} countLabel="Still" onSelect={(index) => (activePhotoIndex = index)} onClose={closeTourGallery} />
{/if}
