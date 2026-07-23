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
    labelX: number;
    labelY: number;
    labelSide: "left" | "right";
  }

  type GeoPosition = [number, number];
  type GeoPolygon = GeoPosition[][];

  interface WorldMapData {
    features: Array<{
      properties: {
        NAME?: string;
        NAME_EN?: string;
        ADMIN?: string;
      };
      geometry:
        | { type: "Polygon"; coordinates: GeoPolygon }
        | { type: "MultiPolygon"; coordinates: GeoPolygon[] };
    }>;
  }

  const GLOBE_RADIUS = 2.05;
  const INITIAL_ROTATION_X = 0.12;
  const INITIAL_ROTATION_Y = -1.92;

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
    const focusedRotationY =
      -((location.position.lng + 180) * (Math.PI / 180)) + Math.PI / 2;
    targetRotationY =
      focusedRotationY +
      Math.round(
        (targetRotationY - focusedRotationY) / (Math.PI * 2),
      ) *
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
    onSelectLocation?.(null);

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
    targetRotationX += velocityX;
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
    const countryOutlineGroups = new Map<string, THREE.Group>();
    const cameraDirection = new THREE.Vector3();
    const worldPosition = new THREE.Vector3();
    const surfaceDirection = new THREE.Vector3();
    const projectedPosition = new THREE.Vector3();
    const mapRequestController = new AbortController();
    const loadedTextures: THREE.Texture[] = [];
    let cloudMesh: THREE.Mesh | undefined;
    let isMounted = true;
    let width = 600;
    let height = 540;
    let animationFrameId: number | undefined;
    let isInViewport = false;
    let lastFrameTime = 0;
    let activeCountryOutlineId: string | null = null;

    const sunPos = new THREE.Vector3(-3.5, 4.5, 3.0).normalize();
    camera.position.z = 5.55;
    cameraDirection.copy(camera.position).normalize();
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    globeGroup = new THREE.Group();
    globeGroup.rotation.set(currentRotationX, currentRotationY, 0);
    scene.add(globeGroup);

    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x07110f,
    });
    geometries.push(globeGeometry);
    materials.push(globeMaterial);
    const globeMesh = new THREE.Mesh<THREE.SphereGeometry, THREE.Material>(
      globeGeometry,
      globeMaterial,
    );
    globeGroup.add(globeMesh);

    const countryBorderMaterial = new THREE.LineBasicMaterial({
      color: 0x9aca54,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const countrySnakeMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xb7e36f) },
      },
      vertexShader: `
        attribute float aProgress;
        varying float vProgress;

        void main() {
          vProgress = aProgress;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying float vProgress;

        void main() {
          float trailDistance = fract(
            uTime * 0.28 - vProgress * 3.0 + 1.0
          );
          float trail = smoothstep(0.28, 0.0, trailDistance);
          float headGlow = smoothstep(0.055, 0.0, trailDistance);
          float alpha = 0.16 + trail * 0.76 + headGlow * 0.38;

          gl_FragColor = vec4(uColor * (1.12 + headGlow * 0.9), alpha);
        }
      `,
      toneMapped: false,
    });
    materials.push(countryBorderMaterial, countrySnakeMaterial);

    function normalizeCountryName(value: string) {
      return value.toLowerCase().replace(/[^a-z]/g, "");
    }

    function getCountryNames(feature: WorldMapData["features"][number]) {
      return [
        feature.properties.NAME_EN,
        feature.properties.ADMIN,
        feature.properties.NAME,
      ]
        .filter((name): name is string => Boolean(name))
        .map(normalizeCountryName);
    }

    function createCountryOutline(ring: GeoPosition[]) {
      if (ring.length < 3) return null;

      const closedRing = [...ring];
      const first = closedRing[0];
      const last = closedRing[closedRing.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        closedRing.push(first);
      }

      const points = closedRing.map(([lng, lat]) =>
        latLngToVector3(lat, lng, GLOBE_RADIUS + 0.06),
      );
      const distances = [0];
      let totalDistance = 0;

      for (let index = 1; index < points.length; index += 1) {
        totalDistance += points[index].distanceTo(points[index - 1]);
        distances.push(totalDistance);
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.setAttribute(
        "aProgress",
        new THREE.Float32BufferAttribute(
          distances.map((distance) =>
            totalDistance > 0 ? distance / totalDistance : 0,
          ),
          1,
        ),
      );
      geometries.push(geometry);

      const outlineGroup = new THREE.Group();
      const borderLine = new THREE.Line(geometry, countryBorderMaterial);
      const snakeLine = new THREE.Line(geometry, countrySnakeMaterial);
      borderLine.renderOrder = 3;
      snakeLine.renderOrder = 4;
      outlineGroup.add(borderLine, snakeLine);
      return outlineGroup;
    }

    function setActiveCountryOutline(locationId: string | null) {
      if (activeCountryOutlineId === locationId) return;
      activeCountryOutlineId = locationId;

      for (const [countryId, outlineGroup] of countryOutlineGroups) {
        outlineGroup.visible = countryId === locationId;
      }
    }

    async function loadPhotorealisticEarth() {
      const textureLoader = new THREE.TextureLoader();
      const [
        dayTexture,
        lightsTexture,
        normalTexture,
        specularTexture,
        cloudTexture,
      ] = await Promise.all([
        textureLoader.loadAsync("/images/textures/earth-blue-marble-2048.jpg"),
        textureLoader.loadAsync("/images/textures/earth-lights-2048.png"),
        textureLoader.loadAsync("/images/textures/earth-normal-2048.jpg"),
        textureLoader.loadAsync("/images/textures/earth-specular-2048.jpg"),
        textureLoader.loadAsync("/images/textures/earth-clouds-1024.png"),
      ]);

      loadedTextures.push(
        dayTexture,
        lightsTexture,
        normalTexture,
        specularTexture,
        cloudTexture,
      );
      if (!isMounted) {
        for (const texture of loadedTextures) texture.dispose();
        loadedTextures.length = 0;
        return;
      }

      dayTexture.colorSpace = THREE.SRGBColorSpace;
      lightsTexture.colorSpace = THREE.SRGBColorSpace;
      cloudTexture.colorSpace = THREE.SRGBColorSpace;

      for (const texture of loadedTextures) {
        texture.anisotropy = Math.min(
          renderer.capabilities.getMaxAnisotropy(),
          4,
        );
      }

      const surfaceMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uDayTexture: { value: dayTexture },
          uNightTexture: { value: lightsTexture },
          uNormalTexture: { value: normalTexture },
          uSpecularTexture: { value: specularTexture },
          uSunDirection: {
            value: sunPos,
          },
          uCityLightColor: { value: new THREE.Color(0xffbd68) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          varying vec3 vWorldPosition;

          void main() {
            vUv = uv;
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D uDayTexture;
          uniform sampler2D uNightTexture;
          uniform sampler2D uNormalTexture;
          uniform sampler2D uSpecularTexture;
          uniform vec3 uSunDirection;
          uniform vec3 uCityLightColor;
          varying vec2 vUv;
          varying vec3 vWorldNormal;
          varying vec3 vWorldPosition;

          void main() {
            vec3 normal = normalize(vWorldNormal);
            vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
            vec3 sunDirection = normalize(uSunDirection);
            
            // Calculate day/night intensity
            float sunAmount = dot(normal, sunDirection);
            // Smooth transition at the terminator
            float daySide = smoothstep(-0.15, 0.25, sunAmount);
            float nightSide = 1.0 - smoothstep(-0.15, 0.25, sunAmount);

            // Sample textures
            vec3 daySample = texture2D(uDayTexture, vUv).rgb;
            vec3 nightSample = texture2D(uNightTexture, vUv).rgb;
            vec3 normalSample = texture2D(uNormalTexture, vUv).rgb;
            float specularSample = texture2D(uSpecularTexture, vUv).r;

            // Compute ocean mask from specular map
            float oceanMask = smoothstep(0.25, 0.75, specularSample);

            // Day side rendering: Color grading for "greeny cinematic vibe"
            float dayLuminance = dot(daySample, vec3(0.2126, 0.7152, 0.0722));
            float snowMask = smoothstep(0.58, 0.82, dayLuminance);
            oceanMask *= 1.0 - snowMask;

            // Retain more of the satellite colors (85% mix)
            vec3 softenedSample = mix(vec3(dayLuminance), daySample, 0.85);
            
            // Land grading: warm, organic olive/sand tint, boosted in brightness
            vec3 gradedLand = softenedSample * vec3(1.15, 1.08, 0.94);
            
            // Ocean grading: deep teal-navy, but boosted in brightness so it is not too dark
            float oceanDetail = smoothstep(0.015, 0.48, pow(max(dayLuminance, 0.0), 0.82));
            vec3 gradedOcean = mix(
              vec3(0.015, 0.055, 0.075), // brighter deep teal
              vec3(0.05, 0.13, 0.165),   // brighter blue-teal
              oceanDetail
            );

            // Combine land and ocean
            vec3 dayColor = mix(gradedLand, gradedOcean, oceanMask);
            
            // Add polar ice/snow back on top, boosted
            vec3 cloudAndIce = vec3(pow(max(dayLuminance, 0.001), 0.86) * 1.15);
            dayColor = mix(dayColor, cloudAndIce, snowMask * 0.85);

            // Apply diffuse shading with a boosted ambient term (0.12) to make the daytime side brighter
            float diffuse = max(sunAmount, 0.0);
            vec3 litDay = dayColor * (diffuse * 0.88 + 0.12);

            // Night side rendering: City lights that pop
            // We use a pow function to keep dimmer lights visible and scale them up
            float nightLuminance = nightSample.r; // Red channel contains the lights
            float cityLights = pow(nightLuminance, 1.2) * nightSide;
            vec3 nightColor = uCityLightColor * cityLights * 4.5; // boosted to 4.5 to make them shine

            // Specular reflections on oceans (subtle glare, not too wide)
            vec3 halfDirection = normalize(sunDirection + viewDirection);
            float specularPower = pow(max(dot(normal, halfDirection), 0.0), 45.0);
            float oceanSpecular = specularPower * oceanMask * daySide * 0.28; // reduced to prevent large white glare
            vec3 specularColor = vec3(0.5, 0.82, 0.9) * oceanSpecular;

            // Combine day and night
            vec3 finalColor = mix(nightColor, litDay, daySide) + specularColor;

            // Add subtle atmospheric rim glow on the surface itself
            float rimFresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 4.0);
            vec3 rimGlowColor = vec3(0.3, 0.65, 0.55); // greenish-cyan rim
            finalColor += rimGlowColor * rimFresnel * daySide * 0.35;

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
      });
      materials.push(surfaceMaterial);
      globeMesh.material = surfaceMaterial;

      const cloudGeometry = new THREE.SphereGeometry(
        GLOBE_RADIUS + 0.026,
        48,
        48,
      );
      const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        alphaMap: cloudTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
      geometries.push(cloudGeometry);
      materials.push(cloudMaterial);
      cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloudMesh.renderOrder = 2;
      globeGroup.add(cloudMesh);
      requestRender?.();
    }

    async function loadCountryOutlines() {
      const response = await fetch("/data/ne_110m_admin_0_countries.geojson", {
        signal: mapRequestController.signal,
      });
      if (!response.ok) return;

      const worldMap = (await response.json()) as WorldMapData;
      if (!isMounted) return;

      for (const location of locations) {
        const expectedNames =
          location.id === "united-states"
            ? [
                normalizeCountryName(location.country),
                normalizeCountryName("United States of America"),
              ]
            : [normalizeCountryName(location.country)];
        const countryFeature = worldMap.features.find((feature) =>
          getCountryNames(feature).some((name) => expectedNames.includes(name)),
        );
        if (!countryFeature) continue;

        const polygons =
          countryFeature.geometry.type === "Polygon"
            ? [countryFeature.geometry.coordinates]
            : countryFeature.geometry.coordinates;
        const countryGroup = new THREE.Group();

        for (const polygon of polygons) {
          const outerRing = polygon[0];
          if (!outerRing) continue;
          const outline = createCountryOutline(outerRing);
          if (outline) countryGroup.add(outline);
        }

        countryGroup.visible = false;
        countryOutlineGroups.set(location.id, countryGroup);
        globeGroup.add(countryGroup);
      }

      requestRender?.();
    }

    void loadPhotorealisticEarth().catch(() => undefined);
    void loadCountryOutlines().catch(() => undefined);

    const auraGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.12, 32, 32);
    const auraMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
      uniforms: {
        glowColor: { value: new THREE.Color(0x7ea641) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        uniform vec3 glowColor;
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          
          // For BackSide, normal points outwards.
          // dot(normal, viewDir) will be 1.0 at the center of the back side and 0.0 at the outer edge.
          float dotProduct = max(dot(normal, viewDir), 0.0);
          
          // Fade from 1.0 at the Earth's surface (where dotProduct is approx 0.45) to 0.0 at the outer edge (where dotProduct is 0.0)
          float intensity = pow(min(dotProduct * 2.2, 1.0), 3.0);
          
          // Beautiful gradient from brand green to soft cyan
          vec3 greenGlow = vec3(0.494, 0.651, 0.255); // brand green #7ea641
          vec3 cyanGlow = vec3(0.388, 0.678, 0.690); // brand light cyan #63adb0
          vec3 atmosphereColor = mix(greenGlow, cyanGlow, 1.0 - intensity);

          gl_FragColor = vec4(atmosphereColor, intensity * 0.65);
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

    scene.add(new THREE.AmbientLight(0x17221f, 0.34));
    const keyLight = new THREE.DirectionalLight(0xfff5df, 3.25);
    keyLight.position.copy(sunPos).multiplyScalar(5.5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x5b7774, 0.32);
    fillLight.position.set(4, -2, 3);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0x63adb0, 1.15);
    rimLight.position.set(4, 1, -4);
    scene.add(rimLight);

    function updateProjectedMarkers() {
      globeGroup.updateMatrixWorld();
      const nextMarkers: ProjectedMarker[] = [];
      let mostVisibleMarker: ProjectedMarker | null = null;
      const globeCenterX = width * 0.5;

      for (const location of locations) {
        const basePosition = markerPositions.get(location.id);
        if (!basePosition) continue;

        worldPosition.copy(basePosition).applyMatrix4(globeGroup.matrixWorld);
        surfaceDirection.copy(worldPosition).normalize();
        const facing = surfaceDirection.dot(cameraDirection);
        if (facing <= 0.18) continue;

        projectedPosition.copy(worldPosition).project(camera);
        const x = ((projectedPosition.x + 1) * width) / 2;
        const y = ((-projectedPosition.y + 1) * height) / 2;

        const marker: ProjectedMarker = {
          location,
          x,
          y,
          facing,
          labelX: x,
          labelY: y,
          labelSide: "right",
        };
        if (!mostVisibleMarker || facing > mostVisibleMarker.facing) {
          mostVisibleMarker = marker;
        }
        nextMarkers.push(marker);
      }

      const labelLanes: Record<"left" | "right", ProjectedMarker[]> = {
        left: [],
        right: [],
      };

      nextMarkers.forEach((marker, index) => {
        const distanceFromCenter = marker.x - globeCenterX;
        const labelSide =
          Math.abs(distanceFromCenter) < 78
            ? index % 2 === 0
              ? "left"
              : "right"
            : distanceFromCenter < 0
              ? "left"
              : "right";
        marker.labelSide = labelSide;
        marker.labelX =
          labelSide === "left"
            ? Math.max(marker.x - 38, 108)
            : Math.min(marker.x + 38, width - 108);
        labelLanes[labelSide].push(marker);
      });

      const minimumLabelGap = 27;
      const labelTop = 24;
      const labelBottom = height - 24;

      for (const lane of Object.values(labelLanes)) {
        lane.sort((first, second) => first.y - second.y);
        let previousLabelY = labelTop - minimumLabelGap;

        for (const marker of lane) {
          marker.labelY = Math.max(marker.y, previousLabelY + minimumLabelGap);
          previousLabelY = marker.labelY;
        }

        const lastMarker = lane[lane.length - 1];
        if (lastMarker && lastMarker.labelY > labelBottom) {
          const overflow = lastMarker.labelY - labelBottom;
          for (const marker of lane) marker.labelY -= overflow;
        }

        const firstMarker = lane[0];
        if (firstMarker && firstMarker.labelY < labelTop) {
          const underflow = labelTop - firstMarker.labelY;
          for (const marker of lane) marker.labelY += underflow;
        }
      }

      projectedMarkers = nextMarkers;
      setActiveCountryOutline(
        selectedLocation?.id ?? mostVisibleMarker?.location.id ?? null,
      );
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
        targetRotationY += 0.00125 * frameScale;
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
      if (cloudMesh) cloudMesh.rotation.y = time * 0.000012;
      countrySnakeMaterial.uniforms.uTime.value = time / 1000;
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
      for (const texture of loadedTextures) texture.dispose();
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      renderer.renderLists.dispose();
      renderer.dispose();
    };
  });
