<script lang="ts">
  import { onMount } from "svelte";
  import CarouselArrow from "$lib/components/common/CarouselArrow.svelte";
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
            ".people-intro-reveal",
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

          for (const frame of sectionRef.querySelectorAll(".people-contact-frame")) {
            gsap.fromTo(frame, { autoAlpha: 0, y: 24 }, {
              scrollTrigger: { trigger: frame, start: "top 88%", once: true },
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              clearProps: "all",
            });
          }

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
  aria-labelledby="our-people-title"
  bind:this={sectionRef}
  class="relative bg-brand-light py-12 sm:py-14 lg:py-16"
>
  <div class="site-shell">
    <header id="our-people-introduction" class="mb-8 sm:mb-10 lg:mb-12">
      <p class="people-intro-reveal eyebrow mb-3 text-brand-dark/50">
        {$_("sectionLabels.people")}
      </p>
      <h2
        id="our-people-title"
        class="people-intro-reveal max-w-[22ch] font-sans text-[length:var(--text-section)] font-semibold leading-[1.05] tracking-[-0.04em] text-brand-dark"
      >
        {$_('about.people.heading') || people.heading}
      </h2>
    </header>

    <div id="studio-team-portraits" class="people-contact-sheet">
      <figure class="people-contact-frame m-0 grid gap-5 sm:gap-6 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div class="aspect-video w-full max-w-[52rem] overflow-hidden rounded-[var(--radius-media-sm)] bg-brand-light sm:rounded-[var(--radius-media)] lg:col-span-8">
          <img
            src={people.heroCollectiveMedia.src}
            alt={people.heroCollectiveMedia.alt}
            width={people.heroCollectiveMedia.width}
            height={people.heroCollectiveMedia.height}
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover"
          />
        </div>
        <figcaption class="grid gap-5 lg:col-span-4 lg:gap-6">
          <div>
            <p class="font-sans text-lg font-semibold leading-tight tracking-[-0.02em] text-brand-dark sm:text-xl">
              {$_('about.people.collectiveTitle') || 'Studio Click House collective'}
            </p>
            <p class="mt-2 text-xs leading-relaxed text-brand-dark/50">
              {$_('about.people.location1') || 'Dhaka headquarters'}
              <span class="mx-1" aria-hidden="true">/</span>
              {$_('about.people.location2') || 'Production floor / suites'}
            </p>
          </div>
          <p class="max-w-[48ch] text-base leading-relaxed text-brand-dark/70">
            {$_('about.people.subheading') || people.subheading}
          </p>
        </figcaption>
      </figure>

      <div class="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:mt-12 lg:grid-cols-4 lg:gap-x-8">
        {#each people.moments as moment, index (moment.id)}
          <figure class="people-contact-frame m-0">
            <div class="aspect-[4/3] overflow-hidden rounded-[var(--radius-media-sm)] bg-brand-light sm:rounded-[var(--radius-media)] lg:aspect-[4/5]">
              <img
                src={moment.media.src}
                alt={moment.media.alt}
                width={moment.media.width}
                height={moment.media.height}
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover"
              />
            </div>
            <figcaption class="mt-4">
              <p class="text-xs font-medium leading-relaxed text-brand-dark/50">
                {$_(`about.people.moments.${index}.category`) || moment.category}
              </p>
              <h3 class="mt-1 text-sm font-semibold leading-snug text-brand-dark sm:text-base">
                {$_(`about.people.moments.${index}.title`) || moment.title}
              </h3>
            </figcaption>
          </figure>
        {/each}
      </div>
    </div>

    {#if people.snapshots && people.snapshots.length > 0}
      <!-- Studio Snapshots Carousel -->
      <div id="studio-snapshots" class="mt-16 md:mt-20">
        <div class="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span
              class="people-header-reveal eyebrow mb-3 inline-block text-brand-dark/50"
            >
              {people.snapshotsEyebrow || 'Studio Culture & Craft'}
            </span>
            <h3
              class="people-header-reveal max-w-[20ch] font-sans text-[length:var(--text-section)] leading-[1.05] tracking-[-0.04em] text-brand-dark font-semibold"
            >
              {people.snapshotsHeading || 'Inside Our Dhaka Headquarters'}
            </h3>
          </div>

          <div class="people-header-reveal flex items-center gap-2 self-end sm:self-auto">
            <CarouselArrow direction="previous" label="Previous studio snapshot" onclick={slidePrev} />
            <CarouselArrow direction="next" label="Next studio snapshot" onclick={slideNext} />
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
          class="scrollbar-hidden flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-proximity select-none cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {#each people.snapshots as snapshot, index (snapshot.id)}
            <article
              class="people-snapshot-card group relative w-[280px] shrink-0 snap-start sm:w-[320px] lg:w-[350px] flex flex-col"
            >
              <div
                class="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-media-sm)] sm:rounded-[var(--radius-media)] bg-brand-light"
              >
                <img
                  src={snapshot.media.src}
                  alt={snapshot.media.alt}
                  width={snapshot.media.width}
                  height={snapshot.media.height}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] pointer-events-none select-none"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/25 to-transparent"
                ></div>
                <span
                  class="absolute left-3 top-3 bg-brand-paper/90 backdrop-blur-xs px-2.5 py-1 font-sans text-xs font-medium text-brand-dark rounded"
                >
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div class="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p
                    class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green"
                  >
                    {snapshot.category}
                  </p>
                  <h4 class="mt-1 font-sans text-lg leading-tight text-white sm:text-xl font-semibold">
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
