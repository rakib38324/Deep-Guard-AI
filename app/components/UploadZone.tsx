"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Film, ImageIcon, X, Play, RefreshCw } from "lucide-react";
import type { AnalysisStatus, FileMode } from "../types";

interface Props {
  onFileSelect: (file: File, mode: FileMode) => void;
  onAnalyze: () => void;
  onReset: () => void;
  status: AnalysisStatus;
  selectedFile: File | null;
  previewUrl: string | null;
  fileMode: FileMode;
}

const VIDEO_EXTS = ["mp4", "mov", "avi", "webm", "mkv"];
const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "bmp"];

function getMode(file: File): FileMode | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (VIDEO_EXTS.includes(ext)) return "video";
  if (IMAGE_EXTS.includes(ext)) return "image";
  return null;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function UploadZone({
  onFileSelect, onAnalyze, onReset,
  status, selectedFile, previewUrl, fileMode,
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [modeError, setModeError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setModeError(null);
      const mode = getMode(file);
      if (!mode) {
        setModeError("Unsupported format. Please upload MP4, MOV, AVI, JPG, or PNG.");
        return;
      }
      onFileSelect(file, mode);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const isProcessing = status === "uploading" || status === "analyzing";

  // ── File selected state ──────────────────────
  if (selectedFile) {
    return (
      <div className="glass-bright rounded-3xl p-6 border border-indigo-500/20">
        <div className="flex items-start gap-4">
          {/* Preview thumbnail */}
          <div className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-slate-900 border border-indigo-500/20">
            {previewUrl && fileMode === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {fileMode === "video" ? (
                  <Film className="w-8 h-8 text-indigo-400" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-indigo-400" />
                )}
              </div>
            )}
            {fileMode === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            )}
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{selectedFile.name}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-slate-400">{formatBytes(selectedFile.size)}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-xs font-mono text-indigo-400 uppercase">{fileMode}</span>
            </div>

            {!isProcessing && status !== "done" && (
              <p className="text-xs text-slate-500 mt-2">
                Ready for analysis. Click <span className="text-indigo-400">Analyze</span> to begin.
              </p>
            )}
            {status === "done" && (
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Analysis complete
              </p>
            )}
          </div>

          {/* Actions */}
          <button
            onClick={onReset}
            disabled={isProcessing}
            className="cursor-pointer text-slate-500 hover:text-white transition-colors disabled:opacity-40"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex gap-3">
          {status !== "done" && (
            <button
              onClick={onAnalyze}
              disabled={isProcessing}
              className="cursor-pointer flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 glow-accent hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {status === "uploading" ? "Uploading…" : "Analyzing…"}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Analyze {fileMode === "video" ? "Video" : "Image"}
                </>
              )}
            </button>
          )}
          <button
            onClick={onReset}
            disabled={isProcessing}
            className="cursor-pointer py-3 px-5 rounded-xl glass border border-slate-600/40 text-slate-400 hover:text-white hover:border-indigo-500/40 text-sm font-medium transition-all disabled:opacity-40"
          >
            {status === "done" ? "Try Another" : "Cancel"}
          </button>
        </div>
      </div>
    );
  }

  // ── Empty / drop state ────────────────────────
  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`w-full rounded-3xl transition-all duration-300 cursor-pointer group ${
          dragOver
            ? "drop-active glass-bright"
            : "glass border-dashed border-2 border-indigo-500/25 hover:border-indigo-400/50 hover:bg-indigo-500/5"
        }`}
      >
        <div className="py-16 px-8 flex flex-col items-center gap-5">
          {/* Icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8 text-indigo-400" />
            </div>
            {/* Scan line on hover */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-white font-semibold text-lg mb-1">
              Drop your file here
            </p>
            <p className="text-slate-400 text-sm">
              or{" "}
              <span className="text-indigo-400 font-medium group-hover:text-cyan-400 transition-colors">
                browse to upload
              </span>
            </p>
          </div>

          {/* Format chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {["MP4", "MOV", "AVI", "WEBM"].map((ext) => (
              <span key={ext} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-xs font-mono text-indigo-300">
                <Film className="w-3 h-3" /> {ext}
              </span>
            ))}
            {["JPG", "PNG", "WEBP"].map((ext) => (
              <span key={ext} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300">
                <ImageIcon className="w-3 h-3" /> {ext}
              </span>
            ))}
          </div>

          <p className="text-slate-600 text-xs font-mono">Max size: 500 MB</p>
        </div>
      </button>

      {modeError && (
        <p className="mt-3 text-rose-400 text-sm text-center font-mono">⚠ {modeError}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*,image/*,.mp4,.mov,.avi,.webm,.mkv,.jpg,.jpeg,.png,.webp,.bmp"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}
