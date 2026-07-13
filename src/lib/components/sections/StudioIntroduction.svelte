<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { previewMedia } from "$lib/content/media";
</script>

<section
  id="studio-introduction"
  aria-labelledby="studio-introduction-title"
  class="section-space bg-brand-paper"
>
  <div class="site-shell grid gap-14 lg:grid-cols-12 lg:items-start">
    <div class="lg:col-span-4 lg:pt-32">
      <p class="eyebrow text-brand-green">Studio introduction</p>
      <p class="mt-7 max-w-sm text-sm leading-relaxed text-brand-dark/60">
        A focused post-production partner for people building campaigns,
        catalogs, editorial stories, and visual systems.
      </p>
      <a href={resolve("/about")} class="text-link mt-8"
        >Meet the studio <ArrowUpRight size={16} /></a
      >
    </div>

    <div class="lg:col-span-8">
      <h2
        id="studio-introduction-title"
        class="font-display text-[clamp(3.2rem,7vw,7.75rem)] leading-[0.92] tracking-[-0.04em]"
      >
        The polish should never overpower the picture.
      </h2>
      <div class="mt-12 grid gap-7 sm:grid-cols-[1.2fr_0.8fr] sm:items-end">
        <figure class="relative">
          <img
            src={previewMedia.monochromePortrait.src}
            alt={previewMedia.monochromePortrait.alt}
            width={previewMedia.monochromePortrait.width}
            height={previewMedia.monochromePortrait.height}
            loading="lazy"
            class="aspect-[4/5] w-full object-cover grayscale"
          />
          <span
            class="absolute -left-3 -top-3 size-8 border-l border-t border-brand-coral"
            aria-hidden="true"
          ></span>
          <figcaption
            class="mt-3 flex justify-between gap-4 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-brand-dark/50"
          >
            <span>Temporary editorial study</span><span>Proof 01</span>
          </figcaption>
        </figure>
        <div class="space-y-5 text-base leading-relaxed text-brand-dark/70">
          <p>
            Studio Click House supports image editing, retouching, and visual
            production with attention to material, light, color, and the way
            each frame belongs to the wider brand.
          </p>
          <p>
            The work is collaborative and production-minded: understand the
            intended use, agree on a visual reference, then carry those
            decisions consistently through the set.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
