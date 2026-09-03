<script lang="ts">
  import { base, resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
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
          const stageConduits = gsap.utils.toArray<HTMLElement>(".video-stage-conduit");

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

          if (stageConduits.length > 0) {
            gsap.from(stageConduits, {
              autoAlpha: 0,
              scale: 0.9,
              duration: 0.55,
              stagger: 0.14,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".video-pipeline-grid",
                start: "top 85%",
                once: true,
              },
            });
          }

          const branchSvgs = gsap.utils.toArray<HTMLElement>(".stage-branch-svg");
          if (branchSvgs.length > 0) {
            gsap.from(branchSvgs, {
              autoAlpha: 0,
              scaleY: 0,
              transformOrigin: "top center",
              duration: 0.4,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".video-pipeline-grid",
                start: "top 82%",
                once: true,
              },
            });
          }

          gsap.from(".ai-bubble-item", {
            autoAlpha: 0,
            y: 12,
            scale: 0.88,
            duration: 0.45,
            stagger: 0.04,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: ".video-pipeline-grid",
              start: "top 80%",
              once: true,
            },
          });
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
        preload="metadata"
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
        <p
          class="font-display text-5xl leading-[0.9] tracking-[-0.04em] text-brand-light sm:text-6xl lg:text-7xl"
        >
          <span class="ai-visual-title-line"><span>{$_('home.scrollImage.title1')}</span></span>
          <span class="ai-visual-title-line"
            ><span class="italic text-brand-green"
              >{$_('home.scrollImage.title2')}</span
            ></span
          >
        </p>
        <p
          class="ai-visual-copy-step mt-6 max-w-lg text-sm leading-relaxed text-brand-light/80 sm:text-base font-sans"
        >
          {$_('home.scrollImage.copy1')}
        </p>
      </div>
    </div>
  </figure>

  <div class="ai-panel relative z-10 bg-brand-light">
    <div class="ai-panel-curve" aria-hidden="true"></div>
    <div class="site-shell relative z-10 pt-14 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 flex flex-col items-center text-center">
      <!-- Section Editorial Intro (Short, Punchy, Focused) -->
      <div class="max-w-2xl mx-auto flex flex-col items-center text-center">
        <div class="ai-panel-copy">
          <h2
            id="scroll-image-story-title"
            class="ai-panel-copy-heading font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-normal leading-[1.22] tracking-[-0.02em] text-brand-dark text-center"
          >
            {$_('home.scrollImage.copy2')}
          </h2>
        </div>

        <div class="ai-panel-support mt-3.5 flex flex-col items-center text-center">
          <p class="max-w-lg text-sm sm:text-base leading-relaxed text-brand-dark/70 text-center">
            {$_('home.scrollImage.copy3')}
          </p>
        </div>
      </div>

      <!-- ═══ 3-Stage Visual Video Pipeline (Preview Frames + Floating Tool Bubbles) ═══ -->
      <div class="video-pipeline-container mt-11 sm:mt-16 w-full max-w-6xl mx-auto px-2 sm:px-4">
        <div class="video-pipeline-grid">

          <!-- ── STAGE 01: Raw Generative Synthesis ── -->
          <div class="video-stage-col">
            <div class="video-stage-card group">
              <div class="video-stage-frame">
                <img
                  src={`${base}/images/about/video-pipeline/stage-1-raw-synthesis.jpg`}
                  alt="Raw AI text-to-video generative synthesis draft"
                  class="video-stage-img"
                  width="640"
                  height="360"
                  loading="lazy"
                />
              </div>
            </div>

            <div class="video-stage-content">
              <div class="video-stage-header">
                <span class="video-stage-idx">01</span>
                <h3 class="video-stage-title">{$_('home.scrollImage.stages.stage1.title') || 'Generative Synthesis'}</h3>
              </div>
              <p class="video-stage-desc">
                {$_('home.scrollImage.stages.stage1.description') || 'Prompt-to-shot synthesis with generative model velocity.'}
              </p>

              <!-- Natural Pipeline Node Connector & Bubbles for Stage 01 -->
              <div class="stage-pipeline-connector">
                <svg class="stage-branch-svg branch-2-node" viewBox="0 0 140 24" fill="none" aria-hidden="true">
                  <!-- Live streaming stem coming down from stage -->
                  <line x1="70" y1="0" x2="70" y2="6" stroke="var(--color-brand-green)" stroke-width="1.6" class="stage-branch-flow" />
                  <circle cx="70" cy="6" r="2.5" fill="var(--color-brand-green)" />
                  <!-- Smooth live flowing bezier branches into each tool -->
                  <path d="M 70 6 C 70 16, 35 12, 35 24" stroke="var(--color-brand-green)" stroke-width="1.6" stroke-linecap="round" class="stage-branch-flow" />
                  <path d="M 70 6 C 70 16, 105 12, 105 24" stroke="var(--color-brand-green)" stroke-width="1.6" stroke-linecap="round" class="stage-branch-flow" />
                </svg>

                <div class="stage-tool-bubbles bubbles-2-row relative">
                  <!-- Runway Gen-4 -->
                  <div class="ai-bubble-item tool-runway">
                    <div class="ai-bubble-orb">
                      <svg viewBox="0 0 24 24" class="size-4.5 sm:size-5 shrink-0" focusable="false">
                        <path fill="#f8fafc" d="M7 6h5c2.2 0 3.8 1.4 3.8 3.5 0 1.6-.9 2.8-2.3 3.3l3 6.2h-2.5l-2.7-5.7H9.2v5.7H7V6zm2.2 5.5h2.8c1.3 0 2-.6 2-1.8s-.7-1.7-2-1.7H9.2v3.5z" />
                      </svg>
                    </div>
                    <span class="ai-bubble-label">Runway</span>
                  </div>

                  <!-- Kling AI -->
                  <div class="ai-bubble-item tool-kling">
                    <div class="ai-bubble-orb">
                      <svg viewBox="0 0 24 24" class="size-4.5 sm:size-5 shrink-0" focusable="false">
                        <path fill="#60a5fa" d="M7 6h2.5v5.2L14.2 6H17.5l-5.4 6 5.8 7H14.5l-4.3-5.3-1.1 1.2V19H7V6z"/>
                      </svg>
                    </div>
                    <span class="ai-bubble-label">Kling AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Connector 1 -> 2 (Stage Direction Arrow matching AiAboutSection) ── -->
          <div class="stage-divider" aria-hidden="true">
            <div class="stage-divider-line"></div>
            <div class="stage-divider-arrow">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                <path d="M0 6h15M12 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- ── STAGE 02: Temporal Upscaling ── -->
          <div class="video-stage-col">
            <div class="video-stage-card group">
              <div class="video-stage-frame">
                <img
                  src={`${base}/images/about/video-pipeline/stage-2-motion-upscale.jpg`}
                  alt="AI optical flow motion upscaling preview"
                  class="video-stage-img"
                  width="640"
                  height="360"
                  loading="lazy"
                />
              </div>
            </div>

            <div class="video-stage-content">
              <div class="video-stage-header">
                <span class="video-stage-idx">02</span>
                <h3 class="video-stage-title">{$_('home.scrollImage.stages.stage2.title') || 'Temporal Upscaling'}</h3>
              </div>
              <p class="video-stage-desc">
                {$_('home.scrollImage.stages.stage2.description') || 'Optical flow motion vectors for pristine 4K consistency.'}
              </p>

              <!-- Natural Pipeline Node Connector & Bubbles for Stage 02 -->
              <div class="stage-pipeline-connector">
                <svg class="stage-branch-svg branch-2-node" viewBox="0 0 140 24" fill="none" aria-hidden="true">
                  <!-- Live streaming stem coming down from stage -->
                  <line x1="70" y1="0" x2="70" y2="6" stroke="var(--color-brand-green)" stroke-width="1.6" class="stage-branch-flow" />
                  <circle cx="70" cy="6" r="2.5" fill="var(--color-brand-green)" />
                  <!-- Smooth live flowing bezier branches into each tool -->
                  <path d="M 70 6 C 70 16, 35 12, 35 24" stroke="var(--color-brand-green)" stroke-width="1.6" stroke-linecap="round" class="stage-branch-flow" />
                  <path d="M 70 6 C 70 16, 105 12, 105 24" stroke="var(--color-brand-green)" stroke-width="1.6" stroke-linecap="round" class="stage-branch-flow" />
                </svg>

                <div class="stage-tool-bubbles bubbles-2-row relative">
                  <!-- Google Flow -->
                  <div class="ai-bubble-item tool-flow">
                    <div class="ai-bubble-orb">
                      <svg viewBox="0 0 24 24" class="size-4.5 sm:size-5 shrink-0" focusable="false">
                        <defs>
                          <linearGradient id="flow-spark-clean" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#4285f4" />
                            <stop offset="35%" stop-color="#34a853" />
                            <stop offset="70%" stop-color="#fbbc05" />
                            <stop offset="100%" stop-color="#ea4335" />
                          </linearGradient>
                        </defs>
                        <path fill="url(#flow-spark-clean)" d="M12 3.5l1.9 5.6a1.5 1.5 0 0 0 1 1l5.6 1.9-5.6 1.9a1.5 1.5 0 0 0-1 1L12 20.5l-1.9-5.6a1.5 1.5 0 0 0-1-1L3.5 12l5.6-1.9a1.5 1.5 0 0 0 1-1L12 3.5z"/>
                      </svg>
                    </div>
                    <span class="ai-bubble-label">Flow</span>
                  </div>

                  <!-- Luma Dream -->
                  <div class="ai-bubble-item tool-luma">
                    <div class="ai-bubble-orb">
                      <svg viewBox="0 0 24 24" class="size-4.5 sm:size-5 shrink-0" focusable="false">
                        <defs>
                          <linearGradient id="luma-crescent-clean" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#ff5ca8" />
                            <stop offset="100%" stop-color="#ffd166" />
                          </linearGradient>
                        </defs>
                        <path fill="url(#luma-crescent-clean)" d="M15.5 4.5a8 8 0 1 0 4 9.8A6.4 6.4 0 0 1 15.5 4.5z"/>
                      </svg>
                    </div>
                    <span class="ai-bubble-label">Luma</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Connector 2 -> 3 (Stage Direction Arrow matching AiAboutSection) ── -->
          <div class="stage-divider" aria-hidden="true">
            <div class="stage-divider-line"></div>
            <div class="stage-divider-arrow">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                <path d="M0 6h15M12 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- ── STAGE 03: Master Editorial & Color Finishing ── -->
          <div class="video-stage-col">
            <div class="video-stage-card group">
              <div class="video-stage-frame">
                <video
                  bind:this={stage3Video}
                  autoplay
                  muted
                  loop
                  playsinline
                  poster={`${base}/images/about/video-pipeline/stage-3-master-grade.jpg`}
                  class="video-stage-img"
                  aria-label="Finished commercial color grading master clip"
                >
                  <source src={`${base}/videos/stage-3-master-grade.mp4`} type="video/mp4" />
                  <source src={`${base}/videos/editing-video-720p.webm`} type="video/webm" />
                  <img
                    src={`${base}/images/about/video-pipeline/stage-3-master-grade.jpg`}
                    alt="Finished ACES calibrated color grading master frame"
                    class="video-stage-img"
                    width="640"
                    height="360"
                    loading="lazy"
                  />
                </video>
              </div>
            </div>

            <div class="video-stage-content">
              <div class="video-stage-header">
                <span class="video-stage-idx text-brand-green">03</span>
                <h3 class="video-stage-title">{$_('home.scrollImage.stages.stage3.title') || 'Artisan Finishing'}</h3>
              </div>
              <p class="video-stage-desc">
                {$_('home.scrollImage.stages.stage3.description') || 'Frame-by-frame color balance, timeline cutdowns, and QC.'}
              </p>

              <!-- Natural Pipeline Node Connector & Bubbles for Stage 03 -->
              <div class="stage-pipeline-connector">
                <svg class="stage-branch-svg branch-4-node" viewBox="0 0 280 24" fill="none" aria-hidden="true">
                  <!-- Live streaming stem coming down from stage -->
                  <line x1="140" y1="0" x2="140" y2="6" stroke="var(--color-brand-green)" stroke-width="1.6" class="stage-branch-flow" />
                  <circle cx="140" cy="6" r="2.5" fill="var(--color-brand-green)" />
                  <!-- Smooth live flowing bezier branches into each tool -->
                  <path d="M 140 6 C 140 16, 35 12, 35 24" stroke="var(--color-brand-green)" stroke-width="1.6" stroke-linecap="round" class="stage-branch-flow" />
                  <path d="M 140 6 C 140 16, 105 12, 105 24" stroke="var(--color-brand-green)" stroke-width="1.6" stroke-linecap="round" class="stage-branch-flow" />
                  <path d="M 140 6 C 140 16, 175 12, 175 24" stroke="var(--color-brand-green)" stroke-width="1.6" stroke-linecap="round" class="stage-branch-flow" />
                  <path d="M 140 6 C 140 16, 245 12, 245 24" stroke="var(--color-brand-green)" stroke-width="1.6" stroke-linecap="round" class="stage-branch-flow" />
                </svg>

                <div class="stage-tool-bubbles bubbles-4-row">
                  <!-- Premiere Pro -->
                  <div class="ai-bubble-item tool-premiere">
                    <div class="ai-bubble-orb">
                      <span class="adobe-bubble-text text-[#9999ff]">Pr</span>
                    </div>
                    <span class="ai-bubble-label">Premiere</span>
                  </div>

                  <!-- After Effects -->
                  <div class="ai-bubble-item tool-aftereffects">
                    <div class="ai-bubble-orb">
                      <span class="adobe-bubble-text text-[#cf96fd]">Ae</span>
                    </div>
                    <span class="ai-bubble-label">After Effects</span>
                  </div>

                  <!-- Illustrator -->
                  <div class="ai-bubble-item tool-illustrator">
                    <div class="ai-bubble-orb">
                      <span class="adobe-bubble-text text-[#ff9a00]">Ai</span>
                    </div>
                    <span class="ai-bubble-label">Illustrator</span>
                  </div>

                  <!-- DaVinci Resolve -->
                  <div class="ai-bubble-item tool-davinci">
                    <div class="ai-bubble-orb">
                      <svg viewBox="0 0 24 24" class="size-4.5 sm:size-5 shrink-0" focusable="false">
                        <circle cx="12" cy="7.8" r="2.6" fill="#ef4444"/>
                        <circle cx="8" cy="14.8" r="2.6" fill="#3b82f6"/>
                        <circle cx="16" cy="14.8" r="2.6" fill="#22c55e"/>
                        <circle cx="12" cy="12" r="1.5" fill="#ffffff"/>
                      </svg>
                    </div>
                    <span class="ai-bubble-label">DaVinci</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Explore Link (Centered) -->
      <div class="mt-10 sm:mt-12 flex justify-center">
        <a href={resolve("/services/video-editing")} class="ai-explore-link group">
          <span class="font-sans text-xs sm:text-[0.84rem] font-semibold text-brand-dark group-hover:text-brand-green transition-colors duration-200">
            {$_('home.scrollImage.explore') || 'Explore video editing & post-production'}
          </span>
          <span class="grid h-6 w-6 place-items-center rounded-full border border-brand-dark/15 bg-white text-brand-dark transition-all duration-200 group-hover:border-brand-green group-hover:bg-brand-green group-hover:text-brand-dark">
            <ArrowUpRight size={13} strokeWidth={1.8} class="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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

  .ai-panel::after {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: radial-gradient(
      ellipse 70% 45% at 50% 55%,
      color-mix(in srgb, var(--color-brand-green) 12%, transparent) 0%,
      color-mix(in srgb, var(--color-brand-green) 4%, transparent) 45%,
      transparent 70%
    );
    content: "";
    pointer-events: none;
  }

  /* ═══ 3-Stage Visual Video Pipeline ═══ */
  .video-pipeline-container {
    position: relative;
    z-index: 2;
  }

  .video-pipeline-grid {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
  }

  /* ═══ Inter-Stage Direction Connectors (Matching AiAboutSection) ═══ */
  .stage-divider {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding-inline: 0.35rem;
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 5.75rem;
    user-select: none;
    pointer-events: none;
  }

  .stage-divider-line {
    width: 28px;
    height: 1px;
    background: repeating-linear-gradient(
      90deg,
      color-mix(in srgb, var(--color-brand-dark) 22%, transparent) 0,
      color-mix(in srgb, var(--color-brand-dark) 22%, transparent) 5px,
      transparent 5px,
      transparent 10px
    );
    transform-origin: left;
  }

  .stage-divider-arrow {
    display: flex;
    flex-shrink: 0;
    color: var(--color-brand-green);
  }

  .video-stage-col {
    position: relative;
    flex: 1;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.95rem;
    will-change: transform, opacity;
    z-index: 1;
  }

  .video-stage-col:hover {
    z-index: 40;
  }

  /* ── Stage Card & Cinematic Frame (Auto Expand on Hover) ── */
  .video-stage-card {
    position: relative;
    width: 100%;
    border-radius: 1.05rem;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    background: var(--color-brand-paper);
    box-shadow: 0 6px 22px -4px rgba(0, 0, 0, 0.07);
    transform-origin: center center;
    transition:
      transform 360ms cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 360ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 360ms cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, box-shadow;
    cursor: default;
    z-index: 1;
  }

  /* When hovered: pops up automatically, increases size big, lifts up and shows clearly! */
  .video-stage-card:hover {
    z-index: 50;
    transform: translateY(-28px) scale(1.24);
    border-color: color-mix(in srgb, var(--color-brand-green) 70%, transparent);
    box-shadow:
      0 34px 75px -14px rgba(0, 0, 0, 0.36),
      0 0 0 1px color-mix(in srgb, var(--color-brand-green) 40%, transparent),
      0 0 28px -4px color-mix(in srgb, var(--color-brand-green) 28%, transparent);
  }

  .video-stage-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9.2;
    overflow: hidden;
    background: #000000;
  }

  .video-stage-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 450ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .video-stage-card:hover .video-stage-img {
    transform: scale(1.03);
  }

  /* ── Stage Content & Typography ── */
  .video-stage-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.4rem;
    padding-inline: 0.35rem;
    width: 100%;
  }

  .video-stage-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .video-stage-idx {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-brand-green);
  }

  .video-stage-title {
    font-family: var(--font-sans, sans-serif);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-brand-dark);
    letter-spacing: -0.015em;
  }

  .video-stage-desc {
    font-family: var(--font-sans, sans-serif);
    font-size: 0.8rem;
    line-height: 1.48;
    color: color-mix(in srgb, var(--color-brand-dark) 68%, transparent);
    max-width: 320px;
  }

  /* ── Natural Pipeline Node Connector ── */
  .stage-pipeline-connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 0.75rem;
  }

  .stage-branch-svg {
    display: block;
    overflow: visible;
  }

  .branch-2-node {
    width: 140px;
    height: 24px;
  }

  .branch-4-node {
    width: 280px;
    height: 24px;
  }

  /* Live running flowing curved conduit line matching the pipeline aesthetic */
  .stage-branch-flow {
    stroke-dasharray: 5 4;
    animation: liveConduitStream 1.6s linear infinite;
    stroke: var(--color-brand-green);
    filter: drop-shadow(0 0 4px color-mix(in srgb, var(--color-brand-green) 55%, transparent));
  }

  /* ── Connected Tool Bubbles Row ── */
  .stage-tool-bubbles {
    display: grid;
    justify-content: center;
    width: 100%;
    margin-top: 0.15rem;
  }

  .bubbles-2-row {
    grid-template-columns: repeat(2, 70px);
    width: 140px;
  }

  .bubbles-4-row {
    grid-template-columns: repeat(4, 70px);
    width: 280px;
  }

  .ai-bubble-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 70px;
    gap: 0.35rem;
    cursor: default;
    user-select: none;
    will-change: transform;
    transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ai-bubble-orb {
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 999px;
    background: #0f172a;
    border: 1.5px solid color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    box-shadow:
      0 4px 12px -2px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    transition:
      transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 260ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 260ms cubic-bezier(0.16, 1, 0.3, 1),
      background-color 260ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .adobe-bubble-text {
    font-family: var(--font-sans, sans-serif);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    user-select: none;
  }

  .ai-bubble-label {
    font-family: var(--font-sans, sans-serif);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: color-mix(in srgb, var(--color-brand-dark) 65%, transparent);
    line-height: 1.15;
    text-align: center;
    max-width: 68px;
    white-space: nowrap;
    transition: color 200ms ease;
  }

  @keyframes liveConduitStream {
    0% {
      stroke-dashoffset: 36;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  /* ═══ Hover State on Bubbles ═══ */
  .ai-bubble-item:hover {
    animation-play-state: paused;
    transform: translateY(-4px);
  }

  .ai-bubble-item:hover .ai-bubble-orb {
    transform: scale(1.12);
  }

  .ai-bubble-item:hover .ai-bubble-label {
    color: var(--color-brand-dark);
    font-weight: 600;
  }

  /* ═══ Signature Glowing Brand Borders for Each Bubble ═══ */
  /* 1. Runway */
  .tool-runway .ai-bubble-orb {
    background: #111317;
    border-color: rgba(203, 213, 225, 0.7);
    box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.15), 0 0 8px rgba(255, 255, 255, 0.2);
  }
  .tool-runway:hover .ai-bubble-orb {
    border-color: #cbd5e1;
    box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.25), 0 0 14px rgba(203, 213, 225, 0.6);
  }

  /* 2. Kling AI */
  .tool-kling .ai-bubble-orb {
    background: #091226;
    border-color: rgba(59, 130, 246, 0.75);
    box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.15), 0 0 8px rgba(59, 130, 246, 0.35);
  }
  .tool-kling:hover .ai-bubble-orb {
    border-color: #3b82f6;
    box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.25), 0 0 16px rgba(59, 130, 246, 0.65);
  }

  /* 3. Google Flow */
  .tool-flow .ai-bubble-orb {
    background: #091326;
    border-color: rgba(66, 133, 244, 0.75);
    box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.15), 0 0 8px rgba(66, 133, 244, 0.35);
  }
  .tool-flow:hover .ai-bubble-orb {
    border-color: #4285f4;
    box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.25), 0 0 16px rgba(66, 133, 244, 0.65);
  }

  /* 4. Luma Dream */
  .tool-luma .ai-bubble-orb {
    background: #1a0b20;
    border-color: rgba(255, 92, 168, 0.75);
    box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.15), 0 0 8px rgba(255, 92, 168, 0.35);
  }
  .tool-luma:hover .ai-bubble-orb {
    border-color: #ff5ca8;
    box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.25), 0 0 16px rgba(255, 92, 168, 0.65);
  }

  /* 5. Adobe Premiere Pro */
  .tool-premiere .ai-bubble-orb {
    background: #080824;
    border-color: rgba(153, 153, 255, 0.8);
    box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.15), 0 0 8px rgba(153, 153, 255, 0.35);
  }
  .tool-premiere:hover .ai-bubble-orb {
    border-color: #9999ff;
    box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.25), 0 0 16px rgba(153, 153, 255, 0.65);
  }

  /* 6. Adobe After Effects */
  .tool-aftereffects .ai-bubble-orb {
    background: #110722;
    border-color: rgba(207, 150, 253, 0.8);
    box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.15), 0 0 8px rgba(207, 150, 253, 0.35);
  }
  .tool-aftereffects:hover .ai-bubble-orb {
    border-color: #cf96fd;
    box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.25), 0 0 16px rgba(207, 150, 253, 0.65);
  }

  /* 7. Adobe Illustrator */
  .tool-illustrator .ai-bubble-orb {
    background: #1e0c00;
    border-color: rgba(255, 154, 0, 0.8);
    box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.15), 0 0 8px rgba(255, 154, 0, 0.35);
  }
  .tool-illustrator:hover .ai-bubble-orb {
    border-color: #ff9a00;
    box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.25), 0 0 16px rgba(255, 154, 0, 0.65);
  }

  /* 8. DaVinci Resolve */
  .tool-davinci .ai-bubble-orb {
    background: #0e1219;
    border-color: rgba(244, 63, 94, 0.8);
    box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.15), 0 0 8px rgba(244, 63, 94, 0.35);
  }
  .tool-davinci:hover .ai-bubble-orb {
    border-color: #f43f5e;
    box-shadow: 0 6px 20px -2px rgba(0, 0, 0, 0.25), 0 0 16px rgba(244, 63, 94, 0.65);
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

  /* ═══ Explore Link ═══ */
  .ai-explore-link {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
  }

  @media (max-width: 991px) {
    .video-pipeline-grid {
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .video-stage-col {
      width: 100%;
      max-width: 420px;
    }

    .stage-divider {
      transform: rotate(90deg);
      align-self: center;
      margin-top: 0;
      padding-inline: 0;
      margin-block: 0.5rem;
    }
  }

  @media (max-width: 47.999rem) {
    .ai-visual-copy-inner {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    .ai-visual-curve {
      height: 4rem;
    }

    .ai-panel-curve {
      top: -4rem;
      height: 4rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ai-visual-title-line > span,
    .ai-visual-copy-step,
    .ai-panel-support,
    .ai-bubble-item,
    .ai-bubble-orb,
    .stage-branch-flow {
      will-change: auto;
      animation: none !important;
      transition: none !important;
    }
  }
</style>
