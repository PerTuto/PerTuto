"use client";

import { useEffect, useRef } from "react";

interface AuroraProps {
  colorStops?: string[];
  speed?: number;
}

export function Aurora({
  colorStops = ["#6366F1", "#1a1a2e", "#A78BFA"],
  speed = 0.5,
}: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      frame += speed;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const t = frame * 0.01;
      for (let i = 0; i < 3; i++) {
        const x = canvas.width / 2 + Math.sin(t + i * 2) * (canvas.width / 3);
        const y =
          canvas.height / 2 + Math.cos(t / 1.5 + i) * (canvas.height / 4);
        const radius = Math.min(canvas.width, canvas.height) * 0.6;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const color = colorStops[i % colorStops.length];
        grad.addColorStop(0, color + "55");
        grad.addColorStop(1, "transparent");

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, colorStops]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20 blur-[150px] saturate-100 transition-opacity duration-500"
      style={{ zIndex: 0 }}
    />
  );
}
