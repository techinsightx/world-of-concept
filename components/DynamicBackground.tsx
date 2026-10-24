/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* =========================================================
   DYNAMIC BACKGROUND — CRYSTAL CLEAR MODE-SPLIT ENGINE
   ---------------------------------------------------------
   LIGHT MODE:
   - Only cinematic image slider is visible.
   - Particle canvas is faded out and animation loop is stopped.

   DARK MODE:
   - Only cinematic live education particle network is visible.
   - Image slider is faded out.

   FEATURES:
   - Smooth 700ms mode crossfade.
   - Smooth 2500ms image crossfade.
   - Crystal-clear transparent canvas.
   - Atom + math-glyph education nodes.
   - Synaptic node-to-node connections.
   - Pointer mentor node attracts nearby ideas.
   - Theme-aware via MutationObserver.
   - Reduced-motion safe.
   - Visibility + IntersectionObserver paused.
   - DPR-capped, normalized physics, no resize jumps.
   ========================================================= */

interface DynamicBackgroundProps {
  /** Slideshow images. Used visually in light mode. */
  images: string[];
  /** Ken Burns direction for slideshow. */
  zoomType?: "in" | "out";
  /** Particle density multiplier. 0.4 = light, 1 = normal, 1.6 = rich. */
  density?: number;
  /** Enable pointer/touch mentor interaction. */
  interactive?: boolean;
  /** Draw subtle graph-paper / blueprint grid behind particles. */
  showGrid?: boolean;
  /** Extra wrapper classes. */
  className?: string;
}

interface Particle {
  nx: number; // normalized x [0..1]
  ny: number; // normalized y [0..1]
  vx: number; // normalized velocity / sec
  vy: number;
  base: number; // base radius in px
  phase: number; // pulse / orbit phase
  spin: number; // electron-shell rotation speed
  glyph: string | null; // null = atom node, else concept glyph
  hue: number; // palette index
}

/* ---------- Education-themed concept glyphs ---------- */
const GLYPHS = [
  "π",
  "Σ",
  "√",
  "∫",
  "α",
  "β",
  "Δ",
  "Ω",
  "∞",
  "x²",
  "e",
  "i",
  "θ",
  "λ",
  "μ",
  "φ",
  "ƒ",
  "≈",
  "±",
  "∇",
];

/* ---------- Dark-mode crystal neon palette ---------- */
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
const GRID_STROKE = "rgba(129, 140, 248, 0.055)";

/* ---------- Physics / render tuning ---------- */
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

  const base =
    width < 480
      ? 28
      : width < 768
        ? 42
        : width < 1280
          ? 62
          : 78;

  return Math.max(14, Math.round(base * safeDensity));
}

