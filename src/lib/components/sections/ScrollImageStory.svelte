<script lang="ts">
  import { base, resolve } from "$app/paths";
  import { ArrowRight, ArrowUpRight } from "lucide-svelte";
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";

  let section: HTMLElement;
  let storyVideo: HTMLVideoElement;
  let stage3Video: HTMLVideoElement | undefined = $state();

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;
    let videoVisible = false;
    let videoPrepared = false;
    let stage3Visible = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncVideoPlayback = () => {
      if (videoVisible && !reducedMotion.matches) {
        if (!videoPrepared) {
          videoPrepared = true;
          storyVideo.load();
        }
        void storyVideo.play().catch(() => undefined);
      } else {
        storyVideo.pause();
      }
    };

    const syncStage3Playback = () => {
      if (!stage3Video) return;
      if (stage3Visible && !reducedMotion.matches) {
        void stage3Video.play().catch(() => undefined);
      } else {
        stage3Video.pause();
      }
    };

    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        videoVisible = entry?.isIntersecting ?? false;
        syncVideoPlayback();
      },
      { rootMargin: "240px 0px", threshold: 0.08 },
    );

    let stage3Observer: IntersectionObserver | undefined;
    if (stage3Video) {
      stage3Observer = new IntersectionObserver(
        ([entry]) => {
          stage3Visible = entry?.isIntersecting ?? false;
          syncStage3Playback();
        },
        { rootMargin: "200px 0px", threshold: 0.1 },
      );
      stage3Observer.observe(stage3Video);
    }

    videoObserver.observe(storyVideo);
    reducedMotion.addEventListener("change", syncVideoPlayback);
    reducedMotion.addEventListener("change", syncStage3Playback);

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;

      const { gsap, ScrollTrigger } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".ai-visual",
                start: "top 88%",
                end: "center 48%",
                scrub: 0.95,
                refreshPriority: 90,
                invalidateOnRefresh: true,
              },
            })
            .from(
              ".ai-visual-kicker",
              {
                autoAlpha: 0,
                x: -28,
                duration: 0.3,
                ease: "power2.out",
              },
              0,
            )
            .from(
              ".ai-visual-title-line > span",
              {
                yPercent: 114,
                rotation: 2,
                transformOrigin: "left bottom",
                duration: 0.55,
                stagger: 0.1,
                ease: "power3.out",
              },
              0.08,
            )
            .from(
              ".ai-visual-copy-step",
              {
                autoAlpha: 0,
                y: 22,
                duration: 0.38,
                stagger: 0.08,
                ease: "power2.out",
              },
              0.4,
            );

          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".ai-panel-copy",
                start: "top 88%",
                end: "top 48%",
                scrub: 0.9,
                refreshPriority: 89,
                invalidateOnRefresh: true,
              },
            })
            .from(".ai-panel-copy-heading", {
              autoAlpha: 0,
              y: 24,
              duration: 0.6,
              ease: "power2.out",
            })
            .from(
              ".ai-panel-support",
              {
                autoAlpha: 0,
                y: 22,
                duration: 0.55,
                ease: "power2.out",
              },
              0.26,
            );

          const stageCols = gsap.utils.toArray<HTMLElement>(".video-stage-col");
          if (stageCols.length > 0) {
            gsap.from(stageCols, {
              autoAlpha: 0,
              y: 28,
              duration: 0.6,
              stagger: 0.14,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".video-pipeline-grid",
                start: "top 85%",
                once: true,
              },
            });
          }
        });

        ScrollTrigger.refresh();
        return () => media.revert();
      }, section);

      ScrollTrigger.refresh();
    });

    return () => {
      active = false;
      videoObserver.disconnect();
      stage3Observer?.disconnect();
      reducedMotion.removeEventListener("change", syncVideoPlayback);
      reducedMotion.removeEventListener("change", syncStage3Playback);
      storyVideo.pause();
      stage3Video?.pause();
      context?.revert();
    };
  });
</script>

<section
  id="scroll-image-story"
  bind:this={section}
  aria-labelledby="scroll-image-story-title"
  class="relative overflow-hidden bg-brand-light text-brand-dark"
