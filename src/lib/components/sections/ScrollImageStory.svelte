<script lang="ts">
  import { base, resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let section: HTMLElement;
  let storyVideo: HTMLVideoElement;

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;
    let videoVisible = false;
    let videoPrepared = false;
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
    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        videoVisible = entry?.isIntersecting ?? false;
        syncVideoPlayback();
      },
      { rootMargin: "240px 0px", threshold: 0.08 },
    );

    videoObserver.observe(storyVideo);
    reducedMotion.addEventListener("change", syncVideoPlayback);

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
        });

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const logoDrift = [
              { x: 10, y: -8, scale: 1.02, rotation: 1.2, duration: 5.8 },
              { x: -8, y: 10, scale: 0.98, rotation: -1.1, duration: 6.4 },
              { x: 9, y: 7, scale: 1.02, rotation: 1, duration: 5.2 },
              { x: -7, y: -9, scale: 0.98, rotation: -1.2, duration: 6.8 },
              { x: 8, y: 6, scale: 1.02, rotation: 1.1, duration: 5.6 },
              { x: -9, y: 8, scale: 1.01, rotation: -0.9, duration: 6.1 },
            ];

            gsap.utils
              .toArray<HTMLElement>(".ai-logo-bubble")
              .forEach((bubble, index) => {
                const drift = logoDrift[index] ?? logoDrift[0];

                gsap.to(bubble, {
                  ...drift,
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                });
              });

            gsap.to(".ai-panel-orb-shadow", {
              x: 22,
              y: 18,
              scale: 1.025,
              rotation: 4,
              duration: 4.8,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
            gsap.to(".ai-panel-orb-midtone", {
              x: -20,
              y: -22,
              scale: 0.97,
              rotation: -3,
              duration: 3.1,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
            });
            gsap.to(".ai-panel-orb-highlight", {
              x: 14,
              y: 10,
              scale: 1.06,
              rotation: 6,
              duration: 1.9,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          },
        );

        ScrollTrigger.refresh();
        return () => media.revert();
      }, section);

      ScrollTrigger.refresh();
    });

    return () => {
      active = false;
      videoObserver.disconnect();
      reducedMotion.removeEventListener("change", syncVideoPlayback);
      storyVideo.pause();
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
          <span class="ai-visual-title-line"><span>Professional</span></span>
          <span class="ai-visual-title-line"
            ><span class="italic text-brand-green"
              >AI video post-production.</span
            ></span
          >
        </p>
        <p
          class="ai-visual-copy-step mt-6 max-w-lg text-sm leading-relaxed text-brand-light/80 sm:text-base font-sans"
        >
          Accelerate your motion pipeline with generative AI. From model-generated shots with Kling, Flow, and Veo to AI motion upscaling and cinematic finishing, we deliver broadcast-ready video tuned for global campaigns.
        </p>
      </div>
    </div>
  </figure>

  <div class="ai-panel relative z-10 bg-brand-light">
    <div class="ai-panel-curve" aria-hidden="true"></div>
    <div class="ai-panel-orbits" aria-hidden="true">
      <span class="ai-panel-orb ai-panel-orb-shadow"></span>
      <span class="ai-panel-orb ai-panel-orb-midtone"></span>
      <span class="ai-panel-orb ai-panel-orb-highlight"></span>
    </div>
    <div
      class="ai-panel-content site-shell flex flex-col items-center gap-6 pt-14 pb-4 text-center sm:gap-8 sm:pt-16 sm:pb-6 lg:pt-20 lg:pb-8"
    >
      <div class="ai-panel-copy mx-auto w-full max-w-2xl text-left">
        <h2
          id="scroll-image-story-title"
          class="ai-panel-copy-heading font-display text-xl font-normal leading-[1.3] tracking-[-0.02em] text-brand-dark sm:text-2xl"
        >
          AI video post-production accelerates the workflow — streamlining generative shot creation, complex cutdowns, color balance, and visual cleanup with artisan oversight at every frame.
        </h2>
      </div>

      <div class="ai-panel-support w-full max-w-2xl text-left">
        <p
          class="mt-4 max-w-2xl text-sm leading-relaxed text-brand-dark/78 sm:text-base"
        >
          Generated or captured, every sequence is finished by senior colorists and editors. We blend Kling, Google Flow, Runway, and Luma-generated footage with expert grading and frame-by-frame review for pristine fidelity, temporal consistency, and cinematic storytelling.
        </p>

        <!-- AI Video Capability Spec Strip -->
        <div
          class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-brand-dark/55"
          aria-label="AI video post-production capabilities"
        >
          <span>Text-to-Video Generation</span>
          <span class="h-3 w-px bg-brand-green/70" aria-hidden="true"></span>
          <span>AI Motion Upscaling 4K–8K</span>
          <span class="h-3 w-px bg-brand-green/70" aria-hidden="true"></span>
          <span>ACES Color Pipeline</span>
          <span class="h-3 w-px bg-brand-green/70" aria-hidden="true"></span>
          <span>24h Express Turnaround</span>
        </div>

        <a
          href={resolve("/services/video-editing")}
          class="mt-8 inline-flex items-center gap-3 border-b border-brand-green/50 pb-2 font-display text-sm font-normal tracking-[0.02em] text-brand-green transition-colors hover:border-brand-dark/40 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          Explore video editing & post-production
          <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>
    </div>
    <div class="ai-tool-stage site-shell" aria-hidden="true">
      <!-- 1. Runway -->
      <div class="ai-logo-orbit ai-logo-runway">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" class="size-6 fill-current" focusable="false">
            <path d="M5.5 3h4.9l4.1 7.1L18.6 3H22l-6.3 10.2V21h-3.6v-7.8L5.5 3zm1 18 5.4-7.3 2.5 2.6L10.6 21H6.5z" />
          </svg>
        </div>
        <span class="ai-logo-name">Runway Gen-4</span>
      </div>

      <!-- 2. Kling AI -->
      <div class="ai-logo-orbit ai-logo-kling">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" class="size-6 fill-current" focusable="false">
            <path d="M6 3h3.5v7.4L15.6 3h4.2l-6.9 8.1L20.4 21h-4.3l-5-6.6-1.6 1.8V21H6V3z" />
          </svg>
        </div>
        <span class="ai-logo-name">Kling AI</span>
      </div>

      <!-- 3. Google Flow -->
      <div class="ai-logo-orbit ai-logo-flow">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" class="size-6" focusable="false">
            <defs>
              <linearGradient id="flow-spark-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#4285f4" />
                <stop offset="100%" stop-color="#34a853" />
              </linearGradient>
            </defs>
            <path
              fill="url(#flow-spark-gradient)"
              d="M12 1.8l2.1 6.4a2.04 2.04 0 0 0 1.45 1.38l6.65 1.83-6.65 1.83a2.04 2.04 0 0 0-1.45 1.38L12 22.2l-2.1-7.58a2.04 2.04 0 0 0-1.45-1.38L3.8 11.41l6.65-1.83A2.04 2.04 0 0 0 11.9 8.2L12 1.8z"
            />
          </svg>
        </div>
        <span class="ai-logo-name">Google Flow</span>
      </div>

      <!-- 4. Luma Dream Machine -->
      <div class="ai-logo-orbit ai-logo-luma">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" class="size-6" focusable="false">
            <defs>
              <linearGradient id="luma-crescent-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ff5ca8" />
                <stop offset="55%" stop-color="#ff8a5c" />
                <stop offset="100%" stop-color="#ffd166" />
              </linearGradient>
            </defs>
            <path
              fill="url(#luma-crescent-gradient)"
              d="M16.4 2.6a10 10 0 1 0 5 12.2A8 8 0 0 1 16.4 2.6z"
            />
          </svg>
        </div>
        <span class="ai-logo-name ai-logo-name-above">Luma Dream Machine</span>
      </div>

      <!-- 5. Pika -->
      <div class="ai-logo-orbit ai-logo-pika">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" class="size-6 fill-current" focusable="false">
            <path d="M6 3h7.6a5 5 0 0 1 0 10H9.6v8H6V3zm3.6 3.2v3.6h4a1.8 1.8 0 0 0 0-3.6h-4z" />
          </svg>
        </div>
        <span class="ai-logo-name ai-logo-name-above">Pika</span>
      </div>

      <!-- 6. Hailuo AI · MiniMax -->
      <div class="ai-logo-orbit ai-logo-hailuo">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" class="size-6 fill-none stroke-current stroke-[2.2]" focusable="false">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12.5 8.5A4.5 4.5 0 0 0 8 13a6.8 6.8 0 0 0 6.8 6.8A9.2 9.2 0 0 0 9.6 4.9 11.5 11.5 0 0 1 21.3 12"
            />
          </svg>
        </div>
        <span class="ai-logo-name ai-logo-name-above">Hailuo AI</span>
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
    padding-bottom: 4rem;
  }

  .ai-panel::after {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: radial-gradient(
      ellipse 65% 50% at 50% 48%,
      color-mix(in srgb, var(--color-brand-green) 18%, transparent) 0%,
      color-mix(in srgb, var(--color-brand-green) 6%, transparent) 40%,
      transparent 68%
    );
    content: "";
    pointer-events: none;
  }

  .ai-panel-orbits {
    position: absolute;
    z-index: 0;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .ai-panel-orb {
    position: absolute;
    display: block;
    border-radius: 999px;
    will-change: transform;
  }

  .ai-panel-orb-shadow {
    top: 10%;
    right: -2rem;
    width: 11rem;
    height: 11rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    background: color-mix(in srgb, var(--color-brand-dark) 8%, transparent);
  }

  .ai-panel-orb-midtone {
    bottom: 16%;
    left: 3%;
    width: 7.5rem;
    height: 7.5rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-green) 20%, transparent);
    background: color-mix(in srgb, var(--color-brand-green) 9%, transparent);
  }

  .ai-panel-orb-highlight {
    right: 34%;
    bottom: clamp(5rem, 6vw, 7rem);
    width: 4rem;
    height: 4rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-green) 32%, transparent);
    background: color-mix(in srgb, var(--color-brand-green) 16%, transparent);
  }

  .ai-tool-stage {
    --logo-runway: #101010;
    --logo-hailuo: #5b8cff;
    --logo-google-blue: #4285f4;
    --logo-claude: #d97757;
    position: absolute;
    inset: 0;
    z-index: 2;
    width: 100%;
    max-width: none;
    pointer-events: none;
  }

  .ai-logo-orbit {
    position: absolute;
    pointer-events: auto;
  }

  .ai-logo-name {
    position: absolute;
    top: calc(100% + 0.55rem);
    left: 50%;
    padding: 0.32rem 0.62rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 18%, transparent);
    border-radius: 0.45rem;
    background: color-mix(in srgb, var(--color-brand-dark) 92%, transparent);
    box-shadow: 0 0.6rem 1.6rem
      color-mix(in srgb, var(--color-brand-dark) 18%, transparent);
    color: var(--color-brand-light);
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    white-space: nowrap;
    opacity: 0;
    transform: translate(-50%, 0.45rem);
    transition:
      opacity 200ms ease,
      transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
  }

  .ai-logo-name-above {
    top: auto;
    bottom: calc(100% + 0.55rem);
    transform: translate(-50%, -0.45rem);
  }

  .ai-logo-orbit:hover .ai-logo-name {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  .ai-logo-bubble {
    display: grid;
    width: 4.5rem;
    height: 4.5rem;
    place-items: center;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 88%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-brand-light) 66%, transparent);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, white 82%, transparent),
      0 1.25rem 3rem
        color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
    backdrop-filter: blur(1rem) saturate(125%);
    will-change: transform;
  }

  .ai-logo-bubble svg {
    width: 1.65rem;
    height: 1.65rem;
    fill: currentColor;
  }

  .ai-logo-runway {
    top: 13%;
    left: 8%;
    color: var(--logo-runway);
  }

  .ai-logo-kling {
    top: 6%;
    right: 20%;
    color: var(--color-brand-dark);
  }

  .ai-logo-flow {
    top: 40%;
    right: 4%;
    color: var(--logo-google-blue);
  }

  .ai-logo-luma {
    right: 8%;
    bottom: 18%;
  }

  .ai-logo-pika {
    bottom: 9%;
    left: 16%;
    color: var(--logo-runway);
  }

  .ai-logo-hailuo {
    bottom: clamp(4.5rem, 5.5vw, 6.5rem);
    left: 52%;
    color: var(--logo-hailuo);
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

  .ai-panel-content {
    position: relative;
    z-index: 3;
  }

  @media (max-width: 47.999rem) {
    .ai-visual-copy-inner {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    .ai-panel {
      padding-bottom: 2rem;
    }

    .ai-panel-orb-shadow,
    .ai-panel-orb-midtone {
      display: none;
    }

    .ai-panel-orb-highlight {
      right: 8%;
      bottom: 8%;
      width: 4rem;
      height: 4rem;
    }

    .ai-tool-stage {
      inset: 0;
    }

    .ai-logo-bubble {
      width: 4rem;
      height: 4rem;
    }

    .ai-logo-bubble svg {
      width: 1.55rem;
      height: 1.55rem;
    }

    .ai-logo-name {
      display: none;
    }

    .ai-logo-runway {
      top: auto;
      bottom: 1.5rem;
      left: 1rem;
    }

    .ai-logo-hailuo {
      top: auto;
      right: auto;
      bottom: 5rem;
      left: 45%;
    }

    .ai-logo-pika {
      right: 1rem;
      bottom: 1.5rem;
      left: auto;
    }

    .ai-logo-kling,
    .ai-logo-flow,
    .ai-logo-luma {
      display: none;
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
    .ai-logo-orbit,
    .ai-logo-bubble,
    .ai-panel-orb,
    .ai-panel-orbits,
    .ai-tool-stage {
      will-change: auto;
    }
  }
</style>
