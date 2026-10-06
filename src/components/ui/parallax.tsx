"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sets --px and --py (-1 → 1, the mouse position across the window) on its element, eased
 * towards the pointer each frame. The CSS reads them (tilt, depth-* in globals.css), so the
 * page only re-renders styles, never React. Mouse only (touch pointers are ignored), and
 * reduced motion keeps the still layout.
 */
export function Parallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    function tick() {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      element!.style.setProperty("--px", current.x.toFixed(4));
      element!.style.setProperty("--py", current.y.toFixed(4));
      const moving = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.001;
      frame = moving ? requestAnimationFrame(tick) : 0;
    }
    function follow(x: number, y: number) {
      target = { x, y };
      if (!frame) frame = requestAnimationFrame(tick);
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      follow((event.clientX / innerWidth) * 2 - 1, (event.clientY / innerHeight) * 2 - 1);
    };
    // The mouse left the window: settle back to the center.
    const onLeave = () => follow(0, 0);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
