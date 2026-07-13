<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { services } from "$lib/content/home";

  let activeIndex = $state(0);
</script>

<section
  id="studio-services"
  aria-labelledby="studio-services-title"
  class="section-space bg-brand-light"
>
  <div class="site-shell">
    <div
      class="grid gap-8 border-b border-brand-dark/15 pb-12 lg:grid-cols-[1fr_1.2fr] lg:items-end"
    >
      <div>
        <p class="eyebrow text-brand-green">Capabilities</p>
        <h2
          id="studio-services-title"
          class="mt-7 font-display text-[clamp(4rem,8vw,8rem)] leading-[0.86] tracking-[-0.04em]"
        >
          Built around the image.
        </h2>
      </div>
      <p
        class="max-w-xl text-base leading-relaxed text-brand-dark/65 lg:justify-self-end"
      >
        From precise product isolation to detailed campaign finishing, the
        service mix can be shaped around the source material and final delivery.
      </p>
    </div>

    <div class="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <ol class="divide-y divide-brand-dark/15 border-t border-brand-dark/15">
        {#each services as service, index (service.slug)}
          <li>
            <a
              href={resolve("/services/[slug]", { slug: service.slug })}
              onmouseenter={() => (activeIndex = index)}
              onfocus={() => (activeIndex = index)}
              class="group grid gap-3 py-6 sm:grid-cols-[3rem_1fr_auto] sm:items-start"
              aria-describedby={`service-description-${index}`}
            >
              <span class="font-mono text-[0.65rem] text-brand-dark/40"
                >{String(index + 1).padStart(2, "0")}</span
              >
              <span>
                <span
                  class="block font-display text-3xl tracking-[-0.025em] transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl"
                  >{service.title}</span
                >
                <span
                  id={`service-description-${index}`}
                  class="mt-2 block max-w-lg text-sm leading-relaxed text-brand-dark/55"
                  >{service.description}</span
                >
              </span>
              <ArrowUpRight
                size={20}
                strokeWidth={1.5}
                class="mt-2 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </li>
        {/each}
      </ol>

      <div
        class="relative min-h-[34rem] overflow-hidden bg-brand-paper lg:sticky lg:top-28 lg:h-[calc(100dvh-9rem)] lg:max-h-[48rem]"
      >
        {#each services as service, index (service.slug)}
          <img
            src={service.media.src}
            alt={service.media.alt}
            width={service.media.width}
            height={service.media.height}
            loading="lazy"
            class="absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-out"
            class:opacity-0={activeIndex !== index}
            class:scale-105={activeIndex !== index}
            class:opacity-100={activeIndex === index}
            class:scale-100={activeIndex === index}
          />
        {/each}
        <div
          class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-brand-dark/85 to-transparent p-6 pt-24 text-brand-light"
        >
          <div>
            <p class="eyebrow text-brand-green">Active study</p>
            <p class="mt-2 font-display text-3xl">
              {services[activeIndex].title}
            </p>
          </div>
          <span
            class="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-brand-light/60"
            >Temporary preview</span
          >
        </div>
      </div>
    </div>
  </div>
</section>
