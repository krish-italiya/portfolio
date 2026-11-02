"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

type PortraitStatus = "loading" | "photo" | "placeholder" | "mask-failed";
type PortraitPixels = { imageData: ImageData; drawX: number; drawY: number; drawWidth: number; drawHeight: number };

const SOURCE_WIDTH = 360;
const SOURCE_HEIGHT = 420;
const SEGMENTER_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm";
const SEGMENTER_MODEL = "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite";

function makeFallbackSilhouette(context: CanvasRenderingContext2D) {
  context.clearRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.moveTo(180, 25);
  context.bezierCurveTo(115, 25, 91, 77, 98, 139);
  context.bezierCurveTo(101, 174, 121, 200, 145, 212);
  context.lineTo(145, 238);
  context.bezierCurveTo(83, 249, 39, 288, 29, 370);
  context.bezierCurveTo(94, 396, 266, 396, 331, 370);
  context.bezierCurveTo(321, 288, 277, 249, 215, 238);
  context.lineTo(215, 212);
  context.bezierCurveTo(239, 200, 259, 174, 262, 139);
  context.bezierCurveTo(269, 77, 245, 25, 180, 25);
  context.closePath();
  context.fill();
}

async function segmentPerson(photo: HTMLImageElement, pixels: PortraitPixels): Promise<boolean> {
  const vision = await import("@mediapipe/tasks-vision");
  const fileset = await vision.FilesetResolver.forVisionTasks(SEGMENTER_WASM);
  const segmenter = await vision.ImageSegmenter.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: SEGMENTER_MODEL },
    runningMode: "IMAGE",
    outputCategoryMask: false,
    outputConfidenceMasks: true
  });

  try {
    const result = segmenter.segment(photo);
    const personMask = result.confidenceMasks?.[1];
    if (!personMask) {
      result.close();
      return false;
    }

    const maskWidth = personMask.width;
    const maskHeight = personMask.height;
    const maskValues = personMask.getAsFloat32Array();
    const data = pixels.imageData.data;

    for (let y = 0; y < SOURCE_HEIGHT; y++) {
      const localY = (y - pixels.drawY) / pixels.drawHeight;
      if (localY < 0 || localY > 1) continue;
      const maskY = Math.min(maskHeight - 1, Math.max(0, Math.floor(localY * maskHeight)));
      for (let x = 0; x < SOURCE_WIDTH; x++) {
        const pixelIndex = (y * SOURCE_WIDTH + x) * 4;
        const originalAlpha = data[pixelIndex + 3];
        if (!originalAlpha) continue;
        const localX = (x - pixels.drawX) / pixels.drawWidth;
        if (localX < 0 || localX > 1) {
          data[pixelIndex + 3] = 0;
          continue;
        }
        const maskX = Math.min(maskWidth - 1, Math.max(0, Math.floor(localX * maskWidth)));
        const confidence = maskValues[maskY * maskWidth + maskX] ?? 0;
        const feathered = Math.max(0, Math.min(1, (confidence - 0.18) / 0.62));
        data[pixelIndex + 3] = Math.round(originalAlpha * feathered);
      }
    }

    result.close();
    return true;
  } finally {
    segmenter.close();
  }
}

function readPhoto(photo: HTMLImageElement, sourceContext: CanvasRenderingContext2D): PortraitPixels {
  sourceContext.clearRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
  const scale = Math.min((SOURCE_WIDTH * 0.9) / photo.naturalWidth, (SOURCE_HEIGHT * 0.88) / photo.naturalHeight);
  const drawWidth = photo.naturalWidth * scale;
  const drawHeight = photo.naturalHeight * scale;
  const drawX = (SOURCE_WIDTH - drawWidth) / 2;
  const drawY = (SOURCE_HEIGHT - drawHeight) / 2;
  sourceContext.drawImage(photo, drawX, drawY, drawWidth, drawHeight);
  return {
    imageData: sourceContext.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT),
    drawX,
    drawY,
    drawWidth,
    drawHeight
  };
}

function hasRealTransparency(imageData: ImageData) {
  const data = imageData.data;
  let translucent = 0;
  const total = data.length / 4;
  for (let index = 3; index < data.length; index += 16) {
    if (data[index] < 248) translucent++;
  }
  return translucent > total * 0.002;
}

