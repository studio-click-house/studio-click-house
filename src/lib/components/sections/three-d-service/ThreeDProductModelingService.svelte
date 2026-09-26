<script lang="ts">
  import { onMount } from "svelte";
  import { Check, ArrowRight } from "lucide-svelte";
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
  import { registerScrollTrigger } from "$lib/animations/gsap";
  import type { ThreeDModelingSectionData } from "$lib/content/three-d-modeling";

  let { data }: { data: ThreeDModelingSectionData } = $props();

  let sectionElement = $state<HTMLElement>();
  let canvasContainer = $state<HTMLDivElement>();

  onMount(() => {
    let ctx: { revert: () => void } | undefined;
    let active = true;

    registerScrollTrigger().then((runtime) => {
      const currentSection = sectionElement;
      if (!active || !runtime || !currentSection) return;
      const { gsap } = runtime;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.from(".modeling-reveal", {
            y: 28,
            autoAlpha: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: currentSection,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          });
        });
      }, currentSection);
    });

    // Three.js 3D Turntable: Titanium Smartphone (Precision 3D Product Modeling & Quad Topology)
    let animationFrameId: number;
    let cleanupThree: (() => void) | undefined;

    if (canvasContainer) {
      const container = canvasContainer;
      const width = container.clientWidth;
      const height = container.clientHeight || 500;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      const baseDistance = 4.8;
      function getResponsiveDistance(aspect: number): number {
        if (aspect < 1.25) {
          return baseDistance * (1.25 / Math.max(0.65, aspect));
        }
        return baseDistance;
      }
      camera.position.set(0, 0.12, getResponsiveDistance(width / height));
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);

      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      // Floor Contact Shadow Plane
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

      const shadowGeo = new THREE.PlaneGeometry(2.0, 1.6);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -1.06;
      scene.add(shadowMesh);

      // Studio Lighting for Brushed Titanium Metal & Camera Optics
      const keyLight = new THREE.DirectionalLight(0xfffaed, 3.2);
      keyLight.position.set(4, 5, 4);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 3.6);
      rimLight.position.set(-3, 6, -3);
      scene.add(rimLight);

      const fillLight = new THREE.DirectionalLight(0xedf4ff, 1.8);
      fillLight.position.set(-4, -1, 3);
      scene.add(fillLight);

      const topLight = new THREE.DirectionalLight(0xffffff, 2.0);
      topLight.position.set(0, 6, 1);
      scene.add(topLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
      scene.add(ambientLight);

      // Load Real 3D Model: Titanium Smartphone (01 / 3D Product Modeling)
      let loadedModel: THREE.Group | undefined;
      let dracoLoader: DRACOLoader | undefined;
      dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/gltf/");
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        "/models/iphone15pro.glb",
        (gltf) => {
          if (!active) return;
          loadedModel = gltf.scene;

          loadedModel.updateWorldMatrix(true, true);
          const box = new THREE.Box3().setFromObject(loadedModel);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          // Center geometric pivot
          loadedModel.position.x = -center.x;
          loadedModel.position.y = -center.y;
          loadedModel.position.z = -center.z;

          // Balanced fill ratio (~72% of viewport) with safe breathing room at top and bottom
          const radiusXZ = Math.sqrt((size.x / 2) ** 2 + (size.z / 2) ** 2);
          const effectiveDimension = Math.max(radiusXZ * 2, size.y);
          const scale = 2.45 / effectiveDimension;
          loadedModel.scale.setScalar(scale);

          modelGroup.add(loadedModel);
        },
        undefined,
        (error) => {
          console.error("Failed to load iphone15pro.glb:", error);
        }
      );

      // Initial aesthetic beauty angle (three-quarters perspective highlighting screen & titanium rail)
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      let targetRotationY = -0.45;
      let targetRotationX = 0.12;
      let currentRotationY = -0.45;
      let currentRotationX = 0.12;
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
        targetRotationX = Math.max(-0.25, Math.min(0.28, targetRotationX));

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
        const h = container.clientHeight || 460;
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

      function animate() {
        animationFrameId = requestAnimationFrame(animate);

        if (autoRotate && !isDragging) {
          targetRotationY += 0.005;
        }

        currentRotationY += (targetRotationY - currentRotationY) * 0.08;
        currentRotationX += (targetRotationX - currentRotationX) * 0.08;

        modelGroup.rotation.y = currentRotationY;
        modelGroup.rotation.x = currentRotationX;

        const time = Date.now() * 0.0016;
        modelGroup.position.y = Math.sin(time) * 0.015;

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
        dracoLoader?.dispose();

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
  bind:this={sectionElement}
  id={data.id || "3d-product-modeling"}
  class="relative isolate overflow-hidden bg-brand-light py-20 text-brand-dark sm:py-28"
>
  <div id="3d-product-modeling" class="absolute -top-24 pointer-events-none"></div>
  <div id="product-modeling" class="absolute -top-24 pointer-events-none"></div>
  <div class="site-shell relative z-10">
    <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <!-- Left Column: Service Details & Deliverables -->
      <div class="modeling-reveal space-y-6 lg:col-span-5">
        <div
          class="font-mono text-xs uppercase tracking-wider text-brand-green font-bold"
        >
          01 / 3D Product Modeling
        </div>

        <h2
          class="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-[1.15] tracking-[-0.03em] font-bold text-brand-dark pb-0.5"
        >
          {data.heading}
        </h2>

        <p
          class="text-base leading-relaxed text-brand-dark/75 sm:text-lg sm:leading-relaxed"
        >
          {data.leadParagraph}
        </p>

        <p class="text-sm text-brand-dark/70 leading-relaxed">
          {data.bodyParagraph}
        </p>

        <!-- Capabilities List -->
        <div class="space-y-3 pt-2">
          {#each data.capabilities as item}
            <div class="flex items-start gap-3">
              <div
                class="flex size-5 items-center justify-center rounded-full bg-brand-green/20 text-brand-green shrink-0 mt-0.5"
              >
                <Check size={12} strokeWidth={2.5} />
              </div>
              <div>
                <h3 class="font-sans text-sm font-semibold text-brand-dark">
                  {item.title}
                </h3>
                <p
                  class="text-xs sm:text-sm text-brand-dark/70 leading-relaxed"
                >
                  {item.description}
                </p>
              </div>
            </div>
          {/each}
        </div>

        <div class="pt-2">
          <a
            href="/contact"
            class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand-green font-bold hover:text-brand-dark transition-colors"
          >
            <span>Book 3D Product Modeling</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <!-- Right Column: Direct 3D Product Turntable (Titanium Smartphone - CAD Precision & Clean Geometry) -->
      <div
        class="modeling-reveal lg:col-span-7 flex items-center justify-center"
      >
        <div
          class="relative w-full max-w-[740px] aspect-[16/11] sm:aspect-[4/3] min-h-[440px] sm:min-h-[540px] select-none flex items-center justify-center"
        >
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
