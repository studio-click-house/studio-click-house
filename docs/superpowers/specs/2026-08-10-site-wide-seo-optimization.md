# Specification: Site-wide SEO & Metadata Optimization

## Goal
Optimize site-wide SEO by updating the company shortcut to "SCHL" and enhancing page titles and meta descriptions for better search indexing, context, and click-through rates.

## Shortcut Alignment
We will update all instances of the old `SCH` shortcut to the correct `SCHL` abbreviation:
- `src/lib/config/site.ts` (`shortName` property)
- `src/lib/components/layout/Navbar.svelte` (label inside menu)
- `src/routes/login/+page.svelte` (workspace workspace label)

---

## Page-by-Page Metadata Optimizations

We will enrich the titles and descriptions inside the `<PageMeta>` tags on all public pages, integrating the `SCHL` abbreviation naturally:

### 1. Home Page (`src/routes/+page.svelte`)
*   **Old Title:** `Studio Click House | Image Editing, Retouching & Visual Production`
*   **New Title:** `Studio Click House (SCHL) | Image Editing, Retouching & Visual Production`
*   **Old Description:** `Studio Click House provides image editing, retouching, and visual production for brands, studios, and production teams.` (from site config fallback)
*   **New Description:** `Studio Click House (SCHL) is an editorial creative studio providing high-end photo retouching, image editing, video grading, and custom 3D CGI product renders for global brands and agencies.`

### 2. About Page (`src/routes/about/+page.svelte`)
*   **Old Title:** `About Us | Studio Click House — Post-Production Studio Dhaka`
*   **New Title:** `About Us | Studio Click House (SCHL) — Dhaka Post-Production`
*   **Old Description:** `Discover the story, team, core values, and journey of Studio Click House, a specialized photo retouching, video color grading, and 3D CGI studio based in Dhaka, Bangladesh.`
*   **New Description:** `Discover the journey, team, and values of Studio Click House (SCHL), a premier photo retouching, video color grading, and custom 3D CGI production studio based in Dhaka, Bangladesh.`

### 3. Services Overview Page (`src/routes/services/+page.svelte`)
*   **Old Title:** `Our Services | Image Editing, Retouching & Visual Production`
*   **New Title:** `Our Services | Image Editing, Retouching & CGI — Studio Click House (SCHL)`
*   **Old Description:** `Explore our high-end visual post-production capabilities...`
*   **New Description:** `Explore the Studio Click House (SCHL) post-production capabilities: high-end photo retouching, clipping path cutouts, video color grading, and photorealistic 3D CGI renders.`

### 4. Portfolio Page (`src/routes/portfolio/+page.svelte`)
*   **Old Title:** `Portfolio | Selected Post-Production Work — Studio Click House`
*   **New Title:** `Portfolio | Selected Post-Production Work — Studio Click House (SCHL)`
*   **Old Description:** `Explore Studio Click House's portfolio of photo retouching...`
*   **New Description:** `Explore the Studio Click House (SCHL) portfolio showcasing selected work in luxury fashion retouching, pen path clipping, background isolation, and 3D CGI renders.`

### 5. Pricing Page (`src/routes/pricing/+page.svelte`)
*   **Old Title:** `Pricing | Project Scope & Visual Production — Studio Click House`
*   **New Title:** `Pricing & Project Scope | Studio Click House (SCHL)`
*   **Old Description:** `Explore Studio Click House's project scope estimates...`
*   **New Description:** `Get pricing estimates and project scope guides for high-volume image editing, fashion retouching, video grading, and custom 3D CGI product modeling at Studio Click House (SCHL).`

### 6. Contact Page (`src/routes/contact/+page.svelte`)
*   **Old Title:** `Contact Studio Click House | Start a Project`
*   **New Title:** `Contact Studio Click House (SCHL) | Start a Project`
*   **Old Description:** `Bring your unfinished visual material to the studio...`
*   **New Description:** `Bring your unfinished visual material to the studio. Plan image editing, fashion retouching, or CGI product modeling workflows with the Studio Click House (SCHL) team.`

### 7. Careers Page (`src/routes/careers/+page.svelte`)
*   **Old Title:** `Careers | Studio Click House`
*   **New Title:** `Careers & Opportunities | Studio Click House (SCHL)`
*   **Old Description:** `Career opportunities at Studio Click House.`
*   **New Description:** `Explore career opportunities and join the production team at Studio Click House (SCHL). Learn about openings for image retouchers, CGI artists, and editors.`

### 8. Events Page (`src/routes/events/+page.svelte`)
*   **Old Title:** `Studio Events & Masterclasses | Studio Click House`
*   **New Title:** `Events & Masterclasses | Studio Click House (SCHL)`
*   **Old Description:** `Explore upcoming events, masterclasses, and workshops hosted by Studio Click House...`
*   **New Description:** `Explore upcoming masterclasses and workshops hosted by Studio Click House (SCHL), covering advanced image post-production, shadow mapping, and e-commerce retouching.`

### 9. CSR Page (`src/routes/csr/+page.svelte`)
*   **Old Title:** `Corporate Social Responsibility | Studio Click House`
*   **New Title:** `Corporate Social Responsibility | Studio Click House (SCHL)`
*   **Old Description:** `Learn about Studio Click House's commitment to sustainable digital production...`
*   **New Description:** `Discover Studio Click House's (SCHL) commitment to sustainable green web-hosting footprints, ethical labor standards, and community support in creative ecosystems.`

### 10. Login Page (`src/routes/login/+page.svelte`)
*   **Old Title:** `Sign In | Studio Click House`
*   **New Title:** `Client Portal Sign In | Studio Click House (SCHL)`
*   **Old Description:** `Sign in to your Studio Click House client workspace to access your active projects and assets.`
*   **New Description:** `Sign in to the Studio Click House (SCHL) client workspace portal to access your active visual projects, feedback boards, and finalized assets.`

---

## Verification Plan
*   **Manual Compilation Validation:** Run Svelte checks and typescript compilation to make sure page routes load cleanly.
*   **Meta Tag Inspection:** Check the compiled page source or DOM of the home page, contact page, and others to verify `<title>` and `<meta name="description">` match the updated text.
