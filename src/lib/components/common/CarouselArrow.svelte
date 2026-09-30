<script lang="ts">
  import { ArrowLeft, ArrowRight } from "lucide-svelte";

  let { direction, label, onclick }: {
    direction: "previous" | "next";
    label: string;
    onclick: () => void;
  } = $props();
</script>

<button
  type="button"
  {onclick}
  aria-label={label}
  class="flex size-10 items-center justify-center rounded-full border border-brand-dark/25 text-brand-dark transition-colors duration-200 hover:border-brand-green hover:bg-brand-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green active:scale-95"
>
  {#if direction === "previous"}<ArrowLeft class="size-4" />{:else}<ArrowRight class="size-4" />{/if}
</button>
