<script lang="ts">
  import { base, resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { homeVideoStory } from "$lib/content/home-video-story";
  import { _ } from "svelte-i18n";
  import PortfolioVideoAudio from "$lib/components/common/PortfolioVideoAudio.svelte";

  let section: HTMLElement;
  let beautyVideo = $state<HTMLVideoElement>();
  const aiVideoTitleWords = $derived(
    $_("home.scrollImage.title2").trim().split(/\s+/),
  );
  const photoToVideoTitleWords = $derived(
    $_("home.scrollImage.copy2").trim().split(/\s+/),
  );

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const players = Array.from(
      section.querySelectorAll<HTMLVideoElement>(
        "video:not(#ai-beauty-product-video)",
      ),
      (video) => ({
        video,
        visible: false,
      }),
    );
    function syncPlayback() {
      for (const { video, visible } of players) {
        if (visible && !document.hidden && !reducedMotion.matches) {
          if (video.paused) void video.play().catch(() => undefined);
        } else video.pause();
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const player = players.find(
            (player) => player.video === entry.target,
          );
          if (player) {
            player.visible =
              entry.isIntersecting && entry.intersectionRatio >= 0.1;
          }
        }
        syncPlayback();
      },
      { threshold: [0, 0.1] },
    );
    for (const { video } of players) observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);

    void registerScrollTrigger().then((runtime) => {
      if (!active || !runtime) return;
      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          for (const block of section.querySelectorAll(".story-reveal")) {
            gsap.from(block, {
              autoAlpha: 0,
              y: 24,
              duration: 0.8,
              ease: "power2.out",
              clearProps: "all",
              scrollTrigger: { trigger: block, start: "top 90%", once: true },
            });
          }
        });
        return () => media.revert();
      }, section);
    });
    return () => {
      active = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
      for (const { video } of players) video.pause();
      context?.revert();
    };
  });
</script>

<section
  id="scroll-image-story"
  bind:this={section}
  aria-labelledby="ai-video-production-title"
  class="bg-brand-light py-14 text-brand-dark sm:py-16 lg:py-20"
