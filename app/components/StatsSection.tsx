"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: "97.8", unit: "%", label: "Detection Accuracy", sub: "on held-out test set" },
  { value: "110,694", unit: "", label: "Training Frames", sub: "real + deepfake faces" },
  { value: "480", unit: "", label: "Source Videos", sub: "30 volunteers, dual pipeline" },
  { value: "2", unit: " tools", label: "Generation Methods", sub: "Roop + Akool AI" },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="stats" className="py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-indigo-500" />
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Research Metrics</span>
            <span className="w-8 h-px bg-indigo-500" />
          </div>
          <h2 className="font-display font-700 text-3xl md:text-4xl text-white">
            Built on Peer-Reviewed Research
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
            Published at IEEE RAAICON 2025 · Dataset available on Mendeley Data
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`glass-bright rounded-2xl p-6 text-center border border-indigo-500/15 hover:border-indigo-400/35 transition-all duration-500 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="font-display font-800 text-3xl text-white mb-1">
                <AnimatedNumber value={stat.value} run={visible} />
                <span className="text-indigo-400 text-xl">{stat.unit}</span>
              </div>
              <div className="text-sm font-medium text-slate-300">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Dataset comparison */}
        <div className="mt-10 glass rounded-2xl p-6 border border-indigo-500/15 overflow-x-auto">
          <h3 className="text-sm font-mono text-indigo-400 uppercase tracking-widest mb-5">
            Dataset Comparison
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 font-mono uppercase tracking-wider border-b border-slate-700/40">
                <th className="pb-3 pr-6">Dataset</th>
                <th className="pb-3 pr-6">Videos</th>
                <th className="pb-3 pr-6">Frames</th>
                <th className="pb-3">Methods</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { name: "FaceForensics++", videos: "1,000", frames: "~1.8M", methods: "4 methods", ours: false },
                { name: "Celeb-DF",        videos: "5,639", frames: "~2M",   methods: "1 method",  ours: false },
                { name: "DFDC",            videos: "5,600+",frames: "N/A",   methods: "GAN-based", ours: false },
                { name: "Ours (DeepGuard)",videos: "480",   frames: "110,694",methods: "Roop + Akool (balanced)", ours: true },
              ].map((row) => (
                <tr
                  key={row.name}
                  className={`transition-colors ${
                    row.ours ? "text-white" : "text-slate-400"
                  }`}
                >
                  <td className="py-3 pr-6 font-medium">
                    {row.ours && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2 align-middle" />
                    )}
                    {row.name}
                  </td>
                  <td className="py-3 pr-6 font-mono text-xs">{row.videos}</td>
                  <td className="py-3 pr-6 font-mono text-xs">{row.frames}</td>
                  <td className="py-3 font-mono text-xs">
                    {row.ours ? (
                      <span className="text-cyan-400">{row.methods}</span>
                    ) : row.methods}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ value, run }: { value: string; run: boolean }) {
  const isFloat = value.includes(".");
  const isLarge = value.includes(",");
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!run) return;
    const numericValue = parseFloat(value.replace(/,/g, ""));
    let start: number | null = null;
    const duration = 1500;

    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = eased * numericValue;
      if (isFloat) {
        setDisplay(cur.toFixed(1));
      } else if (isLarge) {
        setDisplay(Math.round(cur).toLocaleString());
      } else {
        setDisplay(Math.round(cur).toString());
      }
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [run, value, isFloat, isLarge]);

  return <span>{display}</span>;
}
