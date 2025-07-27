'use client'; // Client-side component

import { ReactLenis } from 'lenis/react'; // Updated import for lenis package

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // Smoothness factor (0 to 1, lower is smoother)
        duration: 1.5, // Animation duration
        syncTouch: true, // Enable smooth scrolling on touch devices
      }}
    >
      {children}
    </ReactLenis>
  );
}