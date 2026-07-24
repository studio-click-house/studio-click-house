<!--
  THESIS: The contact page behaves like a working handoff desk, not a generic lead form.
  OWN-WORLD: Warm proof paper, clean white work surfaces, one production green, restrained dark anchors, and full-bleed image evidence.
  STORY: Arrive with unfinished material, learn what makes a useful handoff, see it become a signal, prepare the brief, understand the next move.
  FIRST VIEWPORT: A compact typographic proposition faces a tall physical handoff image; the email action is visible before scrolling.
  FORM: Compact asymmetric production handoff, ranked first for resonance; a clean brief sits beside responsive image evidence. Seed unavailable because PRODUCT.md is not established.
-->
<script lang="ts">
  import { onMount } from "svelte";
  import {
    ArrowDown,
    ArrowUpRight,
    Check,
    Copy,
    Mail,
    MapPin,
  } from "lucide-svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import {
    contactProcess,
    contactServiceDetails,
    contactServices,
    projectInputs,
  } from "$lib/content/contact";
  import { siteConfig } from "$lib/config/site";
  import ContactSignalField from "./ContactSignalField.svelte";

  let pageRoot: HTMLElement;
  let heroSection: HTMLElement;
  let signalSection: HTMLElement;
  let briefSection: HTMLElement;
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

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "New project").trim();
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = `Project brief from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company or brand: ${company || "Not provided"}`,
      `Service: ${selectedService}`,
      "",
      message,
    ].join("\n");

    briefPrepared = true;
    formStatus = "The project email is prepared. Review it before sending.";
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
          const entrance = gsap.timeline({
            defaults: { ease: "expo.out" },
          });

          entrance
            .from(".contact-hero-kicker", {
              autoAlpha: 0,
              y: 14,
              duration: 0.55,
            })
            .from(
              ".contact-title-line",
              {
                yPercent: 108,
                duration: 1.05,
                stagger: 0.08,
              },
              "-=0.25",
            )
            .from(
              ".contact-hero-copy, .contact-hero-actions",
              {
                autoAlpha: 0,
                y: 20,
                duration: 0.7,
                stagger: 0.08,
              },
              "-=0.55",
            )
            .from(
              ".contact-handoff-frame",
              {
                autoAlpha: 0,
                clipPath: "inset(0 0 100% 0)",
                duration: 1.15,
              },
              "-=0.95",
            );

          gsap.fromTo(
            ".contact-handoff-image",
            { scale: 1.06, yPercent: -2 },
            {
              scale: 1.01,
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          gsap.from(".contact-input-row", {
            y: 24,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: {
              trigger: "#contact-inputs",
              start: "top 74%",
              once: true,
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
            duration: 0.85,
            stagger: 0.09,
            ease: "expo.out",
            scrollTrigger: {
              trigger: briefSection,
              start: "top 76%",
              once: true,
            },
          });

          gsap.from(".contact-process-step", {
            clipPath: "inset(0 100% 0 0)",
            duration: 0.9,
            stagger: 0.14,
            ease: "expo.inOut",
            scrollTrigger: {
              trigger: "#contact-next",
              start: "top 74%",
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
    bind:this={heroSection}
    aria-labelledby="contact-page-title"
    class="relative overflow-hidden border-b border-brand-dark/14 pb-14 pt-32 sm:pt-36 lg:pb-20 lg:pt-40"
  >
    <div class="site-shell">
      <div class="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div class="flex flex-col lg:col-span-7 lg:min-h-[42rem]">
          <div class="contact-hero-kicker flex items-center gap-4">
            <span class="h-px w-10 bg-brand-green" aria-hidden="true"></span>
            <p class="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-brand-dark/58">
              New work begins here
            </p>
          </div>

          <h1
            id="contact-page-title"
            class="mt-12 max-w-5xl font-display text-[clamp(3.6rem,7.4vw,6rem)] leading-[0.86] tracking-[-0.038em]"
          >
            <span class="contact-title-mask">
              <span class="contact-title-line">Bring the work</span>
            </span>
            <span class="contact-title-mask">
              <span class="contact-title-line text-brand-dark/46">before it is finished.</span>
            </span>
          </h1>

          <div class="mt-auto grid gap-9 pt-14 sm:grid-cols-2 lg:max-w-3xl lg:pt-20">
            <p class="contact-hero-copy max-w-md text-lg leading-[1.55] text-brand-dark/72">
              Share the frame, sequence, model, or production problem. We will
              start with the material and shape the clearest route forward.
            </p>

            <div class="contact-hero-actions flex flex-col items-start sm:justify-end">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                class="group inline-flex items-center gap-3 border-b border-brand-dark/32 pb-2 text-sm font-semibold transition-colors hover:border-brand-green hover:text-brand-green"
              >
                {siteConfig.contact.email}
                <ArrowUpRight
                  size={16}
                  class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <a
                href="#project-brief"
                class="mt-8 inline-flex items-center gap-3 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-green"
              >
                Prepare the handoff
                <ArrowDown size={15} />
              </a>
            </div>
          </div>
        </div>

        <figure
          id="contact-project-handoff"
          class="contact-handoff-frame relative min-h-[34rem] overflow-hidden bg-brand-light/8 lg:col-span-5 lg:min-h-[42rem]"
        >
          <img
            src="/images/contact/project-handoff.png"
            alt="Creative collaborators handing over fashion contact sheets and a marked proof sleeve"
            width="1024"
            height="1536"
            loading="eager"
            class="contact-handoff-image absolute inset-0 h-full w-full object-cover"
          />
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark/55 via-transparent to-transparent"></div>
          <div class="absolute left-5 top-5 size-8 border-l border-t border-brand-green" aria-hidden="true"></div>
          <div class="absolute bottom-5 right-5 size-8 border-b border-r border-brand-green" aria-hidden="true"></div>
          <figcaption class="absolute bottom-7 left-7 right-7">
            <p class="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-brand-light/68">
              The handoff / where context becomes production
            </p>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>

  <section
    id="contact-inputs"
    aria-labelledby="contact-inputs-title"
    class="bg-brand-paper py-20 text-brand-dark sm:py-24 lg:py-32"
  >
    <div class="site-shell">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-4">
          <p class="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-brand-green">
            A useful first message
          </p>
          <h2
            id="contact-inputs-title"
            class="mt-7 max-w-md font-display text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] tracking-[-0.035em]"
          >
            Give us something real to hold.
          </h2>
        </div>

        <div class="lg:col-span-7 lg:col-start-6">
          {#each projectInputs as input, index (input.label)}
            <article class="contact-input-row grid gap-5 border-t border-brand-dark/22 py-8 sm:grid-cols-[5rem_1fr] lg:py-9">
              <p class="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-brand-green">
                {input.label}
              </p>
              <div class="grid gap-3 md:grid-cols-2 md:gap-8">
                <h3 class="font-display text-[clamp(1.8rem,2.8vw,2.7rem)] leading-[0.98] tracking-[-0.025em]">
                  {input.title}
                </h3>
                <p class="max-w-md text-sm leading-7 text-brand-dark/68">
                  {input.description}
                </p>
              </div>
              <span class="sr-only">Step {index + 1}</span>
            </article>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <section
    id="contact-signal"
    bind:this={signalSection}
    aria-labelledby="contact-signal-title"
    class="relative min-h-[35rem] overflow-hidden bg-brand-green text-brand-dark"
  >
    <ContactSignalField />
    <div class="site-shell relative z-10 flex min-h-[35rem] items-center py-24">
      <div class="contact-signal-copy max-w-4xl">
        <p class="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-brand-dark/62">
          Material → direction → finish
        </p>
        <h2
          id="contact-signal-title"
          class="mt-7 max-w-4xl font-display text-[clamp(3.4rem,7vw,6rem)] leading-[0.88] tracking-[-0.038em]"
        >
          A clear brief turns scattered inputs into one production signal.
        </h2>
        <p class="mt-8 max-w-xl text-base leading-7 text-brand-dark/72 sm:text-lg">
          You do not need to solve the workflow before writing. Bring the
          material and the intended finish; we can shape the route together.
        </p>
      </div>
    </div>
  </section>

  <section
    id="project-brief"
    bind:this={briefSection}
    aria-labelledby="project-brief-title"
    class="relative bg-brand-paper py-20 text-brand-dark sm:py-24 lg:py-32"
  >
    <div class="site-shell">
      <header class="contact-brief-reveal grid gap-8 lg:grid-cols-12 lg:items-end">
        <h2
          id="project-brief-title"
          class="max-w-4xl font-display text-[clamp(3rem,5vw,4.8rem)] leading-[0.9] tracking-[-0.035em] lg:col-span-8"
        >
          Tell us what you are making—and where the work feels unresolved.
        </h2>
        <p class="max-w-md text-base leading-7 text-brand-dark/68 lg:col-span-4 lg:pb-2">
          The strongest starting point is not a perfect brief. It is a clear
          view of the source material, the intended result, and the production
          decision that still needs to be made.
        </p>
      </header>

      <div class="contact-brief-reveal mt-10 grid gap-8 lg:grid-cols-12 lg:gap-8">
        <form
          id="contact-form"
          class="bg-brand-light p-5 sm:p-7 lg:col-span-8 lg:p-9"
          onsubmit={handleSubmit}
        >
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="brief-field">
              <span class="brief-field-label">Your name *</span>
              <input
                id="contact-name"
                name="name"
                type="text"
                autocomplete="name"
                required
                class="brief-field-input"
                placeholder="Name"
              />
            </label>
            <label class="brief-field">
              <span class="brief-field-label">Work email *</span>
              <input
                id="contact-email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="brief-field-input"
                placeholder="you@company.com"
              />
            </label>
            <label class="brief-field sm:col-span-2">
              <span class="brief-field-label">Company or brand</span>
              <input
                id="contact-company"
                name="company"
                type="text"
                autocomplete="organization"
                class="brief-field-input"
                placeholder="Who is the work for?"
              />
            </label>
          </div>

          <fieldset class="mt-7">
            <legend class="brief-field-label">What are we working on?</legend>
            <div class="mt-3 flex flex-wrap gap-x-8 gap-y-1">
              {#each contactServiceDetails as service (service.name)}
                <button
                  type="button"
                  class="brief-service-tab"
                  class:is-selected={selectedService === service.name}
                  aria-pressed={selectedService === service.name}
                  onclick={() => (selectedService = service.name)}
                >
                  <span class="brief-service-dot" aria-hidden="true"></span>
                  <span>{service.name}</span>
                </button>
              {/each}
            </div>
          </fieldset>

          <label class="brief-note mt-7">
            <span class="brief-note-header">
              <span>Project notes *</span>
              <span>Selected / {selectedService}</span>
            </span>
            <textarea
              id="contact-message"
              name="message"
              required
              rows="5"
              class="brief-note-input"
              placeholder="Share the source material, intended result, volume, timing, and anything that must stay consistent."
            ></textarea>
            <span class="brief-note-corner" aria-hidden="true"></span>
          </label>

          <div class="mt-5 flex flex-col gap-5 bg-brand-dark p-5 text-brand-light sm:flex-row sm:items-center sm:justify-between">
            <div class="max-w-md text-xs leading-6" aria-live="polite">
              {#if briefPrepared}
                <p class="flex items-start gap-2 text-brand-light/82">
                  <Check size={15} class="mt-1 shrink-0 text-brand-green" />
                  {formStatus}
                </p>
              {:else}
                <p class="text-brand-light/66">
                  This prepares the brief in your email app. You review it
                  before anything is sent.
                </p>
              {/if}
            </div>

            <button type="submit" class="brief-submit group">
              Prepare email
              <ArrowUpRight
                size={17}
                class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </form>

        <aside class="lg:col-span-4">
          <div class="lg:sticky lg:top-28">
            <figure class="relative overflow-hidden bg-brand-dark">
              <img
                src={selectedServiceDetail.image}
                alt={selectedServiceDetail.imageAlt}
                width="1200"
                height="1600"
                loading="lazy"
                class="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.025]"
              />
              <figcaption class="absolute inset-x-0 bottom-0 bg-brand-green p-5 text-brand-dark">
                <p class="font-display text-3xl tracking-[-0.025em]">
                  {selectedServiceDetail.name}
                </p>
                <p class="mt-2 max-w-sm text-sm leading-6 text-brand-dark/70">
                  {selectedServiceDetail.descriptor}
                </p>
              </figcaption>
            </figure>

            <div class="mt-5 bg-brand-light p-5">
              <p class="text-sm leading-6 text-brand-dark/68">
                Prefer to begin outside the form? Send the source material and
                the production question directly to the studio.
              </p>
              <div class="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  class="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-brand-green"
                >
                  <Mail size={14} class="text-brand-green" />
                  {siteConfig.contact.email}
                </a>
                <button
                  type="button"
                  onclick={copyStudioEmail}
                  class="inline-flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-brand-dark/50 transition-colors hover:text-brand-green"
                  aria-live="polite"
                >
                  {#if emailCopied}
                    <Check size={12} /> Copied
                  {:else}
                    <Copy size={12} /> Copy
                  {/if}
                </button>
              </div>
              <p class="mt-4 flex items-start gap-2 text-sm leading-6 text-brand-dark/62">
                <MapPin size={14} class="mt-1 shrink-0 text-brand-green" />
                <span>{siteConfig.contact.location}, {siteConfig.contact.country}</span>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section
    id="contact-next"
    aria-labelledby="contact-next-title"
    class="border-t border-brand-dark/14 bg-brand-light py-20 text-brand-dark sm:py-24 lg:py-28"
  >
    <div class="site-shell">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-4">
          <p class="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-brand-green">
            After the handoff
          </p>
          <h2
            id="contact-next-title"
            class="mt-7 max-w-md font-display text-[clamp(3rem,5vw,5.4rem)] leading-[0.9] tracking-[-0.035em]"
          >
            What happens next.
          </h2>
        </div>

        <div class="lg:col-span-7 lg:col-start-6">
          {#each contactProcess as step, index (step.title)}
            <article class="contact-process-step grid gap-5 border-t border-brand-dark/18 bg-brand-light py-8 sm:grid-cols-[3rem_1fr]">
              <p class="font-mono text-[0.62rem] tracking-[0.14em] text-brand-green">
                0{index + 1}
              </p>
              <div class="grid gap-3 md:grid-cols-2 md:gap-8">
                <h3 class="font-display text-2xl tracking-[-0.02em] text-brand-dark">
                  {step.title}
                </h3>
                <p class="max-w-md text-sm leading-7 text-brand-dark/66">
                  {step.description}
                </p>
              </div>
            </article>
          {/each}
        </div>
      </div>

      <div class="mt-16 flex flex-col gap-6 border-t border-brand-dark/18 pt-10 sm:flex-row sm:items-end sm:justify-between">
        <p class="max-w-2xl font-display text-[clamp(2.4rem,4.5vw,4.8rem)] leading-[0.92] tracking-[-0.035em]">
          The unfinished work is enough to begin.
        </p>
        <a
          href={`mailto:${siteConfig.contact.email}`}
          class="group inline-flex shrink-0 items-center gap-3 bg-brand-green px-6 py-4 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-light"
        >
          Write to the studio
          <ArrowUpRight
            size={17}
            class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
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

  .contact-title-line,
  .contact-handoff-image {
    display: block;
    will-change: transform;
  }

  .contact-handoff-frame {
    clip-path: inset(0);
  }

  .brief-field-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .brief-field {
    position: relative;
    display: flex;
    min-height: 6.5rem;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 18%, transparent);
    background: color-mix(
      in srgb,
      var(--color-brand-paper) 62%,
      var(--color-brand-light)
    );
    padding: 1.25rem;
    transition:
      border-color 220ms ease,
      background-color 220ms ease,
      transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .brief-field:hover {
    transform: translateY(-2px);
  }

  .brief-field:focus-within {
    border-color: var(--color-brand-green);
    background: color-mix(
      in srgb,
      var(--color-brand-green) 9%,
      transparent
    );
  }

  .brief-field-label {
    color: color-mix(in srgb, var(--color-brand-dark) 58%, transparent);
  }

  .brief-field-input {
    display: block;
    width: 100%;
    border: 0;
    background: transparent;
    padding: 1.5rem 2.25rem 0 0;
    color: var(--color-brand-dark);
    font-family: var(--font-sans);
    font-size: clamp(1.1rem, 2vw, 1.45rem);
    letter-spacing: -0.01em;
    line-height: 1.3;
    outline: none;
  }

  .brief-field-input::placeholder {
    color: color-mix(in srgb, var(--color-brand-dark) 58%, transparent);
  }

  .brief-service-tab {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    gap: 0.7rem;
    padding-block: 0.35rem;
    text-align: left;
    font-size: 0.9rem;
    font-weight: 500;
    color: color-mix(in srgb, var(--color-brand-dark) 66%, transparent);
    transition:
      color 220ms ease,
      transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .brief-service-tab:hover {
    color: var(--color-brand-green);
    transform: translateY(-1px);
  }

  .brief-service-tab.is-selected {
    color: var(--color-brand-dark);
    font-weight: 700;
  }

  .brief-service-dot {
    width: 0.7rem;
    height: 0.7rem;
    flex-shrink: 0;
    border-radius: 9999px;
    border: 1px solid currentColor;
    transition:
      border-color 220ms ease,
      background-color 220ms ease;
  }

  .brief-service-tab.is-selected .brief-service-dot {
    border-color: var(--color-brand-green);
    background: var(--color-brand-green);
  }

  .brief-note {
    position: relative;
    display: block;
    overflow: hidden;
    background: var(--color-brand-paper);
    color: var(--color-brand-dark);
  }

  .brief-note-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-brand-dark) 20%, transparent);
    padding: 1rem 1.25rem;
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .brief-note-input {
    display: block;
    min-height: 10.5rem;
    width: 100%;
    resize: vertical;
    border: 0;
    background: transparent;
    padding: 1.5rem 1.25rem 3.5rem;
    color: var(--color-brand-dark);
    font-family: var(--font-sans);
    font-size: 1.1rem;
    letter-spacing: -0.01em;
    line-height: 1.55;
    outline: none;
  }

  .brief-note-input::placeholder {
    color: color-mix(in srgb, var(--color-brand-dark) 38%, transparent);
  }

  .brief-note:focus-within {
    outline: 2px solid var(--color-brand-green);
    outline-offset: 4px;
  }

  .brief-note-corner {
    position: absolute;
    right: 1.25rem;
    bottom: 1.25rem;
    width: 2.25rem;
    height: 2.25rem;
    border-right: 1px solid var(--color-brand-green);
    border-bottom: 1px solid var(--color-brand-green);
  }

  .brief-submit {
    display: inline-flex;
    min-height: 3.5rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    background: var(--color-brand-green);
    padding-inline: 1.4rem;
    color: var(--color-brand-dark);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
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

  .brief-submit:active,
  .brief-service-tab:active {
    transform: scale(0.985);
  }

  @media (max-width: 639px) {
    .brief-field {
      min-height: 6.25rem;
    }

    .brief-submit {
      width: 100%;
    }

    .brief-note-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .contact-title-line,
    .contact-handoff-image {
      will-change: auto;
    }
  }
</style>
