<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { ArrowUpRight } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";

  let reveal = $state(56);
  let section: HTMLElement;

  onMount(() => {
    let context: { revert: () => void } | undefined;
    let active = true;
    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      context = runtime.gsap.context(() => {
        const media = runtime.gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          runtime.gsap.from(".work-reveal", {
            yPercent: 10,
            scale: 0.94,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "center 55%",
              scrub: 0.7,
            },
          });
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
  id="selected-work"
  bind:this={section}
  aria-labelledby="selected-work-title"
  class="section-space bg-brand-light"
>
  <div class="site-shell">
    <div class="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
      <div>
        <p class="eyebrow text-brand-green">Selected work interaction</p>
        <h2
          id="selected-work-title"
          class="mt-7 font-display text-[clamp(4rem,8vw,8rem)] leading-[0.88] tracking-[-0.04em]"
        >
          The difference is in the decisions.
        </h2>
      </div>
      <div class="lg:pb-3">
        <p class="max-w-lg text-sm leading-relaxed text-brand-dark/60">
          Use the comparison control to inspect a visual finishing study. This
          temporary preview demonstrates the interaction, not Studio Click House
          client work.
        </p>
        <a href={resolve("/portfolio")} class="text-link mt-7"
          >View portfolio <ArrowUpRight size={16} /></a
        >
      </div>
    </div>

    <div
      class="work-reveal relative mt-14 overflow-hidden bg-brand-dark will-change-transform"
    >
      <div class="relative aspect-[4/5] sm:aspect-[16/9]">
        <img
          src={previewMedia.studioPortrait.src}
          alt="Unfinished visual study with muted color and contrast"
          width={previewMedia.studioPortrait.width}
          height={previewMedia.studioPortrait.height}
          loading="lazy"
          class="absolute inset-0 size-full object-cover grayscale contrast-75 brightness-90"
        />
        <div
          class="absolute inset-0 overflow-hidden"
          style={`clip-path: inset(0 ${100 - reveal}% 0 0)`}
        >
          <img
            src={previewMedia.studioPortrait.src}
            alt="Finished visual study with restored color and contrast"
            width={previewMedia.studioPortrait.width}
            height={previewMedia.studioPortrait.height}
            loading="lazy"
            class="absolute inset-0 size-full max-w-none object-cover"
          />
        </div>
        <div
          class="pointer-events-none absolute inset-y-0 w-px bg-brand-light"
          style={`left: ${reveal}%`}
          aria-hidden="true"
        >
          <span
            class="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-light bg-brand-dark/75 font-mono text-xs text-brand-light backdrop-blur-sm"
            >↔</span
          >
        </div>
        <span
          class="absolute left-4 top-4 bg-brand-dark/75 px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-brand-light"
          >Finished</span
        >
        <span
          class="absolute right-4 top-4 bg-brand-dark/75 px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-brand-light"
          >Source study</span
        >
        <label
          class="absolute inset-x-4 bottom-4 bg-brand-dark/80 p-4 text-brand-light backdrop-blur-sm sm:inset-x-auto sm:left-1/2 sm:w-80 sm:-translate-x-1/2"
        >
          <span
            class="mb-3 flex justify-between font-mono text-[0.6rem] uppercase tracking-[0.12em]"
            ><span>Compare finishing</span><span>{reveal}%</span></span
          >
          <input
            type="range"
            min="10"
            max="90"
            bind:value={reveal}
            aria-label="Adjust before and after image comparison"
            class="w-full accent-brand-green"
          />
        </label>
      </div>
    </div>
  </div>
</section>
