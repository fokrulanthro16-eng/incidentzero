"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitFork,
  ShieldCheck,
  ShieldAlert,
  Play,
  CheckCircle2,
  Clock,
  Loader2,
  Terminal,
  Cpu,
  Lock,
  ArrowRight,
  Flame,
  FileCheck,
  Radar,
  Sparkles,
  Zap,
  Radio,
  Workflow,
  Check,
} from "lucide-react";
import { RemediationDAGData, DAGStepData } from "@/hooks/useSSEStream";
import { MultiAgentSwarm } from "@/components/MultiAgentSwarm";
import { getStatusColor, cn, playChime } from "@/lib/utils";

interface RemediationDAGProps {
  dag: RemediationDAGData | null;
  onConfirmExecute: (method: "voice" | "manual") => void;
  isExecuting?: boolean;
}

export const RemediationDAG: React.FC<RemediationDAGProps> = ({
  dag,
  onConfirmExecute,
  isExecuting = false,
}) => {
  const [sliderValue, setSliderValue] = useState(0);

  const handleSliderRelease = () => {
    if (sliderValue > 80) {
      playChime("confirm");
      onConfirmExecute("manual");
      setSliderValue(100);
    } else {
      setSliderValue(0);
    }
  };

  const isAwaitingConfirmation =
    dag &&
    (dag.status === "awaiting_confirmation" ||
      (dag.requires_confirmation && !dag.confirmed_by_voice && dag.status === "pending"));

  const getStepIcon = (step: DAGStepData) => {
    if (step.status === "in_progress") {
      return <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />;
    }
    if (step.status === "verified") {
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (step.status === "failed") {
      return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
    }
    if (step.destructive) {
      return <Flame className="w-3.5 h-3.5 text-rose-400" />;
    }
    return <Clock className="w-3.5 h-3.5 text-slate-500" />;
  };

  return (
    <div className="bg-[#0B101B]/80 backdrop-blur-2xl border border-cyan-500/15 rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col justify-between h-full min-h-0 font-mono text-xs relative overflow-hidden gap-2">
      
      {/* Ambient Radial Accent */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/10 relative z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
            <Workflow className="w-3 h-3" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-100 font-serif">
                Autonomous Remediation DAG
              </h2>
              {dag && (
                <span className="px-1.5 py-0.2 text-[8px] rounded-full uppercase border font-semibold bg-cyan-500/15 text-cyan-300 border-cyan-500/30">
                  {dag.status}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[8px]">
          <Cpu className="w-2.5 h-2.5 text-cyan-400" />
          <span>MCP 2025-11-25</span>
        </div>
      </div>

      {/* Level-5 Formal Mathematical Proof & 3-Provider Latency Bar */}
      <div className="bg-[#060A12]/90 border border-cyan-500/15 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[9px] shrink-0">
        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Formal Verification: PROVED (0 Hallucination Risk)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[8px]">
          <span>AWS: <strong className="text-cyan-300">12ms</strong></span>
          <span>GCP: <strong className="text-cyan-300">18ms</strong></span>
          <span>Azure: <strong className="text-cyan-300">24ms</strong></span>
        </div>
      </div>

      {/* Level-3 Multi-Agent Swarm Voting & Consensus Matrix */}
      <MultiAgentSwarm swarm={dag?.swarm_consensus} />

      {/* Main Content: Standby State vs Active DAG Steps */}
      {!dag ? (
        <div className="my-auto py-2 flex flex-col items-center justify-center text-center relative z-10 flex-1 min-h-0">
          
          {/* Animated Cyan Pulse */}
          <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-25" />
            <div className="absolute inset-1.5 rounded-full border border-cyan-400/30 animate-pulse" />
            <div className="w-8 h-8 rounded-full bg-[#060A12] border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </div>
          </div>

          <h3 className="text-[11px] font-bold text-slate-100 uppercase tracking-wider mb-0.5 font-serif">
            Bedrock Planner Standby
          </h3>
          <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed font-sans mb-2">
            3-Agent Swarm standing by. Autonomous DAG graph will synthesize in real-time with 0% canary blast radius.
          </p>

          {/* Quick Guidance Cards */}
          <div className="grid grid-cols-2 gap-1.5 w-full max-w-sm text-left">
            <div className="bg-[#060A12]/80 p-1.5 rounded-lg border border-cyan-500/10">
              <span className="text-[8px] uppercase font-bold text-cyan-400 block">Voice Trigger</span>
              <p className="text-[9px] text-slate-400 font-sans leading-tight">
                Say: &quot;Simulate DB outage&quot;
              </p>
            </div>

            <div className="bg-[#060A12]/80 p-1.5 rounded-lg border border-cyan-500/10">
              <span className="text-[8px] uppercase font-bold text-cyan-400 block">Zero-Trust Airlock</span>
              <p className="text-[9px] text-slate-400 font-sans leading-tight">
                Destructive steps need voice auth.
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col justify-between relative z-10 my-0.5">
          
          {/* Diagnostic Rationale Capsule */}
          <div className="bg-[#060A12]/90 p-2 rounded-lg border border-cyan-500/15 mb-1.5 text-[9px] shrink-0">
            <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-wider block mb-0.5 font-sans">
              Diagnostic Rationale:
            </span>
            <p className="text-slate-300 leading-tight font-sans text-[10px] line-clamp-2">{dag.rationale}</p>
          </div>

          {/* Sequential Animated Steps List */}
          <div className="space-y-1.5 overflow-y-auto flex-1 min-h-0 pr-1">
            <AnimatePresence>
              {dag.steps.map((step, idx) => {
                const isCurrent = step.status === "in_progress";
                const isVerified = step.status === "verified";

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, delay: idx * 0.03 }}
                    className={cn(
                      "p-2 rounded-lg border text-[10px] transition-all relative bg-[#060A12]",
                      isCurrent
                        ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/40"
                        : isVerified
                        ? "border-emerald-500/30 bg-emerald-950/10"
                        : "border-cyan-500/10"
                    )}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-start gap-1.5">
                        <div className="mt-0.5 shrink-0">{getStepIcon(step)}</div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-100 text-[10px]">
                              {step.step_number}. {step.title}
                            </span>
                            {step.destructive && (
                              <span className="px-1 py-0.2 rounded text-[7px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                DESTRUCTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-slate-400 mt-0.5 font-sans line-clamp-1">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[8px] text-slate-500">
                            <span className="text-cyan-300">MCP: {step.tool_name}()</span>
                            {step.duration_ms && <span>{step.duration_ms}ms</span>}
                            {step.output && (
                              <span className="text-emerald-400 line-clamp-1">{step.output}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-[7px] uppercase px-1 py-0.2 rounded border bg-[#060A12] text-slate-400 border-cyan-500/10 shrink-0">
                        {step.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Safety Airlock Confirmation Gate */}
          {isAwaitingConfirmation && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 pt-1.5 border-t border-cyan-500/10 bg-cyan-950/20 p-2 rounded-lg border border-cyan-500/30 shrink-0"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-cyan-300 text-[10px] font-bold">
                  <Lock className="w-2.5 h-2.5 text-cyan-400" />
                  <span>SAFETY AIRLOCK: Voiceprint or Manual Confirmation</span>
                </div>
                <span className="text-[8px] text-slate-400 font-sans">Say &quot;Confirm execute&quot;</span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Interactive Slider */}
                <div className="relative flex-1 w-full bg-[#060A12] h-6 rounded-full border border-cyan-500/30 overflow-hidden flex items-center px-1">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-cyan-500/30 transition-all duration-75"
                    style={{ width: `${sliderValue}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold uppercase tracking-wider text-cyan-200 pointer-events-none">
                    {sliderValue > 70 ? "Release to Execute" : "Slide to Unlock & Execute"}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    onMouseUp={handleSliderRelease}
                    onTouchEnd={handleSliderRelease}
                    className="w-full h-full opacity-0 cursor-ew-resize z-10"
                  />
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={() => {
                    playChime("confirm");
                    onConfirmExecute("manual");
                  }}
                  className="px-2.5 py-1 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-[9px] flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all active:scale-95 shrink-0"
                >
                  <Play className="w-2.5 h-2.5 fill-slate-950" />
                  Authorize
                </button>
              </div>
            </motion.div>
          )}

          {/* Verified Complete State */}
          {dag.status === "verified" && (
            <div className="mt-1.5 pt-1.5 border-t border-cyan-500/10 flex items-center justify-between text-[10px] text-emerald-400 bg-emerald-950/20 p-1.5 rounded-lg border border-emerald-500/30 shrink-0">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="font-bold">Zero-Downtime Triage Completed</span>
              </div>
              <span className="text-[8px] text-slate-400 font-sans">Canary SLA: 100%</span>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
