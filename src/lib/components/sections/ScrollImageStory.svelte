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

      const { gsap } = runtime;
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
              y: 24,
              scale: 1.06,
              rotation: 6,
              duration: 1.9,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          },
        );

        return () => media.revert();
      }, section);
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
  class="relative overflow-hidden bg-brand-dark text-brand-dark"
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
    <div class="ai-visual-curve" aria-hidden="true">
      <div class="ai-visual-curve-grid site-shell"></div>
    </div>
    <div
      class="ai-visual-copy site-shell absolute inset-0 z-[3] flex items-center"
    >
      <div class="ai-visual-copy-inner max-w-3xl">
        <p
          class="mt-5 font-display text-5xl leading-[0.9] tracking-[-0.04em] text-brand-light sm:text-6xl lg:text-7xl"
        >
          <span class="ai-visual-title-line"><span>Professional</span></span>
          <span class="ai-visual-title-line"
            ><span class="italic text-brand-green"
              >AI image post-production.</span
            ></span
          >
        </p>
        <p
          class="ai-visual-copy-step mt-6 max-w-lg text-sm leading-relaxed text-brand-light/72 sm:text-base"
        >
          Accelerate your creative pipeline. We leverage AI to handle repeatable
          editing steps while our artists protect detail, lighting, and your
          brand's visual intent.
        </p>
      </div>
    </div>
  </figure>

  <div class="ai-panel relative z-10 bg-brand-light">
    <div class="ai-panel-curve" aria-hidden="true">
      <div class="ai-panel-curve-grid site-shell"></div>
    </div>
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
          AI-assisted image editing extends the workflow. It speeds up
          repeatable production steps such as selections, masking, cleanup, and
          controlled enhancement, giving our editors more time for the decisions
          that require visual judgment.
        </h2>
      </div>

      <div class="ai-panel-support w-full max-w-2xl text-left">
        <p
          class="mt-6 max-w-2xl text-sm leading-relaxed text-brand-dark/78 sm:text-base"
        >
          Every final frame still receives hands-on review for material, light,
          edge quality, consistency, and alignment with the intended visual
          direction.
        </p>
        <a
          href={resolve("/services/ai-retouch")}
          class="mt-9 inline-flex items-center gap-3 border-b border-brand-green/40 pb-2 font-display text-sm font-normal tracking-[0.02em] text-brand-green transition-colors hover:border-brand-dark/40 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          Explore AI image editing
          <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>
    </div>
    <div class="ai-tool-stage site-shell" aria-hidden="true">
      <div class="ai-logo-orbit ai-logo-openai">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.911 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.182a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.096 5.98 5.98 0 0 0 .511 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073Zm-9.022 12.608a4.476 4.476 0 0 1-2.877-1.041l.142-.08 4.778-2.759a.795.795 0 0 0 .393-.681V11.13l2.02 1.169a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494Zm-9.661-4.125a4.471 4.471 0 0 1-.534-3.014l.142.085 4.783 2.758a.771.771 0 0 0 .78 0l5.843-3.368v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.499 4.499 0 0 1-6.141-1.646ZM2.341 7.896a4.485 4.485 0 0 1 2.365-1.973V11.6a.766.766 0 0 0 .388.677l5.814 3.354-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872Zm16.596 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.104v-5.677a.79.79 0 0 0-.407-.667Zm2.011-3.023-.142-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.499 4.499 0 0 1 6.68 4.66ZM8.307 12.863l-2.02-1.164a.08.08 0 0 1-.038-.057V6.074a4.499 4.499 0 0 1 7.375-3.454l-.142.081-4.778 2.758a.795.795 0 0 0-.393.681Zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z"
            />
          </svg>
        </div>
      </div>
      <div class="ai-logo-orbit ai-logo-gemini">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" focusable="false">
            <defs>
              <linearGradient
                id="gemini-brand-gradient"
                x1="2"
                y1="22"
                x2="22"
                y2="2"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="var(--logo-gemini-blue)" />
                <stop offset="0.52" stop-color="var(--logo-gemini-violet)" />
                <stop offset="1" stop-color="var(--logo-gemini-pink)" />
              </linearGradient>
            </defs>
            <path
              fill="url(#gemini-brand-gradient)"
              d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"
            />
          </svg>
        </div>
        <div class="ai-logo-preview ai-logo-preview-below">
          <img
            src={previewMedia.perfumeStillLife.src}
            alt=""
            width={previewMedia.perfumeStillLife.width}
            height={previewMedia.perfumeStillLife.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <div class="ai-logo-orbit ai-logo-veo">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              class="google-blue"
              d="M21.6 12.227c0-.709-.064-1.391-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.509h3.232c1.891-1.741 2.981-4.305 2.981-7.35Z"
            />
            <path
              class="google-green"
              d="M12 22c2.7 0 4.964-.895 6.619-2.423l-3.232-2.509c-.895.6-2.041.955-3.387.955-2.605 0-4.809-1.759-5.596-4.123H3.064v2.591A9.997 9.997 0 0 0 12 22Z"
            />
            <path
              class="google-yellow"
              d="M6.404 13.9A6.018 6.018 0 0 1 6.09 12c0-.659.114-1.3.314-1.9V7.509h-3.34A10.002 10.002 0 0 0 2 12c0 1.614.386 3.141 1.064 4.491L6.404 13.9Z"
            />
            <path
              class="google-red"
              d="M12 5.977c1.468 0 2.786.505 3.827 1.496l2.864-2.864C16.959 2.995 14.695 2 12 2a9.997 9.997 0 0 0-8.936 5.509l3.34 2.591C7.191 7.736 9.395 5.977 12 5.977Z"
            />
          </svg>
        </div>
        <div class="ai-logo-preview ai-logo-preview-above">
          <img
            src={previewMedia.videoColorGrading.src}
            alt=""
            width={previewMedia.videoColorGrading.width}
            height={previewMedia.videoColorGrading.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <div class="ai-logo-orbit ai-logo-adobe">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="m13.966 22.624-1.69-4.281H8.122l3.892-9.144 5.662 13.425ZM8.884 1.376H0v21.248Zm15.116 0h-8.884L24 22.624Z"
            />
          </svg>
        </div>
      </div>
      <div class="ai-logo-orbit ai-logo-claude">
        <div class="ai-logo-bubble">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M18.36 5.64 5.64 18.36"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2.4"
            />
            <path
              fill="url(#canva-brand-gradient)"
              d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm-5.038 7.68c.754 0 1.337.549 1.405 1.2.069.583-.171 1.097-.822 1.406-.343.171-.48.172-.549.069-.034-.069 0-.137.069-.206.617-.514.617-.926.548-1.508-.034-.378-.308-.618-.583-.618-1.2 0-2.914 2.674-2.674 4.629.103.754.549 1.646 1.509 1.646.308 0 .65-.103.96-.24.5-.264.799-.47 1.097-.8-.073-.885.704-2.046 1.851-2.046.515 0 .926.205.96.583.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378-.035-.206-.24-.274-.446-.274-.72 0-1.131.994-1.029 1.611.035.275.172.549.447.549.205 0 .514-.31.617-.755.068-.308.343-.514.583-.514.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651 0 .069.034.171.17.171.092 0 .436-.18.777-.459.117-.59.253-1.298.253-1.357.034-.24.137-.48.617-.48.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994.172 0 .309.102.309.274 0 .103 0 .274-.069.446-.137.377-.309.96-.412 1.474 0 .137.035.274.207.274.171 0 .685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202 0-.411.035-.754.104-.994.068-.274.411-.514.617-.514.103 0 .205.069.205.171 0 .035 0 .103-.034.137-.137.446-.24.857-.24 1.269 0 .24.034.582.102.788 0 .034.035.069.07.069.068 0 .548-.445.89-1.028-.308-.206-.48-.549-.48-.96 0-.72.446-1.097.858-1.097.343 0 .617.24.617.72 0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24c.335-.425.83-.74 1.41-.74.48 0 .924.205.959.582.068.515-.378.618-.515.618-.138 0-.377-.035-.377-.172 0-.137.309-.068.274-.376-.034-.206-.24-.275-.446-.275-.686 0-1.13.891-1.028 1.611.034.275.171.583.445.583.206 0 .515-.308.652-.754.068-.274.343-.514.583-.514.103 0 .17.034.205.171 0 .069 0 .206-.137.652-.17.308-.171.48-.137.617.034.274.171.48.309.583.034.034.068.102.068.102 0 .069-.034.138-.137.138-.034 0-.068 0-.103-.035-.514-.205-.72-.548-.789-.891-.205.24-.445.377-.72.377-.445 0-.89-.411-.96-.926a1.609 1.609 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.896.896 0 0 1-.377.104c-.068 0-.171-.035-.205-.104-.095-.152-.156-.392-.193-.667-.481.527-1.145.805-1.453.805-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508-.308 0-.48-.172-.514-.412-.206.274-.445.412-.754.412-.352 0-.696-.24-.862-.593-.244.275-.523.553-.852.764-.48.309-1.028.549-1.68.549-.582 0-1.097-.309-1.371-.583-.412-.377-.651-.96-.686-1.509-.205-1.68.823-3.84 2.4-4.8.378-.205.755-.343 1.132-.343Z"
            />
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
    padding-bottom: 2rem;
    background-image: linear-gradient(
      to right,
      color-mix(in srgb, var(--color-brand-dark) 7%, transparent) 1px,
      transparent 1px
    );
    background-position: center top;
    background-size: clamp(7rem, 8vw, 10rem) 100%;
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
    bottom: 3%;
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

  .ai-logo-openai {
    top: 13%;
    left: 9%;
    color: var(--logo-openai);
  }

  .ai-logo-gemini {
    top: 6%;
    right: 22%;
    color: var(--logo-gemini-violet);
  }

  .ai-logo-veo {
    bottom: 9%;
    left: 19%;
    color: var(--logo-google-blue);
  }

  .ai-logo-adobe {
    right: 7%;
    bottom: 20%;
    color: var(--logo-adobe);
  }

  .ai-logo-claude {
    bottom: 3%;
    left: 53%;
    color: var(--logo-claude);
  }

  .ai-logo-claude .ai-logo-bubble svg path:last-of-type {
    display: none;
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

  .ai-panel-curve-grid {
    position: absolute;
    inset-block: 0;
    left: 50%;
    transform: translateX(-50%);
    background-image: linear-gradient(
      to right,
      color-mix(in srgb, var(--color-brand-dark) 7%, transparent) 1px,
      transparent 1px
    );
    background-position: center top;
    background-size: clamp(7rem, 8vw, 10rem) 100%;
  }

  .ai-visual-curve {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 7rem;
    background: var(--color-brand-paper);
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 160' preserveAspectRatio='none'%3E%3Cpath d='M0 0 H1600 V82 C1320 34 1060 30 760 58 C430 90 270 154 0 130 Z' fill='black'/%3E%3C/svg%3E");
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 160' preserveAspectRatio='none'%3E%3Cpath d='M0 0 H1600 V82 C1320 34 1060 30 760 58 C430 90 270 154 0 130 Z' fill='black'/%3E%3C/svg%3E");
    mask-position: center;
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
  }

  .ai-visual-curve-grid {
    position: absolute;
    inset-block: 0;
    left: 50%;
    transform: translateX(-50%);
    background-image: linear-gradient(
      to right,
      color-mix(in srgb, var(--color-brand-dark) 7%, transparent) 1px,
      transparent 1px
    );
    background-position: center top;
    background-size: clamp(7rem, 8vw, 10rem) 100%;
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
      background-size: 6rem 100%;
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

    .ai-logo-openai {
      top: auto;
      bottom: 1.5rem;
      left: 1rem;
    }

    .ai-logo-gemini {
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
    .ai-logo-claude {
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
