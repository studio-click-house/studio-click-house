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

          // Initial Fanned Stack Setup
          cards.forEach((card, index) => {
            const fanOffset = (index - Math.floor(totalCards / 2)) * 32;
            const fanRotation = (index - Math.floor(totalCards / 2)) * 4.5;
            const fanY = Math.abs(index - Math.floor(totalCards / 2)) * 4;

            gsap.set(card, {
              x: fanOffset,
              y: fanY,
              rotation: fanRotation,
              scale: 0.9,
              zIndex: totalCards - index,
            });
          });

          if (centerTextRef) {
            gsap.set(centerTextRef, { autoAlpha: 0.45, scale: 0.95, y: 10 });
          }

          // Main scrubbed timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef,
              start: "top top",
              end: "+=120%",
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
            },
          });

          // Phase 1: Expand cards outwards
          cards.forEach((card, index) => {
            const width = window.innerWidth;
            let radius = 480;
            if (width < 768) {
              radius = 230;
            } else if (width < 1024) {
              radius = 350;
            } else if (width >= 1400) {
              radius = 520;
            }

            const angle = (index / totalCards) * (2 * Math.PI) - Math.PI / 2;
            const targetX = Math.round(Math.cos(angle) * radius);
            const targetY = Math.round(Math.sin(angle) * (radius * 0.82));
            const targetRotation = Math.round((angle * (180 / Math.PI)) * 0.1);

            tl.to(
              card,
              {
                x: targetX,
                y: targetY,
                rotation: targetRotation,
                scale: width >= 768 ? 1 : 0.82,
                ease: "power2.out",
                duration: 1,
              },
              0,
            );
          });

          // Phase 2: Fade in center text inside orbit ring
          if (centerTextRef) {
            tl.to(
              centerTextRef,
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                ease: "power2.out",
                duration: 0.4,
              },
              0.15,
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
  class="relative min-h-screen overflow-x-clip bg-brand-light pt-8 pb-16 text-brand-dark"
>
  <!-- Background Ambient Radial Pattern -->
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(126,166,65,0.06)_0%,transparent_70%)]"
    aria-hidden="true"
  ></div>

  <!-- Subtle Grid Background -->
  <div
    class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(51,46,45,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,46,45,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"
    aria-hidden="true"
  ></div>

  <!-- Top Connection Badge -->
  <div class="relative z-20 flex w-full justify-center pt-2">
    <div class="inline-flex items-center gap-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-brand-dark/50">
      <span class="h-px w-8 bg-brand-dark/20"></span>
      <span>Studio Work Showcase</span>
      <span class="h-px w-8 bg-brand-dark/20"></span>
    </div>
  </div>

  <!-- Pinned Content Outer Frame -->
  <div class="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 pt-4">
    <!-- Center Orbit Container -->
    <div class="relative flex h-[34rem] w-full max-w-7xl items-center justify-center sm:h-[40rem] lg:h-[44rem]">
      
      <!-- Pure Full-Bleed Image Cards (Fanned Arc Initial State) -->
      {#each orbitCards as card, index (card.id)}
        <div
          class="orbit-card-item absolute aspect-[4/5] w-44 overflow-hidden rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl sm:w-56 md:w-60 lg:w-64"
        >
          <figure class="relative h-full w-full overflow-hidden rounded-2xl bg-brand-dark">
            <img
              src={card.media.src}
              alt={card.media.alt}
              width={card.media.width}
              height={card.media.height}
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </figure>
        </div>
      {/each}

      <!-- Center Text Reveal -->
      <div
        bind:this={centerTextRef}
        class="relative z-30 max-w-sm px-6 text-center sm:max-w-md md:max-w-lg"
      >
        <h2
          class="font-display text-3xl font-light leading-tight tracking-[-0.035em] text-brand-dark sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Post-production <br />
          <span class="italic text-brand-green">at full momentum.</span>
        </h2>

        <p class="mt-4 text-xs leading-relaxed text-brand-dark/75 sm:text-sm md:text-base">
          From high-end editorial skin retouching to complex 3D CGI rendering, our dual-shift Dhaka studio turns creative concepts into flawless campaign assets.
        </p>

        <div class="mt-6 flex items-center justify-center gap-4">
          <a
            href="/portfolio"
            class="inline-flex items-center rounded-lg bg-brand-dark px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-light transition-all hover:bg-brand-dark/90 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-brand-dark"
          >
            Explore Work →
          </a>
        </div>
      </div>

    </div>
  </div>
</section>
