<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowRight } from "lucide-svelte";
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ThreeDHeroData } from "$lib/content/three-d-modeling";

  let { data }: { data: ThreeDHeroData } = $props();

  let heroSection = $state<HTMLElement>();
  let canvasContainer = $state<HTMLDivElement>();

  onMount(() => {
    let active = true;
    let ctx: { revert: () => void } | undefined;

    // Entrance timeline
    registerScrollTrigger().then((runtime) => {
      const currentHero = heroSection;
      if (!active || !runtime || !currentHero) return;
      const { gsap } = runtime;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(".threed-hero-title", {
            autoAlpha: 0,
            y: 18,
            duration: 0.85,
            clearProps: "all",
          }, 0.1)
            .from(".threed-hero-lead", {
              autoAlpha: 0,
              y: 18,
              duration: 0.75,
              clearProps: "all",
            }, "-=0.55")
            .from(".threed-hero-actions", {
              autoAlpha: 0,
              y: 18,
              duration: 0.65,
              clearProps: "all",
            }, "-=0.5")
            .from(".threed-hero-stage", {
              autoAlpha: 0,
              y: 28,
              duration: 0.85,
              clearProps: "all",
            }, "-=0.5");
        });
      }, currentHero);
    });

    // Three.js 3D Turntable: Real Photorealistic Commercial Product Model
    let animationFrameId: number;
    let cleanupThree: (() => void) | undefined;

    if (canvasContainer) {
      const container = canvasContainer;
      const width = container.clientWidth;
      const height = container.clientHeight || 520;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      const baseDistance = 4.2;
      function getResponsiveDistance(aspect: number): number {
        if (aspect < 1.15) {
          return baseDistance * (1.15 / Math.max(0.65, aspect));
        }
        return baseDistance;
      }
      camera.position.set(0, 0.2, getResponsiveDistance(width / height));
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);

      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      // Floor Contact Shadow Plane (Soft falloff, completely within frustum)
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = 512;
      shadowCanvas.height = 512;
      const sCtx = shadowCanvas.getContext("2d");
      if (sCtx) {
        const grad = sCtx.createRadialGradient(256, 256, 20, 256, 256, 175);
        grad.addColorStop(0, "rgba(35, 30, 26, 0.28)");
        grad.addColorStop(0.35, "rgba(35, 30, 26, 0.14)");
        grad.addColorStop(0.65, "rgba(35, 30, 26, 0.04)");
        grad.addColorStop(0.9, "rgba(35, 30, 26, 0.005)");
        grad.addColorStop(1.0, "rgba(35, 30, 26, 0)");
        sCtx.fillStyle = grad;
        sCtx.fillRect(0, 0, 512, 512);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      shadowTexture.wrapS = THREE.ClampToEdgeWrapping;
      shadowTexture.wrapT = THREE.ClampToEdgeWrapping;

      const shadowGeo = new THREE.PlaneGeometry(2.4, 2.0);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -0.7;
      scene.add(shadowMesh);

      // Studio Lighting
      const keyLight = new THREE.DirectionalLight(0xfffaed, 2.6);
      keyLight.position.set(4, 5, 4);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 3.2);
      rimLight.position.set(-3, 6, -3);
      scene.add(rimLight);

      const fillLight = new THREE.DirectionalLight(0xeef4ff, 1.4);
      fillLight.position.set(3, 1, 3);
      scene.add(fillLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
      scene.add(ambientLight);

      // Load Real 3D Product Model
      let loadedModel: THREE.Group | undefined;
      const loader = new GLTFLoader();
      loader.load(
        "/models/MaterialsVariantsShoe.glb",
        (gltf) => {
          if (!active) return;
          loadedModel = gltf.scene;

          // Compute bounding box to normalize scale and center perfectly
          const box = new THREE.Box3().setFromObject(loadedModel);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          loadedModel.position.x -= center.x;
          loadedModel.position.y -= center.y;
          loadedModel.position.z -= center.z;

          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.15 / maxDim;
          loadedModel.scale.setScalar(scale);

          modelGroup.add(loadedModel);
        }
      );

      // Smooth Round Move / Turntable Drag Interaction
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      let targetRotationY = 0.5;
      let targetRotationX = 0.05;
      let currentRotationY = 0.5;
      let currentRotationX = 0.05;
      let autoRotate = true;

      function onPointerDown(e: MouseEvent | TouchEvent) {
        isDragging = true;
        autoRotate = false;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        previousMousePosition = { x: clientX, y: clientY };
      }

      function onPointerMove(e: MouseEvent | TouchEvent) {
        if (!isDragging) return;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;

        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.004;

        targetRotationX = Math.max(-0.25, Math.min(0.35, targetRotationX));

        previousMousePosition = { x: clientX, y: clientY };
      }

      function onPointerUp() {
        isDragging = false;
        autoRotate = true;
      }

      const dom = renderer.domElement;
      dom.addEventListener("mousedown", onPointerDown);
      window.addEventListener("mousemove", onPointerMove);
      window.addEventListener("mouseup", onPointerUp);

      dom.addEventListener("touchstart", onPointerDown, { passive: true });
      window.addEventListener("touchmove", onPointerMove, { passive: true });
      window.addEventListener("touchend", onPointerUp);

      let resizeObserver: ResizeObserver | undefined;

      function updateSize() {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight || 520;
        camera.aspect = w / h;
        camera.position.z = getResponsiveDistance(camera.aspect);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(container);
      }
      window.addEventListener("resize", updateSize);

      // Animation Loop: Simple smooth round movement
      function animate() {
        animationFrameId = requestAnimationFrame(animate);

        if (autoRotate && !isDragging) {
          targetRotationY += 0.0065;
        }

        currentRotationY += (targetRotationY - currentRotationY) * 0.08;
        currentRotationX += (targetRotationX - currentRotationX) * 0.08;

        modelGroup.rotation.y = currentRotationY;
        modelGroup.rotation.x = currentRotationX;

        // Gentle subtle bob
        const time = Date.now() * 0.0016;
        modelGroup.position.y = Math.sin(time) * 0.02;

        renderer.render(scene, camera);
      }
      animate();

      cleanupThree = () => {
        cancelAnimationFrame(animationFrameId);
        resizeObserver?.disconnect();
        window.removeEventListener("resize", updateSize);
        dom.removeEventListener("mousedown", onPointerDown);
        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        dom.removeEventListener("touchstart", onPointerDown);
        window.removeEventListener("touchmove", onPointerMove);
        window.removeEventListener("touchend", onPointerUp);

        shadowGeo.dispose();
        shadowMat.dispose();
        shadowTexture.dispose();

        if (loadedModel) {
          loadedModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry?.dispose();
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => m.dispose());
              } else if (child.material) {
                child.material.dispose();
              }
            }
          });
        }

        renderer.dispose();
        if (renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      };
    }

    return () => {
      active = false;
      ctx?.revert();
      cleanupThree?.();
    };
  });