export default function DynamicBackground({
  images,
  zoomType = "in",
  density = 1,
  interactive = true,
  showGrid = true,
  className = "",
}: DynamicBackgroundProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);

  const reducedRef = useRef(false);
  const visibleRef = useRef(true);
  const onScreenRef = useRef(true);
  const themeRef = useRef<"light" | "dark">("light");

  /* =====================================================
     1. REDUCED MOTION DETECTION
     ===================================================== */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      reducedRef.current = mq.matches;
      setReducedMotion(mq.matches);
    };

    update();

    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    // Legacy Safari fallback
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  /* =====================================================
     2. LIGHT-MODE IMAGE SLIDESHOW
     ===================================================== */
  useEffect(() => {
    if (images.length <= 1 || reducedMotion) return;

    const id = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => window.clearInterval(id);
  }, [images.length, reducedMotion]);

  /* =====================================================
     3. DARK-MODE PARTICLE ENGINE
     ===================================================== */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;

    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let disposed = false;

    const readTheme = (): "light" | "dark" =>
      document.documentElement.classList.contains("dark") ? "dark" : "light";

    themeRef.current = readTheme();

    /* ---------------- Drawing helpers ---------------- */

    function drawGrid(w: number, h: number) {
      if (!showGrid) return;

      const step = 44;

      ctx!.strokeStyle = GRID_STROKE;
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

    function drawEdges(points: Array<{ x: number; y: number }>, time: number) {
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

          const pulse =
            0.55 + 0.45 * Math.sin(time * 1.45 + (i + j) * 0.55);

          const alpha = strength * strength * (0.12 + 0.42 * pulse);
          const color = strength > 0.62 ? LINK_STRONG_RGB : LINK_RGB;

          ctx!.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
          ctx!.lineWidth = 0.55 + strength * 0.95;

          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }
    }

    function drawMentorEdges(
      points: Array<{ x: number; y: number }>,
      mx: number,
      my: number,
    ) {
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        const dx = p.x - mx;
        const dy = p.y - my;
        const distSq = dx * dx + dy * dy;

        if (distSq > MENTOR_RADIUS_SQ) continue;

        const dist = Math.sqrt(distSq);
        const strength = 1 - dist / MENTOR_RADIUS;

        ctx!.strokeStyle = `rgba(${MENTOR_RGB[0]}, ${MENTOR_RGB[1]}, ${MENTOR_RGB[2]}, ${strength * strength * 0.55})`;
        ctx!.lineWidth = 0.75 + strength * 1.35;

        ctx!.beginPath();
        ctx!.moveTo(mx, my);
        ctx!.lineTo(p.x, p.y);
        ctx!.stroke();
      }
    }

    function drawAtom(
      x: number,
      y: number,
      radius: number,
      core: [number, number, number],
      glow: [number, number, number],
      time: number,
      phase: number,
      spin: number,
      pulse: number,
    ) {
      const r = radius * (0.88 + 0.22 * pulse);

      // Outer glow
      const gradient = ctx!.createRadialGradient(x, y, 0, x, y, r * 4.2);
      gradient.addColorStop(
        0,
        `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, 0.42)`,
      );
      gradient.addColorStop(
        0.42,
        `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, 0.10)`,
      );
      gradient.addColorStop(
        1,
        `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, 0)`,
      );

      ctx!.fillStyle = gradient;
      ctx!.beginPath();
      ctx!.arc(x, y, r * 4.2, 0, Math.PI * 2);
      ctx!.fill();

      // Electron shells
      ctx!.strokeStyle = `rgba(${core[0]}, ${core[1]}, ${core[2]}, 0.38)`;
      ctx!.lineWidth = 0.8;

      const rotation = time * spin + phase;

      for (let shell = 0; shell < 2; shell++) {
        ctx!.save();
        ctx!.translate(x, y);
        ctx!.rotate(rotation + (shell * Math.PI) / 2);
        ctx!.beginPath();
        ctx!.ellipse(0, 0, r * 2.6, r * 1.05, 0, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.restore();
      }

      // Core
      ctx!.fillStyle = `rgba(${core[0]}, ${core[1]}, ${core[2]}, 0.95)`;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, Math.PI * 2);
      ctx!.fill();

      // Crystal highlight
      ctx!.fillStyle = "rgba(255, 255, 255, 0.82)";
      ctx!.beginPath();
      ctx!.arc(x - r * 0.3, y - r * 0.3, r * 0.32, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawGlyph(
      x: number,
      y: number,
      size: number,
      text: string,
      glow: [number, number, number],
      pulse: number,
    ) {
      const s = size * (0.9 + 0.18 * pulse);

      // Soft halo
      const gradient = ctx!.createRadialGradient(x, y, 0, x, y, s * 2.4);
      gradient.addColorStop(
        0,
        `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, 0.24)`,
      );
      gradient.addColorStop(
        1,
        `rgba(${glow[0]}, ${glow[1]}, ${glow[2]}, 0)`,
      );

      ctx!.fillStyle = gradient;
      ctx!.beginPath();
      ctx!.arc(x, y, s * 2.4, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.font = `700 ${s}px ui-sans-serif, system-ui, "Noto Sans Devanagari", sans-serif`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillStyle = GLYPH_FILL;
      ctx!.fillText(text, x, y + s * 0.04);
    }

    function drawMentorNode(mx: number, my: number, time: number) {
      const pulse = 0.5 + 0.5 * Math.sin(time * 2.4);
      const r = 7 + pulse * 3;

      // Mentor halo
      const halo = ctx!.createRadialGradient(
        mx,
        my,
        0,
        mx,
        my,
        MENTOR_RADIUS * 0.48,
      );
      halo.addColorStop(
        0,
        `rgba(${MENTOR_RGB[0]}, ${MENTOR_RGB[1]}, ${MENTOR_RGB[2]}, 0.20)`,
      );
      halo.addColorStop(
        1,
        `rgba(${MENTOR_RGB[0]}, ${MENTOR_RGB[1]}, ${MENTOR_RGB[2]}, 0)`,
      );

      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(mx, my, MENTOR_RADIUS * 0.48, 0, Math.PI * 2);
      ctx!.fill();

      // Ring
      ctx!.strokeStyle = `rgba(${MENTOR_RGB[0]}, ${MENTOR_RGB[1]}, ${MENTOR_RGB[2]}, 0.82)`;
      ctx!.lineWidth = 1.45;
      ctx!.beginPath();
      ctx!.arc(mx, my, r + 6 + pulse * 4, 0, Math.PI * 2);
      ctx!.stroke();

      // Core
      ctx!.fillStyle = `rgba(${MENTOR_RGB[0]}, ${MENTOR_RGB[1]}, ${MENTOR_RGB[2]}, 1)`;
      ctx!.beginPath();
      ctx!.arc(mx, my, r, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx!.beginPath();
      ctx!.arc(mx, my, r * 0.38, 0, Math.PI * 2);
      ctx!.fill();
    }

    function drawFrame(timeSeconds: number, staticFrame = false) {
      const { w, h } = sizeRef.current;

      if (disposed || w <= 0 || h <= 0) return;

      const particles = particlesRef.current;
      const time = timeSeconds;

      ctx!.clearRect(0, 0, w, h);

      // Base layer: crisp lines/grid
      ctx!.globalCompositeOperation = "source-over";
      drawGrid(w, h);

      const points: Array<{ x: number; y: number }> = new Array(
        particles.length,
      );

      for (let i = 0; i < particles.length; i++) {
        points[i] = {
          x: particles[i].nx * w,
          y: particles[i].ny * h,
        };
      }

      drawEdges(points, time);

      const mouse = mouseRef.current;
      const mentorActive = interactive && mouse.active && !staticFrame;

      if (mentorActive) {
        drawMentorEdges(points, mouse.x, mouse.y);
      }

      // Glow layer: additive for crystal neon feel
      ctx!.globalCompositeOperation = "lighter";

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const point = points[i];

        const pulse = staticFrame
          ? 0.62
          : 0.5 + 0.5 * Math.sin(time * 1.8 + particle.phase);

        const core = NODE_RGB[particle.hue % NODE_RGB.length];
        const glow = GLOW_RGB[particle.hue % GLOW_RGB.length];

        if (particle.glyph) {
          drawGlyph(
            point.x,
            point.y,
            particle.base,
            particle.glyph,
            glow,
            pulse,
          );
        } else {
          drawAtom(
            point.x,
            point.y,
            particle.base,
            core,
            glow,
            time,
            particle.phase,
            particle.spin,
            pulse,
          );
        }
      }

      if (mentorActive) {
        drawMentorNode(mouse.x, mouse.y, time);
      }

      ctx!.globalCompositeOperation = "source-over";
    }

    /* ---------------- Simulation ---------------- */

    function step(timestamp: number) {
      if (disposed) return;

      // Critical: never animate particles in light mode.
      if (themeRef.current !== "dark") {
        stopLoop();
        return;
      }

      const { w, h } = sizeRef.current;
      const time = timestamp / 1000;

      let dt = lastTsRef.current ? (timestamp - lastTsRef.current) / 1000 : 0.016;
      if (dt > MAX_DT) dt = MAX_DT;

      lastTsRef.current = timestamp;

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

        // Damping
        p.vx *= 0.992;
        p.vy *= 0.992;

        // Keep field alive
        const speed = Math.hypot(p.vx, p.vy);
        if (speed < 0.006) {
          p.vx += rand(-0.004, 0.004);
          p.vy += rand(-0.004, 0.004);
        }

        p.nx += p.vx * dt;
        p.ny += p.vy * dt;

        // Bounce inside container
        if (p.nx < 0) {
          p.nx = 0;
          p.vx = Math.abs(p.vx);
        } else if (p.nx > 1) {
          p.nx = 1;
          p.vx = -Math.abs(p.vx);
        }

        if (p.ny < 0) {
          p.ny = 0;
          p.vy = Math.abs(p.vy);
        } else if (p.ny > 1) {
          p.ny = 1;
          p.vy = -Math.abs(p.vy);
        }
      }

      drawFrame(time, false);

      rafRef.current = requestAnimationFrame(step);
    }

    function startLoop() {
      if (disposed) return;
      if (themeRef.current !== "dark") return;
      if (reducedRef.current) return;
      if (!visibleRef.current || !onScreenRef.current) return;

      if (rafRef.current == null) {
        lastTsRef.current = 0;
        rafRef.current = requestAnimationFrame(step);
      }
    }

    function stopLoop() {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    /* ---------------- Resize ---------------- */

    function resize() {
      const rect = wrap!.getBoundingClientRect();

      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

      sizeRef.current = { w, h, dpr };

      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = desiredParticleCount(w, density);
      const particles = particlesRef.current;

      if (particles.length < target) {
        while (particles.length < target) {
          particles.push(createParticle());
        }
      } else if (particles.length > target) {
        particles.length = target;
      }

      if (themeRef.current === "dark" && reducedRef.current) {
        drawFrame(0, true);
      }
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(wrap);
    resize();

    /* ---------------- Pointer mentor ---------------- */

    const onPointerMove = (event: PointerEvent) => {
      if (!interactive) return;

      const rect = canvas!.getBoundingClientRect();

      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const onPointerLeave = () => {
      mouseRef.current.active = false;
    };

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("blur", onPointerLeave);
    }

    /* ---------------- Visibility / intersection ---------------- */

    const onVisibilityChange = () => {
      visibleRef.current = !document.hidden;

      if (visibleRef.current) startLoop();
      else stopLoop();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreenRef.current = entry.isIntersecting;

        if (entry.isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 },
    );

    intersectionObserver.observe(wrap);

    /* ---------------- Theme observer ---------------- */

    const themeObserver = new MutationObserver(() => {
      const nextTheme = readTheme();

      if (nextTheme === themeRef.current) return;

      themeRef.current = nextTheme;

      if (nextTheme === "dark") {
        if (reducedRef.current) {
          drawFrame(performance.now() / 1000, true);
        } else {
          startLoop();
        }
      } else {
        stopLoop();
      }
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    /* ---------------- Initial state ---------------- */

    if (themeRef.current === "dark") {
      if (reducedRef.current) drawFrame(0, true);
      else startLoop();
    }

    /* ---------------- Cleanup ---------------- */

    return () => {
      disposed = true;

      stopLoop();

      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();

      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);

      if (interactive) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerMove);
      }
    };
  }, [density, interactive, showGrid, reducedMotion]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {/* =====================================================
          LIGHT MODE LAYER
          Only cinematic image slider. Crystal clear.
          ===================================================== */}
      <div
        className="absolute inset-0 opacity-100 transition-opacity duration-700 ease-out dark:opacity-0"
        style={{ willChange: "opacity" }}
      >
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`absolute inset-0 object-cover transition-opacity duration-[2500ms] ease-in-out ${
              i === slideIndex ? "opacity-100" : "opacity-0"
            } ${
              zoomType === "in"
                ? "animate-ken-burns-in"
                : "animate-ken-burns-out"
            }`}
          />
        ))}

        {/* Very subtle glass edge vignette — does not muddy the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/10" />
        <div className="absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_50%,transparent_62%,rgba(255,255,255,0.16)_100%)]" />
      </div>

      {/* =====================================================
          DARK MODE LAYER
          Only cinematic live particle network.
          Light mode में यह layer opacity-0 है और loop stop है।
          ===================================================== */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-out dark:opacity-100"
        style={{ willChange: "opacity" }}
      >
        {/* Deep but clean nebula base */}
        <div className="absolute inset-0 animate-nebula-shift" />

        {/* Soft color depth, not heavy scrim */}
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_18%_12%,rgba(99,102,241,0.18),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(65%_50%_at_88%_86%,rgba(34,211,238,0.13),transparent_62%)]" />

        {/* Crystal-clear transparent particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />

        {/* Edge vignette only, center remains clear */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_58%,rgba(2,6,23,0.38)_100%)]" />
      </div>
    </div>
  );
}