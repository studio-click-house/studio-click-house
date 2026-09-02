import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

register('en', () => import('./messages/en.json'));
register('fr', () => import('./messages/fr.json'));
register('es', () => import('./messages/es.json'));
register('de', () => import('./messages/de.json'));

init({
  fallbackLocale: 'en',
  initialLocale: browser ? window.navigator.language : 'en',
});
