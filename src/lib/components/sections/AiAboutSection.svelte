<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";

  let section: HTMLElement;

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const cards = gsap.utils.toArray<HTMLElement>(".stage-column");
          const dividers = gsap.utils.toArray<HTMLElement>(".stage-divider");

          // 1. Header reveal: independent once:true trigger so it never gets stuck hidden on scroll
          gsap.fromTo(
            ".ai-head-reveal",
            { autoAlpha: 0, y: 25 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: "top 92%", once: true },
            }
          );

          // 2. Scrubbed cards timeline: completes exactly as the section reaches the middle of the viewport
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              end: "center 48%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          // Step 1 (Raw Flat Input) appears and settles
          if (cards[0]) {
            tl.fromTo(
              cards[0],
              { autoAlpha: 0, scale: 0.94, y: 20 },
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                duration: 0.45,
                ease: "power2.out",
              }
            );
          }

          // Step 2 (3D Ghost Mannequin) unfolds to the right
          if (dividers[0]) {
            tl.fromTo(
              dividers[0].querySelector(".stage-divider-line"),
              { scaleX: 0 },
              { scaleX: 1, duration: 0.25, ease: "power2.inOut" },
              "-=0.1"
            );
          }
          if (cards[1]) {
            tl.fromTo(
              cards[1],
              { autoAlpha: 0, x: -60, scale: 0.94 },
              {
                autoAlpha: 1,
                x: 0,
                scale: 1,
                duration: 0.45,
                ease: "power2.out",
              },
              "-=0.12"
            );
          }

          // Step 3 (AI On-Model Synthesis) unfolds to the right
          if (dividers[1]) {
            tl.fromTo(
              dividers[1].querySelector(".stage-divider-line"),
              { scaleX: 0 },
              { scaleX: 1, duration: 0.25, ease: "power2.inOut" },
              "-=0.1"
            );
          }
          if (cards[2]) {
            tl.fromTo(
              cards[2],
              { autoAlpha: 0, x: -60, scale: 0.94 },
              {
                autoAlpha: 1,
                x: 0,
                scale: 1,
                duration: 0.45,
                ease: "power2.out",
              },
              "-=0.12"
            );
          }

          // Step 4 (Cobalt Colorway) unfolds to the right
          if (dividers[2]) {
            tl.fromTo(
              dividers[2].querySelector(".stage-divider-line"),
              { scaleX: 0 },
              { scaleX: 1, duration: 0.25, ease: "power2.inOut" },
              "-=0.1"
            );
          }
          if (cards[3]) {
            tl.fromTo(
              cards[3],
              { autoAlpha: 0, x: -60, scale: 0.94 },
              {
                autoAlpha: 1,
                x: 0,
                scale: 1,
                duration: 0.45,
                ease: "power2.out",
              },
              "-=0.12"
            );
          }

          // Explore Link reveal
          tl.fromTo(
            ".ai-explore-link",
            { autoAlpha: 0, y: 15 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.3,
              ease: "power2.out",
            },
            "-=0.15"
          );
        });

        return () => media.revert();
      }, section);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="ai-about-section"
  bind:this={section}
  aria-labelledby="ai-about-title"
  class="relative overflow-hidden bg-brand-light text-brand-dark pt-10 sm:pt-14 lg:pt-18 pb-16 sm:pb-22 lg:pb-28"
