"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

type Particle = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  color: string;
  radius: number;
};

export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let particles: { x: number; y: number; vx: number; vy: number; phase: number }[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(78, Math.max(34, Math.round((width * height) / 19000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        phase: Math.random() * Math.PI * 2
      }));
    };

    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const themeLight = document.documentElement.dataset.theme === "light";
      const dot = themeLight ? "rgba(59,94,52,.19)" : "rgba(193,230,160,.22)";
      const line = themeLight ? "rgba(71,105,66,.075)" : "rgba(173,217,142,.075)";
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        if (!reduce) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < -20) particle.x = width + 20;
          if (particle.x > width + 20) particle.x = -20;
          if (particle.y < -20) particle.y = height + 20;
          if (particle.y > height + 20) particle.y = -20;
        }
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (!reduce && distance < 170) {
          particle.x -= (dx / (distance || 1)) * 0.16;
          particle.y -= (dy / (distance || 1)) * 0.16;
        }
        context.fillStyle = dot;
        context.beginPath();
        context.arc(particle.x, particle.y, 1.15 + Math.sin(time * 0.00045 + particle.phase) * 0.22, 0, Math.PI * 2);
        context.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const lx = particle.x - other.x;
          const ly = particle.y - other.y;
          const length = lx * lx + ly * ly;
          if (length < 105 * 105) {
            context.strokeStyle = line;
            context.lineWidth = 0.65;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      }
      if (!reduce) frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="ambient-canvas" />;
}

