<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
</script>

<section
  id="events-closing"
  class="bg-brand-paper pb-20 pt-12 text-brand-dark sm:pb-24 lg:pb-28"
>
  <div class="site-shell" data-event-closing>
    <div
      class="relative overflow-hidden grid gap-8 rounded-[1.5rem] bg-brand-dark text-brand-light p-7 sm:p-10 lg:grid-cols-12 lg:items-end lg:p-12"
    >
      <!-- Ambient Glow Effect -->
      <div class="pointer-events-none absolute -right-1/4 -bottom-1/4 h-full w-3/4 rounded-full bg-brand-green/15 blur-[100px] transition-opacity duration-700"></div>
      
      <div class="relative z-10 lg:col-span-7">
        <h2
          class="max-w-[13ch] font-display text-[clamp(2.5rem,4.5vw,4.8rem)] leading-[0.94] tracking-[-0.04em]"
        >
          Meet the people. See the work.
        </h2>
      </div>
      
      <div class="relative z-10 flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
        <a
          href={resolve("/about")}
          class="inline-flex min-h-12 items-center gap-3 rounded-[0.55rem] bg-brand-green px-5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-brand-dark transition-colors duration-300 hover:bg-white"
        >
          About the studio <ArrowUpRight size={15} />
        </a>
        <a
          href={resolve("/portfolio")}
          class="inline-flex min-h-12 items-center gap-3 rounded-[0.55rem] border border-white/20 bg-white/5 px-5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-brand-light backdrop-blur-sm transition-colors duration-300 hover:border-brand-green hover:bg-brand-green hover:text-brand-dark"
        >
          View portfolio <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  </div>
</section>
