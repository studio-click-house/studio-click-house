<script lang="ts">
  import { onMount } from "svelte";
  import { services } from "$lib/content/home";

  const serviceNames = services.map((service) => service.title);
  const loopItems = [...serviceNames, ...serviceNames];
  let marquee: HTMLElement;

  onMount(() => {
    const serviceLabels = marquee.querySelectorAll<HTMLElement>(
      ".marquee-service-name",
    );
    const centerObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-centered", entry.isIntersecting);
        }
      },
      {
        root: marquee,
        rootMargin: "0px -49.5% 0px -49.5%",
        threshold: 0,
      },
    );

    serviceLabels.forEach((label) => centerObserver.observe(label));

    return () => centerObserver.disconnect();
  });
</script>

<div
  bind:this={marquee}
  id="hero-services-marquee"
  role="region"
  aria-label="Studio services"
  class="hero-service-marquee absolute inset-x-0 bottom-0 z-20 overflow-hidden border-y border-brand-light/15 text-brand-light backdrop-blur-md"
>
  <div
    class="marquee-track flex w-max items-center py-4 will-change-transform sm:py-[1.1rem]"
  >
    {#each loopItems as item, index (`${item}-${index}`)}
      <span
        class="flex min-w-max items-center"
        aria-hidden={index >= serviceNames.length}
      >
        <span class="mx-5 size-1 bg-brand-green sm:mx-8" aria-hidden="true"
        ></span>
        <span
          class="marquee-service-name font-mono text-[0.62rem] font-medium uppercase tracking-[0.2em] text-brand-light/75 sm:text-[0.68rem]"
        >
          {item}
        </span>
      </span>
    {/each}
  </div>
</div>

<style>
  .hero-service-marquee {
    background: color-mix(in srgb, var(--color-brand-dark) 58%, transparent);
    box-shadow:
      inset 0 1px color-mix(in srgb, var(--color-brand-light) 8%, transparent),
      0 -1.5rem 4rem
        color-mix(in srgb, var(--color-brand-dark) 18%, transparent);
  }

  .marquee-track {
    animation: marquee 34s linear infinite;
  }

  .marquee-service-name {
    transition: color 220ms ease;
  }

  :global(.marquee-service-name.is-centered) {
    color: var(--color-brand-green);
  }

  #hero-services-marquee:hover .marquee-track {
    animation-play-state: paused;
  }

  @keyframes marquee {
    to {
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-track {
      animation: none;
    }

    .marquee-service-name {
      transition: none;
    }
  }
</style>