export function ParticlePortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const [replay, setReplay] = useState(0);
  const [usingPhoto, setUsingPhoto] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const width = 520;
    const height = 580;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const source = document.createElement("canvas");
    source.width = 320;
    source.height = 360;
    const sourceContext = source.getContext("2d", { willReadFrequently: true });
    if (!sourceContext) return;

    const buildPoints = (photo: HTMLImageElement | null) => {
      sourceContext.clearRect(0, 0, source.width, source.height);
      if (photo) {
        const scale = Math.min(300 / photo.width, 340 / photo.height);
        const drawWidth = photo.width * scale;
        const drawHeight = photo.height * scale;
        sourceContext.drawImage(photo, (320 - drawWidth) / 2, (360 - drawHeight) / 2, drawWidth, drawHeight);
        setUsingPhoto(true);
      } else {
        setUsingPhoto(false);
        sourceContext.textAlign = "center";
        sourceContext.textBaseline = "middle";
        sourceContext.font = "700 176px Arial";
        sourceContext.fillStyle = "#ffffff";
        sourceContext.fillText("KI", 160, 177);
        sourceContext.strokeStyle = "#ffffff";
        sourceContext.lineWidth = 3;
        sourceContext.beginPath();
        sourceContext.arc(160, 180, 135, 0, Math.PI * 2);
        sourceContext.stroke();
      }

      const image = sourceContext.getImageData(0, 0, source.width, source.height);
      const next: Particle[] = [];
      const step = 5;
      for (let y = 0; y < source.height; y += step) {
        for (let x = 0; x < source.width; x += step) {
          const index = (y * source.width + x) * 4;
          const alpha = image.data[index + 3];
          if (alpha > 50) {
            const red = image.data[index];
            const green = image.data[index + 1];
            const blue = image.data[index + 2];
            const mix = (red + green + blue) / 3;
            const color = mix > 205 ? "#d8ff9b" : mix > 110 ? "#a8d983" : "#75c9b2";
            next.push({
              x: 100 + (x / source.width) * 320,
              y: 84 + (y / source.height) * 360,
              startX: Math.random() * width,
              startY: Math.random() * height,
              color,
              radius: 0.8 + Math.random() * 0.65
            });
          }
        }
      }
      return next;
    };

    let particles: Particle[] = [];
    let frame = 0;
    let start = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = (photo: HTMLImageElement | null) => {
      particles = buildPoints(photo);
      start = performance.now();
      if (frame) window.cancelAnimationFrame(frame);
      const paint = (time: number) => {
        context.clearRect(0, 0, width, height);
        const elapsed = time - start;
        const progress = reduce ? 1 : Math.min(1, elapsed / 2400);
        const eased = 1 - Math.pow(1 - progress, 3);
        const pointer = pointerRef.current;
        for (const particle of particles) {
          const x = particle.startX + (particle.x - particle.startX) * eased;
          const y = particle.startY + (particle.y - particle.startY) * eased;
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const force = !reduce && distance < 95 ? (1 - distance / 95) * 8 : 0;
          const offsetX = distance ? (-dx / distance) * force : 0;
          const offsetY = distance ? (-dy / distance) * force : 0;
          const shimmer = reduce ? 0 : Math.sin(time * 0.0012 + particle.x * 0.02) * 0.5;
          context.globalAlpha = 0.56 + eased * 0.42;
          context.fillStyle = particle.color;
          context.beginPath();
          context.arc(x + offsetX, y + offsetY, particle.radius + shimmer * 0.18, 0, Math.PI * 2);
          context.fill();
        }
        context.globalAlpha = 1;
        if (!reduce) frame = window.requestAnimationFrame(paint);
      };
      frame = window.requestAnimationFrame(paint);
    };

    const photo = new Image();
    photo.onload = () => run(photo);
    photo.onerror = () => run(null);
    photo.src = "/portrait.png";
    const fallbackTimer = window.setTimeout(() => {
      if (!photo.complete) run(null);
    }, 900);

    const onPointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: ((event.clientX - bounds.left) / bounds.width) * width,
        y: ((event.clientY - bounds.top) / bounds.height) * height
      };
    };
    const onLeave = () => { pointerRef.current = { x: -1000, y: -1000 }; };
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      window.clearTimeout(fallbackTimer);
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [replay]);

  return (
    <div className="portrait-stage">
      <div className="portrait-orbit orbit-one" />
      <div className="portrait-orbit orbit-two" />
      <div className="portrait-topline"><span>IDENTITY.MAP</span><span>POINT CLOUD / 01</span></div>
      <canvas ref={canvasRef} className="portrait-canvas" aria-label="Animated particle portrait representation of Krish Italiya" />
      <div className="portrait-bottomline">
        <span>{usingPhoto ? "PORTRAIT SOURCE / ACTIVE" : "PHOTO SLOT / MONOGRAM PREVIEW"}</span>
        <button onClick={() => setReplay((value) => value + 1)} aria-label="Replay particle assembly"><RefreshCw size={12} /> REASSEMBLE</button>
      </div>
      {!usingPhoto && <div className="portrait-note">Add your photo at <code>public/portrait.jpg</code> to replace the monogram with your portrait.</div>}
    </div>
  );
}

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    const dot = root.querySelector(".cursor-dot") as HTMLDivElement;
    const ring = root.querySelector(".cursor-ring") as HTMLDivElement;
    const label = root.querySelector(".cursor-label") as HTMLDivElement;
    let x = -100;
    let y = -100;
    let ringX = -100;
    let ringY = -100;
    let frame = 0;

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      root.classList.add("cursor-visible");
    };
    const onEnter = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a,button,[data-cursor]");
      if (!interactive) return;
      const text = interactive.getAttribute("data-cursor") || (interactive.tagName === "A" ? "OPEN" : "SELECT");
      root.classList.add("cursor-active");
      label.textContent = text;
    };
    const onLeave = () => root.classList.remove("cursor-active");
    const onDown = () => root.classList.add("cursor-pressed");
    const onUp = () => root.classList.remove("cursor-pressed");
    document.documentElement.classList.add("custom-cursor-enabled");
    const onWindowLeave = () => root.classList.remove("cursor-visible");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", onEnter, true);
    window.addEventListener("pointerout", onLeave, true);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onWindowLeave);
    const tick = () => {
      if (!visible) return;
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      dot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      ring.style.transform = "translate3d(" + ringX + "px," + ringY + "px,0)";
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", onEnter, true);
      window.removeEventListener("pointerout", onLeave, true);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onWindowLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="custom-cursor" aria-hidden="true">
      <div className="cursor-dot" />
      <div className="cursor-ring" />
      <div className="cursor-label">OPEN</div>
    </div>
  );
}
