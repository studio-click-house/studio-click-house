<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import type ThreeGlobe from "three-globe";
  import type { ClientLocationMarker } from "$lib/types/content";

  interface Props {
    locations: ClientLocationMarker[];
  }

  interface WorldMapData {
    features: Array<{
      type: "Feature";
      properties: Record<string, unknown>;
      geometry: {
        type: "Polygon" | "MultiPolygon";
        coordinates: number[][][] | number[][][][];
      };
    }>;
  }

  interface GlobeArc {
    order: number;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    arcAlt: number;
    color: string;
    stroke: number;
    dashOffset: number;
  }

  interface GlobePoint {
    lat: number;
    lng: number;
    color: string;
  }

  interface GlobeRing {
    lat: number;
    lng: number;
    color: string;
  }

  const INITIAL_ROTATION_X = 0.12;
  const INITIAL_ROTATION_Y = -1.92;
  const ROUTE_COLORS = ["#7ea641", "#9aca54", "#63adb0", "#06b6d4"];
  const GLOBE_COLOR = "#062056";
  const ATMOSPHERE_COLOR = "#7ea641";
  const POLYGON_COLOR = "rgba(255,255,255,0.7)";
  const ARC_TIME = 1350;
  const ARC_LENGTH = 0.46;
  const MAX_RINGS = 3;
  const RING_PROPAGATION_SPEED = 3;

  let { locations }: Props = $props();

  let containerElement: HTMLDivElement;
  let canvasElement: HTMLCanvasElement;
  let isDragging = $state(false);

  let targetRotationX = INITIAL_ROTATION_X;
  let targetRotationY = INITIAL_ROTATION_Y;
  let currentRotationX = INITIAL_ROTATION_X;
  let currentRotationY = INITIAL_ROTATION_Y;
  let velocityX = 0;
  let velocityY = 0;
  let pointerPreviousX = 0;
  let pointerPreviousY = 0;
  let requestRender: (() => void) | undefined;

  function createArcData() {
    if (locations.length < 2) return [];

    return locations.flatMap<GlobeArc>((location, index) => {
      const destinationOffsets = index % 2 === 0 ? [1, 4] : [1];

      return destinationOffsets.map((destinationOffset, routeIndex) => {
        const destination =
          locations[(index + destinationOffset) % locations.length];
        const routeOrder = (index + routeIndex * 3) % 14;

        return {
          order: routeOrder + 1,
          startLat: location.position.lat,
          startLng: location.position.lng,
          endLat: destination.position.lat,
          endLng: destination.position.lng,
          arcAlt: 0.07 + ((index + routeIndex * 2) % 5) * 0.018,
          color: ROUTE_COLORS[(index + routeIndex) % ROUTE_COLORS.length],
          stroke: [0.34, 0.3, 0.28][(index + routeIndex) % 3],
          dashOffset: routeOrder * 0.12 + routeIndex * 0.18,
        };
      });
    });
  }

  function createPointData(arcs: GlobeArc[]) {
    const pointMap = new Map<string, GlobePoint>();

    for (const arc of arcs) {
      const startKey = `${arc.startLat}:${arc.startLng}`;
      const endKey = `${arc.endLat}:${arc.endLng}`;

      if (!pointMap.has(startKey)) {
        pointMap.set(startKey, {
          lat: arc.startLat,
          lng: arc.startLng,
          color: arc.color,
        });
      }
      if (!pointMap.has(endKey)) {
        pointMap.set(endKey, {
          lat: arc.endLat,
          lng: arc.endLng,
          color: arc.color,
        });
      }
    }

    return [...pointMap.values()];
  }

  function createRingData(arcs: GlobeArc[], cycle: number) {
    return arcs
      .filter((_, index) => (index + cycle) % 5 !== 0)
      .map<GlobeRing>((arc) => ({
        lat: arc.startLat,
        lng: arc.startLng,
        color: arc.color,
      }));
  }

  export function focusLocation(location: ClientLocationMarker) {
    const focusedRotationY = (location.position.lng - 90) * (Math.PI / 180);
    targetRotationY =
      focusedRotationY +
      Math.round((targetRotationY - focusedRotationY) / (Math.PI * 2)) *
        Math.PI *
        2;
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
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isDragging) return;

    const deltaX = event.clientX - pointerPreviousX;
    const deltaY = event.clientY - pointerPreviousY;
    velocityY = deltaX * 0.0045;
    velocityX = deltaY * 0.0045;
    targetRotationY += velocityY;
    targetRotationX += velocityX;
    pointerPreviousX = event.clientX;
    pointerPreviousY = event.clientY;
  }

  function handlePointerUp(event: PointerEvent) {
    isDragging = false;

    if (
      event.currentTarget instanceof HTMLElement &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  onMount(() => {
    let active = true;
    let destroyRuntime: (() => void) | undefined;

    async function initializeGlobe() {
      const { default: ThreeGlobeConstructor } = await import("three-globe");
      if (!active || !containerElement || !canvasElement) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x000000, 400, 2000);
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      const globeGroup = new THREE.Group();
      const globe = new ThreeGlobeConstructor({
        waitForGlobeReady: false,
        animateIn: false,
      });
      const mapRequestController = new AbortController();
      const arcs = createArcData();
      let ringCycle = 0;
      let width = 600;
      let height = 540;
      let animationFrameId: number | undefined;
      let isInViewport = false;
      let lastFrameTime = 0;

      camera.position.z = 284;
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;

      globeGroup.rotation.set(currentRotationX, currentRotationY, 0);
      globeGroup.add(globe);
      scene.add(globeGroup);

      const globeMaterial = globe.globeMaterial();
      if (globeMaterial instanceof THREE.MeshPhongMaterial) {
        globeMaterial.color = new THREE.Color(GLOBE_COLOR);
        globeMaterial.emissive = new THREE.Color(GLOBE_COLOR);
        globeMaterial.emissiveIntensity = 0.1;
        globeMaterial.shininess = 0.9;
      }

      globe
        .showAtmosphere(true)
        .atmosphereColor(ATMOSPHERE_COLOR)
        .atmosphereAltitude(0.1)
        .arcsData(arcs)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor("color")
        .arcAltitude("arcAlt")
        .arcStroke("stroke")
        .arcDashLength(ARC_LENGTH)
        .arcDashInitialGap("dashOffset")
        .arcDashGap(1.35)
        .arcDashAnimateTime(prefersReducedMotion ? 0 : ARC_TIME)
        .pointsData(createPointData(arcs))
        .pointLat("lat")
        .pointLng("lng")
        .pointColor("color")
        .pointsMerge(true)
        .pointAltitude(0)
        .pointRadius(2)
        .ringsData(createRingData(arcs, ringCycle))
        .ringLat("lat")
        .ringLng("lng")
        .ringColor("color")
        .ringMaxRadius(MAX_RINGS)
        .ringPropagationSpeed(prefersReducedMotion ? 0 : RING_PROPAGATION_SPEED)
        .ringRepeatPeriod(ARC_TIME * ARC_LENGTH);

      scene.add(new THREE.AmbientLight(0x38bdf8, 0.6));
      const leftLight = new THREE.DirectionalLight(0xffffff, 0.7);
      leftLight.position.set(-400, 100, 400);
      scene.add(leftLight);
      const topLight = new THREE.DirectionalLight(0xffffff, 0.7);
      topLight.position.set(-200, 500, 200);
      scene.add(topLight);
      const pointLight = new THREE.PointLight(0xffffff, 0.8);
      pointLight.position.set(-200, 500, 200);
      scene.add(pointLight);

      async function loadCountries() {
        try {
          const response = await fetch(
            "/data/ne_110m_admin_0_countries.geojson",
            { signal: mapRequestController.signal },
          );
          if (!response.ok || !active) return;

          const worldMap = (await response.json()) as WorldMapData;
          if (!active) return;

          globe
            .hexPolygonsData(worldMap.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.7)
            .hexPolygonColor(() => POLYGON_COLOR);
        } catch (error) {
          if (!(error instanceof DOMException && error.name === "AbortError")) {
            return;
          }
        }
      }

      void loadCountries();

      const ringInterval = window.setInterval(() => {
        if (prefersReducedMotion || !active) return;
        ringCycle = (ringCycle + 1) % 5;
        globe.ringsData(createRingData(arcs, ringCycle));
      }, 2000);

      function resizeRenderer() {
        const bounds = containerElement.getBoundingClientRect();
        width = Math.max(1, bounds.width);
        height = Math.max(1, bounds.height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.setSize(width, height, false);
        globe.rendererSize(new THREE.Vector2(width, height));
        globe.setPointOfView(camera);
        renderer.render(scene, camera);
      }

      function renderFrame(time: number) {
        animationFrameId = undefined;
        if (!active || !isInViewport || document.hidden) return;

        const delta = Math.min(time - lastFrameTime || 16, 40);
        lastFrameTime = time;

        if (!prefersReducedMotion) {
          targetRotationY += delta * 0.000052;
        }

        if (!isDragging) {
          targetRotationX += velocityX;
          targetRotationY += velocityY;
          velocityX *= 0.92;
          velocityY *= 0.92;
        }

        targetRotationX = THREE.MathUtils.clamp(
          targetRotationX,
          -Math.PI * 0.42,
          Math.PI * 0.42,
        );
        currentRotationX = THREE.MathUtils.lerp(
          currentRotationX,
          targetRotationX,
          0.1,
        );
        currentRotationY = THREE.MathUtils.lerp(
          currentRotationY,
          targetRotationY,
          0.1,
        );
        globeGroup.rotation.set(currentRotationX, currentRotationY, 0);

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(renderFrame);
      }

      function startRendering() {
        if (
          animationFrameId === undefined &&
          isInViewport &&
          !document.hidden
        ) {
          lastFrameTime = performance.now();
          animationFrameId = requestAnimationFrame(renderFrame);
        }
      }

      requestRender = startRendering;
      const resizeObserver = new ResizeObserver(resizeRenderer);
      resizeObserver.observe(containerElement);
      resizeRenderer();

      const viewportObserver = new IntersectionObserver(
        ([entry]) => {
          isInViewport = Boolean(entry?.isIntersecting);
          if (isInViewport) {
            globe.resumeAnimation();
            startRendering();
          } else {
            globe.pauseAnimation();
            if (animationFrameId !== undefined) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = undefined;
            }
          }
        },
        { rootMargin: "160px 0px", threshold: 0.01 },
      );
      viewportObserver.observe(containerElement);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          globe.pauseAnimation();
          if (animationFrameId !== undefined) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = undefined;
          }
        } else {
          globe.resumeAnimation();
          startRendering();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      destroyRuntime = () => {
        mapRequestController.abort();
        window.clearInterval(ringInterval);
        requestRender = undefined;
        if (animationFrameId !== undefined) {
          cancelAnimationFrame(animationFrameId);
        }
        resizeObserver.disconnect();
        viewportObserver.disconnect();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        globe._destructor();
        renderer.renderLists.dispose();
        renderer.dispose();
      };
    }

    void initializeGlobe();

    return () => {
      active = false;
      destroyRuntime?.();
    };
  });
</script>

<div
  bind:this={containerElement}
  class="globe-container relative flex h-[36rem] w-full select-none items-center justify-center overflow-hidden sm:h-[clamp(36rem,78dvh,46rem)]"
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
</div>
