"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, ScanLine, Brain, Layers, BarChart3, FileDown } from "lucide-react";

const STEPS = [
  {
    icon: <Upload className="w-5 h-5" />,
    title: "Upload Media",
    desc: "Upload any video or image file. Supports MP4, MOV, AVI, JPG, PNG and more formats up to 500 MB.",
    color: "indigo",
  },
  {
    icon: <ScanLine className="w-5 h-5" />,
    title: "Frame Extraction",
    desc: "Videos are sampled at 5 fps using OpenCV to efficiently cover diverse poses and expressions.",
    color: "cyan",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Face Detection",
    desc: "MTCNN locates and crops each face in every frame, aligning them to 224×224 pixels for the model.",
    color: "violet",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Hybrid CNN Inference",
    desc: "EfficientNetB0 and Xception process each face in parallel. Their feature vectors are fused before classification.",
    color: "indigo",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Aggregate Scoring",
    desc: "Individual face scores are averaged across all frames. The final sigmoid output determines authenticity.",
    color: "cyan",
  },
  {
    icon: <FileDown className="w-5 h-5" />,
    title: "Report Generated",
    desc: "A detailed report shows verdict, confidence %, frames analyzed, faces found, and a JSON export.",
    color: "emerald",
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  indigo: {
    bg: "bg-indigo-600/15",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
    glow: "shadow-indigo-500/20",
  },
  cyan: {
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
  },
  violet: {
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    text: "text-violet-400",
    glow: "shadow-violet-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
  },
};

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-cyan-500" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Pipeline</span>
            <span className="w-8 h-px bg-cyan-500" />
          </div>
          <h2 className="font-display font-700 text-3xl md:text-4xl text-white">
            How DeepGuard Works
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
            A six-stage deep learning pipeline modeled directly on the published research methodology.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map((step, i) => {
            const c = COLOR_MAP[step.color];
            return (
              <div
                key={step.title}
                className={`glass rounded-2xl p-5 border ${c.border} hover:shadow-lg ${c.glow} transition-all duration-500 group ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Step number + icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  <span className="font-mono text-xs text-slate-600">0{i + 1}</span>
                </div>

                <h3 className="font-display font-600 text-white text-base mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Architecture diagram */}
        <div className="mt-12 glass rounded-2xl p-6 border border-indigo-500/15">
          <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-5 text-center">
            Model Architecture
          </h3>
          <ArchDiagram />
        </div>
      </div>
    </section>
  );
}

function ArchDiagram() {
  return (
    <div className="flex flex-col items-center gap-2 text-xs font-mono text-slate-400 overflow-x-auto">
      {/* Input */}
      <Box label="Input: 224×224×3 face crop" color="slate" />
      <Arrow />

      {/* Parallel branches */}
      <div className="flex gap-6 items-start">
        <div className="flex flex-col items-center gap-2">
          <Box label="EfficientNetB0" color="indigo" sub="ImageNet pretrained" />
          <Arrow />
          <Box label="GlobalAvgPool" color="indigo" />
          <Arrow />
          <Box label="BatchNorm" color="indigo" />
        </div>

        <div className="flex flex-col items-center justify-center h-full pt-10 text-slate-600">
          ‖
        </div>

        <div className="flex flex-col items-center gap-2">
          <Box label="Xception" color="cyan" sub="ImageNet pretrained" />
          <Arrow />
          <Box label="GlobalAvgPool" color="cyan" />
          <Arrow />
          <Box label="BatchNorm" color="cyan" />
        </div>
      </div>

      <Arrow />
      <Box label="Concatenate →  Dense(256, ReLU)  →  Dropout(0.5)" color="violet" />
      <Arrow />
      <Box label="Dense(128, ReLU)  →  Dropout(0.3)" color="violet" />
      <Arrow />
      <Box label="Dense(1, Sigmoid)" color="emerald" sub="0 = Real · 1 = Deepfake" />
    </div>
  );
}

function Box({ label, sub, color }: { label: string; sub?: string; color: string }) {
  const styles: Record<string, string> = {
    slate:  "border-slate-600/40 bg-slate-800/40 text-slate-300",
    indigo: "border-indigo-500/40 bg-indigo-600/10 text-indigo-300",
    cyan:   "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
    violet: "border-violet-500/40 bg-violet-600/10 text-violet-300",
    emerald:"border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  };
  return (
    <div className={`px-4 py-2 rounded-lg border text-center ${styles[color]}`}>
      <div className="whitespace-nowrap">{label}</div>
      {sub && <div className="text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function Arrow() {
  return <div className="w-px h-4 bg-slate-700" />;
}
