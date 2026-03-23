"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  driftVx: number;
  driftVy: number;
  radius: number;
};

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const drawingCanvas = canvas;
    const drawingCtx = ctx;

    let animationId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];
    const mouse = {
      x: 0,
      y: 0,
      active: false
    };

    const maxDistance = 150;
    const repelRadius = 140;
    const repelStrength = 0.22;

    function createParticles() {
      const targetCount = Math.max(45, Math.min(120, Math.floor((width * height) / 19000)));
      particles = Array.from({ length: targetCount }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        driftVx: (Math.random() - 0.5) * 0.35,
        driftVy: (Math.random() - 0.5) * 0.35,
        radius: 1.4 + Math.random() * 1.8
      }));
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      drawingCanvas.width = Math.floor(width * dpr);
      drawingCanvas.height = Math.floor(height * dpr);
      drawingCanvas.style.width = `${width}px`;
      drawingCanvas.style.height = `${height}px`;

      drawingCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    }

    function drawBackground() {
      const gradient = drawingCtx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#050b18");
      gradient.addColorStop(0.55, "#0a1530");
      gradient.addColorStop(1, "#0f2348");

      drawingCtx.fillStyle = gradient;
      drawingCtx.fillRect(0, 0, width, height);
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > maxDistance) {
            continue;
          }

          const alpha = (1 - dist / maxDistance) * 0.28;
          drawingCtx.strokeStyle = `rgba(120, 178, 255, ${alpha})`;
          drawingCtx.lineWidth = 1;
          drawingCtx.beginPath();
          drawingCtx.moveTo(a.x, a.y);
          drawingCtx.lineTo(b.x, b.y);
          drawingCtx.stroke();
        }
      }
    }

    function drawParticles() {
      for (const particle of particles) {
        // Pull each particle back toward its base drift so motion never stalls.
        particle.vx += (particle.driftVx - particle.vx) * 0.02;
        particle.vy += (particle.driftVy - particle.vy) * 0.02;

        if (mouse.active) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 0.001 && dist < repelRadius) {
            const force = (1 - dist / repelRadius) * repelStrength;
            particle.vx += (dx / dist) * force;
            particle.vy += (dy / dist) * force;
          }
        }

        // Keep velocity stable so particles stay smooth after interaction.
        particle.vx *= 0.992;
        particle.vy *= 0.992;

        const maxSpeed = 1.2;
        particle.vx = Math.max(-maxSpeed, Math.min(maxSpeed, particle.vx));
        particle.vy = Math.max(-maxSpeed, Math.min(maxSpeed, particle.vy));

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -10 || particle.x > width + 10) {
          particle.vx *= -1;
        }

        if (particle.y < -10 || particle.y > height + 10) {
          particle.vy *= -1;
        }

        drawingCtx.beginPath();
        drawingCtx.fillStyle = "rgba(194, 223, 255, 0.95)";
        drawingCtx.shadowColor = "rgba(110, 173, 255, 0.75)";
        drawingCtx.shadowBlur = 12;
        drawingCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        drawingCtx.fill();
      }

      drawingCtx.shadowBlur = 0;
    }

    function render() {
      drawBackground();
      drawConnections();
      drawParticles();
      animationId = window.requestAnimationFrame(render);
    }

    function handleMouseMove(event: MouseEvent) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    }

    function handleMouseLeave() {
      mouse.active = false;
    }

    resize();
    render();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="particle-network-bg pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="particle-network-bg__canvas" aria-hidden />
      <div className="particle-network-bg__vignette" />
    </div>
  );
}
