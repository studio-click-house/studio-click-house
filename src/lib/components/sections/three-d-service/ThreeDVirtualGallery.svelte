<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { ArrowDown, Compass, Eye, RotateCcw, X, ZoomIn } from "lucide-svelte";
  import type { ThreeDHeroData } from "$lib/content/three-d-modeling";

  let { data }: { data?: ThreeDHeroData } = $props();

  let container = $state<HTMLDivElement>();
  let selectedArtwork = $state<{
    title: string;
    category: string;
    specs: string;
    index: number;
  } | null>(null);

  let isLoaded = $state(false);
  let isInteracting = $state(false);
  let activeWaypointIndex = $state<number>(0);

  // Gallery Artworks Metadata
  const artworksData = [
    {
      title: "Orchid Couture & Fine Beauty",
      category: "High-Fashion Editorial",
      specs: "Micro Dodge & Burn • Frequency Separation • 16-Bit ProPhoto",
      image: "/images/services/model-beauty/beauty-high-fashion-orchid-headpiece-portrait-after.webp",
      aspect: 0.8,
    },
    {
      title: "Designer Evening Gown Draping",
      category: "Couture Fashion Lookbook",
      specs: "Fabric Retexturing • Symmetry Calibration • Silhouette Sculpting",
      image: "/images/services/model-beauty/model-rachel-gilbert-evening-dress-0081.webp",
      aspect: 0.72,
    },
    {
      title: "Pore-Level Skincare & Texture",
      category: "Beauty Retouching",
      specs: "Zero-Blur Pore Retention • Skin Tone Balancing • Micro Blemish Removal",
      image: "/images/services/model-beauty/beauty-portrait-close-up-skincare-retouch-0500-after.webp",
      aspect: 0.8,
    },
    {
      title: "Photorealistic 3D Product CGI",
      category: "CGI & Shading",
      specs: "Subdivision Quad Mesh • PBR Roughness Mapping • Studio Key Lighting",
      image: "/images/portfolio/cgi-product-showcase.png",
      aspect: 1.25,
    },
    {
      title: "Glamour Editorial & Fur Styling",
      category: "Editorial Retouching",
      specs: "Fine Hair Masking • Color Harmonization • Tone Mapping",
      image: "/images/services/model-beauty/beauty-editorial-glam-leopard-portrait-298-after.webp",
      aspect: 0.78,
    },
    {
      title: "Resortwear Summer Campaign",
      category: "Color Correction & Grading",
      specs: "Natural Daylight Balance • Textile Swatch Matching • Ambient Grading",
      image: "/images/services/model-beauty/model-soleil-blue-resortwear-editorial-1308.webp",
      aspect: 0.75,
    },
    {
      title: "Studio Fashion Campaign Hero",
      category: "Commercial Fashion",
      specs: "High-End Packshot • Clean Background Synthesis • Contrast Curve Mastery",
      image: "/images/portfolio/portfolio-fashion-studio-hero.jpg",
      aspect: 1.3,
    },
    {
      title: "Editorial Print & Book Spread",
      category: "Publication Pre-Press",
      specs: "CMYK Fogra39 Conversion • Ink Density Balance • Shadow Depth Preservation",
      image: "/images/services/model-beauty/editorial-magazine-open-book-spread-black-desk.webp",
      aspect: 1.4,
    },
  ];

  // Camera targets & animation state
  let resetCameraView = $state<() => void>(() => {});
  let focusArtworkByIndex = $state<(index: number) => void>(() => {});
  let moveToWaypoint = $state<(index: number) => void>(() => {});

  function scrollToNextSection() {
    const target = document.getElementById("threed-studio-showcase");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  onMount(() => {
    if (!container) return;

    let active = true;
    let animationFrameId: number;

    const el = container;
    const width = el.clientWidth;
    const height = el.clientHeight;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0c);
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.024);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 80);
    const defaultCameraPos = new THREE.Vector3(0, 1.72, 5.6);
    const targetCameraPos = defaultCameraPos.clone();
    const currentCameraPos = defaultCameraPos.clone();
    camera.position.copy(defaultCameraPos);

    let targetPitch = -0.06;
    let currentPitch = -0.06;
    let targetYaw = Math.PI;
    let currentYaw = Math.PI;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    // 4. Procedural Textures (Parquet Wood & Sand Garden)
    const textureLoader = new THREE.TextureLoader();

    // Floor Parquet Texture Canvas
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext("2d");
    if (fCtx) {
      fCtx.fillStyle = "#1e1a17";
      fCtx.fillRect(0, 0, 1024, 1024);

      // Plank lines & grain
      const plankW = 128;
      const plankH = 256;
      for (let y = 0; y < 1024; y += plankH) {
        for (let x = 0; x < 1024; x += plankW) {
          const shift = (y / plankH) % 2 === 0 ? 0 : plankW / 2;
          const px = (x + shift) % 1024;
          const tone = 26 + Math.floor(Math.random() * 8);
          fCtx.fillStyle = `rgb(${tone + 6}, ${tone + 2}, ${tone})`;
          fCtx.fillRect(px + 1, y + 1, plankW - 2, plankH - 2);

          // Subtle wood fibers
          fCtx.fillStyle = "rgba(0,0,0,0.08)";
          for (let f = 0; f < 6; f++) {
            fCtx.fillRect(px + Math.random() * plankW, y, 1, plankH);
          }
        }
      }
    }
    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(10, 10);

    // Gallery Floor
    const floorGeo = new THREE.CircleGeometry(12.5, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.32,
      metalness: 0.08,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 5. Center Zen Rock Island
    const zenCenterGeo = new THREE.CircleGeometry(3.6, 48);
    const zenCenterMat = new THREE.MeshStandardMaterial({
      color: 0x22201e,
      roughness: 0.9,
      metalness: 0.05,
    });
    const zenMesh = new THREE.Mesh(zenCenterGeo, zenCenterMat);
    zenMesh.rotation.x = -Math.PI / 2;
    zenMesh.position.y = 0.01;
    zenMesh.receiveShadow = true;
    scene.add(zenMesh);

    // Zen Granite Curb Ring
    const curbGeo = new THREE.RingGeometry(3.55, 3.85, 48);
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x3d3935,
      roughness: 0.6,
      metalness: 0.2,
    });
    const curbMesh = new THREE.Mesh(curbGeo, curbMat);
    curbMesh.rotation.x = -Math.PI / 2;
    curbMesh.position.y = 0.02;
    scene.add(curbMesh);

    // Sculptural Rocks in Center
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x48423d,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true,
    });

    const rockOffsets = [
      { x: -0.6, z: 0.4, scale: 0.42, rot: 0.6 },
      { x: 0.7, z: -0.5, scale: 0.55, rot: 1.8 },
      { x: -0.2, z: -0.8, scale: 0.35, rot: 2.4 },
      { x: 0.5, z: 0.6, scale: 0.38, rot: 0.2 },
    ];

    rockOffsets.forEach((ro) => {
      const rockGeo = new THREE.DodecahedronGeometry(ro.scale, 1);
      // Displace vertices for organic stone look
      const pos = rockGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const vz = pos.getZ(i);
        const noise = 1 + (Math.sin(vx * 7) + Math.cos(vy * 8) + Math.sin(vz * 6)) * 0.09;
        pos.setXYZ(i, vx * noise, vy * (noise * 0.85), vz * noise);
      }
      rockGeo.computeVertexNormals();

      const rMesh = new THREE.Mesh(rockGeo, rockMat);
      rMesh.position.set(ro.x, ro.scale * 0.6, ro.z);
      rMesh.rotation.y = ro.rot;
      rMesh.castShadow = true;
      rMesh.receiveShadow = true;
      scene.add(rMesh);
    });

    // Central Museum Plinth / Sculpture Pedestal
    const plinthGeo = new THREE.CylinderGeometry(0.7, 0.78, 0.72, 32);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x1d1d20,
      roughness: 0.28,
      metalness: 0.75,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.set(0, 0.36, 0);
    plinthMesh.castShadow = true;
    plinthMesh.receiveShadow = true;
    scene.add(plinthMesh);

    // Warm Pedestal Rim Glow
    const plinthRingGeo = new THREE.RingGeometry(0.68, 0.76, 32);
    const plinthRingMat = new THREE.MeshBasicMaterial({
      color: 0x7ea641,
      side: THREE.DoubleSide,
    });
    const plinthRing = new THREE.Mesh(plinthRingGeo, plinthRingMat);
    plinthRing.rotation.x = -Math.PI / 2;
    plinthRing.position.set(0, 0.725, 0);
    scene.add(plinthRing);

    // Central Champagne-Gold Kinetic Sculpture
    const sculptureGeo = new THREE.TorusKnotGeometry(0.28, 0.08, 96, 16);
    const sculptureMat = new THREE.MeshStandardMaterial({
      color: 0xdfba73, // Luxurious champagne gold
      metalness: 0.95,
      roughness: 0.16,
    });
    const sculptureMesh = new THREE.Mesh(sculptureGeo, sculptureMat);
    sculptureMesh.position.set(0, 1.18, 0);
    sculptureMesh.castShadow = true;
    scene.add(sculptureMesh);

    // 6. Architectural Ceiling & Central Skylight Oculus
    const ceilingGeo = new THREE.RingGeometry(4.2, 12.5, 64);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.95,
      side: THREE.DoubleSide,
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.y = 5.2;
    scene.add(ceilingMesh);

    // Glowing Central Skylight
    const skylightGeo = new THREE.CircleGeometry(4.18, 48);
    const skylightMat = new THREE.MeshBasicMaterial({
      color: 0xfffcf5,
      side: THREE.DoubleSide,
    });
    const skylightMesh = new THREE.Mesh(skylightGeo, skylightMat);
    skylightMesh.rotation.x = Math.PI / 2;
    skylightMesh.position.y = 5.22;
    scene.add(skylightMesh);

    // Ambient Oculus Light Down
    const skylightDown = new THREE.SpotLight(0xfff7ea, 4.2, 18, Math.PI / 3, 0.6, 1.2);
    skylightDown.position.set(0, 5.15, 0);
    skylightDown.target.position.set(0, 0, 0);
    skylightDown.castShadow = true;
    skylightDown.shadow.mapSize.width = 1024;
    skylightDown.shadow.mapSize.height = 1024;
    skylightDown.shadow.bias = -0.0001;
    scene.add(skylightDown);
    scene.add(skylightDown.target);

    // Overall Gallery Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xfffaee, 0.95);
    scene.add(ambientLight);

    // 7. Outer Gallery Exhibition Walls & Artworks Array
    const totalArtworks = artworksData.length;
    const galleryRadius = 9.8;
    const artworkDistance = 9.4;

    const interactiveArtworkMeshes: THREE.Mesh[] = [];
    const artworkPositions: THREE.Vector3[] = [];
    const artworkViewingPositions: THREE.Vector3[] = [];

    // Outer Cylindrical Wall
    const outerWallGeo = new THREE.CylinderGeometry(galleryRadius + 1.2, galleryRadius + 1.2, 5.2, 48, 1, true);
    const outerWallMat = new THREE.MeshStandardMaterial({
      color: 0x161619,
      roughness: 0.9,
      side: THREE.BackSide,
    });
    const outerWall = new THREE.Mesh(outerWallGeo, outerWallMat);
    outerWall.position.y = 2.6;
    outerWall.receiveShadow = true;
    scene.add(outerWall);

    // Build each Exhibition Bay, Framed Canvas, and Spotlight
    artworksData.forEach((art, idx) => {
      const angle = (idx / totalArtworks) * Math.PI * 2;
      const x = Math.sin(angle) * artworkDistance;
      const z = Math.cos(angle) * artworkDistance;
      const y = 1.85; // Gallery eye-level center

      const wallAngle = angle + Math.PI;

      // Architectural Column / Wall Niche behind artwork
      const panelGeo = new THREE.BoxGeometry(3.6, 4.4, 0.45);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1d,
        roughness: 0.85,
        metalness: 0.08,
      });
      const panelMesh = new THREE.Mesh(panelGeo, panelMat);
      panelMesh.position.set(Math.sin(angle) * (galleryRadius + 0.3), 2.2, Math.cos(angle) * (galleryRadius + 0.3));
      panelMesh.rotation.y = wallAngle;
      panelMesh.receiveShadow = true;
      scene.add(panelMesh);

      // Frame Dimensions based on aspect ratio
      const frameHeight = 2.1;
      const frameWidth = frameHeight * art.aspect;

      // Dark Aluminum Museum Frame
      const frameGeo = new THREE.BoxGeometry(frameWidth + 0.16, frameHeight + 0.16, 0.07);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x0f0f11,
        metalness: 0.85,
        roughness: 0.25,
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.set(x, y, z);
      frameMesh.rotation.y = wallAngle;
      frameMesh.castShadow = true;
      scene.add(frameMesh);

      // Off-White Matting Border
      const mattingGeo = new THREE.PlaneGeometry(frameWidth + 0.06, frameHeight + 0.06);
      const mattingMat = new THREE.MeshStandardMaterial({
        color: 0xf5f3ee,
        roughness: 0.95,
      });
      const mattingMesh = new THREE.Mesh(mattingGeo, mattingMat);
      mattingMesh.position.set(0, 0, 0.038);
      frameMesh.add(mattingMesh);

      // Artwork Canvas Texture
      const artTexture = textureLoader.load(art.image, () => {
        renderer.render(scene, camera);
      });
      artTexture.colorSpace = THREE.SRGBColorSpace;
      artTexture.generateMipmaps = true;
      artTexture.minFilter = THREE.LinearMipmapLinearFilter;

      const canvasGeo = new THREE.PlaneGeometry(frameWidth - 0.06, frameHeight - 0.06);
      const canvasMat = new THREE.MeshStandardMaterial({
        map: artTexture,
        roughness: 0.45,
        metalness: 0.02,
      });
      const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
      canvasMesh.position.set(0, 0, 0.042);
      canvasMesh.userData = { artworkIndex: idx };
      frameMesh.add(canvasMesh);

      interactiveArtworkMeshes.push(canvasMesh);
      artworkPositions.push(new THREE.Vector3(x, y, z));

      // Optimal Viewing Position in front of this artwork (distance ~2.8m from wall)
      const viewPos = new THREE.Vector3(
        Math.sin(angle) * (artworkDistance - 3.2),
        1.72,
        Math.cos(angle) * (artworkDistance - 3.2)
      );
      artworkViewingPositions.push(viewPos);

      // Dedicated Directional Spotlight shining onto Artwork
      const spotLight = new THREE.SpotLight(0xfff7ee, 3.8, 9.5, Math.PI / 4.8, 0.45, 1.1);
      spotLight.position.set(Math.sin(angle) * (galleryRadius - 1.2), 4.8, Math.cos(angle) * (galleryRadius - 1.2));
      spotLight.target = frameMesh;
      spotLight.castShadow = false;
      scene.add(spotLight);

      // Museum Floor Light Wash
      const floorGlow = new THREE.PointLight(0x7ea641, 0.35, 3.5, 2);
      floorGlow.position.set(Math.sin(angle) * (artworkDistance - 0.5), 0.2, Math.cos(angle) * (artworkDistance - 0.5));
      scene.add(floorGlow);
    });

    // 8. Interactive Floor Waypoints (Teleport / Step Pads)
    const waypoints = [
      { name: "Center Rotunda", pos: new THREE.Vector3(0, 1.68, 0.1) },
      { name: "North Gallery", pos: new THREE.Vector3(0, 1.68, -4.5) },
      { name: "East Gallery", pos: new THREE.Vector3(4.5, 1.68, 0) },
      { name: "South Gallery", pos: new THREE.Vector3(0, 1.68, 4.5) },
      { name: "West Gallery", pos: new THREE.Vector3(-4.5, 1.68, 0) },
    ];

    const waypointMeshes: THREE.Mesh[] = [];
    waypoints.forEach((wp, wIdx) => {
      const ringGeo = new THREE.RingGeometry(0.38, 0.46, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: wIdx === 0 ? 0x7ea641 : 0xffffff,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      });
      const wpMesh = new THREE.Mesh(ringGeo, ringMat);
      wpMesh.rotation.x = -Math.PI / 2;
      wpMesh.position.set(wp.pos.x, 0.025, wp.pos.z);
      wpMesh.userData = { waypointIndex: wIdx };
      scene.add(wpMesh);
      waypointMeshes.push(wpMesh);
    });

    // 9. Camera Navigation & Raycaster Functions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    focusArtworkByIndex = (idx: number) => {
      const art = artworksData[idx];
      selectedArtwork = {
        title: art.title,
        category: art.category,
        specs: art.specs,
        index: idx,
      };

      const viewPos = artworkViewingPositions[idx];
      targetCameraPos.copy(viewPos);

      // Aim camera directly at the artwork
      const artPos = artworkPositions[idx];
      const dx = artPos.x - viewPos.x;
      const dz = artPos.z - viewPos.z;
      targetYaw = Math.atan2(dx, dz);
      targetPitch = 0.02;
      isInteracting = true;
    };

    resetCameraView = () => {
      selectedArtwork = null;
      targetCameraPos.copy(defaultCameraPos);
      targetPitch = -0.06;
      targetYaw = Math.PI;
      activeWaypointIndex = 0;
    };

    moveToWaypoint = (wIdx: number) => {
      selectedArtwork = null;
      activeWaypointIndex = wIdx;
      const wp = waypoints[wIdx];
      targetCameraPos.copy(wp.pos);
      isInteracting = true;
    };

    // 10. Mouse Drag & Look Interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let dragDistance = 0;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      isDragging = true;
      dragDistance = 0;
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouse = { x: cx, y: cy };
    }

    function onPointerMove(e: MouseEvent | TouchEvent) {
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const dx = cx - prevMouse.x;
        const dy = cy - prevMouse.y;
        dragDistance += Math.abs(dx) + Math.abs(dy);

        targetYaw -= dx * 0.0035;
        targetPitch -= dy * 0.0025;

        // Clamp pitch to prevent camera flips
        targetPitch = Math.max(-0.65, Math.min(0.65, targetPitch));

        prevMouse = { x: cx, y: cy };
      }

      // Raycast hover effect when not dragging
      const rect = el.getBoundingClientRect();
      mouse.x = ((cx - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((cy - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([...interactiveArtworkMeshes, ...waypointMeshes]);

      if (intersects.length > 0) {
        el.style.cursor = "pointer";
      } else {
        el.style.cursor = isDragging ? "grabbing" : "grab";
      }
    }

    function onPointerUp(e: MouseEvent | TouchEvent) {
      isDragging = false;

      // If user barely moved mouse, treat as a Click
      if (dragDistance < 8) {
        const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
        const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;

        const rect = el.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Check Artwork Clicks
        const artIntersects = raycaster.intersectObjects(interactiveArtworkMeshes);
        if (artIntersects.length > 0) {
          const hitIdx = artIntersects[0].object.userData.artworkIndex;
          if (hitIdx !== undefined) {
            focusArtworkByIndex(hitIdx);
            return;
          }
        }

        // Check Waypoint Clicks
        const wpIntersects = raycaster.intersectObjects(waypointMeshes);
        if (wpIntersects.length > 0) {
          const hitWpIdx = wpIntersects[0].object.userData.waypointIndex;
          if (hitWpIdx !== undefined) {
            moveToWaypoint(hitWpIdx);
            return;
          }
        }
      }
    }

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    dom.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // Keyboard ESC to reset view
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        resetCameraView();
      }
    }
    window.addEventListener("keydown", onKeyDown);

    // Resize Handler
    function handleResize() {
      if (!el || !renderer || !camera) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    // 11. Animation Render Loop (Ultra Smooth Damped Lerp)
    isLoaded = true;

    function animate() {
      if (!active) return;
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera position translation
      currentCameraPos.lerp(targetCameraPos, 0.055);
      camera.position.copy(currentCameraPos);

      // Smooth camera rotation
      currentYaw += (targetYaw - currentYaw) * 0.08;
      currentPitch += (targetPitch - currentPitch) * 0.08;

      // Subtle atmospheric idle motion when not interacting
      if (!isDragging && !selectedArtwork) {
        targetYaw += 0.0006;
      }

      const lookTarget = new THREE.Vector3(
        camera.position.x + Math.sin(currentYaw) * Math.cos(currentPitch),
        camera.position.y + Math.sin(currentPitch),
        camera.position.z + Math.cos(currentYaw) * Math.cos(currentPitch)
      );
      camera.lookAt(lookTarget);

      // Pulse Waypoint rings
      const time = Date.now() * 0.0025;
      waypointMeshes.forEach((wm, idx) => {
        const mat = wm.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.4 + Math.sin(time + idx) * 0.2;
      });

      // Kinetic rotation for central gold sculpture
      sculptureMesh.rotation.y += 0.007;
      sculptureMesh.rotation.x += 0.0035;

      renderer.render(scene, camera);
    }
    animate();

    // 12. Cleanup on Unmount
    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      dom.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      dom.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);

      // Dispose Three.js memory cleanly
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
      floorTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  });
