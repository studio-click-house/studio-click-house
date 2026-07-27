<script lang="ts">
  import { onMount } from "svelte";
  import { Layers3, Route, ShieldCheck, UsersRound } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { aboutOrbitCards } from "$lib/content/about-orbit";

  const assurances = [
    {
      title: "Specialist routing",
      description:
        "Each brief moves to the people whose craft matches the image, format, and finishing requirement. Your project is matched with specialists in high-end retouching, color correction, or product masking to ensure optimal quality.",
      icon: UsersRound,
    },
    {
      title: "Reference-led batches",
      description:
        "An agreed first frame and shared finishing rules keep larger sets visually connected. We establish strict visual alignment parameters from the start so that thousands of images maintain consistent grading, lighting, and detail.",
      icon: Layers3,
    },
    {
      title: "Review checkpoints",
      description:
        "Quality review happens within the workflow, before final files are organised for handoff. Dedicated QC leads inspect every asset individually to verify dimensions, naming structures, and reference-matching prior to delivery.",
      icon: ShieldCheck,
    },
    {
      title: "Workflow fit",
      description:
        "The studio can work with established naming, review, transfer, and delivery conventions. We seamlessly integrate with your existing file management systems, custom metadata requirements, and server structures.",
      icon: Route,
    },
  ] as const;

  let section: HTMLElement;
  let pathLine: HTMLElement;
  let pathSignal: HTMLElement;
  let landingStage: HTMLElement;
  let landingCards: HTMLElement[] = [];
  let assuranceRows: HTMLElement[] = [];

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (
        !active ||
        !runtime ||
        !section ||
        !landingStage ||
        !pathLine ||
        !pathSignal
      )
        return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: section,
                  start: "top 98%",
                  end: "top 30%",
                  scrub: 0.72,
                  refreshPriority: 90,
                  invalidateOnRefresh: true,
                },
              })
              .from(landingStage, {
                x: () => Math.min(window.innerWidth * 0.12, 170),
                y: () => -Math.min(window.innerHeight * 0.32, 280),
                scale: 0.86,
                rotation: 3,
                duration: 0.9,
                ease: "power2.out",
              })
              .from(
                landingCards,
                {
                  x: (index) => 52 + index * 3,
                  y: (index) => -150 - index * 8,
                  rotation: (index) => (index % 2 === 0 ? 7 : -6),
                  scale: 0.76,
                  autoAlpha: 0,
                  duration: 0.76,
                  stagger: 0.018,
                  ease: "power2.out",
                },
                0,
              );

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "center 50%",
                scrub: 0.6,
                refreshPriority: 89,
                invalidateOnRefresh: true,
              },
            });

            timeline
              .fromTo(
                pathLine,
                { scaleY: 0 },
                { scaleY: 1, duration: 0.78, ease: "none" },
                0.08,
              )
              .from(
                assuranceRows,
                {
                  x: 62,
                  y: 26,
                  autoAlpha: 0.1,
                  duration: 0.46,
                  stagger: 0.12,
                  ease: "power3.out",
                },
                0.08,
              )
              .from(
                ".assurance-icon",
                {
                  scale: 0.72,
                  rotation: -8,
                  autoAlpha: 0,
                  duration: 0.28,
                  stagger: 0.14,
                },
                0.2,
              )
              .fromTo(
                pathSignal,
                { y: 0 },
                {
                  y: () =>
                    Math.max(
                      0,
                      pathLine.clientHeight - pathSignal.offsetHeight,
                    ),
                  duration: 1,
                  ease: "none",
                },
                0.12,
              );
          },
        );

        media.add(
          "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: section,
                  start: "top 94%",
                  end: "top 42%",
                  scrub: 0.6,
                  refreshPriority: 90,
                  invalidateOnRefresh: true,
                },
              })
              .from(landingStage, {
                x: 46,
                y: -180,
                scale: 0.84,
                rotation: 3,
                autoAlpha: 0,
                duration: 0.9,
                ease: "power2.out",
              })
              .from(
                landingCards,
                {
                  y: (index) => -90 - index * 5,
                  rotation: (index) => (index % 2 === 0 ? 6 : -5),
                  autoAlpha: 0,
                  duration: 0.72,
                  stagger: 0.018,
                  ease: "power2.out",
                },
                0,
              );

            gsap.from(assuranceRows, {
              y: 24,
              autoAlpha: 0,
              duration: 0.62,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".assurance-list",
                start: "top 86%",
                once: true,
                refreshPriority: 89,
              },
            });
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
  id="why-trust-us"
  bind:this={section}
  aria-labelledby="why-trust-us-title"
  class="trust-section overflow-hidden bg-brand-paper text-brand-dark"
