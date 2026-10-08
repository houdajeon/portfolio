"use client";

import { useEffect, useRef } from "react";

const SHAPE = "M0-6C4-6 6-1 0 6C-6-1-4-6 0-6Z";
const COLORS = ["#f472b6", "#a78bfa", "#9f1239", "#f9a8d4", "#c084fc"];

type Petal = {
  x: number;
  y: number;
  size: number;
  speed: number; // px per second, downwards
  phase: number; // for the side-to-side swing
  swing: number; // px
  angle: number;
  spin: number; // radians per second
  color: string;
  alpha: number;
  windX: number; // sideways push from the wind, fades out
};

/**
 * Petals falling down the whole page, behind the content (a fixed canvas under every
 * section). Scrolling is the wind: the petals drift up with the page and blow sideways,
 * then settle again. One canvas and ~16 shapes per frame, so it costs almost nothing.
 * Nothing moves with reduced motion.
 */
export function PetalSky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const shape = new Path2D(SHAPE);
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    let width = 0;
    let height = 0;
    let ratio = 1;
    const resize = () => {
      ratio = Math.min(2, devicePixelRatio || 1);
      width = innerWidth;
      height = innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    };
    resize();

    const make = (y?: number): Petal => ({
      x: Math.random() * width,
      y: y ?? Math.random() * height,
      size: rand(1, 1.6),
      speed: rand(22, 42),
      phase: rand(0, Math.PI * 2),
      swing: rand(10, 34),
      angle: rand(0, Math.PI * 2),
      spin: rand(-1.4, 1.4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: rand(0.45, 0.8),
      windX: 0,
    });
    const petals = Array.from({ length: width < 700 ? 9 : 16 }, () => make());

    let wind = 0;
    let lastY = scrollY;
    const onScroll = () => {
      const delta = scrollY - lastY;
      lastY = scrollY;
      wind = Math.max(-90, Math.min(90, wind + delta * 0.06));
      for (const petal of petals) petal.y -= delta * rand(0.12, 0.22);
    };

    let last = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      wind *= 0.95;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const petal of petals) {
        petal.y += petal.speed * dt;
        petal.phase += dt * 0.9;
        petal.windX = (petal.windX + wind * dt * 0.6) * 0.985;
        petal.angle += (petal.spin + wind * 0.01) * dt;
        if (petal.y > height + 24) Object.assign(petal, make(-20));
        if (petal.y < -60) Object.assign(petal, make(height + 20));
        const span = width + 40;
        const x =
          ((((petal.x + Math.sin(petal.phase) * petal.swing + petal.windX) % span) + span) % span) -
          20;
        ctx.save();
        ctx.translate(x, petal.y);
        ctx.rotate(petal.angle);
        ctx.scale(petal.size, petal.size);
        ctx.globalAlpha = petal.alpha;
        ctx.fillStyle = petal.color;
        ctx.fill(shape);
        ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 size-full"
    />
  );
}
