import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLatency(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(1)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatRPS(rps: number): string {
  if (rps >= 1000) {
    return `${(rps / 1000).toFixed(1)}k RPS`;
  }
  return `${rps.toFixed(0)} RPS`;
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "healthy":
    case "verified":
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      };
    case "degraded":
    case "awaiting_confirmation":
    case "warning":
      return {
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
        badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      };
    case "critical":
    case "failed":
      return {
        text: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        glow: "shadow-[0_0_20px_rgba(244,63,94,0.4)]",
        badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      };
    case "in_progress":
    case "recovering":
      return {
        text: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/30",
        glow: "shadow-[0_0_15px_rgba(0,240,255,0.3)]",
        badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      };
    case "isolated":
      return {
        text: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        glow: "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
        badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      };
    default:
      return {
        text: "text-slate-400",
        bg: "bg-slate-800/40",
        border: "border-slate-700/50",
        glow: "",
        badge: "bg-slate-800 text-slate-300 border-slate-700",
      };
  }
}

export function getLogLevelColor(level: string) {
  switch (level.toUpperCase()) {
    case "CRITICAL":
    case "ERROR":
      return "text-rose-400 bg-rose-500/10 border-rose-500/30";
    case "WARN":
    case "WARNING":
      return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    case "AGENT":
      return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    default:
      return "text-slate-400 bg-slate-800/40 border-slate-700/30";
  }
}

/**
 * Web Audio Synthesizer for Cyberpunk UI feedback & airlock confirmations
 */
export function playChime(type: "alert" | "confirm" | "success" | "click" = "click") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "confirm" || type === "success") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "alert") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch {
    // Ignore audio context block if user hasn't interacted
  }
}