>
  <div class="site-shell relative z-10">

    <!-- ═══ Section Header (Centered) ═══ -->
    <div class="mb-10 sm:mb-14 text-center">
      <h2
        id="ai-about-title"
        class="ai-head-reveal font-display text-[clamp(2.4rem,4.2vw,4.5rem)] leading-[0.92] tracking-[-0.038em]"
      >
        {$_('home.aiWorkflow.title1') || 'AI E-Commerce'} <em class="font-display italic font-normal text-brand-green">{$_('home.aiWorkflow.title2') || 'Workflow.'}</em>
      </h2>
    </div>

    <!-- ═══ 4-Stage Breakdown Grid ═══ -->
    <div class="ai-stages-container">
      <div class="ai-stages-grid">

        <!-- ── STAGE 01: Raw Flat Input ── -->
        <div class="stage-column">
          <div class="stage-card">
            <div class="stage-frame">
              <img
                src="/images/about/ghost-mannequin-input.jpg"
                alt="Raw garment flat capture input"
                class="stage-img"
                width="560"
                height="747"
                loading="lazy"
              />
            </div>
          </div>
          
          <div class="stage-content">
            <div class="stage-heading">
              <span class="stage-index">01</span>
              <h3 class="stage-title">{$_('home.aiWorkflow.stage1.title') || 'Raw Flat Input'}</h3>
            </div>
            <p class="stage-description">
              {$_('home.aiWorkflow.stage1.description') || 'Standard flat garment photo on transparent studio cutout.'}
            </p>
          </div>
        </div>

        <!-- ── Connector 1 -> 2 ── -->
        <div class="stage-divider" aria-hidden="true">
          <div class="stage-divider-line"></div>
          <div class="stage-divider-arrow">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path d="M0 6h15M12 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- ── STAGE 02: 3D Ghost Mannequin (Hero Focused Card) ── -->
        <div class="stage-column stage-column-hero">
          <div class="stage-card stage-card-hero">
            <div class="stage-frame">
              <img
                src="/images/about/ghost-mannequin-emerald.jpg"
                alt="Symmetrical 3D ghost mannequin e-commerce capture"
                class="stage-img"
                width="560"
                height="747"
                loading="lazy"
              />
            </div>
          </div>

          <div class="stage-content">
            <div class="stage-heading">
              <span class="stage-index text-brand-green">02</span>
              <h3 class="stage-title">{$_('home.aiWorkflow.stage2.title') || '3D Ghost Mannequin'}</h3>
            </div>
            <p class="stage-description">
              {$_('home.aiWorkflow.stage2.description') || 'Clean symmetrical hollow mannequin composite on e-commerce studio grey.'}
            </p>
          </div>
        </div>

        <!-- ── Connector 2 -> 3 ── -->
        <div class="stage-divider" aria-hidden="true">
          <div class="stage-divider-line"></div>
          <div class="stage-divider-arrow">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path d="M0 6h15M12 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- ── STAGE 03: AI On-Model Synthesis ── -->
        <div class="stage-column">
          <div class="stage-card">
            <div class="stage-frame">
              <img
                src="/images/about/ai-model-emerald.jpg"
                alt="AI-dressed model wearing emerald garment"
                class="stage-img"
                width="560"
                height="747"
                loading="lazy"
              />
            </div>
          </div>

          <div class="stage-content">
            <div class="stage-heading">
              <span class="stage-index">03</span>
              <h3 class="stage-title">{$_('home.aiWorkflow.stage3.title') || 'AI On-Model Synthesis'}</h3>
            </div>
            <p class="stage-description">
              {$_('home.aiWorkflow.stage3.description') || 'Virtual model synthesis matching true fabric drape, posture & studio rim light.'}
            </p>
          </div>
        </div>

        <!-- ── Connector 3 -> 4 ── -->
        <div class="stage-divider" aria-hidden="true">
          <div class="stage-divider-line"></div>
          <div class="stage-divider-arrow">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path d="M0 6h15M12 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- ── STAGE 04: Cobalt Colorway ── -->
        <div class="stage-column">
          <div class="stage-card">
            <div class="stage-frame">
              <img
                src="/images/about/ai-model-cobalt.jpg"
                alt="Cobalt blue colorway variant"
                class="stage-img"
                width="560"
                height="747"
                loading="lazy"
              />
            </div>
          </div>

          <div class="stage-content">
            <div class="stage-heading">
              <span class="stage-index">04</span>
              <h3 class="stage-title">{$_('home.aiWorkflow.stage4.title') || 'Cobalt Colorway'}</h3>
            </div>
            <p class="stage-description">
              {$_('home.aiWorkflow.stage4.description') || 'Instant chromatic recolor preserving natural fabric folds and highlights.'}
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══ Clean Explore Link (Centered) ═══ -->
    <div class="mt-10 sm:mt-12 flex justify-center">
      <a href={resolve("/services/ai-retouch")} class="ai-explore-link group">
        <span class="font-sans text-xs sm:text-[0.84rem] font-semibold text-brand-dark group-hover:text-brand-green transition-colors duration-200">
          {$_('home.aiWorkflow.explore') || 'Explore AI Services & Full Pipeline'}
        </span>
        <span class="grid h-6 w-6 place-items-center rounded-full border border-brand-dark/15 bg-white text-brand-dark transition-all duration-200 group-hover:border-brand-green group-hover:bg-brand-green group-hover:text-brand-dark">
          <ArrowUpRight size={13} strokeWidth={1.8} class="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </a>
    </div>

  </div>
