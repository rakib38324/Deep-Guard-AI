"use client";

import { useEffect, useRef } from "react";
import { ShieldAlert, Brain, Cpu } from "lucide-react";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 text-center overflow-hidden">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Central glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[80px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-indigo-500/30 mb-8 text-xs font-mono text-indigo-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Hybrid EfficientNetB0 + Xception Architecture
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className="font-display font-800 text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-6">
          <span className="text-white">Detect</span>{" "}
          <span className="shimmer-text">AI-Generated</span>
          <br />
          <span className="text-white">Faces </span>
          <span className="text-slate-500">in Seconds</span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-light">
          Upload a video or image and our state-of-the-art deep learning model
          will analyze it for deepfake manipulation — trained on{" "}
          <span className="text-indigo-300 font-medium">110,694 frames</span> with{" "}
          <span className="text-cyan-400 font-medium">97.8% accuracy</span>.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#analyze"
            className="group px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all duration-200 glow-accent hover:scale-105 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            Analyze a File
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-3.5 rounded-xl glass border border-indigo-500/30 text-slate-300 hover:text-white hover:border-indigo-400/60 font-medium text-base transition-all duration-200 flex items-center gap-2"
          >
            <Brain className="w-4 h-4 text-indigo-400" />
            How it works
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono">
          <TrustBadge icon={<Cpu className="w-3.5 h-3.5 text-indigo-400" />} label="Hybrid CNN Model" />
          <span className="text-slate-700">·</span>
          <TrustBadge icon={<span className="text-cyan-400">97.8%</span>} label="Accuracy" />
          <span className="text-slate-700">·</span>
          <TrustBadge icon={<span className="text-indigo-400">110K+</span>} label="Training Frames" />
          <span className="text-slate-700">·</span>
          <TrustBadge icon={<span className="text-emerald-400">✓</span>} label="IEEE Published" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-bounce">
        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
      </div>
    </section>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {icon}
      <span>{label}</span>
    </span>
  );
}
