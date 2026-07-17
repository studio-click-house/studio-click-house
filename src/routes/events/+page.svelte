<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";

  const events = [
    {
      id: "jewelry-masterclass",
      category: "Masterclass",
      date: "Aug 24, 2026",
      title: "Jewelry Retouching & Macro Reflection Control",
      description:
        "A close-detail workshop on cleaning complex metallic reflections and gemstone facets without destroying organic surface details.",
      status: "Open for registrations",
      location: "Studio Click House NYC / Hybrid",
    },
    {
      id: "fashion-week-workflow",
      category: "Case Study & Showcase",
      date: "Sep 12, 2026",
      title: "High-Volume High-End Fashion Campaign Workflow",
      description:
        "How to maintain strict skin-tone consistency and silhouette geometry across 1,200+ images for rapid seasonal collection rollouts.",
      status: "Invites only",
      location: "Paris Studio / Online",
    },
    {
      id: "neck-joint-innovation",
      category: "Technical Lab",
      date: "Oct 05, 2026",
      title: "The Invisible Mannequin: Neck Joints & Geometry",
      description:
        "Advanced techniques in garment reconstruction, shadow mapping, and collar lining blending for premium e-commerce catalogs.",
      status: "Registrations opening soon",
      location: "London Hub / Online",
    },
  ];
</script>

<PageMeta
  title="Studio Events & Masterclasses | Studio Click House"
  description="Explore upcoming events, masterclasses, and workshops hosted by Studio Click House, covering advanced image post-production and retouching."
  canonicalPath="/events"
/>

<main id="events-page" class="min-h-[100dvh] bg-brand-paper pt-32 pb-24">
  <div class="site-shell">
    <div
      class="border-x border-brand-dark/10 px-5 pb-10 pt-12 sm:px-10 lg:px-16"
    >
      <p class="eyebrow text-brand-green">Studio Programming</p>

      <div class="mt-8 max-w-4xl border-b border-brand-dark/15 pb-12">
        <h1 class="display-title">Events &amp; Labs</h1>
        <p
          class="mt-8 max-w-xl text-base leading-relaxed text-brand-dark/65 sm:text-lg"
        >
          Connecting production managers, retouchers, and creative leads through
          technical breakdowns, masterclasses, and workflow discussions.
        </p>
      </div>

      <div class="mt-16 grid gap-12 lg:grid-cols-[1fr_0.4fr]">
        <!-- Events List -->
        <div class="space-y-12">
          {#each events as event (event.id)}
            <article
              class="group border-b border-brand-dark/10 pb-12 last:border-0 last:pb-0"
            >
              <div
                class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <span
                    class="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand-green"
                  >
                    {event.category} · {event.date}
                  </span>
                  <h2
                    class="mt-3 font-display text-2xl tracking-[-0.02em] text-brand-dark group-hover:text-brand-green transition-colors duration-200 sm:text-3xl"
                  >
                    {event.title}
                  </h2>
                  <p
                    class="mt-4 max-w-2xl text-sm leading-relaxed text-brand-dark/65"
                  >
                    {event.description}
                  </p>
                  <p
                    class="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-brand-dark/45"
                  >
                    Location: {event.location}
                  </p>
                </div>
                <div class="mt-4 shrink-0 sm:mt-0">
                  <span
                    class="inline-block border border-brand-dark/20 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-dark bg-brand-light"
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            </article>
          {/each}
        </div>

        <!-- Sidebar Info -->
        <div
          class="space-y-8 border-t border-brand-dark/10 pt-10 lg:border-t-0 lg:border-l lg:border-brand-dark/10 lg:pt-0 lg:pl-10"
        >
          <div>
            <h3
              class="font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand-dark"
            >
              Private Workshops
            </h3>
            <p class="mt-4 text-xs leading-relaxed text-brand-dark/65">
              Looking for dedicated team training on retouching workflows,
              jewelry macro finishing, or ghost mannequin automation? We host
              private training tailored for your production crew.
            </p>
            <a
              href={resolve("/contact")}
              class="text-link mt-6 text-brand-dark"
            >
              Inquire about workshops <ArrowUpRight size={14} />
            </a>
          </div>

          <div class="border-t border-brand-dark/10 pt-8">
            <h3
              class="font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand-dark"
            >
              Newsletter
            </h3>
            <p class="mt-4 text-xs leading-relaxed text-brand-dark/65">
              Receive notifications when registrations open for new technical
              sessions and e-commerce labs.
            </p>
            <div class="mt-5 flex gap-2">
              <Input
                type="email"
                aria-label="Email address for event updates"
                placeholder="Enter email"
                class="h-auto min-w-0 flex-1 rounded-none border-brand-dark/20 bg-brand-light px-3 py-2 text-xs font-sans placeholder:text-brand-dark/35 focus-visible:border-brand-green focus-visible:ring-0"
              />
              <Button
                type="button"
                class="h-auto rounded-none bg-brand-dark px-4 py-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.14em] text-brand-light hover:bg-brand-green hover:text-brand-dark"
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
