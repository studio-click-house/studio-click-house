<script lang="ts">
  import { onMount } from "svelte";

  let container = $state<HTMLElement>();
  let primaryOrb = $state<HTMLElement>();
  let secondaryOrb = $state<HTMLElement>();

  onMount(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !primaryOrb || !secondaryOrb) return;

    let active = true;
    let animId: number;

    // Mouse coordinates (default to center-left)
    let targetX = window.innerWidth * 0.3;
    let targetY = window.innerHeight * 0.35;
    let currentX = targetX;
    let currentY = targetY;

    // Secondary ambient floating orb coordinates
    let secX = window.innerWidth * 0.75;
    let secY = window.innerHeight * 0.6;
    let targetSecX = secX;
    let targetSecY = secY;

    // Scroll momentum tracker
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastTime = performance.now();
    let isMouseMoving = false;
    let idleTimer: number;

    function handleMouseMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      // Secondary orb naturally counter-balances the mouse
      targetSecX = window.innerWidth - e.clientX * 0.6;
      targetSecY = window.innerHeight - e.clientY * 0.5;

      isMouseMoving = true;
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        isMouseMoving = false;
      }, 3000);
    }

    function handleScroll() {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const currentScrollY = window.scrollY;
      scrollVelocity = (currentScrollY - lastScrollY) / dt;
      lastScrollY = currentScrollY;
      lastTime = now;
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    let time = 0;

    function renderLoop() {
      if (!active) return;
      time += 0.018;

      // Decay scroll velocity smoothly
      scrollVelocity *= 0.92;

      // If mouse is idle (or on touch screens), add gentle continuous ambient wave
      let autoOffsetX = 0;
      let autoOffsetY = 0;
      if (!isMouseMoving) {
        autoOffsetX = Math.sin(time * 0.7) * 90;
        autoOffsetY = Math.cos(time * 0.5) * 70;
      }

      // Smooth physics interpolation (lerp)
      currentX += (targetX + autoOffsetX - currentX) * 0.065;
      currentY += (targetY + autoOffsetY + scrollVelocity * 80 - currentY) * 0.065;

      // Secondary orb breathing animation
      const secPulseX = Math.cos(time * 0.6) * 110;
      const secPulseY = Math.sin(time * 0.8) * 90;
      secX += (targetSecX + secPulseX - secX) * 0.045;
      secY += (targetSecY + secPulseY - secY) * 0.045;

      // Apply hardware-accelerated transforms
      if (primaryOrb) {
        primaryOrb.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${1 + Math.min(Math.abs(scrollVelocity) * 0.08, 0.25)})`;
      }
      if (secondaryOrb) {
        secondaryOrb.style.transform = `translate3d(${secX}px, ${secY}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(renderLoop);
    }

    animId = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(idleTimer);
    };
  });
</script>

<div
  bind:this={container}
  class="pointer-events-none fixed inset-0 z-0 overflow-hidden"
  aria-hidden="true"
>
  <!-- Primary Interactive Studio Spotlight (Tracks Mouse & Scroll Velocity) -->
  <div
    bind:this={primaryOrb}
    class="pointer-events-none absolute left-0 top-0 size-[36rem] sm:size-[46rem] rounded-full will-change-transform"
    style="
      background: radial-gradient(circle, rgba(126, 166, 65, 0.42) 0%, rgba(126, 166, 65, 0.22) 32%, rgba(126, 166, 65, 0.06) 60%, transparent 72%);
      filter: blur(75px);
    "
  ></div>

  <!-- Secondary Counter-Balancing Ambient Bloom -->
  <div
    bind:this={secondaryOrb}
    class="pointer-events-none absolute left-0 top-0 size-[30rem] sm:size-[38rem] rounded-full will-change-transform"
    style="
      background: radial-gradient(circle, rgba(126, 166, 65, 0.28) 0%, rgba(126, 166, 65, 0.12) 38%, transparent 68%);
      filter: blur(85px);
    "
  ></div>
</div>
