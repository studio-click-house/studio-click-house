<script lang="ts">
  import { onMount } from "svelte";
  import { Play } from "lucide-svelte";

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
          <!-- 3 animated equalizer running lines -->
          <div class="flex items-center justify-center gap-[2.5px] h-3.5" aria-hidden="true">
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-1"></span>
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-2"></span>
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-3"></span>
          </div>
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

<style>
  @keyframes barBounce1 {
    0%,
    100% {
      height: 30%;
    }
    50% {
      height: 100%;
    }
  }

  @keyframes barBounce2 {
    0%,
    100% {
      height: 90%;
    }
    50% {
      height: 25%;
    }
  }

  @keyframes barBounce3 {
    0%,
    100% {
      height: 45%;
    }
    50% {
      height: 95%;
    }
  }

  .animate-bar-1 {
    animation: barBounce1 600ms ease-in-out infinite;
  }
  .animate-bar-2 {
    animation: barBounce2 520ms ease-in-out infinite 80ms;
  }
  .animate-bar-3 {
    animation: barBounce3 680ms ease-in-out infinite 160ms;
  }
</style>