</script>

<div
  bind:this={containerElement}
  class="globe-container relative flex h-[32rem] w-full select-none items-center justify-center overflow-hidden sm:h-[40rem]"
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

  <svg
    class="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
    aria-hidden="true"
  >
    {#each projectedMarkers as marker (marker.location.id)}
      {@const isSelected = selectedLocation?.id === marker.location.id}
      {@const isHovered = hoveredLocationId === marker.location.id}
      {@const isMostVisible = marker.location.id === mostVisibleLocationId}
      {@const isHighlighted = selectedLocation ? isSelected : isMostVisible}
      <line
        class:leader-highlighted={isHighlighted}
        class:leader-visible={isHighlighted || isHovered}
        class="location-leader"
        x1={marker.x}
        y1={marker.y}
        x2={marker.labelX}
        y2={marker.labelY}
      ></line>
      <circle
        class:anchor-highlighted={isHighlighted}
        class="location-anchor"
        cx={marker.x}
        cy={marker.y}
        r={isHighlighted ? 3 : 2}
      ></circle>
    {/each}
  </svg>

  {#each projectedMarkers as marker (marker.location.id)}
    {@const isSelected = selectedLocation?.id === marker.location.id}
    {@const isHovered = hoveredLocationId === marker.location.id}
    {@const isMostVisible = marker.location.id === mostVisibleLocationId}
    {@const isHighlighted = selectedLocation ? isSelected : isMostVisible}

    <div
      class="location-marker absolute left-0 top-0 z-20"
      class:label-visible={isHighlighted || isHovered}
      style="transform: translate3d({marker.labelX}px, {marker.labelY}px, 0) translate({marker.labelSide ===
      'left'
        ? '-100%'
        : '0'}, -50%);"
    >
      <button
        type="button"
        class="location-label px-1.5 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.09em] transition duration-200 focus-visible:outline-1 focus-visible:outline-brand-green {isHighlighted
          ? 'location-label-selected text-brand-green'
          : isHovered
            ? 'text-brand-green'
            : 'text-brand-light/95 hover:text-brand-light'}"
        onmouseenter={() => (hoveredLocationId = marker.location.id)}
        onmouseleave={() => (hoveredLocationId = null)}
        onclick={() => onSelectLocation?.(marker.location)}
        aria-label="{marker.location.country}: {marker.location.clientCount !==
        undefined
          ? `${marker.location.clientCount.toLocaleString()} clients`
          : 'Target market'}"
      >
        {marker.location.id === "united-arab-emirates"
          ? "UAE"
          : marker.location.country}
      </button>
    </div>
  {/each}
