<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { AboutPageData } from "$lib/types/about";
  import { _ } from "svelte-i18n";

  let { people } = $props<{ people: AboutPageData["people"] }>();
  let sectionRef: HTMLElement;
  let snapshotsCarouselRef = $state<HTMLElement>();

  let isDragging = $state(false);
  let startX = 0;
  let scrollLeft = 0;

  function slidePrev() {
    if (!snapshotsCarouselRef) return;
    const card = snapshotsCarouselRef.querySelector("article");
    const scrollAmount = card ? card.clientWidth + 20 : 320;
    const maxScroll =
      snapshotsCarouselRef.scrollWidth - snapshotsCarouselRef.clientWidth;
    if (snapshotsCarouselRef.scrollLeft <= 10) {
      snapshotsCarouselRef.scrollTo({
        left: maxScroll,
        behavior: "smooth",
      });
    } else {
      snapshotsCarouselRef.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  }

  function slideNext() {
    if (!snapshotsCarouselRef) return;
    const card = snapshotsCarouselRef.querySelector("article");
    const scrollAmount = card ? card.clientWidth + 20 : 320;
    const maxScroll =
      snapshotsCarouselRef.scrollWidth - snapshotsCarouselRef.clientWidth;
    if (snapshotsCarouselRef.scrollLeft + 15 >= maxScroll) {
      snapshotsCarouselRef.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      snapshotsCarouselRef.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }

  function handlePointerDown(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    if (!snapshotsCarouselRef) return;
    isDragging = true;
    startX = event.pageX - snapshotsCarouselRef.offsetLeft;
    scrollLeft = snapshotsCarouselRef.scrollLeft;
    try {
      snapshotsCarouselRef.setPointerCapture(event.pointerId);
    } catch {
      // Optional pointer capture fallback
    }
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isDragging || !snapshotsCarouselRef) return;
    const x = event.pageX - snapshotsCarouselRef.offsetLeft;
    const walk = (x - startX) * 1.5;
    snapshotsCarouselRef.scrollLeft = scrollLeft - walk;
  }

  function handlePointerUp(event: PointerEvent) {
    if (!isDragging || !snapshotsCarouselRef) return;
    isDragging = false;
    try {
      snapshotsCarouselRef.releasePointerCapture(event.pointerId);
    } catch {
      // Optional release pointer fallback
    }
  }

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
              scrollTrigger: { trigger: sectionRef, start: "top 88%", once: true },
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
              clearProps: "all",
            },
          );

          gsap.fromTo(
            ".people-contact-frame",
            { autoAlpha: 0, y: 28, scale: 0.98 },
            {
              scrollTrigger: {
                trigger: ".people-contact-sheet",
                start: "top 88%",
                once: true,
              },
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.1,
              ease: "power3.out",
              clearProps: "all",
            },
          );

          if (document.querySelector(".people-snapshot-card")) {
            gsap.fromTo(
              ".people-snapshot-card",
              { autoAlpha: 0, y: 30 },
              {
                scrollTrigger: {
                  trigger: "#studio-snapshots",
                  start: "top 88%",
                  once: true,
                },
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
                stagger: 0.08,
                ease: "power2.out",
                clearProps: "all",
              },
            );
          }
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
        class="people-header-reveal max-w-[11ch] font-display text-[clamp(2.5rem,5vw,6rem)] leading-[0.88] tracking-[-0.045em] text-brand-dark lg:col-span-8"
      >
        {$_('about.people.heading') || people.heading}
      </h2>
      <p
        class="people-header-reveal max-w-md text-base leading-relaxed text-brand-dark/70 lg:col-span-3 lg:pb-2 md:text-lg"
      >
        {$_('about.people.subheading') || people.subheading}
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
            {$_('about.people.collectiveTitle') || 'Studio Click House collective'}
          </p>
        </div>
        <figcaption
          class="mt-3 flex items-center justify-between border-t border-brand-dark/25 pt-2 text-[0.64rem] uppercase tracking-[0.14em] text-brand-dark/55"
        >
          <span>{$_('about.people.location1') || 'Dhaka headquarters'}</span>
          <span>{$_('about.people.location2') || 'Production floor / suites'}</span>
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
                {$_(`about.people.moments.${index}.category`) || moment.category}
              </p>
              <h3
                class="mt-1 text-sm font-semibold leading-tight text-brand-dark md:text-base"
              >
                {$_(`about.people.moments.${index}.title`) || moment.title}
              </h3>
            </figcaption>
          </figure>
        {/each}
      </div>
    </div>

    {#if people.snapshots && people.snapshots.length > 0}
      <!-- Studio Snapshots Carousel -->
      <div id="studio-snapshots" class="mt-20 border-t border-brand-dark/15 pt-16 md:mt-28 md:pt-20">
        <div class="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span
              class="people-header-reveal mb-2 inline-block font-mono text-[0.72rem] font-medium uppercase tracking-[0.18em] text-brand-green"
            >
              {people.snapshotsEyebrow || 'Studio Culture & Craft'}
            </span>
            <h3
              class="people-header-reveal font-display text-2xl sm:text-3xl md:text-4xl leading-tight tracking-[-0.035em] text-brand-dark"
            >
              {people.snapshotsHeading || 'Inside Our Dhaka Headquarters'}
            </h3>
          </div>

          <div class="people-header-reveal flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onclick={slidePrev}
              aria-label="Previous studio snapshot"
              class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-brand-dark/20 text-brand-dark transition-all duration-200 hover:border-brand-green hover:bg-brand-green hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <ArrowLeft class="h-4 w-4" />
            </button>
            <button
              type="button"
              onclick={slideNext}
              aria-label="Next studio snapshot"
              class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-brand-dark/20 text-brand-dark transition-all duration-200 hover:border-brand-green hover:bg-brand-green hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <ArrowRight class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          bind:this={snapshotsCarouselRef}
          role="region"
          aria-label="Studio snapshots carousel"
          onpointerdown={handlePointerDown}
          onpointermove={handlePointerMove}
          onpointerup={handlePointerUp}
          onpointercancel={handlePointerUp}
          class="flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-proximity select-none cursor-grab active:cursor-grabbing touch-pan-y [&::-webkit-scrollbar]:hidden"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          {#each people.snapshots as snapshot, index (snapshot.id)}
            <article
              class="people-snapshot-card group relative w-[280px] shrink-0 snap-start sm:w-[320px] lg:w-[350px] flex flex-col"
            >
              <div
                class="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-brand-light"
              >
                <img
                  src={snapshot.media.src}
                  alt={snapshot.media.alt}
                  width={snapshot.media.width}
                  height={snapshot.media.height}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  style="user-select: none; -webkit-user-drag: none; pointer-events: none;"
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] pointer-events-none select-none"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/25 to-transparent"
                ></div>
                <span
                  class="absolute left-3 top-3 bg-brand-paper/90 backdrop-blur-xs px-2.5 py-1 font-mono text-[0.62rem] font-medium text-brand-dark rounded"
                >
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div class="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p
                    class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-green"
                  >
                    {snapshot.category}
                  </p>
                  <h4 class="mt-1 font-display text-lg leading-tight text-white sm:text-xl">
                    {snapshot.title}
                  </h4>
                  <p class="mt-2 text-xs leading-relaxed text-white/75 line-clamp-2">
                    {snapshot.caption}
                  </p>
                </div>
              </div>
            </article>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>
