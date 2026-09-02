<script lang="ts">
  import { locale, _ } from 'svelte-i18n';
  import { ChevronDown, Globe } from 'lucide-svelte';

  const availableLanguages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'es', label: 'Español', short: 'ES' },
    { code: 'de', label: 'Deutsch', short: 'DE' }
  ];

  let currentLocale = $state('en');
  let isOpen = $state(false);

  locale.subscribe((l) => {
    if (l) currentLocale = l;
  });

  function setLanguage(code: string) {
    locale.set(code);
    isOpen = false;
  }
  
  function toggleDropdown() {
    isOpen = !isOpen;
  }
  
  function closeDropdown() {
    isOpen = false;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative inline-block text-left" onmouseleave={closeDropdown}>
  <button
    type="button"
    onclick={toggleDropdown}
    class="flex items-center gap-[0.55rem] min-h-[2.45rem] rounded-[4px] border border-brand-light/25 bg-transparent px-[0.85rem] font-sans text-[0.75rem] font-semibold uppercase tracking-[0.018em] text-brand-light transition-colors hover:border-brand-green hover:bg-brand-green hover:text-brand-dark whitespace-nowrap"
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
    <Globe size={14} strokeWidth={1.7} />
    <span>{currentLocale.split('-')[0].toUpperCase()}</span>
    <ChevronDown size={14} strokeWidth={1.7} class="transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
  </button>

  {#if isOpen}
    <div
      class="absolute right-0 mt-2 w-36 origin-top-right rounded bg-brand-dark border border-brand-light/10 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      role="menu"
      aria-orientation="vertical"
    >
      <div class="py-1" role="none">
        {#each availableLanguages as lang}
          <button
            type="button"
            onclick={() => setLanguage(lang.code)}
            class="block w-full px-4 py-2 text-left text-sm {currentLocale === lang.code ? 'text-brand-green bg-brand-light/5' : 'text-brand-light hover:bg-brand-light/10'} font-sans transition-colors"
            role="menuitem"
          >
            <span class="font-bold mr-2">{lang.short}</span>
            <span>{lang.label}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
