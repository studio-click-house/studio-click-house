# React / Next.js / Vue Integration

---

## React / Vite

Install:

```bash
npm install @splinetool/react-spline
```

Basic:

```jsx
import Spline from "@splinetool/react-spline";

export default function App() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Spline scene="https://prod.spline.design/REPLACE_ME/scene.splinecode" />
    </div>
  );
}
```

With object interaction + event listeners:

```jsx
import { useRef } from "react";
import Spline from "@splinetool/react-spline";

export default function App() {
  const splineRef = useRef();

  function onLoad(splineApp) {
    splineRef.current = splineApp;
  }

  function triggerAnimation() {
    splineRef.current.emitEvent("mouseHover", "Cube");
  }

  function onSplineEvent(e) {
    console.log("Object interacted:", e.target.name);
  }

  return (
    <div>
      <Spline
        scene="https://prod.spline.design/REPLACE_ME/scene.splinecode"
        onLoad={onLoad}
        onMouseDown={onSplineEvent}
      />
      <button onClick={triggerAnimation}>Trigger</button>
    </div>
  );
}
```

**Lazy loading (recommended for performance):**

```jsx
import { lazy, Suspense } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

export default function Hero() {
  return (
    <Suspense
      fallback={
        <div
          style={{ background: "#0a0a0a", width: "100%", height: "100vh" }}
        />
      }
    >
      <Spline scene="https://prod.spline.design/REPLACE_ME/scene.splinecode" />
    </Suspense>
  );
}
```

---

## Next.js

Install:

```bash
npm install @splinetool/react-spline
```

**Use the `/next` import** for SSR support + auto blurred placeholder:

```jsx
import Spline from "@splinetool/react-spline/next";

export default function Page() {
  return (
    <main>
      <Spline scene="https://prod.spline.design/REPLACE_ME/scene.splinecode" />
    </main>
  );
}
```
