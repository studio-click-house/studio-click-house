<script lang="ts">
  import { page } from "$app/state";
  import PlaceholderPage from "$lib/components/common/PlaceholderPage.svelte";
  const serviceSlug = $derived(page.params.slug ?? "service");
  const serviceTitle = $derived(
    serviceSlug
      .split("-")
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(" "),
  );
</script>

<PlaceholderPage
  title={serviceTitle}
  eyebrow="Service detail"
  description="Detailed service scope, deliverables, workflow, and approved examples will be added here without inventing project claims."
  canonicalPath={`/services/${serviceSlug}`}
/>
