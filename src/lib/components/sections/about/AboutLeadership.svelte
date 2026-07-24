<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData } from "$lib/types/about";

  let { leadership } = $props<{ leadership: AboutPageData["leadership"] }>();

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
            ".leadership-header-reveal",
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
            ".leader-card",
            { autoAlpha: 0, y: 40, scale: 0.97 },
            {
              scrollTrigger: {
                trigger: ".leadership-grid",
                start: "top 80%",
              },
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out",
            },
          );

          const portraits =
            gsap.utils.toArray<HTMLElement>(".leader-media img");
          portraits.forEach((portrait, index) => {
            gsap.fromTo(
              portrait,
              { yPercent: index % 2 === 0 ? -5 : 5 },
              {
                scrollTrigger: {
                  trigger: portrait.closest(".leader-card"),
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
                yPercent: index % 2 === 0 ? 5 : -5,
                ease: "none",
              },
            );
          });
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
  id="leadership-team"
  aria-label="Leadership Team"
  bind:this={sectionRef}
  class="section-space relative bg-brand-light py-24 md:py-36"
>
  <div class="site-shell">
    <div class="mb-16 grid gap-7 lg:grid-cols-12 lg:items-end md:mb-24">
      <h2
        class="leadership-header-reveal font-display text-[clamp(3.25rem,6vw,7rem)] leading-[0.86] tracking-[-0.05em] text-brand-dark lg:col-span-8"
      >
        {leadership.heading}
      </h2>
      <p
        class="leadership-header-reveal max-w-md text-base leading-relaxed text-brand-dark/70 lg:col-span-3 lg:pb-2 md:text-lg"
      >
        {leadership.subheading}
      </p>
    </div>

    <div
      class="leadership-grid grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4"
    >
      {#each leadership.members as member, index (member.id)}
        <article
          class="leader-card group relative {index % 2 === 1 ? 'lg:mt-20' : ''}"
        >
          <div
            class="leader-media relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-paper"
          >
            <img
              src={member.media.src}
              alt={member.media.alt}
              width={member.media.width}
              height={member.media.height}
              loading="lazy"
              decoding="async"
              class="h-full w-full scale-[1.12] object-cover grayscale contrast-[1.05] transition-[filter] duration-700 group-hover:grayscale-0"
            />
          </div>

          <div class="mt-4 border-t border-brand-dark/25 pt-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="mb-2 font-mono text-xs text-brand-green">
                  0{index + 1}
                </p>
                <h3
                  class="font-display text-2xl leading-none text-brand-dark transition-colors group-hover:text-brand-green"
                >
                  {member.name}
                </h3>
              </div>
              {#if member.linkedinUrl}
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn profile for ${member.name}`}
                  class="border-b border-brand-dark/30 pb-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-brand-dark/65 transition-colors hover:border-brand-green hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
                  >LinkedIn ↗</a
                >
              {/if}
            </div>
            <p
              class="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-brand-green"
            >
              {member.role}
            </p>
            <p class="mt-4 text-sm leading-relaxed text-brand-dark/70">
              {member.bio}
            </p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
