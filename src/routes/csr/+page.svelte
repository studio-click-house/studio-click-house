<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";

  const pillars = [
    {
      id: "fair-labor",
      title: "Ethical Production Standards",
      desc: "Our production studio team works in healthy, balanced environments with fair hourly compensation, breaking the industry trend of exploitative piece-rate outsourcing.",
    },
    {
      id: "green-compute",
      title: "Sustainable Processing & Infrastructure",
      desc: "We prioritize host environments powered by renewable energy. Our servers and Cloudflare storage infrastructure utilize energy-efficient nodes to reduce image rendering footprints.",
    },
    {
      id: "community-support",
      title: "Supporting Local Creative Ecosystems",
      desc: "We dedicate 3% of our annual studio hours to supporting non-profit media projects, local independent archives, and emerging editorial artists with free finishing support.",
    },
  ];
</script>

<PageMeta
  title="Corporate Social Responsibility | Studio Click House"
  description="Learn about Studio Click House's commitment to sustainable digital production, ethical labor standards, and community creative support."
  canonicalPath="/csr"
/>

<main id="csr-page" class="min-h-[100dvh] bg-brand-paper pt-32 pb-24">
  <div class="site-shell">
    <div
      class="border-x border-brand-dark/10 px-5 pb-10 pt-12 sm:px-10 lg:px-16"
    >
      <p class="eyebrow text-brand-green">Operating with Intent</p>

      <div class="mt-8 max-w-4xl border-b border-brand-dark/15 pb-12">
        <h1 class="display-title">Digital CSR</h1>
        <p
          class="mt-8 max-w-xl text-base leading-relaxed text-brand-dark/65 sm:text-lg"
        >
          We believe post-production should respect the human hands behind the
          screens and the environments powering our digital pipelines.
        </p>
      </div>

      <div class="mt-16 grid gap-12 lg:grid-cols-[1fr_0.4fr]">
        <!-- Pillars List -->
        <div class="space-y-12">
          {#each pillars as pillar (pillar.id)}
            <article
              class="border-b border-brand-dark/10 pb-10 last:border-0 last:pb-0"
            >
              <span
                class="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand-green"
              >
                Pillar · {pillar.id.replace("-", " ")}
              </span>
              <h2
                class="mt-3 font-display text-2xl tracking-[-0.02em] text-brand-dark sm:text-3xl"
              >
                {pillar.title}
              </h2>
              <p
                class="mt-4 max-w-2xl text-sm leading-relaxed text-brand-dark/65"
              >
                {pillar.desc}
              </p>
            </article>
          {/each}
        </div>

        <!-- Sidebar Contact Info -->
        <div
          class="space-y-8 border-t border-brand-dark/10 pt-10 lg:border-t-0 lg:border-l lg:border-brand-dark/10 lg:pt-0 lg:pl-10"
        >
          <div>
            <h3
              class="font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand-dark"
            >
              Partnering on Impact
            </h3>
            <p class="mt-4 text-xs leading-relaxed text-brand-dark/65">
              Are you a registered non-profit, cultural archive, or public arts
              group in need of specialized post-production, color, or archiving
              services?
            </p>
            <a
              href={resolve("/contact")}
              class="text-link mt-6 text-brand-dark"
            >
              Pitch your project <ArrowUpRight size={14} />
            </a>
          </div>

          <div class="border-t border-brand-dark/10 pt-8">
            <h3
              class="font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand-dark"
            >
              Our Commitment
            </h3>
            <p class="mt-4 text-xs leading-relaxed text-brand-dark/65">
              By choosing Studio Click House, you support a digital supply chain
              that prioritizes workers and utilizes energy-conscious cloud
              delivery nodes.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
