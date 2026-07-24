<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { gsap } from "gsap";
  import { Check, Sparkles, Zap, ArrowRight } from "lucide-svelte";
  import { pricingCategories, pricingPageData } from "$lib/content/pricing";
  import { cn } from "$lib/utils";

  // Calculator State
  let activeCatIndex = $state(0);
  let volume = $state(10);
  let selectedComplexity = $state(0);
  let selectedTurnaround = $state(0);
  let selectedServices = $state<Record<string, boolean>>({});

  // Active Category Data
  let activeCategory = $derived(pricingCategories[activeCatIndex]);

  // Dynamic texture paths based on selected category
  const categoryImages = [
    "/images/portfolio/model-retouched.png",
    "/images/hero/hero-poster.jpg",
    "/images/portfolio/model-shadowed.png"
  ];

  // Initialize selected services when category changes
  $effect(() => {
    const initial: Record<string, boolean> = {};
    activeCategory.rates.forEach((rate, i) => {
      initial[rate.slug] = i === 0 || i === 1; // default select first two
    });
    selectedServices = initial;
  });

  // Calculate pricing
  let calculatedPrice = $derived.by(() => {
    let baseSum = 0;
    activeCategory.rates.forEach((rate) => {
      if (selectedServices[rate.slug]) {
        baseSum += rate.basePrice;
      }
    });

    if (baseSum === 0) return 0;

    const compMultiplier = pricingPageData.calculator.complexityOptions[selectedComplexity].multiplier;
    const turnMultiplier = pricingPageData.calculator.turnaroundOptions[selectedTurnaround].multiplier;

    // Volume Discount factor
    let discount = 1.0;
    if (activeCategory.categoryName === "Image Editing") {
      if (volume > 200) discount = 0.7;
      else if (volume > 50) discount = 0.8;
      else if (volume > 10) discount = 0.9;
    } else if (activeCategory.categoryName === "Video Editing") {
      if (volume > 20) discount = 0.75;
      else if (volume > 5) discount = 0.85;
    } else {
      if (volume > 10) discount = 0.8;
      else if (volume > 3) discount = 0.9;
    }

    return Math.round(baseSum * volume * compMultiplier * turnMultiplier * discount);
  });

  // Animate price changes
  let animatedPrice = $state(0);
  $effect(() => {
    const target = calculatedPrice;
    const obj = { val: animatedPrice };
    gsap.to(obj, {
      val: target,
      duration: 0.35,
      ease: "power2.out",
      onUpdate: () => {
        animatedPrice = Math.round(obj.val);
      }
    });
  });

  // Elements
  let canvasContainer: HTMLDivElement;
  let canvasElement: HTMLCanvasElement;

  // Three.js Viewport Runtime
  let threeRuntime: {
    setImage: (src: string) => void;
    setMode: (mode: number) => void;
  } | null = null;

  onMount(() => {
    if (!canvasContainer || !canvasElement) return;

    let width = canvasContainer.clientWidth || 450;
    let height = canvasContainer.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);

    // Custom Shader for Refractive Loupe & Image Analysis
    const customShader = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMode: { value: 0.0 }, // 0: Image (Loupe + Retouch split), 1: Video (Viewport zoom + Grid), 2: 3D (Displacement)
        uTime: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        uniform float uMode;
        uniform float uTime;

        varying vec2 vUv;

        void main() {
          vec2 mouseUV = uMouse;
          vec2 aspectUV = vUv;
          
          // Lens / Loupe distortion center
          float dist = distance(vUv, mouseUV);
          vec2 distortedUv = vUv;

          // 1. Interactive loupe lens distortion
          if (dist < 0.28) {
            float strength = (0.28 - dist) * 0.45;
            distortedUv = vUv - normalize(vUv - mouseUV) * strength;
          }

          vec4 color = texture2D(uTexture, distortedUv);

          // Mode 0: Image Editing — Retouching Sweep & Pen Vector path overlay
          if (uMode == 0.0) {
            // Sweep line moving slowly
            float sweepX = 0.5 + sin(uTime * 1.2) * 0.22;
            float isRight = step(sweepX, vUv.x);

            // Left side is raw/desaturated, right side is clean/tinted
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            vec3 rawColor = vec3(gray * 0.95);
            vec3 polishedColor = color.rgb * vec3(1.02, 1.05, 0.98);

            color.rgb = mix(rawColor, polishedColor, isRight);

            // Draw thin divider line
            float lineGlow = exp(-pow(vUv.x - sweepX, 2.0) / 0.00001);
            color.rgb += vec3(0.494, 0.651, 0.255) * lineGlow * 0.7;

            // Draw abstract vector pen line inside loupe
            if (dist < 0.28) {
              // Simulated pen path: a smooth mathematical wave
              float wave = 0.5 + sin(vUv.x * 24.0 + uTime * 0.5) * 0.08;
              float pathGlow = exp(-pow(vUv.y - wave, 2.0) / 0.000035);
              color.rgb = mix(color.rgb, vec3(0.79, 1.0, 0.35), pathGlow * 0.8);
            }
          }
          // Mode 1: Video Editing — Views & Viewfinder Overlay
          else if (uMode == 1.0) {
            // Apply zoom-in and slight tint
            vec2 zoomedUv = mouseUV + (vUv - mouseUV) * 0.92;
            color = texture2D(uTexture, zoomedUv);

            // Viewfinder reticle overlay (corners & center mark)
            float lineWidth = 0.002;
            float lineLength = 0.04;
            
            // Draw crosshair at cursor
            float crosshairX = step(mouseUV.x - lineWidth, vUv.x) * step(vUv.x, mouseUV.x + lineWidth) * step(mouseUV.y - lineLength, vUv.y) * step(vUv.y, mouseUV.y + lineLength);
            float crosshairY = step(mouseUV.y - lineWidth, vUv.y) * step(vUv.y, mouseUV.y + lineWidth) * step(mouseUV.x - lineLength, vUv.x) * step(vUv.x, mouseUV.x + lineLength);
            
            // Red dot
            float redDot = smoothstep(0.008, 0.004, distance(vUv, vec2(0.08, 0.9)));
            float blink = step(0.5, fract(uTime * 1.5));
            color.rgb = mix(color.rgb, vec3(0.9, 0.2, 0.2), redDot * blink);

            color.rgb = mix(color.rgb, vec3(1.0), max(crosshairX, crosshairY) * 0.45);
          }
          // Mode 2: 3D Modeling — Technical Grid Displacement
          else {
            // Stylized 3D depth-map wireframe
            float gridScale = 55.0;
            vec2 grid = abs(fract(vUv * gridScale - 0.5) - 0.5) / fwidth(vUv * gridScale);
            float minGrid = min(grid.x, grid.y);
            float isGridLine = 1.0 - min(minGrid, 1.0);

            // Displacement waves centered at mouse
            float wave = sin(dist * 35.0 - uTime * 6.0) * 0.025;
            vec2 displacedUV = vUv + normalize(vUv - mouseUV) * wave;
            vec4 imgColor = texture2D(uTexture, displacedUV);

            // Draw a green blueprint grid overlay
            vec3 gridColor = vec3(0.494, 0.651, 0.255) * 0.38;
            color.rgb = mix(imgColor.rgb * 0.45, gridColor, isGridLine * 0.55);
          }

          gl_FragColor = color;
        }
      `
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), customShader);
    scene.add(mesh);

    const textureLoader = new THREE.TextureLoader();
    let currentTexture: THREE.Texture | null = null;

    const setImage = (src: string) => {
      textureLoader.load(src, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        
        if (currentTexture) currentTexture.dispose();
        currentTexture = tex;

        customShader.uniforms.uTexture.value = tex;
      });
    };

    const setMode = (mode: number) => {
      customShader.uniforms.uMode.value = mode;
    };

    // Load initial image
    setImage(categoryImages[activeCatIndex]);

    // Handle mouse interaction
    let mouse = new THREE.Vector2(0.5, 0.5);
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // invert Y
      mouse.set(x, y);
    };
    canvasElement.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse follow
      customShader.uniforms.uMouse.value.lerp(mouse, 0.08);
      customShader.uniforms.uTime.value = clock.getElapsedTime();

      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      width = canvasContainer.clientWidth || 300;
      height = canvasContainer.clientHeight || 450;
      renderer.setSize(width, height, false);
      customShader.uniforms.uResolution.value.set(width, height);
    });
    resizeObserver.observe(canvasContainer);

    threeRuntime = { setImage, setMode };

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvasElement.removeEventListener("mousemove", handleMouseMove);
      mesh.geometry.dispose();
      customShader.dispose();
      if (currentTexture) currentTexture.dispose();
      renderer.dispose();
    };
  });

  // Watch selected category
  $effect(() => {
    if (threeRuntime) {
      threeRuntime.setMode(activeCatIndex);
      threeRuntime.setImage(categoryImages[activeCatIndex]);
    }
  });
</script>

<section id="pricing-configurator" class="relative bg-brand-light text-brand-dark px-5 py-24 sm:px-10 lg:px-16 border-b border-brand-dark/14">
  <div class="site-shell grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
    
    <!-- Left Column: Refractive Lightbox Desk -->
    <div class="lg:col-span-5 w-full relative flex flex-col justify-center items-center">
      <div 
        bind:this={canvasContainer} 
        class="w-full aspect-[4/5] bg-brand-paper border border-brand-dark/10 relative overflow-hidden flex items-center justify-center cursor-crosshair"
      >
        <canvas bind:this={canvasElement} class="w-full h-full absolute inset-0 outline-none"></canvas>
        
        <!-- Live Lightbox HUD -->
        <div class="absolute bottom-4 left-4 right-4 flex justify-between font-mono text-[0.68rem] uppercase tracking-widest text-brand-dark/50 pointer-events-none">
          <span>PIPELINE: {activeCategory.categoryName.replace(' ', '_')}</span>
          <span>FPS: 60.0_Hz</span>
        </div>

        <div class="absolute top-4 left-4 font-mono text-[0.68rem] text-brand-green flex items-center gap-1.5 pointer-events-none bg-brand-light border border-brand-dark/10 px-2 py-0.5 uppercase tracking-widest">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
          Interactive_Desk
        </div>
      </div>
      <p class="mt-4 font-mono text-[0.68rem] text-center text-brand-dark/45 uppercase tracking-widest pointer-events-none">
        Move pointer over image to inspect finish
      </p>
    </div>

    <!-- Right Column: Fine Estimate Configurator -->
    <div class="lg:col-span-7 flex flex-col justify-start w-full lg:pl-6">
      <header class="mb-12">
        <div class="flex items-center gap-3">
          <span class="h-px w-8 bg-brand-green"></span>
          <span class="eyebrow text-brand-dark/50">{pricingPageData.intro.eyebrow}</span>
        </div>
        <h2 class="display-title mt-6 mb-6 leading-[0.88] tracking-tight">{pricingPageData.intro.title}</h2>
        <p class="max-w-xl text-brand-dark/72 text-base leading-relaxed">
          {pricingPageData.intro.description}
        </p>
      </header>

      <!-- Step 1: Selection Rows -->
      <div class="border-b border-brand-dark/10 pb-8 mb-8">
        <span role="heading" aria-level="3" class="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-brand-dark/45 block mb-4">
          01. Select Pipeline
        </span>
        <div class="flex flex-wrap gap-3">
          {#each pricingCategories as category, index}
            <button
              class={cn(
                "py-3 px-5 border font-mono text-[0.68rem] uppercase tracking-wider transition-all duration-200 cursor-pointer",
                activeCatIndex === index 
                  ? "border-brand-dark bg-brand-dark text-brand-light font-bold" 
                  : "border-brand-dark/20 text-brand-dark/75 hover:border-brand-dark hover:text-brand-dark bg-transparent"
              )}
              onclick={() => activeCatIndex = index}
            >
              {category.categoryName}
            </button>
          {/each}
        </div>
      </div>

      <!-- Step 2: Checklist with subtle line styles -->
      <div class="border-b border-brand-dark/10 pb-8 mb-8">
        <span role="heading" aria-level="3" class="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-brand-dark/45 block mb-4">
          02. Select Modules
        </span>
        <div class="flex flex-col gap-2">
          {#each activeCategory.rates as rate}
            <button
              class={cn(
                "py-4 px-5 border flex justify-between items-center transition-all duration-200 text-left bg-transparent rounded-none cursor-pointer",
                selectedServices[rate.slug]
                  ? "border-brand-green/80 bg-brand-green/5 text-brand-dark"
                  : "border-brand-dark/10 hover:border-brand-dark/30 text-brand-dark/75"
              )}
              onclick={() => {
                selectedServices[rate.slug] = !selectedServices[rate.slug];
              }}
            >
              <div class="max-w-[70%]">
                <span class="block text-sm font-semibold tracking-tight leading-none">{rate.name}</span>
                <span class="block text-xs text-brand-dark/58 mt-1.5 leading-snug">{rate.description}</span>
              </div>
              <div class="flex items-center gap-6">
                <span class="font-mono text-xs font-semibold text-brand-dark/80">
                  ${rate.basePrice.toFixed(2)}<span class="text-[0.68rem] text-brand-dark/45">/{rate.unit}</span>
                </span>
                <div class={cn(
                  "w-4 h-4 border flex items-center justify-center transition-colors rounded-none",
                  selectedServices[rate.slug] ? "border-brand-green bg-brand-green text-brand-light" : "border-brand-dark/20"
                )}>
                  {#if selectedServices[rate.slug]}
                    <Check size={10} strokeWidth={4} />
                  {/if}
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Step 3: Volume & Complexity -->
      <div class="border-b border-brand-dark/10 pb-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- Volume -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <span role="heading" aria-level="3" class="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-brand-dark/45">
              03. Est. Volume
            </span>
            <span class="font-mono text-[0.68rem] font-bold border border-brand-dark/10 px-2 py-0.5 bg-brand-paper">
              {volume} {activeCategory.rates[0]?.unit ?? "units"}
            </span>
          </div>
          <input
            id="volume-slider"
            type="range"
            min="1"
            max={activeCategory.categoryName === "Image Editing" ? "300" : activeCategory.categoryName === "Video Editing" ? "40" : "20"}
            bind:value={volume}
            class="w-full accent-brand-green bg-brand-dark/10 h-0.5 cursor-pointer outline-none"
          />
          <div class="flex justify-between text-[0.68rem] font-mono text-brand-dark/45 mt-2">
            <span>Min: 1</span>
            <span>Max: {activeCategory.categoryName === "Image Editing" ? "300" : activeCategory.categoryName === "Video Editing" ? "40" : "20"}</span>
          </div>
        </div>

        <!-- Complexity -->
        <div>
          <span role="heading" aria-level="3" class="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-brand-dark/45 block mb-4">
            04. Complexity Level
          </span>
          <div class="grid grid-cols-3 gap-2 border border-brand-dark/10 p-1 bg-brand-paper/50">
            {#each pricingPageData.calculator.complexityOptions as option, index}
              <button
                class={cn(
                  "py-2 font-mono text-[0.68rem] uppercase tracking-wider transition-all duration-200 cursor-pointer",
                  selectedComplexity === index
                    ? "bg-brand-dark text-brand-light font-bold"
                    : "hover:bg-brand-dark/5 text-brand-dark/70"
                )}
                onclick={() => selectedComplexity = index}
              >
                {option.label}
              </button>
            {/each}
          </div>
          <p class="text-[0.68rem] text-brand-dark/50 mt-2.5 leading-relaxed italic">
            * {pricingPageData.calculator.complexityOptions[selectedComplexity].description}
          </p>
        </div>
      </div>

      <!-- Step 5: Turnaround and Quote Box -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <!-- Turnaround -->
        <div>
          <span role="heading" aria-level="3" class="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-brand-dark/45 block mb-4">
            05. Priority
          </span>
          <div class="flex flex-col gap-2">
            {#each pricingPageData.calculator.turnaroundOptions as option, index}
              <button
                class={cn(
                  "p-3 text-left border font-mono text-xs flex justify-between items-center transition-all duration-200 cursor-pointer",
                  selectedTurnaround === index
                    ? "border-brand-dark bg-brand-dark text-brand-light font-semibold"
                    : "border-brand-dark/10 text-brand-dark/75 hover:border-brand-dark/30 bg-transparent"
                )}
                onclick={() => selectedTurnaround = index}
              >
                <span>{option.label}</span>
                <span class={cn(
                  "text-[0.65rem]",
                  selectedTurnaround === index ? "text-brand-green" : "text-brand-dark/45"
                )}>
                  {option.multiplier === 1.0 ? "Base" : `+${Math.round((option.multiplier - 1.0) * 100)}%`}
                </span>
              </button>
            {/each}
          </div>
        </div>

        <!-- Quote Box -->
        <div class="border border-brand-dark/10 p-6 flex flex-col justify-between min-h-[11rem] bg-brand-paper relative overflow-hidden">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="font-mono text-[0.68rem] uppercase tracking-[0.15em] text-brand-dark/45">Scope Estimate</span>
              <Sparkles size={11} class="text-brand-green" />
            </div>
            <div class="flex items-baseline gap-1 mt-3">
              <span class="font-display text-4xl sm:text-5xl font-normal text-brand-dark leading-none">
                ${animatedPrice}
              </span>
              <span class="font-mono text-[0.68rem] text-brand-dark/45 uppercase tracking-wider ml-1">USD</span>
            </div>
            <p class="text-[0.68rem] text-brand-dark/50 leading-relaxed mt-3 uppercase tracking-wider font-mono">
              *Estimated cost of work. Subject to final review.
            </p>
          </div>

          <a
            href="/contact?service={activeCategory.categoryName.toLowerCase().replace(' ', '-')}&volume={volume}&complexity={selectedComplexity}&turnaround={selectedTurnaround}"
            class="w-full py-3.5 px-4 mt-6 bg-brand-green text-white text-center font-mono text-[0.68rem] font-bold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 rounded-[0.2rem]"
          >
            Submit Estimate <ArrowRight size={13} />
          </a>
        </div>
      </div>

    </div>
  </div>
</section>
