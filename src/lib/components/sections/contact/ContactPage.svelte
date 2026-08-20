<script lang="ts">
  import { onMount } from "svelte";
  import {
    ArrowDown,
    ArrowUpRight,
    Check,
    Copy,
    Globe2,
    Mail,
    MapPin,
    Phone,
  } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { contactServiceDetails, contactServices } from "$lib/content/contact";
  import { siteConfig } from "$lib/config/site";
  import ContactHeroCard from "./ContactHeroCard.svelte";
  import ContactSignalField from "./ContactSignalField.svelte";

  let pageRoot: HTMLElement;
  let signalSection: HTMLElement;
  let briefSection: HTMLElement;
  let officesSection: HTMLElement;

  let selectedService = $state<(typeof contactServices)[number]>(
    contactServices[0],
  );
  let formStatus = $state("");
  let briefPrepared = $state(false);
  let emailCopied = $state(false);
  let selectedServiceDetail = $derived(
    contactServiceDetails.find((service) => service.name === selectedService) ??
      contactServiceDetails[0],
  );

  const primaryOffice = siteConfig.contact.offices[0];
  const regionalOffices = siteConfig.contact.offices.slice(1);

  async function copyStudioEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.contact.email);
      emailCopied = true;
      window.setTimeout(() => (emailCopied = false), 2200);
    } catch {
      window.location.href = `mailto:${siteConfig.contact.email}`;
    }
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;

    briefPrepared = true;
    formStatus = "We received your project details, we will reply shortly.";
  }

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !pageRoot) return;
      const { gsap } = runtime;

      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          const heroTimeline = gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .addLabel("copy")
            .from(
              ".contact-title-line",
              {
                yPercent: 108,
                duration: 1,
                stagger: 0.08,
              },
              "copy",
            )
            .from(
              ".contact-hero-reveal",
              {
                autoAlpha: 0,
                y: 20,
                duration: 0.7,
                stagger: 0.07,
              },
              "-=0.52",
            )
            .from(
              ".contact-hero-card-wrap",
              {
                autoAlpha: 0,
                y: 34,
                scale: 0.965,
                duration: 0.9,
                stagger: 0.09,
              },
              "copy+=0.18",
            )
            .from(
              ".contact-channel",
              {
                autoAlpha: 0,
                y: 26,
                duration: 0.62,
                stagger: 0.07,
              },
              "-=0.45",
            );

          heroTimeline.addLabel("heroReady");

          gsap.to(".contact-hero-copy", {
            yPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: "#contact-hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.to(".contact-hero-card-main", {
            yPercent: -9,
            ease: "none",
            scrollTrigger: {
              trigger: "#contact-hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.to(".contact-hero-card-side", {
            yPercent: -15,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: "#contact-hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.fromTo(
            ".contact-signal-copy",
            { yPercent: 18 },
            {
              yPercent: -12,
              ease: "none",
              scrollTrigger: {
                trigger: signalSection,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          gsap.from(".contact-brief-reveal", {
            autoAlpha: 0,
            y: 28,
            duration: 0.82,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: {
              trigger: briefSection,
              start: "top 78%",
              once: true,
            },
          });

          gsap.from(".contact-office-reveal", {
            autoAlpha: 0,
            y: 18,
            duration: 0.45,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: officesSection,
              start: "top 85%",
              once: true,
            },
          });
        });
      }, pageRoot);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>

