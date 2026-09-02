<script lang="ts">
  import { onMount } from 'svelte';
  import { locale, _ } from 'svelte-i18n';
  import { ChevronDown, Globe } from 'lucide-svelte';

  const availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' }
  ];

  let currentLocale = $state('en');
  let isOpen = $state(false);
  let container: HTMLElement | undefined = $state();

  locale.subscribe((l) => {
    if (l) currentLocale = l;
  });

  function setLanguage(code: string) {
    locale.set(code);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('user-locale', code);
      } catch {
        // ignore
      }
    }
    isOpen = false;
  }

  function toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    isOpen = !isOpen;
  }

  onMount(() => {
    function handleDocClick(event: MouseEvent) {
      if (isOpen && container && !container.contains(event.target as Node)) {
        isOpen = false;
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        isOpen = false;
      }
    }

    window.addEventListener('click', handleDocClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleDocClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div bind:this={container} class="relative inline-block text-left">
  <!-- Trigger Button -->
  <button
    type="button"
    onclick={toggleDropdown}
    class="flex items-center gap-[0.55rem] min-h-[2.45rem] rounded-[4px] border border-brand-light/25 bg-transparent px-[0.85rem] font-sans text-[0.75rem] font-semibold uppercase tracking-[0.018em] text-brand-light transition-colors hover:border-brand-green hover:bg-brand-green hover:text-brand-dark whitespace-nowrap cursor-pointer select-none"
    aria-expanded={isOpen}
    aria-haspopup="true"
    aria-label="Select Language"
  >
    <Globe size={14} strokeWidth={1.7} />
    <span>{currentLocale.split('-')[0].toUpperCase()}</span>
    <ChevronDown size={13} strokeWidth={1.8} class="transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
  </button>

  <!-- Dropdown Menu (Exact same top-full mt-7 gap & invisible hover bridge as MegaMenu) -->
  {#if isOpen}
    <div
      class="absolute right-0 top-full mt-7 w-44 origin-top-right z-50 animate-in fade-in-0 zoom-in-95 duration-150
      before:absolute before:inset-x-0 before:-top-7 before:h-7 before:content-['']"
      role="menu"
      aria-orientation="vertical"
    >
      <div class="overflow-hidden rounded-lg border border-brand-light/10 bg-[rgb(12,11,10)]/95 shadow-2xl shadow-black/70 p-2 backdrop-blur-2xl ring-1 ring-black/40">
        {#each availableLanguages as lang}
          {@const isActive = currentLocale === lang.code}
          <button
            type="button"
            onclick={() => setLanguage(lang.code)}
            class="group flex w-full items-center justify-between px-3.5 py-2.5 rounded-md text-left text-[0.82rem] font-sans transition-all duration-200 cursor-pointer {isActive ? 'text-brand-green bg-brand-green/10 font-semibold' : 'text-brand-light/80 hover:text-brand-light hover:bg-brand-light/8'}"
            role="menuitem"
          >
            <span class="tracking-wide transition-transform duration-200 {isActive ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}">
              {$_(`languages.${lang.code}`) || lang.label}
            </span>
            {#if isActive}
              <span class="size-1.5 rounded-full bg-brand-green shrink-0 shadow-[0_0_8px_rgba(126,166,65,0.8)]"></span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
