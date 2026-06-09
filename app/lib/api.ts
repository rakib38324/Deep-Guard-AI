import type { DetectionResult, FileMode } from "../types";

export const API_BASE = `${process.env.NEXT_PUBLIC_API_SERVER_API}` || "http://localhost:8000/api";

export async function analyzeFile(
  file: File,
  mode: FileMode
): Promise<DetectionResult> {
  const form = new FormData();
  form.append("file", file);

  const endpoint = mode === "video" ? "detect/video" : "detect/image";

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<DetectionResult>;
}

export async function checkHealth(): Promise<{
  status: string;
  model_loaded: boolean;
  demo_mode: boolean;
}> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