</div>

<style>
  .location-marker {
    opacity: 0;
    pointer-events: none;
    transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .location-marker.label-visible {
    opacity: 1;
    pointer-events: auto;
  }

  .location-label {
    background: transparent;
    text-shadow:
      0 1px 2px var(--color-brand-dark),
      0 0 0.45rem var(--color-brand-dark),
      0 0 0.9rem var(--color-brand-dark);
    white-space: nowrap;
  }

  .location-label-selected {
    text-shadow:
      0 1px 2px var(--color-brand-dark),
      0 0 0.5rem var(--color-brand-dark),
      0 0 0.75rem
        color-mix(in srgb, var(--color-brand-green) 54%, transparent);
  }

  .location-leader {
    stroke: color-mix(in srgb, var(--color-brand-light) 42%, transparent);
    stroke-width: 0.75;
    vector-effect: non-scaling-stroke;
    opacity: 0;
    transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .location-leader.leader-visible {
    opacity: 1;
  }

  .leader-highlighted {
    stroke: var(--color-brand-green);
    stroke-width: 1.2;
  }

  .location-anchor {
    fill: color-mix(in srgb, var(--color-brand-light) 78%, transparent);
    stroke: var(--color-brand-dark);
    stroke-width: 1;
  }

  .anchor-highlighted {
    fill: var(--color-brand-green);
    stroke: color-mix(
      in srgb,
      var(--color-brand-green) 45%,
      var(--color-brand-light)
    );
  }

</style>
