<script lang="ts">
  import { clientLogoItems } from "$lib/content/home";

  const logoRows = [
    clientLogoItems.slice(0, 5),
    clientLogoItems.slice(5, 10),
    clientLogoItems.slice(10, 15),
  ];
</script>

<section
  id="creative-marquee"
  aria-labelledby="creative-marquee-title"
  class="client-wall relative overflow-hidden bg-brand-light py-24 text-brand-dark sm:py-32"
>
  <div
    class="site-shell relative z-10 mb-16 grid gap-6 lg:grid-cols-12 lg:items-end"
  >
    <div class="lg:col-span-8">
      <p class="eyebrow text-brand-green">Client marks · awaiting approval</p>
      <h2
        id="creative-marquee-title"
        class="mt-7 max-w-4xl font-display text-[clamp(3.3rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.045em]"
      >
        Made to hold the brands behind the work.
      </h2>
    </div>
    <p
      data-scroll-copy
      class="max-w-sm text-sm leading-relaxed text-brand-dark/55 lg:col-span-4 lg:justify-self-end"
    >
      These numbered positions are ready for approved client artwork. Real SVG
      or PNG marks replace each slot without changing the layout.
    </p>
  </div>

  <div class="logo-rows relative z-10 border-y border-brand-dark/10">
    {#each logoRows as row, rowIndex (`logo-row-${rowIndex}`)}
      <div
        class="logo-row overflow-hidden border-b border-brand-dark/10 last:border-b-0"
      >
        <div
          class:reverse={rowIndex === 1}
          class="logo-track flex w-max will-change-transform"
        >
          {#each [0, 1] as repeatIndex (repeatIndex)}
            <div class="flex" aria-hidden={repeatIndex === 1}>
              {#each row as client (client.id)}
                <div
                  class="logo-slot flex h-28 w-[15rem] shrink-0 items-center justify-center border-r border-brand-dark/10 px-8 sm:h-36 sm:w-[20rem]"
                >
                  {#if client.logoSrc && client.width && client.height}
                    <img
                      src={client.logoSrc}
                      alt={client.label}
                      width={client.width}
                      height={client.height}
                      loading="lazy"
                      class="max-h-12 max-w-[10rem] object-contain opacity-55 grayscale sm:max-w-[13rem]"
                    />
                  {:else}
                    <span class="placeholder-mark" aria-label={client.label}>
                      <span>{client.shortLabel}</span>
                      <small>Approved mark</small>
                    </span>
                  {/if}
                </div>
              {/each}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .client-wall::before {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 50% 8%,
        rgb(126 166 65 / 0.16),
        transparent 38%
      ),
      linear-gradient(90deg, rgb(51 46 45 / 0.025) 1px, transparent 1px);
    background-size:
      auto,
      8rem 100%;
    content: "";
    pointer-events: none;
  }

  .logo-track {
    animation: logo-drift 42s linear infinite;
  }

  .logo-track.reverse {
    animation-direction: reverse;
    animation-duration: 48s;
  }

  .placeholder-mark {
    display: grid;
    gap: 0.35rem;
    color: rgb(51 46 45 / 0.42);
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 2.4vw, 2.6rem);
    font-style: italic;
    line-height: 0.85;
    text-align: center;
    letter-spacing: -0.04em;
    transition:
      color 250ms ease,
      transform 250ms ease;
  }

  .placeholder-mark small {
    font-family: var(--font-mono);
    font-size: 0.52rem;
    font-style: normal;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .logo-slot:hover .placeholder-mark {
    color: var(--color-brand-green);
    transform: translateY(-2px);
  }

  @keyframes logo-drift {
    to {
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .logo-track {
      animation: none;
    }
  }
</style>
