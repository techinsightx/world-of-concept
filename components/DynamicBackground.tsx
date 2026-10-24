/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* =========================================================
   DYNAMIC BACKGROUND — Living Education Particle Network
   A crystal-clear canvas "knowledge graph": idea-nodes
   (atoms + math glyphs) linked by synaptic edges, guided by
   a mentor-node that follows the pointer. Theme-aware,
   reduced-motion safe, performance hardened.
   ========================================================= */

interface DynamicBackgroundProps {
  /** Slideshow images (used in light mode only). */
  images: string[];
  /** Ken-burns direction for the slideshow. */
  zoomType?: "in" | "out";
  /** Particle density multiplier (0.4 – 1.6). Default 1. */
  density?: number;
  /** Enable pointer/touch mentor interaction. Default true. */
  interactive?: boolean;
  /** Draw the graph-paper / blueprint grid. Default true. */
  showGrid?: boolean;
  /** Extra classes on the wrapper. */
  className?: string;
}

type Theme = "light" | "dark";

interface Particle {
  nx: number; // normalized x [0..1]
  ny: number; // normalized y [0..1]
  vx: number; // normalized velocity / sec
  vy: number;
  base: number; // base radius in px
  phase: number; // pulse / orbit phase
  spin: number; // electron-shell rotation speed
  glyph: string | null; // null = atom node, else concept glyph
  hue: number; // palette index 0..n-1
}

interface Palette {
  bgGrid: string;
  link: [number, number, number]; // rgb
  linkStrong: [number, number, number];
  node: Array<[number, number, number]>; // per-hue core rgb
  nodeGlow: Array<[number, number, number]>;
  glyph: string;
  mentor: [number, number, number];
  composite: GlobalCompositeOperation;
}

const PALETTES: Record<Theme, Palette> = {
  light: {
    bgGrid: "rgba(99,102,241,0.07)",
    link: [99, 102, 241],
    linkStrong: [217, 70, 239],
    node: [
      [67, 56, 202], // indigo-800
      [124, 58, 237], // violet-600
      [13, 148, 136], // teal-600
      [217, 70, 239], // fuchsia-600
      [2, 132, 199], // sky-700
    ],
    nodeGlow: [
      [99, 102, 241],
      [139, 92, 246],
      [20, 184, 166],
      [232, 121, 249],
      [14, 165, 233],
    ],
    glyph: "rgba(30,27,75,0.92)",
    mentor: [234, 88, 12], // orange-600 (RK brand)
    composite: "source-over",
  },
  dark: {
    bgGrid: "rgba(129,140,248,0.06)",
    link: [99, 102, 241],
    linkStrong: [34, 211, 238],
    node: [
      [129, 140, 248], // indigo-400
      [192, 132, 252], // purple-400
      [45, 212, 191], // teal-400
      [244, 114, 182], // pink-400
      [56, 189, 248], // sky-400
    ],
    nodeGlow: [
      [99, 102, 241],
      [168, 85, 247],
      [20, 184, 166],
      [236, 72, 153],
      [14, 165, 233],
    ],
    glyph: "rgba(226,232,240,0.95)",
    mentor: [251, 146, 60], // orange-400
    composite: "lighter",
  },
};

const GLYPHS = [
  "π", "Σ", "√", "∫", "α", "β", "Δ", "Ω",
  "∞", "x²", "e", "i", "θ", "λ", "μ", "φ",
  "ƒ", "", "≈", "±",
];

/* ---------- tuning constants ---------- */
const LINK_DIST = 132; // px
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
const MENTOR_RADIUS = 168; // px
const MENTOR_RADIUS_SQ = MENTOR_RADIUS * MENTOR_RADIUS;
const GLYPH_RATIO = 0.24; // fraction of nodes that are glyphs
const MAX_DT = 0.05; // seconds, clamp after tab-switch
const DPR_CAP = 2;

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeParticle(hueCount: number): Particle {
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
    hue: (Math.random() * hueCount) | 0,
  };
}

function targetCount(w: number) {
  // responsive density: fewer on phones, richer on desktop
  const base = w < 480 ? 30 : w < 768 ? 46 : w < 1280 ? 66 : 84;
  return base;
}

