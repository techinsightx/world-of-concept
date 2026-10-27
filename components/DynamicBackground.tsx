/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";

/* =========================================================
   DYNAMIC BACKGROUND — HYBRID ENGINE v4.1 (PRODUCTION READY)
   ---------------------------------------------------------
   
   ARCHITECTURE:
   - Single Component, Dual Logic Paths based on Theme.
   
   DARK MODE ENGINE ("Crystal Particle Network"):
   - Visual: Deep Matte Rainbow Background (CSS Variables).
   - Foreground: High-performance Canvas with Atoms, Glyphs, 
     Synaptic Links, and Mentor Pointer Interaction.
   - Vibe: Professional, Educational, Tech-forward.
   
   LIGHT MODE ENGINE ("Luminous Flow Waves"):
   - Visual: Brighter Matte Pastel/Semi-Dark Base (for contrast).
   - Foreground: Smooth, Organic Sine-Wave Layers using Canvas.
   - No Images, No Blurs. Just pure vector motion.
   - Vibe: Calm, Cinematic, Premium Minimalist.
   
   FEATURES:
   - Global Rainbow Cycle Sync (9s interval) shared by both modes.
   - DPR Capping (Max 2) for Retina sharpness without lag.
   - IntersectionObserver: Pauses rendering when off-screen.
   - Visibility API: Pauses when tab is hidden.
   - Reduced Motion Support: Static frame or slow drift.
   - Zero Layout Shift: Absolute positioning inside relative parent.
   ========================================================= */

interface DynamicBackgroundProps {
  /** Kept for API compatibility, unused in Hybrid v4 */
  images?: string[];
  /** Kept for API compatibility, unused in Hybrid v4 */
  zoomType?: "in" | "out";
  /** Density multiplier for particles/waves */
  density?: number;
  /** Enable pointer interaction */
  interactive?: boolean;
  /** Show grid lines behind particles (Dark Mode only) */
  showGrid?: boolean;
  /** Extra wrapper classes */
  className?: string;
}

// ==============================
// GLOBAL CONFIGURATION & PALETTES
// ==============================

const CYCLE_INTERVAL_MS = 9000;
const STATIC_CYCLE_INDEX = 5; // Indigo fallback

interface PaletteColor {
  base: string;       // Background color
  accent: string;     // Primary highlight (Dark Mode Aura)
  accent2: string;    // Secondary highlight (Dark Mode Aura)
  wavePrimary: string;// For Light Mode Waves (Fill)
  waveHighlight: string; // For Light Mode Waves (Stroke/Glow)
  glow: string;       // Shadow/Glow color
}

