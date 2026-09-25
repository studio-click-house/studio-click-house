<script lang="ts">
  import { onMount } from "svelte";
  import { Check, ArrowRight, Eye, Smartphone, Zap } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let sectionElement = $state<HTMLElement>();

  onMount(() => {
    let ctx: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      const currentSection = sectionElement;
      if (!active || !runtime || !currentSection) return;
      const { gsap } = runtime;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".web3d-reveal", {
            y: 28,
            autoAlpha: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: currentSection,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        });
      }, currentSection);
    });

    return () => {
      active = false;
      ctx?.revert();
    };
  });
</script>

<section
  bind:this={sectionElement}
  id="threed-web"
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-28"
>
  <div class="site-shell relative z-10">
    <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <!-- Left Column: Details & Deliverables -->
      <div class="web3d-reveal space-y-6 lg:col-span-5">
        <h2 class="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.15] tracking-[-0.03em] font-bold text-brand-dark pb-0.5">
          Interactive web 3D & AR.
        </h2>

        <p class="text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed">
          Turn static product listings into interactive 3D experiences. We deliver lightweight models that load in milliseconds on Shopify, WooCommerce, and custom web stores.
        </p>

        <!-- Features List -->
        <div class="space-y-4 pt-2">
          <div class="flex items-start gap-3.5">
            <div class="flex size-7 items-center justify-center rounded-full bg-brand-green/20 text-brand-green shrink-0 mt-0.5">
              <Eye size={14} />
            </div>
            <div>
              <h3 class="font-sans text-sm font-semibold text-brand-dark">
                360-Degree Web Viewers
              </h3>
              <p class="text-xs sm:text-sm text-brand-dark/70 leading-relaxed mt-0.5">
                Shoppers can rotate, zoom, and inspect product details from any angle directly in the browser.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3.5">
            <div class="flex size-7 items-center justify-center rounded-full bg-brand-green/20 text-brand-green shrink-0 mt-0.5">
              <Zap size={14} />
            </div>
            <div>
              <h3 class="font-sans text-sm font-semibold text-brand-dark">
                Fast Loading (.GLB / .GLTF)
              </h3>
              <p class="text-xs sm:text-sm text-brand-dark/70 leading-relaxed mt-0.5">
                Compressed geometry and web-optimized texture maps that load instantly without slowing down page speed.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3.5">
            <div class="flex size-7 items-center justify-center rounded-full bg-brand-green/20 text-brand-green shrink-0 mt-0.5">
              <Smartphone size={14} />
            </div>
            <div>
              <h3 class="font-sans text-sm font-semibold text-brand-dark">
                Instant Mobile AR
              </h3>
              <p class="text-xs sm:text-sm text-brand-dark/70 leading-relaxed mt-0.5">
                Built-in Apple AR Quick Look and Android WebXR support so customers can place products in their room.
              </p>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <a
            href="/contact"
            class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-green font-bold hover:text-brand-dark transition-colors"
          >
            <span>Commission Web 3D</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <!-- Right Column: Clean Visual Showcase Stage -->
      <div class="web3d-reveal lg:col-span-7">
        <div class="group relative overflow-hidden rounded-[2.5rem] bg-brand-dark shadow-2xl aspect-[16/10] w-full">
          <img
            src="/images/portfolio/cgi-product-showcase.png"
            alt="Photorealistic commercial 3D product render with glass caustics"
            class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white/80">
            <span class="font-sans text-xs font-semibold backdrop-blur-md bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10">
              Interactive Web 3D Asset
            </span>
            <span class="font-mono text-[0.68rem] text-white/60">
              GLB &bull; USDZ &bull; 4K Renders
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