>
  <div class="site-shell">
    <div id="ai-video-production">
      <header
        class="story-reveal mb-8 grid gap-5 sm:mb-10 lg:grid-cols-12 lg:items-end lg:gap-12"
      >
        <div class="lg:col-span-7">
          <p class="mb-3 text-sm font-medium text-brand-dark/50">
            {$_("sectionLabels.aiVideo")}
          </p>
          <h2
            id="ai-video-production-title"
            class="max-w-[24ch] text-balance font-sans text-[length:var(--text-section)] font-semibold leading-[1.05] tracking-[-0.04em]"
          >
            {$_("home.scrollImage.title1")}
            {#each aiVideoTitleWords as word, index (index)}
              {#if index === aiVideoTitleWords.length - 1}<span
                  class="text-brand-green">{word}</span
                >{:else}{word}{/if}{index < aiVideoTitleWords.length - 1
                ? " "
                : ""}
            {/each}
          </h2>
        </div>
        <p
          class="max-w-[48ch] text-base leading-relaxed text-brand-dark/70 lg:col-span-5"
        >
          {$_("home.scrollImage.copy1")}
        </p>
      </header>

      <div
        class="grid items-start gap-6 md:grid-cols-[minmax(0,9fr)_minmax(0,20fr)]"
      >
        <figure class="story-reveal m-0 md:col-start-2 md:row-start-1">
          <div
            class="aspect-video overflow-hidden rounded-[var(--radius-media-sm)] bg-brand-dark sm:rounded-[var(--radius-media)]"
          >
            <video
              src={`${base}${homeVideoStory.cosmetics.src}`}
              poster={`${base}${homeVideoStory.cosmetics.poster}`}
              muted
              loop
              playsinline
              preload="none"
              aria-label={homeVideoStory.cosmetics.title}
              class="h-full w-full object-cover"
            ></video>
          </div>
          <figcaption class="mt-3 text-xs leading-relaxed text-brand-dark/60">
            {homeVideoStory.cosmetics.title}
          </figcaption>
        </figure>
        <figure
          class="story-reveal m-0 order-first md:col-start-1 md:row-start-1"
        >
          <div
            class="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-media-sm)] bg-brand-dark sm:rounded-[var(--radius-media)]"
          >
            <video
              id="ai-beauty-product-video"
              bind:this={beautyVideo}
              src={`${base}${homeVideoStory.beauty.src}`}
              poster={`${base}${homeVideoStory.beauty.poster}`}
              muted
              loop
              playsinline
              preload="none"
              aria-label={homeVideoStory.beauty.title}
              class="h-full w-full object-cover"
            ></video>
            <PortfolioVideoAudio
              video={beautyVideo}
              controlId="beauty-film-sound"
              videoLabel="beauty product video"
            />
          </div>
          <figcaption class="mt-3 text-xs leading-relaxed text-brand-dark/60">
            {homeVideoStory.beauty.title}
          </figcaption>
        </figure>
      </div>
    </div>

    <div id="ai-photo-to-video" class="mt-14 sm:mt-16 lg:mt-20">
      <header
        class="story-reveal mb-8 grid gap-5 sm:mb-10 lg:grid-cols-12 lg:items-end lg:gap-12"
      >
        <div class="lg:col-span-7">
          <p class="mb-3 text-sm font-medium text-brand-dark/50">
            {$_("sectionLabels.photoToVideo")}
          </p>
          <h2
            id="scroll-image-story-title"
            class="max-w-[24ch] text-balance font-sans text-[length:var(--text-section)] font-semibold leading-[1.05] tracking-[-0.04em]"
          >
            {#each photoToVideoTitleWords as word, index (index)}
              {#if index === photoToVideoTitleWords.length - 1}<span
                  class="text-brand-green">{word}</span
                >{:else}{word}{/if}{index < photoToVideoTitleWords.length - 1
                ? " "
                : ""}
            {/each}
          </h2>
        </div>
      </header>

      <div class="grid gap-6 md:grid-cols-3">
        <div
          id="photo-to-video-steps"
          class="grid gap-6 sm:grid-cols-2 md:col-span-2"
        >
          <article id="photo-to-video-generation" class="story-reveal">
            <figure
              class="m-0 aspect-video overflow-hidden rounded-[var(--radius-media-sm)] bg-brand-dark sm:rounded-[var(--radius-media)]"
            >
              <img
                src={`${base}/images/about/video-pipeline/stage-1-raw-synthesis.webp`}
                alt="Source still prepared for AI motion generation"
                width="640"
                height="360"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover"
              />
            </figure>
            <h3 class="mt-4 text-base font-semibold tracking-[-0.02em]">
              {$_("home.scrollImage.stages.stage1.title")}
            </h3>
            <p
              class="mt-2 max-w-[48ch] text-sm leading-relaxed text-brand-dark/65"
            >
              {$_("home.scrollImage.stages.stage1.description")}
            </p>
          </article>
          <article id="photo-to-video-finishing" class="story-reveal">
            <figure
              class="m-0 aspect-video overflow-hidden rounded-[var(--radius-media-sm)] bg-brand-dark sm:rounded-[var(--radius-media)]"
            >
              <video
                src={`${base}/videos/stage-3-master-grade.mp4`}
                poster={`${base}/images/about/video-pipeline/stage-3-master-grade.webp`}
                muted
                loop
                playsinline
                preload="none"
                aria-label={$_("home.scrollImage.stages.stage3.title")}
                class="h-full w-full object-cover"
              ></video>
            </figure>
            <h3 class="mt-4 text-base font-semibold tracking-[-0.02em]">
              {$_("home.scrollImage.stages.stage3.title")}
            </h3>
            <p
              class="mt-2 max-w-[48ch] text-sm leading-relaxed text-brand-dark/65"
            >
              {$_("home.scrollImage.stages.stage3.description")}
            </p>
          </article>
        </div>
        <figure id="photo-to-video-motion-study" class="story-reveal m-0">
          <div
            class="aspect-video overflow-hidden rounded-[var(--radius-media-sm)] bg-brand-dark sm:rounded-[var(--radius-media)]"
          >
            <video
              src={`${base}${homeVideoStory.motion.src}`}
              poster={`${base}${homeVideoStory.motion.poster}`}
              muted
              loop
              playsinline
              preload="none"
              aria-label={homeVideoStory.motion.title}
              class="h-full w-full object-cover"
            ></video>
          </div>
          <figcaption class="mt-4 text-base font-semibold tracking-[-0.02em]">
            {homeVideoStory.motion.title}
          </figcaption>
        </figure>
      </div>
      <div class="mt-8 flex justify-center">
        <a
          href={resolve("/services/video-editing")}
          class="inline-flex min-h-11 items-center gap-3 text-center text-sm font-semibold text-brand-dark transition-colors hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          {$_("home.scrollImage.explore")}<ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  </div>
</section>
