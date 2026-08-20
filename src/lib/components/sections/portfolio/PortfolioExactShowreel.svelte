<script lang="ts">
  let showreelVideo = $state<HTMLVideoElement | null>(null);

  $effect(() => {
    if (showreelVideo) {
      showreelVideo.muted = true;
      showreelVideo.defaultMuted = true;
      void showreelVideo.play().catch(() => {});
    }
  });
</script>

<!-- Section 10: Full-Width Edge-to-Edge Editorial Video Showreel -->
<section
  id="portfolio-showreel-video"
  aria-label="Studio Video Showreel"
  class="relative w-full overflow-hidden bg-brand-dark"
>
  <div class="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/10] max-h-[85vh] overflow-hidden">
    <video
      bind:this={showreelVideo}
      autoplay
      loop
      muted
      playsinline
      preload="auto"
      class="h-full w-full object-cover object-center"
      aria-label="Studio Click House commercial and editorial video showcase"
    >
      <source
        src="https://videos.pexels.com/video-files/29539460/12715672_1920_1080_30fps.mp4"
        type="video/mp4"
      />
    </video>
  </div>
</section>
