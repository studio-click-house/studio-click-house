<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { cn } from "$lib/utils";

  interface Props {
    className?: string;
    images?: {
      topLeft: string;
      topRight: string;
      bottomLeft: string;
      bottomRight: string;
    };
  }

  let {
    className = "",
    images = {
      topLeft: "https://images.unsplash.com/photo-1741454570867-4a10f31fc5e3?q=100&w=2832&fm=webp&auto=format&fit=crop",
      topRight: "https://images.unsplash.com/photo-1755456068400-fbcdce2f795a?q=100&w=2832&fm=webp&auto=format&fit=crop",
      bottomLeft: "https://images.unsplash.com/photo-1755456068249-13d384440902?q=100&w=2832&fm=webp&auto=format&fit=crop",
      bottomRight: "https://images.unsplash.com/photo-1741454570904-a22d9d6ea511?q=100&w=2832&fm=webp&auto=format&fit=crop",
    }
  }: Props = $props();

  let containerRef = $state<HTMLDivElement | null>(null);
  let tlImg = $state<HTMLDivElement | null>(null);
  let trImg = $state<HTMLDivElement | null>(null);
  let blImg = $state<HTMLDivElement | null>(null);
  let brImg = $state<HTMLDivElement | null>(null);

  onMount(() => {
    let context: any;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      if (
        !active ||
        !runtime ||
        !containerRef ||
        !tlImg ||
        !trImg ||
        !blImg ||
        !brImg
      ) {
        return;
      }

      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        // 1. Desktop Layout Animations (768px and up)
        media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
          gsap.set(tlImg, { x: "-20vw", y: "-14vh", opacity: 1 });
          gsap.set(brImg, { x: "20vw", y: "14vh", opacity: 1 });
          gsap.set(blImg, { x: "-20vw", y: "14vh", opacity: 1 });
          gsap.set(trImg, { x: "20vw", y: "-14vh", width: "36vw", height: "24vh", opacity: 1 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              refreshPriority: 100,
              invalidateOnRefresh: true,
            },
          });

          // Phase 1 (0.0 -> 0.3): Top-Left moves down, Bottom-Right moves up
          tl.to(tlImg, { y: "14vh", ease: "none", duration: 0.3 }, 0);
          tl.to(brImg, { y: "-14vh", ease: "none", duration: 0.3 }, 0);

          // Phase 2 (0.35 -> 0.65): Stack all at the center (x: 0, y: 0)
          tl.to([tlImg, brImg, blImg, trImg], { x: "0vw", y: "0vh", ease: "none", duration: 0.3 }, 0.35);

          // Phase 3 (0.65 -> 0.9): Hero expands to fill viewport
          tl.to(trImg, { width: "100vw", height: "100vh", ease: "none", duration: 0.25 }, 0.65);

          // Phase 4 (0.75 -> 0.85): Other images underneath fade out
          tl.to([tlImg, brImg, blImg], { opacity: 0, ease: "none", duration: 0.1 }, 0.75);
        });

        // 2. Mobile Layout Animations (under 768px)
        media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
          gsap.set(tlImg, { x: "-22vw", y: "-12vh", opacity: 1 });
          gsap.set(brImg, { x: "22vw", y: "12vh", opacity: 1 });
          gsap.set(blImg, { x: "-22vw", y: "12vh", opacity: 1 });
          gsap.set(trImg, { x: "22vw", y: "-12vh", width: "42vw", height: "20vh", opacity: 1 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              refreshPriority: 100,
              invalidateOnRefresh: true,
            },
          });

          // Phase 1 (0.0 -> 0.3): Top-Left moves down, Bottom-Right moves up
          tl.to(tlImg, { y: "12vh", ease: "none", duration: 0.3 }, 0);
          tl.to(brImg, { y: "-12vh", ease: "none", duration: 0.3 }, 0);

          // Phase 2 (0.35 -> 0.65): Stack all at the center
          tl.to([tlImg, brImg, blImg, trImg], { x: "0vw", y: "0vh", ease: "none", duration: 0.3 }, 0.35);

          // Phase 3 (0.65 -> 0.9): Hero expands to fill viewport
          tl.to(trImg, { width: "100vw", height: "100vh", ease: "none", duration: 0.25 }, 0.65);

          // Phase 4 (0.75 -> 0.85): Other images fade out
          tl.to([tlImg, brImg, blImg], { opacity: 0, ease: "none", duration: 0.1 }, 0.75);
        });

        // 3. Fallback for users who prefer reduced motion
        media.add("(prefers-reduced-motion: reduce)", () => {
          gsap.set(trImg, { x: "0vw", y: "0vh", width: "100vw", height: "100vh", opacity: 1 });
          gsap.set([tlImg, brImg, blImg], { opacity: 0 });
        });
      });
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<div
  bind:this={containerRef}
  id="scroll-choreography-section"
  class={cn("relative h-[300vh] w-full bg-brand-dark overflow-clip", className)}
>
  <div class="sticky top-0 h-screen w-full overflow-hidden">
    <div class="absolute inset-0 flex items-center justify-center">
      <!-- Top Left Image -->
      <div
        bind:this={tlImg}
        class="absolute left-1/2 top-1/2 w-[42vw] h-[20vh] md:w-[36vw] md:h-[24vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-brand-dark/20 shadow-2xl will-change-transform z-10"
      >
        <img
          src={images.topLeft}
          alt="Workflow Subject Isolation Detail"
          class="h-full w-full object-cover select-none"
          loading="eager"
        />
      </div>

      <!-- Bottom Right Image -->
      <div
        bind:this={brImg}
        class="absolute left-1/2 top-1/2 w-[42vw] h-[20vh] md:w-[36vw] md:h-[24vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-brand-dark/20 shadow-2xl will-change-transform z-20"
      >
        <img
          src={images.bottomRight}
          alt="Precision Clipping Paths"
          class="h-full w-full object-cover select-none"
          loading="eager"
        />
      </div>

      <!-- Bottom Left Image -->
      <div
        bind:this={blImg}
        class="absolute left-1/2 top-1/2 w-[42vw] h-[20vh] md:w-[36vw] md:h-[24vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-brand-dark/20 shadow-2xl will-change-transform z-30"
      >
        <img
          src={images.bottomLeft}
          alt="Studio Visual Editing Showcase"
          class="h-full w-full object-cover select-none"
          loading="eager"
        />
      </div>

      <!-- Top Right Image (Hero - expands to full viewport) -->
      <div
        bind:this={trImg}
        class="absolute left-1/2 top-1/2 w-[42vw] h-[20vh] md:w-[36vw] md:h-[24vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-brand-dark/20 shadow-2xl will-change-transform z-40 origin-center"
      >
        <img
          src={images.topRight}
          alt="Studio Click House Hero Cover"
          class="h-full w-full object-cover select-none"
          loading="eager"
        />
      </div>
    </div>
  </div>
</div>
