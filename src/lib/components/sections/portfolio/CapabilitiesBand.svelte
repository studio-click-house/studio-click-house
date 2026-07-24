<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { PortfolioStat } from "$lib/types/portfolio";

  interface Props {
    capabilities: string[];
    stats: PortfolioStat[];
  }

  let { capabilities, stats }: Props = $props();

  let section: HTMLElement;
  let statValues: HTMLElement[] = [];

  const marqueeText = $derived(capabilities.join(" · "));
  const repeatedMarquee = $derived(`${marqueeText} · ${marqueeText} · ${marqueeText} · `);

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          statValues.forEach((el, index) => {
            const stat = stats[index];
            if (!el || !stat) return;

            gsap.from(el, {
              textContent: 0,
              duration: 2,
              ease: "power2.out",
              snap: { textContent: 1 },
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              onUpdate: function () {
                el.textContent = `${Math.round(Number(el.textContent))}`;
              },
            });
          });

          gsap.from(".stat-card-anim", {
            autoAlpha: 0,
            y: 32,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".capabilities-stats",
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          });
        });

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
  id="portfolio-capabilities"
  bind:this={section}
  aria-labelledby="capabilities-title"
  class="capabilities-section"
>
  <h2 id="capabilities-title" class="sr-only">Studio capabilities</h2>

  <div class="capabilities-marquee" aria-hidden="true">
    <div class="capabilities-marquee-track">
      <span class="capabilities-marquee-text">{repeatedMarquee}</span>
      <span class="capabilities-marquee-text">{repeatedMarquee}</span>
    </div>
  </div>

  <div class="capabilities-marquee capabilities-marquee--reverse" aria-hidden="true">
    <div class="capabilities-marquee-track capabilities-marquee-track--reverse">
      <span class="capabilities-marquee-text">{repeatedMarquee}</span>
      <span class="capabilities-marquee-text">{repeatedMarquee}</span>
    </div>
  </div>

  <div class="capabilities-stats site-shell">
    {#each stats as stat, index (stat.label)}
      <div class="stat-card stat-card-anim">
        <div class="stat-value-row">
          <span
            bind:this={statValues[index]}
            class="stat-value"
          >
            {stat.value}
          </span>
          <span class="stat-suffix">{stat.suffix}</span>
        </div>
        <p class="stat-label">{stat.label}</p>
      </div>
    {/each}
  </div>
</section>

<style>
  .capabilities-section {
    position: relative;
    background: var(--color-brand-paper);
    color: var(--color-brand-dark);
    overflow: clip;
    padding-block: clamp(4rem, 7vw, 7rem);
  }

  .capabilities-marquee {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    padding-block: 0.75rem;
    border-block: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
  }

  .capabilities-marquee--reverse {
    margin-top: -1px;
  }

  .capabilities-marquee-track {
    display: inline-flex;
    animation: marquee-scroll 45s linear infinite;
  }

  .capabilities-marquee-track--reverse {
    animation-direction: reverse;
    animation-duration: 55s;
  }

  .capabilities-marquee-text {
    flex: none;
    padding-right: 0.5rem;
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 5vw, 5.5rem);
    font-style: italic;
    line-height: 1.1;
    letter-spacing: -0.04em;
    color: color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
  }

  @keyframes marquee-scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .capabilities-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 1.5rem;
    margin-top: clamp(3rem, 5vw, 5rem);
  }

  .stat-card {
    padding: clamp(1.5rem, 2.5vw, 2.5rem);
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    background: var(--color-brand-light);
  }

  .stat-value-row {
    display: flex;
    align-items: baseline;
    gap: 0.15em;
  }

  .stat-value {
    font-family: var(--font-display);
    font-size: clamp(3rem, 5vw, 4.5rem);
    line-height: 0.9;
    letter-spacing: -0.04em;
    color: var(--color-brand-dark);
  }

  .stat-suffix {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 2.5vw, 2.25rem);
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--color-brand-green);
  }

  .stat-label {
    margin-top: 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: color-mix(in srgb, var(--color-brand-dark) 55%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    .capabilities-marquee-track,
    .capabilities-marquee-track--reverse {
      animation: none;
    }

    .stat-card-anim {
      opacity: 1 !important;
      transform: none !important;
    }
  }
</style>
