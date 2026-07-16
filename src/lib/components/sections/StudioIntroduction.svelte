<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";

  let section: HTMLElement;
  let portraitFrame: HTMLElement;
  let workspaceFrame: HTMLElement;

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section || !portraitFrame || !workspaceFrame)
        return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        // Desktop Animations (min-width: 1024px)
        media.add(
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          () => {
            // Main portrait frame parallax (matches ScrollImageStory movement style)
            gsap.fromTo(
              portraitFrame,
              { yPercent: 22 },
              {
                yPercent: -22,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.55,
                },
              },
            );

            // Workspace card secondary parallax (slightly offset/faster)
            gsap.fromTo(
              workspaceFrame,
              { yPercent: 32 },
              {
                yPercent: -32,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.65,
                },
              },
            );

            // Grid text reveal
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: section,
                  start: "top 72%",
                  toggleActions: "play none none reverse",
                },
              })
              .from(".title-line", {
                yPercent: 105,
                duration: 0.95,
                stagger: 0.12,
                ease: "power4.out",
              })
              .from(
                ".intro-fade",
                {
                  autoAlpha: 0,
                  y: 20,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: "power3.out",
                },
                "-=0.6",
              );
          },
        );

        // Mobile/Tablet Animations (max-width: 1023px)
        media.add(
          "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              })
              .from(".title-line", {
                yPercent: 105,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out",
              })
              .from(
                ".intro-fade",
                {
                  autoAlpha: 0,
                  y: 15,
                  duration: 0.6,
                  stagger: 0.06,
                  ease: "power3.out",
                },
                "-=0.4",
              );

            // Simple parallax on mobile scroll
            gsap.fromTo(
              portraitFrame,
              { yPercent: 12 },
              {
                yPercent: -12,
                ease: "none",
                scrollTrigger: {
                  trigger: portraitFrame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.5,
                },
              },
            );

            gsap.fromTo(
              workspaceFrame,
              { yPercent: 18 },
              {
                yPercent: -18,
                ease: "none",
                scrollTrigger: {
                  trigger: workspaceFrame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.5,
                },
              },
            );
          },
        );

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
  id="studio-introduction"
  bind:this={section}
  aria-labelledby="studio-introduction-title"
  class="section-space relative overflow-hidden bg-brand-paper py-24 sm:py-32"
