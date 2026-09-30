<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { motion } from "$lib/animations/motion";

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
            "ai-about-section",
            "about-orbit-gallery",
            "horizontal-projects-showcase",
            "scroll-image-story",
            "creative-direction",
            "selected-work",
            "studio-services",
            "work-fields-rail",
            "studio-team",
            "production-process",
            "why-trust-us",
            "faq",
            "faq-section",
            "client-locations",
            "pricing-hero",
            "pricing-options",
            "pricing-configurator",
            "pricing-details",
            "pricing-faq",
            "closing-cta",
            "contact-hero",
            "contact-signal",
            "project-brief",
            "global-offices",
            "services-hero",
            "services-details",
            "services-standards",
            "services-cta",
            "service-detail-hero",
            "service-detail-intro",
            "service-detail-before-after",
            "service-detail-showcase",
            "service-detail-gallery",
            "service-detail-features",
            "service-detail-audience",
            "service-detail-cta",
            "about-description",
            "about-hero",
            "our-people",
            "our-journey",
            "careers-banner",
            "leadership-team",
            "director-message",
            "core-values",
          ]);

          const sections = Array.from(
            root.querySelectorAll<HTMLElement>(":scope > section"),
          ).filter((section) => !excludedSections.has(section.id));

          for (let sIdx = 0; sIdx < sections.length; sIdx++) {
            const section = sections[sIdx];
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
              defaults: { ease: motion.ease },
              scrollTrigger: {
                trigger: section,
                start: motion.reveal.start,
                toggleActions: "play none none reverse",
              },
            });

            if (copy.length) {
              timeline.from(copy, {
                autoAlpha: 0,
                y: motion.reveal.y,
                duration: motion.duration.reveal,
                stagger: motion.reveal.stagger,
              });
            }

            if (visual.length) {
              timeline.from(
                visual,
                {
                  autoAlpha: 0,
                  y: motion.reveal.y,
                  scale: 1.02,
                  clipPath: "inset(6% 0% 0% 0%)",
                  duration: motion.duration.reveal,
                  stagger: motion.reveal.stagger,
                },
                copy.length ? "-=0.55" : 0,
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
