<script lang="ts">
  import { base, resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";

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
    <figcaption class="sr-only">AI image editing in motion.</figcaption>
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
              >video post-production.</span
            ></span
          >
        </p>
        <p
          class="ai-visual-copy-step mt-6 max-w-lg text-sm leading-relaxed text-brand-light/80 sm:text-base font-sans"
        >
          Accelerate your motion pipeline. From high-end color grading and commercial cutdowns to advanced visual enhancement, we deliver broadcast-ready video tailored for global campaigns.
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
          Professional video post-production accelerates the workflow — streamlining complex cutdowns, color balance, visual cleanup, and high-volume delivery with artisan oversight.
        </h2>
      </div>

      <div class="ai-panel-support w-full max-w-2xl text-left">
        <p
          class="mt-4 max-w-2xl text-sm leading-relaxed text-brand-dark/78 sm:text-base"
        >
          Every sequence is reviewed frame-by-frame by experienced colorists and senior editors to ensure pristine fidelity, temporal consistency, and cinematic storytelling.
        </p>

        <!-- Video Production Capabilities Badges -->
        <div class="mt-6 flex flex-wrap items-center gap-2.5">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-brand-dark/10 shadow-2xs text-xs font-medium text-brand-dark/80">
            <span class="size-1.5 rounded-full bg-brand-green"></span> 4K / 8K Cinema Master
          </span>
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-brand-dark/10 shadow-2xs text-xs font-medium text-brand-dark/80">
            <span class="size-1.5 rounded-full bg-brand-green"></span> ACES Color Pipeline
          </span>
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-brand-dark/10 shadow-2xs text-xs font-medium text-brand-dark/80">
            <span class="size-1.5 rounded-full bg-brand-green"></span> AI Motion Upscaling
          </span>
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-brand-dark/10 shadow-2xs text-xs font-medium text-brand-dark/80">
            <span class="size-1.5 rounded-full bg-brand-green"></span> 24h Express Turnaround
          </span>
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
      <!-- 1. DaVinci Resolve Studio -->
      <div class="ai-logo-orbit ai-logo-resolve">
        <div class="ai-logo-bubble" title="DaVinci Resolve Studio · Color Grading">
          <svg viewBox="0 0 24 24" class="size-6 text-brand-dark fill-current" focusable="false">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V13h6.93A8 8 0 0 1 13 19.93zm-2 0A8 8 0 0 1 4.07 13H11zm-6.93-9A8 8 0 0 1 11 4.07V11zm9-6.93A8 8 0 0 1 19.93 11H13z" />
          </svg>
        </div>
        <div class="ai-logo-preview ai-logo-preview-below">
          <img
            src={previewMedia.videoColorGrading.src}
            alt="DaVinci Resolve Color Grade"
            width={previewMedia.videoColorGrading.width}
            height={previewMedia.videoColorGrading.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <!-- 2. Adobe Premiere Pro & After Effects -->
      <div class="ai-logo-orbit ai-logo-adobe">
        <div class="ai-logo-bubble" title="Adobe Premiere & After Effects">
          <svg viewBox="0 0 24 24" class="size-6 fill-red-600" focusable="false">
            <path d="m13.966 22.624-1.69-4.281H8.122l3.892-9.144 5.662 13.425ZM8.884 1.376H0v21.248Zm15.116 0h-8.884L24 22.624Z" />
          </svg>
        </div>
        <div class="ai-logo-preview ai-logo-preview-below">
          <img
            src={previewMedia.editingWorkspace.src}
            alt="Adobe Premiere Timeline"
            width={previewMedia.editingWorkspace.width}
            height={previewMedia.editingWorkspace.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <!-- 3. Google Veo -->
      <div class="ai-logo-orbit ai-logo-veo">
        <div class="ai-logo-bubble" title="Google Veo · Generative Video">
          <svg viewBox="0 0 24 24" class="size-6" focusable="false">
            <path class="google-blue" d="M21.6 12.227c0-.709-.064-1.391-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.509h3.232c1.891-1.741 2.981-4.305 2.981-7.35Z" />
            <path class="google-green" d="M12 22c2.7 0 4.964-.895 6.619-2.423l-3.232-2.509c-.895.6-2.041.955-3.387.955-2.605 0-4.809-1.759-5.596-4.123H3.064v2.591A9.997 9.997 0 0 0 12 22Z" />
            <path class="google-yellow" d="M6.404 13.9A6.018 6.018 0 0 1 6.09 12c0-.659.114-1.3.314-1.9V7.509h-3.34A10.002 10.002 0 0 0 2 12c0 1.614.386 3.141 1.064 4.491L6.404 13.9Z" />
            <path class="google-red" d="M12 5.977c1.468 0 2.786.505 3.827 1.496l2.864-2.864C16.959 2.995 14.695 2 12 2a9.997 9.997 0 0 0-8.936 5.509l3.34 2.591C7.191 7.736 9.395 5.977 12 5.977Z" />
          </svg>
        </div>
        <div class="ai-logo-preview ai-logo-preview-above">
          <img
            src={previewMedia.redStudioPortrait.src}
            alt="AI Color & Motion"
            width={previewMedia.redStudioPortrait.width}
            height={previewMedia.redStudioPortrait.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <!-- 4. OpenAI Sora -->
      <div class="ai-logo-orbit ai-logo-openai">
        <div class="ai-logo-bubble" title="OpenAI Sora · Neural Motion">
          <svg viewBox="0 0 24 24" class="size-6 fill-current text-brand-dark" focusable="false">
            <path
              d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.911 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.182a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.096 5.98 5.98 0 0 0 .511 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073Zm-9.022 12.608a4.476 4.476 0 0 1-2.877-1.041l.142-.08 4.778-2.759a.795.795 0 0 0 .393-.681V11.13l2.02 1.169a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494Zm-9.661-4.125a4.471 4.471 0 0 1-.534-3.014l.142.085 4.783 2.758a.771.771 0 0 0 .78 0l5.843-3.368v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.499 4.499 0 0 1-6.141-1.646ZM2.341 7.896a4.485 4.485 0 0 1 2.365-1.973V11.6a.766.766 0 0 0 .388.677l5.814 3.354-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872Zm16.596 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.104v-5.677a.79.79 0 0 0-.407-.667Zm2.011-3.023-.142-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.499 4.499 0 0 1 6.68 4.66ZM8.307 12.863l-2.02-1.164a.08.08 0 0 1-.038-.057V6.074a4.499 4.499 0 0 1 7.375-3.454l-.142.081-4.778 2.758a.795.795 0 0 0-.393.681Zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z"
            />
          </svg>
        </div>
        <div class="ai-logo-preview ai-logo-preview-above">
          <img
            src={previewMedia.perfumeStillLife.src}
            alt="AI Cinema Render"
            width={previewMedia.perfumeStillLife.width}
            height={previewMedia.perfumeStillLife.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <!-- 5. Topaz Video AI / Neural Clean -->
      <div class="ai-logo-orbit ai-logo-topaz">
        <div class="ai-logo-bubble" title="Topaz Video AI · Upscaling & Denoise">
          <svg viewBox="0 0 24 24" class="size-6 text-brand-green fill-none stroke-current stroke-2" focusable="false">
            <path stroke-linecap="round" stroke-linejoin="round" d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
          </svg>
        </div>
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
    --logo-openai: #101010;
    --logo-gemini-blue: #4e82ee;
    --logo-gemini-violet: #886cdb;
    --logo-gemini-pink: #d965b8;
    --logo-google-blue: #4285f4;
    --logo-google-green: #34a853;
    --logo-google-yellow: #fbbc05;
    --logo-google-red: #ea4335;
    --logo-adobe: #ff0000;
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

  .ai-logo-preview {
    position: absolute;
    z-index: 1;
    left: 0;
    width: clamp(9rem, 13vw, 13rem);
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 76%, transparent);
    border-radius: 0.5rem;
    background: var(--color-brand-light);
    box-shadow: 0 1.25rem 3rem
      color-mix(in srgb, var(--color-brand-dark) 16%, transparent);
    opacity: 0;
    transform: translateY(0.75rem) scale(0.94);
    transform-origin: center;
    transition:
      opacity 220ms ease,
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .ai-logo-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ai-logo-preview-below {
    top: calc(100% + 0.9rem);
  }

  .ai-logo-preview-above {
    bottom: calc(100% + 0.9rem);
    transform: translateY(-0.75rem) scale(0.94);
  }

  .ai-logo-orbit:hover .ai-logo-preview {
    opacity: 1;
    transform: translateY(0) scale(1);
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

  .ai-logo-resolve {
    top: 13%;
    left: 8%;
    color: var(--color-brand-green);
  }

  .ai-logo-adobe {
    top: 6%;
    right: 20%;
    color: #e63946;
  }

  .ai-logo-veo {
    bottom: 9%;
    left: 17%;
    color: var(--logo-google-blue);
  }

  .ai-logo-openai {
    right: 8%;
    bottom: 18%;
    color: var(--logo-openai);
  }

  .ai-logo-topaz {
    bottom: clamp(4.5rem, 5.5vw, 6.5rem);
    left: 52%;
    color: var(--color-brand-green);
  }

  .google-blue {
    fill: var(--logo-google-blue);
  }

  .google-green {
    fill: var(--logo-google-green);
  }

  .google-yellow {
    fill: var(--logo-google-yellow);
  }

  .google-red {
    fill: var(--logo-google-red);
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

    .ai-logo-preview {
      display: none;
    }

    .ai-logo-resolve {
      top: auto;
      bottom: 1.5rem;
      left: 1rem;
    }

    .ai-logo-topaz {
      top: auto;
      right: auto;
      bottom: 5rem;
      left: 45%;
    }

    .ai-logo-veo {
      right: 1rem;
      bottom: 1.5rem;
      left: auto;
    }

    .ai-logo-adobe,
    .ai-logo-openai {
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
