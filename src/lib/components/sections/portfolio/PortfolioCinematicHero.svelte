<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { PortfolioPageData } from "$lib/types/portfolio";

  interface Props {
    hero: PortfolioPageData["hero"];
  }

  let { hero }: Props = $props();

  let section: HTMLElement;
  let canvasContainer: HTMLElement;
  let headingLines: HTMLElement[] = [];
  let detailElements: HTMLElement[] = [];

  onMount(() => {
    let active = true;
    let gsapContext: { revert: () => void } | undefined;
    let renderer: import("three").WebGLRenderer | undefined;
    let animationFrameId: number | undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    registerScrollTrigger().then((runtime) => {
      if (!active || !runtime || !section) return;
      const { gsap, ScrollTrigger } = runtime;

      gsapContext = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(headingLines, {
            yPercent: 115,
            rotation: 2.5,
            duration: 1.15,
            stagger: 0.12,
            ease: "power4.out",
            delay: 0.15,
          });

          gsap.from(detailElements, {
            autoAlpha: 0,
            y: 28,
            duration: 0.8,
            stagger: 0.09,
            ease: "power3.out",
            delay: 0.55,
          });

          gsap.to(".hero-canvas-wrap", {
            yPercent: 18,
            scale: 1.04,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });

        return () => media.revert();
      }, section);
    });

    if (!prefersReducedMotion.matches && canvasContainer) {
      import("three").then((THREE) => {
        if (!active || !canvasContainer) return;

        const rect = canvasContainer.getBoundingClientRect();
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
        if (!renderer) return;
        renderer.setSize(rect.width, rect.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        canvasContainer.appendChild(renderer.domElement);
        renderer.domElement.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;";

        const vertexShader = `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `;

        const fragmentShader = `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform vec2 uResolution;
          uniform sampler2D uTexture;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;

            // Gentle, subtle wave applied across the ENTIRE image
            float globalWave = sin(uv.y * 6.0 + uTime * 0.6) * 0.002;
            float mouseRipple = sin(distance(uv, uMouse) * 10.0 - uTime * 1.5) * 0.0025;

            uv.x += globalWave + mouseRipple;
            uv.y += globalWave * 0.5 + mouseRipple * 0.5;

            vec4 tex = texture2D(uTexture, uv);
            gl_FragColor = tex;
          }
        `;

        const loader = new THREE.TextureLoader();
        loader.load(hero.heroMedia.src, (texture) => {
          if (!active || !renderer) return;

          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const uniforms = {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uResolution: {
              value: new THREE.Vector2(rect.width, rect.height),
            },
            uTexture: { value: texture },
          };

          const geometry = new THREE.PlaneGeometry(2, 2);
          const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
          });

          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);

          const mouse = { x: 0.5, y: 0.5 };
          const smoothMouse = { x: 0.5, y: 0.5 };

          const handlePointerMove = (event: PointerEvent) => {
            const bounds = canvasContainer.getBoundingClientRect();
            mouse.x = (event.clientX - bounds.left) / bounds.width;
            mouse.y = 1.0 - (event.clientY - bounds.top) / bounds.height;
          };

          canvasContainer.addEventListener("pointermove", handlePointerMove, {
            passive: true,
          });

          const animate = () => {
            if (!active || !renderer) return;
            animationFrameId = requestAnimationFrame(animate);

            uniforms.uTime.value += 0.016;

            smoothMouse.x += (mouse.x - smoothMouse.x) * 0.06;
            smoothMouse.y += (mouse.y - smoothMouse.y) * 0.06;
            uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y);

            renderer.render(scene, camera);
          };
          animate();

          const handleResize = () => {
            if (!canvasContainer || !renderer) return;
            const newRect = canvasContainer.getBoundingClientRect();
            renderer.setSize(newRect.width, newRect.height);
            uniforms.uResolution.value.set(newRect.width, newRect.height);
          };
          window.addEventListener("resize", handleResize, { passive: true });

          const cleanup = () => {
            canvasContainer?.removeEventListener(
              "pointermove",
              handlePointerMove,
            );
            window.removeEventListener("resize", handleResize);
            geometry.dispose();
            material.dispose();
            texture.dispose();
            scene.remove(mesh);
          };

          const origCleanup = gsapContext;
          gsapContext = {
            revert: () => {
              cleanup();
              origCleanup?.revert();
            },
          };
        });
      });
    }

    return () => {
      active = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
      gsapContext?.revert();
    };
  });