</script>

<section
  id="threed-hero"
  aria-label="3D Interactive Virtual Gallery"
  class="relative isolate w-full h-dvh min-h-[620px] bg-[#0a0a0c] overflow-hidden pt-16 sm:pt-20 flex flex-col select-none"
>
  <h1 class="sr-only">
    {data?.title ?? "3D Product Modeling, CGI Rendering & Interactive Virtual Showroom"} - Studio Click House
  </h1>

  <!-- 3D Three.js Canvas Container -->
  <div class="relative w-full flex-1 overflow-hidden">
    <div
      bind:this={container}
      class="size-full cursor-grab active:cursor-grabbing touch-none"
      title="Click and drag to explore 360°"
    ></div>

    <!-- Top Floating Status Bar -->
    <div
      class="pointer-events-none absolute top-4 inset-x-0 z-30 flex items-center justify-between px-5 sm:px-8"
    >
      <div
        class="pointer-events-auto flex items-center gap-2.5 rounded-full bg-brand-dark/80 px-4 py-1.5 text-xs font-medium text-brand-light/85 backdrop-blur-md border border-brand-light/10 shadow-lg"
      >
        <span class="flex size-2 rounded-full bg-brand-green animate-pulse"></span>
        <span class="font-sans tracking-wide">Studio Virtual Showroom • 360° Real-Time</span>
      </div>

      <!-- Controls hint / Reset view -->
      {#if selectedArtwork}
        <button
          type="button"
          onclick={resetCameraView}
          class="pointer-events-auto flex items-center gap-2 rounded-full bg-brand-green px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCcw size={13} strokeWidth={2.4} />
          <span>Back to Gallery View</span>
        </button>
      {/if}
    </div>

    <!-- Artwork Inspection Card (Opens when an artwork is clicked) -->
    {#if selectedArtwork}
      <div
        class="pointer-events-auto absolute bottom-6 inset-x-4 sm:inset-x-auto sm:left-8 z-30 max-w-md rounded-2xl border border-brand-light/15 bg-brand-dark/90 p-5 text-brand-light shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <span class="inline-block rounded-full bg-brand-green/20 px-2.5 py-0.5 font-sans text-[0.68rem] font-bold uppercase tracking-wider text-brand-green">
              {selectedArtwork.category}
            </span>
            <h2 class="font-display text-lg font-bold text-brand-light mt-1.5">
              {selectedArtwork.title}
            </h2>
            <p class="font-sans text-xs text-brand-light/65 mt-1 leading-relaxed">
              {selectedArtwork.specs}
            </p>
          </div>

          <button
            type="button"
            onclick={resetCameraView}
            aria-label="Close artwork details"
            class="rounded-full p-1.5 text-brand-light/60 hover:text-white hover:bg-brand-light/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div class="mt-4 flex items-center gap-2.5 pt-2 border-t border-brand-light/10">
          <button
            type="button"
            onclick={() => focusArtworkByIndex((selectedArtwork!.index + 1) % artworksData.length)}
            class="flex-1 rounded-lg bg-brand-light/10 px-3.5 py-2 text-center text-xs font-medium text-brand-light hover:bg-brand-light/20 transition-colors cursor-pointer"
          >
            Next Artwork →
          </button>
          <button
            type="button"
            onclick={resetCameraView}
            class="rounded-lg bg-brand-green px-4 py-2 text-xs font-bold text-brand-dark hover:brightness-110 transition-all cursor-pointer"
          >
            Rotate 360°
          </button>
        </div>
      </div>
    {:else}
      <!-- Bottom Exploration Guidance & Waypoint Switcher -->
      <div
        class="pointer-events-none absolute bottom-6 inset-x-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 px-5 sm:px-8"
      >
        <!-- Center Floating Hint -->
        <div
          class="pointer-events-auto flex items-center gap-3 rounded-full bg-brand-dark/80 px-5 py-2.5 text-xs text-brand-light/85 backdrop-blur-md border border-brand-light/15 shadow-xl"
        >
          <Compass size={15} class="text-brand-green animate-spin" style="animation-duration: 12s;" />
          <span>Drag to look around 360° • Click any framed artwork to inspect</span>
        </div>

        <!-- Scroll down to services button -->
        <button
          type="button"
          onclick={scrollToNextSection}
          class="pointer-events-auto group flex items-center gap-2 rounded-full bg-brand-dark/85 px-4 py-2 text-xs font-medium text-brand-light/90 shadow-xl backdrop-blur-md border border-white/15 hover:border-brand-green/70 hover:text-white hover:bg-brand-dark transition-all duration-200 cursor-pointer active:scale-95"
        >
          <span>Scroll to Services</span>
          <ArrowDown size={14} class="text-brand-green transition-transform duration-300 group-hover:translate-y-0.5" />
        </button>
      </div>
    {/if}
  </div>
</section>
