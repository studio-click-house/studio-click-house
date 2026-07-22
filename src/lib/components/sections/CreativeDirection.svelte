<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";

  const directionPasses = [
    {
      number: "01",
      name: "Frame",
      accent: "one",
      statement: "Give the eye one clear place to land.",
      detail:
        "Composition, scale, and negative space establish the hierarchy before retouching begins.",
    },
    {
      number: "02",
      name: "Light",
      accent: "light",
      statement: "Protect the light that made the image believable.",
      detail:
        "Tone and contrast are aligned without flattening texture, reflection, or material character.",
    },
    {
      number: "03",
      name: "Finish",
      accent: "personality.",
      statement: "Remove distraction, not personality.",
      detail:
        "Every final correction supports the subject, the channel, and the wider visual system.",
    },
  ];

  let section: HTMLElement;
  let scrollField: HTMLElement;
  let imagePlate: HTMLElement;
  let imageMedia: HTMLImageElement;
  let cropFrame: HTMLElement;
  let progressLine: HTMLElement;
  let titleWords: HTMLElement[] = [];
  let passPanels: HTMLElement[] = [];
  let passMarkers: HTMLElement[] = [];
  let proofLabel: HTMLElement;

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (
        !active ||
        !runtime ||
        !section ||
        !scrollField ||
        !imagePlate ||
        !imageMedia ||
        !cropFrame ||
        !progressLine ||
        !proofLabel
      )
        return;

      const { gsap, ScrollTrigger } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(titleWords, {
            yPercent: 112,
            rotate: 2,
            duration: 1.05,
            stagger: 0.09,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          });
        });

        media.add(
          "(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)",
          () => {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: scrollField,
                start: "top 70%",
                end: "bottom 35%",
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            });

            timeline
              .fromTo(
                imagePlate,
                { xPercent: 5, yPercent: 4, rotation: 1.5, scale: 0.94 },
                {
                  xPercent: -2,
                  yPercent: -3,
                  rotation: -0.5,
                  scale: 1,
                  duration: 1,
                  ease: "none",
                },
                0,
              )
              .fromTo(
                imageMedia,
                { xPercent: -3, yPercent: 6, scale: 1.12 },
                {
                  xPercent: 2,
                  yPercent: -6,
                  scale: 1.02,
                  duration: 1,
                  ease: "none",
                },
                0,
              )
              .fromTo(
                cropFrame,
                { scale: 0.82, rotation: -1.5 },
                { scale: 1, rotation: 0, duration: 1, ease: "none" },
                0,
              )
              .fromTo(
                progressLine,
                { scaleY: 0 },
                { scaleY: 1, duration: 1, ease: "none" },
                0,
              );

            passPanels.forEach((panel, index) => {
              const eyebrow = panel.querySelector(".pass-eyebrow");
              const words = panel.querySelectorAll(".pass-word");
              const detail = panel.querySelector(".pass-detail");

              const typeTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: panel,
                  start: "top 84%",
                  end: "center 56%",
                  scrub: 0.5,
                },
              });

              if (eyebrow) {
                typeTimeline.fromTo(
                  eyebrow,
                  { x: -18, autoAlpha: 0.25 },
                  { x: 0, autoAlpha: 1, duration: 0.2, ease: "none" },
                  0,
                );
              }

              typeTimeline.fromTo(
                words,
                { yPercent: 115, rotation: 2, autoAlpha: 0.1 },
                {
                  yPercent: 0,
                  rotation: 0,
                  autoAlpha: 1,
                  duration: 0.58,
                  stagger: 0.065,
                  ease: "none",
                },
                0.08,
              );

              if (detail) {
                typeTimeline.fromTo(
                  detail,
                  { y: 18, autoAlpha: 0.2 },
                  { y: 0, autoAlpha: 1, duration: 0.3, ease: "none" },
                  0.48,
                );
              }

              const marker = passMarkers[index];
              if (!marker) return;

              gsap.fromTo(
                marker,
                { scaleX: 0.2, opacity: 0.3 },
                {
                  scaleX: 1,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel,
                    start: "top 78%",
                    end: "top 52%",
                    scrub: 0.4,
                  },
                },
              );
            });

            gsap.fromTo(
              proofLabel,
              { autoAlpha: 0, yPercent: 55 },
              {
                autoAlpha: 1,
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: passPanels[passPanels.length - 1],
                  start: "center 65%",
                  end: "bottom 42%",
                  scrub: 0.45,
                },
              },
            );

            ScrollTrigger.refresh();
          },
        );

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="creative-direction"
  bind:this={section}
  aria-labelledby="creative-direction-title"
  class="direction-section overflow-clip bg-brand-light text-brand-dark"
