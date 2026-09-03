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
            "pricing-configurator",
            "pricing-details",
            "pricing-faq",
          ]);

          const sections = Array.from(
            root.querySelectorAll<HTMLElement>(":scope > section"),
          ).filter((section) => !excludedSections.has(section.id));

          const pageHeight = document.documentElement.scrollHeight;

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

            const sectionOffsetY = section.offsetTop;
            const isLaterHalf = sectionOffsetY > pageHeight * 0.45;

            const copyY = isLaterHalf ? 42 : 26;
            const copyDuration = isLaterHalf ? 1.1 : 0.75;
            const copyStagger = isLaterHalf ? 0.1 : 0.06;
            const visualDuration = isLaterHalf ? 1.2 : 0.9;

            const timeline = gsap.timeline({
              defaults: { ease: isLaterHalf ? "power2.out" : "power3.out" },
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            });

            if (copy.length) {
              timeline.from(copy, {
                autoAlpha: 0,
                y: copyY,
                duration: copyDuration,
                stagger: copyStagger,
              });
            }

            if (visual.length) {
              timeline.from(
                visual,
                {
                  autoAlpha: 0,
                  y: isLaterHalf ? 30 : 20,
                  scale: 1.02,
                  clipPath: "inset(6% 0% 0% 0%)",
                  duration: visualDuration,
                  stagger: 0.1,
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
