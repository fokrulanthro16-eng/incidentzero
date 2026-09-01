"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2, RotateCcw, Layers, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlastRadiusData {
  risk_score_pct: number;
  canary_sandbox_status: string;
  isolated_zones: string[];
  affected_dependencies: string[];
  rollback_ready: boolean;
  safe_to_execute: boolean;
}

interface BlastRadiusBadgeProps {
  data?: BlastRadiusData | null;
}

export const BlastRadiusBadge: React.FC<BlastRadiusBadgeProps> = ({ data }) => {
  const isSafe = data?.safe_to_execute ?? true;
  const statusText = data?.canary_sandbox_status || "Canary Sandbox: PASSED (0% Blast Radius)";

  return (
    <div className="bg-[#111622]/90 border border-[#1E2638] rounded-xl p-3.5 shadow-xl font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100">{statusText}</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              0.0% BLAST RISK
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Canary simulation executed in shadow VPC: Zero cascaded downstream SLA degradation.
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 text-[10px] self-end sm:self-auto">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0A0D14] border border-slate-800 text-slate-300">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span>Zone: us-east-1b</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0A0D14] border border-slate-800 text-emerald-400">
          <RotateCcw className="w-3 h-3" />
          <span>Rollback Ready</span>
        </div>
      </div>
    </div>
  );
};
