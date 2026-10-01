<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUp } from "lucide-svelte";
  import { scrollToTarget } from "$lib/animations/lenis";

  let isVisible = $state(false);

  function scrollToTop() {
    const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollToTarget(0, { offset: 0, immediate: reducedMotion });
  }

  onMount(() => {
    function handleScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      isVisible = scrollY > 380;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<div
  id="page-scroll-controls"
  aria-label="Scroll to top"
  class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[var(--z-navigation)] transition-all duration-300 ease-out {isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}"
>
  <button
    type="button"
    onclick={scrollToTop}
    aria-label="Scroll back to top"
    title="Back to top"
    class="group flex size-8.5 items-center justify-center rounded-full border border-brand-light/15 bg-brand-dark/80 text-brand-light/75 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-brand-green/80 hover:bg-brand-dark hover:text-brand-green hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green cursor-pointer"
  >
    <ArrowUp size={15} strokeWidth={2.2} class="transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
  </button>
</div>