>
  <header
    class="direction-header site-shell grid gap-8 lg:grid-cols-12 lg:items-end"
  >
    <div class="lg:col-span-3 lg:pb-3">
      <p class="eyebrow text-brand-green">Creative direction</p>
      <p
        class="mt-4 max-w-[17rem] font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-brand-dark/45"
      >
        One image system<br />Three deliberate passes
      </p>
    </div>

    <h2
      id="creative-direction-title"
      class="direction-title lg:col-span-9 font-display tracking-[-0.052em]"
    >
      <span class="title-line"
        ><span bind:this={titleWords[0]}>The work is decided</span></span
      >
      <span class="title-line title-line-indent"
        ><span bind:this={titleWords[1]}>before it is finished.</span></span
      >
    </h2>
  </header>

  <div bind:this={scrollField} class="direction-scroll-field">
    <div class="direction-sticky">
      <div class="direction-stage site-shell">
        <div class="direction-index" aria-hidden="true">
          <span
            class="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-brand-dark/45"
            >Decision path</span
          >
          <div class="index-track">
            <span bind:this={progressLine} class="index-progress"></span>
          </div>
          <span class="font-mono text-[0.55rem] text-brand-dark/40">03</span>
        </div>

        <div class="direction-copy">
          {#each directionPasses as pass, index (pass.name)}
            <article bind:this={passPanels[index]} class="pass-panel">
              <p
                class="pass-eyebrow font-mono text-[0.58rem] uppercase tracking-[0.17em] text-brand-green font-semibold"
              >
                {pass.number} / {pass.name}
              </p>
              <h3
                class="mt-5 max-w-xl font-display text-[clamp(2.8rem,4.8vw,5.6rem)] leading-[0.9] tracking-[-0.04em]"
              >
                {#each pass.statement.split(" ") as word, wordIndex (`${pass.name}-${wordIndex}`)}
                  <span class="pass-word-mask"
                    ><span
                      class="pass-word"
                      class:text-brand-green={word === pass.accent}>{word}</span
                    ></span
                  >
                {/each}
              </h3>
              <p
                class="pass-detail mt-6 max-w-md text-sm leading-relaxed text-brand-dark/75 sm:text-base"
              >
                {pass.detail}
              </p>
            </article>
          {/each}
        </div>

        <div class="direction-visual">
          <div bind:this={cropFrame} class="crop-frame" aria-hidden="true">
            <span class="crop-corner crop-corner-tl"></span>
            <span class="crop-corner crop-corner-tr"></span>
            <span class="crop-corner crop-corner-bl"></span>
            <span class="crop-corner crop-corner-br"></span>
            <span class="focus-line focus-line-x"></span>
            <span class="focus-line focus-line-y"></span>
          </div>

          <figure bind:this={imagePlate} class="image-plate">
            <img
              bind:this={imageMedia}
              src={previewMedia.perfumeStillLife.src}
              alt={previewMedia.perfumeStillLife.alt}
              width={previewMedia.perfumeStillLife.width}
              height={previewMedia.perfumeStillLife.height}
              loading="lazy"
              class="direction-image"
            />
            <figcaption class="image-caption">
              <span>Source → final study</span>
              <span>Material / light / finish</span>
            </figcaption>
          </figure>

          <p
            bind:this={proofLabel}
            class="proof-label font-display italic"
            aria-hidden="true"
          >
            Proof
          </p>
        </div>

        <div class="pass-rail" aria-label="Creative direction stages">
          {#each directionPasses as pass, index (pass.name)}
            <div class="pass-marker-row">
              <span bind:this={passMarkers[index]} class="pass-marker"></span>
              <span
                class="font-mono text-[0.54rem] uppercase tracking-[0.15em] text-brand-dark/50"
                >{pass.name}</span
              >
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <div class="direction-handoff site-shell">
    <p
      class="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-brand-light/42"
    >
      Direction established
    </p>
    <p class="handoff-statement font-display italic">
      Now see every decision hold.
    </p>
    <span class="handoff-arrow text-brand-green" aria-hidden="true">↓</span>
  </div>
</section>

<style>
  .direction-section {
    padding-top: clamp(5rem, 8vw, 9rem);
  }

  .direction-header {
    position: relative;
    z-index: 2;
  }

  .direction-title {
    font-size: clamp(3.4rem, 7.4vw, 8.6rem);
    line-height: 0.84;
    text-wrap: balance;
  }

  .title-line {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }

  .title-line > span {
    display: block;
    transform-origin: left bottom;
  }

  .title-line-indent {
    color: var(--color-brand-green);
  }

  .direction-scroll-field {
    margin-top: clamp(4rem, 7vw, 8rem);
  }

  .direction-sticky {
    min-height: 100svh;
  }

  .direction-stage {
    position: relative;
    display: grid;
    gap: 3rem;
    padding-block: 2rem 4rem;
  }

  .direction-index,
  .pass-rail {
    display: none;
  }

  .direction-copy {
    display: grid;
    gap: 3rem;
  }

  .pass-panel {
    border-top: 1px solid
      color-mix(in srgb, var(--color-brand-light) 18%, transparent);
    padding-top: 1.5rem;
  }

  .pass-word-mask {
    display: inline-block;
    overflow: hidden;
    margin-right: 0.18em;
    padding-bottom: 0.08em;
    vertical-align: bottom;
  }

  .pass-word {
    display: block;
    transform-origin: left bottom;
    will-change: transform, opacity;
  }

  .direction-visual {
    position: relative;
    min-height: 38rem;
  }

  .image-plate {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 15%, transparent);
    background: var(--color-brand-light);
  }

  .direction-image {
    position: absolute;
    inset: -8%;
    width: 116%;
    height: 116%;
    object-fit: cover;
    will-change: transform;
  }

  .image-caption {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    border-top: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 15%, transparent);
    background: color-mix(in srgb, var(--color-brand-light) 85%, transparent);
    padding: 0.9rem 1rem;
    font-family: var(--font-mono);
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.13em;
    color: color-mix(in srgb, var(--color-brand-dark) 70%, transparent);
    backdrop-filter: blur(8px);
  }

  .crop-frame {
    position: absolute;
    inset: 8%;
    z-index: 2;
    pointer-events: none;
  }

  .crop-corner {
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    border-color: var(--color-brand-green);
  }

  .crop-corner-tl {
    left: 0;
    top: 0;
    border-left: 1px solid;
    border-top: 1px solid;
  }
  .crop-corner-tr {
    right: 0;
    top: 0;
    border-right: 1px solid;
    border-top: 1px solid;
  }
  .crop-corner-bl {
    left: 0;
    bottom: 0;
    border-left: 1px solid;
    border-bottom: 1px solid;
  }
  .crop-corner-br {
    right: 0;
    bottom: 0;
    border-right: 1px solid;
    border-bottom: 1px solid;
  }

  .focus-line {
    position: absolute;
    background: color-mix(in srgb, var(--color-brand-green) 55%, transparent);
  }

  .focus-line-x {
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
  }
  .focus-line-y {
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
  }

  .proof-label {
    position: absolute;
    right: -0.03em;
    bottom: -0.06em;
    z-index: 3;
    font-size: clamp(6rem, 22vw, 13rem);
    line-height: 0.7;
    color: var(--color-brand-dark);
    opacity: 0.08;
    pointer-events: none;
  }

  .direction-handoff {
    position: relative;
    display: grid;
    justify-items: center;
    gap: 1.5rem;
    border-top: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 15%, transparent);
    padding-block: 4rem 0;
    text-align: center;
  }

  .direction-handoff::after {
    width: 1px;
    height: clamp(2.5rem, 4vw, 4rem);
    background: var(--color-brand-green);
    content: "";
  }

  .handoff-statement {
    max-width: 14ch;
    font-size: clamp(2.8rem, 6vw, 6.5rem);
    line-height: 0.9;
    letter-spacing: -0.04em;
  }

  .handoff-arrow {
    font-size: 2rem;
  }

  @media (min-width: 640px) {
    .title-line-indent {
      padding-left: 10%;
    }
    .direction-visual {
      min-height: 48rem;
    }
  }

  @media (min-width: 1024px) and (min-height: 680px) {
    .direction-sticky {
      min-height: 0;
    }

    .direction-stage {
      grid-template-columns:
        minmax(2rem, 0.45fr) minmax(17rem, 4fr) minmax(24rem, 6fr)
        minmax(7rem, 1fr);
      align-items: start;
      gap: clamp(1.5rem, 3vw, 4rem);
      padding-block: 0 clamp(3rem, 7vw, 7rem);
    }

    .direction-index {
      position: sticky;
      top: 16svh;
      display: flex;
      height: min(68svh, 42rem);
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      writing-mode: vertical-rl;
    }

    .index-track {
      position: relative;
      width: 1px;
      flex: 1;
      overflow: hidden;
      background: color-mix(in srgb, var(--color-brand-dark) 14%, transparent);
    }

    .index-progress {
      position: absolute;
      inset: 0;
      display: block;
      transform-origin: top;
      background: var(--color-brand-green);
      will-change: transform;
    }

    .direction-copy {
      display: grid;
      gap: 0;
    }

    .pass-panel {
      position: relative;
      display: flex;
      min-height: 46svh;
      flex-direction: column;
      justify-content: center;
      border-top: 1px solid
        color-mix(in srgb, var(--color-brand-dark) 18%, transparent);
      padding-block: clamp(3rem, 7vh, 6rem);
      will-change: transform, opacity;
    }

    .pass-panel:last-child {
      border-bottom: 1px solid
        color-mix(in srgb, var(--color-brand-dark) 18%, transparent);
    }

    .direction-visual {
      position: sticky;
      top: 10svh;
      min-height: 0;
      height: min(80svh, 52rem);
    }

    .image-plate,
    .crop-frame {
      will-change: transform, opacity;
    }

    .pass-rail {
      position: sticky;
      top: 34svh;
      display: grid;
      align-content: center;
      gap: 1.4rem;
    }

    .pass-marker-row {
      display: grid;
      gap: 0.7rem;
    }

    .pass-marker {
      display: block;
      width: 100%;
      height: 1px;
      transform-origin: left;
      background: var(--color-brand-green);
      will-change: transform, opacity;
    }

    .proof-label {
      font-size: clamp(7rem, 11vw, 12rem);
    }
    .direction-handoff {
      padding-top: 2.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .title-line > span,
    .direction-image,
    .image-plate,
    .crop-frame,
    .pass-panel,
    .pass-marker,
    .proof-label {
      transform: none !important;
      opacity: 1 !important;
    }
  }
</style>
