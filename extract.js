import { services, serviceShowcases, workGalleryItems, testimonials, faqs, showcaseProjects } from './src/lib/content/home.js';
import fs from 'fs';

const en = JSON.parse(fs.readFileSync('./src/lib/messages/en.json', 'utf8'));

en.home = {
  services: {},
  serviceShowcases: {},
  workGalleryItems: {},
  testimonials: {},
  faqs: {},
  showcaseProjects: {}
};

services.forEach(s => {
  en.home.services[s.slug] = {
    title: s.title,
    description: s.description,
    category: s.category
  };
});

serviceShowcases.forEach((s, i) => {
  en.home.serviceShowcases[`item_${i}`] = {
    displayTitle: s.displayTitle,
    description: s.description,
    category: s.category,
    beforeLabel: s.media?.beforeLabel || '',
    afterLabel: s.media?.afterLabel || ''
  };
});

workGalleryItems.forEach(s => {
  en.home.workGalleryItems[s.id] = {
    title: s.title,
    description: s.description,
    category: s.category
  };
});

testimonials.forEach((s, i) => {
  en.home.testimonials[`item_${i}`] = {
    quote: s.quote,
    role: s.role
  };
});

faqs.forEach((s, i) => {
  en.home.faqs[`item_${i}`] = {
    question: s.question,
    answer: s.answer
  };
});

showcaseProjects.forEach(s => {
  en.home.showcaseProjects[s.id] = {
    title: s.title,
    description: s.description,
    category: s.category
  };
});

fs.writeFileSync('./src/lib/messages/en.json', JSON.stringify(en, null, 2));
console.log('en.json updated with home content');
