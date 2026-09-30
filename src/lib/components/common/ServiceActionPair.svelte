<script lang="ts">
  import { ArrowDown, ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { Button } from "$lib/components/ui/button";

  let { comparisonHref }: { comparisonHref: string } = $props();
</script>

<div class="mt-8 flex flex-wrap items-center gap-3">
  <Button href={resolve("/contact")} size="lg" class="bg-brand-dark font-mono text-[0.64rem] font-bold uppercase tracking-[0.12em] text-brand-light hover:bg-brand-green hover:text-brand-dark">
    Discuss your project <ArrowUpRight class="size-4" />
  </Button>
  <Button href={comparisonHref} variant="secondary" size="lg" class="px-4">
    View comparison <ArrowDown class="size-4" />
  </Button>
</div>