</script>

<section
  id="portfolio-hero"
  bind:this={section}
  aria-labelledby="portfolio-hero-title"
  class="portfolio-hero"
>
  <div class="hero-canvas-wrap" bind:this={canvasContainer}>
    <img
      src={hero.heroMedia.src}
      alt={hero.heroMedia.alt}
      width={hero.heroMedia.width}
      height={hero.heroMedia.height}
      fetchpriority="high"
      decoding="async"
      class="hero-fallback-image"
    />
  </div>

  <div class="hero-gradient" aria-hidden="true"></div>

  <div class="hero-content site-shell">
    <h1 id="portfolio-hero-title" class="hero-heading">
      <span class="hero-heading-line"
        ><span bind:this={headingLines[0]}>{hero.headingLine1}</span></span
      >
      <span class="hero-heading-line"
        ><span bind:this={headingLines[1]} class="italic text-brand-green"
          >{hero.headingLine2}</span
        ></span
      >
    </h1>

    <p bind:this={detailElements[0]} class="hero-description">
      {hero.description}
    </p>

    <div bind:this={detailElements[1]} class="hero-scroll-hint">
      <span>Scroll to explore</span>
      <div class="hero-scroll-mouse">
        <div class="hero-scroll-wheel"></div>
      </div>
    </div>
  </div>
</section>

<style>
  .portfolio-hero {
    position: relative;
    min-height: 100dvh;
    overflow: hidden;
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
  }

  .hero-canvas-wrap {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    will-change: transform;
  }

  .hero-fallback-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
    opacity: 0.45;
  }

  .hero-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(32, 33, 31, 0.3) 0%,
      rgba(32, 33, 31, 0.15) 40%,
      rgba(32, 33, 31, 0.65) 75%,
      rgba(32, 33, 31, 0.92) 100%
    );
  }

  .hero-content {
    position: relative;
    z-index: 2;
    display: grid;
    min-height: 100dvh;
    align-content: end;
    gap: 0;
    padding-bottom: clamp(3rem, 6vh, 5rem);
    padding-top: 8rem;
  }


  .hero-heading {
    font-family: var(--font-display);
    font-size: clamp(3.2rem, 8.5vw, 9rem);
    line-height: 0.88;
    letter-spacing: -0.05em;
    font-weight: 400;
    max-width: 14ch;
  }

  .hero-heading-line {
    display: block;
    overflow: hidden;
    padding-bottom: 0.1em;
  }

  .hero-heading-line > span {
    display: block;
    transform-origin: left bottom;
    will-change: transform;
  }

  .hero-description {
    margin-top: clamp(1.5rem, 3vh, 2.25rem);
    max-width: 42rem;
    font-size: clamp(0.88rem, 1.05vw, 1.05rem);
    line-height: 1.6;
    color: color-mix(in srgb, var(--color-brand-light) 72%, transparent);
  }


  .hero-scroll-hint {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: clamp(2.5rem, 4vh, 3.5rem);
    font-family: var(--font-mono);
    font-size: 0.58rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: color-mix(in srgb, var(--color-brand-light) 40%, transparent);
  }

  .hero-scroll-mouse {
    display: flex;
    justify-content: center;
    align-items: start;
    width: 18px;
    height: 30px;
    border: 1px solid
      color-mix(in srgb, var(--color-brand-light) 30%, transparent);
    border-radius: 999px;
  }

  .hero-scroll-wheel {
    width: 2.5px;
    height: 7px;
    margin-top: 5px;
    background: var(--color-brand-green);
    border-radius: 999px;
    animation: portfolio-scroll-wheel 2.2s cubic-bezier(0.76, 0, 0.24, 1)
      infinite;
  }

  @keyframes portfolio-scroll-wheel {
    0% {
      transform: translateY(0);
      opacity: 0;
    }
    15% {
      opacity: 1;
    }
    50% {
      transform: translateY(10px);
      opacity: 1;
    }
    65%,
    100% {
      transform: translateY(10px);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-heading-line > span {
      transform: none !important;
    }
    .hero-scroll-wheel {
      animation: none;
      opacity: 0.5;
    }
    .hero-canvas-wrap {
      will-change: auto;
    }
  }
</style>
