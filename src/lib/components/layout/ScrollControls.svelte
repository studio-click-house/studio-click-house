<script lang="ts">
  import { ArrowDown, ArrowUp } from "lucide-svelte";
  import { scrollToTarget } from "$lib/animations/lenis";

  function scrollToEdge(edge: "top" | "bottom") {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = edge === "top" ? 0 : document.documentElement.scrollHeight - window.innerHeight;
    scrollToTarget(target, { offset: 0, immediate: reducedMotion });
  }
</script>

<nav id="page-scroll-controls" aria-label="Page scroll controls" class="fixed bottom-4 right-4 z-[var(--z-navigation)] flex flex-col gap-2 sm:bottom-6 sm:right-5">
  <button type="button" onclick={() => scrollToEdge("top")} aria-label="Scroll to top" class="flex size-10 items-center justify-center rounded-[var(--radius-control)] border border-brand-light/20 bg-brand-dark text-brand-light shadow-lg transition-colors duration-200 hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green">
    <ArrowUp size={18} aria-hidden="true" />
  </button>
  <button type="button" onclick={() => scrollToEdge("bottom")} aria-label="Scroll to bottom" class="flex size-10 items-center justify-center rounded-[var(--radius-control)] border border-brand-light/20 bg-brand-dark text-brand-light shadow-lg transition-colors duration-200 hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green">
    <ArrowDown size={18} aria-hidden="true" />
  </button>
</nav>
