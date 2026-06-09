export type AnalysisStatus = "idle" | "uploading" | "analyzing" | "done" | "error";

export type FileMode = "video" | "image";

export interface DetectionResult {
  label: "REAL" | "DEEPFAKE" | "UNKNOWN";
  confidence: number;   // 0–100
  raw_score: number;    // 0–1
  frames_analyzed: number;
  faces_found: number;
  demo_mode?: boolean;
  message?: string;
}

export interface UploadedFile {
  file: File;
  preview: string | null;
  mode: FileMode;
}
