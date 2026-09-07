<script lang="ts">
  import { siteConfig } from "$lib/config/site";
  import { _, locale } from "svelte-i18n";

  let {
    title,
    description,
    canonicalPath,
    noindex = false,
    image = siteConfig.ogImage,
    titleKey,
    descriptionKey,
  } = $props<{
    title: string;
    description: string;
    canonicalPath?: string;
    noindex?: boolean;
    image?: string;
    titleKey?: string;
    descriptionKey?: string;
  }>();

  const activeLocale = $derived($locale || "en");
  const computedTitle = $derived(
    titleKey ? ($_?.(titleKey) || title) : title,
  );
  const computedDescription = $derived(
    descriptionKey ? ($_?.(descriptionKey) || description) : description,
  );

  const canonical = $derived(canonicalPath ? `${siteConfig.url}${canonicalPath}` : undefined);
  const ogImage = $derived(
    image.startsWith("http") ? image : `${siteConfig.url}${image}`,
  );

  const localeToOg: Record<string, string> = {
    en: "en_US",
    de: "de_DE",
    fr: "fr_FR",
    es: "es_ES",
  };

  const ogLocale = $derived(localeToOg[activeLocale] || "en_US");
  const alternateLocales = $derived(
    Object.entries(localeToOg)
      .filter(([k]) => k !== activeLocale)
      .map(([, v]) => v),
  );
</script>

<svelte:head>
  <title>{computedTitle}</title>
  <meta name="description" content={computedDescription} />
  {#if canonical}
    <link rel="canonical" href={canonical} />
  {/if}
  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {/if}

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteConfig.name} />
  <meta property="og:title" content={computedTitle} />
  <meta property="og:description" content={computedDescription} />
  {#if canonical}
    <meta property="og:url" content={canonical} />
  {/if}
  <meta property="og:image" content={ogImage} />
  <meta property="og:locale" content={ogLocale} />
  {#each alternateLocales as altLocale (altLocale)}
    <meta property="og:locale:alternate" content={altLocale} />
  {/each}

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={computedTitle} />
  <meta name="twitter:description" content={computedDescription} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>
