import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

const sitemap = read("src/routes/sitemap.xml/+server.ts");
for (const path of ["/section", "/login", "/privacy", "/terms"]) {
  assert(!sitemap.includes(`"${path}"`), `${path} must not be listed in the sitemap`);
}

for (const slug of [
  "commercial-editing",
  "color-grading",
  "social-cutdowns",
  "3d-product-modeling",
  "texturing-shading",
  "cgi-rendering",
]) {
  assert(!sitemap.includes(`services.map`), "The sitemap must use the implemented service registry");
  assert(!sitemap.includes(`/services/${slug}`), `${slug} placeholder must not be indexed`);
}

assert(!read("src/lib/content/home.ts").includes('href: "/section"'), "Section demo must not be in navigation");
assert(!read("src/lib/components/seo/PageMeta.svelte").includes("hreflang"), "Identical hreflang URLs must not be emitted");

const errorPage = read("src/routes/+error.svelte");
assert(errorPage.includes("noindex"), "Error responses must be noindex");
assert(!errorPage.includes('canonicalPath="/404"'), "Error responses must not canonicalize to /404");
assert(read("src/routes/login/+page.svelte").includes("noindex"), "Login must be noindex");

const mainContentFiles = [
  "src/routes/about/+page.svelte",
  "src/routes/careers/+page.svelte",
  "src/routes/csr/+page.svelte",
  "src/routes/events/+page.svelte",
  "src/routes/login/+page.svelte",
  "src/routes/orbit-demo/+page.svelte",
  "src/routes/pricing/+page.svelte",
  "src/routes/section/+page.svelte",
  "src/routes/services/+page.svelte",
  "src/routes/services/[slug]/+page.svelte",
  "src/lib/components/common/PlaceholderPage.svelte",
];
for (const file of mainContentFiles) {
  assert(read(file).includes('id="main-content"'), `${file} must expose the skip-link target`);
}

assert(!/<header[^>]*role="none"/.test(read("src/lib/components/layout/Navbar.svelte")), "Site header must keep its banner landmark");

const appCss = read("src/app.css");
assert(!appCss.includes("scrollbar-width: none"), "The document scrollbar must remain visible");
assert(!appCss.includes("html::-webkit-scrollbar,\n  body::-webkit-scrollbar"), "The document scrollbar must remain visible");

console.log("Site regression checks passed.");
