"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Database, Shield, Coins, CheckCircle2, Sparkles, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AgentVoteData {
  agent_id: string;
  agent_name: string;
  role: string;
  vote: string;
  confidence_pct: number;
  reasoning: string;
  proposed_action: string;
}

export interface SwarmConsensusData {
  consensus_id: string;
  incident_id: string;
  consensus_action: string;
  overall_confidence_pct: number;
  unanimous: boolean;
  participating_agents: number;
  votes: AgentVoteData[];
  debate_transcript: string[];
  converged_at: string;
}

interface MultiAgentSwarmProps {
  swarm?: SwarmConsensusData | null;
}

export const MultiAgentSwarm: React.FC<MultiAgentSwarmProps> = ({ swarm }) => {
  const isConverged = Boolean(swarm && swarm.votes && swarm.votes.length > 0);

  const defaultAgents = [
    {
      name: "DB Doctor",
      role: "Database Reliability",
      icon: <Database className="w-3 h-3 text-cyan-400" />,
      color: "border-cyan-500/30 text-cyan-300 bg-cyan-950/30",
      confidence: "99.6%",
      vote: "ISOLATE",
    },
    {
      name: "Net Sentinel",
      role: "Edge Mesh Security",
      icon: <Shield className="w-3 h-3 text-indigo-400" />,
      color: "border-indigo-500/30 text-indigo-300 bg-indigo-950/30",
      confidence: "99.1%",
      vote: "REROUTE",
    },
    {
      name: "FinOps",
      role: "Cloud Economics",
      icon: <Coins className="w-3 h-3 text-amber-400" />,
      color: "border-amber-500/30 text-amber-300 bg-amber-950/30",
      confidence: "99.5%",
      vote: "FAILOVER",
    },
  ];

  return (
    <div className="bg-[#090E17]/90 border border-cyan-500/15 rounded-xl p-2.5 font-mono text-xs flex flex-col gap-2 relative overflow-hidden shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-100 font-serif">
            Bedrock Multi-Agent Swarm Consensus
          </span>
        </div>

        <span className="px-1.5 py-0.2 rounded-full text-[8px] font-bold uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          {isConverged ? `${swarm?.overall_confidence_pct || 99.4}% CONVERGED` : "3-AGENT STANDBY"}
        </span>
      </div>

      {/* 3 Glowing Agent Badges */}
      <div className="grid grid-cols-3 gap-1.5">
        {defaultAgents.map((agent, i) => {
          const liveVote = swarm?.votes?.find((v) =>
            v.agent_name.toLowerCase().includes(agent.name.toLowerCase().split(" ")[0])
          );

          return (
            <div
              key={i}
              className={cn(
                "p-1.5 rounded-lg border flex flex-col justify-between text-[9px] transition-all",
                agent.color
              )}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1">
                  {agent.icon}
                  <span className="font-bold">{agent.name}</span>
                </div>
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              </div>
              <span className="text-[8px] text-slate-400 font-sans line-clamp-1">
                {liveVote ? liveVote.proposed_action : agent.role}
              </span>
              <span className="text-[8px] font-mono text-slate-300 font-semibold mt-0.5">
                Conf: {liveVote ? `${liveVote.confidence_pct}%` : agent.confidence}
              </span>
            </div>
          );
        })}
      </div>

      {/* Consensus Bar */}
      <div className="flex items-center justify-between text-[9px] bg-[#060A12] px-2 py-1 rounded border border-cyan-500/10">
        <span className="text-slate-400">Consensus Action:</span>
        <span className="text-cyan-300 font-bold truncate ml-1">
          {swarm?.consensus_action || "UNANIMOUS_CANARY_FAILOVER (3/3 Agreed)"}
        </span>
      </div>
    </div>
  );
};
