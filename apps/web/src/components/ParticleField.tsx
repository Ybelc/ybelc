"use client";

import { useEffect, useRef } from "react";

type RGB = { r: number; g: number; b: number };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: RGB;
};

const CYAN: RGB = { r: 56, g: 189, b: 248 };
const BLUE: RGB = { r: 33, g: 154, b: 231 };
const GOLD: RGB = { r: 250, g: 204, b: 21 };

const LINK_DISTANCE = 168;
const REPEL_RADIUS = 128;
const GRAB_RADIUS = 180;
const MAX_DPR = 1.75;

function rgba(color: RGB, alpha: number) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function pickColor(): RGB {
  const roll = Math.random();
  if (roll < 0.12) return GOLD;
  if (roll < 0.45) return BLUE;
  return CYAN;
}

function particleCount(width: number, height: number) {
  const area = width * height;
  const isNarrow = width < 768;
  const density = isNarrow ? 9000 : 14000;
  const count = Math.round(area / density);
  return Math.max(isNarrow ? 36 : 55, Math.min(isNarrow ? 52 : 96, count));
}

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: particleCount(width, height) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
    radius: 1.2 + Math.random() * 1.8,
    color: pickColor(),
  }));
}

function drawNetwork(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  mouse: { x: number; y: number } | null,
  width: number,
  height: number,
) {
  ctx.fillStyle = "#061018";
  ctx.fillRect(0, 0, width, height);

  if (mouse) {
    const halo = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, GRAB_RADIUS);
    halo.addColorStop(0, "rgba(56, 189, 248, 0.14)");
    halo.addColorStop(0.45, "rgba(33, 154, 231, 0.05)");
    halo.addColorStop(1, "rgba(6, 16, 24, 0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, width, height);
  }

  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];

    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist > LINK_DISTANCE) continue;

      const proximity = 1 - dist / LINK_DISTANCE;
      let boost = 0;
      if (mouse) {
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const toMouse = Math.hypot(midX - mouse.x, midY - mouse.y);
        if (toMouse < GRAB_RADIUS) {
          boost = (1 - toMouse / GRAB_RADIUS) * 0.55;
        }
      }

      const alpha = proximity * (0.18 + boost);
      ctx.strokeStyle = rgba(mix(a.color, b.color, 0.5), alpha);
      ctx.lineWidth = 0.7 + boost * 1.4;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    if (mouse) {
      const dx = a.x - mouse.x;
      const dy = a.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < GRAB_RADIUS) {
        const grab = 1 - dist / GRAB_RADIUS;
        ctx.strokeStyle = rgba(a.color, grab * 0.45);
        ctx.lineWidth = 0.8 + grab;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  for (const p of particles) {
    ctx.beginPath();
    ctx.fillStyle = rgba(p.color, 0.85);
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0, active: false };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = !document.hidden && !reduceMotion;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(width, height);
      drawNetwork(ctx, particles, mouse.active ? mouse : null, width, height);
    };

    const onPointerMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const onPointerLeave = () => {
      mouse.active = false;
    };

    const step = () => {
      if (!running) return;

      const pointer = mouse.active ? mouse : null;

      for (const p of particles) {
        if (pointer) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < REPEL_RADIUS) {
            const force = (1 - dist / REPEL_RADIUS) ** 2 * 2.4;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx + Math.sin(p.y * 0.008) * 0.12;
        p.y += p.vy + Math.cos(p.x * 0.008) * 0.12;

        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;
      }

      drawNetwork(ctx, particles, pointer, width, height);
      frame = window.requestAnimationFrame(step);
    };

    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(frame);
        return;
      }
      if (!running) {
        running = true;
        frame = window.requestAnimationFrame(step);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    if (!reduceMotion) {
      frame = window.requestAnimationFrame(step);
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
