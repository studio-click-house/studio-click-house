<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { cn } from "$lib/utils";

  export interface CollectionItem {
    id: number;
    image: string;
    title: string;
  }

  export type CollectionSurferVariant = "magnetic" | "uplift" | "simple";

  interface Props {
    items?: CollectionItem[];
    variant?: CollectionSurferVariant;
    className?: string;
  }

  const DEFAULT_ITEMS: CollectionItem[] = [
    { id: 1, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", title: "HERITAGE 01" },
    { id: 2, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", title: "HERITAGE 02" },
    { id: 3, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", title: "HERITAGE 03" },
    { id: 4, image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80", title: "HERITAGE 04" },
    { id: 5, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80", title: "HERITAGE 05" },
    { id: 6, image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80", title: "HERITAGE 06" },
    { id: 7, image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80", title: "HERITAGE 07" },
    { id: 8, image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80", title: "HERITAGE 08" },
    { id: 9, image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&q=80", title: "HERITAGE 09" },
    { id: 10, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80", title: "HERITAGE 10" },
    { id: 11, image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", title: "HERITAGE 11" },
    { id: 12, image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", title: "HERITAGE 12" },
    { id: 13, image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80", title: "HERITAGE 13" },
    { id: 14, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80", title: "HERITAGE 14" },
    { id: 15, image: "https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=800&q=80", title: "HERITAGE 15" },
    { id: 16, image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800&q=80", title: "HERITAGE 16" },
  ];

  let {
    items = DEFAULT_ITEMS,
    variant = "magnetic",
    className = "",
  }: Props = $props();

  const duplicatedItems = $derived([...items, ...items]);
  const scrollPerItem = 600;
  const loopDistance = $derived(items.length * scrollPerItem);

  const stepX = 240;
  const stepY = -84;
  const stepZ = -288;

  let containerRef = $state<HTMLDivElement | null>(null);
  let viewportRef = $state<HTMLDivElement | null>(null);
  let trackRef = $state<HTMLDivElement | null>(null);
  let cardElements = $state<HTMLDivElement[]>([]);

  // Smooth scroll tracking variables
  let targetScrollY = 0;
  let currentScrollY = 0;

  // Mouse positions
  let mouseX = -10000;
  let mouseY = -10000;

  // Local card state cache to animate scale and uplift
  let cardStates = $derived.by(() => {
    return Array.from({ length: duplicatedItems.length }, () => ({
      scale: 1,
      uplift: 0,
    }));
  });

  const handleMouseMove = (e: MouseEvent) => {
    if (variant === "simple") return;
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  const handleMouseLeave = () => {
    if (variant === "simple") return;
    mouseX = -10000;
    mouseY = -10000;
  };

  onMount(() => {
    let context: any;
    let active = true;

    const updateTimeline = () => {
      if (!active) return;

      // Smooth scroll lerping (spring factor: 0.12)
      currentScrollY += (targetScrollY - currentScrollY) * 0.12;

      // Positive modulo loop distance calculation
      const loopedProgress = ((currentScrollY % loopDistance) + loopDistance) % loopDistance;
      const progressPercent = loopedProgress / loopDistance;

      const trackX = -items.length * stepX * progressPercent;
      const trackY = -items.length * stepY * progressPercent;
      const trackZ = -items.length * stepZ * progressPercent;

      if (trackRef) {
        gsap.set(trackRef, {
          x: trackX,
          y: trackY,
          z: trackZ,
        });
      }

      // Compute distances and animate each card custom properties
      cardElements.forEach((card, idx) => {
        if (!card) return;
        let targetScale = 1;
        let targetUplift = 0;

        if (variant !== "simple" && mouseX !== -10000) {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dist = Math.sqrt(
            Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
          );

          if (dist < 400) {
            const factor = 1 - dist / 400; // 0 to 1
            if (variant === "magnetic") {
              targetScale = 1 + 0.35 * factor; // scale up to 1.35
            } else if (variant === "uplift") {
              targetUplift = -70 * factor; // move up to -70px
            }
          }
        }

        const state = cardStates[idx];
        if (state) {
          state.scale += (targetScale - state.scale) * 0.15;
          state.uplift += (targetUplift - state.uplift) * 0.15;

          gsap.set(card, {
            "--scale": state.scale,
            "--uplift": `${state.uplift}px`,
          });
        }
      });
    };

    let gsap: any;
    let ScrollTrigger: any;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !containerRef || !viewportRef) return;

      gsap = runtime.gsap;
      ScrollTrigger = runtime.ScrollTrigger;

      context = gsap.context(() => {
        // Create ScrollTrigger to pin the viewport container
        ScrollTrigger.create({
          trigger: containerRef,
          start: () => window.innerWidth < 768 ? "top 15%" : "top 10%",
          end: "+=8000", // Pinned scroll track height
          pin: viewportRef,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self: any) => {
            targetScrollY = self.scroll() - self.start;
          },
        });

        // Add updateTimeline to GSAP Ticker
        gsap.ticker.add(updateTimeline);
      });
    });

    return () => {
      active = false;
      if (gsap && gsap.ticker) {
        gsap.ticker.remove(updateTimeline);
      }
      if (context) {
        context.revert();
      }
    };
  });
</script>

<div
  bind:this={containerRef}
  id="collection-surfer-section"
  class={cn("relative bg-black w-full", className)}
  style="height: calc(80vh + 8000px);"
>
  <!-- Pinned Viewport Container -->
  <div
    bind:this={viewportRef}
    class="w-full h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center relative select-none"
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    role="region"
    aria-label="Collection Gallery"
  >
    <!-- Background Vignette/Grid Overlay -->
    <div class="absolute inset-0 bg-radial-[circle_at_center,rgba(24,24,27,0.15)_0%,rgba(0,0,0,0.85)_100%] pointer-events-none z-10"></div>

    <!-- UI Overlays -->
    <div class="absolute top-[5vh] left-[5vw] z-50 pointer-events-none mix-blend-difference text-white">
      <h2 class="font-bold text-[clamp(1.5rem,5vw,3.5rem)] leading-[0.9] tracking-tighter">
        HERITAGE FW25/26
      </h2>
      <h2 class="font-bold text-[clamp(1.5rem,5vw,3.5rem)] leading-[0.9] tracking-tighter text-brand-green">
        COLLECTION
        <span class="text-[0.4em] align-top relative top-[0.6em] ml-2 font-mono text-white/50">
          ({items.length})
        </span>
      </h2>
    </div>

    <div class="absolute bottom-[5vh] right-[5vw] z-50 font-mono text-xs tracking-wider uppercase opacity-70 text-white pointer-events-none">
      scroll to surf
    </div>

    <!-- 3D Scene Viewport -->
    <div
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
      style="perspective: 2000px; perspective-origin: 10% 10%;"
    >
      <!-- Animated Track -->
      <div
        bind:this={trackRef}
        class="relative w-0 h-0 pointer-events-auto"
        style="transform-style: preserve-3d;"
      >
        {#each duplicatedItems as item, i}
          <div
            bind:this={cardElements[i]}
            class="absolute w-[240px] h-[320px] md:w-[300px] md:h-[400px] -ml-[120px] -mt-[160px] md:-ml-[150px] md:-mt-[200px] bg-neutral-900 overflow-hidden shadow-2xl transition-colors duration-500 ease-out group"
            style="
              --scale: 1;
              --uplift: 0px;
              transform: translate3d({i * stepX}px, calc({i * stepY}px + var(--uplift)), {i * stepZ}px) rotateY(-50deg) scale(var(--scale));
              transform-style: preserve-3d;
            "
          >
            <!-- Card Index Badge -->
            <div class="absolute top-4 left-4 z-20 text-white font-mono text-xs opacity-50 transition-opacity group-hover:opacity-100">
              {String((i % items.length) + 1).padStart(2, '0')}
            </div>

            <!-- Card Image -->
            <div class="relative w-full h-full brightness-75 group-hover:brightness-100 transition-all duration-300">
              <img
                src={item.image}
                alt={item.title}
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- Ambient Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10"></div>

            <!-- Title Overlay on Hover -->
            <div class="absolute bottom-5 left-5 z-20 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
              <span class="font-mono text-[10px] text-white/50 block tracking-widest">PRODUCT CODE</span>
              <span class="font-heading font-bold text-sm tracking-tight text-white uppercase">{item.title}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
