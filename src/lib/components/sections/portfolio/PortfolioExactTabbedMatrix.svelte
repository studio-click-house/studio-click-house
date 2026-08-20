<script lang="ts">
  type TabId = "all" | "retouch" | "clipping" | "color";

  interface ScheduleItem {
    time: string;
    title: string;
    desc: string;
  }

  let activeTab = $state<TabId>("retouch");

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "all", label: "Special Scopes" },
    { id: "retouch", label: "Editorial Retouch" },
    { id: "clipping", label: "Vector Clipping" },
    { id: "color", label: "Color & Swatches" },
  ];

  const scheduleItemsByTab: Record<TabId, ScheduleItem[]> = {
    all: [
      {
        time: "09:00",
        title: "Pen Path Vector Isolation",
        desc: "Sub-pixel hand-drawn boundaries with natural fiber retention.",
      },
      {
        time: "11:30",
        title: "Frequency Separation & Skin",
        desc: "Pore-level refinement without synthetic texture blurring.",
      },
      {
        time: "14:00",
        title: "Hollow Neck Construction",
        desc: "Inner collar reconstruction with natural drape and volume.",
      },
      {
        time: "16:30",
        title: "Garment Color Shift",
        desc: "Targeted recoloring while retaining folds and highlights.",
      },
      {
        time: "18:00",
        title: "Reflection Polishing",
        desc: "Macro cleanup, tonal balancing, and final delivery review.",
      },
    ],
    retouch: [
      {
        time: "08:30",
        title: "Raw Frame Review",
        desc: "Lighting, textile, skin, and campaign-reference assessment.",
      },
      {
        time: "10:00",
        title: "Skin & Texture Pass",
        desc: "Non-destructive cleanup with natural micro-texture intact.",
      },
      {
        time: "12:30",
        title: "Fabric Sculpting",
        desc: "Crease control and contour shaping without flattening material.",
      },
      {
        time: "15:00",
        title: "Light & Tonal Finish",
        desc: "Dodge-and-burn refinement calibrated to the art direction.",
      },
      {
        time: "17:30",
        title: "Editorial QC",
        desc: "Full-resolution edge, grain, and color consistency review.",
      },
    ],
    clipping: [
      {
        time: "08:00",
        title: "Boundary Inspection",
        desc: "Silhouette, transparency, and soft-edge requirements mapped.",
      },
      {
        time: "10:30",
        title: "Primary Pen Path",
        desc: "Hand-drawn Bézier paths follow the natural product contour.",
      },
      {
        time: "13:00",
        title: "Multipath Separation",
        desc: "Materials and color zones isolated into named editable paths.",
      },
      {
        time: "15:30",
        title: "Edge Refinement",
        desc: "Hair, fibers, and transparent surfaces receive custom masks.",
      },
      {
        time: "18:00",
        title: "Export Validation",
        desc: "Paths, masks, dimensions, and file profiles checked before handoff.",
      },
    ],
    color: [
      {
        time: "09:00",
        title: "Reference Calibration",
        desc: "Approved swatches and source profiles establish the target.",
      },
      {
        time: "11:00",
        title: "Selective Masking",
        desc: "Garment zones are separated without contaminating skin or props.",
      },
      {
        time: "13:30",
        title: "Hue & Luminance Match",
        desc: "Color, sheen, and density are balanced across the product set.",
      },
      {
        time: "16:00",
        title: "Cross-SKU Consistency",
        desc: "Every variation is compared at identical viewing conditions.",
      },
      {
        time: "18:30",
        title: "Profile Delivery",
        desc: "Final files are checked in their approved output color space.",
      },
    ],
  };

  let activeSchedule = $derived(scheduleItemsByTab[activeTab]);
</script>

<!-- Section 6: Tabbed Matrix + Giant Number "26" + 2-Column Structured Item List (Exact Match to Image) -->
<section
  id="portfolio-tabbed-matrix"
  aria-label="Disciplines Schedule and Delivery Matrix"
  class="relative w-full bg-brand-light py-16 lg:py-24 border-b border-brand-dark/10"
>
  <div class="site-shell relative z-10">
    <!-- Top 4-Tab Bar (Exact layout with clean borders & active indicator) -->
    <div
      class="border-b border-brand-dark/15 flex items-center justify-between overflow-x-auto no-scrollbar"
    >
      <div
        class="flex min-w-max items-center gap-6 sm:gap-12"
        role="tablist"
        aria-label="Portfolio production scopes"
      >
        {#each tabs as tab (tab.id)}
          <button
            type="button"
            onclick={() => (activeTab = tab.id)}
            class="relative py-4 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer {activeTab ===
            tab.id
              ? 'text-brand-green font-bold'
              : 'text-brand-dark/60 hover:text-brand-dark'}"
            role="tab"
            id="portfolio-tab-{tab.id}"
            aria-controls="portfolio-panel-{tab.id}"
            aria-selected={activeTab === tab.id}
            tabindex={activeTab === tab.id ? 0 : -1}
          >
            <span>{tab.label}</span>
            {#if activeTab === tab.id}
              <span
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green"
              ></span>
            {/if}
          </button>
        {/each}
      </div>

      <div class="hidden md:flex items-center text-brand-green pr-2">
        <span class="text-xs font-mono font-semibold uppercase tracking-widest"
          >+ Live SLA</span
        >
      </div>
    </div>

    <!-- Main Content Area: Left "26" Number Card + Right 2-Column Schedule List -->
    <div
      class="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start"
    >
      <!-- Left Column: Giant Number Callout (Matches "26" in reference image) -->
      <div class="md:col-span-4 flex flex-col items-start pr-4">
        <span
          class="font-mono text-xs font-semibold uppercase tracking-widest text-brand-green mb-3"
        >
          Daily Production
        </span>

        <div
          class="font-display text-7xl sm:text-8xl lg:text-9xl font-normal text-brand-dark leading-none tracking-tight flex items-start mb-4"
        >
          <span>26</span>
          <span
            class="text-2xl sm:text-3xl font-light text-brand-green ml-1 mt-2"
            >TH</span
          >
        </div>

        <p
          class="text-xs sm:text-sm text-brand-dark/75 leading-relaxed font-normal max-w-xs"
        >
          Pixel-perfect delivery for global fashion campaigns, editorial
          publications, and high-volume e-commerce catalogs.
        </p>
      </div>

      <!-- Right Column: 2-Column Structured Item Grid (Matches reference schedule items) -->
      <div
        id="portfolio-panel-{activeTab}"
        class="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 md:col-span-8"
        role="tabpanel"
        aria-labelledby="portfolio-tab-{activeTab}"
      >
        {#each activeSchedule as item (item.time)}
          <div class="border-t border-brand-dark/10 pt-4">
            <span
              class="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-green block mb-1"
            >
              {item.time}
            </span>
            <h3 class="font-display text-lg font-normal text-brand-dark mb-1.5">
              {item.title}
            </h3>
            <p class="text-xs text-brand-dark/70 leading-relaxed font-normal">
              {item.desc}
            </p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Bottom Right "Gallery" Link (Exact match to label in reference image) -->
    <div class="mt-12 flex justify-end">
      <a
        href="#portfolio-mosaic-gallery"
        class="font-display text-xl sm:text-2xl font-normal text-brand-dark hover:text-brand-green transition-colors tracking-tight inline-flex items-center gap-1.5"
      >
        <span>Gallery</span>
        <span class="text-brand-green font-light">↗</span>
      </a>
    </div>
  </div>
</section>
