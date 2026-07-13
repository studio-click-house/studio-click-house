<script lang="ts">
  import { siteConfig } from "$lib/config/site";

  let {
    title,
    description,
    canonicalPath,
    image = siteConfig.ogImage,
  } = $props<{
    title: string;
    description: string;
    canonicalPath: string;
    image?: string;
  }>();

  const canonical = $derived(`${siteConfig.url}${canonicalPath}`);
  const ogImage = $derived(
    image.startsWith("http") ? image : `${siteConfig.url}${image}`,
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteConfig.name} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={ogImage} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>
