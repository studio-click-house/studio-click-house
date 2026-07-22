<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  interface OrbitCard {
    id: string;
    title: string;
    category: string;
    media: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  }

  const orbitCards: OrbitCard[] = [
    {
      id: "orbit-1",
      title: "Fashion Editorial Retouching",
      category: "Campaign",
      media: {
        src: "https://images.pexels.com/photos/17173186/pexels-photo-17173186.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Editorial fashion portrait",
        width: 1200,
        height: 1600,
      },
    },
    {
      id: "orbit-2",
      title: "DaVinci Skin Tone Grading",
      category: "Video Suite",
      media: {
        src: "https://images.pexels.com/photos/325111/pexels-photo-325111.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Video color grading panel",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "orbit-3",
      title: "3D CGI Product Modeling",
      category: "3D Studio",
      media: {
        src: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "3D render interface",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "orbit-4",
      title: "High-Key Luxury Perfume",
      category: "Still Life",
      media: {
        src: "https://images.pexels.com/photos/18302102/pexels-photo-18302102.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Perfume still life shot",
        width: 1200,
        height: 1600,
      },
    },
    {
      id: "orbit-5",
      title: "Fine Jewelry Macro Retouch",
      category: "Luxury",
      media: {
        src: "https://images.pexels.com/photos/11006273/pexels-photo-11006273.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Pearl jewelry closeup",
        width: 1200,
        height: 1600,
      },
    },
    {
      id: "orbit-6",
      title: "Automotive & Industrial CGI",
      category: "CGI Studio",
      media: {
        src: "https://images.pexels.com/photos/37848029/pexels-photo-37848029.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Editing workspace monitors",
        width: 1200,
        height: 800,
      },
    },
    {
      id: "orbit-7",
      title: "Studio Collective Collaboration",
      category: "Production",
      media: {
        src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Creative team reviewing work",
        width: 1200,
        height: 800,
      },
    },
  ];

  let sectionRef: HTMLElement;
  let centerTextRef: HTMLElement;

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionRef) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const cards = gsap.utils.toArray<HTMLElement>(".orbit-card-item");
          const totalCards = cards.length;

          // Initial stack setup
          cards.forEach((card, index) => {
            const initialRotation = (index - Math.floor(totalCards / 2)) * 5;
            gsap.set(card, {
              x: 0,
              y: 0,
              rotation: initialRotation,
              scale: 0.88,
              zIndex: totalCards - index,
            });
          });

          if (centerTextRef) {
            gsap.set(centerTextRef, { autoAlpha: 0, scale: 0.92, y: 15 });
          }

          // Main scrubbed timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef,
              start: "top top",
              end: "+=220%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          });

          // Phase 1: Expand cards in a circular orbit
          cards.forEach((card, index) => {
            const isDesktop = window.innerWidth >= 1024;
            const radius = isDesktop ? 340 : 220;

            // Start angle from top (-90 deg or -PI/2) distributed evenly around 360 deg
            const angle = (index / totalCards) * (2 * Math.PI) - Math.PI / 2;
            const targetX = Math.round(Math.cos(angle) * radius);
            const targetY = Math.round(Math.sin(angle) * radius);
            const targetRotation = Math.round((angle * (180 / Math.PI)) * 0.15);

            tl.to(
              card,
              {
                x: targetX,
                y: targetY,
                rotation: targetRotation,
                scale: isDesktop ? 1 : 0.82,
                ease: "power2.out",
                duration: 1,
              },
              0,
            );
          });

          // Phase 2: Fade in center text inside the orbit ring
          if (centerTextRef) {
            tl.to(
              centerTextRef,
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                ease: "power2.out",
                duration: 0.5,
              },
              0.45,
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
  id="about-orbit-gallery"
  aria-label="Studio Work Orbit Showcase"
  bind:this={sectionRef}
  class="relative min-h-screen overflow-hidden bg-brand-dark py-20 text-brand-light"
>
  <!-- Background Ambient Mesh -->
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(126,166,65,0.08)_0%,transparent_70%)]"
    aria-hidden="true"
  ></div>

  <!-- Pinned Content Outer Frame -->
  <div class="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4">
    <!-- Center Orbit Container -->
    <div class="relative flex h-[34rem] w-full max-w-5xl items-center justify-center sm:h-[40rem]">
      
      <!-- Cards Stack / Ring -->
      {#each orbitCards as card, index (card.id)}
        <div
          class="orbit-card-item absolute aspect-[4/5] w-48 overflow-hidden rounded-2xl border border-brand-light/15 bg-brand-dark/90 p-1.5 shadow-2xl backdrop-blur-md sm:w-60 md:w-64"
        >
          <figure class="relative h-full w-full overflow-hidden rounded-xl">
            <img
              src={card.media.src}
              alt={card.media.alt}
              width={card.media.width}
              height={card.media.height}
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-transparent to-transparent"
              aria-hidden="true"
            ></div>
            <figcaption
              class="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5"
            >
              <span
                class="font-mono text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-brand-green"
              >
                {card.category}
              </span>
              <p
                class="font-display text-xs font-medium leading-tight text-brand-light sm:text-sm"
              >
                {card.title}
              </p>
            </figcaption>
          </figure>
        </div>
      {/each}

      <!-- Center Text Reveal -->
      <div
        bind:this={centerTextRef}
        class="relative z-30 max-w-sm px-6 text-center sm:max-w-md"
      >
        <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-brand-green">
          <span class="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse"></span>
          Visual Masterclass
        </div>

        <h2
          class="font-display text-3xl font-light leading-tight tracking-[-0.03em] text-brand-light sm:text-4xl md:text-5xl"
        >
          Post-production <br />
          <span class="italic text-brand-green">at full momentum.</span>
        </h2>

        <p class="mt-3 text-xs leading-relaxed text-brand-light/70 sm:text-sm">
          From high-end editorial skin retouching to complex 3D CGI rendering, our dual-shift Dhaka studio turns creative concepts into flawless campaign assets.
        </p>

        <div class="mt-6 flex items-center justify-center gap-4">
          <a
            href="/portfolio"
            class="inline-flex items-center rounded-lg bg-brand-green px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark transition-all hover:bg-brand-green/90 focus-visible:outline-2 focus-visible:outline-brand-green"
          >
            Explore Work →
          </a>
        </div>
      </div>

    </div>
  </div>
</section>
