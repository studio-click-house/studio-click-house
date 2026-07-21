<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowLeft, ArrowRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  const chiefExecutive = {
    name: "Jilhaj",
    role: "Chief executive officer",
    src: "/images/profile%20image/CEO/Jilhaj.jpg",
    width: 1086,
    height: 1448,
  } as const;

  const people = [
    {
      name: "Asaduzzaman Mithu",
      role: "Assistant project manager",
      src: "/images/profile%20image/APM/Asaduzzaman%20Mithu%20.jpeg",
      width: 1063,
      height: 1299,
    },
    {
      name: "Sohel Rana",
      role: "Project manager",
      src: "/images/profile%20image/PM/Sohel%20Rana.jpg",
      width: 386,
      height: 450,
    },
    {
      name: "Ershad Hossain Patwari",
      role: "Senior designer",
      src: "/images/profile%20image/SENIOR%20DESIGNER/Ershad%20Hossain%20Patwari.jpeg",
      width: 300,
      height: 300,
    },
    {
      name: "Md Abu Nasim Jidan",
      role: "Senior designer",
      src: "/images/profile%20image/SENIOR%20DESIGNER/Md%20Abu%20Nasim%20jidan.jpg",
      width: 2413,
      height: 3000,
    },
    {
      name: "Md Azizur Rahman",
      role: "Senior designer",
      src: "/images/profile%20image/SENIOR%20DESIGNER/Md%20Azizur%20Rahman.jpeg",
      width: 445,
      height: 536,
    },
    {
      name: "Md Rasel",
      role: "Senior designer",
      src: "/images/profile%20image/SENIOR%20DESIGNER/Md%20Rasel.jpg",
      width: 1080,
      height: 1365,
    },
    {
      name: "Md Robiul Islam",
      role: "Senior designer",
      src: "/images/profile%20image/SENIOR%20DESIGNER/Md%20Robiul%20Islam.jpg",
      width: 853,
      height: 1280,
    },
    {
      name: "Md Saiful Islam",
      role: "Senior designer",
      src: "/images/profile%20image/SENIOR%20DESIGNER/Md%20Saiful%20Islam.jpg",
      width: 720,
      height: 983,
    },
    {
      name: "Tanvir Hasan",
      role: "Senior designer",
      src: "/images/profile%20image/SENIOR%20DESIGNER/Tanvir%20Hasan%20.jpg",
      width: 460,
      height: 440,
    },
  ] as const;

  let section: HTMLElement;
  let viewport: HTMLElement;
  let track: HTMLElement;
  let cards: HTMLElement[] = [];
  let activeIndex = $state(0);
  let isPaused = $state(false);
  let animateTo: ((index: number) => void) | undefined;

  function showPerson(index: number) {
    const nextIndex = (index + people.length) % people.length;
    activeIndex = nextIndex;
    animateTo?.(nextIndex);
  }

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;
    let timer: number | undefined;
    let removeResize = () => {};

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !viewport || !track) return;

      const { gsap, ScrollTrigger } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        animateTo = (index: number) => {
          const card = cards[index];
          if (!card) return;

          const maximumShift = Math.max(
            0,
            track.scrollWidth - viewport.clientWidth,
          );
          const targetShift = Math.min(card.offsetLeft, maximumShift);
          gsap.to(track, {
            x: -targetShift,
            duration: 0.9,
            ease: "power3.inOut",
            overwrite: "auto",
          });
        };

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                once: true,
              },
            })
            .from(".team-heading > *", {
              y: 24,
              autoAlpha: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: "power3.out",
            })
            .from(
              cards,
              {
                x: 42,
                duration: 0.85,
                stagger: 0.07,
                ease: "power3.out",
                immediateRender: false,
              },
              "-=0.42",
            );
        });

        removeResize = () => {
          animateTo?.(activeIndex);
          ScrollTrigger.refresh();
        };
        window.addEventListener("resize", removeResize, { passive: true });

        timer = window.setInterval(() => {
          if (!isPaused) showPerson(activeIndex + 1);
        }, 4200);

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      if (timer) window.clearInterval(timer);
      window.removeEventListener("resize", removeResize);
      animateTo = undefined;
      context?.revert();
    };
  });
</script>

<section
  id="studio-team"
  bind:this={section}
  aria-labelledby="studio-team-title"
  class="team-section overflow-hidden bg-brand-light text-brand-dark"
