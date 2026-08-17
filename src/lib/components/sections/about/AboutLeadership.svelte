<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData } from "$lib/types/about";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";

  let { leadership } = $props<{ leadership: AboutPageData["leadership"] }>();

  let sectionRef: HTMLElement;
  let carouselRef: HTMLElement;

  let mdCard = $derived(leadership.members[0]);
  let slideMembers = $derived(leadership.members.slice(1));

  let isDragging = $state(false);
  let startX = 0;
  let scrollLeft = 0;
  let autoplayTimer: ReturnType<typeof setInterval> | undefined;

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = undefined;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    autoplayTimer = setInterval(() => {
      if (!isDragging && carouselRef) {
        slideNext();
      }
    }, 3000);
  }

  function slidePrev() {
    if (!carouselRef) return;
    stopAutoplay();
    const card = carouselRef.querySelector("article");
    const scrollAmount = card ? card.clientWidth + 24 : 340;
    const maxScroll = carouselRef.scrollWidth - carouselRef.clientWidth;
    if (carouselRef.scrollLeft <= 10) {
      carouselRef.scrollTo({
        left: maxScroll,
        behavior: "smooth",
      });
    } else {
      carouselRef.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
    startAutoplay();
  }

  function slideNext() {
    if (!carouselRef) return;
    const card = carouselRef.querySelector("article");
    const scrollAmount = card ? card.clientWidth + 24 : 340;
    const maxScroll = carouselRef.scrollWidth - carouselRef.clientWidth;
    if (carouselRef.scrollLeft + 15 >= maxScroll) {
      carouselRef.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      carouselRef.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }

  function handlePointerDown(event: PointerEvent) {
    if (!carouselRef) return;
    isDragging = true;
    startX = event.pageX - carouselRef.offsetLeft;
    scrollLeft = carouselRef.scrollLeft;
    try {
      carouselRef.setPointerCapture(event.pointerId);
    } catch {}
    stopAutoplay();
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isDragging || !carouselRef) return;
    event.preventDefault();
    const x = event.pageX - carouselRef.offsetLeft;
    const walk = (x - startX) * 1.6;
    carouselRef.scrollLeft = scrollLeft - walk;
  }

  function handlePointerUp(event: PointerEvent) {
    if (!isDragging || !carouselRef) return;
    isDragging = false;
    try {
      carouselRef.releasePointerCapture(event.pointerId);
    } catch {}
    startAutoplay();
  }

  onMount(() => {
    if (carouselRef) {
      carouselRef.scrollLeft = 0;
    }
    startAutoplay();

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
          portraits.forEach((portrait) => {
            gsap.fromTo(
              portrait,
              { yPercent: -4 },
              {
                scrollTrigger: {
                  trigger: portrait.closest(".leader-card"),
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
                yPercent: 4,
                ease: "none",
              },
            );
          });
        });
      }, sectionRef);
    });

    return () => {
      active = false;
      stopAutoplay();
      context?.revert();
    };
  });
</script>

<section
  id="leadership-team"
  aria-label="Leadership Team"
  bind:this={sectionRef}
  class="section-space relative bg-brand-light py-20 md:py-32"
>
  <div class="site-shell">
    <div class="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end md:mb-16">
      <div>
        {#if leadership.eyebrow}
          <span
            class="leadership-header-reveal mb-3 inline-block font-mono text-[0.72rem] font-medium uppercase tracking-[0.18em] text-brand-green"
          >
            {leadership.eyebrow}
          </span>
        {/if}
        <h2
          class="leadership-header-reveal font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.04] tracking-[-0.035em] text-brand-dark"
        >
          {leadership.heading}
        </h2>
      </div>

      <div class="leadership-header-reveal flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onclick={slidePrev}
          aria-label="Previous team member"
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-brand-dark/20 text-brand-dark transition-all duration-200 hover:border-brand-green hover:bg-brand-green hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <ArrowLeft class="h-4 w-4" />
        </button>
        <button
          type="button"
          onclick={slideNext}
          aria-label="Next team member"
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-brand-dark/20 text-brand-dark transition-all duration-200 hover:border-brand-green hover:bg-brand-green hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <ArrowRight class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div
      class="leadership-grid grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12"
    >
      <!-- LEFT SIDE: Anchor MD Card (Fixed / Sticky to Left) -->
      {#if mdCard}
        <div class="flex flex-col lg:col-span-4">
          <article class="leader-card group relative flex flex-1 flex-col w-full max-w-[360px]">
            <div
              class="leader-media relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-paper"
            >
              <img
                src={mdCard.media.src}
                alt={mdCard.media.alt}
                width={mdCard.media.width}
                height={mdCard.media.height}
                loading="lazy"
                decoding="async"
                draggable="false"
                style="user-select: none; -webkit-user-drag: none; pointer-events: none;"
                class="h-full w-full scale-[1.12] object-cover transition-transform duration-700 group-hover:scale-[1.16] pointer-events-none select-none"
              />
            </div>

            <div class="mt-4 border-t border-brand-dark/20 pt-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="mb-1.5 font-mono text-xs font-medium text-brand-green">01</p>
                  <h3
                    class="font-display text-2xl leading-none text-brand-dark transition-colors group-hover:text-brand-green"
                  >
                    {mdCard.name}
                  </h3>
                </div>
                {#if mdCard.linkedinUrl}
                  <a
                    href={mdCard.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn profile for ${mdCard.name}`}
                    class="border-b border-brand-dark/25 pb-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-brand-dark/65 transition-colors hover:border-brand-green hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
                    >LinkedIn ↗</a
                  >
                {/if}
              </div>
              <p
                class="mt-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-brand-green"
              >
                {mdCard.role}
              </p>
              <p class="mt-3 text-sm leading-relaxed text-brand-dark/70">
                {mdCard.bio}
              </p>
            </div>
          </article>
        </div>
      {/if}

      <!-- RIGHT SIDE: Interactive Slider for Department & Operational Leads -->
      <div class="flex flex-col overflow-hidden lg:col-span-8">
        <div
          bind:this={carouselRef}
          role="region"
          aria-label="Team members carousel"
          onpointerdown={handlePointerDown}
          onpointermove={handlePointerMove}
          onpointerup={handlePointerUp}
          onpointercancel={handlePointerUp}
          onmouseenter={stopAutoplay}
          onmouseleave={startAutoplay}
          class="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-proximity select-none cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          {#each slideMembers as member, index (member.id)}
            <article
              class="leader-card group relative w-[85%] shrink-0 snap-start sm:w-[320px] lg:w-[360px] flex flex-col"
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
                  draggable="false"
                  style="user-select: none; -webkit-user-drag: none; pointer-events: none;"
                  class="h-full w-full scale-[1.12] object-cover transition-transform duration-700 group-hover:scale-[1.16] pointer-events-none select-none"
                />
              </div>

              <div class="mt-4 border-t border-brand-dark/20 pt-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="mb-1.5 font-mono text-xs font-medium text-brand-green">
                      {(index + 2).toString().padStart(2, "0")}
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
                      class="border-b border-brand-dark/25 pb-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-brand-dark/65 transition-colors hover:border-brand-green hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
                      >LinkedIn ↗</a
                    >
                  {/if}
                </div>
                <p
                  class="mt-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-brand-green"
                >
                  {member.role}
                </p>
                <p class="mt-3 text-sm leading-relaxed text-brand-dark/70">
                  {member.bio}
                </p>
              </div>
            </article>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>


