<script lang="ts">
  import { Pause, Play, Volume2, VolumeX } from "lucide-svelte";

  let { isPlaying, isMuted, onTogglePlay, onToggleMute, playLabel = "video", tone = "overlay" }: {
    isPlaying: boolean;
    isMuted: boolean;
    onTogglePlay: () => void;
    onToggleMute: () => void;
    playLabel?: string;
    tone?: "overlay" | "hero";
  } = $props();

  const controlClass = "flex size-10 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";
</script>

<div class="flex items-center gap-3">
  <button type="button" onclick={onTogglePlay} aria-label={isPlaying ? `Pause ${playLabel}` : `Play ${playLabel}`} class={`${controlClass} ${tone === "hero" ? "bg-brand-dark/35" : "bg-white/20"} hover:bg-brand-green hover:text-brand-dark`}>
    {#if isPlaying}<Pause size={15} />{:else}<Play size={15} class="translate-x-0.5" />{/if}
  </button>
  <button type="button" onclick={onToggleMute} aria-label={isMuted ? "Unmute audio" : "Mute audio"} class={`${controlClass} ${tone === "hero" ? "bg-brand-dark/35" : "bg-white/20"} hover:bg-white/30`}>
    {#if isMuted}<VolumeX size={15} />{:else}<Volume2 size={15} />{/if}
  </button>
</div>
