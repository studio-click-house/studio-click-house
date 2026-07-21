<script lang="ts">
  import type { ClientLogoItem } from "$lib/types/content";

  let { items = [] }: { items: ClientLogoItem[] } = $props();

  let itemsPerRow = $derived(Math.ceil(items.length / 3));
  let logoRows = $derived([
    items.slice(0, itemsPerRow),
    items.slice(itemsPerRow, itemsPerRow * 2),
    items.slice(itemsPerRow * 2),
  ]);
</script>

<section
  id="creative-marquee"
  aria-labelledby="creative-marquee-title"
  class="client-wall relative -mt-px overflow-x-clip bg-brand-light py-32 text-brand-dark sm:py-40"
>
  <div class="site-shell relative z-10 mb-10 text-center">
    <div>
      <h2
        id="creative-marquee-title"
        class="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.88] tracking-[-0.045em]"
      >
        Our Clients
      </h2>
    </div>
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
                  class="logo-slot flex h-20 w-[12rem] shrink-0 items-center justify-center border-r border-brand-dark/10 px-6 sm:h-24 sm:w-[15rem]"
                >
                  {#if client.logoSrc && client.width && client.height}
                    <img
                      src={client.logoSrc}
                      alt={client.label}
                      width={client.width}
                      height={client.height}
                      loading="lazy"
                      class={`object-contain opacity-55 grayscale ${
                        [
                          "julie-benedetto-photography",
                          "maddy-pollard",
                          "manning-cartell",
                        ].includes(client.id)
                          ? "max-h-20 max-w-[11rem] scale-[1.15] sm:max-h-24 sm:max-w-[13rem]"
                          : "max-h-14 max-w-[9.5rem] sm:max-h-16 sm:max-w-[12rem]"
                      }`}
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
    background: radial-gradient(
      ellipse 62% 100% at 50% 0%,
      color-mix(in srgb, var(--color-brand-green) 20%, transparent),
      transparent 68%
    );
    content: "";
    pointer-events: none;
  }

  .client-wall::after {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: clamp(9rem, 18vw, 15rem);
    background-image: linear-gradient(
      to right,
      color-mix(in srgb, var(--color-brand-dark) 7%, transparent) 1px,
      transparent 1px
    );
    background-position: center top;
    background-size: clamp(7rem, 8vw, 10rem) 100%;
    content: "";
    mask-image: linear-gradient(to bottom, black, transparent);
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