type ParticleBuffers = {
  target: Float32Array;
  scatter: Float32Array;
  color: Float32Array;
  seed: Float32Array;
  delay: Float32Array;
  size: Float32Array;
  count: number;
};

function buildParticleBuffers(imageData: ImageData, stageWidth: number, stageHeight: number): ParticleBuffers {
  const targets: number[] = [];
  const scatters: number[] = [];
  const colors: number[] = [];
  const seeds: number[] = [];
  const delays: number[] = [];
  const sizes: number[] = [];
  const data = imageData.data;
  const scale = Math.min((stageWidth * 0.76) / SOURCE_WIDTH, (stageHeight * 0.8) / SOURCE_HEIGHT);
  const step = 3.15;

  for (let y = 0; y < SOURCE_HEIGHT; y += step) {
    for (let x = 0; x < SOURCE_WIDTH; x += step) {
      const index = (Math.floor(y) * SOURCE_WIDTH + Math.floor(x)) * 4;
      const alpha = data[index + 3] / 255;
      if (alpha < 0.24 || Math.random() > alpha) continue;

      const targetX = (x + (Math.random() - 0.5) * 1.55 - SOURCE_WIDTH / 2) * scale;
      const targetY = (SOURCE_HEIGHT / 2 - y - (Math.random() - 0.5) * 1.55) * scale;
      const seed = Math.random();
      const angle = seed * Math.PI * 2;
      const radius = Math.max(stageWidth, stageHeight) * (0.52 + Math.random() * 1.15);

      targets.push(targetX, targetY, (Math.random() - 0.5) * 14);
      scatters.push(
        Math.cos(angle) * radius + (Math.random() - 0.5) * 60,
        Math.sin(angle) * radius * 0.82 + (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 230
      );

      const red = data[index] / 255;
      const green = data[index + 1] / 255;
      const blue = data[index + 2] / 255;
      const accent = y < SOURCE_HEIGHT * 0.47 ? [0.78, 0.96, 0.55] : [0.46, 0.78, 0.69];
      const tint = 0.32 + Math.random() * 0.13;
      colors.push(
        red * (1 - tint) + accent[0] * tint,
        green * (1 - tint) + accent[1] * tint,
        blue * (1 - tint) + accent[2] * tint
      );

      const angular = (Math.atan2(targetY, targetX) + Math.PI) / (Math.PI * 2);
      const radial = Math.min(1, Math.hypot(targetX, targetY) / (Math.min(stageWidth, stageHeight) * 0.55));
      delays.push(0.045 + ((angular + radial * 0.38) % 1) * 0.29);
      seeds.push(seed);
      sizes.push(1.35 + Math.random() * 1.65);
    }
  }

  return {
    target: new Float32Array(targets),
    scatter: new Float32Array(scatters),
    color: new Float32Array(colors),
    seed: new Float32Array(seeds),
    delay: new Float32Array(delays),
    size: new Float32Array(sizes),
    count: seeds.length
  };
}

function drawCanvasFallback(canvas: HTMLCanvasElement, imageData: ImageData) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const width = canvas.clientWidth || 520;
  const height = canvas.clientHeight || 580;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const scale = Math.min((width * 0.76) / SOURCE_WIDTH, (height * 0.8) / SOURCE_HEIGHT);
  const data = imageData.data;
  for (let y = 0; y < SOURCE_HEIGHT; y += 3) {
    for (let x = 0; x < SOURCE_WIDTH; x += 3) {
      const index = (y * SOURCE_WIDTH + x) * 4;
      const alpha = data[index + 3] / 255;
      if (alpha < 0.24) continue;
      const px = width / 2 + (x - SOURCE_WIDTH / 2) * scale;
      const py = height / 2 + (SOURCE_HEIGHT / 2 - y) * scale;
      context.fillStyle = "rgba(190, 235, 139," + (0.28 + alpha * 0.7) + ")";
      context.beginPath();
      context.arc(px, py, 1.15, 0, Math.PI * 2);
      context.fill();
    }
  }
}

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
      const count = Math.min(64, Math.max(28, Math.round((width * height) / 24500)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
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
      const dot = themeLight ? "rgba(59,94,52,.12)" : "rgba(193,230,160,.16)";
      const line = themeLight ? "rgba(71,105,66,.045)" : "rgba(173,217,142,.05)";
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
          particle.x -= (dx / (distance || 1)) * 0.12;
          particle.y -= (dy / (distance || 1)) * 0.12;
        }
        context.fillStyle = dot;
        context.beginPath();
        context.arc(particle.x, particle.y, 0.9 + Math.sin(time * 0.00045 + particle.phase) * 0.18, 0, Math.PI * 2);
        context.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const lx = particle.x - other.x;
          const ly = particle.y - other.y;
          if (lx * lx + ly * ly < 115 * 115) {
            context.strokeStyle = line;
            context.lineWidth = 0.55;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      }
      if (!reduce && document.visibilityState === "visible") frame = window.requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      window.cancelAnimationFrame(frame);
      if (document.visibilityState === "visible" && !reduce) frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="ambient-canvas" />;
}

