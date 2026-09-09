"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
}: {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}) => {
  const noise = useRef(createNoise3D());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number>(0);
  const w = useRef(0);
  const h = useRef(0);
  const nt = useRef(0);

  const waveColors = colors ?? [
    "#d648ff",
    "#00d1b7",
    "#7c3aed",
    "#06b6d4",
    "#8b5cf6",
  ];

  const speedFactor = speed === "fast" ? 0.002 : 0.001;

  const init = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    w.current = window.innerWidth;
    h.current = window.innerHeight;
    canvas.width = w.current;
    canvas.height = h.current;
    ctx.filter = `blur(${blur}px)`;
    nt.current = 0;

    render();
  };

  const drawWave = (n: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    nt.current += speedFactor;
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth ?? 50;
      ctx.strokeStyle = waveColors[i % waveColors.length] ?? waveColors[0] ?? "#d648ff";

      for (let x = 0; x < w.current; x += 5) {
        const y = noise.current(x / 800, 0.3 * i, nt.current) * 100;
        ctx.lineTo(x, y + h.current * 0.5);
      }

      ctx.stroke();
      ctx.closePath();
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = backgroundFill ?? "black";
    ctx.globalAlpha = waveOpacity;
    ctx.fillRect(0, 0, w.current, h.current);
    drawWave(5);
    animationId.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId.current);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      w.current = window.innerWidth;
      h.current = window.innerHeight;
      canvas.width = w.current;
      canvas.height = h.current;
      ctx.filter = `blur(${blur}px)`;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [blur]);

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-screen",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};

function at(table: Uint8Array, index: number) {
  return table[index] ?? 0;
}

function createNoise3D() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;

  for (let i = 255; i > 0; i--) {
    const n = Math.floor((i + 1) * Math.random());
    const q = at(p, i);
    p[i] = at(p, n);
    p[n] = q;
  }

  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);

  for (let i = 0; i < 512; i++) {
    perm[i] = at(p, i & 255);
    permMod12[i] = at(perm, i) % 12;
  }

  const grad3: [number, number, number][] = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
  ];

  const gradient = (index: number): [number, number, number] =>
    grad3[at(permMod12, index)] ?? [0, 0, 0];

  return (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = fade(x);
    const v = fade(y);
    const w = fade(z);

    const A = at(perm, X) + Y;
    const AA = at(perm, A) + Z;
    const AB = at(perm, A + 1) + Z;
    const B = at(perm, X + 1) + Y;
    const BA = at(perm, B) + Z;
    const BB = at(perm, B + 1) + Z;

    return lerp(
      w,
      lerp(
        v,
        lerp(u, dot(gradient(AA), x, y, z), dot(gradient(BA), x - 1, y, z)),
        lerp(u, dot(gradient(AB), x, y - 1, z), dot(gradient(BB), x - 1, y - 1, z))
      ),
      lerp(
        v,
        lerp(u, dot(gradient(AA + 1), x, y, z - 1), dot(gradient(BA + 1), x - 1, y, z - 1)),
        lerp(u, dot(gradient(AB + 1), x, y - 1, z - 1), dot(gradient(BB + 1), x - 1, y - 1, z - 1))
      )
    );
  };
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number) {
  return a + t * (b - a);
}

function dot(g: [number, number, number], x: number, y: number, z: number) {
  return g[0] * x + g[1] * y + g[2] * z;
}

export default WavyBackground;
