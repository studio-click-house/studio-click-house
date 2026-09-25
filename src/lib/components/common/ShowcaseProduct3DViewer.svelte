<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
  import { RotateCcw } from "lucide-svelte";

  let {
    modelPath = "/models/iphone15pro.glb",
    className = "",
  } = $props<{
    modelPath?: string;
    className?: string;
  }>();

  let canvasContainer = $state<HTMLDivElement>();

  onMount(() => {
    let active = true;
    let animationFrameId: number;
    let resizeObserver: ResizeObserver | undefined;
    let cleanupThree: (() => void) | undefined;

    if (canvasContainer) {
      const container = canvasContainer;
      const width = container.clientWidth;
      const height = container.clientHeight || 480;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      const baseDistance = 4.8;

      function getResponsiveDistance(aspect: number): number {
        if (aspect < 1.25) {
          return baseDistance * (1.25 / Math.max(0.65, aspect));
        }
        return baseDistance;
      }

      camera.position.set(0, 0.28, getResponsiveDistance(width / height));
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

      const shadowGeo = new THREE.PlaneGeometry(2.4, 2.0);
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

      // Studio Lighting
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

      // Load Real 3D Model with Draco Compression support
      let loadedModel: THREE.Group | undefined;
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/gltf/");
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load(modelPath, (gltf) => {
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

        // Calculate rotation envelope radius in ground plane (X-Z) so 360 rotation never clips
        const radiusXZ = Math.sqrt((size.x / 2) ** 2 + (size.z / 2) ** 2);
        const effectiveDimension = Math.max(radiusXZ * 2, size.y);
        const scale = 2.45 / effectiveDimension;
        loadedModel.scale.setScalar(scale);

        // Adjust shadow plane height right under the scaled model base
        shadowMesh.position.y = -(size.y * scale) / 2 - 0.04;

        modelGroup.add(loadedModel);
      });

      // Interactive Drag & Turntable Rotation
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      let targetRotationY = 0.55;
      let targetRotationX = 0.16;
      let currentRotationY = 0.55;
      let currentRotationX = 0.16;
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

      function updateSize() {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight || 480;
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
        dracoLoader.dispose();

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
      cleanupThree?.();
    };
  });
</script>

<figure
  class="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-brand-dark/10 bg-[#f4f4f0] shadow-xl shadow-brand-dark/5 flex items-center justify-center select-none {className}"
>
  <div
    bind:this={canvasContainer}
    class="size-full cursor-grab active:cursor-grabbing touch-pan-y"
    title="Drag to inspect in 3D"
  ></div>

  <!-- Interactive 360 pill hint badge -->
  <div
    class="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-brand-dark/15 bg-brand-light/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-brand-dark/70 backdrop-blur-sm shadow-sm flex items-center gap-1.5"
  >
    <RotateCcw size={11} strokeWidth={2.5} class="text-brand-green animate-spin-slow" />
    <span>360° Drag to inspect</span>
  </div>
</figure>
