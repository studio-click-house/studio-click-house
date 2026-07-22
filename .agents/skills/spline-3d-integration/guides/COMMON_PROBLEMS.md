# Common Problems & Debugging

These are the real-world issues that only surface after integration. Read this before finishing any Spline implementation.

---

## 🚨 Critical Gotchas (Will Break Your Site)

---

### 1. Scroll Hijacking — Page Won't Scroll

**What happens:** After adding Spline, the whole page stops scrolling. Users are stuck.

**Why:** Spline's auto-generated vanilla JS exports inject `overflow: hidden` into `<body>` CSS by default. This is baked into their generated code.

**Fix:**
```css
/* Add this to your CSS — overrides Spline's injection */
body {
  overflow: auto !important;
}
```

Or in Play Settings (Spline editor → Export → Play Settings), **disable "Page Scroll"** before generating the URL. This removes the overflow rule from the output.

**Also check:** If using the Runtime API and you embedded the generated `index.html` files, open them and manually remove the `overflow: hidden` line from the `<style>` block.

---

### 2. White Box Behind the 3D Scene

**What happens:** Your dark/transparent website has a white rectangle where the Spline scene is.

**Why:** The background color is set to white by default in Spline's export settings.

**Fix:**
1. In Spline editor → Export → Play Settings → toggle **Hide Background** ON
2. Click **Generate Draft** or **Promote to Production** — the URL does NOT auto-update with new settings
3. Copy the new URL

For the web component you can also override inline:
```html
<spline-viewer url="..." background="transparent"></spline-viewer>
```

---

### 3. Spline Scene Intermittently Fails to Load

**What happens:** Page loads fine sometimes, blank or broken other times. Feels random.

**Why:** The `prod.spline.design` CDN occasionally has latency or drops requests. There's no built-in retry or error handling.

**Fix — add a timeout fallback:**
```js
const TIMEOUT_MS = 8000;

const timeoutId = setTimeout(() => {
  // Spline didn't load in time — show fallback
  document.getElementById('spline-fallback').style.display = 'block';
  document.querySelector('.spline-wrapper').style.display = 'none';
}, TIMEOUT_MS);

// If using Runtime API, clear the timeout on successful load:
spline.load(sceneUrl).then(() => {
  clearTimeout(timeoutId);
});
```

**Long-term fix:** Download the `.splinecode` file and self-host it on your own CDN. This eliminates the third-party dependency entirely and also fixes CORS issues.

---

### 4. Scene Looks Fine on Mac, Lags on Everything Else

**What happens:** Buttery smooth on MacBook Pro or M-chip Mac. Completely broken — laggy, stuttering, sometimes crashing — on mid-range Windows laptops or Android phones.

**Why:** Spline uses WebGL which runs on the GPU. Apple Silicon Macs have exceptional GPU performance. Most Windows laptops and Android devices do not have dedicated GPUs.

**Fix — detect capability before loading:**
```js
function shouldLoadSpline() {
  const isMobile = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency <= 2;

  // Optional: test WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  const noWebGL = !gl;

  return !isMobile && !isLowEnd && !noWebGL;
}

if (shouldLoadSpline()) {
  loadSplineScene();
} else {
  showFallback();
}
```

---

### 5. Layout Shift — Page Jumps When Scene Loads

**What happens:** User sees the page layout, then everything shifts/jumps when the 3D scene loads in.

**Why:** The canvas has no reserved height before loading, so the browser doesn't know how much space to allocate. HTML renders → space collapses → scene loads → everything jumps. This tanks your CLS (Cumulative Layout Shift) Core Web Vitals score.

**Fix — pre-allocate space:**
```css
spline-viewer, canvas.spline-canvas {
  display: block;
  width: 100%;
  height: 100vh; /* or whatever your target height is */
  contain: strict;
}
```
