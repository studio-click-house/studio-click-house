<script lang="ts">
  import { base, resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  interface OrbitCard {
    id: string;
    title: string;
    category: string;
    media: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  }

  const orbitCards: OrbitCard[] = [
    {
      id: "orbit-1",
      title: "Fashion Editorial Retouching",
      category: "Campaign",
      media: {
        src: "https://images.pexels.com/photos/17173186/pexels-photo-17173186.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Editorial fashion portrait",
        width: 1200,
        height: 1600,
      },
    },
    {
      id: "orbit-2",
      title: "DaVinci Skin Tone Grading",
      category: "Video Suite",
      media: {
        src: "https://images.pexels.com/photos/325111/pexels-photo-325111.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Video color grading panel",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "orbit-3",
      title: "3D CGI Product Modeling",
      category: "3D Studio",
      media: {
        src: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "3D render interface",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "orbit-4",
      title: "High-Key Luxury Perfume",
      category: "Still Life",
      media: {
        src: "https://images.pexels.com/photos/18302102/pexels-photo-18302102.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Perfume still life shot",
        width: 1200,
        height: 1600,
      },
    },
    {
      id: "orbit-5",
      title: "Fine Jewelry Macro Retouch",
      category: "Luxury",
      media: {
        src: "https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Pearl jewelry closeup",
        width: 1200,
        height: 1600,
      },
    },
    {
      id: "orbit-6",
      title: "Automotive & Industrial CGI",
      category: "CGI Studio",
      media: {
        src: "https://images.pexels.com/photos/37848029/pexels-photo-37848029.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Editing workspace monitors",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "orbit-7",
      title: "Studio Collective Collaboration",
      category: "Production",
      media: {
        src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Creative team reviewing work",
        width: 1200,
        height: 800,
      },
    },
  ];

  let section: HTMLElement;
  let panelRef: HTMLElement;
  let storyVideo: HTMLVideoElement;
  let centerTextRef: HTMLElement;

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
          storyVideo?.load();
        }
        void storyVideo?.play().catch(() => undefined);
      } else {
        storyVideo?.pause();
      }
    };

    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        videoVisible = entry?.isIntersecting ?? false;
        syncVideoPlayback();
      },
      { rootMargin: "240px 0px", threshold: 0.08 },
    );

    if (storyVideo) {
      videoObserver.observe(storyVideo);
    }
    reducedMotion.addEventListener("change", syncVideoPlayback);

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          // 1. Curved video headline reveal
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
              ".ai-visual-title-line > span",
              {
                yPercent: 114,
                rotation: 2,
                transformOrigin: "left bottom",
                duration: 0.55,
                stagger: 0.1,
                ease: "power3.out",
              },
              0,
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

          // 2. Radial Orbit Cards Animation inside .ai-panel
          if (panelRef) {
            const cards = gsap.utils.toArray<HTMLElement>(".orbit-card-item");
            const totalCards = cards.length;

            // Fanned Arc Initial Setup (Fills center gracefully, non-empty initial view)
            cards.forEach((card, index) => {
              const fanOffset = (index - Math.floor(totalCards / 2)) * 32;
              const fanRotation = (index - Math.floor(totalCards / 2)) * 4.5;
              const fanY = Math.abs(index - Math.floor(totalCards / 2)) * 4;

              gsap.set(card, {
                x: fanOffset,
                y: fanY,
                rotation: fanRotation,
                scale: 0.9,
                zIndex: totalCards - index,
              });
            });

            // Center text starts gently visible so page never looks blank
            if (centerTextRef) {
              gsap.set(centerTextRef, { autoAlpha: 0.45, scale: 0.95, y: 10 });
            }

            // FAST Scrubbed Timeline
            const orbitTl = gsap.timeline({
              scrollTrigger: {
                trigger: panelRef,
                start: "top top",
                end: "+=120%",
                pin: true,
                scrub: 0.5,
                anticipatePin: 1,
              },
            });

            cards.forEach((card, index) => {
              const width = window.innerWidth;
              let radius = 480;
              if (width < 768) {
                radius = 230;
              } else if (width < 1024) {
                radius = 350;
              } else if (width >= 1400) {
                radius = 520;
              }

              const angle = (index / totalCards) * (2 * Math.PI) - Math.PI / 2;
              const targetX = Math.round(Math.cos(angle) * radius);
              const targetY = Math.round(Math.sin(angle) * (radius * 0.82));
              const targetRotation = Math.round((angle * (180 / Math.PI)) * 0.1);

              orbitTl.to(
                card,
                {
                  x: targetX,
                  y: targetY,
                  rotation: targetRotation,
                  scale: width >= 768 ? 1 : 0.82,
                  ease: "power2.out",
                  duration: 1,
                },
                0,
              );
            });

            if (centerTextRef) {
              orbitTl.to(
                centerTextRef,
                {
                  autoAlpha: 1,
                  scale: 1,
                  y: 0,
                  ease: "power2.out",
                  duration: 0.4,
                },
                0.15,
              );
            }
          }
        });

        // Gentle floating animation for background glass bubbles
        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const bubbleDrift = [
              { x: 10, y: -8, scale: 1.02, rotation: 1.2, duration: 5.8 },
              { x: -8, y: 10, scale: 0.98, rotation: -1.1, duration: 6.4 },
              { x: 9, y: 7, scale: 1.02, rotation: 1, duration: 5.2 },
              { x: -7, y: -9, scale: 0.98, rotation: -1.2, duration: 6.8 },
              { x: 8, y: 6, scale: 1.02, rotation: 1.1, duration: 5.6 },
            ];

            gsap.utils
              .toArray<HTMLElement>(".ai-logo-bubble")
              .forEach((bubble, index) => {
                const drift = bubbleDrift[index] ?? bubbleDrift[0];

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

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      videoObserver.disconnect();
      reducedMotion.removeEventListener("change", syncVideoPlayback);
      storyVideo?.pause();
      context?.revert();
    };
  });
