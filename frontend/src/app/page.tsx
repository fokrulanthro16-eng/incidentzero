"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Radio,
  Cpu,
  Terminal as TerminalIcon,
  Activity,
  Layers,
  Sparkles,
  FileText,
  Clock,
  Wifi,
  WifiOff,
  Server,
  Zap,
  RotateCcw,
  CheckCircle2,
  X,
  Home,
  GitPullRequest,
  History,
  Radar,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  Database,
  ServerCrash,
  Play,
  TrendingUp,
  Diamond,
  Fingerprint,
  Swords,
  Cloud,
} from "lucide-react";
import { useSSEStream, RemediationDAGData } from "@/hooks/useSSEStream";
import { useVoiceControl } from "@/hooks/useVoiceControl";
import { EditorialHero } from "@/components/EditorialHero";
import { TopologyGraph } from "@/components/TopologyGraph";
import { RemediationDAG } from "@/components/RemediationDAG";
import { TerminalLogs } from "@/components/TerminalLogs";
import { GitHotfixModal, GitHotfixPRData } from "@/components/GitHotfixModal";
import { FinOpsTicker } from "@/components/FinOpsTicker";
import { AudioDebriefButton } from "@/components/AudioDebriefButton";
import { ImmuneAntibodiesBadge } from "@/components/ImmuneAntibodiesBadge";
import { VoiceprintAirlockModal } from "@/components/VoiceprintAirlockModal";
import { GlobalMeshFailover } from "@/components/GlobalMeshFailover";
import { SovereignMultiCloudPill } from "@/components/SovereignMultiCloudPill";
import { RedTeamGANModal } from "@/components/RedTeamGANModal";
import { PostmortemModal } from "@/components/PostmortemModal";
import { formatLatency, formatRPS, playChime, cn } from "@/lib/utils";

const API_BASE = "http://127.0.0.1:8000";

