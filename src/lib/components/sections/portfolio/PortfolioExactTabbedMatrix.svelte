<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";

  let sectionElement = $state<HTMLElement | null>(null);

  interface DisciplineItem {
    index: string;
    title: string;
    category: string;
    desc: string;
    videoSrc?: string;
    imageSrc?: string;
    poster?: string;
    href: string;
  }

  const disciplines: DisciplineItem[] = [
    {
      index: "01",
      title: "Editorial Retouching",
      category: "Fashion & Beauty",
      desc: "High-end beauty and fashion campaigns refined with natural skin texture and couture fabric sculpting.",
      imageSrc: "/images/services/model-beauty/beauty-editorial-glam-makeup-retouch-0969-after.webp",
      href: "/services/model-beauty-retouching",
    },
    {
      index: "02",
      title: "Commercial Video",
      category: "Motion & Film",
      desc: "Cinematic commercial edits, DaVinci Resolve color grading, and dynamic multi-platform cutdowns.",
      videoSrc: "/images/video-editing/Fashion_editorial_montage_creation_1080p_20261001180512.mp4",
      poster: "/images/about/orbit/ai-video-editing.jpg",
      href: "/services/video-editing",
    },
    {
      index: "03",
      title: "3D CGI & Staging",
      category: "Virtual Product",
      desc: "Photorealistic 3D product modeling, ray-traced studio lighting, and virtual environments without physical samples.",
      videoSrc: "/images/video-editing/Cosmetic_jar_with_floating_gummies_20261001165911.mp4",
      poster: "/images/portfolio/3d-cgi-showcase-v2.webp",
      href: "/services/3d-product-modeling",
    },
    {
      index: "04",
      title: "Catalog & Paths",
      category: "High-Volume E-Commerce",
      desc: "Industrial catalog production, hand-drawn vector clipping paths, ghost mannequin, and calibrated colorways.",
      imageSrc: "/images/services/bags-accessories/accessories-quinn-metallic-gold-bag-01-after.webp",
      href: "/services/ecommerce-retouching",
    },
  ];

  onMount(() => {
    let active = true;
    let ctx: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionElement) return;
      const { gsap } = runtime;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".discipline-col", {
            y: 32,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: sectionElement,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        });
      }, sectionElement);
    });

    return () => {
      active = false;
      ctx?.revert();
    };
  });
</script>

<section
  id="portfolio-disciplines"
  bind:this={sectionElement}
  aria-label="Studio Disciplines and Scopes"
  class="relative w-full bg-brand-light py-14 sm:py-18 lg:py-24"
>
  <div class="site-shell relative z-10">
    <!-- Editorial Section Header -->
    <div class="mb-12 sm:mb-16 lg:mb-20">
      <p class="font-mono text-[0.64rem] font-bold uppercase tracking-[0.2em] text-brand-dark/50 mb-3">
        {$_('portfolio.matrix.eyebrow') || '06 / Disciplines & Scopes'}
      </p>
      <h2 class="max-w-[20ch] font-display text-[length:var(--text-section)] leading-[0.98] tracking-[-0.04em] text-brand-dark mb-4">
        {$_('portfolio.matrix.headingPart1') || 'How we enforce'} <span class="italic font-light text-brand-green">{$_('portfolio.matrix.headingPart2') || 'precision'}</span> {$_('portfolio.matrix.headingPart3') || 'at scale.'}
      </h2>
      <p class="max-w-[44ch] text-sm sm:text-base text-brand-dark/65 leading-relaxed font-normal">
        {$_('portfolio.matrix.description') || 'Explore our primary disciplines spanning campaign fashion retouching, commercial video motion, 3D CGI, and high-volume e-commerce production.'}
      </p>
    </div>

    <!-- 4-Column Editorial Discipline Spread: Clean, focused, uncluttered -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-7 xl:gap-8 items-stretch">
      {#each disciplines as item (item.index)}
        <div class="discipline-col group flex flex-col justify-between">
          <div>
            <!-- Media Frame: Architectural portrait window with subtle hover glide -->
            <div class="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-brand-dark/5 mb-6 border border-brand-dark/10 shadow-xs">
              {#if item.videoSrc}
                <video
                  src={item.videoSrc}
                  poster={item.poster}
                  playsinline
                  loop
                  muted
                  autoplay
                  preload="metadata"
                  class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  aria-label="{item.title} video demonstration"
                ></video>
              {:else if item.imageSrc}
                <img
                  src={item.imageSrc}
                  alt="{item.title} preview"
                  class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              {/if}
            </div>

            <!-- Number + Category -->
            <div class="flex items-baseline justify-between gap-2 mb-2.5">
              <span class="font-mono text-xs font-bold text-brand-green tracking-wider">
                {item.index} //
              </span>
              <span class="font-mono text-[0.68rem] uppercase tracking-wider text-brand-dark/45 font-medium">
                {item.category}
              </span>
            </div>

            <!-- Title -->
            <h3 class="font-display text-2xl lg:text-[1.65rem] font-normal leading-[1.1] tracking-tight text-brand-dark mb-3">
              {item.title}
            </h3>

            <!-- Clean, Concise Editorial Description -->
            <p class="text-xs sm:text-sm text-brand-dark/65 leading-relaxed font-normal mb-6">
              {item.desc}
            </p>
          </div>

          <!-- Direct Link with Hairline Rule -->
          <div class="pt-3 border-t border-brand-dark/10">
            <a
              href={item.href}
              class="group/link inline-flex items-center gap-1.5 text-xs font-semibold tracking-tight text-brand-dark hover:text-brand-green transition-colors"
            >
              <span>Explore discipline</span>
              <span class="inline-block transition-transform duration-200 group-hover/link:translate-x-1" aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
