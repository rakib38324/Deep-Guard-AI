"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, ShieldAlert, AlertCircle, RotateCcw, Info } from "lucide-react";
import type { DetectionResult } from "../types";
import { ReportDownloader } from "./ReportDownloader";

interface Props {
  result: DetectionResult;
  file: File | null;
}




export default function ResultCard({ result, file }: Props) {
  const [displayed, setDisplayed] = useState(0);
  const [visible, setVisible] = useState(false);
  const animRef = useRef<number | null>(null);

  const isDeepfake = result.label === "DEEPFAKE";
  const isUnknown  = result.label === "UNKNOWN";
  const conf       = result.confidence;

  // Animate confidence counter
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start: number | null = null;
    const duration = 1200;

    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * conf));
      if (progress < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [visible, conf]);

 

  return (
    <div
      className={`rounded-3xl overflow-hidden transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${
        isDeepfake
          ? "border border-rose-500/30 glow-danger"
          : isUnknown
          ? "border border-amber-500/30"
          : "border border-emerald-500/30 glow-success"
      }`}
      style={{ background: "rgba(8,13,30,0.92)" }}
    >
      {/* Header band */}
      <div
        className={`px-6 py-4 flex items-center justify-between ${
          isDeepfake
            ? "bg-rose-500/10 border-b border-rose-500/20"
            : isUnknown
            ? "bg-amber-500/10 border-b border-amber-500/20"
            : "bg-emerald-500/10 border-b border-emerald-500/20"
        }`}
      >
        <div className="flex items-center gap-3">
          {isDeepfake ? (
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          ) : isUnknown ? (
            <AlertCircle className="w-5 h-5 text-amber-400" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          )}
          <span className="font-display font-700 text-lg">
            {isDeepfake ? (
              <span className="text-rose-400">Deepfake Detected</span>
            ) : isUnknown ? (
              <span className="text-amber-400">Unable to Determine</span>
            ) : (
              <span className="text-emerald-400">Authentic Content</span>
            )}
          </span>
        </div>
        {result.demo_mode && (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono">
            Demo Mode
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left — gauge */}
          <div className="flex flex-col items-center justify-center gap-4">
            <ConfidenceGauge value={displayed} isDeepfake={isDeepfake} isUnknown={isUnknown} />
            <p className="text-xs text-slate-500 font-mono text-center">
              {isDeepfake ? "Probability of AI manipulation" : "Probability of authentic content"}
            </p>
          </div>

          {/* Right — stats */}
          <div className="space-y-4">
            <StatRow label="Verdict" value={result.label} highlight={isDeepfake ? "danger" : isUnknown ? "warn" : "success"} />
            <StatRow label="Confidence" value={`${result.confidence}%`} />
            <StatRow label="Raw Score" value={result.raw_score.toFixed(4)} mono />
            <StatRow label="Frames Analyzed" value={result.frames_analyzed.toString()} />
            <StatRow label="Faces Found" value={result.faces_found.toString()} />
          </div>
        </div>

        {/* Interpretation */}
        <InterpretationBox result={result} />

        {/* File info */}
        {file && (
          <p className="text-xs text-slate-600 font-mono mt-4 truncate">
            File: {file.name}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <ReportDownloader file={file} result={result} />
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer py-2.5 px-4 rounded-xl glass border border-slate-600/30 text-slate-400 hover:text-white text-sm transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ConfidenceGauge({
  value, isDeepfake, isUnknown,
}: { value: number; isDeepfake: boolean; isUnknown: boolean }) {
  const color = isDeepfake ? "#f43f5e" : isUnknown ? "#f59e0b" : "#10b981";
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (circumference * value) / 100;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Track */}
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        {/* Progress */}
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 70 70)"
          style={{
            transition: "stroke-dashoffset 0.05s linear",
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="font-display font-800 text-3xl leading-none"
          style={{ color }}
        >
          {value}%
        </span>
        <span className="text-[10px] font-mono text-slate-500 mt-0.5">confidence</span>
      </div>
    </div>
  );
}

function StatRow({
  label, value, highlight, mono,
}: {
  label: string;
  value: string;
  highlight?: "danger" | "warn" | "success";
  mono?: boolean;
}) {
  const valueColor =
    highlight === "danger"  ? "text-rose-400" :
    highlight === "warn"    ? "text-amber-400" :
    highlight === "success" ? "text-emerald-400" :
    "text-white";

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm font-semibold ${valueColor} ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function InterpretationBox({ result }: { result: DetectionResult }) {
  const isDeepfake = result.label === "DEEPFAKE";
  const isUnknown  = result.label === "UNKNOWN";

  let text = "";
  if (isUnknown) {
    text = result.message ?? "No faces were detected in the file. Please ensure the video or image contains visible faces.";
  } else if (isDeepfake) {
    if (result.confidence > 90) {
      text = "The model is highly confident this content has been AI-manipulated. The face-swapping artifacts are clearly detectable.";
    } else if (result.confidence > 70) {
      text = "Strong indicators of face-swap manipulation detected. Consider cross-referencing with additional verification tools.";
    } else {
      text = "Moderate deepfake indicators detected. The manipulation may be subtle or the model is less certain.";
    }
  } else {
    if (result.confidence > 90) {
      text = "The model is highly confident this is authentic content. No significant face-swap artifacts were found.";
    } else {
      text = "Content appears authentic. Minor uncertainty may stem from compression, low resolution, or partial face visibility.";
    }
  }

  return (
    <div
      className={`mt-5 p-4 rounded-xl text-sm leading-relaxed flex gap-3 ${
        isDeepfake ? "bg-rose-500/8 border border-rose-500/15 text-rose-200" :
        isUnknown  ? "bg-amber-500/8 border border-amber-500/15 text-amber-200" :
                     "bg-emerald-500/8 border border-emerald-500/15 text-emerald-200"
      }`}
    >
      <Info className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
      <span>{text}</span>
    </div>
  );
}
