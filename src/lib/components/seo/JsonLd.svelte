<script lang="ts">
  let { data } = $props<{ data: Record<string, unknown> }>();
</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html '<script type="application/ld+json">' +
    JSON.stringify(data).replaceAll("<", "\\u003c") +
    "</scr" +
    "ipt>"}
</svelte:head>
