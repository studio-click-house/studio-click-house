<script lang="ts">
  import { onMount } from "svelte";

  const STUDIO_BRIEF_SCRIPT =
    "Welcome to Studio Click House. We are a global creative post-production studio delivering high-end commercial retouching, e-commerce image workflows, CGI, and cinematic video editing. We partner with leading brands, agencies, and photographers worldwide with guaranteed 15-minute response times and precision turnarounds. Explore our portfolio or start your free trial today.";

  let isPlaying = $state(false);
  let isPaused = $state(false);
  let speechUtterance: SpeechSynthesisUtterance | null = null;

  function getBestVoice(): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const preferred = [
      "Google US English",
      "Google UK English Female",
      "Samantha",
      "Daniel",
      "Karen",
      "Microsoft Jenny",
      "Microsoft Ryan",
    ];

    for (const name of preferred) {
      const match = voices.find((v) => v.name.includes(name));
      if (match) return match;
    }

    const en = voices.find((v) => v.lang.startsWith("en"));
    return en || voices[0] || null;
  }

  function startPlayback() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    speechUtterance = new SpeechSynthesisUtterance(STUDIO_BRIEF_SCRIPT);
    speechUtterance.rate = 0.95;
    speechUtterance.pitch = 1.0;

    const voice = getBestVoice();
    if (voice) {
      speechUtterance.voice = voice;
    }

    speechUtterance.onstart = () => {
      isPlaying = true;
      isPaused = false;
    };

    speechUtterance.onend = () => {
      isPlaying = false;
      isPaused = false;
    };

    speechUtterance.onerror = (e) => {
      if (e.error !== "canceled" && e.error !== "interrupted") {
        isPlaying = false;
        isPaused = false;
      }
    };

    window.speechSynthesis.speak(speechUtterance);
  }

  function toggleAudio() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      isPlaying = false;
      isPaused = true;
    } else if (isPaused) {
      window.speechSynthesis.resume();
      isPlaying = true;
      isPaused = false;
    } else {
      startPlayback();
    }
  }

  onMount(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        getBestVoice();
      };
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
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
        aria-label={isPlaying ? "Pause Studio Voice Brief" : isPaused ? "Resume Studio Voice Brief" : "Play Studio Voice Brief"}
        class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 {isPlaying
          ? 'bg-brand-green text-brand-dark shadow-[0_0_12px_rgba(126,166,65,0.6)]'
          : isPaused
            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-brand-green hover:text-brand-dark hover:border-transparent'
            : 'bg-white/[0.06] text-white/80 hover:bg-brand-green hover:text-brand-dark hover:shadow-[0_0_12px_rgba(126,166,65,0.4)]'}"
      >
        {#if isPlaying}
          <!-- 3 animated equalizer running lines -->
          <div class="flex items-center justify-center gap-[2.5px] h-3.5" aria-hidden="true">
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-1"></span>
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-2"></span>
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-3"></span>
          </div>
        {:else if isPaused}
          <!-- 2 pause vertical bar lines -->
          <div class="flex items-center justify-center gap-[3px] h-3" aria-hidden="true">
            <span class="w-[2.5px] h-3 bg-current rounded-full"></span>
            <span class="w-[2.5px] h-3 bg-current rounded-full"></span>
          </div>
        {:else}
          <!-- Idle state with 2 subtle bars -->
          <div class="flex items-center justify-center gap-[3px] h-3" aria-hidden="true">
            <span class="w-[2.5px] h-2.5 bg-current rounded-full opacity-70"></span>
            <span class="w-[2.5px] h-3.5 bg-current rounded-full"></span>
          </div>
        {/if}
      </button>

      <!-- Minimal Left Tooltip -->
      <span
        role="tooltip"
        class="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-md border border-white/15 bg-[#181615] px-2.5 py-1 font-mono text-[0.65rem] text-white opacity-0 shadow-xl backdrop-blur-md transition-all duration-150 group-hover:opacity-100 group-hover:-translate-x-0.5"
      >
        {isPlaying ? "Pause Audio Brief" : isPaused ? "Resume Audio Brief" : "Play Audio Brief"}
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
