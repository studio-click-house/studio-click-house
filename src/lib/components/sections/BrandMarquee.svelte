<script lang="ts">
  import { onMount } from "svelte";
  import { services } from "$lib/content/home";

  const serviceNames = services.map((service) => service.title);
  const loopItems = [...serviceNames, ...serviceNames];
  let marquee: HTMLElement;

  onMount(() => {
    const centerProbes = marquee.querySelectorAll<HTMLElement>(
      ".marquee-center-probe",
    );
    const centerObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const serviceLabel = entry.target.closest<HTMLElement>(
            ".marquee-service-name",
          );
          serviceLabel?.classList.toggle("is-centered", entry.isIntersecting);
        }
      },
      {
        root: marquee,
        rootMargin: "0px -48.5% 0px -48.5%",
        threshold: 0,
      },
    );

    centerProbes.forEach((probe) => centerObserver.observe(probe));

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
          <span class="marquee-center-probe" aria-hidden="true"></span>
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
    position: relative;
    transition: color 220ms ease;
  }

  .marquee-center-probe {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1px;
    height: 1px;
    pointer-events: none;
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
