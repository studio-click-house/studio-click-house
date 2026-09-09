<script lang="ts">
  import { onMount } from "svelte";
  import createGlobe from "cobe";
  import type { ClientLocationMarker } from "$lib/types/content";

  interface Props {
    locations: ClientLocationMarker[];
  }

  let { locations }: Props = $props();

  let containerElement: HTMLDivElement;
  let stageElement: HTMLDivElement;
  let canvasElement: HTMLCanvasElement;

  // Optimized viewing perspective (Bangladesh Studio Hub facing front)
  const HOME_THETA = 0.22;
  const HOME_PHI = 0.0;

  // Brand Color Tokens
  const BRAND_GREEN_PRIMARY: [number, number, number] = [
    126 / 255,
    166 / 255,
    65 / 255,
  ]; // #7ea641 (Studio Brand Green)
  const BRAND_GREEN_BRIGHT: [number, number, number] = [
    155 / 255,
    215 / 255,
    72 / 255,
  ];
  const BRAND_LIGHT_RGB: [number, number, number] = [
    247 / 255,
    247 / 255,
    242 / 255,
  ]; // #f7f7f2 / #f8f8f6

  // Central production hub: Bangladesh (Dhaka)
  const DHAKA_POS: [number, number] = [23.685, 90.356];

  // Specific country routes connected directly to Bangladesh
  interface StudioRoute {
    id: string;
    country: string;
    pos: [number, number];
    inboundExt: string;  // RAW / Ingest format traveling INTO Bangladesh
    outboundExt: string; // Master deliverable format traveling OUT to client
    distance: number;    // Angular distance along sphere (radians)
    durationFrames: number; // Duration in frames calibrated to distance
    placement: "top" | "bottom" | "left" | "right"; // Direction of label relative to marker dot
    offsetX?: number;    // Fine-tune offset X in px
    offsetY?: number;    // Fine-tune offset Y in px
  }

  // Raw route data with smart directional placements so no country labels ever overlap
  const RAW_ROUTES: Array<Omit<StudioRoute, "distance" | "durationFrames">> = [
    {
      id: "united-kingdom",
      country: "United Kingdom",
      pos: [54.8, -3.4], // UK (NW Europe)
      inboundExt: "PSD",
      outboundExt: "PNG",
      placement: "left",
      offsetX: -6,
      offsetY: 0,
    },
    {
      id: "united-arab-emirates",
      country: "UAE",
      pos: [25.2048, 55.2708], // Dubai (Middle East)
      inboundExt: "RAW",
      outboundExt: "JPG",
      placement: "left",
      offsetX: -6,
      offsetY: 0,
    },
    {
      id: "germany",
      country: "Germany",
      pos: [52.52, 13.405], // Berlin (Central Europe)
      inboundExt: "RAW",
      outboundExt: "WebP",
      placement: "right",
      offsetX: 6,
      offsetY: 0,
    },
    {
      id: "norway",
      country: "Norway",
      pos: [60.47, 8.47], // Norway (Scandinavia)
      inboundExt: "NEF",
      outboundExt: "JPG",
      placement: "top",
      offsetX: 0,
      offsetY: -6,
    },
    {
      id: "sweden",
      country: "Sweden",
      pos: [60.13, 18.64], // Sweden (Scandinavia)
      inboundExt: "DNG",
      outboundExt: "PSD",
      placement: "top",
      offsetX: 0,
      offsetY: -6,
    },
    {
      id: "denmark",
      country: "Denmark",
      pos: [56.26, 9.5], // Denmark (Scandinavia)
      inboundExt: "CR2",
      outboundExt: "WebP",
      placement: "bottom",
      offsetX: 0,
      offsetY: 6,
    },
    {
      id: "france",
      country: "France",
      pos: [46.23, 2.21], // Paris / Central France
      inboundExt: "TIFF",
      outboundExt: "JPG",
      placement: "left",
      offsetX: -6,
      offsetY: 0,
    },
    {
      id: "spain",
      country: "Spain",
      pos: [40.46, -3.75], // Madrid (Iberian Peninsula)
      inboundExt: "ARW",
      outboundExt: "TIFF",
      placement: "left",
      offsetX: -6,
      offsetY: 0,
    },
    {
      id: "united-states",
      country: "United States",
      pos: [40.7128, -74.006], // New York (North America)
      inboundExt: "CR3",
      outboundExt: "PSD",
      placement: "left",
      offsetX: -6,
      offsetY: 0,
    },
    {
      id: "australia",
      country: "Australia",
      pos: [-33.8688, 151.2093], // Sydney (Oceania)
      inboundExt: "ARW",
      outboundExt: "WebP",
      placement: "right",
      offsetX: 6,
      offsetY: 0,
    },
  ];

  const ARC_HEIGHT = 0.13;
  const MARKER_ELEVATION = 0.015;

  // Single active file transfer per route
  interface RouteFileTransfer {
    id: string;
    country: string;
    label: string;
    direction: "inbound" | "outbound";
    screenX: number;
    screenY: number;
    depthZ: number;
    visible: boolean;
    scale: number;
    opacity: number;
  }

  // Active flight transfer in memory
  interface ActiveFlight {
    id: string;
    route: StudioRoute;
    direction: "inbound" | "outbound";
    progress: number; // 0.0 to 1.0
    currentFrame: number;
    totalFrames: number;
  }

  // Country Label Projection
  interface CountryPinLabel {
    id: string;
    country: string;
    isHub: boolean;
    screenX: number;
    screenY: number;
    depthZ: number;
    visible: boolean;
    opacity: number;
    placement: "top" | "bottom" | "left" | "right";
    offsetX: number;
    offsetY: number;
  }

  interface ActiveFlightLine {
    id: string;
    pathD: string;
    opacity: number;
    direction: "inbound" | "outbound";
  }

  let projectedCountryLabels = $state<CountryPinLabel[]>([]);
  let movingLineFiles = $state<RouteFileTransfer[]>([]);
  let activeFlightLines = $state<ActiveFlightLine[]>([]);

  // Smooth Interactive State
  let phi = $state(HOME_PHI);
  let theta = $state(HOME_THETA);
  let velocityPhi = 0;
  let velocityTheta = 0;
  let isDragging = false;
  let previousX = 0;
  let previousY = 0;

  // Globe instance
  let globeInstance: ReturnType<typeof createGlobe> | undefined;

  // -------------------------------------------------------------
  // EXACT COBE SHADER COORDINATE PROJECTIONS & BEZIER FORMULAS
  // -------------------------------------------------------------
  const PI = Math.PI;
  const cos = Math.cos;
  const sin = Math.sin;

  // Cobe's spherical-to-Cartesian function U([lat, lng])
  function toUnitVector([lat, lng]: [number, number]): [number, number, number] {
    const r = (lat * PI) / 180;
    const a = (lng * PI) / 180 - PI;
    const o = cos(r);
    return [-o * cos(a), sin(r), o * sin(a)];
  }

  // Calculate true spherical angular distance between any two locations
  function computeAngularDistance(
    pos1: [number, number],
    pos2: [number, number],
  ): number {
    const u1 = toUnitVector(pos1);
    const u2 = toUnitVector(pos2);
    const dot = u1[0] * u2[0] + u1[1] * u2[1] + u1[2] * u2[2];
    return Math.acos(Math.max(-1, Math.min(1, dot)));
  }

  // Calibrated constant travel speed: 180 frames per radian (~3.0s per radian at 60fps)
  // This guarantees every file travels at the exact same physical pixel speed on screen!
  const FRAMES_PER_RADIAN = 185;

  const STUDIO_ROUTES: StudioRoute[] = RAW_ROUTES.map((r) => {
    const dist = computeAngularDistance(r.pos, DHAKA_POS);
    return {
      ...r,
      distance: dist,
      durationFrames: Math.max(100, Math.round(dist * FRAMES_PER_RADIAN)),
    };
  });

  // Route runtime lifecycle state
  type RouteState = "idle" | "inbound" | "processing" | "outbound";

  interface RouteRuntime {
    state: RouteState;
    currentFrame: number;
    totalFrames: number;
    processingTimer: number;
    idleCooldown: number;
    flightId: string;
  }

  // Minimum gap (in frames) between any two inbound arrivals at Dhaka Hub.
  // 125 frames ≈ 2.1 seconds. This guarantees files enter Dhaka Hub strictly one by one.
  const MIN_ARRIVAL_GAP = 125;

  let globalFrame = 0;
  let nextAllowedHubArrivalFrame = 0;
  let dispatchQueueIndex = 0;

  // Initialize runtime state for each of the 6 studio routes
  // Stagger their initial states so the globe is immediately dynamic upon load:
  // - UK: Inbound (arrives at Dhaka Hub in ~1.5s)
  // - UAE: Inbound (arrives at Dhaka Hub in ~3.6s)
  // - Germany: Outbound deliverable returning to Berlin
  // - Australia, France, USA: Ready in queue with short cooldowns
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
      const ukRemaining = r.durationFrames - half;
      nextAllowedHubArrivalFrame = ukRemaining + MIN_ARRIVAL_GAP;
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
      const uaeRemaining = r.durationFrames - early;
      nextAllowedHubArrivalFrame = Math.max(
        nextAllowedHubArrivalFrame,
        uaeRemaining + MIN_ARRIVAL_GAP,
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
      // Others: idle with staggered cooldowns
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

  // Cobe's exact shader rotation formula
  function cobeRotate(
    [x, y, z]: [number, number, number],
    rotPhi: number,
    rotTheta: number,
  ): [number, number, number] {
    const c = cos(rotTheta);
    const d = sin(rotTheta);
    const e = cos(rotPhi);
    const f = sin(rotPhi);

    return [
      e * x + f * z,
      f * d * x + c * y - e * d * z,
      -f * c * x + d * y + e * c * z,
    ];
  }

  // Cobe's exact quadratic bezier arc curve evaluation
  function evaluateArcPoint(
    fromPos: [number, number],
    toPos: [number, number],
    p: number,
    arcHeight: number,
  ): [number, number, number] {
    const l = toUnitVector(fromPos);
    const m = toUnitVector(toPos);

    const baseR = 0.8 + MARKER_ELEVATION;
    const peakR = 0.8 + arcHeight + MARKER_ELEVATION;

    const fx = l[0] + m[0];
    const fy = l[1] + m[1];
    const fz = l[2] + m[2];
    const n = Math.hypot(fx, fy, fz);

    const Ex = n > 0.001 ? fx / n : 0;
    const Ey = n > 0.001 ? fy / n : 1;
    const Ez = n > 0.001 ? fz / n : 0;

    const dx = l[0] * baseR;
    const dy = l[1] * baseR;
    const dz = l[2] * baseR;

    const ex = m[0] * baseR;
    const ey = m[1] * baseR;
    const ez = m[2] * baseR;

    const ox = Ex * peakR;
    const oy = Ey * peakR;
    const oz = Ez * peakR;

    // Quadratic Bezier Formula: (1 - p)^2 * start + 2*(1 - p)*p * peak + p^2 * end
    const b = 1 - p;
    const px = b * b * dx + 2 * b * p * ox + p * p * ex;
    const py = b * b * dy + 2 * b * p * oy + p * p * ey;
    const pz = b * b * dz + 2 * b * p * oz + p * p * ez;

    return [px, py, pz];
  }

  // Smooth transatlantic waypoint for United States route
  // Perfectly routes south of the UK with natural, continuous curvature and no kink
  const US_TRANSATLANTIC_WAYPOINT: [number, number] = [41.0, 5.0];

  // Helper to evaluate 3D curve point for any route along its full arc (0.0 = Client Country, 1.0 = Dhaka Hub)
  function getRoute3DPoint(
    route: StudioRoute,
    arcParam: number,
  ): [number, number, number] {
    if (route.id === "united-states") {
      if (arcParam <= 0.46) {
        const subP = arcParam / 0.46;
        return evaluateArcPoint(route.pos, US_TRANSATLANTIC_WAYPOINT, subP, ARC_HEIGHT);
      } else {
        const subP = (arcParam - 0.46) / 0.54;
        return evaluateArcPoint(US_TRANSATLANTIC_WAYPOINT, DHAKA_POS, subP, ARC_HEIGHT);
      }
    } else {
      return evaluateArcPoint(route.pos, DHAKA_POS, arcParam, ARC_HEIGHT);
    }
  }

  // Build the lines connecting each client country with Bangladesh
  function buildDirectHubArcs() {
    const arcs: Array<{ from: [number, number]; to: [number, number]; color: [number, number, number] }> = [];
    for (const route of STUDIO_ROUTES) {
      if (route.id === "united-states") {
        arcs.push({
          from: route.pos,
          to: US_TRANSATLANTIC_WAYPOINT,
          color: BRAND_GREEN_PRIMARY,
        });
        arcs.push({
          from: US_TRANSATLANTIC_WAYPOINT,
          to: DHAKA_POS,
          color: BRAND_GREEN_PRIMARY,
        });
      } else {
        arcs.push({
          from: route.pos,
          to: DHAKA_POS,
          color: BRAND_GREEN_PRIMARY,
        });
      }
    }
    return arcs;
  }

  // Smooth, intuitive pointer drag interaction (up is up, down is down)
  function handlePointerDown(e: PointerEvent) {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
    velocityPhi = 0;
    velocityTheta = 0;
    canvasElement?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    const deltaX = e.clientX - previousX;
    const deltaY = e.clientY - previousY;
    previousX = e.clientX;
    previousY = e.clientY;

    const SENSITIVITY = 0.0035;
    // deltaX > 0 (dragging right) -> rotates globe to the right
    // deltaY > 0 (dragging down) -> tilts globe down towards south
    // deltaY < 0 (dragging up) -> tilts globe up towards north
    const movePhi = deltaX * SENSITIVITY;
    const moveTheta = deltaY * SENSITIVITY;

    phi += movePhi;
    theta = Math.max(-0.25, Math.min(0.55, theta + moveTheta));

    // Smooth inertia tracking
    velocityPhi = velocityPhi * 0.35 + movePhi * 0.65;
    velocityTheta = velocityTheta * 0.35 + moveTheta * 0.65;
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging) return;
    isDragging = false;
    try {
      canvasElement?.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  }

  onMount(() => {
    let active = true;
    let animationFrameId: number | undefined;
    let isInViewport = false;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Build markers: Dhaka Hub is emphasized, client partners are crisp, tiny dots
    const markers = [
      {
        location: DHAKA_POS,
        size: 0.024,
        id: "bangladesh-hub",
        color: BRAND_GREEN_BRIGHT,
      },
      ...STUDIO_ROUTES.map((route) => ({
        location: route.pos,
        size: 0.015,
        id: route.id,
        color: BRAND_GREEN_PRIMARY,
      })),
    ];

    const arcs = buildDirectHubArcs();

    function initGlobe() {
      if (!containerElement || !canvasElement) return;

      const rect = containerElement.getBoundingClientRect();
      const diameter = Math.max(
        300,
        Math.floor(Math.min(rect.width, rect.height || 620)),
      );
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      globeInstance = createGlobe(canvasElement, {
        devicePixelRatio: dpr,
        width: diameter * dpr,
        height: diameter * dpr,
        phi,
        theta,
        dark: 0, // Light mode: white globe surface with dark charcoal dots
        diffuse: 1.12,
        mapSamples: 15000,
        mapBrightness: 3.2,
        mapBaseBrightness: 0.0,
        baseColor: BRAND_LIGHT_RGB, // Matches page background (#f7f7f2 / #f8f8f6)
        markerColor: BRAND_GREEN_PRIMARY,
        glowColor: BRAND_LIGHT_RGB, // Seamless zero-halo atmosphere
        markers,
        arcs: prefersReducedMotion ? arcs : [],
        arcColor: BRAND_GREEN_PRIMARY,
        arcWidth: 0.6,
        arcHeight: ARC_HEIGHT,
        markerElevation: MARKER_ELEVATION,
        opacity: 0.98,
      });

      startLoop();
    }

    // Mathematical update: projecting country pins and files strictly along their lines
    function updateScenePositions(stageWidth: number, stageHeight: number) {
      const cx = stageWidth / 2;
      const cy = stageHeight / 2;
      const halfSize = stageWidth / 2;
      const baseR = 0.8 + MARKER_ELEVATION;

      // 1. PROJECT COUNTRY PIN LABELS WITH EXACT COBE FORMULA
      const labels: CountryPinLabel[] = [];

      // Central Dhaka Hub
      const bdUnit = toUnitVector(DHAKA_POS);
      const [bdX, bdY, bdZ] = cobeRotate(
        [bdUnit[0] * baseR, bdUnit[1] * baseR, bdUnit[2] * baseR],
        phi,
        theta,
      );
      const bdVisible = bdZ > 0.08;
      labels.push({
        id: "bangladesh",
        country: "Dhaka Studio Hub",
        isHub: true,
        screenX: cx + bdX * halfSize,
        screenY: cy - bdY * halfSize,
        depthZ: bdZ,
        visible: bdVisible,
        opacity: Math.max(0, Math.min(1, (bdZ - 0.08) / 0.2)),
        placement: "top",
        offsetX: 0,
        offsetY: -6,
      });

      // Client Country Pins
      for (const route of STUDIO_ROUTES) {
        const u = toUnitVector(route.pos);
        const [rx, ry, rz] = cobeRotate(
          [u[0] * baseR, u[1] * baseR, u[2] * baseR],
          phi,
          theta,
        );
        const isVisible = rz > 0.1;
        labels.push({
          id: route.id,
          country: route.country,
          isHub: false,
          screenX: cx + rx * halfSize,
          screenY: cy - ry * halfSize,
          depthZ: rz,
          visible: isVisible,
          opacity: Math.max(0, Math.min(1, (rz - 0.1) / 0.2)),
          placement: route.placement,
          offsetX: route.offsetX ?? 0,
          offsetY: route.offsetY ?? 0,
        });
      }

      projectedCountryLabels = labels;

      // 2. CHOREOGRAPHED MULTI-COUNTRY WORKFLOW
      // - Multiple countries send work simultaneously
      // - Hub receives files strictly ONE BY ONE (minimum 125 frames / ~2.1s gap between arrivals)
      // - Studio finishes work and delivers back organically (decoupled, not robotic ping-pong)
      // - Strict rule: NO country ever has more than 1 file on its line at any time
      if (!prefersReducedMotion) {
        globalFrame++;

        // Advance each route's state
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

        // Staggered Inbound Dispatcher:
        // Try candidate routes in round-robin queue.
        // Dispatches when an idle country is ready AND its arrival will maintain >= MIN_ARRIVAL_GAP.
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

      // 3. PROJECT ALL ACTIVE IN-FLIGHT FILES & DYNAMIC FLIGHT LINES (CREATED ON MOVEMENT)
      const filesToProject: RouteFileTransfer[] = [];
      const linesToProject: ActiveFlightLine[] = [];

      for (const route of STUDIO_ROUTES) {
        const rt = routeRuntimes[route.id];

        if (rt.state === "inbound" || rt.state === "outbound") {
          const isInbound = rt.state === "inbound";
          const p = Math.min(1.0, rt.currentFrame / rt.totalFrames);

          // Inbound: route.pos (p=0) -> Dhaka (p=1)
          // Outbound: Dhaka (p=0) -> route.pos (p=1) (arcParam: 1 - p along exact same arc line)
          const arcParam = isInbound ? p : 1.0 - p;

          const pt = getRoute3DPoint(route, arcParam);
          const [rx, ry, rz] = cobeRotate(pt, phi, theta);

          // Smooth edge fading near departure and destination
          let edgeFade = 1;
          if (p < 0.08) {
            edgeFade = p / 0.08;
          } else if (p > 0.92) {
            edgeFade = (1.0 - p) / 0.08;
          }

          const isFront = rz > 0.08;
          const depthOpacity = Math.max(0, Math.min(1, (rz - 0.08) / 0.2));
          const finalOpacity = depthOpacity * edgeFade;

          const scale = Math.max(0.75, Math.min(1.05, 0.8 + 0.25 * rz));

          filesToProject.push({
            id: rt.flightId,
            country: route.country,
            label: isInbound ? `.${route.inboundExt}` : `.${route.outboundExt}`,
            direction: isInbound ? "inbound" : "outbound",
            screenX: cx + rx * halfSize,
            screenY: cy - ry * halfSize,
            depthZ: rz,
            visible: isFront && finalOpacity > 0.04,
            scale,
            opacity: finalOpacity,
          });

          // Generate dynamic growing flight line that traces behind the moving file
          // Inbound: starts at client country (arcT = 0) and extends to the file (arcT = p)
          // Outbound: starts at Dhaka Hub (arcT = 1) and extends to the file (arcT = 1 - p)
          if (p > 0.02) {
            const startT = isInbound ? 0.0 : 1.0;
            const endT = isInbound ? p : 1.0 - p;
            const numSegments = Math.max(8, Math.min(26, Math.round(p * 26)));

            let pathD = "";
            let inSubpath = false;
            let hasVisibleSegment = false;

            for (let i = 0; i <= numSegments; i++) {
              const step = i / numSegments;
              const sampleT = startT + (endT - startT) * step;
              const samplePt = getRoute3DPoint(route, sampleT);
              const [srx, sry, srz] = cobeRotate(samplePt, phi, theta);

              // Clip segments that dip behind the horizon of the globe
              if (srz >= -0.04) {
                hasVisibleSegment = true;
                const sx = cx + srx * halfSize;
                const sy = cy - sry * halfSize;
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
              linesToProject.push({
                id: `line-${rt.flightId}`,
                pathD,
                opacity: Math.max(0, Math.min(0.95, depthOpacity * edgeFade * 0.95)),
                direction: isInbound ? "inbound" : "outbound",
              });
            }
          }
        }
      }

      movingLineFiles = filesToProject;
      activeFlightLines = linesToProject;
    }

    function renderStep() {
      if (!active || !globeInstance) return;

      if (!isDragging) {
        if (!prefersReducedMotion) {
          // Gentle idle rotation
          phi += 0.0012;
        }

        // Apply smooth rotational inertia damping
        if (Math.abs(velocityPhi) > 0.00005) {
          phi += velocityPhi;
          velocityPhi *= 0.92;
        }
        if (Math.abs(velocityTheta) > 0.00005) {
          theta = Math.max(-0.25, Math.min(0.55, theta + velocityTheta));
          velocityTheta *= 0.92;
        }
      }

      globeInstance.update({ phi, theta });

      if (stageElement) {
        updateScenePositions(
          stageElement.clientWidth,
          stageElement.clientHeight,
        );
      }

      if (isInViewport && !document.hidden) {
        animationFrameId = requestAnimationFrame(renderStep);
      }
    }

    function startLoop() {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      }
      if (isInViewport && !document.hidden && active) {
        animationFrameId = requestAnimationFrame(renderStep);
      }
    }

    function stopLoop() {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      }
    }

    // Resize observer
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry || !globeInstance) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!active || !globeInstance || !containerElement) return;
        const rect = containerElement.getBoundingClientRect();
        const diameter = Math.max(
          300,
          Math.floor(Math.min(rect.width, rect.height || 620)),
        );
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        globeInstance.update({
          width: diameter * dpr,
          height: diameter * dpr,
        });
      }, 100);
    });

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = Boolean(entry?.isIntersecting);
        if (isInViewport) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: "100px 0px", threshold: 0.05 },
    );

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (isInViewport) {
        startLoop();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    initGlobe();
    if (containerElement) {
      resizeObserver.observe(containerElement);
      intersectionObserver.observe(containerElement);
    }

    return () => {
      active = false;
      stopLoop();
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (globeInstance) {
        globeInstance.destroy();
      }
    };
  });
