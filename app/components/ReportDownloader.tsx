"use client";

import { Download } from "lucide-react";
import React from "react";

// 1. Define strict TypeScript types matching your state objects
interface AnalysisResult {
    label: string;
    confidence: number | string;
    raw_score: number | string;
    frames_analyzed: number;
    faces_found: number;
    demo_mode?: boolean;
}

interface TargetFile {
    name: string;
}

interface ReportDownloaderProps {
    file: TargetFile | null | undefined;
    result: AnalysisResult;
}

// 2. Define types for html2pdf configuration object
interface Html2PdfOptions {
  margin: [number, number, number, number];
  filename: string;
  // narrow the image.type to the allowed values from html2pdf types
  image: { type: "jpeg" | "png" | "webp" | undefined; quality: number };
  html2canvas: { scale: number; useCORS: boolean; logging: boolean };
  jsPDF: { unit: string; format: string; orientation: "portrait" | "landscape" | undefined };
}

export const ReportDownloader: React.FC<ReportDownloaderProps> = ({ file, result }) => {

    const downloadReport = async (): Promise<void> => {
        // Dynamically import to ensure server-side rendering (SSR) compatibility in Next.js
        const html2pdf = (await import("html2pdf.js")).default;

        const reportData = {
            filename: file?.name ?? "unknown",
            analyzed_at: new Date().toLocaleString(),
            result: result.label,
            confidence: typeof result.confidence === "number" ? `${result.confidence}%` : result.confidence,
            raw_score: result.raw_score,
            frames_analyzed: result.frames_analyzed,
            faces_found: result.faces_found,
            model: "Hybrid EfficientNetB0 + Xception",
            demo_mode: result.demo_mode ?? false,
        };

        // Construct the structured HTML blueprint as a string
        const elementHtml: string = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; background: #ffffff;">
        <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0; letter-spacing: -0.5px;">
            DEEP<span style="color: #2563eb;">GUARD</span>
          </h1>
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin: 5px 0 0 0; font-weight: 600;">
            Analysis & Verification Report
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 13px; color: #475569; font-weight: 500; display: block; margin-bottom: 4px;">Classification Verdict</span>
            <strong style="font-size: 20px; color: #1e40af; text-transform: uppercase;">${reportData.result}</strong>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 13px; color: #475569; font-weight: 500; display: block; margin-bottom: 4px;">Confidence Metric</span>
            <strong style="font-size: 20px; color: #0f172a;">${reportData.confidence}</strong>
          </div>
        </div>

        <h3 style="font-size: 14px; text-transform: uppercase; color: #0f172a; border-left: 4px solid #2563eb; padding-left: 10px; margin-bottom: 15px;">File Metadata & Execution</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 6px; color: #475569; font-weight: 500; width: 40%;">Target Filename</td>
            <td style="padding: 12px 6px; color: #0f172a; word-break: break-all;">${reportData.filename}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 6px; color: #475569; font-weight: 500;">Analysis Timestamp</td>
            <td style="padding: 12px 6px; color: #0f172a;">${reportData.analyzed_at}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 6px; color: #475569; font-weight: 500;">Core ML Model</td>
            <td style="padding: 12px 6px; color: #0f172a;">${reportData.model}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 6px; color: #475569; font-weight: 500;">Demo Environment Mode</td>
            <td style="padding: 12px 6px; color: #0f172a;">${reportData.demo_mode ? "Yes (Evaluation Run)" : "No (Production Verification)"}</td>
          </tr>
        </table>

        <h3 style="font-size: 14px; text-transform: uppercase; color: #0f172a; border-left: 4px solid #2563eb; padding-left: 10px; margin-bottom: 15px;">Pipeline Metrics</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #edf2f7; background-color: #fdfdfd;">
            <td style="padding: 12px 6px; color: #475569;">Raw Scoring Matrix Output</td>
            <td style="padding: 12px 6px; color: #0f172a; font-weight: 600; text-align: right;">${reportData.raw_score}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 6px; color: #475569;">Total Video Frames Analyzed</td>
            <td style="padding: 12px 6px; color: #0f172a; font-weight: 600; text-align: right;">${reportData.frames_analyzed} frames</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7; background-color: #fdfdfd;">
            <td style="padding: 12px 6px; color: #475569;">Tracked Faces Isolated</td>
            <td style="padding: 12px 6px; color: #0f172a; font-weight: 600; text-align: right;">${reportData.faces_found}</td>
          </tr>
        </table>

        <div style="margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          <p style="font-size: 11px; color: #94a3b8; margin: 0;">
            This document is an automated analysis snapshot securely produced by the DeepGuard Classification Engine.
          </p>
        </div>
      </div>
    `;

        // Configure layout rules for PDF document output
        const workerOptions: Html2PdfOptions = {
            margin: [10, 10, 10, 10],
            filename: `deepguard-report-${Date.now()}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        // Execute generation pipeline
        html2pdf().from(elementHtml).set(workerOptions).save();
    };

    return (
        <button
            onClick={downloadReport}
            className="cursor-pointer flex-1 py-2.5 px-4 rounded-xl glass border border-indigo-500/25 hover:border-indigo-400/50 text-slate-300 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
            <Download className="w-4 h-4 text-indigo-400" />
            Export Report
        </button>
    );
};