import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
assert(appCss.includes("scrollbar-width: none"), "The document scrollbar must be visually hidden in Firefox");
assert(appCss.includes("html::-webkit-scrollbar"), "The document scrollbar must be visually hidden in WebKit/Blink");
assert(/html::-webkit-scrollbar\s*\{[^}]*display:\s*none;/s.test(appCss), "The WebKit/Blink scrollbar must not occupy visible space");
assert(/html\s*\{[^}]*max-width:\s*100%;/s.test(appCss), "The document root must be bounded to the viewport width");
assert(/body\s*\{[^}]*max-width:\s*100%;/s.test(appCss), "The document body must be bounded to the viewport width");
assert(!/overflow-y:\s*hidden/.test(appCss), "Scrollbar concealment must not disable vertical scrolling");
assert(/main\s*\{[^}]*max-width:\s*100%;[^}]*overflow-x:\s*clip;/s.test(appCss), "Page content must not expand the document viewport");
assert(/video,[^}]*iframe,[^}]*canvas\s*\{[^}]*max-width:\s*100%;/s.test(appCss), "Embedded media must stay within its container");

const navbar = read("src/lib/components/layout/Navbar.svelte");
assert(/\.navigation-panel\s*\{[^}]*max-height:\s*calc\(100dvh/s.test(navbar), "The mobile navigation must fit short viewports");
assert(/\.navigation-panel\s*\{[^}]*overflow-y:\s*auto;/s.test(navbar), "Overflowing mobile navigation must remain scrollable");

assert(/class="[^"]*\bhidden\b[^"]*\bsm:flex\b/.test(read("src/lib/components/layout/FloatingSocialBar.svelte")), "The floating social rail must not cover mobile content");
assert(read("src/lib/components/layout/Footer.svelte").includes("grid grid-cols-1 gap-8 pt-4 sm:grid-cols-3"), "Footer navigation must stack on mobile");
assert(/class="[^"]*\bflex\b[^"]*\bflex-col\b[^"]*\bgap-3\b[^"]*\bsm:flex-row\b/.test(read("src/routes/login/+page.svelte")), "Login footer actions must stack on mobile");

const orbitGallery = read("src/lib/components/sections/about/AboutOrbitGallery.svelte");
assert(/orbit-story-shell[^\n]*flex[^\n]*flex-col/.test(orbitGallery), "The mobile orbit story must stack its header, stage, and footer vertically");

const clientMap = read("src/lib/components/common/InteractiveClientMap.svelte");
assert(/globe-stage[^\n]*min-h-0[^\n]*sm:min-h-\[36rem\]/.test(clientMap), "The mobile globe stage must not retain its desktop minimum height");

const threeGlobe = read("src/lib/components/common/ThreeGlobe.svelte");
assert(/globe-container[^\n]*aspect-square[^\n]*h-auto[^\n]*sm:aspect-auto/.test(threeGlobe), "The mobile globe canvas must use a square viewport");

const projectsShowcase = read("src/lib/components/sections/HorizontalProjectsShowcase.svelte");
assert(projectsShowcase.includes("flex-direction: column;"), "Mobile showcase panels must stack without horizontal clipping");
assert(projectsShowcase.includes("min-width: 0;"), "Mobile showcase panels must be allowed to shrink within the viewport");
assert(!projectsShowcase.includes("min-width: 88vw;"), "Mobile showcase panels must not expose clipped neighboring panels");
assert(!projectsShowcase.includes('preload="metadata"'), "Showcase videos must not fetch multi-megabyte metadata during initial load");

const scrollImageStory = read("src/lib/components/sections/ScrollImageStory.svelte");
assert(!scrollImageStory.includes('preload="metadata"'), "Below-fold story videos must not fetch metadata during initial load");
assert((scrollImageStory.match(/preload="none"/g) ?? []).length >= 2, "Both story videos must defer network loading until they approach the viewport");
assert(!scrollImageStory.includes("animation: liveConduitStream"), "Decorative SVG conduits must not run continuous paint animations");

const homeHero = read("src/lib/components/sections/HomeHero.svelte");
assert(homeHero.includes('preload="none"'), "The hero video must not compete with critical first paint resources");
assert(homeHero.includes('site-preloader-header-reveal'), "Hero text motion must begin behind the exiting preloader to avoid LCP render delay");

assert(!clientMap.includes("globeFallbackTimer"), "The Three.js globe must load only near its viewport, never from an unconditional startup timer");

const floatingSocialBar = read("src/lib/components/layout/FloatingSocialBar.svelte");
assert(!floatingSocialBar.includes('preload = "auto"'), "The audio brief must not preload before explicit playback");
assert(!floatingSocialBar.includes("tryAutoplay"), "The audio brief must not trigger a page-load network request through autoplay");

const productionProcess = read("src/lib/components/sections/ProductionProcess.svelte");
for (const colorway of ["emerald", "cobalt", "plum"]) {
  assert(productionProcess.includes(`dress-color-${colorway}.webp`), `${colorway} colorway must use its optimized WebP asset`);
  assert(!productionProcess.includes(`dress-color-${colorway}.png`), `${colorway} colorway must not use its multi-megabyte PNG asset`);
}

const optimizedHomeImages = [
  "static/images/about/video-pipeline/stage-1-raw-synthesis.webp",
  "static/images/about/video-pipeline/stage-2-motion-upscale.webp",
  "static/images/about/video-pipeline/stage-3-master-grade.webp",
  "static/images/about/ai-model-emerald.webp",
  "static/images/about/ai-model-cobalt.webp",
  "static/images/about/ghost-mannequin-input.webp",
  "static/images/about/ghost-mannequin-emerald.webp",
  "static/images/portfolio/photo-editing-showcase.webp",
];
for (const asset of optimizedHomeImages) {
  assert(existsSync(join(root, asset)), `${asset} must exist`);
}
assert(!read("src/lib/components/sections/AiAboutSection.svelte").includes(".jpg\""), "AI workflow cards must use optimized WebP assets");
assert(!scrollImageStory.includes("video-pipeline/stage-1-raw-synthesis.jpg"), "Video pipeline stage 1 must use WebP");
assert(!scrollImageStory.includes("video-pipeline/stage-2-motion-upscale.jpg"), "Video pipeline stage 2 must use WebP");
assert(!scrollImageStory.includes("video-pipeline/stage-3-master-grade.jpg"), "Video pipeline stage 3 must use WebP");
assert(/photoEditingShowcase:\s*\{\s*src: "\/images\/portfolio\/photo-editing-showcase\.webp"/.test(read("src/lib/content/media.ts")), "Homepage showcase must use its optimized WebP asset");

const viteConfig = read("vite.config.ts");
assert(/build:\s*\{[^}]*sourcemap:\s*true/s.test(viteConfig), "Production client bundles must include source maps for diagnostics");
assert(viteConfig.includes("onlyExplicitManualChunks: true"), "Manual 3D chunks must not absorb shared entry dependencies");

const responsiveMediaPath = join(root, "src/lib/utils/responsive-media.ts");
assert(existsSync(responsiveMediaPath), "Responsive remote-image source generation must exist");
const { getRemoteImageSrcset } = await import("../src/lib/utils/responsive-media.ts");
const responsivePexels = getRemoteImageSrcset("https://images.pexels.com/photos/1/example.jpeg?auto=compress&w=1800");
assert(responsivePexels?.includes("w=480") && responsivePexels.includes("w=1200"), "Pexels images must expose responsive widths");
const responsiveUnsplash = getRemoteImageSrcset("https://images.unsplash.com/photo-example?auto=format&w=2000&q=85");
assert(responsiveUnsplash?.includes("w=480") && responsiveUnsplash.includes("q=80"), "Unsplash images must expose compressed responsive widths");
assert.equal(getRemoteImageSrcset("/images/local.jpg"), undefined, "Local image paths must remain unchanged");

for (const component of [
  "src/lib/components/sections/HorizontalProjectsShowcase.svelte",
  "src/lib/components/sections/about/AboutOrbitGallery.svelte",
  "src/lib/components/sections/FaqSection.svelte",
]) {
  assert(read(component).includes("getRemoteImageSrcset"), `${component} must offer responsive remote images`);
}

console.log("Site regression checks passed.");