</script>

<div
  bind:this={containerElement}
  class="cobe-globe-container relative flex h-[38rem] w-full select-none items-center justify-center overflow-hidden sm:h-[clamp(38rem,80dvh,48rem)]"
  role="region"
  aria-label="Interactive 3D Graphic File Transfer Globe"
>
  <!-- Dedicated Stage: Strictly square, matching canvas dimensions exactly -->
  <div
    bind:this={stageElement}
    class="globe-stage relative aspect-square h-full max-h-full w-auto max-w-full flex items-center justify-center"
  >
    <!-- 3D WebGL Canvas -->
    <canvas
      bind:this={canvasElement}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerUp}
      class="globe-canvas h-full w-full cursor-grab touch-none object-contain active:cursor-grabbing"
    ></canvas>

    <!-- ========================================================================= -->
    <!-- 1. FLOATING COUNTRY PIN LABELS (CENTERED DIRECTLY ABOVE MARKER DOTS)      -->
    <!-- ========================================================================= -->
    <div class="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      <!-- ========================================================================= -->
      <!-- DYNAMIC FLIGHT LINES (CREATED PROGRESSIVELY AS FILES TRAVEL)              -->
      <!-- ========================================================================= -->
      <svg class="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {#each activeFlightLines as line (line.id)}
          <!-- Soft glowing backdrop stroke -->
          <path
            d={line.pathD}
            fill="none"
            stroke="#7ea641"
            stroke-width="3.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity={line.opacity * 0.35}
          />
          <!-- Core high-definition flight line -->
          <path
            d={line.pathD}
            fill="none"
            stroke="#7ea641"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity={line.opacity}
          />
        {/each}
      </svg>

      {#each projectedCountryLabels as label (label.id)}
        {#if label.visible}
          <div
            class="projected-country-badge absolute top-0 left-0"
            style="
              transform: translate3d({label.screenX}px, {label.screenY}px, 0);
              opacity: {label.opacity};
            "
          >
            <!-- Concentric marker ring (matching previous globe design) -->
            <div
              class="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full {label.isHub
                ? 'h-4.5 w-4.5 border-[1.5px] border-brand-green bg-brand-green/20 ring-1 ring-brand-green/30'
                : 'h-3 w-3 border border-brand-green/85 bg-brand-green/10 shadow-[0_0_4px_rgba(126,166,65,0.35)]'}"
            ></div>

            {#if label.isHub}
              <!-- Central Bangladesh Production Studio Hub -->
              <div
                class="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap"
                style="bottom: 14px; left: 0;"
              >
                <div
                  class="flex items-center gap-1.5 font-sans font-bold text-xs text-brand-dark tracking-tight"
                  style="text-shadow: 0 1px 3px #ffffff, 0 0 8px #ffffff, 0 0 14px #ffffff;"
                >
                  <span class="relative flex h-2 w-2">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75"></span>
                    <span class="relative inline-flex h-2 w-2 rounded-full bg-brand-green"></span>
                  </span>
                  <span>{label.country}</span>
                </div>
              </div>
            {:else}
              <!-- Clean Client Partner Country Name positioned smartly: top, bottom, left, right -->
              <div
                class="pointer-events-none absolute whitespace-nowrap"
                style="
                  {label.placement === 'top'
                    ? `bottom: 13px; left: 50%; transform: translate(calc(-50% + ${label.offsetX}px), ${label.offsetY}px);`
                    : label.placement === 'bottom'
                      ? `top: 13px; left: 50%; transform: translate(calc(-50% + ${label.offsetX}px), ${label.offsetY}px);`
                      : label.placement === 'left'
                        ? `top: 50%; right: 13px; transform: translate(${label.offsetX}px, calc(-50% + ${label.offsetY}px));`
                        : `top: 50%; left: 13px; transform: translate(${label.offsetX}px, calc(-50% + ${label.offsetY}px));`}
                "
              >
                <span
                  class="font-sans font-semibold text-[11px] sm:text-xs text-brand-dark tracking-tight"
                  style="text-shadow: 0 1px 3px #ffffff, 0 0 8px #ffffff, 0 0 14px #ffffff;"
                >
                  {label.country}
                </span>
              </div>
            {/if}
          </div>
        {/if}
      {/each}

      <!-- ========================================================================= -->
      <!-- 2. MOVING GRAPHIC FILES (CHOREOGRAPHED ONE-BY-ONE ARRIVALS)               -->
      <!-- ========================================================================= -->
      {#each movingLineFiles as file (file.id)}
        {#if file.visible}
          <div
            class="projected-line-file absolute top-0 left-0"
            style="
              transform: translate(-50%, -50%) translate3d({file.screenX}px, {file.screenY}px, 0) scale({file.scale});
              opacity: {file.opacity};
            "
          >
            {#if file.direction === "inbound"}
              <!-- Inbound RAW Submission (Entering Dhaka Studio Hub) -->
              <div
                class="file-token-unified inline-flex items-center select-none pointer-events-none filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                title="{file.country}: Submit {file.label} -> Dhaka Studio Hub"
              >
                <!-- Document File Icon with crisp, perfectly legible format text -->
                <svg
                  class="h-7 w-[25px] shrink-0"
                  viewBox="0 0 26 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Document page outline -->
                  <path
                    d="M3 1.5h13l7.5 7.5v18a1.5 1.5 0 0 1-1.5 1.5H3a1.5 1.5 0 0 1-1.5-1.5V3A1.5 1.5 0 0 1 3 1.5z"
                    fill="#1c1b1a"
                    stroke="#7ea641"
                    stroke-width="1.3"
                    stroke-linejoin="round"
                  />
                  <!-- Folded corner flap -->
                  <path
                    d="M16 1.5v7.5h7.5z"
                    fill="#2c2b29"
                    stroke="#7ea641"
                    stroke-width="1.3"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                  <!-- Format name: bold, razor-sharp, zero stroke -->
                  <text
                    x="12.5"
                    y="21"
                    text-anchor="middle"
                    font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    font-size={file.label.replace('.', '').length > 3 ? "7" : "8"}
                    font-weight="900"
                    fill="#ffffff"
                    stroke="none"
                    letter-spacing={file.label.replace('.', '').length > 3 ? "-0.03em" : "0.01em"}
                  >
                    {file.label.replace('.', '').toUpperCase()}
                  </text>
                </svg>
              </div>
            {:else}
              <!-- Outbound Finished Deliverable (Returning to Client) -->
              <div
                class="file-token-unified inline-flex items-center select-none pointer-events-none filter drop-shadow-[0_2px_6px_rgba(126,166,65,0.45)]"
                title="{file.country}: Done {file.label} -> Client Deliverable"
              >
                <!-- Document File Icon with crisp, perfectly legible format text -->
                <svg
                  class="h-7 w-[25px] shrink-0"
                  viewBox="0 0 26 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Document page outline -->
                  <path
                    d="M3 1.5h13l7.5 7.5v18a1.5 1.5 0 0 1-1.5 1.5H3a1.5 1.5 0 0 1-1.5-1.5V3A1.5 1.5 0 0 1 3 1.5z"
                    fill="#7ea641"
                    stroke="#1c1b1a"
                    stroke-width="1.3"
                    stroke-linejoin="round"
                  />
                  <!-- Folded corner flap -->
                  <path
                    d="M16 1.5v7.5h7.5z"
                    fill="#6b9134"
                    stroke="#1c1b1a"
                    stroke-width="1.3"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                  <!-- Format name: bold, razor-sharp, zero stroke -->
                  <text
                    x="12.5"
                    y="21"
                    text-anchor="middle"
                    font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    font-size={file.label.replace('.', '').length > 3 ? "7" : "8"}
                    font-weight="900"
                    fill="#1c1b1a"
                    stroke="none"
                    letter-spacing={file.label.replace('.', '').length > 3 ? "-0.03em" : "0.01em"}
                  >
                    {file.label.replace('.', '').toUpperCase()}
                  </text>
                </svg>
              </div>
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  .cobe-globe-container {
    contain: layout style;
  }

  .globe-canvas {
    contain: paint;
    filter: drop-shadow(0 20px 45px rgba(32, 33, 31, 0.07));
  }

  .projected-country-badge {
    will-change: transform, opacity;
    pointer-events: none;
    transition: opacity 0.15s ease-out;
  }

  .projected-line-file {
    will-change: transform, opacity;
    pointer-events: none;
  }

  .file-token-unified {
    user-select: none;
    white-space: nowrap;
  }
</style>

