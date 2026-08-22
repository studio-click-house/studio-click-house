<script lang="ts">
  import { onMount } from "svelte";
  import { Pause, Play } from "lucide-svelte";

  const AUDIO_SRC = "/audio/Audio-Presentation.mp3";

  let isPlaying = $state(false);
  let audioElement: HTMLAudioElement | null = null;

  function toggleAudio() {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(() => {});
    }
  }

  onMount(() => {
    audioElement = new Audio(AUDIO_SRC);
    audioElement.preload = "auto";

    audioElement.onplay = () => {
      isPlaying = true;
    };

    audioElement.onpause = () => {
      isPlaying = false;
    };

    audioElement.onended = () => {
      isPlaying = false;
      if (audioElement) {
        audioElement.currentTime = 0;
      }
    };

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
        audioElement = null;
      }
    };
  });
</script>

<!-- Separate Right-Docked Island Audio Player -->
<aside
  id="studio-audio-island"
  aria-label="Studio audio brief player"
  class="fixed bottom-6 sm:bottom-8 right-0 z-40 select-none"
>
  <div
    class="flex items-center rounded-l-2xl rounded-r-none border-y border-l border-r-0 border-white/15 bg-[#181615]/95 pl-2 pr-1.5 py-2 backdrop-blur-xl shadow-2xl transition-all duration-300 ring-1 ring-white/5"
  >
    <div class="relative group flex items-center">
      <button
        type="button"
        onclick={toggleAudio}
        aria-label={isPlaying ? "Pause Studio Voice Brief" : "Play Studio Voice Brief"}
        class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 {isPlaying
          ? 'bg-brand-green text-brand-dark shadow-[0_0_12px_rgba(126,166,65,0.6)]'
          : 'bg-white/[0.06] text-white/80 hover:bg-brand-green hover:text-brand-dark hover:shadow-[0_0_12px_rgba(126,166,65,0.4)]'}"
      >
        {#if isPlaying}
          <Pause size={13} class="fill-current" aria-hidden="true" />
        {:else}
          <!-- Triangle play button -->
          <Play size={13} class="fill-current translate-x-[1px]" aria-hidden="true" />
        {/if}
      </button>

      <!-- Minimal Left Tooltip -->
      <span
        role="tooltip"
        class="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-md border border-white/15 bg-[#181615] px-2.5 py-1 font-mono text-[0.65rem] text-white opacity-0 shadow-xl backdrop-blur-md transition-all duration-150 group-hover:opacity-100 group-hover:-translate-x-0.5"
      >
        {isPlaying ? "Pause Audio Brief" : "Play Audio Brief"}
      </span>
    </div>
  </div>
</aside>