export default function DynamicBackground({
  images,
  zoomType = "in",
  density = 1,
  interactive = true,
  showGrid = true,
  className = "",
}: DynamicBackgroundProps) {
  const [index, setIndex] = useState(0);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // mutable animation state (no re-renders)
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const themeRef = useRef<Theme>("light");
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const reducedRef = useRef(false);
  const visibleRef = useRef(true);
  const onScreenRef = useRef(true);

  /* ---------- slideshow rotation (light mode) ---------- */
  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((p) => (p + 1) % images.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, [images.length]);

  /* ---------- main engine ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    /* ----- theme detection (class strategy) ----- */
    const readTheme = (): Theme =>
      document.documentElement.classList.contains("dark") ? "dark" : "light";
    themeRef.current = readTheme();

    const themeObs = new MutationObserver(() => {
      const t = readTheme();
      if (t !== themeRef.current) {
        themeRef.current = t;
        if (reducedRef.current) drawFrame(performance.now() / 1000, true);
      }
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    /* ----- reduced motion ----- */
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyReduced = () => {
      reducedRef.current = rmq.matches;
      if (rmq.matches) stopLoop();
      else startLoop();
    };
    applyReduced();
    if (rmq.addEventListener) rmq.addEventListener("change", applyReduced);
    else rmq.addListener(applyReduced);

    /* ----- sizing (normalized physics => resize is jump-free) ----- */
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // reconcile particle count to width * density
      const want = Math.round(targetCount(w) * clamp01((density + 0.6) / 1.6) * 1.4 + targetCount(w) * (density - 1) * 0.4);
      const target = Math.max(14, Math.round(targetCount(w) * density));
      const arr = particlesRef.current;
      if (arr.length < target) {
        const hueCount = PALETTES[themeRef.current].node.length;
        while (arr.length < target) arr.push(makeParticle(hueCount));
      } else if (arr.length > target) {
        arr.length = target;
      }

      if (reducedRef.current) drawFrame(0, true);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    /* ----- pointer / touch mentor ----- */
    const onPointer = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    if (interactive) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onPointer, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);
    }

    /* ----- visibility + on-screen pause ----- */
    const onVis = () => {
      visibleRef.current = !document.hidden;
      if (visibleRef.current && onScreenRef.current && !reducedRef.current) {
        lastTsRef.current = 0;
        startLoop();
      } else stopLoop();
    };
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreenRef.current = entry.isIntersecting;
        if (entry.isIntersecting && visibleRef.current && !reducedRef.current) {
          lastTsRef.current = 0;
          startLoop();
        } else stopLoop();
      },
      { threshold: 0.01 }
    );
    io.observe(wrap);

    /* ================= DRAW ================= */

    function drawGrid(p: Palette, w: number, h: number) {
      if (!showGrid) return;
      const step = 42;
      ctx!.strokeStyle = p.bgGrid;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      for (let x = step; x < w; x += step) {
        ctx!.moveTo(x + 0.5, 0);
        ctx!.lineTo(x + 0.5, h);
      }
      for (let y = step; y < h; y += step) {
        ctx!.moveTo(0, y + 0.5);
        ctx!.lineTo(w, y + 0.5);
      }
      ctx!.stroke();
    }

    function drawEdges(
      pts: Array<{ x: number; y: number }>,
      p: Palette,
      t: number
    ) {
      const n = pts.length;
      for (let i = 0; i < n; i++) {
        const a = pts[i];
        for (let j = i + 1; j < n; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST_SQ) continue;
          const d = Math.sqrt(d2);
          const k = 1 - d / LINK_DIST; // 0..1
          // travelling "impulse" makes links feel alive
          const pulse = 0.55 + 0.45 * Math.sin(t * 1.6 + (i + j) * 0.7);
          const alpha = k * k * (0.18 + 0.5 * pulse);
          const mix = k > 0.62 ? p.linkStrong : p.link;
          ctx!.strokeStyle = `rgba(${mix[0]},${mix[1]},${mix[2]},${alpha})`;
          ctx!.lineWidth = 0.6 + k * 1.1;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }
    }

    function drawMentorEdges(
      pts: Array<{ x: number; y: number }>,
      p: Palette,
      mx: number,
      my: number
    ) {
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const dx = a.x - mx;
        const dy = a.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 > MENTOR_RADIUS_SQ) continue;
        const d = Math.sqrt(d2);
        const k = 1 - d / MENTOR_RADIUS;
        const [r, g, b] = p.mentor;
        ctx!.strokeStyle = `rgba(${r},${g},${b},${k * k * 0.7})`;
        ctx!.lineWidth = 0.8 + k * 1.6;
        ctx!.beginPath();
        ctx!.moveTo(mx, my);
        ctx!.lineTo(a.x, a.y);
        ctx!.stroke();
      }
    }

    function drawAtom(
      x: number,
      y: number,
      r: number,
      core: [number, number, number],
      glow: [number, number, number],
      t: number,
      phase: number,
      spin: number,
      pulse: number
    ) {
      const rr = r * (0.85 + 0.3 * pulse);
      // outer glow
      const g = ctx!.createRadialGradient(x, y, 0, x, y, rr * 4.2);
      g.addColorStop(0, `rgba(${glow[0]},${glow[1]},${glow[2]},0.55)`);
      g.addColorStop(0.4, `rgba(${glow[0]},${glow[1]},${glow[2]},0.12)`);
      g.addColorStop(1, `rgba(${glow[0]},${glow[1]},${glow[2]},0)`);
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(x, y, rr * 4.2, 0, Math.PI * 2);
      ctx!.fill();
      // electron shells
      ctx!.strokeStyle = `rgba(${core[0]},${core[1]},${core[2]},0.5)`;
      ctx!.lineWidth = 0.8;
      const rot = t * spin + phase;
      for (let s = 0; s < 2; s++) {
        ctx!.save();
        ctx!.translate(x, y);
        ctx!.rotate(rot + (s * Math.PI) / 2);
        ctx!.beginPath();
        ctx!.ellipse(0, 0, rr * 2.6, rr * 1.05, 0, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.restore();
      }
      // core
      ctx!.fillStyle = `rgba(${core[0]},${core[1]},${core[2]},0.95)`;
      ctx!.beginPath();
      ctx!.arc(x, y, rr, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "rgba(255,255,255,0.85)";
      ctx!.beginPath();
      ctx!.arc(x - rr * 0.3, y - rr * 0.3, rr * 0.32, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawGlyph(
      x: number,
      y: number,
      size: number,
      text: string,
      p: Palette,
      pulse: number
    ) {
      const s = size * (0.9 + 0.18 * pulse);
      // halo
      const [gr, gg, gb] = p.nodeGlow[0];
      const g = ctx!.createRadialGradient(x, y, 0, x, y, s * 2.4);
      g.addColorStop(0, `rgba(${gr},${gg},${gb},0.30)`);
      g.addColorStop(1, `rgba(${gr},${gg},${gb},0)`);
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(x, y, s * 2.4, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.font = `700 ${s}px "Noto Sans Devanagari", ui-sans-serif, system-ui, sans-serif`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillStyle = p.glyph;
      ctx!.fillText(text, x, y + s * 0.04);
    }

    function drawMentorNode(
      mx: number,
      my: number,
      p: Palette,
      t: number
    ) {
      const [r, g, b] = p.mentor;
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
      const rr = 7 + pulse * 3;
      const halo = ctx!.createRadialGradient(mx, my, 0, mx, my, MENTOR_RADIUS * 0.5);
      halo.addColorStop(0, `rgba(${r},${g},${b},0.22)`);
      halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(mx, my, MENTOR_RADIUS * 0.5, 0, Math.PI * 2);
      ctx!.fill();
      // ring
      ctx!.strokeStyle = `rgba(${r},${g},${b},0.85)`;
      ctx!.lineWidth = 1.6;
      ctx!.beginPath();
      ctx!.arc(mx, my, rr + 6 + pulse * 4, 0, Math.PI * 2);
      ctx!.stroke();
      // core
      ctx!.fillStyle = `rgba(${r},${g},${b},1)`;
      ctx!.beginPath();
      ctx!.arc(mx, my, rr, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "rgba(255,255,255,0.9)";
      ctx!.beginPath();
      ctx!.arc(mx, my, rr * 0.4, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawFrame(timeSec: number, staticOnly = false) {
      const { w, h } = sizeRef.current;
      if (w <= 0 || h <= 0) return;
      const p = PALETTES[themeRef.current];
      const parts = particlesRef.current;
      const t = timeSec;

      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "source-over";
      drawGrid(p, w, h);

      // pixel positions
      const pts: Array<{ x: number; y: number }> = new Array(parts.length);
      for (let i = 0; i < parts.length; i++) {
        pts[i] = { x: parts[i].nx * w, y: parts[i].ny * h };
      }

      ctx!.globalCompositeOperation = p.composite;
      drawEdges(pts, p, t);

      const m = mouseRef.current;
      if (interactive && m.active && !staticOnly) {
        drawMentorEdges(pts, p, m.x, m.y);
      }

      for (let i = 0; i < parts.length; i++) {
        const pt = parts[i];
        const { x, y } = pts[i];
        const pulse = staticOnly ? 0.6 : 0.5 + 0.5 * Math.sin(t * 1.8 + pt.phase);
        if (pt.glyph) {
          drawGlyph(x, y, pt.base, pt.glyph, p, pulse);
        } else {
          drawAtom(
            x,
            y,
            pt.base,
            p.node[pt.hue % p.node.length],
            p.nodeGlow[pt.hue % p.nodeGlow.length],
            t,
            pt.phase,
            pt.spin,
            pulse
          );
        }
      }

      if (interactive && m.active && !staticOnly) {
        drawMentorNode(m.x, m.y, p, t);
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    /* ================= STEP ================= */

    function step(timeMs: number) {
      const { w, h } = sizeRef.current;
      const t = timeMs / 1000;
      let dt = lastTsRef.current ? (timeMs - lastTsRef.current) / 1000 : 0.016;
      if (dt > MAX_DT) dt = MAX_DT;
      lastTsRef.current = timeMs;

      const parts = particlesRef.current;
      const m = mouseRef.current;
      const useMouse = interactive && m.active;

      for (let i = 0; i < parts.length; i++) {
        const pt = parts[i];
        if (useMouse) {
          const px = pt.nx * w;
          const py = pt.ny * h;
          const dx = m.x - px;
          const dy = m.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < MENTOR_RADIUS_SQ && d2 > 1) {
            const d = Math.sqrt(d2);
            const force = (1 - d / MENTOR_RADIUS) * 0.9; // gentle pull
            pt.vx += (dx / d) * force * dt * 0.6;
            pt.vy += (dy / d) * force * dt * 0.6;
          }
        }
        // damping so it never runs away
        pt.vx *= 0.992;
        pt.vy *= 0.992;
        // keep a minimum drift so the field stays alive
        const sp = Math.hypot(pt.vx, pt.vy);
        if (sp < 0.006) {
          pt.vx += rand(-0.004, 0.004);
          pt.vy += rand(-0.004, 0.004);
        }

        pt.nx += pt.vx * dt;
        pt.ny += pt.vy * dt;

        // bounce inside the box
        if (pt.nx < 0) { pt.nx = 0; pt.vx = Math.abs(pt.vx); }
        else if (pt.nx > 1) { pt.nx = 1; pt.vx = -Math.abs(pt.vx); }
        if (pt.ny < 0) { pt.ny = 0; pt.vy = Math.abs(pt.vy); }
        else if (pt.ny > 1) { pt.ny = 1; pt.vy = -Math.abs(pt.vy); }
      }

      drawFrame(t, false);
      rafRef.current = requestAnimationFrame(step);
    }

    function startLoop() {
      if (rafRef.current != null || reducedRef.current) return;
      if (!visibleRef.current || !onScreenRef.current) return;
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame(step);
    }
    function stopLoop() {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    startLoop();

    /* ================= CLEANUP ================= */
    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (interactive) {
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("pointerdown", onPointer);
      }
      if (rmq.removeEventListener) rmq.removeEventListener("change", applyReduced);
      else rmq.removeListener(applyReduced);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density, interactive, showGrid]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {/* ---- LIGHT: image slideshow + readability wash ---- */}
      <div className="dark:hidden absolute inset-0">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`absolute inset-0 object-cover transition-opacity duration-[3000ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            } ${zoomType === "in" ? "animate-ken-burns-in" : "animate-ken-burns-out"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/45 to-white/75" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_30%,rgba(255,255,255,0.6)_100%)]" />
      </div>

      {/* ---- DARK: nebula backdrop (particles draw on top via canvas) ---- */}
      <div className="hidden dark:block absolute inset-0">
        <div className="absolute inset-0 animate-nebula-shift" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_15%,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_85%_85%,rgba(34,211,238,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[1px]" />
      </div>

      {/* ---- CANVAS: living education particle network ---- */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 h-full w-full"
        style={{ pointerEvents: "none" }}
      />

      {/* ---- top vignette for text legibility (theme aware via dark:) ---- */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/15 via-transparent to-transparent dark:from-slate-950/40" />
    </div>
  );
}