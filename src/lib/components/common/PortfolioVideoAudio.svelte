<script lang="ts">
  import { Volume2, VolumeX } from "lucide-svelte";

  let { video, controlId = "editorial-video-sound", videoLabel = "editorial video" }: {
    video: HTMLVideoElement | undefined;
    controlId?: string;
    videoLabel?: string;
  } = $props();
  let isMuted = $state(true);
  let toggleSound: () => void = () => undefined;

  $effect(() => {
    if (!video) return;
    const player = video;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let soundEnabled = true;
    let audioBlocked = false;
    let active = true;

    function playVideo(userInitiated = false) {
      if (!visible || document.hidden || (reducedMotion.matches && !userInitiated)) return;
      player.muted = !soundEnabled;
      void player.play().then(() => {
        if (active) audioBlocked = false;
      }).catch(() => {
        if (!active || !visible || document.hidden) return;
        player.muted = true;
        audioBlocked = soundEnabled;
        void player.play().catch(() => undefined);
      });
    }

    function syncPlayback() {
      if (!visible || document.hidden || reducedMotion.matches) {
        player.muted = true;
        player.pause();
      } else playVideo();
    }
    const onVolumeChange = () => { isMuted = player.muted; };
    const retryAudio = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(`#${controlId}`)) return;
      if (soundEnabled && audioBlocked) playVideo();
    };
    toggleSound = () => {
      soundEnabled = player.muted;
      audioBlocked = false;
      player.muted = !soundEnabled;
      if (soundEnabled) playVideo(true);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      syncPlayback();
    }, { threshold: [0, 0.35] });
    observer.observe(player);
    player.addEventListener("volumechange", onVolumeChange);
    document.addEventListener("pointerup", retryAudio);
    document.addEventListener("keydown", retryAudio);
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);

    return () => {
      active = false;
      observer.disconnect();
      player.removeEventListener("volumechange", onVolumeChange);
      document.removeEventListener("pointerup", retryAudio);
      document.removeEventListener("keydown", retryAudio);
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
      player.muted = true;
      player.pause();
    };
  });
</script>

<button
  id={controlId}
  type="button"
  onclick={() => toggleSound()}
  aria-label={isMuted ? `Turn ${videoLabel} sound on` : `Mute ${videoLabel} sound`}
  class="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-brand-dark/85 px-3 py-2 text-xs font-medium text-brand-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
>
  {#if isMuted}<VolumeX size={16} />{:else}<Volume2 size={16} />{/if}
  {isMuted ? "Sound on" : "Mute"}
</button>
