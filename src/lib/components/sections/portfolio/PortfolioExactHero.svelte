<script lang="ts">
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { _ } from "svelte-i18n";

  let heroSection = $state<HTMLElement | null>(null);
  let heroVideo = $state<HTMLVideoElement | null>(null);

  $effect(() => {
    if (heroVideo) {
      heroVideo.muted = true;
      heroVideo.defaultMuted = true;
      void heroVideo.play().catch(() => {});
    }
  });

  $effect(() => {
    if (!heroSection) return;
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !heroSection) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".hero-anim-item", {
            y: 30,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
          });
        });
        return () => media.revert();
      }, heroSection);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="portfolio-hero-banner"
  bind:this={heroSection}
  aria-label="Portfolio Hero"
  class="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-brand-dark pt-24 md:pt-28"
>
  <video
    bind:this={heroVideo}
    poster="/images/portfolio/portfolio-fashion-studio-hero.jpg"
    autoplay
    loop
    muted
    playsinline
    preload="auto"
    class="absolute inset-0 h-full w-full object-cover object-center scale-105"
    aria-label="Fashion photographer taking photos of a model during a creative studio shoot"
  >
    <source
      src="/videos/work-fields-studio-production.mp4"
      type="video/mp4"
    />
    <source
      src="https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-model-in-a-studio-41484-large.mp4"
      type="video/mp4"
    />
  </video>

  <div class="absolute inset-0 bg-brand-dark/38"></div>
  <div class="absolute inset-0 bg-brand-green/25 mix-blend-color"></div>
  <div
    class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-dark/55 to-transparent"
  ></div>

  <div class="site-shell relative z-10 flex flex-col items-center text-center text-brand-light">
    <h1
      class="hero-anim-item select-none text-[clamp(6.5rem,21vw,18rem)] leading-[0.72] tracking-[-0.085em] text-brand-light drop-shadow-[0_8px_30px_rgba(0,0,0,0.32)]"
      style="font-family: 'Playfair Display', Georgia, serif; font-style: italic;"
    >
      {$_('portfolio.hero.title') || 'Archive'}
    </h1>

    <p
      class="hero-anim-item mt-8 max-w-xl text-sm font-semibold uppercase leading-relaxed tracking-[0.14em] text-brand-light md:text-lg"
    >
      {$_('portfolio.hero.subtitle') || 'High-end post-production and creative finishing'}
    </p>
  </div>
</section>
