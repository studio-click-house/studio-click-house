// interactive-scene.tsx
// Full interactive Spline example — React
// Demonstrates: events, object manipulation, animation triggers, variable access
//
// Usage: drop this into a React/Next.js project and replace the scene URL

import { useRef, useState, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';

const SCENE_URL = 'https://prod.spline.design/REPLACE_ME/scene.splinecode';

export default function InteractiveScene() {
  const splineApp = useRef<Application>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastEvent, setLastEvent] = useState<string>('');

  // --- Called when scene finishes loading ---
  function onLoad(app: Application) {
    splineApp.current = app;
    setIsLoaded(true);
    console.log('Scene loaded');
  }

  // --- Listen to events from inside the Spline scene ---
  function onMouseDown(e: any) {
    setLastEvent(`mouseDown on: ${e.target?.name}`);
    console.log('mouseDown event:', e.target);
  }

  function onMouseHover(e: any) {
    setLastEvent(`mouseHover on: ${e.target?.name}`);
  }

  // --- Programmatically move an object ---
  const moveObject = useCallback(() => {
    if (!splineApp.current) return;

    const obj = splineApp.current.findObjectByName('Cube');
    if (!obj) return console.warn('Object "Cube" not found — check the name in Spline editor');

    obj.position.x += 50; // move right
  }, []);

  // --- Trigger an animation event ---
  const triggerAnimation = useCallback(() => {
    if (!splineApp.current) return;
    splineApp.current.emitEvent('mouseHover', 'Cube'); // triggers the mouseHover event on 'Cube'
  }, []);

  // --- Trigger animation in reverse (useful for toggle effects) ---
  const reverseAnimation = useCallback(() => {
    if (!splineApp.current) return;
    splineApp.current.emitEventReverse('mouseHover', 'Cube');
  }, []);

  // --- Rotate object (RADIANS not degrees!) ---
  const rotateObject = useCallback(() => {
    if (!splineApp.current) return;
    const obj = splineApp.current.findObjectByName('Cube');
    if (obj) obj.rotation.y += Math.PI / 4;
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {/* 3D Container */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
        <Spline
          scene={SCENE_URL}
          onLoad={onLoad}
          onMouseDown={onMouseDown}
          onMouseHover={onMouseHover}
        />
      </div>

      {/* Status Info */}
      <p className="text-sm text-neutral-400">
        Status: {isLoaded ? 'Loaded' : 'Loading...'} | Last Event: {lastEvent || 'None'}
      </p>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={moveObject}
          disabled={!isLoaded}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white font-medium transition-colors disabled:opacity-50"
        >
          Move Object Right (+50px)
        </button>

        <button
          onClick={rotateObject}
          disabled={!isLoaded}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white font-medium transition-colors disabled:opacity-50"
        >
          Rotate Object (45°)
        </button>

        <button
          onClick={triggerAnimation}
          disabled={!isLoaded}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white font-medium transition-colors disabled:opacity-50"
        >
          Trigger Hover Event
        </button>

        <button
          onClick={reverseAnimation}
          disabled={!isLoaded}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-sm text-white font-medium transition-colors disabled:opacity-50"
        >
          Reverse Hover Event
        </button>
      </div>
    </div>
  );
}
