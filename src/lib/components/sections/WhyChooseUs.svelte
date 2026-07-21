<script lang="ts">
  import { onMount } from "svelte";
  import {
    ArrowUpRight,
    Layers3,
    Route,
    ShieldCheck,
    UsersRound,
  } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { registerScrollTrigger } from "$lib/animations/gsap";

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
  let assuranceRows: HTMLElement[] = [];

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !pathLine || !pathSignal) return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: ".trust-copy",
                  start: "top 82%",
                  once: true,
                },
              })
              .from(".trust-copy > *", {
                x: -38,
                y: 30,
                autoAlpha: 0,
                duration: 0.82,
                stagger: 0.11,
                ease: "power3.out",
              });

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "center 50%",
                scrub: 0.6,
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
                  start: "top 84%",
                  once: true,
                },
              })
              .from(".trust-copy > *", {
                y: 28,
                autoAlpha: 0,
                duration: 0.64,
                stagger: 0.075,
                ease: "power3.out",
              })
              .from(
                assuranceRows,
                {
                  y: 24,
                  autoAlpha: 0,
                  duration: 0.62,
                  stagger: 0.1,
                  ease: "power3.out",
                },
                "-=0.34",
              );
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
    <div class="trust-copy">
      <h2 id="why-trust-us-title">
        Built for visual production that has to stay consistent.
      </h2>
      <p>
        Human judgment, clear checkpoints, and a workflow that can meet the way
        your team already works.
      </p>
      <a href={resolve("/contact")} class="trust-link group">
        Discuss a project
        <ArrowUpRight
          size={16}
          strokeWidth={1.6}
          class="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </a>
    </div>

    <div class="assurance-system">
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
    gap: clamp(3rem, 7vw, 8rem);
  }

  .trust-copy {
    align-self: start;
  }

  .trust-copy h2 {
    max-width: 13ch;
    font-family: var(--font-sans);
    font-size: clamp(2.25rem, 4vw, 4.15rem);
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.052em;
  }

  .trust-copy > p {
    max-width: 28rem;
    margin-top: 1.4rem;
    font-size: 0.9rem;
    line-height: 1.65;
    color: color-mix(in srgb, var(--color-brand-dark) 56%, transparent);
  }

  .trust-link {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    margin-top: 2rem;
    border-bottom: 1px solid var(--color-brand-green);
    padding-bottom: 0.4rem;
    color: var(--color-brand-green);
    font-size: 0.82rem;
    font-weight: 600;
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
      grid-template-columns: minmax(18rem, 0.72fr) minmax(28rem, 1.28fr);
    }

    .trust-copy {
      position: sticky;
      top: 9rem;
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
    .assurance-icon {
      transform: none !important;
      opacity: 1 !important;
      transition: none;
    }
  }
</style>
