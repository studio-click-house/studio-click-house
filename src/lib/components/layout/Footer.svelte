<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { siteConfig } from "$lib/config/site";
  import { navigationItems } from "$lib/content/home";

  const socialLinks = Object.entries(siteConfig.links).filter(
    ([, href]) => href,
  );
</script>

<footer id="site-footer" class="bg-brand-dark text-brand-light">
  <div class="site-shell pb-8 pt-24 sm:pt-32">
    <div
      class="grid gap-14 border-b border-brand-light/20 pb-20 lg:grid-cols-[1.5fr_0.5fr] lg:items-end"
    >
      <div id="footer-contact">
        <p class="eyebrow text-brand-green">Have a frame that matters?</p>
        <h2
          class="mt-7 max-w-5xl font-display text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.88] tracking-[-0.04em]"
        >
          Bring it into focus.
        </h2>
      </div>
      <a
        href={resolve("/contact")}
        class="flex items-center justify-between border-t border-brand-light/30 py-5 text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:text-brand-green lg:border-y"
      >
        Start a project <ArrowUpRight size={22} strokeWidth={1.5} />
      </a>
    </div>

    <div class="grid gap-12 py-12 md:grid-cols-3">
      <div id="footer-brand">
        <img
          src="/images/brand/schl-logo.png"
          alt="Studio Click House"
          width="180"
          height="95"
          class="h-14 w-auto brightness-0 invert opacity-90"
        />
        <p class="mt-5 max-w-xs text-sm leading-relaxed text-brand-light/65">
          Image editing, retouching, and visual production shaped around the
          work.
        </p>
      </div>
      <nav id="footer-navigation" aria-label="Footer navigation">
        <p class="eyebrow text-brand-light/45">Explore</p>
        <ul class="mt-5 space-y-3 text-sm">
          {#each navigationItems as item (item.href)}<li>
              <a href={resolve(item.href)} class="hover:text-brand-green"
                >{item.label}</a
              >
            </li>{/each}
          <li>
            <a href={resolve("/contact")} class="hover:text-brand-green"
              >Contact</a
            >
          </li>
        </ul>
      </nav>
      <div id="footer-social">
        <p class="eyebrow text-brand-light/45">Follow</p>
        {#if socialLinks.length}
          <ul class="mt-5 space-y-3 text-sm">
            <!-- eslint-disable svelte/no-navigation-without-resolve -->
            {#each socialLinks as [label, href] (label)}
              <li>
                <a
                  {href}
                  rel="noreferrer"
                  target="_blank"
                  class="capitalize hover:text-brand-green">{label}</a
                >
              </li>
            {/each}
            <!-- eslint-enable svelte/no-navigation-without-resolve -->
          </ul>
        {:else}
          <p class="mt-5 max-w-xs text-sm text-brand-light/55">
            Approved social links will appear here when provided.
          </p>
        {/if}
      </div>
    </div>

    <div
      id="footer-legal"
      class="flex flex-col gap-4 border-t border-brand-light/20 pt-6 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-brand-light/50 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>&copy; {new Date().getFullYear()} Studio Click House</p>
      <div class="flex gap-5">
        <a href={resolve("/privacy")} class="hover:text-brand-light">Privacy</a
        ><a href={resolve("/terms")} class="hover:text-brand-light">Terms</a>
      </div>
    </div>
  </div>
</footer>
