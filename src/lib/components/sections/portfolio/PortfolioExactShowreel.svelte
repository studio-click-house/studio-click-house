<script lang="ts">
  import { Pause, Play } from "lucide-svelte";

  let isPlaying = $state(false);
  let video = $state<HTMLVideoElement | null>(null);

  async function togglePlayback() {
    if (!video) return;

    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  }
</script>

<!-- Section 10: Featured Video / Showreel Spotlight with Centered Play Button (Exact Match) -->
<section
  id="portfolio-showreel-video"
  aria-label="Studio Video Showreel"
  class="relative w-full bg-brand-light py-12 lg:py-20 border-b border-brand-dark/10 overflow-hidden"
>
  <div class="site-shell">
    <div
      class="relative aspect-[21/9] max-h-[560px] w-full overflow-hidden border border-brand-dark/10 bg-brand-dark/5 sm:aspect-[24/9]"
    >
      <video
        bind:this={video}
        src="/videos/editing-video-720p.webm"
        poster="/images/work-fields/studio-production-poster.jpg"
        preload="metadata"
        playsinline
        muted
        controls={isPlaying}
        onplay={() => (isPlaying = true)}
        onpause={() => (isPlaying = false)}
        onended={() => (isPlaying = false)}
        class="h-full w-full object-cover object-center"
        aria-label="Studio Click House post-production showreel"
      ></video>
      <!-- Centered Circular Play Button matching green icon in reference image -->
      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-dark/20"
      >
        <button
          type="button"
          onclick={togglePlayback}
          class="pointer-events-auto flex size-16 cursor-pointer items-center justify-center rounded-full bg-brand-green text-white shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95 sm:size-20"
          aria-label={isPlaying
            ? "Pause studio showreel"
            : "Play studio showreel"}
        >
          {#if isPlaying}
            <Pause class="size-6 fill-white sm:size-8" />
          {:else}
            <Play class="size-6 translate-x-0.5 fill-white sm:size-8" />
          {/if}
        </button>
      </div>
    </div>
  </div>
</section>
