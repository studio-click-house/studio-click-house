<script lang="ts">
  import { onMount } from "svelte";
  import { MessageSquareQuote } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { testimonials } from "$lib/content/home";
  import { _ } from "svelte-i18n";

  let sectionRef: HTMLElement;

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !sectionRef) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: sectionRef,
                start: "top 88%",
                once: true,
              },
            })
            .from(".director-header-reveal", {
              autoAlpha: 0,
              y: 24,
              duration: 0.75,
              stagger: 0.08,
              ease: "power2.out",
              clearProps: "all",
            })
            .from(
              ".director-quote-reveal",
              {
                autoAlpha: 0,
                y: 28,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
                clearProps: "all",
              },
              "-=0.45",
            );
        });
      }, sectionRef);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<section
  id="director-message"
  bind:this={sectionRef}
  aria-labelledby="director-message-title"
  class="section-space bg-brand-dark text-brand-light"
>
  <div class="site-shell grid gap-14 lg:grid-cols-12">
    <div class="lg:col-span-4">
      <p class="director-header-reveal eyebrow text-brand-green font-semibold">
        {$_('about.directorsMessage.eyebrow') || 'From the Creative Director'}
      </p>
      <h2
        id="director-message-title"
        class="director-header-reveal mt-7 font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.035em]"
      >
        {$_('about.directorsMessage.title') || 'Driven by dedication and ready for every challenge.'}
      </h2>
    </div>
    <div class="lg:col-span-8 lg:pt-14">
      {#if testimonials.length}
        <div
          class="divide-y divide-brand-light/15 border-y border-brand-light/15"
        >
          {#each testimonials as testimonial, index (`${testimonial.name}-${testimonial.company}`)}
            <blockquote
              class="director-quote-reveal py-8 flex flex-col gap-6 md:flex-row md:items-start md:gap-8"
            >
              {#if testimonial.avatar}
                <div
                  class="size-16 md:size-20 shrink-0 rounded-full overflow-hidden border border-brand-light/15 bg-brand-light/5 transition-all duration-300 hover:border-brand-green/60 hover:scale-[1.04]"
                >
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    class="size-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              {/if}
              <div class="flex-1 space-y-4">
                <p class="director-quote relative font-display text-2xl md:text-3xl leading-snug">
                  <span class="director-quote-mark" aria-hidden="true">“</span>
                  {$_(`about.directorsMessage.testimonials.${index}.quote`) || testimonial.quote}
                </p>
                <footer class="text-sm flex items-center gap-3">
                  <div class="h-px w-8 bg-brand-green/50"></div>
                  <div>
                    <cite
                      class="not-italic font-bold text-brand-light block sm:inline"
                    >
                      {testimonial.name}
                    </cite>
                    <span
                      class="text-brand-light/65 text-xs block sm:inline sm:before:content-['//'] sm:before:mx-1 font-mono"
                    >
                      {#if testimonial.role}
                        {$_(`about.directorsMessage.testimonials.${index}.role`) || testimonial.role},
                      {/if}{testimonial.company}
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
              {$_('about.directorsMessage.emptyTitle') || 'Client stories will live here.'}
            </p>
            <p class="mt-4 max-w-xl text-sm leading-relaxed text-brand-light/65">
              {$_('about.directorsMessage.emptyDescription') || 'Verified testimonials, names, and companies will be added only after they are supplied and approved. The section is ready for that content now.'}
            </p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .director-quote-mark {
    position: absolute;
    top: -0.35em;
    left: -0.08em;
    font-family: var(--font-display);
    font-size: 3.5em;
    line-height: 1;
    color: var(--color-brand-green);
    opacity: 0.35;
    pointer-events: none;
    user-select: none;
  }
</style>
