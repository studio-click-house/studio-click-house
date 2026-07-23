# Vanilla JS / HTML Integration

Two methods depending on how much control you need.

---

## Method A — Web Component (Recommended for most cases)

No npm required. Just add to HTML. Supports lazy loading, transparent backgrounds, and mouse interactivity.

```html
<!-- In <head> — loads the web component -->
<script
  type="module"
  src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"
></script>

<!-- Basic embed -->
<spline-viewer
  url="https://prod.spline.design/REPLACE_ME/scene.splinecode"
></spline-viewer>

<!-- With mouse-following interactivity (e.g. cursor-tracking robots) -->
<spline-viewer
  url="https://prod.spline.design/REPLACE_ME/scene.splinecode"
  events-target="global"
>
</spline-viewer>

<!-- Transparent background -->
<spline-viewer
  url="https://prod.spline.design/REPLACE_ME/scene.splinecode"
  background="transparent"
>
</spline-viewer>
```

---

## Method B — Runtime API (When you need programmatic control)

Use when you need to manipulate objects, trigger animations, or respond to events from your own JS.

Install:

```bash
npm install @splinetool/runtime
```

Or via CDN (no install):

```html
<script type="module">
  import { Application } from "https://unpkg.com/@splinetool/runtime@latest/build/runtime.module.js";
  // ... rest of your code
</script>
```

Basic usage:

```js
import { Application } from "@splinetool/runtime";

const canvas = document.getElementById("canvas3d");
const spline = new Application(canvas);

spline
  .load("https://prod.spline.design/REPLACE_ME/scene.splinecode")
  .then(() => {
    console.log("Scene loaded");
  });
```

With object interaction:

```js
spline.load(sceneUrl).then(() => {
  const obj = spline.findObjectByName("Cube");
  // or by ID: spline.findObjectById('uuid-here')

  obj.position.x += 50;
  obj.rotation.y += Math.PI / 4; // NOTE: radians, NOT degrees
  obj.scale.x = 2;
});
```

With event listeners:

```js
spline.load(sceneUrl).then(() => {
  spline.addEventListener("mouseDown", (e) => {
    console.log("Clicked:", e.target.name);
  });
});
```

Trigger animations programmatically:

```js
spline.load(sceneUrl).then(() => {
  const obj = spline.findObjectByName("MyObject");
  spline.emitEvent("mouseHover", "MyObject");
});
```
