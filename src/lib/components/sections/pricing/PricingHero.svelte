<script lang="ts">
  import { onMount } from "svelte";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import { previewMedia } from "$lib/content/media";

  let section: HTMLElement;
  let canvasContainer: HTMLElement;
  let headingLines: HTMLElement[] = [];
  let detailElements: HTMLElement[] = [];
  let statsRef: HTMLElement;

  // Use the premium perfume still life image
  const heroImage = previewMedia.perfumeStillLife;

  const stats = [
    {
      value: "24",
      suffix: "h",
      label: "Standard Turnaround SLA",
      sublabel: "Overnight priority delivery available across all pipelines.",
    },
    {
      value: "25",
      suffix: "%",
      label: "Max Volume Discount",
      sublabel: "Automatic tier discounts on high-volume production batches.",
    },
    {
      value: "99.8",
      suffix: "%",
      label: "First-Pass QC Approval",
      sublabel: "Pixel-level technical validation across every deliverable.",
    },
  ];

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
      const { gsap } = runtime;

      gsapContext = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(headingLines, {
            yPercent: 115,
            rotation: 2.2,
            duration: 1.15,
            stagger: 0.12,
            ease: "power4.out",
            delay: 0.15,
          });

          gsap.from(detailElements, {
            autoAlpha: 0,
            y: 28,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.5,
          });

          gsap.from(".pricing-stat-item", {
            scrollTrigger: {
              trigger: statsRef,
              start: "top 90%",
              once: true,
            },
            opacity: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
          });
        });
      });
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

        // Refractive glass lens fragment shader with chromatic aberration (RGB split)
        const fragmentShader = `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform vec2 uResolution;
          uniform sampler2D uTexture;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            
            // Correct for aspect ratio
            vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
            vec2 distVec = (uv - uMouse) * aspect;
            float dist = length(distVec);
            
            // Interactive glass lens parameters
            float radius = 0.28;
            float strength = 0.045;
            
            if (dist < radius) {
              // Lens profile (spherical refraction dome)
              float normDist = dist / radius;
              float bend = (1.0 - normDist * normDist) * strength;
              
              vec2 dir = normalize(distVec);
              
              // RGB Chromatic Aberration offset inside the lens
              vec2 rOffset = dir * bend * 1.15;
              vec2 gOffset = dir * bend * 0.95;
              vec2 bOffset = dir * bend * 0.75;
              
              float r = texture2D(uTexture, uv - rOffset / aspect).r;
              float g = texture2D(uTexture, uv - gOffset / aspect).g;
              float b = texture2D(uTexture, uv - bOffset / aspect).b;
              
              gl_FragColor = vec4(r, g, b, 1.0);
            } else {
              // Subtle background flow (heat haze style organic drift)
              float ambientNoise = sin(uv.x * 8.0 + uTime * 0.35) * cos(uv.y * 8.0 - uTime * 0.25) * 0.0008;
              gl_FragColor = texture2D(uTexture, uv + vec2(ambientNoise));
            }
          }
        `;

        const loader = new THREE.TextureLoader();
        loader.load(heroImage.src, (texture) => {
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

          // Attach listener to section to track mouse movement across the full screen
          section.addEventListener("pointermove", handlePointerMove, {
            passive: true,
          });

          const animate = () => {
            if (!active || !renderer) return;
            animationFrameId = requestAnimationFrame(animate);

            // Smooth out mouse tracking for liquid lens feeling
            smoothMouse.x += (mouse.x - smoothMouse.x) * 0.09;
            smoothMouse.y += (mouse.y - smoothMouse.y) * 0.09;

            uniforms.uTime.value += 0.016;
            uniforms.uMouse.value.set(smoothMouse.x, smoothMouse.y);

            renderer.render(scene, camera);
          };

          animate();

          const handleResize = () => {
            if (!active || !renderer || !canvasContainer) return;
            const newRect = canvasContainer.getBoundingClientRect();
            renderer.setSize(newRect.width, newRect.height);
            uniforms.uResolution.value.set(newRect.width, newRect.height);
          };

          window.addEventListener("resize", handleResize, { passive: true });
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
  id="pricing-hero"
  bind:this={section}
  aria-labelledby="pricing-hero-title"
  class="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden border-b border-brand-dark/15 bg-brand-dark pb-12 pt-24 text-brand-light md:pb-16 md:pt-32"
>
  <!-- Interactive Refractive Lens Canvas & Image Background -->
  <div class="absolute inset-0 w-full h-full" bind:this={canvasContainer}>
    <img
      src={heroImage.src}
      alt={heroImage.alt}
      width={heroImage.width}
      height={heroImage.height}
      fetchpriority="high"
      decoding="async"
      class="absolute inset-0 w-full h-full object-cover object-center opacity-35"
    />
  </div>

  <!-- Editorial Dark Gradient Overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/65 to-brand-dark/95"
    aria-hidden="true"
  ></div>

  <!-- Hero Content -->
  <div class="site-shell relative z-10 my-auto py-12">
    <div class="max-w-5xl">
      <h1
        id="pricing-hero-title"
        class="mb-6 max-w-[12ch] font-display text-[clamp(2.75rem,6.8vw,6.25rem)] leading-[0.86] tracking-[-0.045em] text-brand-light"
      >
        <span class="block overflow-hidden pb-2">
          <span bind:this={headingLines[0]} class="block text-brand-light">
            Project Scope &
          </span>
        </span>
        <span class="block overflow-hidden">
          <span
            bind:this={headingLines[1]}
            class="block italic text-brand-green font-normal"
          >
            Visual Investment.
          </span>
        </span>
      </h1>

      <p
        bind:this={detailElements[0]}
        class="max-w-2xl text-sm leading-relaxed text-brand-light/75 sm:text-base md:text-lg"
      >
        Explore our real-time project scope configurator and visual production
        schedules below. Rates and SLA guarantees are structured around volume,
        technical complexity, and turnaround priority.
      </p>
    </div>
  </div>

  <!-- Stat Counter Grid -->
  <div
    bind:this={statsRef}
    class="site-shell relative z-10 mt-12 pt-10 border-t border-brand-light/15 grid gap-8 sm:grid-cols-3"
  >
    {#each stats as stat (stat.label)}
      <div
        class="pricing-stat-item group relative flex flex-col transition-colors duration-300"
      >
        <div
          class="mb-2 font-display text-4xl tracking-[-0.04em] text-brand-light transition-colors duration-300 group-hover:text-brand-green md:text-6xl"
        >
          <span>{stat.value}</span><span class="text-brand-green"
            >{stat.suffix}</span
          >
        </div>
        <div class="text-sm font-semibold text-brand-light/90">
          {stat.label}
        </div>
        <div
          class="mt-1 max-w-[16rem] text-xs leading-relaxed text-brand-light/60"
        >
          {stat.sublabel}
        </div>
      </div>
    {/each}
  </div>
</section>
