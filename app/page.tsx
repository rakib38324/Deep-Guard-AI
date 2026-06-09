"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import UploadZone from "./components/UploadZone";
import AnalysisProgress from "./components/AnalysisProgress";
import ResultCard from "./components/ResultCard";
import StatsSection from "./components/StatsSection";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import { AnalysisStatus, DetectionResult, FileMode } from "./types";
import { analyzeFile, API_BASE, checkHealth } from "./lib/api";


export default function HomePage() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileMode, setFileMode] = useState<FileMode>("video");


  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [frames, setFrames] = useState(0);
  const [faces, setFaces] = useState(0);


  const resultRef = useRef<HTMLDivElement>(null);

  // Check backend health on mount
  useEffect(() => {
    checkHealth()
      .then((h:any) => setDemoMode(h.demo_mode))
      .catch(() => setDemoMode(true));
  }, []);

  const handleFileSelect = useCallback((file: File, mode: FileMode) => {
    setSelectedFile(file);
    setFileMode(mode);
    setResult(null);
    setError(null);
    setStatus("idle");

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  // const handleAnalyze = useCallback(async () => {
  //   if (!selectedFile) return;
  //   setStatus("uploading");
  //   setResult(null);
  //   setError(null);

  //   try {
  //     // Brief delay to show upload state
  //     await new Promise((r) => setTimeout(r, 600));
  //     setStatus("analyzing");

  //     const interval = setInterval(async () => {

  //       try {

  //         const response = await fetch(
  //           `${API_BASE}/progress`
  //         );

  //         const data = await response.json();

  //         setProgress(data.progress);
  //         setMessage(data.message);
  //         setFrames(data.frames_processed);
  //         setFaces(data.faces_found);

  //       } catch { }

  //     }, 1000);

  //     const res = await analyzeFile(selectedFile, fileMode);
      
  //     clearInterval(interval);
      
  //     setResult(res);
  //     setStatus("done");

  //     // Scroll to results
  //     setTimeout(() => {
  //       resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  //     }, 200);
  //   } catch (e: unknown) {
  //     setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
  //     setStatus("error");
  //   }
  // }, [selectedFile, fileMode]);

  const handleAnalyze = useCallback(async () => {
  if (!selectedFile) return;

  setStatus("uploading");
  setResult(null);
  setError(null);

  const interval = setInterval(async () => {
    try {
      const response = await fetch(
        `${API_BASE}/progress`
      );

      const data = await response.json();

      setProgress(data.progress);
      setMessage(data.message);
      setFrames(data.frames_processed);
      setFaces(data.faces_found);

    } catch (err) {
      console.error("Progress polling error:", err);
    }
  }, 1000);

  try {

    await new Promise((r) => setTimeout(r, 600));

    setStatus("analyzing");

    const res = await analyzeFile(
      selectedFile,
      fileMode
    );

    setProgress(100);

    setResult(res);
    setStatus("done");

    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 200);

  } catch (e: unknown) {

    setError(
      e instanceof Error
        ? e.message
        : "Analysis failed. Please try again."
    );

    setStatus("error");

  } finally {

    clearInterval(interval);

  }

}, [selectedFile, fileMode]);


  const handleReset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  return (
    <main className="relative min-h-screen bg-[var(--col-bg)] overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />

      {/* Ambient glows */}
      <div className="fixed top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="fixed top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-indigo-500/4 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar demoMode={demoMode} />

        <HeroSection />

        {/* Upload + Analysis Section */}
        <section id="analyze" className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-indigo-500" />
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
                Upload & Analyze
              </span>
              <span className="flex-1 h-px bg-indigo-500/20" />
            </div>

            <UploadZone
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalyze}
              onReset={handleReset}
              status={status}
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              fileMode={fileMode}
            />

            {/* Progress indicator */}
            {(status === "uploading" || status === "analyzing") && (
              <div className="mt-6">
                <AnalysisProgress
                  status={status}
                  progress={progress}
                  message={message}
                  frames={frames}
                  faces={faces}
                />
              </div>
            )}

            {/* Error */}
            {status === "error" && error && (
              <div className="mt-6 glass rounded-2xl p-4 border border-rose-500/30 bg-rose-500/5">
                <p className="text-rose-400 text-sm font-mono">⚠ {error}</p>
              </div>
            )}

            {/* Result */}
            {status === "done" && result && (
              <div ref={resultRef} className="mt-8">
                <ResultCard result={result} file={selectedFile} />
              </div>
            )}
          </div>
        </section>

        <StatsSection />
        <HowItWorks />
        <Footer />
      </div>
    </main>
  );
}
