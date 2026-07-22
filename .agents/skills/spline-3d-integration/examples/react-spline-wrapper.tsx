// react-spline-wrapper.tsx
// Production-ready Spline wrapper for React / Next.js
// Features: lazy loading, mobile detection, GPU check, fallback, fade-in on load
//
// Usage:
//   <SplineBackground sceneUrl="https://prod.spline.design/XXXXX/scene.splinecode" />

import { lazy, Suspense, useState, useEffect, useRef } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineBackgroundProps {
  sceneUrl: string;
  fallbackColor?: string;
  fallbackImageUrl?: string;
  mobileBreakpoint?: number;
  className?: string;
  children?: React.ReactNode;
}

function shouldLoadSpline(mobileBreakpoint: number): boolean {
  if (typeof window === 'undefined') return false; // SSR guard

  const isMobile = window.innerWidth < mobileBreakpoint;
  const isLowEnd = navigator.hardwareConcurrency <= 2;

  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  const noWebGL = !gl;

  return !isMobile && !isLowEnd && !noWebGL;
}

export default function SplineBackground({
  sceneUrl,
  fallbackColor = '#0a0a0a',
  fallbackImageUrl,
  mobileBreakpoint = 768,
  className = '',
  children,
}: SplineBackgroundProps) {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineFailed, setSplineFailed] = useState(false);
  const [canLoad, setCanLoad] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (shouldLoadSpline(mobileBreakpoint)) {
      setCanLoad(true);

      // Safety timeout: fallback if Spline stalls for 8s
      timeoutRef.current = setTimeout(() => {
        if (!splineLoaded) {
          setSplineFailed(true);
        }
      }, 8000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mobileBreakpoint, splineLoaded]);

  function handleLoad() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSplineLoaded(true);
  }

  return (
    <div
      className={`relative w-full h-full min-h-screen overflow-hidden ${className}`}
      style={{ backgroundColor: fallbackColor }}
    >
      {/* Static Fallback Layer */}
      {fallbackImageUrl && (!splineLoaded || splineFailed) && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700"
          style={{ backgroundImage: `url(${fallbackImageUrl})` }}
        />
      )}

      {/* Spline 3D Layer */}
      {canLoad && !splineFailed && (
        <div
          className={`absolute inset-0 z-0 transition-opacity duration-700 ${
            splineLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Suspense fallback={null}>
            <Spline scene={sceneUrl} onLoad={handleLoad} />
          </Suspense>
        </div>
      )}

      {/* Content Overlay */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
