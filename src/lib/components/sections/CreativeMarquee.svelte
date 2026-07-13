<script lang="ts">
  import { creativeMarqueeLines } from "$lib/content/home";
</script>

<section
  id="creative-marquee"
  aria-labelledby="creative-marquee-title"
  class="overflow-hidden bg-brand-green py-8 text-brand-dark sm:py-12"
>
  <h2 id="creative-marquee-title" class="sr-only">Studio disciplines</h2>
  {#each creativeMarqueeLines as line, index (line)}
    <div
      class:reverse={index === 1}
      class="marquee-line flex w-max whitespace-nowrap will-change-transform"
    >
      {#each [0, 1, 2, 3] as repeatIndex (repeatIndex)}<span
          class="px-6 font-display text-[clamp(3rem,8vw,8rem)] italic leading-[0.92] tracking-[-0.035em] sm:px-10"
          >{line}</span
        >{/each}
    </div>
  {/each}
</section>

<style>
  .marquee-line {
    animation: kinetic 34s linear infinite;
  }
  .marquee-line.reverse {
    animation-direction: reverse;
    animation-duration: 42s;
    color: var(--color-brand-light);
  }
  @keyframes kinetic {
    to {
      transform: translateX(-25%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .marquee-line {
      width: 100%;
      overflow: hidden;
      animation: none;
    }
    .marquee-line :global(span:not(:first-child)) {
      display: none;
    }
  }
</style>
