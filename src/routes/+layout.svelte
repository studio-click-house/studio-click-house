<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <title>Studio Click House</title>
  <meta
    name="description"
    content="Studio Click House creates high-end image and video work for ambitious brands."
  />
</svelte:head>

{@render children()}
