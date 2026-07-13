<script lang="ts">
  import { faqs } from "$lib/content/home";
</script>

<section
  id="faq-section"
  aria-labelledby="faq-section-title"
  class="section-space bg-brand-paper"
>
  <div class="site-shell grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
    <div class="lg:sticky lg:top-32 lg:self-start">
      <p class="eyebrow text-brand-green">Working together</p>
      <h2
        id="faq-section-title"
        class="mt-7 font-display text-6xl leading-[0.9] tracking-[-0.04em] sm:text-7xl"
      >
        Questions before the first file.
      </h2>
    </div>
    <div class="border-t border-brand-dark/20">
      {#each faqs as item, index (item.question)}
        <details
          id={`faq-item-${index + 1}`}
          class="group border-b border-brand-dark/20"
          open={index === 0}
        >
          <summary
            class="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-6 py-7 text-left [&::-webkit-details-marker]:hidden"
          >
            <h3 class="font-display text-2xl tracking-[-0.02em] sm:text-3xl">
              {item.question}
            </h3>
            <span
              aria-hidden="true"
              class="font-mono text-2xl transition-transform group-open:rotate-45"
              >+</span
            >
          </summary>
          <p
            class="max-w-2xl pb-8 pr-12 text-sm leading-relaxed text-brand-dark/65 sm:text-base"
          >
            {item.answer}
          </p>
        </details>
      {/each}
    </div>
  </div>
</section>
