"use client";

import React, { useState } from "react";
import { Cloud, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { playChime, cn } from "@/lib/utils";

export interface ProviderStatusData {
  provider: "AWS" | "GCP" | "Azure";
  region: string;
  status: string;
  latency_ms: number;
  cost_per_m_req_usd: number;
  ai_engine: string;
}

export interface SovereignMeshStateData {
  active_provider: "AWS" | "GCP" | "Azure";
  evacuation_status: string;
  providers: ProviderStatusData[];
  last_evacuation_log?: string | null;
  zero_downtime_preserved: boolean;
}

interface SovereignMultiCloudPillProps {
  sovereignState?: SovereignMeshStateData | null;
  onEvacuate?: (source: string, target: string) => Promise<void>;
}

export const SovereignMultiCloudPill: React.FC<SovereignMultiCloudPillProps> = ({
  sovereignState,
  onEvacuate,
}) => {
  const [isEvacuating, setIsEvacuating] = useState(false);
  const active = sovereignState?.active_provider || "AWS";

  const defaultProviders: ProviderStatusData[] = [
    { provider: "AWS", region: "us-east-1", status: active === "AWS" ? "ACTIVE" : "WARM_STANDBY", latency_ms: 12.4, cost_per_m_req_usd: 0.18, ai_engine: "Bedrock (Claude 3.5)" },
    { provider: "GCP", region: "us-central1", status: active === "GCP" ? "ACTIVE" : "WARM_STANDBY", latency_ms: 18.1, cost_per_m_req_usd: 0.16, ai_engine: "Vertex AI (Gemini 1.5)" },
    { provider: "Azure", region: "eastus", status: active === "Azure" ? "ACTIVE" : "COLD_STANDBY", latency_ms: 24.2, cost_per_m_req_usd: 0.22, ai_engine: "OpenAI (GPT-4o)" },
  ];

  const providers = sovereignState?.providers?.length ? sovereignState.providers : defaultProviders;

  const handleEvacuate = async (target: string) => {
    if (target === active || isEvacuating) return;
    setIsEvacuating(true);
    playChime("confirm");
    try {
      if (onEvacuate) {
        await onEvacuate(active, target);
      } else {
        await fetch(`http://127.0.0.1:8000/api/sovereign/evacuate?source_provider=${active}&target_provider=${target}`, {
          method: "POST",
        });
      }
    } finally {
      setIsEvacuating(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#090E17]/90 border border-cyan-500/20 p-1 rounded-xl text-[9px] font-mono shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
      <div className="flex items-center gap-1 px-1.5 text-cyan-300 font-semibold">
        <Cloud className="w-2.5 h-2.5 text-cyan-400" />
        <span className="hidden sm:inline">Sovereign Mesh:</span>
      </div>

      <div className="flex items-center gap-1">
        {providers.map((p) => {
          const isActive = p.provider === active;
          return (
            <button
              key={p.provider}
              onClick={() => handleEvacuate(p.provider)}
              disabled={isActive || isEvacuating}
              className={cn(
                "px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all",
                isActive
                  ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  : "bg-[#0F1626] hover:bg-[#162138] text-slate-400 hover:text-slate-200 border border-cyan-500/10"
              )}
              title={`${p.provider} (${p.ai_engine}) - Latency: ${p.latency_ms}ms`}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                )}
              />
              <span>{p.provider}</span>
              <span className="text-[8px] text-slate-500">{p.latency_ms.toFixed(0)}ms</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
