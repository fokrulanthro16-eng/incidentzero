"use client";

import React from "react";
import {
  AlertTriangle,
  ShieldCheck,
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  ServerCrash,
  Radio,
  Database,
} from "lucide-react";
import { IncidentData } from "@/hooks/useSSEStream";
import { cn, playChime } from "@/lib/utils";

interface IncidentBannerProps {
  incident: IncidentData | null;
  onTriggerScenario: (scenarioId: string) => void;
  onResetBaseline: () => void;
  onAutoTriage: () => void;
}

export const IncidentBanner: React.FC<IncidentBannerProps> = ({
  incident,
  onTriggerScenario,
  onResetBaseline,
  onAutoTriage,
}) => {
  const isOutageActive = incident && incident.status === "active";

  const handleScenarioClick = (id: string) => {
    playChime("alert");
    onTriggerScenario(id);
  };

  return (
    <div
      className={cn(
        "rounded-xl p-4 border transition-all duration-500 relative overflow-hidden backdrop-blur-md",
        isOutageActive
          ? "bg-rose-950/30 border-rose-500/70 shadow-[0_0_30px_rgba(244,63,94,0.25)]"
          : "bg-[#111622]/90 border-[#1E2638]"
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Status & Active Incident Description */}
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={cn(
              "p-2.5 rounded-xl border flex items-center justify-center shrink-0",
              isOutageActive
                ? "bg-rose-500 text-white border-rose-400 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)]"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            )}
          >
            {isOutageActive ? (
              <Flame className="w-6 h-6 animate-bounce" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-2.5 py-0.5 text-xs font-mono font-bold rounded-full uppercase border",
                  isOutageActive
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                )}
              >
                {isOutageActive ? incident?.severity || "SEV-1 ACTIVE" : "CLUSTER HEALTH: 100% NOMINAL"}
              </span>

              {isOutageActive && (
                <span className="text-[11px] font-mono text-slate-400">
                  ID: {incident?.incident_id}
                </span>
              )}
            </div>

            <h1 className="text-sm md:text-base font-bold text-slate-100 mt-1">
              {isOutageActive
                ? incident?.title
                : "IncidentZero Mission Control: Zero-Downtime Autonomous Cloud SRE"}
            </h1>

            {isOutageActive && incident?.root_cause && (
              <p className="text-xs font-mono text-rose-300 mt-0.5 max-w-2xl line-clamp-1">
                Root Cause: {incident.root_cause}
              </p>
            )}
          </div>
        </div>

        {/* Right: Chaos Trigger Controls & Auto-Triage CTA */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chaos Injection Buttons */}
          <div className="flex items-center gap-1.5 bg-[#0A0D14] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => handleScenarioClick("SCENARIO_DB_POOL_EXHAUSTED")}
              className="px-2.5 py-1.5 rounded text-[11px] font-mono bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all active:scale-95 flex items-center gap-1"
              title="Trigger PostgreSQL connection starvation on Node-03"
            >
              <Database className="w-3 h-3 text-rose-400" />
              DB Lock
            </button>

            <button
              onClick={() => handleScenarioClick("SCENARIO_POD_OOM_KILLED")}
              className="px-2.5 py-1.5 rounded text-[11px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all active:scale-95 flex items-center gap-1"
              title="Trigger Kubelet OOM-killer CrashLoopBackOff"
            >
              <ServerCrash className="w-3 h-3 text-amber-400" />
              Pod OOM
            </button>

            <button
              onClick={() => handleScenarioClick("SCENARIO_DDOS_INGRESS")}
              className="px-2.5 py-1.5 rounded text-[11px] font-mono bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all active:scale-95 flex items-center gap-1"
              title="Simulate 14.5k RPS Volumetric L7 DDoS Flood"
            >
              <Radio className="w-3 h-3 text-purple-400" />
              DDoS Flood
            </button>
          </div>

          {/* Reset Baseline */}
          <button
            onClick={() => {
              playChime("click");
              onResetBaseline();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#161D2E] hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all flex items-center gap-1.5"
            title="Restore baseline healthy topology"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          {/* Autonomous Triage CTA */}
          {isOutageActive && (
            <button
              onClick={() => {
                playChime("confirm");
                onAutoTriage();
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all flex items-center gap-1.5 active:scale-95 animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              Auto Triage
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
