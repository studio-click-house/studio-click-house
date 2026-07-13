<script lang="ts">
  import { MessageSquareQuote } from "lucide-svelte";
  import { testimonials } from "$lib/content/home";
</script>

<section
  id="client-testimonials"
  aria-labelledby="client-testimonials-title"
  class="section-space bg-brand-paper"
>
  <div class="site-shell grid gap-14 lg:grid-cols-12">
    <div class="lg:col-span-4">
      <p class="eyebrow text-brand-green">Client notes</p>
      <h2
        id="client-testimonials-title"
        class="mt-7 font-display text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl"
      >
        Proof belongs to the people who commissioned the work.
      </h2>
    </div>
    <div class="lg:col-span-8 lg:pt-28">
      {#if testimonials.length}
        <div
          class="divide-y divide-brand-dark/15 border-y border-brand-dark/15"
        >
          {#each testimonials as testimonial (`${testimonial.name}-${testimonial.company}`)}
            <blockquote class="py-8">
              <p class="font-display text-3xl">“{testimonial.quote}”</p>
              <footer class="mt-5 text-sm">
                {testimonial.name}, {testimonial.company}
              </footer>
            </blockquote>
          {/each}
        </div>
      {:else}
        <div
          role="status"
          class="grid min-h-80 content-between border-y border-brand-dark/15 py-8"
        >
          <MessageSquareQuote
            size={40}
            strokeWidth={1.25}
            class="text-brand-green"
          />
          <div>
            <p class="font-display text-4xl sm:text-5xl">
              Client stories will live here.
            </p>
            <p class="mt-4 max-w-xl text-sm leading-relaxed text-brand-dark/60">
              Verified testimonials, names, and companies will be added only
              after they are supplied and approved. The section is ready for
              that content now.
            </p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
