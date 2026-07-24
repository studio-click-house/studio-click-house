<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  onMount(() => {
    const root = document.querySelector<HTMLElement>("#main-content");
    if (!root) return;

    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !root) return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const excludedSections = new Set([
            "home-hero",
            "studio-introduction",
            "scroll-image-story",
            "creative-direction",
            "selected-work",
            "studio-services",
            "work-fields-rail",
            "studio-team",
            "production-process",
            "why-trust-us",
            "faq-section",
            "client-locations",
            "pricing-configurator",
            "pricing-details",
            "pricing-faq",
          ]);

          const sections = Array.from(
            root.querySelectorAll<HTMLElement>(":scope > section"),
          ).filter((section) => !excludedSections.has(section.id));

          for (const section of sections) {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= window.innerHeight * 0.82) continue;

            const copy = section.querySelectorAll<HTMLElement>(
              ".eyebrow, h2, [data-scroll-copy]",
            );
            const visual = section.querySelectorAll<HTMLElement>(
              "figure, [data-scroll-visual]",
            );

            if (!copy.length && !visual.length) continue;

            const timeline = gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            });

            if (copy.length) {
              timeline.from(copy, {
                autoAlpha: 0,
                y: 34,
                duration: 0.9,
                stagger: 0.08,
              });
            }

            if (visual.length) {
              timeline.from(
                visual,
                {
                  autoAlpha: 0,
                  y: 26,
                  scale: 1.02,
                  duration: 1.05,
                  stagger: 0.1,
                },
                copy.length ? "-=0.62" : 0,
              );
            }
          }
        });
        return () => media.revert();
      }, root);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>
