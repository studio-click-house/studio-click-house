# Universal Image Adjustment & Placement Guide (Prompt Reference)

This document contains the exact rules, diagnoses, formulas, and step-by-step instructions to achieve clean, premium image presentation across any section of the website. Use this prompt whenever you need to adjust images in a Hero, Audience, FAQ, Showcase, Features, or Slider section.

---

## 1. The 4 Root Causes of Image Cutoffs & Ugly Borders

When an image looks "cut off" (head/legs missing) or has a visible "card box inside card box" appearance, it is always caused by one of these four issues:

| Issue | What Happens | The Diagnosis |
|---|---|---|
| **1. `object-cover` Aspect Ratio Slicing** | Heads cut off at forehead, legs/shoes cut off at knees/ankles. | The container has a fixed aspect ratio (e.g., 4:5 or 16:9), but the image has a different ratio. `object-cover` scales up the image to fill every pixel, discarding everything outside the box. |
| **2. Parallax Scale Magnification** | Even with good proportions, subjects look zoomed in and sliced. | A wrapper has `top-[-15%] h-[130%]` for scroll parallax. This magnifies the image by +30% and pushes the top 15% and bottom 15% completely off-screen. |
| **3. Studio Background Mismatch** | A dirty grey/cream rectangular border appears around the subject. | The image has an off-white studio background (e.g. `#FAF9F6`, `#F3EFEA`, `#EFEFEF`), while the card has a pure white background (`#FFFFFF`), exposing the rectangular bounding box. |
| **4. Dark Gradient Overlay Washout** | Dark text gradients darken the subject or apparel details. | A full `inset-0 bg-gradient-to-t` covers the whole image rather than just the bottom text zone (`h-28 bottom-0`). |

---

## 2. The 3 Golden Principles for Perfect Image Adjustment

### Principle 1: Standardized Canvas Dimensions & Pure White Background
- **Uniform Canvas:** All images in a grid or carousel must share the **exact same canvas size** (e.g., `2000×2000` square for product cards, or `1333×2000` for 2:3 vertical portraits).
- **Identical Subject Scale:** Center the subject (garment or model) with uniform breathing room:
  - For `2000×2000` canvas: subject height should be **~1600px (80% of canvas height)**.
  - Leave 200px padding at the top and 200px at the bottom. This prevents heads and feet from ever touching the card edge.
- **Pure `#FFFFFF` Background:** Ensure the image background is true white (`rgb(255, 255, 255)`). When the image sits inside a `bg-white` container, the borders completely vanish into the card.

### Principle 2: Card Containment Architecture (`contain` over `cover`)
Instead of forcing raw photography into tight CSS viewports with `object-cover`, use the **Card Containment Pattern**:
```html
<!-- Outer Card Frame -->
<div class="relative overflow-hidden aspect-[4/5] rounded-[2rem] border border-brand-dark/10 bg-white shadow-xl shadow-brand-dark/5 p-3 sm:p-4">
  <!-- Image -->
  <img
    src="/path/to/image-white.webp"
    alt="Subject description"
    class="size-full object-contain"
    loading="lazy"
  />
</div>
```
- **Why this works:**
  - `bg-white` matches the pure white image canvas.
  - `p-3 sm:p-4` creates a comfortable, elegant luxury margin.
  - `object-contain` guarantees **100% of the subject is visible**—no cut heads, no cut feet, no missing sleeves.
  - `rounded-[2rem] border border-brand-dark/10` forms a modern editorial container.

### Principle 3: Disable Parallax Expansion on Contained Subjects
- Parallax wrappers with `h-[130%] top-[-15%]` should **ONLY** be used when `imageFit === 'cover'` on abstract backgrounds or landscape lifestyle photography.
- When `imageFit === 'contain'`, the wrapper must be static:
  ```svelte
  class="faq-parallax-image absolute inset-x-0 pointer-events-none {imageFit === 'contain'
    ? 'inset-y-0 h-full flex items-center justify-center'
    : 'top-[-15%] h-[130%]'}"
  ```

---

## 3. Section-by-Section Implementation Blueprints

