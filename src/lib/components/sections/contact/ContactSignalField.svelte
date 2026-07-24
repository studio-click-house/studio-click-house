<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  let sectionElement: HTMLElement;
  let canvasElement: HTMLCanvasElement;

  onMount(() => {
    let active = true;
    let animationFrameId: number | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let viewportObserver: IntersectionObserver | undefined;
    let isVisible = false;
    let cleanupGsap: (() => void) | undefined;
    let cleanupRuntime: (() => void) | undefined;

    Promise.all([import("three"), registerScrollTrigger()]).then(
      ([THREE, scrollRuntime]) => {
        if (!active || !canvasElement || !sectionElement) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 0, 8.5);

        const renderer = new THREE.WebGLRenderer({
          canvas: canvasElement,
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

        const particleCount = 150;
        const positions = new Float32Array(particleCount * 3);
        const phases = new Float32Array(particleCount);

        for (let index = 0; index < particleCount; index += 1) {
          const positionIndex = index * 3;
          const progress = index / particleCount;
          const angle = progress * Math.PI * 8;
          const radius = 1.25 + Math.sin(progress * Math.PI * 3) * 0.46;

          positions[positionIndex] = Math.cos(angle) * radius;
          positions[positionIndex + 1] = (progress - 0.5) * 5.8;
          positions[positionIndex + 2] = Math.sin(angle) * radius * 0.7;
          phases[index] = progress * Math.PI * 2;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        );

        const material = new THREE.PointsMaterial({
          color: 0xf7f7f2,
          size: 0.045,
          transparent: true,
          opacity: 0.72,
          sizeAttenuation: true,
        });
        const points = new THREE.Points(geometry, material);
        points.rotation.z = Math.PI / 2;
        scene.add(points);

        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(84 * 3);
        for (let index = 0; index < 84; index += 1) {
          const progress = index / 83;
          const positionIndex = index * 3;
          const angle = progress * Math.PI * 4;
          linePositions[positionIndex] = (progress - 0.5) * 6.4;
          linePositions[positionIndex + 1] = Math.sin(angle) * 0.78;
          linePositions[positionIndex + 2] = Math.cos(angle) * 0.36;
        }
        lineGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(linePositions, 3),
        );
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x20211f,
          transparent: true,
          opacity: 0.42,
        });
        const signalLine = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(signalLine);

        const clock = new THREE.Clock();
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        const render = () => {
          animationFrameId = undefined;
          if (!active || !isVisible || document.hidden) return;

          if (!reducedMotion) {
            const elapsed = clock.getElapsedTime();
            const positionAttribute = geometry.getAttribute(
              "position",
            ) as InstanceType<typeof THREE.BufferAttribute>;
            const values = positionAttribute.array as Float32Array;

            for (let index = 0; index < particleCount; index += 1) {
              const positionIndex = index * 3;
              values[positionIndex + 2] +=
                Math.sin(elapsed * 0.8 + phases[index]) * 0.0007;
            }
            positionAttribute.needsUpdate = true;
            points.rotation.x = Math.sin(elapsed * 0.18) * 0.08;
          }

          renderer.render(scene, camera);
          if (!reducedMotion) animationFrameId = requestAnimationFrame(render);
        };

        const startRendering = () => {
          if (
            animationFrameId === undefined &&
            isVisible &&
            !document.hidden
          ) {
            animationFrameId = requestAnimationFrame(render);
          }
        };

        resizeObserver = new ResizeObserver(([entry]) => {
          if (!entry) return;
          const width = Math.max(entry.contentRect.width, 1);
          const height = Math.max(entry.contentRect.height, 1);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
          renderer.render(scene, camera);
          startRendering();
        });
        resizeObserver.observe(sectionElement);

        viewportObserver = new IntersectionObserver(
          ([entry]) => {
            isVisible = Boolean(entry?.isIntersecting);
            if (isVisible) startRendering();
            else if (animationFrameId !== undefined) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = undefined;
            }
          },
          { rootMargin: "120px 0px", threshold: 0.01 },
        );
        viewportObserver.observe(sectionElement);

        if (scrollRuntime && !reducedMotion) {
          const { gsap } = scrollRuntime;
          const context = gsap.context(() => {
            gsap.fromTo(
              points.rotation,
              { y: -0.55 },
              {
                y: 0.55,
                ease: "none",
                scrollTrigger: {
                  trigger: sectionElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
            gsap.fromTo(
              signalLine.position,
              { x: -0.65 },
              {
                x: 0.65,
                ease: "none",
                scrollTrigger: {
                  trigger: sectionElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }, sectionElement);
          cleanupGsap = () => context.revert();
        }

        const handleVisibilityChange = () => {
          if (document.hidden && animationFrameId !== undefined) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = undefined;
          } else {
            startRendering();
          }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        cleanupRuntime = () => {
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange,
          );
          cleanupGsap?.();
          resizeObserver?.disconnect();
          viewportObserver?.disconnect();
          if (animationFrameId !== undefined)
            cancelAnimationFrame(animationFrameId);
          geometry.dispose();
          material.dispose();
          lineGeometry.dispose();
          lineMaterial.dispose();
          renderer.renderLists.dispose();
          renderer.dispose();
        };

        if (!active) cleanupRuntime();
      },
    );

    return () => {
      active = false;
      cleanupRuntime?.();
    };
  });
</script>

<div
  bind:this={sectionElement}
  class="absolute inset-0 overflow-hidden"
  aria-hidden="true"
>
  <canvas
    bind:this={canvasElement}
    class="block h-full w-full bg-transparent opacity-70"
  ></canvas>
</div>
