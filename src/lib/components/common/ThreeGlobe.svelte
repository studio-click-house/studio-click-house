<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import type { ClientLocationMarker } from "$lib/types/content";

  interface Props {
    locations: ClientLocationMarker[];
    selectedLocation?: ClientLocationMarker | null;
    onSelectLocation?: (location: ClientLocationMarker | null) => void;
  }

  let {
    locations,
    selectedLocation = null,
    onSelectLocation,
  }: Props = $props();

  interface ProjectedMarker {
    location: ClientLocationMarker;
    x: number;
    y: number;
    facing: number;
  }

  type GeoPosition = [number, number];
  type GeoPolygon = GeoPosition[][];

  interface WorldMapData {
    features: Array<{
      geometry:
        | { type: "Polygon"; coordinates: GeoPolygon }
        | { type: "MultiPolygon"; coordinates: GeoPolygon[] };
    }>;
  }

  const GLOBE_RADIUS = 2.05;
  const INITIAL_ROTATION_X = 0.12;
  const INITIAL_ROTATION_Y = -2.55;

  let containerElement: HTMLDivElement;
  let canvasElement: HTMLCanvasElement;
  let projectedMarkers = $state<ProjectedMarker[]>([]);
  let isDragging = $state(false);
  let hoveredLocationId = $state<string | null>(null);
  let mostVisibleLocationId = $derived(
    projectedMarkers.reduce<ProjectedMarker | null>(
      (mostVisible, marker) =>
        !mostVisible || marker.facing > mostVisible.facing
          ? marker
          : mostVisible,
      null,
    )?.location.id ?? null,
  );

  let globeGroup: THREE.Group;
  let targetRotationX = INITIAL_ROTATION_X;
  let targetRotationY = INITIAL_ROTATION_Y;
  let currentRotationX = INITIAL_ROTATION_X;
  let currentRotationY = INITIAL_ROTATION_Y;
  let velocityX = 0;
  let velocityY = 0;
  let pointerPreviousX = 0;
  let pointerPreviousY = 0;
  let requestRender: (() => void) | undefined;

  function latLngToVector3(
    lat: number,
    lng: number,
    radius: number,
  ): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    );
  }

  export function focusLocation(location: ClientLocationMarker) {
    targetRotationY =
      -((location.position.lng + 180) * (Math.PI / 180)) + Math.PI / 2;
    targetRotationX = location.position.lat * (Math.PI / 180) * 0.7;
    requestRender?.();
  }

  export function resetRotation() {
    targetRotationX = INITIAL_ROTATION_X;
    targetRotationY = INITIAL_ROTATION_Y;
    requestRender?.();
  }

  function handlePointerDown(event: PointerEvent) {
    isDragging = true;
    pointerPreviousX = event.clientX;
    pointerPreviousY = event.clientY;
    velocityX = 0;
    velocityY = 0;

    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    requestRender?.();
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isDragging) return;

    const deltaX = event.clientX - pointerPreviousX;
    const deltaY = event.clientY - pointerPreviousY;
    velocityY = deltaX * 0.0045;
    velocityX = deltaY * 0.0045;
    targetRotationY += velocityY;
    targetRotationX = Math.max(
      -0.75,
      Math.min(0.75, targetRotationX + velocityX),
    );
    pointerPreviousX = event.clientX;
    pointerPreviousY = event.clientY;
    requestRender?.();
  }

  function handlePointerUp(event: PointerEvent) {
    isDragging = false;

    if (
      event.currentTarget instanceof HTMLElement &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    requestRender?.();
  }

  $effect(() => {
    if (selectedLocation) focusLocation(selectedLocation);
  });

  onMount(() => {
    if (!containerElement || !canvasElement) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const markerPositions = new Map<string, THREE.Vector3>();
    const cameraDirection = new THREE.Vector3();
    const worldPosition = new THREE.Vector3();
    const surfaceDirection = new THREE.Vector3();
    const projectedPosition = new THREE.Vector3();
    const globeEdgePosition = new THREE.Vector3(GLOBE_RADIUS, 0, 0);
    const mapRequestController = new AbortController();
    let earthTexture: THREE.CanvasTexture | undefined;
    let isMounted = true;
    let width = 600;
    let height = 540;
    let animationFrameId: number | undefined;
    let isInViewport = false;
    let lastFrameTime = 0;

    camera.position.z = 5.55;
    cameraDirection.copy(camera.position).normalize();
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    globeGroup = new THREE.Group();
    globeGroup.rotation.set(currentRotationX, currentRotationY, 0);
    scene.add(globeGroup);

    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 48, 48);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f8f6,
      roughness: 0.92,
      metalness: 0.01,
    });
    geometries.push(globeGeometry);
    materials.push(globeMaterial);
    globeGroup.add(new THREE.Mesh(globeGeometry, globeMaterial));

    async function loadCartographicTexture() {
      const response = await fetch(
        "/data/ne_110m_admin_0_countries.geojson",
        { signal: mapRequestController.signal },
      );
      if (!response.ok) return;

      const worldMap = (await response.json()) as WorldMapData;
      if (!isMounted) return;

      const mapCanvas = document.createElement("canvas");
      mapCanvas.width = 2048;
      mapCanvas.height = 1024;
      const context = mapCanvas.getContext("2d");
      if (!context) return;

      const rootStyles = getComputedStyle(document.documentElement);
      const brandDark = rootStyles.getPropertyValue("--color-brand-dark").trim();
      const brandLight = rootStyles
        .getPropertyValue("--color-brand-light")
        .trim();
      const brandGreen = rootStyles
        .getPropertyValue("--color-brand-green")
        .trim();

      context.fillStyle = brandDark;
      context.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
      context.lineJoin = "round";
      context.lineCap = "round";
      context.lineWidth = 1.25;

      const drawPolygon = (polygon: GeoPolygon) => {
        context.beginPath();

        for (const ring of polygon) {
          if (ring.length === 0) continue;
          const unwrappedLongitudes: number[] = [ring[0][0]];

          for (let index = 1; index < ring.length; index += 1) {
            let longitude = ring[index][0];
            const previousLongitude = unwrappedLongitudes[index - 1];
            while (longitude - previousLongitude > 180) longitude -= 360;
            while (longitude - previousLongitude < -180) longitude += 360;
            unwrappedLongitudes.push(longitude);
          }

          for (const wrapOffset of [-360, 0, 360]) {
            ring.forEach((position, index) => {
              const longitude = unwrappedLongitudes[index] + wrapOffset;
              const x = ((longitude + 180) / 360) * mapCanvas.width;
              const y = ((90 - position[1]) / 180) * mapCanvas.height;
              if (index === 0) context.moveTo(x, y);
              else context.lineTo(x, y);
            });
            context.closePath();
          }
        }

        context.globalAlpha = 0.42;
        context.fillStyle = brandLight;
        context.fill("evenodd");
        context.globalAlpha = 0.72;
        context.strokeStyle = brandGreen;
        context.stroke();
      };

      for (const feature of worldMap.features) {
        const polygons =
          feature.geometry.type === "Polygon"
            ? [feature.geometry.coordinates]
            : feature.geometry.coordinates;
        for (const polygon of polygons) drawPolygon(polygon);
      }

      context.globalAlpha = 1;
      const texture = new THREE.CanvasTexture(mapCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = Math.min(
        renderer.capabilities.getMaxAnisotropy(),
        4,
      );
      earthTexture = texture;
      globeMaterial.map = texture;
      globeMaterial.needsUpdate = true;
      requestRender?.();
    }

    void loadCartographicTexture().catch(() => undefined);

    const auraGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.09, 24, 24);
    const auraMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      uniforms: {
        glowColor: { value: new THREE.Color(0x7ea641) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
          float intensity = pow(0.58 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.35);
          gl_FragColor = vec4(glowColor, intensity * 0.28);
        }
      `,
    });
    geometries.push(auraGeometry);
    materials.push(auraMaterial);
    globeGroup.add(new THREE.Mesh(auraGeometry, auraMaterial));

    for (const location of locations) {
      const position = latLngToVector3(
        location.position.lat,
        location.position.lng,
        GLOBE_RADIUS + 0.025,
      );
      markerPositions.set(location.id, position);
    }

    scene.add(new THREE.AmbientLight(0x2f3929, 0.65));
    const keyLight = new THREE.DirectionalLight(0xf8f8f6, 2.35);
    keyLight.position.set(-5, 3, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x7ea641, 0.9);
    rimLight.position.set(4, 1, -4);
    scene.add(rimLight);

    function updateProjectedMarkers() {
      globeGroup.updateMatrixWorld();
      const nextMarkers: ProjectedMarker[] = [];
      projectedPosition.copy(globeEdgePosition).project(camera);
      const projectedRadius = Math.abs(projectedPosition.x) * width * 0.5;
      const safeLabelRadius = Math.max(projectedRadius - 48, 0);
      const globeCenterX = width * 0.5;
      const globeCenterY = height * 0.5;

      for (const location of locations) {
        const basePosition = markerPositions.get(location.id);
        if (!basePosition) continue;

        worldPosition.copy(basePosition).applyMatrix4(globeGroup.matrixWorld);
        surfaceDirection.copy(worldPosition).normalize();
        const facing = surfaceDirection.dot(cameraDirection);
        if (facing <= 0.12) continue;

        projectedPosition.copy(worldPosition).project(camera);
        const x = ((projectedPosition.x + 1) * width) / 2;
        const y = ((-projectedPosition.y + 1) * height) / 2;

        const distanceFromGlobeCenter = Math.hypot(
          x - globeCenterX,
          y - globeCenterY,
        );
        if (distanceFromGlobeCenter > safeLabelRadius) continue;
        nextMarkers.push({ location, x, y, facing });
      }

      projectedMarkers = nextMarkers;
    }

    function renderFrame(time: number) {
      animationFrameId = undefined;
      if (!isInViewport || document.hidden) return;

      const targetInterval = isDragging ? 1000 / 60 : 1000 / 30;
      const elapsed = lastFrameTime ? time - lastFrameTime : targetInterval;

      if (elapsed < targetInterval - 1) {
        animationFrameId = requestAnimationFrame(renderFrame);
        return;
      }

      lastFrameTime = time;
      const frameScale = Math.min(elapsed / (1000 / 60), 2);

      if (!isDragging && !prefersReducedMotion) {
        targetRotationY += 0.00085 * frameScale;
        targetRotationY += velocityY * frameScale;
        targetRotationX += velocityX * frameScale;
        const damping = Math.pow(0.92, frameScale);
        velocityX *= damping;
        velocityY *= damping;
      }

      const easing = 1 - Math.pow(0.9, frameScale);
      currentRotationX += (targetRotationX - currentRotationX) * easing;
      currentRotationY += (targetRotationY - currentRotationY) * easing;
      globeGroup.rotation.set(currentRotationX, currentRotationY, 0);
      updateProjectedMarkers();
      renderer.render(scene, camera);

      if (
        !prefersReducedMotion ||
        isDragging ||
        Math.abs(targetRotationX - currentRotationX) > 0.0005 ||
        Math.abs(targetRotationY - currentRotationY) > 0.0005
      ) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    }

    function startRendering() {
      if (!isInViewport || document.hidden || animationFrameId !== undefined)
        return;
      lastFrameTime = 0;
      animationFrameId = requestAnimationFrame(renderFrame);
    }

    requestRender = startRendering;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      width = Math.max(entry.contentRect.width, 1);
      height = Math.max(entry.contentRect.height, 1);
      camera.position.z = width < 640 ? 6.35 : 5.55;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
      renderer.setSize(width, height, false);
      startRendering();
    });
    resizeObserver.observe(containerElement);

    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = Boolean(entry?.isIntersecting);
        if (isInViewport) startRendering();
        else if (animationFrameId !== undefined) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = undefined;
        }
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );
    viewportObserver.observe(containerElement);

    const handleVisibilityChange = () => {
      if (document.hidden && animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      } else {
        startRendering();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      mapRequestController.abort();
      requestRender = undefined;
      if (animationFrameId !== undefined)
        cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      viewportObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      earthTexture?.dispose();
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      renderer.renderLists.dispose();
      renderer.dispose();
    };
  });
</script>

<div
  bind:this={containerElement}
  class="relative flex h-[32rem] w-full select-none items-center justify-center overflow-hidden sm:h-[40rem]"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
  onpointerleave={(event) => {
    if (isDragging) handlePointerUp(event);
  }}
  role="region"
  aria-label="Interactive 3D client world globe"
>
  <canvas
    bind:this={canvasElement}
    class="relative z-10 block h-full w-full cursor-grab touch-none bg-transparent active:cursor-grabbing"
  ></canvas>

  {#each projectedMarkers as marker (marker.location.id)}
    {@const isSelected = selectedLocation?.id === marker.location.id}
    {@const isHovered = hoveredLocationId === marker.location.id}
    {@const isMostVisible = marker.location.id === mostVisibleLocationId}
    {@const isHighlighted = selectedLocation ? isSelected : isMostVisible}

    <div
      class="location-marker absolute left-0 top-0 z-20"
      style="transform: translate3d({marker.x}px, {marker.y}px, 0) translate(-50%, -118%);"
    >
      <button
        type="button"
        class="location-tab rounded-[0.12rem] px-2.5 py-1.5 font-mono text-[0.5rem] font-semibold uppercase tracking-[0.1em] transition duration-200 focus-visible:outline-2 focus-visible:outline-brand-green {isHighlighted
          ? 'location-tab-selected scale-105 bg-brand-green text-brand-dark'
          : isHovered
            ? 'bg-brand-green text-brand-dark'
            : 'bg-brand-light/92 text-brand-dark hover:bg-brand-light'}"
        onmouseenter={() => (hoveredLocationId = marker.location.id)}
        onmouseleave={() => (hoveredLocationId = null)}
        onclick={() => onSelectLocation?.(marker.location)}
        aria-label="{marker.location
          .country}: {marker.location.clientCount.toLocaleString()} clients"
      >
        {marker.location.id === "united-arab-emirates"
          ? "UAE"
          : marker.location.country}
      </button>
      <span
        class:location-tail-selected={isHighlighted || isHovered}
        class="location-tail"
        aria-hidden="true"
      ></span>
    </div>
  {/each}
</div>

<style>
  .location-marker {
    filter: drop-shadow(
      0 0.35rem 0.7rem
        color-mix(in srgb, var(--color-brand-dark) 42%, transparent)
    );
  }

  .location-tab {
    white-space: nowrap;
    transform-origin: 50% 100%;
  }

  .location-tail {
    display: block;
    width: 0;
    height: 0;
    margin: -0.04rem auto 0;
    border-inline: 0.25rem solid transparent;
    border-top: 0.38rem solid var(--color-brand-light);
  }

  .location-tail-selected {
    border-top-color: var(--color-brand-green);
  }
</style>
