"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Radio,
  Cpu,
  Terminal,
  Database,
  Diamond,
  Mic,
  Server,
  Cloud,
} from "lucide-react";
import { formatLatency, formatRPS, playChime } from "@/lib/utils";

interface EditorialHeroProps {
  onEnterWarRoom: () => void;
  onTriggerScenario: (scenarioId: string) => void;
  onActivateVoice: () => void;
  telemetryStats?: {
    totalRps: number;
    avgLatencyMs: number;
    globalErrorRatePct: number;
  };
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  onEnterWarRoom,
  onTriggerScenario,
  onActivateVoice,
  telemetryStats = { totalRps: 2480, avgLatencyMs: 12.4, globalErrorRatePct: 0.0 },
}) => {
  return (
    <div className="h-full w-full flex flex-col justify-between items-center relative overflow-hidden select-none p-4 font-mono">
      
      {/* Background Ambient Sapphire & Cyan Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/30 via-[#05070E] to-[#04060A] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* 1. TOP EDITORIAL BRAND STRIP */}
      <header className="w-full max-w-6xl flex items-center justify-between z-10 shrink-0 pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-600 to-indigo-900 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Diamond className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <span className="font-serif font-bold text-sm sm:text-base tracking-widest text-slate-100 uppercase block">
              IncidentZero
            </span>
            <span className="text-[9px] text-cyan-400 tracking-wider block -mt-0.5">
              Level-5 Sovereign Singularity
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B101B]/80 border border-cyan-500/20 text-[10px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Multi-Cloud Mesh: AWS Bedrock • GCP Vertex • Azure OpenAI</span>
          </div>

          <button
            onClick={onEnterWarRoom}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 flex items-center gap-1.5"
          >
            <span>Launch War Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. CENTER STAGE: 3D FLOATING IPAD PRO & STUDIO PODIUM */}
      <main className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center relative z-10 min-h-0 my-auto">
        
        {/* Massive Editorial Headline */}
        <div className="text-center mb-4 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] mb-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Autonomous SRE • Self-Evolving Cloud Immune System</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 font-serif tracking-tight leading-tight">
            Autonomous SRE for Clouds That Heal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xl mx-auto">
            Zero-human intervention cloud resilience, cross-provider sovereign evacuation, and multi-agent swarm intelligence.
          </p>
        </div>

        {/* 3D Angled iPad Pro Mockup Deck */}
        <div className="w-full max-w-3xl bg-[#0B101B]/90 backdrop-blur-2xl border border-cyan-500/25 rounded-3xl p-5 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_50px_rgba(6,182,212,0.15)] flex flex-col gap-4 relative">
          
          {/* Top Bar of Device */}
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-slate-400 font-mono ml-2">incidentzero.aws/streamable-http</span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-cyan-300">
              <Cloud className="w-3 h-3 text-cyan-400" />
              <span>AWS • GCP • Azure Mesh</span>
            </div>
          </div>

          {/* Quick Metrics Inside Device */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#060A12] p-3 rounded-2xl border border-cyan-500/15 text-center">
              <span className="text-[9px] text-slate-400 font-sans block uppercase">Global Throughput</span>
              <strong className="text-base text-cyan-300 font-mono">{formatRPS(telemetryStats.totalRps)}</strong>
            </div>

            <div className="bg-[#060A12] p-3 rounded-2xl border border-cyan-500/15 text-center">
              <span className="text-[9px] text-slate-400 font-sans block uppercase">P99 SLA Latency</span>
              <strong className="text-base text-emerald-400 font-mono">{telemetryStats.avgLatencyMs.toFixed(1)}ms</strong>
            </div>

            <div className="bg-[#060A12] p-3 rounded-2xl border border-cyan-500/15 text-center">
              <span className="text-[9px] text-slate-400 font-sans block uppercase">Autonomous MTTR</span>
              <strong className="text-base text-indigo-300 font-mono">3.4s (100% Healed)</strong>
            </div>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-cyan-500/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTriggerScenario("SCENARIO_DB_POOL_EXHAUSTED")}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-400/30 text-[10px] font-bold transition-all active:scale-95"
              >
                ⚡ Simulate DB Lock Outage
              </button>
              <button
                onClick={() => onTriggerScenario("SCENARIO_DDOS_INGRESS")}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-200 border border-indigo-400/30 text-[10px] font-bold transition-all active:scale-95"
              >
                🌊 Ingress SYN Flood
              </button>
            </div>

            <button
              onClick={onEnterWarRoom}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Enter Mission Control →
            </button>
          </div>

        </div>

      </main>

      {/* 3. BOTTOM FLOATING FOOTER */}
      <footer className="w-full max-w-4xl flex items-center justify-between z-10 shrink-0 py-2 border-t border-cyan-500/10 text-[10px] text-slate-400 font-sans">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Level-5 Sovereign Singularity • Formal SMT Verification Active</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[9px] text-cyan-300/80">
          <span>FastMCP Spec: 2025-11-25</span>
          <span>eBPF Immune Engine: Armed</span>
        </div>
      </footer>

    </div>
  );
};
