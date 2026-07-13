<script lang="ts">
  import { page } from "$app/state";
  import PlaceholderPage from "$lib/components/common/PlaceholderPage.svelte";
  const articleSlug = $derived(page.params.slug ?? "article");
  const articleTitle = $derived(
    articleSlug
      .split("-")
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(" "),
  );
</script>

<PlaceholderPage
  title={articleTitle}
  eyebrow="Journal article"
  description="This article route is structurally ready. Original article content and accurate publishing metadata are still required."
  canonicalPath={`/blog/${articleSlug}`}
/>
