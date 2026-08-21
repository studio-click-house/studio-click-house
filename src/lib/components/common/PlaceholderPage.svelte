<script lang="ts">
  import { ArrowLeft, ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";

  let { title, eyebrow, description, canonicalPath } = $props<{
    title: string;
    eyebrow: string;
    description: string;
    canonicalPath: string;
  }>();
</script>

<PageMeta
  title={`${title} | Studio Click House`}
  {description}
  {canonicalPath}
/>

<main
  id={`${canonicalPath.replaceAll("/", "-").replace(/^-|-$/g, "") || "home"}-page`}
  class="min-h-[100dvh] bg-brand-paper pt-32"
>
  <header
    class="site-shell grid min-h-[70dvh] content-between gap-16 border-x border-brand-dark/10 px-5 pb-10 pt-12 sm:px-10 lg:px-16"
  >
    <p class="eyebrow text-brand-green">{eyebrow}</p>
    <div>
      <h1 class="display-title max-w-6xl">{title}</h1>
      <p
        class="mt-8 max-w-xl text-base leading-relaxed text-brand-dark/65 sm:text-lg"
      >
        {description}
      </p>
    </div>
    <div class="flex flex-wrap gap-7">
      <a href={resolve("/")} class="text-link"
        ><ArrowLeft size={16} /> Back home</a
      >
      <a href={resolve("/contact")} class="text-link"
        >Discuss a project <ArrowUpRight size={16} /></a
      >
    </div>
  </header>
</main>
