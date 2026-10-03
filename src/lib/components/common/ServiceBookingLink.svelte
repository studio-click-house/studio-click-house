<script lang="ts">
  import { ArrowRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { Button } from "$lib/components/ui/button";

  let { label }: { label: string } = $props();
</script>

<Button href={resolve("/contact")} variant="ghost" size="sm" class="border-0 border-b border-brand-green px-0 font-sans text-sm font-medium text-brand-dark hover:text-brand-dark">
  {label} <ArrowRight size={14} />
</Button>
