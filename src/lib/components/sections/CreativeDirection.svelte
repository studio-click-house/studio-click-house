<script lang="ts">
  import { previewMedia } from "$lib/content/media";

  const principles = [
    [
      "Image quality",
      "Clean technique should protect material, texture, and believable light.",
    ],
    [
      "Visual consistency",
      "A single frame can be beautiful; a set also needs to feel related.",
    ],
    [
      "Retouching decisions",
      "Every correction should have a reason tied to the image and its use.",
    ],
    [
      "Brand presentation",
      "Finishing choices should reinforce the wider visual language.",
    ],
    [
      "Collaboration",
      "Clear references and consolidated feedback keep production focused.",
    ],
    [
      "Detail and craft",
      "Small decisions matter most when they disappear into the final image.",
    ],
  ];
</script>

<section
  id="creative-direction"
  aria-labelledby="creative-direction-title"
  class="section-space overflow-hidden bg-brand-dark text-brand-light"
>
  <div class="site-shell">
    <div class="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
      <div>
        <p class="eyebrow text-brand-green">Creative direction</p>
        <h2
          id="creative-direction-title"
          class="mt-8 font-display text-[clamp(4rem,8vw,8.25rem)] leading-[0.86] tracking-[-0.04em]"
        >
          Consistency is a creative decision.
        </h2>
      </div>
      <figure class="relative lg:translate-y-24">
        <img
          src={previewMedia.jewelryDetail.src}
          alt={previewMedia.jewelryDetail.alt}
          width={previewMedia.jewelryDetail.width}
          height={previewMedia.jewelryDetail.height}
          loading="lazy"
          class="aspect-[4/5] w-full object-cover"
        />
        <figcaption
          class="absolute inset-x-0 bottom-0 bg-brand-dark/75 p-4 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-brand-light/60 backdrop-blur-sm"
        >
          Material study · temporary preview media
        </figcaption>
      </figure>
    </div>

    <ol
      class="mt-20 grid border-t border-brand-light/20 sm:grid-cols-2 lg:mt-36 lg:grid-cols-3"
    >
      {#each principles as principle, index (principle[0])}
        <li
          class="border-b border-brand-light/20 p-6 sm:odd:border-r lg:border-r lg:nth-[3n]:border-r-0"
        >
          <span class="font-mono text-[0.65rem] text-brand-green"
            >{String(index + 1).padStart(2, "0")}</span
          >
          <h3 class="mt-10 font-display text-3xl">{principle[0]}</h3>
          <p class="mt-4 text-sm leading-relaxed text-brand-light/60">
            {principle[1]}
          </p>
        </li>
      {/each}
    </ol>
  </div>
</section>
