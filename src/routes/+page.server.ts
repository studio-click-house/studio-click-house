import fs from 'node:fs';
import path from 'node:path';
import type { PageServerLoad } from './$types';
import type { ClientLogoItem } from '$lib/types/content';

function formatLabel(name: string): string {
  const base = name.replace(/_logo$/, "");

  const overrides: Record<string, string> = {
    front_back_and_sides: "Front, Back & Sides",
    hslr: "HSLR",
  };

  if (overrides[base]) {
    return overrides[base];
  }

  return base
    .split("_")
    .map((word) => {
      if (word === "and") return "&";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function formatShortLabel(label: string): string {
  const words = label.split(/\s+|,\s*/).filter((w) => w && w !== "&");
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return label.substring(0, 2).toUpperCase();
}

export const prerender = true;

export const load: PageServerLoad = async () => {
  const clientsDir = path.join(process.cwd(), 'static', 'images', 'clients');
  let files: string[] = [];
  
  try {
    files = fs.readdirSync(clientsDir).filter((file: string) => file.endsWith('.png'));
  } catch (e) {
    console.error("Failed to read clients directory", e);
  }

  const clientLogoItems: ClientLogoItem[] = files.map((filename) => {
    const nameWithoutExt = filename.replace(/\.png$/, "");
    const id = nameWithoutExt.replace(/_logo$/, "").replace(/_/g, "-");
    const label = formatLabel(nameWithoutExt);
    const shortLabel = formatShortLabel(label);
    const logoSrc = `/images/clients/${filename}`;

    return {
      id,
      label,
      shortLabel,
      logoSrc,
      width: 600,
      height: 300,
    };
  });

  return {
    clientLogoItems,
  };
};
