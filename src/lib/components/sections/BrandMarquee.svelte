<script lang="ts">
  import { onMount } from "svelte";
  import { services } from "$lib/content/home";
  import { _ } from "svelte-i18n";

  const loopServices = [...services, ...services];
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
    {#each loopServices as service, index (`${service.slug}-${index}`)}
      <span
        class="flex min-w-max items-center"
        aria-hidden={index >= services.length}
      >
        <span class="mx-5 size-[3px] rounded-full bg-brand-light/30 sm:mx-8" aria-hidden="true"
        ></span>
        <span
          class="marquee-service-name font-mono text-[0.62rem] font-medium uppercase tracking-[0.2em] text-brand-light/75 sm:text-[0.68rem]"
        >
          {$_(`home.services.${service.slug}.title`) || service.title}
          <span class="marquee-center-probe" aria-hidden="true"></span>
        </span>
      </span>
    {/each}
  </div>
</div>

<style>
  .hero-service-marquee {
    background: rgba(12, 11, 10, 0.45);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
  }

  .marquee-track {
    animation: marquee-slide 42s linear infinite;
  }

  .hero-service-marquee:hover .marquee-track {
    animation-play-state: paused;
  }

  .marquee-service-name {
    position: relative;
    display: inline-flex;
    align-items: center;
    transition:
      color 300ms cubic-bezier(0.16, 1, 0.3, 1),
      text-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .marquee-center-probe {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  :global(.marquee-service-name.is-centered),
  .hero-service-marquee:hover .marquee-service-name:hover {
    color: var(--color-brand-green);
    transform: scale(1.05);
    text-shadow: 0 0 16px rgba(126, 166, 65, 0.45);
  }

  @keyframes marquee-slide {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-track {
      animation: none;
    }
  }
</style>
