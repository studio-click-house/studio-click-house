<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { _ } from "svelte-i18n";
  import { Button } from "$lib/components/ui/button";
  import { previewMedia } from "$lib/content/media";
  import { siteConfig } from "$lib/config/site";

  let studioVideo: HTMLVideoElement;

  onMount(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let visible = false;
    let active = true;
    let pendingPlay: Promise<void> | undefined;
    const shouldPlay = () =>
      active && visible && !document.hidden && !motionPreference.matches;

    const updatePlayback = () => {
      if (!shouldPlay()) {
        studioVideo.pause();
        return;
      }
      if (!studioVideo.paused || pendingPlay) return;
      studioVideo.muted = true;
      pendingPlay = studioVideo.play();
      pendingPlay
        .catch(() => {})
        .finally(() => {
          pendingPlay = undefined;
          if (!shouldPlay()) studioVideo.pause();
        });
    };

    const cuePreview = () => {
      if (studioVideo.currentTime === 0) studioVideo.currentTime = 0.001;
    };
    if (studioVideo.readyState >= 1) cuePreview();
    studioVideo.addEventListener("loadedmetadata", cuePreview);
    studioVideo.addEventListener("canplay", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    motionPreference.addEventListener("change", updatePlayback);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        updatePlayback();
      },
      { threshold: 0.2 },
    );
    observer.observe(studioVideo);

    return () => {
      active = false;
      observer.disconnect();
      studioVideo.pause();
      studioVideo.removeEventListener("loadedmetadata", cuePreview);
      studioVideo.removeEventListener("canplay", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      motionPreference.removeEventListener("change", updatePlayback);
    };
  });
</script>

<section
  id="about-description"
  aria-labelledby="about-description-title"
  class="relative bg-brand-light py-14 text-brand-dark sm:py-20 lg:py-24"
>
  <div class="site-shell relative z-10">
    <div class="about-layout">
      <div class="about-heading">
        <p class="mb-5 font-sans text-sm font-medium text-brand-dark/60">
          {$_("home.aboutDescription.title1") || "About us"}
        </p>
        <h2
          id="about-description-title"
          class="max-w-[11ch] font-sans text-[clamp(3rem,4.8vw,5.5rem)] font-medium leading-[0.99] tracking-[-0.055em]"
        >
          {siteConfig.name}
        </h2>
      </div>

      <div
        id="about-studio-media"
        class="about-media"
        aria-label="Studio Click House visual work"
      >
        <figure
          class="about-film m-0 overflow-hidden rounded-[var(--radius-media-sm)] bg-brand-dark sm:rounded-[var(--radius-media)]"
        >
          <video
            bind:this={studioVideo}
            src="/images/video-editing/Creating_fashion_commercial_video_1080p_20261002180624.mp4"
            width="1920"
            height="1080"
            muted
            playsinline
            loop
            preload="metadata"
            aria-label="Fashion commercial production film"
            class="aspect-video h-full w-full object-cover"
          ></video>
        </figure>
        <figure
          class="about-portrait m-0 overflow-hidden rounded-[var(--radius-media-sm)] bg-brand-dark sm:rounded-[var(--radius-media)]"
        >
          <img
            src={previewMedia.cgiProductShowcase.src}
            alt={previewMedia.cgiProductShowcase.alt}
            width={previewMedia.cgiProductShowcase.width}
            height={previewMedia.cgiProductShowcase.height}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 18vw, 32vw"
            class="aspect-[4/5] h-full w-full object-cover"
          />
        </figure>
      </div>

      <div class="about-story">
        <p
          class="max-w-[43ch] font-sans text-[clamp(1.05rem,1.25vw,1.25rem)] leading-[1.55] text-brand-dark/90"
        >
          {$_("home.aboutDescription.paragraph1") ||
            "Studio Click House is a visual post-production studio for photographers, fashion brands, e-commerce retailers, and creative agencies."}
        </p>
        <p
          class="mt-5 max-w-[55ch] font-sans text-sm leading-[1.7] text-brand-dark/65 sm:text-[0.95rem]"
        >
          {$_("home.aboutDescription.paragraph2") ||
            "We handle editorial retouching, product image editing, video color grading, and photorealistic 3D CGI. Our Dhaka production team works across shifts to keep large batches moving while senior artists review the finish."}
        </p>
        <div class="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Button
            href={resolve("/about")}
            size="lg"
            class="bg-brand-dark px-6 text-brand-light hover:bg-brand-green hover:text-brand-dark"
          >
            {$_("home.aboutDescription.aboutStudio") || "About the studio"}
          </Button>
          <a
            href={resolve("/contact")}
            class="rounded-[var(--radius-control)] py-3 font-sans text-sm font-medium text-brand-dark/75 underline-offset-4 hover:text-brand-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
          >
            {$_("home.aboutDescription.freeTrial") || "Start free trial"}
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .about-layout {
    display: grid;
    gap: 2rem;
  }

  .about-media {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    align-items: start;
  }

  .about-film {
    grid-column: 1 / 12;
    grid-row: 1;
    aspect-ratio: 16 / 9;
  }

  .about-portrait {
    grid-column: 9 / 13;
    grid-row: 1;
    margin-top: 65%;
    aspect-ratio: 4 / 5;
  }

  @media (min-width: 1024px) {
    .about-layout {
      grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
      grid-template-rows: auto 1fr;
      column-gap: clamp(3rem, 5vw, 6rem);
      row-gap: 2rem;
      align-items: start;
    }

    .about-heading {
      grid-column: 1;
      grid-row: 1;
    }

    .about-story {
      grid-column: 1;
      grid-row: 2;
    }

    .about-media {
      grid-column: 2;
      grid-row: 1 / 3;
      align-self: center;
      padding-block: 1.5rem;
    }

    .about-film {
      grid-column: 1 / 12;
    }

    .about-portrait {
      margin-top: 90%;
    }
  }
</style>