export function ParticlePortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const replayRef = useRef<() => void>(() => undefined);
  const [status, setStatus] = useState<PortraitStatus>("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;

    let disposed = false;
    let raf = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let geometry: import("three").BufferGeometry | null = null;
    let material: import("three").ShaderMaterial | null = null;

    const makePixels = () => {
      const source = document.createElement("canvas");
      source.width = SOURCE_WIDTH;
      source.height = SOURCE_HEIGHT;
      const context = source.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Canvas image processing is unavailable.");
      makeFallbackSilhouette(context);
      return context.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    };

    const createScene = async (imageData: ImageData): Promise<(() => void) | undefined> => {
      if (disposed) return;
      const THREE = await import("three");
      if (disposed) return;

      const bounds = stage.getBoundingClientRect();
      const width = Math.max(320, bounds.width);
      const height = Math.max(360, bounds.height);
      const buffers = buildParticleBuffers(imageData, width, height);
      if (!buffers.count) throw new Error("The portrait mask produced no visible particles.");

      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
          preserveDrawingBuffer: false
        });
      } catch {
        drawCanvasFallback(canvas, imageData);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 2400);
      camera.position.z = 1000;

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(buffers.count * 3), 3));
      geometry.setAttribute("aTarget", new THREE.BufferAttribute(buffers.target, 3));
      geometry.setAttribute("aScatter", new THREE.BufferAttribute(buffers.scatter, 3));
      geometry.setAttribute("aColor", new THREE.BufferAttribute(buffers.color, 3));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(buffers.seed, 1));
      geometry.setAttribute("aDelay", new THREE.BufferAttribute(buffers.delay, 1));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(buffers.size, 1));

      const uniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uPointer: { value: new THREE.Vector2(-1000, -1000) },
        uPointerActive: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() }
      };

      material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms,
        vertexShader: [
          "uniform float uTime;",
          "uniform float uProgress;",
          "uniform vec2 uPointer;",
          "uniform float uPointerActive;",
          "uniform float uPixelRatio;",
          "attribute vec3 aTarget;",
          "attribute vec3 aScatter;",
          "attribute vec3 aColor;",
          "attribute float aSeed;",
          "attribute float aDelay;",
          "attribute float aSize;",
          "varying vec3 vColor;",
          "varying float vAlpha;",
          "varying float vAssemble;",
          "void main() {",
          "  float assemble = smoothstep(aDelay, aDelay + 0.57, uProgress);",
          "  assemble = assemble * assemble * (3.0 - 2.0 * assemble);",
          "  vec3 travel = aTarget - aScatter;",
          "  vec3 point = mix(aScatter, aTarget, assemble);",
          "  float orbitAngle = aSeed * 6.2831853 + uTime * (0.72 + aSeed * 0.34);",
          "  vec3 vortex = vec3(cos(orbitAngle) * 44.0, sin(orbitAngle * 1.11) * 48.0, sin(orbitAngle * 0.73) * 34.0) * (1.0 - assemble);",
          "  vec2 tangent = normalize(vec2(-travel.y, travel.x) + vec2(0.00001));",
          "  float arc = sin(assemble * 3.1415926) * length(travel.xy) * 0.045;",
          "  point.xy += tangent * arc;",
          "  point += vortex;",
          "  float breathing = sin(uTime * 0.76 + aSeed * 18.0) * 1.15;",
          "  point.x += breathing * (0.2 + assemble * 0.8);",
          "  point.y += cos(uTime * 0.57 + aSeed * 21.0) * 1.05 * (0.2 + assemble);",
          "  if (uPointerActive > 0.5 && assemble > 0.76) {",
          "    vec2 difference = point.xy - uPointer;",
          "    float distanceToPointer = length(difference);",
          "    float force = 1.0 - smoothstep(0.0, 128.0, distanceToPointer);",
          "    point.xy += normalize(difference + vec2(0.001)) * force * 24.0;",
          "  }",
          "  vec4 viewPosition = modelViewMatrix * vec4(point, 1.0);",
          "  gl_Position = projectionMatrix * viewPosition;",
          "  gl_PointSize = aSize * uPixelRatio * (1.0 + (1.0 - assemble) * 0.7) * (920.0 / max(420.0, -viewPosition.z));",
          "  vColor = aColor;",
          "  vAlpha = 0.22 + assemble * 0.78;",
          "  vAssemble = assemble;",
          "}"
        ].join("\n"),
        fragmentShader: [
          "varying vec3 vColor;",
          "varying float vAlpha;",
          "varying float vAssemble;",
          "void main() {",
          "  vec2 point = gl_PointCoord - vec2(0.5);",
          "  float distanceToCenter = length(point);",
          "  float core = 1.0 - smoothstep(0.16, 0.5, distanceToCenter);",
          "  float halo = 1.0 - smoothstep(0.06, 0.5, distanceToCenter);",
          "  float glow = mix(0.38, 1.0, vAssemble);",
          "  vec3 color = vColor * (0.88 + halo * 0.32);",
          "  gl_FragColor = vec4(color, core * vAlpha * glow);",
          "}"
        ].join("\n")
      });

      const cloud = new THREE.Points(geometry, material);
      scene.add(cloud);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const startedAt = performance.now();
      let animationStartedAt = startedAt;

      replayRef.current = () => {
        animationStartedAt = performance.now();
        uniforms.uProgress.value = 0;
      };

      const onPointerMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        uniforms.uPointer.value.set(
          (event.clientX - rect.left - rect.width / 2) * (width / rect.width),
          -(event.clientY - rect.top - rect.height / 2) * (height / rect.height)
        );
        uniforms.uPointerActive.value = 1;
      };
      const onPointerLeave = () => { uniforms.uPointerActive.value = 0; };
      const resize = () => {
        const next = stage.getBoundingClientRect();
        const nextWidth = Math.max(320, next.width);
        const nextHeight = Math.max(360, next.height);
        camera.left = -nextWidth / 2;
        camera.right = nextWidth / 2;
        camera.top = nextHeight / 2;
        camera.bottom = -nextHeight / 2;
        camera.updateProjectionMatrix();
        cloud.scale.setScalar(Math.min(nextWidth / width, nextHeight / height));
        renderer?.setSize(nextWidth, nextHeight, false);
        uniforms.uPixelRatio.value = renderer?.getPixelRatio() ?? 1;
      };
      const renderFrame = (time: number) => {
        uniforms.uTime.value = (time - startedAt) * 0.001;
        uniforms.uProgress.value = reducedMotion ? 1 : Math.min(1, (time - animationStartedAt) / 4300);
        renderer?.render(scene, camera);
        if (!reducedMotion && document.visibilityState === "visible") raf = window.requestAnimationFrame(renderFrame);
      };
      const onVisibility = () => {
        window.cancelAnimationFrame(raf);
        if (document.visibilityState === "visible" && !reducedMotion) raf = window.requestAnimationFrame(renderFrame);
      };

      canvas.addEventListener("pointermove", onPointerMove, { passive: true });
      canvas.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVisibility);
      renderFrame(performance.now());

      return () => {
        window.cancelAnimationFrame(raf);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
        replayRef.current = () => undefined;
        geometry?.dispose();
        material?.dispose();
        renderer?.dispose();
      };
    };

    let sceneCleanup: (() => void) | undefined;
    const loadPortrait = async () => {
      try {
        const source = document.createElement("canvas");
        source.width = SOURCE_WIDTH;
        source.height = SOURCE_HEIGHT;
        const sourceContext = source.getContext("2d", { willReadFrequently: true });
        if (!sourceContext) throw new Error("Canvas image processing is unavailable.");

        const photo = new Image();
        photo.decoding = "async";
        photo.onload = async () => {
          if (disposed) return;
          try {
            const pixels = readPhoto(photo, sourceContext);
            if (!hasRealTransparency(pixels.imageData)) {
              setStatus("loading");
              const segmented = await segmentPerson(photo, pixels);
              if (!segmented) throw new Error("The portrait could not be segmented.");
            }
            if (disposed) return;
            sceneCleanup = await createScene(pixels.imageData);
            if (!disposed) setStatus("photo");
          } catch {
            if (disposed) return;
            sceneCleanup = await createScene(makePixels());
            if (!disposed) setStatus("mask-failed");
          }
        };
        photo.onerror = async () => {
          if (disposed) return;
          sceneCleanup = await createScene(makePixels());
          if (!disposed) setStatus("placeholder");
        };
        photo.src = "/portrait.png";
      } catch {
        if (disposed) return;
        sceneCleanup = await createScene(makePixels());
        if (!disposed) setStatus("placeholder");
      }
    };

    void loadPortrait();

    return () => {
      disposed = true;
      sceneCleanup?.();
      window.cancelAnimationFrame(raf);
      replayRef.current = () => undefined;
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
    };
  }, []);

  const statusLabel = status === "photo"
    ? "SUBJECT MASK / READY"
    : status === "mask-failed"
      ? "MASK FAILED / CUTOUT PNG RECOMMENDED"
      : status === "placeholder"
        ? "IDENTITY SOURCE / PREVIEW MODE"
        : "BUILDING POINT CLOUD";

  return (
    <div className="portrait-stage">
      <div className="portrait-orbit orbit-one" />
      <div className="portrait-orbit orbit-two" />
      <div className="portrait-topline"><span>IDENTITY.FIELD</span><span>GPU PARTICLES / LIVE</span></div>
      <canvas ref={canvasRef} className="portrait-canvas" aria-label="Animated particle portrait" role="img" />
      <div className="portrait-core-glow" />
      <div className="portrait-bottomline">
        <span>{statusLabel}</span>
        <button onClick={() => replayRef.current()} aria-label="Replay particle assembly"><RefreshCw size={12} /> REASSEMBLE</button>
      </div>
      {status !== "photo" && <div className="portrait-note">PLACE YOUR PHOTO AT <code>public/portrait.png</code> · OPAQUE PHOTOS ARE CUT OUT ON DEVICE</div>}
      <div className="portrait-corner-mark" aria-hidden="true">KI<span> / </span>001</div>
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

    const move = (event: PointerEvent) => {
      dot.style.transform = "translate3d(" + event.clientX + "px," + event.clientY + "px,0)";
      ring.style.transform = "translate3d(" + event.clientX + "px," + event.clientY + "px,0)";
      root.classList.add("cursor-visible");
    };
    const onEnter = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a,button,[data-cursor]");
      if (!interactive) return;
      label.textContent = interactive.getAttribute("data-cursor") || (interactive.tagName === "A" ? "OPEN" : "SELECT");
      root.classList.add("cursor-active");
    };
    const onLeave = (event: Event) => {
      const related = (event as PointerEvent).relatedTarget as HTMLElement | null;
      if (related?.closest("a,button,[data-cursor]")) return;
      root.classList.remove("cursor-active");
    };
    const onDown = () => root.classList.add("cursor-pressed");
    const onUp = () => root.classList.remove("cursor-pressed");
    const onWindowLeave = () => root.classList.remove("cursor-visible");

    document.documentElement.classList.add("custom-cursor-enabled");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", onEnter, true);
    window.addEventListener("pointerout", onLeave, true);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onWindowLeave);

    return () => {
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
