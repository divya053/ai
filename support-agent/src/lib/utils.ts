import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDecisionColor(decision: string): "success" | "destructive" | "warning" | "default" | "secondary" {
  const d = decision.toLowerCase();
  if (d.includes("approve")) return "success";
  if (d.includes("deny")) return "destructive";
  if (d.includes("escalat") || d.includes("more_info")) return "warning";
  if (d.includes("partial")) return "secondary";
  return "default";
}

export function getConfidenceColor(confidence?: string | null): string {
  if (!confidence) return "bg-slate-100 text-slate-700";
  const c = confidence.toLowerCase();
  if (c === "high") return "bg-green-100 text-green-700 border-green-200";
  if (c === "medium") return "bg-orange-100 text-orange-700 border-orange-200";
  if (c === "low") return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}
