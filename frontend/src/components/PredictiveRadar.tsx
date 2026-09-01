"use client";

import React from "react";
import {
  Radar,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Activity,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PredictiveRadarData {
  risk_level: string;
  failure_horizon_seconds?: number | null;
  failure_horizon_text: string;
  metric_tracked: string;
  current_value: number;
  projected_5m_value: number;
  growth_gradient_per_sec: number;
  preemptive_action_recommended: string;
  trajectory_points: number[];
}

interface PredictiveRadarProps {
  radarData?: PredictiveRadarData | null;
}

export const PredictiveRadar: React.FC<PredictiveRadarProps> = ({ radarData }) => {
  const isCritical = radarData?.risk_level === "CRITICAL_WARNING";
  const points = radarData?.trajectory_points || [45, 46, 47, 48, 49, 50, 52];

  // SVG Sparkline calculation
  const minVal = Math.min(...points, 0);
  const maxVal = Math.max(...points, 100);
  const width = 260;
  const height = 48;

  const polylinePoints = points
    .map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - minVal) / (maxVal - minVal || 1)) * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className={cn(
        "bg-[#111622]/90 border rounded-xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-500 font-mono",
        isCritical
          ? "border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)] bg-amber-950/10"
          : "border-[#1E2638]"
      )}
    >
      {/* Ambient Pulsing Radar Ring */}
      <div
        className={cn(
          "absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-all duration-700",
          isCritical ? "bg-amber-500/20 animate-pulse" : "bg-cyan-500/10"
        )}
      />

      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "p-1.5 rounded-lg border",
              isCritical
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse"
                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
            )}
          >
            <Radar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
              Predictive Anomaly Radar (T+5m)
            </span>
            <span
              className={cn(
                "text-xs font-extrabold",
                isCritical ? "text-amber-400 text-glow-amber" : "text-emerald-400"
              )}
            >
              {radarData?.failure_horizon_text || "Risk Horizon: Nominal (> 30m)"}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "px-2 py-0.5 text-[9px] rounded-full uppercase border font-bold",
            isCritical
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-bounce"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          )}
        >
          {isCritical ? "ELEVATED DRIFT" : "SLO SECURE"}
        </span>
      </div>

      {/* Sparkline Trajectory Visualization */}
      <div className="my-2 bg-[#0A0D14] p-2 rounded-lg border border-slate-800 relative">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
          <span>{radarData?.metric_tracked || "Metric Trajectory"}</span>
          <span className="text-cyan-400 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            +{(radarData?.growth_gradient_per_sec || 0.01).toFixed(2)}/s
          </span>
        </div>

        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Gradient Fill under path */}
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isCritical ? "#F59E0B" : "#00F0FF"} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isCritical ? "#F59E0B" : "#00F0FF"} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Sparkline Line */}
          <polyline
            fill="none"
            stroke={isCritical ? "#F59E0B" : "#00F0FF"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Current Point Dot */}
          {points.length > 0 && (
            <circle
              cx={width}
              cy={height - ((points[points.length - 1] - minVal) / (maxVal - minVal || 1)) * (height - 10) - 5}
              r="4"
              fill={isCritical ? "#F59E0B" : "#00F0FF"}
              className="animate-ping"
            />
          )}
        </svg>

        <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1">
          <span>T-30s</span>
          <span>NOW ({radarData?.current_value?.toFixed(0) || "48"})</span>
          <span className="text-cyan-300 font-bold">
            T+5m PROJ ({radarData?.projected_5m_value?.toFixed(0) || "52"})
          </span>
        </div>
      </div>

      {/* Preemptive Action Micro-copy */}
      <p className="text-[10px] text-slate-400 line-clamp-1">
        <strong className="text-slate-200">Preemptive Action:</strong>{" "}
        {radarData?.preemptive_action_recommended || "Operating within nominal error budget."}
      </p>
    </div>
  );
};
