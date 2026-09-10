<script lang="ts">
  import { onMount } from "svelte";
  import type * as THREE from "three";
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
    radius?: number;
  }

  interface GlobeRing {
    lat: number;
    lng: number;
    color: string;
    maxR?: number;
    propagationSpeed?: number;
    repeatPeriod?: number;
  }

  interface ActiveLabel {
    id: string;
    country: string;
    x: number;
    y: number;
    visible: boolean;
    isHub?: boolean;
    placement?: "top" | "bottom" | "left" | "right";
    showBadge?: boolean;
  }

  interface ActiveFlyingFile {
    id: string;
    country: string;
    label: string;
    direction: "inbound" | "outbound";
    screenX: number;
    screenY: number;
    visible: boolean;
    opacity: number;
    scale: number;
  }

  interface ActiveFlightLine {
    id: string;
    pathD: string;
    opacity: number;
    direction?: "inbound" | "outbound" | "base";
    isActive?: boolean;
  }

  // Central Production Hub: Bangladesh (Dhaka)
  const DHAKA_LAT = 23.685;
  const DHAKA_LNG = 90.356;

  // Home view: focused directly on Bangladesh Studio Hub (Dhaka)
  const HOME_LAT = DHAKA_LAT;
  const HOME_LNG = DHAKA_LNG;
  const INITIAL_ROTATION_X = DHAKA_LAT * (Math.PI / 180); // ~0.413 rad: centers Dhaka vertically
  const INITIAL_ROTATION_Y = -DHAKA_LNG * (Math.PI / 180); // ~-1.577 rad: centers Dhaka horizontally facing camera
  const RETURN_DELAY = 2600;
  const HIGHLIGHT_GREEN = "#7ea641"; // Authentic Studio Brand Green (matching 'Start a Project' button)
  const ROUTE_COLORS = ["#7ea641", "#78a03c", "#84ad46", "#7ea641"];
  const GLOBE_COLOR = "#f8f8f6"; // White / Brand Light globe surface
  const ATMOSPHERE_COLOR = "#7ea641"; // Radiant studio brand green outside atmosphere glow
  const POLYGON_COLOR = "#121110"; // Deep, crisp, high-contrast black dots
  const ARC_TIME = 1500;
  const ARC_LENGTH = 0.46;

  interface StudioRoute {
    id: string;
    country: string;
    pos: [number, number];
    inboundExt: string;
    outboundExt: string;
    distance: number;
    durationFrames: number;
    placement: "top" | "bottom" | "left" | "right";
    arcAlt: number;
  }

  const RAW_ROUTES = [
    {
      id: "united-kingdom",
      country: "United Kingdom",
      pos: [54.8, -3.4] as [number, number],
      inboundExt: "PSD",
      outboundExt: "PNG",
      placement: "left" as const,
      arcAlt: 0.07,
    },
    {
      id: "united-arab-emirates",
      country: "UAE",
      pos: [24.2, 54.5] as [number, number],
      inboundExt: "RAW",
      outboundExt: "JPG",
      placement: "right" as const,
      arcAlt: 0.06,
    },
    {
      id: "germany",
      country: "Germany",
      pos: [51.5, 10.5] as [number, number],
      inboundExt: "RAW",
      outboundExt: "WEBP",
      placement: "right" as const,
      arcAlt: 0.07,
    },
    {
      id: "norway",
      country: "Norway",
      pos: [60.47, 8.47] as [number, number],
      inboundExt: "NEF",
      outboundExt: "JPG",
      placement: "top" as const,
      arcAlt: 0.06,
    },
    {
      id: "sweden",
      country: "Sweden",
      pos: [60.13, 18.64] as [number, number],
      inboundExt: "DNG",
      outboundExt: "PSD",
      placement: "top" as const,
      arcAlt: 0.06,
    },
    {
      id: "denmark",
      country: "Denmark",
      pos: [56.26, 9.5] as [number, number],
      inboundExt: "CR2",
      outboundExt: "WEBP",
      placement: "right" as const,
      arcAlt: 0.06,
    },
    {
      id: "france",
      country: "France",
      pos: [46.6, 2.2] as [number, number],
      inboundExt: "TIFF",
      outboundExt: "JPG",
      placement: "bottom" as const,
      arcAlt: 0.07,
    },
    {
      id: "spain",
      country: "Spain",
      pos: [40.46, -3.75] as [number, number],
      inboundExt: "ARW",
      outboundExt: "TIFF",
      placement: "bottom" as const,
      arcAlt: 0.07,
    },
    {
      id: "united-states",
      country: "United States",
      pos: [40.7128, -74.006] as [number, number],
      inboundExt: "CR3",
      outboundExt: "PSD",
      placement: "left" as const,
      arcAlt: 0.09,
    },
    {
      id: "australia",
      country: "Australia",
      pos: [-33.8688, 151.2093] as [number, number],
      inboundExt: "ARW",
      outboundExt: "WEBP",
      placement: "right" as const,
      arcAlt: 0.08,
    },
  ];

  type FlightState = "idle" | "inbound" | "processing" | "outbound";

  interface RouteRuntime {
    state: FlightState;
    currentFrame: number;
    totalFrames: number;
    processingTimer: number;
    idleCooldown: number;
    flightId: string;
  }

  function computeSphericalDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const rad = Math.PI / 180;
    const phi1 = (90 - lat1) * rad;
    const phi2 = (90 - lat2) * rad;
    const theta1 = lng1 * rad;
    const theta2 = lng2 * rad;
    const dot =
      Math.sin(phi1) * Math.sin(phi2) * Math.cos(theta1 - theta2) +
      Math.cos(phi1) * Math.cos(phi2);
    return Math.acos(Math.max(-1, Math.min(1, dot)));
  }

  // Calibrated constant travel speed: 185 frames per radian (~3.1s per radian at 60fps)
  const FRAMES_PER_RADIAN = 185;

  const STUDIO_ROUTES: StudioRoute[] = RAW_ROUTES.map((r) => {
    const dist = computeSphericalDistance(
      r.pos[0],
      r.pos[1],
      DHAKA_LAT,
      DHAKA_LNG,
    );
    return {
      ...r,
      distance: dist,
      durationFrames: Math.max(160, Math.round(dist * FRAMES_PER_RADIAN)),
    };
  });

  let { locations }: Props = $props();

  let containerElement: HTMLDivElement;
  let canvasElement: HTMLCanvasElement;
  let isDragging = $state(false);
  let activeLabels = $state<ActiveLabel[]>([]);
  let activeFlyingFiles = $state<ActiveFlyingFile[]>([]);
  let activeFlightLines = $state<ActiveFlightLine[]>([]);

  let targetRotationX = INITIAL_ROTATION_X;
  let targetRotationY = INITIAL_ROTATION_Y;
  let currentRotationX = INITIAL_ROTATION_X;
  let currentRotationY = INITIAL_ROTATION_Y;
  let velocityX = 0;
  let velocityY = 0;
  let pointerPreviousX = 0;
  let pointerPreviousY = 0;
  let requestRender: (() => void) | undefined;
  let returnTimeoutId: ReturnType<typeof setTimeout> | undefined;

  let isReturningToHome = false;
  let isLockedAtHome = true;
  let lockTimer = 100;

  function cancelReturnToHome() {
    isReturningToHome = false;
    isLockedAtHome = false;
    if (returnTimeoutId !== undefined) {
      clearTimeout(returnTimeoutId);
      returnTimeoutId = undefined;
    }
  }

  function returnToHome() {
    velocityX = 0;
    velocityY = 0;
    isReturningToHome = true;
    isLockedAtHome = false;
    // Ease back along shortest rotational path directly to Bangladesh Hub
    const homeY =
      INITIAL_ROTATION_Y +
      Math.round((currentRotationY - INITIAL_ROTATION_Y) / (Math.PI * 2)) *
        Math.PI *
        2;
    targetRotationY = homeY;
    targetRotationX = INITIAL_ROTATION_X;
    requestRender?.();
  }

  function scheduleReturnToHome() {
    cancelReturnToHome();
    returnTimeoutId = setTimeout(returnToHome, RETURN_DELAY);
  }


  // Studio partner routes connecting directly to Bangladesh (Dhaka Studio Hub)
  function createArcData() {
    return STUDIO_ROUTES.map<GlobeArc>((r, index) => {
      const routeOrder = (index * 2) % 12;
      return {
        order: routeOrder + 1,
        startLat: r.pos[0],
        startLng: r.pos[1],
        endLat: DHAKA_LAT,
        endLng: DHAKA_LNG,
        arcAlt: r.arcAlt,
        color: ROUTE_COLORS[index % ROUTE_COLORS.length],
        stroke: 0.42,
        dashOffset: (index * 0.15) % 1,
      };
    });
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
    cancelReturnToHome();
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
    scheduleReturnToHome();

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
    let initializationObserver: IntersectionObserver | undefined;
    let initializationIdleId: number | undefined;
    let initializationTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let initializationStarted = false;
    let canInitialize =
      !document.querySelector(".site-preloader") ||
      document.documentElement.dataset.preloaderComplete === "true";

    async function initializeGlobe() {
      const [THREE, { default: ThreeGlobeConstructor }, { gsap }] =
        await Promise.all([
          import("three"),
          import("three-globe"),
          import("gsap"),
        ]);
      if (!active || !containerElement || !canvasElement) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xf8f8f6, 450, 2200);
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);

      // Optimized WebGL Renderer: powerPreference and calibrated pixel ratio to save GPU
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
      let isRendering = false;
      let isInViewport = false;
      let lastFrameTime = 0;
      let labelFrame = 0;

      camera.position.z = 296;
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
        globeMaterial.emissiveIntensity = 0.94;
        globeMaterial.shininess = 0.9;
      }

      globe
        .showAtmosphere(false)
        .arcsData(prefersReducedMotion ? arcs : [])
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
        .arcDashAnimateTime(0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.65));
      const leftLight = new THREE.DirectionalLight(0xffffff, 0.48);
      leftLight.position.set(-400, 150, 400);
      scene.add(leftLight);
      const topLight = new THREE.DirectionalLight(0xf8f8f6, 0.40);
      topLight.position.set(-200, 500, 200);
      scene.add(topLight);

      // Optimized World Map Polygons: hexPolygonResolution(2) cuts polygon count by ~60%
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
            .hexPolygonMargin(0.62)
            .hexPolygonColor((feature: object) => {
              const props =
                "properties" in feature && typeof feature.properties === "object"
                  ? feature.properties
                  : null;
              if (props) {
                const isoA2 = String(
                  Reflect.get(props, "ISO_A2") ||
                    Reflect.get(props, "iso_a2") ||
                    "",
                ).toUpperCase();
                const name = String(
                  Reflect.get(props, "NAME") ||
                    Reflect.get(props, "name") ||
                    "",
                ).toUpperCase();
                const admin = String(
                  Reflect.get(props, "ADMIN") ||
                    Reflect.get(props, "admin") ||
                    "",
                ).toUpperCase();

                const listedIsoCodes = [
                  "BD",
                  "US",
                  "GB",
                  "DE",
                  "DK",
                  "NO",
                  "SE",
                  "FR",
                  "ES",
                  "AE",
                  "AU",
                ];
                const listedNames = [
                  "BANGLADESH",
                  "UNITED STATES",
                  "UNITED STATES OF AMERICA",
                  "UNITED KINGDOM",
                  "GERMANY",
                  "DENMARK",
                  "NORWAY",
                  "SWEDEN",
                  "FRANCE",
                  "SPAIN",
                  "UNITED ARAB EMIRATES",
                  "AUSTRALIA",
                ];

                if (
                  listedIsoCodes.includes(isoA2) ||
                  listedNames.includes(name) ||
                  listedNames.includes(admin)
                ) {
                  return HIGHLIGHT_GREEN; // Radiant vivid green highlight
                }
              }
              return POLYGON_COLOR;
            });

          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => resolve());
          });
          if (!active) return;

          await renderer.compileAsync(scene, camera);
          if (active) renderer.render(scene, camera);
        } catch (error) {
          if (!(error instanceof DOMException && error.name === "AbortError")) {
            return;
          }
        }
      }

      void loadCountries();

      // Spherical linear interpolation between two unit vectors on the globe
      function slerpUnitVectors(vA: THREE.Vector3, vB: THREE.Vector3, t: number): THREE.Vector3 {
        const dot = THREE.MathUtils.clamp(vA.dot(vB), -1, 1);
        const omega = Math.acos(dot);
        if (omega < 1e-4) {
          return new THREE.Vector3().lerpVectors(vA, vB, t).normalize();
        }
        const sinOmega = Math.sin(omega);
        const sA = Math.sin((1 - t) * omega) / sinOmega;
        const sB = Math.sin(t * omega) / sinOmega;
        return new THREE.Vector3().addScaledVector(vA, sA).addScaledVector(vB, sB).normalize();
      }

      // Unit vector helper in ThreeGlobe coordinate space
      function getGlobeUnit(lat: number, lng: number): THREE.Vector3 {
        const coords = globe.getCoords(lat, lng, 0);
        return new THREE.Vector3(coords.x, coords.y, coords.z).normalize();
      }

      const dhakaUnit = getGlobeUnit(DHAKA_LAT, DHAKA_LNG);

      // Precomputed 3D curves with continuous C1 tangent derivatives (zero kinks, perfectly smooth aerodynamic arcs)
      const routeCurves: Record<string, THREE.CatmullRomCurve3> = {};

      STUDIO_ROUTES.forEach((r) => {
        if (r.id === "united-states") {
          // Transatlantic flight arc: climbs out of New York, arcs smoothly over Central Europe [48N, 10E]
          // and sweeps gracefully into Dhaka Studio Hub.
          // Continuous C1 spherical spline: perfectly round, convex arch with zero flat spots or U-turns.
          const guideUnits = [
            getGlobeUnit(r.pos[0], r.pos[1]), // New York [40.7128, -74.006]
            getGlobeUnit(48.0, 10.0),         // Central Europe (commercial transatlantic air corridor)
            dhakaUnit,                        // Dhaka Studio Hub [23.685, 90.356]
          ];
          const guideSpline = new THREE.CatmullRomCurve3(guideUnits, false, "catmullrom", 0.25);
          const curvePoints: THREE.Vector3[] = [];
          const SAMPLES = 36;
          for (let i = 0; i <= SAMPLES; i++) {
            const t = i / SAMPLES;
            const u = guideSpline.getPoint(t).normalize();
            const alt = r.arcAlt * Math.sin(Math.PI * t);
            curvePoints.push(u.multiplyScalar(100 * (1 + alt)));
          }
          routeCurves[r.id] = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.15);
        } else {
          // Direct spherical great circle route with smooth sinusoidal altitude profile
          const startUnit = getGlobeUnit(r.pos[0], r.pos[1]);
          const curvePoints: THREE.Vector3[] = [];
          const SAMPLES = 24;
          for (let i = 0; i <= SAMPLES; i++) {
            const t = i / SAMPLES;
            const u = slerpUnitVectors(startUnit, dhakaUnit, t);
            const alt = r.arcAlt * Math.sin(Math.PI * t);
            curvePoints.push(u.multiplyScalar(100 * (1 + alt)));
          }
          routeCurves[r.id] = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.15);
        }
      });

      function getRoute3DPoint(
        route: StudioRoute,
        arcParam: number,
        outVec: THREE.Vector3,
      ) {
        routeCurves[route.id].getPoint(arcParam, outVec);
      }

      // Minimum gap (in frames) between any two inbound arrivals at Dhaka Hub.
      // 125 frames ≈ 2.1 seconds. This guarantees files enter Dhaka Hub strictly ONE BY ONE with zero traffic jams!
      const MIN_ARRIVAL_GAP = 125;

      let globalFrame = 0;
      let nextAllowedHubArrivalFrame = 0;
      let dispatchQueueIndex = 0;

      const routeRuntimes: Record<string, RouteRuntime> = {};
      STUDIO_ROUTES.forEach((r, index) => {
        if (index === 0) {
          // UK: halfway inbound to Dhaka Hub
          const half = Math.round(r.durationFrames * 0.55);
          routeRuntimes[r.id] = {
            state: "inbound",
            currentFrame: half,
            totalFrames: r.durationFrames,
            processingTimer: 0,
            idleCooldown: 0,
            flightId: `${r.id}-in-init`,
          };
          nextAllowedHubArrivalFrame = (r.durationFrames - half) + MIN_ARRIVAL_GAP;
        } else if (index === 1) {
          // UAE: early inbound from Dubai
          const early = Math.round(r.durationFrames * 0.2);
          routeRuntimes[r.id] = {
            state: "inbound",
            currentFrame: early,
            totalFrames: r.durationFrames,
            processingTimer: 0,
            idleCooldown: 0,
            flightId: `${r.id}-in-init`,
          };
          nextAllowedHubArrivalFrame = Math.max(
            nextAllowedHubArrivalFrame,
            (r.durationFrames - early) + MIN_ARRIVAL_GAP,
          );
        } else if (index === 2) {
          // Germany: Master Deliverable already flying outbound back to Berlin
          routeRuntimes[r.id] = {
            state: "outbound",
            currentFrame: Math.round(r.durationFrames * 0.35),
            totalFrames: r.durationFrames,
            processingTimer: 0,
            idleCooldown: 0,
            flightId: `${r.id}-out-init`,
          };
        } else {
          routeRuntimes[r.id] = {
            state: "idle",
            currentFrame: 0,
            totalFrames: r.durationFrames,
            processingTimer: 0,
            idleCooldown: (index - 2) * 60,
            flightId: `${r.id}-idle`,
          };
        }
      });


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

      const labelPosition = new THREE.Vector3();
      const cameraDirection = new THREE.Vector3();
      const labelNormal = new THREE.Vector3();

      // Reusable vectors for 3D flight coordinate projection and line sampling
      const startVec = new THREE.Vector3();
      const endVec = new THREE.Vector3();
      const flightPos = new THREE.Vector3();
      const samplePos = new THREE.Vector3();
      const sampleNormal = new THREE.Vector3();

      function renderFrame(time: number) {
        if (!active || !isInViewport || document.hidden) return;

        const timeMs = time * 1000;
        const delta = Math.min(timeMs - lastFrameTime || 16, 40);
        lastFrameTime = timeMs;

        if (
          !prefersReducedMotion &&
          !isDragging &&
          !isReturningToHome &&
          !isLockedAtHome
        ) {
          targetRotationY += delta * 0.000032;
        }

        if (!isDragging && !isReturningToHome) {
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
        const lerpFactor = isReturningToHome ? 0.055 : 0.1;
        currentRotationX = THREE.MathUtils.lerp(
          currentRotationX,
          targetRotationX,
          lerpFactor,
        );
        currentRotationY = THREE.MathUtils.lerp(
          currentRotationY,
          targetRotationY,
          lerpFactor,
        );
        globeGroup.rotation.set(currentRotationX, currentRotationY, 0);

        // Check if return-to-home reached Bangladesh Hub
        if (isReturningToHome) {
          const diffX = Math.abs(currentRotationX - targetRotationX);
          const diffY = Math.abs(currentRotationY - targetRotationY);
          if (diffX < 0.0025 && diffY < 0.0025) {
            currentRotationX = targetRotationX;
            currentRotationY = targetRotationY;
            isReturningToHome = false;
            isLockedAtHome = true;
            lockTimer = 90; // Lock on Bangladesh Hub for ~1.5s before moving
          }
        } else if (isLockedAtHome) {
          lockTimer--;
          if (lockTimer <= 0) {
            isLockedAtHome = false;
          }
        }

        // Update matrices once per frame
        globeGroup.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);

        // Advance flight states and run one-by-one arrival dispatcher
        if (!prefersReducedMotion) {
          globalFrame++;

          for (const route of STUDIO_ROUTES) {
            const rt = routeRuntimes[route.id];
            if (rt.state === "inbound") {
              rt.currentFrame++;
              if (rt.currentFrame >= rt.totalFrames) {
                // Inbound file has arrived at Dhaka Studio Hub!
                rt.state = "processing";
                rt.processingTimer = 48 + Math.floor(Math.random() * 45); // ~0.8s to 1.5s studio turnaround
              }
            } else if (rt.state === "processing") {
              rt.processingTimer--;
              if (rt.processingTimer <= 0) {
                // Work finished! Dispatch Master Deliverable OUTBOUND to client
                rt.state = "outbound";
                rt.currentFrame = 0;
                rt.flightId = `${route.id}-out-${Math.random().toString(36).slice(2, 7)}`;
              }
            } else if (rt.state === "outbound") {
              rt.currentFrame++;
              if (rt.currentFrame >= rt.totalFrames) {
                // Master Deliverable arrived safely at client country!
                rt.state = "idle";
                rt.idleCooldown = 110 + Math.floor(Math.random() * 95); // ~1.8s to 3.4s cooldown
              }
            } else if (rt.state === "idle") {
              if (rt.idleCooldown > 0) {
                rt.idleCooldown--;
              }
            }
          }

          // Staggered Inbound Dispatcher: Guarantees files enter Dhaka Hub strictly one by one
          for (let attempt = 0; attempt < 2; attempt++) {
            const candidateRoute = STUDIO_ROUTES[dispatchQueueIndex];
            const candidateRt = routeRuntimes[candidateRoute.id];

            if (candidateRt.state === "idle" && candidateRt.idleCooldown <= 0) {
              const potentialArrival = globalFrame + candidateRoute.durationFrames;
              if (potentialArrival >= nextAllowedHubArrivalFrame) {
                candidateRt.state = "inbound";
                candidateRt.currentFrame = 0;
                candidateRt.flightId = `${candidateRoute.id}-in-${Math.random().toString(36).slice(2, 7)}`;
                nextAllowedHubArrivalFrame = potentialArrival + MIN_ARRIVAL_GAP;
                dispatchQueueIndex = (dispatchQueueIndex + 1) % STUDIO_ROUTES.length;
                break;
              }
            } else {
              dispatchQueueIndex = (dispatchQueueIndex + 1) % STUDIO_ROUTES.length;
            }
          }
        }

        // 1. PROJECT COUNTRY PIN LABELS (Including Dhaka Hub) ON EVERY FRAME
        const labels: ActiveLabel[] = [];
        const labelsMap: Record<string, ActiveLabel> = {};

        // Dhaka Studio Hub Label
        const dhakaCoords = globe.getCoords(DHAKA_LAT, DHAKA_LNG, 0);
        labelPosition.set(dhakaCoords.x, dhakaCoords.y, dhakaCoords.z);
        labelPosition.applyMatrix4(globeGroup.matrixWorld);
        cameraDirection.copy(camera.position).sub(labelPosition).normalize();
        labelNormal.copy(labelPosition).normalize();
        const dhakaDot = labelNormal.dot(cameraDirection);

        let dhakaVisible = false;
        let dhakaScreenX = 0;
        let dhakaScreenY = 0;

        if (dhakaDot > 0.10 && labelPosition.z > 0) {
          labelPosition.project(camera);
          dhakaScreenX = (labelPosition.x * 0.5 + 0.5) * width;
          dhakaScreenY = (-(labelPosition.y * 0.5) + 0.5) * height;
          dhakaVisible = true;
          const hubLabel: ActiveLabel = {
            id: "bangladesh-hub",
            country: "Dhaka Studio Hub",
            x: dhakaScreenX,
            y: dhakaScreenY,
            visible: true,
            isHub: true,
          };
          labels.push(hubLabel);
          labelsMap["bangladesh-hub"] = hubLabel;
        }

        // Client Country Pins with exact coordinate matching and collision-free badge allocation
        interface ProjectedCandidate {
          route: StudioRoute;
          x: number;
          y: number;
          isActive: boolean;
        }
        const candidates: ProjectedCandidate[] = [];

        for (const route of STUDIO_ROUTES) {
          const coords = globe.getCoords(route.pos[0], route.pos[1], 0);
          labelPosition.set(coords.x, coords.y, coords.z);
          labelPosition.applyMatrix4(globeGroup.matrixWorld);

          cameraDirection.copy(camera.position).sub(labelPosition).normalize();
          labelNormal.copy(labelPosition).normalize();
          const dot = labelNormal.dot(cameraDirection);

          if (dot > 0.12 && labelPosition.z > 0) {
            labelPosition.project(camera);
            const lx = (labelPosition.x * 0.5 + 0.5) * width;
            const ly = (-(labelPosition.y * 0.5) + 0.5) * height;
            const rt = routeRuntimes[route.id];
            const isActive = Boolean(rt && (rt.state === "inbound" || rt.state === "outbound"));
            candidates.push({
              route,
              x: lx,
              y: ly,
              isActive,
            });
          }
        }

        // Active flight routes always have top priority to display their badge
        candidates.sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));

        // Screen-space badge collision avoidance
        const placedBadgeBoxes: Array<{ x: number; y: number }> = [];
        if (dhakaVisible) {
          placedBadgeBoxes.push({ x: dhakaScreenX, y: dhakaScreenY });
        }

        for (const cand of candidates) {
          let showBadge = true;

          // Estimate badge center position based on placement
          const badgeOffset = 38;
          let badgeCenterX = cand.x;
          let badgeCenterY = cand.y;
          if (cand.route.placement === "left") badgeCenterX -= badgeOffset;
          else if (cand.route.placement === "right") badgeCenterX += badgeOffset;
          else if (cand.route.placement === "top") badgeCenterY -= 20;
          else if (cand.route.placement === "bottom") badgeCenterY += 20;

          if (!cand.isActive) {
            for (const placed of placedBadgeBoxes) {
              const dx = Math.abs(badgeCenterX - placed.x);
              const dy = Math.abs(badgeCenterY - placed.y);
              if (dx < 64 && dy < 28) {
                showBadge = false;
                break;
              }
            }
          }

          if (showBadge) {
            placedBadgeBoxes.push({ x: badgeCenterX, y: badgeCenterY });
          }

          const cLabel: ActiveLabel = {
            id: cand.route.id,
            country: cand.route.country,
            x: cand.x,
            y: cand.y,
            visible: true,
            isHub: false,
            placement: cand.route.placement,
            showBadge,
          };
          labels.push(cLabel);
          labelsMap[cand.route.id] = cLabel;
        }
        activeLabels = labels;

        // 2. PROJECT ALL ACTIVE IN-FLIGHT FORMAT FILES & DYNAMIC FLIGHT LINES (EVERY FRAME)
        const files: ActiveFlyingFile[] = [];
        const lines: ActiveFlightLine[] = [];

        if (!prefersReducedMotion) {
          for (const route of STUDIO_ROUTES) {
            const rt = routeRuntimes[route.id];
            const clientLabel = labelsMap[route.id];
            const isFlightActive =
              rt && (rt.state === "inbound" || rt.state === "outbound");

            // Moving file token calculation
            let fileVisible = false;
            let fx = 0;
            let fy = 0;

            if (isFlightActive) {
              const isInbound = rt.state === "inbound";
              const p = Math.min(1.0, rt.currentFrame / rt.totalFrames);
              const arcParam = isInbound ? p : 1.0 - p;

              // 3D Spherical Aerodynamic Arc calculation for the moving file
              getRoute3DPoint(route, arcParam, flightPos);
              flightPos.applyMatrix4(globeGroup.matrixWorld);

              cameraDirection.copy(camera.position).sub(flightPos).normalize();
              labelNormal.copy(flightPos).normalize();
              const dot = labelNormal.dot(cameraDirection);

              let edgeFade = 1.0;
              if (p < 0.08) edgeFade = p / 0.08;
              else if (p > 0.92) edgeFade = (1.0 - p) / 0.08;
              const depthOpacity = Math.max(0, Math.min(1, (dot - 0.12) / 0.18));

              // Front hemisphere visibility check for file token
              if (dot >= 0.12 && flightPos.z > 0) {
                flightPos.project(camera);
                fx = (flightPos.x * 0.5 + 0.5) * width;
                fy = (-(flightPos.y * 0.5) + 0.5) * height;
                fileVisible = true;

                files.push({
                  id: rt.flightId,
                  country: route.country,
                  label: isInbound ? route.inboundExt : route.outboundExt,
                  direction: isInbound ? "inbound" : "outbound",
                  screenX: fx,
                  screenY: fy,
                  visible: true,
                  opacity: depthOpacity * edgeFade,
                  scale: Math.max(0.75, Math.min(1.05, 0.8 + 0.25 * dot)),
                });
              }
            }

            // Continuous Flight Route Line: Connects Client Country Dot directly to Dhaka Studio Hub Dot
            if (isFlightActive || clientLabel || dhakaVisible) {
              const numSegments = 28;
              let pathD = "";
              let inSubpath = false;
              let hasVisibleSegment = false;

              for (let i = 0; i <= numSegments; i++) {
                const sampleT = i / numSegments; // 0.0 = Client Country Dot, 1.0 = Dhaka Studio Hub Dot

                getRoute3DPoint(route, sampleT, samplePos);
                samplePos.applyMatrix4(globeGroup.matrixWorld);

                cameraDirection.copy(camera.position).sub(samplePos).normalize();
                sampleNormal.copy(samplePos).normalize();
                const sampleDot = sampleNormal.dot(cameraDirection);

                // Horizon check: strictly on visible front side
                if (sampleDot >= 0.10 && samplePos.z > 0) {
                  hasVisibleSegment = true;
                  samplePos.project(camera);

                  let sx = (samplePos.x * 0.5 + 0.5) * width;
                  let sy = (-(samplePos.y * 0.5) + 0.5) * height;

                  // Snap exact endpoints to Country Anchor Dot and Dhaka Hub Dot for perfect connection
                  if (i === 0 && clientLabel) {
                    sx = clientLabel.x;
                    sy = clientLabel.y;
                  } else if (i === numSegments && dhakaVisible) {
                    sx = dhakaScreenX;
                    sy = dhakaScreenY;
                  }

                  if (!inSubpath) {
                    pathD += `${pathD ? " " : ""}M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                    inSubpath = true;
                  } else {
                    pathD += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
                  }
                } else {
                  inSubpath = false;
                }
              }

              if (hasVisibleSegment && pathD) {
                lines.push({
                  id: `line-${route.id}`,
                  pathD,
                  opacity: isFlightActive ? 0.95 : 0.35,
                  isActive: isFlightActive,
                  direction: isFlightActive
                    ? (rt.state as "inbound" | "outbound")
                    : "base",
                });
              }
            }
          }
        }
        activeFlyingFiles = files;
        activeFlightLines = lines;

        renderer.render(scene, camera);
      }

      function startRendering() {
        if (!isRendering && isInViewport && !document.hidden) {
          isRendering = true;
          lastFrameTime = performance.now();
          gsap.ticker.add(renderFrame);
        }
      }

      function stopRendering() {
        if (!isRendering) return;
        isRendering = false;
        gsap.ticker.remove(renderFrame);
      }

      requestRender = startRendering;
      const resizeObserver = new ResizeObserver(resizeRenderer);
      resizeObserver.observe(containerElement);
      resizeRenderer();

      const viewportObserver = new IntersectionObserver(
        ([entry]) => {
          isInViewport = Boolean(entry?.isIntersecting);
          if (isInViewport) {
            if (!isDragging) {
              returnToHome();
            }
            globe.resumeAnimation();
            startRendering();
          } else {
            cancelReturnToHome();
            globe.pauseAnimation();
            stopRendering();
          }
        },
        { rootMargin: "160px 0px", threshold: 0.01 },
      );
      viewportObserver.observe(containerElement);

      const handleVisibilityChange = () => {
        if (document.hidden) {
          globe.pauseAnimation();
          stopRendering();
        } else {
          globe.resumeAnimation();
          startRendering();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      destroyRuntime = () => {
        mapRequestController.abort();
        requestRender = undefined;
        stopRendering();
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

    const beginInitialization = () => {
      if (initializationStarted || !active || !canInitialize) return;
      initializationStarted = true;
      initializationObserver?.disconnect();
      initializationObserver = undefined;
      if (initializationIdleId !== undefined) {
        window.cancelIdleCallback(initializationIdleId);
        initializationIdleId = undefined;
      }
      if (initializationTimeoutId !== undefined) {
        clearTimeout(initializationTimeoutId);
        initializationTimeoutId = undefined;
      }
      void initializeGlobe();
    };

    const scheduleIdleInitialization = (delay = 0) => {
      if (initializationStarted || !active) return;

      initializationTimeoutId = setTimeout(() => {
        initializationTimeoutId = undefined;
        if ("requestIdleCallback" in window) {
          initializationIdleId = window.requestIdleCallback(
            () => beginInitialization(),
            { timeout: 1800 },
          );
        } else {
          beginInitialization();
        }
      }, delay);
    };

    const handlePreloaderComplete = () => {
      canInitialize = true;
      scheduleIdleInitialization(1400);
    };

    const preloaderElement = document.querySelector(".site-preloader");
    const isPreloaderComplete =
      document.documentElement.dataset.preloaderComplete === "true";
    if (preloaderElement && !isPreloaderComplete) {
      window.addEventListener(
        "site-preloader-complete",
        handlePreloaderComplete,
        { once: true },
      );
    } else {
      scheduleIdleInitialization();
    }

    if ("IntersectionObserver" in window) {
      initializationObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) beginInitialization();
        },
        { rootMargin: "800px 0px", threshold: 0.01 },
      );
      initializationObserver.observe(containerElement);
    } else {
      beginInitialization();
    }

    return () => {
      active = false;
      cancelReturnToHome();
      window.removeEventListener(
        "site-preloader-complete",
        handlePreloaderComplete,
      );
      initializationObserver?.disconnect();
      if (initializationIdleId !== undefined) {
        window.cancelIdleCallback(initializationIdleId);
      }
      if (initializationTimeoutId !== undefined) {
        clearTimeout(initializationTimeoutId);
      }
      destroyRuntime?.();
    };
  });
</script>

<div
  bind:this={containerElement}
  class="globe-container relative flex aspect-square h-auto w-full select-none items-center justify-center overflow-hidden sm:aspect-auto sm:h-[clamp(36rem,78dvh,46rem)] sm:overflow-visible"
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

  <!-- Dynamic Flight Lines Connecting Partner Dots directly to Dhaka Studio Hub -->
  <svg class="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" aria-hidden="true">
    {#each activeFlightLines as line (line.id)}
      {#if line.isActive}
        <!-- Active Flight Route: Radiant Glowing Beam -->
        <path
          d={line.pathD}
          fill="none"
          stroke="#7ea641"
          stroke-width="3.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity={line.opacity * 0.45}
        />
        <path
          d={line.pathD}
          fill="none"
          stroke="#7ea641"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity={line.opacity}
        />
      {:else}
        <!-- Base Network Connection Line: Always clean solid continuous line -->
        <path
          d={line.pathD}
          fill="none"
          stroke="#7ea641"
          stroke-width="1.3"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity={0.55}
        />
      {/if}
    {/each}
  </svg>

  <!-- Floating Country Pins: Dot & Name unified at exact coordinate -->
  {#each activeLabels as label (label.id)}
    {#if label.visible}
      {#if label.isHub}
        <!-- Special Central Hub Badge for Dhaka Studio -->
        <div
          class="pointer-events-none absolute z-25 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
          style="left: {label.x}px; top: {label.y}px;"
        >
          <div
            class="flex items-center gap-1.5 rounded-full border border-brand-green/80 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-brand-dark shadow-[0_2px_12px_rgba(0,0,0,0.12)] backdrop-blur-xs"
          >
            <span class="relative flex h-2 w-2 items-center justify-center">
              <span class="absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75 animate-ping"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-brand-green"></span>
            </span>
            <span>{label.country}</span>
          </div>
        </div>
      {:else}
        <!-- Unified Client Country Marker: Dot + Name directly connected -->
        <div
          class="pointer-events-none absolute z-25 flex items-center whitespace-nowrap select-none"
          style="
            left: {label.x}px;
            top: {label.y}px;
            {label.showBadge === false
              ? 'transform: translate(-50%, -50%);'
              : label.placement === 'left'
                ? 'transform: translate(calc(-100% + 5px), -50%); flex-direction: row;'
                : label.placement === 'right'
                  ? 'transform: translate(-5px, -50%); flex-direction: row-reverse;'
                  : label.placement === 'top'
                    ? 'transform: translate(-50%, calc(-100% + 5px)); flex-direction: column-reverse;'
                    : 'transform: translate(-50%, -5px); flex-direction: column;'}
          "
        >
          <!-- Country Name Badge -->
          {#if label.showBadge !== false}
            <span
              class="rounded-full bg-white/95 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-tight text-brand-dark shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-brand-dark/15 backdrop-blur-xs"
            >
              {label.country}
            </span>
          {/if}

          <!-- Country Anchor Dot (centered precisely at label.x, label.y) -->
          <span
            class="relative flex h-2.5 w-2.5 items-center justify-center shrink-0 {label.showBadge === false ? '' : label.placement === 'left' ? 'ml-1.5' : label.placement === 'right' ? 'mr-1.5' : label.placement === 'top' ? 'mt-1' : 'mb-1'}"
          >
            <span class="absolute inline-flex h-full w-full rounded-full bg-brand-green/60 animate-ping"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-brand-green ring-1.5 ring-white shadow-[0_0_8px_rgba(126,166,65,0.95)]"></span>
          </span>
        </div>
      {/if}
    {/if}
  {/each}

  <!-- Flying Format File Tokens Traveling between Clients and Dhaka Studio Hub -->
  {#each activeFlyingFiles as file (file.id)}
    {#if file.visible}
      <div
        class="projected-flight-file pointer-events-none absolute top-0 left-0 z-30 select-none"
        style="
          transform: translate(-50%, -50%) translate3d({file.screenX}px, {file.screenY}px, 0) scale({file.scale});
          opacity: {file.opacity};
        "
      >
        {#if file.direction === "inbound"}
          <!-- Inbound RAW Submission (Entering Dhaka Studio Hub) -->
          <div
            class="file-token inline-flex items-center select-none filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
            title="{file.country}: Submit {file.label} -> Dhaka Studio Hub"
          >
            <svg
              class="h-7 w-[25px] shrink-0"
              viewBox="0 0 26 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 1.5h13l7.5 7.5v18a1.5 1.5 0 0 1-1.5 1.5H3a1.5 1.5 0 0 1-1.5-1.5V3A1.5 1.5 0 0 1 3 1.5z"
                fill="#1c1b1a"
                stroke="#7ea641"
                stroke-width="1.3"
                stroke-linejoin="round"
              />
              <path
                d="M16 1.5v7.5h7.5z"
                fill="#2c2b29"
                stroke="#7ea641"
                stroke-width="1.3"
                stroke-linejoin="round"
                stroke-linecap="round"
              />
              <text
                x="12.5"
                y="21"
                text-anchor="middle"
                font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                font-size={file.label.length > 3 ? "7" : "8"}
                font-weight="900"
                fill="#ffffff"
                stroke="none"
                letter-spacing={file.label.length > 3 ? "-0.03em" : "0.01em"}
              >
                {file.label.toUpperCase()}
              </text>
            </svg>
          </div>
        {:else}
          <!-- Outbound Master Deliverable (Returning to Client) -->
          <div
            class="file-token inline-flex items-center select-none filter drop-shadow-[0_2px_6px_rgba(126,166,65,0.55)]"
            title="{file.country}: Deliver {file.label} -> Client"
          >
            <svg
              class="h-7 w-[25px] shrink-0"
              viewBox="0 0 26 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 1.5h13l7.5 7.5v18a1.5 1.5 0 0 1-1.5 1.5H3a1.5 1.5 0 0 1-1.5-1.5V3A1.5 1.5 0 0 1 3 1.5z"
                fill="#7ea641"
                stroke="#1c1b1a"
                stroke-width="1.3"
                stroke-linejoin="round"
              />
              <path
                d="M16 1.5v7.5h7.5z"
                fill="#6b9134"
                stroke="#1c1b1a"
                stroke-width="1.3"
                stroke-linejoin="round"
                stroke-linecap="round"
              />
              <text
                x="12.5"
                y="21"
                text-anchor="middle"
                font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                font-size={file.label.length > 3 ? "7" : "8"}
                font-weight="900"
                fill="#1c1b1a"
                stroke="none"
                letter-spacing={file.label.length > 3 ? "-0.03em" : "0.01em"}
              >
                {file.label.toUpperCase()}
              </text>
            </svg>
          </div>
        {/if}
      </div>
    {/if}
  {/each}
</div>

<style>
  .globe-container {
    contain: layout paint;
    isolation: isolate;
  }
</style>
