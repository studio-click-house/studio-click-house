<script lang="ts">
  import { brandPlaceholders } from "$lib/content/home";
  const loopItems = [...brandPlaceholders, ...brandPlaceholders];
</script>

<section
  id="brand-marquee"
  aria-labelledby="brand-marquee-title"
  class="overflow-hidden border-y border-brand-dark/15 bg-brand-light py-7"
>
  <div class="site-shell mb-6 flex items-center justify-between gap-6">
    <h2 id="brand-marquee-title" class="eyebrow">Collaboration marks</h2>
    <p
      class="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-brand-dark/45"
    >
      Placeholder data · awaiting approval
    </p>
  </div>
  <div
    class="marquee-track flex w-max items-center will-change-transform"
    aria-label="Placeholder client marks"
  >
    {#each loopItems as item, index (`${item}-${index}`)}
      <span
        aria-hidden={index >= brandPlaceholders.length}
        class="flex min-w-56 items-center justify-center border-r border-brand-dark/15 px-10 py-4 font-display text-2xl italic text-brand-dark/45 sm:min-w-72 sm:text-3xl"
        >{item}</span
      >
    {/each}
  </div>
</section>

<style>
  .marquee-track {
    animation: marquee 28s linear infinite;
  }
  #brand-marquee:hover .marquee-track {
    animation-play-state: paused;
  }
  @keyframes marquee {
    to {
      transform: translateX(-50%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .marquee-track {
      width: 100%;
      flex-wrap: wrap;
      animation: none;
    }
    .marquee-track :global(span:nth-child(n + 6)) {
      display: none;
    }
  }
</style>
