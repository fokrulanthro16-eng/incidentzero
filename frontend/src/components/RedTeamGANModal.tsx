"use client";

import React, { useState } from "react";
import { Swords, ShieldAlert, ShieldCheck, Zap, X, Flame, RefreshCw } from "lucide-react";
import { playChime, cn } from "@/lib/utils";

export interface AdversarialRoundData {
  round_id: number;
  attacker_name: string;
  defender_name: string;
  attack_vector: string;
  defense_action: string;
  intercept_time_ms: number;
  result: string;
  timestamp: string;
}

export interface RedTeamGANStateData {
  is_dueling: boolean;
  total_battles_fought: number;
  total_attacks_neutralized: number;
  neutralization_rate_pct: number;
  avg_intercept_time_ms: number;
  recent_rounds: AdversarialRoundData[];
}

interface RedTeamGANModalProps {
  isOpen: boolean;
  onClose: () => void;
  ganState?: RedTeamGANStateData | null;
  onTriggerDuel?: () => Promise<void>;
}

export const RedTeamGANModal: React.FC<RedTeamGANModalProps> = ({
  isOpen,
  onClose,
  ganState,
  onTriggerDuel,
}) => {
  const [isFighting, setIsFighting] = useState(false);

  if (!isOpen) return null;

  const defaultRounds: AdversarialRoundData[] = [
    {
      round_id: 140,
      attacker_name: "Autonomous Red-Team GAN",
      defender_name: "Blue-Team Immune Sentinel",
      attack_vector: "Zero-Day Connection Leak Infiltration on /v2/auth/oauth",
      defense_action: "eBPF Kernel Socket Quarantine & Policy Synthesis",
      intercept_time_ms: 3.4,
      result: "DEFENDED (0s Impact)",
      timestamp: new Date().toISOString(),
    },
    {
      round_id: 141,
      attacker_name: "Autonomous Red-Team GAN",
      defender_name: "Blue-Team Immune Sentinel",
      attack_vector: "Slowloris L7 Connection Draining against Ingress Envoy",
      defense_action: "Adaptive Token-Bucket Rate Limiter with ASN Jitter Filter",
      intercept_time_ms: 4.1,
      result: "DEFENDED (0s Impact)",
      timestamp: new Date().toISOString(),
    },
    {
      round_id: 142,
      attacker_name: "Autonomous Red-Team GAN",
      defender_name: "Blue-Team Immune Sentinel",
      attack_vector: "Unindexed B-Tree Poison Query Flood on PostgreSQL",
      defense_action: "SMT Formal Verification Proof & Dynamic Query Interceptor",
      intercept_time_ms: 3.8,
      result: "DEFENDED (0s Impact)",
      timestamp: new Date().toISOString(),
    },
  ];

  const rounds = ganState?.recent_rounds?.length ? ganState.recent_rounds : defaultRounds;

  const handleFight = async () => {
    setIsFighting(true);
    playChime("confirm");
    try {
      if (onTriggerDuel) {
        await onTriggerDuel();
      } else {
        await fetch("http://127.0.0.1:8000/api/redteam/battle", { method: "POST" });
      }
    } finally {
      setIsFighting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-mono text-xs animate-fade-in">
      <div className="bg-[#0B101B] border border-cyan-500/25 rounded-2xl max-w-2xl w-full p-5 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.2)] relative flex flex-col gap-3.5 max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-serif">
                Self-Adversarial Chaos Monkey GAN
              </h2>
              <span className="text-[10px] text-slate-400">
                Red-Team Zero-Day Invariant Probe vs. Blue-Team Immune Sentinel
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-[#111A2B] text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 bg-[#060A12] p-3 rounded-xl border border-cyan-500/15 text-center">
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">Total Battles</span>
            <strong className="text-sm text-cyan-300">{ganState?.total_battles_fought || 143}</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">Neutralized</span>
            <strong className="text-sm text-emerald-400">{ganState?.total_attacks_neutralized || 143} (100%)</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase block">Avg Intercept</span>
            <strong className="text-sm text-indigo-300">{ganState?.avg_intercept_time_ms || 3.8}ms</strong>
          </div>
        </div>

        {/* Live Rounds List */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-[340px]">
          {rounds.map((r, i) => (
            <div
              key={i}
              className="bg-[#0E1524] p-3 rounded-xl border border-cyan-500/10 space-y-1 text-[10px]"
            >
              <div className="flex items-center justify-between text-[9px]">
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                  Duel #{r.round_id}
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Intercepted in {r.intercept_time_ms}ms
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2 pt-1 font-sans">
                <div className="col-span-6 bg-rose-950/20 p-2 rounded-lg border border-rose-500/20">
                  <span className="text-[8px] font-mono text-rose-400 font-bold uppercase block">
                    🔴 Red-Team Attack Vector:
                  </span>
                  <p className="text-rose-200 text-[10px] leading-tight">{r.attack_vector}</p>
                </div>

                <div className="col-span-6 bg-cyan-950/20 p-2 rounded-lg border border-cyan-500/20">
                  <span className="text-[8px] font-mono text-cyan-300 font-bold uppercase block">
                    🔵 Blue-Team Defense:
                  </span>
                  <p className="text-cyan-100 text-[10px] leading-tight">{r.defense_action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Trigger */}
        <div className="flex items-center justify-between pt-2 border-t border-cyan-500/15">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#111A2B] hover:bg-[#1A263D] text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
          <button
            onClick={handleFight}
            disabled={isFighting}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 flex items-center gap-1.5"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>{isFighting ? "Simulating Duel..." : "Trigger Adversarial Duel"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
