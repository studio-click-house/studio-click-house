<script lang="ts">
  const partners = [
    { name: "Zara", src: "/images/clients/zara_logo.png" },
    { name: "Damas", src: "/images/clients/damas_logo.png" },
    { name: "Oroton", src: "/images/clients/oroton_logo.png" },
    {
      name: "Manning Cartell",
      src: "/images/clients/manning_cartell_logo.png",
    },
    { name: "Rip Curl", src: "/images/clients/rip_curl_logo.png" },
    { name: "Studio Mint", src: "/images/clients/studio_mint_logo.png" },
    { name: "Swish", src: "/images/clients/swish_logo.png" },
    { name: "Retush", src: "/images/clients/retush_logo.png" },
  ];
</script>

<!-- Section 9: Sponsor & Brand Partner Minimal Grid (Exact Match) -->
<section
  id="portfolio-partner-logos"
  aria-label="Brand Partners and Sponsors"
  class="relative w-full bg-brand-light pt-16 pb-12 sm:pt-20 sm:pb-16 text-center"
>
  <div class="site-shell">
    <h2
      class="font-display text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark mb-12 inline-block border-b-2 border-brand-dark/25 pb-1"
    >
      Sponsor
    </h2>

    <!-- 2-Row Clean Monochrome Partner Matrix matching image -->
    <div
      class="mx-auto grid max-w-4xl grid-cols-2 border-l border-t border-brand-dark/10 sm:grid-cols-4"
    >
      {#each partners as partner (partner.src)}
        <div
          class="flex min-h-28 items-center justify-center border-b border-r border-brand-dark/10 p-6 sm:min-h-32"
        >
          <img
            src={partner.src}
            alt="{partner.name} logo"
            width="180"
            height="64"
            loading="lazy"
            decoding="async"
            class="max-h-10 w-auto max-w-32 object-contain opacity-55 grayscale transition duration-300 hover:opacity-80"
          />
        </div>
      {/each}
    </div>
  </div>
</section>