>
  <figure
    class="ai-visual relative h-[26rem] overflow-hidden sm:h-[34rem] lg:h-[42rem]"
  >
    <figcaption class="sr-only">AI video post-production in motion.</figcaption>
    <div class="ai-video-reveal absolute inset-0 overflow-hidden">
      <video
        bind:this={storyVideo}
        muted
        loop
        playsinline
        preload="none"
        poster={`${base}/images/services/model-beauty/model-soleil-blue-resortwear-editorial-1293.webp`}
        class="story-image ai-visual-image absolute inset-x-0 top-[-12.5%] h-[125%] w-full object-cover"
        aria-hidden="true"
      >
        <source
          src={`${base}/videos/ai%20section%20video.mp4`}
          type="video/mp4"
        />
      </video>
      <div class="ai-visual-shade absolute inset-0" aria-hidden="true"></div>
    </div>
    <div class="ai-visual-curve" aria-hidden="true"></div>
    <div
      class="ai-visual-copy site-shell absolute inset-0 z-[3] flex items-center"
    >
      <div class="ai-visual-copy-inner max-w-3xl">
        <p class="eyebrow mb-3 text-brand-light/60 ai-visual-kicker">
          {$_("sectionLabels.aiVideo")}
        </p>
        <p
          class="font-display text-5xl leading-[0.9] tracking-[-0.04em] text-brand-light sm:text-6xl lg:text-7xl"
        >
          <span class="ai-visual-title-line"
            ><span>{$_("home.scrollImage.title1")}</span></span
          >
          <span class="ai-visual-title-line"
            ><span class="italic text-brand-green"
              >{$_("home.scrollImage.title2")}</span
            ></span
          >
        </p>
        <p
          class="ai-visual-copy-step mt-6 max-w-lg text-sm leading-relaxed text-brand-light/80 sm:text-base font-sans"
        >
          {$_("home.scrollImage.copy1")}
        </p>
      </div>
    </div>
  </figure>

  <div class="ai-panel relative z-10 bg-brand-light">
    <div class="ai-panel-curve" aria-hidden="true"></div>
    <div class="site-shell relative z-10 py-16 sm:py-20 lg:py-24">
      <div class="ai-panel-intro ai-panel-copy">
        <p class="eyebrow mb-3 text-brand-dark/50">
          {$_("sectionLabels.photoToVideo")}
        </p>
        <h2
          id="scroll-image-story-title"
          class="ai-panel-copy-heading font-display text-3xl font-normal leading-[1.15] tracking-[-0.025em] text-brand-dark sm:text-4xl"
        >
          {$_("home.scrollImage.copy2")}
        </h2>
        <p
          class="ai-panel-support max-w-2xl text-sm leading-relaxed text-brand-dark/70 sm:text-base"
        >
          {$_("home.scrollImage.copy3")}
        </p>
      </div>

      <div class="video-pipeline-container mt-10 w-full sm:mt-14 lg:mt-16">
        <div id="photo-to-video-steps" class="video-pipeline-grid">
          <article id="photo-to-video-generation" class="video-stage-col">
            <div class="video-stage-media">
              <figure
                class="video-stage-frame rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)]"
              >
                <img
                  src={`${base}/images/about/video-pipeline/stage-1-raw-synthesis.webp`}
                  alt="Source still prepared for AI motion generation"
                  class="video-stage-img"
                  width="640"
                  height="360"
                  loading="lazy"
                />
              </figure>
              <span class="video-stage-direction" aria-hidden="true"
                ><ArrowRight size={24} strokeWidth={1.25} /></span
              >
            </div>
            <div class="video-stage-content">
              <div class="video-stage-header">
                <span class="video-stage-idx">01</span>
                <h3 class="video-stage-title">
                  {$_("home.scrollImage.stages.stage1.title")}
                </h3>
              </div>
              <p class="video-stage-desc">
                {$_("home.scrollImage.stages.stage1.description")}
              </p>
            </div>
          </article>

          <article id="photo-to-video-finishing" class="video-stage-col">
            <figure
              class="video-stage-frame rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)]"
            >
              <video
                bind:this={stage3Video}
                muted
                loop
                playsinline
                controls
                preload="none"
                poster={`${base}/images/about/video-pipeline/stage-3-master-grade.webp`}
                class="video-stage-img"
                aria-label={$_("home.scrollImage.stages.stage3.title")}
              >
                <source
                  src={`${base}/videos/stage-3-master-grade.mp4`}
                  type="video/mp4"
                />
                <source
                  src={`${base}/videos/editing-video-720p.webm`}
                  type="video/webm"
                />
                <img
                  src={`${base}/images/about/video-pipeline/stage-3-master-grade.webp`}
                  alt="Finished ACES calibrated color grading master frame"
                  class="video-stage-img"
                  width="640"
                  height="360"
                  loading="lazy"
                />
              </video>
            </figure>
            <div class="video-stage-content">
              <div class="video-stage-header">
                <span class="video-stage-idx">02</span>
                <h3 class="video-stage-title">
                  {$_("home.scrollImage.stages.stage3.title")}
                </h3>
              </div>
              <p class="video-stage-desc">
                {$_("home.scrollImage.stages.stage3.description")}
              </p>
            </div>
          </article>
        </div>
      </div>
      <!-- Explore Link (Centered) -->
      <div class="mt-10 sm:mt-12 flex justify-center">
        <a
          href={resolve("/services#video-editing")}
          class="ai-explore-link group"
        >
          <span
            class="font-sans text-xs sm:text-[0.84rem] font-semibold text-brand-dark group-hover:text-brand-green transition-colors duration-200"
          >
            {$_("home.scrollImage.explore") ||
              "Explore video editing & post-production"}
          </span>
          <span
            class="grid h-6 w-6 place-items-center rounded-full border border-brand-dark/15 bg-white text-brand-dark transition-all duration-200 group-hover:border-brand-green group-hover:bg-brand-green group-hover:text-brand-dark"
          >
            <ArrowUpRight
              size={13}
              strokeWidth={1.8}
              class="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  .ai-video-reveal {
    background: var(--color-brand-dark);
  }

  .ai-visual-shade {
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-brand-dark) 8%, transparent),
      color-mix(in srgb, var(--color-brand-dark) 48%, transparent)
    );
  }

  .ai-visual-copy {
    pointer-events: none;
  }

  .ai-visual-copy-inner {
    padding-top: 3rem;
    text-shadow: 0 0.25rem 1.5rem
      color-mix(in srgb, var(--color-brand-dark) 48%, transparent);
  }

  .ai-visual-title-line {
    display: block;
    overflow: hidden;
    padding: 0 0.1em 0.24em;
    margin: 0 -0.1em -0.24em;
  }

  .ai-visual-title-line > span {
    display: block;
    will-change: transform;
  }

  .ai-panel {
    isolation: isolate;
  }

  .ai-panel-curve {
    position: absolute;
    top: -7rem;
    left: 0;
    z-index: 1;
    display: block;
    width: 100%;
    height: 7rem;
    background: var(--color-brand-light);
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 160' preserveAspectRatio='none'%3E%3Cpath d='M0 130 C270 154 430 90 760 58 C1060 30 1320 34 1600 82 L1600 160 L0 160 Z' fill='black'/%3E%3C/svg%3E");
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 160' preserveAspectRatio='none'%3E%3Cpath d='M0 130 C270 154 430 90 760 58 C1060 30 1320 34 1600 82 L1600 160 L0 160 Z' fill='black'/%3E%3C/svg%3E");
    mask-position: center;
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
  }

  .ai-visual-curve {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 7rem;
    background: var(--color-brand-light);
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 160' preserveAspectRatio='none'%3E%3Cpath d='M0 0 H1600 V82 C1320 34 1060 30 760 58 C430 90 270 154 0 130 Z' fill='black'/%3E%3C/svg%3E");
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 160' preserveAspectRatio='none'%3E%3Cpath d='M0 0 H1600 V82 C1320 34 1060 30 760 58 C430 90 270 154 0 130 Z' fill='black'/%3E%3C/svg%3E");
    mask-position: center;
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
  }

  .video-pipeline-container {
    position: relative;
    z-index: 2;
  }

  .video-pipeline-grid {
    --preview-gap: clamp(3rem, 5vw, 5rem);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: var(--preview-gap);
  }

  .video-stage-col {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 1.25rem;
    will-change: transform, opacity;
  }

  .video-stage-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--color-brand-dark);
  }

  .video-stage-media {
    position: relative;
  }

  .video-stage-direction {
    position: absolute;
    inset-block: 0;
    inset-inline-end: calc(var(--preview-gap) / -2);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    transform: translateX(50%);
    color: var(--color-brand-green);
  }

  .video-stage-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .video-stage-frame:hover img.video-stage-img {
    transform: scale(1.025);
  }

  .video-stage-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    width: 100%;
  }

  .video-stage-header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .video-stage-idx {
    font-family: var(--font-mono, monospace);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: color-mix(in srgb, var(--color-brand-dark) 48%, transparent);
  }

  .video-stage-title {
    font-family: var(--font-sans, sans-serif);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-brand-dark);
    letter-spacing: -0.02em;
  }

  .video-stage-desc {
    max-width: 48ch;
    font-family: var(--font-sans, sans-serif);
    font-size: 0.95rem;
    line-height: 1.6;
    color: color-mix(in srgb, var(--color-brand-dark) 68%, transparent);
  }

  .ai-panel-intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .ai-panel-copy-heading {
    max-width: 24ch;
  }
  @media (max-width: 63.999rem) {
    .video-pipeline-grid {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }

    .video-stage-col {
      width: 100%;
    }

    .video-stage-direction {
      display: none;
    }
  }
  @media (max-width: 47.999rem) {
    .ai-visual-copy-inner {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    .ai-visual-curve {
      height: 4rem;
      transform: translateY(-1px);
    }

    .ai-panel-curve {
      top: -4rem;
      height: 4rem;
      transform: translateY(1px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ai-visual-title-line > span,
    .ai-visual-copy-step,
    .ai-panel-support,
    .video-stage-img {
      will-change: auto;
      animation: none !important;
      transition: none !important;
    }
  }
</style>