>
  <!-- Background border accents -->
  <div
    class="absolute inset-x-0 top-0 h-px bg-brand-dark/10"
    aria-hidden="true"
  ></div>
  <div
    class="absolute inset-x-0 bottom-0 h-px bg-brand-dark/10"
    aria-hidden="true"
  ></div>

  <!-- Vertical Stripes Grid -->
  <div
    class="site-shell absolute inset-y-0 left-0 right-0 mx-auto pointer-events-none"
    style="background-image: linear-gradient(to right, rgb(51 46 45 / 0.045) 1px, transparent 1px); background-size: clamp(80px, 8vw, 160px) 100%;"
    aria-hidden="true"
  ></div>

  <div class="site-shell">
    <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <!-- Left Column: Eyebrow, secondary description, link -->
      <div
        class="lg:col-span-4 flex flex-col justify-between border-t border-brand-dark/10 pt-8 lg:border-t-0 lg:pt-0"
      >
        <div class="intro-fade">
          <div class="flex items-center gap-3">
            <span
              class="inline-block size-1.5 bg-brand-green"
              aria-hidden="true"
            ></span>
            <p class="eyebrow text-brand-green">Studio introduction</p>
          </div>
          <p
            class="mt-8 max-w-xs font-mono text-[0.68rem] leading-relaxed uppercase tracking-[0.12em] text-brand-dark/65"
          >
            [SCHL // EST. 2026]
            <span
              class="block mt-4 text-xs font-sans normal-case tracking-normal text-brand-dark/60"
            >
              A focused post-production partner for people building campaigns,
              catalogs, editorial stories, and visual systems.
            </span>
          </p>
        </div>

        <div class="intro-fade mt-10 lg:mt-16">
          <a
            href={resolve("/about")}
            class="text-link group/link inline-flex items-center gap-2 text-sm font-semibold text-brand-dark"
          >
            Meet the studio
            <ArrowUpRight
              size={15}
              strokeWidth={1.7}
              class="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />
          </a>
        </div>
      </div>

      <!-- Right Column: Heading and description -->
      <div
        class="lg:col-span-8 border-t border-brand-dark/10 pt-8 lg:border-t-0 lg:pt-0"
      >
        <h2
          id="studio-introduction-title"
          class="font-display text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.92] tracking-[-0.045em] text-brand-dark"
        >
          <span class="block overflow-hidden">
            <span class="title-line block">The polish should</span>
          </span>
          <span class="block overflow-hidden">
            <span class="title-line block"
              >never <span class="italic text-brand-green">overpower</span
              ></span
            >
          </span>
          <span class="block overflow-hidden">
            <span class="title-line block">the picture.</span>
          </span>
        </h2>

        <div class="mt-12 grid gap-10 sm:grid-cols-12">
          <!-- Main text description -->
          <div
            class="intro-fade sm:col-span-7 space-y-6 text-sm sm:text-base leading-relaxed text-brand-dark/75"
          >
            <p>
              Studio Click House supports image editing, retouching, and visual
              production with attention to material, light, color, and the way
              each frame belongs to the wider brand.
            </p>
            <p
              class="border-l-2 border-brand-green/30 pl-4 italic text-brand-dark/65"
            >
              The work is collaborative and production-minded: understand the
              intended use, agree on a visual reference, then carry those
              decisions consistently through the set.
            </p>
          </div>

          <!-- Technical Specs Card -->
          <div
            class="intro-fade sm:col-span-5 flex flex-col justify-between border border-brand-dark/10 bg-brand-light/40 p-6 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-brand-dark/50 shadow-sm"
          >
            <div class="space-y-3">
              <p class="text-brand-green font-bold tracking-[0.15em]">
                Retouching Standards
              </p>
              <ul
                class="space-y-2 text-[0.58rem] normal-case text-brand-dark/70"
              >
                <li>• Non-destructive frequency separation</li>
                <li>• Precision color matching & grading</li>
                <li>• High-fidelity texture preservation</li>
                <li>• Chromatic aberration corrections</li>
              </ul>
            </div>
            <div
              class="mt-8 pt-4 border-t border-brand-dark/10 flex justify-between text-[0.56rem]"
            >
              <span>System: 02</span>
              <span>EST. // 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visual Collage Area -->
    <div
      class="mt-20 lg:mt-32 grid gap-16 lg:grid-cols-12 items-start relative"
    >
      <!-- Left side: Portrait viewfinder card (Columns 1-7) -->
      <div class="lg:col-span-7 relative">
        <div
          bind:this={portraitFrame}
          class="overflow-hidden border border-brand-dark/10 bg-brand-light/30 p-3 shadow-2xl shadow-brand-dark/5 will-change-transform max-w-[32rem] mx-auto lg:mx-0"
        >
          <div class="overflow-hidden bg-brand-dark relative aspect-[4/5]">
            <img
              src={previewMedia.redStudioPortrait.src}
              alt={previewMedia.redStudioPortrait.alt}
              width={previewMedia.redStudioPortrait.width}
              height={previewMedia.redStudioPortrait.height}
              loading="lazy"
              class="size-full object-cover"
            />

            <!-- Number badge matching capabilities styling -->
            <span
              class="absolute left-3 top-3 bg-brand-dark px-2.5 py-1.5 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-brand-light z-10"
            >
              01 // EDITORIAL
            </span>
          </div>

          <div
            class="mt-4 flex justify-between font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-dark/45"
          >
            <span>Red Studio Portrait Study</span>
            <span>Proof 244-B</span>
          </div>
        </div>

        <!-- Framing Corner brackets (Outer) -->
        <span
          class="absolute -left-3 -top-3 size-8 border-l border-t border-brand-coral/60 pointer-events-none"
          aria-hidden="true"
        ></span>
        <span
          class="absolute -right-3 -bottom-3 size-8 border-r border-b border-brand-green/60 pointer-events-none"
          aria-hidden="true"
        ></span>
      </div>

      <!-- Right side: Workspace card and description (Columns 8-12) -->
      <div class="lg:col-span-5 space-y-12">
        <div
          bind:this={workspaceFrame}
          class="workspace-card relative overflow-hidden border border-brand-dark/10 bg-brand-light/30 p-2.5 shadow-xl shadow-brand-dark/5 will-change-transform max-w-[28rem] mx-auto lg:mx-0"
        >
          <div class="overflow-hidden bg-brand-dark relative aspect-[16/10]">
            <img
              src={previewMedia.editingWorkspace.src}
              alt={previewMedia.editingWorkspace.alt}
              width={previewMedia.editingWorkspace.width}
              height={previewMedia.editingWorkspace.height}
              loading="lazy"
              class="size-full object-cover"
            />

            <!-- Number badge matching capabilities styling -->
            <span
              class="absolute left-3 top-3 bg-brand-dark px-2.5 py-1.5 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-brand-light z-10"
            >
              02 // WORKSPACE
            </span>
          </div>
          <div
            class="p-4 flex items-center justify-between font-mono text-[0.56rem] uppercase tracking-[0.12em] text-brand-dark/60"
          >
            <span>Workspace environment</span>
            <span class="text-brand-green font-bold">[ONLINE]</span>
          </div>
        </div>

        <div class="intro-fade space-y-4 max-w-[28rem] mx-auto lg:mx-0">
          <p
            class="font-display text-2xl sm:text-3xl tracking-tight text-brand-dark"
          >
            Designed for scaling creative workflows.
          </p>
          <p class="text-sm leading-relaxed text-brand-dark/60">
            We operate at the intersection of photographic intent and digital
            execution. Our pipeline is custom-built to preserve color fidelity,
            contrast curves, and texture resolution across digital platforms,
            interactive layers, and high-fidelity print formats.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