>
  <div class="team-glow team-glow-left" aria-hidden="true"></div>
  <div class="team-glow team-glow-right" aria-hidden="true"></div>
  <div class="site-shell">
    <header class="team-heading">
      <div>
        <h2 id="studio-team-title">
          The people behind <span>every frame.</span>
        </h2>
      </div>
      <div class="team-controls" aria-label="Team slider controls">
        <button
          type="button"
          aria-label="Show previous person"
          onclick={() => showPerson(activeIndex - 1)}
        >
          <ArrowLeft size={18} strokeWidth={1.6} />
        </button>
        <span aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(
            people.length,
          ).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label="Show next person"
          onclick={() => showPerson(activeIndex + 1)}
        >
          <ArrowRight size={18} strokeWidth={1.6} />
        </button>
      </div>
    </header>

    <div class="team-showcase">
      <article class="ceo-profile">
        <figure>
          <img
            src={chiefExecutive.src}
            alt={`${chiefExecutive.name}, ${chiefExecutive.role} at Studio Click House`}
            width={chiefExecutive.width}
            height={chiefExecutive.height}
            loading="lazy"
          />
        </figure>
        <div class="person-copy">
          <h3>{chiefExecutive.name}</h3>
          <p>{chiefExecutive.role}</p>
        </div>
      </article>

      <div
        bind:this={viewport}
        class="team-viewport"
        role="region"
        aria-label="Studio team profiles"
        onmouseenter={() => (isPaused = true)}
        onmouseleave={() => (isPaused = false)}
        onfocusin={() => (isPaused = true)}
        onfocusout={() => (isPaused = false)}
      >
        <div bind:this={track} class="team-track">
          {#each people as person, index (person.name)}
            <article
              bind:this={cards[index]}
              class="person-card"
              aria-current={activeIndex === index ? "true" : undefined}
            >
              <figure>
                <img
                  src={person.src}
                  alt={`${person.name}, ${person.role} at Studio Click House`}
                  width={person.width}
                  height={person.height}
                  loading="lazy"
                />
              </figure>
              <div class="person-copy">
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </div>
            </article>
          {/each}
        </div>
      </div>
    </div>

    <div class="team-footer">
      <span class="team-progress" aria-hidden="true">
        <span style={`--team-progress: ${(activeIndex + 1) / people.length}`}
        ></span>
      </span>
    </div>
  </div>
</section>

<style>
  .team-section {
    position: relative;
    padding-block: clamp(3.25rem, 4.5vw, 4.75rem);
  }

  .team-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .team-glow-left {
    top: 18%;
    left: -10rem;
    width: 28rem;
    height: 28rem;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--color-brand-green) 14%, transparent),
      transparent 68%
    );
  }

  .team-glow-right {
    right: -12rem;
    bottom: -8rem;
    width: 34rem;
    height: 34rem;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--color-brand-green) 9%, transparent),
      transparent 70%
    );
  }

  .team-section :global(.site-shell) {
    position: relative;
    z-index: 1;
  }

  .team-heading {
    display: grid;
    gap: 1.5rem;
    align-items: end;
  }

  .team-heading h2 {
    max-width: 18ch;
    font-family: var(--font-sans);
    font-size: clamp(2.2rem, 3.7vw, 3.9rem);
    font-weight: 600;
    line-height: 0.98;
    letter-spacing: -0.055em;
  }

  .team-heading h2 span {
    color: var(--color-brand-green);
  }

  .team-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .team-controls button {
    display: grid;
    width: 2.65rem;
    height: 2.65rem;
    place-items: center;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 24%, transparent);
    border-radius: 0.35rem;
    transition:
      background-color 220ms ease,
      border-color 220ms ease,
      color 220ms ease;
  }

  .team-controls button:hover {
    border-color: var(--color-brand-green);
    background: var(--color-brand-green);
    color: var(--color-brand-light);
  }

  .team-controls span {
    min-width: 4rem;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.12em;
    color: color-mix(in srgb, var(--color-brand-dark) 48%, transparent);
  }

  .team-showcase {
    display: grid;
    gap: 1rem;
    margin-top: clamp(2rem, 3vw, 3rem);
  }

  .team-viewport {
    min-width: 0;
    overflow: hidden;
  }

  .team-track {
    display: flex;
    width: max-content;
    gap: 0.85rem;
    will-change: transform;
  }

  .person-card {
    width: min(74vw, 18rem);
    flex: none;
    opacity: 0.58;
    transition: opacity 300ms ease;
  }

  .person-card[aria-current="true"] {
    opacity: 1;
  }

  .person-card figure {
    position: relative;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    border-radius: 1rem;
    background: var(--color-brand-mist);
  }

  .ceo-profile figure {
    position: relative;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border-radius: 1rem;
    background: white;
  }

  .ceo-profile {
    width: min(74vw, 18rem);
  }

  .ceo-profile img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center top;
    transition: transform 650ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .person-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.72);
    transition:
      transform 600ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 300ms ease;
  }

  .person-card:hover img,
  .ceo-profile:hover img {
    transform: scale(1.06);
    filter: saturate(1);
  }

  .person-card[aria-current="true"] img {
    filter: saturate(1);
  }

  .person-copy {
    padding-top: 1rem;
  }

  .person-copy h3 {
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.025em;
  }

  .person-copy p {
    margin-top: 0.5rem;
    font-size: 0.76rem;
    color: color-mix(in srgb, var(--color-brand-dark) 56%, transparent);
  }

  .team-footer {
    margin-top: 2rem;
  }

  .team-progress {
    position: relative;
    display: block;
    height: 1px;
    overflow: hidden;
    background: color-mix(in srgb, var(--color-brand-dark) 16%, transparent);
  }

  .team-progress span {
    position: absolute;
    inset: 0;
    display: block;
    transform: scaleX(var(--team-progress));
    transform-origin: left;
    background: var(--color-brand-green);
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (min-width: 768px) {
    .team-heading {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .team-showcase {
      grid-template-columns: minmax(15rem, 18rem) minmax(0, 1fr);
      align-items: start;
    }

    .ceo-profile {
      max-width: 18rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .team-track {
      transform: none !important;
    }

    .person-card,
    .person-card img,
    .team-progress span {
      transition: none;
    }
  }
</style>