### A. FAQ Section (Sticky Frame + Accordion Questions)
- **Problem:** The sticky preview image cuts off the model's head and legs as the user scrolls.
- **Solution:**
  1. In `src/lib/components/sections/FaqSection.svelte`:
     - Add `imageFit?: 'cover' | 'contain'` prop (default to `'cover'`).
     - When `imageFit === 'contain'`:
       - Card container gets `bg-white`.
       - Parallax wrapper is constrained to `inset-y-0 h-full`.
       - `img` uses `object-contain p-3 sm:p-4` with smooth opacity transition.
       - GSAP parallax scroll scrub is skipped (`if (imageFit === 'cover') ...`).
  2. In your route (`+page.svelte`):
     ```svelte
     <FaqSection items={pageData.faqs} images={pageData.faqImages} imageFit="contain" />
     ```
  3. Ensure `faqImages` use pure `#ffffff` background variants.

### B. Audience / Grid Cards ("Who Benefits From This Service?")
- **Problem:** In 3-column cards, images have different heights, off-white grey backgrounds, and visible box outlines.
- **Solution:**
  1. Standardize all 3 images to `2000×2000` square with pure `#ffffff` background.
  2. In `ServiceDetailAudience.svelte`:
     ```svelte
     <div class="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-dark/10 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
       <figure class="relative aspect-square w-full overflow-hidden bg-white p-3 sm:p-4">
         <img
           src={item.image.src}
           alt={item.image.alt}
           class="size-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
         />
       </figure>
       <div class="flex flex-1 flex-col p-6">
         <!-- Card Text -->
       </div>
     </div>
     ```

### C. Hero Section (Split Before / After or Dual Presentation)
- **Problem:** Comparison photos have misaligned hemlines or one side zooms more than the other.
- **Solution:**
  - Both "Before" and "After" images must have identical pixel dimensions and identical subject position (matching neckline Y-coordinate and hemline Y-coordinate).
  - Use `aspect-[4/5]` or `aspect-square` with `object-contain` or synchronized `object-cover` anchored at `object-center`.

---

## 4. Reusable Image Processing Recipe (Bun / Sharp)

To convert any raw or off-white image into a standardized `2000×2000` pure white canvas:

```bash
bun -e "
import sharp from 'sharp';

async function processImage(inputPath, outputPath) {
  const meta = await sharp(inputPath).metadata();
  
  // Resize subject to fit comfortably within 1600x1600 (80% of 2000px)
  const resized = await sharp(inputPath)
    .resize(1600, 1600, {
      fit: 'inside',
      withoutEnlargement: false
    })
    .toBuffer();

  // Composite onto 2000x2000 pure white background
  await sharp({
    create: {
      width: 2000,
      height: 2000,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([{ input: resized, gravity: 'center' }])
  .webp({ quality: 90 })
  .toFile(outputPath);

  console.log('Processed:', outputPath);
}

processImage('input.webp', 'output-white-2000.webp');
"
```

---

## 5. Copy-Paste AI Prompt Template

Whenever you ask an AI assistant to fix or adjust images in a section, copy-paste this prompt:

> **AI Instruction: Adjust Section Images to Match Design Standards**
>
> Please adjust the images in `[SECTION_NAME / FILE_NAME]` following the Studio Click House image placement rules in `prompt.md`:
> 1. **No Cutoffs:** Ensure neither head, neckline, cuffs, or hemlines are sliced off. Use `object-contain` with internal padding (`p-3 sm:p-4`) instead of aggressive `object-cover`.
> 2. **Card Containment:** Wrap images in a clean `bg-white` container with `border border-brand-dark/10` and `rounded-2xl` or `rounded-[2rem]`.
> 3. **Seamless Backgrounds:** Verify images have a pure `#ffffff` background matching the card container so no square box edges appear.
> 4. **Parallax Safety:** If the component uses scroll parallax with oversized wrappers (`h-[130%] top-[-15%]`), ensure it is disabled or bypassed when `imageFit === 'contain'`.
> 5. **No Duplicate Images:** Ensure this image does not repeat any image used elsewhere on this page.