</section>

<style>
  /* ═══ Stages Layout ═══ */
  .ai-stages-container {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-block: 0.5rem;
  }

  .ai-stages-container::-webkit-scrollbar {
    display: none;
  }

  .ai-stages-grid {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0;
    min-width: 1080px;
  }

  /* ═══ Stage Column ═══ */
  .stage-column {
    flex: 1;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    will-change: transform, opacity;
  }

  .stage-column-hero {
    max-width: 265px;
  }

  /* ── Stage Card & Frame ── */
  .stage-card {
    width: 100%;
    border-radius: 0.95rem;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--color-brand-dark) 10%, transparent);
    background: var(--color-brand-paper);
    box-shadow: 0 4px 18px -4px rgba(0, 0, 0, 0.04);
    transition:
      transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 500ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 500ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .stage-card:hover {
    transform: translateY(-5px);
    border-color: color-mix(in srgb, var(--color-brand-dark) 25%, transparent);
    box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.08);
  }

  .stage-card-hero {
    border: 1.5px solid var(--color-brand-green);
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--color-brand-green) 25%, transparent),
      0 6px 20px -4px rgba(126, 166, 65, 0.12);
  }

  .stage-card-hero:hover {
    border-color: var(--color-brand-green);
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--color-brand-green) 45%, transparent),
      0 16px 36px -8px rgba(126, 166, 65, 0.18);
  }

  .stage-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 3.9;
    overflow: hidden;
  }

  .stage-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 15%;
    transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .stage-card:hover .stage-img {
    transform: scale(1.035);
  }

  /* ── Stage Content & Typography ── */
  .stage-content {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding-inline: 0.2rem;
  }

  .stage-heading {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
  }

  .stage-index {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-brand-green);
  }

  .stage-title {
    font-family: var(--font-sans);
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--color-brand-dark);
    letter-spacing: -0.015em;
  }

  .stage-description {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    line-height: 1.45;
    color: color-mix(in srgb, var(--color-brand-dark) 65%, transparent);
  }

  /* ═══ Connectors ═══ */
  .stage-divider {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding-inline: 0.65rem;
    flex-shrink: 0;
    align-self: center;
    margin-bottom: 4.2rem;
  }

  .stage-divider-line {
    width: 32px;
    height: 1px;
    background: repeating-linear-gradient(
      90deg,
      color-mix(in srgb, var(--color-brand-dark) 18%, transparent) 0,
      color-mix(in srgb, var(--color-brand-dark) 18%, transparent) 5px,
      transparent 5px,
      transparent 10px
    );
    transform-origin: left;
  }

  .stage-divider-arrow {
    display: flex;
    flex-shrink: 0;
    color: var(--color-brand-green);
  }

  /* ═══ Explore Link ═══ */
  .ai-explore-link {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
  }

  /* ═══ Responsive ═══ */
  @media (max-width: 991px) {
    .ai-stages-grid {
      min-width: 100%;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .stage-column,
    .stage-column-hero {
      width: 100%;
      max-width: 360px;
    }

    .stage-divider {
      transform: rotate(90deg);
      margin-bottom: 0;
      padding-inline: 0;
      margin-block: 0.5rem;
    }
  }

  @media (min-width: 992px) and (max-width: 1279px) {
    .stage-column {
      max-width: 215px;
    }

    .stage-column-hero {
      max-width: 230px;
    }

    .stage-divider {
      padding-inline: 0.35rem;
    }

    .stage-divider-line {
      width: 22px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .stage-column,
    .stage-divider-line,
    .ai-head-reveal,
    .ai-explore-link {
      will-change: auto;
      transform: none !important;
    }
  }
</style>
