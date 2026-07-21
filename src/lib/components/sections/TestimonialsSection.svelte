<script lang="ts">
  import { MessageSquareQuote } from "lucide-svelte";
  import { testimonials } from "$lib/content/home";
</script>

<section
  id="client-testimonials"
  aria-labelledby="client-testimonials-title"
  class="section-space bg-brand-dark text-brand-light"
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
    <div class="lg:col-span-8 lg:pt-14">
      {#if testimonials.length}
        <div
          class="divide-y divide-brand-light/15 border-y border-brand-light/15"
        >
          {#each testimonials as testimonial (`${testimonial.name}-${testimonial.company}`)}
            <blockquote
              class="py-8 flex flex-col gap-6 md:flex-row md:items-start md:gap-8"
            >
              {#if testimonial.avatar}
                <div
                  class="size-16 md:size-20 shrink-0 rounded-full overflow-hidden border border-brand-green/30 bg-brand-light/5"
                >
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    class="size-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              {/if}
              <div class="flex-1 space-y-4">
                <p class="font-display text-2xl md:text-3xl leading-snug">
                  “{testimonial.quote}”
                </p>
                <footer class="text-sm flex items-center gap-3">
                  <div class="h-px w-6 bg-brand-green/50"></div>
                  <div>
                    <cite class="not-italic font-bold text-brand-light block sm:inline">
                      {testimonial.name}
                    </cite>
                    <span
                      class="text-brand-light/60 text-xs block sm:inline sm:before:content-['//_'] sm:before:mx-1"
                    >
                      {#if testimonial.role}{testimonial.role}, {/if}{testimonial.company}
                    </span>
                  </div>
                </footer>
              </div>
            </blockquote>
          {/each}
        </div>
      {:else}
        <div
          role="status"
          class="grid min-h-64 content-between border-y border-brand-light/15 py-7"
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
            <p
              class="mt-4 max-w-xl text-sm leading-relaxed text-brand-light/60"
            >
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
