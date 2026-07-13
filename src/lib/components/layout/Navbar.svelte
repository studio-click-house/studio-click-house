<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import { ArrowUpRight, Menu } from "lucide-svelte";
  import { navigationItems } from "$lib/content/home";
</script>

<header id="site-header" class="fixed inset-x-0 top-0 z-50 p-3 sm:p-4">
  <nav
    id="primary-navigation"
    aria-label="Primary navigation"
    class="mx-auto flex max-w-[90rem] items-center justify-between border border-brand-dark/10 bg-brand-light/90 px-3 py-2.5 backdrop-blur-md sm:px-4"
  >
    <a
      href={resolve("/")}
      aria-label="Studio Click House home"
      class="shrink-0"
    >
      <img
        src="/images/brand/schl-logo.png"
        alt="Studio Click House"
        width="144"
        height="76"
        class="h-8 w-auto sm:h-9"
      />
    </a>

    <ul class="hidden items-center gap-7 lg:flex" aria-label="Main routes">
      {#each navigationItems as item (item.href)}
        <li>
          <a
            href={resolve(item.href)}
            aria-current={page.url.pathname === item.href ? "page" : undefined}
            class="relative py-2 text-xs font-semibold uppercase tracking-[0.12em] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-brand-green after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
            >{item.label}</a
          >
        </li>
      {/each}
    </ul>

    <div class="flex items-center gap-2">
      <a
        href={resolve("/contact")}
        class="hidden items-center gap-2 bg-brand-dark px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-light transition-transform active:scale-[0.98] sm:inline-flex"
      >
        Start a project <ArrowUpRight size={15} strokeWidth={1.75} />
      </a>

      <details class="group relative lg:hidden">
        <summary
          class="flex size-11 cursor-pointer list-none items-center justify-center border border-brand-dark/15 bg-brand-light [&::-webkit-details-marker]:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={20} strokeWidth={1.7} />
        </summary>
        <div
          class="absolute right-0 top-[calc(100%+0.5rem)] w-[min(20rem,calc(100vw-2rem))] border border-brand-dark/10 bg-brand-light p-3 shadow-2xl shadow-brand-dark/10"
        >
          <ul class="divide-y divide-brand-dark/10" aria-label="Mobile routes">
            {#each navigationItems as item (item.href)}
              <li>
                <a href={resolve(item.href)} class="block py-4 text-lg"
                  >{item.label}</a
                >
              </li>
            {/each}
          </ul>
          <a
            href={resolve("/contact")}
            class="mt-3 flex items-center justify-between bg-brand-green p-4 font-semibold text-white"
          >
            Start a project <ArrowUpRight size={18} />
          </a>
        </div>
      </details>
    </div>
  </nav>
</header>
