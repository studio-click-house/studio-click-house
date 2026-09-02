<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import { _ } from "svelte-i18n";
</script>

<PageMeta
  title="Careers & Opportunities | Studio Click House"
  description="Explore career opportunities and join the production team at Studio Click House. Learn about openings for image retouchers, CGI artists, and editors."
  canonicalPath="/careers"
/>

<main id="careers-page" class="min-h-[100dvh] bg-brand-paper pb-24 pt-32">
  <div class="site-shell">
    <section
      class="border-x border-brand-dark/10 px-5 pb-16 pt-12 sm:px-10 lg:px-16"
    >
      <p class="eyebrow text-brand-green">{$_('careers.eyebrow') || 'Careers'}</p>
      <div class="mt-8 max-w-3xl border-b border-brand-dark/15 pb-12">
        <h1 class="display-title">{$_('careers.title') || 'Build beautiful work with us.'}</h1>
        <p
          class="mt-8 max-w-xl text-base leading-relaxed text-brand-dark/65 sm:text-lg"
        >
          {$_('careers.description') || 'Future Studio Click House career opportunities will be shared here.'}
        </p>
      </div>

      <div class="mt-12 max-w-xl">
        <p class="text-sm leading-relaxed text-brand-dark/65">
          {$_('careers.contactNote') || 'For studio enquiries, please contact the team directly.'}
        </p>
        <a href={resolve("/contact")} class="text-link mt-6 text-brand-dark">
          {$_('careers.contactLink') || 'Contact the studio'} <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  </div>
</main>
