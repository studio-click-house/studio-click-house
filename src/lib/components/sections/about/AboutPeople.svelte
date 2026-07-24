<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData } from "$lib/types/about";

  let { people } = $props<{ people: AboutPageData["people"] }>();
  let sectionRef: HTMLElement;

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionRef) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            ".people-header-reveal",
            { autoAlpha: 0, y: 30 },
            {
              scrollTrigger: { trigger: sectionRef, start: "top 80%" },
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
            },
          );

          gsap.fromTo(
            ".people-contact-frame",
            { autoAlpha: 0, y: 28, scale: 0.98 },
            {
              scrollTrigger: {
                trigger: ".people-contact-sheet",
                start: "top 82%",
              },
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.1,
              ease: "power3.out",
            },
          );
        });
      }, sectionRef);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="our-people"
  aria-label="Our People and Studio Team"
  bind:this={sectionRef}
  class="section-space relative border-y border-brand-dark/15 bg-brand-paper py-24 md:py-32"
>
  <div class="site-shell">
    <div
      class="mb-12 grid gap-7 pt-5 lg:grid-cols-12 lg:items-end md:mb-16"
    >
      <h2
        class="people-header-reveal max-w-[11ch] font-display text-[clamp(3rem,5vw,6rem)] leading-[0.86] tracking-[-0.045em] text-brand-dark lg:col-span-8"
      >
        {people.heading}
      </h2>
      <p
        class="people-header-reveal max-w-md text-base leading-relaxed text-brand-dark/70 lg:col-span-3 lg:pb-2 md:text-lg"
      >
        {people.subheading}
      </p>
    </div>

    <div class="people-contact-sheet grid gap-8 md:grid-cols-12 md:gap-6">
      <figure
        class="people-contact-frame group relative md:col-span-7 lg:col-span-6"
      >
        <div
          class="relative aspect-[5/4] overflow-hidden rounded-2xl bg-brand-light"
        >
          <img
            src={people.heroCollectiveMedia.src}
            alt={people.heroCollectiveMedia.alt}
            width={people.heroCollectiveMedia.width}
            height={people.heroCollectiveMedia.height}
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.025]"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-brand-dark/55 via-transparent to-transparent"
          ></div>
          <div
            class="absolute left-4 top-4 flex h-11 w-11 items-center justify-center border border-white/50 font-mono text-xs text-white"
          >
            A1
          </div>
          <p
            class="absolute bottom-4 left-4 max-w-[18rem] font-display text-2xl leading-none text-white md:text-3xl"
          >
            Studio Click House collective
          </p>
        </div>
        <figcaption
          class="mt-3 flex items-center justify-between border-t border-brand-dark/25 pt-2 text-[0.64rem] uppercase tracking-[0.14em] text-brand-dark/55"
        >
          <span>Dhaka headquarters</span>
          <span>Production floor / suites</span>
        </figcaption>
      </figure>

      <div
        class="grid grid-cols-2 gap-x-4 gap-y-6 md:col-span-5 md:gap-x-5 lg:col-span-6"
      >
        {#each people.moments as moment, index (moment.id)}
          <figure
            class="people-contact-frame group {index === 1 || index === 2
              ? 'md:mt-8'
              : ''}"
          >
            <div
              class="relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-light"
            >
              <img
                src={moment.media.src}
                alt={moment.media.alt}
                width={moment.media.width}
                height={moment.media.height}
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0 md:grayscale"
              />
              <span
                class="absolute left-2 top-2 bg-brand-paper px-2 py-1 font-mono text-[0.58rem] text-brand-dark"
                >B{index + 1}</span
              >
            </div>
            <figcaption class="mt-2 border-t border-brand-dark/25 pt-2">
              <p
                class="text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-brand-green"
              >
                {moment.category}
              </p>
              <h3
                class="mt-1 text-sm font-semibold leading-tight text-brand-dark md:text-base"
              >
                {moment.title}
              </h3>
            </figcaption>
          </figure>
        {/each}
      </div>
    </div>
  </div>
</section>