// Unified Rainbow Palette used for BOTH modes
// Dark Mode uses 'base/accent', Light Mode uses 'wave*' fields primarily
const RAINBOW_PALETTE: PaletteColor[] = [
  {
    // Red
    base: "#170709",
    accent: "rgba(239, 68, 68, 0.20)",
    accent2: "rgba(248, 113, 113, 0.12)",
    wavePrimary: "rgba(255, 100, 100, 0.15)",
    waveHighlight: "rgba(255, 150, 150, 0.30)",
    glow: "rgba(239, 68, 68, 0.4)",
  },
  {
    // Orange
    base: "#180d06",
    accent: "rgba(249, 115, 22, 0.18)",
    accent2: "rgba(251, 146, 60, 0.12)",
    wavePrimary: "rgba(255, 140, 50, 0.15)",
    waveHighlight: "rgba(255, 180, 100, 0.30)",
    glow: "rgba(249, 115, 22, 0.4)",
  },
  {
    // Yellow
    base: "#171406",
    accent: "rgba(234, 179, 8, 0.16)",
    accent2: "rgba(250, 204, 21, 0.10)",
    wavePrimary: "rgba(255, 200, 50, 0.12)",
    waveHighlight: "rgba(255, 230, 100, 0.25)",
    glow: "rgba(234, 179, 8, 0.35)",
  },
  {
    // Green
    base: "#06160e",
    accent: "rgba(34, 197, 94, 0.18)",
    accent2: "rgba(74, 222, 128, 0.12)",
    wavePrimary: "rgba(50, 200, 100, 0.15)",
    waveHighlight: "rgba(100, 230, 150, 0.30)",
    glow: "rgba(34, 197, 94, 0.4)",
  },
  {
    // Blue
    base: "#061020",
    accent: "rgba(59, 130, 246, 0.20)",
    accent2: "rgba(96, 165, 250, 0.12)",
    wavePrimary: "rgba(80, 150, 255, 0.15)",
    waveHighlight: "rgba(120, 180, 255, 0.30)",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  {
    // Indigo
    base: "#0a0a1f",
    accent: "rgba(99, 102, 241, 0.22)",
    accent2: "rgba(129, 140, 248, 0.14)",
    wavePrimary: "rgba(100, 110, 255, 0.18)",
    waveHighlight: "rgba(140, 150, 255, 0.35)",
    glow: "rgba(99, 102, 241, 0.45)",
  },
  {
    // Violet
    base: "#13081d",
    accent: "rgba(168, 85, 247, 0.22)",
    accent2: "rgba(192, 132, 252, 0.14)",
    wavePrimary: "rgba(180, 100, 255, 0.18)",
    waveHighlight: "rgba(210, 140, 255, 0.35)",
    glow: "rgba(168, 85, 247, 0.45)",
  },
];

type CycleListener = (index: number) => void;
const cycleListeners = new Set<CycleListener>();
let cycleIndex = 0;
let cycleTimer: number | null = null;

function ensureCycleTimer() {
  if (typeof window === "undefined") return;
  if (cycleTimer !== null) return;

  cycleTimer = window.setInterval(() => {
    cycleIndex = (cycleIndex + 1) % RAINBOW_PALETTE.length;
    cycleListeners.forEach((listener) => listener(cycleIndex));
  }, CYCLE_INTERVAL_MS);
}

function subscribeCycle(listener: CycleListener) {
  cycleListeners.add(listener);
  listener(cycleIndex); // Immediate sync
  ensureCycleTimer();

  return () => {
    cycleListeners.delete(listener);
    if (cycleListeners.size === 0 && cycleTimer !== null) {
      window.clearInterval(cycleTimer);
      cycleTimer = null;
    }
  };
}

// ==============================
// PARTICLE SYSTEM DEFINITIONS (DARK MODE)
// ==============================

interface Particle {
  nx: number;
  ny: number;
  vx: number;
  vy: number;
  base: number;
  phase: number;
  spin: number;
  glyph: string | null;
  hue: number;
}

const GLYPHS = ["π", "Σ", "√", "∫", "α", "β", "Δ", "Ω", "∞", "x²", "e", "i", "θ", "λ", "μ", "φ", "ƒ", "≈", "±", "∇"];

const NODE_RGB: Array<[number, number, number]> = [
  [129, 140, 248], // indigo-400
  [34, 211, 238],  // cyan-400
  [244, 114, 182], // pink-400
  [167, 139, 250], // violet-400
  [45, 212, 191],  // teal-400
];

const GLOW_RGB: Array<[number, number, number]> = [
  [99, 102, 241],   // indigo-500
  [14, 165, 233],   // sky-500
  [236, 72, 153],   // pink-500
  [139, 92, 246],   // violet-500
  [20, 184, 166],   // teal-500
];

const LINK_RGB: [number, number, number] = [99, 102, 241];
const LINK_STRONG_RGB: [number, number, number] = [34, 211, 238];
const MENTOR_RGB: [number, number, number] = [251, 146, 60];
const GLYPH_FILL = "rgba(226, 232, 240, 0.95)";
const GRID_STROKE = "rgba(255, 255, 255, 0.04)";

const LINK_DIST = 132;
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
const MENTOR_RADIUS = 170;
const MENTOR_RADIUS_SQ = MENTOR_RADIUS * MENTOR_RADIUS;
const GLYPH_RATIO = 0.24;
const MAX_DT = 0.05;
const DPR_CAP = 2;

function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createParticle(): Particle {
  const isGlyph = Math.random() < GLYPH_RATIO;
  return {
    nx: Math.random(),
    ny: Math.random(),
    vx: rand(-0.022, 0.022),
    vy: rand(-0.022, 0.022),
    base: isGlyph ? rand(9, 13) : rand(2.2, 4.4),
    phase: rand(0, Math.PI * 2),
    spin: rand(0.25, 0.9) * (Math.random() < 0.5 ? -1 : 1),
    glyph: isGlyph ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : null,
    hue: (Math.random() * NODE_RGB.length) | 0,
  };
}

function desiredParticleCount(width: number, density: number) {
  const safeDensity = clamp(density, 0.4, 1.6);
  const base = width < 480 ? 28 : width < 768 ? 42 : width < 1280 ? 62 : 78;
  return Math.max(14, Math.round(base * safeDensity));
}

// ==============================
// WAVE SYSTEM CONSTANTS (LIGHT MODE)
// ==============================
const WAVE_COUNT = 3;
const SPEED_BASE = 0.0012;
const AMPLITUDE_BASE = 0.12;

export default function DynamicBackground({
  density = 1,
  interactive = true,
  showGrid = true,
  className = "",
}: DynamicBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Refs for state management without re-renders
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const timeRef = useRef(0);
  
  const reducedRef = useRef(false);
  const visibleRef = useRef(true);
  const onScreenRef = useRef(true);
  const themeRef = useRef<"light" | "dark">("light");
  const currentPaletteRef = useRef<PaletteColor>(RAINBOW_PALETTE[0]);

  /* =====================================================
     1. INITIALIZATION & OBSERVERS
     ===================================================== */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced Motion Detection
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduced = () => {
      reducedRef.current = mq.matches;
      if (reducedRef.current) stopLoop();
      else startLoop();
    };
    updateReduced();
    mq.addEventListener?.("change", updateReduced);

    // Theme Detection
    const readTheme = (): "light" | "dark" =>
      document.documentElement.classList.contains("dark") ? "dark" : "light";
    
    themeRef.current = readTheme();

    const observer = new MutationObserver(() => {
      const nextTheme = readTheme();
      if (nextTheme === themeRef.current) return;
      
      themeRef.current = nextTheme;
      
      // Clear canvas on switch to prevent ghosting
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);

      startLoop(); // Restart loop for new theme
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Subscribe to Global Color Cycle
    const unsubCycle = subscribeCycle((idx) => {
      currentPaletteRef.current = RAINBOW_PALETTE[idx];
    });

    // Visibility Change
    const onVisChange = () => {
      visibleRef.current = !document.hidden;
      if (visibleRef.current) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisChange);

    // Intersection Observer (Performance)
    const io = new IntersectionObserver(([entry]) => {
      onScreenRef.current = entry.isIntersecting;
      if (entry.isIntersecting) startLoop();
      else stopLoop();
    }, { threshold: 0.01 });
    
    if (wrapRef.current) io.observe(wrapRef.current);

    // Resize Handler
    const handleResize = () => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;

      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

      sizeRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Adjust particle count based on new width
      if (themeRef.current === "dark") {
        const target = desiredParticleCount(w, density);
        const particles = particlesRef.current;
        if (particles.length < target) {
          while (particles.length < target) particles.push(createParticle());
        } else if (particles.length > target) {
          particles.length = target;
        }
      }
    };

    const ro = new ResizeObserver(handleResize);
    if (wrapRef.current) ro.observe(wrapRef.current);
    handleResize(); // Initial call

    // Pointer Events
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const touch = 'touches' in e ? e.touches[0] : e;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        mouseRef.current.x = touch.clientX - rect.left;
        mouseRef.current.y = touch.clientY - rect.top;
        mouseRef.current.active = true;
      }
    };
    const onPointerLeave = () => { mouseRef.current.active = false; };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    return () => {
      mq.removeEventListener?.("change", updateReduced);
      observer.disconnect();
      unsubCycle();
      document.removeEventListener("visibilitychange", onVisChange);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      stopLoop();
    };
  }, [density, interactive, showGrid]);

  /* =====================================================
     2. DRAWING HELPERS (SHARED UTILITIES)
     ===================================================== */
  
  // --- DARK MODE: PARTICLE DRAWING ---
  function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (!showGrid) return;
    const step = 44;
    ctx.strokeStyle = GRID_STROKE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = step; x < w; x += step) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
    for (let y = step; y < h; y += step) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
    ctx.stroke();
  }

  function drawEdges(ctx: CanvasRenderingContext2D, points: Array<{ x: number; y: number }>, time: number) {
    const n = points.length;
    for (let i = 0; i < n; i++) {
      const a = points[i];
      for (let j = i + 1; j < n; j++) {
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq > LINK_DIST_SQ) continue;
        const dist = Math.sqrt(distSq);
        const strength = 1 - dist / LINK_DIST;
        const pulse = 0.55 + 0.45 * Math.sin(time * 1.45 + (i + j) * 0.55);
        const alpha = strength * strength * (0.12 + 0.42 * pulse);
        const color = strength > 0.62 ? LINK_STRONG_RGB : LINK_RGB;
        ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
        ctx.lineWidth = 0.55 + strength * 0.95;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  function drawMentorEdges(ctx: CanvasRenderingContext2D, points: Array<{ x: number; y: number }>, mx: number, my: number) {
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const dx = p.x - mx;
      const dy = p.y - my;
      const distSq = dx * dx + dy * dy;
      if (distSq > MENTOR_RADIUS_SQ) continue;
      const dist = Math.sqrt(distSq);
      const strength = 1 - dist / MENTOR_RADIUS;
      ctx.strokeStyle = `rgba(${MENTOR_RGB[0]}, ${MENTOR_RGB[1]}, ${MENTOR_RGB[2]}, ${strength * strength * 0.55})`;
      ctx.lineWidth = 0.75 + strength * 1.35;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }

  function drawAtom(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, core: [number, number, number], glow: [number, number, number], time: number, phase: number, spin: number, pulse: number) {
    const r = radius * (0.88 + 0.22 * pulse);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r * 4.2);
    gradient.addColorStop(0, `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, 0.42)`);
    gradient.addColorStop(0.42, `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, 0.10)`);
    gradient.addColorStop(1, `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r * 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(${core[0]}, ${core[1]}, ${core[2]}, 0.38)`;
    ctx.lineWidth = 0.8;
    const rotation = time * spin + phase;
    for (let shell = 0; shell < 2; shell++) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation + (shell * Math.PI) / 2);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 2.6, r * 1.05, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = `rgba(${core[0]}, ${core[1]}, ${core[2]}, 0.95)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGlyph(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, text: string, glow: [number, number, number], pulse: number) {
    const s = size * (0.9 + 0.18 * pulse);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, s * 2.4);
    gradient.addColorStop(0, `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, 0.24)`);
    gradient.addColorStop(1, `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, s * 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `700 ${s}px ui-sans-serif, system-ui, "Noto Sans Devanagari", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = GLYPH_FILL;
    ctx.fillText(text, x, y + s * 0.04);
  }

  function drawMentorNode(ctx: CanvasRenderingContext2D, mx: number, my: number, time: number) {
    const pulse = 0.5 + 0.5 * Math.sin(time * 2.4);
    const r = 7 + pulse * 3;
    const halo = ctx.createRadialGradient(mx, my, 0, mx, my, MENTOR_RADIUS * 0.48);
    halo.addColorStop(0, `rgba(${MENTOR_RGB[0]}, ${MENTOR_RGB[1]}, ${MENTOR_RGB[2]}, 0.20)`);
    halo.addColorStop(1, `rgba(${MENTOR_RGB[0]}, ${MENTOR_RGB[1]}, ${MENTOR_RGB[2]}, 0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(mx, my, MENTOR_RADIUS * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(${MENTOR_RGB[0]}, ${MENTOR_RGB[1]}, ${MENTOR_RGB[2]}, 0.82)`;
    ctx.lineWidth = 1.45;
    ctx.beginPath();
    ctx.arc(mx, my, r + 6 + pulse * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(${MENTOR_RGB[0]}, ${MENTOR_RGB[1]}, ${MENTOR_RGB[2]}, 1)`;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.beginPath();
    ctx.arc(mx, my, r * 0.38, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderDarkFrame(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, staticFrame: boolean) {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
    drawGrid(ctx, w, h);

    const particles = particlesRef.current;
    const points: Array<{ x: number; y: number }> = new Array(particles.length);
    for (let i = 0; i < particles.length; i++) {
      points[i] = { x: particles[i].nx * w, y: particles[i].ny * h };
    }

    drawEdges(ctx, points, time);

    const mouse = mouseRef.current;
    const mentorActive = interactive && mouse.active && !staticFrame;
    if (mentorActive) drawMentorEdges(ctx, points, mouse.x, mouse.y);

    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      const point = points[i];
      const pulse = staticFrame ? 0.62 : 0.5 + 0.5 * Math.sin(time * 1.8 + particle.phase);
      const core = NODE_RGB[particle.hue % NODE_RGB.length];
      const glow = GLOW_RGB[particle.hue % GLOW_RGB.length];

      if (particle.glyph) {
        drawGlyph(ctx, point.x, point.y, particle.base, particle.glyph, glow, pulse);
      } else {
        drawAtom(ctx, point.x, point.y, particle.base, core, glow, time, particle.phase, particle.spin, pulse);
      }
    }

    if (mentorActive) drawMentorNode(ctx, mouse.x, mouse.y, time);
    ctx.globalCompositeOperation = "source-over";
  }

  function updateDarkPhysics(dt: number, w: number, h: number) {
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const useMouse = interactive && mouse.active;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (useMouse) {
        const px = p.nx * w;
        const py = p.ny * h;
        const dx = mouse.x - px;
        const dy = mouse.y - py;
        const distSq = dx * dx + dy * dy;
        if (distSq < MENTOR_RADIUS_SQ && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / MENTOR_RADIUS) * 0.9;
          p.vx += (dx / dist) * force * dt * 0.6;
          p.vy += (dy / dist) * force * dt * 0.6;
        }
      }
      p.vx *= 0.992;
      p.vy *= 0.992;
      const speed = Math.hypot(p.vx, p.vy);
      if (speed < 0.006) {
        p.vx += rand(-0.004, 0.004);
        p.vy += rand(-0.004, 0.004);
      }
      p.nx += p.vx * dt;
      p.ny += p.vy * dt;
      if (p.nx < 0) { p.nx = 0; p.vx = Math.abs(p.vx); }
      else if (p.nx > 1) { p.nx = 1; p.vx = -Math.abs(p.vx); }
      if (p.ny < 0) { p.ny = 0; p.vy = Math.abs(p.vy); }
      else if (p.ny > 1) { p.ny = 1; p.vy = -Math.abs(p.vy); }
    }
  }

  // --- LIGHT MODE: WAVE DRAWING ---
  function renderLightFrame(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, palette: PaletteColor) {
    ctx.clearRect(0, 0, w, h);

    // Fill base matte color
    ctx.fillStyle = palette.base; 
    ctx.fillRect(0, 0, w, h);

    // Draw Waves
    for (let i = 0; i < WAVE_COUNT; i++) {
      const yOffsetBase = h * (0.4 + i * 0.18);
      const amplitude = h * AMPLITUDE_BASE * (density > 1 ? 1.2 : 1);
      const frequency = 0.0025 + i * 0.0008;
      const speed = SPEED_BASE * (1 + i * 0.4);
      const phaseShift = i * 1.2;

      ctx.beginPath();
      ctx.moveTo(0, h); // Start bottom left
      
      for (let x = 0; x <= w; x += 4) {
        let y = Math.sin(x * frequency + time * speed + phaseShift) * amplitude;
        y += Math.cos(x * frequency * 2.5 + time * speed * 0.7) * (amplitude * 0.25);

        if (mouseRef.current.active) {
          const dx = x - mouseRef.current.x;
          const dy = yOffsetBase + y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250) {
            const force = (1 - dist / 250) * 50;
            y -= force * (dy > 0 ? 1 : -1);
          }
        }

        ctx.lineTo(x, yOffsetBase + y);
      }

      ctx.lineTo(w, h);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, yOffsetBase - amplitude, 0, h);
      gradient.addColorStop(0, palette.waveHighlight);
      gradient.addColorStop(1, palette.wavePrimary);

      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = palette.waveHighlight;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.shadowBlur = 25;
      ctx.shadowColor = palette.glow;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  /* =====================================================
     3. MAIN ANIMATION LOOP
     ===================================================== */
  const step = (timestamp: number) => {
    if (!visibleRef.current || !onScreenRef.current) return;
    if (reducedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    if (w <= 0 || h <= 0) return;

    let dt = lastTsRef.current ? (timestamp - lastTsRef.current) / 1000 : 0.016;
    if (dt > MAX_DT) dt = MAX_DT;
    lastTsRef.current = timestamp;
    timeRef.current += dt;

    const currentTheme = themeRef.current;
    const palette = currentPaletteRef.current;

    if (currentTheme === "dark") {
      updateDarkPhysics(dt, w, h);
      renderDarkFrame(ctx, w, h, timeRef.current, false);
    } else {
      renderLightFrame(ctx, w, h, timeRef.current, palette);
    }

    rafRef.current = requestAnimationFrame(step);
  };

  const startLoop = () => {
    if (rafRef.current == null && !reducedRef.current && visibleRef.current && onScreenRef.current) {
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame(step);
    }
  };

  const stopLoop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // Initial Start
  useEffect(() => {
    if (!reducedRef.current && visibleRef.current && onScreenRef.current) {
      startLoop();
    }
    return stopLoop;
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {/* 
         The Canvas handles BOTH modes.
         In Dark Mode: Draws Particles.
         In Light Mode: Draws Waves.
      */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}