>
  <div class="site-shell trust-layout">
    <div class="trust-visual" aria-hidden="true">
      <div bind:this={landingStage} class="landing-stage">
        <div class="landing-halo"></div>
        {#each aboutOrbitCards as card, index (card.id)}
          <div bind:this={landingCards[index]} class="landing-card-shell">
            <figure class="landing-card">
              <img
                src={card.media.src}
                alt=""
                width={card.media.width}
                height={card.media.height}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        {/each}
      </div>
    </div>

    <div class="assurance-system">
      <h2 id="why-trust-us-title" class="sr-only">
        Why choose Studio Click House
      </h2>
      <div bind:this={pathLine} class="quality-path" aria-hidden="true">
        <span bind:this={pathSignal} class="quality-signal"></span>
      </div>

      <div class="assurance-list">
        {#each assurances as assurance, index (assurance.title)}
          {@const Icon = assurance.icon}
          <article bind:this={assuranceRows[index]} class="assurance-row">
            <div class="assurance-icon">
              <Icon size={21} strokeWidth={1.45} aria-hidden="true" />
            </div>
            <div>
              <h3>{assurance.title}</h3>
              <p>{assurance.description}</p>
            </div>
            <span class="assurance-index"
              >{String(index + 1).padStart(2, "0")}</span
            >
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .trust-section {
    position: relative;
    z-index: 1;
    display: flex;
    min-height: calc(100dvh - 4.35rem);
    align-items: center;
    border-top: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    padding-block: clamp(4rem, 6vw, 6.5rem);
  }

  .trust-section::before {
    position: absolute;
    right: -15rem;
    bottom: -20rem;
    width: 44rem;
    height: 44rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-brand-green) 12%, transparent);
    filter: blur(9rem);
    content: "";
    pointer-events: none;
  }

  .trust-layout {
    position: relative;
    z-index: 1;
    display: grid;
    width: 100%;
    gap: clamp(3rem, 7vw, 8rem);
  }

  .trust-visual {
    min-width: 0;
  }

  .landing-stage {
    position: relative;
    width: min(100%, 33rem);
    height: clamp(27rem, 45vw, 38rem);
    margin-inline: auto;
    transform-origin: 42% 32%;
    will-change: transform, opacity;
  }

  .landing-halo {
    position: absolute;
    top: 50%;
    left: 48%;
    width: 68%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-brand-green) 12%, transparent);
    filter: blur(4rem);
    transform: translate(-50%, -50%);
  }

  .landing-card-shell {
    position: absolute;
    width: clamp(6.5rem, 12vw, 10.5rem);
    aspect-ratio: 4 / 5;
    will-change: transform, opacity;
  }

  .landing-card {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-paper) 54%, transparent);
    border-radius: 0.65rem;
    background: var(--color-brand-dark);
    box-shadow: 0 1.5rem 3.5rem
      color-mix(in srgb, var(--color-brand-dark) 20%, transparent);
  }

  .landing-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .landing-card-shell:nth-of-type(2) {
    top: 5%;
    left: 9%;
    z-index: 2;
    transform: rotate(-12deg) scale(0.84);
  }

  .landing-card-shell:nth-of-type(3) {
    top: 2%;
    right: 7%;
    z-index: 1;
    transform: rotate(9deg) scale(0.78);
  }

  .landing-card-shell:nth-of-type(4) {
    top: 32%;
    left: 0;
    z-index: 4;
    transform: rotate(-7deg) scale(0.92);
  }

  .landing-card-shell:nth-of-type(5) {
    top: 29%;
    right: 0;
    z-index: 3;
    transform: rotate(11deg) scale(0.86);
  }

  .landing-card-shell:nth-of-type(6) {
    bottom: 3%;
    left: 10%;
    z-index: 5;
    transform: rotate(-5deg) scale(0.8);
  }

  .landing-card-shell:nth-of-type(7) {
    right: 7%;
    bottom: 1%;
    z-index: 4;
    transform: rotate(8deg) scale(0.76);
  }

  .landing-card-shell:nth-of-type(8) {
    top: 20%;
    left: 34%;
    z-index: 8;
    transform: rotate(2deg) scale(1.04);
  }

  .landing-card-shell:nth-of-type(9) {
    bottom: 8%;
    left: 38%;
    z-index: 7;
    transform: rotate(-2deg) scale(0.86);
  }

  .assurance-system {
    position: relative;
  }

  .quality-path {
    display: none;
  }

  .assurance-list {
    display: grid;
    border-top: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 14%, transparent);
  }

  .assurance-row {
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 1rem;
    align-items: start;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 14%, transparent);
    padding-block: 1.4rem;
    transition:
      background-color 260ms ease,
      padding 260ms ease;
  }

  .assurance-row:hover {
    background: color-mix(in srgb, var(--color-brand-green) 6%, transparent);
    padding-inline: 0.75rem;
  }

  .assurance-icon {
    display: grid;
    width: 2.7rem;
    height: 2.7rem;
    place-items: center;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-green) 18%, transparent);
    border-radius: 0.55rem;
    background: color-mix(in srgb, var(--color-brand-green) 6%, transparent);
    color: color-mix(
      in srgb,
      var(--color-brand-green) 72%,
      var(--color-brand-dark)
    );
    will-change: transform, opacity;
  }

  .assurance-index {
    font-family: var(--font-mono);
    padding-top: 0.2rem;
    font-size: 0.48rem;
    letter-spacing: 0.12em;
    color: var(--color-brand-green);
  }

  .assurance-row h3 {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .assurance-row div > p:last-child {
    max-width: 36rem;
    margin-top: 0.65rem;
    font-size: 0.78rem;
    line-height: 1.6;
    color: color-mix(in srgb, var(--color-brand-dark) 52%, transparent);
  }

  @media (min-width: 768px) {
    .trust-layout {
      grid-template-columns: minmax(21rem, 0.82fr) minmax(28rem, 1.18fr);
    }

    .trust-visual {
      position: sticky;
      top: 6.5rem;
      align-self: start;
    }

    .assurance-system {
      padding-left: 3rem;
    }

    .quality-path {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      display: block;
      width: 1px;
      transform-origin: top;
      background: color-mix(in srgb, var(--color-brand-green) 26%, transparent);
      will-change: transform;
    }

    .quality-signal {
      position: absolute;
      top: 0;
      left: -0.3rem;
      width: 0.65rem;
      height: 0.65rem;
      border-radius: 50%;
      background: color-mix(
        in srgb,
        var(--color-brand-green) 68%,
        var(--color-brand-paper)
      );
      box-shadow: 0 0 1.4rem
        color-mix(in srgb, var(--color-brand-green) 24%, transparent);
      will-change: transform;
    }

    .assurance-row {
      min-height: 9.25rem;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 1.35rem;
      padding-block: 1.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .quality-path {
      transform: scaleY(1) !important;
    }

    .quality-signal {
      display: none;
    }

    .assurance-row,
    .assurance-icon,
    .landing-stage,
    .landing-card-shell {
      transform: none !important;
      opacity: 1 !important;
      transition: none;
    }

    .landing-stage,
    .landing-card-shell {
      will-change: auto;
    }
  }
</style>
