<script lang="ts">
  import {
    Check,
    Layers,
    Sliders,
    Box,
    Sparkles,
    ArrowRight,
  } from "lucide-svelte";
  import { cn } from "$lib/utils";

  const standards = [
    {
      id: "editorial",
      title: "High-End Editorial & Retouching",
      description:
        "Precision post-production for luxury fashion, beauty campaigns, and commercial print advertising.",
      icon: Sparkles,
      fileStandards: "16-bit TIFF // Master PSD (Layered)",
      colorSpace: "Adobe RGB (1998) // ProPhoto // sRGB",
      turnaround: "24–48 Hours Standard",
      specs: [
        "Non-destructive frequency separation workflow",
        "Micro-dodge & burn skin and fabric refinement",
        "Natural skin texture and film grain preservation",
        "Stray hair removal & background cleanup",
        "Color-matched to physical brand samples",
      ],
    },
    {
      id: "ecommerce",
      title: "E-Commerce & High-Volume Studio",
      description:
        "Scalable image processing for digital catalogs, fashion retailers, and lookbook releases.",
      icon: Layers,
      fileStandards: "Multi-Path PSD // PNG-24 Alpha // JPEG",
      colorSpace: "Calibrated sRGB Web Profile",
      turnaround: "Overnight 12–24 Hours",
      specs: [
        "100% hand-drawn pen tool clipping paths",
        "Natural drop, cast, and reflection shadows",
        "Ghost mannequin neck joint & symmetry assembly",
        "Strict batch-to-batch color consistency",
        "Automated crop & aspect ratio formatting",
      ],
    },
    {
      id: "cgi",
      title: "3D CGI & Product Visualization",
      description:
        "Photorealistic 3D rendering, CAD conversion, and interactive web 3D assets for commercial campaigns.",
      icon: Box,
      fileStandards: "4K/8K 32-bit EXR // glTF // USDZ",
      colorSpace: "ACEScg Linear Rendering Pipeline",
      turnaround: "48–72 Hours per Asset Set",
      specs: [
        "CAD/STEP geometry cleaning & UV unwrapping",
        "Custom PBR photorealistic material surfacing",
        "Studio lighting matched to physical photography",
        "360° interactive turntable & WebXR exports",
        "High-resolution still & animated video renders",
      ],
    },
    {
      id: "color",
      title: "Color Grading & Look Development",
      description:
        "Cinematic color correction and look LUT engineering for video campaigns and digital motion.",
      icon: Sliders,
      fileStandards: "ProRes 4444 XQ // .cube LUT // XML/EDL",
      colorSpace: "Rec.709 // DCI-P3 // DaVinci Wide Gamut",
      turnaround: "24 Hours Priority",
      specs: [
        "Custom brand look LUT engineering & grading",
        "Multi-camera shot-to-shot continuity matching",
        "Skin tone isolation and protective grading",
        "Broadcast legal saturation & luminance checks",
        "Master delivery for web, broadcast, and print",
      ],
    },
  ];
</script>

<section
  id="production-standards"
  class="section-space relative bg-brand-light text-brand-dark py-24 md:py-36 border-b border-brand-dark/15"
>
  <div class="site-shell">
    <!-- Clean Header without Short Text / Eyebrow labels -->
    <header class="max-w-3xl mb-16">
      <h2
        class="font-display text-[clamp(2.75rem,5vw,5rem)] font-bold tracking-[-0.04em] leading-[0.9] text-brand-dark"
      >
        Production Standards & Deliverables
      </h2>
      <p class="mt-6 text-base sm:text-lg leading-relaxed text-brand-dark/70">
        Every project at Studio Click House is delivered to strict technical
        specifications. Below are the file standards, color profiles, and quality
        assurance parameters included with each production discipline.
      </p>
    </header>

    <!-- 2x2 Responsive Grid of Technical Standards -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch"
    >
      {#each standards as item}
        <article
          class="flex flex-col justify-between rounded-2xl border border-brand-dark/15 bg-brand-paper p-8 lg:p-10 transition-all duration-300 hover:border-brand-dark/30 hover:shadow-sm"
        >
          <div>
            <!-- Icon & Title -->
            <div class="flex items-center gap-4 mb-6">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-dark/5 text-brand-dark"
              >
                {#if item.icon}
                  <item.icon size={24} strokeWidth={1.75} />
                {/if}
              </div>
              <div>
                <h3
                  class="font-display text-2xl sm:text-3xl font-normal text-brand-dark tracking-tight"
                >
                  {item.title}
                </h3>
              </div>
            </div>

            <p
              class="text-base leading-relaxed text-brand-dark/75 mb-8 max-w-xl"
            >
              {item.description}
            </p>

            <!-- Technical Specification Badges / Table -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 rounded-xl border border-brand-dark/10 bg-brand-light p-4 text-xs font-mono"
            >
              <div>
                <span class="block text-brand-dark/55 uppercase tracking-wider"
                  >File Deliverables</span
                >
                <span class="mt-1 block font-semibold text-brand-dark"
                  >{item.fileStandards}</span
                >
              </div>
              <div>
                <span class="block text-brand-dark/55 uppercase tracking-wider"
                  >Color Space</span
                >
                <span class="mt-1 block font-semibold text-brand-dark"
                  >{item.colorSpace}</span
                >
              </div>
            </div>

            <!-- Deliverable Checklist -->
            <h4
              class="font-mono text-xs font-bold uppercase tracking-wider text-brand-dark/80 mb-4"
            >
              Technical Specifications Included:
            </h4>
            <ul class="space-y-3 mb-8">
              {#each item.specs as spec}
                <li class="flex items-start gap-3 text-sm text-brand-dark/75">
                  <span
                    class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green"
                  >
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span>{spec}</span>
                </li>
              {/each}
            </ul>
          </div>

          <!-- Footer / SLA -->
          <div
            class="pt-5 border-t border-brand-dark/10 flex items-center justify-between text-xs font-mono"
          >
            <span class="text-brand-dark/60">Typical SLA Turnaround:</span>
            <span class="font-bold text-brand-green">{item.turnaround}</span>
          </div>
        </article>
      {/each}
    </div>

    <!-- Bottom Guidance Banner -->
    <div
      class="mt-12 rounded-2xl border border-brand-dark/15 bg-brand-dark text-brand-light p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div class="max-w-2xl">
        <h3 class="font-display text-2xl sm:text-3xl font-normal">
          Need a Custom Production SLA or Trial Batch?
        </h3>
        <p class="mt-2 text-sm sm:text-base text-brand-light/75 leading-relaxed">
          We offer complimentary test batch retouching and custom technical SLA
          agreements for new agency partners and eCommerce studios.
        </p>
      </div>
      <a
        href="/contact?subject=trial-batch"
        class="shrink-0 py-4 px-8 bg-brand-green text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-brand-dark transition-colors duration-300 flex items-center gap-2 shadow-sm"
      >
        Request Free Trial Batch <ArrowRight size={16} />
      </a>
    </div>
  </div>
</section>