<div bind:this={pageRoot} class="contact-page bg-brand-light text-brand-dark">
  <section
    id="contact-hero"
    aria-labelledby="contact-page-title"
    class="relative flex min-h-dvh flex-col bg-brand-paper pt-24 sm:pt-28"
  >
    <div class="site-shell flex flex-1 items-center py-8 sm:py-10 lg:py-12">
      <div class="grid w-full gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div class="contact-hero-copy lg:col-span-7">
          <h1
            id="contact-page-title"
            class="mt-5 max-w-none font-display text-[clamp(3.25rem,5.5vw,6.1rem)] leading-[0.9] tracking-[-0.05em] sm:whitespace-nowrap"
          >
            <span class="contact-title-mask">
              <span class="contact-title-line">Start a project.</span>
            </span>
          </h1>
          <p
            class="contact-hero-reveal mt-7 max-w-xl text-base leading-7 text-brand-dark/70 sm:text-lg"
          >
            Image editing, video post-production, and CGI with 24/7 support for
            international creative teams.
          </p>
          <div
            class="contact-hero-reveal mt-8 flex flex-wrap items-center gap-5"
          >
            <a
              href="#project-brief"
              class="group inline-flex min-h-12 items-center gap-3 rounded-[0.55rem] bg-brand-dark px-6 font-mono text-[0.65rem] font-bold uppercase tracking-[0.13em] text-brand-light transition-colors duration-300 hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
            >
              Send a brief
              <ArrowDown size={15} />
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              class="group inline-flex min-h-12 items-center gap-2 rounded-[0.55rem] border border-brand-dark/22 px-4 text-sm font-semibold transition-colors duration-300 hover:border-brand-green hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
            >
              {siteConfig.contact.email}
              <ArrowUpRight
                size={15}
                class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>

        <figure class="contact-hero-media lg:col-span-5">
          <div class="grid grid-cols-[1.18fr_0.82fr] gap-3">
            <div class="contact-hero-card-wrap contact-hero-card-main">
              <ContactHeroCard
                src="/images/contact/project-handoff.png"
                alt="Creative team reviewing fashion contact sheets and marked proofs"
                width={1024}
                height={1536}
                loading="eager"
                aspectClass="aspect-[3/4] w-full"
              />
            </div>
            <div class="grid gap-3">
              <div class="contact-hero-card-wrap contact-hero-card-side">
                <ContactHeroCard
                  src="/images/portfolio/photo-editing-showcase.png"
                  alt="Finished fashion portrait with professional retouching"
                  width={1024}
                  height={1024}
                  loading="eager"
                  aspectClass="aspect-square w-full"
                />
              </div>
              <div class="contact-hero-card-wrap contact-hero-card-side">
                <ContactHeroCard
                  src="/images/portfolio/cgi-product-showcase.png"
                  alt="Finished CGI fragrance visualization"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  aspectClass="aspect-square w-full"
                />
              </div>
            </div>
          </div>
        </figure>
      </div>
    </div>

    <div
      id="contact-channels"
      aria-label="Direct contact options"
      class="w-full shrink-0 border-t border-brand-dark/10 bg-brand-light/80 py-6 sm:py-7 lg:py-8 backdrop-blur-sm"
    >
      <div class="site-shell mx-auto grid content-center items-center gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <a href={`mailto:${siteConfig.contact.email}`} class="contact-channel">
          <span class="contact-channel-icon shrink-0">
            <Mail size={18} aria-hidden="true" />
          </span>
          <span class="contact-channel-text">
            <small>Email</small>
            <span>{siteConfig.contact.email}</span>
          </span>
        </a>
        <a href={`tel:${siteConfig.contact.phoneHref}`} class="contact-channel">
          <span class="contact-channel-icon shrink-0">
            <Phone size={18} aria-hidden="true" />
          </span>
          <span class="contact-channel-text">
            <small>Call us</small>
            <span>{siteConfig.contact.phone}</span>
          </span>
        </a>
        <a
          href={siteConfig.contact.websiteHref}
          class="contact-channel"
          target="_blank"
          rel="noreferrer"
        >
          <span class="contact-channel-icon shrink-0">
            <Globe2 size={18} aria-hidden="true" />
          </span>
          <span class="contact-channel-text">
            <small>Website</small>
            <span>{siteConfig.contact.website}</span>
          </span>
        </a>
        <a href="#global-offices" class="contact-channel">
          <span class="contact-channel-icon shrink-0">
            <MapPin size={18} aria-hidden="true" />
          </span>
          <span class="contact-channel-text">
            <small>Main studio</small>
            <span>Dhaka, Bangladesh</span>
          </span>
        </a>
      </div>
    </div>
  </section>

  <section
    id="contact-signal"
    bind:this={signalSection}
    aria-labelledby="contact-signal-title"
    class="relative overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-24 lg:py-28"
  >
    <!-- 3D Wave Canvas inset behind the text -->
    <ContactSignalField />

    <div class="site-shell relative z-10 mx-auto max-w-4xl text-center">
      <h2
        id="contact-signal-title"
        class="text-balance font-display text-[clamp(2.4rem,4.6vw,4.5rem)] leading-[0.95] tracking-[-0.04em] text-brand-dark"
      >
        A clear brief turns scattered inputs into one production signal.
      </h2>
      <p
        class="mx-auto mt-6 max-w-xl text-base leading-7 text-brand-dark/72 sm:text-lg"
      >
        You do not need to solve the workflow before writing. Bring the
        material and the intended finish; we can shape the route together.
      </p>
    </div>
  </section>

  <section
    id="project-brief"
    bind:this={briefSection}
    aria-labelledby="project-brief-title"
    class="relative bg-brand-paper py-16 text-brand-dark lg:py-20"
  >
    <div class="site-shell">
      <header class="contact-brief-reveal max-w-3xl">
        <h2
          id="project-brief-title"
          class="text-balance font-display text-[clamp(2.6rem,4vw,4.6rem)] leading-[0.92] tracking-[-0.04em]"
        >
          Share your project details.
        </h2>
        <p
          id="project-brief-description"
          class="mt-5 max-w-2xl text-base leading-7 text-brand-dark/68"
        >
          Provide the details you have. We will follow up on anything incomplete after reviewing.
        </p>
      </header>

      <div
        class="contact-brief-reveal mt-8 grid gap-5 lg:grid-cols-12 lg:gap-6"
      >
        <form
          id="contact-form"
          aria-describedby="project-brief-description"
          class="rounded-[1rem] border border-brand-dark/14 bg-brand-light p-5 sm:p-6 lg:col-span-8 lg:p-7"
          onsubmit={handleSubmit}
        >
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="brief-field">
              <span class="brief-field-label">Name *</span>
              <input
                id="contact-name"
                name="name"
                type="text"
                autocomplete="name"
                required
                class="brief-field-input"
              />
            </label>
            <label class="brief-field">
              <span class="brief-field-label">Email *</span>
              <input
                id="contact-email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="brief-field-input"
              />
            </label>
            <label class="brief-field">
              <span class="brief-field-label">Phone</span>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                class="brief-field-input"
              />
            </label>
            <label class="brief-field">
              <span class="brief-field-label">Company or brand</span>
              <input
                id="contact-company"
                name="company"
                type="text"
                autocomplete="organization"
                class="brief-field-input"
              />
            </label>
          </div>

          <fieldset class="mt-6">
            <legend class="brief-field-label">Service</legend>
            <div class="mt-3 grid gap-2 sm:grid-cols-3">
              {#each contactServiceDetails as service (service.name)}
                <button
                  type="button"
                  class="brief-service-card group flex min-h-12 items-center justify-between border border-brand-dark/18 px-3.5 py-3 text-left"
                  class:is-selected={selectedService === service.name}
                  aria-pressed={selectedService === service.name}
                  onclick={() => (selectedService = service.name)}
                >
                  <span>{service.name}</span>
                  <span class="service-check" aria-hidden="true">
                    <Check size={14} />
                  </span>
                </button>
              {/each}
            </div>
          </fieldset>

          <label class="brief-note mt-5">
            <span class="brief-field-label">Your message *</span>
            <textarea
              id="contact-message"
              name="message"
              required
              rows="5"
              class="brief-note-input"
              placeholder="Source material, intended result, volume, timing, and anything that must stay consistent."
            ></textarea>
          </label>

          <div
            class="mt-5 flex flex-col gap-4 border-t border-brand-dark/12 pt-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div
              class="max-w-md text-xs leading-5 text-brand-dark/60"
              aria-live="polite"
            >
              {#if briefPrepared}
                <p class="flex items-start gap-2 text-brand-dark/76">
                  <Check size={14} class="mt-0.5 shrink-0 text-brand-green" />
                  {formStatus}
                </p>
              {:else}
                <p>We usually respond within 1–2 hours.</p>
              {/if}
            </div>
            <button type="submit" class="brief-submit group">
              Submit details
              <ArrowUpRight
                size={16}
                class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </form>

        <aside class="lg:col-span-4">
          <div
            class="overflow-hidden rounded-[1rem] border border-brand-dark/14 bg-brand-light lg:sticky lg:top-24"
          >
            <figure>
              <img
                src={selectedServiceDetail.image}
                alt={selectedServiceDetail.imageAlt}
                width="1200"
                height="900"
                loading="lazy"
                class="aspect-[4/3] w-full object-cover object-center"
              />
              <figcaption class="bg-brand-dark p-5 text-brand-light">
                <p class="font-display text-2xl tracking-[-0.02em]">
                  {selectedServiceDetail.name}
                </p>
                <p class="mt-2 text-sm leading-6 text-brand-light/66">
                  {selectedServiceDetail.descriptor}
                </p>
              </figcaption>
            </figure>
            <div class="p-5">
              <h3 class="font-display text-2xl tracking-[-0.02em]">
                Have questions?
              </h3>
              <p class="mt-2 text-sm leading-6 text-brand-dark/62">
                Call or email the Dhaka studio before sending a brief.
              </p>
              <div class="mt-5 grid gap-3 text-sm">
                <a
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  class="contact-detail-link"
                >
                  <Phone size={15} />
                  {siteConfig.contact.phone}
                </a>
                <div class="flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    class="contact-detail-link"
                  >
                    <Mail size={15} />
                    {siteConfig.contact.email}
                  </a>
                  <button
                    type="button"
                    onclick={copyStudioEmail}
                    class="inline-flex items-center gap-1.5 rounded-[0.55rem] border border-brand-dark/14 px-2 py-1 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-brand-dark/54 transition-colors hover:border-brand-green hover:text-brand-green"
                    aria-live="polite"
                  >
                    {#if emailCopied}
                      <Check size={12} /> Copied
                    {:else}
                      <Copy size={12} /> Copy
                    {/if}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section
    id="global-offices"
    bind:this={officesSection}
    aria-labelledby="global-offices-title"
    class="bg-brand-light py-16 text-brand-dark lg:py-24"
  >
    <div class="site-shell">
      <header class="contact-office-reveal max-w-3xl">
        <h2
          id="global-offices-title"
          class="text-balance font-display text-[clamp(2.7rem,4.6vw,5.4rem)] leading-[0.9] tracking-[-0.045em]"
        >
          Reach us here.
        </h2>
        <p class="mt-5 max-w-xl text-base leading-7 text-brand-dark/66">
          Our production team works across borders to bring every project to life.
        </p>
      </header>

      <div class="mt-10 space-y-6">
        <!-- Main Production Studio (Dhaka HQ) — Flagship Luxury Dark Card -->
        <article
          class="contact-office-reveal relative overflow-hidden rounded-[1.5rem] bg-brand-dark p-7 text-brand-light sm:p-9 lg:p-11 border border-white/10 shadow-2xl transition-all duration-300 hover:border-brand-green/45 hover:shadow-[0_24px_64px_-16px_rgba(126,166,65,0.18)]"
        >
          <!-- Ambient Green Luxury Glow -->
          <div
            class="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-green/14 blur-3xl"
            aria-hidden="true"
          ></div>

          <!-- 2-Column Content: Details + Glassmorphic Channels -->
          <div class="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div class="lg:col-span-5">
              <h3
                class="font-display text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.92] tracking-[-0.04em] text-brand-light"
              >
                {primaryOffice.country}
              </h3>
              <p class="mt-4 max-w-md text-sm leading-relaxed text-brand-light/75">
                {primaryOffice.address}
              </p>
            </div>

            <div class="grid gap-3.5 sm:grid-cols-2 lg:col-span-7">
              <a href={`tel:${primaryOffice.phoneHref}`} class="office-channel-dark">
                <Phone size={16} class="text-brand-green shrink-0" />
                <div>
                  <small>Phone line</small>
                  <span>{primaryOffice.phone}</span>
                </div>
              </a>
              <a href={`mailto:${primaryOffice.email}`} class="office-channel-dark">
                <Mail size={16} class="text-brand-green shrink-0" />
                <div>
                  <small>Studio inbox</small>
                  <span>{primaryOffice.email}</span>
                </div>
              </a>
              {#if primaryOffice.website && primaryOffice.websiteHref}
                <a href={primaryOffice.websiteHref} target="_blank" rel="noreferrer" class="office-channel-dark">
                  <Globe2 size={16} class="text-brand-green shrink-0" />
                  <div>
                    <small>Official site</small>
                    <span>{primaryOffice.website}</span>
                  </div>
                </a>
              {/if}
              {#if primaryOffice.skype}
                <a href={`skype:${primaryOffice.skype}?chat`} class="office-channel-dark">
                  <ArrowUpRight size={16} class="text-brand-green shrink-0" />
                  <div>
                    <small>Skype direct</small>
                    <span>{primaryOffice.skype}</span>
                  </div>
                </a>
              {/if}
            </div>
          </div>
        </article>

        <!-- 3 Regional Desks -->
        <div class="regional-offices-grid">
          {#each regionalOffices as office (office.id)}
            <article
              class="contact-office-reveal flex h-full flex-col justify-between rounded-2xl border border-brand-dark/16 bg-brand-paper/95 p-6 sm:p-7 shadow-sm transition-all duration-300 hover:border-brand-green/50 hover:shadow-md"
            >
              <div>
                <h3 class="font-display text-3xl font-light tracking-[-0.035em] text-brand-dark">
                  {office.country}
                </h3>
                <p class="mt-2 text-xs leading-relaxed text-brand-dark/75">{office.address}</p>
              </div>

              <div class="mt-6 flex flex-col gap-1.5 border-t border-brand-dark/10 pt-4">
                <a href={`tel:${office.phoneHref}`} class="regional-contact-btn">
                  <Phone size={13} class="text-brand-green shrink-0" />
                  <span>{office.phone}</span>
                </a>
                <a href={`mailto:${office.email}`} class="regional-contact-btn">
                  <Mail size={13} class="text-brand-green shrink-0" />
                  <span>{office.email}</span>
                </a>
              </div>
            </article>
          {/each}
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .contact-title-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }

  .contact-title-line {
    display: block;
    will-change: transform;
  }

  .contact-channel {
    display: flex;
    width: 100%;
    min-width: 0;
    align-items: center;
    gap: 0.95rem;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 12%, transparent);
    border-radius: 0.75rem;
    background: var(--color-brand-paper);
    padding: 1.05rem 1.25rem;
    color: var(--color-brand-dark);
    transition:
      transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 240ms ease,
      background-color 240ms ease,
      box-shadow 240ms ease;
  }

  .contact-channel:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--color-brand-green) 50%, transparent);
    background: color-mix(
      in srgb,
      var(--color-brand-green) 6%,
      var(--color-brand-paper)
    );
    box-shadow: 0 8px 24px -6px rgba(126, 166, 65, 0.12);
  }

  .contact-channel-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: color-mix(in srgb, var(--color-brand-dark) 70%, transparent);
    transition: color 240ms ease, transform 240ms ease;
  }

  .contact-channel:hover .contact-channel-icon {
    color: var(--color-brand-green);
    transform: scale(1.08);
  }

  .contact-channel-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    justify-content: center;
  }

  .contact-channel-text small {
    display: block;
    margin-bottom: 0.15rem;
    color: color-mix(in srgb, var(--color-brand-dark) 48%, transparent);
    font-family: var(--font-mono);
    font-size: 0.55rem;
    font-weight: 600;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    line-height: 1;
  }

  .contact-channel-text span {
    min-width: 0;
    overflow-wrap: anywhere;
    font-size: 0.85rem;
    font-weight: 600;
    line-height: 1.25;
    color: var(--color-brand-dark);
  }

  .brief-field-label {
    display: block;
    color: color-mix(in srgb, var(--color-brand-dark) 64%, transparent);
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.13em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .brief-field {
    display: flex;
    min-height: 5.5rem;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 18%, transparent);
    border-radius: 0.65rem;
    background: var(--color-brand-paper);
    padding: 1rem;
    transition:
      border-color 220ms ease,
      background-color 220ms ease;
  }

  .brief-field:focus-within,
  .brief-note:focus-within {
    border-color: var(--color-brand-green);
    background: color-mix(in srgb, var(--color-brand-green) 8%, transparent);
  }

  .brief-field-input {
    width: 100%;
    border: 0;
    background: transparent;
    padding-top: 0.75rem;
    color: var(--color-brand-dark);
    font-family: var(--font-sans);
    font-size: 1rem;
    line-height: 1.3;
    outline: none;
  }

  .brief-service-card {
    border-radius: 0.55rem;
    background: var(--color-brand-paper);
    color: var(--color-brand-dark);
    font-family: var(--font-mono);
    font-size: 0.61rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    transition:
      border-color 220ms ease,
      background-color 220ms ease,
      color 220ms ease,
      transform 180ms ease;
  }

  .brief-service-card:hover {
    border-color: var(--color-brand-green);
  }

  .brief-service-card.is-selected {
    border-color: var(--color-brand-dark);
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
  }

  .service-check {
    opacity: 0;
    color: var(--color-brand-green);
    transition: opacity 180ms ease;
  }

  .brief-service-card.is-selected .service-check {
    opacity: 1;
  }

  .brief-service-card:active,
  .brief-submit:active {
    transform: scale(0.98);
  }

  .brief-note {
    display: block;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 18%, transparent);
    border-radius: 0.65rem;
    background: var(--color-brand-paper);
    padding: 1rem;
    transition:
      border-color 220ms ease,
      background-color 220ms ease;
  }

  .brief-note-input {
    display: block;
    min-height: 8.5rem;
    width: 100%;
    resize: vertical;
    border: 0;
    background: transparent;
    padding-top: 0.9rem;
    color: var(--color-brand-dark);
    font-family: var(--font-sans);
    font-size: 1rem;
    line-height: 1.55;
    outline: none;
  }

  .brief-note-input::placeholder {
    color: color-mix(in srgb, var(--color-brand-dark) 54%, transparent);
  }

  .brief-submit {
    display: inline-flex;
    min-height: 3.25rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border-radius: 0.55rem;
    background: var(--color-brand-green);
    padding-inline: 1.35rem;
    color: var(--color-brand-dark);
    font-family: var(--font-mono);
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    transition:
      background-color 220ms ease,
      color 220ms ease,
      transform 180ms ease;
  }

  .brief-submit:hover {
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
  }

  .office-channel-dark {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.85rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.95rem 1.15rem;
    color: var(--color-brand-light);
    backdrop-filter: blur(12px);
    transition:
      border-color 240ms ease,
      background-color 240ms ease,
      transform 240ms ease;
  }

  .office-channel-dark:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--color-brand-green) 60%, transparent);
    background: color-mix(
      in srgb,
      var(--color-brand-green) 12%,
      rgba(255, 255, 255, 0.06)
    );
  }

  .office-channel-dark small {
    display: block;
    margin-bottom: 0.15rem;
    color: var(--color-brand-green);
    font-family: var(--font-mono);
    font-size: 0.54rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    line-height: 1;
  }

  .office-channel-dark span {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    line-height: 1.25;
    color: var(--color-brand-light);
    overflow-wrap: anywhere;
  }

  .regional-contact-btn {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 0.6rem;
    color: color-mix(in srgb, var(--color-brand-dark) 80%, transparent);
    font-size: 0.82rem;
    font-weight: 500;
    line-height: 1.4;
    transition: color 220ms ease;
  }

  .regional-contact-btn:hover {
    color: var(--color-brand-green);
  }

  .contact-detail-link {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 0.6rem;
    color: color-mix(in srgb, var(--color-brand-dark) 76%, transparent);
    line-height: 1.4;
    transition: color 220ms ease;
  }

  .contact-detail-link :global(svg) {
    flex-shrink: 0;
  }

  .contact-detail-link:hover {
    color: var(--color-brand-green);
  }

  .regional-offices-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
    width: 100%;
  }

  @media (max-width: 860px) {
    .regional-offices-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 768px) {
    .contact-channel {
      padding-inline: 1.25rem;
    }
  }

  @media (max-width: 639px) {
    .brief-submit {
      width: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .contact-title-line {
      will-change: auto;
    }
  }
</style>