export default function MissionControlDashboard() {
  const {
    isConnected,
    telemetry,
    logs,
    activeIncident,
    activeDAG,
    hotfixPR,
    finopsMetrics,
    sovereignState,
    ganState,
    setActiveDAG,
    setHotfixPR,
  } = useSSEStream(API_BASE);

  const [showHotfixModal, setShowHotfixModal] = useState(false);
  const [showVoiceprintModal, setShowVoiceprintModal] = useState(false);
  const [showRedTeamModal, setShowRedTeamModal] = useState(false);
  const [showPostmortem, setShowPostmortem] = useState(false);
  const [postmortemData, setPostmortemData] = useState<Record<string, unknown> | null>(null);

  const {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    spokenResponse,
    audioLevel,
    toggleListening,
    startListening,
    sendVoiceCommand,
    speakAloud,
  } = useVoiceControl({
    apiBaseUrl: API_BASE,
    onHotfixPRReceived: (pr) => {
      setHotfixPR(pr);
      setShowHotfixModal(true);
    },
  });

  // Default view is 'editorial' on page load
  const [viewMode, setViewMode] = useState<"editorial" | "console">("editorial");

  const handleLaunchConsole = () => {
    playChime("click");
    setViewMode("console");
  };

  const handleReturnToEditorial = () => {
    playChime("click");
    setViewMode("editorial");
  };

  // Trigger chaos scenario
  const handleTriggerScenario = async (scenarioId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/chaos/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: scenarioId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dag) setActiveDAG(data.dag);
        if (data.hotfix_pr) setHotfixPR(data.hotfix_pr);
        setViewMode("console");
      }
    } catch (err) {
      console.error("Trigger chaos failed:", err);
    }
  };

  // Reset baseline
  const handleResetBaseline = async () => {
    try {
      await fetch(`${API_BASE}/api/chaos/reset`, { method: "POST" });
      setActiveDAG(null);
      setHotfixPR(null);
    } catch (err) {
      console.error("Reset failed:", err);
    }
  };

  // Confirm DAG Execution with Voiceprint Airlock
  const handleInitiateConfirm = (method: "voice" | "manual") => {
    if (method === "manual") {
      setShowVoiceprintModal(true);
    } else {
      handleConfirmExecute("voice");
    }
  };

  const handleConfirmExecute = async (method: "voice" | "manual") => {
    try {
      const res = await fetch(`${API_BASE}/api/dag/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dag_id: activeDAG?.dag_id || "DAG-DIRECT",
          confirmation_method: method,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dag) setActiveDAG(data.dag);
      }
    } catch (err) {
      console.error("Confirm DAG failed:", err);
    }
  };

  // Merge Git Hotfix PR
  const handleMergeHotfix = async (prNumber: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/git/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pr_number: prNumber }),
      });
      if (res.ok) {
        if (hotfixPR) {
          setHotfixPR({ ...hotfixPR, status: "MERGED" });
        }
      }
    } catch (err) {
      console.error("Merge hotfix error:", err);
    }
  };

  // Open Git Hotfix PR Modal
  const handleOpenGitModal = async () => {
    playChime("click");
    if (!hotfixPR) {
      try {
        const res = await fetch(`${API_BASE}/api/git/hotfix`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setHotfixPR(data.pr);
        }
      } catch (err) {
        console.error("Git hotfix generation failed:", err);
      }
    }
    setShowHotfixModal(true);
  };

  // Multi-cloud evacuation
  const handleSovereignEvacuate = async (source: string, target: string) => {
    try {
      await fetch(`${API_BASE}/api/sovereign/evacuate?source_provider=${source}&target_provider=${target}`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Sovereign evacuation error:", err);
    }
  };

  // Multi-region failover
  const handleGlobalFailover = async (fromReg: string, toReg: string) => {
    try {
      await fetch(`${API_BASE}/api/mesh/failover?from_region=${fromReg}&to_region=${toReg}`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Global failover error:", err);
    }
  };

  // Trigger Red-Team Battle
  const handleTriggerRedTeamDuel = async () => {
    try {
      await fetch(`${API_BASE}/api/redteam/battle`, { method: "POST" });
    } catch (err) {
      console.error("Red-team battle error:", err);
    }
  };

  // Fetch Postmortem Report
  const handleViewPostmortem = async () => {
    playChime("click");
    try {
      const res = await fetch(`${API_BASE}/api/postmortem`);
      if (res.ok) {
        const data = await res.json();
        setPostmortemData(data);
        setShowPostmortem(true);
      }
    } catch (err) {
      console.error("Postmortem fetch error:", err);
    }
  };

  // Node action callbacks
  const handleIsolateNode = async (nodeId: string) => {
    playChime("alert");
    try {
      await fetch(`${API_BASE}/api/mcp/tool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_name: "isolate_compromised_node",
          arguments: { node_id: nodeId },
        }),
      });
    } catch (err) {
      console.error("Isolate node error:", err);
    }
  };

  const handleScaleService = async (serviceName: string, count: number) => {
    playChime("confirm");
    try {
      await fetch(`${API_BASE}/api/mcp/tool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_name: "scale_service_replicas",
          arguments: { service_name: serviceName, replica_count: count },
        }),
      });
    } catch (err) {
      console.error("Scale service error:", err);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden bg-[#05070E] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans relative flex flex-col justify-between p-3 select-none">
      
      {/* 1. DEFAULT VIEW: 3D Angled iPad Pro & Studio Hero */}
      {viewMode === "editorial" ? (
        <EditorialHero
          onEnterWarRoom={handleLaunchConsole}
          onTriggerScenario={handleTriggerScenario}
          onActivateVoice={startListening}
          telemetryStats={{
            totalRps: telemetry?.total_rps || 2480,
            avgLatencyMs: telemetry?.avg_latency_ms || 12.4,
            globalErrorRatePct: telemetry?.global_error_rate_pct || 0.0,
          }}
        />
      ) : (
        /* 2. STRICT 100VH BALANCED 3-TIER WAR ROOM CONSOLE (LEVEL-5 SOVEREIGN SINGULARITY) */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full max-w-[1680px] mx-auto flex flex-col justify-between gap-2.5 overflow-hidden"
        >
          
          {/* A. SLIM TOP COMMAND BAR (~52px) */}
          <header className="h-[52px] bg-[#0B101B]/85 backdrop-blur-2xl border border-cyan-500/15 rounded-2xl px-3.5 flex items-center justify-between gap-2.5 shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            
            {/* Left: Brand Identity + Level-5 Sovereign Badge + Immune Antibodies */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 via-cyan-600 to-indigo-900 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                <Diamond className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-slate-100 uppercase">
                  IncidentZero
                </span>
                <span className="px-1.5 py-0.2 text-[8px] font-mono rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hidden sm:inline-block font-bold">
                  ⚡ Level-5 Sovereign Singularity
                </span>
              </div>

              {/* Level-4 Cloud Antibodies Badge */}
              <ImmuneAntibodiesBadge antibodies={telemetry?.active_antibodies} />
            </div>

            {/* Center: Glowing Cyan Voice Command Capsule */}
            <div className="flex items-center gap-2 bg-[#060A12] border border-cyan-500/20 px-3 py-1 rounded-full shadow-inner">
              <button
                onClick={toggleListening}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition-all transform active:scale-90",
                  isListening
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-pulse"
                    : isSpeaking
                    ? "bg-indigo-300 text-slate-950 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
                    : "bg-[#111A2B] text-cyan-300 hover:text-white"
                )}
                title={isListening ? "Listening... Click to mute" : "Click to speak voice command"}
              >
                {isListening ? (
                  <Mic className="w-2.5 h-2.5" />
                ) : isSpeaking ? (
                  <Volume2 className="w-2.5 h-2.5" />
                ) : (
                  <MicOff className="w-2.5 h-2.5" />
                )}
              </button>

              {/* Dynamic Waveform Pulse */}
              <div className="flex items-center gap-0.5 h-3 w-14">
                {[6, 12, 8, 14, 6, 12, 10, 16].map((baseH, i) => {
                  const h = isListening
                    ? Math.max(2.5, (baseH * (0.4 + audioLevel * 1.5)) % 12)
                    : isSpeaking
                    ? (baseH * 0.7) % 12
                    : 2;
                  return (
                    <motion.div
                      key={i}
                      animate={{ height: `${h}px` }}
                      transition={{ duration: 0.1 }}
                      className={cn(
                        "flex-1 rounded-full",
                        isListening ? "bg-cyan-400" : isSpeaking ? "bg-indigo-300" : "bg-[#1A263D]"
                      )}
                    />
                  );
                })}
              </div>

              <span className="text-[9px] font-mono text-cyan-200/80 hidden md:inline-block">
                {isListening ? "Listening..." : isSpeaking ? "Synthesizing..." : "Voice Ready"}
              </span>
            </div>

            {/* Right: Level-5 Multi-Cloud Pill + Red-Team Battle + FinOps Ticker + Action Group */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              
              {/* Level-5 Multi-Cloud Sovereign Arbitrage Pill */}
              <SovereignMultiCloudPill
                sovereignState={sovereignState}
                onEvacuate={handleSovereignEvacuate}
              />

              {/* Level-5 Red-Team GAN Battle Trigger */}
              <button
                onClick={() => {
                  playChime("click");
                  setShowRedTeamModal(true);
                }}
                className="px-2 py-1 rounded-xl bg-gradient-to-r from-rose-500/20 to-indigo-500/20 hover:from-rose-500/30 hover:to-indigo-500/30 text-cyan-200 border border-cyan-400/30 transition-all flex items-center gap-1 text-[9px] font-bold active:scale-95 shadow-sm"
                title="Open Self-Adversarial Red-Team vs Blue-Team GAN Duel"
              >
                <Swords className="w-2.5 h-2.5 text-rose-400" />
                <span>⚔️ Red-Team GAN</span>
              </button>

              {/* FinOps Ticker */}
              <FinOpsTicker finops={finopsMetrics} />

              {/* Chaos Trigger Chips */}
              <div className="flex items-center gap-1 bg-[#060A12] p-0.5 rounded-xl border border-cyan-500/15">
                <button
                  onClick={() => handleTriggerScenario("SCENARIO_DB_POOL_EXHAUSTED")}
                  className="px-2 py-0.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/20 transition-all active:scale-95 text-[9px] flex items-center gap-1 font-semibold"
                >
                  <Database className="w-2.5 h-2.5 text-cyan-400" />
                  <span>⚡ DB Lock</span>
                </button>

                <button
                  onClick={() => handleTriggerScenario("SCENARIO_POD_OOM_KILLED")}
                  className="px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/20 transition-all active:scale-95 text-[9px] flex items-center gap-1 font-semibold"
                >
                  <ServerCrash className="w-2.5 h-2.5 text-amber-400" />
                  <span>💀 Pod OOM</span>
                </button>

                <button
                  onClick={() => handleTriggerScenario("SCENARIO_DDOS_INGRESS")}
                  className="px-2 py-0.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/20 transition-all active:scale-95 text-[9px] flex items-center gap-1 font-semibold"
                >
                  <Radio className="w-2.5 h-2.5 text-indigo-400" />
                  <span>🌊 DDoS</span>
                </button>
              </div>

              {/* Git PR */}
              <button
                onClick={handleOpenGitModal}
                className="px-2 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 border border-cyan-400/30 transition-all flex items-center gap-1 text-[9px] font-semibold"
              >
                <GitPullRequest className="w-2.5 h-2.5 text-cyan-300" />
                <span>📋 PR {hotfixPR ? `#${hotfixPR.pr_number}` : ""}</span>
              </button>

              {/* Audio Debrief */}
              <AudioDebriefButton
                apiBaseUrl={API_BASE}
                onSpeakText={speakAloud}
              />

              {/* Postmortem */}
              <button
                onClick={handleViewPostmortem}
                className="px-2 py-1 rounded-xl bg-[#0E1524] hover:bg-[#162138] text-slate-200 border border-cyan-500/20 transition-all flex items-center gap-1 text-[9px]"
              >
                <FileText className="w-2.5 h-2.5 text-cyan-300" />
                <span>📄 Postmortem</span>
              </button>

              {/* Reset */}
              <button
                onClick={() => {
                  playChime("click");
                  handleResetBaseline();
                }}
                className="p-1 rounded-xl bg-[#0E1524] hover:bg-[#162138] text-slate-200 border border-cyan-500/20 transition-all"
                title="Reset to nominal baseline"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>

              {/* Switch to 3D Hero */}
              <button
                onClick={handleReturnToEditorial}
                className="px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1 text-[9px]"
              >
                <Home className="w-2.5 h-2.5 text-cyan-300" />
                <span>3D Studio</span>
              </button>
            </div>
          </header>

          {/* B. CENTER 2-COLUMN GRID (flex-1 min-h-0) */}
          <main className="flex-1 min-h-0 grid grid-cols-12 gap-3 overflow-hidden">
            
            {/* Left Panel (7 Columns - flex flex-col justify-between gap-2.5 h-full min-h-0) */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-between gap-2.5 h-full min-h-0">
              <TopologyGraph
                nodes={telemetry?.nodes}
                onIsolateNode={handleIsolateNode}
                onScaleService={handleScaleService}
              />
            </div>

            {/* Right Panel (5 Columns - h-full min-h-0 flex flex-col) */}
            <div className="col-span-12 lg:col-span-5 h-full min-h-0 flex flex-col">
              <RemediationDAG
                dag={activeDAG}
                onConfirmExecute={handleInitiateConfirm}
              />
            </div>

          </main>

          {/* C. BOTTOM COMPACT TELEMETRY STREAM (~135px) */}
          <footer className="w-full shrink-0 relative">
            <TerminalLogs logs={logs} />

            {/* Floating Bottom Capsule Toast */}
            {activeDAG && activeDAG.status === "awaiting_confirmation" && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0B101B]/95 border border-cyan-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-2xl animate-fade-in text-[10px] font-mono z-30">
                <div className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center animate-pulse">
                  <Zap className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                </div>
                <span className="text-slate-100 font-semibold">
                  Multi-Agent Consensus Armed: 3/3 Agreed
                </span>
                <button
                  onClick={() => handleInitiateConfirm("manual")}
                  className="px-2.5 py-0.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold uppercase text-[9px] transition-all transform active:scale-95 shadow-sm"
                >
                  [ Execute DAG ]
                </button>
              </div>
            )}
          </footer>

        </motion.div>
      )}

      {/* Level-5 Red-Team vs Blue-Team GAN Modal */}
      <RedTeamGANModal
        isOpen={showRedTeamModal}
        onClose={() => setShowRedTeamModal(false)}
        ganState={ganState}
        onTriggerDuel={handleTriggerRedTeamDuel}
      />

      {/* Level-4 Zero-Trust Voiceprint Airlock Modal */}
      <VoiceprintAirlockModal
        isOpen={showVoiceprintModal}
        onClose={() => setShowVoiceprintModal(false)}
        onConfirm={() => handleConfirmExecute("manual")}
        dagTitle={activeDAG?.title || "PostgreSQL Primary Connection Quarantine & Failover"}
      />

      {/* Level-2 Git Hotfix PR Modal */}
      <GitHotfixModal
        pr={hotfixPR}
        isOpen={showHotfixModal}
        onClose={() => setShowHotfixModal(false)}
        onMerge={handleMergeHotfix}
      />

      {/* Postmortem Executive Report Modal */}
      <PostmortemModal
        isOpen={showPostmortem}
        onClose={() => setShowPostmortem(false)}
        data={postmortemData}
      />
    </div>
  );
}