</script>

<section
  id="scroll-image-story"
  bind:this={section}
  aria-labelledby="scroll-image-story-title"
  class="relative overflow-x-clip bg-brand-light text-brand-dark"
>
  <!-- Curved Video Showcase -->
  <figure
    class="ai-visual relative h-[26rem] overflow-hidden sm:h-[34rem] lg:h-[42rem]"
  >
    <figcaption class="sr-only">Visual post-production in motion.</figcaption>
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
              >image post-production.</span
            ></span
          >
        </p>
        <p
          class="ai-visual-copy-step mt-6 max-w-lg text-sm leading-relaxed text-brand-light/72 sm:text-base"
        >
          Accelerate your creative pipeline. We handle photo retouching, video color grading, and 3D CGI rendering while our artists protect detail, lighting, and your brand's visual intent.
        </p>
      </div>
    </div>
  </figure>

  <!-- Organic Curved Panel containing the Radial Orbit Showcase -->
  <div
    bind:this={panelRef}
    class="ai-panel relative z-10 min-h-screen overflow-visible bg-brand-light pt-8 pb-16 text-brand-dark"
  >
    <!-- Curved SVG Mask at Top of Panel -->
    <div class="ai-panel-curve" aria-hidden="true">
      <div class="ai-panel-curve-grid site-shell"></div>
    </div>

    <!-- Ambient Gradient Orbs -->
    <div class="ai-panel-orbits pointer-events-none" aria-hidden="true">
      <span class="ai-panel-orb ai-panel-orb-shadow"></span>
      <span class="ai-panel-orb ai-panel-orb-midtone"></span>
      <span class="ai-panel-orb ai-panel-orb-highlight"></span>
    </div>

    <!-- Translucent Floating Glass Bubbles -->
    <div class="ai-tool-stage site-shell" aria-hidden="true">
      <div class="ai-logo-orbit ai-logo-openai">
        <div class="ai-logo-bubble"></div>
      </div>
      <div class="ai-logo-orbit ai-logo-gemini">
        <div class="ai-logo-bubble"></div>
      </div>
      <div class="ai-logo-orbit ai-logo-veo">
        <div class="ai-logo-bubble"></div>
      </div>
      <div class="ai-logo-orbit ai-logo-adobe">
        <div class="ai-logo-bubble"></div>
      </div>
      <div class="ai-logo-orbit ai-logo-claude">
        <div class="ai-logo-bubble"></div>
      </div>
    </div>

    <!-- Top Connection Badge Connecting Curved Video to Orbit Showcase -->
    <div class="relative z-20 flex w-full justify-center pt-2">
      <div class="inline-flex items-center gap-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-brand-dark/50">
        <span class="h-px w-8 bg-brand-dark/20"></span>
        <span>Studio Work Showcase</span>
        <span class="h-px w-8 bg-brand-dark/20"></span>
      </div>
    </div>

    <!-- Pinned Content Outer Frame -->
    <div class="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 pt-4">
      <!-- Center Orbit Container -->
      <div class="relative flex h-[34rem] w-full max-w-7xl items-center justify-center sm:h-[40rem] lg:h-[44rem]">
        
        <!-- Fanned Arc Initial Stack -> 360 Ring Cards -->
        {#each orbitCards as card, index (card.id)}
          <div
            class="orbit-card-item absolute aspect-[4/5] w-44 overflow-hidden rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl sm:w-56 md:w-60 lg:w-64"
          >
            <figure class="relative h-full w-full overflow-hidden rounded-2xl bg-brand-dark">
              <img
                src={card.media.src}
                alt={card.media.alt}
                width={card.media.width}
                height={card.media.height}
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </figure>
          </div>
        {/each}

        <!-- Center Text Reveal (Starts at 45% Opacity Preview) -->
        <div
          bind:this={centerTextRef}
          class="relative z-30 max-w-sm px-6 text-center sm:max-w-md md:max-w-lg"
        >
          <h2
            id="scroll-image-story-title"
            class="font-display text-3xl font-light leading-tight tracking-[-0.035em] text-brand-dark sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Post-production <br />
            <span class="italic text-brand-green">at full momentum.</span>
          </h2>

          <p class="mt-4 text-xs leading-relaxed text-brand-dark/75 sm:text-sm md:text-base">
            From high-end editorial skin retouching to complex 3D CGI rendering, our dual-shift Dhaka studio turns creative concepts into flawless campaign assets.
          </p>

          <div class="mt-6 flex items-center justify-center gap-4">
            <a
              href="/portfolio"
              class="inline-flex items-center rounded-lg bg-brand-dark px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-light transition-all hover:bg-brand-dark/90 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-brand-dark"
            >
              Explore Work →
            </a>
          </div>
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

  .ai-panel::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    height: clamp(12rem, 25vw, 22rem);
    background: radial-gradient(
      ellipse 62% 100% at 50% 100%,
      color-mix(in srgb, var(--color-brand-green) 20%, transparent),
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

  .ai-logo-bubble {
    display: grid;
    width: 4.5rem;
    height: 4.5rem;
    place-items: center;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-brand-dark) 4%, transparent);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, white 82%, transparent),
      0 1.25rem 3rem
        color-mix(in srgb, var(--color-brand-dark) 6%, transparent);
    backdrop-filter: blur(1rem) saturate(125%);
    will-change: transform;
  }

  .ai-logo-openai {
    top: 13%;
    left: 9%;
  }

  .ai-logo-gemini {
    top: 6%;
    right: 22%;
  }

  .ai-logo-veo {
    bottom: 9%;
    left: 19%;
  }

  .ai-logo-adobe {
    right: 7%;
    bottom: 20%;
  }

  .ai-logo-claude {
    bottom: clamp(5rem, 6vw, 7rem);
    left: 53%;
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
    .ai-logo-bubble,
    .ai-panel-orb,
    .ai-panel-orbits,
    .ai-tool-stage {
      will-change: auto;
    }
  }
</style>
