<script lang="ts">
  import { siteConfig } from "$lib/config/site";
  import { _, locale } from "svelte-i18n";

  let {
    title,
    description,
    canonicalPath,
    image = siteConfig.ogImage,
    titleKey,
    descriptionKey,
  } = $props<{
    title: string;
    description: string;
    canonicalPath: string;
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

  const canonical = $derived(`${siteConfig.url}${canonicalPath}`);
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
  <link rel="canonical" href={canonical} />

  <!-- Multi-language Hreflang Tags -->
  <link rel="alternate" hreflang="x-default" href={canonical} />
  <link rel="alternate" hreflang="en" href={canonical} />
  <link rel="alternate" hreflang="de" href={canonical} />
  <link rel="alternate" hreflang="fr" href={canonical} />
  <link rel="alternate" hreflang="es" href={canonical} />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteConfig.name} />
  <meta property="og:title" content={computedTitle} />
  <meta property="og:description" content={computedDescription} />
  <meta property="og:url" content={canonical} />
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
