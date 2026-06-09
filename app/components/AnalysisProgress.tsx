"use client";

import {
  Upload,
  Cpu,
  ScanSearch,
  Brain,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { AnalysisStatus } from "../types";

interface AnalysisProgressProps {
  status: AnalysisStatus;
  progress: number;
  message: string;
  frames: number;
  faces: number;
}

const STEPS = [
  {
    label: "Upload",
    description: "Receiving media file",
    icon: Upload,
    threshold: 10,
  },
  {
    label: "Frame Extraction",
    description: "Extracting visual information",
    icon: Cpu,
    threshold: 30,
  },
  {
    label: "Face Detection",
    description: "Locating facial regions",
    icon: ScanSearch,
    threshold: 60,
  },
  {
    label: "AI Analysis",
    description: "Running deepfake detection model",
    icon: Brain,
    threshold: 90,
  },
];

export default function AnalysisProgress({
  status,
  progress,
  message,
  frames,
  faces,
}: AnalysisProgressProps) {
  const activeStep = STEPS.findIndex(
    (step) => progress < step.threshold
  );

  const currentStep =
    activeStep === -1
      ? STEPS[STEPS.length - 1]
      : STEPS[Math.max(activeStep, 0)];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-slate-900/60 backdrop-blur-xl shadow-[0_0_80px_rgba(99,102,241,0.15)]">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10" />

      {/* Floating Blur */}
      <div className="absolute top-0 right-0 h-48 w-48 bg-cyan-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 h-48 w-48 bg-indigo-500/10 blur-3xl rounded-full" />

      <div className="relative p-6 md:p-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/20">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>

            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" />
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-semibold text-white">
              AI Deepfake Analysis
            </h2>

            <p className="text-sm text-slate-400">
              Processing your media using hybrid CNN architecture
            </p>
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">

          <div className="flex items-center gap-4">

            <div className="relative">

              <div className="h-4 w-4 rounded-full bg-indigo-400" />

              <div className="absolute inset-0 rounded-full bg-indigo-400 animate-ping" />

            </div>

            <div>

              <p className="text-xs uppercase tracking-widest text-indigo-400">
                Current Step
              </p>

              <h3 className="text-lg font-semibold text-white">
                {currentStep.label}
              </h3>

              <p className="text-sm text-slate-400">
                {message || "Analyzing..."}
              </p>

            </div>

          </div>

        </div>

        {/* Workflow Steps */}
        <div className="space-y-4 mb-8">

          {STEPS.map((step, index) => {
            const Icon = step.icon;

            const completed = progress >= step.threshold;

            const active =
              !completed &&
              (activeStep === index ||
                (activeStep === -1 &&
                  index === STEPS.length - 1));

            return (
              <div
                key={step.label}
                className={`
                  relative overflow-hidden rounded-2xl border p-4
                  transition-all duration-500
                  ${
                    completed
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : active
                      ? "border-indigo-500/40 bg-indigo-500/10 scale-[1.01]"
                      : "border-slate-700/40 bg-slate-800/30"
                  }
                `}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-cyan-500/10 to-indigo-500/5 animate-pulse" />
                )}

                <div className="relative flex items-center gap-4">

                  <div
                    className={`
                      h-12 w-12 rounded-xl flex items-center justify-center
                      ${
                        completed
                          ? "bg-emerald-500/20"
                          : active
                          ? "bg-indigo-500/20"
                          : "bg-slate-700/30"
                      }
                    `}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <Icon
                        className={`
                          h-6 w-6
                          ${
                            active
                              ? "text-indigo-400 animate-spin"
                              : "text-slate-500"
                          }
                        `}
                      />
                    )}
                  </div>

                  <div className="flex-1">

                    <h4
                      className={`
                        font-medium
                        ${
                          completed
                            ? "text-emerald-300"
                            : active
                            ? "text-indigo-300"
                            : "text-slate-500"
                        }
                      `}
                    >
                      {step.label}
                    </h4>

                    <p className="text-xs text-slate-400 mt-1">
                      {step.description}
                    </p>

                  </div>

                  {active && (
                    <div className="flex gap-1">

                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />

                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">

          <div className="flex justify-between mb-3">

            <span className="text-sm text-slate-400">
              Analysis Progress
            </span>

            <span className="font-semibold text-indigo-300">
              {progress}%
            </span>

          </div>

          <div className="relative h-4 overflow-hidden rounded-full bg-slate-800">

            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-indigo-300 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

            <div
              className="absolute top-0 bottom-0 w-24 bg-white/20 blur-md"
              style={{
                left: `calc(${progress}% - 48px)`,
              }}
            />
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-2xl border border-slate-700/40 bg-slate-800/40 p-5">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Frames Processed
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {frames}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-700/40 bg-slate-800/40 p-5">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Faces Detected
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {faces}
            </p>

          </div>

        </div>

        {/* Status Footer */}
        <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">

          <p className="text-sm text-indigo-300">
            {status === "uploading"
              ? "Uploading file..."
              : message}
          </p>

        </div>

      </div>
    </div>
  );
}