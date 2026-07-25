<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import { registerScrollTrigger } from "$lib/animations/gsap";

  interface Props {
    images: Array<{ src: string; alt?: string }>;
    speed?: number;
    zSpacing?: number;
    visibleCount?: number;
    falloff?: { near: number; far: number };
    className?: string;
  }

  let {
    images = [],
    speed = 1.2,
    visibleCount = 12,
    className = "h-screen w-full relative overflow-hidden",
  }: Props = $props();

  let containerRef = $state<HTMLDivElement | null>(null);
  let viewportRef = $state<HTMLDivElement | null>(null);
  let canvasRef = $state<HTMLCanvasElement | null>(null);

  // Constants
  const DEFAULT_DEPTH_RANGE = 50;
  const MAX_HORIZONTAL_OFFSET = 8;
  const MAX_VERTICAL_OFFSET = 8;

  // Settings
  const fadeSettings = {
    fadeIn: { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.4, end: 0.43 },
  };
  const blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.4, end: 0.43 },
    maxBlur: 8.0,
  };

  // Three.js instances for cleanup
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let clock: THREE.Clock;
  let geometry: THREE.PlaneGeometry;
  let materials: THREE.ShaderMaterial[] = [];
  let loadedTextures: THREE.Texture[] = [];
  let meshes: THREE.Mesh[] = [];

  let targetScrollZ = 0;
  let currentScrollZ = 0;
  let scrollVelocity = 0;
  let animationFrameId: number;
  let pinTrigger: any;

  // Event handlers for cleanup
  let pointerMoveHandler: ((e: PointerEvent) => void) | null = null;
  let pointerLeaveHandler: (() => void) | null = null;
  let resizeHandler: (() => void) | null = null;

  // Spatial offsets calculated based on visibleCount inside onMount to prevent Svelte reactivity warning
  let spatialPositions: Array<{ x: number; y: number }> = [];

  const createClothMaterial = () => {
    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        map: { value: null },
        opacity: { value: 1.0 },
        blurAmount: { value: 0.0 },
        scrollForce: { value: 0.0 },
        time: { value: 0.0 },
        isHovered: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(800, 800) },
      },
      vertexShader: `
        uniform float scrollForce;
        uniform float time;
        uniform float isHovered;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normal;
          
          vec3 pos = position;
          
          // Curve curving based on scroll force
          float curveIntensity = scrollForce * 0.3;
          float distanceFromCenter = length(pos.xy);
          float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
          
          // Cloth ripples
          float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
          float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
          float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;
          
          // Flag wave on hover
          float flagWave = 0.0;
          if (isHovered > 0.5) {
            float wavePhase = pos.x * 3.0 + time * 8.0;
            float waveAmplitude = sin(wavePhase) * 0.1;
            float dampening = smoothstep(-0.5, 0.5, pos.x);
            flagWave = waveAmplitude * dampening;
            
            float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
            flagWave += secondaryWave;
          }
          
          pos.z -= (curve + clothEffect + flagWave);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float opacity;
        uniform float blurAmount;
        uniform float scrollForce;
        uniform vec2 uResolution;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vec4 color = texture2D(map, vUv);
          
          if (blurAmount > 0.0) {
            vec2 texelSize = 1.0 / uResolution;
            vec4 blurred = vec4(0.0);
            float total = 0.0;
            
            for (float x = -2.0; x <= 2.0; x += 1.0) {
              for (float y = -2.0; y <= 2.0; y += 1.0) {
                vec2 offset = vec2(x, y) * texelSize * blurAmount;
                float weight = 1.0 / (1.0 + length(vec2(x, y)));
                blurred += texture2D(map, vUv + offset) * weight;
                total += weight;
              }
            }
            color = blurred / total;
          }
          
          float curveHighlight = abs(scrollForce) * 0.05;
          color.rgb += vec3(curveHighlight * 0.1);
          
          gl_FragColor = vec4(color.rgb, color.a * opacity);
        }
      `,
    });
  };

  onMount(async () => {
    if (!canvasRef || !viewportRef || images.length === 0) return;

    // 0. Compute spatial positions to prevent reactivity warning
    spatialPositions = Array.from({ length: visibleCount }, (_, i) => {
      const horizontalAngle = (i * 2.618) % (Math.PI * 2);
      const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
      const horizontalRadius = (i % 3) * 1.2;
      const verticalRadius = ((i + 1) % 4) * 0.8;

      return {
        x:
          (Math.sin(horizontalAngle) *
            horizontalRadius *
            MAX_HORIZONTAL_OFFSET) /
          3,
        y: (Math.cos(verticalAngle) * verticalRadius * MAX_VERTICAL_OFFSET) / 4,
      };
    });

    // 1. Initialize Scene, Camera, Renderer
    const width = viewportRef.clientWidth;
    const height = viewportRef.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    clock = new THREE.Clock();

    // 2. Load Textures asynchronously
    const textureLoader = new THREE.TextureLoader();
    loadedTextures = images.map((img) => {
      return textureLoader.load(img.src, (texture) => {
        renderer.initTexture(texture);
      });
    });

    // 3. Create Shared Geometry and materials pool
    geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    materials = Array.from({ length: visibleCount }, () =>
      createClothMaterial(),
    );

    // 4. Create and position meshes
    meshes = Array.from({ length: visibleCount }, (_, i) => {
      const material = materials[i];
      const mesh = new THREE.Mesh(geometry, material);

      const initialZ = (DEFAULT_DEPTH_RANGE / visibleCount) * i;
      mesh.position.set(
        spatialPositions[i].x,
        spatialPositions[i].y,
        initialZ - DEFAULT_DEPTH_RANGE / 2,
      );

      scene.add(mesh);
      return mesh;
    });

    // 5. Interactive Raycaster for mouse hovers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHoveringActive = false;

    pointerMoveHandler = (event: PointerEvent) => {
      if (!renderer) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      isHoveringActive = true;
    };

    pointerLeaveHandler = () => {
      isHoveringActive = false;
      materials.forEach((mat) => {
        mat.uniforms.isHovered.value = 0.0;
      });
    };

    viewportRef.addEventListener("pointermove", pointerMoveHandler);
    viewportRef.addEventListener("pointerleave", pointerLeaveHandler);

    // 6. Handle window resizing
    resizeHandler = () => {
      if (!viewportRef || !renderer) return;
      const w = viewportRef.clientWidth;
      const h = viewportRef.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener("resize", resizeHandler);

    // 7. Setup GSAP ScrollTrigger for pinning
    const runtime = await registerScrollTrigger();
    if (runtime && containerRef && viewportRef) {
      const { ScrollTrigger } = runtime;

      pinTrigger = ScrollTrigger.create({
        trigger: containerRef,
        start: "top top",
        end: "+=2600", // Pinned scroll track height (shorter to prevent too much scroll)
        pin: viewportRef,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self: any) => {
          const scrollOffset = self.scroll() - self.start;
          targetScrollZ = scrollOffset * speed;
        },
      });
    }

    // 8. Animation & Render loop
    const render = () => {
      if (!renderer || !scene || !camera) return;

      // Smooth scroll lerping
      const diff = targetScrollZ - currentScrollZ;
      currentScrollZ += diff * 0.1;
      scrollVelocity = diff * 0.1;

      const elapsedTime = clock.getElapsedTime();
      const totalRange = DEFAULT_DEPTH_RANGE;
      const halfRange = totalRange / 2;
      const totalImages = loadedTextures.length;
      const imageAdvance =
        totalImages > 0 ? visibleCount % totalImages || totalImages : 0;

      // Update uniforms and plane positions
      meshes.forEach((mesh, i) => {
        const material = materials[i];

        // Update general uniforms
        material.uniforms.time.value = elapsedTime;
        material.uniforms.scrollForce.value = scrollVelocity * 0.015;

        // Calculate mapped z coordinate
        const initialZ = (totalRange / visibleCount) * i;
        const totalZ = initialZ + currentScrollZ * 0.015;

        const wraps = Math.floor(totalZ / totalRange);
        let wrappedZ = totalZ % totalRange;
        if (wrappedZ < 0) {
          wrappedZ += totalRange;
        }

        mesh.position.z = wrappedZ - halfRange;
        mesh.position.x = spatialPositions[i].x;
        mesh.position.y = spatialPositions[i].y;

        // Update active texture
        const imageIndex =
          (((i + wraps * imageAdvance) % totalImages) + totalImages) %
          totalImages;
        const texture = loadedTextures[imageIndex];
        if (texture) {
          material.uniforms.map.value = texture;

          const img = texture.image as
            { width?: number; height?: number } | null | undefined;
          material.uniforms.uResolution.value.set(
            img && img.width ? img.width : 800,
            img && img.height ? img.height : 800,
          );

          // Update mesh scale to maintain image aspect ratio
          const aspect =
            img && img.width && img.height ? img.width / img.height : 1;
          if (aspect > 1) {
            mesh.scale.set(2.4 * aspect, 2.4, 1);
          } else {
            mesh.scale.set(2.4, 2.4 / aspect, 1);
          }
        }

        // Calculate opacity and blur
        const normalizedPosition = wrappedZ / totalRange;
        let opacity = 1;

        if (
          normalizedPosition >= fadeSettings.fadeIn.start &&
          normalizedPosition <= fadeSettings.fadeIn.end
        ) {
          opacity =
            (normalizedPosition - fadeSettings.fadeIn.start) /
            (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
        } else if (normalizedPosition < fadeSettings.fadeIn.start) {
          opacity = 0;
        } else if (
          normalizedPosition >= fadeSettings.fadeOut.start &&
          normalizedPosition <= fadeSettings.fadeOut.end
        ) {
          opacity =
            1 -
            (normalizedPosition - fadeSettings.fadeOut.start) /
              (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
        } else if (normalizedPosition > fadeSettings.fadeOut.end) {
          opacity = 0;
        }
        material.uniforms.opacity.value = opacity;

        let blur = 0;
        if (
          normalizedPosition >= blurSettings.blurIn.start &&
          normalizedPosition <= blurSettings.blurIn.end
        ) {
          blur =
            blurSettings.maxBlur *
            (1 -
              (normalizedPosition - blurSettings.blurIn.start) /
                (blurSettings.blurIn.end - blurSettings.blurIn.start));
        } else if (normalizedPosition < blurSettings.blurIn.start) {
          blur = blurSettings.maxBlur;
        } else if (
          normalizedPosition >= blurSettings.blurOut.start &&
          normalizedPosition <= blurSettings.blurOut.end
        ) {
          blur =
            blurSettings.maxBlur *
            ((normalizedPosition - blurSettings.blurOut.start) /
              (blurSettings.blurOut.end - blurSettings.blurOut.start));
        } else if (normalizedPosition > blurSettings.blurOut.end) {
          blur = blurSettings.maxBlur;
        }
        material.uniforms.blurAmount.value = blur;
      });

      // Hover raycasting
      if (isHoveringActive) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(meshes);

        materials.forEach((mat) => {
          mat.uniforms.isHovered.value = 0.0;
        });

        if (intersects.length > 0) {
          const hoveredMesh = intersects[0].object as THREE.Mesh;
          const mat = hoveredMesh.material as THREE.ShaderMaterial;
          mat.uniforms.isHovered.value = 1.0;
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();
  });

  onDestroy(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (pinTrigger) {
      pinTrigger.kill();
    }
    if (viewportRef) {
      if (pointerMoveHandler)
        viewportRef.removeEventListener("pointermove", pointerMoveHandler);
      if (pointerLeaveHandler)
        viewportRef.removeEventListener("pointerleave", pointerLeaveHandler);
    }
    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
    }
    if (renderer) {
      renderer.dispose();
    }
    if (geometry) {
      geometry.dispose();
    }
    materials.forEach((mat) => mat.dispose());
    loadedTextures.forEach((tex) => tex.dispose());
  });
</script>

<div
  bind:this={containerRef}
  class="relative w-full overflow-hidden bg-brand-light"
  style="height: calc(100vh + 2600px);"
>
  <!-- Pinned Viewport Container styled as full-screen height (same as hero section) to prevent overlapping -->
  <div
    bind:this={viewportRef}
    class="w-full h-screen overflow-hidden flex items-center justify-center relative select-none bg-white/35 backdrop-blur-2xl border-y border-brand-dark/5 shadow-inner"
  >
    <!-- Light-diffusing radial gradient background -->
    <div
      class="absolute inset-0 bg-radial-[circle_at_center,rgba(255,255,255,0.4)_0%,rgba(240,240,240,0.15)_100%] pointer-events-none z-10"
    ></div>

    <!-- WebGL Canvas -->
    <canvas bind:this={canvasRef} class="w-full h-full relative z-20"></canvas>
  </div>
</div>