</script>

<section
  bind:this={heroSection}
  id="threed-hero"
  aria-labelledby="threed-hero-title"
  class="relative isolate min-h-dvh overflow-hidden bg-brand-light text-brand-dark transition-colors duration-300 pt-20 sm:pt-24"
>
  <!-- Ambient Backdrop Glow -->
  <div
    class="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(ellipse_62%_56%_at_24%_42%,rgba(126,166,65,0.08),transparent_58%)]"
    aria-hidden="true"
  ></div>
  <div
    class="pointer-events-none absolute -right-[10rem] top-[8%] size-[38rem] rounded-full bg-brand-green/10 opacity-70 blur-[120px]"
    aria-hidden="true"
  ></div>

  <div class="site-shell relative z-10 flex min-h-[calc(100dvh-6rem)] items-center py-10 sm:py-16">
    <div class="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <!-- Left Column: Copy & Actions (lg:col-span-5) -->
      <div class="space-y-6 lg:col-span-5">
        <h1
          id="threed-hero-title"
          class="threed-hero-title font-display text-[clamp(2.5rem,4.4vw,4.6rem)] leading-[0.96] tracking-[-0.038em] font-bold text-brand-dark pb-1"
        >
          <span class="block">{data.title}</span>
          <span class="block text-brand-green font-light italic mt-1.5 sm:mt-2">
            {data.titleAccent}
          </span>
        </h1>

        <p class="threed-hero-lead max-w-[46ch] text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed">
          {data.description}
        </p>

        <div class="threed-hero-actions flex flex-wrap items-center gap-3.5 pt-1">
          <a
            href="/contact"
            class="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-brand-dark px-7 text-sm font-semibold text-brand-light transition-all duration-300 hover:bg-brand-green hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-brand-green"
          >
            <span>Start a 3D Project</span>
            <ArrowRight size={16} class="transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <a
            href="#product-modeling"
            class="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-brand-dark/20 bg-white/70 px-6 text-sm font-semibold text-brand-dark transition-all duration-300 hover:border-brand-dark hover:bg-white focus-visible:outline-2 focus-visible:outline-brand-green"
          >
            <span>Explore 3D Services</span>
          </a>
        </div>
      </div>

      <!-- Right Column: Direct 3D Product Turntable (No Box, No Border) -->
      <div class="threed-hero-stage lg:col-span-7">
        <div class="relative w-full aspect-square sm:aspect-[16/11] lg:aspect-[4/3] min-h-[320px] sm:min-h-[460px] lg:min-h-[540px] overflow-visible select-none">
          <!-- Real-Time Interactive Three.js Canvas -->
          <div
            bind:this={canvasContainer}
            class="size-full cursor-grab active:cursor-grabbing touch-pan-y"
            title="Drag to inspect in 3D"
          ></div>
        </div>
      </div>
    </div>
  </div>
</section>
