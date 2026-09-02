import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

register('en', () => import('./messages/en.json'));
register('fr', () => import('./messages/fr.json'));
register('es', () => import('./messages/es.json'));
register('de', () => import('./messages/de.json'));

function getInitialLocale(): string {
  if (!browser) return 'en';
  try {
    const saved = localStorage.getItem('user-locale');
    if (saved && ['en', 'de', 'fr', 'es'].includes(saved)) {
      return saved;
    }
    const nav = window.navigator.language?.split('-')[0]?.toLowerCase();
    if (nav && ['en', 'de', 'fr', 'es'].includes(nav)) {
      return nav;
    }
  } catch {
    // ignore
  }
  return 'en';
}

init({
  fallbackLocale: 'en',
  initialLocale: getInitialLocale(),
});
