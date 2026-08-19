<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  interface Props {
    root: HTMLElement;
  }

  let { root }: Props = $props();

  onMount(() => {
    let active = true;
    let context: { revert: () => void } | undefined;

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !root) return;

      const { gsap } = runtime;
      context = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const heroTimeline = gsap.timeline({
              defaults: { ease: "power3.out" },
            });

            heroTimeline
              .from("[data-events-hero-copy] > *", {
                autoAlpha: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.1,
              })
              .from(
                "[data-events-hero-primary]",
                { autoAlpha: 0, scale: 0.94, x: 42, duration: 1.05 },
                0.08,
              )
              .from(
                "[data-events-hero-card]",
                {
                  autoAlpha: 0,
                  y: 36,
                  rotation: 2,
                  duration: 0.8,
                  stagger: 0.12,
                },
                0.38,
              );

            gsap.to("[data-events-hero-primary]", {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: "#events-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            });

            const copyBlocks =
              gsap.utils.toArray<HTMLElement>("[data-event-copy]");
            for (const element of copyBlocks) {
              gsap.from(element.children, {
                autoAlpha: 0,
                y: 28,
                duration: 0.75,
                stagger: 0.08,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 82%",
                  once: true,
                },
              });
            }

            const mediaBlocks =
              gsap.utils.toArray<HTMLElement>("[data-event-media]");
            for (const element of mediaBlocks) {
              const image = element.querySelector<HTMLElement>(
                "[data-event-parallax]",
              );
              gsap.from(element, {
                autoAlpha: 0,
                y: 40,
                scale: 0.97,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 86%",
                  once: true,
                },
              });

              if (image) {
                gsap.to(image, {
                  yPercent: 12,
                  ease: "none",
                  scrollTrigger: {
                    trigger: element,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.8,
                  },
                });
              }
            }

            gsap.from("[data-event-culture-card]", {
              autoAlpha: 0,
              y: 36,
              scale: 0.97,
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "[data-event-culture]",
                start: "top 78%",
                once: true,
              },
            });

            gsap.from("[data-event-closing]", {
              autoAlpha: 0,
              y: 42,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "[data-event-closing]",
                start: "top 84%",
                once: true,
              },
            });
          },
        );

        return () => media.revert();
      }, root);
    });

    return () => {
      active = false;
      context?.revert();
    };
  });
</script>
